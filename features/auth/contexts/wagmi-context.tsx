'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider as WagmiProviderBase, type Config } from 'wagmi'
import { networks, projectId, sbtNetwork, wagmiAdapter } from '../constants/wagmi'

// Set up queryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // 禁用自动重试
    },
  },
})

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'WTF Academy',
  description: 'WTF Academy - Web3 Open University',
  url: 'https://www.wtf.academy', // origin must match your domain & subdomain
  icons: ['https://www.wtf.academy/favicon.ico']
}

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [...networks],
  defaultNetwork: sbtNetwork,
  metadata: metadata,
  allWallets: 'ONLY_MOBILE',
  features: {
    analytics: true,
    swaps: false,
    onramp: false,
    email: false,
    socials: false,
    emailShowWallets: false
  }
})

function WagmiProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProviderBase config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProviderBase>
  )
}

export default WagmiProvider