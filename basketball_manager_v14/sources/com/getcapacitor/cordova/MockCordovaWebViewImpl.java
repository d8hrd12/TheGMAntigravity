package com.getcapacitor.cordova;

import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import java.util.List;
import java.util.Map;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPreferences;
import org.apache.cordova.CordovaResourceApi;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaWebViewEngine;
import org.apache.cordova.ICordovaCookieManager;
import org.apache.cordova.NativeToJsMessageQueue;
import org.apache.cordova.PluginEntry;
import org.apache.cordova.PluginManager;
import org.apache.cordova.PluginResult;

public class MockCordovaWebViewImpl implements CordovaWebView {
    private Context context;
    private CapacitorCordovaCookieManager cookieManager;
    private CordovaInterface cordova;
    private boolean hasPausedEver;
    private NativeToJsMessageQueue nativeToJsMessageQueue;
    private PluginManager pluginManager;
    private CordovaPreferences preferences;
    private CordovaResourceApi resourceApi;
    private WebView webView;

    public MockCordovaWebViewImpl(Context context2) {
        this.context = context2;
    }

    public void init(CordovaInterface cordova2, List<PluginEntry> pluginEntries, CordovaPreferences preferences2) {
        this.cordova = cordova2;
        this.preferences = preferences2;
        this.pluginManager = new PluginManager(this, this.cordova, pluginEntries);
        this.resourceApi = new CordovaResourceApi(this.context, this.pluginManager);
        this.pluginManager.init();
    }

    public void init(CordovaInterface cordova2, List<PluginEntry> pluginEntries, CordovaPreferences preferences2, WebView webView2) {
        this.cordova = cordova2;
        this.webView = webView2;
        this.preferences = preferences2;
        this.pluginManager = new PluginManager(this, this.cordova, pluginEntries);
        this.resourceApi = new CordovaResourceApi(this.context, this.pluginManager);
        this.nativeToJsMessageQueue = new NativeToJsMessageQueue();
        this.nativeToJsMessageQueue.addBridgeMode(new CapacitorEvalBridgeMode(webView2, this.cordova));
        this.nativeToJsMessageQueue.setBridgeMode(0);
        this.cookieManager = new CapacitorCordovaCookieManager(webView2);
        this.pluginManager.init();
    }

    public static class CapacitorEvalBridgeMode extends NativeToJsMessageQueue.BridgeMode {
        private final CordovaInterface cordova;
        private final WebView webView;

        public CapacitorEvalBridgeMode(WebView webView2, CordovaInterface cordova2) {
            this.webView = webView2;
            this.cordova = cordova2;
        }

        public void onNativeToJsMessageAvailable(NativeToJsMessageQueue queue) {
            this.cordova.getActivity().runOnUiThread(new MockCordovaWebViewImpl$CapacitorEvalBridgeMode$$ExternalSyntheticLambda0(this, queue));
        }

        /* access modifiers changed from: private */
        public /* synthetic */ void lambda$onNativeToJsMessageAvailable$0(NativeToJsMessageQueue queue) {
            String js = queue.popAndEncodeAsJs();
            if (js != null) {
                this.webView.evaluateJavascript(js, (ValueCallback) null);
            }
        }
    }

    public boolean isInitialized() {
        return this.cordova != null;
    }

    public View getView() {
        return this.webView;
    }

    public void loadUrlIntoView(String url, boolean recreatePlugins) {
        if (url.equals("about:blank") || url.startsWith("javascript:")) {
            this.webView.loadUrl(url);
        }
    }

    public void stopLoading() {
    }

    public boolean canGoBack() {
        return false;
    }

    public void clearCache() {
    }

    @Deprecated
    public void clearCache(boolean b) {
    }

    public void clearHistory() {
    }

    public boolean backHistory() {
        return false;
    }

    public void handlePause(boolean keepRunning) {
        if (isInitialized()) {
            this.hasPausedEver = true;
            this.pluginManager.onPause(keepRunning);
            triggerDocumentEvent("pause");
            if (!keepRunning) {
                setPaused(true);
            }
        }
    }

    public void onNewIntent(Intent intent) {
        if (this.pluginManager != null) {
            this.pluginManager.onNewIntent(intent);
        }
    }

    public void handleResume(boolean keepRunning) {
        if (isInitialized()) {
            setPaused(false);
            this.pluginManager.onResume(keepRunning);
            if (this.hasPausedEver) {
                triggerDocumentEvent("resume");
            }
        }
    }

    public void handleStart() {
        if (isInitialized()) {
            this.pluginManager.onStart();
        }
    }

    public void handleStop() {
        if (isInitialized()) {
            this.pluginManager.onStop();
        }
    }

    public void handleDestroy() {
        if (isInitialized()) {
            this.pluginManager.onDestroy();
        }
    }

    @Deprecated
    public void sendJavascript(String statememt) {
        this.nativeToJsMessageQueue.addJavaScript(statememt);
    }

    public void eval(String js, ValueCallback<String> callback) {
        new Handler(this.context.getMainLooper()).post(new MockCordovaWebViewImpl$$ExternalSyntheticLambda1(this, js, callback));
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$eval$0(String js, ValueCallback callback) {
        this.webView.evaluateJavascript(js, callback);
    }

    static /* synthetic */ void lambda$triggerDocumentEvent$0(String s) {
    }

    public void triggerDocumentEvent(String eventName) {
        eval("window.Capacitor.triggerEvent('" + eventName + "', 'document');", new MockCordovaWebViewImpl$$ExternalSyntheticLambda0());
    }

    public void showWebPage(String url, boolean openExternal, boolean clearHistory, Map<String, Object> map) {
    }

    @Deprecated
    public boolean isCustomViewShowing() {
        return false;
    }

    @Deprecated
    public void showCustomView(View view, WebChromeClient.CustomViewCallback callback) {
    }

    @Deprecated
    public void hideCustomView() {
    }

    public CordovaResourceApi getResourceApi() {
        return this.resourceApi;
    }

    public void setButtonPlumbedToJs(int keyCode, boolean override) {
    }

    public boolean isButtonPlumbedToJs(int keyCode) {
        return false;
    }

    public void sendPluginResult(PluginResult cr, String callbackId) {
        this.nativeToJsMessageQueue.addPluginResult(cr, callbackId);
    }

    public PluginManager getPluginManager() {
        return this.pluginManager;
    }

    public CordovaWebViewEngine getEngine() {
        return null;
    }

    public CordovaPreferences getPreferences() {
        return this.preferences;
    }

    public ICordovaCookieManager getCookieManager() {
        return this.cookieManager;
    }

    public String getUrl() {
        return this.webView.getUrl();
    }

    public Context getContext() {
        return this.webView.getContext();
    }

    public void loadUrl(String url) {
        loadUrlIntoView(url, true);
    }

    public Object postMessage(String id, Object data) {
        return this.pluginManager.postMessage(id, data);
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
}
