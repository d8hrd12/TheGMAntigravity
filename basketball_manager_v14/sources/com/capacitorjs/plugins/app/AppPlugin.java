package com.capacitorjs.plugins.app;

import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.net.Uri;
import androidx.activity.OnBackPressedCallback;
import androidx.core.content.pm.PackageInfoCompat;
import com.getcapacitor.App;
import com.getcapacitor.JSObject;
import com.getcapacitor.Logger;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PluginResult;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.util.InternalUtils;

@CapacitorPlugin(name = "App")
public class AppPlugin extends Plugin {
    private static final String EVENT_BACK_BUTTON = "backButton";
    private static final String EVENT_PAUSE = "pause";
    private static final String EVENT_RESTORED_RESULT = "appRestoredResult";
    private static final String EVENT_RESUME = "resume";
    private static final String EVENT_STATE_CHANGE = "appStateChange";
    private static final String EVENT_URL_OPEN = "appUrlOpen";
    private boolean hasPausedEver = false;
    private OnBackPressedCallback onBackPressedCallback;

    public void load() {
        boolean disableBackButtonHandler = getConfig().getBoolean("disableBackButtonHandler", false);
        this.bridge.getApp().setStatusChangeListener(new AppPlugin$$ExternalSyntheticLambda0(this));
        this.bridge.getApp().setAppRestoredListener(new AppPlugin$$ExternalSyntheticLambda1(this));
        this.onBackPressedCallback = new OnBackPressedCallback(!disableBackButtonHandler) {
            public void handleOnBackPressed() {
                if (AppPlugin.this.hasListeners(AppPlugin.EVENT_BACK_BUTTON)) {
                    JSObject data = new JSObject();
                    data.put("canGoBack", AppPlugin.this.bridge.getWebView().canGoBack());
                    AppPlugin.this.notifyListeners(AppPlugin.EVENT_BACK_BUTTON, data, true);
                    AppPlugin.this.bridge.triggerJSEvent("backbutton", "document");
                } else if (AppPlugin.this.bridge.getWebView().canGoBack()) {
                    AppPlugin.this.bridge.getWebView().goBack();
                }
            }
        };
        getActivity().getOnBackPressedDispatcher().addCallback(getActivity(), this.onBackPressedCallback);
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$load$0(Boolean isActive) {
        Logger.debug(getLogTag(), "Firing change: " + isActive);
        JSObject data = new JSObject();
        data.put("isActive", (Object) isActive);
        notifyListeners(EVENT_STATE_CHANGE, data, false);
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$load$1(PluginResult result) {
        Logger.debug(getLogTag(), "Firing restored result");
        notifyListeners(EVENT_RESTORED_RESULT, result.getWrappedResult(), true);
    }

    @PluginMethod
    public void exitApp(PluginCall call) {
        unsetAppListeners();
        call.resolve();
        getBridge().getActivity().finish();
    }

    @PluginMethod
    public void getInfo(PluginCall call) {
        JSObject data = new JSObject();
        try {
            PackageInfo pinfo = InternalUtils.getPackageInfo(getContext().getPackageManager(), getContext().getPackageName());
            ApplicationInfo applicationInfo = getContext().getApplicationInfo();
            int stringId = applicationInfo.labelRes;
            data.put("name", stringId == 0 ? applicationInfo.nonLocalizedLabel.toString() : getContext().getString(stringId));
            data.put("id", pinfo.packageName);
            data.put("build", Integer.toString((int) PackageInfoCompat.getLongVersionCode(pinfo)));
            data.put("version", pinfo.versionName);
            call.resolve(data);
        } catch (Exception e) {
            call.reject("Unable to get App Info");
        }
    }

    @PluginMethod
    public void getLaunchUrl(PluginCall call) {
        Uri launchUri = this.bridge.getIntentUri();
        if (launchUri != null) {
            JSObject d = new JSObject();
            d.put("url", launchUri.toString());
            call.resolve(d);
            return;
        }
        call.resolve();
    }

    @PluginMethod
    public void getState(PluginCall call) {
        JSObject data = new JSObject();
        data.put("isActive", this.bridge.getApp().isActive());
        call.resolve(data);
    }

    @PluginMethod
    public void minimizeApp(PluginCall call) {
        getActivity().moveTaskToBack(true);
        call.resolve();
    }

    @PluginMethod
    public void toggleBackButtonHandler(PluginCall call) {
        if (this.onBackPressedCallback == null) {
            call.reject("onBackPressedCallback is not set");
            return;
        }
        this.onBackPressedCallback.setEnabled(call.getBoolean("enabled").booleanValue());
        call.resolve();
    }

    /* access modifiers changed from: protected */
    public void handleOnNewIntent(Intent intent) {
        super.handleOnNewIntent(intent);
        String action = intent.getAction();
        Uri url = intent.getData();
        if ("android.intent.action.VIEW".equals(action) && url != null) {
            JSObject ret = new JSObject();
            ret.put("url", url.toString());
            notifyListeners(EVENT_URL_OPEN, ret, true);
        }
    }

    /* access modifiers changed from: protected */
    public void handleOnPause() {
        super.handleOnPause();
        this.hasPausedEver = true;
        notifyListeners(EVENT_PAUSE, (JSObject) null);
    }

    /* access modifiers changed from: protected */
    public void handleOnResume() {
        super.handleOnResume();
        if (this.hasPausedEver) {
            notifyListeners(EVENT_RESUME, (JSObject) null);
        }
    }

    /* access modifiers changed from: protected */
    public void handleOnDestroy() {
        unsetAppListeners();
    }

    private void unsetAppListeners() {
        this.bridge.getApp().setStatusChangeListener((App.AppStatusChangeListener) null);
        this.bridge.getApp().setAppRestoredListener((App.AppRestoredListener) null);
    }
}
