import { Button } from '@gravity-ui/uikit';
import { SearchComponent } from '../search-component/search-component';
import { SortComponent } from '../sort-selector/sort-component';
import style from './style.module.css';

export function ListControls() {
  return (
    <div className={style['list-controls']}>
      <Button size="xl">Filter</Button>
      <SearchComponent />
      <SortComponent />
    </div>
  );
}
