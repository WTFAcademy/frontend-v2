'use client'

import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { LoginContent } from './login-content'
import { BindGithub } from './bind-github'
import { BindWallet } from './bind-wallet'

export const LoginCard = ({ onClose }: { onClose: () => void }) => {
  return (
    

    <LoginContent />
    // <BindGithub onClose={onClose} />
    // <BindWallet onClose={onClose} />
  )
}

export default LoginCard
