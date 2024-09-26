import { DiscordLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-wtf-bg-gray">
      <div className="w-full flex flex-col md:flex-row border-wtf-border-divider border-[0.5px] border-solid">
        <div className="flex-grow-[2] flex flex-col gap-y-2 items-center justify-center px-10 py-[53px] border-wtf-border-divider border-r-[0.5px] border-b-[0.5px] md:border-b-0 border-solid">
            <div className="relative h-[94px] w-[252px]">
                <Image src="/svgs/logo.svg" alt="WTF Academy" fill className="object-contain" />
            </div>
            <div className="flex items-center gap-x-4">
                <div className="flex items-center justify-center rounded-full bg-wtf-text-1 w-8 h-8">
                    <DiscordLogoIcon className="text-wtf-text-inverted w-4 h-4" />
                </div>
                <div className="flex items-center justify-center rounded-full bg-wtf-text-1 w-8 h-8">
                    <TwitterLogoIcon className="text-wtf-text-inverted w-4 h-4" />
                </div>
            </div>
        </div>
        <div className="flex-grow flex flex-col p-10 border-wtf-border-divider border-r-[0.5px] border-b-[0.5px] md:border-b-0 border-solid gap-y-4">
            <div className="text-base font-medium leading-6 text-wtf-text-3">Products</div>
            <div className="flex flex-col gap-y-2 text-wtf-text-1 text-base font-semibold leading-6">
                <Link href="/learning-center">Learning Center</Link>
                <Link href="/learning-center">Courses</Link>
                <Link href="/learning-center">Forum</Link>
            </div>
        </div>
        <div className="flex-grow flex flex-col p-10 border-wtf-border-divider border-r-[0.5px] border-b-[0.5px] md:border-b-0 border-solid gap-y-4">
            <div className="text-base font-medium leading-6 text-wtf-text-3">Community</div>
            <div className="flex flex-col gap-y-2 text-wtf-text-1 text-base font-semibold leading-6">
                <Link href="/learning-center">GitHub</Link>
                <Link href="/learning-center">Discord</Link>
                <Link href="/learning-center">Twitter</Link>
                <Link href="/learning-center">WeChat</Link>
            </div>
        </div>
        <div className="flex-grow flex flex-col p-10 border-wtf-border-divider border-r-[0.5px] border-b-[0.5px] border-solid gap-y-4">
            <div className="text-base font-medium leading-6 text-wtf-text-3">Donation</div>
            <div className="flex flex-col gap-y-2 text-wtf-text-1 text-base font-semibold leading-6">
                <Link href="/learning-center">GitHub</Link>
                <Link href="/learning-center">Mirror</Link>
            </div>
        </div>
      </div>
      <div className="flex gap-y-2 flex-col md:flex-row justify-between items-center px-10 py-6 text-xs font-normal leading-4 text-wtf-text-3">
        <span>Web3 Open University for Developers</span>
        <span>©2024 WTF Academy</span>
      </div>
    </footer>
  );
};

export default Footer;
