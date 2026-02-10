package com.getcapacitor;

import org.json.JSONException;

public class JSValue {
    private final Object value;

    public JSValue(PluginCall call, String name) {
        this.value = toValue(call, name);
    }

    public Object getValue() {
        return this.value;
    }

    public String toString() {
        return getValue().toString();
    }

    public JSObject toJSObject() throws JSONException {
        if (this.value instanceof JSObject) {
            return (JSObject) this.value;
        }
        throw new JSONException("JSValue could not be coerced to JSObject.");
    }

    public JSArray toJSArray() throws JSONException {
        if (this.value instanceof JSArray) {
            return (JSArray) this.value;
        }
        throw new JSONException("JSValue could not be coerced to JSArray.");
    }

    private Object toValue(PluginCall call, String name) {
        Object value2 = call.getArray(name, (JSArray) null);
        if (value2 != null) {
            return value2;
        }
        Object value3 = call.getObject(name, (JSObject) null);
        if (value3 != null) {
            return value3;
        }
        Object value4 = call.getString(name, (String) null);
        if (value4 != null) {
            return value4;
        }
        return call.getData().opt(name);
    }
}
