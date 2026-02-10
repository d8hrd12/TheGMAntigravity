package androidx.webkit;

import android.app.PendingIntent;
import android.webkit.SafeBrowsingResponse;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.webkit.internal.SafeBrowsingResponseImpl;
import androidx.webkit.internal.WebResourceErrorImpl;
import androidx.webkit.internal.WebViewFeatureInternal;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.reflect.InvocationHandler;
import org.chromium.support_lib_boundary.WebViewClientBoundaryInterface;

public class WebViewClientCompat extends WebViewClient implements WebViewClientBoundaryInterface {
    private static final String[] sSupportedFeatures = {"VISUAL_STATE_CALLBACK", "RECEIVE_WEB_RESOURCE_ERROR", "RECEIVE_HTTP_ERROR", "SHOULD_OVERRIDE_WITH_REDIRECTS", "SAFE_BROWSING_HIT"};

    @Retention(RetentionPolicy.SOURCE)
    public @interface SafeBrowsingThreat {
    }

    public final String[] getSupportedFeatures() {
        return sSupportedFeatures;
    }

    public void onPageCommitVisible(WebView view, String url) {
    }

    public final void onReceivedError(WebView view, WebResourceRequest request, InvocationHandler handler) {
        onReceivedError(view, request, (WebResourceErrorCompat) new WebResourceErrorImpl(handler));
    }

    public final void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
        onReceivedError(view, request, (WebResourceErrorCompat) new WebResourceErrorImpl(error));
    }

    public void onReceivedError(WebView view, WebResourceRequest request, WebResourceErrorCompat error) {
        if (WebViewFeature.isFeatureSupported("WEB_RESOURCE_ERROR_GET_CODE") && WebViewFeature.isFeatureSupported("WEB_RESOURCE_ERROR_GET_DESCRIPTION") && request.isForMainFrame()) {
            onReceivedError(view, error.getErrorCode(), error.getDescription().toString(), request.getUrl().toString());
        }
    }

    public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
    }

    public final void onSafeBrowsingHit(WebView view, WebResourceRequest request, int threatType, InvocationHandler handler) {
        onSafeBrowsingHit(view, request, threatType, (SafeBrowsingResponseCompat) new SafeBrowsingResponseImpl(handler));
    }

    public final void onSafeBrowsingHit(WebView view, WebResourceRequest request, int threatType, SafeBrowsingResponse response) {
        onSafeBrowsingHit(view, request, threatType, (SafeBrowsingResponseCompat) new SafeBrowsingResponseImpl(response));
    }

    public void onSafeBrowsingHit(WebView view, WebResourceRequest request, int threatType, SafeBrowsingResponseCompat callback) {
        if (WebViewFeature.isFeatureSupported("SAFE_BROWSING_RESPONSE_SHOW_INTERSTITIAL")) {
            callback.showInterstitial(true);
            return;
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        return shouldOverrideUrlLoading(view, request.getUrl().toString());
    }

    public boolean onWebAuthnIntent(WebView view, PendingIntent intent, InvocationHandler callback) {
        return false;
    }
}
