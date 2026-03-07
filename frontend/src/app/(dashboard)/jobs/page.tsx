"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dashboardStagger, fadeUp } from "@/components/animations/animations";
import type {
  SortOption,
  JobListing,
} from "@/@types/jobs";
import JobSearchBar from "@/features/jobs/components/JobSearchBar";
import JobFilterPanel from "@/features/jobs/components/JobFilterPanel";
import JobListHeader from "@/features/jobs/components/JobListHeader";
import JobCard from "@/features/jobs/components/JobCard";
import JobPromoBanner from "@/features/jobs/components/JobPromoBanner";
import { matchesLocation } from "@/utils/location";
import { useToast } from "@/components/ui/Toast";

export default function JobsPage() {
  const { addToast } = useToast();
  const [jobList, setJobList] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  useEffect(() => {
    async function fetchJobData() {
      try {
        const response = await fetch("/api/jobs");
        const result = await response.json();
        if (result.success) {
          setJobList(result.data);
        } else {
          addToast({
            type: "error",
            title: "Couldn't load jobs",
            description: "We had trouble fetching job listings. Please try again later.",
          });
        }
      } catch (err) {
        addToast({
          type: "error",
          title: "No connection",
          description: "Unable to reach the job service. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchJobData();
  }, []);

  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<string[]>([
    "FULLTIME",
    "PARTTIME",
    "CONTRACTOR",
    "INTERN",
  ]);
  const [selectedRemote, setSelectedRemote] = useState<string[]>([
    "remote",
    "onsite",
  ]);

  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const [sortBy, setSortBy] = useState<SortOption>("last_updated");

  const filteredJobs = useMemo(() => {
    let jobs = [...jobList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.publisher.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q),
      );
    }

    if (locationQuery.trim()) {
      jobs = jobs.filter((j) => matchesLocation(j.location, locationQuery));
    }

    if (selectedEmploymentTypes.length > 0) {
      jobs = jobs.filter((j) =>
        j.employmentTypes.some((t) => selectedEmploymentTypes.includes(t)),
      );
    }

    if (selectedRemote.length > 0 && selectedRemote.length < 2) {
      if (selectedRemote.includes("remote")) {
        jobs = jobs.filter((j) => j.isRemote);
      } else {
        jobs = jobs.filter((j) => !j.isRemote);
      }
    }

    switch (sortBy) {
      case "salary_high":
        jobs.sort((a, b) => (b.maxSalary ?? 0) - (a.maxSalary ?? 0));
        break;
      case "salary_low":
        jobs.sort((a, b) => (a.minSalary ?? Infinity) - (b.minSalary ?? Infinity));
        break;
      case "date_newest":
        jobs.sort((a, b) => b.postedAtTimestamp - a.postedAtTimestamp);
        break;
      case "last_updated":
      default:
        break;
    }

    return jobs;
  }, [
    jobList,
    searchQuery,
    locationQuery,
    selectedEmploymentTypes,
    selectedRemote,
    sortBy,
  ]);

  const toggleEmploymentType = (t: string) =>
    setSelectedEmploymentTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );

  const toggleRemote = (r: string) =>
    setSelectedRemote((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
    );

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.04, 0.02)}
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
        <div
          className="hidden lg:flex flex-col gap-6 shrink-0 overflow-hidden"
          style={{
            width: filtersCollapsed ? 0 : 280,
            opacity: filtersCollapsed ? 0 : 1,
            marginRight: filtersCollapsed ? -24 : 0,
            transition:
              "width 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1), margin-right 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "width, opacity, margin-right",
          }}
        >
          <div className="w-[280px]">
            <motion.div variants={fadeUp}>
              <JobPromoBanner />
            </motion.div>
            <motion.div variants={fadeUp} className="mt-5">
              <JobFilterPanel
                selectedEmploymentTypes={selectedEmploymentTypes}
                onToggleEmploymentType={toggleEmploymentType}
                selectedRemote={selectedRemote}
                onToggleRemote={toggleRemote}
                collapsed={filtersCollapsed}
                onToggleCollapse={() => setFiltersCollapsed((p) => !p)}
              />
            </motion.div>
          </div>
        </div>
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
                  layout="position"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
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
