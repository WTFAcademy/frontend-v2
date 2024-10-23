import { Icons } from "@/components/icons";
import useAuth from "../hooks/use-auth";
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'

const numberIcon = (num: number, type: 'waiting' | 'doing' | 'done') => {
    return <div className={`flex w-8 h-8 justify-center items-center gap-2.5 rounded-[42px] ${type === 'doing' ? 'text-white bg-[#135BFB]' : type === 'waiting' ? 'text-[#0F49C9] bg-[#E7EFFF]' : 'text-white bg-[#16A34A]'}`}>
        {num}
    </div>
}

export const BindGithub = ({ onClose }: { onClose: () => void }) => {
    const { signInWithGithub } = useAuth();
    return (
        <DialogContent withoutClose className="flex flex-col items-center gap-6 px-0 py-8">

            <VisuallyHidden asChild>
                <DialogHeader>
                    <DialogTitle>Login Card</DialogTitle>
                </DialogHeader>
            </VisuallyHidden>

            <div className='flex flex-col items-center gap-4 w-full'>
                <Icons.logo className="h-10" />
                <p className="text-2xl font-bold leading-8">
                    Connect to your Github
                </p>
            </div>
            <div className='flex flex-col items-center w-full'>
                <div className="flex justify-between px-8 py-5 border-t-[0.5px] border-solid w-full">
                    <div className="flex items-center gap-4">
                        {numberIcon(1, 'doing')}
                        Sign in with Github
                    </div>
                    <Button className="gap-3" onClick={signInWithGithub}>
                        <Icons.github />
                        <span className="text-sm font-medium leading-[14px]">
                            Sign in
                        </span>
                    </Button>
                </div>

                <div className="flex justify-between px-8 py-5 border-t-[0.5px] border-solid w-full">
                    <div className="flex items-center gap-4">
                        {numberIcon(2, 'waiting')}
                        Sign Message + Bind Wallet
                    </div>
                    <Button variant='outline'>
                        <span className="text-sm font-medium leading-[14px]">
                            Sign & Bind
                        </span>
                    </Button>
                </div>

                <div className="flex items-center justify-center px-8 pt-6 border-t-[0.5px] border-solid w-full text-[#6B7280] cursor-pointer" onClick={onClose}>
                    Cancel login
                </div>
            </div>
        </DialogContent>
    )
}

export default BindGithub;