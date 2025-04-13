import React, { useState } from 'react';
import styles from './ThemePicker.module.css';
import {themes, ThemeType, useTheme} from "../../context/theme/ThemeContext";

const ThemePicker: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const togglePicker = () => {
        setIsOpen(!isOpen);
    };

    const handleThemeChange = (newTheme: ThemeType) => {
        setTheme(newTheme);
        setIsOpen(false);
    };

    const getThemeDisplayName = (themeKey: ThemeType): string => {
        switch (themeKey) {
            case 'red-yellow': return 'Crimson';
            case 'black-white': return 'Monochrome';
            case 'blue-green': return 'Ocean';
            case 'purple-pink': return 'Berry';
            default: return themeKey;
        }
    };

    return (
        <div className={styles.themePicker}>
            <button
                className={styles.themeButton}
                onClick={togglePicker}
                aria-label="Change theme"
            >
                <span className={styles.themeIcon}>🎨</span>
                <span className={styles.currentTheme}>{getThemeDisplayName(theme)}</span>
            </button>

            {isOpen && (
                <div className={styles.themeOptions}>
                    {Object.keys(themes).map((themeKey) => (
                        <button
                            key={themeKey}
                            className={`${styles.themeOption} ${theme === themeKey ? styles.activeTheme : ''}`}
                            onClick={() => handleThemeChange(themeKey as ThemeType)}
                        >
                            <div
                                className={styles.colorPreview}
                                style={{
                                    backgroundColor: themes[themeKey as ThemeType].primary,
                                    borderColor: themes[themeKey as ThemeType].secondary
                                }}
                            />
                            <span>{getThemeDisplayName(themeKey as ThemeType)}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThemePicker;