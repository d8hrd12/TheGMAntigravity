package androidx.webkit;

import android.os.Handler;
import android.os.Looper;
import androidx.webkit.WebViewCompat;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class WebViewCompat$$ExternalSyntheticLambda2 implements WebViewCompat.WebViewStartUpCallback {
    public final /* synthetic */ WebViewCompat.WebViewStartUpCallback f$0;

    public /* synthetic */ WebViewCompat$$ExternalSyntheticLambda2(WebViewCompat.WebViewStartUpCallback webViewStartUpCallback) {
        this.f$0 = webViewStartUpCallback;
    }

    public final void onSuccess(WebViewStartUpResult webViewStartUpResult) {
        new Handler(Looper.getMainLooper()).post(new WebViewCompat$$ExternalSyntheticLambda1(this.f$0, webViewStartUpResult));
    }
}
