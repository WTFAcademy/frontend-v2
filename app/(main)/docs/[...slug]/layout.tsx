const DocLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string[] };
}) => {
  console.log(params.slug);

  return (
    <div>
      <div>当前文档(课程 ID / 章节 ID)：{params.slug.join("/")}</div>
      {children}
    </div>
  );
};

export default DocLayout;
