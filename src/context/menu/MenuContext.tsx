// context/MenuContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

type MenuContextType = {
    footerMenuOpen: boolean;
    toggleFooterMenu: () => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

type MenuProviderProps = {
    children: ReactNode;
};

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
    const [footerMenuOpen, setFooterMenuOpen] = useState(false);

    const toggleFooterMenu = () => {
        setFooterMenuOpen(prevState => !prevState);
    };

    return (
        <MenuContext.Provider value={{ footerMenuOpen, toggleFooterMenu }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = (): MenuContextType => {
    const context = useContext(MenuContext);

    if (context === undefined) {
        throw new Error('useMenu must be used within a MenuProvider');
    }

    return context;
};
