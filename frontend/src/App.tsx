import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { store } from '@/store';
import { router } from '@/router';
import { THEME_COLORS } from '@/shared/utils';

const theme = createTheme({
  palette: {
    primary: {
      main: THEME_COLORS.PRIMARY,
    },
    secondary: {
      main: THEME_COLORS.SECONDARY,
    },
    error: {
      main: THEME_COLORS.ERROR,
    },
    warning: {
      main: THEME_COLORS.WARNING,
    },
    info: {
      main: THEME_COLORS.INFO,
    },
    success: {
      main: THEME_COLORS.SUCCESS,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
      </ThemeProvider>
    </Provider>
  );
}

export default App;
