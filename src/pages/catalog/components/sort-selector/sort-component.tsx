import { Select } from '@gravity-ui/uikit';
import style from './style.module.css';
import { useProducts } from '../../../../components/hooks/useProducts';

export function SortComponent() {
  const { criteriaData, getProductsByCriteria } = useProducts();

  const handleSortChange = (value: string[]) => {
    const newSort = value[0] === 'None' ? undefined : value[0];
    const newCriteria = {
      ...criteriaData,
      sort: newSort,
    };
    getProductsByCriteria(newCriteria);
  };

  return (
    <Select
      className={style['sort-component']}
      size="xl"
      label="Sort by"
      onUpdate={handleSortChange}
      value={[criteriaData.sort ?? '']}
    >
      <Select.Option value="price ASC">{`Price \u2191`}</Select.Option>
      <Select.Option value="price DESC">{`Price \u2193`}</Select.Option>
      <Select.Option value="name.en-US ASC">{`Name \u2191`}</Select.Option>
      <Select.Option value="name.en-US DESC">{`Name \u2193`}</Select.Option>
      <Select.Option value="None">{'None'}</Select.Option>
    </Select>
  );
}
