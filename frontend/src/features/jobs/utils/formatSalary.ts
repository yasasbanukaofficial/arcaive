import { JobListing } from "@/@types/jobs";

export default function formatSalary(job: JobListing): string {
  if (job.salary) return job.salary;
  if (job.minSalary != null && job.maxSalary != null) {
    const period = job.salaryPeriod ? `/${job.salaryPeriod}` : "";
    return `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}${period}`;
  }
  if (job.minSalary != null) return `From $${job.minSalary.toLocaleString()}`;
  if (job.maxSalary != null) return `Up to $${job.maxSalary.toLocaleString()}`;
  return "Not specified";
}
