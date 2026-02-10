package com.getcapacitor;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.getcapacitor.Bridge;
import com.getcapacitor.android.R;
import java.util.ArrayList;
import java.util.List;

public class BridgeActivity extends AppCompatActivity {
    protected int activityDepth = 0;
    protected Bridge bridge;
    protected final Bridge.Builder bridgeBuilder = new Bridge.Builder((AppCompatActivity) this);
    protected CapConfig config;
    protected List<Class<? extends Plugin>> initialPlugins = new ArrayList();
    protected boolean keepRunning = true;

    /* access modifiers changed from: protected */
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.bridgeBuilder.setInstanceState(savedInstanceState);
        getApplication().setTheme(R.style.AppTheme_NoActionBar);
        setTheme(R.style.AppTheme_NoActionBar);
        try {
            setContentView(R.layout.capacitor_bridge_layout_main);
            try {
                this.bridgeBuilder.addPlugins(new PluginManager(getAssets()).loadPluginClasses());
            } catch (PluginLoadException ex) {
                Logger.error("Error loading plugins.", ex);
            }
            load();
        } catch (Exception e) {
            setContentView(R.layout.no_webview);
        }
    }

    /* access modifiers changed from: protected */
    public void load() {
        Logger.debug("Starting BridgeActivity");
        this.bridge = this.bridgeBuilder.addPlugins(this.initialPlugins).setConfig(this.config).create();
        this.keepRunning = this.bridge.shouldKeepRunning();
        onNewIntent(getIntent());
    }

    public void registerPlugin(Class<? extends Plugin> plugin) {
        this.bridgeBuilder.addPlugin(plugin);
    }

    public void registerPlugins(List<Class<? extends Plugin>> plugins) {
        this.bridgeBuilder.addPlugins(plugins);
    }

    public Bridge getBridge() {
        return this.bridge;
    }

    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        this.bridge.saveInstanceState(outState);
    }

    public void onStart() {
        super.onStart();
        this.activityDepth++;
        if (this.bridge != null) {
            this.bridge.onStart();
            Logger.debug("App started");
        }
    }

    public void onRestart() {
        super.onRestart();
        this.bridge.onRestart();
        Logger.debug("App restarted");
    }

    public void onResume() {
        super.onResume();
        if (this.bridge != null) {
            this.bridge.getApp().fireStatusChange(true);
            this.bridge.onResume();
            Logger.debug("App resumed");
        }
    }

    public void onPause() {
        super.onPause();
        if (this.bridge != null) {
            this.bridge.onPause();
            Logger.debug("App paused");
        }
    }

    public void onStop() {
        super.onStop();
        if (this.bridge != null) {
            this.activityDepth = Math.max(0, this.activityDepth - 1);
            if (this.activityDepth == 0) {
                this.bridge.getApp().fireStatusChange(false);
            }
            this.bridge.onStop();
            Logger.debug("App stopped");
        }
    }

    public void onDestroy() {
        super.onDestroy();
        if (this.bridge != null) {
            this.bridge.onDestroy();
            Logger.debug("App destroyed");
        }
    }

    public void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        this.bridge.onDetachedFromWindow();
    }

    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (this.bridge != null && !this.bridge.onRequestPermissionsResult(requestCode, permissions, grantResults)) {
            super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }

    /* access modifiers changed from: protected */
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (this.bridge != null && !this.bridge.onActivityResult(requestCode, resultCode, data)) {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    /* access modifiers changed from: protected */
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (this.bridge != null && intent != null) {
            this.bridge.onNewIntent(intent);
        }
    }

    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (this.bridge != null) {
            this.bridge.onConfigurationChanged(newConfig);
        }
    }
}
