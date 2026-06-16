import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export interface ResponsiveImageProps {
  src: string;
  srcWebp?: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onError?: (error: Error) => void;
  fallback?: React.ReactNode;
}

export default function ResponsiveImage({
  src,
  srcWebp,
  alt,
  className = '',
  loading = 'lazy',
  onError,
  fallback,
}: ResponsiveImageProps) {
  const [isError, setIsError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    setIsError(true);
    if (onError) {
      onError(new Error(`Failed to load image: ${src}`));
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (isError && fallback) {
    return <>{fallback}</>;
  }

  if (isError) {
    return (
      <div className={`${className} bg-slate-800 flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <AlertCircle size={24} />
          <span className="text-xs">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <picture>
      {srcWebp && <source srcSet={srcWebp} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
      />
    </picture>
  );
}
