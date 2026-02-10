package com.getcapacitor.plugin;

import android.webkit.JavascriptInterface;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.plugin.util.CapacitorHttpUrlConnection;
import com.getcapacitor.plugin.util.HttpRequestHandler;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(permissions = {@Permission(alias = "HttpWrite", strings = {"android.permission.WRITE_EXTERNAL_STORAGE"}), @Permission(alias = "HttpRead", strings = {"android.permission.READ_EXTERNAL_STORAGE"})})
public class CapacitorHttp extends Plugin {
    /* access modifiers changed from: private */
    public final Map<Runnable, PluginCall> activeRequests = new ConcurrentHashMap();
    private final ExecutorService executor = Executors.newCachedThreadPool();

    public void load() {
        this.bridge.getWebView().addJavascriptInterface(this, "CapacitorHttpAndroidInterface");
        super.load();
    }

    /* access modifiers changed from: protected */
    public void handleOnDestroy() {
        super.handleOnDestroy();
        for (Map.Entry<Runnable, PluginCall> entry : this.activeRequests.entrySet()) {
            Runnable key = entry.getKey();
            PluginCall call = entry.getValue();
            if (call.getData().has("activeCapacitorHttpUrlConnection")) {
                try {
                    ((CapacitorHttpUrlConnection) call.getData().get("activeCapacitorHttpUrlConnection")).disconnect();
                    call.getData().remove("activeCapacitorHttpUrlConnection");
                } catch (Exception e) {
                }
            }
            getBridge().releaseCall(call);
        }
        this.activeRequests.clear();
        this.executor.shutdownNow();
    }

    private void http(final PluginCall call, final String httpMethod) {
        Runnable asyncHttpCall = new Runnable(this) {
            final /* synthetic */ CapacitorHttp this$0;

            {
                this.this$0 = this$0;
            }

            public void run() {
                try {
                    call.resolve(HttpRequestHandler.request(call, httpMethod, this.this$0.getBridge()));
                } catch (Exception e) {
                    call.reject(e.getLocalizedMessage(), e.getClass().getSimpleName(), e);
                } catch (Throwable th) {
                    this.this$0.activeRequests.remove(this);
                    throw th;
                }
                this.this$0.activeRequests.remove(this);
            }
        };
        if (!this.executor.isShutdown()) {
            this.activeRequests.put(asyncHttpCall, call);
            this.executor.submit(asyncHttpCall);
            return;
        }
        call.reject("Failed to execute request - Http Plugin was shutdown");
    }

    @JavascriptInterface
    public boolean isEnabled() {
        return getBridge().getConfig().getPluginConfiguration("CapacitorHttp").getBoolean("enabled", false);
    }

    @PluginMethod
    public void request(PluginCall call) {
        http(call, (String) null);
    }

    @PluginMethod
    public void get(PluginCall call) {
        http(call, "GET");
    }

    @PluginMethod
    public void post(PluginCall call) {
        http(call, "POST");
    }

    @PluginMethod
    public void put(PluginCall call) {
        http(call, "PUT");
    }

    @PluginMethod
    public void patch(PluginCall call) {
        http(call, "PATCH");
    }

    @PluginMethod
    public void delete(PluginCall call) {
        http(call, "DELETE");
    }
}
