package org.apache.cordova;

public class ResumeCallback extends CallbackContext {
    private final String TAG = "CordovaResumeCallback";
    private PluginManager pluginManager;
    private String serviceName;

    public ResumeCallback(String serviceName2, PluginManager pluginManager2) {
        super("resumecallback", (CordovaWebView) null);
        this.serviceName = serviceName2;
        this.pluginManager = pluginManager2;
    }

    /* JADX WARNING: Code restructure failed: missing block: B:11:?, code lost:
        r1.put("pluginServiceName", r7.serviceName);
        r1.put("pluginStatus", org.apache.cordova.PluginResult.StatusMessages[r8.getStatus()]);
        r0.put("action", "resume");
        r0.put("pendingResult", r1);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:13:0x0059, code lost:
        org.apache.cordova.LOG.e("CordovaResumeCallback", "Unable to create resume object for Activity Result");
     */
    /* JADX WARNING: Code restructure failed: missing block: B:9:0x002d, code lost:
        r0 = new org.json.JSONObject();
        r1 = new org.json.JSONObject();
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public void sendPluginResult(org.apache.cordova.PluginResult r8) {
        /*
            r7 = this;
            monitor-enter(r7)
            boolean r0 = r7.finished     // Catch:{ all -> 0x0087 }
            if (r0 == 0) goto L_0x0029
            java.lang.String r0 = "CordovaResumeCallback"
            java.lang.StringBuilder r1 = new java.lang.StringBuilder     // Catch:{ all -> 0x0087 }
            r1.<init>()     // Catch:{ all -> 0x0087 }
            java.lang.String r2 = r7.serviceName     // Catch:{ all -> 0x0087 }
            java.lang.StringBuilder r1 = r1.append(r2)     // Catch:{ all -> 0x0087 }
            java.lang.String r2 = " attempted to send a second callback to ResumeCallback\nResult was: "
            java.lang.StringBuilder r1 = r1.append(r2)     // Catch:{ all -> 0x0087 }
            java.lang.String r2 = r8.getMessage()     // Catch:{ all -> 0x0087 }
            java.lang.StringBuilder r1 = r1.append(r2)     // Catch:{ all -> 0x0087 }
            java.lang.String r1 = r1.toString()     // Catch:{ all -> 0x0087 }
            org.apache.cordova.LOG.w((java.lang.String) r0, (java.lang.String) r1)     // Catch:{ all -> 0x0087 }
            monitor-exit(r7)     // Catch:{ all -> 0x0087 }
            return
        L_0x0029:
            r0 = 1
            r7.finished = r0     // Catch:{ all -> 0x0087 }
            monitor-exit(r7)     // Catch:{ all -> 0x0087 }
            org.json.JSONObject r0 = new org.json.JSONObject
            r0.<init>()
            org.json.JSONObject r1 = new org.json.JSONObject
            r1.<init>()
            java.lang.String r2 = "pluginServiceName"
            java.lang.String r3 = r7.serviceName     // Catch:{ JSONException -> 0x0058 }
            r1.put(r2, r3)     // Catch:{ JSONException -> 0x0058 }
            java.lang.String r2 = "pluginStatus"
            java.lang.String[] r3 = org.apache.cordova.PluginResult.StatusMessages     // Catch:{ JSONException -> 0x0058 }
            int r4 = r8.getStatus()     // Catch:{ JSONException -> 0x0058 }
            r3 = r3[r4]     // Catch:{ JSONException -> 0x0058 }
            r1.put(r2, r3)     // Catch:{ JSONException -> 0x0058 }
            java.lang.String r2 = "action"
            java.lang.String r3 = "resume"
            r0.put(r2, r3)     // Catch:{ JSONException -> 0x0058 }
            java.lang.String r2 = "pendingResult"
            r0.put(r2, r1)     // Catch:{ JSONException -> 0x0058 }
            goto L_0x0060
        L_0x0058:
            r2 = move-exception
            java.lang.String r3 = "CordovaResumeCallback"
            java.lang.String r4 = "Unable to create resume object for Activity Result"
            org.apache.cordova.LOG.e(r3, r4)
        L_0x0060:
            org.apache.cordova.PluginResult r2 = new org.apache.cordova.PluginResult
            org.apache.cordova.PluginResult$Status r3 = org.apache.cordova.PluginResult.Status.OK
            r2.<init>((org.apache.cordova.PluginResult.Status) r3, (org.json.JSONObject) r0)
            java.util.ArrayList r3 = new java.util.ArrayList
            r3.<init>()
            r3.add(r2)
            r3.add(r8)
            org.apache.cordova.PluginManager r4 = r7.pluginManager
            java.lang.String r5 = "CoreAndroid"
            org.apache.cordova.CordovaPlugin r4 = r4.getPlugin(r5)
            org.apache.cordova.CoreAndroid r4 = (org.apache.cordova.CoreAndroid) r4
            org.apache.cordova.PluginResult r5 = new org.apache.cordova.PluginResult
            org.apache.cordova.PluginResult$Status r6 = org.apache.cordova.PluginResult.Status.OK
            r5.<init>((org.apache.cordova.PluginResult.Status) r6, (java.util.List<org.apache.cordova.PluginResult>) r3)
            r4.sendResumeEvent(r5)
            return
        L_0x0087:
            r0 = move-exception
            monitor-exit(r7)     // Catch:{ all -> 0x0087 }
            throw r0
        */
        throw new UnsupportedOperationException("Method not decompiled: org.apache.cordova.ResumeCallback.sendPluginResult(org.apache.cordova.PluginResult):void");
    }
}
