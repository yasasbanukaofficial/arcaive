"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import SessionUnavailableModal from "./SessionUnavailableModal";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class SessionErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("SessionErrorBoundary caught an error:", error, errorInfo);
  }

  private handleClose = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || "";
      const isSessionError = errorMessage.includes("No session provided") || 
                            errorMessage.includes("Session context");

      if (isSessionError) {
        return (
          <SessionUnavailableModal isOpen={true} onClose={this.handleClose} />
        );
      }

      // If it's not a session error, we might still want to show the modal or a fallback
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 h-full text-center bg-[var(--bg-color)]">
          <h3 className="text-[24px] font-bold text-[var(--text-primary)] mb-3 tracking-tight">Something went wrong</h3>
          <p className="text-[15px] text-[var(--text-secondary)] max-w-md mb-10 leading-relaxed font-medium">
            An unexpected error occurred during the interview session.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="h-14 px-10 bg-[var(--text-primary)] text-[var(--bg-color)] rounded-full font-bold text-[13px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
