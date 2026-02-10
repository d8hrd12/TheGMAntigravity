package org.apache.cordova;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.widget.FrameLayout;
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.apache.cordova.CordovaWebViewEngine;
import org.apache.cordova.NativeToJsMessageQueue;
import org.apache.cordova.engine.SystemWebViewEngine;
import org.json.JSONException;
import org.json.JSONObject;

public class CordovaWebViewImpl implements CordovaWebView {
    static final /* synthetic */ boolean $assertionsDisabled = false;
    public static final String TAG = "CordovaWebViewImpl";
    private CoreAndroid appPlugin;
    /* access modifiers changed from: private */
    public Set<Integer> boundKeyCodes = new HashSet();
    /* access modifiers changed from: private */
    public CordovaInterface cordova;
    protected final CordovaWebViewEngine engine;
    private EngineClient engineClient = new EngineClient();
    private boolean hasPausedEver;
    /* access modifiers changed from: private */
    public int loadUrlTimeout = 0;
    String loadedUrl;
    /* access modifiers changed from: private */
    public View mCustomView;
    private WebChromeClient.CustomViewCallback mCustomViewCallback;
    private NativeToJsMessageQueue nativeToJsMessageQueue;
    /* access modifiers changed from: private */
    public PluginManager pluginManager;
    private CordovaPreferences preferences;
    private CordovaResourceApi resourceApi;

    public static CordovaWebViewEngine createEngine(Context context, CordovaPreferences preferences2) {
        try {
            return (CordovaWebViewEngine) Class.forName(preferences2.getString("webview", SystemWebViewEngine.class.getCanonicalName())).getConstructor(new Class[]{Context.class, CordovaPreferences.class}).newInstance(new Object[]{context, preferences2});
        } catch (Exception e) {
            throw new RuntimeException("Failed to create webview. ", e);
        }
    }

    public CordovaWebViewImpl(CordovaWebViewEngine cordovaWebViewEngine) {
        this.engine = cordovaWebViewEngine;
    }

    public void init(CordovaInterface cordova2) {
        init(cordova2, new ArrayList(), new CordovaPreferences());
    }

    public void init(CordovaInterface cordova2, List<PluginEntry> pluginEntries, CordovaPreferences preferences2) {
        if (this.cordova == null) {
            this.cordova = cordova2;
            this.preferences = preferences2;
            this.pluginManager = new PluginManager(this, this.cordova, pluginEntries);
            this.resourceApi = new CordovaResourceApi(this.engine.getView().getContext(), this.pluginManager);
            this.nativeToJsMessageQueue = new NativeToJsMessageQueue();
            this.nativeToJsMessageQueue.addBridgeMode(new NativeToJsMessageQueue.NoOpBridgeMode());
            this.nativeToJsMessageQueue.addBridgeMode(new NativeToJsMessageQueue.LoadUrlBridgeMode(this.engine, cordova2));
            if (preferences2.getBoolean("DisallowOverscroll", false)) {
                this.engine.getView().setOverScrollMode(2);
            }
            this.engine.init(this, cordova2, this.engineClient, this.resourceApi, this.pluginManager, this.nativeToJsMessageQueue);
            if (this.engine.getView() instanceof CordovaWebViewEngine.EngineView) {
                this.pluginManager.addService(CoreAndroid.PLUGIN_NAME, "org.apache.cordova.CoreAndroid", true);
                this.pluginManager.init();
                return;
            }
            throw new AssertionError();
        }
        throw new IllegalStateException();
    }

    public boolean isInitialized() {
        return this.cordova != null;
    }

    public void loadUrlIntoView(final String url, boolean recreatePlugins) {
        String url2;
        CordovaWebViewImpl cordovaWebViewImpl;
        LOG.d(TAG, ">>> loadUrl(" + url + ")");
        boolean recreatePlugins2 = false;
        if (url.equals("about:blank")) {
            cordovaWebViewImpl = this;
            url2 = url;
        } else if (url.startsWith("javascript:")) {
            cordovaWebViewImpl = this;
            url2 = url;
        } else {
            if (recreatePlugins || this.loadedUrl == null) {
                recreatePlugins2 = true;
            }
            if (recreatePlugins2) {
                if (this.loadedUrl != null) {
                    this.appPlugin = null;
                    this.pluginManager.init();
                }
                this.loadedUrl = url;
            }
            final int currentLoadUrlTimeout = this.loadUrlTimeout;
            final int loadUrlTimeoutValue = this.preferences.getInteger("LoadUrlTimeoutValue", AccessibilityNodeInfoCompat.EXTRA_DATA_TEXT_CHARACTER_LOCATION_ARG_MAX_LENGTH);
            final Runnable loadError = new Runnable() {
                public void run() {
                    CordovaWebViewImpl.this.stopLoading();
                    LOG.e(CordovaWebViewImpl.TAG, "CordovaWebView: TIMEOUT ERROR!");
                    JSONObject data = new JSONObject();
                    try {
                        data.put("errorCode", -6);
                        data.put("description", "The connection to the server was unsuccessful.");
                        data.put("url", url);
                    } catch (JSONException e) {
                    }
                    CordovaWebViewImpl.this.pluginManager.postMessage("onReceivedError", data);
                }
            };
            final Runnable timeoutCheck = new Runnable() {
                public void run() {
                    try {
                        synchronized (this) {
                            wait((long) loadUrlTimeoutValue);
                        }
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    if (CordovaWebViewImpl.this.loadUrlTimeout == currentLoadUrlTimeout && CordovaWebViewImpl.this.cordova.getActivity() != null) {
                        CordovaWebViewImpl.this.cordova.getActivity().runOnUiThread(loadError);
                    } else if (CordovaWebViewImpl.this.cordova.getActivity() == null) {
                        LOG.d(CordovaWebViewImpl.TAG, "Cordova activity does not exist.");
                    }
                }
            };
            if (this.cordova.getActivity() != null) {
                final boolean _recreatePlugins = recreatePlugins2;
                final String url3 = url;
                this.cordova.getActivity().runOnUiThread(new Runnable() {
                    public void run() {
                        if (loadUrlTimeoutValue > 0) {
                            CordovaWebViewImpl.this.cordova.getThreadPool().execute(timeoutCheck);
                        }
                        CordovaWebViewImpl.this.engine.loadUrl(url3, _recreatePlugins);
                    }
                });
                return;
            }
            String str = url;
            LOG.d(TAG, "Cordova activity does not exist.");
            return;
        }
        cordovaWebViewImpl.engine.loadUrl(url2, false);
    }

    public void loadUrl(String url) {
        loadUrlIntoView(url, true);
    }

    public void showWebPage(String url, boolean openExternal, boolean clearHistory, Map<String, Object> params) {
        Intent intent;
        LOG.d(TAG, "showWebPage(%s, %b, %b, HashMap)", url, Boolean.valueOf(openExternal), Boolean.valueOf(clearHistory));
        if (clearHistory) {
            this.engine.clearHistory();
        }
        if (!openExternal) {
            if (this.pluginManager.shouldAllowNavigation(url)) {
                loadUrlIntoView(url, true);
            } else {
                LOG.w(TAG, "showWebPage: Refusing to load URL into webview since it is not in the <allow-navigation> allow list. URL=" + url);
            }
        } else if (!this.pluginManager.shouldOpenExternalUrl(url).booleanValue()) {
            LOG.w(TAG, "showWebPage: Refusing to send intent for URL since it is not in the <allow-intent> allow list. URL=" + url);
        } else {
            Intent intent2 = null;
            try {
                if (url.startsWith("intent://")) {
                    intent = Intent.parseUri(url, 1);
                } else {
                    intent = new Intent("android.intent.action.VIEW");
                    intent.addCategory("android.intent.category.BROWSABLE");
                    Uri uri = Uri.parse(url);
                    if ("file".equals(uri.getScheme())) {
                        intent.setDataAndType(uri, this.resourceApi.getMimeType(uri));
                    } else {
                        intent.setData(uri);
                    }
                }
                if (this.cordova.getActivity() != null) {
                    this.cordova.getActivity().startActivity(intent);
                } else {
                    LOG.d(TAG, "Cordova activity does not exist.");
                }
            } catch (URISyntaxException e) {
                LOG.e(TAG, "Error parsing url " + url, (Throwable) e);
            } catch (ActivityNotFoundException e2) {
                if (!url.startsWith("intent://") || intent2 == null || intent2.getStringExtra("browser_fallback_url") == null) {
                    LOG.e(TAG, "Error loading url " + url, (Throwable) e2);
                } else {
                    showWebPage(intent2.getStringExtra("browser_fallback_url"), openExternal, clearHistory, params);
                }
            }
        }
    }

    private static class WrapperView extends FrameLayout {
        private final CordovaWebViewEngine engine;

        public WrapperView(Context context, CordovaWebViewEngine engine2) {
            super(context);
            this.engine = engine2;
        }

        public boolean dispatchKeyEvent(KeyEvent event) {
            boolean ret = this.engine.getView().dispatchKeyEvent(event);
            if (!ret) {
                return super.dispatchKeyEvent(event);
            }
            return ret;
        }
    }

    @Deprecated
    public void showCustomView(View view, WebChromeClient.CustomViewCallback callback) {
        LOG.d(TAG, "showing Custom View");
        if (this.mCustomView != null) {
            callback.onCustomViewHidden();
            return;
        }
        WrapperView wrapperView = new WrapperView(getContext(), this.engine);
        wrapperView.addView(view);
        this.mCustomView = wrapperView;
        this.mCustomViewCallback = callback;
        ViewGroup parent = (ViewGroup) this.engine.getView().getParent();
        parent.addView(wrapperView, new FrameLayout.LayoutParams(-1, -1, 17));
        this.engine.getView().setVisibility(8);
        parent.setVisibility(0);
        parent.bringToFront();
    }

    @Deprecated
    public void hideCustomView() {
        if (this.mCustomView != null) {
            LOG.d(TAG, "Hiding Custom View");
            this.mCustomView.setVisibility(8);
            ((ViewGroup) this.engine.getView().getParent()).removeView(this.mCustomView);
            this.mCustomView = null;
            this.mCustomViewCallback.onCustomViewHidden();
            this.engine.getView().setVisibility(0);
            this.engine.getView().requestFocus();
        }
    }

    @Deprecated
    public boolean isCustomViewShowing() {
        return this.mCustomView != null;
    }

    @Deprecated
    public void sendJavascript(String statement) {
        this.nativeToJsMessageQueue.addJavaScript(statement);
    }

    public void sendPluginResult(PluginResult cr, String callbackId) {
        this.nativeToJsMessageQueue.addPluginResult(cr, callbackId);
    }

    public PluginManager getPluginManager() {
        return this.pluginManager;
    }

    public CordovaPreferences getPreferences() {
        return this.preferences;
    }

    public ICordovaCookieManager getCookieManager() {
        return this.engine.getCookieManager();
    }

    public CordovaResourceApi getResourceApi() {
        return this.resourceApi;
    }

    public CordovaWebViewEngine getEngine() {
        return this.engine;
    }

    public View getView() {
        return this.engine.getView();
    }

    public Context getContext() {
        return this.engine.getView().getContext();
    }

    /* access modifiers changed from: private */
    public void sendJavascriptEvent(String event) {
        if (this.appPlugin == null) {
            this.appPlugin = (CoreAndroid) this.pluginManager.getPlugin(CoreAndroid.PLUGIN_NAME);
        }
        if (this.appPlugin == null) {
            LOG.w(TAG, "Unable to fire event without existing plugin");
        } else {
            this.appPlugin.fireJavascriptEvent(event);
        }
    }

    public void setButtonPlumbedToJs(int keyCode, boolean override) {
        switch (keyCode) {
            case 4:
            case 24:
            case 25:
            case 82:
                if (override) {
                    this.boundKeyCodes.add(Integer.valueOf(keyCode));
                    return;
                } else {
                    this.boundKeyCodes.remove(Integer.valueOf(keyCode));
                    return;
                }
            default:
                throw new IllegalArgumentException("Unsupported keycode: " + keyCode);
        }
    }

    public boolean isButtonPlumbedToJs(int keyCode) {
        return this.boundKeyCodes.contains(Integer.valueOf(keyCode));
    }

    public Object postMessage(String id, Object data) {
        return this.pluginManager.postMessage(id, data);
    }

    public String getUrl() {
        return this.engine.getUrl();
    }

    public void stopLoading() {
        this.loadUrlTimeout++;
    }

    public boolean canGoBack() {
        return this.engine.canGoBack();
    }

    public void clearCache() {
        this.engine.clearCache();
    }

    @Deprecated
    public void clearCache(boolean b) {
        this.engine.clearCache();
    }

    public void clearHistory() {
        this.engine.clearHistory();
    }

    public boolean backHistory() {
        return this.engine.goBack();
    }

    public void onNewIntent(Intent intent) {
        if (this.pluginManager != null) {
            this.pluginManager.onNewIntent(intent);
        }
    }

    public void handlePause(boolean keepRunning) {
        if (isInitialized()) {
            this.hasPausedEver = true;
            this.pluginManager.onPause(keepRunning);
            sendJavascriptEvent("pause");
            if (!keepRunning) {
                this.engine.setPaused(true);
            }
        }
    }

    public void handleResume(boolean keepRunning) {
        if (isInitialized()) {
            this.engine.setPaused(false);
            this.pluginManager.onResume(keepRunning);
            if (this.hasPausedEver) {
                sendJavascriptEvent("resume");
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
            this.loadUrlTimeout++;
            this.pluginManager.onDestroy();
            loadUrl("about:blank");
            this.engine.destroy();
            hideCustomView();
        }
    }

    protected class EngineClient implements CordovaWebViewEngine.Client {
        protected EngineClient() {
        }

        public void clearLoadTimeoutTimer() {
            CordovaWebViewImpl cordovaWebViewImpl = CordovaWebViewImpl.this;
            cordovaWebViewImpl.loadUrlTimeout = cordovaWebViewImpl.loadUrlTimeout + 1;
        }

        public void onPageStarted(String newUrl) {
            LOG.d(CordovaWebViewImpl.TAG, "onPageDidNavigate(" + newUrl + ")");
            CordovaWebViewImpl.this.boundKeyCodes.clear();
            CordovaWebViewImpl.this.pluginManager.onReset();
            CordovaWebViewImpl.this.pluginManager.postMessage("onPageStarted", newUrl);
        }

        public void onReceivedError(int errorCode, String description, String failingUrl) {
            clearLoadTimeoutTimer();
            JSONObject data = new JSONObject();
            try {
                data.put("errorCode", errorCode);
                data.put("description", description);
                data.put("url", failingUrl);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            CordovaWebViewImpl.this.pluginManager.postMessage("onReceivedError", data);
        }

        public void onPageFinishedLoading(String url) {
            LOG.d(CordovaWebViewImpl.TAG, "onPageFinished(" + url + ")");
            clearLoadTimeoutTimer();
            CordovaWebViewImpl.this.pluginManager.postMessage("onPageFinished", url);
            if (CordovaWebViewImpl.this.engine.getView().getVisibility() != 0) {
                new Thread(new Runnable() {
                    public void run() {
                        try {
                            Thread.sleep(2000);
                            if (CordovaWebViewImpl.this.cordova.getActivity() != null) {
                                CordovaWebViewImpl.this.cordova.getActivity().runOnUiThread(new Runnable() {
                                    public void run() {
                                        CordovaWebViewImpl.this.pluginManager.postMessage("spinner", "stop");
                                    }
                                });
                            } else {
                                LOG.d(CordovaWebViewImpl.TAG, "Cordova activity does not exist.");
                            }
                        } catch (InterruptedException e) {
                        }
                    }
                }).start();
            }
            if (url.equals("about:blank")) {
                CordovaWebViewImpl.this.pluginManager.postMessage("exit", (Object) null);
            }
        }

        public Boolean onDispatchKeyEvent(KeyEvent event) {
            int keyCode = event.getKeyCode();
            boolean isBackButton = keyCode == 4;
            if (event.getAction() == 0) {
                if ((isBackButton && CordovaWebViewImpl.this.mCustomView != null) || CordovaWebViewImpl.this.boundKeyCodes.contains(Integer.valueOf(keyCode))) {
                    return true;
                }
                if (isBackButton) {
                    return Boolean.valueOf(CordovaWebViewImpl.this.engine.canGoBack());
                }
                return null;
            } else if (event.getAction() != 1) {
                return null;
            } else {
                if (isBackButton && CordovaWebViewImpl.this.mCustomView != null) {
                    CordovaWebViewImpl.this.hideCustomView();
                    return true;
                } else if (CordovaWebViewImpl.this.boundKeyCodes.contains(Integer.valueOf(keyCode))) {
                    String eventName = null;
                    switch (keyCode) {
                        case 4:
                            eventName = "backbutton";
                            break;
                        case 24:
                            eventName = "volumeupbutton";
                            break;
                        case 25:
                            eventName = "volumedownbutton";
                            break;
                        case 82:
                            eventName = "menubutton";
                            break;
                        case 84:
                            eventName = "searchbutton";
                            break;
                    }
                    if (eventName == null) {
                        return null;
                    }
                    CordovaWebViewImpl.this.sendJavascriptEvent(eventName);
                    return true;
                } else if (isBackButton) {
                    return Boolean.valueOf(CordovaWebViewImpl.this.engine.goBack());
                } else {
                    return null;
                }
            }
        }

        public boolean onNavigationAttempt(String url) {
            if (CordovaWebViewImpl.this.pluginManager.onOverrideUrlLoading(url)) {
                return true;
            }
            if (CordovaWebViewImpl.this.pluginManager.shouldAllowNavigation(url)) {
                return false;
            }
            if (CordovaWebViewImpl.this.pluginManager.shouldOpenExternalUrl(url).booleanValue()) {
                CordovaWebViewImpl.this.showWebPage(url, true, false, (Map<String, Object>) null);
                return true;
            }
            LOG.w(CordovaWebViewImpl.TAG, "Blocked (possibly sub-frame) navigation to non-allowed URL: " + url);
            return true;
        }
    }
}
