package org.apache.cordova;

import android.net.Uri;
import androidx.webkit.ProxyConfig;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AllowList {
    public static final String TAG = "CordovaAllowList";
    private ArrayList<URLPattern> allowList = new ArrayList<>();

    private static class URLPattern {
        public Pattern host;
        public Pattern path;
        public Integer port;
        public Pattern scheme;

        private String regexFromPattern(String pattern, boolean allowWildcards) {
            StringBuilder regex = new StringBuilder();
            for (int i = 0; i < pattern.length(); i++) {
                char c = pattern.charAt(i);
                if (c == '*' && allowWildcards) {
                    regex.append(".");
                } else if ("\\.[]{}()^$?+|".indexOf(c) > -1) {
                    regex.append('\\');
                }
                regex.append(c);
            }
            return regex.toString();
        }

        /* JADX WARNING: Removed duplicated region for block: B:10:0x0024 A[Catch:{ NumberFormatException -> 0x008e }] */
        /* JADX WARNING: Removed duplicated region for block: B:11:0x0027 A[Catch:{ NumberFormatException -> 0x008e }] */
        /* JADX WARNING: Removed duplicated region for block: B:16:0x005d A[Catch:{ NumberFormatException -> 0x008e }] */
        /* JADX WARNING: Removed duplicated region for block: B:22:0x0075 A[Catch:{ NumberFormatException -> 0x008e }] */
        /* Code decompiled incorrectly, please refer to instructions dump. */
        public URLPattern(java.lang.String r7, java.lang.String r8, java.lang.String r9, java.lang.String r10) throws java.net.MalformedURLException {
            /*
                r6 = this;
                r6.<init>()
                r0 = 0
                java.lang.String r1 = "*"
                r2 = 2
                r3 = 0
                if (r7 == 0) goto L_0x001c
                boolean r4 = r1.equals(r7)     // Catch:{ NumberFormatException -> 0x008e }
                if (r4 == 0) goto L_0x0011
                goto L_0x001c
            L_0x0011:
                java.lang.String r4 = r6.regexFromPattern(r7, r0)     // Catch:{ NumberFormatException -> 0x008e }
                java.util.regex.Pattern r4 = java.util.regex.Pattern.compile(r4, r2)     // Catch:{ NumberFormatException -> 0x008e }
                r6.scheme = r4     // Catch:{ NumberFormatException -> 0x008e }
                goto L_0x001e
            L_0x001c:
                r6.scheme = r3     // Catch:{ NumberFormatException -> 0x008e }
            L_0x001e:
                boolean r4 = r1.equals(r8)     // Catch:{ NumberFormatException -> 0x008e }
                if (r4 == 0) goto L_0x0027
                r6.host = r3     // Catch:{ NumberFormatException -> 0x008e }
                goto L_0x005b
            L_0x0027:
                java.lang.String r4 = "*."
                boolean r4 = r8.startsWith(r4)     // Catch:{ NumberFormatException -> 0x008e }
                if (r4 == 0) goto L_0x0051
                java.lang.StringBuilder r4 = new java.lang.StringBuilder     // Catch:{ NumberFormatException -> 0x008e }
                r4.<init>()     // Catch:{ NumberFormatException -> 0x008e }
                java.lang.String r5 = "([a-z0-9.-]*\\.)?"
                java.lang.StringBuilder r4 = r4.append(r5)     // Catch:{ NumberFormatException -> 0x008e }
                java.lang.String r5 = r8.substring(r2)     // Catch:{ NumberFormatException -> 0x008e }
                java.lang.String r0 = r6.regexFromPattern(r5, r0)     // Catch:{ NumberFormatException -> 0x008e }
                java.lang.StringBuilder r0 = r4.append(r0)     // Catch:{ NumberFormatException -> 0x008e }
                java.lang.String r0 = r0.toString()     // Catch:{ NumberFormatException -> 0x008e }
                java.util.regex.Pattern r0 = java.util.regex.Pattern.compile(r0, r2)     // Catch:{ NumberFormatException -> 0x008e }
                r6.host = r0     // Catch:{ NumberFormatException -> 0x008e }
                goto L_0x005b
            L_0x0051:
                java.lang.String r0 = r6.regexFromPattern(r8, r0)     // Catch:{ NumberFormatException -> 0x008e }
                java.util.regex.Pattern r0 = java.util.regex.Pattern.compile(r0, r2)     // Catch:{ NumberFormatException -> 0x008e }
                r6.host = r0     // Catch:{ NumberFormatException -> 0x008e }
            L_0x005b:
                if (r9 == 0) goto L_0x0071
                boolean r0 = r1.equals(r9)     // Catch:{ NumberFormatException -> 0x008e }
                if (r0 == 0) goto L_0x0064
                goto L_0x0071
            L_0x0064:
                r0 = 10
                int r0 = java.lang.Integer.parseInt(r9, r0)     // Catch:{ NumberFormatException -> 0x008e }
                java.lang.Integer r0 = java.lang.Integer.valueOf(r0)     // Catch:{ NumberFormatException -> 0x008e }
                r6.port = r0     // Catch:{ NumberFormatException -> 0x008e }
                goto L_0x0073
            L_0x0071:
                r6.port = r3     // Catch:{ NumberFormatException -> 0x008e }
            L_0x0073:
                if (r10 == 0) goto L_0x008a
                java.lang.String r0 = "/*"
                boolean r0 = r0.equals(r10)     // Catch:{ NumberFormatException -> 0x008e }
                if (r0 == 0) goto L_0x007e
                goto L_0x008a
            L_0x007e:
                r0 = 1
                java.lang.String r0 = r6.regexFromPattern(r10, r0)     // Catch:{ NumberFormatException -> 0x008e }
                java.util.regex.Pattern r0 = java.util.regex.Pattern.compile(r0)     // Catch:{ NumberFormatException -> 0x008e }
                r6.path = r0     // Catch:{ NumberFormatException -> 0x008e }
                goto L_0x008c
            L_0x008a:
                r6.path = r3     // Catch:{ NumberFormatException -> 0x008e }
            L_0x008c:
                return
            L_0x008e:
                r0 = move-exception
                java.net.MalformedURLException r1 = new java.net.MalformedURLException
                java.lang.String r2 = "Port must be a number"
                r1.<init>(r2)
                throw r1
            */
            throw new UnsupportedOperationException("Method not decompiled: org.apache.cordova.AllowList.URLPattern.<init>(java.lang.String, java.lang.String, java.lang.String, java.lang.String):void");
        }

        public boolean matches(Uri uri) {
            try {
                if (this.scheme != null && !this.scheme.matcher(uri.getScheme()).matches()) {
                    return false;
                }
                if (this.host != null && !this.host.matcher(uri.getHost()).matches()) {
                    return false;
                }
                if (this.port != null && !this.port.equals(Integer.valueOf(uri.getPort()))) {
                    return false;
                }
                if (this.path == null || this.path.matcher(uri.getPath()).matches()) {
                    return true;
                }
                return false;
            } catch (Exception e) {
                LOG.d(AllowList.TAG, e.toString());
                return false;
            }
        }
    }

    public void addAllowListEntry(String origin, boolean subdomains) {
        if (this.allowList != null) {
            try {
                if (origin.compareTo(ProxyConfig.MATCH_ALL_SCHEMES) == 0) {
                    LOG.d(TAG, "Unlimited access to network resources");
                    this.allowList = null;
                    return;
                }
                Matcher m = Pattern.compile("^((\\*|[A-Za-z-]+):(//)?)?(\\*|((\\*\\.)?[^*/:]+))?(:(\\d+))?(/.*)?").matcher(origin);
                if (m.matches()) {
                    String scheme = m.group(2);
                    String host = m.group(4);
                    if (("file".equals(scheme) || "content".equals(scheme)) && host == null) {
                        host = ProxyConfig.MATCH_ALL_SCHEMES;
                    }
                    String port = m.group(8);
                    String path = m.group(9);
                    if (scheme == null) {
                        this.allowList.add(new URLPattern("http", host, port, path));
                        this.allowList.add(new URLPattern("https", host, port, path));
                        return;
                    }
                    this.allowList.add(new URLPattern(scheme, host, port, path));
                }
            } catch (Exception e) {
                LOG.d(TAG, "Failed to add origin %s", origin);
            }
        }
    }

    public boolean isUrlAllowListed(String uri) {
        if (this.allowList == null) {
            return true;
        }
        Uri parsedUri = Uri.parse(uri);
        Iterator<URLPattern> pit = this.allowList.iterator();
        while (pit.hasNext()) {
            if (pit.next().matches(parsedUri)) {
                return true;
            }
        }
        return false;
    }
}
