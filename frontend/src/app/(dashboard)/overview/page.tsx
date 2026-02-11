"use client";

import React from "react";
import { motion } from "framer-motion";
import { dashboardStagger, fadeUp } from "@/components/dashboard/animations";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsGrid from "@/components/dashboard/StatsGrid";
import UsageChart from "@/components/dashboard/UsageChart";
import QuickActions from "@/components/dashboard/QuickActions";
import ActiveAgents from "@/components/dashboard/ActiveAgents";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import WhatsNew from "@/components/dashboard/WhatsNew";

export default function DashboardPage() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={dashboardStagger(0.1, 0.05)}
      className="space-y-6 max-w-[1400px] mx-auto"
    >
      {/* Welcome banner */}
      <motion.div variants={fadeUp}>
        <WelcomeBanner />
      </motion.div>

      {/* Stats overview */}
      <motion.div variants={fadeUp}>
        <StatsGrid />
      </motion.div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — wider column */}
        <div className="lg:col-span-2 space-y-6">
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

        {/* Right — sidebar column */}
        <div className="space-y-6">
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
