package androidx.webkit.internal;

import android.os.CancellationSignal;
import android.webkit.CookieManager;
import android.webkit.GeolocationPermissions;
import android.webkit.ServiceWorkerController;
import android.webkit.WebStorage;
import androidx.webkit.OutcomeReceiverCompat;
import androidx.webkit.PrefetchException;
import androidx.webkit.Profile;
import androidx.webkit.SpeculativeLoadingConfig;
import androidx.webkit.SpeculativeLoadingParameters;
import java.util.concurrent.Executor;
import org.chromium.support_lib_boundary.ProfileBoundaryInterface;
import org.chromium.support_lib_boundary.util.BoundaryInterfaceReflectionUtil;

public class ProfileImpl implements Profile {
    private final ProfileBoundaryInterface mProfileImpl;

    ProfileImpl(ProfileBoundaryInterface profileImpl) {
        this.mProfileImpl = profileImpl;
    }

    private ProfileImpl() {
        this.mProfileImpl = null;
    }

    public String getName() {
        if (WebViewFeatureInternal.MULTI_PROFILE.isSupportedByWebView()) {
            return this.mProfileImpl.getName();
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public CookieManager getCookieManager() throws IllegalStateException {
        if (WebViewFeatureInternal.MULTI_PROFILE.isSupportedByWebView()) {
            return this.mProfileImpl.getCookieManager();
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public WebStorage getWebStorage() throws IllegalStateException {
        if (WebViewFeatureInternal.MULTI_PROFILE.isSupportedByWebView()) {
            return this.mProfileImpl.getWebStorage();
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public GeolocationPermissions getGeolocationPermissions() throws IllegalStateException {
        if (WebViewFeatureInternal.MULTI_PROFILE.isSupportedByWebView()) {
            return this.mProfileImpl.getGeoLocationPermissions();
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public ServiceWorkerController getServiceWorkerController() throws IllegalStateException {
        if (WebViewFeatureInternal.MULTI_PROFILE.isSupportedByWebView()) {
            return this.mProfileImpl.getServiceWorkerController();
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public void prefetchUrlAsync(String url, CancellationSignal cancellationSignal, Executor callbackExecutor, SpeculativeLoadingParameters params, OutcomeReceiverCompat<Void, PrefetchException> callback) {
        if (WebViewFeatureInternal.PROFILE_URL_PREFETCH.isSupportedByWebView()) {
            String url2 = url;
            CancellationSignal cancellationSignal2 = cancellationSignal;
            Executor callbackExecutor2 = callbackExecutor;
            this.mProfileImpl.prefetchUrl(url2, cancellationSignal2, callbackExecutor2, BoundaryInterfaceReflectionUtil.createInvocationHandlerFor(new SpeculativeLoadingParametersAdapter(params)), PrefetchOperationCallbackAdapter.buildInvocationHandler(callback));
            return;
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public void prefetchUrlAsync(String url, CancellationSignal cancellationSignal, Executor callbackExecutor, OutcomeReceiverCompat<Void, PrefetchException> callback) {
        if (WebViewFeatureInternal.PROFILE_URL_PREFETCH.isSupportedByWebView()) {
            this.mProfileImpl.prefetchUrl(url, cancellationSignal, callbackExecutor, PrefetchOperationCallbackAdapter.buildInvocationHandler(callback));
            return;
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public void clearPrefetchAsync(String url, Executor callbackExecutor, OutcomeReceiverCompat<Void, PrefetchException> callback) {
        if (WebViewFeatureInternal.PROFILE_URL_PREFETCH.isSupportedByWebView()) {
            this.mProfileImpl.clearPrefetch(url, callbackExecutor, PrefetchOperationCallbackAdapter.buildInvocationHandler(callback));
            return;
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public void setSpeculativeLoadingConfig(SpeculativeLoadingConfig speculativeLoadingConfig) {
        if (WebViewFeatureInternal.SPECULATIVE_LOADING_CONFIG.isSupportedByWebView()) {
            this.mProfileImpl.setSpeculativeLoadingConfig(BoundaryInterfaceReflectionUtil.createInvocationHandlerFor(new SpeculativeLoadingConfigAdapter(speculativeLoadingConfig)));
            return;
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }
}
