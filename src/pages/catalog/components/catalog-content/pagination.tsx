import { Button, Text } from '@gravity-ui/uikit';
import styles from './style.module.css';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let index = 1; index <= totalPages; index++) {
        pages.push(index);
      }
    } else {
      const leftOffset = Math.floor(maxVisiblePages / 2);
      const rightOffset = Math.ceil(maxVisiblePages / 2) - 1;

      let startPage = currentPage - leftOffset;
      let endPage = currentPage + rightOffset;

      if (startPage < 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      }

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - maxVisiblePages + 1;
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let index = startPage; index <= endPage; index++) {
        pages.push(index);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <div className={styles['pagination-content']}>
        <Button view="outlined" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} size="l">
          Previous
        </Button>

        <div className={styles['page-numbers']}>
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <Text key={index} variant="body-2" className={styles.ellipsis}>
                ...
              </Text>
            ) : (
              <Button
                key={index}
                view={currentPage === page ? 'outlined-action' : 'outlined'}
                onClick={() => onPageChange(page as number)}
                disabled={currentPage === page}
                size="l"
              >
                {page}
              </Button>
            ),
          )}
        </div>

        <Button
          view="outlined"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          size="l"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
