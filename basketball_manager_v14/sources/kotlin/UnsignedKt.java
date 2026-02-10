package kotlin;

import kotlin.jvm.internal.Intrinsics;
import kotlin.text.CharsKt;

@Metadata(d1 = {"\u00006\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0006\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0007\n\u0002\b\u0004\n\u0002\u0010\b\n\u0002\b\n\n\u0002\u0010\t\n\u0000\n\u0002\u0010\u000e\n\u0002\b\r\u001a\u0015\u0010\u0000\u001a\u00020\u00012\u0006\u0010\u0002\u001a\u00020\u0003H\u0001¢\u0006\u0002\u0010\u0004\u001a\u0015\u0010\u0005\u001a\u00020\u00062\u0006\u0010\u0002\u001a\u00020\u0003H\u0001¢\u0006\u0002\u0010\u0007\u001a\u0016\u0010\b\u001a\u00020\u00012\u0006\u0010\u0002\u001a\u00020\tH\b¢\u0006\u0002\u0010\n\u001a\u0016\u0010\u000b\u001a\u00020\u00062\u0006\u0010\u0002\u001a\u00020\tH\b¢\u0006\u0002\u0010\f\u001a\u0018\u0010\r\u001a\u00020\u000e2\u0006\u0010\u000f\u001a\u00020\u000e2\u0006\u0010\u0010\u001a\u00020\u000eH\u0001\u001a\u001f\u0010\u0011\u001a\u00020\u00012\u0006\u0010\u000f\u001a\u00020\u00012\u0006\u0010\u0010\u001a\u00020\u0001H\u0001¢\u0006\u0004\b\u0012\u0010\u0013\u001a\u001f\u0010\u0014\u001a\u00020\u00012\u0006\u0010\u000f\u001a\u00020\u00012\u0006\u0010\u0010\u001a\u00020\u0001H\u0001¢\u0006\u0004\b\u0015\u0010\u0013\u001a\u0010\u0010\u0016\u001a\u00020\u00032\u0006\u0010\u0002\u001a\u00020\u000eH\u0001\u001a\u0011\u0010\u0017\u001a\u00020\t2\u0006\u0010\u0002\u001a\u00020\u000eH\b\u001a\u0011\u0010\u0018\u001a\u00020\u00192\u0006\u0010\u0002\u001a\u00020\u000eH\b\u001a\u0011\u0010\u001a\u001a\u00020\u001b2\u0006\u0010\u0002\u001a\u00020\u000eH\b\u001a\u0019\u0010\u001a\u001a\u00020\u001b2\u0006\u0010\u0002\u001a\u00020\u000e2\u0006\u0010\u001c\u001a\u00020\u000eH\b\u001a\u0016\u0010\u001d\u001a\u00020\u00062\u0006\u0010\u0002\u001a\u00020\u000eH\b¢\u0006\u0002\u0010\u001e\u001a\u0018\u0010\u001f\u001a\u00020\u000e2\u0006\u0010\u000f\u001a\u00020\u00192\u0006\u0010\u0010\u001a\u00020\u0019H\u0001\u001a\u001f\u0010 \u001a\u00020\u00062\u0006\u0010\u000f\u001a\u00020\u00062\u0006\u0010\u0010\u001a\u00020\u0006H\u0001¢\u0006\u0004\b!\u0010\"\u001a\u001f\u0010#\u001a\u00020\u00062\u0006\u0010\u000f\u001a\u00020\u00062\u0006\u0010\u0010\u001a\u00020\u0006H\u0001¢\u0006\u0004\b$\u0010\"\u001a\u0010\u0010%\u001a\u00020\u00032\u0006\u0010\u0002\u001a\u00020\u0019H\u0001\u001a\u0011\u0010&\u001a\u00020\t2\u0006\u0010\u0002\u001a\u00020\u0019H\b\u001a\u0011\u0010'\u001a\u00020\u001b2\u0006\u0010\u0002\u001a\u00020\u0019H\b\u001a\u0018\u0010'\u001a\u00020\u001b2\u0006\u0010\u0002\u001a\u00020\u00192\u0006\u0010\u001c\u001a\u00020\u000eH\u0000¨\u0006("}, d2 = {"doubleToUInt", "Lkotlin/UInt;", "value", "", "(D)I", "doubleToULong", "Lkotlin/ULong;", "(D)J", "floatToUInt", "", "(F)I", "floatToULong", "(F)J", "uintCompare", "", "v1", "v2", "uintDivide", "uintDivide-J1ME1BU", "(II)I", "uintRemainder", "uintRemainder-J1ME1BU", "uintToDouble", "uintToFloat", "uintToLong", "", "uintToString", "", "base", "uintToULong", "(I)J", "ulongCompare", "ulongDivide", "ulongDivide-eb3DHEI", "(JJ)J", "ulongRemainder", "ulongRemainder-eb3DHEI", "ulongToDouble", "ulongToFloat", "ulongToString", "kotlin-stdlib"}, k = 2, mv = {1, 9, 0}, xi = 48)
/* compiled from: UnsignedJVM.kt */
public final class UnsignedKt {
    /* renamed from: uintRemainder-J1ME1BU  reason: not valid java name */
    public static final int m453uintRemainderJ1ME1BU(int v1, int v2) {
        return UInt.m196constructorimpl((int) ((((long) v1) & 4294967295L) % (4294967295L & ((long) v2))));
    }

    /* renamed from: uintDivide-J1ME1BU  reason: not valid java name */
    public static final int m452uintDivideJ1ME1BU(int v1, int v2) {
        return UInt.m196constructorimpl((int) ((((long) v1) & 4294967295L) / (4294967295L & ((long) v2))));
    }

    /* renamed from: ulongDivide-eb3DHEI  reason: not valid java name */
    public static final long m454ulongDivideeb3DHEI(long v1, long v2) {
        long dividend = v1;
        long divisor = v2;
        long j = 0;
        if (divisor < 0) {
            if (Long.compare(v1 ^ Long.MIN_VALUE, v2 ^ Long.MIN_VALUE) >= 0) {
                j = 1;
            }
            return ULong.m275constructorimpl(j);
        } else if (dividend >= 0) {
            return ULong.m275constructorimpl(dividend / divisor);
        } else {
            int i = 1;
            long quotient = ((dividend >>> 1) / divisor) << 1;
            if (Long.compare(ULong.m275constructorimpl(dividend - (quotient * divisor)) ^ Long.MIN_VALUE, ULong.m275constructorimpl(divisor) ^ Long.MIN_VALUE) < 0) {
                i = 0;
            }
            return ULong.m275constructorimpl(((long) i) + quotient);
        }
    }

    /* renamed from: ulongRemainder-eb3DHEI  reason: not valid java name */
    public static final long m455ulongRemaindereb3DHEI(long v1, long v2) {
        long dividend = v1;
        long divisor = v2;
        long j = 0;
        if (divisor < 0) {
            if (Long.compare(v1 ^ Long.MIN_VALUE, v2 ^ Long.MIN_VALUE) < 0) {
                return v1;
            }
            return ULong.m275constructorimpl(v1 - v2);
        } else if (dividend >= 0) {
            return ULong.m275constructorimpl(dividend % divisor);
        } else {
            long rem = dividend - ((((dividend >>> 1) / divisor) << 1) * divisor);
            if (Long.compare(ULong.m275constructorimpl(rem) ^ Long.MIN_VALUE, ULong.m275constructorimpl(divisor) ^ Long.MIN_VALUE) >= 0) {
                j = divisor;
            }
            return ULong.m275constructorimpl(rem - j);
        }
    }

    public static final int uintCompare(int v1, int v2) {
        return Intrinsics.compare(v1 ^ Integer.MIN_VALUE, Integer.MIN_VALUE ^ v2);
    }

    public static final int ulongCompare(long v1, long v2) {
        return Intrinsics.compare(v1 ^ Long.MIN_VALUE, Long.MIN_VALUE ^ v2);
    }

    private static final long uintToULong(int value) {
        return ULong.m275constructorimpl(((long) value) & 4294967295L);
    }

    private static final long uintToLong(int value) {
        return ((long) value) & 4294967295L;
    }

    private static final float uintToFloat(int value) {
        return (float) uintToDouble(value);
    }

    private static final int floatToUInt(float value) {
        return doubleToUInt((double) value);
    }

    public static final double uintToDouble(int value) {
        return ((double) (Integer.MAX_VALUE & value)) + (((double) ((value >>> 31) << 30)) * ((double) 2));
    }

    public static final int doubleToUInt(double value) {
        if (Double.isNaN(value) || value <= uintToDouble(0)) {
            return 0;
        }
        if (value >= uintToDouble(-1)) {
            return -1;
        }
        if (value <= 2.147483647E9d) {
            return UInt.m196constructorimpl((int) value);
        }
        return UInt.m196constructorimpl(UInt.m196constructorimpl((int) (value - ((double) Integer.MAX_VALUE))) + UInt.m196constructorimpl(Integer.MAX_VALUE));
    }

    private static final float ulongToFloat(long value) {
        return (float) ulongToDouble(value);
    }

    private static final long floatToULong(float value) {
        return doubleToULong((double) value);
    }

    public static final double ulongToDouble(long value) {
        return (((double) (value >>> 11)) * ((double) 2048)) + ((double) (2047 & value));
    }

    public static final long doubleToULong(double value) {
        if (Double.isNaN(value) || value <= ulongToDouble(0)) {
            return 0;
        }
        if (value >= ulongToDouble(-1)) {
            return -1;
        }
        if (value < 9.223372036854776E18d) {
            return ULong.m275constructorimpl((long) value);
        }
        return ULong.m275constructorimpl(ULong.m275constructorimpl((long) (value - 9.223372036854776E18d)) - Long.MIN_VALUE);
    }

    private static final String uintToString(int value) {
        return String.valueOf(((long) value) & 4294967295L);
    }

    private static final String uintToString(int value, int base) {
        return ulongToString(((long) value) & 4294967295L, base);
    }

    private static final String ulongToString(long value) {
        return ulongToString(value, 10);
    }

    public static final String ulongToString(long value, int base) {
        if (value >= 0) {
            String l = Long.toString(value, CharsKt.checkRadix(base));
            Intrinsics.checkNotNullExpressionValue(l, "toString(...)");
            return l;
        }
        long quotient = ((value >>> 1) / ((long) base)) << 1;
        long rem = value - (((long) base) * quotient);
        if (rem >= ((long) base)) {
            rem -= (long) base;
            quotient++;
        }
        StringBuilder sb = new StringBuilder();
        String l2 = Long.toString(quotient, CharsKt.checkRadix(base));
        Intrinsics.checkNotNullExpressionValue(l2, "toString(...)");
        StringBuilder append = sb.append(l2);
        String l3 = Long.toString(rem, CharsKt.checkRadix(base));
        Intrinsics.checkNotNullExpressionValue(l3, "toString(...)");
        return append.append(l3).toString();
    }
}
