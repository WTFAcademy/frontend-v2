import Footer from "@/components/layout/footer";
import Image from "next/image";
import { getDictionary } from "../../dictionaries";
import { headers } from "next/headers";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PersonalPage = async () => {
  const heads = headers();
  const lang = heads.get("x-current-lang");
  const t = await getDictionary(lang);

  return (
    <>
      <div id="personal" className="relative min-h-screen flex flex-col">
        <div className="absolute w-full h-[251px] inset-x-0 top-0 hidden md:block">
          <Image
            src="/images/personal-banner.png"
            alt="Personal Center Hero"
            fill
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute w-full h-full inset-0 bg-gradient-to-b from-[rgba(255,255,255,0)] from-[-26.57%] via-[rgba(255,255,255,0)] via-0% to-white to-100% dark:from-[rgba(18,18,18,0)] dark:via-[rgba(18,18,18,0)]  dark:to-[rgba(18,18,18,1)]"></div>
        </div>
        <section className="container relative z-10 container w-full flex flex-col">
          <div className="flex flex-col items-center px-10 pb-10">
            <div className="mt-[116px] text-center space-y-3">
              <h1 className="text-[36px] font-bold">Settings</h1>
              <p className="text-wtf-content-3 text-base">
                Settings related to your account.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-y-10 max-w-[640px] w-full mx-auto mb-20">
            <div className="flex flex-col gap-y-3">
              <h3 className="font-bold">Connections</h3>
              <div className="w-full border border-border-line p-5 flex items-center gap-x-4 rounded-lg">
                <Icons.github className="w-10 h-10 text-wtf-content-1" />
                <div className="flex flex-col">
                  <h4 className="text-bold text-base">Github</h4>
                  <span className="text-wtf-content-3">Daxiongya</span>
                </div>
              </div>
              <div className="w-full border border-border-line p-5 flex justify-between rounded-lg">
                <div className="flex items-center gap-x-4">
                  <Icons.eth className="w-10 h-10 text-wtf-content-1" />
                  <div className="flex flex-col">
                    <h4 className="text-bold text-base">ETH</h4>
                    <span className="text-wtf-content-3">
                      {formatAddress("0x123456789012345678901234567890")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <Button variant="destructive">Unbind</Button>
                  <Button variant="secondary" size="icon" className="h-9 w-9">
                    <Icons.copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-3">
              <h3 className="font-bold">Nickname</h3>
              <Input placeholder="Enter your nickname" />
            </div>

            <div className="flex flex-col gap-y-3">
              <h3 className="font-bold">Bio</h3>
              <Textarea placeholder="Enter your bio" rows={4} />
              <p className="text-wtf-content-3 text-sm">
                Write a few sentences about yourself.
              </p>
            </div>

            <Button className="w-fit">Save</Button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default PersonalPage;
