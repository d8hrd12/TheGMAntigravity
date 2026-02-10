package com.getcapacitor;

import android.content.ContentUris;
import android.content.Context;
import android.content.res.AssetManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class FileUtils {
    private static String CapacitorFileScheme = Bridge.CAPACITOR_FILE_START;

    public enum Type {
        IMAGE("image");
        
        private String type;

        private Type(String type2) {
            this.type = type2;
        }
    }

    public static String getPortablePath(Context c, String host, Uri u) {
        String path = getFileUrlForUri(c, u);
        if (path.startsWith("file://")) {
            path = path.replace("file://", "");
        }
        return host + Bridge.CAPACITOR_FILE_START + path;
    }

    public static String getFileUrlForUri(Context context, Uri uri) {
        if (DocumentsContract.isDocumentUri(context, uri)) {
            if (isExternalStorageDocument(uri)) {
                String docId = DocumentsContract.getDocumentId(uri);
                String[] split = docId.split(":");
                if ("primary".equalsIgnoreCase(split[0])) {
                    return legacyPrimaryPath(split[1]);
                }
                int splitIndex = docId.indexOf(58, 1);
                String tag = docId.substring(0, splitIndex);
                String path = docId.substring(splitIndex + 1);
                String nonPrimaryVolume = getPathToNonPrimaryVolume(context, tag);
                if (nonPrimaryVolume != null) {
                    String result = nonPrimaryVolume + "/" + path;
                    File file = new File(result);
                    if (!file.exists() || !file.canRead()) {
                        return null;
                    }
                    return result;
                }
            } else if (isDownloadsDocument(uri)) {
                return getDataColumn(context, ContentUris.withAppendedId(Uri.parse("content://downloads/public_downloads"), Long.valueOf(DocumentsContract.getDocumentId(uri)).longValue()), (String) null, (String[]) null);
            } else if (isMediaDocument(uri)) {
                String[] split2 = DocumentsContract.getDocumentId(uri).split(":");
                String type = split2[0];
                Uri contentUri = null;
                if ("image".equals(type)) {
                    contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                } else if ("video".equals(type)) {
                    contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                } else if ("audio".equals(type)) {
                    contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                }
                return getDataColumn(context, contentUri, "_id=?", new String[]{split2[1]});
            }
        } else if ("content".equalsIgnoreCase(uri.getScheme())) {
            if (isGooglePhotosUri(uri)) {
                return uri.getLastPathSegment();
            }
            return getDataColumn(context, uri, (String) null, (String[]) null);
        } else if ("file".equalsIgnoreCase(uri.getScheme())) {
            return uri.getPath();
        }
        return null;
    }

    private static String legacyPrimaryPath(String pathPart) {
        return Environment.getExternalStorageDirectory() + "/" + pathPart;
    }

    static String readFileFromAssets(AssetManager assetManager, String fileName) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(assetManager.open(fileName)));
        try {
            StringBuilder buffer = new StringBuilder();
            while (true) {
                String readLine = reader.readLine();
                String line = readLine;
                if (readLine != null) {
                    buffer.append(line).append("\n");
                } else {
                    String sb = buffer.toString();
                    reader.close();
                    return sb;
                }
            }
        } catch (Throwable th) {
            th.addSuppressed(th);
        }
        throw th;
    }

    static String readFileFromDisk(File file) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(file));
        try {
            StringBuilder buffer = new StringBuilder();
            while (true) {
                String readLine = reader.readLine();
                String line = readLine;
                if (readLine != null) {
                    buffer.append(line).append("\n");
                } else {
                    String sb = buffer.toString();
                    reader.close();
                    return sb;
                }
            }
        } catch (Throwable th) {
            th.addSuppressed(th);
        }
        throw th;
    }

    /* JADX WARNING: Removed duplicated region for block: B:28:0x004f  */
    /* JADX WARNING: Removed duplicated region for block: B:31:0x0055  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private static java.lang.String getDataColumn(android.content.Context r12, android.net.Uri r13, java.lang.String r14, java.lang.String[] r15) {
        /*
            r1 = 0
            r2 = 0
            java.lang.String r3 = "_data"
            r0 = 1
            java.lang.String[] r0 = new java.lang.String[r0]
            r4 = 0
            java.lang.String r5 = "_data"
            r0[r4] = r5
            r8 = r0
            android.content.ContentResolver r6 = r12.getContentResolver()     // Catch:{ IllegalArgumentException -> 0x0044, all -> 0x003e }
            r11 = 0
            r7 = r13
            r9 = r14
            r10 = r15
            android.database.Cursor r13 = r6.query(r7, r8, r9, r10, r11)     // Catch:{ IllegalArgumentException -> 0x003b }
            r2 = r13
            if (r2 == 0) goto L_0x002b
            boolean r13 = r2.moveToFirst()     // Catch:{ IllegalArgumentException -> 0x003b }
            if (r13 == 0) goto L_0x002b
            int r13 = r2.getColumnIndexOrThrow(r5)     // Catch:{ IllegalArgumentException -> 0x003b }
            java.lang.String r14 = r2.getString(r13)     // Catch:{ IllegalArgumentException -> 0x003b }
            r1 = r14
        L_0x002b:
            if (r2 == 0) goto L_0x0030
            r2.close()
        L_0x0030:
            if (r1 != 0) goto L_0x0037
            java.lang.String r13 = getCopyFilePath(r7, r12)
            return r13
        L_0x0037:
            return r1
        L_0x0038:
            r0 = move-exception
            r13 = r0
            goto L_0x0053
        L_0x003b:
            r0 = move-exception
            r13 = r0
            goto L_0x0049
        L_0x003e:
            r0 = move-exception
            r7 = r13
            r9 = r14
            r10 = r15
            r13 = r0
            goto L_0x0053
        L_0x0044:
            r0 = move-exception
            r7 = r13
            r9 = r14
            r10 = r15
            r13 = r0
        L_0x0049:
            java.lang.String r14 = getCopyFilePath(r7, r12)     // Catch:{ all -> 0x0038 }
            if (r2 == 0) goto L_0x0052
            r2.close()
        L_0x0052:
            return r14
        L_0x0053:
            if (r2 == 0) goto L_0x0058
            r2.close()
        L_0x0058:
            throw r13
        */
        throw new UnsupportedOperationException("Method not decompiled: com.getcapacitor.FileUtils.getDataColumn(android.content.Context, android.net.Uri, java.lang.String, java.lang.String[]):java.lang.String");
    }

    private static String getCopyFilePath(Uri uri, Context context) {
        Uri uri2 = uri;
        Cursor cursor = context.getContentResolver().query(uri2, (String[]) null, (String) null, (String[]) null, (String) null);
        int nameIndex = cursor.getColumnIndex("_display_name");
        cursor.moveToFirst();
        File file = new File(context.getFilesDir(), sanitizeFilename(cursor.getString(nameIndex)));
        try {
            InputStream inputStream = context.getContentResolver().openInputStream(uri2);
            FileOutputStream outputStream = new FileOutputStream(file);
            byte[] buffers = new byte[Math.min(inputStream.available(), 1048576)];
            while (true) {
                int read = inputStream.read(buffers);
                int read2 = read;
                if (read == -1) {
                    break;
                }
                outputStream.write(buffers, 0, read2);
            }
            inputStream.close();
            outputStream.close();
            if (cursor != null) {
                cursor.close();
            }
            return file.getPath();
        } catch (Exception e) {
            if (cursor == null) {
                return null;
            }
            cursor.close();
            return null;
        } catch (Throwable th) {
            if (cursor != null) {
                cursor.close();
            }
            throw th;
        }
    }

    private static boolean isExternalStorageDocument(Uri uri) {
        return "com.android.externalstorage.documents".equals(uri.getAuthority());
    }

    private static boolean isDownloadsDocument(Uri uri) {
        return "com.android.providers.downloads.documents".equals(uri.getAuthority());
    }

    private static boolean isMediaDocument(Uri uri) {
        return "com.android.providers.media.documents".equals(uri.getAuthority());
    }

    private static boolean isGooglePhotosUri(Uri uri) {
        return "com.google.android.apps.photos.content".equals(uri.getAuthority());
    }

    private static String getPathToNonPrimaryVolume(Context context, String tag) {
        String path;
        int index;
        File[] volumes = context.getExternalCacheDirs();
        if (volumes == null) {
            return null;
        }
        for (File volume : volumes) {
            if (volume != null && (path = volume.getAbsolutePath()) != null && (index = path.indexOf(tag)) != -1) {
                return path.substring(0, index) + tag;
            }
        }
        return null;
    }

    private static String sanitizeFilename(String displayName) {
        String[] segments = displayName.split("/");
        String fileName = segments[segments.length - 1];
        for (String suspString : new String[]{"..", "/"}) {
            fileName = fileName.replace(suspString, "_");
        }
        return fileName;
    }
}
