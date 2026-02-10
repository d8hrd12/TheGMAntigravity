package androidx.webkit.internal;

import java.util.concurrent.Executor;
import org.chromium.support_lib_boundary.WebStorageBoundaryInterface;

public class WebStorageAdapter implements WebStorageBoundaryInterface {
    final WebStorageBoundaryInterface mImpl;

    public WebStorageAdapter(WebStorageBoundaryInterface impl) {
        this.mImpl = impl;
    }

    public void deleteBrowsingData(Executor callbackExecutor, Runnable doneCallback) {
        this.mImpl.deleteBrowsingData(callbackExecutor, doneCallback);
    }

    public String deleteBrowsingDataForSite(String domainOrUrl, Executor callbackExecutor, Runnable doneCallback) {
        return this.mImpl.deleteBrowsingDataForSite(domainOrUrl, callbackExecutor, doneCallback);
    }
}
