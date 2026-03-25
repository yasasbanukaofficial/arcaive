package tech.yasasbanuka.backend.entity.constants;

public enum MemberTier {
    EXPLORER("Explorer"),
    STRATEGIST("Strategist"),
    ARCHITECT("Architect");

    private final String tierDescription;
    MemberTier(String tierDescription) {
        this.tierDescription = tierDescription;
    }
}