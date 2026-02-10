package com.getcapacitor.cordova;

import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebView;
import org.apache.cordova.ICordovaCookieManager;

class CapacitorCordovaCookieManager implements ICordovaCookieManager {
    private final CookieManager cookieManager = CookieManager.getInstance();
    protected final WebView webView;

    public CapacitorCordovaCookieManager(WebView webview) {
        this.webView = webview;
        this.cookieManager.setAcceptThirdPartyCookies(this.webView, true);
    }

    public void setCookiesEnabled(boolean accept) {
        this.cookieManager.setAcceptCookie(accept);
    }

    public void setCookie(String url, String value) {
        this.cookieManager.setCookie(url, value);
    }

    public String getCookie(String url) {
        return this.cookieManager.getCookie(url);
    }

    public void clearCookies() {
        this.cookieManager.removeAllCookies((ValueCallback) null);
    }

    public void flush() {
        this.cookieManager.flush();
    }
}
