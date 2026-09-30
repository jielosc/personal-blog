import { getCollection, type CollectionEntry } from "astro:content";
export const url = (path = "") =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
export const postUrl = (id: string) =>
  url(`posts/${id.split("/").map(encodeURIComponent).join("/")}/`);
export function titleOf(post: CollectionEntry<"posts">) {
  return (
    post.data.title ||
    post.body?.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
    post.id.split("/").at(-1)!.replace(/[-_]/g, " ")
  );
}
export function excerptOf(post: CollectionEntry<"posts">) {
  return (
    post.data.description ||
    (post.body || "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/^#+\s+.+$/gm, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`>~|]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 110)
  );
}
export function readingTime(post: CollectionEntry<"posts">) {
  const body = post.body || "";
  const chinese = body.match(/[\u3400-\u9fff]/g)?.length || 0;
  const words =
    body.replace(/[\u3400-\u9fff]/g, "").match(/\b\w+\b/g)?.length || 0;
  return Math.max(1, Math.ceil(chinese / 350 + words / 220));
}
export const formatDate = (date: Date) =>
  date
    .toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    })
    .replaceAll("/", ".");
export async function publishedPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort(
    (a, b) =>
      (b.data.date?.getTime() || 0) - (a.data.date?.getTime() || 0) ||
      a.id.localeCompare(b.id, "zh-CN"),
  );
}
