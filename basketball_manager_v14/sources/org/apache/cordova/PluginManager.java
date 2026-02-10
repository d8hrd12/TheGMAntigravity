package org.apache.cordova;

import android.content.Intent;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import android.os.Debug;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebView;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import org.apache.cordova.PluginResult;
import org.json.JSONException;

public class PluginManager {
    private static String DEFAULT_HOSTNAME = "localhost";
    private static String SCHEME_HTTPS = "https";
    private static final int SLOW_EXEC_WARNING_THRESHOLD = (Debug.isDebuggerConnected() ? 60 : 16);
    private static String TAG = "PluginManager";
    private final CordovaWebView app;
    private final CordovaInterface ctx;
    private final Map<String, PluginEntry> entryMap = Collections.synchronizedMap(new LinkedHashMap());
    private boolean isInitialized;
    private CordovaPlugin permissionRequester;
    private final Map<String, CordovaPlugin> pluginMap = Collections.synchronizedMap(new LinkedHashMap());

    public PluginManager(CordovaWebView cordovaWebView, CordovaInterface cordova, Collection<PluginEntry> pluginEntries) {
        this.ctx = cordova;
        this.app = cordovaWebView;
        setPluginEntries(pluginEntries);
    }

    public Collection<PluginEntry> getPluginEntries() {
        return this.entryMap.values();
    }

    public void setPluginEntries(Collection<PluginEntry> pluginEntries) {
        if (this.isInitialized) {
            onPause(false);
            onDestroy();
            this.pluginMap.clear();
            this.entryMap.clear();
        }
        for (PluginEntry entry : pluginEntries) {
            addService(entry);
        }
        if (this.isInitialized) {
            startupPlugins();
        }
    }

    public void init() {
        LOG.d(TAG, "init()");
        this.isInitialized = true;
        onPause(false);
        onDestroy();
        this.pluginMap.clear();
        startupPlugins();
    }

    private void startupPlugins() {
        synchronized (this.entryMap) {
            for (PluginEntry entry : this.entryMap.values()) {
                if (entry.onload) {
                    getPlugin(entry.service);
                } else {
                    LOG.d(TAG, "startupPlugins: put - " + entry.service);
                    this.pluginMap.put(entry.service, (Object) null);
                }
            }
        }
    }

    public void exec(String service, String action, String callbackId, String rawArgs) {
        CordovaPlugin plugin = getPlugin(service);
        if (plugin == null) {
            LOG.d(TAG, "exec() call to unknown plugin: " + service);
            this.app.sendPluginResult(new PluginResult(PluginResult.Status.CLASS_NOT_FOUND_EXCEPTION), callbackId);
            return;
        }
        CallbackContext callbackContext = new CallbackContext(callbackId, this.app);
        try {
            long pluginStartTime = System.currentTimeMillis();
            boolean wasValidAction = plugin.execute(action, rawArgs, callbackContext);
            long duration = System.currentTimeMillis() - pluginStartTime;
            if (duration > ((long) SLOW_EXEC_WARNING_THRESHOLD)) {
                LOG.w(TAG, "THREAD WARNING: exec() call to " + service + "." + action + " blocked the main thread for " + duration + "ms. Plugin should use CordovaInterface.getThreadPool().");
            }
            if (!wasValidAction) {
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
            }
        } catch (JSONException e) {
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
        } catch (Exception e2) {
            LOG.e(TAG, "Uncaught exception from plugin", (Throwable) e2);
            callbackContext.error(e2.getMessage());
        }
    }

    public CordovaPlugin getPlugin(String service) {
        CordovaPlugin ret = this.pluginMap.get(service);
        if (ret == null) {
            PluginEntry pe = this.entryMap.get(service);
            if (pe == null) {
                return null;
            }
            if (pe.plugin != null) {
                ret = pe.plugin;
            } else {
                ret = instantiatePlugin(pe.pluginClass);
            }
            ret.privateInitialize(service, this.ctx, this.app, this.app.getPreferences());
            LOG.d(TAG, "getPlugin - put: " + service);
            this.pluginMap.put(service, ret);
        }
        return ret;
    }

    public void addService(String service, String className) {
        addService(service, className, false);
    }

    public void addService(String service, String className, boolean onload) {
        addService(new PluginEntry(service, className, onload));
    }

    public void addService(PluginEntry entry) {
        this.entryMap.put(entry.service, entry);
        if (entry.plugin != null) {
            entry.plugin.privateInitialize(entry.service, this.ctx, this.app, this.app.getPreferences());
            LOG.d(TAG, "addService: put - " + entry.service);
            this.pluginMap.put(entry.service, entry.plugin);
        }
    }

    public void onPause(boolean multitasking) {
        synchronized (this.pluginMap) {
            for (CordovaPlugin plugin : this.pluginMap.values()) {
                if (plugin != null) {
                    plugin.onPause(multitasking);
                }
            }
        }
    }

    public boolean onReceivedHttpAuthRequest(CordovaWebView view, ICordovaHttpAuthHandler handler, String host, String realm) {
        synchronized (this.pluginMap) {
            for (CordovaPlugin plugin : this.pluginMap.values()) {
                if (plugin != null && plugin.onReceivedHttpAuthRequest(this.app, handler, host, realm)) {
                    return true;
                }
            }
            return false;
        }
    }

    public boolean onReceivedClientCertRequest(CordovaWebView view, ICordovaClientCertRequest request) {
        synchronized (this.pluginMap) {
            for (CordovaPlugin plugin : this.pluginMap.values()) {
                if (plugin != null && plugin.onReceivedClientCertRequest(this.app, request)) {
                    return true;
                }
            }
            return false;
        }
    }

    public void onResume(boolean multitasking) {
        synchronized (this.pluginMap) {
            for (CordovaPlugin plugin : this.pluginMap.values()) {
                if (plugin != null) {
                    plugin.onResume(multitasking);
                }
            }
        }
    }

    public void onStart() {
        synchronized (this.pluginMap) {
            for (CordovaPlugin plugin : this.pluginMap.values()) {
                if (plugin != null) {
                    plugin.onStart();
                }
            }
        }
    }

    public void onStop() {
        synchronized (this.pluginMap) {
            for (CordovaPlugin plugin : this.pluginMap.values()) {
                if (plugin != null) {
                    plugin.onStop();
                }
            }
        }
    }

    public void onDestroy() {
        synchronized (this.pluginMap) {
            for (CordovaPlugin plugin : this.pluginMap.values()) {
                if (plugin != null) {
                    plugin.onDestroy();
                }
            }
        }
    }

    public Object postMessage(String id, Object data) {
        LOG.d(TAG, "postMessage: " + id);
        synchronized (this.pluginMap) {
            this.pluginMap.forEach(new PluginManager$$ExternalSyntheticLambda0(id, data));
        }
        return this.ctx.onMessage(id, data);
    }

    static /* synthetic */ void lambda$postMessage$0(String id, Object data, String s, CordovaPlugin plugin) {
        if (plugin != null) {
            plugin.onMessage(id, data);
        }
    }

    public void onNewIntent(Intent intent) {
        synchronized (this.pluginMap) {
            for (CordovaPlugin plugin : this.pluginMap.values()) {
                if (plugin != null) {
                    plugin.onNewIntent(intent);
                }
            }
        }
    }

    private String getLaunchUrlPrefix() {
        if (this.app.getPreferences().getBoolean("AndroidInsecureFileModeEnabled", false)) {
            return "file://";
        }
        String scheme = this.app.getPreferences().getString("scheme", SCHEME_HTTPS).toLowerCase();
        return scheme + "://" + this.app.getPreferences().getString("hostname", DEFAULT_HOSTNAME).toLowerCase() + '/';
    }

    /* JADX WARNING: Code restructure failed: missing block: B:16:0x003a, code lost:
        if (r6.startsWith("blob:") != false) goto L_0x0068;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:18:0x0042, code lost:
        if (r6.startsWith("data:") != false) goto L_0x0068;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:20:0x004a, code lost:
        if (r6.startsWith("about:blank") == false) goto L_0x004d;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x0053, code lost:
        if (r6.startsWith("https://ssl.gstatic.com/accessibility/javascript/android/") == false) goto L_0x0056;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0055, code lost:
        return true;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x005c, code lost:
        if (r6.startsWith("file://") == false) goto L_0x0066;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0065, code lost:
        return !r6.contains("/app_webview/");
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x0066, code lost:
        return false;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0068, code lost:
        return true;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public boolean shouldAllowRequest(java.lang.String r6) {
        /*
            r5 = this;
            java.util.Map<java.lang.String, org.apache.cordova.PluginEntry> r0 = r5.entryMap
            monitor-enter(r0)
            java.util.Map<java.lang.String, org.apache.cordova.PluginEntry> r1 = r5.entryMap     // Catch:{ all -> 0x0069 }
            java.util.Collection r1 = r1.values()     // Catch:{ all -> 0x0069 }
            java.util.Iterator r1 = r1.iterator()     // Catch:{ all -> 0x0069 }
        L_0x000d:
            boolean r2 = r1.hasNext()     // Catch:{ all -> 0x0069 }
            if (r2 == 0) goto L_0x0032
            java.lang.Object r2 = r1.next()     // Catch:{ all -> 0x0069 }
            org.apache.cordova.PluginEntry r2 = (org.apache.cordova.PluginEntry) r2     // Catch:{ all -> 0x0069 }
            java.util.Map<java.lang.String, org.apache.cordova.CordovaPlugin> r3 = r5.pluginMap     // Catch:{ all -> 0x0069 }
            java.lang.String r4 = r2.service     // Catch:{ all -> 0x0069 }
            java.lang.Object r3 = r3.get(r4)     // Catch:{ all -> 0x0069 }
            org.apache.cordova.CordovaPlugin r3 = (org.apache.cordova.CordovaPlugin) r3     // Catch:{ all -> 0x0069 }
            if (r3 == 0) goto L_0x0031
            java.lang.Boolean r4 = r3.shouldAllowRequest(r6)     // Catch:{ all -> 0x0069 }
            if (r4 == 0) goto L_0x0031
            boolean r1 = r4.booleanValue()     // Catch:{ all -> 0x0069 }
            monitor-exit(r0)     // Catch:{ all -> 0x0069 }
            return r1
        L_0x0031:
            goto L_0x000d
        L_0x0032:
            monitor-exit(r0)     // Catch:{ all -> 0x0069 }
            java.lang.String r0 = "blob:"
            boolean r0 = r6.startsWith(r0)
            r1 = 1
            if (r0 != 0) goto L_0x0068
            java.lang.String r0 = "data:"
            boolean r0 = r6.startsWith(r0)
            if (r0 != 0) goto L_0x0068
            java.lang.String r0 = "about:blank"
            boolean r0 = r6.startsWith(r0)
            if (r0 == 0) goto L_0x004d
            goto L_0x0068
        L_0x004d:
            java.lang.String r0 = "https://ssl.gstatic.com/accessibility/javascript/android/"
            boolean r0 = r6.startsWith(r0)
            if (r0 == 0) goto L_0x0056
            return r1
        L_0x0056:
            java.lang.String r0 = "file://"
            boolean r0 = r6.startsWith(r0)
            if (r0 == 0) goto L_0x0066
            java.lang.String r0 = "/app_webview/"
            boolean r0 = r6.contains(r0)
            r0 = r0 ^ r1
            return r0
        L_0x0066:
            r0 = 0
            return r0
        L_0x0068:
            return r1
        L_0x0069:
            r1 = move-exception
            monitor-exit(r0)     // Catch:{ all -> 0x0069 }
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: org.apache.cordova.PluginManager.shouldAllowRequest(java.lang.String):boolean");
    }

    /* JADX WARNING: Code restructure failed: missing block: B:16:0x003b, code lost:
        if (r6.startsWith(getLaunchUrlPrefix()) != false) goto L_0x0048;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:18:0x0043, code lost:
        if (r6.startsWith("about:blank") == false) goto L_0x0046;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:19:0x0046, code lost:
        return false;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:20:0x0048, code lost:
        return true;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public boolean shouldAllowNavigation(java.lang.String r6) {
        /*
            r5 = this;
            java.util.Map<java.lang.String, org.apache.cordova.PluginEntry> r0 = r5.entryMap
            monitor-enter(r0)
            java.util.Map<java.lang.String, org.apache.cordova.PluginEntry> r1 = r5.entryMap     // Catch:{ all -> 0x004a }
            java.util.Collection r1 = r1.values()     // Catch:{ all -> 0x004a }
            java.util.Iterator r1 = r1.iterator()     // Catch:{ all -> 0x004a }
        L_0x000d:
            boolean r2 = r1.hasNext()     // Catch:{ all -> 0x004a }
            if (r2 == 0) goto L_0x0032
            java.lang.Object r2 = r1.next()     // Catch:{ all -> 0x004a }
            org.apache.cordova.PluginEntry r2 = (org.apache.cordova.PluginEntry) r2     // Catch:{ all -> 0x004a }
            java.util.Map<java.lang.String, org.apache.cordova.CordovaPlugin> r3 = r5.pluginMap     // Catch:{ all -> 0x004a }
            java.lang.String r4 = r2.service     // Catch:{ all -> 0x004a }
            java.lang.Object r3 = r3.get(r4)     // Catch:{ all -> 0x004a }
            org.apache.cordova.CordovaPlugin r3 = (org.apache.cordova.CordovaPlugin) r3     // Catch:{ all -> 0x004a }
            if (r3 == 0) goto L_0x0031
            java.lang.Boolean r4 = r3.shouldAllowNavigation(r6)     // Catch:{ all -> 0x004a }
            if (r4 == 0) goto L_0x0031
            boolean r1 = r4.booleanValue()     // Catch:{ all -> 0x004a }
            monitor-exit(r0)     // Catch:{ all -> 0x004a }
            return r1
        L_0x0031:
            goto L_0x000d
        L_0x0032:
            monitor-exit(r0)     // Catch:{ all -> 0x004a }
            java.lang.String r0 = r5.getLaunchUrlPrefix()
            boolean r0 = r6.startsWith(r0)
            if (r0 != 0) goto L_0x0048
            java.lang.String r0 = "about:blank"
            boolean r0 = r6.startsWith(r0)
            if (r0 == 0) goto L_0x0046
            goto L_0x0048
        L_0x0046:
            r0 = 0
            goto L_0x0049
        L_0x0048:
            r0 = 1
        L_0x0049:
            return r0
        L_0x004a:
            r1 = move-exception
            monitor-exit(r0)     // Catch:{ all -> 0x004a }
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: org.apache.cordova.PluginManager.shouldAllowNavigation(java.lang.String):boolean");
    }

    public boolean shouldAllowBridgeAccess(String url) {
        Boolean result;
        synchronized (this.entryMap) {
            for (PluginEntry entry : this.entryMap.values()) {
                CordovaPlugin plugin = this.pluginMap.get(entry.service);
                if (plugin != null && (result = plugin.shouldAllowBridgeAccess(url)) != null) {
                    boolean booleanValue = result.booleanValue();
                    return booleanValue;
                }
            }
            return url.startsWith(getLaunchUrlPrefix());
        }
    }

    public Boolean shouldOpenExternalUrl(String url) {
        Boolean result;
        synchronized (this.entryMap) {
            for (PluginEntry entry : this.entryMap.values()) {
                CordovaPlugin plugin = this.pluginMap.get(entry.service);
                if (plugin != null && (result = plugin.shouldOpenExternalUrl(url)) != null) {
                    return result;
                }
            }
            return false;
        }
    }

    public boolean onOverrideUrlLoading(String url) {
        synchronized (this.entryMap) {
            for (PluginEntry entry : this.entryMap.values()) {
                CordovaPlugin plugin = this.pluginMap.get(entry.service);
                if (plugin != null && plugin.onOverrideUrlLoading(url)) {
                    return true;
                }
            }
            return false;
        }
    }

    public void onReset() {
        synchronized (this.pluginMap) {
            for (CordovaPlugin plugin : this.pluginMap.values()) {
                if (plugin != null) {
                    plugin.onReset();
                }
            }
        }
    }

    /* access modifiers changed from: package-private */
    public Uri remapUri(Uri uri) {
        Uri ret;
        synchronized (this.pluginMap) {
            for (CordovaPlugin plugin : this.pluginMap.values()) {
                if (plugin != null && (ret = plugin.remapUri(uri)) != null) {
                    return ret;
                }
            }
            return null;
        }
    }

    private CordovaPlugin instantiatePlugin(String className) {
        Class<?> c = null;
        if (className != null) {
            try {
                if (!"".equals(className)) {
                    c = Class.forName(className);
                }
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Error adding plugin " + className + ".");
                return null;
            }
        }
        if ((c != null) && CordovaPlugin.class.isAssignableFrom(c)) {
            return (CordovaPlugin) c.newInstance();
        }
        return null;
    }

    public void onConfigurationChanged(Configuration newConfig) {
        synchronized (this.pluginMap) {
            for (CordovaPlugin plugin : this.pluginMap.values()) {
                if (plugin != null) {
                    plugin.onConfigurationChanged(newConfig);
                }
            }
        }
    }

    public Bundle onSaveInstanceState() {
        Bundle pluginState;
        Bundle state = new Bundle();
        synchronized (this.pluginMap) {
            for (CordovaPlugin plugin : this.pluginMap.values()) {
                if (!(plugin == null || (pluginState = plugin.onSaveInstanceState()) == null)) {
                    state.putBundle(plugin.getServiceName(), pluginState);
                }
            }
        }
        return state;
    }

    public ArrayList<CordovaPluginPathHandler> getPluginPathHandlers() {
        ArrayList<CordovaPluginPathHandler> handlers = new ArrayList<>();
        for (CordovaPlugin plugin : this.pluginMap.values()) {
            if (!(plugin == null || plugin.getPathHandler() == null)) {
                handlers.add(plugin.getPathHandler());
            }
        }
        return handlers;
    }

    public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
        boolean result = false;
        synchronized (this.entryMap) {
            for (PluginEntry entry : this.entryMap.values()) {
                CordovaPlugin plugin = this.pluginMap.get(entry.service);
                if (plugin != null && plugin.onRenderProcessGone(view, detail)) {
                    result = true;
                }
            }
        }
        return result;
    }
}
