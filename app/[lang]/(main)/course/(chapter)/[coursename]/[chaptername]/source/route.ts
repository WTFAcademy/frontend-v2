import { portableMarkdown } from "@/features/mdx/lib/portable-markdown";
import { localizedEdition, type EditionParams } from "@/features/course/api/public-edition";
import { SITE_URL } from "@/lib/site";

export async function GET(_request: Request, context: { params: Promise<EditionParams> }) {
  const params = await context.params;
  const { chapter, path } = await localizedEdition(params, "/source");
  const canonical = SITE_URL + "/" + chapter.lang + path;
  return new Response("# " + chapter.title + "\n\n" + portableMarkdown(chapter.content, chapter.content_url) + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Language": chapter.lang,
      "Link": "<" + canonical + '>; rel="canonical"',
      "X-Content-Type-Options": "nosniff",
    },
  });
}
