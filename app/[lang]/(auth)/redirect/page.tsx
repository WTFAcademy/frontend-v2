'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useRef } from 'react';

const RedirectContent = () => {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const hasSentMessage = useRef(false);

    useEffect(() => {
        if (code && !hasSentMessage.current) {
            hasSentMessage.current = true;
            window.opener.postMessage({ type: 'github-oauth', code: code }, window.location.origin);
            window.close();
        }
    }, [code]);

    return <div>Redirecting...</div>
}

const RedirectPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RedirectContent />
        </Suspense>
    );
}

export default RedirectPage;
