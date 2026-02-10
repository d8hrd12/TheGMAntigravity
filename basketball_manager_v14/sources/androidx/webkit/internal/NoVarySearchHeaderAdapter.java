package androidx.webkit.internal;

import androidx.webkit.NoVarySearchHeader;
import java.util.List;
import org.chromium.support_lib_boundary.NoVarySearchDataBoundaryInterface;

public class NoVarySearchHeaderAdapter implements NoVarySearchDataBoundaryInterface {
    private final NoVarySearchHeader mImpl;

    public NoVarySearchHeaderAdapter(NoVarySearchHeader impl) {
        this.mImpl = impl;
    }

    public boolean getVaryOnKeyOrder() {
        return this.mImpl.varyOnKeyOrder;
    }

    public boolean getIgnoreDifferencesInParameters() {
        return this.mImpl.ignoreDifferencesInParameters;
    }

    public List<String> getIgnoredQueryParameters() {
        return this.mImpl.ignoredQueryParameters;
    }

    public List<String> getConsideredQueryParameters() {
        return this.mImpl.consideredQueryParameters;
    }
}
