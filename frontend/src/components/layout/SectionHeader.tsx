"use client";

import React from "react";
import Tag from "@/components/ui/Tag";
import Title from "@/components/ui/Title";

type Props = {
  tag?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  tagTracking?: string;
};

export default function SectionHeader({
  tag,
  title,
  subtitle,
  className = "",
  tagTracking = "tracking-[0.3em]",
}: Props) {
  return (
    <div className={`mb-20 ${className}`.trim()}>
      {tag ? <Tag label={tag} className={tagTracking} /> : null}
      <Title title={title} subtitle={subtitle} />
    </div>
  );
}
