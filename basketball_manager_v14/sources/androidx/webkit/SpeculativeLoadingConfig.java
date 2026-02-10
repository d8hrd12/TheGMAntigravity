package androidx.webkit;

public class SpeculativeLoadingConfig {
    private final int mMaxPrefetches;
    private final int mMaxPrerenders;
    private final int mPrefetchTTLSeconds;

    private SpeculativeLoadingConfig(int ttlSecs, int maxPrefetches, int maxPrerenders) {
        this.mPrefetchTTLSeconds = ttlSecs;
        this.mMaxPrefetches = maxPrefetches;
        this.mMaxPrerenders = maxPrerenders;
    }

    public int getPrefetchTtlSeconds() {
        return this.mPrefetchTTLSeconds;
    }

    public int getMaxPrefetches() {
        return this.mMaxPrefetches;
    }

    public int getMaxPrerenders() {
        return this.mMaxPrerenders;
    }

    public static final class Builder {
        private int mMaxPrefetches;
        private int mMaxPrerenders;
        private int mPrefetchTTLSeconds;

        public Builder setPrefetchTtlSeconds(int ttlSeconds) {
            if (ttlSeconds > 0) {
                this.mPrefetchTTLSeconds = ttlSeconds;
                return this;
            }
            throw new IllegalArgumentException("Prefetch TTL must be greater than 0");
        }

        public Builder setMaxPrefetches(int max) {
            if (max >= 1) {
                this.mMaxPrefetches = max;
                return this;
            }
            throw new IllegalArgumentException("Max prefetches must be greater than 0");
        }

        public Builder setMaxPrerenders(int max) {
            if (max >= 1) {
                this.mMaxPrerenders = max;
                return this;
            }
            throw new IllegalArgumentException("Max prerenders must be greater than 0");
        }

        public SpeculativeLoadingConfig build() {
            return new SpeculativeLoadingConfig(this.mPrefetchTTLSeconds, this.mMaxPrefetches, this.mMaxPrerenders);
        }
    }
}
