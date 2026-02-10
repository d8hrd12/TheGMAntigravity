package androidx.webkit.internal;

import androidx.webkit.ProxyConfig;
import androidx.webkit.ProxyController;
import androidx.webkit.internal.ApiFeature;
import java.lang.reflect.Array;
import java.util.List;
import java.util.concurrent.Executor;
import org.chromium.support_lib_boundary.ProxyControllerBoundaryInterface;

public class ProxyControllerImpl extends ProxyController {
    private ProxyControllerBoundaryInterface mBoundaryInterface;

    public void setProxyOverride(ProxyConfig proxyConfig, Executor executor, Runnable listener) {
        ApiFeature.NoFramework proxyOverride = WebViewFeatureInternal.PROXY_OVERRIDE;
        ApiFeature.NoFramework reverseBypass = WebViewFeatureInternal.PROXY_OVERRIDE_REVERSE_BYPASS;
        String[][] proxyRuleArray = proxyRulesToStringArray(proxyConfig.getProxyRules());
        String[] bypassRuleArray = (String[]) proxyConfig.getBypassRules().toArray(new String[0]);
        if (proxyOverride.isSupportedByWebView() && !proxyConfig.isReverseBypassEnabled()) {
            getBoundaryInterface().setProxyOverride(proxyRuleArray, bypassRuleArray, listener, executor);
            Executor executor2 = executor;
            Runnable runnable = listener;
        } else if (!proxyOverride.isSupportedByWebView() || !reverseBypass.isSupportedByWebView()) {
            Runnable runnable2 = listener;
            throw WebViewFeatureInternal.getUnsupportedOperationException();
        } else {
            Runnable listener2 = listener;
            getBoundaryInterface().setProxyOverride(proxyRuleArray, bypassRuleArray, listener2, executor, proxyConfig.isReverseBypassEnabled());
        }
    }

    public void clearProxyOverride(Executor executor, Runnable listener) {
        if (WebViewFeatureInternal.PROXY_OVERRIDE.isSupportedByWebView()) {
            getBoundaryInterface().clearProxyOverride(listener, executor);
            return;
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public static String[][] proxyRulesToStringArray(List<ProxyConfig.ProxyRule> proxyRuleList) {
        int size = proxyRuleList.size();
        int[] iArr = new int[2];
        iArr[1] = 2;
        iArr[0] = size;
        String[][] proxyRuleArray = (String[][]) Array.newInstance(String.class, iArr);
        for (int i = 0; i < proxyRuleList.size(); i++) {
            proxyRuleArray[i][0] = proxyRuleList.get(i).getSchemeFilter();
            proxyRuleArray[i][1] = proxyRuleList.get(i).getUrl();
        }
        return proxyRuleArray;
    }

    private ProxyControllerBoundaryInterface getBoundaryInterface() {
        if (this.mBoundaryInterface == null) {
            this.mBoundaryInterface = WebViewGlueCommunicator.getFactory().getProxyController();
        }
        return this.mBoundaryInterface;
    }
}
