'use client'

import type { FC, ReactNode } from 'react'
import { useMenu } from "../../context/menu/MenuContext";
import styles from "../../styles/Global.module.css";
import clsx from "clsx";

export type Props = {
    children: ReactNode
}

export const MainWrapper: FC<Props> = ({ children }) => {
    const { footerMenuOpen } = useMenu();

    return (
        <main className={clsx(styles.main__wrapper, footerMenuOpen && styles.main__disabled)}>
            {children}
        </main>
    );
};
