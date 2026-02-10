package com.getcapacitor.plugin;

import android.webkit.JavascriptInterface;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.UnsupportedEncodingException;
import java.net.CookieHandler;
import java.net.CookiePolicy;
import java.net.CookieStore;
import java.net.HttpCookie;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin
public class CapacitorCookies extends Plugin {
    CapacitorCookieManager cookieManager;

    public void load() {
        this.bridge.getWebView().addJavascriptInterface(this, "CapacitorCookiesAndroidInterface");
        this.cookieManager = new CapacitorCookieManager((CookieStore) null, CookiePolicy.ACCEPT_ALL, this.bridge);
        this.cookieManager.removeSessionCookies();
        CookieHandler.setDefault(this.cookieManager);
        super.load();
    }

    /* access modifiers changed from: protected */
    public void handleOnDestroy() {
        super.handleOnDestroy();
        this.cookieManager.removeSessionCookies();
    }

    @JavascriptInterface
    public boolean isEnabled() {
        return getBridge().getConfig().getPluginConfiguration("CapacitorCookies").getBoolean("enabled", false);
    }

    @JavascriptInterface
    public void setCookie(String domain, String action) {
        this.cookieManager.setCookie(domain, action);
    }

    @PluginMethod
    public void getCookies(PluginCall call) {
        this.bridge.eval("document.cookie", new CapacitorCookies$$ExternalSyntheticLambda0(call));
    }

    static /* synthetic */ void lambda$getCookies$0(PluginCall call, String value) {
        String[] cookieArray = value.substring(1, value.length() - 1).split(";");
        JSObject cookieMap = new JSObject();
        for (String cookie : cookieArray) {
            if (cookie.length() > 0) {
                String[] keyValue = cookie.split("=", 2);
                if (keyValue.length == 2) {
                    String key = keyValue[0].trim();
                    String val = keyValue[1].trim();
                    try {
                        key = URLDecoder.decode(keyValue[0].trim(), StandardCharsets.UTF_8.name());
                        val = URLDecoder.decode(keyValue[1].trim(), StandardCharsets.UTF_8.name());
                    } catch (UnsupportedEncodingException e) {
                    }
                    cookieMap.put(key, val);
                }
            }
        }
        call.resolve(cookieMap);
    }

    @PluginMethod
    public void setCookie(PluginCall call) {
        String key = call.getString("key");
        if (key == null) {
            call.reject("Must provide key");
        }
        String value = call.getString("value");
        if (value == null) {
            call.reject("Must provide value");
        }
        this.cookieManager.setCookie(call.getString("url"), key, value, call.getString("expires", ""), call.getString("path", "/"));
        call.resolve();
    }

    @PluginMethod
    public void deleteCookie(PluginCall call) {
        String key = call.getString("key");
        if (key == null) {
            call.reject("Must provide key");
        }
        this.cookieManager.setCookie(call.getString("url"), key + "=; Expires=Wed, 31 Dec 2000 23:59:59 GMT");
        call.resolve();
    }

    @PluginMethod
    public void clearCookies(PluginCall call) {
        String url = call.getString("url");
        HttpCookie[] cookies = this.cookieManager.getCookies(url);
        int length = cookies.length;
        for (int i = 0; i < length; i++) {
            this.cookieManager.setCookie(url, cookies[i].getName() + "=; Expires=Wed, 31 Dec 2000 23:59:59 GMT");
        }
        call.resolve();
    }

    @PluginMethod
    public void clearAllCookies(PluginCall call) {
        this.cookieManager.removeAllCookies();
        call.resolve();
    }
}
