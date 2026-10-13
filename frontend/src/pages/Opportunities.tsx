import { useEffect, useState } from "react";
import { api, type Opportunity } from "../api";

const typeIcon: Record<string, string> = {
  INTERNSHIP: "fa-solid fa-briefcase",
  EVENT: "fa-solid fa-calendar-star",
  SCHOLARSHIP: "fa-solid fa-award",
  OTHER: "fa-solid fa-circle-info",
};

const typeBadge: Record<string, string> = {
  INTERNSHIP: "badge-brand",
  EVENT: "badge-accent",
  SCHOLARSHIP: "badge-success",
  OTHER: "badge-neutral",
};

export function Opportunities() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void api
      .listOpportunities()
      .then((d) => setItems(d.opportunities))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-heading">
          <i className="fa-solid fa-rocket mr-3 text-accent-500"></i>
          Opportunities
        </h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400">
          Internships, scholarships, hackathons, events, and more — curated for students.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200 mb-6 animate-slide-down dark:bg-red-900/20 dark:text-red-300 dark:ring-red-800">
          <i className="fa-solid fa-circle-exclamation mt-0.5 text-red-500"></i>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-surface-400 dark:text-surface-600">
          <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="card p-6 flex flex-col animate-slide-up"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                  <i className={typeIcon[item.type] || "fa-solid fa-circle-info"}></i>
                </div>
                <span className={typeBadge[item.type] || "badge-neutral"}>
                  {item.type}
                </span>
              </div>
              <h2 className="mt-4 font-display text-lg font-bold text-surface-900 leading-snug dark:text-surface-100">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-surface-500 flex-1 line-clamp-3 dark:text-surface-400">
                {item.description}
              </p>
              <div className="mt-4 pt-3 border-t border-surface-100 dark:border-surface-800">
                {item.link ? (
                  <a
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 no-underline hover:text-brand-700 transition-colors dark:text-brand-400 dark:hover:text-brand-300"
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open listing
                    <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                  </a>
                ) : (
                  <span className="text-xs text-surface-400 dark:text-surface-500">No link provided</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && items.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100 dark:bg-surface-800">
            <i className="fa-solid fa-rocket text-2xl text-surface-300 dark:text-surface-600"></i>
          </div>
          <p className="mt-4 font-medium text-surface-600 dark:text-surface-400">No opportunities yet.</p>
          <p className="mt-1 text-sm text-surface-400 dark:text-surface-500">Check back soon — new listings are added regularly.</p>
        </div>
      )}
    </div>
  );
}
