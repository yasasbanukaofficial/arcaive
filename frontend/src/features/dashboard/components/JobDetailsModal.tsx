"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, Clock, Globe, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { memberAPI } from "@/features/settings/api/memberAPI";
import { Member } from "@/@types/member";

const EXPERIENCE_OPTIONS = [
  "Fresh Graduate",
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];

export default function JobDetailsModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [jobRole, setJobRole] = useState("");
  const [experience, setExperience] = useState("");
  const [country, setCountry] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const member: Member = await memberAPI.get();
        if (!member.jobRole) {
          setOpen(true);
        }
      } catch {
        // If we can't fetch, don't show the modal
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!jobRole.trim()) errs.jobRole = "Job role is required";
    if (!experience) errs.experience = "Experience is required";
    if (!country.trim()) errs.country = "Country is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await memberAPI.updateJobDetails({
        jobRole: jobRole.trim(),
        experience,
        country: country.trim(),
      });
      setOpen(false);
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-2xl border p-6 shadow-2xl"
            style={{
              backgroundColor: "var(--d-surface)",
              borderColor: "var(--d-border)",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: "var(--d-text-muted)" }}
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "var(--d-accent-blue)" }}
              >
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--d-text-primary)" }}
                >
                  Complete your profile
                </h2>
                <p
                  className="text-[13px]"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  Help us personalize your experience
                </p>
              </div>
            </div>

            <div
              className="h-px my-5"
              style={{ backgroundColor: "var(--d-border)" }}
            />

            {/* Form  */}
            <div className="space-y-4">
              {/* Job Role */}
              <div className="space-y-1.5">
                <label
                  className="text-[13px] font-medium flex items-center gap-1.5 ml-0.5"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Job Role
                </label>
                <input
                  type="text"
                  placeholder="Software Engineer"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className={`w-full rounded-xl px-4 py-3 text-[14px] placeholder:opacity-40 focus:outline-none focus:ring-2 transition-all ${
                    errors.jobRole
                      ? "ring-1 ring-red-500/40 focus:ring-red-500/30"
                      : "focus:ring-blue-500/20"
                  }`}
                  style={{
                    backgroundColor: "var(--d-input-bg, rgba(255,255,255,0.04))",
                    borderWidth: "1px",
                    borderColor: errors.jobRole
                      ? "rgba(239,68,68,0.3)"
                      : "var(--d-border)",
                    color: "var(--d-text-primary)",
                  }}
                />
                {errors.jobRole && (
                  <p className="text-[12px] ml-1 text-red-400">
                    {errors.jobRole}
                  </p>
                )}
              </div>

              {/* Experience & Country side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    className="text-[13px] font-medium flex items-center gap-1.5 ml-0.5"
                    style={{ color: "var(--d-text-muted)" }}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Experience
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className={`w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                      errors.experience
                        ? "ring-1 ring-red-500/40 focus:ring-red-500/30"
                        : "focus:ring-blue-500/20"
                    }`}
                    style={{
                      backgroundColor:
                        "var(--d-input-bg, rgba(255,255,255,0.04))",
                      borderWidth: "1px",
                      borderColor: errors.experience
                        ? "rgba(239,68,68,0.3)"
                        : "var(--d-border)",
                      color: experience
                        ? "var(--d-text-primary)"
                        : "var(--d-text-muted)",
                    }}
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.experience && (
                    <p className="text-[12px] ml-1 text-red-400">
                      {errors.experience}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-[13px] font-medium flex items-center gap-1.5 ml-0.5"
                    style={{ color: "var(--d-text-muted)" }}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="USA"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={`w-full rounded-xl px-4 py-3 text-[14px] placeholder:opacity-40 focus:outline-none focus:ring-2 transition-all ${
                      errors.country
                        ? "ring-1 ring-red-500/40 focus:ring-red-500/30"
                        : "focus:ring-blue-500/20"
                    }`}
                    style={{
                      backgroundColor:
                        "var(--d-input-bg, rgba(255,255,255,0.04))",
                      borderWidth: "1px",
                      borderColor: errors.country
                        ? "rgba(239,68,68,0.3)"
                        : "var(--d-border)",
                      color: "var(--d-text-primary)",
                    }}
                  />
                  {errors.country && (
                    <p className="text-[12px] ml-1 text-red-400">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>

              {errors.form && (
                <p className="text-[13px] text-red-400 text-center">
                  {errors.form}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-6 w-full py-3 rounded-xl text-[14px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
              style={{ backgroundColor: "var(--d-accent-blue)" }}
            >
              {submitting ? "Saving..." : "Save & Continue"}
            </button>

            <p
              className="text-center text-[12px] mt-3"
              style={{ color: "var(--d-text-muted)" }}
            >
              You can update these later in Settings
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
