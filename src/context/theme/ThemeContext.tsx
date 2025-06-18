import React, { createContext, useState, useContext, useEffect } from 'react';

export type ThemeType = 'red-yellow' | 'black-white' | 'blue-green' | 'purple-pink';

export const themes = {
    'red-yellow': {
        primary: '#D3302F',
        secondary: '#efefef',
        text: '#333',
        background: 'white',
        accent: '#f44336',
        cardBg: 'white',
        buttonPrimary: '#4a90e2',
        buttonPrimaryHover: '#3a80d2',
        buttonSecondary: '#7c2f00',
        buttonSecondaryHover: '#8c3400',
        cardBackground: '#faa71b',
        successColor: '#009E5C',
        errorColor: '#ef4444',
    },
    'black-white': {
        primary: '#303030',
        secondary: '#f5f5f5',
        text: '#333',
        background: 'white',
        accent: '#555',
        cardBg: 'white',
        buttonPrimary: '#333',
        buttonPrimaryHover: '#222',
        buttonSecondary: '#555',
        buttonSecondaryHover: '#444',
        cardBackground: '#e5e5e5',
        successColor: '#009E5C',
        errorColor: '#ef4444',
    },
    'blue-green': {
        primary: '#1255ac',
        secondary: '#e8f5e9',
        text: '#333',
        background: 'white',
        accent: '#00897b',
        cardBg: 'white',
        buttonPrimary: '#1255ac',
        buttonPrimaryHover: '#0d62cb',
        buttonSecondary: '#00897b',
        buttonSecondaryHover: '#00695c',
        cardBackground: '#81d5e9',
        successColor: '#00a946',
        errorColor: '#d50000',
    },
    'purple-pink': {
        primary: '#631670',
        secondary: '#fce4ec',
        text: '#333',
        background: 'white',
        accent: '#e91e63',
        cardBg: 'white',
        buttonPrimary: '#631670',
        buttonPrimaryHover: '#7b1fa2',
        buttonSecondary: '#e51259',
        buttonSecondaryHover: '#f81360',
        cardBackground: '#f8bbd0',
        successColor: '#00983f',
        errorColor: '#ed0000',
    }
};

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    themeColors: typeof themes['red-yellow'];
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'red-yellow',
    setTheme: () => {},
    themeColors: themes['red-yellow'],
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize theme from localStorage or default to red-yellow
    const [theme, setTheme] = useState<ThemeType>('red-yellow');

    useEffect(() => {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('theme') as ThemeType | null;
        if (savedTheme && themes[savedTheme]) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        // Save theme to localStorage
        localStorage.setItem('theme', theme);

        // Apply theme to :root variables
        document.documentElement.style.setProperty('--primary-color', themes[theme].primary);
        document.documentElement.style.setProperty('--secondary-color', themes[theme].secondary);
        document.documentElement.style.setProperty('--text-color', themes[theme].text);
        document.documentElement.style.setProperty('--background-color', themes[theme].background);
        document.documentElement.style.setProperty('--accent-color', themes[theme].accent);
        document.documentElement.style.setProperty('--card-bg', themes[theme].cardBg);
        document.documentElement.style.setProperty('--button-primary', themes[theme].buttonPrimary);
        document.documentElement.style.setProperty('--button-primary-hover', themes[theme].buttonPrimaryHover);
        document.documentElement.style.setProperty('--button-secondary', themes[theme].buttonSecondary);
        document.documentElement.style.setProperty('--button-secondary-hover', themes[theme].buttonSecondaryHover);
        document.documentElement.style.setProperty('--card-background', themes[theme].cardBackground);
        document.documentElement.style.setProperty('--success-color', themes[theme].successColor);
        document.documentElement.style.setProperty('--error-color', themes[theme].errorColor);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themeColors: themes[theme] }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);