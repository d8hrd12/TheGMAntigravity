package org.apache.cordova.engine;

import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.net.http.SslError;
import android.webkit.ClientCertRequest;
import android.webkit.HttpAuthHandler;
import android.webkit.MimeTypeMap;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.ServiceWorkerClient;
import android.webkit.ServiceWorkerController;
import android.webkit.SslErrorHandler;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.internal.AssetHelper;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Hashtable;
import java.util.Iterator;
import org.apache.cordova.AuthenticationToken;
import org.apache.cordova.CordovaClientCertRequest;
import org.apache.cordova.CordovaHttpAuthHandler;
import org.apache.cordova.CordovaPluginPathHandler;
import org.apache.cordova.CordovaResourceApi;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.LOG;
import org.apache.cordova.PluginManager;

public class SystemWebViewClient extends WebViewClient {
    private static final String TAG = "SystemWebViewClient";
    /* access modifiers changed from: private */
    public final WebViewAssetLoader assetLoader;
    private Hashtable<String, AuthenticationToken> authenticationTokens = new Hashtable<>();
    private boolean doClearHistory = false;
    boolean isCurrentlyLoading;
    protected final SystemWebViewEngine parentEngine;

    public SystemWebViewClient(SystemWebViewEngine parentEngine2) {
        this.parentEngine = parentEngine2;
        WebViewAssetLoader.Builder assetLoaderBuilder = new WebViewAssetLoader.Builder().setDomain(parentEngine2.preferences.getString("hostname", "localhost").toLowerCase()).setHttpAllowed(true);
        assetLoaderBuilder.addPathHandler("/", new SystemWebViewClient$$ExternalSyntheticLambda0(this, parentEngine2));
        this.assetLoader = assetLoaderBuilder.build();
        if (parentEngine2.preferences.getBoolean("ResolveServiceWorkerRequests", true)) {
            ServiceWorkerController.getInstance().setServiceWorkerClient(new ServiceWorkerClient() {
                public WebResourceResponse shouldInterceptRequest(WebResourceRequest request) {
                    return SystemWebViewClient.this.assetLoader.shouldInterceptRequest(request.getUrl());
                }
            });
        }
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$new$0$org-apache-cordova-engine-SystemWebViewClient  reason: not valid java name */
    public /* synthetic */ WebResourceResponse m1713lambda$new$0$orgapachecordovaengineSystemWebViewClient(SystemWebViewEngine parentEngine2, String path) {
        WebResourceResponse response;
        try {
            PluginManager pluginManager = this.parentEngine.pluginManager;
            if (pluginManager != null) {
                Iterator<CordovaPluginPathHandler> it = pluginManager.getPluginPathHandlers().iterator();
                while (it.hasNext()) {
                    CordovaPluginPathHandler handler = it.next();
                    if (handler.getPathHandler() != null && (response = handler.getPathHandler().handle(path)) != null) {
                        return response;
                    }
                }
            }
            if (path.isEmpty()) {
                path = "index.html";
            }
            InputStream is = parentEngine2.webView.getContext().getAssets().open("www/" + path, 2);
            String mimeType = "text/html";
            String extension = MimeTypeMap.getFileExtensionFromUrl(path);
            if (extension != null) {
                if (!path.endsWith(".js")) {
                    if (!path.endsWith(".mjs")) {
                        if (path.endsWith(".wasm")) {
                            mimeType = "application/wasm";
                        } else {
                            mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
                        }
                    }
                }
                mimeType = "application/javascript";
            }
            return new WebResourceResponse(mimeType, (String) null, is);
        } catch (Exception e) {
            e.printStackTrace();
            LOG.e(TAG, e.getMessage());
            return null;
        }
    }

    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        return this.parentEngine.client.onNavigationAttempt(url);
    }

    public void onReceivedHttpAuthRequest(WebView view, HttpAuthHandler handler, String host, String realm) {
        AuthenticationToken token = getAuthenticationToken(host, realm);
        if (token != null) {
            handler.proceed(token.getUserName(), token.getPassword());
            return;
        }
        PluginManager pluginManager = this.parentEngine.pluginManager;
        if (pluginManager == null || !pluginManager.onReceivedHttpAuthRequest((CordovaWebView) null, new CordovaHttpAuthHandler(handler), host, realm)) {
            super.onReceivedHttpAuthRequest(view, handler, host, realm);
        } else {
            this.parentEngine.client.clearLoadTimeoutTimer();
        }
    }

    public void onReceivedClientCertRequest(WebView view, ClientCertRequest request) {
        PluginManager pluginManager = this.parentEngine.pluginManager;
        if (pluginManager == null || !pluginManager.onReceivedClientCertRequest((CordovaWebView) null, new CordovaClientCertRequest(request))) {
            super.onReceivedClientCertRequest(view, request);
        } else {
            this.parentEngine.client.clearLoadTimeoutTimer();
        }
    }

    public void onPageStarted(WebView view, String url, Bitmap favicon) {
        super.onPageStarted(view, url, favicon);
        this.isCurrentlyLoading = true;
        this.parentEngine.bridge.reset();
        this.parentEngine.client.onPageStarted(url);
    }

    public void onPageFinished(WebView view, String url) {
        super.onPageFinished(view, url);
        if (this.isCurrentlyLoading || url.startsWith("about:")) {
            this.isCurrentlyLoading = false;
            if (this.doClearHistory) {
                view.clearHistory();
                this.doClearHistory = false;
            }
            this.parentEngine.client.onPageFinishedLoading(url);
        }
    }

    public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
        if (this.isCurrentlyLoading) {
            LOG.d(TAG, "CordovaWebViewClient.onReceivedError: Error code=%s Description=%s URL=%s", Integer.valueOf(errorCode), description, failingUrl);
            if (errorCode == -10) {
                this.parentEngine.client.clearLoadTimeoutTimer();
                if (view.canGoBack()) {
                    view.goBack();
                    return;
                }
                super.onReceivedError(view, errorCode, description, failingUrl);
            }
            this.parentEngine.client.onReceivedError(errorCode, description, failingUrl);
        }
    }

    public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
        try {
            if ((this.parentEngine.cordova.getActivity().getPackageManager().getApplicationInfo(this.parentEngine.cordova.getActivity().getPackageName(), 128).flags & 2) != 0) {
                handler.proceed();
            } else {
                super.onReceivedSslError(view, handler, error);
            }
        } catch (PackageManager.NameNotFoundException e) {
            super.onReceivedSslError(view, handler, error);
        }
    }

    public void setAuthenticationToken(AuthenticationToken authenticationToken, String host, String realm) {
        if (host == null) {
            host = "";
        }
        if (realm == null) {
            realm = "";
        }
        this.authenticationTokens.put(host.concat(realm), authenticationToken);
    }

    public AuthenticationToken removeAuthenticationToken(String host, String realm) {
        return this.authenticationTokens.remove(host.concat(realm));
    }

    public AuthenticationToken getAuthenticationToken(String host, String realm) {
        AuthenticationToken token = this.authenticationTokens.get(host.concat(realm));
        if (token != null) {
            return token;
        }
        AuthenticationToken token2 = this.authenticationTokens.get(host);
        if (token2 == null) {
            token2 = this.authenticationTokens.get(realm);
        }
        if (token2 == null) {
            return this.authenticationTokens.get("");
        }
        return token2;
    }

    public void clearAuthenticationTokens() {
        this.authenticationTokens.clear();
    }

    public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
        try {
            if (!this.parentEngine.pluginManager.shouldAllowRequest(url)) {
                LOG.w(TAG, "URL blocked by allow list: " + url);
                return new WebResourceResponse(AssetHelper.DEFAULT_MIME_TYPE, "UTF-8", (InputStream) null);
            }
            CordovaResourceApi resourceApi = this.parentEngine.resourceApi;
            Uri origUri = Uri.parse(url);
            Uri remappedUri = resourceApi.remapUri(origUri);
            if (origUri.equals(remappedUri) && !needsSpecialsInAssetUrlFix(origUri)) {
                if (!needsContentUrlFix(origUri)) {
                    return null;
                }
            }
            CordovaResourceApi.OpenForReadResult result = resourceApi.openForRead(remappedUri, true);
            return new WebResourceResponse(result.mimeType, "UTF-8", result.inputStream);
        } catch (IOException e) {
            if (!(e instanceof FileNotFoundException)) {
                LOG.e(TAG, "Error occurred while loading a file (returning a 404).", (Throwable) e);
            }
            return new WebResourceResponse(AssetHelper.DEFAULT_MIME_TYPE, "UTF-8", (InputStream) null);
        }
    }

    private static boolean needsContentUrlFix(Uri uri) {
        return "content".equals(uri.getScheme());
    }

    private static boolean needsSpecialsInAssetUrlFix(Uri uri) {
        if (CordovaResourceApi.getUriType(uri) != 1) {
            return false;
        }
        if (uri.getQuery() == null && uri.getFragment() == null) {
            return !uri.toString().contains("%") ? false : false;
        }
        return true;
    }

    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        return this.assetLoader.shouldInterceptRequest(request.getUrl());
    }

    public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
        PluginManager pluginManager = this.parentEngine.pluginManager;
        if (pluginManager == null || !pluginManager.onRenderProcessGone(view, detail)) {
            return super.onRenderProcessGone(view, detail);
        }
        return true;
    }
}
