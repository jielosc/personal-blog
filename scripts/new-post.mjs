import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const title = process.argv[2];
const suppliedSlug = process.argv[3];
if (!title) {
  console.error('用法：npm run new -- "文章标题" [英文文件名]');
  process.exit(1);
}
const slug = (suppliedSlug || title)
  .normalize("NFKC")
  .toLowerCase()
  .replace(/[^\p{L}\p{N}_-]+/gu, "-")
  .replace(/^-+|-+$/g, "");
if (!slug) {
  console.error("请提供至少一个字母、数字或汉字作为文件名。");
  process.exit(1);
}
const directory = new URL("../content/posts/", import.meta.url);
const path = new URL(`${encodeURIComponent(slug)}.md`, directory);
const date = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
await mkdir(directory, { recursive: true });
try {
  await writeFile(
    path,
    `---\ntitle: ${JSON.stringify(title)}\ndescription: ""\ndate: ${date}\ntags: []\ndraft: true\n---\n\n在这里开始写作。\n`,
    { flag: "wx" },
  );
  console.log(`已创建：${fileURLToPath(path)}\n写完后将 draft 改为 false。`);
} catch (error) {
  if (error.code === "EEXIST") {
    console.error("同名文件已存在，请换一个文件名。");
    process.exit(1);
  }
  throw error;
}
