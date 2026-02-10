package androidx.webkit.internal;

import android.content.ComponentName;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.Bundle;
import androidx.webkit.WebViewCompat;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public abstract class StartupApiFeature {
    static final /* synthetic */ boolean $assertionsDisabled = false;
    public static final String METADATA_HOLDER_SERVICE_NAME = "org.chromium.android_webview.services.StartupFeatureMetadataHolder";
    private static final Set<StartupApiFeature> sValues = new HashSet();
    private final String mInternalFeatureValue;
    private final String mPublicFeatureValue;

    public abstract boolean isSupportedByFramework();

    StartupApiFeature(String publicFeatureValue, String internalFeatureValue) {
        this.mPublicFeatureValue = publicFeatureValue;
        this.mInternalFeatureValue = internalFeatureValue;
        sValues.add(this);
    }

    public String getPublicFeatureName() {
        return this.mPublicFeatureValue;
    }

    public boolean isSupported(Context context) {
        return isSupportedByFramework() || isSupportedByWebView(context);
    }

    public boolean isSupportedByWebView(Context context) {
        Bundle bundle = getMetaDataFromWebViewManifestOrNull(context);
        if (bundle == null) {
            return false;
        }
        return bundle.containsKey(this.mInternalFeatureValue);
    }

    public static Set<StartupApiFeature> values() {
        return Collections.unmodifiableSet(sValues);
    }

    private static Bundle getMetaDataFromWebViewManifestOrNull(Context context) {
        PackageInfo systemWebViewPackage = WebViewCompat.getCurrentWebViewPackage(context);
        if (systemWebViewPackage == null) {
            return null;
        }
        ComponentName compName = new ComponentName(systemWebViewPackage.packageName, METADATA_HOLDER_SERVICE_NAME);
        if (Build.VERSION.SDK_INT >= 33) {
            try {
                return ApiHelperForTiramisu.getServiceInfo(context.getPackageManager(), compName, ApiHelperForTiramisu.of(640)).metaData;
            } catch (PackageManager.NameNotFoundException e) {
                return null;
            }
        } else {
            try {
                return getServiceInfo(context, compName, 128 | 512).metaData;
            } catch (PackageManager.NameNotFoundException e2) {
                return null;
            }
        }
    }

    private static ServiceInfo getServiceInfo(Context context, ComponentName compName, int flags) throws PackageManager.NameNotFoundException {
        if (Build.VERSION.SDK_INT < 33) {
            return context.getPackageManager().getServiceInfo(compName, flags);
        }
        throw new AssertionError();
    }

    public static class P extends StartupApiFeature {
        P(String publicFeatureValue, String internalFeatureValue) {
            super(publicFeatureValue, internalFeatureValue);
        }

        public final boolean isSupportedByFramework() {
            return Build.VERSION.SDK_INT >= 28;
        }
    }

    public static class NoFramework extends StartupApiFeature {
        NoFramework(String publicFeatureValue, String internalFeatureValue) {
            super(publicFeatureValue, internalFeatureValue);
        }

        public final boolean isSupportedByFramework() {
            return false;
        }
    }
}
