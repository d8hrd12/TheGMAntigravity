package com.getcapacitor;

import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class PluginCall {
    public static final String CALLBACK_ID_DANGLING = "-1";
    private final String callbackId;
    private final JSObject data;
    @Deprecated
    private boolean isReleased = false;
    private boolean keepAlive = false;
    private final String methodName;
    private final MessageHandler msgHandler;
    private final String pluginId;

    public PluginCall(MessageHandler msgHandler2, String pluginId2, String callbackId2, String methodName2, JSObject data2) {
        this.msgHandler = msgHandler2;
        this.pluginId = pluginId2;
        this.callbackId = callbackId2;
        this.methodName = methodName2;
        this.data = data2;
    }

    public void successCallback(PluginResult successResult) {
        if (!CALLBACK_ID_DANGLING.equals(this.callbackId)) {
            this.msgHandler.sendResponseMessage(this, successResult, (PluginResult) null);
        }
    }

    public void resolve(JSObject data2) {
        this.msgHandler.sendResponseMessage(this, new PluginResult(data2), (PluginResult) null);
    }

    public void resolve() {
        this.msgHandler.sendResponseMessage(this, (PluginResult) null, (PluginResult) null);
    }

    public void errorCallback(String msg) {
        PluginResult errorResult = new PluginResult();
        try {
            errorResult.put("message", (Object) msg);
        } catch (Exception jsonEx) {
            Logger.error(Logger.tags("Plugin"), jsonEx.toString(), (Throwable) null);
        }
        this.msgHandler.sendResponseMessage(this, (PluginResult) null, errorResult);
    }

    public void reject(String msg, String code, Exception ex, JSObject data2) {
        PluginResult errorResult = new PluginResult();
        if (ex != null) {
            Logger.error(Logger.tags("Plugin"), msg, ex);
        }
        try {
            errorResult.put("message", (Object) msg);
            errorResult.put("code", (Object) code);
            if (data2 != null) {
                errorResult.put("data", (Object) data2);
            }
        } catch (Exception jsonEx) {
            Logger.error(Logger.tags("Plugin"), jsonEx.getMessage(), jsonEx);
        }
        this.msgHandler.sendResponseMessage(this, (PluginResult) null, errorResult);
    }

    public void reject(String msg, Exception ex, JSObject data2) {
        reject(msg, (String) null, ex, data2);
    }

    public void reject(String msg, String code, JSObject data2) {
        reject(msg, code, (Exception) null, data2);
    }

    public void reject(String msg, String code, Exception ex) {
        reject(msg, code, ex, (JSObject) null);
    }

    public void reject(String msg, JSObject data2) {
        reject(msg, (String) null, (Exception) null, data2);
    }

    public void reject(String msg, Exception ex) {
        reject(msg, (String) null, ex, (JSObject) null);
    }

    public void reject(String msg, String code) {
        reject(msg, code, (Exception) null, (JSObject) null);
    }

    public void reject(String msg) {
        reject(msg, (String) null, (Exception) null, (JSObject) null);
    }

    public void unimplemented() {
        unimplemented("not implemented");
    }

    public void unimplemented(String msg) {
        reject(msg, "UNIMPLEMENTED", (Exception) null, (JSObject) null);
    }

    public void unavailable() {
        unavailable("not available");
    }

    public void unavailable(String msg) {
        reject(msg, "UNAVAILABLE", (Exception) null, (JSObject) null);
    }

    public String getPluginId() {
        return this.pluginId;
    }

    public String getCallbackId() {
        return this.callbackId;
    }

    public String getMethodName() {
        return this.methodName;
    }

    public JSObject getData() {
        return this.data;
    }

    public String getString(String name) {
        return getString(name, (String) null);
    }

    public String getString(String name, String defaultValue) {
        Object value = this.data.opt(name);
        if (value != null && (value instanceof String)) {
            return (String) value;
        }
        return defaultValue;
    }

    public Integer getInt(String name) {
        return getInt(name, (Integer) null);
    }

    public Integer getInt(String name, Integer defaultValue) {
        Object value = this.data.opt(name);
        if (value != null && (value instanceof Integer)) {
            return (Integer) value;
        }
        return defaultValue;
    }

    public Long getLong(String name) {
        return getLong(name, (Long) null);
    }

    public Long getLong(String name, Long defaultValue) {
        Object value = this.data.opt(name);
        if (value != null && (value instanceof Long)) {
            return (Long) value;
        }
        return defaultValue;
    }

    public Float getFloat(String name) {
        return getFloat(name, (Float) null);
    }

    public Float getFloat(String name, Float defaultValue) {
        Object value = this.data.opt(name);
        if (value == null) {
            return defaultValue;
        }
        if (value instanceof Float) {
            return (Float) value;
        }
        if (value instanceof Double) {
            return Float.valueOf(((Double) value).floatValue());
        }
        if (value instanceof Integer) {
            return Float.valueOf(((Integer) value).floatValue());
        }
        return defaultValue;
    }

    public Double getDouble(String name) {
        return getDouble(name, (Double) null);
    }

    public Double getDouble(String name, Double defaultValue) {
        Object value = this.data.opt(name);
        if (value == null) {
            return defaultValue;
        }
        if (value instanceof Double) {
            return (Double) value;
        }
        if (value instanceof Float) {
            return Double.valueOf(((Float) value).doubleValue());
        }
        if (value instanceof Integer) {
            return Double.valueOf(((Integer) value).doubleValue());
        }
        return defaultValue;
    }

    public Boolean getBoolean(String name) {
        return getBoolean(name, (Boolean) null);
    }

    public Boolean getBoolean(String name, Boolean defaultValue) {
        Object value = this.data.opt(name);
        if (value != null && (value instanceof Boolean)) {
            return (Boolean) value;
        }
        return defaultValue;
    }

    public JSObject getObject(String name) {
        return getObject(name, (JSObject) null);
    }

    public JSObject getObject(String name, JSObject defaultValue) {
        Object value = this.data.opt(name);
        if (value == null || !(value instanceof JSONObject)) {
            return defaultValue;
        }
        try {
            return JSObject.fromJSONObject((JSONObject) value);
        } catch (JSONException e) {
            return defaultValue;
        }
    }

    public JSArray getArray(String name) {
        return getArray(name, (JSArray) null);
    }

    public JSArray getArray(String name, JSArray defaultValue) {
        Object value = this.data.opt(name);
        if (value == null || !(value instanceof JSONArray)) {
            return defaultValue;
        }
        try {
            JSONArray valueArray = (JSONArray) value;
            List<Object> items = new ArrayList<>();
            for (int i = 0; i < valueArray.length(); i++) {
                items.add(valueArray.get(i));
            }
            return new JSArray((Object) items.toArray());
        } catch (JSONException e) {
            return defaultValue;
        }
    }

    @Deprecated
    public boolean hasOption(String name) {
        return this.data.has(name);
    }

    @Deprecated
    public void save() {
        setKeepAlive(true);
    }

    public void setKeepAlive(Boolean keepAlive2) {
        this.keepAlive = keepAlive2.booleanValue();
    }

    public void release(Bridge bridge) {
        this.keepAlive = false;
        bridge.releaseCall(this);
        this.isReleased = true;
    }

    @Deprecated
    public boolean isSaved() {
        return isKeptAlive();
    }

    public boolean isKeptAlive() {
        return this.keepAlive;
    }

    @Deprecated
    public boolean isReleased() {
        return this.isReleased;
    }

    class PluginCallDataTypeException extends Exception {
        PluginCallDataTypeException(String m) {
            super(m);
        }
    }
}
