package androidx.webkit.internal;

import android.net.Uri;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebViewClient;
import androidx.webkit.PrerenderOperationCallback;
import androidx.webkit.Profile;
import androidx.webkit.SpeculativeLoadingParameters;
import androidx.webkit.WebMessageCompat;
import androidx.webkit.WebMessagePortCompat;
import androidx.webkit.WebNavigationClient;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewRenderProcess;
import androidx.webkit.WebViewRenderProcessClient;
import java.lang.reflect.InvocationHandler;
import java.util.concurrent.Executor;
import org.chromium.support_lib_boundary.ProfileBoundaryInterface;
import org.chromium.support_lib_boundary.WebViewProviderBoundaryInterface;
import org.chromium.support_lib_boundary.util.BoundaryInterfaceReflectionUtil;

public class WebViewProviderAdapter {
    final WebViewProviderBoundaryInterface mImpl;

    public WebViewProviderAdapter(WebViewProviderBoundaryInterface impl) {
        this.mImpl = impl;
    }

    public void insertVisualStateCallback(long requestId, WebViewCompat.VisualStateCallback callback) {
        this.mImpl.insertVisualStateCallback(requestId, BoundaryInterfaceReflectionUtil.createInvocationHandlerFor(new VisualStateCallbackAdapter(callback)));
    }

    public WebMessagePortCompat[] createWebMessageChannel() {
        InvocationHandler[] invocationHandlers = this.mImpl.createWebMessageChannel();
        WebMessagePortCompat[] messagePorts = new WebMessagePortCompat[invocationHandlers.length];
        for (int n = 0; n < invocationHandlers.length; n++) {
            messagePorts[n] = new WebMessagePortImpl(invocationHandlers[n]);
        }
        return messagePorts;
    }

    public void postWebMessage(WebMessageCompat message, Uri targetOrigin) {
        this.mImpl.postMessageToMainFrame(BoundaryInterfaceReflectionUtil.createInvocationHandlerFor(new WebMessageAdapter(message)), targetOrigin);
    }

    public void addWebMessageListener(String jsObjectName, String[] allowedOriginRules, WebViewCompat.WebMessageListener listener) {
        this.mImpl.addWebMessageListener(jsObjectName, allowedOriginRules, BoundaryInterfaceReflectionUtil.createInvocationHandlerFor(new WebMessageListenerAdapter(listener)));
    }

    public ScriptHandlerImpl addDocumentStartJavaScript(String script, String[] allowedOriginRules) {
        return ScriptHandlerImpl.toScriptHandler(this.mImpl.addDocumentStartJavaScript(script, allowedOriginRules));
    }

    public void removeWebMessageListener(String jsObjectName) {
        this.mImpl.removeWebMessageListener(jsObjectName);
    }

    public WebViewClient getWebViewClient() {
        return this.mImpl.getWebViewClient();
    }

    public WebChromeClient getWebChromeClient() {
        return this.mImpl.getWebChromeClient();
    }

    public WebViewRenderProcess getWebViewRenderProcess() {
        return WebViewRenderProcessImpl.forInvocationHandler(this.mImpl.getWebViewRenderer());
    }

    public WebViewRenderProcessClient getWebViewRenderProcessClient() {
        InvocationHandler handler = this.mImpl.getWebViewRendererClient();
        if (handler == null) {
            return null;
        }
        return ((WebViewRenderProcessClientAdapter) BoundaryInterfaceReflectionUtil.getDelegateFromInvocationHandler(handler)).getWebViewRenderProcessClient();
    }

    public void setWebViewRenderProcessClient(Executor executor, WebViewRenderProcessClient webViewRenderProcessClient) {
        InvocationHandler handler;
        if (webViewRenderProcessClient != null) {
            handler = BoundaryInterfaceReflectionUtil.createInvocationHandlerFor(new WebViewRenderProcessClientAdapter(executor, webViewRenderProcessClient));
        } else {
            handler = null;
        }
        this.mImpl.setWebViewRendererClient(handler);
    }

    public void setProfileWithName(String profileName) {
        this.mImpl.setProfile(profileName);
    }

    public Profile getProfile() {
        return new ProfileImpl((ProfileBoundaryInterface) BoundaryInterfaceReflectionUtil.castToSuppLibClass(ProfileBoundaryInterface.class, this.mImpl.getProfile()));
    }

    public boolean isAudioMuted() {
        return this.mImpl.isAudioMuted();
    }

    public void setAudioMuted(boolean mute) {
        this.mImpl.setAudioMuted(mute);
    }

    public void prerenderUrlAsync(String url, CancellationSignal cancellationSignal, Executor callbackExecutor, PrerenderOperationCallback callback) {
        ValueCallback<Throwable> errorCallback = new WebViewProviderAdapter$$ExternalSyntheticLambda3(callback);
        this.mImpl.prerenderUrl(url, cancellationSignal, callbackExecutor, new WebViewProviderAdapter$$ExternalSyntheticLambda2(callback), errorCallback);
    }

    public void prerenderUrlAsync(String url, CancellationSignal cancellationSignal, Executor callbackExecutor, SpeculativeLoadingParameters params, PrerenderOperationCallback callback) {
        this.mImpl.prerenderUrl(url, cancellationSignal, callbackExecutor, BoundaryInterfaceReflectionUtil.createInvocationHandlerFor(new SpeculativeLoadingParametersAdapter(params)), new WebViewProviderAdapter$$ExternalSyntheticLambda0(callback), new WebViewProviderAdapter$$ExternalSyntheticLambda1(callback));
    }

    public void saveState(Bundle outState, int maxSizeBytes, boolean includeForwardState) {
        this.mImpl.saveState(outState, maxSizeBytes, includeForwardState);
    }

    public void setWebNavigationClient(WebNavigationClient client) {
        this.mImpl.setWebViewNavigationClient(BoundaryInterfaceReflectionUtil.createInvocationHandlerFor(new WebNavigationClientAdapter(client)));
    }

    public WebNavigationClient getWebNavigationClient() {
        InvocationHandler client = this.mImpl.getWebViewNavigationClient();
        if (client == null) {
            return null;
        }
        return ((WebNavigationClientAdapter) BoundaryInterfaceReflectionUtil.getDelegateFromInvocationHandler(client)).getWebNavigationClient();
    }
}
