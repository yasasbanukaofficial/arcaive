package tech.yasasbanuka.backend.entity.constants;

public enum Tier {
    EXPLORER, STRATEGIST, ARCHITECT;
    
    public boolean isUnlimited(int limit) {
        return limit == -1;
    }
}
