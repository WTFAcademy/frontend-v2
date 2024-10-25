'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

const RedirectPage = () => {
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

export default RedirectPage;
