import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const registerSchema = Yup.object({
  memberFullName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  memberEmail: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  memberPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("memberPassword")], "Passwords do not match")
    .required("Please confirm your password"),
  jobRole: Yup.string()
    .required("Job role is required"),
  experience: Yup.string()
    .required("Experience is required"),
  country: Yup.string()
    .required("Country is required"),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
});

export const profileSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
});

export const passwordChangeSchema = (hasPassword: boolean) =>
  Yup.object({
    currentPassword: hasPassword
      ? Yup.string().required("Current password is required")
      : Yup.string().notRequired(),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords do not match")
      .required("Please confirm your new password"),
  });
