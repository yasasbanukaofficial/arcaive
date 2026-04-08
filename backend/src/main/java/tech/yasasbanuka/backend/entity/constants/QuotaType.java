package tech.yasasbanuka.backend.entity.constants;

import tech.yasasbanuka.backend.entity.UsageQuota;

public enum QuotaType {
    CV_ANALYSIS {
        @Override public int getUsed(UsageQuota q) { return q.getCvAnalysisUsed(); }
        @Override public int getLimit(UsageQuota q) { return q.getCvAnalysisLimit(); }
        @Override public void increment(UsageQuota q) { q.setCvAnalysisUsed(q.getCvAnalysisUsed() + 1); }
    },
    JOB_SEARCH {
        @Override public int getUsed(UsageQuota q) { return q.getJobSearchUsed(); }
        @Override public int getLimit(UsageQuota q) { return q.getJobSearchLimit(); }
        @Override public void increment(UsageQuota q) { q.setJobSearchUsed(q.getJobSearchUsed() + 1); }
    },
    MOCK_INTERVIEW {
        @Override public int getUsed(UsageQuota q) { return q.getInterviewUsed(); }
        @Override public int getLimit(UsageQuota q) { return q.getInterviewLimit(); }
        @Override public void increment(UsageQuota q) { q.setInterviewUsed(q.getInterviewUsed() + 1); }
    },
    AUTO_APPLY {
        @Override public int getUsed(UsageQuota q) { return q.getAutoApplyUsed(); }
        @Override public int getLimit(UsageQuota q) { return q.getAutoApplyLimit(); }
        @Override public void increment(UsageQuota q) { q.setAutoApplyUsed(q.getAutoApplyUsed() + 1); }
    },
    CV_CREATION {
        @Override public int getUsed(UsageQuota q) { return q.getCvCreationsStored(); }
        @Override public int getLimit(UsageQuota q) { return q.getCvCreationsLimit(); }
        @Override public void increment(UsageQuota q) { q.setCvCreationsStored(q.getCvCreationsStored() + 1); }
    };

    public abstract int getUsed(UsageQuota q);
    public abstract int getLimit(UsageQuota q);
    public abstract void increment(UsageQuota q);

    public boolean isExceeded(UsageQuota q) {
        int limit = getLimit(q);
        return limit != -1 && getUsed(q) >= limit;
    }
}