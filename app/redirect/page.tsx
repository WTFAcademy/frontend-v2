'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const RedirectContent = () => {

    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    useEffect(() => {
        if (code) {
            window.opener.postMessage({ type: 'github-oauth-success', code }, window.location.origin);
            window.close();
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
