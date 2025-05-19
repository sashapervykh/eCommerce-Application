import { Button } from '@gravity-ui/uikit';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { NavButtonProperties } from './type';

export function NavigationButton(properties: NavButtonProperties) {
  const navigate: NavigateFunction = useNavigate();

  return (
    <Button
      view="action"
      size="xl"
      onClick={() => {
        void navigate(properties.route);
      }}
      width="max"
    >
      {properties.text}
    </Button>
  );
}
