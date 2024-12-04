const PreSingleLine = ({ children }: { children: any }) => {
    return <code className="border-[1px] border-wtf-border-outline rounded-sm px-2 py-[3.5px] text-sm text-wtf-content-3 font-medium break-all">{children}</code>;
};

export default PreSingleLine;