package androidx.webkit;

import android.content.Context;
import androidx.lifecycle.LifecycleKt$$ExternalSyntheticBackportWithForwarding0;
import androidx.webkit.internal.ApiHelperForP;
import androidx.webkit.internal.WebViewFeatureInternal;
import java.io.File;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.concurrent.atomic.AtomicReference;
import org.chromium.support_lib_boundary.ProcessGlobalConfigConstants;

public class ProcessGlobalConfig {
    private static boolean sApplyCalled = false;
    private static final Object sLock = new Object();
    private static final AtomicReference<HashMap<String, Object>> sProcessGlobalConfig = new AtomicReference<>();
    String mCacheDirectoryBasePath;
    String mDataDirectoryBasePath;
    String mDataDirectorySuffix;
    Boolean mPartitionedCookiesEnabled;

    public ProcessGlobalConfig setDataDirectorySuffix(Context context, String suffix) {
        if (!WebViewFeatureInternal.STARTUP_FEATURE_SET_DATA_DIRECTORY_SUFFIX.isSupported(context)) {
            throw WebViewFeatureInternal.getUnsupportedOperationException();
        } else if (suffix.equals("")) {
            throw new IllegalArgumentException("Suffix cannot be an empty string");
        } else if (suffix.indexOf(File.separatorChar) < 0) {
            this.mDataDirectorySuffix = suffix;
            return this;
        } else {
            throw new IllegalArgumentException("Suffix " + suffix + " contains a path separator");
        }
    }

    public ProcessGlobalConfig setDirectoryBasePaths(Context context, File dataDirectoryBasePath, File cacheDirectoryBasePath) {
        if (!WebViewFeatureInternal.STARTUP_FEATURE_SET_DIRECTORY_BASE_PATH.isSupported(context)) {
            throw WebViewFeatureInternal.getUnsupportedOperationException();
        } else if (!dataDirectoryBasePath.isAbsolute()) {
            throw new IllegalArgumentException("dataDirectoryBasePath must be a non-empty absolute path");
        } else if (cacheDirectoryBasePath.isAbsolute()) {
            this.mDataDirectoryBasePath = dataDirectoryBasePath.getAbsolutePath();
            this.mCacheDirectoryBasePath = cacheDirectoryBasePath.getAbsolutePath();
            return this;
        } else {
            throw new IllegalArgumentException("cacheDirectoryBasePath must be a non-empty absolute path");
        }
    }

    public ProcessGlobalConfig setPartitionedCookiesEnabled(Context context, boolean isEnabled) {
        if (WebViewFeatureInternal.STARTUP_FEATURE_CONFIGURE_PARTITIONED_COOKIES.isSupported(context)) {
            this.mPartitionedCookiesEnabled = Boolean.valueOf(isEnabled);
            return this;
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public static void apply(ProcessGlobalConfig config) {
        synchronized (sLock) {
            if (!sApplyCalled) {
                sApplyCalled = true;
            } else {
                throw new IllegalStateException("ProcessGlobalConfig#apply was called more than once, which is an illegal operation. The configuration settings provided by ProcessGlobalConfig take effect only once, when WebView is first loaded into the current process. Every process should only ever create a single instance of ProcessGlobalConfig and apply it once, before any calls to android.webkit APIs, such as during early app startup.");
            }
        }
        HashMap<String, Object> configMap = new HashMap<>();
        if (!webViewCurrentlyLoaded()) {
            if (config.mDataDirectorySuffix != null) {
                if (WebViewFeatureInternal.STARTUP_FEATURE_SET_DATA_DIRECTORY_SUFFIX.isSupportedByFramework()) {
                    ApiHelperForP.setDataDirectorySuffix(config.mDataDirectorySuffix);
                } else {
                    configMap.put(ProcessGlobalConfigConstants.DATA_DIRECTORY_SUFFIX, config.mDataDirectorySuffix);
                }
            }
            if (config.mDataDirectoryBasePath != null) {
                configMap.put(ProcessGlobalConfigConstants.DATA_DIRECTORY_BASE_PATH, config.mDataDirectoryBasePath);
            }
            if (config.mCacheDirectoryBasePath != null) {
                configMap.put(ProcessGlobalConfigConstants.CACHE_DIRECTORY_BASE_PATH, config.mCacheDirectoryBasePath);
            }
            if (config.mPartitionedCookiesEnabled != null) {
                configMap.put(ProcessGlobalConfigConstants.CONFIGURE_PARTITIONED_COOKIES, config.mPartitionedCookiesEnabled);
            }
            if (!LifecycleKt$$ExternalSyntheticBackportWithForwarding0.m(sProcessGlobalConfig, (Object) null, configMap)) {
                throw new RuntimeException("Attempting to set ProcessGlobalConfig#sProcessGlobalConfig when it was already set");
            }
            return;
        }
        throw new IllegalStateException("WebView has already been loaded in the current process, so any attempt to apply the settings in ProcessGlobalConfig will have no effect. ProcessGlobalConfig#apply needs to be called before any calls to android.webkit APIs, such as during early app startup.");
    }

    private static boolean webViewCurrentlyLoaded() {
        try {
            Field providerInstanceField = Class.forName("android.webkit.WebViewFactory").getDeclaredField("sProviderInstance");
            providerInstanceField.setAccessible(true);
            if (providerInstanceField.get((Object) null) != null) {
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}
