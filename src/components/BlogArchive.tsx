"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/palladio";
import ScrollZoomImage from "@/components/ScrollZoomImage";
import { ArrowRightIcon } from "@/components/Icons";

const CATEGORIES = [
  "All",
  ...Array.from(new Set(BLOG_POSTS.map((p) => p.category))),
];

export default function BlogArchive() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const posts =
    selectedCategory === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === selectedCategory);

  return (
    <section className="bg-[#faf6ed] px-4 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        {/* Category Filters */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-[12.5px] font-medium uppercase tracking-[0.1em] text-[#5a6675]">
            Topics
          </span>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors cursor-pointer ${
                  active
                    ? "bg-[#212d3d] text-[#faf6ed]"
                    : "bg-[#f2eee2] text-[#5a6675] hover:bg-[#ece9df] hover:text-[#212d3d]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              prefetch={true}
              className="group flex flex-col justify-between rounded-[26px] bg-[#f2eee2] p-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(33,45,61,0.08)] active:scale-[0.985] sm:p-5"
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

                <h2 className="mt-3 px-1 font-serif-display text-[27px] leading-[1.15] tracking-[-0.02em] text-[#212d3d]">
                  {post.title}
                </h2>

                <p className="mt-2.5 px-1 text-[14.5px] leading-[1.58] text-[#5a6675]">
                  {post.summary}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#212d3d]/10 px-1 pt-4 text-[13.5px] font-medium text-[#212d3d]">
                <span>
                  {post.author} • {post.readTime}
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#faf6ed] transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

