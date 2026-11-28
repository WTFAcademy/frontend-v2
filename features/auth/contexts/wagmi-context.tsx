'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, base, sepolia } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider as WagmiProviderBase, type Config } from 'wagmi'
import {walletStoreCookie} from '../wallet-cookie'
import { projectId, wagmiAdapter } from '../constants/wagmi'

// Set up queryClient
const makeQueryClient = () => new QueryClient({
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
  name: 'appkit-example',
  description: 'AppKit Example',
  url: 'https://appkitexampleapp.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, base, sepolia],
  defaultNetwork: base,
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

function WagmiProvider({ children, walletStore }: { children: ReactNode; walletStore: string | null }) {
  const [queryClient] = React.useState(makeQueryClient);
  const initialState = React.useMemo(()=>{
    if(!walletStore) return undefined;
    try {
      return cookieToInitialState(wagmiAdapter.wagmiConfig as Config, walletStoreCookie+"="+walletStore);
    } catch {
      return undefined;
    }
  },[walletStore]);

  return (
    <WagmiProviderBase config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProviderBase>
  )
}

export default WagmiProvider