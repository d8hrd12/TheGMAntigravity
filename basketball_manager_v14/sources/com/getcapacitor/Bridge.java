package com.getcapacitor;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContract;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.pm.PackageInfoCompat;
import androidx.fragment.app.Fragment;
import com.getcapacitor.android.R;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.cordova.MockCordovaInterfaceImpl;
import com.getcapacitor.cordova.MockCordovaWebViewImpl;
import com.getcapacitor.plugin.CapacitorCookies;
import com.getcapacitor.plugin.CapacitorHttp;
import com.getcapacitor.plugin.SystemBars;
import com.getcapacitor.util.HostMask;
import com.getcapacitor.util.InternalUtils;
import com.getcapacitor.util.PermissionHelper;
import com.getcapacitor.util.WebColor;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.cordova.ConfigXmlParser;
import org.apache.cordova.CordovaPreferences;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginEntry;
import org.apache.cordova.PluginManager;
import org.json.JSONException;

public class Bridge {
    private static final String BUNDLE_LAST_PLUGIN_CALL_METHOD_NAME_KEY = "capacitorLastActivityPluginMethod";
    private static final String BUNDLE_LAST_PLUGIN_ID_KEY = "capacitorLastActivityPluginId";
    private static final String BUNDLE_PLUGIN_CALL_BUNDLE_KEY = "capacitorLastPluginCallBundle";
    private static final String BUNDLE_PLUGIN_CALL_OPTIONS_SAVED_KEY = "capacitorLastPluginCallOptions";
    public static final String CAPACITOR_CONTENT_START = "/_capacitor_content_";
    public static final String CAPACITOR_FILE_START = "/_capacitor_file_";
    @Deprecated
    public static final String CAPACITOR_HTTPS_INTERCEPTOR_START = "/_capacitor_https_interceptor_";
    public static final String CAPACITOR_HTTPS_SCHEME = "https";
    public static final String CAPACITOR_HTTP_INTERCEPTOR_START = "/_capacitor_http_interceptor_";
    public static final String CAPACITOR_HTTP_INTERCEPTOR_URL_PARAM = "u";
    public static final String CAPACITOR_HTTP_SCHEME = "http";
    public static final int DEFAULT_ANDROID_WEBVIEW_VERSION = 60;
    public static final int DEFAULT_HUAWEI_WEBVIEW_VERSION = 10;
    public static final String DEFAULT_WEB_ASSET_DIR = "public";
    private static final String LAST_BINARY_VERSION_CODE = "lastBinaryVersionCode";
    private static final String LAST_BINARY_VERSION_NAME = "lastBinaryVersionName";
    private static final String MINIMUM_ANDROID_WEBVIEW_ERROR = "System WebView is not supported";
    public static final int MINIMUM_ANDROID_WEBVIEW_VERSION = 55;
    public static final int MINIMUM_HUAWEI_WEBVIEW_VERSION = 10;
    private static final String PERMISSION_PREFS_NAME = "PluginPermStates";
    private Set<String> allowedOriginRules;
    private App app;
    private HostMask appAllowNavigationMask;
    private String appUrl;
    private String appUrlConfig;
    private ArrayList<String> authorities;
    private Boolean canInjectJS;
    private CapConfig config;
    private final AppCompatActivity context;
    public final MockCordovaInterfaceImpl cordovaInterface;
    private CordovaWebView cordovaWebView;
    private final Fragment fragment;
    private final HandlerThread handlerThread;
    private final List<Class<? extends Plugin>> initialPlugins;
    private Uri intentUri;
    private WebViewLocalServer localServer;
    private String localUrl;
    private ArrayList<String> miscJSFileInjections;
    private final MessageHandler msgHandler;
    private PluginCall pluginCallForLastActivity;
    private final List<Plugin> pluginInstances;
    private Map<String, PluginHandle> plugins;
    private CordovaPreferences preferences;
    private RouteProcessor routeProcessor;
    private Map<String, PluginCall> savedCalls;
    private Map<String, LinkedList<String>> savedPermissionCallIds;
    private ServerPath serverPath;
    private Handler taskHandler;
    private final WebView webView;
    private BridgeWebViewClient webViewClient;
    private List<WebViewListener> webViewListeners;

    @Deprecated
    public Bridge(AppCompatActivity context2, WebView webView2, List<Class<? extends Plugin>> initialPlugins2, MockCordovaInterfaceImpl cordovaInterface2, PluginManager pluginManager, CordovaPreferences preferences2, CapConfig config2) {
        this(context2, (ServerPath) null, (Fragment) null, webView2, initialPlugins2, new ArrayList(), cordovaInterface2, pluginManager, preferences2, config2);
    }

    private Bridge(AppCompatActivity context2, ServerPath serverPath2, Fragment fragment2, WebView webView2, List<Class<? extends Plugin>> initialPlugins2, List<Plugin> pluginInstances2, MockCordovaInterfaceImpl cordovaInterface2, PluginManager pluginManager, CordovaPreferences preferences2, CapConfig config2) {
        this.allowedOriginRules = new HashSet();
        this.authorities = new ArrayList<>();
        this.miscJSFileInjections = new ArrayList<>();
        this.canInjectJS = true;
        this.handlerThread = new HandlerThread("CapacitorPlugins");
        this.taskHandler = null;
        this.plugins = new HashMap();
        this.savedCalls = new HashMap();
        this.savedPermissionCallIds = new HashMap();
        this.webViewListeners = new ArrayList();
        this.app = new App();
        this.serverPath = serverPath2;
        this.context = context2;
        this.fragment = fragment2;
        this.webView = webView2;
        this.webViewClient = new BridgeWebViewClient(this);
        this.initialPlugins = initialPlugins2;
        this.pluginInstances = pluginInstances2;
        this.cordovaInterface = cordovaInterface2;
        this.preferences = preferences2;
        this.handlerThread.start();
        this.taskHandler = new Handler(this.handlerThread.getLooper());
        this.config = config2 != null ? config2 : CapConfig.loadDefault(getActivity());
        Logger.init(this.config);
        initWebView();
        setAllowedOriginRules();
        this.msgHandler = new MessageHandler(this, webView2, pluginManager);
        this.intentUri = context2.getIntent().getData();
        registerAllPlugins();
        loadWebView();
    }

    private void setAllowedOriginRules() {
        String[] appAllowNavigationConfig = this.config.getAllowNavigation();
        this.allowedOriginRules.add(getScheme() + "://" + getHost());
        if (getServerUrl() != null) {
            this.allowedOriginRules.add(getServerUrl());
        }
        if (appAllowNavigationConfig != null) {
            for (String allowNavigation : appAllowNavigationConfig) {
                if (!allowNavigation.startsWith("http")) {
                    this.allowedOriginRules.add("https://" + allowNavigation);
                } else {
                    this.allowedOriginRules.add(allowNavigation);
                }
            }
            this.authorities.addAll(Arrays.asList(appAllowNavigationConfig));
        }
        this.appAllowNavigationMask = HostMask.Parser.parse(appAllowNavigationConfig);
    }

    public App getApp() {
        return this.app;
    }

    /* JADX WARNING: Removed duplicated region for block: B:11:0x008c  */
    /* JADX WARNING: Removed duplicated region for block: B:25:0x00d1  */
    /* JADX WARNING: Removed duplicated region for block: B:32:0x00e6  */
    /* JADX WARNING: Removed duplicated region for block: B:36:0x0104  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private void loadWebView() {
        /*
            r8 = this;
            com.getcapacitor.CapConfig r0 = r8.config
            boolean r6 = r0.isHTML5Mode()
            com.getcapacitor.JSInjector r1 = r8.getJSInjector()
            java.lang.String r0 = "DOCUMENT_START_SCRIPT"
            boolean r0 = androidx.webkit.WebViewFeature.isFeatureSupported(r0)
            r7 = 0
            if (r0 == 0) goto L_0x0047
            java.lang.String r0 = r8.appUrl
            android.net.Uri r0 = android.net.Uri.parse(r0)
            android.net.Uri$Builder r0 = r0.buildUpon()
            android.net.Uri$Builder r0 = r0.path(r7)
            android.net.Uri$Builder r0 = r0.fragment(r7)
            android.net.Uri$Builder r0 = r0.clearQuery()
            android.net.Uri r0 = r0.build()
            java.lang.String r2 = r0.toString()
            android.webkit.WebView r0 = r8.webView     // Catch:{ IllegalArgumentException -> 0x0041 }
            java.lang.String r3 = r1.getScriptString()     // Catch:{ IllegalArgumentException -> 0x0041 }
            java.util.Set r4 = java.util.Collections.singleton(r2)     // Catch:{ IllegalArgumentException -> 0x0041 }
            androidx.webkit.WebViewCompat.addDocumentStartJavaScript(r0, r3, r4)     // Catch:{ IllegalArgumentException -> 0x0041 }
            r1 = 0
            r4 = r1
            goto L_0x0048
        L_0x0041:
            r0 = move-exception
            java.lang.String r3 = "Invalid url, using fallback"
            com.getcapacitor.Logger.warn(r3)
        L_0x0047:
            r4 = r1
        L_0x0048:
            com.getcapacitor.WebViewLocalServer r1 = new com.getcapacitor.WebViewLocalServer
            androidx.appcompat.app.AppCompatActivity r2 = r8.context
            java.util.ArrayList<java.lang.String> r5 = r8.authorities
            r3 = r8
            r1.<init>(r2, r3, r4, r5, r6)
            r3.localServer = r1
            com.getcapacitor.WebViewLocalServer r0 = r3.localServer
            java.lang.String r1 = "public"
            r0.hostAssets(r1)
            java.lang.StringBuilder r0 = new java.lang.StringBuilder
            r0.<init>()
            java.lang.String r1 = "Loading app at "
            java.lang.StringBuilder r0 = r0.append(r1)
            java.lang.String r1 = r3.appUrl
            java.lang.StringBuilder r0 = r0.append(r1)
            java.lang.String r0 = r0.toString()
            com.getcapacitor.Logger.debug(r0)
            android.webkit.WebView r0 = r3.webView
            com.getcapacitor.BridgeWebChromeClient r1 = new com.getcapacitor.BridgeWebChromeClient
            r1.<init>(r8)
            r0.setWebChromeClient(r1)
            android.webkit.WebView r0 = r3.webView
            com.getcapacitor.BridgeWebViewClient r1 = r3.webViewClient
            r0.setWebViewClient(r1)
            com.getcapacitor.CapConfig r0 = r3.config
            boolean r0 = r0.isResolveServiceWorkerRequests()
            if (r0 == 0) goto L_0x0098
            android.webkit.ServiceWorkerController r0 = android.webkit.ServiceWorkerController.getInstance()
            com.getcapacitor.Bridge$1 r1 = new com.getcapacitor.Bridge$1
            r1.<init>()
            r0.setServiceWorkerClient(r1)
        L_0x0098:
            boolean r0 = r8.isDeployDisabled()
            if (r0 != 0) goto L_0x00cb
            boolean r0 = r8.isNewBinary()
            if (r0 != 0) goto L_0x00cb
            android.content.Context r0 = r8.getContext()
            java.lang.String r1 = "CapWebViewSettings"
            r2 = 0
            android.content.SharedPreferences r0 = r0.getSharedPreferences(r1, r2)
            java.lang.String r1 = "serverBasePath"
            java.lang.String r1 = r0.getString(r1, r7)
            if (r1 == 0) goto L_0x00cb
            boolean r2 = r1.isEmpty()
            if (r2 != 0) goto L_0x00cb
            java.io.File r2 = new java.io.File
            r2.<init>(r1)
            boolean r2 = r2.exists()
            if (r2 == 0) goto L_0x00cb
            r8.setServerBasePath(r1)
        L_0x00cb:
            boolean r0 = r8.isMinimumWebViewInstalled()
            if (r0 != 0) goto L_0x00e2
            java.lang.String r0 = r8.getErrorUrl()
            if (r0 == 0) goto L_0x00dd
            android.webkit.WebView r1 = r3.webView
            r1.loadUrl(r0)
            return
        L_0x00dd:
            java.lang.String r1 = "System WebView is not supported"
            com.getcapacitor.Logger.error(r1)
        L_0x00e2:
            com.getcapacitor.ServerPath r0 = r3.serverPath
            if (r0 == 0) goto L_0x0104
            com.getcapacitor.ServerPath r0 = r3.serverPath
            com.getcapacitor.ServerPath$PathType r0 = r0.getType()
            com.getcapacitor.ServerPath$PathType r1 = com.getcapacitor.ServerPath.PathType.ASSET_PATH
            if (r0 != r1) goto L_0x00fa
            com.getcapacitor.ServerPath r0 = r3.serverPath
            java.lang.String r0 = r0.getPath()
            r8.setServerAssetPath(r0)
            goto L_0x010b
        L_0x00fa:
            com.getcapacitor.ServerPath r0 = r3.serverPath
            java.lang.String r0 = r0.getPath()
            r8.setServerBasePath(r0)
            goto L_0x010b
        L_0x0104:
            android.webkit.WebView r0 = r3.webView
            java.lang.String r1 = r3.appUrl
            r0.loadUrl(r1)
        L_0x010b:
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: com.getcapacitor.Bridge.loadWebView():void");
    }

    public boolean isMinimumWebViewInstalled() {
        PackageManager pm = getContext().getPackageManager();
        if (Build.VERSION.SDK_INT >= 26) {
            PackageInfo info = WebView.getCurrentWebViewPackage();
            Matcher matcher = Pattern.compile("(\\d+)").matcher(info.versionName);
            if (!matcher.find()) {
                return false;
            }
            int majorVersion = Integer.parseInt(matcher.group(0));
            if (info.packageName.equals("com.huawei.webview")) {
                if (majorVersion >= this.config.getMinHuaweiWebViewVersion()) {
                    return true;
                }
                return false;
            } else if (majorVersion >= this.config.getMinWebViewVersion()) {
                return true;
            } else {
                return false;
            }
        } else {
            try {
                if (Integer.parseInt(InternalUtils.getPackageInfo(pm, "com.android.chrome").versionName.split("\\.")[0]) >= this.config.getMinWebViewVersion()) {
                    return true;
                }
                return false;
            } catch (Exception ex) {
                Logger.warn("Unable to get package info for 'com.google.android.webview'" + ex.toString());
                try {
                    if (Integer.parseInt(InternalUtils.getPackageInfo(pm, "com.android.webview").versionName.split("\\.")[0]) >= this.config.getMinWebViewVersion()) {
                        return true;
                    }
                    return false;
                } catch (Exception ex2) {
                    Logger.warn("Unable to get package info for 'com.android.webview'" + ex2.toString());
                    return extractWebViewMajorVersion(pm, "com.amazon.webview.chromium") >= this.config.getMinWebViewVersion();
                }
            }
        }
    }

    private int extractWebViewMajorVersion(PackageManager pm, String webViewPackageName) {
        try {
            return Integer.parseInt(InternalUtils.getPackageInfo(pm, webViewPackageName).versionName.split("\\.")[0]);
        } catch (Exception ex) {
            Logger.warn(String.format("Unable to get package info for '%s' with err '%s'", new Object[]{webViewPackageName, ex}));
            return 0;
        }
    }

    public boolean launchIntent(Uri url) {
        Boolean shouldOverrideLoad;
        for (Map.Entry<String, PluginHandle> entry : this.plugins.entrySet()) {
            Plugin plugin = entry.getValue().getInstance();
            if (plugin != null && (shouldOverrideLoad = plugin.shouldOverrideLoad(url)) != null) {
                return shouldOverrideLoad.booleanValue();
            }
        }
        if (url.getScheme().equals("data") || url.getScheme().equals("blob")) {
            return false;
        }
        Uri appUri = Uri.parse(this.appUrl);
        if ((appUri.getHost().equals(url.getHost()) && url.getScheme().equals(appUri.getScheme())) || this.appAllowNavigationMask.matches(url.getHost())) {
            return false;
        }
        try {
            getContext().startActivity(new Intent("android.intent.action.VIEW", url));
            return true;
        } catch (ActivityNotFoundException e) {
            return true;
        }
    }

    private boolean isNewBinary() {
        String versionCode = "";
        String versionName = "";
        SharedPreferences prefs = getContext().getSharedPreferences(com.getcapacitor.plugin.WebView.WEBVIEW_PREFS_NAME, 0);
        String lastVersionCode = prefs.getString(LAST_BINARY_VERSION_CODE, (String) null);
        String lastVersionName = prefs.getString(LAST_BINARY_VERSION_NAME, (String) null);
        try {
            PackageInfo pInfo = InternalUtils.getPackageInfo(getContext().getPackageManager(), getContext().getPackageName());
            versionCode = Integer.toString((int) PackageInfoCompat.getLongVersionCode(pInfo));
            versionName = pInfo.versionName;
        } catch (Exception ex) {
            Logger.error("Unable to get package info", ex);
        }
        if (versionCode.equals(lastVersionCode) && versionName.equals(lastVersionName)) {
            return false;
        }
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString(LAST_BINARY_VERSION_CODE, versionCode);
        editor.putString(LAST_BINARY_VERSION_NAME, versionName);
        editor.putString(com.getcapacitor.plugin.WebView.CAP_SERVER_PATH, "");
        editor.apply();
        return true;
    }

    public boolean isDeployDisabled() {
        return this.preferences.getBoolean("DisableDeploy", false);
    }

    public boolean shouldKeepRunning() {
        return this.preferences.getBoolean("KeepRunning", true);
    }

    public void handleAppUrlLoadError(Exception ex) {
        if (ex instanceof SocketTimeoutException) {
            Logger.error("Unable to load app. Ensure the server is running at " + this.appUrl + ", or modify the appUrl setting in capacitor.config.json (make sure to npx cap copy after to commit changes).", ex);
        }
    }

    public boolean isDevMode() {
        return (getActivity().getApplicationInfo().flags & 2) != 0;
    }

    /* access modifiers changed from: protected */
    public void setCordovaWebView(CordovaWebView cordovaWebView2) {
        this.cordovaWebView = cordovaWebView2;
    }

    public Context getContext() {
        return this.context;
    }

    public AppCompatActivity getActivity() {
        return this.context;
    }

    public Fragment getFragment() {
        return this.fragment;
    }

    public WebView getWebView() {
        return this.webView;
    }

    public Uri getIntentUri() {
        return this.intentUri;
    }

    public String getScheme() {
        return this.config.getAndroidScheme();
    }

    public String getHost() {
        return this.config.getHostname();
    }

    public String getServerUrl() {
        return this.config.getServerUrl();
    }

    public String getErrorUrl() {
        String errorPath = this.config.getErrorPath();
        if (errorPath == null || errorPath.trim().isEmpty()) {
            return null;
        }
        return (getScheme() + "://" + getHost()) + "/" + errorPath;
    }

    public String getAppUrl() {
        return this.appUrl;
    }

    public CapConfig getConfig() {
        return this.config;
    }

    public void reset() {
        this.savedCalls = new HashMap();
        for (PluginHandle handle : this.plugins.values()) {
            handle.getInstance().removeAllListeners();
        }
    }

    private void initWebView() {
        WebSettings settings = this.webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setGeolocationEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        if (this.config.isMixedContentAllowed()) {
            settings.setMixedContentMode(0);
        }
        String appendUserAgent = this.config.getAppendedUserAgentString();
        if (appendUserAgent != null) {
            settings.setUserAgentString(settings.getUserAgentString() + " " + appendUserAgent);
        }
        String overrideUserAgent = this.config.getOverriddenUserAgentString();
        if (overrideUserAgent != null) {
            settings.setUserAgentString(overrideUserAgent);
        }
        String backgroundColor = this.config.getBackgroundColor();
        if (backgroundColor != null) {
            try {
                this.webView.setBackgroundColor(WebColor.parseColor(backgroundColor));
            } catch (IllegalArgumentException e) {
                Logger.debug("WebView background color not applied");
            }
        }
        settings.setDisplayZoomControls(false);
        settings.setBuiltInZoomControls(this.config.isZoomableWebView());
        if (this.config.isInitialFocus()) {
            this.webView.requestFocusFromTouch();
        }
        WebView.setWebContentsDebuggingEnabled(this.config.isWebContentsDebuggingEnabled());
        this.appUrlConfig = getServerUrl();
        String authority = getHost();
        this.authorities.add(authority);
        String scheme = getScheme();
        this.localUrl = scheme + "://" + authority;
        if (this.appUrlConfig != null) {
            try {
                this.authorities.add(new URL(this.appUrlConfig).getAuthority());
                this.localUrl = this.appUrlConfig;
                this.appUrl = this.appUrlConfig;
            } catch (Exception ex) {
                Logger.error("Provided server url is invalid: " + ex.getMessage());
                return;
            }
        } else {
            this.appUrl = this.localUrl;
            if (!scheme.equals("http") && !scheme.equals("https")) {
                this.appUrl += "/";
            }
        }
        String appUrlPath = this.config.getStartPath();
        if (appUrlPath != null && !appUrlPath.trim().isEmpty()) {
            this.appUrl += appUrlPath;
        }
    }

    private void registerAllPlugins() {
        registerPlugin(CapacitorCookies.class);
        registerPlugin(com.getcapacitor.plugin.WebView.class);
        registerPlugin(CapacitorHttp.class);
        registerPlugin(SystemBars.class);
        for (Class<? extends Plugin> pluginClass : this.initialPlugins) {
            registerPlugin(pluginClass);
        }
        for (Plugin plugin : this.pluginInstances) {
            registerPluginInstance(plugin);
        }
    }

    public void registerPlugins(Class<? extends Plugin>[] pluginClasses) {
        for (Class<? extends Plugin> plugin : pluginClasses) {
            registerPlugin(plugin);
        }
    }

    public void registerPluginInstances(Plugin[] pluginInstances2) {
        for (Plugin plugin : pluginInstances2) {
            registerPluginInstance(plugin);
        }
    }

    private String getLegacyPluginName(Class<? extends Plugin> pluginClass) {
        NativePlugin legacyPluginAnnotation = (NativePlugin) pluginClass.getAnnotation(NativePlugin.class);
        if (legacyPluginAnnotation != null) {
            return legacyPluginAnnotation.name();
        }
        Logger.error("Plugin doesn't have the @CapacitorPlugin annotation. Please add it");
        return null;
    }

    public void registerPlugin(Class<? extends Plugin> pluginClass) {
        String pluginId = pluginId(pluginClass);
        if (pluginId != null) {
            try {
                this.plugins.put(pluginId, new PluginHandle(this, pluginClass));
            } catch (InvalidPluginException e) {
                logInvalidPluginException(pluginClass);
            } catch (PluginLoadException ex) {
                logPluginLoadException(pluginClass, ex);
            }
        }
    }

    public void registerPluginInstance(Plugin plugin) {
        Class<?> cls = plugin.getClass();
        String pluginId = pluginId(cls);
        if (pluginId != null) {
            try {
                this.plugins.put(pluginId, new PluginHandle(this, plugin));
            } catch (InvalidPluginException e) {
                logInvalidPluginException(cls);
            }
        }
    }

    private String pluginId(Class<? extends Plugin> clazz) {
        String pluginName = pluginName(clazz);
        String pluginId = clazz.getSimpleName();
        if (pluginName == null) {
            return null;
        }
        if (!pluginName.equals("")) {
            pluginId = pluginName;
        }
        Logger.debug("Registering plugin instance: " + pluginId);
        return pluginId;
    }

    private String pluginName(Class<? extends Plugin> clazz) {
        CapacitorPlugin pluginAnnotation = (CapacitorPlugin) clazz.getAnnotation(CapacitorPlugin.class);
        if (pluginAnnotation == null) {
            return getLegacyPluginName(clazz);
        }
        return pluginAnnotation.name();
    }

    private void logInvalidPluginException(Class<? extends Plugin> clazz) {
        Logger.error("NativePlugin " + clazz.getName() + " is invalid. Ensure the @CapacitorPlugin annotation exists on the plugin class and the class extends Plugin");
    }

    private void logPluginLoadException(Class<? extends Plugin> clazz, Exception ex) {
        Logger.error("NativePlugin " + clazz.getName() + " failed to load", ex);
    }

    public PluginHandle getPlugin(String pluginId) {
        return this.plugins.get(pluginId);
    }

    @Deprecated
    public PluginHandle getPluginWithRequestCode(int requestCode) {
        for (PluginHandle handle : this.plugins.values()) {
            CapacitorPlugin pluginAnnotation = handle.getPluginAnnotation();
            int i = 0;
            if (pluginAnnotation == null) {
                NativePlugin legacyPluginAnnotation = handle.getLegacyPluginAnnotation();
                if (legacyPluginAnnotation == null) {
                    continue;
                } else if (legacyPluginAnnotation.permissionRequestCode() == requestCode) {
                    return handle;
                } else {
                    int[] requestCodes = legacyPluginAnnotation.requestCodes();
                    int length = requestCodes.length;
                    while (i < length) {
                        if (requestCodes[i] == requestCode) {
                            return handle;
                        }
                        i++;
                    }
                    continue;
                }
            } else {
                int[] requestCodes2 = pluginAnnotation.requestCodes();
                int length2 = requestCodes2.length;
                while (i < length2) {
                    if (requestCodes2[i] == requestCode) {
                        return handle;
                    }
                    i++;
                }
                continue;
            }
        }
        return null;
    }

    public void callPluginMethod(String pluginId, String methodName, PluginCall call) {
        try {
            PluginHandle plugin = getPlugin(pluginId);
            if (plugin == null) {
                Logger.error("unable to find plugin : " + pluginId);
                call.errorCallback("unable to find plugin : " + pluginId);
                return;
            }
            if (Logger.shouldLog()) {
                Logger.verbose("callback: " + call.getCallbackId() + ", pluginId: " + plugin.getId() + ", methodName: " + methodName + ", methodData: " + call.getData().toString());
            }
            this.taskHandler.post(new Bridge$$ExternalSyntheticLambda0(this, plugin, methodName, call));
        } catch (Exception ex) {
            Logger.error(Logger.tags("callPluginMethod"), "error : " + ex, (Throwable) null);
            call.errorCallback(ex.toString());
        }
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$callPluginMethod$0(PluginHandle plugin, String methodName, PluginCall call) {
        try {
            plugin.invoke(methodName, call);
            if (call.isKeptAlive()) {
                saveCall(call);
            }
        } catch (InvalidPluginMethodException | PluginLoadException ex) {
            Logger.error("Unable to execute plugin method", ex);
        } catch (Exception ex2) {
            Logger.error("Serious error executing plugin", ex2);
            throw new RuntimeException(ex2);
        }
    }

    public void eval(String js, ValueCallback<String> callback) {
        new Handler(this.context.getMainLooper()).post(new Bridge$$ExternalSyntheticLambda1(this, js, callback));
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$eval$0(String js, ValueCallback callback) {
        this.webView.evaluateJavascript(js, callback);
    }

    public void logToJs(String message, String level) {
        eval("window.Capacitor.logJs(\"" + message + "\", \"" + level + "\")", (ValueCallback<String>) null);
    }

    public void logToJs(String message) {
        logToJs(message, "log");
    }

    static /* synthetic */ void lambda$triggerJSEvent$0(String s) {
    }

    public void triggerJSEvent(String eventName, String target) {
        eval("window.Capacitor.triggerEvent(\"" + eventName + "\", \"" + target + "\")", new Bridge$$ExternalSyntheticLambda2());
    }

    static /* synthetic */ void lambda$triggerJSEvent$1(String s) {
    }

    public void triggerJSEvent(String eventName, String target, String data) {
        eval("window.Capacitor.triggerEvent(\"" + eventName + "\", \"" + target + "\", " + data + ")", new Bridge$$ExternalSyntheticLambda4());
    }

    public void triggerWindowJSEvent(String eventName) {
        triggerJSEvent(eventName, "window");
    }

    public void triggerWindowJSEvent(String eventName, String data) {
        triggerJSEvent(eventName, "window", data);
    }

    public void triggerDocumentJSEvent(String eventName) {
        triggerJSEvent(eventName, "document");
    }

    public void triggerDocumentJSEvent(String eventName, String data) {
        triggerJSEvent(eventName, "document", data);
    }

    public void execute(Runnable runnable) {
        this.taskHandler.post(runnable);
    }

    public void executeOnMainThread(Runnable runnable) {
        new Handler(this.context.getMainLooper()).post(runnable);
    }

    public void saveCall(PluginCall call) {
        this.savedCalls.put(call.getCallbackId(), call);
    }

    public PluginCall getSavedCall(String callbackId) {
        if (callbackId == null) {
            return null;
        }
        return this.savedCalls.get(callbackId);
    }

    /* access modifiers changed from: package-private */
    public PluginCall getPluginCallForLastActivity() {
        PluginCall pluginCallForLastActivity2 = this.pluginCallForLastActivity;
        this.pluginCallForLastActivity = null;
        return pluginCallForLastActivity2;
    }

    /* access modifiers changed from: package-private */
    public void setPluginCallForLastActivity(PluginCall pluginCallForLastActivity2) {
        this.pluginCallForLastActivity = pluginCallForLastActivity2;
    }

    public void releaseCall(PluginCall call) {
        releaseCall(call.getCallbackId());
    }

    public void releaseCall(String callbackId) {
        this.savedCalls.remove(callbackId);
    }

    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r2v1, resolved type: java.lang.Object} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r1v2, resolved type: java.lang.String} */
    /* access modifiers changed from: protected */
    /* JADX WARNING: Multi-variable type inference failed */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public com.getcapacitor.PluginCall getPermissionCall(java.lang.String r4) {
        /*
            r3 = this;
            java.util.Map<java.lang.String, java.util.LinkedList<java.lang.String>> r0 = r3.savedPermissionCallIds
            java.lang.Object r0 = r0.get(r4)
            java.util.LinkedList r0 = (java.util.LinkedList) r0
            r1 = 0
            if (r0 == 0) goto L_0x0012
            java.lang.Object r2 = r0.poll()
            r1 = r2
            java.lang.String r1 = (java.lang.String) r1
        L_0x0012:
            com.getcapacitor.PluginCall r2 = r3.getSavedCall(r1)
            return r2
        */
        throw new UnsupportedOperationException("Method not decompiled: com.getcapacitor.Bridge.getPermissionCall(java.lang.String):com.getcapacitor.PluginCall");
    }

    /* access modifiers changed from: protected */
    public void savePermissionCall(PluginCall call) {
        if (call != null) {
            if (!this.savedPermissionCallIds.containsKey(call.getPluginId())) {
                this.savedPermissionCallIds.put(call.getPluginId(), new LinkedList());
            }
            this.savedPermissionCallIds.get(call.getPluginId()).add(call.getCallbackId());
            saveCall(call);
        }
    }

    public <I, O> ActivityResultLauncher<I> registerForActivityResult(ActivityResultContract<I, O> contract, ActivityResultCallback<O> callback) {
        if (this.fragment != null) {
            return this.fragment.registerForActivityResult(contract, callback);
        }
        return this.context.registerForActivityResult(contract, callback);
    }

    private JSInjector getJSInjector() {
        try {
            String globalJS = JSExport.getGlobalJS(this.context, this.config.isLoggingEnabled(), isDevMode());
            String bridgeJS = JSExport.getBridgeJS(this.context);
            String pluginJS = JSExport.getPluginJS(this.plugins.values());
            String cordovaJS = JSExport.getCordovaJS(this.context);
            String cordovaPluginsJS = JSExport.getCordovaPluginJS(this.context);
            String cordovaPluginsFileJS = JSExport.getCordovaPluginsFileJS(this.context);
            String localUrlJS = "window.WEBVIEW_SERVER_URL = '" + this.localUrl + "';";
            String miscJS = JSExport.getMiscFileJS(this.miscJSFileInjections, this.context);
            this.miscJSFileInjections = new ArrayList<>();
            this.canInjectJS = false;
            return new JSInjector(globalJS, bridgeJS, pluginJS, cordovaJS, cordovaPluginsJS, cordovaPluginsFileJS, localUrlJS, miscJS);
        } catch (Exception ex) {
            Logger.error("Unable to export Capacitor JS. App will not function!", ex);
            return null;
        }
    }

    public void injectScriptBeforeLoad(String path) {
        if (this.canInjectJS.booleanValue()) {
            this.miscJSFileInjections.add(path);
        }
    }

    public void restoreInstanceState(Bundle savedInstanceState) {
        String lastPluginId = savedInstanceState.getString(BUNDLE_LAST_PLUGIN_ID_KEY);
        String lastPluginCallMethod = savedInstanceState.getString(BUNDLE_LAST_PLUGIN_CALL_METHOD_NAME_KEY);
        String lastOptionsJson = savedInstanceState.getString(BUNDLE_PLUGIN_CALL_OPTIONS_SAVED_KEY);
        if (lastPluginId != null) {
            if (lastOptionsJson != null) {
                try {
                    this.pluginCallForLastActivity = new PluginCall(this.msgHandler, lastPluginId, PluginCall.CALLBACK_ID_DANGLING, lastPluginCallMethod, new JSObject(lastOptionsJson));
                } catch (JSONException ex) {
                    Logger.error("Unable to restore plugin call, unable to parse persisted JSON object", ex);
                }
            }
            Bundle bundleData = savedInstanceState.getBundle(BUNDLE_PLUGIN_CALL_BUNDLE_KEY);
            PluginHandle lastPlugin = getPlugin(lastPluginId);
            if (bundleData == null || lastPlugin == null) {
                Logger.error("Unable to restore last plugin call");
            } else {
                lastPlugin.getInstance().restoreState(bundleData);
            }
        }
    }

    public void saveInstanceState(Bundle outState) {
        Logger.debug("Saving instance state!");
        if (this.pluginCallForLastActivity != null) {
            PluginCall call = this.pluginCallForLastActivity;
            PluginHandle handle = getPlugin(call.getPluginId());
            if (handle != null) {
                Bundle bundle = handle.getInstance().saveInstanceState();
                if (bundle != null) {
                    outState.putString(BUNDLE_LAST_PLUGIN_ID_KEY, call.getPluginId());
                    outState.putString(BUNDLE_LAST_PLUGIN_CALL_METHOD_NAME_KEY, call.getMethodName());
                    outState.putString(BUNDLE_PLUGIN_CALL_OPTIONS_SAVED_KEY, call.getData().toString());
                    outState.putBundle(BUNDLE_PLUGIN_CALL_BUNDLE_KEY, bundle);
                    return;
                }
                Logger.error("Couldn't save last " + call.getPluginId() + "'s Plugin " + call.getMethodName() + " call");
            }
        }
    }

    @Deprecated
    public void startActivityForPluginWithResult(PluginCall call, Intent intent, int requestCode) {
        Logger.debug("Starting activity for result");
        this.pluginCallForLastActivity = call;
        getActivity().startActivityForResult(intent, requestCode);
    }

    /* access modifiers changed from: package-private */
    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        PluginHandle plugin = getPluginWithRequestCode(requestCode);
        if (plugin == null) {
            Logger.debug("Unable to find a Capacitor plugin to handle permission requestCode, trying Cordova plugins " + requestCode);
            try {
                return this.cordovaInterface.handlePermissionResult(requestCode, permissions, grantResults);
            } catch (JSONException e) {
                Logger.debug("Error on Cordova plugin permissions request " + e.getMessage());
                return false;
            }
        } else if (plugin.getPluginAnnotation() != null) {
            return false;
        } else {
            plugin.getInstance().handleRequestPermissionsResult(requestCode, permissions, grantResults);
            return true;
        }
    }

    /* access modifiers changed from: protected */
    public boolean validatePermissions(Plugin plugin, PluginCall savedCall, Map<String, Boolean> permissions) {
        SharedPreferences prefs = getContext().getSharedPreferences(PERMISSION_PREFS_NAME, 0);
        for (Map.Entry<String, Boolean> permission : permissions.entrySet()) {
            String permString = permission.getKey();
            if (!permission.getValue().booleanValue()) {
                SharedPreferences.Editor editor = prefs.edit();
                if (ActivityCompat.shouldShowRequestPermissionRationale(getActivity(), permString)) {
                    editor.putString(permString, PermissionState.PROMPT_WITH_RATIONALE.toString());
                } else {
                    editor.putString(permString, PermissionState.DENIED.toString());
                }
                editor.apply();
            } else if (prefs.getString(permString, (String) null) != null) {
                SharedPreferences.Editor editor2 = prefs.edit();
                editor2.remove(permString);
                editor2.apply();
            }
        }
        String[] permStrings = (String[]) permissions.keySet().toArray(new String[0]);
        if (PermissionHelper.hasDefinedPermissions(getContext(), permStrings)) {
            return true;
        }
        StringBuilder builder = new StringBuilder();
        builder.append("Missing the following permissions in AndroidManifest.xml:\n");
        String[] missing = PermissionHelper.getUndefinedPermissions(getContext(), permStrings);
        int length = missing.length;
        for (int i = 0; i < length; i++) {
            builder.append(missing[i] + "\n");
        }
        savedCall.reject(builder.toString());
        return false;
    }

    /* access modifiers changed from: protected */
    public Map<String, PermissionState> getPermissionStates(Plugin plugin) {
        PermissionState permissionStatus;
        Map<String, PermissionState> permissionsResults = new HashMap<>();
        for (Permission perm : plugin.getPluginHandle().getPluginAnnotation().permissions()) {
            if (perm.strings().length == 0 || (perm.strings().length == 1 && perm.strings()[0].isEmpty())) {
                String key = perm.alias();
                if (!key.isEmpty() && permissionsResults.get(key) == null) {
                    permissionsResults.put(key, PermissionState.GRANTED);
                }
            } else {
                for (String permString : perm.strings()) {
                    String key2 = perm.alias().isEmpty() ? permString : perm.alias();
                    if (ActivityCompat.checkSelfPermission(getContext(), permString) == 0) {
                        permissionStatus = PermissionState.GRANTED;
                    } else {
                        permissionStatus = PermissionState.PROMPT;
                        String state = getContext().getSharedPreferences(PERMISSION_PREFS_NAME, 0).getString(permString, (String) null);
                        if (state != null) {
                            permissionStatus = PermissionState.byState(state);
                        }
                    }
                    PermissionState existingResult = permissionsResults.get(key2);
                    if (existingResult == null || existingResult == PermissionState.GRANTED) {
                        permissionsResults.put(key2, permissionStatus);
                    }
                }
            }
        }
        return permissionsResults;
    }

    /* access modifiers changed from: package-private */
    public boolean onActivityResult(int requestCode, int resultCode, Intent data) {
        PluginHandle plugin = getPluginWithRequestCode(requestCode);
        if (plugin == null || plugin.getInstance() == null) {
            Logger.debug("Unable to find a Capacitor plugin to handle requestCode, trying Cordova plugins " + requestCode);
            return this.cordovaInterface.onActivityResult(requestCode, resultCode, data);
        }
        if (plugin.getInstance().getSavedCall() == null && this.pluginCallForLastActivity != null) {
            plugin.getInstance().saveCall(this.pluginCallForLastActivity);
        }
        plugin.getInstance().handleOnActivityResult(requestCode, resultCode, data);
        this.pluginCallForLastActivity = null;
        return true;
    }

    public void onNewIntent(Intent intent) {
        for (PluginHandle plugin : this.plugins.values()) {
            plugin.getInstance().handleOnNewIntent(intent);
        }
        if (this.cordovaWebView != null) {
            this.cordovaWebView.onNewIntent(intent);
        }
    }

    public void onConfigurationChanged(Configuration newConfig) {
        for (PluginHandle plugin : this.plugins.values()) {
            plugin.getInstance().handleOnConfigurationChanged(newConfig);
        }
    }

    public void onRestart() {
        for (PluginHandle plugin : this.plugins.values()) {
            plugin.getInstance().handleOnRestart();
        }
    }

    public void onStart() {
        for (PluginHandle plugin : this.plugins.values()) {
            plugin.getInstance().handleOnStart();
        }
        if (this.cordovaWebView != null) {
            this.cordovaWebView.handleStart();
        }
    }

    public void onResume() {
        for (PluginHandle plugin : this.plugins.values()) {
            plugin.getInstance().handleOnResume();
        }
        if (this.cordovaWebView != null) {
            this.cordovaWebView.handleResume(shouldKeepRunning());
        }
    }

    public void onPause() {
        for (PluginHandle plugin : this.plugins.values()) {
            plugin.getInstance().handleOnPause();
        }
        if (this.cordovaWebView != null) {
            this.cordovaWebView.handlePause(shouldKeepRunning() || this.cordovaInterface.getActivityResultCallback() != null);
        }
    }

    public void onStop() {
        for (PluginHandle plugin : this.plugins.values()) {
            plugin.getInstance().handleOnStop();
        }
        if (this.cordovaWebView != null) {
            this.cordovaWebView.handleStop();
        }
    }

    public void onDestroy() {
        for (PluginHandle plugin : this.plugins.values()) {
            plugin.getInstance().handleOnDestroy();
        }
        this.handlerThread.quitSafely();
        if (this.cordovaWebView != null) {
            this.cordovaWebView.handleDestroy();
        }
    }

    public void onDetachedFromWindow() {
        this.webView.removeAllViews();
        this.webView.destroy();
    }

    public String getServerBasePath() {
        return this.localServer.getBasePath();
    }

    public void setServerBasePath(String path) {
        this.localServer.hostFiles(path);
        this.webView.post(new Bridge$$ExternalSyntheticLambda3(this));
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$setServerBasePath$0() {
        this.webView.loadUrl(this.appUrl);
    }

    public void setServerAssetPath(String path) {
        this.localServer.hostAssets(path);
        this.webView.post(new Bridge$$ExternalSyntheticLambda6(this));
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$setServerAssetPath$0() {
        this.webView.loadUrl(this.appUrl);
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$reload$0() {
        this.webView.loadUrl(this.appUrl);
    }

    public void reload() {
        this.webView.post(new Bridge$$ExternalSyntheticLambda5(this));
    }

    public String getLocalUrl() {
        return this.localUrl;
    }

    public WebViewLocalServer getLocalServer() {
        return this.localServer;
    }

    public HostMask getAppAllowNavigationMask() {
        return this.appAllowNavigationMask;
    }

    public Set<String> getAllowedOriginRules() {
        return this.allowedOriginRules;
    }

    public BridgeWebViewClient getWebViewClient() {
        return this.webViewClient;
    }

    public void setWebViewClient(BridgeWebViewClient client) {
        this.webViewClient = client;
        this.webView.setWebViewClient(client);
    }

    /* access modifiers changed from: package-private */
    public List<WebViewListener> getWebViewListeners() {
        return this.webViewListeners;
    }

    /* access modifiers changed from: package-private */
    public void setWebViewListeners(List<WebViewListener> webViewListeners2) {
        this.webViewListeners = webViewListeners2;
    }

    /* access modifiers changed from: package-private */
    public RouteProcessor getRouteProcessor() {
        return this.routeProcessor;
    }

    /* access modifiers changed from: package-private */
    public void setRouteProcessor(RouteProcessor routeProcessor2) {
        this.routeProcessor = routeProcessor2;
    }

    /* access modifiers changed from: package-private */
    public ServerPath getServerPath() {
        return this.serverPath;
    }

    public void addWebViewListener(WebViewListener webViewListener) {
        this.webViewListeners.add(webViewListener);
    }

    public void removeWebViewListener(WebViewListener webViewListener) {
        this.webViewListeners.remove(webViewListener);
    }

    public static class Builder {
        private AppCompatActivity activity;
        private CapConfig config = null;
        private Fragment fragment;
        private Bundle instanceState = null;
        private List<Plugin> pluginInstances = new ArrayList();
        private List<Class<? extends Plugin>> plugins = new ArrayList();
        private RouteProcessor routeProcessor;
        private ServerPath serverPath;
        private final List<WebViewListener> webViewListeners = new ArrayList();

        public Builder(AppCompatActivity activity2) {
            this.activity = activity2;
        }

        public Builder(Fragment fragment2) {
            this.activity = (AppCompatActivity) fragment2.getActivity();
            this.fragment = fragment2;
        }

        public Builder setInstanceState(Bundle instanceState2) {
            this.instanceState = instanceState2;
            return this;
        }

        public Builder setConfig(CapConfig config2) {
            this.config = config2;
            return this;
        }

        public Builder setPlugins(List<Class<? extends Plugin>> plugins2) {
            this.plugins = plugins2;
            return this;
        }

        public Builder addPlugin(Class<? extends Plugin> plugin) {
            this.plugins.add(plugin);
            return this;
        }

        public Builder addPlugins(List<Class<? extends Plugin>> plugins2) {
            for (Class<? extends Plugin> cls : plugins2) {
                addPlugin(cls);
            }
            return this;
        }

        public Builder addPluginInstance(Plugin plugin) {
            this.pluginInstances.add(plugin);
            return this;
        }

        public Builder addPluginInstances(List<Plugin> plugins2) {
            this.pluginInstances.addAll(plugins2);
            return this;
        }

        public Builder addWebViewListener(WebViewListener webViewListener) {
            this.webViewListeners.add(webViewListener);
            return this;
        }

        public Builder addWebViewListeners(List<WebViewListener> webViewListeners2) {
            for (WebViewListener listener : webViewListeners2) {
                addWebViewListener(listener);
            }
            return this;
        }

        public Builder setRouteProcessor(RouteProcessor routeProcessor2) {
            this.routeProcessor = routeProcessor2;
            return this;
        }

        public Builder setServerPath(ServerPath serverPath2) {
            this.serverPath = serverPath2;
            return this;
        }

        public Bridge create() {
            ConfigXmlParser parser = new ConfigXmlParser();
            parser.parse(this.activity.getApplicationContext());
            CordovaPreferences preferences = parser.getPreferences();
            preferences.setPreferencesBundle(this.activity.getIntent().getExtras());
            List<PluginEntry> pluginEntries = parser.getPluginEntries();
            MockCordovaInterfaceImpl cordovaInterface = new MockCordovaInterfaceImpl(this.activity);
            if (this.instanceState != null) {
                cordovaInterface.restoreInstanceState(this.instanceState);
            }
            WebView webView = (WebView) (this.fragment != null ? this.fragment.getView().findViewById(R.id.webview) : this.activity.findViewById(R.id.webview));
            MockCordovaWebViewImpl mockWebView = new MockCordovaWebViewImpl(this.activity.getApplicationContext());
            mockWebView.init(cordovaInterface, pluginEntries, preferences, webView);
            PluginManager pluginManager = mockWebView.getPluginManager();
            cordovaInterface.onCordovaInit(pluginManager);
            Bridge bridge = new Bridge(this.activity, this.serverPath, this.fragment, webView, this.plugins, this.pluginInstances, cordovaInterface, pluginManager, preferences, this.config);
            if (webView instanceof CapacitorWebView) {
                ((CapacitorWebView) webView).setBridge(bridge);
            }
            bridge.setCordovaWebView(mockWebView);
            bridge.setWebViewListeners(this.webViewListeners);
            bridge.setRouteProcessor(this.routeProcessor);
            if (this.instanceState != null) {
                bridge.restoreInstanceState(this.instanceState);
            }
            return bridge;
        }
    }
}
