package com.getcapacitor;

import android.net.Uri;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.core.app.NotificationCompat;
import androidx.webkit.JavaScriptReplyProxy;
import androidx.webkit.WebMessageCompat;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import org.apache.cordova.PluginManager;

public class MessageHandler {
    private Bridge bridge;
    private PluginManager cordovaPluginManager;
    private JavaScriptReplyProxy javaScriptReplyProxy;
    private WebView webView;

    public MessageHandler(Bridge bridge2, WebView webView2, PluginManager cordovaPluginManager2) {
        this.bridge = bridge2;
        this.webView = webView2;
        this.cordovaPluginManager = cordovaPluginManager2;
        if (!WebViewFeature.isFeatureSupported("WEB_MESSAGE_LISTENER") || bridge2.getConfig().isUsingLegacyBridge()) {
            webView2.addJavascriptInterface(this, "androidBridge");
            return;
        }
        try {
            WebViewCompat.addWebMessageListener(webView2, "androidBridge", bridge2.getAllowedOriginRules(), new MessageHandler$$ExternalSyntheticLambda2(this));
        } catch (Exception e) {
            webView2.addJavascriptInterface(this, "androidBridge");
        }
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$new$0(WebView view, WebMessageCompat message, Uri sourceOrigin, boolean isMainFrame, JavaScriptReplyProxy replyProxy) {
        if (isMainFrame) {
            postMessage(message.getData());
            this.javaScriptReplyProxy = replyProxy;
            return;
        }
        Logger.warn("Plugin execution is allowed in Main Frame only");
    }

    @JavascriptInterface
    public void postMessage(String jsonStr) {
        try {
            JSObject postData = new JSObject(jsonStr);
            String type = postData.getString("type");
            boolean typeIsNotNull = type != null;
            boolean isCordovaPlugin = typeIsNotNull && type.equals("cordova");
            boolean isJavaScriptError = typeIsNotNull && type.equals("js.error");
            String callbackId = postData.getString("callbackId");
            if (isCordovaPlugin) {
                String service = postData.getString(NotificationCompat.CATEGORY_SERVICE);
                String action = postData.getString("action");
                String actionArgs = postData.getString("actionArgs");
                Logger.verbose(Logger.tags("Plugin"), "To native (Cordova plugin): callbackId: " + callbackId + ", service: " + service + ", action: " + action + ", actionArgs: " + actionArgs);
                callCordovaPluginMethod(callbackId, service, action, actionArgs);
            } else if (isJavaScriptError) {
                Logger.error("JavaScript Error: " + jsonStr);
            } else {
                String pluginId = postData.getString("pluginId");
                String methodName = postData.getString("methodName");
                JSObject methodData = postData.getJSObject("options", new JSObject());
                Logger.verbose(Logger.tags("Plugin"), "To native (Capacitor plugin): callbackId: " + callbackId + ", pluginId: " + pluginId + ", methodName: " + methodName);
                callPluginMethod(callbackId, pluginId, methodName, methodData);
            }
        } catch (Exception ex) {
            Logger.error("Post message error:", ex);
        }
    }

    public void sendResponseMessage(PluginCall call, PluginResult successResult, PluginResult errorResult) {
        try {
            PluginResult data = new PluginResult();
            data.put("save", call.isKeptAlive());
            data.put("callbackId", (Object) call.getCallbackId());
            data.put("pluginId", (Object) call.getPluginId());
            data.put("methodName", (Object) call.getMethodName());
            if (errorResult != null) {
                data.put("success", false);
                data.put("error", errorResult);
                Logger.debug("Sending plugin error: " + data.toString());
            } else {
                data.put("success", true);
                if (successResult != null) {
                    data.put("data", successResult);
                }
            }
            if (!(!call.getCallbackId().equals(PluginCall.CALLBACK_ID_DANGLING))) {
                this.bridge.getApp().fireRestoredResult(data);
            } else if (this.bridge.getConfig().isUsingLegacyBridge()) {
                legacySendResponseMessage(data);
            } else if (!WebViewFeature.isFeatureSupported("WEB_MESSAGE_LISTENER") || this.javaScriptReplyProxy == null) {
                legacySendResponseMessage(data);
            } else {
                this.javaScriptReplyProxy.postMessage(data.toString());
            }
        } catch (Exception ex) {
            Logger.error("sendResponseMessage: error: " + ex);
        }
        if (!call.isKeptAlive()) {
            call.release(this.bridge);
        }
    }

    private void legacySendResponseMessage(PluginResult data) {
        WebView webView2 = this.webView;
        webView2.post(new MessageHandler$$ExternalSyntheticLambda0(webView2, "window.Capacitor.fromNative(" + data.toString() + ")"));
    }

    private void callPluginMethod(String callbackId, String pluginId, String methodName, JSObject methodData) {
        String pluginId2 = pluginId;
        String methodName2 = methodName;
        this.bridge.callPluginMethod(pluginId2, methodName2, new PluginCall(this, pluginId2, callbackId, methodName2, methodData));
    }

    private void callCordovaPluginMethod(String callbackId, String service, String action, String actionArgs) {
        this.bridge.execute(new MessageHandler$$ExternalSyntheticLambda1(this, service, action, callbackId, actionArgs));
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$callCordovaPluginMethod$0(String service, String action, String callbackId, String actionArgs) {
        this.cordovaPluginManager.exec(service, action, callbackId, actionArgs);
    }
}
