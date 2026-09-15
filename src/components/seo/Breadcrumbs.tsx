import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { navigateTo } from '../../services/router';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    try {
      const parsed = new URL(url);
      navigateTo(parsed.pathname);
    } catch {
      navigateTo(url);
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="py-3 px-4 sm:px-0 text-xs sm:text-sm text-neutral-500 overflow-x-auto whitespace-nowrap scrollbar-none"
    >
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-neutral-400 shrink-0" />}

              {isLast ? (
                <span
                  className="font-semibold text-neutral-900 truncate max-w-[200px] sm:max-w-[320px]"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <a
                  href={item.url}
                  onClick={(e) => handleClick(e, item.url)}
                  className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 hover:underline transition-colors"
                >
                  {index === 0 && <Home className="h-3.5 w-3.5 shrink-0" />}
                  <span>{item.name}</span>
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
