import React, { FC, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';

type Props = {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

export const AuthProvider: FC<Props> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isLoading) return;

    const isPublicRoute = pathname && PUBLIC_ROUTES.includes(pathname);

    if (!user && !isPublicRoute) {
      router.replace('/auth/login');
    }

    if (user && isPublicRoute) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  return <>{children}</>;
}
