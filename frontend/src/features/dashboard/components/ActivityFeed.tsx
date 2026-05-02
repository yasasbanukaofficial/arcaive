"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, dashboardStagger } from "./animations";
import { DUMMY_ACTIVITIES } from "@/features/dashboard/constants/mockData";
import { useMemberSettings } from "@/features/settings/hooks/useMember";
import { useUsageQuota } from "@/features/billing/hooks/useSubscription";
import { ListFilter, Clock, CheckCircle2, User, Zap } from "lucide-react";

export default function ActivityFeed() {
  const { data: member } = useMemberSettings();
  const { data: usage } = useUsageQuota();

  const [activities, setActivities] = React.useState<any[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const getRecentActivities = () => {
      const activityList = [];

      if (member) {
        activityList.push({
          icon: User,
          title: "Profile synchronized",
          description: "Your professional metadata was updated via vector engine",
          time: member.updatedAt ? new Date(member.updatedAt).toLocaleDateString() : "Just now",
          status: "success" as const,
        });
      }

      if (usage) {
        activityList.push({
          icon: Zap,
          title: "Usage quota recalibrated",
          description: `Current usage: ${usage.cvAnalysisUsed} CVs analyzed this period`,
          time: "Active",
          status: "success" as const,
        });
      }

      // Try to get cached job search activity
      try {
        const cachedJobs = sessionStorage.getItem("arcaive_jobs_cache");
        if (cachedJobs) {
          const jobs = JSON.parse(cachedJobs);
          if (jobs.length > 0) {
            activityList.push({
              icon: ListFilter,
              title: "Market scan completed",
              description: `Discovery Agent identified ${jobs.length} high-signal roles`,
              time: "Recently",
              status: "success" as const,
            });
          }
        }
      } catch (e) {}

      return activityList;
    };

    setActivities(getRecentActivities());
  }, [member, usage]);

  if (!mounted) {
    return (
      <div className="p-6 sm:p-10 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[32px] shadow-sm h-full animate-pulse" />
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      className="p-6 sm:p-10 bg-[var(--glass-bg)] border border-[var(--glass-border)] oryzo-card-glow rounded-[32px] shadow-sm relative overflow-hidden h-full"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/10 rounded-full blur-[40px] pointer-events-none" />

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-color)] flex items-center justify-center border border-[var(--glass-border)]">
            <Clock className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div>
            <h3 className="font-sans text-[18px] font-medium text-[var(--text-primary)] tracking-tight capitalize">
              System logs
            </h3>
            <p className="font-sans text-[12px] text-[var(--text-secondary)] font-medium tracking-[0.05em]">
              Real-time audit
            </p>
          </div>
        </div>
      </div>

      <motion.div variants={dashboardStagger(0.04, 0.1)} className="space-y-2">
        {activities.length > 0 ? activities.map((activity, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="flex items-center gap-5 p-4 sm:p-5 transition-all duration-500 hover:bg-[var(--bg-color)] rounded-[24px] group cursor-pointer border border-transparent hover:border-[var(--glass-border)]"
          >
            <div className="w-10 h-10 rounded-full border border-[var(--glass-border)] flex items-center justify-center shrink-0 bg-[var(--glass-bg)] group-hover:scale-110 group-hover:border-[var(--text-primary)] transition-all duration-500">
              <activity.icon className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-sans text-[14px] sm:text-[15px] font-medium text-[var(--text-primary)] tracking-tight group-hover:text-[var(--text-primary)] transition-colors">
                {activity.title}
              </p>
              <p className="font-sans text-[12px] sm:text-[13px] text-[var(--text-secondary)] truncate font-light">
                {activity.description}
              </p>
            </div>

            <span className="font-sans text-[10px] sm:text-[11px] text-[var(--text-secondary)] font-bold tracking-[0.05em] whitespace-nowrap">
              {activity.time}
            </span>
          </motion.div>
        )) : (
          <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
             <CheckCircle2 className="w-8 h-8 mb-4 text-[var(--text-secondary)]" />
             <p className="font-sans text-[14px]">No recent events detected</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
