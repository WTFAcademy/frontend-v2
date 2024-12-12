import DictionaryProvider from "@/features/lang";
import { getDictionary } from "@/app/[lang]/dictionaries";

const LangLayout = async ({
    children,
    params: { lang },
}: { 
    children: React.ReactNode,
    params: { lang: string },
 }) => {
    const dictionary = await getDictionary(lang);
  return (
    <>
      <DictionaryProvider dictionary={dictionary}>
        {children}
      </DictionaryProvider>
    </>
  );
};

export default LangLayout;
