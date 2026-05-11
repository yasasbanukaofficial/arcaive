"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dashboardStagger, fadeUp } from "@/components/animations/animations";
import type { SortOption, JobListing } from "@/@types/jobs";
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

    const getCoords = (): Promise<{ lat: number; lon: number } | null> => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve(null);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
          (err) => {
            resolve(null);
          },
          { timeout: 5000, enableHighAccuracy: true, maximumAge: 0 },
        );
      });
    };

    async function initialize() {
      setLoading(true);
      try {
        const coords = await getCoords();
        let country = "";
        if (coords) {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.lat}&longitude=${coords.lon}&localityLanguage=en`,
          );
          const geoData = await geoRes.json();
          country = geoData.countryName || "";
          setLocationQuery(country);
        }
        const result = await jobAPI.get(country.trim());
        setJobList(result || []);
      } catch (err) {
        addToast({
          type: "error",
          title: "Unable to load jobs",
          description: "Allow location if not enabled in the browser.",
        });
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<
    string[]
  >(["FULLTIME", "PARTTIME", "CONTRACTOR", "INTERN"]);
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
        (j.employmentTypes ?? []).some((t) =>
          selectedEmploymentTypes.includes(t),
        ),
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
        jobs.sort(
          (a, b) => (a.minSalary ?? Infinity) - (b.minSalary ?? Infinity),
        );
        break;
      case "date_newest":
        jobs.sort((a, b) => b.postedAtTimestamp - a.postedAtTimestamp);
        break;
      case "last_updated":
      default:
        break;
    }

    if (filterHasSalary) {
      jobs = jobs.filter(
        (j) => j.salary || j.minSalary != null || j.maxSalary != null,
      );
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

          {/* Filter Row */}
          <div className="flex flex-wrap gap-2 mb-8">
            {selectedEmploymentTypes.map(t => (
              <button 
                key={t}
                onClick={() => toggleEmploymentType(t)}
                className="tag border-[var(--glass-border)] bg-[var(--text-primary)] text-[var(--bg-color)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)] transition-colors"
              >
                {t} [X]
              </button>
            ))}
            {selectedRemote.map(r => (
              <button 
                key={r}
                onClick={() => toggleRemote(r)}
                className="tag border-[var(--glass-border)] bg-[var(--text-primary)] text-[var(--bg-color)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {r} [X]
                </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col border-t border-[var(--glass-border)]">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-24 border-b border-[var(--glass-border)] flex items-center px-6 gap-8 bg-[var(--glass-bg)]/5"
                >
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/3 bg-[var(--glass-border)]" />
                    <div className="h-3 w-1/4 bg-[var(--glass-border)]" />
                  </div>
                  <div className="w-24 h-8 bg-[var(--glass-border)]" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-col border-t border-[var(--glass-border)]">
                <AnimatePresence mode="popLayout">
                  {filteredJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      layout="position"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
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
