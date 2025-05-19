import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageWrapperProperties {
  title?: string;
  children: ReactNode;
}

export function PageWrapper({ title = 'Space Real Estate', children }: PageWrapperProperties) {
  const location = useLocation();

  useEffect(() => {
    document.title = title || 'Space Real Estate';
  }, [title, location]);

  return <>{children}</>;
}
