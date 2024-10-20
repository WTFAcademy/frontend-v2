import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import LoginCard from "./login-card"

export const LoginButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>登录</Button>
            </DialogTrigger>
            <LoginCard />
        </Dialog>
    )
}

export default LoginButton;