"use client";

import { useCallback, useMemo, useState } from "react";
import {
  AdminPageContainer,
  AdminMetricCard,
  AdminStatusBadge,
  AdminButton,
} from "@/components/admin";
import ManagementTabs from "@/components/admin/documents/ManagementTabs";
import InsightsPanel from "@/components/admin/documents/InsightsPanel";
import {
  ArticleFormDrawer,
  ArticlePreviewDrawer,
  type ArticleFormState,
} from "@/components/admin/documents/ArticleHubDrawers";
import CategoryFormModal, {
  type CategoryFormState,
} from "@/components/admin/documents/CategoryFormModal";
import HubToast from "@/components/admin/documents/HubToast";
import {
  documentStats,
  documentsList,
  contentCategories,
  onboardingSteps,
  missingInfoRequests,
  documentFilterCategories,
  documentFilterStatuses,
  documentSortOptions,
} from "@/data/adminMockData";
import type {
  AdminDocument,
  ContentCategory,
  OnboardingStep,
  MissingInfoRequest,
  ManagementTabId,
  DocumentStatus,
} from "@/data/adminMockData";
import type { AdminBadgeColor } from "@/components/admin/AdminStatusBadge/AdminStatusBadge";
import {
  Plus,
  FolderPlus,
  Search,
  LayoutGrid,
  List,
  Pencil,
  Trash2,
  Eye,
  FileText,
  Send,
  RotateCcw,
  Check,
  ListOrdered,
  AlertCircle,
} from "lucide-react";
import styles from "./page.module.css";

type ViewMode = "list" | "grid";
type DrawerMode = "create" | "edit" | "preview" | null;

const categoryColorMap: Record<string, AdminBadgeColor> = {
  HR: "blue",
  Policies: "green",
  Tools: "orange",
  Growth: "purple",
  Benefits: "blue",
  Culture: "yellow",
  Onboarding: "blue",
};

function statusColor(status: DocumentStatus): AdminBadgeColor {
  if (status === "Published") return "green";
  if (status === "Draft") return "orange";
  return "gray";
}

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<ManagementTabId>("articles");
  const [articles, setArticles] = useState<AdminDocument[]>(documentsList);
  const [categories, setCategories] = useState<ContentCategory[]>(contentCategories);
  const [onboarding, setOnboarding] = useState<OnboardingStep[]>(onboardingSteps);
  const [missingRequests, setMissingRequests] =
    useState<MissingInfoRequest[]>(missingInfoRequests);

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(documentFilterCategories[0]);
  const [statusFilter, setStatusFilter] = useState(documentFilterStatuses[0]);
  const [sortBy, setSortBy] = useState(documentSortOptions[0]);

  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedDoc, setSelectedDoc] = useState<AdminDocument | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 2800);
  }, []);

  const filteredArticles = useMemo(() => {
    let list = articles.filter((d) => d.status !== "Archived");
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) || d.author.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "All categories") {
      list = list.filter((d) => d.category === categoryFilter);
    }
    if (statusFilter !== "All statuses") {
      list = list.filter((d) => d.status === statusFilter);
    }
    if (sortBy === "Title A–Z") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "Most viewed") list = [...list].sort((a, b) => b.views - a.views);
    return list;
  }, [articles, searchQuery, categoryFilter, statusFilter, sortBy]);

  const draftDocs = useMemo(() => articles.filter((d) => d.status === "Draft"), [articles]);
  const archivedDocs = useMemo(() => articles.filter((d) => d.status === "Archived"), [articles]);

  const openCreateArticle = () => {
    setSelectedDoc(null);
    setDrawerMode("create");
  };

  const openEditArticle = (doc: AdminDocument) => {
    setSelectedDoc(doc);
    setDrawerMode("edit");
  };

  const openPreview = (doc: AdminDocument) => {
    setSelectedDoc(doc);
    setDrawerMode("preview");
  };

  const closeDrawer = () => {
    setDrawerMode(null);
    setSelectedDoc(null);
  };

  const upsertArticle = (form: ArticleFormState, status: DocumentStatus) => {
    const catColor = categoryColorMap[form.category] ?? "blue";
    if (selectedDoc && drawerMode === "edit") {
      setArticles((prev) =>
        prev.map((d) =>
          d.id === selectedDoc.id
            ? {
                ...d,
                title: form.title || d.title,
                slug: form.slug || d.slug,
                category: form.category,
                categoryColor: catColor,
                status,
                statusColor: statusColor(status),
                summary: form.summary,
                content: form.content,
                author: form.author,
                updatedAt: "Just now",
                linkedOnboardingStep: form.linkedOnboarding ? "Linked step" : undefined,
              }
            : d
        )
      );
      showToast(status === "Archived" ? "Article archived" : "Changes saved");
    } else {
      const newDoc: AdminDocument = {
        id: `doc-${Date.now()}`,
        title: form.title || "Untitled article",
        slug: form.slug || "untitled",
        category: form.category,
        categoryColor: catColor,
        status,
        statusColor: statusColor(status),
        updatedAt: "Just now",
        views: 0,
        author: form.author || "You",
        summary: form.summary,
        content: form.content,
        feedbackCount: 0,
        linkedOnboardingStep: form.linkedOnboarding ? "New onboarding link" : undefined,
      };
      setArticles((prev) => [newDoc, ...prev]);
      showToast(status === "Published" ? "Article published" : "Draft saved");
    }
    closeDrawer();
  };

  const handleCreateCategory = (form: CategoryFormState) => {
    const newCat: ContentCategory = {
      id: `cat-${Date.now()}`,
      name: form.name || "New category",
      slug: form.slug || "new",
      description: form.description,
      articleCount: 0,
      color: form.color,
      accentHex: form.accentHex,
      status: form.visibility,
    };
    setCategories((prev) => [...prev, newCat]);
    setCategoryModalOpen(false);
    showToast("Category created");
  };

  const publishDoc = (doc: AdminDocument) => {
    setArticles((prev) =>
      prev.map((d) =>
        d.id === doc.id
          ? { ...d, status: "Published", statusColor: "green", updatedAt: "Just now" }
          : d
      )
    );
    showToast(`"${doc.title}" published`);
  };

  const archiveDoc = (doc: AdminDocument) => {
    setArticles((prev) =>
      prev.map((d) =>
        d.id === doc.id
          ? { ...d, status: "Archived", statusColor: "gray", updatedAt: "Just now" }
          : d
      )
    );
    showToast(`"${doc.title}" archived`);
    closeDrawer();
  };

  const restoreDoc = (doc: AdminDocument) => {
    setArticles((prev) =>
      prev.map((d) =>
        d.id === doc.id
          ? { ...d, status: "Draft", statusColor: "orange", updatedAt: "Just now" }
          : d
      )
    );
    showToast(`"${doc.title}" restored to drafts`);
  };

  const deleteDoc = (doc: AdminDocument) => {
    setArticles((prev) => prev.filter((d) => d.id !== doc.id));
    showToast(`"${doc.title}" removed`);
  };

  const panelTitle = {
    articles: "Content library",
    categories: "Category management",
    onboarding: "Onboarding steps",
    missing: "Missing information requests",
    drafts: "Draft articles",
    archived: "Archived content",
  }[activeTab];

  const panelCount = {
    articles: `${filteredArticles.length} articles`,
    categories: `${categories.length} categories`,
    onboarding: `${onboarding.length} steps`,
    missing: `${missingRequests.length} requests`,
    drafts: `${draftDocs.length} drafts`,
    archived: `${archivedDocs.length} archived`,
  }[activeTab];

  const showArticleToolbar = activeTab === "articles" || activeTab === "drafts";

  return (
    <AdminPageContainer
      className={styles.documentsPage}
      title="Documents & Content"
      subtitle="Manage articles, categories, onboarding, and internal knowledge"
      actions={
        <div className={styles.headerActions}>
          <AdminButton variant="secondary" icon={FolderPlus} onClick={() => setCategoryModalOpen(true)}>
            New Category
          </AdminButton>
          <AdminButton variant="primary" icon={Plus} onClick={openCreateArticle}>
            New Article
          </AdminButton>
        </div>
      }
    >
      <div className={styles.pageStack}>
        <section className={styles.metricsGrid}>
          {documentStats.map((metric) => (
            <AdminMetricCard
              key={metric.id}
              icon={metric.icon}
              value={metric.value}
              label={metric.label}
              trend={metric.trend}
              iconTone={metric.iconTone}
            />
          ))}
        </section>

        <ManagementTabs active={activeTab} onChange={setActiveTab} />

        {showArticleToolbar ? (
          <section className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <Search className={styles.searchIcon} aria-hidden />
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search articles, authors, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search documents"
              />
            </div>
            <div className={styles.toolbarFilters}>
              <FilterSelect
                label="Category"
                value={categoryFilter}
                options={documentFilterCategories}
                onChange={setCategoryFilter}
              />
              {activeTab === "articles" ? (
                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  options={documentFilterStatuses}
                  onChange={setStatusFilter}
                />
              ) : null}
              <FilterSelect
                label="Sort"
                value={sortBy}
                options={documentSortOptions}
                onChange={setSortBy}
              />
            </div>
            <div className={styles.viewToggle} role="group" aria-label="View mode">
              <button
                type="button"
                className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewBtnActive : ""}`}
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
              >
                <LayoutGrid size={16} aria-hidden />
              </button>
              <button
                type="button"
                className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewBtnActive : ""}`}
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === "list"}
              >
                <List size={16} aria-hidden />
              </button>
            </div>
          </section>
        ) : null}

        <section className={styles.mainGrid}>
          <div className={styles.contentPanel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelHeaderLeft}>
                <h2 className={styles.panelTitle}>{panelTitle}</h2>
                <span className={styles.panelMeta}>{panelCount}</span>
              </div>
              {activeTab === "onboarding" ? (
                <AdminButton
                  variant="secondary"
                  size="sm"
                  icon={Plus}
                  onClick={() => showToast("Onboarding step form coming soon")}
                >
                  New Onboarding Step
                </AdminButton>
              ) : null}
            </div>

            {activeTab === "articles" && (
              <ArticlesList
                docs={filteredArticles}
                viewMode={viewMode}
                variant="default"
                onEdit={openEditArticle}
                onPreview={openPreview}
                onDelete={deleteDoc}
              />
            )}
            {activeTab === "drafts" && (
              <ArticlesList
                docs={draftDocs}
                viewMode={viewMode}
                variant="draft"
                onEdit={openEditArticle}
                onPreview={openPreview}
                onPublish={publishDoc}
                onDelete={deleteDoc}
              />
            )}
            {activeTab === "archived" && (
              <ArticlesList
                docs={archivedDocs}
                viewMode={viewMode}
                variant="archived"
                onEdit={openEditArticle}
                onPreview={openPreview}
                onRestore={restoreDoc}
                onDelete={deleteDoc}
              />
            )}
            {activeTab === "categories" && (
              <CategoriesList categories={categories} onAction={() => showToast("Category action saved locally")} />
            )}
            {activeTab === "onboarding" && (
              <OnboardingList steps={onboarding} onAction={() => showToast("Onboarding step updated")} />
            )}
            {activeTab === "missing" && (
              <MissingRequestsList
                requests={missingRequests}
                onCreateArticle={openCreateArticle}
                onMarkReviewed={(id) => {
                  setMissingRequests((prev) =>
                    prev.map((r) => (r.id === id ? { ...r, status: "Reviewed" as const } : r))
                  );
                  showToast("Marked as reviewed");
                }}
                onResolve={(id) => {
                  setMissingRequests((prev) =>
                    prev.map((r) => (r.id === id ? { ...r, status: "Resolved" as const } : r))
                  );
                  showToast("Request resolved");
                }}
              />
            )}
          </div>

          <InsightsPanel />
        </section>
      </div>

      <ArticleFormDrawer
        open={drawerMode === "create" || drawerMode === "edit"}
        mode={drawerMode === "edit" ? "edit" : "create"}
        initial={selectedDoc}
        onClose={closeDrawer}
        onSaveDraft={(form) => upsertArticle(form, "Draft")}
        onPublish={(form) =>
          upsertArticle(form, drawerMode === "edit" ? form.status : "Published")
        }
        onArchive={(form) => {
          if (selectedDoc) archiveDoc(selectedDoc);
          else upsertArticle(form, "Archived");
        }}
      />

      <ArticlePreviewDrawer
        open={drawerMode === "preview"}
        doc={selectedDoc}
        onClose={closeDrawer}
        onEdit={() => selectedDoc && openEditArticle(selectedDoc)}
        onArchive={() => selectedDoc && archiveDoc(selectedDoc)}
      />

      <CategoryFormModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleCreateCategory}
      />

      <HubToast message={toast.message} visible={toast.visible} />
    </AdminPageContainer>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className={styles.filterSelect}>
      <span className={styles.filterLabel}>{label}</span>
      <select
        className={styles.filterDropdown}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

type ArticlesListProps = {
  docs: AdminDocument[];
  viewMode: ViewMode;
  variant: "default" | "draft" | "archived";
  onEdit: (doc: AdminDocument) => void;
  onPreview: (doc: AdminDocument) => void;
  onDelete?: (doc: AdminDocument) => void;
  onPublish?: (doc: AdminDocument) => void;
  onRestore?: (doc: AdminDocument) => void;
};

function ArticlesList({
  docs,
  viewMode,
  variant,
  onEdit,
  onPreview,
  onDelete,
  onPublish,
  onRestore,
}: ArticlesListProps) {
  if (docs.length === 0) {
    return <p className={styles.emptyState}>No content in this section yet.</p>;
  }
  if (viewMode === "grid") {
    return (
      <ul className={styles.docGrid}>
        {docs.map((doc) => (
          <li key={doc.id} className={styles.docGridCard}>
            <DocGridTop doc={doc} />
            <h3 className={styles.docGridTitle}>{doc.title}</h3>
            <p className={styles.docGridMeta}>
              {doc.author} · {doc.updatedAt} · {doc.views} views
            </p>
            <RowActions
              doc={doc}
              variant={variant}
              onEdit={onEdit}
              onPreview={onPreview}
              onDelete={onDelete}
              onPublish={onPublish}
              onRestore={onRestore}
            />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className={styles.table}>
      <div className={styles.tableHead}>
        <span>Title</span>
        <span>Category</span>
        <span>Status</span>
        <span>Updated</span>
        <span>Views</span>
        <span>Author</span>
        <span>Actions</span>
      </div>
      <ul className={styles.tableBody}>
        {docs.map((doc) => (
          <li key={doc.id} className={styles.tableRow}>
            <div className={styles.cellTitle}>
              <FileText className={styles.rowIcon} aria-hidden />
              <span className={styles.rowTitle}>{doc.title}</span>
            </div>
            <div>
              <AdminStatusBadge color={doc.categoryColor}>{doc.category}</AdminStatusBadge>
            </div>
            <div>
              <AdminStatusBadge color={doc.statusColor}>{doc.status}</AdminStatusBadge>
            </div>
            <span className={styles.cellMuted}>{doc.updatedAt}</span>
            <span className={styles.cellViews}>{doc.views}</span>
            <span className={styles.cellMuted}>{doc.author}</span>
            <RowActions
              doc={doc}
              variant={variant}
              onEdit={onEdit}
              onPreview={onPreview}
              onDelete={onDelete}
              onPublish={onPublish}
              onRestore={onRestore}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DocGridTop({ doc }: { doc: AdminDocument }) {
  return (
    <div className={styles.docGridTop}>
      <FileText className={styles.rowIcon} aria-hidden />
      <div className={styles.docGridBadges}>
        <AdminStatusBadge color={doc.categoryColor}>{doc.category}</AdminStatusBadge>
        <AdminStatusBadge color={doc.statusColor}>{doc.status}</AdminStatusBadge>
      </div>
    </div>
  );
}

function RowActions({
  doc,
  variant,
  onEdit,
  onPreview,
  onDelete,
  onPublish,
  onRestore,
}: {
  doc: AdminDocument;
  variant: "default" | "draft" | "archived";
  onEdit: (d: AdminDocument) => void;
  onPreview: (d: AdminDocument) => void;
  onDelete?: (d: AdminDocument) => void;
  onPublish?: (d: AdminDocument) => void;
  onRestore?: (d: AdminDocument) => void;
}) {
  return (
    <div className={styles.rowActions}>
      {variant === "draft" ? (
        <>
          <button type="button" className={styles.actionBtn} onClick={() => onEdit(doc)}>
            <Pencil size={14} />
            <span>Continue editing</span>
          </button>
          {onPublish ? (
            <button type="button" className={styles.actionBtn} onClick={() => onPublish(doc)}>
              <Send size={14} />
              <span>Publish</span>
            </button>
          ) : null}
        </>
      ) : variant === "archived" ? (
        <>
          {onRestore ? (
            <button type="button" className={styles.actionBtn} onClick={() => onRestore(doc)}>
              <RotateCcw size={14} />
              <span>Restore</span>
            </button>
          ) : null}
          <button type="button" className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => onDelete?.(doc)}>
            <Trash2 size={14} />
            <span>Delete permanently</span>
          </button>
        </>
      ) : (
        <>
          <button type="button" className={styles.actionBtn} onClick={() => onEdit(doc)}>
            <Pencil size={14} />
            <span>Edit</span>
          </button>
          <button type="button" className={styles.actionBtnIcon} onClick={() => onPreview(doc)} aria-label="Preview">
            <Eye size={14} />
          </button>
          <button
            type="button"
            className={`${styles.actionBtnIcon} ${styles.actionBtnDanger}`}
            onClick={() => onDelete?.(doc)}
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </button>
        </>
      )}
    </div>
  );
}

function CategoriesList({
  categories,
  onAction,
}: {
  categories: ContentCategory[];
  onAction: () => void;
}) {
  return (
    <div className={styles.hubTable}>
      <HubTableHead
        cols={["Name", "Slug", "Description", "Articles", "Accent", "Status", "Actions"]}
        gridClass={styles.hubRowCategories}
      />
      <ul className={styles.tableBody}>
        {categories.map((cat) => (
          <li key={cat.id} className={`${styles.tableRow} ${styles.hubRowCategories}`}>
            <div className={styles.cellTitle}>
              <span className={styles.colorDot} style={{ backgroundColor: cat.accentHex }} />
              <span className={styles.rowTitle}>{cat.name}</span>
            </div>
            <span className={styles.cellMuted}>{cat.slug}</span>
            <span className={styles.cellDesc}>{cat.description}</span>
            <span className={styles.cellViews}>{cat.articleCount}</span>
            <AdminStatusBadge color={cat.color}>{cat.name}</AdminStatusBadge>
            <AdminStatusBadge color={cat.status === "Active" ? "green" : "gray"}>
              {cat.status}
            </AdminStatusBadge>
            <div className={styles.rowActions}>
              <button type="button" className={styles.actionBtn} onClick={onAction}>
                <Pencil size={14} />
                <span>Edit</span>
              </button>
              <button type="button" className={styles.actionBtn} onClick={onAction}>
                <Eye size={14} />
                <span>View articles</span>
              </button>
              <button type="button" className={`${styles.actionBtnIcon} ${styles.actionBtnDanger}`} onClick={onAction} aria-label="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OnboardingList({
  steps,
  onAction,
}: {
  steps: OnboardingStep[];
  onAction: () => void;
}) {
  return (
    <div className={styles.hubTable}>
      <HubTableHead
        cols={["Step", "Order", "Status", "Linked article", "Updated", "Actions"]}
        gridClass={styles.hubRowOnboarding}
      />
      <ul className={styles.tableBody}>
        {steps.map((step) => (
          <li key={step.id} className={`${styles.tableRow} ${styles.hubRowOnboarding}`}>
            <CellTitle icon={ListOrdered} title={step.title} />
            <span className={styles.cellViews}>#{step.order}</span>
            <AdminStatusBadge color={step.status === "Active" ? "green" : "gray"}>
              {step.status}
            </AdminStatusBadge>
            <span className={styles.cellMuted}>{step.linkedArticle}</span>
            <span className={styles.cellMuted}>{step.updatedAt}</span>
            <div className={styles.rowActions}>
              <button type="button" className={styles.actionBtn} onClick={onAction}>
                <Pencil size={14} />
                <span>Edit</span>
              </button>
              <button type="button" className={styles.actionBtnIcon} onClick={onAction} aria-label="Preview">
                <Eye size={14} />
              </button>
              <button type="button" className={styles.actionBtn} onClick={onAction}>
                Disable
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MissingRequestsList({
  requests,
  onCreateArticle,
  onMarkReviewed,
  onResolve,
}: {
  requests: MissingInfoRequest[];
  onCreateArticle: () => void;
  onMarkReviewed: (id: string) => void;
  onResolve: (id: string) => void;
}) {
  const statusColor = (s: MissingInfoRequest["status"]): AdminBadgeColor => {
    if (s === "Open") return "orange";
    if (s === "Reviewed") return "yellow";
    return "green";
  };

  return (
    <div className={styles.hubTable}>
      <HubTableHead
        cols={["Title", "Type", "Status", "Requests", "Last requested", "Linked", "Actions"]}
        gridClass={styles.hubRowMissing}
      />
      <ul className={styles.tableBody}>
        {requests.map((req) => (
          <li key={req.id} className={`${styles.tableRow} ${styles.hubRowMissing}`}>
            <CellTitle icon={AlertCircle} title={req.title} />
            <span className={styles.cellMuted}>{req.type}</span>
            <AdminStatusBadge color={statusColor(req.status)}>{req.status}</AdminStatusBadge>
            <span className={styles.cellViews}>{req.requestCount}</span>
            <span className={styles.cellMuted}>{req.lastRequested}</span>
            <span className={styles.cellMuted}>{req.linkedArticle ?? "—"}</span>
            <div className={styles.rowActions}>
              <button type="button" className={styles.actionBtn} onClick={onCreateArticle}>
                <Plus size={14} />
                <span>Create Article</span>
              </button>
              {req.status === "Open" ? (
                <button type="button" className={styles.actionBtn} onClick={() => onMarkReviewed(req.id)}>
                  <Check size={14} />
                  <span>Mark Reviewed</span>
                </button>
              ) : null}
              {req.status !== "Resolved" ? (
                <button type="button" className={styles.actionBtn} onClick={() => onResolve(req.id)}>
                  Resolve
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HubTableHead({ cols, gridClass }: { cols: string[]; gridClass: string }) {
  return (
    <div className={`${styles.tableHead} ${styles.hubTableHead} ${gridClass}`}>
      {cols.map((c) => (
        <span key={c}>{c}</span>
      ))}
    </div>
  );
}

function CellTitle({ icon: Icon, title }: { icon: typeof FileText; title: string }) {
  return (
    <div className={styles.cellTitle}>
      <Icon className={styles.rowIcon} aria-hidden />
      <span className={styles.rowTitle}>{title}</span>
    </div>
  );
}
