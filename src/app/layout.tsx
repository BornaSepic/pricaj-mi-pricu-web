import type { Metadata, Viewport } from 'next'
import type { FC, ReactNode } from 'react'
import Providers from './providers'
import "../styles/globals.css";
import styles from "../styles/Global.module.css";
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { AppInstallPrompt } from '../components/app-install-prompt';

export const metadata: Metadata = {
  title: 'WEBSITE_NAME',
  description: 'WEBSITE_DESCRIPTION'
}

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width'
}

export type Props = {
  children: ReactNode
}

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className={styles.main__wrapper}>{children}</main>
          <Footer />
          <AppInstallPrompt />
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import type { AppProps } from "next/app";
// import { AuthProvider } from "../context/auth";
// import { Header } from "../components/header";
// import { ThemeProvider } from "../context/theme/ThemeContext";
// import { Footer } from "../components/footer";
// import { MenuProvider, useMenu } from "../context/menu/MenuContext";
// import clsx from "clsx";
// import { useEffect } from "react";
// import { AppInstallPrompt } from "../components/app-install-prompt";

// // Create a wrapper component that will handle the overlay
// const AppContent = ({ Component, pageProps }: { Component: any, pageProps: any }) => {
//     const { footerMenuOpen } = useMenu();

//     useEffect(() => {
//         if ('serviceWorker' in navigator) {
//             navigator.serviceWorker
//                 .register('/sw.js')
//                 .then((reg) => console.log('Service Worker registered'))
//                 .catch((err) => console.error('Service Worker registration failed', err));
//         }
//     }, []);

//     return (
//         <>
//             <Header />
//             {footerMenuOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-30"
//                     style={{ pointerEvents: 'all' }}
//                 />
//             )}
//             <main className={clsx(
//                 styles.main__wrapper,
//                 footerMenuOpen && styles.main__disabled
//             )}>
//                 <Component {...pageProps} />
//             </main>
//             <Footer />
//             <AppInstallPrompt />
//         </>
//     );
// };

// const queryClient = new QueryClient({});

// export default function MyApp({ Component, pageProps }: AppProps) {
//     return (
//         <QueryClientProvider client={queryClient}>
//             <AuthProvider>
//                 <ThemeProvider>
//                     <MenuProvider>
//                         <AppContent Component={Component} pageProps={pageProps} />
//                     </MenuProvider>
//                 </ThemeProvider>
//             </AuthProvider>
//         </QueryClientProvider>
//     );
// }
