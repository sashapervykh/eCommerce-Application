import { Button } from '@gravity-ui/uikit';

export function AddressEditForm({ onCancel }: { onCancel: () => void }) {
  return (
    <div>
      <Button view="normal" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
