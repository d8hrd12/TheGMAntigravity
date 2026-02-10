package androidx.webkit;

import androidx.webkit.WebViewCompat;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class WebViewCompat$$ExternalSyntheticLambda3 implements Runnable {
    public final /* synthetic */ WebViewCompat.WebViewStartUpCallback f$0;

    public /* synthetic */ WebViewCompat$$ExternalSyntheticLambda3(WebViewCompat.WebViewStartUpCallback webViewStartUpCallback) {
        this.f$0 = webViewStartUpCallback;
    }

    public final void run() {
        this.f$0.onSuccess(new WebViewCompat.NullReturningWebViewStartUpResult());
    }
}
