import { TextInput } from '@gravity-ui/uikit';
import style from './style.module.css';
import { SearchInputButton } from './search-input-button/search-input-button';
import { Xmark } from '@gravity-ui/icons';
import { Magnifier } from '@gravity-ui/icons';
import { useProducts } from '../../../../components/hooks/useProducts';
import { useForm } from 'react-hook-form';

export function SearchComponent() {
  const { getSpecificProducts } = useProducts();
  const { register, handleSubmit } = useForm<{ search: string }>();

  const onSubmit = (data: { search: string }) => {
    getSpecificProducts({ search: data.search });
  };

  return (
    <form
      className={style['search-form']}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(onSubmit)(event);
      }}
    >
      <TextInput
        {...register('search')}
        size="xl"
        placeholder="Search"
        endContent={[
          <SearchInputButton key="clear" icon={Xmark} />,
          <SearchInputButton key="search" icon={Magnifier} type="submit" />,
        ]}
      ></TextInput>
    </form>
  );
}
