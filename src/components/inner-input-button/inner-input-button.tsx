import { Button, Icon } from '@gravity-ui/uikit';
import { Eye } from '@gravity-ui/icons';

export default function InnerInputButton() {
  return (
    <Button size="l" view="flat-secondary" style={{ position: 'absolute', right: '1%', bottom: '22%' }}>
      <Icon data={Eye} width="75%" height="75%"></Icon>
    </Button>
  );
}
