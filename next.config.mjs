/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: config => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding')
        return config
    },
    images: {
        remotePatterns: [
            {
                hostname: "avatars.githubusercontent.com"
            },
            {
                hostname: "raw.githubusercontent.com"
            },
            {
                hostname: "**.wtf.academy"
            },
            {
                hostname: "vjcxgodediuyprqxqpzo.supabase.co"
            }
        ]
    }
};

export default nextConfig;
