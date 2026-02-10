package androidx.webkit;

import android.webkit.WebStorage;
import androidx.webkit.internal.WebStorageAdapter;
import androidx.webkit.internal.WebViewFeatureInternal;
import androidx.webkit.internal.WebViewGlueCommunicator;
import java.util.concurrent.Executor;

public final class WebStorageCompat {
    private WebStorageCompat() {
    }

    public static void deleteBrowsingData(WebStorage instance, Executor executor, Runnable doneCallback) {
        if (WebViewFeatureInternal.DELETE_BROWSING_DATA.isSupportedByWebView()) {
            getAdapter(instance).deleteBrowsingData(executor, doneCallback);
            return;
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public static void deleteBrowsingData(WebStorage instance, Runnable doneCallback) {
        deleteBrowsingData(instance, new WebStorageCompat$$ExternalSyntheticLambda1(), doneCallback);
    }

    public static String deleteBrowsingDataForSite(WebStorage instance, String site, Executor executor, Runnable doneCallback) {
        if (WebViewFeatureInternal.DELETE_BROWSING_DATA.isSupportedByWebView()) {
            return getAdapter(instance).deleteBrowsingDataForSite(site, executor, doneCallback);
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public static String deleteBrowsingDataForSite(WebStorage instance, String site, Runnable doneCallback) {
        return deleteBrowsingDataForSite(instance, site, new WebStorageCompat$$ExternalSyntheticLambda0(), doneCallback);
    }

    private static WebStorageAdapter getAdapter(WebStorage webStorage) {
        return WebViewGlueCommunicator.getCompatConverter().convertWebStorage(webStorage);
    }
}
