package androidx.webkit.internal;

import android.webkit.ServiceWorkerWebSettings;
import androidx.webkit.ServiceWorkerWebSettingsCompat;
import androidx.webkit.internal.ApiFeature;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;
import java.util.Set;
import org.chromium.support_lib_boundary.ServiceWorkerWebSettingsBoundaryInterface;
import org.chromium.support_lib_boundary.util.BoundaryInterfaceReflectionUtil;

public class ServiceWorkerWebSettingsImpl extends ServiceWorkerWebSettingsCompat {
    private ServiceWorkerWebSettingsBoundaryInterface mBoundaryInterface;
    private ServiceWorkerWebSettings mFrameworksImpl;

    public ServiceWorkerWebSettingsImpl(ServiceWorkerWebSettings settings) {
        this.mFrameworksImpl = settings;
    }

    public ServiceWorkerWebSettingsImpl(InvocationHandler invocationHandler) {
        this.mBoundaryInterface = (ServiceWorkerWebSettingsBoundaryInterface) BoundaryInterfaceReflectionUtil.castToSuppLibClass(ServiceWorkerWebSettingsBoundaryInterface.class, invocationHandler);
    }

    private ServiceWorkerWebSettings getFrameworksImpl() {
        if (this.mFrameworksImpl == null) {
            this.mFrameworksImpl = WebViewGlueCommunicator.getCompatConverter().convertServiceWorkerSettings(Proxy.getInvocationHandler(this.mBoundaryInterface));
        }
        return this.mFrameworksImpl;
    }

    private ServiceWorkerWebSettingsBoundaryInterface getBoundaryInterface() {
        if (this.mBoundaryInterface == null) {
            this.mBoundaryInterface = (ServiceWorkerWebSettingsBoundaryInterface) BoundaryInterfaceReflectionUtil.castToSuppLibClass(ServiceWorkerWebSettingsBoundaryInterface.class, WebViewGlueCommunicator.getCompatConverter().convertServiceWorkerSettings(this.mFrameworksImpl));
        }
        return this.mBoundaryInterface;
    }

    public void setCacheMode(int mode) {
        ApiFeature.N feature = WebViewFeatureInternal.SERVICE_WORKER_CACHE_MODE;
        if (feature.isSupportedByFramework()) {
            ApiHelperForN.setCacheMode(getFrameworksImpl(), mode);
        } else if (feature.isSupportedByWebView()) {
            getBoundaryInterface().setCacheMode(mode);
        } else {
            throw WebViewFeatureInternal.getUnsupportedOperationException();
        }
    }

    public int getCacheMode() {
        ApiFeature.N feature = WebViewFeatureInternal.SERVICE_WORKER_CACHE_MODE;
        if (feature.isSupportedByFramework()) {
            return ApiHelperForN.getCacheMode(getFrameworksImpl());
        }
        if (feature.isSupportedByWebView()) {
            return getBoundaryInterface().getCacheMode();
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public void setAllowContentAccess(boolean allow) {
        ApiFeature.N feature = WebViewFeatureInternal.SERVICE_WORKER_CONTENT_ACCESS;
        if (feature.isSupportedByFramework()) {
            ApiHelperForN.setAllowContentAccess(getFrameworksImpl(), allow);
        } else if (feature.isSupportedByWebView()) {
            getBoundaryInterface().setAllowContentAccess(allow);
        } else {
            throw WebViewFeatureInternal.getUnsupportedOperationException();
        }
    }

    public boolean getAllowContentAccess() {
        ApiFeature.N feature = WebViewFeatureInternal.SERVICE_WORKER_CONTENT_ACCESS;
        if (feature.isSupportedByFramework()) {
            return ApiHelperForN.getAllowContentAccess(getFrameworksImpl());
        }
        if (feature.isSupportedByWebView()) {
            return getBoundaryInterface().getAllowContentAccess();
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public void setAllowFileAccess(boolean allow) {
        ApiFeature.N feature = WebViewFeatureInternal.SERVICE_WORKER_FILE_ACCESS;
        if (feature.isSupportedByFramework()) {
            ApiHelperForN.setAllowFileAccess(getFrameworksImpl(), allow);
        } else if (feature.isSupportedByWebView()) {
            getBoundaryInterface().setAllowFileAccess(allow);
        } else {
            throw WebViewFeatureInternal.getUnsupportedOperationException();
        }
    }

    public boolean getAllowFileAccess() {
        ApiFeature.N feature = WebViewFeatureInternal.SERVICE_WORKER_FILE_ACCESS;
        if (feature.isSupportedByFramework()) {
            return ApiHelperForN.getAllowFileAccess(getFrameworksImpl());
        }
        if (feature.isSupportedByWebView()) {
            return getBoundaryInterface().getAllowFileAccess();
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public void setBlockNetworkLoads(boolean flag) {
        ApiFeature.N feature = WebViewFeatureInternal.SERVICE_WORKER_BLOCK_NETWORK_LOADS;
        if (feature.isSupportedByFramework()) {
            ApiHelperForN.setBlockNetworkLoads(getFrameworksImpl(), flag);
        } else if (feature.isSupportedByWebView()) {
            getBoundaryInterface().setBlockNetworkLoads(flag);
        } else {
            throw WebViewFeatureInternal.getUnsupportedOperationException();
        }
    }

    public boolean getBlockNetworkLoads() {
        ApiFeature.N feature = WebViewFeatureInternal.SERVICE_WORKER_BLOCK_NETWORK_LOADS;
        if (feature.isSupportedByFramework()) {
            return ApiHelperForN.getBlockNetworkLoads(getFrameworksImpl());
        }
        if (feature.isSupportedByWebView()) {
            return getBoundaryInterface().getBlockNetworkLoads();
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public Set<String> getRequestedWithHeaderOriginAllowList() {
        if (WebViewFeatureInternal.REQUESTED_WITH_HEADER_ALLOW_LIST.isSupportedByWebView()) {
            return getBoundaryInterface().getRequestedWithHeaderOriginAllowList();
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public void setRequestedWithHeaderOriginAllowList(Set<String> allowList) {
        if (WebViewFeatureInternal.REQUESTED_WITH_HEADER_ALLOW_LIST.isSupportedByWebView()) {
            getBoundaryInterface().setRequestedWithHeaderOriginAllowList(allowList);
            return;
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }
}
