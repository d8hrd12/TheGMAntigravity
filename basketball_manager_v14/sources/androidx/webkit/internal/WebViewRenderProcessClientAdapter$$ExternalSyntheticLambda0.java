package androidx.webkit.internal;

import android.webkit.WebView;
import androidx.webkit.WebViewRenderProcess;
import androidx.webkit.WebViewRenderProcessClient;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class WebViewRenderProcessClientAdapter$$ExternalSyntheticLambda0 implements Runnable {
    public final /* synthetic */ WebViewRenderProcessClient f$0;
    public final /* synthetic */ WebView f$1;
    public final /* synthetic */ WebViewRenderProcess f$2;

    public /* synthetic */ WebViewRenderProcessClientAdapter$$ExternalSyntheticLambda0(WebViewRenderProcessClient webViewRenderProcessClient, WebView webView, WebViewRenderProcess webViewRenderProcess) {
        this.f$0 = webViewRenderProcessClient;
        this.f$1 = webView;
        this.f$2 = webViewRenderProcess;
    }

    public final void run() {
        this.f$0.onRenderProcessResponsive(this.f$1, this.f$2);
    }
}
