package androidx.webkit;

import java.util.ArrayList;
import java.util.List;

public class NoVarySearchHeader {
    public final List<String> consideredQueryParameters;
    public final boolean ignoreDifferencesInParameters;
    public final List<String> ignoredQueryParameters;
    public final boolean varyOnKeyOrder;

    private NoVarySearchHeader(boolean varyOnKeyOrder2, boolean ignoreDifferencesInParameters2, List<String> ignoredQueryParameters2, List<String> consideredQueryParameters2) {
        this.varyOnKeyOrder = varyOnKeyOrder2;
        this.ignoreDifferencesInParameters = ignoreDifferencesInParameters2;
        this.ignoredQueryParameters = ignoredQueryParameters2;
        this.consideredQueryParameters = consideredQueryParameters2;
    }

    public static NoVarySearchHeader neverVaryHeader() {
        return new NoVarySearchHeader(false, true, new ArrayList(), new ArrayList());
    }

    public static NoVarySearchHeader alwaysVaryHeader() {
        return new NoVarySearchHeader(true, false, new ArrayList(), new ArrayList());
    }

    public static NoVarySearchHeader neverVaryExcept(boolean varyOnOrdering, List<String> consideredQueryParameters2) {
        return new NoVarySearchHeader(varyOnOrdering, true, new ArrayList(), consideredQueryParameters2);
    }

    public static NoVarySearchHeader varyExcept(boolean varyOnOrdering, List<String> ignoredQueryParameters2) {
        return new NoVarySearchHeader(varyOnOrdering, false, ignoredQueryParameters2, new ArrayList());
    }
}
