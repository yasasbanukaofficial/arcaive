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
} from "lucide-react";
import Card, { CardRow } from "@/components/ui/Card";
import TextField from "@/components/ui/TextField";
import PasswordField from "@/components/ui/PasswordField";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import type { MemberIdentityData, LinkedAccount } from "@/@types/member";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberAPI } from "../api/memberAPI";

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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaMethod, setMfaMethod] = useState<"app" | "sms">("app");
  const [mfaSaved, setMfaSaved] = useState(false);

  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const queryClient = useQueryClient();


  const profileMutation = useMutation({
    mutationFn: async (payload: { memberFullName: string; memberEmail: string }) =>
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
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 3000);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      setPasswordError(msg || "Failed to update password. Please try again.");
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

  useEffect(() => {
    if (data) {
      setFullName(data.memberFullName || "");
      setEmail(data.memberEmail || "");
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-[14px] text-gray-400">Loading profile data...</p>
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

  const handleProfileSave = async () => {
    profileMutation.mutate({
      memberFullName: fullName,
      memberEmail: email,
    });
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    const hasPassword = data.hasPassword === true;

    if (hasPassword && !currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (hasPassword && newPassword === currentPassword) {
      setPasswordError("New password cannot be the same as your current password");
      return;
    }

    passwordMutation.mutate({
      currentPassword: hasPassword ? currentPassword : "",
      newPassword,
    });
  };

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
              onClick={handleProfileSave}
              loading={profileMutation.isPending}
              disabled={profileMutation.isPending}
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            required
          />
          <TextField
            label="Email Address"
            name="email_addr"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            hint="This is your primary login email"
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
              onClick={handlePasswordChange}
              loading={passwordMutation.isPending}
              disabled={
                passwordMutation.isPending ||
                (data.hasPassword && !currentPassword) ||
                !newPassword ||
                !confirmPassword
              }
            >
              Update Password
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {passwordError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl px-4 py-2.5 text-[13px] font-medium"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.06)",
                border: "1px solid rgba(239, 68, 68, 0.15)",
                color: "rgba(239, 68, 68, 0.8)",
              }}
            >
              {passwordError}
            </motion.div>
          )}

          {data.hasPassword && (
            <PasswordField
              label="Current Password"
              name="current_password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder="Enter current password"
              autoComplete="current-password"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordField
              label="New Password"
              name="new_password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder="Enter new password"
              hint="Minimum 8 characters"
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirm New Password"
              name="confirm_password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder="Repeat new password"
              autoComplete="new-password"
              error={
                confirmPassword && newPassword !== confirmPassword
                  ? "Passwords don't match"
                  : undefined
              }
            />
          </div>
          {newPassword.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[12px] font-medium"
                  style={{ color: "var(--d-text-muted)" }}
                >
                  Password strength
                </span>
                <span
                  className="text-[12px] font-semibold"
                  style={{
                    color:
                      newPassword.length >= 12
                        ? "rgba(34, 197, 94, 0.8)"
                        : newPassword.length >= 8
                          ? "rgba(234, 179, 8, 0.8)"
                          : "rgba(239, 68, 68, 0.8)",
                  }}
                >
                  {newPassword.length >= 12
                    ? "Strong"
                    : newPassword.length >= 8
                      ? "Medium"
                      : "Weak"}
                </span>
              </div>
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--d-surface-active)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      newPassword.length >= 12
                        ? "100%"
                        : newPassword.length >= 8
                          ? "60%"
                          : "30%",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      newPassword.length >= 12
                        ? "linear-gradient(90deg, rgba(34, 197, 94, 0.5), rgba(34, 197, 94, 0.8))"
                        : newPassword.length >= 8
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
                className="overflow-hidden"
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
                      className="rounded-xl p-4 flex items-start gap-4"
                      style={{
                        backgroundColor: "rgba(59, 130, 246, 0.04)",
                        border: "1px solid rgba(59, 130, 246, 0.1)",
                      }}
                    >
                      <div
                        className="w-24 h-24 rounded-xl shrink-0 flex items-center justify-center"
                        style={{
                          backgroundColor: "var(--d-surface-active)",
                          border: "1px solid var(--d-border)",
                        }}
                      >
                        <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-14 h-14">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div
                              key={i}
                              className="rounded-xs"
                              style={{
                                backgroundColor:
                                  Math.random() > 0.4
                                    ? "var(--d-text-muted)"
                                    : "transparent",
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[13px] font-medium mb-1"
                          style={{ color: "var(--d-text-secondary)" }}
                        >
                          Scan QR Code
                        </p>
                        <p
                          className="text-[12px] leading-relaxed mb-3"
                          style={{ color: "var(--d-text-muted)" }}
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
                      className="text-[12px]"
                      style={{ color: "var(--d-text-muted)" }}
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
                className="flex items-center justify-between gap-4 py-3.5"
                style={{
                  borderBottom: "1px solid var(--d-border-subtle)",
                }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200"
                    style={{
                      backgroundColor: account.connected
                        ? "var(--d-surface-active)"
                        : "var(--d-surface)",
                      border: `1px solid ${
                        account.connected
                          ? "var(--d-border-hover)"
                          : "var(--d-border)"
                      }`,
                      color: account.connected
                        ? "var(--d-text-secondary)"
                        : "var(--d-text-muted)",
                    }}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[13px] font-medium"
                        style={{ color: "var(--d-text-secondary)" }}
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
                        className="text-[12px] mt-0.5 truncate"
                        style={{ color: "var(--d-text-muted)" }}
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
            className="text-[12px] pt-3"
            style={{ color: "var(--d-text-muted)" }}
          >
            Linking accounts allows for faster sign-in and enables the Discovery
            Agent to pull relevant project data from connected platforms.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
