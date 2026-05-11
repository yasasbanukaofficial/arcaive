"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Shield,
  Smartphone,
  KeyRound,
  Chrome,
  Github,
  Linkedin,
  Check,
  Unlink,
  Link as LinkIcon,
  LucideIcon,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import Card, { CardRow } from "@/components/ui/Card";
import TextField from "@/components/ui/TextField";
import PasswordField from "@/components/ui/PasswordField";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/SelectInput";
import Badge from "@/components/ui/Badge";
import type { MemberIdentityData, LinkedAccount } from "@/@types/member";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberAPI } from "../api/memberAPI";
import { useFormik } from "formik";
import { profileSchema, passwordChangeSchema } from "@/utils/validationSchemas";

const iconMap: Record<string, LucideIcon> = {
  google: Chrome,
  github: Github,
  linkedin: Linkedin,
};

type MemberIdentitySectionProps = {
  data: MemberIdentityData;
  isLoading?: boolean;
  error?: Error | null;
};

export default function MemberIdentitySection({
  data,
  isLoading,
  error,
}: MemberIdentitySectionProps) {
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaMethod, setMfaMethod] = useState<"app" | "sms">("app");
  const [mfaSaved, setMfaSaved] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const queryClient = useQueryClient();


  const profileMutation = useMutation({
    mutationFn: async (payload: { 
      memberFullName: string; 
      memberEmail: string;
      jobRole: string;
      experience: string;
    }) =>
      await memberAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member"] });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async (payload: { currentPassword: string; newPassword: string }) =>
      await memberAPI.changePassword(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member"] });
      passwordFormik.resetForm();
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 3000);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      passwordFormik.setStatus(msg || "Failed to update password. Please try again.");
    },
  });

  const mfaMutation = useMutation({
    mutationFn: async (payload: { enabled: boolean; method: string }) =>
      await memberAPI.updateMfa(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member"] });
      setMfaSaved(true);
      setTimeout(() => setMfaSaved(false), 3000);
    },
  });

  const linkedAccountMutation = useMutation({
    mutationFn: async (payload: LinkedAccount[]) =>
      await memberAPI.updateLinkedAccounts(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member"] });
    },
  });

  const profileFormik = useFormik({
    initialValues: { fullName: "", email: "", jobRole: "", experience: "" },
    validationSchema: profileSchema,
    enableReinitialize: false,
    onSubmit: (values) => {
      profileMutation.mutate({
        memberFullName: values.fullName,
        memberEmail: values.email,
        jobRole: values.jobRole,
        experience: values.experience,
      });
    },
  });

  const passwordFormik = useFormik({
    initialValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    validationSchema: passwordChangeSchema(data?.hasPassword === true),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      passwordFormik.setStatus(undefined);
      const hasPassword = data?.hasPassword === true;
      if (hasPassword && values.newPassword === values.currentPassword) {
        passwordFormik.setStatus("New password cannot be the same as your current password");
        return;
      }
      passwordMutation.mutate({
        currentPassword: hasPassword ? values.currentPassword : "",
        newPassword: values.newPassword,
      });
    },
  });

  useEffect(() => {
    if (data) {
      profileFormik.setValues({
        fullName: data.memberFullName || "",
        email: data.memberEmail || "",
        jobRole: data.jobRole || "",
        experience: data.experience || "",
      });
      setMfaEnabled(data.mfa?.enabled ?? false);
      setMfaMethod(
        ((data.mfa?.method as string) === "authenticator" ? "app" : (data.mfa?.method as "app" | "sms")) ?? "app"
      );
      setLinkedAccounts(data.linkedAccounts ?? []);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin h-8 w-8 border-b-2 border-[var(--text-primary)]"></div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">Loading profile data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-red-300">
        {error ? "Error loading settings." : "Profile not found."}
      </div>
    );
  }

  const handleMfaSave = async () => {
    mfaMutation.mutate({
      enabled: mfaEnabled,
      method: mfaMethod === "app" ? "authenticator" : mfaMethod,
    });
  };

  const toggleLinkedAccount = (provider: string) => {
    const newAccounts = linkedAccounts.map((acc) =>
      acc.provider === provider
        ? {
            ...acc,
            connected: !acc.connected,
            email: !acc.connected ? `member@${provider}.com` : undefined,
          }
        : acc,
    );
    setLinkedAccounts(newAccounts);
    linkedAccountMutation.mutate(newAccounts);
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } },
      }}
    >
      <Card
        title="Profile Information"
        description="Your primary contact details used across the platform."
        icon={<Mail className="w-4 h-4" />}
        actions={
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {profileSaved && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-center gap-1 text-[12px] font-medium"
                  style={{ color: "rgba(34, 197, 94, 0.8)" }}
                >
                  <Check className="w-3.5 h-3.5" />
                  Saved
                </motion.span>
              )}
            </AnimatePresence>
            <Button
              variant="primary"
              size="sm"
              onClick={() => profileFormik.handleSubmit()}
              loading={profileMutation.isPending}
              disabled={profileMutation.isPending || !profileFormik.isValid}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Full Name"
            name="full_name"
            value={profileFormik.values.fullName}
            onChange={(e) => profileFormik.setFieldValue("fullName", e.target.value)}
            onBlur={() => profileFormik.setFieldTouched("fullName", true)}
            placeholder="Your full name"
            required
            error={profileFormik.touched.fullName && profileFormik.errors.fullName ? profileFormik.errors.fullName : undefined}
          />
          <TextField
            label="Email Address"
            name="email_addr"
            type="email"
            value={profileFormik.values.email}
            onChange={(e) => profileFormik.setFieldValue("email", e.target.value)}
            onBlur={() => profileFormik.setFieldTouched("email", true)}
            placeholder="name@company.com"
            required
            hint="This is your primary login email"
            error={profileFormik.touched.email && profileFormik.errors.email ? profileFormik.errors.email : undefined}
          />
          <TextField
            label="Job Role"
            name="job_role"
            value={profileFormik.values.jobRole}
            onChange={(e) => profileFormik.setFieldValue("jobRole", e.target.value)}
            onBlur={() => profileFormik.setFieldTouched("jobRole", true)}
            placeholder="e.g. Senior Software Engineer"
            required
            icon={<Briefcase className="w-4 h-4" />}
            error={profileFormik.touched.jobRole && profileFormik.errors.jobRole ? profileFormik.errors.jobRole : undefined}
          />
          <Select
            label="Experience Level"
            value={profileFormik.values.experience}
            onChange={(value) => profileFormik.setFieldValue("experience", value)}
            options={[
              { value: "intern", label: "Intern / Student" },
              { value: "entry", label: "Entry Level (0-2 years)" },
              { value: "mid", label: "Mid Level (2-5 years)" },
              { value: "senior", label: "Senior Level (5+ years)" },
              { value: "lead", label: "Lead / Manager" },
            ]}
            required
            icon={<TrendingUp className="w-4 h-4" />}
            error={profileFormik.touched.experience && profileFormik.errors.experience ? profileFormik.errors.experience : undefined}
          />
        </div>
      </Card>
      <Card
        title="Password Management"
        description="Update your password regularly for better security."
        icon={<KeyRound className="w-4 h-4" />}
        actions={
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {passwordSaved && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-center gap-1 text-[12px] font-medium"
                  style={{ color: "rgba(34, 197, 94, 0.8)" }}
                >
                  <Check className="w-3.5 h-3.5" />
                  Saved
                </motion.span>
              )}
            </AnimatePresence>
            <Button
              variant="primary"
              size="sm"
              onClick={() => passwordFormik.handleSubmit()}
              loading={passwordMutation.isPending}
              disabled={
                passwordMutation.isPending ||
                !passwordFormik.isValid ||
                !passwordFormik.dirty
              }
            >
              Update Password
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <AnimatePresence>
            {passwordFormik.status && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className=" px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest bg-[#D83B2A]/5 border border-[#D83B2A]/20 text-[#D83B2A]"
              >
                {passwordFormik.status}
              </motion.div>
            )}
          </AnimatePresence>

          {data.hasPassword && (
            <PasswordField
              label="Current Password"
              name="current_password"
              value={passwordFormik.values.currentPassword}
              onChange={(e) => {
                passwordFormik.setFieldValue("currentPassword", e.target.value);
                passwordFormik.setStatus(undefined);
              }}
              onBlur={() => passwordFormik.setFieldTouched("currentPassword", true)}
              placeholder="Enter current password"
              autoComplete="current-password"
              error={passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword ? passwordFormik.errors.currentPassword : undefined}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordField
              label="New Password"
              name="new_password"
              value={passwordFormik.values.newPassword}
              onChange={(e) => {
                passwordFormik.setFieldValue("newPassword", e.target.value);
                passwordFormik.setStatus(undefined);
              }}
              onBlur={() => passwordFormik.setFieldTouched("newPassword", true)}
              placeholder="Enter new password"
              hint="Minimum 8 characters"
              autoComplete="new-password"
              error={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword ? passwordFormik.errors.newPassword : undefined}
            />
            <PasswordField
              label="Confirm New Password"
              name="confirm_password"
              value={passwordFormik.values.confirmPassword}
              onChange={(e) => {
                passwordFormik.setFieldValue("confirmPassword", e.target.value);
                passwordFormik.setStatus(undefined);
              }}
              onBlur={() => passwordFormik.setFieldTouched("confirmPassword", true)}
              placeholder="Repeat new password"
              autoComplete="new-password"
              error={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword ? passwordFormik.errors.confirmPassword : undefined}
            />
          </div>
          {passwordFormik.values.newPassword.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
                  Password strength
                </span>
                <span
                  className="text-[12px] font-semibold"
                  style={{
                    color:
                      passwordFormik.values.newPassword.length >= 12
                        ? "rgba(34, 197, 94, 0.8)"
                        : passwordFormik.values.newPassword.length >= 8
                          ? "rgba(234, 179, 8, 0.8)"
                          : "rgba(239, 68, 68, 0.8)",
                  }}
                >
                  {passwordFormik.values.newPassword.length >= 12
                    ? "Strong"
                    : passwordFormik.values.newPassword.length >= 8
                      ? "Medium"
                      : "Weak"}
                </span>
              </div>
              <div
                className="h-1 bg-[var(--d-border)] overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      passwordFormik.values.newPassword.length >= 12
                        ? "100%"
                        : passwordFormik.values.newPassword.length >= 8
                          ? "60%"
                          : "30%",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full "
                  style={{
                    background:
                      passwordFormik.values.newPassword.length >= 12
                        ? "linear-gradient(90deg, rgba(34, 197, 94, 0.5), rgba(34, 197, 94, 0.8))"
                        : passwordFormik.values.newPassword.length >= 8
                          ? "linear-gradient(90deg, rgba(234, 179, 8, 0.4), rgba(234, 179, 8, 0.7))"
                          : "linear-gradient(90deg, rgba(239, 68, 68, 0.4), rgba(239, 68, 68, 0.7))",
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </Card>
      <Card
        title="Multi-Factor Authentication"
        description="Add an extra layer of security to protect your account."
        icon={<Shield className="w-4 h-4" />}
        actions={
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {mfaSaved && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-center gap-1 text-[12px] font-medium"
                  style={{ color: "rgba(34, 197, 94, 0.8)" }}
                >
                  <Check className="w-3.5 h-3.5" />
                  Saved
                </motion.span>
              )}
            </AnimatePresence>
            <Button
              variant="primary"
              size="sm"
              onClick={handleMfaSave}
              loading={mfaMutation.isPending}
              disabled={mfaMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          <CardRow
            label="Enable MFA"
            description="Require a second factor when loging in to your account."
          >
            <Toggle checked={mfaEnabled} onChange={setMfaEnabled} size="md" />
          </CardRow>

          <AnimatePresence>
            {mfaEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className=""
              >
                <div className="space-y-4 pt-1">
                  <Select
                    label="Authentication Method"
                    options={[
                      {
                        value: "app",
                        label: "Authenticator App",
                        description: "Use Google Authenticator, Authy, etc.",
                        icon: <Smartphone className="w-4 h-4" />,
                      },
                      {
                        value: "sms",
                        label: "SMS Verification",
                        description: "Receive codes via text message",
                        icon: <Mail className="w-4 h-4" />,
                      },
                    ]}
                    value={mfaMethod}
                    onChange={(value) => setMfaMethod(value as "app" | "sms")}
                    hint="Authenticator apps are generally more secure than SMS."
                  />

                  {mfaMethod === "app" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-4 flex items-start gap-4 bg-[var(--d-surface-active)] border border-[var(--d-border)]"
                    >
                      <div
                        className="w-24 h-24 shrink-0 flex items-center justify-center bg-[var(--d-surface)] border border-[var(--d-border)]"
                      >
                        <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-14 h-14">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div
                              key={i}
                              className=""
                              style={{
                                backgroundColor:
                                  Math.random() > 0.4
                                    ? "var(--text-primary)"
                                    : "transparent",
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="font-mono text-[11px] font-bold uppercase tracking-widest mb-1 text-[var(--text-primary)]"
                        >
                          Scan QR Code
                        </p>
                        <p
                          className="font-sans text-[12px] leading-relaxed mb-3 text-[var(--text-secondary)]"
                        >
                          Scan this QR code with your authenticator app to set
                          up two-factor authentication.
                        </p>
                        <div className="flex items-center gap-2">
                          <TextField
                            value=""
                            onChange={() => {}}
                            placeholder="Enter 6-digit code"
                            className="flex-1"
                          />
                          <Button variant="secondary" size="md">
                            Verify
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {mfaMethod === "sms" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <TextField
                        label="Phone Number"
                        type="tel"
                        value=""
                        onChange={() => {}}
                        placeholder="+1 (555) 000-0000"
                        hint="We'll send a verification code to this number."
                        icon={<Smartphone className="w-4 h-4" />}
                      />
                    </motion.div>
                  )}

                  <div className="flex items-center gap-2">
                    <Badge variant="green" size="sm">
                      Recommended
                    </Badge>
                    <span
                      className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)]"
                    >
                      MFA significantly reduces the risk of unauthorized access
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
      <Card
        title="Linked Accounts"
        description="Connect external accounts to pull project data and enable OAuth sign-in."
        icon={<LinkIcon className="w-4 h-4" />}
      >
        <div className="space-y-1">
          {linkedAccounts.map((account, i) => {
            const Icon = iconMap[account.provider];
            return (
              <div
                key={`${account.provider}-${i}`}
                className="flex items-center justify-between gap-4 py-3.5 border-b border-[var(--glass-border)] last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-9 h-9 flex items-center justify-center shrink-0 transition-colors duration-200 border border-[var(--glass-border)] ${account.connected ? "bg-[var(--d-surface-active)] text-[var(--text-primary)]" : "bg-transparent text-[var(--text-secondary)]"}`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-sans text-[14px] font-bold text-[var(--text-primary)]"
                      >
                        {account.label}
                      </span>
                      {account.connected && (
                        <Badge variant="green" size="sm">
                          Connected
                        </Badge>
                      )}
                    </div>
                    {account.connected && account.email && (
                      <p
                        className="font-mono text-[11px] mt-0.5 truncate text-[var(--text-secondary)]"
                      >
                        {account.email}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  variant={account.connected ? "ghost" : "secondary"}
                  size="sm"
                  onClick={() => toggleLinkedAccount(account.provider)}
                  loading={linkedAccountMutation.isPending}
                  disabled={linkedAccountMutation.isPending}
                  icon={
                    account.connected ? (
                      <Unlink className="w-3.5 h-3.5" />
                    ) : (
                      <LinkIcon className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {account.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            );
          })}

          <p
            className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)] pt-3"
          >
            Linking accounts allows for faster sign-in and enables the Discovery
            Agent to pull relevant project data from connected platforms.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
