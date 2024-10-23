import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import LoginCard from "./login-card"
import { useState } from "react"

export const LoginButton = () => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>登录</Button>
            </DialogTrigger>
            <LoginCard onClose={() => setOpen(false)} />
        </Dialog>
    )
}

export default LoginButton;