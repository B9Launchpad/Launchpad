// App.tsx
import './i18n';
import './styles/global.css';
import './styles/main.css';
import './styles/variables.css'
import AppRoutes from './routes/Routes';
import { ThemeProvider } from './functions/ThemeContext';

function App() {
  return (
    <>
      <ThemeProvider>
        <AppRoutes/>
      </ThemeProvider>
    </>
  );
}

export default App;