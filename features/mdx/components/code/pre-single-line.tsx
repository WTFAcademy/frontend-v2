const PreSingleLine = ({ children }: { children: any }) => {
    return <code className="border-[1px] border-wtf-border-outline bg-wtf-background-block rounded-sm px-2 py-[3.5px] text-sm text-wtf-content-3 font-medium break-all font-mono">{children}</code>;
};

export default PreSingleLine;