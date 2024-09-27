import NextLink, { LinkProps as NextLinkProps } from "next/link";
import TextBorderAnimation from "./animata/text/text-border-animation";
import { cn } from "@/lib/utils";

type LinkProps = NextLinkProps & {
  text: string;
  className?: string;
};

const TextLink = ({ text, className, ...props }: LinkProps) => {
  return (
    <NextLink {...props}>
      <TextBorderAnimation text={text} className={cn("text-base font-semibold leading-6", className)} />
    </NextLink>
  );
};

export default TextLink;
