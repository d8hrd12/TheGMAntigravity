package com.getcapacitor;

import android.graphics.Bitmap;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class BridgeWebViewClient extends WebViewClient {
    private Bridge bridge;

    public BridgeWebViewClient(Bridge bridge2) {
        this.bridge = bridge2;
    }

    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        return this.bridge.getLocalServer().shouldInterceptRequest(request);
    }

    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        return this.bridge.launchIntent(request.getUrl());
    }

    public void onPageFinished(WebView view, String url) {
        super.onPageFinished(view, url);
        if (this.bridge.getWebViewListeners() != null && view.getProgress() == 100) {
            for (WebViewListener listener : this.bridge.getWebViewListeners()) {
                listener.onPageLoaded(view);
            }
        }
    }

    public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
        super.onReceivedError(view, request, error);
        if (this.bridge.getWebViewListeners() != null) {
            for (WebViewListener listener : this.bridge.getWebViewListeners()) {
                listener.onReceivedError(view);
            }
        }
        String errorPath = this.bridge.getErrorUrl();
        if (errorPath != null && request.isForMainFrame()) {
            view.loadUrl(errorPath);
        }
    }

    public void onPageStarted(WebView view, String url, Bitmap favicon) {
        super.onPageStarted(view, url, favicon);
        this.bridge.reset();
        if (this.bridge.getWebViewListeners() != null) {
            for (WebViewListener listener : this.bridge.getWebViewListeners()) {
                listener.onPageStarted(view);
            }
        }
    }

    public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
        super.onReceivedHttpError(view, request, errorResponse);
        if (this.bridge.getWebViewListeners() != null) {
            for (WebViewListener listener : this.bridge.getWebViewListeners()) {
                listener.onReceivedHttpError(view);
            }
        }
        String errorPath = this.bridge.getErrorUrl();
        if (errorPath != null && request.isForMainFrame()) {
            view.loadUrl(errorPath);
        }
    }

    public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
        super.onRenderProcessGone(view, detail);
        boolean result = false;
        if (this.bridge.getWebViewListeners() != null) {
            for (WebViewListener listener : this.bridge.getWebViewListeners()) {
                result = listener.onRenderProcessGone(view, detail) || result;
            }
        }
        return result;
    }

    public void onPageCommitVisible(WebView view, String url) {
        super.onPageCommitVisible(view, url);
        if (this.bridge.getWebViewListeners() != null) {
            for (WebViewListener listener : this.bridge.getWebViewListeners()) {
                listener.onPageCommitVisible(view, url);
            }
        }
    }
}
