"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dashboardStagger, fadeUp } from "@/components/animations/animations";
import type {
  WorkSchedule,
  EmploymentType,
  JobSource,
  SortOption,
} from "@/@types/jobs";
import JobSearchBar from "@/features/jobs/components/JobSearchBar";
import JobFilterPanel from "@/features/jobs/components/JobFilterPanel";
import JobListHeader from "@/features/jobs/components/JobListHeader";
import JobCard from "@/features/jobs/components/JobCard";
import JobPromoBanner from "@/features/jobs/components/JobPromoBanner";
import { matchesLocation } from "@/utils/location";
import { DUMMY_JOBS } from "@/features/jobs/constants/mockData";

export default function JobsPage() {
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [salaryRangeFilter, setSalaryRangeFilter] = useState("");

  useEffect(() => {
    async function fetchJobData() {
      try {
        const response = await fetch("/api/jobs");
        const result = await response.json();
        if (result.success) {
          setJobList(result.data);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobData();
  }, []);

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

  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const [sortBy, setSortBy] = useState<SortOption>("last_updated");

  const filteredJobs = useMemo(() => {
    let jobs = jobList.length > 0 ? [...jobList] : [...DUMMY_JOBS];

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
      jobs = jobs.filter((j) => matchesLocation(j.location, locationQuery));
    }

    if (experienceLevel.trim()) {
      jobs = jobs.filter((j) => j.experienceLevel === experienceLevel);
    }

    if (salaryRangeFilter.trim()) {
      jobs = jobs.filter((j) => {
        const salaryNum = parseInt(j.salary.replace(/[^0-9]/g, "")) || 0;
        if (salaryRangeFilter === "0-2000") return salaryNum <= 2000;
        if (salaryRangeFilter === "2000-5000")
          return salaryNum > 2000 && salaryNum <= 5000;
        if (salaryRangeFilter === "5000-10000")
          return salaryNum > 5000 && salaryNum <= 10000;
        if (salaryRangeFilter === "10000-20000")
          return salaryNum > 10000 && salaryNum <= 20000;
        if (salaryRangeFilter === "20000+") return salaryNum > 20000;
        return true;
      });
    }

    const parseSalary = (s: string) => parseInt(s.replace(/[^0-9]/g, "")) || 0;
    const parseDate = (d: string) => new Date(d).getTime();

    switch (sortBy) {
      case "match_score":
        jobs.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case "salary_high":
        jobs.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
        break;
      case "salary_low":
        jobs.sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
        break;
      case "date_newest":
        jobs.sort((a, b) => parseDate(b.postedDate) - parseDate(a.postedDate));
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
    experienceLevel,
    salaryRangeFilter,
    sortBy,
  ]);

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
      variants={dashboardStagger(0.04, 0.02)}
      className="max-w-[1600px] mx-auto space-y-6"
    >
      <motion.div variants={fadeUp}>
        <JobSearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          location={locationQuery}
          onLocationChange={setLocationQuery}
          experience={experienceLevel}
          onExperienceChange={setExperienceLevel}
          salaryRange={salaryRangeFilter}
          onSalaryRangeChange={setSalaryRangeFilter}
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
                selectedSchedules={selectedSchedules}
                onToggleSchedule={toggleSchedule}
                selectedTypes={selectedTypes}
                onToggleType={toggleType}
                selectedSources={selectedSources}
                onToggleSource={toggleSource}
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
