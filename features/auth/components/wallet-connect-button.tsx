'use client'

import { Connector, ConnectorTriggerProps } from '@ant-design/web3'
import { Button } from '@/components/ui/button'

const ConnectButton: React.FC<ConnectorTriggerProps> = (props) => {
    const { loading, onConnectClick, account } = props;
    return (
        <Button onClick={() => onConnectClick?.()} variant='outline' className='flex h-12 w-full text-base font-medium leading-6'>
            Sign in with Ethereum
        </Button>
    )
}

export const WalletConnectButton = () => {
    return (
        <Connector >
            <ConnectButton />
        </Connector>
    )
}

export default WalletConnectButton;