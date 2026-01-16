export function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-[var(--color-bg)] rounded-lg border-2 border-dashed border-[var(--color-border)] flex items-center justify-center">
        <div className="text-[var(--color-text-muted)] text-sm font-medium">
          Loading chart...
        </div>
      </div>
    </div>
  );
}
