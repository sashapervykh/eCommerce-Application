import { Button } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';

export function CartButton({ buttonSize, buttonWidth }: { buttonSize: 'm' | 'l'; buttonWidth: 'max' | undefined }) {
  const navigate = useNavigate();

  return (
    <Button view="action" onClick={() => navigate('/cart')} size={buttonSize} width={buttonWidth}>
      Cart
    </Button>
  );
}
