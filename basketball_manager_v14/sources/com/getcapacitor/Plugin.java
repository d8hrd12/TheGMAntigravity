package com.getcapacitor;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import com.getcapacitor.util.PermissionHelper;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import org.json.JSONException;

public class Plugin {
    private static final String BUNDLE_PERSISTED_OPTIONS_JSON_KEY = "_json";
    private final Map<String, ActivityResultLauncher<Intent>> activityLaunchers = new HashMap();
    /* access modifiers changed from: protected */
    public Bridge bridge;
    private final Map<String, List<PluginCall>> eventListeners = new HashMap();
    protected PluginHandle handle;
    private String lastPluginCallId;
    private final Map<String, ActivityResultLauncher<String[]>> permissionLaunchers = new HashMap();
    private final Map<String, List<JSObject>> retainedEventArguments = new HashMap();
    @Deprecated
    protected PluginCall savedLastCall;

    public void load() {
    }

    /* access modifiers changed from: package-private */
    public void initializeActivityLaunchers() {
        List<Method> pluginClassMethods = new ArrayList<>();
        for (Class cls = getClass(); !cls.getName().equals(Object.class.getName()); cls = cls.getSuperclass()) {
            pluginClassMethods.addAll(Arrays.asList(cls.getDeclaredMethods()));
        }
        for (Method method : pluginClassMethods) {
            if (method.isAnnotationPresent(ActivityCallback.class)) {
                this.activityLaunchers.put(method.getName(), this.bridge.registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new Plugin$$ExternalSyntheticLambda0(this, method)));
            } else if (method.isAnnotationPresent(PermissionCallback.class)) {
                this.permissionLaunchers.put(method.getName(), this.bridge.registerForActivityResult(new ActivityResultContracts.RequestMultiplePermissions(), new Plugin$$ExternalSyntheticLambda1(this, method)));
            }
        }
    }

    /* access modifiers changed from: private */
    /* renamed from: triggerPermissionCallback */
    public void lambda$initializeActivityLaunchers$1(Method method, Map<String, Boolean> permissionResultMap) {
        PluginCall savedCall = this.bridge.getPermissionCall(this.handle.getId());
        if (this.bridge.validatePermissions(this, savedCall, permissionResultMap)) {
            try {
                method.setAccessible(true);
                method.invoke(this, new Object[]{savedCall});
            } catch (IllegalAccessException | InvocationTargetException e) {
                e.printStackTrace();
            }
        }
    }

    /* access modifiers changed from: private */
    /* renamed from: triggerActivityCallback */
    public void lambda$initializeActivityLaunchers$0(Method method, ActivityResult result) {
        PluginCall savedCall = this.bridge.getSavedCall(this.lastPluginCallId);
        if (savedCall == null) {
            savedCall = this.bridge.getPluginCallForLastActivity();
        }
        try {
            method.setAccessible(true);
            method.invoke(this, new Object[]{savedCall, result});
        } catch (IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }
    }

    public void startActivityForResult(PluginCall call, Intent intent, String callbackName) {
        ActivityResultLauncher<Intent> activityResultLauncher = getActivityLauncherOrReject(call, callbackName);
        if (activityResultLauncher != null) {
            this.bridge.setPluginCallForLastActivity(call);
            this.lastPluginCallId = call.getCallbackId();
            this.bridge.saveCall(call);
            activityResultLauncher.launch(intent);
        }
    }

    private void permissionActivityResult(PluginCall call, String[] permissionStrings, String callbackName) {
        ActivityResultLauncher<String[]> permissionResultLauncher = getPermissionLauncherOrReject(call, callbackName);
        if (permissionResultLauncher != null) {
            this.bridge.savePermissionCall(call);
            permissionResultLauncher.launch(permissionStrings);
        }
    }

    public Context getContext() {
        return this.bridge.getContext();
    }

    public AppCompatActivity getActivity() {
        return this.bridge.getActivity();
    }

    public void setBridge(Bridge bridge2) {
        this.bridge = bridge2;
    }

    public Bridge getBridge() {
        return this.bridge;
    }

    public void setPluginHandle(PluginHandle pluginHandle) {
        this.handle = pluginHandle;
    }

    public PluginHandle getPluginHandle() {
        return this.handle;
    }

    public String getAppId() {
        return getContext().getPackageName();
    }

    @Deprecated
    public void saveCall(PluginCall lastCall) {
        this.savedLastCall = lastCall;
    }

    @Deprecated
    public void freeSavedCall() {
        this.savedLastCall.release(this.bridge);
        this.savedLastCall = null;
    }

    @Deprecated
    public PluginCall getSavedCall() {
        return this.savedLastCall;
    }

    public PluginConfig getConfig() {
        return this.bridge.getConfig().getPluginConfiguration(this.handle.getId());
    }

    @Deprecated
    public Object getConfigValue(String key) {
        try {
            return getConfig().getConfigJSON().get(key);
        } catch (JSONException e) {
            return null;
        }
    }

    @Deprecated
    public boolean hasDefinedPermissions(String[] permissions) {
        for (String permission : permissions) {
            if (!PermissionHelper.hasDefinedPermission(getContext(), permission)) {
                return false;
            }
        }
        return true;
    }

    @Deprecated
    public boolean hasDefinedRequiredPermissions() {
        CapacitorPlugin annotation = this.handle.getPluginAnnotation();
        if (annotation == null) {
            return hasDefinedPermissions(this.handle.getLegacyPluginAnnotation().permissions());
        }
        for (Permission perm : annotation.permissions()) {
            for (String permString : perm.strings()) {
                if (!PermissionHelper.hasDefinedPermission(getContext(), permString)) {
                    return false;
                }
            }
        }
        return true;
    }

    public boolean isPermissionDeclared(String alias) {
        CapacitorPlugin annotation = this.handle.getPluginAnnotation();
        if (annotation != null) {
            for (Permission perm : annotation.permissions()) {
                if (alias.equalsIgnoreCase(perm.alias())) {
                    boolean result = true;
                    for (String permString : perm.strings()) {
                        result = result && PermissionHelper.hasDefinedPermission(getContext(), permString);
                    }
                    return result;
                }
            }
        }
        Logger.error(String.format("isPermissionDeclared: No alias defined for %s or missing @CapacitorPlugin annotation.", new Object[]{alias}));
        return false;
    }

    @Deprecated
    public boolean hasPermission(String permission) {
        return ActivityCompat.checkSelfPermission(getContext(), permission) == 0;
    }

    @Deprecated
    public boolean hasRequiredPermissions() {
        CapacitorPlugin annotation = this.handle.getPluginAnnotation();
        if (annotation == null) {
            for (String perm : this.handle.getLegacyPluginAnnotation().permissions()) {
                if (ActivityCompat.checkSelfPermission(getContext(), perm) != 0) {
                    return false;
                }
            }
            return true;
        }
        for (Permission perm2 : annotation.permissions()) {
            for (String permString : perm2.strings()) {
                if (ActivityCompat.checkSelfPermission(getContext(), permString) != 0) {
                    return false;
                }
            }
        }
        return true;
    }

    /* access modifiers changed from: protected */
    public void requestAllPermissions(PluginCall call, String callbackName) {
        CapacitorPlugin annotation = this.handle.getPluginAnnotation();
        if (annotation != null) {
            HashSet<String> perms = new HashSet<>();
            for (Permission perm : annotation.permissions()) {
                perms.addAll(Arrays.asList(perm.strings()));
            }
            permissionActivityResult(call, (String[]) perms.toArray(new String[0]), callbackName);
        }
    }

    /* access modifiers changed from: protected */
    public void requestPermissionForAlias(String alias, PluginCall call, String callbackName) {
        requestPermissionForAliases(new String[]{alias}, call, callbackName);
    }

    /* access modifiers changed from: protected */
    public void requestPermissionForAliases(String[] aliases, PluginCall call, String callbackName) {
        if (aliases.length == 0) {
            Logger.error("No permission alias was provided");
            return;
        }
        String[] permissions = getPermissionStringsForAliases(aliases);
        if (permissions.length > 0) {
            permissionActivityResult(call, permissions, callbackName);
        }
    }

    private String[] getPermissionStringsForAliases(String[] aliases) {
        CapacitorPlugin annotation = this.handle.getPluginAnnotation();
        HashSet<String> perms = new HashSet<>();
        for (Permission perm : annotation.permissions()) {
            if (Arrays.asList(aliases).contains(perm.alias())) {
                perms.addAll(Arrays.asList(perm.strings()));
            }
        }
        return (String[]) perms.toArray(new String[0]);
    }

    private ActivityResultLauncher<Intent> getActivityLauncherOrReject(PluginCall call, String methodName) {
        ActivityResultLauncher<Intent> activityLauncher = this.activityLaunchers.get(methodName);
        if (activityLauncher != null) {
            return activityLauncher;
        }
        String registerError = String.format(Locale.US, "There is no ActivityCallback method registered for the name: %s. Please define a callback method annotated with @ActivityCallback that receives arguments: (PluginCall, ActivityResult)", new Object[]{methodName});
        Logger.error(registerError);
        call.reject(registerError);
        return null;
    }

    private ActivityResultLauncher<String[]> getPermissionLauncherOrReject(PluginCall call, String methodName) {
        ActivityResultLauncher<String[]> permissionLauncher = this.permissionLaunchers.get(methodName);
        if (permissionLauncher != null) {
            return permissionLauncher;
        }
        String registerError = String.format(Locale.US, "There is no PermissionCallback method registered for the name: %s. Please define a callback method annotated with @PermissionCallback that receives arguments: (PluginCall)", new Object[]{methodName});
        Logger.error(registerError);
        call.reject(registerError);
        return null;
    }

    @Deprecated
    public void pluginRequestAllPermissions() {
        NativePlugin legacyAnnotation = this.handle.getLegacyPluginAnnotation();
        ActivityCompat.requestPermissions(getActivity(), legacyAnnotation.permissions(), legacyAnnotation.permissionRequestCode());
    }

    @Deprecated
    public void pluginRequestPermission(String permission, int requestCode) {
        ActivityCompat.requestPermissions(getActivity(), new String[]{permission}, requestCode);
    }

    @Deprecated
    public void pluginRequestPermissions(String[] permissions, int requestCode) {
        ActivityCompat.requestPermissions(getActivity(), permissions, requestCode);
    }

    public PermissionState getPermissionState(String alias) {
        return getPermissionStates().get(alias);
    }

    public Map<String, PermissionState> getPermissionStates() {
        return this.bridge.getPermissionStates(this);
    }

    private void addEventListener(String eventName, PluginCall call) {
        List<PluginCall> listeners = this.eventListeners.get(eventName);
        if (listeners == null || listeners.isEmpty()) {
            List<PluginCall> listeners2 = new ArrayList<>();
            this.eventListeners.put(eventName, listeners2);
            listeners2.add(call);
            sendRetainedArgumentsForEvent(eventName);
            return;
        }
        listeners.add(call);
    }

    private void removeEventListener(String eventName, PluginCall call) {
        List<PluginCall> listeners = this.eventListeners.get(eventName);
        if (listeners != null) {
            listeners.remove(call);
        }
    }

    /* access modifiers changed from: protected */
    public void notifyListeners(String eventName, JSObject data, boolean retainUntilConsumed) {
        Logger.verbose(getLogTag(), "Notifying listeners for event " + eventName);
        List<PluginCall> listeners = this.eventListeners.get(eventName);
        if (listeners == null || listeners.isEmpty()) {
            Logger.debug(getLogTag(), "No listeners found for event " + eventName);
            if (retainUntilConsumed) {
                List<JSObject> argList = this.retainedEventArguments.get(eventName);
                if (argList == null) {
                    argList = new ArrayList<>();
                }
                argList.add(data);
                this.retainedEventArguments.put(eventName, argList);
                return;
            }
            return;
        }
        Iterator<PluginCall> it = new CopyOnWriteArrayList<>(listeners).iterator();
        while (it.hasNext()) {
            it.next().resolve(data);
        }
    }

    /* access modifiers changed from: protected */
    public void notifyListeners(String eventName, JSObject data) {
        notifyListeners(eventName, data, false);
    }

    /* access modifiers changed from: protected */
    public boolean hasListeners(String eventName) {
        List<PluginCall> listeners = this.eventListeners.get(eventName);
        if (listeners == null) {
            return false;
        }
        return !listeners.isEmpty();
    }

    private void sendRetainedArgumentsForEvent(String eventName) {
        List<JSObject> retainedArgs = this.retainedEventArguments.get(eventName);
        if (retainedArgs != null) {
            this.retainedEventArguments.remove(eventName);
            for (JSObject retained : retainedArgs) {
                notifyListeners(eventName, retained);
            }
        }
    }

    @PluginMethod(returnType = "none")
    public void addListener(PluginCall call) {
        String eventName = call.getString("eventName");
        call.setKeepAlive(true);
        addEventListener(eventName, call);
    }

    @PluginMethod(returnType = "none")
    public void removeListener(PluginCall call) {
        String eventName = call.getString("eventName");
        PluginCall savedCall = this.bridge.getSavedCall(call.getString("callbackId"));
        if (savedCall != null) {
            removeEventListener(eventName, savedCall);
            this.bridge.releaseCall(savedCall);
        }
    }

    @PluginMethod(returnType = "promise")
    public void removeAllListeners(PluginCall call) {
        this.eventListeners.clear();
        call.resolve();
    }

    public void removeAllListeners() {
        this.eventListeners.clear();
    }

    @PluginMethod
    @PermissionCallback
    public void checkPermissions(PluginCall pluginCall) {
        Map<String, PermissionState> permissionsResult = getPermissionStates();
        if (permissionsResult.size() == 0) {
            pluginCall.resolve();
            return;
        }
        JSObject permissionsResultJSON = new JSObject();
        for (Map.Entry<String, PermissionState> entry : permissionsResult.entrySet()) {
            permissionsResultJSON.put(entry.getKey(), (Object) entry.getValue());
        }
        pluginCall.resolve(permissionsResultJSON);
    }

    /* JADX WARNING: type inference failed for: r6v6, types: [java.lang.Object[]] */
    /* JADX WARNING: type inference failed for: r6v8, types: [java.lang.Object[]] */
    /* JADX WARNING: Multi-variable type inference failed */
    @com.getcapacitor.PluginMethod
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public void requestPermissions(com.getcapacitor.PluginCall r14) {
        /*
            r13 = this;
            com.getcapacitor.PluginHandle r0 = r13.handle
            com.getcapacitor.annotation.CapacitorPlugin r0 = r0.getPluginAnnotation()
            if (r0 != 0) goto L_0x000d
            r13.handleLegacyPermission(r14)
            goto L_0x00e8
        L_0x000d:
            r1 = 0
            java.util.HashSet r2 = new java.util.HashSet
            r2.<init>()
            java.lang.String r3 = "permissions"
            com.getcapacitor.JSArray r3 = r14.getArray(r3)
            r4 = 0
            if (r3 == 0) goto L_0x0023
            java.util.List r5 = r3.toList()     // Catch:{ JSONException -> 0x0022 }
            r4 = r5
            goto L_0x0023
        L_0x0022:
            r5 = move-exception
        L_0x0023:
            java.util.HashSet r5 = new java.util.HashSet
            r5.<init>()
            r6 = 0
            if (r4 == 0) goto L_0x0066
            boolean r7 = r4.isEmpty()
            if (r7 == 0) goto L_0x0032
            goto L_0x0066
        L_0x0032:
            com.getcapacitor.annotation.Permission[] r7 = r0.permissions()
            int r8 = r7.length
            r9 = r6
        L_0x0038:
            if (r9 >= r8) goto L_0x0050
            r10 = r7[r9]
            java.lang.String r11 = r10.alias()
            boolean r11 = r4.contains(r11)
            if (r11 == 0) goto L_0x004d
            java.lang.String r11 = r10.alias()
            r5.add(r11)
        L_0x004d:
            int r9 = r9 + 1
            goto L_0x0038
        L_0x0050:
            boolean r7 = r5.isEmpty()
            if (r7 == 0) goto L_0x005c
            java.lang.String r6 = "No valid permission alias was requested of this plugin."
            r14.reject(r6)
            goto L_0x00b1
        L_0x005c:
            java.lang.String[] r6 = new java.lang.String[r6]
            java.lang.Object[] r6 = r5.toArray(r6)
            r1 = r6
            java.lang.String[] r1 = (java.lang.String[]) r1
            goto L_0x00b1
        L_0x0066:
            com.getcapacitor.annotation.Permission[] r7 = r0.permissions()
            int r8 = r7.length
            r9 = r6
        L_0x006c:
            if (r9 >= r8) goto L_0x00a8
            r10 = r7[r9]
            java.lang.String[] r11 = r10.strings()
            int r11 = r11.length
            if (r11 == 0) goto L_0x0094
            java.lang.String[] r11 = r10.strings()
            int r11 = r11.length
            r12 = 1
            if (r11 != r12) goto L_0x008c
            java.lang.String[] r11 = r10.strings()
            r11 = r11[r6]
            boolean r11 = r11.isEmpty()
            if (r11 == 0) goto L_0x008c
            goto L_0x0094
        L_0x008c:
            java.lang.String r11 = r10.alias()
            r5.add(r11)
            goto L_0x00a5
        L_0x0094:
            java.lang.String r11 = r10.alias()
            boolean r11 = r11.isEmpty()
            if (r11 != 0) goto L_0x00a5
            java.lang.String r11 = r10.alias()
            r2.add(r11)
        L_0x00a5:
            int r9 = r9 + 1
            goto L_0x006c
        L_0x00a8:
            java.lang.String[] r6 = new java.lang.String[r6]
            java.lang.Object[] r6 = r5.toArray(r6)
            r1 = r6
            java.lang.String[] r1 = (java.lang.String[]) r1
        L_0x00b1:
            if (r1 == 0) goto L_0x00bc
            int r6 = r1.length
            if (r6 <= 0) goto L_0x00bc
            java.lang.String r6 = "checkPermissions"
            r13.requestPermissionForAliases(r1, r14, r6)
            goto L_0x00e8
        L_0x00bc:
            boolean r6 = r2.isEmpty()
            if (r6 != 0) goto L_0x00e5
            com.getcapacitor.JSObject r6 = new com.getcapacitor.JSObject
            r6.<init>()
            java.util.Iterator r7 = r2.iterator()
        L_0x00cb:
            boolean r8 = r7.hasNext()
            if (r8 == 0) goto L_0x00e1
            java.lang.Object r8 = r7.next()
            java.lang.String r8 = (java.lang.String) r8
            com.getcapacitor.PermissionState r9 = com.getcapacitor.PermissionState.GRANTED
            java.lang.String r9 = r9.toString()
            r6.put((java.lang.String) r8, (java.lang.String) r9)
            goto L_0x00cb
        L_0x00e1:
            r14.resolve(r6)
            goto L_0x00e8
        L_0x00e5:
            r14.resolve()
        L_0x00e8:
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: com.getcapacitor.Plugin.requestPermissions(com.getcapacitor.PluginCall):void");
    }

    private void handleLegacyPermission(PluginCall call) {
        NativePlugin legacyAnnotation = this.handle.getLegacyPluginAnnotation();
        String[] perms = legacyAnnotation.permissions();
        if (perms.length > 0) {
            saveCall(call);
            pluginRequestPermissions(perms, legacyAnnotation.permissionRequestCode());
            return;
        }
        call.resolve();
    }

    /* access modifiers changed from: protected */
    @Deprecated
    public void handleRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (!hasDefinedPermissions(permissions)) {
            StringBuilder builder = new StringBuilder();
            builder.append("Missing the following permissions in AndroidManifest.xml:\n");
            String[] missing = PermissionHelper.getUndefinedPermissions(getContext(), permissions);
            int length = missing.length;
            for (int i = 0; i < length; i++) {
                builder.append(missing[i] + "\n");
            }
            this.savedLastCall.reject(builder.toString());
            this.savedLastCall = null;
        }
    }

    /* access modifiers changed from: protected */
    public Bundle saveInstanceState() {
        PluginCall savedCall = this.bridge.getSavedCall(this.lastPluginCallId);
        if (savedCall == null) {
            return null;
        }
        Bundle ret = new Bundle();
        JSObject callData = savedCall.getData();
        if (callData != null) {
            ret.putString(BUNDLE_PERSISTED_OPTIONS_JSON_KEY, callData.toString());
        }
        return ret;
    }

    /* access modifiers changed from: protected */
    public void restoreState(Bundle state) {
    }

    /* access modifiers changed from: protected */
    @Deprecated
    public void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
    }

    /* access modifiers changed from: protected */
    public void handleOnNewIntent(Intent intent) {
    }

    /* access modifiers changed from: protected */
    public void handleOnConfigurationChanged(Configuration newConfig) {
    }

    /* access modifiers changed from: protected */
    public void handleOnStart() {
    }

    /* access modifiers changed from: protected */
    public void handleOnRestart() {
    }

    /* access modifiers changed from: protected */
    public void handleOnResume() {
    }

    /* access modifiers changed from: protected */
    public void handleOnPause() {
    }

    /* access modifiers changed from: protected */
    public void handleOnStop() {
    }

    /* access modifiers changed from: protected */
    public void handleOnDestroy() {
    }

    public Boolean shouldOverrideLoad(Uri url) {
        return null;
    }

    /* access modifiers changed from: protected */
    @Deprecated
    public void startActivityForResult(PluginCall call, Intent intent, int resultCode) {
        this.bridge.startActivityForPluginWithResult(call, intent, resultCode);
    }

    public void execute(Runnable runnable) {
        this.bridge.execute(runnable);
    }

    /* access modifiers changed from: protected */
    public String getLogTag(String... subTags) {
        return Logger.tags(subTags);
    }

    /* access modifiers changed from: protected */
    public String getLogTag() {
        return Logger.tags(getClass().getSimpleName());
    }
}
