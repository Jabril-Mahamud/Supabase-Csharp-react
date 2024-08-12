import React, { createContext, useState, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

interface ThemeContextType {
    darkMode: boolean;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    toggleTheme: () => { },
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
