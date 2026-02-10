package androidx.core.content.res;

import android.content.res.Resources;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.util.Base64;
import android.util.Xml;
import androidx.core.R;
import androidx.core.provider.FontRequest;
import java.io.IOException;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;

public class FontResourcesParserCompat {
    private static final int DEFAULT_TIMEOUT_MILLIS = 500;
    public static final int FETCH_STRATEGY_ASYNC = 1;
    public static final int FETCH_STRATEGY_BLOCKING = 0;
    public static final int INFINITE_TIMEOUT_VALUE = -1;
    private static final int ITALIC = 1;
    private static final int NORMAL_WEIGHT = 400;

    public interface FamilyResourceEntry {
    }

    @Retention(RetentionPolicy.SOURCE)
    public @interface FetchStrategy {
    }

    public static final class ProviderResourceEntry implements FamilyResourceEntry {
        private final List<FontRequest> mRequests;
        private final int mStrategy;
        private final String mSystemFontFamilyName;
        private final int mTimeoutMs;

        public ProviderResourceEntry(List<FontRequest> requests, int strategy, int timeoutMs, String systemFontFamilyName) {
            this.mRequests = requests;
            this.mStrategy = strategy;
            this.mTimeoutMs = timeoutMs;
            this.mSystemFontFamilyName = systemFontFamilyName;
        }

        public ProviderResourceEntry(FontRequest request, int strategy, int timeoutMs) {
            this(Collections.singletonList(request), strategy, timeoutMs, (String) null);
        }

        public List<FontRequest> getRequests() {
            return this.mRequests;
        }

        public FontRequest getRequest() {
            return this.mRequests.get(0);
        }

        public FontRequest getFallbackRequest() {
            if (this.mRequests.size() < 2) {
                return null;
            }
            return this.mRequests.get(1);
        }

        public int getFetchStrategy() {
            return this.mStrategy;
        }

        public int getTimeout() {
            return this.mTimeoutMs;
        }

        public String getSystemFontFamilyName() {
            return this.mSystemFontFamilyName;
        }
    }

    public static final class FontFileResourceEntry {
        private final String mFileName;
        private final boolean mItalic;
        private final int mResourceId;
        private final int mTtcIndex;
        private final String mVariationSettings;
        private final int mWeight;

        public FontFileResourceEntry(String fileName, int weight, boolean italic, String variationSettings, int ttcIndex, int resourceId) {
            this.mFileName = fileName;
            this.mWeight = weight;
            this.mItalic = italic;
            this.mVariationSettings = variationSettings;
            this.mTtcIndex = ttcIndex;
            this.mResourceId = resourceId;
        }

        public String getFileName() {
            return this.mFileName;
        }

        public int getWeight() {
            return this.mWeight;
        }

        public boolean isItalic() {
            return this.mItalic;
        }

        public String getVariationSettings() {
            return this.mVariationSettings;
        }

        public int getTtcIndex() {
            return this.mTtcIndex;
        }

        public int getResourceId() {
            return this.mResourceId;
        }
    }

    public static final class FontFamilyFilesResourceEntry implements FamilyResourceEntry {
        private final FontFileResourceEntry[] mEntries;

        public FontFamilyFilesResourceEntry(FontFileResourceEntry[] entries) {
            this.mEntries = entries;
        }

        public FontFileResourceEntry[] getEntries() {
            return this.mEntries;
        }
    }

    /* JADX WARNING: Removed duplicated region for block: B:6:0x000f  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0014  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static androidx.core.content.res.FontResourcesParserCompat.FamilyResourceEntry parse(org.xmlpull.v1.XmlPullParser r3, android.content.res.Resources r4) throws org.xmlpull.v1.XmlPullParserException, java.io.IOException {
        /*
        L_0x0001:
            int r0 = r3.next()
            r1 = r0
            r2 = 2
            if (r0 == r2) goto L_0x000d
            r0 = 1
            if (r1 == r0) goto L_0x000d
            goto L_0x0001
        L_0x000d:
            if (r1 != r2) goto L_0x0014
            androidx.core.content.res.FontResourcesParserCompat$FamilyResourceEntry r0 = readFamilies(r3, r4)
            return r0
        L_0x0014:
            org.xmlpull.v1.XmlPullParserException r0 = new org.xmlpull.v1.XmlPullParserException
            java.lang.String r2 = "No start tag found"
            r0.<init>(r2)
            throw r0
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.core.content.res.FontResourcesParserCompat.parse(org.xmlpull.v1.XmlPullParser, android.content.res.Resources):androidx.core.content.res.FontResourcesParserCompat$FamilyResourceEntry");
    }

    private static FamilyResourceEntry readFamilies(XmlPullParser parser, Resources resources) throws XmlPullParserException, IOException {
        parser.require(2, (String) null, "font-family");
        if (parser.getName().equals("font-family")) {
            return readFamily(parser, resources);
        }
        skip(parser);
        return null;
    }

    private static FamilyResourceEntry readFamily(XmlPullParser parser, Resources resources) throws XmlPullParserException, IOException {
        AttributeSet attrs;
        Resources resources2 = resources;
        AttributeSet attrs2 = Xml.asAttributeSet(parser);
        TypedArray array = resources2.obtainAttributes(attrs2, R.styleable.FontFamily);
        String authority = array.getString(R.styleable.FontFamily_fontProviderAuthority);
        String providerPackage = array.getString(R.styleable.FontFamily_fontProviderPackage);
        String query = array.getString(R.styleable.FontFamily_fontProviderQuery);
        String fallbackQuery = array.getString(R.styleable.FontFamily_fontProviderFallbackQuery);
        int certsId = array.getResourceId(R.styleable.FontFamily_fontProviderCerts, 0);
        boolean z = true;
        int strategy = array.getInteger(R.styleable.FontFamily_fontProviderFetchStrategy, 1);
        int timeoutMs = array.getInteger(R.styleable.FontFamily_fontProviderFetchTimeout, DEFAULT_TIMEOUT_MILLIS);
        String systemFontFamilyName = array.getString(R.styleable.FontFamily_fontProviderSystemFontFamily);
        array.recycle();
        if (authority == null || providerPackage == null) {
            z = false;
        }
        boolean isProviderFont = z;
        int i = 3;
        if (isProviderFont) {
            List<List<byte[]>> certs = readCerts(resources2, certsId);
            List<FontRequest> requests = new ArrayList<>();
            while (parser.next() != i) {
                if (parser.getEventType() != 2) {
                    i = 3;
                } else {
                    if (parser.getName().equals("fallback")) {
                        attrs = attrs2;
                        requests.add(readFallback(parser, resources2, authority, providerPackage, certs));
                    } else {
                        attrs = attrs2;
                        skip(parser);
                    }
                    attrs2 = attrs;
                    i = 3;
                }
            }
            XmlPullParser xmlPullParser = parser;
            AttributeSet attributeSet = attrs2;
            if (!requests.isEmpty()) {
                return new ProviderResourceEntry(requests, strategy, timeoutMs, systemFontFamilyName);
            }
            if (query != null) {
                List<FontRequest> requests2 = requests;
                String str = query;
                requests2.add(new FontRequest(authority, providerPackage, query, certs, (String) null, (String) null));
                if (fallbackQuery != null) {
                    requests2.add(new FontRequest(authority, providerPackage, fallbackQuery, certs, (String) null, (String) null));
                }
                return new ProviderResourceEntry(requests2, strategy, timeoutMs, systemFontFamilyName);
            }
            String query2 = fallbackQuery;
            throw new IllegalArgumentException("The provider font XML requires query attribute or fallback children.");
        }
        String str2 = query;
        String query3 = fallbackQuery;
        List<FontFileResourceEntry> fonts = new ArrayList<>();
        while (parser.next() != 3) {
            if (parser.getEventType() == 2) {
                if (parser.getName().equals("font")) {
                    fonts.add(readFont(parser, resources));
                } else {
                    skip(parser);
                }
            }
        }
        if (fonts.isEmpty()) {
            return null;
        }
        return new FontFamilyFilesResourceEntry((FontFileResourceEntry[]) fonts.toArray(new FontFileResourceEntry[0]));
    }

    private static int getType(TypedArray typedArray, int index) {
        return Api21Impl.getType(typedArray, index);
    }

    public static List<List<byte[]>> readCerts(Resources resources, int certsId) {
        if (certsId == 0) {
            return Collections.emptyList();
        }
        TypedArray typedArray = resources.obtainTypedArray(certsId);
        try {
            if (typedArray.length() == 0) {
                return Collections.emptyList();
            }
            List<List<byte[]>> result = new ArrayList<>();
            if (getType(typedArray, 0) == 1) {
                for (int i = 0; i < typedArray.length(); i++) {
                    int certId = typedArray.getResourceId(i, 0);
                    if (certId != 0) {
                        result.add(toByteArrayList(resources.getStringArray(certId)));
                    }
                }
            } else {
                result.add(toByteArrayList(resources.getStringArray(certsId)));
            }
            typedArray.recycle();
            return result;
        } finally {
            typedArray.recycle();
        }
    }

    private static List<byte[]> toByteArrayList(String[] stringArray) {
        List<byte[]> result = new ArrayList<>();
        for (String item : stringArray) {
            result.add(Base64.decode(item, 0));
        }
        return result;
    }

    /* JADX WARNING: Removed duplicated region for block: B:28:0x0053 A[SYNTHETIC, Splitter:B:28:0x0053] */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private static androidx.core.provider.FontRequest readFallback(org.xmlpull.v1.XmlPullParser r10, android.content.res.Resources r11, java.lang.String r12, java.lang.String r13, java.util.List<java.util.List<byte[]>> r14) throws org.xmlpull.v1.XmlPullParserException, java.io.IOException {
        /*
            android.util.AttributeSet r1 = android.util.Xml.asAttributeSet(r10)
            int[] r0 = androidx.core.R.styleable.FontFamilyProviderFallback
            android.content.res.TypedArray r2 = r11.obtainAttributes(r1, r0)
            int r0 = androidx.core.R.styleable.FontFamilyProviderFallback_fontProviderQuery     // Catch:{ all -> 0x004c }
            java.lang.String r0 = r2.getString(r0)     // Catch:{ all -> 0x004c }
            r6 = r0
            int r0 = androidx.core.R.styleable.FontFamilyProviderFallback_fontProviderSystemFontFamily     // Catch:{ all -> 0x004c }
            java.lang.String r8 = r2.getString(r0)     // Catch:{ all -> 0x004c }
            int r0 = androidx.core.R.styleable.FontFamilyProviderFallback_fontVariationSettings     // Catch:{ all -> 0x004c }
            java.lang.String r9 = r2.getString(r0)     // Catch:{ all -> 0x004c }
            if (r6 == 0) goto L_0x003e
        L_0x001f:
            int r0 = r10.next()     // Catch:{ all -> 0x004c }
            r3 = 3
            if (r0 == r3) goto L_0x0030
            skip(r10)     // Catch:{ all -> 0x002a }
            goto L_0x001f
        L_0x002a:
            r0 = move-exception
            r4 = r12
            r5 = r13
            r7 = r14
            r12 = r0
            goto L_0x0051
        L_0x0030:
            androidx.core.provider.FontRequest r3 = new androidx.core.provider.FontRequest     // Catch:{ all -> 0x004c }
            r4 = r12
            r5 = r13
            r7 = r14
            r3.<init>(r4, r5, r6, r7, r8, r9)     // Catch:{ all -> 0x0049 }
            if (r2 == 0) goto L_0x003d
            androidx.core.content.res.FontResourcesParserCompat$$ExternalSyntheticAutoCloseableDispatcher0.m(r2)
        L_0x003d:
            return r3
        L_0x003e:
            r4 = r12
            r5 = r13
            r7 = r14
            org.xmlpull.v1.XmlPullParserException r12 = new org.xmlpull.v1.XmlPullParserException     // Catch:{ all -> 0x0049 }
            java.lang.String r13 = "query attribute must be set in fallback element"
            r12.<init>(r13)     // Catch:{ all -> 0x0049 }
            throw r12     // Catch:{ all -> 0x0049 }
        L_0x0049:
            r0 = move-exception
            r12 = r0
            goto L_0x0051
        L_0x004c:
            r0 = move-exception
            r4 = r12
            r5 = r13
            r7 = r14
            r12 = r0
        L_0x0051:
            if (r2 == 0) goto L_0x005c
            androidx.core.content.res.FontResourcesParserCompat$$ExternalSyntheticAutoCloseableDispatcher0.m(r2)     // Catch:{ all -> 0x0057 }
            goto L_0x005c
        L_0x0057:
            r0 = move-exception
            r13 = r0
            r12.addSuppressed(r13)
        L_0x005c:
            throw r12
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.core.content.res.FontResourcesParserCompat.readFallback(org.xmlpull.v1.XmlPullParser, android.content.res.Resources, java.lang.String, java.lang.String, java.util.List):androidx.core.provider.FontRequest");
    }

    private static FontFileResourceEntry readFont(XmlPullParser parser, Resources resources) throws XmlPullParserException, IOException {
        int weightAttr;
        int styleAttr;
        int i;
        int variationSettingsAttr;
        int i2;
        TypedArray array = resources.obtainAttributes(Xml.asAttributeSet(parser), R.styleable.FontFamilyFont);
        if (array.hasValue(R.styleable.FontFamilyFont_fontWeight)) {
            weightAttr = R.styleable.FontFamilyFont_fontWeight;
        } else {
            weightAttr = R.styleable.FontFamilyFont_android_fontWeight;
        }
        int weight = array.getInt(weightAttr, NORMAL_WEIGHT);
        if (array.hasValue(R.styleable.FontFamilyFont_fontStyle)) {
            styleAttr = R.styleable.FontFamilyFont_fontStyle;
        } else {
            styleAttr = R.styleable.FontFamilyFont_android_fontStyle;
        }
        boolean isItalic = true;
        if (1 != array.getInt(styleAttr, 0)) {
            isItalic = false;
        }
        if (array.hasValue(R.styleable.FontFamilyFont_ttcIndex)) {
            i = R.styleable.FontFamilyFont_ttcIndex;
        } else {
            i = R.styleable.FontFamilyFont_android_ttcIndex;
        }
        int ttcIndexAttr = i;
        if (array.hasValue(R.styleable.FontFamilyFont_fontVariationSettings)) {
            variationSettingsAttr = R.styleable.FontFamilyFont_fontVariationSettings;
        } else {
            variationSettingsAttr = R.styleable.FontFamilyFont_android_fontVariationSettings;
        }
        String variationSettings = array.getString(variationSettingsAttr);
        int ttcIndex = array.getInt(ttcIndexAttr, 0);
        if (array.hasValue(R.styleable.FontFamilyFont_font)) {
            i2 = R.styleable.FontFamilyFont_font;
        } else {
            i2 = R.styleable.FontFamilyFont_android_font;
        }
        int resourceAttr = i2;
        int resourceId = array.getResourceId(resourceAttr, 0);
        String filename = array.getString(resourceAttr);
        array.recycle();
        while (parser.next() != 3) {
            skip(parser);
        }
        return new FontFileResourceEntry(filename, weight, isItalic, variationSettings, ttcIndex, resourceId);
    }

    private static void skip(XmlPullParser parser) throws XmlPullParserException, IOException {
        int depth = 1;
        while (depth > 0) {
            switch (parser.next()) {
                case 2:
                    depth++;
                    break;
                case 3:
                    depth--;
                    break;
            }
        }
    }

    private FontResourcesParserCompat() {
    }

    static class Api21Impl {
        private Api21Impl() {
        }

        static int getType(TypedArray typedArray, int index) {
            return typedArray.getType(index);
        }
    }
}
