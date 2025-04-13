import React, { FC, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';

type Props = {
  children: React.ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <>
      {children}
    </>
  )
}

export default AuthProvider