"use client";
import React, { useActionState, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
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
  const [resumeFiles, setResumeFiles] = useState<UploadedFile[]>([]);
  const [state, formAction, isPending] = useActionState(onBoardMember, {});

  useEffect(() => {
    if (state.success) {
      addToast({
        type: "success",
        title: "Profile completed",
        description: "Your profile has been set up. Redirecting to your dashboard...",
      });
      setTimeout(() => router.push("/overview"), 1500);
    }
    if (state.error) {
      addToast({
        type: "error",
        title: "Profile setup failed",
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
