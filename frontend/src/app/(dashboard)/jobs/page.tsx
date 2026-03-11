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
import { jobAPI } from "@/features/jobs/api/jobAPI";
import { matchesLocation } from "@/utils/location";
import { useToast } from "@/components/ui/Toast";

export default function JobsPage() {
  const { addToast } = useToast();
  const [jobList, setJobList] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  useEffect(() => {
    const cached = jobAPI.getCached?.();
    if (cached && cached.length > 0) {
      setJobList(cached);
      setLoading(false);
      return;
    }

    async function fetchJobData() {
      try {
        const result = await jobAPI.get();
        setJobList(result || []);
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
  const [filterHasSalary, setFilterHasSalary] = useState(false);
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(300000);

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
        (j.employmentTypes ?? []).some((t) => selectedEmploymentTypes.includes(t)),
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

    // Salary filters
    if (filterHasSalary) {
      jobs = jobs.filter((j) => j.salary || j.minSalary != null || j.maxSalary != null);
    }

    if (salaryMin > 0 || salaryMax < 300000) {
      jobs = jobs.filter((j) => {
        const jMin = j.minSalary ?? 0;
        const jMax = j.maxSalary ?? j.minSalary ?? 0;
        return jMax >= salaryMin && jMin <= salaryMax;
      });
    }

    return jobs;
  }, [
    jobList,
    searchQuery,
    locationQuery,
    selectedEmploymentTypes,
    selectedRemote,
    sortBy,
    filterHasSalary,
    salaryMin,
    salaryMax,
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
                salaryMin={salaryMin}
                salaryMax={salaryMax}
                onSalaryMinChange={(v) => setSalaryMin(v)}
                onSalaryMaxChange={(v) => setSalaryMax(v)}
                filterHasSalary={filterHasSalary}
                onToggleHasSalary={() => setFilterHasSalary((p) => !p)}
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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: "var(--d-surface)",
                    border: "1px solid var(--d-border)",
                  }}
                >
                  {/* Gradient bar skeleton */}
                  <div
                    className="h-1 w-full animate-pulse"
                    style={{ backgroundColor: "var(--d-surface-hover)" }}
                  />
                  <div className="p-5 space-y-4">
                    {/* Header: logo + company */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl animate-pulse"
                        style={{ backgroundColor: "var(--d-surface-hover)" }}
                      />
                      <div className="flex-1 space-y-1.5">
                        <div
                          className="h-4 w-2/3 rounded animate-pulse"
                          style={{ backgroundColor: "var(--d-surface-hover)" }}
                        />
                        <div
                          className="h-2.5 w-1/3 rounded animate-pulse"
                          style={{ backgroundColor: "var(--d-surface-hover)" }}
                        />
                      </div>
                    </div>
                    {/* Title */}
                    <div
                      className="h-5 w-5/6 rounded animate-pulse"
                      style={{ backgroundColor: "var(--d-surface-hover)" }}
                    />
                    {/* Location */}
                    <div
                      className="h-3 w-3/5 rounded animate-pulse"
                      style={{ backgroundColor: "var(--d-surface-hover)" }}
                    />
                    {/* Tags */}
                    <div className="flex gap-1.5">
                      <div
                        className="h-6 w-20 rounded-lg animate-pulse"
                        style={{ backgroundColor: "var(--d-surface-hover)" }}
                      />
                      <div
                        className="h-6 w-16 rounded-lg animate-pulse"
                        style={{ backgroundColor: "var(--d-surface-hover)" }}
                      />
                      <div
                        className="h-6 w-14 rounded-lg animate-pulse"
                        style={{ backgroundColor: "var(--d-surface-hover)" }}
                      />
                    </div>
                    {/* Salary chip */}
                    <div
                      className="h-8 w-2/5 rounded-xl animate-pulse"
                      style={{ backgroundColor: "var(--d-surface-hover)" }}
                    />
                    {/* Footer */}
                    <div
                      className="flex items-center justify-between pt-3"
                      style={{ borderTop: "1px solid var(--d-border-subtle)" }}
                    >
                      <div
                        className="h-3 w-20 rounded animate-pulse"
                        style={{ backgroundColor: "var(--d-surface-hover)" }}
                      />
                      <div
                        className="h-8 w-16 rounded-xl animate-pulse"
                        style={{ backgroundColor: "var(--d-surface-hover)" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 auto-rows-fr">
                <AnimatePresence mode="popLayout">
                  {filteredJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      layout="position"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full"
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
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
