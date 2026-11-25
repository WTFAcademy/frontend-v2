'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useRef, useState } from 'react';

const RedirectContent = () => {
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const hasSentMessage = useRef(false);
    const [hasOpener, setHasOpener] = useState(true);

    useEffect(() => {
        if (code && !hasSentMessage.current) {
            hasSentMessage.current = true;
            if (window.opener) {
                window.opener.postMessage({ type: 'github-oauth', code: code }, window.location.origin);
                window.close();
            } else {
                setHasOpener(false);
            }
        }
    }, [code]);

    if (!hasOpener) {
        return <div>Login window lost, please close this window and try again. 登录窗口已失效，请关闭此窗口后重试。</div>
    }

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
