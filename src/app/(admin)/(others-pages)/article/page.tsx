"use client";

import { Suspense } from "react";
import ArticleContent from "@/components/article/ArticleContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleContent />
    </Suspense>
  );
}
