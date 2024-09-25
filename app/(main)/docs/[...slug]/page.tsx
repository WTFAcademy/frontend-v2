

const DocPage = ({ params }: { params: { slug: string[] } }) => {
  return <div>文档详情: {params.slug.join("/")}</div>;
};

export default DocPage;
