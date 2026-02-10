package com.getcapacitor;

import com.getcapacitor.util.JSONUtils;
import org.json.JSONObject;

public class PluginConfig {
    private final JSONObject config;

    PluginConfig(JSONObject config2) {
        this.config = config2;
    }

    public String getString(String configKey) {
        return getString(configKey, (String) null);
    }

    public String getString(String configKey, String defaultValue) {
        return JSONUtils.getString(this.config, configKey, defaultValue);
    }

    public boolean getBoolean(String configKey, boolean defaultValue) {
        return JSONUtils.getBoolean(this.config, configKey, defaultValue);
    }

    public int getInt(String configKey, int defaultValue) {
        return JSONUtils.getInt(this.config, configKey, defaultValue);
    }

    public String[] getArray(String configKey) {
        return getArray(configKey, (String[]) null);
    }

    public String[] getArray(String configKey, String[] defaultValue) {
        return JSONUtils.getArray(this.config, configKey, defaultValue);
    }

    public JSONObject getObject(String configKey) {
        return JSONUtils.getObject(this.config, configKey);
    }

    public boolean isEmpty() {
        return this.config.length() == 0;
    }

    public JSONObject getConfigJSON() {
        return this.config;
    }
}
