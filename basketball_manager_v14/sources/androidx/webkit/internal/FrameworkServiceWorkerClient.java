package androidx.webkit.internal;

import android.webkit.ServiceWorkerClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import androidx.webkit.ServiceWorkerClientCompat;

public class FrameworkServiceWorkerClient extends ServiceWorkerClient {
    private final ServiceWorkerClientCompat mImpl;

    public FrameworkServiceWorkerClient(ServiceWorkerClientCompat impl) {
        this.mImpl = impl;
    }

    public WebResourceResponse shouldInterceptRequest(WebResourceRequest request) {
        return this.mImpl.shouldInterceptRequest(request);
    }
}
