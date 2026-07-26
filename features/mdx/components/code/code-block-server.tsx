import useCode from "../../hooks/use-code";
import PreServer from "./pre-server";

/**
 * Server twin of <CodeBlock highlight /> — extracts the code/lang from the
 * `pre > code` markup the same way and hands it to the server highlighter.
 * (`useCode` is a pure helper, not a stateful hook.)
 */
const CodeBlockServer = ({ children }: { children: any }) => {
  const code = useCode(children);

  if (!code) return null;

  return <PreServer language={code.lang}>{code.content}</PreServer>;
};

export default CodeBlockServer;
