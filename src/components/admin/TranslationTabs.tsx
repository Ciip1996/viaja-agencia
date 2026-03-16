"use client";

import { cn } from "@/lib/utils/cn";

interface TranslationTabsProps {
  activeTab: "es" | "en";
  onTabChange: (tab: "es" | "en") => void;
  children: React.ReactNode;
}

const TABS = [
  { value: "es" as const, label: "Español", flag: "🇲🇽" },
  { value: "en" as const, label: "English (opcional)", flag: "🇺🇸" },
];

export default function TranslationTabs({
  activeTab,
  onTabChange,
  children,
}: TranslationTabsProps) {
  return (
    <div>
      <div className="flex border-b border-border mb-5">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer -mb-px",
              activeTab === tab.value
                ? "border-b-2 border-primary text-primary"
                : "text-text-muted hover:text-text"
            )}
          >
            <span>{tab.flag}</span>
            {tab.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
