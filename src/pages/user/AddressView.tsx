import { Button } from '@gravity-ui/uikit';

export function AddressView({ onEdit }: { onEdit: () => void }) {
  return (
    <div>
      <Button view="action" onClick={onEdit}>
        Edit
      </Button>
    </div>
  );
}
