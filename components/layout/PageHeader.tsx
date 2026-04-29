interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}

export default function PageHeader({ title, subtitle, action, breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="min-w-0 flex-1">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1.5 text-[10px] sm:text-xs text-zinc-400 mb-1 overflow-x-auto scrollbar-hide">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5 flex-shrink-0">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-orange-500 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-zinc-500">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 line-clamp-2">{subtitle}</p>}
      </div>
      {action && (
        <div className="flex-shrink-0 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
            {action}
          </div>
        </div>
      )}
    </div>
  );
}
