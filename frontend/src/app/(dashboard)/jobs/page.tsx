"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dashboardStagger, fadeUp } from "@/components/dashboard/animations";
import type {
  JobListing,
  WorkSchedule,
  EmploymentType,
  JobSource,
  SortOption,
} from "@/@types/jobs";
import JobSearchBar from "@/components/jobs/JobSearchBar";
import JobFilterPanel from "@/components/jobs/JobFilterPanel";
import JobListHeader from "@/components/jobs/JobListHeader";
import JobCard from "@/components/jobs/JobCard";
import JobPromoBanner from "@/components/jobs/JobPromoBanner";

const DUMMY_JOBS: JobListing[] = [
  {
    id: "1",
    title: "Senior UI/UX Designer",
    company: "Amazon",
    companyLogo: "🅰️",
    location: "San Francisco, CA",
    salary: "$250/hr",
    postedDate: "20 May, 2025",
    tags: ["Part time", "Senior level", "Distant", "Project work"],
    experienceLevel: "Senior level",
    workSchedule: "Part time",
    employmentType: "Distant",
    matchScore: 92,
    whyYouMatch:
      "Your 6+ years of UX experience and Figma mastery align perfectly with their design system overhaul initiative.",
    source: "LinkedIn",
    bookmarked: false,
    description:
      "Lead end-to-end design for consumer-facing products across the Amazon ecosystem.",
  },
  {
    id: "2",
    title: "Junior UI/UX Designer",
    company: "Google",
    companyLogo: "🔵",
    location: "California, CA",
    salary: "$150/hr",
    postedDate: "4 Feb, 2025",
    tags: ["Full time", "Junior level", "Distant", "Flexible Schedule"],
    experienceLevel: "Junior level",
    workSchedule: "Full time",
    employmentType: "Flexible Schedule",
    matchScore: 78,
    whyYouMatch:
      "Your portfolio's interaction design projects match their team focus. Growth opportunity with strong mentorship.",
    source: "Serper",
    bookmarked: true,
    description:
      "Work with the Material Design team to shape user experiences across Google products.",
  },
  {
    id: "3",
    title: "Senior Motion Designer",
    company: "Dribbble",
    companyLogo: "🏀",
    location: "New York, NY",
    salary: "$260/hr",
    postedDate: "29 Jan, 2025",
    tags: ["Part time", "Senior level", "Full Day", "Shift work"],
    experienceLevel: "Senior level",
    workSchedule: "Part time",
    employmentType: "Full Day",
    matchScore: 65,
    whyYouMatch:
      "Your After Effects certifications and brand animation experience are a solid partial match for this creative role.",
    source: "Indeed",
    bookmarked: false,
    description:
      "Create stunning motion designs for Dribbble's platform and marketing campaigns.",
  },
  {
    id: "4",
    title: "UX Designer",
    company: "Twitter",
    companyLogo: "🐦",
    location: "California, CA",
    salary: "$120/hr",
    postedDate: "11 Apr, 2025",
    tags: ["Full time", "Middle level", "Distant", "Project work"],
    experienceLevel: "Middle level",
    workSchedule: "Full time",
    employmentType: "Distant",
    matchScore: 85,
    whyYouMatch:
      "Your experience with social media platforms and design-system thinking is a strong match for their feed redesign project.",
    source: "LinkedIn",
    bookmarked: false,
    description:
      "Redesign the core user experience for Twitter's next-generation platform.",
  },
  {
    id: "5",
    title: "Graphic Designer",
    company: "Airbnb",
    companyLogo: "🏠",
    location: "New York, NY",
    salary: "$300/hr",
    postedDate: "2 Apr, 2025",
    tags: ["Part time", "Senior level"],
    experienceLevel: "Senior level",
    workSchedule: "Part time",
    employmentType: "Full Day",
    matchScore: 71,
    whyYouMatch:
      "Your branding portfolio and illustration skills complement their experiential marketing team needs.",
    source: "Glassdoor",
    bookmarked: false,
    description:
      "Create visual assets for Airbnb's global brand campaigns and host experiences.",
  },
  {
    id: "6",
    title: "Graphic Designer",
    company: "Apple",
    companyLogo: "🍎",
    location: "San Francisco, CA",
    salary: "$140/hr",
    postedDate: "18 Jan, 2025",
    tags: ["Part time", "Distant"],
    experienceLevel: "Middle level",
    workSchedule: "Part time",
    employmentType: "Distant",
    matchScore: 88,
    whyYouMatch:
      "Your minimalist design philosophy and attention to micro-interactions are exactly what Apple's HIG team is looking for.",
    source: "Serper",
    bookmarked: true,
    description:
      "Design beautiful, intuitive interfaces for Apple's hardware and software ecosystem.",
  },
  {
    id: "7",
    title: "Product Designer",
    company: "Stripe",
    companyLogo: "💳",
    location: "Remote",
    salary: "$280/hr",
    postedDate: "5 Mar, 2025",
    tags: ["Full time", "Senior level", "Distant", "Flexible Schedule"],
    experienceLevel: "Senior level",
    workSchedule: "Full time",
    employmentType: "Flexible Schedule",
    matchScore: 94,
    whyYouMatch:
      "Your fintech design experience and deep understanding of developer tools make you an exceptional fit for Stripe's dashboard team.",
    source: "LinkedIn",
    bookmarked: false,
    description:
      "Shape the future of internet payments through elegant product design for millions of businesses.",
  },
  {
    id: "8",
    title: "Design Systems Lead",
    company: "Shopify",
    companyLogo: "🛍️",
    location: "Toronto, CA",
    salary: "$220/hr",
    postedDate: "12 Feb, 2025",
    tags: ["Full time", "Lead", "Distant", "Project work"],
    experienceLevel: "Lead",
    workSchedule: "Full time",
    employmentType: "Distant",
    matchScore: 82,
    whyYouMatch:
      "Your component library contributions and Polaris knowledge signal strong alignment with their design system evolution.",
    source: "Indeed",
    bookmarked: false,
    description:
      "Lead the evolution of Polaris, Shopify's design system used by thousands of developers and designers.",
  },
  {
    id: "9",
    title: "Interaction Designer",
    company: "Figma",
    companyLogo: "🎨",
    location: "San Francisco, CA",
    salary: "$310/hr",
    postedDate: "22 Mar, 2025",
    tags: ["Full time", "Senior level", "Full Day"],
    experienceLevel: "Senior level",
    workSchedule: "Full time",
    employmentType: "Full Day",
    matchScore: 96,
    whyYouMatch:
      "Your prototyping expertise and contributions to the design tool ecosystem make you a near-perfect match for Figma's core product team.",
    source: "Serper",
    bookmarked: true,
    description:
      "Design the interactions that power the world's most popular collaborative design tool.",
  },
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const [selectedSchedules, setSelectedSchedules] = useState<WorkSchedule[]>([
    "Full time",
    "Part time",
    "Project work",
  ]);
  const [selectedTypes, setSelectedTypes] = useState<EmploymentType[]>([
    "Full Day",
    "Flexible Schedule",
    "Distant",
  ]);
  const [selectedSources, setSelectedSources] = useState<JobSource[]>([
    "LinkedIn",
    "Serper",
    "Indeed",
    "Glassdoor",
  ]);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([
    1200, 20000,
  ]);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const [sortBy, setSortBy] = useState<SortOption>("last_updated");

  const filteredJobs = useMemo(() => {
    let jobs = [...DUMMY_JOBS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (locationQuery.trim()) {
      const loc = locationQuery.toLowerCase();
      jobs = jobs.filter((j) => j.location.toLowerCase().includes(loc));
    }

    return jobs;
  }, [searchQuery, locationQuery]);

  const toggleSchedule = (s: WorkSchedule) =>
    setSelectedSchedules((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const toggleType = (t: EmploymentType) =>
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );

  const toggleSource = (s: JobSource) =>
    setSelectedSources((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.08, 0.05)}
      className="max-w-[1600px] mx-auto space-y-6"
    >
      <motion.div variants={fadeUp}>
        <JobSearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          location={locationQuery}
          onLocationChange={setLocationQuery}
        />
      </motion.div>
      <div className="flex gap-6 items-start">
        <motion.div
          animate={{
            width: filtersCollapsed ? 0 : 280,
            opacity: filtersCollapsed ? 0 : 1,
            marginRight: filtersCollapsed ? -24 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="hidden lg:flex flex-col gap-6 shrink-0 overflow-hidden"
        >
          <div className="w-[280px]">
            <motion.div variants={fadeUp}>
              <JobPromoBanner />
            </motion.div>
            <motion.div variants={fadeUp} className="mt-5">
              <JobFilterPanel
                selectedSchedules={selectedSchedules}
                onToggleSchedule={toggleSchedule}
                selectedTypes={selectedTypes}
                onToggleType={toggleType}
                selectedSources={selectedSources}
                onToggleSource={toggleSource}
                salaryRange={salaryRange}
                onSalaryRangeChange={setSalaryRange}
                collapsed={filtersCollapsed}
                onToggleCollapse={() => setFiltersCollapsed((p) => !p)}
              />
            </motion.div>
          </div>
        </motion.div>
        <div className="flex-1 min-w-0">
          <motion.div variants={fadeUp}>
            <JobListHeader
              totalJobs={filteredJobs.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filtersCollapsed={filtersCollapsed}
              onToggleFilters={() => setFiltersCollapsed((p) => !p)}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {filteredJobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <p
                className="text-[17px] font-medium mb-1.5"
                style={{ color: "var(--d-text-secondary)" }}
              >
                No jobs found
              </p>
              <p
                className="text-[14px]"
                style={{ color: "var(--d-text-muted)" }}
              >
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
