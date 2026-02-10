package com.getcapacitor.plugin;

import android.content.res.Configuration;
import android.os.Build;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebView;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.WebViewListener;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.Locale;

@CapacitorPlugin
public class SystemBars extends Plugin {
    static final String BAR_GESTURE_BAR = "NavigationBar";
    static final String BAR_STATUS_BAR = "StatusBar";
    static final String INSETS_HANDLING_CSS = "css";
    static final String INSETS_HANDLING_DISABLE = "disable";
    static final String STYLE_DARK = "DARK";
    static final String STYLE_DEFAULT = "DEFAULT";
    static final String STYLE_LIGHT = "LIGHT";
    static final String viewportMetaJSFunction = "function capacitorSystemBarsCheckMetaViewport() {\n    const meta = document.querySelectorAll(\"meta[name=viewport]\");\n    if (meta.length == 0) {\n        return false;\n    }\n    // get the last found meta viewport tag\n    const metaContent = meta[meta.length - 1].content;\n    return metaContent.includes(\"viewport-fit=cover\");\n}\ncapacitorSystemBarsCheckMetaViewport();\n";
    private boolean hasViewportCover = false;
    private boolean insetHandlingEnabled = true;

    public void load() {
        getBridge().getWebView().addJavascriptInterface(this, "CapacitorSystemBarsAndroidInterface");
        super.load();
        initSystemBars();
    }

    /* access modifiers changed from: protected */
    public void handleOnStart() {
        super.handleOnStart();
        getBridge().addWebViewListener(new WebViewListener() {
            public void onPageCommitVisible(WebView view, String url) {
                super.onPageCommitVisible(view, url);
                SystemBars.this.getBridge().getWebView().requestApplyInsets();
            }
        });
    }

    /* access modifiers changed from: protected */
    public void handleOnConfigurationChanged(Configuration newConfig) {
        super.handleOnConfigurationChanged(newConfig);
        setStyle(STYLE_DEFAULT, "");
    }

    private void initSystemBars() {
        String style = getConfig().getString("style", STYLE_DEFAULT).toUpperCase(Locale.US);
        boolean hidden = getConfig().getBoolean("hidden", false);
        if (getConfig().getString("insetsHandling", INSETS_HANDLING_CSS).equals(INSETS_HANDLING_DISABLE)) {
            this.insetHandlingEnabled = false;
        }
        initWindowInsetsListener();
        initSafeAreaInsets();
        getBridge().executeOnMainThread(new SystemBars$$ExternalSyntheticLambda6(this, style, hidden));
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$initSystemBars$0(String style, boolean hidden) {
        setStyle(style, "");
        setHidden(hidden, "");
    }

    @PluginMethod
    public void setStyle(PluginCall call) {
        String bar = call.getString("bar", "");
        getBridge().executeOnMainThread(new SystemBars$$ExternalSyntheticLambda3(this, call.getString("style", STYLE_DEFAULT), bar, call));
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$setStyle$0(String style, String bar, PluginCall call) {
        setStyle(style, bar);
        call.resolve();
    }

    @PluginMethod
    public void show(PluginCall call) {
        getBridge().executeOnMainThread(new SystemBars$$ExternalSyntheticLambda0(this, call.getString("bar", ""), call));
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$show$0(String bar, PluginCall call) {
        setHidden(false, bar);
        call.resolve();
    }

    @PluginMethod
    public void hide(PluginCall call) {
        getBridge().executeOnMainThread(new SystemBars$$ExternalSyntheticLambda7(this, call.getString("bar", ""), call));
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$hide$0(String bar, PluginCall call) {
        setHidden(true, bar);
        call.resolve();
    }

    @PluginMethod
    public void setAnimation(PluginCall call) {
        call.resolve();
    }

    @JavascriptInterface
    public void onDOMReady() {
        getActivity().runOnUiThread(new SystemBars$$ExternalSyntheticLambda2(this));
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$onDOMReady$0() {
        this.bridge.getWebView().evaluateJavascript(viewportMetaJSFunction, new SystemBars$$ExternalSyntheticLambda5(this));
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$onDOMReady$1(String res) {
        this.hasViewportCover = res.equals("true");
        getBridge().getWebView().requestApplyInsets();
    }

    private Insets calcSafeAreaInsets(WindowInsetsCompat insets) {
        Insets safeArea = insets.getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
        return Insets.of(safeArea.left, safeArea.top, safeArea.right, safeArea.bottom);
    }

    private void initSafeAreaInsets() {
        WindowInsetsCompat insets;
        if (Build.VERSION.SDK_INT >= 35 && this.insetHandlingEnabled && (insets = ViewCompat.getRootWindowInsets((View) getBridge().getWebView().getParent())) != null) {
            Insets safeAreaInsets = calcSafeAreaInsets(insets);
            injectSafeAreaCSS(safeAreaInsets.top, safeAreaInsets.right, safeAreaInsets.bottom, safeAreaInsets.left);
        }
    }

    private void initWindowInsetsListener() {
        if (Build.VERSION.SDK_INT >= 35 && this.insetHandlingEnabled) {
            ViewCompat.setOnApplyWindowInsetsListener((View) getBridge().getWebView().getParent(), new SystemBars$$ExternalSyntheticLambda1(this));
        }
    }

    /* access modifiers changed from: private */
    public /* synthetic */ WindowInsetsCompat lambda$initWindowInsetsListener$0(View v, WindowInsetsCompat insets) {
        if (!this.hasViewportCover) {
            return insets;
        }
        Insets safeAreaInsets = calcSafeAreaInsets(insets);
        if (insets.isVisible(WindowInsetsCompat.Type.ime())) {
            setViewMargins(v, Insets.of(0, 0, 0, insets.getInsets(WindowInsetsCompat.Type.ime()).bottom));
        } else {
            setViewMargins(v, Insets.NONE);
        }
        injectSafeAreaCSS(safeAreaInsets.top, safeAreaInsets.right, safeAreaInsets.bottom, safeAreaInsets.left);
        return WindowInsetsCompat.CONSUMED;
    }

    private void setViewMargins(View v, Insets insets) {
        ViewGroup.MarginLayoutParams mlp = (ViewGroup.MarginLayoutParams) v.getLayoutParams();
        mlp.leftMargin = insets.left;
        mlp.bottomMargin = insets.bottom;
        mlp.rightMargin = insets.right;
        mlp.topMargin = insets.top;
        v.setLayoutParams(mlp);
    }

    private void injectSafeAreaCSS(int top, int right, int bottom, int left) {
        float density = getActivity().getResources().getDisplayMetrics().density;
        getBridge().executeOnMainThread(new SystemBars$$ExternalSyntheticLambda4(this, ((float) top) / density, ((float) right) / density, ((float) bottom) / density, ((float) left) / density));
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$injectSafeAreaCSS$0(float topPx, float rightPx, float bottomPx, float leftPx) {
        if (this.bridge != null && this.bridge.getWebView() != null) {
            this.bridge.getWebView().evaluateJavascript(String.format(Locale.US, "try {\n  document.documentElement.style.setProperty(\"--safe-area-inset-top\", \"%dpx\");\n  document.documentElement.style.setProperty(\"--safe-area-inset-right\", \"%dpx\");\n  document.documentElement.style.setProperty(\"--safe-area-inset-bottom\", \"%dpx\");\n  document.documentElement.style.setProperty(\"--safe-area-inset-left\", \"%dpx\");\n} catch(e) { console.error('Error injecting safe area CSS:', e); }\n", new Object[]{Integer.valueOf((int) topPx), Integer.valueOf((int) rightPx), Integer.valueOf((int) bottomPx), Integer.valueOf((int) leftPx)}), (ValueCallback) null);
        }
    }

    private void setStyle(String style, String bar) {
        if (style.equals(STYLE_DEFAULT)) {
            style = getStyleForTheme();
        }
        Window window = getActivity().getWindow();
        WindowInsetsControllerCompat windowInsetsControllerCompat = WindowCompat.getInsetsController(window, window.getDecorView());
        if (bar.isEmpty() || bar.equals(BAR_STATUS_BAR)) {
            windowInsetsControllerCompat.setAppearanceLightStatusBars(!style.equals(STYLE_DARK));
        }
        if (bar.isEmpty() || bar.equals(BAR_GESTURE_BAR)) {
            windowInsetsControllerCompat.setAppearanceLightNavigationBars(!style.equals(STYLE_DARK));
        }
    }

    private void setHidden(boolean hide, String bar) {
        Window window = getActivity().getWindow();
        WindowInsetsControllerCompat windowInsetsControllerCompat = WindowCompat.getInsetsController(window, window.getDecorView());
        if (hide) {
            if (bar.isEmpty() || bar.equals(BAR_STATUS_BAR)) {
                windowInsetsControllerCompat.hide(WindowInsetsCompat.Type.statusBars());
            }
            if (bar.isEmpty() || bar.equals(BAR_GESTURE_BAR)) {
                windowInsetsControllerCompat.hide(WindowInsetsCompat.Type.navigationBars());
                return;
            }
            return;
        }
        if (bar.isEmpty() || bar.equals(BAR_STATUS_BAR)) {
            windowInsetsControllerCompat.show(WindowInsetsCompat.Type.systemBars());
        }
        if (bar.isEmpty() || bar.equals(BAR_GESTURE_BAR)) {
            windowInsetsControllerCompat.show(WindowInsetsCompat.Type.navigationBars());
        }
    }

    private String getStyleForTheme() {
        if ((getActivity().getResources().getConfiguration().uiMode & 48) != 32) {
            return STYLE_LIGHT;
        }
        return STYLE_DARK;
    }
}
