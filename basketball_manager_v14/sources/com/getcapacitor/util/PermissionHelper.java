package com.getcapacitor.util;

import android.content.Context;
import android.content.pm.PackageInfo;
import androidx.core.app.ActivityCompat;
import java.util.ArrayList;
import java.util.Arrays;

public class PermissionHelper {
    public static boolean hasPermissions(Context context, String[] permissions) {
        for (String perm : permissions) {
            if (ActivityCompat.checkSelfPermission(context, perm) != 0) {
                return false;
            }
        }
        return true;
    }

    public static boolean hasDefinedPermission(Context context, String permission) {
        String[] requestedPermissions = getManifestPermissions(context);
        if (requestedPermissions == null || requestedPermissions.length <= 0 || !new ArrayList<>(Arrays.asList(requestedPermissions)).contains(permission)) {
            return false;
        }
        return true;
    }

    public static boolean hasDefinedPermissions(Context context, String[] permissions) {
        for (String permission : permissions) {
            if (!hasDefinedPermission(context, permission)) {
                return false;
            }
        }
        return true;
    }

    public static String[] getManifestPermissions(Context context) {
        try {
            PackageInfo packageInfo = InternalUtils.getPackageInfo(context.getPackageManager(), context.getPackageName(), 4096);
            if (packageInfo != null) {
                return packageInfo.requestedPermissions;
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    public static String[] getUndefinedPermissions(Context context, String[] neededPermissions) {
        ArrayList<String> undefinedPermissions = new ArrayList<>();
        String[] requestedPermissions = getManifestPermissions(context);
        if (requestedPermissions == null || requestedPermissions.length <= 0) {
            return neededPermissions;
        }
        ArrayList<String> requestedPermissionsArrayList = new ArrayList<>(Arrays.asList(requestedPermissions));
        for (String permission : neededPermissions) {
            if (!requestedPermissionsArrayList.contains(permission)) {
                undefinedPermissions.add(permission);
            }
        }
        return (String[]) undefinedPermissions.toArray(new String[undefinedPermissions.size()]);
    }
}
