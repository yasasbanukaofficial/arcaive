"use client";
import React, { useActionState, useEffect, useState } from "react";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { bounceIn, staggerContainer } from "@/components/animations/variants";
import { useRouter } from "next/navigation";
import FileUpload, { UploadedFile } from "@/components/ui/FileUpload";
import { onBoardMember } from "../action";
import { useToast } from "@/components/ui/Toast";

export default function OnBoardingForm() {
  const router = useRouter();
  const { addToast } = useToast();
  const [githubLink, setGithubLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [resumeFiles, setResumeFiles] = useState<UploadedFile[]>([]);
  const [state, formAction, isPending] = useActionState(onBoardMember, {});

  useEffect(() => {
    if (state.success) {
      addToast({
        type: "success",
        title: "Profile completed",
        description: "Your profile has been set up. Redirecting to dashboard...",
      });
      setTimeout(() => router.push("/overview"), 1500);
    }
    if (state.error) {
      addToast({
        type: "error",
        title: "Onboarding failed",
        description: state.error,
      });
    }
  }, [state]);

  return (
    <motion.form
      action={formAction}
      variants={staggerContainer(0.08, 0)}
      className="space-y-4"
    >
      <motion.div variants={bounceIn} className="space-y-1.5">
        <label className="text-[13px] font-medium text-gray-400 ml-1">
          Github
        </label>
        <div className="relative">
          <Github
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            name="githubLink"
            type="text"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            placeholder="https://github.com/username"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
            required
          />
        </div>
      </motion.div>

      <motion.div variants={bounceIn} className="space-y-1.5">
        <label className="text-[13px] font-medium text-gray-400 ml-1">
          LinkedIn
        </label>
        <div className="relative">
          <Linkedin
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            name="linkedinLink"
            type="text"
            value={linkedinLink}
            onChange={(e) => setLinkedinLink(e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
            required
          />
        </div>
      </motion.div>

      <motion.div variants={bounceIn} className="space-y-1.5">
        <FileUpload
          label="CV/Resume"
          accept=".pdf,.doc,.docx"
          maxSizeMB={5}
          files={resumeFiles}
          onFilesChange={setResumeFiles}
          multiple={false}
          hint="PDF, DOCX, DOC files only, max 5MB"
        />
      </motion.div>

      <motion.div variants={bounceIn}>
        <Button
          type="submit"
          variant="white"
          size="lg"
          fullWidth
          icon={<ArrowRight size={18} />}
          iconPosition="right"
          className="mt-4 font-semibold py-3.5 rounded-full"
          disabled={isPending}
        >
          {isPending ? "Completing..." : "Complete Profile"}
        </Button>
      </motion.div>
    </motion.form>
  );
}
