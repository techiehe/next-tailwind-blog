import { MDXRemote } from "next-mdx-remote/rsc";

import remarkMath from "remark-math";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { sans } from "@/lib/fonts";
import { getPost, getPosts } from "@/lib/posts";
import "@/styles/markdown.css";
import "@/styles/shiki.css";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}) {
  const mdxPath = `${params.slug.join("/")}.mdx`;
  const file = getPost(mdxPath);
  return {
    title: file.meta.title + " — He's Blog",
    description: file.meta.description,
  };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => {
    return {
      slug: post.meta.slug.split("\\"),
    };
  });
}

export default async function PostPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const filePath = params.slug.join("/");
  const mdxPath = `${filePath}.mdx`;
  const post = getPost(mdxPath);
  let postComponents = {};

  // try {
  //   postComponents = await import("../../posts/" + filePath + "/components.js");
  // } catch (e: any) {
  //   if (!e || e.code !== "MODULE_NOT_FOUND") {
  //     throw e;
  //   }
  // }

  return (
    <article className=" ">
      <div className="">
        <h2 className={cn(sans.className, " text-3xl dark:text-white")}>
          {post.meta.title}
        </h2>
        <div className=" flex gap-4 text-gray-700 dark:text-gray-300 text-[13px] mb-6 mt-2">
          <p>
            {new Date(post.meta.date).toLocaleDateString("cn", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
          <p>字数：{post.meta.words}</p>
          <p>预计阅读：{post.meta.readTime}</p>
        </div>
      </div>
      <div className=" prose dark:prose-invert dark:!text-gray-300/70  max-w-full markdown">
        <MDXRemote
          source={post?.content || ""}
          components={{
            ...postComponents,
          }}
          options={{
            parseFrontmatter: true,
            mdxOptions: {
              // @ts-ignore
              remarkPlugins: [remarkMath],
              rehypePlugins: [
                // @ts-ignore
                rehypeKatex,
                [
                  rehypePrettyCode,
                  {
                    themes: {
                      default: "github-dark",
                      dark: "slack-dark",
                      light: "github-light",
                    },
                  },
                ],
                rehypeSlug,
              ],
            },
          }}
        />
      </div>
    </article>
  );
}
