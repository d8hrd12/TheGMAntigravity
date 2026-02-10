package org.apache.cordova;

import android.content.Context;
import androidx.webkit.ProxyConfig;
import org.xmlpull.v1.XmlPullParser;

public class AllowListPlugin extends CordovaPlugin {
    protected static final String LOG_TAG = "CordovaAllowListPlugin";
    public static final String PLUGIN_NAME = "CordovaAllowListPlugin";
    /* access modifiers changed from: private */
    public AllowList allowedIntents;
    /* access modifiers changed from: private */
    public AllowList allowedNavigations;
    /* access modifiers changed from: private */
    public AllowList allowedRequests;

    public AllowListPlugin() {
    }

    public AllowListPlugin(Context context) {
        this(new AllowList(), new AllowList(), (AllowList) null);
        new CustomConfigXmlParser().parse(context);
    }

    public AllowListPlugin(XmlPullParser xmlParser) {
        this(new AllowList(), new AllowList(), (AllowList) null);
        new CustomConfigXmlParser().parse(xmlParser);
    }

    public AllowListPlugin(AllowList allowedNavigations2, AllowList allowedIntents2, AllowList allowedRequests2) {
        if (allowedRequests2 == null) {
            allowedRequests2 = new AllowList();
            allowedRequests2.addAllowListEntry("file:///*", false);
            allowedRequests2.addAllowListEntry("data:*", false);
        }
        this.allowedNavigations = allowedNavigations2;
        this.allowedIntents = allowedIntents2;
        this.allowedRequests = allowedRequests2;
    }

    public void pluginInitialize() {
        if (this.allowedNavigations == null) {
            this.allowedNavigations = new AllowList();
            this.allowedIntents = new AllowList();
            this.allowedRequests = new AllowList();
            new CustomConfigXmlParser().parse(this.webView.getContext());
        }
    }

    private class CustomConfigXmlParser extends ConfigXmlParser {
        private CordovaPreferences prefs;

        private CustomConfigXmlParser() {
            this.prefs = new CordovaPreferences();
        }

        public void handleStartTag(XmlPullParser xml) {
            String origin;
            String strNode = xml.getName();
            boolean z = false;
            if (strNode.equals("content")) {
                AllowListPlugin.this.allowedNavigations.addAllowListEntry(xml.getAttributeValue((String) null, "src"), false);
            } else if (strNode.equals("allow-navigation")) {
                String origin2 = xml.getAttributeValue((String) null, "href");
                if (ProxyConfig.MATCH_ALL_SCHEMES.equals(origin2)) {
                    AllowListPlugin.this.allowedNavigations.addAllowListEntry("http://*/*", false);
                    AllowListPlugin.this.allowedNavigations.addAllowListEntry("https://*/*", false);
                    AllowListPlugin.this.allowedNavigations.addAllowListEntry("data:*", false);
                    return;
                }
                AllowListPlugin.this.allowedNavigations.addAllowListEntry(origin2, false);
            } else if (strNode.equals("allow-intent")) {
                AllowListPlugin.this.allowedIntents.addAllowListEntry(xml.getAttributeValue((String) null, "href"), false);
            } else if (strNode.equals("access") && (origin = xml.getAttributeValue((String) null, "origin")) != null) {
                if (ProxyConfig.MATCH_ALL_SCHEMES.equals(origin)) {
                    AllowListPlugin.this.allowedRequests.addAllowListEntry("http://*/*", false);
                    AllowListPlugin.this.allowedRequests.addAllowListEntry("https://*/*", false);
                    return;
                }
                String subdomains = xml.getAttributeValue((String) null, "subdomains");
                AllowList r4 = AllowListPlugin.this.allowedRequests;
                if (subdomains != null && subdomains.compareToIgnoreCase("true") == 0) {
                    z = true;
                }
                r4.addAllowListEntry(origin, z);
            }
        }

        public void handleEndTag(XmlPullParser xml) {
        }
    }

    public Boolean shouldAllowNavigation(String url) {
        if (this.allowedNavigations.isUrlAllowListed(url)) {
            return true;
        }
        return null;
    }

    public Boolean shouldAllowRequest(String url) {
        if (Boolean.TRUE.equals(shouldAllowNavigation(url)) || this.allowedRequests.isUrlAllowListed(url)) {
            return true;
        }
        return null;
    }

    public Boolean shouldOpenExternalUrl(String url) {
        if (this.allowedIntents.isUrlAllowListed(url)) {
            return true;
        }
        return null;
    }

    public AllowList getAllowedNavigations() {
        return this.allowedNavigations;
    }

    public void setAllowedNavigations(AllowList allowedNavigations2) {
        this.allowedNavigations = allowedNavigations2;
    }

    public AllowList getAllowedIntents() {
        return this.allowedIntents;
    }

    public void setAllowedIntents(AllowList allowedIntents2) {
        this.allowedIntents = allowedIntents2;
    }

    public AllowList getAllowedRequests() {
        return this.allowedRequests;
    }

    public void setAllowedRequests(AllowList allowedRequests2) {
        this.allowedRequests = allowedRequests2;
    }
}
