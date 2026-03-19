import { apiInstance } from "@/app/api/axios/api";
import { mapToJobListing } from "@/features/jobs/utils/mockMapper";
import type { JobListing } from "@/@types/jobs";
import { getToken } from "@/utils/auth";

const JOB_SEARCH_URL = `${process.env.NEXT_PUBLIC_API_URL}/jobs`;
const CACHE_KEY = "arcaive_jobs_cache";

export const jobAPI = {
  get: async (location?: any) => {
    try {
      const params = {location};
      const token = await getToken();
      const response = await apiInstance({
        method: "GET", 
        url: "/search", 
        baseURL: JOB_SEARCH_URL,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
        params,
      });

      const rawJobs: any[] = response.data?.data ?? [];
      const jobs = rawJobs.map(mapToJobListing);

      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(jobs));
      } catch (e) {
        console.warn("Session Storage failed", e);
      }

      return jobs;
    } catch (error) {
      console.error("Critical error in jobAPI.get:", error);
      throw error; 
    }
  },
  getCached: (): JobListing[] | null => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  },
  getCachedJob: (jobId: string): JobListing | null => {
    const jobs = jobAPI.getCached();
    if (!jobs) return null;
    return jobs.find((j) => j.id === jobId) ?? null;
  },
};
