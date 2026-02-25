import AuthLayout from "@/features/auth/components/AuthLayout";
import OnBoardingForm from "@/features/onboarding/components/OnBoardingForm";

export default function onBoarding() {
    return (
        <AuthLayout
          title="Next Step"
          subtitle="Inorder to fully function we need a little bit more."
        >
          <OnBoardingForm />
        </AuthLayout>
      );
}