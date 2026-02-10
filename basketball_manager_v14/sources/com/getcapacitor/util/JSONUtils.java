package com.getcapacitor.util;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JSONUtils {
    public static String getString(JSONObject jsonObject, String key, String defaultValue) {
        try {
            String value = getDeepestObject(jsonObject, key).getString(getDeepestKey(key));
            if (value == null) {
                return defaultValue;
            }
            return value;
        } catch (JSONException e) {
            return defaultValue;
        }
    }

    public static boolean getBoolean(JSONObject jsonObject, String key, boolean defaultValue) {
        try {
            return getDeepestObject(jsonObject, key).getBoolean(getDeepestKey(key));
        } catch (JSONException e) {
            return defaultValue;
        }
    }

    public static int getInt(JSONObject jsonObject, String key, int defaultValue) {
        try {
            return getDeepestObject(jsonObject, key).getInt(getDeepestKey(key));
        } catch (JSONException e) {
            return defaultValue;
        }
    }

    public static JSONObject getObject(JSONObject jsonObject, String key) {
        try {
            return getDeepestObject(jsonObject, key).getJSONObject(getDeepestKey(key));
        } catch (JSONException e) {
            return null;
        }
    }

    public static String[] getArray(JSONObject jsonObject, String key, String[] defaultValue) {
        try {
            JSONArray a = getDeepestObject(jsonObject, key).getJSONArray(getDeepestKey(key));
            if (a == null) {
                return defaultValue;
            }
            int l = a.length();
            String[] value = new String[l];
            for (int i = 0; i < l; i++) {
                value[i] = (String) a.get(i);
            }
            return value;
        } catch (JSONException e) {
            return defaultValue;
        }
    }

    private static String getDeepestKey(String key) {
        String[] parts = key.split("\\.");
        if (parts.length > 0) {
            return parts[parts.length - 1];
        }
        return null;
    }

    private static JSONObject getDeepestObject(JSONObject jsonObject, String key) throws JSONException {
        String[] parts = key.split("\\.");
        JSONObject o = jsonObject;
        for (int i = 0; i < parts.length - 1; i++) {
            o = o.getJSONObject(parts[i]);
        }
        return o;
    }
}
