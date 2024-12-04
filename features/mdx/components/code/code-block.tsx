import useCode from "../../hooks/use-code";
import Pre from "./pre";
import PreSingleLine from "./pre-single-line";

type TCodeBlockProps = {
  children: any;
  highlight?: boolean;
};


const CodeBlock = ({ highlight, children }: TCodeBlockProps) => {
  const code = useCode(children);

  if (!code) return;

  if (!highlight && code.isSingleLine) return <PreSingleLine>{code.content}</PreSingleLine>;

  return <Pre language={code.lang}>{code.content}</Pre>;
};

export default CodeBlock;
