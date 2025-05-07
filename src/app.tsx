import '@gravity-ui/uikit/styles/styles.css';
import '@gravity-ui/uikit/styles/fonts.css';
import { Button } from '@gravity-ui/uikit';

import { ThemeProvider } from '@gravity-ui/uikit';

function App() {
  return (
    <ThemeProvider theme="light">
      <div>
        <h1>Space Real Estate</h1>
        <Button view="action" size="l">
          Buy me!
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default App;
