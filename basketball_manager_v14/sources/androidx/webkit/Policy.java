package androidx.webkit;

import java.util.ArrayList;
import java.util.List;
import org.chromium.support_lib_boundary.WebViewBuilderBoundaryInterface;

public final class Policy {
    private final List<ConfigRunnable> mBehaviors;

    private interface ConfigRunnable {
        void configure(WebViewBuilderBoundaryInterface.Config config) throws WebViewBuilderException;
    }

    private Policy(List<ConfigRunnable> behaviors) {
        this.mBehaviors = behaviors;
    }

    /* access modifiers changed from: package-private */
    public void configure(WebViewBuilderBoundaryInterface.Config config) throws WebViewBuilderException {
        for (ConfigRunnable behavior : this.mBehaviors) {
            behavior.configure(config);
        }
    }

    public static final class Builder {
        final List<ConfigRunnable> mBehaviors = new ArrayList();

        public Policy build() {
            return new Policy(this.mBehaviors);
        }
    }
}
