export const loginWithGithub = async (code: string) => {
    console.log('loginWithGithub', code);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/github_login`, {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}