"use client";

import Footer from "@/components/layout/footer";
import Image from "next/image";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { useEffect } from "react";
import { toast } from "sonner";
import { updateUser, unbindWallet } from "@/features/user/api/use-user-api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSetAtom } from "jotai";
import { openAuthModal } from "@/features/auth/atoms/auth";
import { useDictionary } from "@/features/lang";
import Link from "next/link";
const PersonalPage = () => {
  const t = useDictionary();
  const { authUser, refetchAuthUser, setIsRegistering } = useAuth()
  const setOpenLoginModal = useSetAtom(openAuthModal);
  const form = useForm({
    defaultValues: {
      nickname: authUser?.nickname || "",
      bio: authUser?.bio || "",
    },
  })

  const onSubmit = async (data: any) => {
    console.log(data)
    try {
      await updateUser(data)
      refetchAuthUser()
      toast.success(t.settings.Settings_updated_successfully)
    } catch (error) {
      console.log(error)
      toast.error(t.settings.Failed_to_update_settings)
    }
  }

  const unbind = async () => {
    try {
      await unbindWallet({ address: authUser?.wallet_address || "", provider: authUser?.wallet_provider || "" })
      refetchAuthUser()
      toast.success(t.settings.Wallet_unbound_successfully)
    } catch (error) {
      console.log(error)
      toast.error(t.settings.Failed_to_unbind_wallet)
    }
  }

  useEffect(() => {
    form.reset({
      nickname: authUser?.nickname || "",
      bio: authUser?.bio || "",
    })
  }, [authUser])

  return (
    <>
      <div id="personal" className="relative min-h-screen flex flex-col px-4">
        <div className="absolute w-full h-[251px] inset-x-0 top-0 hidden md:block">
          <Image
            src="/images/personal-banner.png"
            alt="Personal Center Hero"
            fill
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute w-full h-full inset-0 bg-gradient-to-b from-[rgba(255,255,255,0)] from-[-26.57%] via-[rgba(255,255,255,0)] via-0% to-white to-100% dark:from-[rgba(18,18,18,0)] dark:via-[rgba(18,18,18,0)]  dark:to-[rgba(18,18,18,1)]"></div>
        </div>
        <section className="container flex-1 relative z-10 w-full flex flex-col">
          <div className="flex flex-col items-center px-10 pb-10 4xl:pb-20">
            <div className="mt-[116px] text-center space-y-3">
              <h1 className="text-[36px] font-bold">{t.settings.Settings}</h1>
              <p className="text-wtf-content-3 text-base">
                {t.settings.Settings_related_to_your_account}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-y-10 max-w-[640px] 4xl:max-w-[1120px] w-full mx-auto mb-20">
            <div className="flex flex-col gap-y-3 4xl:gap-y-8">
              <h3 className="font-bold">{t.settings.Connections}</h3>
              <div className="w-full border border-border-line p-5 flex items-center gap-x-4 rounded-lg">
                <Icons.github className="w-10 h-10 text-wtf-content-1" />
                <div className="flex flex-col">
                  <h4 className="text-bold text-base">Github</h4>
                  <span className="text-wtf-content-3">
                  <Link
                        href={`https://github.com/${authUser?.username}`}
                        target="_blank"
                      >
                        {authUser?.username || "Github"}
                      </Link>
                  </span>
                </div>
              </div>
              <div className="w-full border border-border-line p-5 flex justify-between rounded-lg">
                <div className="flex items-center gap-x-4">
                  <Icons.eth className="w-10 h-10 text-wtf-content-1" />
                  <div className="flex flex-col">
                    <h4 className="text-bold text-base">ETH</h4>
                    <span className="text-wtf-content-3">
                      {formatAddress(authUser?.wallet_address || "")}
                    </span>
                  </div>
                </div>
                {
                  authUser?.wallet_address
                    ? (<div className="flex items-center gap-x-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="destructive" onClick={unbind}>{t.settings.Unbind}</Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-34">
                            <Button variant="destructive">{t.settings.Confirm}</Button>
                          </PopoverContent>
                        </Popover>
                        <Button variant="secondary" size="icon" className="h-9 w-9">
                          <Icons.copy className="w-4 h-4" onClick={() => {
                            navigator.clipboard.writeText(authUser?.wallet_address || "")
                            toast.success(t.settings.Copied_to_clipboard)
                          }} />
                        </Button>
                      </div>)
                    : (
                      <div className="flex items-center gap-x-2">
                        <Button onClick={() => {
                          setOpenLoginModal(true)
                          setIsRegistering(true)
                        }}>{t.settings.Bind_Wallet}</Button>
                      </div>
                    )
                }
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-10">
                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-3">
                      <h3 className="font-bold">{t.settings.Nickname}</h3>
                      <Input placeholder={t.settings.Enter_your_nickname} {...field} />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-3">
                      <h3 className="font-bold">{t.settings.Bio}</h3>
                      <Textarea placeholder={t.settings.Enter_your_bio} rows={4} {...field} />
                      <p className="text-wtf-content-3 text-sm">
                        {t.settings.Write_a_few_sentences_about_yourself}
                      </p>
                    </div>
                  )}
                />
                <Button className="w-fit" type="submit">{t.settings.Save}</Button>
              </form>
            </Form>

          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default PersonalPage;
