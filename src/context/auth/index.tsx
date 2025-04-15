import React, { FC, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';

type Props = {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export const AuthProvider: FC<Props> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(router.pathname);

    if (!user && !isPublicRoute) {
      router.replace('/auth/login');
    }

    if (user && isPublicRoute) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  return <>{children}</>;
}