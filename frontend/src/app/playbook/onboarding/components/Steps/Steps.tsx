import React from "react";
import styles from "./Steps.module.css";
import { Circle, CheckCircle, ArrowRight } from "lucide-react";
import type { OnboardingStep } from "@/types/onboarding";

type StepsProps = {
  steps: OnboardingStep[];
  currentStep: number;
  isStepCompleted: (stepIndex: number) => boolean;
  onStepClick: (stepIndex: number) => void;
};

export default function Steps({
  steps,
  currentStep,
  isStepCompleted,
  onStepClick,
}: StepsProps) {
  return (
    <section className={styles.steps}>
      {steps.map((step, index) => (
        <React.Fragment key={step.slug}>
          <button
            className={`${styles.step} ${index === currentStep ? styles.active : ""} ${isStepCompleted(index) ? styles.completed : ""}`}
            onClick={() => onStepClick(index)}
            disabled={index > currentStep && !isStepCompleted(currentStep)}
          >
            <div className={styles.indicator}>
              {isStepCompleted(index) ? (
                <CheckCircle className={styles.icon} />
              ) : (
                <Circle className={styles.icon} />
              )}
              <span className={styles.label}>Step {step.id}</span>
            </div>
          </button>
          {index < steps.length - 1 && <ArrowRight className={styles.icon} />}
        </React.Fragment>
      ))}
    </section>
  );
}
