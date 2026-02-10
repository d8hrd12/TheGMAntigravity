package com.getcapacitor.plugin;

import android.content.SharedPreferences;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin
public class WebView extends Plugin {
    public static final String CAP_SERVER_PATH = "serverBasePath";
    public static final String WEBVIEW_PREFS_NAME = "CapWebViewSettings";

    @PluginMethod
    public void setServerAssetPath(PluginCall call) {
        this.bridge.setServerAssetPath(call.getString("path"));
        call.resolve();
    }

    @PluginMethod
    public void setServerBasePath(PluginCall call) {
        this.bridge.setServerBasePath(call.getString("path"));
        call.resolve();
    }

    @PluginMethod
    public void getServerBasePath(PluginCall call) {
        String path = this.bridge.getServerBasePath();
        JSObject ret = new JSObject();
        ret.put("path", path);
        call.resolve(ret);
    }

    @PluginMethod
    public void persistServerBasePath(PluginCall call) {
        String path = this.bridge.getServerBasePath();
        SharedPreferences.Editor editor = getContext().getSharedPreferences(WEBVIEW_PREFS_NAME, 0).edit();
        editor.putString(CAP_SERVER_PATH, path);
        editor.apply();
        call.resolve();
    }
}
