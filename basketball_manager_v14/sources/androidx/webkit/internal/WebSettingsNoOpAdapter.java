package androidx.webkit.internal;

import androidx.webkit.UserAgentMetadata;
import androidx.webkit.WebViewMediaIntegrityApiStatusConfig;
import java.util.Collections;
import java.util.Set;
import org.chromium.support_lib_boundary.WebSettingsBoundaryInterface;

public class WebSettingsNoOpAdapter extends WebSettingsAdapter {
    public WebSettingsNoOpAdapter() {
        super((WebSettingsBoundaryInterface) null);
    }

    public void setOffscreenPreRaster(boolean enabled) {
    }

    public boolean getOffscreenPreRaster() {
        return false;
    }

    public void setSafeBrowsingEnabled(boolean enabled) {
    }

    public boolean getSafeBrowsingEnabled() {
        return true;
    }

    public void setDisabledActionModeMenuItems(int menuItems) {
    }

    public int getDisabledActionModeMenuItems() {
        return 0;
    }

    public void setForceDark(int forceDarkMode) {
    }

    public int getForceDark() {
        return 1;
    }

    public void setForceDarkStrategy(int forceDarkStrategy) {
    }

    public int getForceDarkStrategy() {
        return 2;
    }

    public void setAlgorithmicDarkeningAllowed(boolean allow) {
    }

    public boolean isAlgorithmicDarkeningAllowed() {
        return false;
    }

    public void setEnterpriseAuthenticationAppLinkPolicyEnabled(boolean enabled) {
    }

    public boolean getEnterpriseAuthenticationAppLinkPolicyEnabled() {
        return false;
    }

    public Set<String> getRequestedWithHeaderOriginAllowList() {
        return Collections.emptySet();
    }

    public void setRequestedWithHeaderOriginAllowList(Set<String> set) {
    }

    public UserAgentMetadata getUserAgentMetadata() {
        return UserAgentMetadataInternal.getUserAgentMetadataFromMap(Collections.emptyMap());
    }

    public void setUserAgentMetadata(UserAgentMetadata uaMetadata) {
    }

    public int getAttributionRegistrationBehavior() {
        return 1;
    }

    public void setAttributionRegistrationBehavior(int behavior) {
    }

    public void setWebViewMediaIntegrityApiStatus(WebViewMediaIntegrityApiStatusConfig permissionConfig) {
    }

    public WebViewMediaIntegrityApiStatusConfig getWebViewMediaIntegrityApiStatus() {
        return new WebViewMediaIntegrityApiStatusConfig.Builder(2).build();
    }

    public void setWebAuthenticationSupport(int support) {
    }

    public int getWebAuthenticationSupport() {
        return 0;
    }

    public void setSpeculativeLoadingStatus(int speculativeLoadingStatus) {
    }

    public int getSpeculativeLoadingStatus() {
        return 0;
    }

    public void setBackForwardCacheEnabled(boolean backForwardCacheEnabled) {
    }

    public boolean getBackForwardCacheEnabled() {
        return false;
    }

    public void setPaymentRequestEnabled(boolean enabled) {
    }

    public boolean getPaymentRequestEnabled() {
        return false;
    }

    public void setHasEnrolledInstrumentEnabled(boolean enabled) {
    }

    public boolean getHasEnrolledInstrumentEnabled() {
        return false;
    }
}
