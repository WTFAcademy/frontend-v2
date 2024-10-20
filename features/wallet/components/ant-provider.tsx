'use client'

import React, { type ReactNode } from 'react'
import {
  Mainnet,
  MetaMask,
  OkxWallet,
  TokenPocket,
  WagmiWeb3ConfigProvider,
  WalletConnect
} from '@ant-design/web3-wagmi'
import { http } from 'viem'
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

const AntProvider = ({children}: {children: ReactNode}) => {
  return (
    <WagmiWeb3ConfigProvider
      eip6963={{
        autoAddInjectedWallets: true,
      }}
      ens
      chains={[Mainnet]}
      transports={{
        [Mainnet.id]: http(),
      }}
      walletConnect={{
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
      }}
      wallets={[
        MetaMask(),
        WalletConnect(),
        TokenPocket({
          group: 'Popular',
        }),
        OkxWallet(),
      ]}
      queryClient={queryClient}
    >
      {children}
    </WagmiWeb3ConfigProvider>
  )
};

export default AntProvider;
