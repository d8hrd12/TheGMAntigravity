package androidx.webkit.internal;

import java.net.URLConnection;

class MimeUtil {
    MimeUtil() {
    }

    public static String getMimeFromFileName(String fileName) {
        if (fileName == null) {
            return null;
        }
        String mimeType = URLConnection.guessContentTypeFromName(fileName);
        if (mimeType != null) {
            return mimeType;
        }
        return guessHardcodedMime(fileName);
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Code restructure failed: missing block: B:69:0x011b, code lost:
        if (r4.equals("zip") != false) goto L_0x0264;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private static java.lang.String guessHardcodedMime(java.lang.String r6) {
        /*
            r0 = 46
            int r1 = r6.lastIndexOf(r0)
            r2 = 0
            r3 = -1
            if (r1 != r3) goto L_0x000b
            return r2
        L_0x000b:
            int r4 = r1 + 1
            java.lang.String r4 = r6.substring(r4)
            java.lang.String r4 = r4.toLowerCase()
            int r5 = r4.hashCode()
            switch(r5) {
                case 3315: goto L_0x0258;
                case 3401: goto L_0x024d;
                case 97669: goto L_0x0242;
                case 98819: goto L_0x0237;
                case 102340: goto L_0x022c;
                case 103649: goto L_0x0221;
                case 104085: goto L_0x0216;
                case 105441: goto L_0x020b;
                case 106458: goto L_0x0200;
                case 106479: goto L_0x01f4;
                case 108089: goto L_0x01e8;
                case 108150: goto L_0x01dc;
                case 108272: goto L_0x01d1;
                case 108273: goto L_0x01c5;
                case 108324: goto L_0x01ba;
                case 109961: goto L_0x01ae;
                case 109967: goto L_0x01a2;
                case 109973: goto L_0x0196;
                case 109982: goto L_0x018a;
                case 110834: goto L_0x017e;
                case 111030: goto L_0x0172;
                case 111145: goto L_0x0166;
                case 114276: goto L_0x015a;
                case 114791: goto L_0x014e;
                case 114833: goto L_0x0142;
                case 117484: goto L_0x0136;
                case 118660: goto L_0x012b;
                case 118807: goto L_0x011f;
                case 120609: goto L_0x0115;
                case 3000872: goto L_0x0109;
                case 3145576: goto L_0x00fd;
                case 3213227: goto L_0x00f1;
                case 3259225: goto L_0x00e5;
                case 3268712: goto L_0x00d9;
                case 3271912: goto L_0x00cd;
                case 3358085: goto L_0x00c2;
                case 3418175: goto L_0x00b6;
                case 3529614: goto L_0x00aa;
                case 3542678: goto L_0x009e;
                case 3559925: goto L_0x0092;
                case 3642020: goto L_0x0087;
                case 3645337: goto L_0x007c;
                case 3645340: goto L_0x0070;
                case 3655064: goto L_0x0064;
                case 3678569: goto L_0x0059;
                case 96488848: goto L_0x004d;
                case 103877016: goto L_0x0041;
                case 106703064: goto L_0x0035;
                case 109418142: goto L_0x0029;
                case 114035747: goto L_0x001e;
                default: goto L_0x001c;
            }
        L_0x001c:
            goto L_0x0263
        L_0x001e:
            java.lang.String r0 = "xhtml"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 5
            goto L_0x0264
        L_0x0029:
            java.lang.String r0 = "shtml"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 30
            goto L_0x0264
        L_0x0035:
            java.lang.String r0 = "pjpeg"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 18
            goto L_0x0264
        L_0x0041:
            java.lang.String r0 = "mhtml"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 26
            goto L_0x0264
        L_0x004d:
            java.lang.String r0 = "ehtml"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 32
            goto L_0x0264
        L_0x0059:
            java.lang.String r0 = "xhtm"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 7
            goto L_0x0264
        L_0x0064:
            java.lang.String r0 = "woff"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 41
            goto L_0x0264
        L_0x0070:
            java.lang.String r0 = "webp"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 24
            goto L_0x0264
        L_0x007c:
            java.lang.String r0 = "webm"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 0
            goto L_0x0264
        L_0x0087:
            java.lang.String r0 = "wasm"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 4
            goto L_0x0264
        L_0x0092:
            java.lang.String r0 = "tiff"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 48
            goto L_0x0264
        L_0x009e:
            java.lang.String r0 = "svgz"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 23
            goto L_0x0264
        L_0x00aa:
            java.lang.String r0 = "shtm"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 31
            goto L_0x0264
        L_0x00b6:
            java.lang.String r0 = "opus"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 11
            goto L_0x0264
        L_0x00c2:
            java.lang.String r0 = "mpeg"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 1
            goto L_0x0264
        L_0x00cd:
            java.lang.String r0 = "json"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 44
            goto L_0x0264
        L_0x00d9:
            java.lang.String r0 = "jpeg"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 15
            goto L_0x0264
        L_0x00e5:
            java.lang.String r0 = "jfif"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 17
            goto L_0x0264
        L_0x00f1:
            java.lang.String r0 = "html"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 28
            goto L_0x0264
        L_0x00fd:
            java.lang.String r0 = "flac"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 8
            goto L_0x0264
        L_0x0109:
            java.lang.String r0 = "apng"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 21
            goto L_0x0264
        L_0x0115:
            java.lang.String r5 = "zip"
            boolean r5 = r4.equals(r5)
            if (r5 == 0) goto L_0x001c
            goto L_0x0264
        L_0x011f:
            java.lang.String r0 = "xml"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 35
            goto L_0x0264
        L_0x012b:
            java.lang.String r0 = "xht"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 6
            goto L_0x0264
        L_0x0136:
            java.lang.String r0 = "wav"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 12
            goto L_0x0264
        L_0x0142:
            java.lang.String r0 = "tif"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 49
            goto L_0x0264
        L_0x014e:
            java.lang.String r0 = "tgz"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 43
            goto L_0x0264
        L_0x015a:
            java.lang.String r0 = "svg"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 22
            goto L_0x0264
        L_0x0166:
            java.lang.String r0 = "png"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 20
            goto L_0x0264
        L_0x0172:
            java.lang.String r0 = "pjp"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 19
            goto L_0x0264
        L_0x017e:
            java.lang.String r0 = "pdf"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 45
            goto L_0x0264
        L_0x018a:
            java.lang.String r0 = "ogv"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 38
            goto L_0x0264
        L_0x0196:
            java.lang.String r0 = "ogm"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 39
            goto L_0x0264
        L_0x01a2:
            java.lang.String r0 = "ogg"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 9
            goto L_0x0264
        L_0x01ae:
            java.lang.String r0 = "oga"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 10
            goto L_0x0264
        L_0x01ba:
            java.lang.String r0 = "mpg"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 2
            goto L_0x0264
        L_0x01c5:
            java.lang.String r0 = "mp4"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 36
            goto L_0x0264
        L_0x01d1:
            java.lang.String r0 = "mp3"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 3
            goto L_0x0264
        L_0x01dc:
            java.lang.String r0 = "mjs"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 34
            goto L_0x0264
        L_0x01e8:
            java.lang.String r0 = "mht"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 25
            goto L_0x0264
        L_0x01f4:
            java.lang.String r0 = "m4v"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 37
            goto L_0x0264
        L_0x0200:
            java.lang.String r0 = "m4a"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 13
            goto L_0x0264
        L_0x020b:
            java.lang.String r0 = "jpg"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 16
            goto L_0x0264
        L_0x0216:
            java.lang.String r0 = "ico"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 40
            goto L_0x0264
        L_0x0221:
            java.lang.String r0 = "htm"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 29
            goto L_0x0264
        L_0x022c:
            java.lang.String r0 = "gif"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 14
            goto L_0x0264
        L_0x0237:
            java.lang.String r0 = "css"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 27
            goto L_0x0264
        L_0x0242:
            java.lang.String r0 = "bmp"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 47
            goto L_0x0264
        L_0x024d:
            java.lang.String r0 = "js"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 33
            goto L_0x0264
        L_0x0258:
            java.lang.String r0 = "gz"
            boolean r0 = r4.equals(r0)
            if (r0 == 0) goto L_0x001c
            r0 = 42
            goto L_0x0264
        L_0x0263:
            r0 = r3
        L_0x0264:
            switch(r0) {
                case 0: goto L_0x02bf;
                case 1: goto L_0x02bc;
                case 2: goto L_0x02bc;
                case 3: goto L_0x02b9;
                case 4: goto L_0x02b6;
                case 5: goto L_0x02b3;
                case 6: goto L_0x02b3;
                case 7: goto L_0x02b3;
                case 8: goto L_0x02b0;
                case 9: goto L_0x02ad;
                case 10: goto L_0x02ad;
                case 11: goto L_0x02ad;
                case 12: goto L_0x02aa;
                case 13: goto L_0x02a7;
                case 14: goto L_0x02a4;
                case 15: goto L_0x02a1;
                case 16: goto L_0x02a1;
                case 17: goto L_0x02a1;
                case 18: goto L_0x02a1;
                case 19: goto L_0x02a1;
                case 20: goto L_0x029e;
                case 21: goto L_0x029b;
                case 22: goto L_0x0298;
                case 23: goto L_0x0298;
                case 24: goto L_0x0295;
                case 25: goto L_0x0292;
                case 26: goto L_0x0292;
                case 27: goto L_0x028f;
                case 28: goto L_0x028c;
                case 29: goto L_0x028c;
                case 30: goto L_0x028c;
                case 31: goto L_0x028c;
                case 32: goto L_0x028c;
                case 33: goto L_0x0289;
                case 34: goto L_0x0289;
                case 35: goto L_0x0286;
                case 36: goto L_0x0283;
                case 37: goto L_0x0283;
                case 38: goto L_0x0280;
                case 39: goto L_0x0280;
                case 40: goto L_0x027d;
                case 41: goto L_0x027a;
                case 42: goto L_0x0277;
                case 43: goto L_0x0277;
                case 44: goto L_0x0274;
                case 45: goto L_0x0271;
                case 46: goto L_0x026e;
                case 47: goto L_0x026b;
                case 48: goto L_0x0268;
                case 49: goto L_0x0268;
                default: goto L_0x0267;
            }
        L_0x0267:
            return r2
        L_0x0268:
            java.lang.String r0 = "image/tiff"
            return r0
        L_0x026b:
            java.lang.String r0 = "image/bmp"
            return r0
        L_0x026e:
            java.lang.String r0 = "application/zip"
            return r0
        L_0x0271:
            java.lang.String r0 = "application/pdf"
            return r0
        L_0x0274:
            java.lang.String r0 = "application/json"
            return r0
        L_0x0277:
            java.lang.String r0 = "application/gzip"
            return r0
        L_0x027a:
            java.lang.String r0 = "application/font-woff"
            return r0
        L_0x027d:
            java.lang.String r0 = "image/x-icon"
            return r0
        L_0x0280:
            java.lang.String r0 = "video/ogg"
            return r0
        L_0x0283:
            java.lang.String r0 = "video/mp4"
            return r0
        L_0x0286:
            java.lang.String r0 = "text/xml"
            return r0
        L_0x0289:
            java.lang.String r0 = "text/javascript"
            return r0
        L_0x028c:
            java.lang.String r0 = "text/html"
            return r0
        L_0x028f:
            java.lang.String r0 = "text/css"
            return r0
        L_0x0292:
            java.lang.String r0 = "multipart/related"
            return r0
        L_0x0295:
            java.lang.String r0 = "image/webp"
            return r0
        L_0x0298:
            java.lang.String r0 = "image/svg+xml"
            return r0
        L_0x029b:
            java.lang.String r0 = "image/apng"
            return r0
        L_0x029e:
            java.lang.String r0 = "image/png"
            return r0
        L_0x02a1:
            java.lang.String r0 = "image/jpeg"
            return r0
        L_0x02a4:
            java.lang.String r0 = "image/gif"
            return r0
        L_0x02a7:
            java.lang.String r0 = "audio/x-m4a"
            return r0
        L_0x02aa:
            java.lang.String r0 = "audio/wav"
            return r0
        L_0x02ad:
            java.lang.String r0 = "audio/ogg"
            return r0
        L_0x02b0:
            java.lang.String r0 = "audio/flac"
            return r0
        L_0x02b3:
            java.lang.String r0 = "application/xhtml+xml"
            return r0
        L_0x02b6:
            java.lang.String r0 = "application/wasm"
            return r0
        L_0x02b9:
            java.lang.String r0 = "audio/mpeg"
            return r0
        L_0x02bc:
            java.lang.String r0 = "video/mpeg"
            return r0
        L_0x02bf:
            java.lang.String r0 = "video/webm"
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.webkit.internal.MimeUtil.guessHardcodedMime(java.lang.String):java.lang.String");
    }
}
