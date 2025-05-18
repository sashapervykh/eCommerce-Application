import { useEffect, useState } from 'react';
import { createApiBuilderFromCtpClient, type CustomerPagedQueryResponse } from '@commercetools/platform-sdk';
import { ctpClient, projectKey } from '../../commercetools-sdk';
import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import styles from './style.module.css';

const api = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });

export function HomePage() {
  const [projectDetails, setProjectDetails] = useState<CustomerPagedQueryResponse | undefined>();

  useEffect(() => {
    void api
      .customers()
      .get()
      .execute()
      .then((response) => {
        setProjectDetails(response.body);
      });
  }, []);

  return (
    <PageWrapper title="Space Real Estate">
      <div className={styles['content-container']}>
        <h1 className={styles['page-title']}>Welcome to Space Real Estate</h1>
        {projectDetails && (
          <div className={styles['data-preview']}>
            <h2 className={styles['data-preview-title']}>API Response Preview:</h2>
            <pre className={styles['response-data']}>{JSON.stringify(projectDetails, undefined, 2)}</pre>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
