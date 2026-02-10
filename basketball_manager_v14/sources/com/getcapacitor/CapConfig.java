package com.getcapacitor;

import android.content.Context;
import android.content.res.AssetManager;
import com.getcapacitor.util.JSONUtils;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;

public class CapConfig {
    private static final String LOG_BEHAVIOR_DEBUG = "debug";
    private static final String LOG_BEHAVIOR_NONE = "none";
    private static final String LOG_BEHAVIOR_PRODUCTION = "production";
    private boolean allowMixedContent;
    private String[] allowNavigation;
    private String androidScheme;
    private String appendedUserAgentString;
    private String backgroundColor;
    private boolean captureInput;
    private JSONObject configJSON;
    private String errorPath;
    private String hostname;
    private boolean html5mode;
    private boolean initialFocus;
    private boolean loggingEnabled;
    private int minHuaweiWebViewVersion;
    private int minWebViewVersion;
    private String overriddenUserAgentString;
    private Map<String, PluginConfig> pluginsConfiguration;
    private boolean resolveServiceWorkerRequests;
    private String serverUrl;
    private String startPath;
    private boolean useLegacyBridge;
    private boolean webContentsDebuggingEnabled;
    private boolean zoomableWebView;

    private CapConfig() {
        this.html5mode = true;
        this.hostname = "localhost";
        this.androidScheme = "https";
        this.allowMixedContent = false;
        this.captureInput = false;
        this.webContentsDebuggingEnabled = false;
        this.loggingEnabled = true;
        this.initialFocus = true;
        this.useLegacyBridge = false;
        this.minWebViewVersion = 60;
        this.minHuaweiWebViewVersion = 10;
        this.zoomableWebView = false;
        this.resolveServiceWorkerRequests = true;
        this.pluginsConfiguration = null;
        this.configJSON = new JSONObject();
    }

    @Deprecated
    public CapConfig(AssetManager assetManager, JSONObject config) {
        this.html5mode = true;
        this.hostname = "localhost";
        this.androidScheme = "https";
        this.allowMixedContent = false;
        this.captureInput = false;
        this.webContentsDebuggingEnabled = false;
        this.loggingEnabled = true;
        this.initialFocus = true;
        this.useLegacyBridge = false;
        this.minWebViewVersion = 60;
        this.minHuaweiWebViewVersion = 10;
        this.zoomableWebView = false;
        this.resolveServiceWorkerRequests = true;
        this.pluginsConfiguration = null;
        this.configJSON = new JSONObject();
        if (config != null) {
            this.configJSON = config;
        } else {
            loadConfigFromAssets(assetManager, (String) null);
        }
        deserializeConfig((Context) null);
    }

    public static CapConfig loadDefault(Context context) {
        CapConfig config = new CapConfig();
        if (context == null) {
            Logger.error("Capacitor Config could not be created from file. Context must not be null.");
            return config;
        }
        config.loadConfigFromAssets(context.getAssets(), (String) null);
        config.deserializeConfig(context);
        return config;
    }

    public static CapConfig loadFromAssets(Context context, String path) {
        CapConfig config = new CapConfig();
        if (context == null) {
            Logger.error("Capacitor Config could not be created from file. Context must not be null.");
            return config;
        }
        config.loadConfigFromAssets(context.getAssets(), path);
        config.deserializeConfig(context);
        return config;
    }

    public static CapConfig loadFromFile(Context context, String path) {
        CapConfig config = new CapConfig();
        if (context == null) {
            Logger.error("Capacitor Config could not be created from file. Context must not be null.");
            return config;
        }
        config.loadConfigFromFile(path);
        config.deserializeConfig(context);
        return config;
    }

    private CapConfig(Builder builder) {
        this.html5mode = true;
        this.hostname = "localhost";
        this.androidScheme = "https";
        this.allowMixedContent = false;
        this.captureInput = false;
        this.webContentsDebuggingEnabled = false;
        this.loggingEnabled = true;
        this.initialFocus = true;
        this.useLegacyBridge = false;
        this.minWebViewVersion = 60;
        this.minHuaweiWebViewVersion = 10;
        this.zoomableWebView = false;
        this.resolveServiceWorkerRequests = true;
        this.pluginsConfiguration = null;
        this.configJSON = new JSONObject();
        this.html5mode = builder.html5mode;
        this.serverUrl = builder.serverUrl;
        this.hostname = builder.hostname;
        if (validateScheme(builder.androidScheme)) {
            this.androidScheme = builder.androidScheme;
        }
        this.allowNavigation = builder.allowNavigation;
        this.overriddenUserAgentString = builder.overriddenUserAgentString;
        this.appendedUserAgentString = builder.appendedUserAgentString;
        this.backgroundColor = builder.backgroundColor;
        this.allowMixedContent = builder.allowMixedContent;
        this.captureInput = builder.captureInput;
        this.webContentsDebuggingEnabled = builder.webContentsDebuggingEnabled.booleanValue();
        this.loggingEnabled = builder.loggingEnabled;
        this.initialFocus = builder.initialFocus;
        this.useLegacyBridge = builder.useLegacyBridge;
        this.minWebViewVersion = builder.minWebViewVersion;
        this.minHuaweiWebViewVersion = builder.minHuaweiWebViewVersion;
        this.errorPath = builder.errorPath;
        this.zoomableWebView = builder.zoomableWebView;
        this.resolveServiceWorkerRequests = builder.resolveServiceWorkerRequests;
        this.startPath = builder.startPath;
        this.pluginsConfiguration = builder.pluginsConfiguration;
    }

    private void loadConfigFromAssets(AssetManager assetManager, String path) {
        if (path == null) {
            path = "";
        } else if (path.charAt(path.length() - 1) != '/') {
            path = path + "/";
        }
        try {
            this.configJSON = new JSONObject(FileUtils.readFileFromAssets(assetManager, path + "capacitor.config.json"));
        } catch (IOException ex) {
            Logger.error("Unable to load capacitor.config.json. Run npx cap copy first", ex);
        } catch (JSONException ex2) {
            Logger.error("Unable to parse capacitor.config.json. Make sure it's valid json", ex2);
        }
    }

    private void loadConfigFromFile(String path) {
        if (path == null) {
            path = "";
        } else if (path.charAt(path.length() - 1) != '/') {
            path = path + "/";
        }
        try {
            this.configJSON = new JSONObject(FileUtils.readFileFromDisk(new File(path + "capacitor.config.json")));
        } catch (JSONException ex) {
            Logger.error("Unable to parse capacitor.config.json. Make sure it's valid json", ex);
        } catch (IOException ex2) {
            Logger.error("Unable to load capacitor.config.json.", ex2);
        }
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private void deserializeConfig(android.content.Context r9) {
        /*
            r8 = this;
            r0 = 1
            r1 = 0
            if (r9 == 0) goto L_0x0010
            android.content.pm.ApplicationInfo r2 = r9.getApplicationInfo()
            int r2 = r2.flags
            r2 = r2 & 2
            if (r2 == 0) goto L_0x0010
            r2 = r0
            goto L_0x0011
        L_0x0010:
            r2 = r1
        L_0x0011:
            org.json.JSONObject r3 = r8.configJSON
            java.lang.String r4 = "server.html5mode"
            boolean r5 = r8.html5mode
            boolean r3 = com.getcapacitor.util.JSONUtils.getBoolean(r3, r4, r5)
            r8.html5mode = r3
            org.json.JSONObject r3 = r8.configJSON
            java.lang.String r4 = "server.url"
            r5 = 0
            java.lang.String r3 = com.getcapacitor.util.JSONUtils.getString(r3, r4, r5)
            r8.serverUrl = r3
            org.json.JSONObject r3 = r8.configJSON
            java.lang.String r4 = "server.hostname"
            java.lang.String r6 = r8.hostname
            java.lang.String r3 = com.getcapacitor.util.JSONUtils.getString(r3, r4, r6)
            r8.hostname = r3
            org.json.JSONObject r3 = r8.configJSON
            java.lang.String r4 = "server.errorPath"
            java.lang.String r3 = com.getcapacitor.util.JSONUtils.getString(r3, r4, r5)
            r8.errorPath = r3
            org.json.JSONObject r3 = r8.configJSON
            java.lang.String r4 = "server.appStartPath"
            java.lang.String r3 = com.getcapacitor.util.JSONUtils.getString(r3, r4, r5)
            r8.startPath = r3
            org.json.JSONObject r3 = r8.configJSON
            java.lang.String r4 = "server.androidScheme"
            java.lang.String r6 = r8.androidScheme
            java.lang.String r3 = com.getcapacitor.util.JSONUtils.getString(r3, r4, r6)
            boolean r4 = r8.validateScheme(r3)
            if (r4 == 0) goto L_0x005a
            r8.androidScheme = r3
        L_0x005a:
            org.json.JSONObject r4 = r8.configJSON
            java.lang.String r6 = "server.allowNavigation"
            java.lang.String[] r4 = com.getcapacitor.util.JSONUtils.getArray(r4, r6, r5)
            r8.allowNavigation = r4
            org.json.JSONObject r4 = r8.configJSON
            org.json.JSONObject r6 = r8.configJSON
            java.lang.String r7 = "overrideUserAgent"
            java.lang.String r6 = com.getcapacitor.util.JSONUtils.getString(r6, r7, r5)
            java.lang.String r7 = "android.overrideUserAgent"
            java.lang.String r4 = com.getcapacitor.util.JSONUtils.getString(r4, r7, r6)
            r8.overriddenUserAgentString = r4
            org.json.JSONObject r4 = r8.configJSON
            org.json.JSONObject r6 = r8.configJSON
            java.lang.String r7 = "appendUserAgent"
            java.lang.String r6 = com.getcapacitor.util.JSONUtils.getString(r6, r7, r5)
            java.lang.String r7 = "android.appendUserAgent"
            java.lang.String r4 = com.getcapacitor.util.JSONUtils.getString(r4, r7, r6)
            r8.appendedUserAgentString = r4
            org.json.JSONObject r4 = r8.configJSON
            org.json.JSONObject r6 = r8.configJSON
            java.lang.String r7 = "backgroundColor"
            java.lang.String r5 = com.getcapacitor.util.JSONUtils.getString(r6, r7, r5)
            java.lang.String r6 = "android.backgroundColor"
            java.lang.String r4 = com.getcapacitor.util.JSONUtils.getString(r4, r6, r5)
            r8.backgroundColor = r4
            org.json.JSONObject r4 = r8.configJSON
            org.json.JSONObject r5 = r8.configJSON
            boolean r6 = r8.allowMixedContent
            java.lang.String r7 = "allowMixedContent"
            boolean r5 = com.getcapacitor.util.JSONUtils.getBoolean(r5, r7, r6)
            java.lang.String r6 = "android.allowMixedContent"
            boolean r4 = com.getcapacitor.util.JSONUtils.getBoolean(r4, r6, r5)
            r8.allowMixedContent = r4
            org.json.JSONObject r4 = r8.configJSON
            java.lang.String r5 = "android.minWebViewVersion"
            r6 = 60
            int r4 = com.getcapacitor.util.JSONUtils.getInt(r4, r5, r6)
            r8.minWebViewVersion = r4
            org.json.JSONObject r4 = r8.configJSON
            java.lang.String r5 = "android.minHuaweiWebViewVersion"
            r6 = 10
            int r4 = com.getcapacitor.util.JSONUtils.getInt(r4, r5, r6)
            r8.minHuaweiWebViewVersion = r4
            org.json.JSONObject r4 = r8.configJSON
            java.lang.String r5 = "android.captureInput"
            boolean r6 = r8.captureInput
            boolean r4 = com.getcapacitor.util.JSONUtils.getBoolean(r4, r5, r6)
            r8.captureInput = r4
            org.json.JSONObject r4 = r8.configJSON
            java.lang.String r5 = "android.useLegacyBridge"
            boolean r6 = r8.useLegacyBridge
            boolean r4 = com.getcapacitor.util.JSONUtils.getBoolean(r4, r5, r6)
            r8.useLegacyBridge = r4
            org.json.JSONObject r4 = r8.configJSON
            java.lang.String r5 = "android.webContentsDebuggingEnabled"
            boolean r4 = com.getcapacitor.util.JSONUtils.getBoolean(r4, r5, r2)
            r8.webContentsDebuggingEnabled = r4
            org.json.JSONObject r4 = r8.configJSON
            org.json.JSONObject r5 = r8.configJSON
            java.lang.String r6 = "zoomEnabled"
            boolean r5 = com.getcapacitor.util.JSONUtils.getBoolean(r5, r6, r1)
            java.lang.String r6 = "android.zoomEnabled"
            boolean r4 = com.getcapacitor.util.JSONUtils.getBoolean(r4, r6, r5)
            r8.zoomableWebView = r4
            org.json.JSONObject r4 = r8.configJSON
            java.lang.String r5 = "android.resolveServiceWorkerRequests"
            boolean r4 = com.getcapacitor.util.JSONUtils.getBoolean(r4, r5, r0)
            r8.resolveServiceWorkerRequests = r4
            org.json.JSONObject r4 = r8.configJSON
            org.json.JSONObject r5 = r8.configJSON
            java.lang.String r6 = "loggingBehavior"
            java.lang.String r7 = "debug"
            java.lang.String r5 = com.getcapacitor.util.JSONUtils.getString(r5, r6, r7)
            java.lang.String r6 = "android.loggingBehavior"
            java.lang.String r4 = com.getcapacitor.util.JSONUtils.getString(r4, r6, r5)
            java.util.Locale r5 = java.util.Locale.ROOT
            java.lang.String r5 = r4.toLowerCase(r5)
            int r6 = r5.hashCode()
            switch(r6) {
                case 3387192: goto L_0x012e;
                case 1753018553: goto L_0x0124;
                default: goto L_0x0123;
            }
        L_0x0123:
            goto L_0x0138
        L_0x0124:
            java.lang.String r6 = "production"
            boolean r5 = r5.equals(r6)
            if (r5 == 0) goto L_0x0123
            r5 = r1
            goto L_0x0139
        L_0x012e:
            java.lang.String r6 = "none"
            boolean r5 = r5.equals(r6)
            if (r5 == 0) goto L_0x0123
            r5 = r0
            goto L_0x0139
        L_0x0138:
            r5 = -1
        L_0x0139:
            switch(r5) {
                case 0: goto L_0x0142;
                case 1: goto L_0x013f;
                default: goto L_0x013c;
            }
        L_0x013c:
            r8.loggingEnabled = r2
            goto L_0x0145
        L_0x013f:
            r8.loggingEnabled = r1
            goto L_0x0145
        L_0x0142:
            r8.loggingEnabled = r0
        L_0x0145:
            org.json.JSONObject r0 = r8.configJSON
            org.json.JSONObject r1 = r8.configJSON
            boolean r5 = r8.initialFocus
            java.lang.String r6 = "initialFocus"
            boolean r1 = com.getcapacitor.util.JSONUtils.getBoolean(r1, r6, r5)
            java.lang.String r5 = "android.initialFocus"
            boolean r0 = com.getcapacitor.util.JSONUtils.getBoolean(r0, r5, r1)
            r8.initialFocus = r0
            org.json.JSONObject r0 = r8.configJSON
            java.lang.String r1 = "plugins"
            org.json.JSONObject r0 = com.getcapacitor.util.JSONUtils.getObject(r0, r1)
            java.util.Map r0 = deserializePluginsConfig(r0)
            r8.pluginsConfiguration = r0
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: com.getcapacitor.CapConfig.deserializeConfig(android.content.Context):void");
    }

    private boolean validateScheme(String scheme) {
        if (Arrays.asList(new String[]{"file", "ftp", "ftps", "ws", "wss", "about", "blob", "data"}).contains(scheme)) {
            Logger.warn(scheme + " is not an allowed scheme.  Defaulting to https.");
            return false;
        }
        if (!scheme.equals("http") && !scheme.equals("https")) {
            Logger.warn("Using a non-standard scheme: " + scheme + " for Android. This is known to cause issues as of Android Webview 117.");
        }
        return true;
    }

    public boolean isHTML5Mode() {
        return this.html5mode;
    }

    public String getServerUrl() {
        return this.serverUrl;
    }

    public String getErrorPath() {
        return this.errorPath;
    }

    public String getHostname() {
        return this.hostname;
    }

    public String getStartPath() {
        return this.startPath;
    }

    public String getAndroidScheme() {
        return this.androidScheme;
    }

    public String[] getAllowNavigation() {
        return this.allowNavigation;
    }

    public String getOverriddenUserAgentString() {
        return this.overriddenUserAgentString;
    }

    public String getAppendedUserAgentString() {
        return this.appendedUserAgentString;
    }

    public String getBackgroundColor() {
        return this.backgroundColor;
    }

    public boolean isMixedContentAllowed() {
        return this.allowMixedContent;
    }

    public boolean isInputCaptured() {
        return this.captureInput;
    }

    public boolean isResolveServiceWorkerRequests() {
        return this.resolveServiceWorkerRequests;
    }

    public boolean isWebContentsDebuggingEnabled() {
        return this.webContentsDebuggingEnabled;
    }

    public boolean isZoomableWebView() {
        return this.zoomableWebView;
    }

    public boolean isLoggingEnabled() {
        return this.loggingEnabled;
    }

    public boolean isInitialFocus() {
        return this.initialFocus;
    }

    public boolean isUsingLegacyBridge() {
        return this.useLegacyBridge;
    }

    public int getMinWebViewVersion() {
        if (this.minWebViewVersion >= 55) {
            return this.minWebViewVersion;
        }
        Logger.warn("Specified minimum webview version is too low, defaulting to 55");
        return 55;
    }

    public int getMinHuaweiWebViewVersion() {
        if (this.minHuaweiWebViewVersion >= 10) {
            return this.minHuaweiWebViewVersion;
        }
        Logger.warn("Specified minimum Huawei webview version is too low, defaulting to 10");
        return 10;
    }

    public PluginConfig getPluginConfiguration(String pluginId) {
        PluginConfig pluginConfig = this.pluginsConfiguration.get(pluginId);
        if (pluginConfig == null) {
            return new PluginConfig(new JSONObject());
        }
        return pluginConfig;
    }

    @Deprecated
    public JSONObject getObject(String key) {
        try {
            return this.configJSON.getJSONObject(key);
        } catch (Exception e) {
            return null;
        }
    }

    @Deprecated
    public String getString(String key) {
        return JSONUtils.getString(this.configJSON, key, (String) null);
    }

    @Deprecated
    public String getString(String key, String defaultValue) {
        return JSONUtils.getString(this.configJSON, key, defaultValue);
    }

    @Deprecated
    public boolean getBoolean(String key, boolean defaultValue) {
        return JSONUtils.getBoolean(this.configJSON, key, defaultValue);
    }

    @Deprecated
    public int getInt(String key, int defaultValue) {
        return JSONUtils.getInt(this.configJSON, key, defaultValue);
    }

    @Deprecated
    public String[] getArray(String key) {
        return JSONUtils.getArray(this.configJSON, key, (String[]) null);
    }

    @Deprecated
    public String[] getArray(String key, String[] defaultValue) {
        return JSONUtils.getArray(this.configJSON, key, defaultValue);
    }

    /* access modifiers changed from: private */
    public static Map<String, PluginConfig> deserializePluginsConfig(JSONObject pluginsConfig) {
        Map<String, PluginConfig> pluginsMap = new HashMap<>();
        if (pluginsConfig == null) {
            return pluginsMap;
        }
        Iterator<String> pluginIds = pluginsConfig.keys();
        while (pluginIds.hasNext()) {
            String pluginId = pluginIds.next();
            try {
                pluginsMap.put(pluginId, new PluginConfig(pluginsConfig.getJSONObject(pluginId)));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return pluginsMap;
    }

    public static class Builder {
        /* access modifiers changed from: private */
        public boolean allowMixedContent = false;
        /* access modifiers changed from: private */
        public String[] allowNavigation;
        /* access modifiers changed from: private */
        public String androidScheme = "https";
        /* access modifiers changed from: private */
        public String appendedUserAgentString;
        /* access modifiers changed from: private */
        public String backgroundColor;
        /* access modifiers changed from: private */
        public boolean captureInput = false;
        private Context context;
        /* access modifiers changed from: private */
        public String errorPath;
        /* access modifiers changed from: private */
        public String hostname = "localhost";
        /* access modifiers changed from: private */
        public boolean html5mode = true;
        /* access modifiers changed from: private */
        public boolean initialFocus = false;
        /* access modifiers changed from: private */
        public boolean loggingEnabled = true;
        /* access modifiers changed from: private */
        public int minHuaweiWebViewVersion = 10;
        /* access modifiers changed from: private */
        public int minWebViewVersion = 60;
        /* access modifiers changed from: private */
        public String overriddenUserAgentString;
        /* access modifiers changed from: private */
        public Map<String, PluginConfig> pluginsConfiguration = new HashMap();
        /* access modifiers changed from: private */
        public boolean resolveServiceWorkerRequests = true;
        /* access modifiers changed from: private */
        public String serverUrl;
        /* access modifiers changed from: private */
        public String startPath = null;
        /* access modifiers changed from: private */
        public boolean useLegacyBridge = false;
        /* access modifiers changed from: private */
        public Boolean webContentsDebuggingEnabled = null;
        /* access modifiers changed from: private */
        public boolean zoomableWebView = false;

        public Builder(Context context2) {
            this.context = context2;
        }

        public CapConfig create() {
            if (this.webContentsDebuggingEnabled == null) {
                this.webContentsDebuggingEnabled = Boolean.valueOf((this.context.getApplicationInfo().flags & 2) != 0);
            }
            return new CapConfig(this);
        }

        public Builder setPluginsConfiguration(JSONObject pluginsConfiguration2) {
            this.pluginsConfiguration = CapConfig.deserializePluginsConfig(pluginsConfiguration2);
            return this;
        }

        public Builder setHTML5mode(boolean html5mode2) {
            this.html5mode = html5mode2;
            return this;
        }

        public Builder setServerUrl(String serverUrl2) {
            this.serverUrl = serverUrl2;
            return this;
        }

        public Builder setErrorPath(String errorPath2) {
            this.errorPath = errorPath2;
            return this;
        }

        public Builder setHostname(String hostname2) {
            this.hostname = hostname2;
            return this;
        }

        public Builder setStartPath(String path) {
            this.startPath = path;
            return this;
        }

        public Builder setAndroidScheme(String androidScheme2) {
            this.androidScheme = androidScheme2;
            return this;
        }

        public Builder setAllowNavigation(String[] allowNavigation2) {
            this.allowNavigation = allowNavigation2;
            return this;
        }

        public Builder setOverriddenUserAgentString(String overriddenUserAgentString2) {
            this.overriddenUserAgentString = overriddenUserAgentString2;
            return this;
        }

        public Builder setAppendedUserAgentString(String appendedUserAgentString2) {
            this.appendedUserAgentString = appendedUserAgentString2;
            return this;
        }

        public Builder setBackgroundColor(String backgroundColor2) {
            this.backgroundColor = backgroundColor2;
            return this;
        }

        public Builder setAllowMixedContent(boolean allowMixedContent2) {
            this.allowMixedContent = allowMixedContent2;
            return this;
        }

        public Builder setCaptureInput(boolean captureInput2) {
            this.captureInput = captureInput2;
            return this;
        }

        public Builder setUseLegacyBridge(boolean useLegacyBridge2) {
            this.useLegacyBridge = useLegacyBridge2;
            return this;
        }

        public Builder setResolveServiceWorkerRequests(boolean resolveServiceWorkerRequests2) {
            this.resolveServiceWorkerRequests = resolveServiceWorkerRequests2;
            return this;
        }

        public Builder setWebContentsDebuggingEnabled(boolean webContentsDebuggingEnabled2) {
            this.webContentsDebuggingEnabled = Boolean.valueOf(webContentsDebuggingEnabled2);
            return this;
        }

        public Builder setZoomableWebView(boolean zoomableWebView2) {
            this.zoomableWebView = zoomableWebView2;
            return this;
        }

        public Builder setLoggingEnabled(boolean enabled) {
            this.loggingEnabled = enabled;
            return this;
        }

        public Builder setInitialFocus(boolean focus) {
            this.initialFocus = focus;
            return this;
        }
    }
}
