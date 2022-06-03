import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    layout: {
      NavBar: string;
      ControlBox: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    layout?: {
      NavBar?: string;
      ControlBox?: string;
    };
  }
}

// Create a theme instance.
const theme = createTheme({
  layout: {
    NavBar: '10vh',
    ControlBox: '10vh',
  },
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
