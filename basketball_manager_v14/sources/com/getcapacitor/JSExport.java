package com.getcapacitor;

import android.content.Context;
import android.text.TextUtils;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JSExport {
    private static String CALLBACK_PARAM = "_callback";
    private static String CATCHALL_OPTIONS_PARAM = "_options";

    public static String getGlobalJS(Context context, boolean loggingEnabled, boolean isDebug) {
        return "window.Capacitor = { DEBUG: " + isDebug + ", isLoggingEnabled: " + loggingEnabled + ", Plugins: {} };";
    }

    public static String getMiscFileJS(ArrayList<String> paths, Context context) {
        List<String> lines = new ArrayList<>();
        Iterator<String> it = paths.iterator();
        while (it.hasNext()) {
            String path = it.next();
            try {
                lines.add(FileUtils.readFileFromAssets(context.getAssets(), "public/" + path));
            } catch (IOException e) {
                Logger.error("Unable to read public/" + path);
            }
        }
        return TextUtils.join("\n", lines);
    }

    public static String getCordovaJS(Context context) {
        try {
            return FileUtils.readFileFromAssets(context.getAssets(), "public/cordova.js");
        } catch (IOException e) {
            Logger.error("Unable to read public/cordova.js file, Cordova plugins will not work");
            return "";
        }
    }

    public static String getCordovaPluginsFileJS(Context context) {
        try {
            return FileUtils.readFileFromAssets(context.getAssets(), "public/cordova_plugins.js");
        } catch (IOException e) {
            Logger.error("Unable to read public/cordova_plugins.js file, Cordova plugins will not work");
            return "";
        }
    }

    public static String getPluginJS(Collection<PluginHandle> plugins) {
        List<String> lines = new ArrayList<>();
        JSONArray pluginArray = new JSONArray();
        lines.add("// Begin: Capacitor Plugin JS");
        for (PluginHandle plugin : plugins) {
            lines.add("(function(w) {\nvar a = (w.Capacitor = w.Capacitor || {});\nvar p = (a.Plugins = a.Plugins || {});\nvar t = (p['" + plugin.getId() + "'] = {});\nt.addListener = function(eventName, callback) {\n  return w.Capacitor.addListener('" + plugin.getId() + "', eventName, callback);\n}");
            for (PluginMethodHandle method : plugin.getMethods()) {
                if (!method.getName().equals("addListener") && !method.getName().equals("removeListener")) {
                    lines.add(generateMethodJS(plugin, method));
                }
            }
            lines.add("})(window);\n");
            pluginArray.put(createPluginHeader(plugin));
        }
        return TextUtils.join("\n", lines) + "\nwindow.Capacitor.PluginHeaders = " + pluginArray.toString() + ";";
    }

    public static String getCordovaPluginJS(Context context) {
        return getFilesContent(context, "public/plugins");
    }

    public static String getFilesContent(Context context, String path) {
        StringBuilder builder = new StringBuilder();
        try {
            String[] content = context.getAssets().list(path);
            if (content.length <= 0) {
                return FileUtils.readFileFromAssets(context.getAssets(), path);
            }
            for (String file : content) {
                if (!file.endsWith(".map")) {
                    builder.append(getFilesContent(context, path + "/" + file));
                }
            }
            return builder.toString();
        } catch (IOException e) {
            Logger.warn("Unable to read file at path " + path);
        }
    }

    private static JSONObject createPluginHeader(PluginHandle plugin) {
        JSONObject pluginObj = new JSONObject();
        Collection<PluginMethodHandle> methods = plugin.getMethods();
        try {
            String id = plugin.getId();
            JSONArray methodArray = new JSONArray();
            pluginObj.put("name", id);
            for (PluginMethodHandle method : methods) {
                methodArray.put(createPluginMethodHeader(method));
            }
            pluginObj.put("methods", methodArray);
        } catch (JSONException e) {
        }
        return pluginObj;
    }

    private static JSONObject createPluginMethodHeader(PluginMethodHandle method) {
        JSONObject methodObj = new JSONObject();
        try {
            methodObj.put("name", method.getName());
            if (!method.getReturnType().equals(PluginMethod.RETURN_NONE)) {
                methodObj.put("rtype", method.getReturnType());
            }
        } catch (JSONException e) {
        }
        return methodObj;
    }

    public static String getBridgeJS(Context context) throws JSExportException {
        return getFilesContent(context, "native-bridge.js");
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private static java.lang.String generateMethodJS(com.getcapacitor.PluginHandle r9, com.getcapacitor.PluginMethodHandle r10) {
        /*
            java.util.ArrayList r0 = new java.util.ArrayList
            r0.<init>()
            java.util.ArrayList r1 = new java.util.ArrayList
            r1.<init>()
            java.lang.String r2 = CATCHALL_OPTIONS_PARAM
            r1.add(r2)
            java.lang.String r2 = r10.getReturnType()
            java.lang.String r3 = "callback"
            boolean r4 = r2.equals(r3)
            if (r4 == 0) goto L_0x0020
            java.lang.String r4 = CALLBACK_PARAM
            r1.add(r4)
        L_0x0020:
            java.lang.StringBuilder r4 = new java.lang.StringBuilder
            r4.<init>()
            java.lang.String r5 = "t['"
            java.lang.StringBuilder r4 = r4.append(r5)
            java.lang.String r5 = r10.getName()
            java.lang.StringBuilder r4 = r4.append(r5)
            java.lang.String r5 = "'] = function("
            java.lang.StringBuilder r4 = r4.append(r5)
            java.lang.String r5 = ", "
            java.lang.String r6 = android.text.TextUtils.join(r5, r1)
            java.lang.StringBuilder r4 = r4.append(r6)
            java.lang.String r6 = ") {"
            java.lang.StringBuilder r4 = r4.append(r6)
            java.lang.String r4 = r4.toString()
            r0.add(r4)
            int r4 = r2.hashCode()
            switch(r4) {
                case -309216997: goto L_0x006a;
                case -172220347: goto L_0x0062;
                case 3387192: goto L_0x0058;
                default: goto L_0x0057;
            }
        L_0x0057:
            goto L_0x0074
        L_0x0058:
            java.lang.String r3 = "none"
            boolean r3 = r2.equals(r3)
            if (r3 == 0) goto L_0x0057
            r3 = 0
            goto L_0x0075
        L_0x0062:
            boolean r3 = r2.equals(r3)
            if (r3 == 0) goto L_0x0057
            r3 = 2
            goto L_0x0075
        L_0x006a:
            java.lang.String r3 = "promise"
            boolean r3 = r2.equals(r3)
            if (r3 == 0) goto L_0x0057
            r3 = 1
            goto L_0x0075
        L_0x0074:
            r3 = -1
        L_0x0075:
            java.lang.String r4 = "return w.Capacitor.nativeCallback('"
            java.lang.String r6 = ")"
            java.lang.String r7 = "', "
            java.lang.String r8 = "', '"
            switch(r3) {
                case 0: goto L_0x00f4;
                case 1: goto L_0x00bf;
                case 2: goto L_0x0082;
                default: goto L_0x0080;
            }
        L_0x0080:
            goto L_0x0127
        L_0x0082:
            java.lang.StringBuilder r3 = new java.lang.StringBuilder
            r3.<init>()
            java.lang.StringBuilder r3 = r3.append(r4)
            java.lang.String r4 = r9.getId()
            java.lang.StringBuilder r3 = r3.append(r4)
            java.lang.StringBuilder r3 = r3.append(r8)
            java.lang.String r4 = r10.getName()
            java.lang.StringBuilder r3 = r3.append(r4)
            java.lang.StringBuilder r3 = r3.append(r7)
            java.lang.String r4 = CATCHALL_OPTIONS_PARAM
            java.lang.StringBuilder r3 = r3.append(r4)
            java.lang.StringBuilder r3 = r3.append(r5)
            java.lang.String r4 = CALLBACK_PARAM
            java.lang.StringBuilder r3 = r3.append(r4)
            java.lang.StringBuilder r3 = r3.append(r6)
            java.lang.String r3 = r3.toString()
            r0.add(r3)
            goto L_0x0127
        L_0x00bf:
            java.lang.StringBuilder r3 = new java.lang.StringBuilder
            r3.<init>()
            java.lang.String r4 = "return w.Capacitor.nativePromise('"
            java.lang.StringBuilder r3 = r3.append(r4)
            java.lang.String r4 = r9.getId()
            java.lang.StringBuilder r3 = r3.append(r4)
            java.lang.StringBuilder r3 = r3.append(r8)
            java.lang.String r4 = r10.getName()
            java.lang.StringBuilder r3 = r3.append(r4)
            java.lang.StringBuilder r3 = r3.append(r7)
            java.lang.String r4 = CATCHALL_OPTIONS_PARAM
            java.lang.StringBuilder r3 = r3.append(r4)
            java.lang.StringBuilder r3 = r3.append(r6)
            java.lang.String r3 = r3.toString()
            r0.add(r3)
            goto L_0x0127
        L_0x00f4:
            java.lang.StringBuilder r3 = new java.lang.StringBuilder
            r3.<init>()
            java.lang.StringBuilder r3 = r3.append(r4)
            java.lang.String r4 = r9.getId()
            java.lang.StringBuilder r3 = r3.append(r4)
            java.lang.StringBuilder r3 = r3.append(r8)
            java.lang.String r4 = r10.getName()
            java.lang.StringBuilder r3 = r3.append(r4)
            java.lang.StringBuilder r3 = r3.append(r7)
            java.lang.String r4 = CATCHALL_OPTIONS_PARAM
            java.lang.StringBuilder r3 = r3.append(r4)
            java.lang.StringBuilder r3 = r3.append(r6)
            java.lang.String r3 = r3.toString()
            r0.add(r3)
        L_0x0127:
            java.lang.String r3 = "}"
            r0.add(r3)
            java.lang.String r3 = "\n"
            java.lang.String r3 = android.text.TextUtils.join(r3, r0)
            return r3
        */
        throw new UnsupportedOperationException("Method not decompiled: com.getcapacitor.JSExport.generateMethodJS(com.getcapacitor.PluginHandle, com.getcapacitor.PluginMethodHandle):java.lang.String");
    }
}
