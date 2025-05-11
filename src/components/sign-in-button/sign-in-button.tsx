import { Button } from '@gravity-ui/uikit';
import { SignInButtonProperties } from './type';

export default function SignInButton(properties: SignInButtonProperties) {
  return (
    <Button type="submit" view="action" size="xl" width="max">
      {properties.text}
    </Button>
  );
}
