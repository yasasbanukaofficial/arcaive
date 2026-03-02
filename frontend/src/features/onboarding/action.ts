'use server'
import { Member, SocialLinks } from "@/app/data/settings"
import { authAPI } from "../auth/api/authAPI"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export type FormState = {
    error?: string,
    success?: boolean
}

export async function onBoardMember(_prevState: FormState, formData: FormData): Promise<FormState> {
    const socialLinks = {
        githubURL: formData.get("githubLink") as string,
        linkedinURL: formData.get("linkedinLink") as string,
    }

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;
        if(token == undefined) {
            redirect("/login");
        }
        await authAPI.onboard(socialLinks as SocialLinks, token as string)
        return { success: true }
    } catch (error: unknown) {
        if (error && typeof error === "object") {
            const axiosErr = error as {
                response?: { data?: { message?: string; error?: string } };
                message?: string;
            };
            const message =
                axiosErr.response?.data?.message ||
                axiosErr.response?.data?.error ||
                axiosErr.message ||
                "Onboarding failed. Please try again.";
            return { error: message };
        }
        return { error: "Onboarding failed. Please try again." };
    }
}