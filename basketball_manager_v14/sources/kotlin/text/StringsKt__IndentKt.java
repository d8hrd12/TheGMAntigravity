package kotlin.text;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import kotlin.Metadata;
import kotlin.collections.CollectionsKt;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.internal.Intrinsics;
import kotlin.sequences.SequencesKt;

@Metadata(d1 = {"\u0000\u001e\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010\u000e\n\u0002\b\u0003\n\u0002\u0010\b\n\u0002\b\u0003\n\u0002\u0010 \n\u0002\b\u000b\u001a!\u0010\u0000\u001a\u000e\u0012\u0004\u0012\u00020\u0002\u0012\u0004\u0012\u00020\u00020\u00012\u0006\u0010\u0003\u001a\u00020\u0002H\u0002¢\u0006\u0002\b\u0004\u001a\u0011\u0010\u0005\u001a\u00020\u0006*\u00020\u0002H\u0002¢\u0006\u0002\b\u0007\u001a\u0014\u0010\b\u001a\u00020\u0002*\u00020\u00022\b\b\u0002\u0010\u0003\u001a\u00020\u0002\u001aJ\u0010\t\u001a\u00020\u0002*\b\u0012\u0004\u0012\u00020\u00020\n2\u0006\u0010\u000b\u001a\u00020\u00062\u0012\u0010\f\u001a\u000e\u0012\u0004\u0012\u00020\u0002\u0012\u0004\u0012\u00020\u00020\u00012\u0014\u0010\r\u001a\u0010\u0012\u0004\u0012\u00020\u0002\u0012\u0006\u0012\u0004\u0018\u00010\u00020\u0001H\b¢\u0006\u0002\b\u000e\u001a\u0014\u0010\u000f\u001a\u00020\u0002*\u00020\u00022\b\b\u0002\u0010\u0010\u001a\u00020\u0002\u001a\u001e\u0010\u0011\u001a\u00020\u0002*\u00020\u00022\b\b\u0002\u0010\u0010\u001a\u00020\u00022\b\b\u0002\u0010\u0012\u001a\u00020\u0002\u001a\f\u0010\u0013\u001a\u00020\u0002*\u00020\u0002H\u0007\u001a\u0016\u0010\u0014\u001a\u00020\u0002*\u00020\u00022\b\b\u0002\u0010\u0012\u001a\u00020\u0002H\u0007¨\u0006\u0015"}, d2 = {"getIndentFunction", "Lkotlin/Function1;", "", "indent", "getIndentFunction$StringsKt__IndentKt", "indentWidth", "", "indentWidth$StringsKt__IndentKt", "prependIndent", "reindent", "", "resultSizeEstimate", "indentAddFunction", "indentCutFunction", "reindent$StringsKt__IndentKt", "replaceIndent", "newIndent", "replaceIndentByMargin", "marginPrefix", "trimIndent", "trimMargin", "kotlin-stdlib"}, k = 5, mv = {1, 9, 0}, xi = 49, xs = "kotlin/text/StringsKt")
/* compiled from: Indent.kt */
class StringsKt__IndentKt extends StringsKt__AppendableKt {
    public static /* synthetic */ String trimMargin$default(String str, String str2, int i, Object obj) {
        if ((i & 1) != 0) {
            str2 = "|";
        }
        return StringsKt.trimMargin(str, str2);
    }

    public static final String trimMargin(String $this$trimMargin, String marginPrefix) {
        Intrinsics.checkNotNullParameter($this$trimMargin, "<this>");
        Intrinsics.checkNotNullParameter(marginPrefix, "marginPrefix");
        return StringsKt.replaceIndentByMargin($this$trimMargin, "", marginPrefix);
    }

    public static /* synthetic */ String replaceIndentByMargin$default(String str, String str2, String str3, int i, Object obj) {
        if ((i & 1) != 0) {
            str2 = "";
        }
        if ((i & 2) != 0) {
            str3 = "|";
        }
        return StringsKt.replaceIndentByMargin(str, str2, str3);
    }

    public static final String replaceIndentByMargin(String $this$replaceIndentByMargin, String newIndent, String marginPrefix) {
        Collection destination$iv$iv$iv;
        String str;
        String invoke;
        String str2 = $this$replaceIndentByMargin;
        String str3 = marginPrefix;
        Intrinsics.checkNotNullParameter(str2, "<this>");
        String str4 = newIndent;
        Intrinsics.checkNotNullParameter(str4, "newIndent");
        Intrinsics.checkNotNullParameter(str3, "marginPrefix");
        if (!StringsKt.isBlank(str3)) {
            List lines = StringsKt.lines(str2);
            int resultSizeEstimate$iv = str2.length() + (str4.length() * lines.size());
            Function1 indentAddFunction$iv = getIndentFunction$StringsKt__IndentKt(str4);
            List $this$reindent$iv = lines;
            int lastIndex$iv = CollectionsKt.getLastIndex($this$reindent$iv);
            Collection destination$iv$iv$iv2 = new ArrayList();
            int index$iv$iv$iv$iv = 0;
            for (Object item$iv$iv$iv$iv : $this$reindent$iv) {
                int index$iv$iv$iv$iv2 = index$iv$iv$iv$iv + 1;
                if (index$iv$iv$iv$iv < 0) {
                    CollectionsKt.throwIndexOverflow();
                }
                int i = index$iv$iv$iv$iv;
                String value$iv = (String) item$iv$iv$iv$iv;
                if ((index$iv$iv$iv$iv == 0 || index$iv$iv$iv$iv == lastIndex$iv) && StringsKt.isBlank(value$iv)) {
                    destination$iv$iv$iv = destination$iv$iv$iv2;
                    value$iv = null;
                } else {
                    Collection destination$iv$iv$iv3 = destination$iv$iv$iv2;
                    String line = value$iv;
                    CharSequence $this$indexOfFirst$iv = line;
                    int length = $this$indexOfFirst$iv.length();
                    String line2 = line;
                    int index$iv = 0;
                    while (true) {
                        if (index$iv >= length) {
                            index$iv = -1;
                            break;
                        } else if (!CharsKt.isWhitespace($this$indexOfFirst$iv.charAt(index$iv))) {
                            break;
                        } else {
                            index$iv++;
                            String str5 = marginPrefix;
                        }
                    }
                    if (index$iv == -1) {
                        int i2 = index$iv$iv$iv$iv;
                        destination$iv$iv$iv = destination$iv$iv$iv3;
                        str = null;
                        String str6 = line2;
                    } else {
                        destination$iv$iv$iv = destination$iv$iv$iv3;
                        int i3 = index$iv$iv$iv$iv;
                        int firstNonWhitespaceIndex = index$iv;
                        String line3 = line2;
                        if (StringsKt.startsWith$default(line3, marginPrefix, firstNonWhitespaceIndex, false, 4, (Object) null)) {
                            Intrinsics.checkNotNull(line3, "null cannot be cast to non-null type java.lang.String");
                            str = line3.substring(marginPrefix.length() + firstNonWhitespaceIndex);
                            Intrinsics.checkNotNullExpressionValue(str, "substring(...)");
                        } else {
                            str = null;
                        }
                    }
                    if (!(str == null || (invoke = indentAddFunction$iv.invoke(str)) == null)) {
                        value$iv = invoke;
                    }
                }
                if (value$iv != null) {
                    destination$iv$iv$iv.add(value$iv);
                }
                String str7 = marginPrefix;
                destination$iv$iv$iv2 = destination$iv$iv$iv;
                index$iv$iv$iv$iv = index$iv$iv$iv$iv2;
                String str8 = $this$replaceIndentByMargin;
            }
            String sb = ((StringBuilder) CollectionsKt.joinTo$default((List) destination$iv$iv$iv2, new StringBuilder(resultSizeEstimate$iv), "\n", (CharSequence) null, (CharSequence) null, 0, (CharSequence) null, (Function1) null, 124, (Object) null)).toString();
            Intrinsics.checkNotNullExpressionValue(sb, "toString(...)");
            return sb;
        }
        throw new IllegalArgumentException("marginPrefix must be non-blank string.".toString());
    }

    public static final String trimIndent(String $this$trimIndent) {
        Intrinsics.checkNotNullParameter($this$trimIndent, "<this>");
        return StringsKt.replaceIndent($this$trimIndent, "");
    }

    public static /* synthetic */ String replaceIndent$default(String str, String str2, int i, Object obj) {
        if ((i & 1) != 0) {
            str2 = "";
        }
        return StringsKt.replaceIndent(str, str2);
    }

    /* JADX WARNING: Code restructure failed: missing block: B:23:0x00da, code lost:
        if (r0 == r8) goto L_0x00df;
     */
    /* JADX WARNING: Removed duplicated region for block: B:34:0x0109  */
    /* JADX WARNING: Removed duplicated region for block: B:45:0x0110 A[SYNTHETIC] */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final java.lang.String replaceIndent(java.lang.String r27, java.lang.String r28) {
        /*
            r0 = r27
            java.lang.String r1 = "<this>"
            kotlin.jvm.internal.Intrinsics.checkNotNullParameter(r0, r1)
            java.lang.String r1 = "newIndent"
            r2 = r28
            kotlin.jvm.internal.Intrinsics.checkNotNullParameter(r2, r1)
            r1 = r0
            java.lang.CharSequence r1 = (java.lang.CharSequence) r1
            java.util.List r1 = kotlin.text.StringsKt.lines(r1)
            r3 = r1
            java.lang.Iterable r3 = (java.lang.Iterable) r3
            r4 = 0
            java.util.ArrayList r5 = new java.util.ArrayList
            r5.<init>()
            java.util.Collection r5 = (java.util.Collection) r5
            r6 = r3
            r7 = 0
            java.util.Iterator r8 = r6.iterator()
        L_0x0027:
            boolean r9 = r8.hasNext()
            if (r9 == 0) goto L_0x0042
            java.lang.Object r9 = r8.next()
            r10 = r9
            java.lang.String r10 = (java.lang.String) r10
            r11 = 0
            r12 = r10
            java.lang.CharSequence r12 = (java.lang.CharSequence) r12
            boolean r12 = kotlin.text.StringsKt.isBlank(r12)
            if (r12 != 0) goto L_0x0027
            r5.add(r9)
            goto L_0x0027
        L_0x0042:
            java.util.List r5 = (java.util.List) r5
            java.lang.Iterable r5 = (java.lang.Iterable) r5
            r3 = 0
            java.util.ArrayList r4 = new java.util.ArrayList
            r6 = 10
            int r6 = kotlin.collections.CollectionsKt.collectionSizeOrDefault(r5, r6)
            r4.<init>(r6)
            java.util.Collection r4 = (java.util.Collection) r4
            r6 = r5
            r7 = 0
            java.util.Iterator r8 = r6.iterator()
        L_0x005d:
            boolean r9 = r8.hasNext()
            if (r9 == 0) goto L_0x0077
            java.lang.Object r9 = r8.next()
            r10 = r9
            java.lang.String r10 = (java.lang.String) r10
            r11 = 0
            int r10 = indentWidth$StringsKt__IndentKt(r10)
            java.lang.Integer r10 = java.lang.Integer.valueOf(r10)
            r4.add(r10)
            goto L_0x005d
        L_0x0077:
            java.util.List r4 = (java.util.List) r4
            java.lang.Iterable r4 = (java.lang.Iterable) r4
            java.lang.Comparable r3 = kotlin.collections.CollectionsKt.minOrNull(r4)
            java.lang.Integer r3 = (java.lang.Integer) r3
            if (r3 == 0) goto L_0x008a
            int r3 = r3.intValue()
            goto L_0x008b
        L_0x008a:
            r3 = 0
        L_0x008b:
            int r4 = r0.length()
            int r5 = r2.length()
            int r6 = r1.size()
            int r5 = r5 * r6
            int r4 = r4 + r5
            kotlin.jvm.functions.Function1 r5 = getIndentFunction$StringsKt__IndentKt(r2)
            r6 = r1
            r7 = 0
            int r8 = kotlin.collections.CollectionsKt.getLastIndex(r6)
            r9 = r6
            java.lang.Iterable r9 = (java.lang.Iterable) r9
            r10 = 0
            java.util.ArrayList r11 = new java.util.ArrayList
            r11.<init>()
            java.util.Collection r11 = (java.util.Collection) r11
            r12 = r9
            r13 = 0
            r14 = r12
            r15 = 0
            r16 = 0
            java.util.Iterator r17 = r14.iterator()
        L_0x00b9:
            boolean r18 = r17.hasNext()
            if (r18 == 0) goto L_0x0115
            java.lang.Object r18 = r17.next()
            int r19 = r16 + 1
            if (r16 >= 0) goto L_0x00ca
            kotlin.collections.CollectionsKt.throwIndexOverflow()
        L_0x00ca:
            r20 = r18
            r21 = 0
            r22 = r20
            java.lang.String r22 = (java.lang.String) r22
            r23 = r16
            r24 = 0
            if (r23 == 0) goto L_0x00dd
            r0 = r23
            if (r0 != r8) goto L_0x00ee
            goto L_0x00df
        L_0x00dd:
            r0 = r23
        L_0x00df:
            r23 = r22
            java.lang.CharSequence r23 = (java.lang.CharSequence) r23
            boolean r23 = kotlin.text.StringsKt.isBlank(r23)
            if (r23 == 0) goto L_0x00ee
            r23 = 0
            r22 = r23
            goto L_0x0107
        L_0x00ee:
            r23 = r22
            r25 = 0
            r26 = r0
            r0 = r23
            java.lang.String r0 = kotlin.text.StringsKt.drop((java.lang.String) r0, (int) r3)
            if (r0 == 0) goto L_0x0107
            java.lang.Object r0 = r5.invoke(r0)
            java.lang.String r0 = (java.lang.String) r0
            if (r0 != 0) goto L_0x0105
            goto L_0x0107
        L_0x0105:
            r22 = r0
        L_0x0107:
            if (r22 == 0) goto L_0x0110
            r0 = r22
            r22 = 0
            r11.add(r0)
        L_0x0110:
            r0 = r27
            r16 = r19
            goto L_0x00b9
        L_0x0115:
            r0 = r11
            java.util.List r0 = (java.util.List) r0
            r11 = r0
            java.lang.Iterable r11 = (java.lang.Iterable) r11
            java.lang.StringBuilder r0 = new java.lang.StringBuilder
            r0.<init>(r4)
            r12 = r0
            java.lang.Appendable r12 = (java.lang.Appendable) r12
            java.lang.String r0 = "\n"
            r13 = r0
            java.lang.CharSequence r13 = (java.lang.CharSequence) r13
            r19 = 124(0x7c, float:1.74E-43)
            r20 = 0
            r14 = 0
            r15 = 0
            r16 = 0
            r17 = 0
            r18 = 0
            java.lang.Appendable r0 = kotlin.collections.CollectionsKt.joinTo$default(r11, r12, r13, r14, r15, r16, r17, r18, r19, r20)
            java.lang.StringBuilder r0 = (java.lang.StringBuilder) r0
            java.lang.String r0 = r0.toString()
            java.lang.String r9 = "toString(...)"
            kotlin.jvm.internal.Intrinsics.checkNotNullExpressionValue(r0, r9)
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlin.text.StringsKt__IndentKt.replaceIndent(java.lang.String, java.lang.String):java.lang.String");
    }

    public static /* synthetic */ String prependIndent$default(String str, String str2, int i, Object obj) {
        if ((i & 1) != 0) {
            str2 = "    ";
        }
        return StringsKt.prependIndent(str, str2);
    }

    public static final String prependIndent(String $this$prependIndent, String indent) {
        Intrinsics.checkNotNullParameter($this$prependIndent, "<this>");
        Intrinsics.checkNotNullParameter(indent, "indent");
        return SequencesKt.joinToString$default(SequencesKt.map(StringsKt.lineSequence($this$prependIndent), new StringsKt__IndentKt$prependIndent$1(indent)), "\n", (CharSequence) null, (CharSequence) null, 0, (CharSequence) null, (Function1) null, 62, (Object) null);
    }

    private static final int indentWidth$StringsKt__IndentKt(String $this$indentWidth) {
        CharSequence $this$indexOfFirst$iv = $this$indentWidth;
        int index$iv = 0;
        int length = $this$indexOfFirst$iv.length();
        while (true) {
            if (index$iv >= length) {
                index$iv = -1;
                break;
            } else if (!CharsKt.isWhitespace($this$indexOfFirst$iv.charAt(index$iv))) {
                break;
            } else {
                index$iv++;
            }
        }
        return index$iv == -1 ? $this$indentWidth.length() : index$iv;
    }

    private static final Function1<String, String> getIndentFunction$StringsKt__IndentKt(String indent) {
        if (indent.length() == 0) {
            return StringsKt__IndentKt$getIndentFunction$1.INSTANCE;
        }
        return new StringsKt__IndentKt$getIndentFunction$2(indent);
    }

    /* JADX WARNING: Code restructure failed: missing block: B:13:0x004c, code lost:
        if (r0 == r1) goto L_0x0053;
     */
    /* JADX WARNING: Removed duplicated region for block: B:25:0x0089  */
    /* JADX WARNING: Removed duplicated region for block: B:32:0x008d A[SYNTHETIC] */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private static final java.lang.String reindent$StringsKt__IndentKt(java.util.List<java.lang.String> r20, int r21, kotlin.jvm.functions.Function1<? super java.lang.String, java.lang.String> r22, kotlin.jvm.functions.Function1<? super java.lang.String, java.lang.String> r23) {
        /*
            r0 = 0
            int r1 = kotlin.collections.CollectionsKt.getLastIndex(r20)
            r2 = r20
            java.lang.Iterable r2 = (java.lang.Iterable) r2
            r3 = 0
            java.util.ArrayList r4 = new java.util.ArrayList
            r4.<init>()
            java.util.Collection r4 = (java.util.Collection) r4
            r5 = r2
            r6 = 0
            r7 = r5
            r8 = 0
            r9 = 0
            java.util.Iterator r10 = r7.iterator()
        L_0x001a:
            boolean r11 = r10.hasNext()
            if (r11 == 0) goto L_0x0093
            java.lang.Object r11 = r10.next()
            int r12 = r9 + 1
            if (r9 >= 0) goto L_0x003d
            r13 = 3
            r14 = 0
            r15 = 1
            boolean r13 = kotlin.internal.PlatformImplementationsKt.apiVersionIsAtLeast(r15, r13, r14)
            if (r13 == 0) goto L_0x0035
            kotlin.collections.CollectionsKt.throwIndexOverflow()
            goto L_0x003d
        L_0x0035:
            java.lang.ArithmeticException r9 = new java.lang.ArithmeticException
            java.lang.String r10 = "Index overflow has happened."
            r9.<init>(r10)
            throw r9
        L_0x003d:
            r13 = r11
            r14 = 0
            r15 = r13
            java.lang.String r15 = (java.lang.String) r15
            r16 = r9
            r17 = 0
            if (r16 == 0) goto L_0x004f
            r18 = r0
            r0 = r16
            if (r0 != r1) goto L_0x0066
            goto L_0x0053
        L_0x004f:
            r18 = r0
            r0 = r16
        L_0x0053:
            r16 = r15
            java.lang.CharSequence r16 = (java.lang.CharSequence) r16
            boolean r16 = kotlin.text.StringsKt.isBlank(r16)
            if (r16 == 0) goto L_0x0066
            r16 = 0
            r19 = r1
            r15 = r16
            r1 = r22
            goto L_0x0087
        L_0x0066:
            r16 = r0
            r0 = r23
            java.lang.Object r19 = r0.invoke(r15)
            r0 = r19
            java.lang.String r0 = (java.lang.String) r0
            if (r0 == 0) goto L_0x0083
            r19 = r1
            r1 = r22
            java.lang.Object r0 = r1.invoke(r0)
            java.lang.String r0 = (java.lang.String) r0
            if (r0 != 0) goto L_0x0081
            goto L_0x0087
        L_0x0081:
            r15 = r0
            goto L_0x0087
        L_0x0083:
            r19 = r1
            r1 = r22
        L_0x0087:
            if (r15 == 0) goto L_0x008d
            r0 = 0
            r4.add(r15)
        L_0x008d:
            r9 = r12
            r0 = r18
            r1 = r19
            goto L_0x001a
        L_0x0093:
            r18 = r0
            r0 = r4
            java.util.List r0 = (java.util.List) r0
            r4 = r0
            java.lang.Iterable r4 = (java.lang.Iterable) r4
            java.lang.StringBuilder r0 = new java.lang.StringBuilder
            r2 = r21
            r0.<init>(r2)
            r5 = r0
            java.lang.Appendable r5 = (java.lang.Appendable) r5
            java.lang.String r0 = "\n"
            r6 = r0
            java.lang.CharSequence r6 = (java.lang.CharSequence) r6
            r12 = 124(0x7c, float:1.74E-43)
            r13 = 0
            r7 = 0
            r8 = 0
            r9 = 0
            r10 = 0
            r11 = 0
            java.lang.Appendable r0 = kotlin.collections.CollectionsKt.joinTo$default(r4, r5, r6, r7, r8, r9, r10, r11, r12, r13)
            java.lang.StringBuilder r0 = (java.lang.StringBuilder) r0
            java.lang.String r0 = r0.toString()
            java.lang.String r3 = "toString(...)"
            kotlin.jvm.internal.Intrinsics.checkNotNullExpressionValue(r0, r3)
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlin.text.StringsKt__IndentKt.reindent$StringsKt__IndentKt(java.util.List, int, kotlin.jvm.functions.Function1, kotlin.jvm.functions.Function1):java.lang.String");
    }
}
