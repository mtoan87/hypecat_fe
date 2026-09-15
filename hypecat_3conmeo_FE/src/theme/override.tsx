import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { type ReactNode } from "react";
import { viVN as coreViVN } from "@mui/material/locale";
import { viVN } from "@mui/x-date-pickers/locales";

// interface
declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    mobile: true; // Add custom breakpoints
    tablet: true;
    laptop: true;
    desktop: true;
  }
}
// Define your custom theme
const theme = createTheme(
  {
    typography: {
      fontFamily: '"Lora", serif',
      h2: {
        fontWeight: 600,
      },
      body1: {
        fontWeight: 600,
      },
      button: { textTransform: "none" },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
        mobile: 360,
        tablet: 744,
        laptop: 1024,
        desktop: 1440,
      },
    },
  },
  viVN, // x-date-pickers translations
  coreViVN // core translations
);
interface MuiOverideProps {
  children: ReactNode;
}
// You can also customize other typography variants if needed

const OverrideMuiTheme: React.FC<MuiOverideProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default OverrideMuiTheme;
