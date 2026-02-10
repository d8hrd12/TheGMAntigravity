package com.getcapacitor;

import androidx.webkit.ProxyConfig;
import java.util.ArrayList;
import java.util.regex.Pattern;

public class UriMatcher {
    private static final int EXACT = 0;
    private static final int MASK = 3;
    static final Pattern PATH_SPLIT_PATTERN = Pattern.compile("/");
    private static final int REST = 2;
    private static final int TEXT = 1;
    private ArrayList<UriMatcher> mChildren;
    private Object mCode;
    private String mText;
    private int mWhich;

    public UriMatcher(Object code) {
        this.mCode = code;
        this.mWhich = -1;
        this.mChildren = new ArrayList<>();
        this.mText = null;
    }

    private UriMatcher() {
        this.mCode = null;
        this.mWhich = -1;
        this.mChildren = new ArrayList<>();
        this.mText = null;
    }

    public void addURI(String scheme, String authority, String path, Object code) {
        String token;
        String str = path;
        Object obj = code;
        if (obj != null) {
            String[] tokens = null;
            if (str != null) {
                String newPath = path;
                if (!str.isEmpty() && str.charAt(0) == '/') {
                    newPath = str.substring(1);
                }
                tokens = PATH_SPLIT_PATTERN.split(newPath);
            }
            int numTokens = tokens != null ? tokens.length : 0;
            UriMatcher node = this;
            for (int i = -2; i < numTokens; i++) {
                if (i == -2) {
                    token = scheme;
                } else if (i == -1) {
                    token = authority;
                } else {
                    token = tokens[i];
                }
                ArrayList<UriMatcher> children = node.mChildren;
                int numChildren = children.size();
                int j = 0;
                while (true) {
                    if (j >= numChildren) {
                        break;
                    }
                    UriMatcher child = children.get(j);
                    if (token.equals(child.mText)) {
                        node = child;
                        break;
                    }
                    j++;
                }
                if (j == numChildren) {
                    UriMatcher child2 = new UriMatcher();
                    if (i == -1 && token.contains(ProxyConfig.MATCH_ALL_SCHEMES)) {
                        child2.mWhich = 3;
                    } else if (token.equals("**")) {
                        child2.mWhich = 2;
                    } else if (token.equals(ProxyConfig.MATCH_ALL_SCHEMES)) {
                        child2.mWhich = 1;
                    } else {
                        child2.mWhich = 0;
                    }
                    child2.mText = token;
                    node.mChildren.add(child2);
                    node = child2;
                }
            }
            node.mCode = obj;
            return;
        }
        throw new IllegalArgumentException("Code can't be null");
    }

    /* JADX WARNING: Removed duplicated region for block: B:34:0x006c A[LOOP:0: B:7:0x0015->B:34:0x006c, LOOP_END] */
    /* JADX WARNING: Removed duplicated region for block: B:39:0x006a A[SYNTHETIC] */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public java.lang.Object match(android.net.Uri r11) {
        /*
            r10 = this;
            java.util.List r0 = r11.getPathSegments()
            int r1 = r0.size()
            r2 = r10
            if (r1 != 0) goto L_0x0014
            java.lang.String r3 = r11.getAuthority()
            if (r3 != 0) goto L_0x0014
            java.lang.Object r3 = r10.mCode
            return r3
        L_0x0014:
            r3 = -2
        L_0x0015:
            if (r3 >= r1) goto L_0x006f
            r4 = -2
            if (r3 != r4) goto L_0x001f
            java.lang.String r4 = r11.getScheme()
            goto L_0x002d
        L_0x001f:
            r4 = -1
            if (r3 != r4) goto L_0x0027
            java.lang.String r4 = r11.getAuthority()
            goto L_0x002d
        L_0x0027:
            java.lang.Object r4 = r0.get(r3)
            java.lang.String r4 = (java.lang.String) r4
        L_0x002d:
            java.util.ArrayList<com.getcapacitor.UriMatcher> r5 = r2.mChildren
            if (r5 != 0) goto L_0x0032
            goto L_0x006f
        L_0x0032:
            r2 = 0
            int r6 = r5.size()
            r7 = 0
        L_0x0038:
            if (r7 >= r6) goto L_0x0068
            java.lang.Object r8 = r5.get(r7)
            com.getcapacitor.UriMatcher r8 = (com.getcapacitor.UriMatcher) r8
            int r9 = r8.mWhich
            switch(r9) {
                case 0: goto L_0x0059;
                case 1: goto L_0x0057;
                case 2: goto L_0x0054;
                case 3: goto L_0x0046;
                default: goto L_0x0045;
            }
        L_0x0045:
            goto L_0x0062
        L_0x0046:
            java.lang.String r9 = r8.mText
            com.getcapacitor.util.HostMask r9 = com.getcapacitor.util.HostMask.Parser.parse((java.lang.String) r9)
            boolean r9 = r9.matches(r4)
            if (r9 == 0) goto L_0x0062
            r2 = r8
            goto L_0x0062
        L_0x0054:
            java.lang.Object r9 = r8.mCode
            return r9
        L_0x0057:
            r2 = r8
            goto L_0x0062
        L_0x0059:
            java.lang.String r9 = r8.mText
            boolean r9 = r9.equals(r4)
            if (r9 == 0) goto L_0x0062
            r2 = r8
        L_0x0062:
            if (r2 == 0) goto L_0x0065
            goto L_0x0068
        L_0x0065:
            int r7 = r7 + 1
            goto L_0x0038
        L_0x0068:
            if (r2 != 0) goto L_0x006c
            r7 = 0
            return r7
        L_0x006c:
            int r3 = r3 + 1
            goto L_0x0015
        L_0x006f:
            java.lang.Object r3 = r2.mCode
            return r3
        */
        throw new UnsupportedOperationException("Method not decompiled: com.getcapacitor.UriMatcher.match(android.net.Uri):java.lang.Object");
    }
}
