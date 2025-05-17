import { Link } from 'react-router-dom';
import { Button } from '@gravity-ui/uikit';

import { useContext, useEffect, useState } from 'react';
import { createApiBuilderFromCtpClient, type CustomerPagedQueryResponse } from '@commercetools/platform-sdk';
import { ctpClient, projectKey } from '../../commercetools-sdk';
import { CustomerContext } from '../../customer-context';

const api = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });

export default function HomePage() {
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

  const customer = useContext(CustomerContext);

  return (
    <div className="page">
      <h1>Main page</h1>
      <div>{customer.customer?.customer.firstName}</div>
      <Link to="/login">
        <Button view="action" size="l">
          To login
        </Button>
      </Link>
      <pre>{JSON.stringify(projectDetails, undefined, 2)}</pre>
    </div>
  );
}
