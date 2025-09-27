import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
  type: 'card' | 'chart' | 'metrics' | 'list' | 'professional' | 'tabs';
  count?: number;
}

export const SkeletonLoader = ({ type, count = 1 }: SkeletonLoaderProps) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="space-y-4 p-6 glass-card">
            <Skeleton className="h-6 w-3/4 animate-pulse" />
            <Skeleton className="h-4 w-full animate-pulse" />
            <Skeleton className="h-4 w-2/3 animate-pulse" />
          </div>
        );
      
      case 'chart':
        return (
          <div className="space-y-4 p-6 glass-card">
            <Skeleton className="h-6 w-1/2 animate-pulse" />
            <Skeleton className="h-64 w-full rounded-lg animate-pulse" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16 animate-pulse" />
              <Skeleton className="h-4 w-16 animate-pulse" />
            </div>
          </div>
        );

      case 'professional':
        return (
          <div className="space-y-6 p-6 glass-card">
            <div className="space-y-2">
              <Skeleton className="h-7 w-2/3 animate-pulse" />
              <Skeleton className="h-4 w-full animate-pulse" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-32 w-full rounded-lg animate-pulse" />
                <Skeleton className="h-32 w-full rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        );

      case 'tabs':
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-20 rounded-lg animate-pulse" />
              ))}
            </div>
            <Skeleton className="h-64 w-full rounded-lg animate-pulse" />
          </div>
        );
      
      case 'metrics':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2 p-4 bg-muted/50 rounded-lg glass-card">
                <Skeleton className="h-4 w-16 animate-pulse" />
                <Skeleton className="h-8 w-12 animate-pulse" />
              </div>
            ))}
          </div>
        );
      
      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 glass-card">
                <Skeleton className="h-12 w-12 rounded-full animate-pulse" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4 animate-pulse" />
                  <Skeleton className="h-3 w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return <Skeleton className="h-20 w-full animate-pulse" />;
    }
  };

  return (
    <div className="animate-fade-in">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="mb-4 last:mb-0">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};