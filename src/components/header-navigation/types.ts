import { Routes } from '../navigation-button/type';

export interface NavigationButtonConfig {
  text: string;
  route: Routes;
  view?: 'action' | 'outlined' | 'flat';
  size?: 's' | 'm' | 'l' | 'xl';
  visible: boolean;
  onClick?: () => void;
}
