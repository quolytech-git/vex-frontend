import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/data/palladio";
import Eyebrow from "@/components/Eyebrow";
import PalladioButton from "@/components/PalladioButton";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Insights | Vex" };
  return {
    title: `${post.title} | Vex`,
    description: post.summary,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const morePosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="bg-[#faf6ed] px-4 pb-20 pt-32 sm:px-8 lg:pt-40">
      <div className="mx-auto max-w-[960px]">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-[13px] text-[#5a6675]">
          <Link href="/blog" className="hover:text-[#212d3d]">
            ← Back to insights
          </Link>
          <span>•</span>
          <span>{post.category}</span>
          <span>•</span>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        <div className="space-y-6">
          <Eyebrow label={post.category} />
          <h1 className="font-serif-display text-[clamp(2.8rem,5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.03em] text-[#212d3d]">
            {post.title}
          </h1>
          <p className="text-[19px] leading-[1.58] text-[#5a6675]">
            {post.summary}
          </p>

          <div className="flex items-center gap-3 pt-1 text-[14px]">
            <span className="font-medium text-[#212d3d]">{post.author}</span>
            <span className="text-[#5a6675]">— {post.authorRole}</span>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[26px] bg-[#f2eee2]">
          <img
            src={post.image}
            alt={post.title}
            className="max-h-[480px] w-full object-cover"
          />
        </div>

        {/* Body Prose */}
        <div className="mt-12 space-y-10">
          {post.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              {section.heading && (
                <h2 className="font-serif-display text-[32px] leading-tight tracking-[-0.02em] text-[#212d3d]">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-[17px] leading-[1.72] text-[#212d3d]/85"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-[24px] bg-[#f2eee2] p-7 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-serif-display text-[28px] leading-tight text-[#212d3d]">
              Put this workflow into practice
            </h3>
            <p className="mt-1 text-[14.5px] text-[#5a6675]">
              Build your verified baseline and tailored application drafts in one evening.
            </p>
          </div>
          <PalladioButton
            label="Start with Vex"
            href="/contact"
            variant="primary"
          />
        </div>

        {/* More Notes */}
        <div className="mt-16 border-t border-[#212d3d]/10 pt-10">
          <h2 className="font-serif-display text-[32px] text-[#212d3d]">
            More research notes
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {morePosts.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="rounded-[22px] bg-[#f2eee2] p-5 transition-transform hover:-translate-y-0.5"
              >
                <span className="text-[12px] font-medium text-[#9c4930]">
                  {item.category} • {item.date}
                </span>
                <h3 className="mt-2 font-serif-display text-[25px] leading-tight text-[#212d3d]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] text-[#5a6675]">
                  {item.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

