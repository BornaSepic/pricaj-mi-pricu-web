import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/auth";
import { Header } from "../components/header";
import { ThemeProvider } from "../context/theme/ThemeContext";
import styles from "../styles/Global.module.css";
import { Footer } from "../components/footer";
import { MenuProvider, useMenu } from "../context/menu/MenuContext";
import clsx from "clsx";

// Create a wrapper component that will handle the overlay
const AppContent = ({ Component, pageProps }: { Component: any, pageProps: any }) => {
    const { footerMenuOpen } = useMenu();

    return (
        <>
            <Header />
            {footerMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    style={{ pointerEvents: 'all' }}
                />
            )}
            <main className={clsx(
                styles.main__wrapper,
                footerMenuOpen && styles.main__disabled
            )}>
                <Component {...pageProps} />
            </main>
            <Footer />
        </>
    );
};

const queryClient = new QueryClient({});

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider>
                    <MenuProvider>
                        <AppContent Component={Component} pageProps={pageProps} />
                    </MenuProvider>
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
