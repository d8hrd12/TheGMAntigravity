package androidx.webkit.internal;

import java.util.concurrent.Callable;
import org.chromium.support_lib_boundary.WebViewPageBoundaryInterface;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class WebNavigationClientAdapter$$ExternalSyntheticLambda0 implements Callable {
    public final /* synthetic */ WebViewPageBoundaryInterface f$0;

    public /* synthetic */ WebNavigationClientAdapter$$ExternalSyntheticLambda0(WebViewPageBoundaryInterface webViewPageBoundaryInterface) {
        this.f$0 = webViewPageBoundaryInterface;
    }

    public final Object call() {
        return WebNavigationClientAdapter.lambda$onFirstContentfulPaint$6(this.f$0);
    }
}
