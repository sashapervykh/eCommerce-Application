import { Select } from '@gravity-ui/uikit';
import { useState } from 'react';

export function SortSelector() {
  const [parameter, setParameter] = useState<string>('');
  return (
    <Select
      size="xl"
      label="Sort by"
      onUpdate={(value) => {
        setParameter(value[0]);
        console.log(value);
      }}
      value={[parameter]}
    >
      <Select.Option value={`Price \u2191`} data={{ value: 'data', text: 'string' }}>{`Price \u2191`}</Select.Option>
      <Select.Option value={`Price \u2193`} data={{ value: 'data', text: 'string' }}>{`Price \u2193`}</Select.Option>
      <Select.Option value={`Name \u2191`} data={{ value: 'data', text: 'string' }}>{`Name \u2191`}</Select.Option>
      <Select.Option value={`Name \u2193`} data={{ value: 'data', text: 'string' }}>{`Name \u2193`}</Select.Option>
    </Select>
  );
}
