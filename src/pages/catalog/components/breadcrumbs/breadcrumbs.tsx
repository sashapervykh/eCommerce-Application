import { Breadcrumbs as GravityBreadcrumbs, BreadcrumbsItem } from '@gravity-ui/uikit';
import { useHref, useLinkClickHandler } from 'react-router';
import styles from './style.module.css';

interface BreadcrumbsProps {
  categoryKey?: string;
  subcategoryKey?: string;
  categoryData: { name?: string } | null;
  subcategoryData: { name?: string } | null;
}

function RouterLink({ to, children }: { to: string; children: React.ReactNode }) {
  const href = useHref(to);
  const onClick = useLinkClickHandler(to);
  return (
    <BreadcrumbsItem href={href} onClick={onClick}>
      {children}
    </BreadcrumbsItem>
  );
}

export const Breadcrumbs = ({ categoryKey, subcategoryKey, categoryData, subcategoryData }: BreadcrumbsProps) => {
  return (
    <GravityBreadcrumbs className={styles.breadcrumbs} itemComponent={RouterLink}>
      <RouterLink to="/catalog">Catalog</RouterLink>
      {categoryKey && <RouterLink to={`/catalog/${categoryKey}`}>{categoryData?.name ?? categoryKey}</RouterLink>}
      {subcategoryKey && categoryKey && <BreadcrumbsItem>{subcategoryData?.name ?? subcategoryKey}</BreadcrumbsItem>}
    </GravityBreadcrumbs>
  );
};
