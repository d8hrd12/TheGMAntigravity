package androidx.core.app;

public class AppLocalesStorageHelper {
    static final String APPLICATION_LOCALES_RECORD_FILE = "androidx.appcompat.app.AppCompatDelegate.application_locales_record_file";
    static final boolean DEBUG = false;
    static final String LOCALE_RECORD_ATTRIBUTE_TAG = "application_locales";
    static final String LOCALE_RECORD_FILE_TAG = "locales";
    static final String TAG = "AppLocalesStorageHelper";
    private static final Object sAppLocaleStorageSync = new Object();

    private AppLocalesStorageHelper() {
    }

    /* JADX WARNING: Code restructure failed: missing block: B:21:0x0046, code lost:
        if (r2 != null) goto L_0x0048;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:?, code lost:
        r2.close();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x005b, code lost:
        if (r2 == null) goto L_0x005e;
     */
    /* JADX WARNING: Unknown top exception splitter block from list: {B:42:0x0074=Splitter:B:42:0x0074, B:31:0x005e=Splitter:B:31:0x005e} */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static java.lang.String readLocales(android.content.Context r9) {
        /*
            java.lang.Object r0 = sAppLocaleStorageSync
            monitor-enter(r0)
            java.lang.String r1 = ""
            java.lang.String r2 = "androidx.appcompat.app.AppCompatDelegate.application_locales_record_file"
            java.io.FileInputStream r2 = r9.openFileInput(r2)     // Catch:{ FileNotFoundException -> 0x0075 }
            org.xmlpull.v1.XmlPullParser r3 = android.util.Xml.newPullParser()     // Catch:{ XmlPullParserException -> 0x0052, IOException -> 0x0050 }
            java.lang.String r4 = "UTF-8"
            r3.setInput(r2, r4)     // Catch:{ XmlPullParserException -> 0x0052, IOException -> 0x0050 }
            int r4 = r3.getDepth()     // Catch:{ XmlPullParserException -> 0x0052, IOException -> 0x0050 }
        L_0x0019:
            int r5 = r3.next()     // Catch:{ XmlPullParserException -> 0x0052, IOException -> 0x0050 }
            r6 = r5
            r7 = 1
            if (r5 == r7) goto L_0x0046
            r5 = 3
            if (r6 != r5) goto L_0x002a
            int r7 = r3.getDepth()     // Catch:{ XmlPullParserException -> 0x0052, IOException -> 0x0050 }
            if (r7 <= r4) goto L_0x0046
        L_0x002a:
            if (r6 == r5) goto L_0x0019
            r5 = 4
            if (r6 != r5) goto L_0x0030
            goto L_0x0019
        L_0x0030:
            java.lang.String r5 = r3.getName()     // Catch:{ XmlPullParserException -> 0x0052, IOException -> 0x0050 }
            java.lang.String r7 = "locales"
            boolean r7 = r5.equals(r7)     // Catch:{ XmlPullParserException -> 0x0052, IOException -> 0x0050 }
            if (r7 == 0) goto L_0x0045
            java.lang.String r7 = "application_locales"
            r8 = 0
            java.lang.String r7 = r3.getAttributeValue(r8, r7)     // Catch:{ XmlPullParserException -> 0x0052, IOException -> 0x0050 }
            r1 = r7
            goto L_0x0046
        L_0x0045:
            goto L_0x0019
        L_0x0046:
            if (r2 == 0) goto L_0x005e
        L_0x0048:
            r2.close()     // Catch:{ IOException -> 0x004c }
        L_0x004b:
            goto L_0x005e
        L_0x004c:
            r3 = move-exception
            goto L_0x004b
        L_0x004e:
            r3 = move-exception
            goto L_0x006c
        L_0x0050:
            r3 = move-exception
            goto L_0x0053
        L_0x0052:
            r3 = move-exception
        L_0x0053:
            java.lang.String r4 = "AppLocalesStorageHelper"
            java.lang.String r5 = "Reading app Locales : Unable to parse through file :androidx.appcompat.app.AppCompatDelegate.application_locales_record_file"
            android.util.Log.w(r4, r5)     // Catch:{ all -> 0x004e }
            if (r2 == 0) goto L_0x005e
            goto L_0x0048
        L_0x005e:
            boolean r3 = r1.isEmpty()     // Catch:{ all -> 0x0078 }
            if (r3 != 0) goto L_0x0065
            goto L_0x006a
        L_0x0065:
            java.lang.String r3 = "androidx.appcompat.app.AppCompatDelegate.application_locales_record_file"
            r9.deleteFile(r3)     // Catch:{ all -> 0x0078 }
        L_0x006a:
            monitor-exit(r0)     // Catch:{ all -> 0x0078 }
            return r1
        L_0x006c:
            if (r2 == 0) goto L_0x0073
            r2.close()     // Catch:{ IOException -> 0x0072 }
            goto L_0x0073
        L_0x0072:
            r4 = move-exception
        L_0x0073:
            throw r3     // Catch:{ all -> 0x0078 }
        L_0x0075:
            r2 = move-exception
            monitor-exit(r0)     // Catch:{ all -> 0x0078 }
            return r1
        L_0x0078:
            r1 = move-exception
            monitor-exit(r0)     // Catch:{ all -> 0x0078 }
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.core.app.AppLocalesStorageHelper.readLocales(android.content.Context):java.lang.String");
    }

    /* JADX WARNING: Code restructure failed: missing block: B:17:0x003e, code lost:
        if (r1 != null) goto L_0x004e;
     */
    /* JADX WARNING: Unknown top exception splitter block from list: {B:27:0x0054=Splitter:B:27:0x0054, B:34:0x005e=Splitter:B:34:0x005e} */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static void persistLocales(android.content.Context r6, java.lang.String r7) {
        /*
            java.lang.Object r0 = sAppLocaleStorageSync
            monitor-enter(r0)
            java.lang.String r1 = ""
            boolean r1 = r7.equals(r1)     // Catch:{ all -> 0x0073 }
            if (r1 == 0) goto L_0x0012
            java.lang.String r1 = "androidx.appcompat.app.AppCompatDelegate.application_locales_record_file"
            r6.deleteFile(r1)     // Catch:{ all -> 0x0073 }
            monitor-exit(r0)     // Catch:{ all -> 0x0073 }
            return
        L_0x0012:
            java.lang.String r1 = "androidx.appcompat.app.AppCompatDelegate.application_locales_record_file"
            r2 = 0
            java.io.FileOutputStream r1 = r6.openFileOutput(r1, r2)     // Catch:{ FileNotFoundException -> 0x005f }
            org.xmlpull.v1.XmlSerializer r2 = android.util.Xml.newSerializer()     // Catch:{ all -> 0x0073 }
            r3 = 0
            r2.setOutput(r1, r3)     // Catch:{ Exception -> 0x0043 }
            java.lang.String r4 = "UTF-8"
            r5 = 1
            java.lang.Boolean r5 = java.lang.Boolean.valueOf(r5)     // Catch:{ Exception -> 0x0043 }
            r2.startDocument(r4, r5)     // Catch:{ Exception -> 0x0043 }
            java.lang.String r4 = "locales"
            r2.startTag(r3, r4)     // Catch:{ Exception -> 0x0043 }
            java.lang.String r4 = "application_locales"
            r2.attribute(r3, r4, r7)     // Catch:{ Exception -> 0x0043 }
            java.lang.String r4 = "locales"
            r2.endTag(r3, r4)     // Catch:{ Exception -> 0x0043 }
            r2.endDocument()     // Catch:{ Exception -> 0x0043 }
            if (r1 == 0) goto L_0x0054
            goto L_0x004e
        L_0x0041:
            r3 = move-exception
            goto L_0x0056
        L_0x0043:
            r3 = move-exception
            java.lang.String r4 = "AppLocalesStorageHelper"
            java.lang.String r5 = "Storing App Locales : Failed to persist app-locales in storage "
            android.util.Log.w(r4, r5, r3)     // Catch:{ all -> 0x0041 }
            if (r1 == 0) goto L_0x0054
        L_0x004e:
            r1.close()     // Catch:{ IOException -> 0x0052 }
        L_0x0051:
            goto L_0x0054
        L_0x0052:
            r3 = move-exception
            goto L_0x0051
        L_0x0054:
            monitor-exit(r0)     // Catch:{ all -> 0x0073 }
            return
        L_0x0056:
            if (r1 == 0) goto L_0x005d
            r1.close()     // Catch:{ IOException -> 0x005c }
            goto L_0x005d
        L_0x005c:
            r4 = move-exception
        L_0x005d:
            throw r3     // Catch:{ all -> 0x0073 }
        L_0x005f:
            r1 = move-exception
            java.lang.String r2 = "AppLocalesStorageHelper"
            java.lang.String r3 = "Storing App Locales : FileNotFoundException: Cannot open file %s for writing "
            java.lang.String r4 = "androidx.appcompat.app.AppCompatDelegate.application_locales_record_file"
            java.lang.Object[] r4 = new java.lang.Object[]{r4}     // Catch:{ all -> 0x0073 }
            java.lang.String r3 = java.lang.String.format(r3, r4)     // Catch:{ all -> 0x0073 }
            android.util.Log.w(r2, r3)     // Catch:{ all -> 0x0073 }
            monitor-exit(r0)     // Catch:{ all -> 0x0073 }
            return
        L_0x0073:
            r1 = move-exception
            monitor-exit(r0)     // Catch:{ all -> 0x0073 }
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.core.app.AppLocalesStorageHelper.persistLocales(android.content.Context, java.lang.String):void");
    }
}
