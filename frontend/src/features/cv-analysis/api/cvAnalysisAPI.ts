import { apiInstance } from "@/app/api/axios/api";
import { getToken } from "@/utils/auth";

export interface SkillGapDTO {
  matchedSkills: string[];
  missingEssentials: string[];
  bonusSkills: string[];
  technicalAlignmentScore: number;
}

export interface CvAnalysisResponseDTO {
  id: string;
  targetJobTitle: string;
  overallMatchScore: number;
  seniorityFit: string;
  skillGap: SkillGapDTO;
  redFlags: string[];
  interviewProbes: string[];
  semanticVerdict: string;
}

export const cvAnalysisAPI = {
  analyze: async (file: File, jobDescription: string) => {
    const token = await getToken();
    const formData = new FormData();
    formData.append("memberCV", file);
    formData.append("jobDescription", jobDescription);

    const response = await apiInstance({
      method: "POST",
      url: "/cv/analysis/upload",
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return response.data.data;
  },
};
