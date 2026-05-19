"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  onboardingSteps,
  missingInfoRequests,
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
  fetchAdminArticles,
  createArticle,
  updateArticle,
  deleteArticle as deleteArticleApi,
  buildCategoryFilterOptions,
  resolveCategoryFilterParam,
  documentStatusToApiStatus,
  type ArticleCategoryOption,
  type ArticleWritePayload,
  type AdminArticlesQuery,
} from "@/lib/mappers/articles";
import {
  fetchContentCategoriesWithCounts,
  createCategory,
  updateCategory,
  deleteCategory as deleteCategoryApi,
  toArticleCategoryOptions,
} from "@/lib/mappers/categories";
import { ApiError } from "@/lib/api";
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
  RefreshCw,
} from "lucide-react";
import styles from "./page.module.css";

type ViewMode = "list" | "grid";
type DrawerMode = "create" | "edit" | "preview" | null;
type ArticlesLoadState = "loading" | "error" | "ready";
type CategoriesLoadState = "loading" | "error" | "ready";

function isArticleTab(tab: ManagementTabId): boolean {
  return tab === "articles" || tab === "drafts" || tab === "archived";
}

function buildArticlesQuery(
  tab: ManagementTabId,
  categoryFilter: string,
  statusFilter: string,
  searchQuery: string,
  articleCategories: ArticleCategoryOption[],
): AdminArticlesQuery {
  const query: AdminArticlesQuery = {};

  const search = searchQuery.trim();
  if (search) query.search = search;

  const categoryParam = resolveCategoryFilterParam(categoryFilter, articleCategories);
  if (categoryParam) query.category = categoryParam;

  if (tab === "drafts") {
    query.status = "DRAFT";
  } else if (tab === "archived") {
    query.status = "ARCHIVED";
  } else if (tab === "articles" && statusFilter !== "All statuses") {
    query.status = documentStatusToApiStatus(statusFilter as DocumentStatus);
  }

  return query;
}

function formToPayload(form: ArticleFormState, status: DocumentStatus): ArticleWritePayload {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    summary: form.summary.trim(),
    content: form.content.trim(),
    categoryId: form.categoryId,
    status: documentStatusToApiStatus(status),
  };
}

function sortArticles(list: AdminDocument[], sortBy: string): AdminDocument[] {
  const sorted = [...list];
  if (sortBy === "Title A–Z") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "Most viewed") {
    sorted.sort((a, b) => b.views - a.views);
  } else if (sortBy === "Newest first") {
    sorted.sort((a, b) => b.id.localeCompare(a.id));
  }
  return sorted;
}

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<ManagementTabId>("articles");
  const [articles, setArticles] = useState<AdminDocument[]>([]);
  const [articleCategories, setArticleCategories] = useState<ArticleCategoryOption[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [categoriesLoadState, setCategoriesLoadState] = useState<CategoriesLoadState>("loading");
  const [categoriesError, setCategoriesError] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState<"create" | "edit">("create");
  const [editingCategory, setEditingCategory] = useState<ContentCategory | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingStep[]>(onboardingSteps);
  const [missingRequests, setMissingRequests] =
    useState<MissingInfoRequest[]>(missingInfoRequests);

  const [articlesLoadState, setArticlesLoadState] = useState<ArticlesLoadState>("loading");
  const [articlesError, setArticlesError] = useState("");
  const [savingArticle, setSavingArticle] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [statusFilter, setStatusFilter] = useState(documentFilterStatuses[0]);
  const [sortBy, setSortBy] = useState(documentSortOptions[0]);

  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedDoc, setSelectedDoc] = useState<AdminDocument | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });

  const categoryFilterOptions = useMemo(
    () => buildCategoryFilterOptions(articleCategories),
    [articleCategories],
  );

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 2800);
  }, []);

  const loadArticles = useCallback(async () => {
    if (!isArticleTab(activeTab)) return;

    setArticlesLoadState("loading");
    setArticlesError("");

    try {
      const query = buildArticlesQuery(
        activeTab,
        categoryFilter,
        statusFilter,
        searchQuery,
        articleCategories,
      );
      const data = await fetchAdminArticles(query);
      setArticles(data);
      setArticlesLoadState("ready");
    } catch (err) {
      setArticles([]);
      setArticlesLoadState("error");
      setArticlesError(
        err instanceof ApiError
          ? err.message
          : "Could not load articles. Please try again.",
      );
    }
  }, [activeTab, categoryFilter, statusFilter, searchQuery, articleCategories]);

  const loadCategories = useCallback(async () => {
    try {
      const list = await fetchContentCategoriesWithCounts();
      setCategories(list);
      setArticleCategories(toArticleCategoryOptions(list));
      setCategoryFilter((prev) =>
        prev === "All categories" || list.some((c) => c.name === prev)
          ? prev
          : "All categories",
      );
      setCategoriesLoadState("ready");
      setCategoriesError("");
    } catch (err) {
      setCategories([]);
      setArticleCategories([]);
      setCategoriesLoadState("error");
      setCategoriesError(
        err instanceof ApiError
          ? err.message
          : "Could not load categories. Please try again.",
      );
    }
  }, []);

  const retryLoadCategories = useCallback(() => {
    setCategoriesLoadState("loading");
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialCategories() {
      try {
        const list = await fetchContentCategoriesWithCounts();
        if (cancelled) return;
        setCategories(list);
        setArticleCategories(toArticleCategoryOptions(list));
        setCategoryFilter((prev) =>
          prev === "All categories" || list.some((c) => c.name === prev)
            ? prev
            : "All categories",
        );
        setCategoriesLoadState("ready");
        setCategoriesError("");
      } catch (err) {
        if (cancelled) return;
        setCategories([]);
        setArticleCategories([]);
        setCategoriesLoadState("error");
        setCategoriesError(
          err instanceof ApiError
            ? err.message
            : "Could not load categories. Please try again.",
        );
      }
    }

    void loadInitialCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (activeTab !== "categories") return;

    let cancelled = false;

    async function refreshCategoriesTab() {
      try {
        const list = await fetchContentCategoriesWithCounts();
        if (cancelled) return;
        setCategories(list);
        setArticleCategories(toArticleCategoryOptions(list));
        setCategoriesLoadState("ready");
        setCategoriesError("");
      } catch (err) {
        if (cancelled) return;
        setCategoriesLoadState("error");
        setCategoriesError(
          err instanceof ApiError
            ? err.message
            : "Could not load categories. Please try again.",
        );
      }
    }

    void refreshCategoriesTab();

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  useEffect(() => {
    if (!isArticleTab(activeTab)) return undefined;

    const delay = searchQuery.trim() ? 300 : 0;
    const timer = window.setTimeout(() => {
      void loadArticles();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [activeTab, loadArticles, searchQuery]);

  const filteredArticles = useMemo(() => {
    let list = articles;
    if (activeTab === "articles") {
      list = list.filter((d) => d.status !== "Archived");
      if (statusFilter !== "All statuses") {
        list = list.filter((d) => d.status === statusFilter);
      }
    }
    return sortArticles(list, sortBy);
  }, [articles, activeTab, statusFilter, sortBy]);

  const draftDocs = useMemo(
    () => sortArticles(articles.filter((d) => d.status === "Draft"), sortBy),
    [articles, sortBy],
  );

  const archivedDocs = useMemo(
    () => sortArticles(articles.filter((d) => d.status === "Archived"), sortBy),
    [articles, sortBy],
  );

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

  const runArticleMutation = async (
    action: () => Promise<void>,
    successMessage: string,
  ) => {
    setSavingArticle(true);
    try {
      await action();
      await loadArticles();
      showToast(successMessage);
      closeDrawer();
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSavingArticle(false);
    }
  };

  const upsertArticle = async (form: ArticleFormState, status: DocumentStatus) => {
    const payload = formToPayload(form, status);

    if (selectedDoc && drawerMode === "edit") {
      await runArticleMutation(
        async () => {
          await updateArticle(selectedDoc.id, payload);
        },
        status === "Archived" ? "Article archived" : "Changes saved",
      );
      return;
    }

    await runArticleMutation(
      async () => {
        await createArticle(payload);
      },
      status === "Published" ? "Article published" : "Draft saved",
    );
  };

  const applyCategoryUiOverrides = (
    category: ContentCategory,
    form: CategoryFormState,
    articleCount?: number,
  ): ContentCategory => ({
    ...category,
    articleCount: articleCount ?? category.articleCount,
    description: form.description,
    color: form.color,
    accentHex: form.accentHex,
    status: form.visibility,
  });

  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setCategoryModalMode("create");
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category: ContentCategory) => {
    setEditingCategory(category);
    setCategoryModalMode("edit");
    setCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmitCategory = async (form: CategoryFormState) => {
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
    };

    setSavingCategory(true);
    try {
      if (categoryModalMode === "edit" && editingCategory) {
        const updated = await updateCategory(editingCategory.id, payload);
        const withUi = applyCategoryUiOverrides(
          { ...updated, articleCount: editingCategory.articleCount },
          form,
        );
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? withUi : c)),
        );
        showToast("Category updated");
      } else {
        const created = await createCategory(payload);
        const withUi = applyCategoryUiOverrides(created, form, 0);
        setCategories((prev) => [...prev, withUi]);
        showToast("Category created");
      }

      await loadCategories();
      closeCategoryModal();
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Could not save category. Please try again.",
      );
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (category: ContentCategory) => {
    if (
      !window.confirm(
        `Delete "${category.name}"? This cannot be undone. Categories with articles cannot be deleted.`,
      )
    ) {
      return;
    }

    setSavingCategory(true);
    try {
      await deleteCategoryApi(category.id);
      await loadCategories();
      showToast(`"${category.name}" deleted`);
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Could not delete category. Please try again.",
      );
    } finally {
      setSavingCategory(false);
    }
  };

  const handleViewCategoryArticles = (category: ContentCategory) => {
    setActiveTab("articles");
    setCategoryFilter(category.name);
  };

  const publishDoc = async (doc: AdminDocument) => {
    setSavingArticle(true);
    try {
      await updateArticle(doc.id, { status: "PUBLISHED" });
      await loadArticles();
      showToast(`"${doc.title}" published`);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not publish article.");
    } finally {
      setSavingArticle(false);
    }
  };

  const archiveDoc = async (doc: AdminDocument) => {
    setSavingArticle(true);
    try {
      await updateArticle(doc.id, { status: "ARCHIVED" });
      await loadArticles();
      showToast(`"${doc.title}" archived`);
      closeDrawer();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not archive article.");
    } finally {
      setSavingArticle(false);
    }
  };

  const restoreDoc = async (doc: AdminDocument) => {
    setSavingArticle(true);
    try {
      await updateArticle(doc.id, { status: "DRAFT" });
      await loadArticles();
      showToast(`"${doc.title}" restored to drafts`);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not restore article.");
    } finally {
      setSavingArticle(false);
    }
  };

  const deleteDoc = async (doc: AdminDocument) => {
    setSavingArticle(true);
    try {
      await deleteArticleApi(doc.id);
      await loadArticles();
      showToast(`"${doc.title}" removed`);
      if (selectedDoc?.id === doc.id) closeDrawer();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not delete article.");
    } finally {
      setSavingArticle(false);
    }
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

  const articleListProps = {
    loading: articlesLoadState === "loading",
    error: articlesLoadState === "error" ? articlesError : "",
    onRetry: loadArticles,
  };

  return (
    <AdminPageContainer
      className={styles.documentsPage}
      title="Documents & Content"
      subtitle="Manage articles, categories, onboarding, and internal knowledge"
      actions={
        <div className={styles.headerActions}>
          <AdminButton variant="secondary" icon={FolderPlus} onClick={openCreateCategoryModal}>
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
                options={categoryFilterOptions}
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
                onDelete={(doc) => void deleteDoc(doc)}
                {...articleListProps}
              />
            )}
            {activeTab === "drafts" && (
              <ArticlesList
                docs={draftDocs}
                viewMode={viewMode}
                variant="draft"
                onEdit={openEditArticle}
                onPreview={openPreview}
                onPublish={(doc) => void publishDoc(doc)}
                onDelete={(doc) => void deleteDoc(doc)}
                {...articleListProps}
              />
            )}
            {activeTab === "archived" && (
              <ArticlesList
                docs={archivedDocs}
                viewMode={viewMode}
                variant="archived"
                onEdit={openEditArticle}
                onPreview={openPreview}
                onRestore={(doc) => void restoreDoc(doc)}
                onDelete={(doc) => void deleteDoc(doc)}
                {...articleListProps}
              />
            )}
            {activeTab === "categories" && (
              <CategoriesList
                categories={categories}
                loading={categoriesLoadState === "loading"}
                error={categoriesLoadState === "error" ? categoriesError : ""}
                onRetry={retryLoadCategories}
                onEdit={openEditCategoryModal}
                onViewArticles={handleViewCategoryArticles}
                onDelete={(cat) => void handleDeleteCategory(cat)}
              />
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
        categories={articleCategories}
        saving={savingArticle}
        onClose={closeDrawer}
        onSaveDraft={(form) => upsertArticle(form, "Draft")}
        onPublish={(form) =>
          upsertArticle(form, drawerMode === "edit" ? form.status : "Published")
        }
        onArchive={(form) => {
          if (selectedDoc) void archiveDoc(selectedDoc);
          else void upsertArticle(form, "Archived");
        }}
      />

      <ArticlePreviewDrawer
        open={drawerMode === "preview"}
        doc={selectedDoc}
        onClose={closeDrawer}
        onEdit={() => selectedDoc && openEditArticle(selectedDoc)}
        onArchive={() => selectedDoc && void archiveDoc(selectedDoc)}
      />

      <CategoryFormModal
        open={categoryModalOpen}
        mode={categoryModalMode}
        initial={editingCategory}
        saving={savingCategory}
        onClose={closeCategoryModal}
        onSubmit={handleSubmitCategory}
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
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
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
  loading = false,
  error = "",
  onRetry,
  onEdit,
  onPreview,
  onDelete,
  onPublish,
  onRestore,
}: ArticlesListProps) {
  if (loading) {
    return <p className={styles.stateMessage}>Loading articles…</p>;
  }

  if (error) {
    return (
      <div className={styles.stateBlock}>
        <p className={styles.stateError}>{error}</p>
        {onRetry ? (
          <AdminButton variant="primary" icon={RefreshCw} onClick={() => void onRetry()}>
            Retry
          </AdminButton>
        ) : null}
      </div>
    );
  }

  if (docs.length === 0) {
    const emptyMessage =
      variant === "draft"
        ? "No draft articles yet. Create one with New Article."
        : variant === "archived"
          ? "No archived articles."
          : "No articles match your filters.";
    return <p className={styles.emptyState}>{emptyMessage}</p>;
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
  loading = false,
  error = "",
  onRetry,
  onEdit,
  onViewArticles,
  onDelete,
}: {
  categories: ContentCategory[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onEdit: (category: ContentCategory) => void;
  onViewArticles: (category: ContentCategory) => void;
  onDelete: (category: ContentCategory) => void;
}) {
  if (loading) {
    return <p className={styles.stateMessage}>Loading categories…</p>;
  }

  if (error) {
    return (
      <div className={styles.stateBlock}>
        <p className={styles.stateError}>{error}</p>
        {onRetry ? (
          <AdminButton variant="primary" icon={RefreshCw} onClick={() => void onRetry()}>
            Retry
          </AdminButton>
        ) : null}
      </div>
    );
  }

  if (categories.length === 0) {
    return <p className={styles.emptyState}>No categories yet. Create one with New Category.</p>;
  }

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
            <span className={styles.cellDesc}>{cat.description || "—"}</span>
            <span className={styles.cellViews}>{cat.articleCount}</span>
            <AdminStatusBadge color={cat.color}>{cat.name}</AdminStatusBadge>
            <AdminStatusBadge color={cat.status === "Active" ? "green" : "gray"}>
              {cat.status}
            </AdminStatusBadge>
            <div className={styles.rowActions}>
              <button type="button" className={styles.actionBtn} onClick={() => onEdit(cat)}>
                <Pencil size={14} />
                <span>Edit</span>
              </button>
              <button type="button" className={styles.actionBtn} onClick={() => onViewArticles(cat)}>
                <Eye size={14} />
                <span>View articles</span>
              </button>
              <button
                type="button"
                className={`${styles.actionBtnIcon} ${styles.actionBtnDanger}`}
                onClick={() => onDelete(cat)}
                aria-label="Delete"
              >
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
