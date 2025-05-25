import { Select } from '@gravity-ui/uikit';
import { useState } from 'react';
import style from './style.module.css';
import { useProducts } from '../../../../components/hooks/useProducts';

export function SortComponent() {
  const { getSortedProducts } = useProducts();
  const [parameter, setParameter] = useState<string>('');
  return (
    <Select
      className={style['sort-component']}
      size="xl"
      label="Sort by"
      onUpdate={(value) => {
        setParameter(value[0]);
        getSortedProducts(value[0]);
      }}
      value={[parameter]}
    >
      <Select.Option value={`price ASC`}>{`Price \u2191`}</Select.Option>
      <Select.Option value={`price DESC`}>{`Price \u2193`}</Select.Option>
      <Select.Option value={`name.en-US ASC`}>{`Name \u2191`}</Select.Option>
      <Select.Option value={`name.en-US DESC`}>{`Name \u2193`}</Select.Option>
    </Select>
  );
}
