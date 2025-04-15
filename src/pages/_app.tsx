import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/auth";
import { Header } from "../components/header";
import { ThemeProvider } from "../context/theme/ThemeContext";
import styles from "../styles/Global.module.css"

const queryClient = new QueryClient({})

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider>
                    <Header />
                    <main className={styles.main__wrapper}>
                        <Component {...pageProps} />
                    </main>
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
