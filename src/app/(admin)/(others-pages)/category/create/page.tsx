import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultInputs from "@/components/category/DefaultInputs";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function AddCategoryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Category" />
      
      {/* Container biasa tanpa grid */}
      <div className="space-y-6">
        <DefaultInputs />
      </div>
    </div>
  );
}

