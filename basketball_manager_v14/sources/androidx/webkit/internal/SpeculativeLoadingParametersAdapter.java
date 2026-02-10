package androidx.webkit.internal;

import androidx.webkit.NoVarySearchHeader;
import androidx.webkit.SpeculativeLoadingParameters;
import java.lang.reflect.InvocationHandler;
import java.util.HashMap;
import java.util.Map;
import org.chromium.support_lib_boundary.SpeculativeLoadingParametersBoundaryInterface;
import org.chromium.support_lib_boundary.util.BoundaryInterfaceReflectionUtil;

public class SpeculativeLoadingParametersAdapter implements SpeculativeLoadingParametersBoundaryInterface {
    private final SpeculativeLoadingParameters mSpeculativeLoadingParameters;

    public SpeculativeLoadingParametersAdapter(SpeculativeLoadingParameters impl) {
        this.mSpeculativeLoadingParameters = impl;
    }

    public Map<String, String> getAdditionalHeaders() {
        if (this.mSpeculativeLoadingParameters == null) {
            return new HashMap();
        }
        return this.mSpeculativeLoadingParameters.getAdditionalHeaders();
    }

    public InvocationHandler getNoVarySearchData() {
        NoVarySearchHeader noVarySearchHeader;
        if (this.mSpeculativeLoadingParameters == null || (noVarySearchHeader = this.mSpeculativeLoadingParameters.getExpectedNoVarySearchData()) == null) {
            return null;
        }
        return BoundaryInterfaceReflectionUtil.createInvocationHandlerFor(new NoVarySearchHeaderAdapter(noVarySearchHeader));
    }

    public boolean isJavaScriptEnabled() {
        if (this.mSpeculativeLoadingParameters == null) {
            return false;
        }
        return this.mSpeculativeLoadingParameters.isJavaScriptEnabled();
    }
}
