'use client'

import { Connector, ConnectorTriggerProps } from '@ant-design/web3'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import LoginCard from '@/features/auth/components/login-card'
import { Button } from '@/components/ui/button'

const CustomTrigger: React.FC<ConnectorTriggerProps> = (props) => {
  const { loading, onConnectClick, account } = props;
  return (
    <p onClick={() => onConnectClick?.()}>
      {loading ? 'Connecting...' : account?.address || 'Connect Your Wallet'}
    </p>
  );
};

const LoginPage = () => {
  return <div>
    <Connector
      // modalProps={{}}
    >
      <CustomTrigger />
    </Connector>
    <Dialog>
      <DialogTrigger asChild>
        <Button>登录</Button>
      </DialogTrigger>
      <LoginCard />
    </Dialog>
  </div>;
};

export default LoginPage;
