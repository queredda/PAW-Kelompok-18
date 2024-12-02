"use client";

import React from "react";
import { ItemLoanForm } from "@/components/item-loan-form";

const Page = () => {
  return (
    <div className="space-y-8 w-full px-4 sm:px-8 md:px-[120px] bg-Background-A min-h-screen py-8">
      <h1 className="text-[24px] sm:text-[30px] font-semibold text-center font-pop text-Text-A mb-6">
        Item loan form
      </h1>
      <ItemLoanForm />
    </div>
  );
};

export default Page;
