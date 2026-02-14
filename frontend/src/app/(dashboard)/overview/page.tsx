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
      variants={dashboardStagger(0.04, 0.02)}
      className="space-y-8 max-w-[1600px] mx-auto"
    >
      <motion.div variants={fadeUp}>
        <WelcomeBanner />
      </motion.div>
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
