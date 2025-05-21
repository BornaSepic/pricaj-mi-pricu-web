import type { Metadata, Viewport } from 'next'
import type { FC, ReactNode } from 'react'
import Providers from './providers'
import "../styles/globals.css";
import styles from "../styles/Global.module.css";
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { AppInstallPrompt } from '../components/app-install-prompt';

export const metadata: Metadata = {
  title: 'Pricaj mi priču',
  description: 'Za sve pričalice i one koji to žele biti.',
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
