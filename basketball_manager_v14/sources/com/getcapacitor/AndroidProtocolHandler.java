package com.getcapacitor;

import android.content.Context;
import android.net.Uri;
import android.util.TypedValue;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class AndroidProtocolHandler {
    static final /* synthetic */ boolean $assertionsDisabled = false;
    private Context context;

    public AndroidProtocolHandler(Context context2) {
        this.context = context2;
    }

    public InputStream openAsset(String path) throws IOException {
        return this.context.getAssets().open(path, 2);
    }

    public InputStream openResource(Uri uri) {
        if (uri.getPath() != null) {
            List<String> pathSegments = uri.getPathSegments();
            String assetType = pathSegments.get(pathSegments.size() - 2);
            String assetName = pathSegments.get(pathSegments.size() - 1).split("\\.")[0];
            try {
                if (this.context.getApplicationContext() != null) {
                    this.context = this.context.getApplicationContext();
                }
                int fieldId = getFieldId(this.context, assetType, assetName);
                if (getValueType(this.context, fieldId) == 3) {
                    return this.context.getResources().openRawResource(fieldId);
                }
                Logger.error("Asset not of type string: " + uri);
                return null;
            } catch (ClassNotFoundException | IllegalAccessException | NoSuchFieldException e) {
                Logger.error("Unable to open resource URL: " + uri, e);
                return null;
            }
        } else {
            throw new AssertionError();
        }
    }

    private static int getFieldId(Context context2, String assetType, String assetName) throws ClassNotFoundException, NoSuchFieldException, IllegalAccessException {
        return context2.getClassLoader().loadClass(context2.getPackageName() + ".R$" + assetType).getField(assetName).getInt((Object) null);
    }

    public InputStream openFile(String filePath) throws IOException {
        return new FileInputStream(new File(filePath.replace(Bridge.CAPACITOR_FILE_START, "")));
    }

    public InputStream openContentUrl(Uri uri) throws IOException {
        Integer port = Integer.valueOf(uri.getPort());
        String baseUrl = uri.getScheme() + "://" + uri.getHost();
        if (port.intValue() != -1) {
            baseUrl = baseUrl + ":" + port;
        }
        try {
            return this.context.getContentResolver().openInputStream(Uri.parse(uri.toString().replace(baseUrl + Bridge.CAPACITOR_CONTENT_START, "content:/")));
        } catch (SecurityException e) {
            Logger.error("Unable to open content URL: " + uri, e);
            return null;
        }
    }

    private static int getValueType(Context context2, int fieldId) {
        TypedValue value = new TypedValue();
        context2.getResources().getValue(fieldId, value, true);
        return value.type;
    }
}
