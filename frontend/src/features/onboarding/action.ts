'use server'
import { Member, SocialLinks } from "@/@types/member"
import { authAPI } from "../auth/api/authAPI"
import { getToken } from "@/utils/auth"
import { extractErrorMessage } from "@/utils/errors"

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
        const token = await getToken();
        await authAPI.onboard(socialLinks as SocialLinks, token)
        return { success: true }
    } catch (err: unknown) {
        return { error: extractErrorMessage(err, "We couldn't save your profile right now. Please try again.", "onboarding") };
    }
}