import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, bsc, bscTestnet, mainnet, sepolia } from '@reown/appkit/networks'
import { createStorage, cookieStorage } from 'wagmi'
import { SBT_CHAIN_ID } from '@/features/sbt/constants/nft'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [mainnet, bsc, bscTestnet, base, sepolia] as const

// The network the SBT contracts live on (driven by NEXT_PUBLIC_SBT_CHAIN_ID)
export const sbtNetwork =
  networks.find((network) => network.id === SBT_CHAIN_ID) ?? bsc

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  projectId,
  networks: [...networks]
})

export const config = wagmiAdapter.wagmiConfig