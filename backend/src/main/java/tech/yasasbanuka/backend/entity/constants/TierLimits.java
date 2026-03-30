package tech.yasasbanuka.backend.entity.constants;

import tech.yasasbanuka.backend.entity.UsageQuota;

public enum TierLimits {
    EXPLORER(3, 1, 5, 1, 0, 1),
    STRATEGIST(20, 10, 20, 15, 10, 5),
    ARCHITECT(-1, -1, 50, -1, -1, -1);

    private final int cvAnalysisLimit;
    private final int jobSearchLimit;
    private final int jobResultsPerSearch;
    private final int interviewLimit;
    private final int autoApplyLimit;
    private final int cvVersionsLimit;

    TierLimits(int cvAnalysisLimit, int jobSearchLimit, int jobResultsPerSearch,
               int interviewLimit, int autoApplyLimit, int cvVersionsLimit) {
        this.cvAnalysisLimit = cvAnalysisLimit;
        this.jobSearchLimit = jobSearchLimit;
        this.jobResultsPerSearch = jobResultsPerSearch;
        this.interviewLimit = interviewLimit;
        this.autoApplyLimit = autoApplyLimit;
        this.cvVersionsLimit = cvVersionsLimit;
    }

    public static TierLimits of(Tier tier) {
        return switch (tier) {
            case EXPLORER   -> EXPLORER;
            case STRATEGIST -> STRATEGIST;
            case ARCHITECT  -> ARCHITECT;
        };
    }

    public void applyTo(UsageQuota quota) {
        quota.setCvAnalysisLimit(this.cvAnalysisLimit);
        quota.setJobSearchLimit(this.jobSearchLimit);
        quota.setJobResultsPerSearch(this.jobResultsPerSearch);
        quota.setInterviewLimit(this.interviewLimit);
        quota.setAutoApplyLimit(this.autoApplyLimit);
        quota.setCvVersionsLimit(this.cvVersionsLimit);
    }
}
