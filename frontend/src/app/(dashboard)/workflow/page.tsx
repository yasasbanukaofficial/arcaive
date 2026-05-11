"use client";

import { Background, Controls, ReactFlow, BackgroundVariant } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "@/features/dashboard/components/ThemeContext";

export default function WorkflowPage() {
  const { isDark } = useTheme();

  return (
    <div className="w-full h-[calc(100vh-140px)] flex flex-col gap-8 px-4 md:px-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 shrink-0">
        <div className="space-y-1">
          <h1 className="text-[44px] md:text-[56px] font-semibold text-[var(--text-primary)] tracking-[-0.04em] leading-none capitalize">
            Workflow
          </h1>
          <p className="text-[var(--text-secondary)] text-[14px] font-medium tracking-tight">System logic and neural processing architecture</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full">
           <div className="w-2 h-2 rounded-full bg-[var(--accent-brand)] animate-pulse" />
           <span className="text-[13px] font-bold tracking-tight text-[var(--text-primary)] uppercase">Active Processing</span>
        </div>
      </div>

      <div className="flex-1 bg-[var(--d-surface)] border border-[var(--glass-border)] rounded-[40px] shadow-2xl overflow-hidden relative">
        <ReactFlow
          colorMode={isDark ? "dark" : "light"}
          defaultNodes={[]}
          defaultEdges={[]}
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} 
          />
          <Controls 
            showInteractive={false}
            className="!bg-[var(--glass-bg)] !border-[var(--glass-border)] !rounded-[12px] !shadow-xl"
            style={{ 
              color: "var(--text-primary)",
              fill: "currentColor"
            }} 
          />
        </ReactFlow>
        
        <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-[var(--bg-color)]/60 backdrop-blur-md border border-[var(--glass-border)] rounded-full">
           <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Interactive Logic Layer</span>
        </div>
      </div>
    </div>
  );
}
