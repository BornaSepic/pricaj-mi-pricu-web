import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import styles from "./styles.module.css";

export const Footer = () => {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    if (!user) {
        return null;
    }

    return (
        <footer className={styles.footer}>
            <div className={styles.logoContainer}>
                <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6C10 4.4087 10.6321 2.88258 11.7574 1.75736C12.8826 0.632141 14.4087 0 16 0C17.5913 0 19.1174 0.632141 20.2426 1.75736C21.3679 2.88258 22 4.4087 22 6C22 7.5913 21.3679 9.11742 20.2426 10.2426C19.1174 11.3679 17.5913 12 16 12C14.4087 12 12.8826 11.3679 11.7574 10.2426C10.6321 9.11742 10 7.5913 10 6ZM15 15.5V32L11.975 30.4875C10.6688 29.8375 9.25625 29.425 7.8 29.2812L1.8 28.6812C0.78125 28.575 0 27.7188 0 26.6875V14C0 12.8938 0.89375 12 2 12H3.89375C7.86875 12 11.7437 13.225 15 15.5ZM17 32V15.5C20.2563 13.225 24.1313 12 28.1063 12H30C31.1063 12 32 12.8938 32 14V26.6875C32 27.7125 31.2188 28.575 30.2 28.675L24.2 29.275C22.75 29.4187 21.3312 29.8313 20.025 30.4813L17 32Z" fill="#D3302F"/>
                </svg>
            </div>
        </footer>
    );
};
