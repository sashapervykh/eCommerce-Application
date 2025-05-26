import { TextInput } from '@gravity-ui/uikit';
import style from './style.module.css';
import { SearchInputButton } from './search-input-button/search-input-button';
import { Xmark } from '@gravity-ui/icons';
import { Magnifier } from '@gravity-ui/icons';

export function SearchComponent() {
  return (
    <form className={style['search-form']}>
      <TextInput
        size="xl"
        placeholder="Search"
        endContent={[
          <SearchInputButton key="clear" icon={Xmark} />,
          <SearchInputButton key="search" icon={Magnifier} />,
        ]}
      ></TextInput>
    </form>
  );
}
