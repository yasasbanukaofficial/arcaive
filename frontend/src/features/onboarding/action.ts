'use server'
import { getToken } from "@/utils/auth"

export type FormState = {
    error?: string,
    success?: boolean
}

export async function onBoardMember(_prevState: FormState, _formData: FormData): Promise<FormState> {
    try {
        await getToken();
        return { success: true }
    } catch (err: unknown) {
        const msg = (err as any)?.response?.data?.message;
        return { error: msg || "We couldn't save your profile right now. Please try again." };
    }
}