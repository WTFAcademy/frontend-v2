import { SITE_URL } from "@/lib/site";
import { localizedEdition, type EditionParams } from "@/features/course/api/public-edition";
import ChapterReader from "@/features/course/components/chapter-reader";
import MarkdownServer from "@/features/mdx/components/markdown-server";
import { markdownExcerpt } from "@/features/mdx/utils";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params: routeParams,
}: {
  params: Promise<EditionParams>;
}): Promise<Metadata> {
  const params = await routeParams;
  const { course, chapter, path } = await localizedEdition(params);

  const title = course?.title
    ? `${chapter.title} - ${course.title}`
    : chapter.title;
  const description =
    markdownExcerpt(chapter.content) || course?.description || "";
  const image = course?.cover || "/images/course-placeholder.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.lang}${path}`,
      types: { "text/markdown": `/${params.lang}${path}/source` },
    },
    openGraph: {
      type: "article",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

const CourseChapterPage = async ({ params: routeParams }: { params: Promise<EditionParams> }) => {
  const params = await routeParams;
  const { course, chapter, path } = await localizedEdition(params);

  const author = chapter.author?.nickname || chapter.author?.username;
  const modified = chapter.updated_at?.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  const canonical = SITE_URL + "/" + params.lang + path;
  const resource = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: chapter.title,
    url: canonical,
    inLanguage: chapter.lang,
    description: markdownExcerpt(chapter.content),
    dateModified: modified,
    author: author ? { "@type": "Person", name: author } : undefined,
    isPartOf: { "@type": "Course", name: course.title, url: canonical.slice(0, canonical.lastIndexOf("/")) },
  };
  return (
    <ChapterReader
      course={course}
      coursePath={params.coursename}
      chapterPath={params.chaptername}
      chapterTitle={chapter.title}
      studyTime={chapter.study_time}
      language={params.lang}
    >
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resource).replace(/</g, "\\u003c") }} />
      <MarkdownServer locale={params.lang} sourceUrl={chapter.content_url}>{chapter.content}</MarkdownServer>
      <footer className="mt-8 text-sm text-wtf-content-3">
        {[author, modified].filter(Boolean).join(" · ")}
        <a className="ml-3 underline" href={`/${params.lang}${path}/source`}>Markdown</a>
      </footer>
    </ChapterReader>
  );
};

export default CourseChapterPage;
