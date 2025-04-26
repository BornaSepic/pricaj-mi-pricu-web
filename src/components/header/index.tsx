import { useAuth } from "../../hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./styles.module.css";

export const Header = () => {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
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
                <Link href="/">
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
                    <Link href="/profile" className={styles.userInfo}>
                        <span className={styles.userName}>{user.name}</span>
                    </Link>
                ) : (
                    <Link href="/auth/login" className={styles.loginLink}>
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
                                <Link href="/" className={styles.navLink} onClick={toggleMenu}>
                                    Naslovna
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link href="/services" className={styles.navLink} onClick={toggleMenu}>
                                    Odjeli
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link href="/about" className={styles.navLink} onClick={toggleMenu}>
                                    Događaji
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link href="/contact" className={styles.navLink} onClick={toggleMenu}>
                                    Portić - kontakt
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
};
