package com.getcapacitor.plugin.util;

import android.os.Build;
import android.os.LocaleList;
import android.text.TextUtils;
import com.getcapacitor.Bridge;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.JSValue;
import com.getcapacitor.PluginCall;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.ProtocolException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSocketFactory;
import org.json.JSONException;
import org.json.JSONObject;

public class CapacitorHttpUrlConnection implements ICapacitorHttpUrlConnection {
    private final HttpURLConnection connection;

    public CapacitorHttpUrlConnection(HttpURLConnection conn) {
        this.connection = conn;
        setDefaultRequestProperties();
    }

    public HttpURLConnection getHttpConnection() {
        return this.connection;
    }

    public void disconnect() {
        this.connection.disconnect();
    }

    public void setAllowUserInteraction(boolean isAllowedInteraction) {
        this.connection.setAllowUserInteraction(isAllowedInteraction);
    }

    public void setRequestMethod(String method) throws ProtocolException {
        this.connection.setRequestMethod(method);
    }

    public void setConnectTimeout(int timeout) {
        if (timeout >= 0) {
            this.connection.setConnectTimeout(timeout);
            return;
        }
        throw new IllegalArgumentException("timeout can not be negative");
    }

    public void setReadTimeout(int timeout) {
        if (timeout >= 0) {
            this.connection.setReadTimeout(timeout);
            return;
        }
        throw new IllegalArgumentException("timeout can not be negative");
    }

    public void setDisableRedirects(boolean disableRedirects) {
        this.connection.setInstanceFollowRedirects(!disableRedirects);
    }

    public void setRequestHeaders(JSObject headers) {
        Iterator<String> keys = headers.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            this.connection.setRequestProperty(key, headers.getString(key));
        }
    }

    public void setDoOutput(boolean shouldDoOutput) {
        this.connection.setDoOutput(shouldDoOutput);
    }

    public void setRequestBody(PluginCall call, JSValue body) throws JSONException, IOException {
        setRequestBody(call, body, (String) null);
    }

    public void setRequestBody(PluginCall call, JSValue body, String bodyType) throws JSONException, IOException {
        String contentType = this.connection.getRequestProperty("Content-Type");
        String dataString = "";
        if (contentType != null && !contentType.isEmpty()) {
            if (contentType.contains("application/json")) {
                JSArray jsArray = null;
                if (body != null) {
                    dataString = body.toString();
                } else {
                    jsArray = call.getArray("data", (JSArray) null);
                }
                if (jsArray != null) {
                    dataString = jsArray.toString();
                } else if (body == null) {
                    dataString = call.getString("data");
                }
                writeRequestBody(dataString != null ? dataString : "");
                return;
            } else if (bodyType != null && bodyType.equals("file")) {
                DataOutputStream os = new DataOutputStream(this.connection.getOutputStream());
                try {
                    if (Build.VERSION.SDK_INT >= 26) {
                        os.write(Base64.getDecoder().decode(body.toString()));
                    }
                    os.flush();
                    os.close();
                    return;
                } catch (Throwable th) {
                    th.addSuppressed(th);
                }
            } else if (contentType.contains("application/x-www-form-urlencoded")) {
                try {
                    writeObjectRequestBody(body.toJSObject());
                    return;
                } catch (Exception e) {
                    writeRequestBody(body.toString());
                    return;
                }
            } else if (bodyType == null || !bodyType.equals("formData")) {
                writeRequestBody(body.toString());
                return;
            } else {
                writeFormDataRequestBody(contentType, body.toJSArray());
                return;
            }
        } else {
            return;
        }
        throw th;
    }

    private void writeRequestBody(String body) throws IOException {
        DataOutputStream os = new DataOutputStream(this.connection.getOutputStream());
        try {
            os.write(body.getBytes(StandardCharsets.UTF_8));
            os.flush();
            os.close();
            return;
        } catch (Throwable th) {
            th.addSuppressed(th);
        }
        throw th;
    }

    private void writeObjectRequestBody(JSObject object) throws IOException, JSONException {
        DataOutputStream os = new DataOutputStream(this.connection.getOutputStream());
        try {
            Iterator<String> keys = object.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                Object d = object.get(key);
                os.writeBytes(URLEncoder.encode(key, "UTF-8"));
                os.writeBytes("=");
                os.writeBytes(URLEncoder.encode(d.toString(), "UTF-8"));
                if (keys.hasNext()) {
                    os.writeBytes("&");
                }
            }
            os.flush();
            os.close();
            return;
        } catch (Throwable th) {
            th.addSuppressed(th);
        }
        throw th;
    }

    private void writeFormDataRequestBody(String contentType, JSArray entries) throws IOException, JSONException {
        Throwable th;
        DataOutputStream os = new DataOutputStream(this.connection.getOutputStream());
        try {
            String boundary = contentType.split(";")[1].split("=")[1];
            for (Object e : entries.toList()) {
                if (e instanceof JSONObject) {
                    JSONObject entry = (JSONObject) e;
                    String type = entry.getString("type");
                    String key = entry.getString("key");
                    String value = entry.getString("value");
                    if (type.equals("string")) {
                        os.writeBytes("--" + boundary + "\r\n");
                        os.writeBytes("Content-Disposition: form-data; name=\"" + key + "\"" + "\r\n" + "\r\n");
                        os.write(value.getBytes(StandardCharsets.UTF_8));
                        os.writeBytes("\r\n");
                    } else if (type.equals("base64File")) {
                        String fileName = entry.getString("fileName");
                        String fileContentType = entry.getString("contentType");
                        os.writeBytes("--" + boundary + "\r\n");
                        os.writeBytes("Content-Disposition: form-data; name=\"" + key + "\"; filename=\"" + fileName + "\"" + "\r\n");
                        os.writeBytes("Content-Type: " + fileContentType + "\r\n");
                        os.writeBytes("Content-Transfer-Encoding: binary" + "\r\n");
                        os.writeBytes("\r\n");
                        if (Build.VERSION.SDK_INT >= 26) {
                            os.write(Base64.getDecoder().decode(value));
                        } else {
                            os.write(android.util.Base64.decode(value, 0));
                        }
                        os.writeBytes("\r\n");
                    }
                }
            }
            os.writeBytes("--" + boundary + "--" + "\r\n");
            os.flush();
            os.close();
            return;
        } catch (Throwable th2) {
            th.addSuppressed(th2);
        }
        throw th;
    }

    public void connect() throws IOException {
        this.connection.connect();
    }

    public int getResponseCode() throws IOException {
        return this.connection.getResponseCode();
    }

    public URL getURL() {
        return this.connection.getURL();
    }

    public InputStream getErrorStream() {
        return this.connection.getErrorStream();
    }

    public String getHeaderField(String name) {
        return this.connection.getHeaderField(name);
    }

    public InputStream getInputStream() throws IOException {
        return this.connection.getInputStream();
    }

    public Map<String, List<String>> getHeaderFields() {
        return this.connection.getHeaderFields();
    }

    private void setDefaultRequestProperties() {
        String acceptLanguage = buildDefaultAcceptLanguageProperty();
        if (!TextUtils.isEmpty(acceptLanguage)) {
            this.connection.setRequestProperty("Accept-Language", acceptLanguage);
        }
    }

    private String buildDefaultAcceptLanguageProperty() {
        Locale locale = LocaleList.getDefault().get(0);
        String lang = locale.getLanguage();
        String country = locale.getCountry();
        if (TextUtils.isEmpty(lang)) {
            return "";
        }
        if (!TextUtils.isEmpty(country)) {
            return String.format("%s-%s,%s;q=0.5", new Object[]{lang, country, lang});
        }
        return String.format("%s;q=0.5", new Object[]{lang});
    }

    public void setSSLSocketFactory(Bridge bridge) {
        try {
            Class<?> sslPinningImpl = Class.forName("io.ionic.sslpinning.SSLPinning");
            SSLSocketFactory sslSocketFactory = (SSLSocketFactory) sslPinningImpl.getDeclaredMethod("getSSLSocketFactory", new Class[]{Bridge.class}).invoke(sslPinningImpl.getDeclaredConstructor(new Class[0]).newInstance(new Object[0]), new Object[]{bridge});
            if (sslSocketFactory != null) {
                ((HttpsURLConnection) this.connection).setSSLSocketFactory(sslSocketFactory);
            }
        } catch (Exception e) {
        }
    }
}
