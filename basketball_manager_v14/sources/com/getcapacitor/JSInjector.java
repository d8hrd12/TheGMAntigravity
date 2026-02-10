package com.getcapacitor;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

class JSInjector {
    private String bridgeJS;
    private String cordovaJS;
    private String cordovaPluginsFileJS;
    private String cordovaPluginsJS;
    private String globalJS;
    private String localUrlJS;
    private String miscJS;
    private String pluginJS;

    public JSInjector(String globalJS2, String bridgeJS2, String pluginJS2, String cordovaJS2, String cordovaPluginsJS2, String cordovaPluginsFileJS2, String localUrlJS2) {
        this(globalJS2, bridgeJS2, pluginJS2, cordovaJS2, cordovaPluginsJS2, cordovaPluginsFileJS2, localUrlJS2, (String) null);
    }

    public JSInjector(String globalJS2, String bridgeJS2, String pluginJS2, String cordovaJS2, String cordovaPluginsJS2, String cordovaPluginsFileJS2, String localUrlJS2, String miscJS2) {
        this.globalJS = globalJS2;
        this.bridgeJS = bridgeJS2;
        this.pluginJS = pluginJS2;
        this.cordovaJS = cordovaJS2;
        this.cordovaPluginsJS = cordovaPluginsJS2;
        this.cordovaPluginsFileJS = cordovaPluginsFileJS2;
        this.localUrlJS = localUrlJS2;
        this.miscJS = miscJS2;
    }

    public String getScriptString() {
        String scriptString = this.globalJS + "\n\n" + this.localUrlJS + "\n\n" + this.bridgeJS + "\n\n" + this.pluginJS + "\n\n" + this.cordovaJS + "\n\n" + this.cordovaPluginsFileJS + "\n\n" + this.cordovaPluginsJS;
        if (this.miscJS != null) {
            return scriptString + "\n\n" + this.miscJS;
        }
        return scriptString;
    }

    public InputStream getInjectedStream(InputStream responseStream) {
        String js = "<script type=\"text/javascript\">" + getScriptString() + "</script>";
        String html = readAssetStream(responseStream);
        StringBuilder modifiedHtml = new StringBuilder(html);
        if (html.contains("<head>")) {
            modifiedHtml.insert(html.indexOf("<head>") + "<head>".length(), "\n" + js + "\n");
            html = modifiedHtml.toString();
        } else if (html.contains("</head>")) {
            modifiedHtml.insert(html.indexOf("</head>"), "\n" + js + "\n");
            html = modifiedHtml.toString();
        } else {
            Logger.error("Unable to inject Capacitor, Plugins won't work");
        }
        return new ByteArrayInputStream(html.getBytes(StandardCharsets.UTF_8));
    }

    private String readAssetStream(InputStream stream) {
        try {
            char[] buffer = new char[1024];
            StringBuilder out = new StringBuilder();
            Reader in = new InputStreamReader(stream, StandardCharsets.UTF_8);
            while (true) {
                int rsz = in.read(buffer, 0, buffer.length);
                if (rsz < 0) {
                    return out.toString();
                }
                out.append(buffer, 0, rsz);
            }
        } catch (Exception e) {
            Logger.error("Unable to process HTML asset file. This is a fatal error", e);
            return "";
        }
    }
}
