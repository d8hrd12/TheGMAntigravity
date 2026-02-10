package com.getcapacitor;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.json.JSONException;
import org.json.JSONObject;

public class JSObject extends JSONObject {
    public JSObject() {
    }

    public JSObject(String json) throws JSONException {
        super(json);
    }

    public JSObject(JSONObject obj, String[] names) throws JSONException {
        super(obj, names);
    }

    public static JSObject fromJSONObject(JSONObject obj) throws JSONException {
        Iterator<String> keysIter = obj.keys();
        List<String> keys = new ArrayList<>();
        while (keysIter.hasNext()) {
            keys.add(keysIter.next());
        }
        return new JSObject(obj, (String[]) keys.toArray(new String[keys.size()]));
    }

    public String getString(String key) {
        return getString(key, (String) null);
    }

    public String getString(String key, String defaultValue) {
        try {
            String value = super.getString(key);
            if (!super.isNull(key)) {
                return value;
            }
            return defaultValue;
        } catch (JSONException e) {
        }
    }

    public Integer getInteger(String key) {
        return getInteger(key, (Integer) null);
    }

    public Integer getInteger(String key, Integer defaultValue) {
        try {
            return Integer.valueOf(super.getInt(key));
        } catch (JSONException e) {
            return defaultValue;
        }
    }

    public Boolean getBoolean(String key, Boolean defaultValue) {
        try {
            return Boolean.valueOf(super.getBoolean(key));
        } catch (JSONException e) {
            return defaultValue;
        }
    }

    public Boolean getBool(String key) {
        return getBoolean(key, (Boolean) null);
    }

    public JSObject getJSObject(String name) {
        try {
            return getJSObject(name, (JSObject) null);
        } catch (JSONException e) {
            return null;
        }
    }

    public JSObject getJSObject(String name, JSObject defaultValue) throws JSONException {
        try {
            Object obj = get(name);
            if (obj instanceof JSONObject) {
                Iterator<String> keysIter = ((JSONObject) obj).keys();
                List<String> keys = new ArrayList<>();
                while (keysIter.hasNext()) {
                    keys.add(keysIter.next());
                }
                return new JSObject((JSONObject) obj, (String[]) keys.toArray(new String[keys.size()]));
            }
        } catch (JSONException e) {
        }
        return defaultValue;
    }

    public JSObject put(String key, boolean value) {
        try {
            super.put(key, value);
        } catch (JSONException e) {
        }
        return this;
    }

    public JSObject put(String key, int value) {
        try {
            super.put(key, value);
        } catch (JSONException e) {
        }
        return this;
    }

    public JSObject put(String key, long value) {
        try {
            super.put(key, value);
        } catch (JSONException e) {
        }
        return this;
    }

    public JSObject put(String key, double value) {
        try {
            super.put(key, value);
        } catch (JSONException e) {
        }
        return this;
    }

    public JSObject put(String key, Object value) {
        try {
            super.put(key, value);
        } catch (JSONException e) {
        }
        return this;
    }

    public JSObject put(String key, String value) {
        try {
            super.put(key, value);
        } catch (JSONException e) {
        }
        return this;
    }

    public JSObject putSafe(String key, Object value) throws JSONException {
        return (JSObject) super.put(key, value);
    }
}
