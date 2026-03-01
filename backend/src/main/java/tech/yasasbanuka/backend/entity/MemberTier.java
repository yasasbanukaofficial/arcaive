package tech.yasasbanuka.backend.entity;

public enum MemberTier {
    STARTER("Basic package"),
    PRO("Medium Premium Package"),
    LIFETIME("Custome Package tailored according to the user's request");

    private final String tierDescription;
    MemberTier(String tierDescription) {
        this.tierDescription = tierDescription;
    }
}