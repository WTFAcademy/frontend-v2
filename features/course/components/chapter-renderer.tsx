import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkToc from 'remark-toc';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import React, { useState } from 'react';
import { Icons } from '@/components/icons';

const h1 = ({ node, ...props }: any) => {
    return <h1 className="self-stretch text-[32px] font-bold leading-10 mt-4 mb-2" {...props} />;
  };
  
  const h2 = ({ node, ...props }: any) => {
    return <h2 className="self-stretch text-2xl font-bold leading-8 mt-4 mb-2" {...props} />;
  };
  
  const h3 = ({ node, ...props }: any) => {
    return <h3 className="self-stretch text-[22px] font-bold leading-7 mt-4 mb-2" {...props} />;
  };
  
  const h4 = ({ node, ...props }: any) => {
    return <h4 className="self-stretch text-xl font-bold leading-7 mt-4 mb-2" {...props} />;
  };
  
  const h5 = ({ node, ...props }: any) => {
    return <h5 className="self-stretch text-lg font-bold leading-6 mt-3 mb-1" {...props} />;
  };
  
  const h6 = ({ node, ...props }: any) => {
    return <h6 className="self-stretch text-base font-bold leading-6 mt-3 mb-1" {...props} />;
  };
  
  const strong = ({ node, ...props }: any) => {
    return <strong className="text-sm font-bold leading-6" {...props} />;
  };
  
  const em = ({ node, ...props }: any) => {
    return <em className="text-sm font-normal leading-6" {...props} />;
  };
  
  const del = ({ node, ...props }: any) => {
    return <del className="text-sm font-normal leading-6" {...props} />;
  };
  
  const p = ({ node, ...props }: any) => {
    return <p className="self-stretch text-base font-normal leading-7" {...props} />;
  };
  
  const blockquote = ({ node, ...props }: any) => {
    return (
      <blockquote
        className="flex flex-col items-start rounded-[0px_6px_6px_0px] bg-[#F3F4F6] px-5 border-l-[6px] border-[#3F69D4]"
        {...props}
      />
    );
  };
  
  const hr = ({ node, ...props }: any) => {
    return <hr className="h-0 p-0 mx-0 my-4" {...props} />;
  };
  
  const a = ({ node, ...props }: any) => {
    return (
      <a
        className="self-stretch text-base font-medium leading-7 text-[#3F69D4] hover:underline hover:text-[#3F69D4] mx-1 cursor-pointer"
        {...props}
      />
    );
  };
  
  const ol = ({ node, ...props }: any) => {
    return <ol className="list-decimal pl-8 marker:text-[#3F69D4]" {...props} />;
  };
  
  const ul = ({ node, ...props }: any) => {
    return <ul className="list-disc pl-8 marker:text-[#3F69D4]" {...props} />;
  };
  
  const li = ({ node, ...props }: any) => {
    return <li className="mb-1" {...props} />;
  };
  
  const thead = ({ node, ...props }: any) => {
    return <thead className="bg-[#F3F4F6] border-b border-[#E5E7EB] divide-x" {...props} />;
  };
  
  const tbody = ({ node, ...props }: any) => {
    return <tbody className="divide-y" {...props} />;
  };
  
  const tr = ({ node, ...props }: any) => {
    return <tr className="divide-x" {...props} />;
  };
  
  const table = ({ node, ...props }: any) => {
    return <table className="border-t border-b border-[#E5E7EB]" {...props} />;
  };
  
  const code = (props: any) => {
    const { children, className, node, ...rest } = props;
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <SyntaxHighlighter
        {...rest}
        PreTag={({ children, className, ...rest }) => {
          const [display, setDisplay] = useState(true);
          return (
            <div className="relative">
              <pre {...rest}>
                <div
                  className="absolute top-2 right-2 cursor-pointer px-2 py-1 rounded-sm border-solid bg-[#FFF] border-[#D1D5DB] border hover:bg-[#F3F4F6] opacity-40 transition-opacity hover:opacity-100"
                  onClick={() => {
                    navigator.clipboard.writeText(String(props.children));
                    setDisplay(false);
                    setTimeout(() => {
                      setDisplay(true);
                    }, 1000);
                  }}
                >
                  {display ? <Icons.copyOutline className="text-gray-500" /> : <Icons.checkOutline className="text-gray-500" />}
                </div>
                {children}
              </pre>
            </div>
          );
        }}
        children={String(children || '').replace(/\n$/, '')}
        language={match[1]}
        customStyle={{
          display: 'flex',
          padding: '12px 16px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '16px',
          alignSelf: 'stretch',
          borderRadius: '4px',
          border: '1px solid #D1D5DB',
          background: '#F9FAFB',
        }}
        showLineNumbers
      />
    ) : (
      <code
        {...rest}
        className="h-[28px] justify-center items-center gap-2.5 rounded border border-[#D1D5DB] bg-[#F3F4F6] px-2 mx-2 py-0 border-solid"
      >
        {children}
      </code>
    );
  };  

export const ChapterRenderer = (props: any) => {
  return <Markdown
  remarkPlugins={[remarkGfm, remarkMath, remarkToc]}
  components={{
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    code,
    strong,
    em,
    del,
    p,
    blockquote,
    hr,
    a,
    ol,
    ul,
    li,
    thead,
    tbody,
    tr,
    table,
  }}
    {...props}
  >
    {props.children}
  </Markdown>;
};

export default ChapterRenderer;