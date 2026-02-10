package androidx.webkit;

import android.content.Context;
import androidx.webkit.WebViewCompat;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class WebViewCompat$$ExternalSyntheticLambda0 implements Runnable {
    public final /* synthetic */ WebViewStartUpConfig f$0;
    public final /* synthetic */ WebViewCompat.WebViewStartUpCallback f$1;
    public final /* synthetic */ Context f$2;

    public /* synthetic */ WebViewCompat$$ExternalSyntheticLambda0(WebViewStartUpConfig webViewStartUpConfig, WebViewCompat.WebViewStartUpCallback webViewStartUpCallback, Context context) {
        this.f$0 = webViewStartUpConfig;
        this.f$1 = webViewStartUpCallback;
        this.f$2 = context;
    }

    public final void run() {
        WebViewCompat.lambda$startUpWebView$3(this.f$0, this.f$1, this.f$2);
    }
}
