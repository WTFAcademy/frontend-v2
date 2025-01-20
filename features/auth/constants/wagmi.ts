import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, mainnet, sepolia } from '@reown/appkit/networks'
import { createStorage, cookieStorage } from 'wagmi'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  projectId,
  networks: [mainnet, base, sepolia]
})

export const config = wagmiAdapter.wagmiConfig