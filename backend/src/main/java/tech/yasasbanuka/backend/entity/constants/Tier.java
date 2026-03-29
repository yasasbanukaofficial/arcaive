package tech.yasasbanuka.backend.entity.constants;

import java.math.BigDecimal;

public enum Tier {
    EXPLORER(0),
    STRATEGIST(2900),
    ARCHITECT(9900);

    private final long priceInCents;

    Tier(long priceInCents) {
        this.priceInCents = priceInCents;
    }

    public BigDecimal getPriceInCents() {
        return BigDecimal.valueOf(this.priceInCents);
    }

    public boolean isUnlimited(int limit) {
        return limit == -1;
    }
}
