package androidx.webkit.internal;

import androidx.webkit.Profile;
import androidx.webkit.ProfileStore;
import java.lang.reflect.InvocationHandler;
import java.util.List;
import org.chromium.support_lib_boundary.ProfileBoundaryInterface;
import org.chromium.support_lib_boundary.ProfileStoreBoundaryInterface;
import org.chromium.support_lib_boundary.util.BoundaryInterfaceReflectionUtil;

public class ProfileStoreImpl implements ProfileStore {
    private static ProfileStore sInstance;
    private final ProfileStoreBoundaryInterface mProfileStoreImpl;

    private ProfileStoreImpl(ProfileStoreBoundaryInterface profileStoreImpl) {
        this.mProfileStoreImpl = profileStoreImpl;
    }

    private ProfileStoreImpl() {
        this.mProfileStoreImpl = null;
    }

    public static ProfileStore getInstance() {
        if (sInstance == null) {
            sInstance = new ProfileStoreImpl(WebViewGlueCommunicator.getFactory().getProfileStore());
        }
        return sInstance;
    }

    public Profile getOrCreateProfile(String name) {
        if (WebViewFeatureInternal.MULTI_PROFILE.isSupportedByWebView()) {
            return new ProfileImpl((ProfileBoundaryInterface) BoundaryInterfaceReflectionUtil.castToSuppLibClass(ProfileBoundaryInterface.class, this.mProfileStoreImpl.getOrCreateProfile(name)));
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public Profile getProfile(String name) {
        if (WebViewFeatureInternal.MULTI_PROFILE.isSupportedByWebView()) {
            InvocationHandler profileBoundaryInterface = this.mProfileStoreImpl.getProfile(name);
            if (profileBoundaryInterface != null) {
                return new ProfileImpl((ProfileBoundaryInterface) BoundaryInterfaceReflectionUtil.castToSuppLibClass(ProfileBoundaryInterface.class, profileBoundaryInterface));
            }
            return null;
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public List<String> getAllProfileNames() {
        if (WebViewFeatureInternal.MULTI_PROFILE.isSupportedByWebView()) {
            return this.mProfileStoreImpl.getAllProfileNames();
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public boolean deleteProfile(String name) throws IllegalStateException {
        if (WebViewFeatureInternal.MULTI_PROFILE.isSupportedByWebView()) {
            return this.mProfileStoreImpl.deleteProfile(name);
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }
}
