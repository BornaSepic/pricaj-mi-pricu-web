import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import AuthProvider from "../context/auth";
import { Header } from "../components/header";

const queryClient = new QueryClient({})

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className="app-background">
            <div className="mobile-container">
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <Header />
                        <main>
                            <Component {...pageProps} />
                        </main>
                    </AuthProvider>
                </QueryClientProvider>
            </div>
        </div>
    );
}
