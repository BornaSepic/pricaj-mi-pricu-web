'use client'

import { useAuth } from "../../hooks/useAuth";
import { useMenu } from "../../context/menu/MenuContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./styles.module.css";

export const Header = () => {
    const { user } = useAuth();
    const { footerMenuOpen, toggleFooterMenu } = useMenu();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        // If footer menu is open, close it when opening header menu
        if (footerMenuOpen && !menuOpen) {
            toggleFooterMenu();
        }
        setMenuOpen(!menuOpen);
    };

    const closeAllMenus = () => {
        setMenuOpen(false);
        if (footerMenuOpen) {
            toggleFooterMenu();
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.menuContainer}>
                <button
                    onClick={toggleMenu}
                    className={styles.menuButton}
                    aria-label="Toggle menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.menuIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <div className={styles.logoContainer}>
                <Link href="/" onClick={closeAllMenus}>
                    <Image
                        src="/portic_logo.png"
                        alt="Portic Logo"
                        width={162}
                        height={44}
                        priority
                    />
                </Link>
            </div>

            <div className={styles.userContainer}>
                {user ? (
                    <Link href="/profile" className={styles.userInfo} onClick={closeAllMenus}>
                        <span className={styles.userName}>{user.name}</span>
                    </Link>
                ) : (
                    <Link href="/auth/login" className={styles.loginLink} onClick={closeAllMenus}>
                        <span>Login</span>
                    </Link>
                )}
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className={styles.mobileMenu}>
                    <nav className={styles.mobileNav}>
                        <ul className={styles.navList}>
                            <li className={styles.navItem}>
                                <Link href="/" className={styles.navLink} onClick={closeAllMenus}>
                                    Naslovna
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <button
                                    className={styles.navLink}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleFooterMenu();
                                        setMenuOpen(false);
                                    }}
                                >
                                    Odjeli
                                </button>
                            </li>
                            <li className={styles.navItem}>
                                <Link href="/events" className={styles.navLink} onClick={closeAllMenus}>
                                    Događaji
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link href="/contact" className={styles.navLink} onClick={closeAllMenus}>
                                    Portić kontakt
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
};
