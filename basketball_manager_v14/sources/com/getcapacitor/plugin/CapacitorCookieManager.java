package com.getcapacitor.plugin;

import android.webkit.ValueCallback;
import com.getcapacitor.Bridge;
import com.getcapacitor.Logger;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.CookieStore;
import java.net.HttpCookie;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

public class CapacitorCookieManager extends CookieManager {
    private final String TAG;
    private final String localUrl;
    private final String serverUrl;
    private final android.webkit.CookieManager webkitCookieManager;

    public CapacitorCookieManager(Bridge bridge) {
        this((CookieStore) null, (CookiePolicy) null, bridge);
    }

    public CapacitorCookieManager(CookieStore store, CookiePolicy policy, Bridge bridge) {
        super(store, policy);
        this.TAG = "CapacitorCookies";
        this.webkitCookieManager = android.webkit.CookieManager.getInstance();
        this.localUrl = bridge.getLocalUrl();
        this.serverUrl = bridge.getServerUrl();
    }

    public void removeSessionCookies() {
        this.webkitCookieManager.removeSessionCookies((ValueCallback) null);
    }

    public String getSanitizedDomain(String url) throws URISyntaxException {
        if (this.serverUrl != null && !this.serverUrl.isEmpty() && (url == null || url.isEmpty() || this.serverUrl.contains(url))) {
            url = this.serverUrl;
        } else if (this.localUrl == null || this.localUrl.isEmpty() || (url != null && !url.isEmpty() && !this.localUrl.contains(url))) {
            try {
                String scheme = new URI(url).getScheme();
                if (scheme == null || scheme.isEmpty()) {
                    url = "https://" + url;
                }
            } catch (URISyntaxException e) {
                Logger.error("CapacitorCookies", "Failed to get scheme from URL.", e);
            }
        } else {
            url = this.localUrl;
        }
        try {
            new URI(url);
            return url;
        } catch (Exception error) {
            Logger.error("CapacitorCookies", "Failed to get sanitized URL.", error);
            throw error;
        }
    }

    private String getDomainFromCookieString(String cookie) throws URISyntaxException {
        String[] domain = cookie.toLowerCase(Locale.ROOT).split("domain=");
        return getSanitizedDomain(domain.length <= 1 ? null : domain[1].split(";")[0].trim());
    }

    public String getCookieString(String url) {
        try {
            String url2 = getSanitizedDomain(url);
            Logger.info("CapacitorCookies", "Getting cookies at: '" + url2 + "'");
            return this.webkitCookieManager.getCookie(url2);
        } catch (Exception error) {
            Logger.error("CapacitorCookies", "Failed to get cookies at the given URL.", error);
            return null;
        }
    }

    public HttpCookie getCookie(String url, String key) {
        for (HttpCookie cookie : getCookies(url)) {
            if (cookie.getName().equals(key)) {
                return cookie;
            }
        }
        return null;
    }

    public HttpCookie[] getCookies(String url) {
        try {
            ArrayList<HttpCookie> cookieList = new ArrayList<>();
            String cookieString = getCookieString(url);
            if (cookieString != null) {
                for (String c : cookieString.split(";")) {
                    HttpCookie parsed = HttpCookie.parse(c).get(0);
                    parsed.setValue(parsed.getValue());
                    cookieList.add(parsed);
                }
            }
            return (HttpCookie[]) cookieList.toArray(new HttpCookie[cookieList.size()]);
        } catch (Exception e) {
            return new HttpCookie[0];
        }
    }

    public void setCookie(String url, String value) {
        try {
            String url2 = getSanitizedDomain(url);
            Logger.info("CapacitorCookies", "Setting cookie '" + value + "' at: '" + url2 + "'");
            this.webkitCookieManager.setCookie(url2, value);
            flush();
        } catch (Exception error) {
            Logger.error("CapacitorCookies", "Failed to set cookie.", error);
        }
    }

    public void setCookie(String url, String key, String value) {
        setCookie(url, key + "=" + value);
    }

    public void setCookie(String url, String key, String value, String expires, String path) {
        setCookie(url, key + "=" + value + "; expires=" + expires + "; path=" + path);
    }

    public void removeAllCookies() {
        this.webkitCookieManager.removeAllCookies((ValueCallback) null);
        flush();
    }

    public void flush() {
        this.webkitCookieManager.flush();
    }

    public void put(URI uri, Map<String, List<String>> responseHeaders) {
        if (uri != null && responseHeaders != null) {
            for (String headerKey : responseHeaders.keySet()) {
                if (headerKey != null && (headerKey.equalsIgnoreCase("Set-Cookie2") || headerKey.equalsIgnoreCase("Set-Cookie"))) {
                    for (String headerValue : (List) Objects.requireNonNull(responseHeaders.get(headerKey))) {
                        try {
                            setCookie(uri.toString(), headerValue);
                            setCookie(getDomainFromCookieString(headerValue), headerValue);
                        } catch (Exception e) {
                        }
                    }
                }
            }
        }
    }

    public Map<String, List<String>> get(URI uri, Map<String, List<String>> requestHeaders) {
        if (uri == null || requestHeaders == null) {
            throw new IllegalArgumentException("Argument is null");
        }
        String url = uri.toString();
        Map<String, List<String>> res = new HashMap<>();
        String cookie = getCookieString(url);
        if (cookie != null) {
            res.put("Cookie", Collections.singletonList(cookie));
        }
        return res;
    }

    public CookieStore getCookieStore() {
        throw new UnsupportedOperationException();
    }
}
