import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { store } from '@/store';
import { router } from '@/router';
import { ToastManager } from '@/shared/components';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto',
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
        <ToastManager />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
