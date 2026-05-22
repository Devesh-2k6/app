import React from "react";

export function DealProductSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col sm:flex-row gap-4 p-4 animate-pulse">
      <div className="w-24 h-24 rounded-xl flex-shrink-0 bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12" />
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-2" />
        </div>
        <div className="flex items-end justify-between mt-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-10" />
        </div>
      </div>
    </div>
  );
}
