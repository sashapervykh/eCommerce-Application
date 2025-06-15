import { Checkbox } from '@gravity-ui/uikit';

import { Controller, useFormContext } from 'react-hook-form';
import { FiltersFieldsType } from '../types';
import { DEVELOPERS_NAMES, DevelopersType, FloorsType } from '../../../../../../constants/constants';

export function CheckComponent({ element }: { element: FloorsType | DevelopersType }) {
  const { control } = useFormContext<FiltersFieldsType>();

  return (
    <Controller
      name={element}
      control={control}
      render={({ field }) => (
        <Checkbox checked={field.value} onChange={field.onChange}>
          {element in DEVELOPERS_NAMES ? DEVELOPERS_NAMES[element] : element}
        </Checkbox>
      )}
    />
  );
}
