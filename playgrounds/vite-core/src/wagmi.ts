import { mainnet, optimism, sepolia } from '@wagmi/chains'
import { injected, walletConnect } from '@wagmi/connectors'
import { createConfig } from '@wagmi/core'
import { http } from 'viem'

export const config = createConfig({
  chains: [mainnet, sepolia, optimism],
  connectors: [
    injected({ wallet: 'metaMask' }),
    injected({ wallet: 'coinbaseWallet' }),
    injected({ wallet: 'phantom' }),
    injected(),
    walletConnect({ projectId: '3fbb6bba6f1de962d911bb5b5c9dba88' }),
  ],
  // reconnectOnMount: false,
  // storage: null,
  transports: {
    [mainnet.id]: http(
      'https://eth-mainnet.g.alchemy.com/v2/StF61Ht3J9nXAojZX-b21LVt9l0qDL38',
    ),
    [sepolia.id]: http(
      'https://eth-sepolia.g.alchemy.com/v2/roJyEHxkj7XWg1T9wmYnxvktDodQrFAS',
    ),
    [optimism.id]: http(),
  },
})
