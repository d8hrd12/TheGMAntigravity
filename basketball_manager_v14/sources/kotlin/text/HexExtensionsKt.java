package kotlin.text;

import java.util.Arrays;
import kotlin.KotlinNothingValueException;
import kotlin.Metadata;
import kotlin.UByte;
import kotlin.ULong;
import kotlin.collections.AbstractList;
import kotlin.collections.ArraysKt;
import kotlin.jvm.internal.Intrinsics;
import kotlin.ranges.RangesKt;
import kotlin.text.HexFormat;

@Metadata(d1 = {"\u0000v\n\u0000\n\u0002\u0010\u0015\n\u0002\b\u0007\n\u0002\u0010\u0016\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0010\t\n\u0002\b\u0002\n\u0002\u0010\b\n\u0002\b\u0013\n\u0002\u0010\u000b\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0002\b\b\n\u0002\u0010\u0012\n\u0002\b\u0002\n\u0002\u0010\u0019\n\u0002\b\u0004\n\u0002\u0010\u0005\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\b\n\u0002\u0010\n\n\u0002\b\u0005\n\u0002\u0010\u0001\n\u0002\b\t\n\u0002\u0018\u0002\n\u0002\b\u0007\u001a \u0010\r\u001a\u00020\u000e2\u0006\u0010\u000f\u001a\u00020\u000e2\u0006\u0010\u0010\u001a\u00020\u00112\u0006\u0010\u0012\u001a\u00020\u0011H\u0002\u001a\u0010\u0010\u0013\u001a\u00020\u00112\u0006\u0010\u0014\u001a\u00020\u000eH\u0002\u001a(\u0010\u0015\u001a\u00020\u00112\u0006\u0010\u0016\u001a\u00020\u00112\u0006\u0010\u0017\u001a\u00020\u00112\u0006\u0010\u0018\u001a\u00020\u00112\u0006\u0010\u0019\u001a\u00020\u0011H\u0002\u001a@\u0010\u0015\u001a\u00020\u00112\u0006\u0010\u0016\u001a\u00020\u00112\u0006\u0010\u001a\u001a\u00020\u00112\u0006\u0010\u001b\u001a\u00020\u00112\u0006\u0010\u001c\u001a\u00020\u00112\u0006\u0010\u0017\u001a\u00020\u00112\u0006\u0010\u0018\u001a\u00020\u00112\u0006\u0010\u0019\u001a\u00020\u0011H\u0000\u001a@\u0010\u001d\u001a\u00020\u00112\u0006\u0010\u001e\u001a\u00020\u00112\u0006\u0010\u001a\u001a\u00020\u00112\u0006\u0010\u001b\u001a\u00020\u00112\u0006\u0010\u001c\u001a\u00020\u00112\u0006\u0010\u0017\u001a\u00020\u00112\u0006\u0010\u0018\u001a\u00020\u00112\u0006\u0010\u0019\u001a\u00020\u0011H\u0000\u001a \u0010\u001f\u001a\u00020\u000e2\u0006\u0010\r\u001a\u00020\u000e2\u0006\u0010\u000f\u001a\u00020\u000e2\u0006\u0010\u0012\u001a\u00020\u0011H\u0002\u001a5\u0010 \u001a\u00020\u0011*\u00020\u000b2\u0006\u0010!\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010#\u001a\u00020\u000b2\u0006\u0010$\u001a\u00020%2\u0006\u0010&\u001a\u00020\u000bH\b\u001a\u001c\u0010'\u001a\u00020\u0011*\u00020\u000b2\u0006\u0010!\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u0011H\u0002\u001a$\u0010(\u001a\u00020)*\u00020\u000b2\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010+\u001a\u00020\u0011H\u0002\u001a<\u0010,\u001a\u00020)*\u00020\u000b2\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010-\u001a\u00020\u000b2\u0006\u0010.\u001a\u00020\u000b2\u0006\u0010$\u001a\u00020%2\u0006\u0010+\u001a\u00020\u0011H\u0002\u001a\u001c\u0010/\u001a\u00020)*\u00020\u000b2\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u0011H\u0002\u001a\u0015\u00100\u001a\u00020\u0011*\u00020\u000b2\u0006\u0010!\u001a\u00020\u0011H\b\u001a,\u00101\u001a\u00020\u0011*\u0002022\u0006\u0010!\u001a\u00020\u00112\u0006\u00103\u001a\u00020\u00012\u0006\u00104\u001a\u0002052\u0006\u00106\u001a\u00020\u0011H\u0002\u001a<\u00101\u001a\u00020\u0011*\u0002022\u0006\u0010!\u001a\u00020\u00112\u0006\u00107\u001a\u00020\u000b2\u0006\u00108\u001a\u00020\u000b2\u0006\u00103\u001a\u00020\u00012\u0006\u00104\u001a\u0002052\u0006\u00106\u001a\u00020\u0011H\u0002\u001a*\u00109\u001a\u00020:*\u00020\u000b2\b\b\u0002\u0010*\u001a\u00020\u00112\b\b\u0002\u0010\"\u001a\u00020\u00112\b\b\u0002\u0010;\u001a\u00020<H\u0003\u001a\u0016\u00109\u001a\u00020:*\u00020\u000b2\b\b\u0002\u0010;\u001a\u00020<H\u0007\u001a*\u0010=\u001a\u000202*\u00020\u000b2\b\b\u0002\u0010*\u001a\u00020\u00112\b\b\u0002\u0010\"\u001a\u00020\u00112\b\b\u0002\u0010;\u001a\u00020<H\u0003\u001a\u0016\u0010=\u001a\u000202*\u00020\u000b2\b\b\u0002\u0010;\u001a\u00020<H\u0007\u001a&\u0010>\u001a\u0004\u0018\u000102*\u00020\u000b2\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010?\u001a\u00020@H\u0003\u001a&\u0010A\u001a\u0004\u0018\u000102*\u00020\u000b2\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010?\u001a\u00020@H\u0003\u001a&\u0010B\u001a\u0004\u0018\u000102*\u00020\u000b2\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010?\u001a\u00020@H\u0003\u001a$\u0010C\u001a\u000202*\u00020\u000b2\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010?\u001a\u00020@H\u0003\u001a*\u0010D\u001a\u00020\u0011*\u00020\u000b2\b\b\u0002\u0010*\u001a\u00020\u00112\b\b\u0002\u0010\"\u001a\u00020\u00112\b\b\u0002\u0010;\u001a\u00020<H\u0003\u001a\u0016\u0010D\u001a\u00020\u0011*\u00020\u000b2\b\b\u0002\u0010;\u001a\u00020<H\u0007\u001a,\u0010E\u001a\u00020\u0011*\u00020\u000b2\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010;\u001a\u00020<2\u0006\u0010+\u001a\u00020\u0011H\u0003\u001a*\u0010F\u001a\u00020\u000e*\u00020\u000b2\b\b\u0002\u0010*\u001a\u00020\u00112\b\b\u0002\u0010\"\u001a\u00020\u00112\b\b\u0002\u0010;\u001a\u00020<H\u0001\u001a\u0016\u0010F\u001a\u00020\u000e*\u00020\u000b2\b\b\u0002\u0010;\u001a\u00020<H\u0007\u001a,\u0010G\u001a\u00020\u000e*\u00020\u000b2\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010;\u001a\u00020<2\u0006\u0010+\u001a\u00020\u0011H\u0003\u001a*\u0010H\u001a\u00020I*\u00020\u000b2\b\b\u0002\u0010*\u001a\u00020\u00112\b\b\u0002\u0010\"\u001a\u00020\u00112\b\b\u0002\u0010;\u001a\u00020<H\u0003\u001a\u0016\u0010H\u001a\u00020I*\u00020\u000b2\b\b\u0002\u0010;\u001a\u00020<H\u0007\u001a\u0015\u0010J\u001a\u00020\u000e*\u00020\u000b2\u0006\u0010!\u001a\u00020\u0011H\b\u001a\u0014\u0010K\u001a\u00020:*\u00020\u000b2\u0006\u0010!\u001a\u00020\u0011H\u0002\u001a\u001c\u0010L\u001a\u00020\u0011*\u00020\u000b2\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u0011H\u0002\u001a\u001c\u0010M\u001a\u00020\u000e*\u00020\u000b2\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u0011H\u0002\u001a\u0014\u0010N\u001a\u00020O*\u00020\u000b2\u0006\u0010!\u001a\u00020\u0011H\u0002\u001a,\u0010P\u001a\u00020)*\u00020\u000b2\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010Q\u001a\u00020\u000b2\u0006\u0010R\u001a\u00020\u0011H\u0002\u001a,\u0010S\u001a\u00020)*\u00020\u000b2\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010-\u001a\u00020\u000b2\u0006\u0010.\u001a\u00020\u000bH\u0002\u001a,\u0010T\u001a\u00020)*\u00020\u000b2\u0006\u0010!\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010#\u001a\u00020\u000b2\u0006\u0010&\u001a\u00020\u000bH\u0002\u001a\u001c\u0010U\u001a\u00020\u0011*\u00020\u000b2\u0006\u00104\u001a\u0002052\u0006\u00106\u001a\u00020\u0011H\u0002\u001a\u0016\u0010V\u001a\u00020\u000b*\u00020:2\b\b\u0002\u0010;\u001a\u00020<H\u0007\u001a*\u0010V\u001a\u00020\u000b*\u0002022\b\b\u0002\u0010*\u001a\u00020\u00112\b\b\u0002\u0010\"\u001a\u00020\u00112\b\b\u0002\u0010;\u001a\u00020<H\u0007\u001a\u0016\u0010V\u001a\u00020\u000b*\u0002022\b\b\u0002\u0010;\u001a\u00020<H\u0007\u001a\u0016\u0010V\u001a\u00020\u000b*\u00020\u00112\b\b\u0002\u0010;\u001a\u00020<H\u0007\u001a\u0016\u0010V\u001a\u00020\u000b*\u00020\u000e2\b\b\u0002\u0010;\u001a\u00020<H\u0007\u001a\u0016\u0010V\u001a\u00020\u000b*\u00020I2\b\b\u0002\u0010;\u001a\u00020<H\u0007\u001a$\u0010W\u001a\u00020\u000b*\u00020\u000e2\u0006\u0010X\u001a\u00020Y2\u0006\u0010Z\u001a\u00020\u000b2\u0006\u0010[\u001a\u00020\u0011H\u0003\u001a,\u0010\\\u001a\u00020\u000b*\u0002022\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010?\u001a\u00020@2\u0006\u00103\u001a\u00020\u0001H\u0003\u001a,\u0010]\u001a\u00020\u000b*\u0002022\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010?\u001a\u00020@2\u0006\u00103\u001a\u00020\u0001H\u0003\u001a,\u0010^\u001a\u00020\u000b*\u0002022\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010?\u001a\u00020@2\u0006\u00103\u001a\u00020\u0001H\u0003\u001a,\u0010_\u001a\u00020\u000b*\u0002022\u0006\u0010*\u001a\u00020\u00112\u0006\u0010\"\u001a\u00020\u00112\u0006\u0010?\u001a\u00020@2\u0006\u00103\u001a\u00020\u0001H\u0003\"\u001c\u0010\u0000\u001a\u00020\u00018\u0000X\u0004¢\u0006\u000e\n\u0000\u0012\u0004\b\u0002\u0010\u0003\u001a\u0004\b\u0004\u0010\u0005\"\u000e\u0010\u0006\u001a\u00020\u0001X\u0004¢\u0006\u0002\n\u0000\"\u000e\u0010\u0007\u001a\u00020\u0001X\u0004¢\u0006\u0002\n\u0000\"\u000e\u0010\b\u001a\u00020\tX\u0004¢\u0006\u0002\n\u0000\"\u000e\u0010\n\u001a\u00020\u000bXT¢\u0006\u0002\n\u0000\"\u000e\u0010\f\u001a\u00020\u000bXT¢\u0006\u0002\n\u0000¨\u0006`"}, d2 = {"BYTE_TO_LOWER_CASE_HEX_DIGITS", "", "getBYTE_TO_LOWER_CASE_HEX_DIGITS$annotations", "()V", "getBYTE_TO_LOWER_CASE_HEX_DIGITS", "()[I", "BYTE_TO_UPPER_CASE_HEX_DIGITS", "HEX_DIGITS_TO_DECIMAL", "HEX_DIGITS_TO_LONG_DECIMAL", "", "LOWER_CASE_HEX_DIGITS", "", "UPPER_CASE_HEX_DIGITS", "charsPerSet", "", "charsPerElement", "elementsPerSet", "", "elementSeparatorLength", "checkFormatLength", "formatLength", "formattedStringLength", "numberOfBytes", "byteSeparatorLength", "bytePrefixLength", "byteSuffixLength", "bytesPerLine", "bytesPerGroup", "groupSeparatorLength", "parsedByteArrayMaxSize", "stringLength", "wholeElementsPerSet", "checkContainsAt", "index", "endIndex", "part", "ignoreCase", "", "partName", "checkNewLineAt", "checkNumberOfDigits", "", "startIndex", "typeHexLength", "checkPrefixSuffixNumberOfDigits", "prefix", "suffix", "checkZeroDigits", "decimalFromHexDigitAt", "formatByteAt", "", "byteToDigits", "destination", "", "destinationOffset", "bytePrefix", "byteSuffix", "hexToByte", "", "format", "Lkotlin/text/HexFormat;", "hexToByteArray", "hexToByteArrayNoLineAndGroupSeparator", "bytesFormat", "Lkotlin/text/HexFormat$BytesHexFormat;", "hexToByteArrayNoLineAndGroupSeparatorSlowPath", "hexToByteArrayShortByteSeparatorNoPrefixAndSuffix", "hexToByteArraySlowPath", "hexToInt", "hexToIntImpl", "hexToLong", "hexToLongImpl", "hexToShort", "", "longDecimalFromHexDigitAt", "parseByteAt", "parseInt", "parseLong", "throwInvalidDigitAt", "", "throwInvalidNumberOfDigits", "specifier", "expected", "throwInvalidPrefixSuffix", "throwNotContainedAt", "toCharArrayIfNotEmpty", "toHexString", "toHexStringImpl", "numberFormat", "Lkotlin/text/HexFormat$NumberHexFormat;", "digits", "bits", "toHexStringNoLineAndGroupSeparator", "toHexStringNoLineAndGroupSeparatorSlowPath", "toHexStringShortByteSeparatorNoPrefixAndSuffix", "toHexStringSlowPath", "kotlin-stdlib"}, k = 2, mv = {1, 9, 0}, xi = 48)
/* compiled from: HexExtensions.kt */
public final class HexExtensionsKt {
    private static final int[] BYTE_TO_LOWER_CASE_HEX_DIGITS;
    private static final int[] BYTE_TO_UPPER_CASE_HEX_DIGITS;
    private static final int[] HEX_DIGITS_TO_DECIMAL;
    private static final long[] HEX_DIGITS_TO_LONG_DECIMAL;
    private static final String LOWER_CASE_HEX_DIGITS = "0123456789abcdef";
    private static final String UPPER_CASE_HEX_DIGITS = "0123456789ABCDEF";

    public static /* synthetic */ void getBYTE_TO_LOWER_CASE_HEX_DIGITS$annotations() {
    }

    /*  JADX ERROR: NullPointerException in pass: CodeShrinkVisitor
        java.lang.NullPointerException
        */
    static {
        /*
            r0 = 256(0x100, float:3.59E-43)
            int[] r1 = new int[r0]
            r2 = 0
            r3 = r2
        L_0x0006:
            java.lang.String r4 = "0123456789abcdef"
            if (r3 >= r0) goto L_0x001e
            int r5 = r3 >> 4
            char r5 = r4.charAt(r5)
            int r5 = r5 << 8
            r6 = r3 & 15
            char r4 = r4.charAt(r6)
            r4 = r4 | r5
            r1[r3] = r4
            int r3 = r3 + 1
            goto L_0x0006
        L_0x001e:
            BYTE_TO_LOWER_CASE_HEX_DIGITS = r1
            int[] r1 = new int[r0]
            r3 = r2
        L_0x0023:
            java.lang.String r5 = "0123456789ABCDEF"
            if (r3 >= r0) goto L_0x003b
            int r6 = r3 >> 4
            char r6 = r5.charAt(r6)
            int r6 = r6 << 8
            r7 = r3 & 15
            char r5 = r5.charAt(r7)
            r5 = r5 | r6
            r1[r3] = r5
            int r3 = r3 + 1
            goto L_0x0023
        L_0x003b:
            BYTE_TO_UPPER_CASE_HEX_DIGITS = r1
            int[] r1 = new int[r0]
            r3 = r2
        L_0x0040:
            if (r3 >= r0) goto L_0x0048
            r6 = -1
            r1[r3] = r6
            int r3 = r3 + 1
            goto L_0x0040
        L_0x0048:
            r3 = r1
            r6 = 0
            r7 = r4
            java.lang.CharSequence r7 = (java.lang.CharSequence) r7
            r8 = 0
            r9 = 0
            r10 = r2
        L_0x0050:
            int r11 = r7.length()
            if (r10 >= r11) goto L_0x0065
            char r11 = r7.charAt(r10)
            int r12 = r9 + 1
            r13 = r11
            r14 = 0
            r3[r13] = r9
            int r10 = r10 + 1
            r9 = r12
            goto L_0x0050
        L_0x0065:
            r7 = r5
            java.lang.CharSequence r7 = (java.lang.CharSequence) r7
            r8 = 0
            r9 = 0
            r10 = r2
        L_0x006c:
            int r11 = r7.length()
            if (r10 >= r11) goto L_0x0081
            char r11 = r7.charAt(r10)
            int r12 = r9 + 1
            r13 = r11
            r14 = 0
            r3[r13] = r9
            int r10 = r10 + 1
            r9 = r12
            goto L_0x006c
        L_0x0081:
            HEX_DIGITS_TO_DECIMAL = r1
            long[] r1 = new long[r0]
            r3 = r2
        L_0x0088:
            if (r3 >= r0) goto L_0x0091
            r6 = -1
            r1[r3] = r6
            int r3 = r3 + 1
            goto L_0x0088
        L_0x0091:
            r0 = r1
            r3 = 0
            java.lang.CharSequence r4 = (java.lang.CharSequence) r4
            r6 = 0
            r7 = 0
            r8 = r2
        L_0x0098:
            int r9 = r4.length()
            if (r8 >= r9) goto L_0x00ae
            char r9 = r4.charAt(r8)
            int r10 = r7 + 1
            r11 = r9
            r12 = 0
            long r13 = (long) r7
            r0[r11] = r13
            int r8 = r8 + 1
            r7 = r10
            goto L_0x0098
        L_0x00ae:
            r4 = r5
            java.lang.CharSequence r4 = (java.lang.CharSequence) r4
            r5 = 0
            r6 = 0
        L_0x00b5:
            int r7 = r4.length()
            if (r2 >= r7) goto L_0x00cb
            char r7 = r4.charAt(r2)
            int r8 = r6 + 1
            r9 = r7
            r10 = 0
            long r11 = (long) r6
            r0[r9] = r11
            int r2 = r2 + 1
            r6 = r8
            goto L_0x00b5
        L_0x00cb:
            HEX_DIGITS_TO_LONG_DECIMAL = r1
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlin.text.HexExtensionsKt.<clinit>():void");
    }

    public static final int[] getBYTE_TO_LOWER_CASE_HEX_DIGITS() {
        return BYTE_TO_LOWER_CASE_HEX_DIGITS;
    }

    public static final String toHexString(byte[] $this$toHexString, HexFormat format) {
        Intrinsics.checkNotNullParameter($this$toHexString, "<this>");
        Intrinsics.checkNotNullParameter(format, "format");
        return toHexString($this$toHexString, 0, $this$toHexString.length, format);
    }

    public static /* synthetic */ String toHexString$default(byte[] bArr, HexFormat hexFormat, int i, Object obj) {
        if ((i & 1) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return toHexString(bArr, hexFormat);
    }

    public static /* synthetic */ String toHexString$default(byte[] bArr, int i, int i2, HexFormat hexFormat, int i3, Object obj) {
        if ((i3 & 1) != 0) {
            i = 0;
        }
        if ((i3 & 2) != 0) {
            i2 = bArr.length;
        }
        if ((i3 & 4) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return toHexString(bArr, i, i2, hexFormat);
    }

    public static final String toHexString(byte[] $this$toHexString, int startIndex, int endIndex, HexFormat format) {
        Intrinsics.checkNotNullParameter($this$toHexString, "<this>");
        Intrinsics.checkNotNullParameter(format, "format");
        AbstractList.Companion.checkBoundsIndexes$kotlin_stdlib(startIndex, endIndex, $this$toHexString.length);
        if (startIndex == endIndex) {
            return "";
        }
        int[] byteToDigits = format.getUpperCase() ? BYTE_TO_UPPER_CASE_HEX_DIGITS : BYTE_TO_LOWER_CASE_HEX_DIGITS;
        HexFormat.BytesHexFormat bytesFormat = format.getBytes();
        if (bytesFormat.getNoLineAndGroupSeparator$kotlin_stdlib()) {
            return toHexStringNoLineAndGroupSeparator($this$toHexString, startIndex, endIndex, bytesFormat, byteToDigits);
        }
        return toHexStringSlowPath($this$toHexString, startIndex, endIndex, bytesFormat, byteToDigits);
    }

    private static final String toHexStringNoLineAndGroupSeparator(byte[] $this$toHexStringNoLineAndGroupSeparator, int startIndex, int endIndex, HexFormat.BytesHexFormat bytesFormat, int[] byteToDigits) {
        if (bytesFormat.getShortByteSeparatorNoPrefixAndSuffix$kotlin_stdlib()) {
            return toHexStringShortByteSeparatorNoPrefixAndSuffix($this$toHexStringNoLineAndGroupSeparator, startIndex, endIndex, bytesFormat, byteToDigits);
        }
        return toHexStringNoLineAndGroupSeparatorSlowPath($this$toHexStringNoLineAndGroupSeparator, startIndex, endIndex, bytesFormat, byteToDigits);
    }

    private static final String toHexStringShortByteSeparatorNoPrefixAndSuffix(byte[] $this$toHexStringShortByteSeparatorNoPrefixAndSuffix, int startIndex, int endIndex, HexFormat.BytesHexFormat bytesFormat, int[] byteToDigits) {
        int byteSeparatorLength = bytesFormat.getByteSeparator().length();
        boolean z = true;
        if (byteSeparatorLength > 1) {
            z = false;
        }
        if (z) {
            int numberOfBytes = endIndex - startIndex;
            int charIndex = 0;
            if (byteSeparatorLength == 0) {
                char[] charArray = new char[checkFormatLength(((long) numberOfBytes) * 2)];
                for (int byteIndex = startIndex; byteIndex < endIndex; byteIndex++) {
                    charIndex = formatByteAt($this$toHexStringShortByteSeparatorNoPrefixAndSuffix, byteIndex, byteToDigits, charArray, charIndex);
                }
                return StringsKt.concatToString(charArray);
            }
            char[] charArray2 = new char[checkFormatLength((((long) numberOfBytes) * 3) - 1)];
            char byteSeparatorChar = bytesFormat.getByteSeparator().charAt(0);
            int charIndex2 = formatByteAt($this$toHexStringShortByteSeparatorNoPrefixAndSuffix, startIndex, byteToDigits, charArray2, 0);
            for (int byteIndex2 = startIndex + 1; byteIndex2 < endIndex; byteIndex2++) {
                charArray2[charIndex2] = byteSeparatorChar;
                charIndex2 = formatByteAt($this$toHexStringShortByteSeparatorNoPrefixAndSuffix, byteIndex2, byteToDigits, charArray2, charIndex2 + 1);
            }
            return StringsKt.concatToString(charArray2);
        }
        throw new IllegalArgumentException("Failed requirement.".toString());
    }

    private static final String toHexStringNoLineAndGroupSeparatorSlowPath(byte[] $this$toHexStringNoLineAndGroupSeparatorSlowPath, int startIndex, int endIndex, HexFormat.BytesHexFormat bytesFormat, int[] byteToDigits) {
        String bytePrefix = bytesFormat.getBytePrefix();
        String byteSuffix = bytesFormat.getByteSuffix();
        String byteSeparator = bytesFormat.getByteSeparator();
        char[] charArray = new char[formattedStringLength(endIndex - startIndex, byteSeparator.length(), bytePrefix.length(), byteSuffix.length())];
        byte[] $this$toHexStringNoLineAndGroupSeparatorSlowPath2 = $this$toHexStringNoLineAndGroupSeparatorSlowPath;
        int[] byteToDigits2 = byteToDigits;
        int charIndex = formatByteAt($this$toHexStringNoLineAndGroupSeparatorSlowPath2, startIndex, bytePrefix, byteSuffix, byteToDigits2, charArray, 0);
        for (int byteIndex = startIndex + 1; byteIndex < endIndex; byteIndex++) {
            charIndex = formatByteAt($this$toHexStringNoLineAndGroupSeparatorSlowPath2, byteIndex, bytePrefix, byteSuffix, byteToDigits2, charArray, toCharArrayIfNotEmpty(byteSeparator, charArray, charIndex));
        }
        return StringsKt.concatToString(charArray);
    }

    private static final String toHexStringSlowPath(byte[] $this$toHexStringSlowPath, int startIndex, int endIndex, HexFormat.BytesHexFormat bytesFormat, int[] byteToDigits) {
        boolean z;
        int indexInGroup;
        int charIndex;
        int i = endIndex;
        int bytesPerLine = bytesFormat.getBytesPerLine();
        int bytesPerGroup = bytesFormat.getBytesPerGroup();
        String byteSuffix = bytesFormat.getBytePrefix();
        String byteSuffix2 = bytesFormat.getByteSuffix();
        String byteSeparator = bytesFormat.getByteSeparator();
        String groupSeparator = bytesFormat.getGroupSeparator();
        int formatLength = formattedStringLength(i - startIndex, bytesPerLine, bytesPerGroup, groupSeparator.length(), byteSeparator.length(), byteSuffix.length(), byteSuffix2.length());
        String bytePrefix = byteSuffix2;
        char[] charArray = new char[formatLength];
        int charIndex2 = 0;
        int indexInLine = 0;
        int indexInGroup2 = 0;
        int charIndex3 = startIndex;
        while (true) {
            z = true;
            if (charIndex3 >= i) {
                break;
            }
            if (indexInLine == bytesPerLine) {
                charArray[charIndex2] = 10;
                indexInGroup = 0;
                charIndex2++;
                charIndex = 0;
            } else if (indexInGroup2 == bytesPerGroup) {
                charIndex2 = toCharArrayIfNotEmpty(groupSeparator, charArray, charIndex2);
                charIndex = indexInLine;
                indexInGroup = 0;
            } else {
                charIndex = indexInLine;
                indexInGroup = indexInGroup2;
            }
            if (indexInGroup != 0) {
                charIndex2 = toCharArrayIfNotEmpty(byteSeparator, charArray, charIndex2);
            }
            String bytePrefix2 = byteSuffix;
            int byteIndex = charIndex3;
            int charIndex4 = formatByteAt($this$toHexStringSlowPath, byteIndex, bytePrefix2, bytePrefix, byteToDigits, charArray, charIndex2);
            int byteIndex2 = byteIndex;
            String byteSuffix3 = bytePrefix;
            String bytePrefix3 = bytePrefix2;
            indexInGroup2 = indexInGroup + 1;
            indexInLine = charIndex + 1;
            int i2 = charIndex4;
            charIndex3 = byteIndex2 + 1;
            charIndex2 = i2;
            String str = byteSuffix3;
            byteSuffix = bytePrefix3;
            bytePrefix = str;
        }
        String str2 = byteSuffix;
        String byteSuffix4 = str2;
        int i3 = charIndex3;
        if (charIndex2 != formatLength) {
            z = false;
        }
        if (z) {
            return StringsKt.concatToString(charArray);
        }
        throw new IllegalStateException("Check failed.".toString());
    }

    private static final int formatByteAt(byte[] $this$formatByteAt, int index, String bytePrefix, String byteSuffix, int[] byteToDigits, char[] destination, int destinationOffset) {
        return toCharArrayIfNotEmpty(byteSuffix, destination, formatByteAt($this$formatByteAt, index, byteToDigits, destination, toCharArrayIfNotEmpty(bytePrefix, destination, destinationOffset)));
    }

    private static final int formatByteAt(byte[] $this$formatByteAt, int index, int[] byteToDigits, char[] destination, int destinationOffset) {
        int byteDigits = byteToDigits[$this$formatByteAt[index] & 255];
        destination[destinationOffset] = (char) (byteDigits >> 8);
        destination[destinationOffset + 1] = (char) (byteDigits & 255);
        return destinationOffset + 2;
    }

    private static final int formattedStringLength(int numberOfBytes, int byteSeparatorLength, int bytePrefixLength, int byteSuffixLength) {
        if (numberOfBytes > 0) {
            return checkFormatLength((((long) numberOfBytes) * (((((long) bytePrefixLength) + 2) + ((long) byteSuffixLength)) + ((long) byteSeparatorLength))) - ((long) byteSeparatorLength));
        }
        throw new IllegalArgumentException("Failed requirement.".toString());
    }

    public static final int formattedStringLength(int numberOfBytes, int bytesPerLine, int bytesPerGroup, int groupSeparatorLength, int byteSeparatorLength, int bytePrefixLength, int byteSuffixLength) {
        int i = numberOfBytes;
        if (i > 0) {
            int lineSeparators = (i - 1) / bytesPerLine;
            int groupSeparatorsPerLine = (bytesPerLine - 1) / bytesPerGroup;
            int it = i % bytesPerLine;
            if (it == 0) {
                it = bytesPerLine;
            }
            int groupSeparators = (lineSeparators * groupSeparatorsPerLine) + ((it - 1) / bytesPerGroup);
            return checkFormatLength(((long) lineSeparators) + (((long) groupSeparators) * ((long) groupSeparatorLength)) + (((long) (((i - 1) - lineSeparators) - groupSeparators)) * ((long) byteSeparatorLength)) + (((long) i) * (((long) bytePrefixLength) + 2 + ((long) byteSuffixLength))));
        }
        int i2 = groupSeparatorLength;
        int i3 = byteSeparatorLength;
        int i4 = bytePrefixLength;
        int i5 = byteSuffixLength;
        throw new IllegalArgumentException("Failed requirement.".toString());
    }

    private static final int checkFormatLength(long formatLength) {
        boolean z = false;
        if (0 <= formatLength && formatLength <= 2147483647L) {
            z = true;
        }
        if (z) {
            return (int) formatLength;
        }
        throw new IllegalArgumentException("The resulting string length is too big: " + ULong.m321toStringimpl(ULong.m275constructorimpl(formatLength)));
    }

    public static final byte[] hexToByteArray(String $this$hexToByteArray, HexFormat format) {
        Intrinsics.checkNotNullParameter($this$hexToByteArray, "<this>");
        Intrinsics.checkNotNullParameter(format, "format");
        return hexToByteArray($this$hexToByteArray, 0, $this$hexToByteArray.length(), format);
    }

    public static /* synthetic */ byte[] hexToByteArray$default(String str, HexFormat hexFormat, int i, Object obj) {
        if ((i & 1) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return hexToByteArray(str, hexFormat);
    }

    static /* synthetic */ byte[] hexToByteArray$default(String str, int i, int i2, HexFormat hexFormat, int i3, Object obj) {
        if ((i3 & 1) != 0) {
            i = 0;
        }
        if ((i3 & 2) != 0) {
            i2 = str.length();
        }
        if ((i3 & 4) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return hexToByteArray(str, i, i2, hexFormat);
    }

    private static final byte[] hexToByteArray(String $this$hexToByteArray, int startIndex, int endIndex, HexFormat format) {
        byte[] it;
        AbstractList.Companion.checkBoundsIndexes$kotlin_stdlib(startIndex, endIndex, $this$hexToByteArray.length());
        if (startIndex == endIndex) {
            return new byte[0];
        }
        HexFormat.BytesHexFormat bytesFormat = format.getBytes();
        if (!bytesFormat.getNoLineAndGroupSeparator$kotlin_stdlib() || (it = hexToByteArrayNoLineAndGroupSeparator($this$hexToByteArray, startIndex, endIndex, bytesFormat)) == null) {
            return hexToByteArraySlowPath($this$hexToByteArray, startIndex, endIndex, bytesFormat);
        }
        return it;
    }

    private static final byte[] hexToByteArrayNoLineAndGroupSeparator(String $this$hexToByteArrayNoLineAndGroupSeparator, int startIndex, int endIndex, HexFormat.BytesHexFormat bytesFormat) {
        if (bytesFormat.getShortByteSeparatorNoPrefixAndSuffix$kotlin_stdlib()) {
            return hexToByteArrayShortByteSeparatorNoPrefixAndSuffix($this$hexToByteArrayNoLineAndGroupSeparator, startIndex, endIndex, bytesFormat);
        }
        return hexToByteArrayNoLineAndGroupSeparatorSlowPath($this$hexToByteArrayNoLineAndGroupSeparator, startIndex, endIndex, bytesFormat);
    }

    private static final byte[] hexToByteArrayShortByteSeparatorNoPrefixAndSuffix(String $this$hexToByteArrayShortByteSeparatorNoPrefixAndSuffix, int startIndex, int endIndex, HexFormat.BytesHexFormat bytesFormat) {
        int byteSeparatorLength;
        String str = $this$hexToByteArrayShortByteSeparatorNoPrefixAndSuffix;
        int i = endIndex;
        int byteSeparatorLength2 = bytesFormat.getByteSeparator().length();
        boolean z = false;
        boolean z2 = true;
        if (byteSeparatorLength2 <= 1) {
            int numberOfChars = i - startIndex;
            int charIndex = 0;
            if (byteSeparatorLength2 == 0) {
                if ((numberOfChars & 1) != 0) {
                    return null;
                }
                int numberOfBytes = numberOfChars >> 1;
                byte[] byteArray = new byte[numberOfBytes];
                for (int byteIndex = 0; byteIndex < numberOfBytes; byteIndex++) {
                    byteArray[byteIndex] = parseByteAt(str, charIndex);
                    charIndex += 2;
                }
                return byteArray;
            } else if (numberOfChars % 3 != 2) {
                return null;
            } else {
                int numberOfBytes2 = (numberOfChars / 3) + 1;
                byte[] byteArray2 = new byte[numberOfBytes2];
                char byteSeparatorChar = bytesFormat.getByteSeparator().charAt(0);
                byteArray2[0] = parseByteAt(str, 0);
                int charIndex2 = 0 + 2;
                int byteIndex2 = 1;
                while (byteIndex2 < numberOfBytes2) {
                    if (str.charAt(charIndex2) != byteSeparatorChar) {
                        String part$iv = bytesFormat.getByteSeparator();
                        boolean ignoreCase$iv = bytesFormat.getIgnoreCase$kotlin_stdlib();
                        String $this$checkContainsAt$iv = $this$hexToByteArrayShortByteSeparatorNoPrefixAndSuffix;
                        if (!(part$iv.length() == 0 ? z2 : z)) {
                            int length = part$iv.length();
                            int i$iv = 0;
                            while (i$iv < length) {
                                int byteSeparatorLength3 = byteSeparatorLength2;
                                int i2 = length;
                                if (!CharsKt.equals(part$iv.charAt(i$iv), $this$checkContainsAt$iv.charAt(charIndex2 + i$iv), ignoreCase$iv)) {
                                    throwNotContainedAt($this$checkContainsAt$iv, charIndex2, i, part$iv, "byte separator");
                                }
                                i$iv++;
                                byteSeparatorLength2 = byteSeparatorLength3;
                                length = i2;
                            }
                            byteSeparatorLength = byteSeparatorLength2;
                            part$iv.length();
                        } else {
                            byteSeparatorLength = byteSeparatorLength2;
                        }
                    } else {
                        byteSeparatorLength = byteSeparatorLength2;
                    }
                    byteArray2[byteIndex2] = parseByteAt(str, charIndex2 + 1);
                    charIndex2 += 3;
                    byteIndex2++;
                    byteSeparatorLength2 = byteSeparatorLength;
                    z = false;
                    z2 = true;
                }
                return byteArray2;
            }
        } else {
            int i3 = byteSeparatorLength2;
            throw new IllegalArgumentException("Failed requirement.".toString());
        }
    }

    private static final byte[] hexToByteArrayNoLineAndGroupSeparatorSlowPath(String $this$hexToByteArrayNoLineAndGroupSeparatorSlowPath, int startIndex, int endIndex, HexFormat.BytesHexFormat bytesFormat) {
        int byteSeparatorLength;
        int byteIndex;
        String bytePrefix;
        String byteSeparator;
        String str = $this$hexToByteArrayNoLineAndGroupSeparatorSlowPath;
        int i = endIndex;
        String bytePrefix2 = bytesFormat.getBytePrefix();
        String byteSuffix = bytesFormat.getByteSuffix();
        String byteSeparator2 = bytesFormat.getByteSeparator();
        int byteSeparatorLength2 = byteSeparator2.length();
        long charsPerByte = ((long) bytePrefix2.length()) + 2 + ((long) byteSuffix.length()) + ((long) byteSeparatorLength2);
        long numberOfChars = (long) (i - startIndex);
        int numberOfBytes = (int) ((((long) byteSeparatorLength2) + numberOfChars) / charsPerByte);
        if ((((long) numberOfBytes) * charsPerByte) - ((long) byteSeparatorLength2) != numberOfChars) {
            return null;
        }
        boolean ignoreCase = bytesFormat.getIgnoreCase$kotlin_stdlib();
        byte[] byteArray = new byte[numberOfBytes];
        int charIndex = startIndex;
        String $this$checkContainsAt$iv = $this$hexToByteArrayNoLineAndGroupSeparatorSlowPath;
        boolean z = false;
        if (bytePrefix2.length() == 0) {
            int i2 = byteSeparatorLength2;
            long j = charsPerByte;
            byteSeparatorLength = charIndex;
        } else {
            int i3 = byteSeparatorLength2;
            int byteSeparatorLength3 = bytePrefix2.length();
            long j2 = charsPerByte;
            int i$iv = 0;
            while (i$iv < byteSeparatorLength3) {
                int i4 = byteSeparatorLength3;
                if (!CharsKt.equals(bytePrefix2.charAt(i$iv), $this$checkContainsAt$iv.charAt(charIndex + i$iv), ignoreCase)) {
                    throwNotContainedAt($this$checkContainsAt$iv, charIndex, i, bytePrefix2, "byte prefix");
                }
                i$iv++;
                byteSeparatorLength3 = i4;
            }
            byteSeparatorLength = bytePrefix2.length() + charIndex;
        }
        String between = byteSuffix + byteSeparator2 + bytePrefix2;
        int byteIndex2 = 0;
        int i5 = numberOfBytes - 1;
        while (byteIndex2 < i5) {
            byteArray[byteIndex2] = parseByteAt(str, byteSeparatorLength);
            int index$iv = byteSeparatorLength + 2;
            String $this$checkContainsAt$iv2 = $this$hexToByteArrayNoLineAndGroupSeparatorSlowPath;
            if (between.length() == 0) {
                bytePrefix = bytePrefix2;
                byteSeparator = byteSeparator2;
                byteIndex = byteIndex2;
            } else {
                bytePrefix = bytePrefix2;
                int length = between.length();
                byteSeparator = byteSeparator2;
                int i$iv2 = 0;
                while (i$iv2 < length) {
                    int i6 = length;
                    int i$iv3 = i$iv2;
                    int byteIndex3 = byteIndex2;
                    String $this$checkContainsAt$iv3 = $this$checkContainsAt$iv2;
                    if (!CharsKt.equals(between.charAt(i$iv2), $this$checkContainsAt$iv3.charAt(index$iv + i$iv3), ignoreCase)) {
                        throwNotContainedAt($this$checkContainsAt$iv3, index$iv, i, between, "byte suffix + byte separator + byte prefix");
                    }
                    i$iv2 = i$iv3 + 1;
                    $this$checkContainsAt$iv2 = $this$checkContainsAt$iv3;
                    length = i6;
                    byteIndex2 = byteIndex3;
                }
                int i7 = i$iv2;
                byteIndex = byteIndex2;
                String str2 = $this$checkContainsAt$iv2;
                index$iv = between.length() + index$iv;
            }
            byteSeparatorLength = index$iv;
            byteIndex2 = byteIndex + 1;
            byteSeparator2 = byteSeparator;
            bytePrefix2 = bytePrefix;
        }
        String str3 = byteSeparator2;
        int i8 = byteIndex2;
        byteArray[numberOfBytes - 1] = parseByteAt(str, byteSeparatorLength);
        int index$iv2 = byteSeparatorLength + 2;
        String $this$checkContainsAt$iv4 = $this$hexToByteArrayNoLineAndGroupSeparatorSlowPath;
        if (byteSuffix.length() == 0) {
            z = true;
        }
        if (!z) {
            int i$iv4 = 0;
            int length2 = byteSuffix.length();
            while (i$iv4 < length2) {
                int charIndex2 = byteSeparatorLength;
                if (!CharsKt.equals(byteSuffix.charAt(i$iv4), $this$checkContainsAt$iv4.charAt(index$iv2 + i$iv4), ignoreCase)) {
                    throwNotContainedAt($this$checkContainsAt$iv4, index$iv2, i, byteSuffix, "byte suffix");
                }
                i$iv4++;
                String str4 = $this$hexToByteArrayNoLineAndGroupSeparatorSlowPath;
                byteSeparatorLength = charIndex2;
            }
            int charIndex3 = byteSeparatorLength;
            byteSuffix.length();
        } else {
            int charIndex4 = byteSeparatorLength;
        }
        return byteArray;
    }

    private static final byte[] hexToByteArraySlowPath(String $this$hexToByteArraySlowPath, int startIndex, int endIndex, HexFormat.BytesHexFormat bytesFormat) {
        int bytesPerGroup;
        int parseMaxSize;
        int bytesPerLine;
        int indexInLine;
        int $i$f$checkContainsAt;
        int byteIndex;
        int indexInLine2;
        int $i$f$checkContainsAt2;
        int bytesPerLine2;
        String partName$iv;
        String str = $this$hexToByteArraySlowPath;
        int i = endIndex;
        int bytesPerLine3 = bytesFormat.getBytesPerLine();
        int bytesPerGroup2 = bytesFormat.getBytesPerGroup();
        String bytePrefix = bytesFormat.getBytePrefix();
        String byteSuffix = bytesFormat.getByteSuffix();
        String byteSeparator = bytesFormat.getByteSeparator();
        String groupSeparator = bytesFormat.getGroupSeparator();
        boolean ignoreCase = bytesFormat.getIgnoreCase$kotlin_stdlib();
        int parseMaxSize2 = parsedByteArrayMaxSize(i - startIndex, bytesPerLine3, bytesPerGroup2, groupSeparator.length(), byteSeparator.length(), bytePrefix.length(), byteSuffix.length());
        byte[] byteArray = new byte[parseMaxSize2];
        int charIndex = startIndex;
        int byteIndex2 = 0;
        int indexInLine3 = 0;
        int indexInGroup = 0;
        while (charIndex < i) {
            if (indexInLine3 == bytesPerLine3) {
                charIndex = checkNewLineAt(str, charIndex, i);
                indexInLine3 = 0;
                indexInGroup = 0;
                parseMaxSize = parseMaxSize2;
                bytesPerLine = bytesPerLine3;
                bytesPerGroup = bytesPerGroup2;
            } else if (indexInGroup == bytesPerGroup2) {
                String $this$checkContainsAt$iv = $this$hexToByteArraySlowPath;
                String partName$iv2 = "group separator";
                if (groupSeparator.length() == 0) {
                    parseMaxSize = parseMaxSize2;
                    bytesPerLine = bytesPerLine3;
                    bytesPerGroup = bytesPerGroup2;
                    bytesPerLine2 = charIndex;
                } else {
                    int length = groupSeparator.length();
                    parseMaxSize = parseMaxSize2;
                    int i$iv = 0;
                    while (i$iv < length) {
                        int bytesPerLine4 = bytesPerLine3;
                        int i$iv2 = i$iv;
                        int bytesPerGroup3 = bytesPerGroup2;
                        String $this$checkContainsAt$iv2 = $this$checkContainsAt$iv;
                        if (!CharsKt.equals(groupSeparator.charAt(i$iv), $this$checkContainsAt$iv2.charAt(charIndex + i$iv2), ignoreCase)) {
                            partName$iv = partName$iv2;
                            throwNotContainedAt($this$checkContainsAt$iv2, charIndex, i, groupSeparator, partName$iv);
                        } else {
                            partName$iv = partName$iv2;
                        }
                        partName$iv2 = partName$iv;
                        i$iv = i$iv2 + 1;
                        $this$checkContainsAt$iv = $this$checkContainsAt$iv2;
                        bytesPerLine3 = bytesPerLine4;
                        bytesPerGroup2 = bytesPerGroup3;
                    }
                    int i2 = i$iv;
                    bytesPerLine = bytesPerLine3;
                    bytesPerGroup = bytesPerGroup2;
                    String str2 = $this$checkContainsAt$iv;
                    String str3 = partName$iv2;
                    bytesPerLine2 = groupSeparator.length() + charIndex;
                }
                charIndex = bytesPerLine2;
                indexInGroup = 0;
            } else {
                parseMaxSize = parseMaxSize2;
                bytesPerLine = bytesPerLine3;
                bytesPerGroup = bytesPerGroup2;
                if (indexInGroup != 0) {
                    String $this$checkContainsAt$iv3 = $this$hexToByteArraySlowPath;
                    if (byteSeparator.length() == 0) {
                        $i$f$checkContainsAt2 = charIndex;
                        indexInLine2 = indexInLine3;
                    } else {
                        int i$iv3 = 0;
                        int $i$f$checkContainsAt3 = byteSeparator.length();
                        while (i$iv3 < $i$f$checkContainsAt3) {
                            int i3 = $i$f$checkContainsAt3;
                            int indexInLine4 = indexInLine3;
                            if (!CharsKt.equals(byteSeparator.charAt(i$iv3), $this$checkContainsAt$iv3.charAt(charIndex + i$iv3), ignoreCase)) {
                                throwNotContainedAt($this$checkContainsAt$iv3, charIndex, i, byteSeparator, "byte separator");
                            }
                            i$iv3++;
                            $i$f$checkContainsAt3 = i3;
                            indexInLine3 = indexInLine4;
                        }
                        indexInLine2 = indexInLine3;
                        $i$f$checkContainsAt2 = byteSeparator.length() + charIndex;
                    }
                    charIndex = $i$f$checkContainsAt2;
                    indexInLine3 = indexInLine2;
                }
            }
            int indexInLine5 = indexInLine3 + 1;
            indexInGroup++;
            String $this$checkContainsAt$iv4 = $this$hexToByteArraySlowPath;
            if (bytePrefix.length() == 0) {
                $i$f$checkContainsAt = charIndex;
                indexInLine = indexInLine5;
            } else {
                int i$iv4 = 0;
                int $i$f$checkContainsAt4 = bytePrefix.length();
                while (i$iv4 < $i$f$checkContainsAt4) {
                    int i4 = $i$f$checkContainsAt4;
                    int indexInLine6 = indexInLine5;
                    if (!CharsKt.equals(bytePrefix.charAt(i$iv4), $this$checkContainsAt$iv4.charAt(charIndex + i$iv4), ignoreCase)) {
                        throwNotContainedAt($this$checkContainsAt$iv4, charIndex, i, bytePrefix, "byte prefix");
                    }
                    i$iv4++;
                    $i$f$checkContainsAt4 = i4;
                    indexInLine5 = indexInLine6;
                }
                indexInLine = indexInLine5;
                $i$f$checkContainsAt = bytePrefix.length() + charIndex;
            }
            if (i - 2 < $i$f$checkContainsAt) {
                throwInvalidNumberOfDigits(str, $i$f$checkContainsAt, i, "exactly", 2);
            }
            int byteIndex3 = byteIndex2 + 1;
            byteArray[byteIndex2] = parseByteAt(str, $i$f$checkContainsAt);
            int index$iv = $i$f$checkContainsAt + 2;
            String $this$checkContainsAt$iv5 = $this$hexToByteArraySlowPath;
            if (byteSuffix.length() == 0) {
                byteIndex = byteIndex3;
            } else {
                int i$iv5 = 0;
                int length2 = byteSuffix.length();
                while (i$iv5 < length2) {
                    int i5 = length2;
                    int byteIndex4 = byteIndex3;
                    if (!CharsKt.equals(byteSuffix.charAt(i$iv5), $this$checkContainsAt$iv5.charAt(index$iv + i$iv5), ignoreCase)) {
                        throwNotContainedAt($this$checkContainsAt$iv5, index$iv, i, byteSuffix, "byte suffix");
                    }
                    i$iv5++;
                    length2 = i5;
                    byteIndex3 = byteIndex4;
                }
                byteIndex = byteIndex3;
                index$iv = byteSuffix.length() + index$iv;
            }
            charIndex = index$iv;
            str = $this$hexToByteArraySlowPath;
            byteIndex2 = byteIndex;
            indexInLine3 = indexInLine;
            bytesPerLine3 = bytesPerLine;
            parseMaxSize2 = parseMaxSize;
            bytesPerGroup2 = bytesPerGroup;
        }
        int i6 = bytesPerLine3;
        int i7 = bytesPerGroup2;
        int i8 = indexInLine3;
        if (byteIndex2 == byteArray.length) {
            return byteArray;
        }
        byte[] copyOf = Arrays.copyOf(byteArray, byteIndex2);
        Intrinsics.checkNotNullExpressionValue(copyOf, "copyOf(...)");
        return copyOf;
    }

    private static final byte parseByteAt(String $this$parseByteAt, int index) {
        String $this$decimalFromHexDigitAt$iv = $this$parseByteAt;
        int code$iv = $this$decimalFromHexDigitAt$iv.charAt(index);
        if ((code$iv >>> 8) != 0 || HEX_DIGITS_TO_DECIMAL[code$iv] < 0) {
            throwInvalidDigitAt($this$decimalFromHexDigitAt$iv, index);
            throw new KotlinNothingValueException();
        }
        int high = HEX_DIGITS_TO_DECIMAL[code$iv];
        int index$iv = index + 1;
        String $this$decimalFromHexDigitAt$iv2 = $this$parseByteAt;
        int code$iv2 = $this$decimalFromHexDigitAt$iv2.charAt(index$iv);
        if ((code$iv2 >>> 8) != 0 || HEX_DIGITS_TO_DECIMAL[code$iv2] < 0) {
            throwInvalidDigitAt($this$decimalFromHexDigitAt$iv2, index$iv);
            throw new KotlinNothingValueException();
        }
        return (byte) ((high << 4) | HEX_DIGITS_TO_DECIMAL[code$iv2]);
    }

    public static final int parsedByteArrayMaxSize(int stringLength, int bytesPerLine, int bytesPerGroup, int groupSeparatorLength, int byteSeparatorLength, int bytePrefixLength, int byteSuffixLength) {
        long charsPerLine;
        int i = stringLength;
        int i2 = bytesPerLine;
        int i3 = bytesPerGroup;
        int i4 = groupSeparatorLength;
        int i5 = byteSeparatorLength;
        if (i > 0) {
            long charsPerByte = ((long) bytePrefixLength) + 2 + ((long) byteSuffixLength);
            long charsPerGroup = charsPerSet(charsPerByte, i3, i5);
            if (i2 <= i3) {
                charsPerLine = charsPerSet(charsPerByte, i2, i5);
            } else {
                long result = charsPerSet(charsPerGroup, i2 / i3, i4);
                int bytesPerLastGroupInLine = i2 % i3;
                if (bytesPerLastGroupInLine != 0) {
                    result = result + ((long) i4) + charsPerSet(charsPerByte, bytesPerLastGroupInLine, i5);
                }
                charsPerLine = result;
            }
            long numberOfChars = (long) i;
            long wholeLines = wholeElementsPerSet(numberOfChars, charsPerLine, 1);
            long numberOfChars2 = numberOfChars - ((charsPerLine + 1) * wholeLines);
            long wholeGroupsInLastLine = wholeElementsPerSet(numberOfChars2, charsPerGroup, i4);
            long numberOfChars3 = numberOfChars2 - ((((long) i4) + charsPerGroup) * wholeGroupsInLastLine);
            long charsPerByte2 = charsPerByte;
            long wholeBytesInLastGroup = wholeElementsPerSet(numberOfChars3, charsPerByte2, i5);
            return (int) ((((long) i2) * wholeLines) + (((long) i3) * wholeGroupsInLastLine) + wholeBytesInLastGroup + ((long) (numberOfChars3 - ((((long) i5) + charsPerByte2) * wholeBytesInLastGroup) > 0 ? 1 : 0)));
        }
        throw new IllegalArgumentException("Failed requirement.".toString());
    }

    private static final long charsPerSet(long charsPerElement, int elementsPerSet, int elementSeparatorLength) {
        if (elementsPerSet > 0) {
            return (((long) elementsPerSet) * charsPerElement) + (((long) elementSeparatorLength) * (((long) elementsPerSet) - 1));
        }
        throw new IllegalArgumentException("Failed requirement.".toString());
    }

    private static final long wholeElementsPerSet(long charsPerSet, long charsPerElement, int elementSeparatorLength) {
        if (charsPerSet <= 0 || charsPerElement <= 0) {
            return 0;
        }
        return (((long) elementSeparatorLength) + charsPerSet) / (((long) elementSeparatorLength) + charsPerElement);
    }

    private static final int checkNewLineAt(String $this$checkNewLineAt, int index, int endIndex) {
        if ($this$checkNewLineAt.charAt(index) == 13) {
            return (index + 1 >= endIndex || $this$checkNewLineAt.charAt(index + 1) != 10) ? index + 1 : index + 2;
        }
        if ($this$checkNewLineAt.charAt(index) == 10) {
            return index + 1;
        }
        throw new NumberFormatException("Expected a new line at index " + index + ", but was " + $this$checkNewLineAt.charAt(index));
    }

    public static /* synthetic */ String toHexString$default(byte b, HexFormat hexFormat, int i, Object obj) {
        if ((i & 1) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return toHexString(b, hexFormat);
    }

    public static final String toHexString(byte $this$toHexString, HexFormat format) {
        Intrinsics.checkNotNullParameter(format, "format");
        String digits = format.getUpperCase() ? UPPER_CASE_HEX_DIGITS : LOWER_CASE_HEX_DIGITS;
        HexFormat.NumberHexFormat numberFormat = format.getNumber();
        if (!numberFormat.isDigitsOnlyAndNoPadding$kotlin_stdlib()) {
            return toHexStringImpl((long) $this$toHexString, numberFormat, digits, 8);
        }
        int value = $this$toHexString;
        char[] charArray = {digits.charAt((value >> 4) & 15), digits.charAt(value & 15)};
        if (numberFormat.getRemoveLeadingZeros()) {
            return StringsKt.concatToString$default(charArray, RangesKt.coerceAtMost((Integer.numberOfLeadingZeros($this$toHexString & UByte.MAX_VALUE) - 24) >> 2, 1), 0, 2, (Object) null);
        }
        return StringsKt.concatToString(charArray);
    }

    public static final byte hexToByte(String $this$hexToByte, HexFormat format) {
        Intrinsics.checkNotNullParameter($this$hexToByte, "<this>");
        Intrinsics.checkNotNullParameter(format, "format");
        return hexToByte($this$hexToByte, 0, $this$hexToByte.length(), format);
    }

    public static /* synthetic */ byte hexToByte$default(String str, HexFormat hexFormat, int i, Object obj) {
        if ((i & 1) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return hexToByte(str, hexFormat);
    }

    static /* synthetic */ byte hexToByte$default(String str, int i, int i2, HexFormat hexFormat, int i3, Object obj) {
        if ((i3 & 1) != 0) {
            i = 0;
        }
        if ((i3 & 2) != 0) {
            i2 = str.length();
        }
        if ((i3 & 4) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return hexToByte(str, i, i2, hexFormat);
    }

    private static final byte hexToByte(String $this$hexToByte, int startIndex, int endIndex, HexFormat format) {
        return (byte) hexToIntImpl($this$hexToByte, startIndex, endIndex, format, 2);
    }

    public static /* synthetic */ String toHexString$default(short s, HexFormat hexFormat, int i, Object obj) {
        if ((i & 1) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return toHexString(s, hexFormat);
    }

    public static final String toHexString(short $this$toHexString, HexFormat format) {
        Intrinsics.checkNotNullParameter(format, "format");
        String digits = format.getUpperCase() ? UPPER_CASE_HEX_DIGITS : LOWER_CASE_HEX_DIGITS;
        HexFormat.NumberHexFormat numberFormat = format.getNumber();
        if (!numberFormat.isDigitsOnlyAndNoPadding$kotlin_stdlib()) {
            return toHexStringImpl((long) $this$toHexString, numberFormat, digits, 16);
        }
        int value = $this$toHexString;
        char[] charArray = {digits.charAt((value >> 12) & 15), digits.charAt((value >> 8) & 15), digits.charAt((value >> 4) & 15), digits.charAt(value & 15)};
        if (numberFormat.getRemoveLeadingZeros()) {
            return StringsKt.concatToString$default(charArray, RangesKt.coerceAtMost((Integer.numberOfLeadingZeros(65535 & $this$toHexString) - 16) >> 2, 3), 0, 2, (Object) null);
        }
        return StringsKt.concatToString(charArray);
    }

    public static final short hexToShort(String $this$hexToShort, HexFormat format) {
        Intrinsics.checkNotNullParameter($this$hexToShort, "<this>");
        Intrinsics.checkNotNullParameter(format, "format");
        return hexToShort($this$hexToShort, 0, $this$hexToShort.length(), format);
    }

    public static /* synthetic */ short hexToShort$default(String str, HexFormat hexFormat, int i, Object obj) {
        if ((i & 1) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return hexToShort(str, hexFormat);
    }

    static /* synthetic */ short hexToShort$default(String str, int i, int i2, HexFormat hexFormat, int i3, Object obj) {
        if ((i3 & 1) != 0) {
            i = 0;
        }
        if ((i3 & 2) != 0) {
            i2 = str.length();
        }
        if ((i3 & 4) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return hexToShort(str, i, i2, hexFormat);
    }

    private static final short hexToShort(String $this$hexToShort, int startIndex, int endIndex, HexFormat format) {
        return (short) hexToIntImpl($this$hexToShort, startIndex, endIndex, format, 4);
    }

    public static /* synthetic */ String toHexString$default(int i, HexFormat hexFormat, int i2, Object obj) {
        if ((i2 & 1) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return toHexString(i, hexFormat);
    }

    public static final String toHexString(int $this$toHexString, HexFormat format) {
        Intrinsics.checkNotNullParameter(format, "format");
        String digits = format.getUpperCase() ? UPPER_CASE_HEX_DIGITS : LOWER_CASE_HEX_DIGITS;
        HexFormat.NumberHexFormat numberFormat = format.getNumber();
        if (!numberFormat.isDigitsOnlyAndNoPadding$kotlin_stdlib()) {
            return toHexStringImpl((long) $this$toHexString, numberFormat, digits, 32);
        }
        int value = $this$toHexString;
        char[] charArray = {digits.charAt((value >> 28) & 15), digits.charAt((value >> 24) & 15), digits.charAt((value >> 20) & 15), digits.charAt((value >> 16) & 15), digits.charAt((value >> 12) & 15), digits.charAt((value >> 8) & 15), digits.charAt((value >> 4) & 15), digits.charAt(value & 15)};
        if (numberFormat.getRemoveLeadingZeros()) {
            return StringsKt.concatToString$default(charArray, RangesKt.coerceAtMost(Integer.numberOfLeadingZeros($this$toHexString) >> 2, 7), 0, 2, (Object) null);
        }
        return StringsKt.concatToString(charArray);
    }

    public static final int hexToInt(String $this$hexToInt, HexFormat format) {
        Intrinsics.checkNotNullParameter($this$hexToInt, "<this>");
        Intrinsics.checkNotNullParameter(format, "format");
        return hexToInt($this$hexToInt, 0, $this$hexToInt.length(), format);
    }

    public static /* synthetic */ int hexToInt$default(String str, HexFormat hexFormat, int i, Object obj) {
        if ((i & 1) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return hexToInt(str, hexFormat);
    }

    static /* synthetic */ int hexToInt$default(String str, int i, int i2, HexFormat hexFormat, int i3, Object obj) {
        if ((i3 & 1) != 0) {
            i = 0;
        }
        if ((i3 & 2) != 0) {
            i2 = str.length();
        }
        if ((i3 & 4) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return hexToInt(str, i, i2, hexFormat);
    }

    private static final int hexToInt(String $this$hexToInt, int startIndex, int endIndex, HexFormat format) {
        return hexToIntImpl($this$hexToInt, startIndex, endIndex, format, 8);
    }

    public static /* synthetic */ String toHexString$default(long j, HexFormat hexFormat, int i, Object obj) {
        if ((i & 1) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return toHexString(j, hexFormat);
    }

    public static final String toHexString(long $this$toHexString, HexFormat format) {
        HexFormat hexFormat = format;
        Intrinsics.checkNotNullParameter(hexFormat, "format");
        String digits = hexFormat.getUpperCase() ? UPPER_CASE_HEX_DIGITS : LOWER_CASE_HEX_DIGITS;
        HexFormat.NumberHexFormat numberFormat = hexFormat.getNumber();
        if (!numberFormat.isDigitsOnlyAndNoPadding$kotlin_stdlib()) {
            return toHexStringImpl($this$toHexString, numberFormat, digits, 64);
        }
        long value = $this$toHexString;
        char[] charArray = {digits.charAt((int) ((value >> 60) & 15)), digits.charAt((int) ((value >> 56) & 15)), digits.charAt((int) ((value >> 52) & 15)), digits.charAt((int) ((value >> 48) & 15)), digits.charAt((int) ((value >> 44) & 15)), digits.charAt((int) ((value >> 40) & 15)), digits.charAt((int) ((value >> 36) & 15)), digits.charAt((int) ((value >> 32) & 15)), digits.charAt((int) ((value >> 28) & 15)), digits.charAt((int) ((value >> 24) & 15)), digits.charAt((int) ((value >> 20) & 15)), digits.charAt((int) ((value >> 16) & 15)), digits.charAt((int) ((value >> 12) & 15)), digits.charAt((int) ((value >> 8) & 15)), digits.charAt((int) ((value >> 4) & 15)), digits.charAt((int) (15 & value))};
        if (numberFormat.getRemoveLeadingZeros()) {
            return StringsKt.concatToString$default(charArray, RangesKt.coerceAtMost(Long.numberOfLeadingZeros($this$toHexString) >> 2, 15), 0, 2, (Object) null);
        }
        return StringsKt.concatToString(charArray);
    }

    public static final long hexToLong(String $this$hexToLong, HexFormat format) {
        Intrinsics.checkNotNullParameter($this$hexToLong, "<this>");
        Intrinsics.checkNotNullParameter(format, "format");
        return hexToLong($this$hexToLong, 0, $this$hexToLong.length(), format);
    }

    public static /* synthetic */ long hexToLong$default(String str, HexFormat hexFormat, int i, Object obj) {
        if ((i & 1) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return hexToLong(str, hexFormat);
    }

    public static /* synthetic */ long hexToLong$default(String str, int i, int i2, HexFormat hexFormat, int i3, Object obj) {
        if ((i3 & 1) != 0) {
            i = 0;
        }
        if ((i3 & 2) != 0) {
            i2 = str.length();
        }
        if ((i3 & 4) != 0) {
            hexFormat = HexFormat.Companion.getDefault();
        }
        return hexToLong(str, i, i2, hexFormat);
    }

    public static final long hexToLong(String $this$hexToLong, int startIndex, int endIndex, HexFormat format) {
        Intrinsics.checkNotNullParameter($this$hexToLong, "<this>");
        Intrinsics.checkNotNullParameter(format, "format");
        return hexToLongImpl($this$hexToLong, startIndex, endIndex, format, 16);
    }

    private static final String toHexStringImpl(long $this$toHexStringImpl, HexFormat.NumberHexFormat numberFormat, String digits, int bits) {
        String str = digits;
        if ((bits & 3) == 0) {
            long value = $this$toHexStringImpl;
            int typeHexLength = bits >> 2;
            int minLength = numberFormat.getMinLength();
            int pads = RangesKt.coerceAtLeast(minLength - typeHexLength, 0);
            String prefix = numberFormat.getPrefix();
            String suffix = numberFormat.getSuffix();
            boolean removeZeros = numberFormat.getRemoveLeadingZeros();
            char[] charArray = new char[checkFormatLength(((long) prefix.length()) + ((long) pads) + ((long) typeHexLength) + ((long) suffix.length()))];
            int charIndex = toCharArrayIfNotEmpty(prefix, charArray, 0);
            if (pads > 0) {
                ArraysKt.fill(charArray, str.charAt(0), charIndex, charIndex + pads);
                charIndex += pads;
            }
            int shift = bits;
            int i = 0;
            while (i < typeHexLength) {
                int i2 = i;
                shift -= 4;
                long value2 = value;
                int decimal = (int) ((value >> shift) & 15);
                removeZeros = removeZeros && decimal == 0 && (shift >> 2) >= minLength;
                if (!removeZeros) {
                    charArray[charIndex] = str.charAt(decimal);
                    charIndex++;
                }
                i++;
                value = value2;
            }
            int charIndex2 = toCharArrayIfNotEmpty(suffix, charArray, charIndex);
            return charIndex2 == charArray.length ? StringsKt.concatToString(charArray) : StringsKt.concatToString$default(charArray, 0, charIndex2, 1, (Object) null);
        }
        throw new IllegalArgumentException("Failed requirement.".toString());
    }

    private static final int toCharArrayIfNotEmpty(String $this$toCharArrayIfNotEmpty, char[] destination, int destinationOffset) {
        switch ($this$toCharArrayIfNotEmpty.length()) {
            case 0:
                break;
            case 1:
                destination[destinationOffset] = $this$toCharArrayIfNotEmpty.charAt(0);
                break;
            default:
                int length = $this$toCharArrayIfNotEmpty.length();
                Intrinsics.checkNotNull($this$toCharArrayIfNotEmpty, "null cannot be cast to non-null type java.lang.String");
                $this$toCharArrayIfNotEmpty.getChars(0, length, destination, destinationOffset);
                break;
        }
        return $this$toCharArrayIfNotEmpty.length() + destinationOffset;
    }

    private static final int hexToIntImpl(String $this$hexToIntImpl, int startIndex, int endIndex, HexFormat format, int typeHexLength) {
        AbstractList.Companion.checkBoundsIndexes$kotlin_stdlib(startIndex, endIndex, $this$hexToIntImpl.length());
        HexFormat.NumberHexFormat numberFormat = format.getNumber();
        if (numberFormat.isDigitsOnly$kotlin_stdlib()) {
            checkNumberOfDigits($this$hexToIntImpl, startIndex, endIndex, typeHexLength);
            return parseInt($this$hexToIntImpl, startIndex, endIndex);
        }
        String prefix = numberFormat.getPrefix();
        String suffix = numberFormat.getSuffix();
        String $this$hexToIntImpl2 = $this$hexToIntImpl;
        int startIndex2 = startIndex;
        int endIndex2 = endIndex;
        checkPrefixSuffixNumberOfDigits($this$hexToIntImpl2, startIndex2, endIndex2, prefix, suffix, numberFormat.getIgnoreCase$kotlin_stdlib(), typeHexLength);
        return parseInt($this$hexToIntImpl2, startIndex2 + prefix.length(), endIndex2 - suffix.length());
    }

    private static final long hexToLongImpl(String $this$hexToLongImpl, int startIndex, int endIndex, HexFormat format, int typeHexLength) {
        AbstractList.Companion.checkBoundsIndexes$kotlin_stdlib(startIndex, endIndex, $this$hexToLongImpl.length());
        HexFormat.NumberHexFormat numberFormat = format.getNumber();
        if (numberFormat.isDigitsOnly$kotlin_stdlib()) {
            checkNumberOfDigits($this$hexToLongImpl, startIndex, endIndex, typeHexLength);
            return parseLong($this$hexToLongImpl, startIndex, endIndex);
        }
        String prefix = numberFormat.getPrefix();
        String suffix = numberFormat.getSuffix();
        String $this$hexToLongImpl2 = $this$hexToLongImpl;
        int startIndex2 = startIndex;
        int endIndex2 = endIndex;
        checkPrefixSuffixNumberOfDigits($this$hexToLongImpl2, startIndex2, endIndex2, prefix, suffix, numberFormat.getIgnoreCase$kotlin_stdlib(), typeHexLength);
        return parseLong($this$hexToLongImpl2, startIndex2 + prefix.length(), endIndex2 - suffix.length());
    }

    private static final void checkPrefixSuffixNumberOfDigits(String $this$checkPrefixSuffixNumberOfDigits, int startIndex, int endIndex, String prefix, String suffix, boolean ignoreCase, int typeHexLength) {
        int digitsStartIndex;
        if ((endIndex - startIndex) - prefix.length() <= suffix.length()) {
            throwInvalidPrefixSuffix($this$checkPrefixSuffixNumberOfDigits, startIndex, endIndex, prefix, suffix);
        }
        String $this$checkContainsAt$iv = $this$checkPrefixSuffixNumberOfDigits;
        boolean z = false;
        if (prefix.length() == 0) {
            digitsStartIndex = startIndex;
        } else {
            int length = prefix.length();
            for (int i$iv = 0; i$iv < length; i$iv++) {
                if (!CharsKt.equals(prefix.charAt(i$iv), $this$checkContainsAt$iv.charAt(startIndex + i$iv), ignoreCase)) {
                    throwNotContainedAt($this$checkContainsAt$iv, startIndex, endIndex, prefix, "prefix");
                }
            }
            digitsStartIndex = prefix.length() + startIndex;
        }
        int digitsEndIndex = endIndex - suffix.length();
        String $this$checkContainsAt$iv2 = $this$checkPrefixSuffixNumberOfDigits;
        if (suffix.length() == 0) {
            z = true;
        }
        if (!z) {
            int length2 = suffix.length();
            for (int i$iv2 = 0; i$iv2 < length2; i$iv2++) {
                if (!CharsKt.equals(suffix.charAt(i$iv2), $this$checkContainsAt$iv2.charAt(digitsEndIndex + i$iv2), ignoreCase)) {
                    throwNotContainedAt($this$checkContainsAt$iv2, digitsEndIndex, endIndex, suffix, "suffix");
                }
            }
            suffix.length();
        }
        checkNumberOfDigits($this$checkPrefixSuffixNumberOfDigits, digitsStartIndex, digitsEndIndex, typeHexLength);
    }

    private static final void checkNumberOfDigits(String $this$checkNumberOfDigits, int startIndex, int endIndex, int typeHexLength) {
        int digits = endIndex - startIndex;
        if (digits < 1) {
            throwInvalidNumberOfDigits($this$checkNumberOfDigits, startIndex, endIndex, "at least", 1);
        } else if (digits > typeHexLength) {
            checkZeroDigits($this$checkNumberOfDigits, startIndex, (startIndex + digits) - typeHexLength);
        }
    }

    private static final void checkZeroDigits(String $this$checkZeroDigits, int startIndex, int endIndex) {
        int index = startIndex;
        while (index < endIndex) {
            if ($this$checkZeroDigits.charAt(index) == '0') {
                index++;
            } else {
                throw new NumberFormatException("Expected the hexadecimal digit '0' at index " + index + ", but was '" + $this$checkZeroDigits.charAt(index) + "'.\nThe result won't fit the type being parsed.");
            }
        }
    }

    private static final int parseInt(String $this$parseInt, int startIndex, int endIndex) {
        int result = 0;
        for (int i = startIndex; i < endIndex; i++) {
            int i2 = result << 4;
            String $this$decimalFromHexDigitAt$iv = $this$parseInt;
            int code$iv = $this$decimalFromHexDigitAt$iv.charAt(i);
            if ((code$iv >>> 8) != 0 || HEX_DIGITS_TO_DECIMAL[code$iv] < 0) {
                throwInvalidDigitAt($this$decimalFromHexDigitAt$iv, i);
                throw new KotlinNothingValueException();
            }
            result = i2 | HEX_DIGITS_TO_DECIMAL[code$iv];
        }
        return result;
    }

    private static final long parseLong(String $this$parseLong, int startIndex, int endIndex) {
        long result = 0;
        for (int i = startIndex; i < endIndex; i++) {
            long j = result << 4;
            String $this$longDecimalFromHexDigitAt$iv = $this$parseLong;
            int code$iv = $this$longDecimalFromHexDigitAt$iv.charAt(i);
            if ((code$iv >>> 8) != 0 || HEX_DIGITS_TO_LONG_DECIMAL[code$iv] < 0) {
                throwInvalidDigitAt($this$longDecimalFromHexDigitAt$iv, i);
                throw new KotlinNothingValueException();
            }
            result = j | HEX_DIGITS_TO_LONG_DECIMAL[code$iv];
        }
        return result;
    }

    private static final int checkContainsAt(String $this$checkContainsAt, int index, int endIndex, String part, boolean ignoreCase, String partName) {
        if (part.length() == 0) {
            return index;
        }
        int length = part.length();
        for (int i = 0; i < length; i++) {
            if (!CharsKt.equals(part.charAt(i), $this$checkContainsAt.charAt(index + i), ignoreCase)) {
                throwNotContainedAt($this$checkContainsAt, index, endIndex, part, partName);
            }
        }
        return part.length() + index;
    }

    private static final int decimalFromHexDigitAt(String $this$decimalFromHexDigitAt, int index) {
        int code = $this$decimalFromHexDigitAt.charAt(index);
        if ((code >>> 8) == 0 && HEX_DIGITS_TO_DECIMAL[code] >= 0) {
            return HEX_DIGITS_TO_DECIMAL[code];
        }
        throwInvalidDigitAt($this$decimalFromHexDigitAt, index);
        throw new KotlinNothingValueException();
    }

    private static final long longDecimalFromHexDigitAt(String $this$longDecimalFromHexDigitAt, int index) {
        int code = $this$longDecimalFromHexDigitAt.charAt(index);
        if ((code >>> 8) == 0 && HEX_DIGITS_TO_LONG_DECIMAL[code] >= 0) {
            return HEX_DIGITS_TO_LONG_DECIMAL[code];
        }
        throwInvalidDigitAt($this$longDecimalFromHexDigitAt, index);
        throw new KotlinNothingValueException();
    }

    private static final void throwInvalidNumberOfDigits(String $this$throwInvalidNumberOfDigits, int startIndex, int endIndex, String specifier, int expected) {
        Intrinsics.checkNotNull($this$throwInvalidNumberOfDigits, "null cannot be cast to non-null type java.lang.String");
        String substring = $this$throwInvalidNumberOfDigits.substring(startIndex, endIndex);
        Intrinsics.checkNotNullExpressionValue(substring, "substring(...)");
        throw new NumberFormatException("Expected " + specifier + ' ' + expected + " hexadecimal digits at index " + startIndex + ", but was \"" + substring + "\" of length " + (endIndex - startIndex));
    }

    private static final void throwNotContainedAt(String $this$throwNotContainedAt, int index, int endIndex, String part, String partName) {
        int coerceAtMost = RangesKt.coerceAtMost(part.length() + index, endIndex);
        Intrinsics.checkNotNull($this$throwNotContainedAt, "null cannot be cast to non-null type java.lang.String");
        String substring = $this$throwNotContainedAt.substring(index, coerceAtMost);
        Intrinsics.checkNotNullExpressionValue(substring, "substring(...)");
        throw new NumberFormatException("Expected " + partName + " \"" + part + "\" at index " + index + ", but was " + substring);
    }

    private static final void throwInvalidPrefixSuffix(String $this$throwInvalidPrefixSuffix, int startIndex, int endIndex, String prefix, String suffix) {
        Intrinsics.checkNotNull($this$throwInvalidPrefixSuffix, "null cannot be cast to non-null type java.lang.String");
        String substring = $this$throwInvalidPrefixSuffix.substring(startIndex, endIndex);
        Intrinsics.checkNotNullExpressionValue(substring, "substring(...)");
        throw new NumberFormatException("Expected a hexadecimal number with prefix \"" + prefix + "\" and suffix \"" + suffix + "\", but was " + substring);
    }

    private static final Void throwInvalidDigitAt(String $this$throwInvalidDigitAt, int index) {
        throw new NumberFormatException("Expected a hexadecimal digit at index " + index + ", but was " + $this$throwInvalidDigitAt.charAt(index));
    }
}
