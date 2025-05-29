import { TextInput } from '@gravity-ui/uikit';
import style from './style.module.css';
import { Xmark } from '@gravity-ui/icons';
import { Magnifier } from '@gravity-ui/icons';
import { useForm } from 'react-hook-form';
import { SearchInputButton } from './search-input-button/search-input-button';
import { useProducts } from '../../../../components/hooks/useProducts';

export function SearchComponent() {
  const { register, handleSubmit, setValue } = useForm<{ search: string }>();
  const { searchedValue, setSearchedValue, getSpecificProducts } = useProducts();

  const onSubmit = (data: { search: string }) => {
    getSpecificProducts({ searchedValue: data.search });
  };

  return (
    <form
      className={style['search-form']}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(onSubmit)();
      }}
    >
      <TextInput
        {...register('search')}
        size="xl"
        placeholder="Search"
        endContent={
          searchedValue
            ? [
                <SearchInputButton
                  key="clear"
                  icon={Xmark}
                  onClick={() => {
                    setValue('search', '');
                    setSearchedValue(undefined);
                    getSpecificProducts({});
                  }}
                />,
                <SearchInputButton key="search" icon={Magnifier} type="submit" />,
              ]
            : [<SearchInputButton key="search" icon={Magnifier} type="submit" />]
        }
      ></TextInput>
    </form>
  );
}
