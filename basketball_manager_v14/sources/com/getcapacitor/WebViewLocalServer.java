package com.getcapacitor;

import android.content.Context;
import android.net.Uri;
import android.util.Base64;
import android.webkit.CookieManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import androidx.core.location.LocationRequestCompat;
import com.getcapacitor.plugin.util.CapacitorHttpUrlConnection;
import com.getcapacitor.plugin.util.HttpRequestHandler;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class WebViewLocalServer {
    private static final String capacitorContentStart = "/_capacitor_content_";
    private static final String capacitorFileStart = "/_capacitor_file_";
    private final ArrayList<String> authorities;
    /* access modifiers changed from: private */
    public String basePath;
    /* access modifiers changed from: private */
    public final Bridge bridge;
    private final boolean html5mode;
    /* access modifiers changed from: private */
    public boolean isAsset;
    private final JSInjector jsInjector;
    /* access modifiers changed from: private */
    public final AndroidProtocolHandler protocolHandler;
    private final UriMatcher uriMatcher = new UriMatcher((Object) null);

    public static abstract class PathHandler {
        private String charset;
        private String encoding;
        protected String mimeType;
        private String reasonPhrase;
        private Map<String, String> responseHeaders;
        private int statusCode;

        public abstract InputStream handle(Uri uri);

        public PathHandler() {
            this((String) null, (String) null, 200, "OK", (Map<String, String>) null);
        }

        public PathHandler(String encoding2, String charset2, int statusCode2, String reasonPhrase2, Map<String, String> responseHeaders2) {
            Map<String, String> tempResponseHeaders;
            this.encoding = encoding2;
            this.charset = charset2;
            this.statusCode = statusCode2;
            this.reasonPhrase = reasonPhrase2;
            if (responseHeaders2 == null) {
                tempResponseHeaders = new HashMap<>();
            } else {
                tempResponseHeaders = responseHeaders2;
            }
            tempResponseHeaders.put("Cache-Control", "no-cache");
            this.responseHeaders = tempResponseHeaders;
        }

        public InputStream handle(WebResourceRequest request) {
            return handle(request.getUrl());
        }

        public String getEncoding() {
            return this.encoding;
        }

        public String getCharset() {
            return this.charset;
        }

        public int getStatusCode() {
            return this.statusCode;
        }

        public String getReasonPhrase() {
            return this.reasonPhrase;
        }

        public Map<String, String> getResponseHeaders() {
            return this.responseHeaders;
        }
    }

    WebViewLocalServer(Context context, Bridge bridge2, JSInjector jsInjector2, ArrayList<String> authorities2, boolean html5mode2) {
        this.html5mode = html5mode2;
        this.protocolHandler = new AndroidProtocolHandler(context.getApplicationContext());
        this.authorities = authorities2;
        this.bridge = bridge2;
        this.jsInjector = jsInjector2;
    }

    private static Uri parseAndVerifyUrl(String url) {
        if (url == null) {
            return null;
        }
        Uri uri = Uri.parse(url);
        if (uri == null) {
            Logger.error("Malformed URL: " + url);
            return null;
        }
        String path = uri.getPath();
        if (path != null && !path.isEmpty()) {
            return uri;
        }
        Logger.error("URL does not have a path: " + url);
        return null;
    }

    public WebResourceResponse shouldInterceptRequest(WebResourceRequest request) {
        PathHandler handler;
        Uri loadingUrl = request.getUrl();
        if (loadingUrl.getPath() == null || !loadingUrl.getPath().startsWith(Bridge.CAPACITOR_HTTP_INTERCEPTOR_START)) {
            synchronized (this.uriMatcher) {
                handler = (PathHandler) this.uriMatcher.match(request.getUrl());
            }
            if (handler == null) {
                return null;
            }
            if (!isLocalFile(loadingUrl) && !isMainUrl(loadingUrl) && isAllowedUrl(loadingUrl) && !isErrorUrl(loadingUrl)) {
                return handleProxyRequest(request, handler);
            }
            Logger.debug("Handling local request: " + request.getUrl().toString());
            return handleLocalRequest(request, handler);
        }
        Logger.debug("Handling CapacitorHttp request: " + loadingUrl);
        try {
            return handleCapacitorHttpRequest(request);
        } catch (Exception e) {
            Logger.error(e.getLocalizedMessage());
            return null;
        }
    }

    private boolean isLocalFile(Uri uri) {
        String path = uri.getPath();
        return path.startsWith("/_capacitor_content_") || path.startsWith("/_capacitor_file_");
    }

    private boolean isErrorUrl(Uri uri) {
        return uri.toString().equals(this.bridge.getErrorUrl());
    }

    private boolean isMainUrl(Uri loadingUrl) {
        return this.bridge.getServerUrl() == null && loadingUrl.getHost().equalsIgnoreCase(this.bridge.getHost());
    }

    private boolean isAllowedUrl(Uri loadingUrl) {
        return this.bridge.getServerUrl() != null || this.bridge.getAppAllowNavigationMask().matches(loadingUrl.getHost());
    }

    private String getReasonPhraseFromResponseCode(int code) {
        switch (code) {
            case LocationRequestCompat.QUALITY_HIGH_ACCURACY:
                return "Continue";
            case 101:
                return "Switching Protocols";
            case 200:
                return "OK";
            case 201:
                return "Created";
            case 202:
                return "Accepted";
            case 203:
                return "Non-Authoritative Information";
            case 204:
                return "No Content";
            case 205:
                return "Reset Content";
            case 206:
                return "Partial Content";
            case 300:
                return "Multiple Choices";
            case 301:
                return "Moved Permanently";
            case 302:
                return "Found";
            case 303:
                return "See Other";
            case 304:
                return "Not Modified";
            case 400:
                return "Bad Request";
            case 401:
                return "Unauthorized";
            case 403:
                return "Forbidden";
            case 404:
                return "Not Found";
            case 405:
                return "Method Not Allowed";
            case 406:
                return "Not Acceptable";
            case 407:
                return "Proxy Authentication Required";
            case 408:
                return "Request Timeout";
            case 409:
                return "Conflict";
            case 410:
                return "Gone";
            case 500:
                return "Internal Server Error";
            case 501:
                return "Not Implemented";
            case 502:
                return "Bad Gateway";
            case 503:
                return "Service Unavailable";
            case 504:
                return "Gateway Timeout";
            case 505:
                return "HTTP Version Not Supported";
            default:
                return "Unknown";
        }
    }

    private WebResourceResponse handleCapacitorHttpRequest(WebResourceRequest request) throws IOException {
        String mimeType;
        String urlString;
        String urlString2 = request.getUrl().getQueryParameter(Bridge.CAPACITOR_HTTP_INTERCEPTOR_URL_PARAM);
        URL url = new URL(urlString2);
        JSObject headers = new JSObject();
        for (Map.Entry<String, String> header : request.getRequestHeaders().entrySet()) {
            headers.put(header.getKey(), header.getValue());
        }
        String userAgentValue = headers.getString("x-cap-user-agent");
        if (userAgentValue != null) {
            headers.put("User-Agent", userAgentValue);
        }
        headers.remove("x-cap-user-agent");
        CapacitorHttpUrlConnection connection = new HttpRequestHandler.HttpURLConnectionBuilder().setUrl(url).setMethod(request.getMethod()).setHeaders(headers).openConnection().build();
        if (!HttpRequestHandler.isDomainExcludedFromSSL(this.bridge, url).booleanValue()) {
            connection.setSSLSocketFactory(this.bridge);
        }
        connection.connect();
        String mimeType2 = null;
        Map<String, String> responseHeaders = new LinkedHashMap<>();
        String encoding = null;
        for (Map.Entry<String, List<String>> entry : connection.getHeaderFields().entrySet()) {
            StringBuilder builder = new StringBuilder();
            for (String value : entry.getValue()) {
                builder.append(value);
                builder.append(", ");
            }
            builder.setLength(builder.length() - 2);
            if ("Content-Type".equalsIgnoreCase(entry.getKey())) {
                String[] contentTypeParts = builder.toString().split(";");
                mimeType2 = contentTypeParts[0].trim();
                if (contentTypeParts.length > 1) {
                    String[] encodingParts = contentTypeParts[1].split("=");
                    urlString = urlString2;
                    if (encodingParts.length > 1) {
                        encoding = encodingParts[1].trim();
                    }
                } else {
                    urlString = urlString2;
                }
            } else {
                urlString = urlString2;
                responseHeaders.put(entry.getKey(), builder.toString());
            }
            urlString2 = urlString;
        }
        InputStream inputStream = connection.getErrorStream();
        if (inputStream == null) {
            inputStream = connection.getInputStream();
        }
        if (mimeType2 == null) {
            mimeType = getMimeType(request.getUrl().getPath(), inputStream);
        } else {
            mimeType = mimeType2;
        }
        int responseCode = connection.getResponseCode();
        return new WebResourceResponse(mimeType, encoding, responseCode, getReasonPhraseFromResponseCode(responseCode), responseHeaders, inputStream);
    }

    private WebResourceResponse handleLocalRequest(WebResourceRequest request, PathHandler handler) {
        InputStream responseStream;
        InputStream responseStream2;
        InputStream responseStream3;
        int statusCode;
        int range;
        WebResourceRequest webResourceRequest = request;
        PathHandler pathHandler = handler;
        String path = webResourceRequest.getUrl().getPath();
        if (webResourceRequest.getRequestHeaders().get("Range") != null) {
            InputStream responseStream4 = new LollipopLazyInputStream(pathHandler, webResourceRequest);
            String mimeType = getMimeType(path, responseStream4);
            Map<String, String> tempResponseHeaders = pathHandler.getResponseHeaders();
            try {
                int totalRange = responseStream4.available();
                String rangeString = webResourceRequest.getRequestHeaders().get("Range");
                String[] parts = rangeString.split("=");
                String[] streamParts = parts[1].split("-");
                String fromRange = streamParts[0];
                int range2 = totalRange - 1;
                if (streamParts.length > 1) {
                    try {
                        range = Integer.parseInt(streamParts[1]);
                    } catch (IOException e) {
                        statusCode = 404;
                        return new WebResourceResponse(mimeType, pathHandler.getEncoding(), statusCode, pathHandler.getReasonPhrase(), tempResponseHeaders, responseStream4);
                    }
                } else {
                    range = range2;
                }
                String str = rangeString;
                tempResponseHeaders.put("Accept-Ranges", "bytes");
                String[] strArr = parts;
                tempResponseHeaders.put("Content-Range", "bytes " + fromRange + "-" + range + "/" + totalRange);
                statusCode = 206;
            } catch (IOException e2) {
                statusCode = 404;
                return new WebResourceResponse(mimeType, pathHandler.getEncoding(), statusCode, pathHandler.getReasonPhrase(), tempResponseHeaders, responseStream4);
            }
            return new WebResourceResponse(mimeType, pathHandler.getEncoding(), statusCode, pathHandler.getReasonPhrase(), tempResponseHeaders, responseStream4);
        } else if (isLocalFile(webResourceRequest.getUrl()) || isErrorUrl(webResourceRequest.getUrl())) {
            InputStream responseStream5 = new LollipopLazyInputStream(pathHandler, webResourceRequest);
            return new WebResourceResponse(getMimeType(webResourceRequest.getUrl().getPath(), responseStream5), pathHandler.getEncoding(), getStatusCode(responseStream5, pathHandler.getStatusCode()), pathHandler.getReasonPhrase(), pathHandler.getResponseHeaders(), responseStream5);
        } else if (path.equals("/cordova.js")) {
            return new WebResourceResponse("application/javascript", pathHandler.getEncoding(), pathHandler.getStatusCode(), pathHandler.getReasonPhrase(), pathHandler.getResponseHeaders(), (InputStream) null);
        } else {
            if (path.equals("/") || (!webResourceRequest.getUrl().getLastPathSegment().contains(".") && this.html5mode)) {
                try {
                    String startPath = this.basePath + "/index.html";
                    if (this.bridge.getRouteProcessor() != null) {
                        ProcessedRoute processedRoute = this.bridge.getRouteProcessor().process(this.basePath, "/index.html");
                        startPath = processedRoute.getPath();
                        this.isAsset = processedRoute.isAsset();
                    }
                    if (this.isAsset) {
                        responseStream = this.protocolHandler.openAsset(startPath);
                    } else {
                        responseStream = this.protocolHandler.openFile(startPath);
                    }
                    if (this.jsInjector != null) {
                        responseStream2 = this.jsInjector.getInjectedStream(responseStream);
                    } else {
                        responseStream2 = responseStream;
                    }
                    return new WebResourceResponse("text/html", pathHandler.getEncoding(), getStatusCode(responseStream2, pathHandler.getStatusCode()), pathHandler.getReasonPhrase(), pathHandler.getResponseHeaders(), responseStream2);
                } catch (IOException e3) {
                    Logger.error("Unable to open index.html", e3);
                    return null;
                }
            } else {
                if ("/favicon.ico".equalsIgnoreCase(path)) {
                    try {
                        return new WebResourceResponse("image/png", (String) null, (InputStream) null);
                    } catch (Exception e4) {
                        Logger.error("favicon handling failed", e4);
                    }
                }
                if (path.lastIndexOf(".") < 0) {
                    return null;
                }
                String ext = path.substring(path.lastIndexOf("."));
                InputStream responseStream6 = new LollipopLazyInputStream(pathHandler, webResourceRequest);
                if (!ext.equals(".html") || this.jsInjector == null) {
                    responseStream3 = responseStream6;
                } else {
                    responseStream3 = this.jsInjector.getInjectedStream(responseStream6);
                }
                return new WebResourceResponse(getMimeType(path, responseStream3), pathHandler.getEncoding(), getStatusCode(responseStream3, pathHandler.getStatusCode()), pathHandler.getReasonPhrase(), pathHandler.getResponseHeaders(), responseStream3);
            }
        }
    }

    public InputStream getJavaScriptInjectedStream(InputStream original) {
        if (this.jsInjector != null) {
            return this.jsInjector.getInjectedStream(original);
        }
        return original;
    }

    private WebResourceResponse handleProxyRequest(WebResourceRequest request, PathHandler handler) {
        if (this.jsInjector == null) {
            return null;
        }
        String method = request.getMethod();
        if (!method.equals("GET")) {
            return null;
        }
        try {
            String url = request.getUrl().toString();
            Map<String, String> headers = request.getRequestHeaders();
            boolean isHtmlText = false;
            Iterator<Map.Entry<String, String>> it = headers.entrySet().iterator();
            while (true) {
                if (!it.hasNext()) {
                    break;
                }
                Map.Entry<String, String> header = it.next();
                if (header.getKey().equalsIgnoreCase("Accept") && header.getValue().toLowerCase().contains("text/html")) {
                    isHtmlText = true;
                    break;
                }
            }
            if (!isHtmlText) {
                return null;
            }
            HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
            for (Map.Entry<String, String> header2 : headers.entrySet()) {
                conn.setRequestProperty(header2.getKey(), header2.getValue());
            }
            String getCookie = CookieManager.getInstance().getCookie(url);
            if (getCookie != null) {
                conn.setRequestProperty("Cookie", getCookie);
            }
            conn.setRequestMethod(method);
            conn.setReadTimeout(30000);
            conn.setConnectTimeout(30000);
            if (request.getUrl().getUserInfo() != null) {
                conn.setRequestProperty("Authorization", "Basic " + Base64.encodeToString(request.getUrl().getUserInfo().getBytes(StandardCharsets.UTF_8), 2));
            }
            List<String> cookies = (List) conn.getHeaderFields().get("Set-Cookie");
            if (cookies != null) {
                for (String cookie : cookies) {
                    CookieManager.getInstance().setCookie(url, cookie);
                }
            }
            InputStream responseStream = conn.getInputStream();
            return new WebResourceResponse("text/html", handler.getEncoding(), handler.getStatusCode(), handler.getReasonPhrase(), handler.getResponseHeaders(), this.jsInjector.getInjectedStream(responseStream));
        } catch (Exception ex) {
            this.bridge.handleAppUrlLoadError(ex);
            return null;
        }
    }

    private String getMimeType(String path, InputStream stream) {
        String mimeType = null;
        try {
            mimeType = URLConnection.guessContentTypeFromName(path);
            if (mimeType != null) {
                if (path.endsWith(".js") && mimeType.equals("image/x-icon")) {
                    Logger.debug("We shouldn't be here");
                }
            }
            if (mimeType != null) {
                return mimeType;
            }
            if (!path.endsWith(".js")) {
                if (!path.endsWith(".mjs")) {
                    if (path.endsWith(".wasm")) {
                        return "application/wasm";
                    }
                    return URLConnection.guessContentTypeFromStream(stream);
                }
            }
            return "application/javascript";
        } catch (Exception ex) {
            Logger.error("Unable to get mime type" + path, ex);
            return mimeType;
        }
    }

    private int getStatusCode(InputStream stream, int defaultCode) {
        int finalStatusCode = defaultCode;
        try {
            if (stream.available() == -1) {
                return 404;
            }
            return finalStatusCode;
        } catch (IOException e) {
            return 500;
        }
    }

    /* access modifiers changed from: package-private */
    public void register(Uri uri, PathHandler handler) {
        synchronized (this.uriMatcher) {
            this.uriMatcher.addURI(uri.getScheme(), uri.getAuthority(), uri.getPath(), handler);
        }
    }

    public void hostAssets(String assetPath) {
        this.isAsset = true;
        this.basePath = assetPath;
        createHostingDetails();
    }

    public void hostFiles(String basePath2) {
        this.isAsset = false;
        this.basePath = basePath2;
        createHostingDetails();
    }

    private void createHostingDetails() {
        final String assetPath = this.basePath;
        if (assetPath.indexOf(42) == -1) {
            PathHandler handler = new PathHandler(this) {
                final /* synthetic */ WebViewLocalServer this$0;

                {
                    this.this$0 = this$0;
                }

                public InputStream handle(Uri url) {
                    String path = url.getPath();
                    RouteProcessor routeProcessor = this.this$0.bridge.getRouteProcessor();
                    boolean ignoreAssetPath = false;
                    if (routeProcessor != null) {
                        ProcessedRoute processedRoute = this.this$0.bridge.getRouteProcessor().process("", path);
                        path = processedRoute.getPath();
                        this.this$0.isAsset = processedRoute.isAsset();
                        ignoreAssetPath = processedRoute.isIgnoreAssetPath();
                    }
                    try {
                        if (path.startsWith("/_capacitor_content_")) {
                            return this.this$0.protocolHandler.openContentUrl(url);
                        }
                        if (path.startsWith("/_capacitor_file_")) {
                            return this.this$0.protocolHandler.openFile(path);
                        }
                        if (!this.this$0.isAsset) {
                            if (routeProcessor == null) {
                                path = this.this$0.basePath + url.getPath();
                            }
                            return this.this$0.protocolHandler.openFile(path);
                        } else if (ignoreAssetPath) {
                            return this.this$0.protocolHandler.openAsset(path);
                        } else {
                            return this.this$0.protocolHandler.openAsset(assetPath + path);
                        }
                    } catch (IOException e) {
                        Logger.error("Unable to open asset URL: " + url);
                        return null;
                    }
                }
            };
            Iterator<String> it = this.authorities.iterator();
            while (it.hasNext()) {
                String authority = it.next();
                registerUriForScheme("http", handler, authority);
                registerUriForScheme("https", handler, authority);
                String customScheme = this.bridge.getScheme();
                if (!customScheme.equals("http") && !customScheme.equals("https")) {
                    registerUriForScheme(customScheme, handler, authority);
                }
            }
            return;
        }
        throw new IllegalArgumentException("assetPath cannot contain the '*' character.");
    }

    private void registerUriForScheme(String scheme, PathHandler handler, String authority) {
        Uri.Builder uriBuilder = new Uri.Builder();
        uriBuilder.scheme(scheme);
        uriBuilder.authority(authority);
        uriBuilder.path("");
        Uri uriPrefix = uriBuilder.build();
        register(Uri.withAppendedPath(uriPrefix, "/"), handler);
        register(Uri.withAppendedPath(uriPrefix, "**"), handler);
    }

    private static abstract class LazyInputStream extends InputStream {
        protected final PathHandler handler;
        private InputStream is = null;

        /* access modifiers changed from: protected */
        public abstract InputStream handle();

        public LazyInputStream(PathHandler handler2) {
            this.handler = handler2;
        }

        private InputStream getInputStream() {
            if (this.is == null) {
                this.is = handle();
            }
            return this.is;
        }

        public int available() throws IOException {
            InputStream is2 = getInputStream();
            if (is2 != null) {
                return is2.available();
            }
            return -1;
        }

        public int read() throws IOException {
            InputStream is2 = getInputStream();
            if (is2 != null) {
                return is2.read();
            }
            return -1;
        }

        public int read(byte[] b) throws IOException {
            InputStream is2 = getInputStream();
            if (is2 != null) {
                return is2.read(b);
            }
            return -1;
        }

        public int read(byte[] b, int off, int len) throws IOException {
            InputStream is2 = getInputStream();
            if (is2 != null) {
                return is2.read(b, off, len);
            }
            return -1;
        }

        public long skip(long n) throws IOException {
            InputStream is2 = getInputStream();
            if (is2 != null) {
                return is2.skip(n);
            }
            return 0;
        }
    }

    private static class LollipopLazyInputStream extends LazyInputStream {
        private InputStream is;
        private WebResourceRequest request;

        public LollipopLazyInputStream(PathHandler handler, WebResourceRequest request2) {
            super(handler);
            this.request = request2;
        }

        /* access modifiers changed from: protected */
        public InputStream handle() {
            return this.handler.handle(this.request);
        }
    }

    public String getBasePath() {
        return this.basePath;
    }
}
