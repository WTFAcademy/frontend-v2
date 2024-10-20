'use client'

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import useAuth from '@/features/auth/hooks/use-auth';
import { useEffect, Suspense } from 'react';

const RedirectContent = () => {
    const { loginWithOauthCode } = useAuth();

    const searchParams = useSearchParams();
    const redirect = searchParams.get('uri');
    const code = searchParams.get('code');

    const router = useRouter();

    useEffect(() => {
        if (code) {
            router.replace('/redirect', undefined);
            loginWithOauthCode(code).then((status) => {
                if (status) router.push(redirect || '/');
            });
        }
    }, [code]);

    return <div>Redirecting...</div>
}

const RedirectPage = () => {
    return (
        <Suspense fallback={<div>加载中...</div>}>
            <RedirectContent />
        </Suspense>
    );
}

export default RedirectPage;
