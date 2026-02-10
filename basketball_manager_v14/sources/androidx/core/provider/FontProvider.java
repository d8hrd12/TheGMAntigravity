package androidx.core.provider;

import android.content.ContentProviderClient;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.pm.ProviderInfo;
import android.content.pm.Signature;
import android.content.res.Resources;
import android.database.Cursor;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Build;
import android.os.CancellationSignal;
import android.os.RemoteException;
import android.util.Log;
import androidx.collection.LruCache;
import androidx.core.content.res.FontResourcesParserCompat;
import androidx.core.graphics.TypefaceCompat;
import androidx.core.provider.FontsContractCompat;
import androidx.tracing.Trace;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

class FontProvider {
    private static final Comparator<byte[]> sByteArrayComparator = new FontProvider$$ExternalSyntheticLambda0();
    private static final LruCache<ProviderCacheKey, ProviderInfo> sProviderCache = new LruCache<>(2);

    private FontProvider() {
    }

    static FontsContractCompat.FontFamilyResult getFontFamilyResult(Context context, List<FontRequest> requests, CancellationSignal cancellationSignal) throws PackageManager.NameNotFoundException {
        String systemFont;
        Typeface typeface;
        Trace.beginSection("FontProvider.getFontFamilyResult");
        try {
            ArrayList<FontsContractCompat.FontInfo[]> queryResults = new ArrayList<>();
            for (int i = 0; i < requests.size(); i++) {
                FontRequest request = requests.get(i);
                if (Build.VERSION.SDK_INT < 31 || (typeface = TypefaceCompat.getSystemFontFamily(systemFont)) == null || TypefaceCompat.guessPrimaryFont(typeface) == null) {
                    ProviderInfo providerInfo = getProvider(context.getPackageManager(), request, context.getResources());
                    if (providerInfo == null) {
                        FontsContractCompat.FontInfo[] fontInfoArr = null;
                        return FontsContractCompat.FontFamilyResult.create(1, (FontsContractCompat.FontInfo[]) null);
                    }
                    queryResults.add(query(context, request, providerInfo.authority, cancellationSignal));
                } else {
                    queryResults.add(new FontsContractCompat.FontInfo[]{new FontsContractCompat.FontInfo((systemFont = request.getSystemFont()), request.getVariationSettings())});
                }
            }
            FontsContractCompat.FontFamilyResult create = FontsContractCompat.FontFamilyResult.create(0, (List<FontsContractCompat.FontInfo[]>) queryResults);
            Trace.endSection();
            return create;
        } finally {
            Trace.endSection();
        }
    }

    private static class ProviderCacheKey {
        String mAuthority;
        List<List<byte[]>> mCertificates;
        String mPackageName;

        ProviderCacheKey(String authority, String packageName, List<List<byte[]>> certificates) {
            this.mAuthority = authority;
            this.mPackageName = packageName;
            this.mCertificates = certificates;
        }

        public boolean equals(Object o) {
            if (this == o) {
                return true;
            }
            if (!(o instanceof ProviderCacheKey)) {
                return false;
            }
            ProviderCacheKey that = (ProviderCacheKey) o;
            if (!Objects.equals(this.mAuthority, that.mAuthority) || !Objects.equals(this.mPackageName, that.mPackageName) || !Objects.equals(this.mCertificates, that.mCertificates)) {
                return false;
            }
            return true;
        }

        public int hashCode() {
            return Objects.hash(new Object[]{this.mAuthority, this.mPackageName, this.mCertificates});
        }
    }

    static void clearProviderCache() {
        sProviderCache.evictAll();
    }

    static ProviderInfo getProvider(PackageManager packageManager, FontRequest request, Resources resources) throws PackageManager.NameNotFoundException {
        Trace.beginSection("FontProvider.getProvider");
        try {
            List<List<byte[]>> requestCertificatesList = getCertificates(request, resources);
            ProviderCacheKey cacheKey = new ProviderCacheKey(request.getProviderAuthority(), request.getProviderPackage(), requestCertificatesList);
            ProviderInfo cachedPackageInfo = sProviderCache.get(cacheKey);
            if (cachedPackageInfo != null) {
                return cachedPackageInfo;
            }
            String providerAuthority = request.getProviderAuthority();
            ProviderInfo info = packageManager.resolveContentProvider(providerAuthority, 0);
            if (info == null) {
                throw new PackageManager.NameNotFoundException("No package found for authority: " + providerAuthority);
            } else if (info.packageName.equals(request.getProviderPackage())) {
                List<byte[]> signatures = convertToByteArrayList(packageManager.getPackageInfo(info.packageName, 64).signatures);
                Collections.sort(signatures, sByteArrayComparator);
                for (int i = 0; i < requestCertificatesList.size(); i++) {
                    List<byte[]> requestSignatures = new ArrayList<>(requestCertificatesList.get(i));
                    Collections.sort(requestSignatures, sByteArrayComparator);
                    if (equalsByteArrayList(signatures, requestSignatures)) {
                        sProviderCache.put(cacheKey, info);
                        Trace.endSection();
                        return info;
                    }
                }
                Trace.endSection();
                return null;
            } else {
                throw new PackageManager.NameNotFoundException("Found content provider " + providerAuthority + ", but package was not " + request.getProviderPackage());
            }
        } finally {
            Trace.endSection();
        }
    }

    /* JADX WARNING: Removed duplicated region for block: B:55:0x013b A[SYNTHETIC, Splitter:B:55:0x013b] */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    static androidx.core.provider.FontsContractCompat.FontInfo[] query(android.content.Context r22, androidx.core.provider.FontRequest r23, java.lang.String r24, android.os.CancellationSignal r25) {
        /*
            r1 = r24
            java.lang.String r0 = "result_code"
            java.lang.String r2 = "font_italic"
            java.lang.String r3 = "font_weight"
            java.lang.String r4 = "font_ttc_index"
            java.lang.String r5 = "file_id"
            java.lang.String r6 = "_id"
            java.lang.String r7 = "content"
            java.lang.String r8 = "FontProvider.query"
            androidx.tracing.Trace.beginSection(r8)
            java.util.ArrayList r8 = new java.util.ArrayList     // Catch:{ all -> 0x0143 }
            r8.<init>()     // Catch:{ all -> 0x0143 }
            android.net.Uri$Builder r9 = new android.net.Uri$Builder     // Catch:{ all -> 0x0143 }
            r9.<init>()     // Catch:{ all -> 0x0143 }
            android.net.Uri$Builder r9 = r9.scheme(r7)     // Catch:{ all -> 0x0143 }
            android.net.Uri$Builder r9 = r9.authority(r1)     // Catch:{ all -> 0x0143 }
            android.net.Uri r9 = r9.build()     // Catch:{ all -> 0x0143 }
            r11 = r9
            android.net.Uri$Builder r9 = new android.net.Uri$Builder     // Catch:{ all -> 0x0143 }
            r9.<init>()     // Catch:{ all -> 0x0143 }
            android.net.Uri$Builder r7 = r9.scheme(r7)     // Catch:{ all -> 0x0143 }
            android.net.Uri$Builder r7 = r7.authority(r1)     // Catch:{ all -> 0x0143 }
            java.lang.String r9 = "file"
            android.net.Uri$Builder r7 = r7.appendPath(r9)     // Catch:{ all -> 0x0143 }
            android.net.Uri r7 = r7.build()     // Catch:{ all -> 0x0143 }
            r9 = 0
            r10 = r22
            androidx.core.provider.FontProvider$ContentQueryWrapper r12 = androidx.core.provider.FontProvider.ContentQueryWrapper.make(r10, r11)     // Catch:{ all -> 0x0143 }
            r13 = 7
            java.lang.String[] r13 = new java.lang.String[r13]     // Catch:{ all -> 0x0137 }
            r14 = 0
            r13[r14] = r6     // Catch:{ all -> 0x0137 }
            r15 = 1
            r13[r15] = r5     // Catch:{ all -> 0x0137 }
            r16 = 2
            r13[r16] = r4     // Catch:{ all -> 0x0137 }
            java.lang.String r16 = "font_variation_settings"
            r17 = 3
            r13[r17] = r16     // Catch:{ all -> 0x0137 }
            r16 = 4
            r13[r16] = r3     // Catch:{ all -> 0x0137 }
            r16 = 5
            r13[r16] = r2     // Catch:{ all -> 0x0137 }
            r16 = 6
            r13[r16] = r0     // Catch:{ all -> 0x0137 }
            java.lang.String r16 = "ContentQueryWrapper.query"
            androidx.tracing.Trace.beginSection(r16)     // Catch:{ all -> 0x0137 }
            r10 = r12
            r12 = r13
            java.lang.String r13 = "query = ?"
            r16 = r14
            java.lang.String[] r14 = new java.lang.String[r15]     // Catch:{ all -> 0x012f }
            java.lang.String r17 = r23.getQuery()     // Catch:{ all -> 0x012f }
            r14[r16] = r17     // Catch:{ all -> 0x012f }
            r17 = r15
            r15 = 0
            r16 = r25
            r1 = r17
            android.database.Cursor r13 = r10.query(r11, r12, r13, r14, r15, r16)     // Catch:{ all -> 0x012f }
            r9 = r13
            androidx.tracing.Trace.endSection()     // Catch:{ all -> 0x0135 }
            if (r9 == 0) goto L_0x0119
            int r13 = r9.getCount()     // Catch:{ all -> 0x0135 }
            if (r13 <= 0) goto L_0x0119
            int r0 = r9.getColumnIndex(r0)     // Catch:{ all -> 0x0135 }
            java.util.ArrayList r13 = new java.util.ArrayList     // Catch:{ all -> 0x0135 }
            r13.<init>()     // Catch:{ all -> 0x0135 }
            r8 = r13
            int r6 = r9.getColumnIndex(r6)     // Catch:{ all -> 0x0135 }
            int r5 = r9.getColumnIndex(r5)     // Catch:{ all -> 0x0135 }
            int r4 = r9.getColumnIndex(r4)     // Catch:{ all -> 0x0135 }
            int r3 = r9.getColumnIndex(r3)     // Catch:{ all -> 0x0135 }
            int r2 = r9.getColumnIndex(r2)     // Catch:{ all -> 0x0135 }
        L_0x00b2:
            boolean r13 = r9.moveToNext()     // Catch:{ all -> 0x0135 }
            if (r13 == 0) goto L_0x0115
            r13 = -1
            if (r0 == r13) goto L_0x00c0
            int r14 = r9.getInt(r0)     // Catch:{ all -> 0x0135 }
            goto L_0x00c1
        L_0x00c0:
            r14 = 0
        L_0x00c1:
            if (r4 == r13) goto L_0x00c9
            int r15 = r9.getInt(r4)     // Catch:{ all -> 0x0135 }
            goto L_0x00ca
        L_0x00c9:
            r15 = 0
        L_0x00ca:
            if (r5 != r13) goto L_0x00dd
            long r18 = r9.getLong(r6)     // Catch:{ all -> 0x0135 }
            r20 = r18
            r18 = r2
            r1 = r20
            android.net.Uri r19 = android.content.ContentUris.withAppendedId(r11, r1)     // Catch:{ all -> 0x0135 }
            r1 = r19
            goto L_0x00e9
        L_0x00dd:
            r18 = r2
            long r1 = r9.getLong(r5)     // Catch:{ all -> 0x0135 }
            android.net.Uri r19 = android.content.ContentUris.withAppendedId(r7, r1)     // Catch:{ all -> 0x0135 }
            r1 = r19
        L_0x00e9:
            if (r3 == r13) goto L_0x00f0
            int r2 = r9.getInt(r3)     // Catch:{ all -> 0x0135 }
            goto L_0x00f2
        L_0x00f0:
            r2 = 400(0x190, float:5.6E-43)
        L_0x00f2:
            r19 = r0
            r0 = r18
            if (r0 == r13) goto L_0x0104
            int r13 = r9.getInt(r0)     // Catch:{ all -> 0x0135 }
            r18 = r0
            r0 = 1
            if (r13 != r0) goto L_0x0107
            r13 = r0
            goto L_0x0108
        L_0x0104:
            r18 = r0
            r0 = 1
        L_0x0107:
            r13 = 0
        L_0x0108:
            androidx.core.provider.FontsContractCompat$FontInfo r0 = androidx.core.provider.FontsContractCompat.FontInfo.create(r1, r15, r2, r13, r14)     // Catch:{ all -> 0x0135 }
            r8.add(r0)     // Catch:{ all -> 0x0135 }
            r2 = r18
            r0 = r19
            r1 = 1
            goto L_0x00b2
        L_0x0115:
            r19 = r0
            r18 = r2
        L_0x0119:
            if (r9 == 0) goto L_0x011e
            r9.close()     // Catch:{ all -> 0x0143 }
        L_0x011e:
            r10.close()     // Catch:{ all -> 0x0143 }
            r0 = 0
            androidx.core.provider.FontsContractCompat$FontInfo[] r0 = new androidx.core.provider.FontsContractCompat.FontInfo[r0]     // Catch:{ all -> 0x0143 }
            java.lang.Object[] r0 = r8.toArray(r0)     // Catch:{ all -> 0x0143 }
            androidx.core.provider.FontsContractCompat$FontInfo[] r0 = (androidx.core.provider.FontsContractCompat.FontInfo[]) r0     // Catch:{ all -> 0x0143 }
            androidx.tracing.Trace.endSection()
            return r0
        L_0x012f:
            r0 = move-exception
            androidx.tracing.Trace.endSection()     // Catch:{ all -> 0x0135 }
            throw r0     // Catch:{ all -> 0x0135 }
        L_0x0135:
            r0 = move-exception
            goto L_0x0139
        L_0x0137:
            r0 = move-exception
            r10 = r12
        L_0x0139:
            if (r9 == 0) goto L_0x013e
            r9.close()     // Catch:{ all -> 0x0143 }
        L_0x013e:
            r10.close()     // Catch:{ all -> 0x0143 }
            throw r0     // Catch:{ all -> 0x0143 }
        L_0x0143:
            r0 = move-exception
            androidx.tracing.Trace.endSection()
            throw r0
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.core.provider.FontProvider.query(android.content.Context, androidx.core.provider.FontRequest, java.lang.String, android.os.CancellationSignal):androidx.core.provider.FontsContractCompat$FontInfo[]");
    }

    private static List<List<byte[]>> getCertificates(FontRequest request, Resources resources) {
        if (request.getCertificates() != null) {
            return request.getCertificates();
        }
        return FontResourcesParserCompat.readCerts(resources, request.getCertificatesArrayResId());
    }

    static /* synthetic */ int lambda$static$0(byte[] l, byte[] r) {
        if (l.length != r.length) {
            return l.length - r.length;
        }
        for (int i = 0; i < l.length; i++) {
            if (l[i] != r[i]) {
                return l[i] - r[i];
            }
        }
        return 0;
    }

    private static boolean equalsByteArrayList(List<byte[]> signatures, List<byte[]> requestSignatures) {
        if (signatures.size() != requestSignatures.size()) {
            return false;
        }
        for (int i = 0; i < signatures.size(); i++) {
            if (!Arrays.equals(signatures.get(i), requestSignatures.get(i))) {
                return false;
            }
        }
        return true;
    }

    private static List<byte[]> convertToByteArrayList(Signature[] signatures) {
        List<byte[]> shaList = new ArrayList<>();
        for (Signature signature : signatures) {
            shaList.add(signature.toByteArray());
        }
        return shaList;
    }

    private interface ContentQueryWrapper {
        void close();

        Cursor query(Uri uri, String[] strArr, String str, String[] strArr2, String str2, CancellationSignal cancellationSignal);

        static ContentQueryWrapper make(Context context, Uri uri) {
            return new ContentQueryWrapperApi24Impl(context, uri);
        }
    }

    private static class ContentQueryWrapperApi16Impl implements ContentQueryWrapper {
        private final ContentProviderClient mClient;

        ContentQueryWrapperApi16Impl(Context context, Uri uri) {
            this.mClient = context.getContentResolver().acquireUnstableContentProviderClient(uri);
        }

        public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs, String sortOrder, CancellationSignal cancellationSignal) {
            RemoteException e;
            if (this.mClient == null) {
                return null;
            }
            try {
                try {
                    return this.mClient.query(uri, projection, selection, selectionArgs, sortOrder, cancellationSignal);
                } catch (RemoteException e2) {
                    e = e2;
                    Log.w("FontsProvider", "Unable to query the content provider", e);
                    return null;
                }
            } catch (RemoteException e3) {
                Uri uri2 = uri;
                String[] strArr = projection;
                String str = selection;
                String[] strArr2 = selectionArgs;
                String str2 = sortOrder;
                CancellationSignal cancellationSignal2 = cancellationSignal;
                e = e3;
                Log.w("FontsProvider", "Unable to query the content provider", e);
                return null;
            }
        }

        public void close() {
            if (this.mClient != null) {
                this.mClient.release();
            }
        }
    }

    private static class ContentQueryWrapperApi24Impl implements ContentQueryWrapper {
        private final ContentProviderClient mClient;

        ContentQueryWrapperApi24Impl(Context context, Uri uri) {
            this.mClient = context.getContentResolver().acquireUnstableContentProviderClient(uri);
        }

        public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs, String sortOrder, CancellationSignal cancellationSignal) {
            RemoteException e;
            if (this.mClient == null) {
                return null;
            }
            try {
                try {
                    return this.mClient.query(uri, projection, selection, selectionArgs, sortOrder, cancellationSignal);
                } catch (RemoteException e2) {
                    e = e2;
                    Log.w("FontsProvider", "Unable to query the content provider", e);
                    return null;
                }
            } catch (RemoteException e3) {
                Uri uri2 = uri;
                String[] strArr = projection;
                String str = selection;
                String[] strArr2 = selectionArgs;
                String str2 = sortOrder;
                CancellationSignal cancellationSignal2 = cancellationSignal;
                e = e3;
                Log.w("FontsProvider", "Unable to query the content provider", e);
                return null;
            }
        }

        public void close() {
            if (this.mClient != null) {
                this.mClient.close();
            }
        }
    }
}
