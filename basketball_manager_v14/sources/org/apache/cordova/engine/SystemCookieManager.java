package org.apache.cordova.engine;

import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebView;
import org.apache.cordova.ICordovaCookieManager;

class SystemCookieManager implements ICordovaCookieManager {
    private final CookieManager cookieManager = CookieManager.getInstance();
    protected final WebView webView;

    public SystemCookieManager(WebView webview) {
        this.webView = webview;
        this.cookieManager.setAcceptThirdPartyCookies(this.webView, true);
    }

    public void setAcceptFileSchemeCookies() {
        CookieManager.setAcceptFileSchemeCookies(true);
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
