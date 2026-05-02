"use client";

import React from "react";
import { motion } from "framer-motion";
import { dashboardStagger, fadeUp } from "@/features/dashboard/components/animations";
import StatsGrid from "@/features/dashboard/components/StatsGrid";
import UsageChart from "@/features/dashboard/components/UsageChart";
import QuickActions from "@/features/dashboard/components/QuickActions";
import ActiveAgents from "@/features/dashboard/components/ActiveAgents";
import ActivityFeed from "@/features/dashboard/components/ActivityFeed";
import WhatsNew from "@/features/dashboard/components/WhatsNew";

export default function DashboardPage() {
  React.useEffect(() => {
    localStorage.setItem("access_token", "true");
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.04, 0.02)}
      className="space-y-8 max-w-[1600px] mx-auto"
    >
      <motion.div variants={fadeUp}>
        <StatsGrid />
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={fadeUp}>
            <UsageChart />
          </motion.div>
          <motion.div variants={fadeUp}>
            <QuickActions />
          </motion.div>
          <motion.div variants={fadeUp}>
            <WhatsNew />
          </motion.div>
        </div>
        <div className="space-y-8">
          <motion.div variants={fadeUp}>
            <ActiveAgents />
          </motion.div>
          <motion.div variants={fadeUp}>
            <ActivityFeed />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
