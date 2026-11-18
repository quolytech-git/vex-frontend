import React from "react";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/palladio";
import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";
import ScrollZoomImage from "@/components/ScrollZoomImage";
import { ArrowRightIcon } from "@/components/Icons";

export default function InsightsSection() {
  const latest = BLOG_POSTS.slice(0, 3);

  return (
    <section id="insights" className="bg-[#faf6ed] px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <SectionHead
          eyebrow="Research & notes"
          title={
            <>
              Notes on{" "}
              <span className="italic text-[#5a6675]">honest readiness.</span>
            </>
          }
          lead="What candidate research reveals about portal fatigue, tailored conversion, and building career tools without gimmicks — published in full."
          ctaLabel="Read all notes"
          ctaHref="/blog"
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {latest.map((post, idx) => (
            <Reveal key={post.slug} delay={idx * 0.08}>
              <Link
                href={`/blog/${post.slug}`}
                prefetch={true}
                className="group flex h-full flex-col justify-between rounded-[26px] bg-[#f2eee2] p-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(33,45,61,0.08)] active:scale-[0.985] sm:p-5"
              >
                <div>
                  <div className="aspect-[1200/860] overflow-hidden rounded-[18px] bg-[#ece9df]">
                    <ScrollZoomImage
                      src={post.image}
                      alt={post.title}
                      fromScale={1}
                      toScale={1.08}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-2 px-1 text-[12px] text-[#5a6675]">
                    <span className="rounded-full bg-[#ece9df] px-3 py-1 font-medium text-[#212d3d]">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="mt-3 px-1 font-serif-display text-[26px] leading-[1.16] tracking-[-0.02em] text-[#212d3d]">
                    {post.title}
                  </h3>

                  <p className="mt-2.5 px-1 text-[14.5px] leading-[1.58] text-[#5a6675]">
                    {post.summary}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#212d3d]/10 px-1 pt-4 text-[13.5px] font-medium text-[#212d3d]">
                  <span>{post.readTime}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#faf6ed] transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
