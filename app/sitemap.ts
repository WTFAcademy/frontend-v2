import axios from "axios";
import { unstable_cache } from "next/cache";
import { catalogSitemap } from "@/lib/catalog-sitemap";

export const dynamic = "force-dynamic";

type Item = { path: string; lang: string; updated_at: string };

async function readPublic<T>(path: string, lang: string): Promise<T> {
  const { data } = await axios.get(path, {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    params: { lang },
    timeout: 10000,
  });
  if (data.code !== 0 || !data.data) throw new Error("Public catalog unavailable");
  return data.data;
}

const getSitemap = unstable_cache(() => catalogSitemap(
  lang => readPublic<{ published: Item[]; unpublished: Item[] }>("/public/courses", lang),
  async (course, lang) => (await readPublic<{ list: Item[] }>(
    "/public/course/" + encodeURIComponent(course) + "/chapters", lang,
  )).list,
), ["public-course-sitemap-v2"], { revalidate: 300 });

export default async function sitemap() {
  return getSitemap();
}
