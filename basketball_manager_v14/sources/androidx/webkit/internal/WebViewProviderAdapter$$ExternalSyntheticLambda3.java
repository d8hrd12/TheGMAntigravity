package androidx.webkit.internal;

import android.webkit.ValueCallback;
import androidx.webkit.PrerenderException;
import androidx.webkit.PrerenderOperationCallback;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class WebViewProviderAdapter$$ExternalSyntheticLambda3 implements ValueCallback {
    public final /* synthetic */ PrerenderOperationCallback f$0;

    public /* synthetic */ WebViewProviderAdapter$$ExternalSyntheticLambda3(PrerenderOperationCallback prerenderOperationCallback) {
        this.f$0 = prerenderOperationCallback;
    }

    public final void onReceiveValue(Object obj) {
        this.f$0.onError(new PrerenderException("Prerender operation failed", (Throwable) obj));
    }
}
