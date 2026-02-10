package org.apache.cordova.engine;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import org.apache.cordova.CordovaBridge;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPreferences;
import org.apache.cordova.CordovaResourceApi;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaWebViewEngine;
import org.apache.cordova.ICordovaCookieManager;
import org.apache.cordova.LOG;
import org.apache.cordova.NativeToJsMessageQueue;
import org.apache.cordova.PluginManager;

public class SystemWebViewEngine implements CordovaWebViewEngine {
    public static final String TAG = "SystemWebViewEngine";
    protected CordovaBridge bridge;
    protected CordovaWebViewEngine.Client client;
    protected final SystemCookieManager cookieManager;
    protected CordovaInterface cordova;
    protected NativeToJsMessageQueue nativeToJsMessageQueue;
    protected CordovaWebView parentWebView;
    protected PluginManager pluginManager;
    protected CordovaPreferences preferences;
    private BroadcastReceiver receiver;
    protected CordovaResourceApi resourceApi;
    protected final SystemWebView webView;

    public SystemWebViewEngine(Context context, CordovaPreferences preferences2) {
        this(new SystemWebView(context), preferences2);
    }

    public SystemWebViewEngine(SystemWebView webView2) {
        this(webView2, (CordovaPreferences) null);
    }

    public SystemWebViewEngine(SystemWebView webView2, CordovaPreferences preferences2) {
        this.preferences = preferences2;
        this.webView = webView2;
        this.cookieManager = new SystemCookieManager(webView2);
    }

    public void init(CordovaWebView parentWebView2, CordovaInterface cordova2, CordovaWebViewEngine.Client client2, CordovaResourceApi resourceApi2, PluginManager pluginManager2, NativeToJsMessageQueue nativeToJsMessageQueue2) {
        if (this.cordova == null) {
            if (this.preferences == null) {
                this.preferences = parentWebView2.getPreferences();
            }
            this.parentWebView = parentWebView2;
            this.cordova = cordova2;
            this.client = client2;
            this.resourceApi = resourceApi2;
            this.pluginManager = pluginManager2;
            this.nativeToJsMessageQueue = nativeToJsMessageQueue2;
            this.webView.init(this, cordova2);
            initWebViewSettings();
            nativeToJsMessageQueue2.addBridgeMode(new NativeToJsMessageQueue.OnlineEventsBridgeMode(new NativeToJsMessageQueue.OnlineEventsBridgeMode.OnlineEventsBridgeModeDelegate() {
                public void setNetworkAvailable(boolean value) {
                    if (SystemWebViewEngine.this.webView != null) {
                        SystemWebViewEngine.this.webView.setNetworkAvailable(value);
                    }
                }

                public void runOnUiThread(Runnable r) {
                    SystemWebViewEngine.this.cordova.getActivity().runOnUiThread(r);
                }
            }));
            nativeToJsMessageQueue2.addBridgeMode(new NativeToJsMessageQueue.EvalBridgeMode(this, cordova2));
            this.bridge = new CordovaBridge(pluginManager2, nativeToJsMessageQueue2);
            exposeJsInterface(this.webView, this.bridge);
            return;
        }
        throw new IllegalStateException();
    }

    public CordovaWebView getCordovaWebView() {
        return this.parentWebView;
    }

    public ICordovaCookieManager getCookieManager() {
        return this.cookieManager;
    }

    public View getView() {
        return this.webView;
    }

    private void initWebViewSettings() {
        boolean z = false;
        this.webView.setInitialScale(0);
        this.webView.setVerticalScrollBarEnabled(false);
        final WebSettings settings = this.webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.NORMAL);
        LOG.d(TAG, "CordovaWebView is running on device made by: " + Build.MANUFACTURER);
        settings.setSaveFormData(false);
        if (this.preferences.getBoolean("AndroidInsecureFileModeEnabled", false)) {
            LOG.d(TAG, "Enabled insecure file access");
            settings.setAllowFileAccess(true);
            settings.setAllowUniversalAccessFromFileURLs(true);
            this.cookieManager.setAcceptFileSchemeCookies();
        }
        settings.setMediaPlaybackRequiresUserGesture(false);
        String databasePath = this.webView.getContext().getApplicationContext().getDir("database", 0).getPath();
        settings.setDatabaseEnabled(true);
        String inspectableWebview = this.preferences.getString("InspectableWebview", (String) null);
        boolean shouldEnableInspector = false;
        if (inspectableWebview == null) {
            if ((this.webView.getContext().getApplicationContext().getApplicationInfo().flags & 2) != 0) {
                z = true;
            }
            shouldEnableInspector = z;
        } else if ("true".equals(inspectableWebview)) {
            shouldEnableInspector = true;
        }
        if (shouldEnableInspector) {
            enableRemoteDebugging();
        }
        settings.setGeolocationDatabasePath(databasePath);
        settings.setDomStorageEnabled(true);
        settings.setGeolocationEnabled(true);
        String defaultUserAgent = settings.getUserAgentString();
        String overrideUserAgent = this.preferences.getString("OverrideUserAgent", (String) null);
        if (overrideUserAgent != null) {
            settings.setUserAgentString(overrideUserAgent);
        } else {
            String appendUserAgent = this.preferences.getString("AppendUserAgent", (String) null);
            if (appendUserAgent != null) {
                settings.setUserAgentString(defaultUserAgent + " " + appendUserAgent);
            }
        }
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("android.intent.action.CONFIGURATION_CHANGED");
        if (this.receiver == null) {
            this.receiver = new BroadcastReceiver() {
                public void onReceive(Context context, Intent intent) {
                    settings.getUserAgentString();
                }
            };
            this.webView.getContext().registerReceiver(this.receiver, intentFilter);
        }
    }

    private void enableRemoteDebugging() {
        try {
            WebView.setWebContentsDebuggingEnabled(true);
        } catch (IllegalArgumentException e) {
            LOG.d(TAG, "You have one job! To turn on Remote Web Debugging! YOU HAVE FAILED! ");
            e.printStackTrace();
        }
    }

    private static void exposeJsInterface(WebView webView2, CordovaBridge bridge2) {
        webView2.addJavascriptInterface(new SystemExposedJsApi(bridge2), "_cordovaNative");
    }

    public void loadUrl(String url, boolean clearNavigationStack) {
        this.webView.loadUrl(url);
    }

    public String getUrl() {
        return this.webView.getUrl();
    }

    public void stopLoading() {
        this.webView.stopLoading();
    }

    public void clearCache() {
        this.webView.clearCache(true);
    }

    public void clearHistory() {
        this.webView.clearHistory();
    }

    public boolean canGoBack() {
        return this.webView.canGoBack();
    }

    public boolean goBack() {
        if (!this.webView.canGoBack()) {
            return false;
        }
        this.webView.goBack();
        return true;
    }

    public void setPaused(boolean value) {
        if (value) {
            this.webView.onPause();
            this.webView.pauseTimers();
            return;
        }
        this.webView.onResume();
        this.webView.resumeTimers();
    }

    public void destroy() {
        this.webView.chromeClient.destroyLastDialog();
        this.webView.destroy();
        if (this.receiver != null) {
            try {
                this.webView.getContext().unregisterReceiver(this.receiver);
            } catch (Exception e) {
                LOG.e(TAG, "Error unregistering configuration receiver: " + e.getMessage(), (Throwable) e);
            }
        }
    }

    public void evaluateJavascript(String js, ValueCallback<String> callback) {
        this.webView.evaluateJavascript(js, callback);
    }
}
