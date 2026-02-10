package com.getcapacitor.plugin.util;

import android.text.TextUtils;
import android.util.Base64;
import androidx.core.app.NotificationCompat;
import com.getcapacitor.Bridge;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.JSValue;
import com.getcapacitor.PluginCall;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class HttpRequestHandler {

    @FunctionalInterface
    public interface ProgressEmitter {
        void emit(Integer num, Integer num2);
    }

    public enum ResponseType {
        ARRAY_BUFFER("arraybuffer"),
        BLOB("blob"),
        DOCUMENT("document"),
        JSON("json"),
        TEXT("text");
        
        static final ResponseType DEFAULT = null;
        private final String name;

        static {
            DEFAULT = TEXT;
        }

        private ResponseType(String name2) {
            this.name = name2;
        }

        public static ResponseType parse(String value) {
            for (ResponseType responseType : values()) {
                if (responseType.name.equalsIgnoreCase(value)) {
                    return responseType;
                }
            }
            return DEFAULT;
        }
    }

    public static class HttpURLConnectionBuilder {
        public Integer connectTimeout;
        public CapacitorHttpUrlConnection connection;
        public Boolean disableRedirects;
        public JSObject headers;
        public String method;
        public Integer readTimeout;
        public URL url;

        public HttpURLConnectionBuilder setConnectTimeout(Integer connectTimeout2) {
            this.connectTimeout = connectTimeout2;
            return this;
        }

        public HttpURLConnectionBuilder setReadTimeout(Integer readTimeout2) {
            this.readTimeout = readTimeout2;
            return this;
        }

        public HttpURLConnectionBuilder setDisableRedirects(Boolean disableRedirects2) {
            this.disableRedirects = disableRedirects2;
            return this;
        }

        public HttpURLConnectionBuilder setHeaders(JSObject headers2) {
            this.headers = headers2;
            return this;
        }

        public HttpURLConnectionBuilder setMethod(String method2) {
            this.method = method2;
            return this;
        }

        public HttpURLConnectionBuilder setUrl(URL url2) {
            this.url = url2;
            return this;
        }

        public HttpURLConnectionBuilder openConnection() throws IOException {
            this.connection = new CapacitorHttpUrlConnection((HttpURLConnection) this.url.openConnection());
            this.connection.setAllowUserInteraction(false);
            this.connection.setRequestMethod(this.method);
            if (this.connectTimeout != null) {
                this.connection.setConnectTimeout(this.connectTimeout.intValue());
            }
            if (this.readTimeout != null) {
                this.connection.setReadTimeout(this.readTimeout.intValue());
            }
            if (this.disableRedirects != null) {
                this.connection.setDisableRedirects(this.disableRedirects.booleanValue());
            }
            this.connection.setRequestHeaders(this.headers);
            return this;
        }

        public HttpURLConnectionBuilder setUrlParams(JSObject params) throws MalformedURLException, URISyntaxException, JSONException {
            return setUrlParams(params, true);
        }

        public HttpURLConnectionBuilder setUrlParams(JSObject params, boolean shouldEncode) throws URISyntaxException, MalformedURLException {
            String initialQuery = this.url.getQuery();
            String str = "";
            String initialQueryBuilderStr = initialQuery == null ? str : initialQuery;
            Iterator<String> keys = params.keys();
            if (!keys.hasNext()) {
                return this;
            }
            StringBuilder urlQueryBuilder = new StringBuilder(initialQueryBuilderStr);
            while (keys.hasNext()) {
                String key = keys.next();
                try {
                    StringBuilder value = new StringBuilder();
                    JSONArray arr = params.getJSONArray(key);
                    for (int x = 0; x < arr.length(); x++) {
                        addUrlParam(value, key, arr.getString(x), shouldEncode);
                        if (x != arr.length() - 1) {
                            value.append("&");
                        }
                    }
                    if (urlQueryBuilder.length() > 0) {
                        urlQueryBuilder.append("&");
                    }
                    urlQueryBuilder.append(value);
                } catch (JSONException e) {
                    if (urlQueryBuilder.length() > 0) {
                        urlQueryBuilder.append("&");
                    }
                    addUrlParam(urlQueryBuilder, key, params.getString(key), shouldEncode);
                }
            }
            String urlQuery = urlQueryBuilder.toString();
            URI uri = this.url.toURI();
            StringBuilder append = new StringBuilder().append(uri.getScheme()).append("://").append(uri.getAuthority()).append(uri.getPath()).append(!urlQuery.equals(str) ? "?" + urlQuery : str);
            if (uri.getFragment() != null) {
                str = uri.getFragment();
            }
            this.url = new URL(append.append(str).toString());
            return this;
        }

        private static void addUrlParam(StringBuilder sb, String key, String value, boolean shouldEncode) {
            if (shouldEncode) {
                try {
                    key = URLEncoder.encode(key, "UTF-8");
                    value = URLEncoder.encode(value, "UTF-8");
                } catch (UnsupportedEncodingException ex) {
                    throw new RuntimeException(ex.getCause());
                }
            }
            sb.append(key).append("=").append(value);
        }

        public CapacitorHttpUrlConnection build() {
            return this.connection;
        }
    }

    public static JSObject buildResponse(CapacitorHttpUrlConnection connection) throws IOException, JSONException {
        return buildResponse(connection, ResponseType.DEFAULT);
    }

    public static JSObject buildResponse(CapacitorHttpUrlConnection connection, ResponseType responseType) throws IOException, JSONException {
        int statusCode = connection.getResponseCode();
        JSObject output = new JSObject();
        output.put(NotificationCompat.CATEGORY_STATUS, statusCode);
        output.put("headers", (Object) buildResponseHeaders(connection));
        output.put("url", (Object) connection.getURL());
        output.put("data", readData(connection, responseType));
        if (connection.getErrorStream() != null) {
            output.put("error", true);
        }
        return output;
    }

    public static Object readData(ICapacitorHttpUrlConnection connection, ResponseType responseType) throws IOException, JSONException {
        InputStream errorStream = connection.getErrorStream();
        String contentType = connection.getHeaderField("Content-Type");
        if (errorStream != null) {
            if (isOneOf(contentType, MimeType.APPLICATION_JSON, MimeType.APPLICATION_VND_API_JSON)) {
                return parseJSON(readStreamAsString(errorStream));
            }
            return readStreamAsString(errorStream);
        } else if (contentType != null && contentType.contains(MimeType.APPLICATION_JSON.getValue())) {
            return parseJSON(readStreamAsString(connection.getInputStream()));
        } else {
            InputStream stream = connection.getInputStream();
            switch (responseType.ordinal()) {
                case 0:
                case 1:
                    return readStreamAsBase64(stream);
                case 3:
                    return parseJSON(readStreamAsString(stream));
                default:
                    return readStreamAsString(stream);
            }
        }
    }

    public static boolean isOneOf(String contentType, MimeType... mimeTypes) {
        if (contentType != null) {
            for (MimeType mimeType : mimeTypes) {
                if (contentType.contains(mimeType.getValue())) {
                    return true;
                }
            }
        }
        return false;
    }

    public static JSObject buildResponseHeaders(CapacitorHttpUrlConnection connection) {
        JSObject output = new JSObject();
        for (Map.Entry<String, List<String>> entry : connection.getHeaderFields().entrySet()) {
            output.put(entry.getKey(), TextUtils.join(", ", entry.getValue()));
        }
        return output;
    }

    public static Object parseJSON(String input) throws JSONException {
        new JSONObject();
        try {
            if ("null".equals(input.trim())) {
                return JSONObject.NULL;
            }
            if ("true".equals(input.trim())) {
                return true;
            }
            if ("false".equals(input.trim())) {
                return false;
            }
            if (input.trim().length() <= 0) {
                return "";
            }
            if (input.trim().matches("^\".*\"$")) {
                return input.trim().substring(1, input.trim().length() - 1);
            }
            if (input.trim().matches("^-?\\d+$")) {
                return Integer.valueOf(Integer.parseInt(input.trim()));
            }
            if (input.trim().matches("^-?\\d+(\\.\\d+)?$")) {
                return Double.valueOf(Double.parseDouble(input.trim()));
            }
            try {
                return new JSObject(input);
            } catch (JSONException e) {
                return new JSArray(input);
            }
        } catch (JSONException e2) {
            return input;
        }
    }

    public static String readStreamAsBase64(InputStream in) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            byte[] buffer = new byte[1024];
            while (true) {
                int read = in.read(buffer);
                int readBytes = read;
                if (read != -1) {
                    out.write(buffer, 0, readBytes);
                } else {
                    byte[] result = out.toByteArray();
                    String encodeToString = Base64.encodeToString(result, 0, result.length, 0);
                    out.close();
                    return encodeToString;
                }
            }
        } catch (Throwable th) {
            th.addSuppressed(th);
        }
        throw th;
    }

    public static String readStreamAsString(InputStream in) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(in));
        try {
            StringBuilder builder = new StringBuilder();
            String line = reader.readLine();
            while (line != null) {
                builder.append(line);
                line = reader.readLine();
                if (line != null) {
                    builder.append(System.getProperty("line.separator"));
                }
            }
            String sb = builder.toString();
            reader.close();
            return sb;
        } catch (Throwable th) {
            th.addSuppressed(th);
        }
        throw th;
    }

    public static JSObject request(PluginCall call, String httpMethod, Bridge bridge) throws IOException, URISyntaxException, JSONException {
        PluginCall pluginCall = call;
        String str = httpMethod;
        Bridge bridge2 = bridge;
        String urlString = pluginCall.getString("url", "");
        JSObject headers = pluginCall.getObject("headers", new JSObject());
        JSObject params = pluginCall.getObject("params", new JSObject());
        Integer connectTimeout = pluginCall.getInt("connectTimeout");
        Integer readTimeout = pluginCall.getInt("readTimeout");
        Boolean disableRedirects = pluginCall.getBoolean("disableRedirects");
        Boolean shouldEncode = pluginCall.getBoolean("shouldEncodeUrlParams", true);
        ResponseType responseType = ResponseType.parse(pluginCall.getString("responseType"));
        String dataType = pluginCall.getString("dataType");
        String method = str != null ? str.toUpperCase(Locale.ROOT) : pluginCall.getString("method", "GET").toUpperCase(Locale.ROOT);
        boolean isHttpMutate = method.equals("DELETE") || method.equals("PATCH") || method.equals("POST") || method.equals("PUT");
        String userAgentValue = headers.getString("x-cap-user-agent");
        if (userAgentValue != null) {
            headers.put("User-Agent", userAgentValue);
        }
        headers.remove("x-cap-user-agent");
        if (!headers.has("User-Agent") && !headers.has("user-agent")) {
            headers.put("User-Agent", bridge2.getConfig().getOverriddenUserAgentString());
        }
        URL url = new URL(urlString);
        String str2 = urlString;
        CapacitorHttpUrlConnection connection = new HttpURLConnectionBuilder().setUrl(url).setMethod(method).setHeaders(headers).setUrlParams(params, shouldEncode.booleanValue()).setConnectTimeout(connectTimeout).setReadTimeout(readTimeout).setDisableRedirects(disableRedirects).openConnection().build();
        if (bridge2 != null && !isDomainExcludedFromSSL(bridge2, url).booleanValue()) {
            connection.setSSLSocketFactory(bridge2);
        }
        if (isHttpMutate) {
            URL url2 = url;
            JSValue data = new JSValue(pluginCall, "data");
            if (data.getValue() != null) {
                connection.setDoOutput(true);
                connection.setRequestBody(pluginCall, data, dataType);
            }
        }
        pluginCall.getData().put("activeCapacitorHttpUrlConnection", (Object) connection);
        connection.connect();
        JSObject response = buildResponse(connection, responseType);
        connection.disconnect();
        call.getData().remove("activeCapacitorHttpUrlConnection");
        return response;
    }

    public static Boolean isDomainExcludedFromSSL(Bridge bridge, URL url) {
        try {
            Class<?> sslPinningImpl = Class.forName("io.ionic.sslpinning.SSLPinning");
            return (Boolean) sslPinningImpl.getDeclaredMethod("isDomainExcluded", new Class[]{Bridge.class, URL.class}).invoke(sslPinningImpl.getDeclaredConstructor(new Class[0]).newInstance(new Object[0]), new Object[]{bridge, url});
        } catch (Exception e) {
            return false;
        }
    }
}
