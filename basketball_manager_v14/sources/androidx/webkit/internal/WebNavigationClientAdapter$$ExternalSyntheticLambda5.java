package androidx.webkit.internal;

import java.util.concurrent.Callable;
import org.chromium.support_lib_boundary.WebViewPageBoundaryInterface;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class WebNavigationClientAdapter$$ExternalSyntheticLambda5 implements Callable {
    public final /* synthetic */ WebViewPageBoundaryInterface f$0;

    public /* synthetic */ WebNavigationClientAdapter$$ExternalSyntheticLambda5(WebViewPageBoundaryInterface webViewPageBoundaryInterface) {
        this.f$0 = webViewPageBoundaryInterface;
    }

    public final Object call() {
        return WebNavigationClientAdapter.lambda$onPageDOMContentLoadedEventFired$5(this.f$0);
    }
}
