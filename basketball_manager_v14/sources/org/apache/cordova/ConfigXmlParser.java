package org.apache.cordova;

import android.content.Context;
import androidx.core.app.NotificationCompat;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Locale;
import java.util.regex.Pattern;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;

public class ConfigXmlParser {
    private static final String DEFAULT_CONTENT_SRC = "index.html";
    private static String DEFAULT_HOSTNAME = "localhost";
    private static String SCHEME_HTTP = "http";
    private static String SCHEME_HTTPS = "https";
    private static String TAG = "ConfigXmlParser";
    private String contentSrc;
    boolean insideFeature = false;
    private String launchUrl;
    boolean onload = false;
    String paramType = "";
    String pluginClass = "";
    private ArrayList<PluginEntry> pluginEntries = new ArrayList<>(20);
    private CordovaPreferences prefs = new CordovaPreferences();
    String service = "";

    public CordovaPreferences getPreferences() {
        return this.prefs;
    }

    public ArrayList<PluginEntry> getPluginEntries() {
        return this.pluginEntries;
    }

    public String getLaunchUrl() {
        if (this.launchUrl == null) {
            setStartUrl(this.contentSrc);
        }
        return this.launchUrl;
    }

    public void parse(Context action) {
        int id = action.getResources().getIdentifier("config", "xml", action.getClass().getPackage().getName());
        if (id == 0 && (id = action.getResources().getIdentifier("config", "xml", action.getPackageName())) == 0) {
            LOG.e(TAG, "res/xml/config.xml is missing!");
            return;
        }
        this.pluginEntries.add(new PluginEntry(AllowListPlugin.PLUGIN_NAME, "org.apache.cordova.AllowListPlugin", true));
        this.pluginEntries.add(new PluginEntry("CordovaSplashScreenPlugin", "org.apache.cordova.SplashScreenPlugin", true));
        parse((XmlPullParser) action.getResources().getXml(id));
    }

    public void parse(XmlPullParser xml) {
        int eventType = -1;
        while (eventType != 1) {
            if (eventType == 2) {
                handleStartTag(xml);
            } else if (eventType == 3) {
                handleEndTag(xml);
            }
            try {
                eventType = xml.next();
            } catch (XmlPullParserException e) {
                e.printStackTrace();
            } catch (IOException e2) {
                e2.printStackTrace();
            }
        }
        onPostParse();
    }

    private void onPostParse() {
        if (this.contentSrc == null) {
            this.contentSrc = DEFAULT_CONTENT_SRC;
        }
    }

    public void handleStartTag(XmlPullParser xml) {
        String strNode = xml.getName();
        if (strNode.equals("feature")) {
            this.insideFeature = true;
            this.service = xml.getAttributeValue((String) null, "name");
        } else if (this.insideFeature && strNode.equals("param")) {
            this.paramType = xml.getAttributeValue((String) null, "name");
            if (this.paramType.equals(NotificationCompat.CATEGORY_SERVICE)) {
                this.service = xml.getAttributeValue((String) null, "value");
            } else if (this.paramType.equals("package") || this.paramType.equals("android-package")) {
                this.pluginClass = xml.getAttributeValue((String) null, "value");
            } else if (this.paramType.equals("onload")) {
                this.onload = "true".equals(xml.getAttributeValue((String) null, "value"));
            }
        } else if (strNode.equals("preference")) {
            this.prefs.set(xml.getAttributeValue((String) null, "name").toLowerCase(Locale.ENGLISH), xml.getAttributeValue((String) null, "value"));
        } else if (strNode.equals("content")) {
            String src = xml.getAttributeValue((String) null, "src");
            if (src != null) {
                this.contentSrc = src;
            } else {
                this.contentSrc = DEFAULT_CONTENT_SRC;
            }
        }
    }

    public void handleEndTag(XmlPullParser xml) {
        if (xml.getName().equals("feature")) {
            this.pluginEntries.add(new PluginEntry(this.service, this.pluginClass, this.onload));
            this.service = "";
            this.pluginClass = "";
            this.insideFeature = false;
            this.onload = false;
        }
    }

    private String getLaunchUrlPrefix() {
        if (this.prefs.getBoolean("AndroidInsecureFileModeEnabled", false)) {
            return "file:///android_asset/www/";
        }
        String scheme = this.prefs.getString("scheme", SCHEME_HTTPS).toLowerCase();
        String hostname = this.prefs.getString("hostname", DEFAULT_HOSTNAME).toLowerCase();
        if (!scheme.contentEquals(SCHEME_HTTP) && !scheme.contentEquals(SCHEME_HTTPS)) {
            LOG.d(TAG, "The provided scheme \"" + scheme + "\" is not valid. Defaulting to \"" + SCHEME_HTTPS + "\". (Valid Options=" + SCHEME_HTTP + "," + SCHEME_HTTPS + ")");
            scheme = SCHEME_HTTPS;
        }
        return scheme + "://" + hostname + '/';
    }

    private void setStartUrl(String src) {
        if (Pattern.compile("^[a-z-]+://").matcher(src).find()) {
            this.launchUrl = src;
            return;
        }
        String launchUrlPrefix = getLaunchUrlPrefix();
        if (src.charAt(0) == '/') {
            src = src.substring(1);
        }
        this.launchUrl = launchUrlPrefix + src;
    }
}
