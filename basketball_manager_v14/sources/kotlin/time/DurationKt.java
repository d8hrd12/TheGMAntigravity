package kotlin.time;

import java.util.Collection;
import java.util.Iterator;
import kotlin.Deprecated;
import kotlin.DeprecatedSinceKotlin;
import kotlin.Metadata;
import kotlin.ReplaceWith;
import kotlin.collections.IntIterator;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.internal.Intrinsics;
import kotlin.math.MathKt;
import kotlin.ranges.IntRange;
import kotlin.ranges.RangesKt;
import kotlin.text.StringsKt;

@Metadata(d1 = {"\u0000>\n\u0000\n\u0002\u0010\t\n\u0002\b\u0003\n\u0002\u0010\b\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010\u0006\n\u0002\b*\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0002\u0010\f\n\u0002\b\t\n\u0002\u0018\u0002\n\u0002\b\u0004\u001a\u001d\u0010#\u001a\u00020\u00072\u0006\u0010$\u001a\u00020\u00012\u0006\u0010%\u001a\u00020\u0005H\u0002¢\u0006\u0002\u0010&\u001a\u0015\u0010'\u001a\u00020\u00072\u0006\u0010(\u001a\u00020\u0001H\u0002¢\u0006\u0002\u0010\u0010\u001a\u0015\u0010)\u001a\u00020\u00072\u0006\u0010*\u001a\u00020\u0001H\u0002¢\u0006\u0002\u0010\u0010\u001a\u0015\u0010+\u001a\u00020\u00072\u0006\u0010,\u001a\u00020\u0001H\u0002¢\u0006\u0002\u0010\u0010\u001a\u0015\u0010-\u001a\u00020\u00072\u0006\u0010.\u001a\u00020\u0001H\u0002¢\u0006\u0002\u0010\u0010\u001a\u0010\u0010/\u001a\u00020\u00012\u0006\u0010*\u001a\u00020\u0001H\u0002\u001a\u0010\u00100\u001a\u00020\u00012\u0006\u0010.\u001a\u00020\u0001H\u0002\u001a\u001d\u00101\u001a\u00020\u00072\u0006\u00102\u001a\u0002032\u0006\u00104\u001a\u000205H\u0002¢\u0006\u0002\u00106\u001a\u0010\u00107\u001a\u00020\u00012\u0006\u00102\u001a\u000203H\u0002\u001a)\u00108\u001a\u00020\u0005*\u0002032\u0006\u00109\u001a\u00020\u00052\u0012\u0010:\u001a\u000e\u0012\u0004\u0012\u00020<\u0012\u0004\u0012\u0002050;H\b\u001a)\u0010=\u001a\u000203*\u0002032\u0006\u00109\u001a\u00020\u00052\u0012\u0010:\u001a\u000e\u0012\u0004\u0012\u00020<\u0012\u0004\u0012\u0002050;H\b\u001a\u001c\u0010>\u001a\u00020\u0007*\u00020\b2\u0006\u0010?\u001a\u00020\u0007H\n¢\u0006\u0004\b@\u0010A\u001a\u001c\u0010>\u001a\u00020\u0007*\u00020\u00052\u0006\u0010?\u001a\u00020\u0007H\n¢\u0006\u0004\bB\u0010C\u001a\u0019\u0010D\u001a\u00020\u0007*\u00020\b2\u0006\u0010E\u001a\u00020FH\u0007¢\u0006\u0002\u0010G\u001a\u0019\u0010D\u001a\u00020\u0007*\u00020\u00052\u0006\u0010E\u001a\u00020FH\u0007¢\u0006\u0002\u0010H\u001a\u0019\u0010D\u001a\u00020\u0007*\u00020\u00012\u0006\u0010E\u001a\u00020FH\u0007¢\u0006\u0002\u0010I\"\u000e\u0010\u0000\u001a\u00020\u0001XT¢\u0006\u0002\n\u0000\"\u000e\u0010\u0002\u001a\u00020\u0001XT¢\u0006\u0002\n\u0000\"\u000e\u0010\u0003\u001a\u00020\u0001XT¢\u0006\u0002\n\u0000\"\u000e\u0010\u0004\u001a\u00020\u0005XT¢\u0006\u0002\n\u0000\"\u001e\u0010\u0006\u001a\u00020\u0007*\u00020\b8FX\u0004¢\u0006\f\u0012\u0004\b\t\u0010\n\u001a\u0004\b\u000b\u0010\f\"\u001e\u0010\u0006\u001a\u00020\u0007*\u00020\u00058FX\u0004¢\u0006\f\u0012\u0004\b\t\u0010\r\u001a\u0004\b\u000b\u0010\u000e\"\u001e\u0010\u0006\u001a\u00020\u0007*\u00020\u00018FX\u0004¢\u0006\f\u0012\u0004\b\t\u0010\u000f\u001a\u0004\b\u000b\u0010\u0010\"\u001e\u0010\u0011\u001a\u00020\u0007*\u00020\b8FX\u0004¢\u0006\f\u0012\u0004\b\u0012\u0010\n\u001a\u0004\b\u0013\u0010\f\"\u001e\u0010\u0011\u001a\u00020\u0007*\u00020\u00058FX\u0004¢\u0006\f\u0012\u0004\b\u0012\u0010\r\u001a\u0004\b\u0013\u0010\u000e\"\u001e\u0010\u0011\u001a\u00020\u0007*\u00020\u00018FX\u0004¢\u0006\f\u0012\u0004\b\u0012\u0010\u000f\u001a\u0004\b\u0013\u0010\u0010\"\u001e\u0010\u0014\u001a\u00020\u0007*\u00020\b8FX\u0004¢\u0006\f\u0012\u0004\b\u0015\u0010\n\u001a\u0004\b\u0016\u0010\f\"\u001e\u0010\u0014\u001a\u00020\u0007*\u00020\u00058FX\u0004¢\u0006\f\u0012\u0004\b\u0015\u0010\r\u001a\u0004\b\u0016\u0010\u000e\"\u001e\u0010\u0014\u001a\u00020\u0007*\u00020\u00018FX\u0004¢\u0006\f\u0012\u0004\b\u0015\u0010\u000f\u001a\u0004\b\u0016\u0010\u0010\"\u001e\u0010\u0017\u001a\u00020\u0007*\u00020\b8FX\u0004¢\u0006\f\u0012\u0004\b\u0018\u0010\n\u001a\u0004\b\u0019\u0010\f\"\u001e\u0010\u0017\u001a\u00020\u0007*\u00020\u00058FX\u0004¢\u0006\f\u0012\u0004\b\u0018\u0010\r\u001a\u0004\b\u0019\u0010\u000e\"\u001e\u0010\u0017\u001a\u00020\u0007*\u00020\u00018FX\u0004¢\u0006\f\u0012\u0004\b\u0018\u0010\u000f\u001a\u0004\b\u0019\u0010\u0010\"\u001e\u0010\u001a\u001a\u00020\u0007*\u00020\b8FX\u0004¢\u0006\f\u0012\u0004\b\u001b\u0010\n\u001a\u0004\b\u001c\u0010\f\"\u001e\u0010\u001a\u001a\u00020\u0007*\u00020\u00058FX\u0004¢\u0006\f\u0012\u0004\b\u001b\u0010\r\u001a\u0004\b\u001c\u0010\u000e\"\u001e\u0010\u001a\u001a\u00020\u0007*\u00020\u00018FX\u0004¢\u0006\f\u0012\u0004\b\u001b\u0010\u000f\u001a\u0004\b\u001c\u0010\u0010\"\u001e\u0010\u001d\u001a\u00020\u0007*\u00020\b8FX\u0004¢\u0006\f\u0012\u0004\b\u001e\u0010\n\u001a\u0004\b\u001f\u0010\f\"\u001e\u0010\u001d\u001a\u00020\u0007*\u00020\u00058FX\u0004¢\u0006\f\u0012\u0004\b\u001e\u0010\r\u001a\u0004\b\u001f\u0010\u000e\"\u001e\u0010\u001d\u001a\u00020\u0007*\u00020\u00018FX\u0004¢\u0006\f\u0012\u0004\b\u001e\u0010\u000f\u001a\u0004\b\u001f\u0010\u0010\"\u001e\u0010 \u001a\u00020\u0007*\u00020\b8FX\u0004¢\u0006\f\u0012\u0004\b!\u0010\n\u001a\u0004\b\"\u0010\f\"\u001e\u0010 \u001a\u00020\u0007*\u00020\u00058FX\u0004¢\u0006\f\u0012\u0004\b!\u0010\r\u001a\u0004\b\"\u0010\u000e\"\u001e\u0010 \u001a\u00020\u0007*\u00020\u00018FX\u0004¢\u0006\f\u0012\u0004\b!\u0010\u000f\u001a\u0004\b\"\u0010\u0010¨\u0006J"}, d2 = {"MAX_MILLIS", "", "MAX_NANOS", "MAX_NANOS_IN_MILLIS", "NANOS_IN_MILLIS", "", "days", "Lkotlin/time/Duration;", "", "getDays$annotations", "(D)V", "getDays", "(D)J", "(I)V", "(I)J", "(J)V", "(J)J", "hours", "getHours$annotations", "getHours", "microseconds", "getMicroseconds$annotations", "getMicroseconds", "milliseconds", "getMilliseconds$annotations", "getMilliseconds", "minutes", "getMinutes$annotations", "getMinutes", "nanoseconds", "getNanoseconds$annotations", "getNanoseconds", "seconds", "getSeconds$annotations", "getSeconds", "durationOf", "normalValue", "unitDiscriminator", "(JI)J", "durationOfMillis", "normalMillis", "durationOfMillisNormalized", "millis", "durationOfNanos", "normalNanos", "durationOfNanosNormalized", "nanos", "millisToNanos", "nanosToMillis", "parseDuration", "value", "", "strictIso", "", "(Ljava/lang/String;Z)J", "parseOverLongIsoComponent", "skipWhile", "startIndex", "predicate", "Lkotlin/Function1;", "", "substringWhile", "times", "duration", "times-kIfJnKk", "(DJ)J", "times-mvk6XK0", "(IJ)J", "toDuration", "unit", "Lkotlin/time/DurationUnit;", "(DLkotlin/time/DurationUnit;)J", "(ILkotlin/time/DurationUnit;)J", "(JLkotlin/time/DurationUnit;)J", "kotlin-stdlib"}, k = 2, mv = {1, 9, 0}, xi = 48)
/* compiled from: Duration.kt */
public final class DurationKt {
    public static final long MAX_MILLIS = 4611686018427387903L;
    public static final long MAX_NANOS = 4611686018426999999L;
    private static final long MAX_NANOS_IN_MILLIS = 4611686018426L;
    public static final int NANOS_IN_MILLIS = 1000000;

    @Deprecated(message = "Use 'Double.days' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.days", imports = {"kotlin.time.Duration.Companion.days"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getDays$annotations(double d) {
    }

    @Deprecated(message = "Use 'Int.days' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.days", imports = {"kotlin.time.Duration.Companion.days"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getDays$annotations(int i) {
    }

    @Deprecated(message = "Use 'Long.days' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.days", imports = {"kotlin.time.Duration.Companion.days"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getDays$annotations(long j) {
    }

    @Deprecated(message = "Use 'Double.hours' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.hours", imports = {"kotlin.time.Duration.Companion.hours"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getHours$annotations(double d) {
    }

    @Deprecated(message = "Use 'Int.hours' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.hours", imports = {"kotlin.time.Duration.Companion.hours"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getHours$annotations(int i) {
    }

    @Deprecated(message = "Use 'Long.hours' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.hours", imports = {"kotlin.time.Duration.Companion.hours"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getHours$annotations(long j) {
    }

    @Deprecated(message = "Use 'Double.microseconds' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.microseconds", imports = {"kotlin.time.Duration.Companion.microseconds"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getMicroseconds$annotations(double d) {
    }

    @Deprecated(message = "Use 'Int.microseconds' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.microseconds", imports = {"kotlin.time.Duration.Companion.microseconds"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getMicroseconds$annotations(int i) {
    }

    @Deprecated(message = "Use 'Long.microseconds' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.microseconds", imports = {"kotlin.time.Duration.Companion.microseconds"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getMicroseconds$annotations(long j) {
    }

    @Deprecated(message = "Use 'Double.milliseconds' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.milliseconds", imports = {"kotlin.time.Duration.Companion.milliseconds"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getMilliseconds$annotations(double d) {
    }

    @Deprecated(message = "Use 'Int.milliseconds' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.milliseconds", imports = {"kotlin.time.Duration.Companion.milliseconds"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getMilliseconds$annotations(int i) {
    }

    @Deprecated(message = "Use 'Long.milliseconds' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.milliseconds", imports = {"kotlin.time.Duration.Companion.milliseconds"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getMilliseconds$annotations(long j) {
    }

    @Deprecated(message = "Use 'Double.minutes' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.minutes", imports = {"kotlin.time.Duration.Companion.minutes"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getMinutes$annotations(double d) {
    }

    @Deprecated(message = "Use 'Int.minutes' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.minutes", imports = {"kotlin.time.Duration.Companion.minutes"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getMinutes$annotations(int i) {
    }

    @Deprecated(message = "Use 'Long.minutes' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.minutes", imports = {"kotlin.time.Duration.Companion.minutes"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getMinutes$annotations(long j) {
    }

    @Deprecated(message = "Use 'Double.nanoseconds' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.nanoseconds", imports = {"kotlin.time.Duration.Companion.nanoseconds"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getNanoseconds$annotations(double d) {
    }

    @Deprecated(message = "Use 'Int.nanoseconds' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.nanoseconds", imports = {"kotlin.time.Duration.Companion.nanoseconds"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getNanoseconds$annotations(int i) {
    }

    @Deprecated(message = "Use 'Long.nanoseconds' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.nanoseconds", imports = {"kotlin.time.Duration.Companion.nanoseconds"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getNanoseconds$annotations(long j) {
    }

    @Deprecated(message = "Use 'Double.seconds' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.seconds", imports = {"kotlin.time.Duration.Companion.seconds"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getSeconds$annotations(double d) {
    }

    @Deprecated(message = "Use 'Int.seconds' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.seconds", imports = {"kotlin.time.Duration.Companion.seconds"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getSeconds$annotations(int i) {
    }

    @Deprecated(message = "Use 'Long.seconds' extension property from Duration.Companion instead.", replaceWith = @ReplaceWith(expression = "this.seconds", imports = {"kotlin.time.Duration.Companion.seconds"}))
    @DeprecatedSinceKotlin(errorSince = "1.8", hiddenSince = "1.9", warningSince = "1.5")
    public static /* synthetic */ void getSeconds$annotations(long j) {
    }

    public static final long toDuration(int $this$toDuration, DurationUnit unit) {
        Intrinsics.checkNotNullParameter(unit, "unit");
        if (unit.compareTo(DurationUnit.SECONDS) <= 0) {
            return durationOfNanos(DurationUnitKt.convertDurationUnitOverflow((long) $this$toDuration, unit, DurationUnit.NANOSECONDS));
        }
        return toDuration((long) $this$toDuration, unit);
    }

    public static final long toDuration(long $this$toDuration, DurationUnit unit) {
        Intrinsics.checkNotNullParameter(unit, "unit");
        long maxNsInUnit = DurationUnitKt.convertDurationUnitOverflow(MAX_NANOS, DurationUnit.NANOSECONDS, unit);
        boolean z = false;
        if ((-maxNsInUnit) <= $this$toDuration && $this$toDuration <= maxNsInUnit) {
            z = true;
        }
        if (z) {
            return durationOfNanos(DurationUnitKt.convertDurationUnitOverflow($this$toDuration, unit, DurationUnit.NANOSECONDS));
        }
        return durationOfMillis(RangesKt.coerceIn(DurationUnitKt.convertDurationUnit($this$toDuration, unit, DurationUnit.MILLISECONDS), -4611686018427387903L, (long) MAX_MILLIS));
    }

    public static final long toDuration(double $this$toDuration, DurationUnit unit) {
        Intrinsics.checkNotNullParameter(unit, "unit");
        double valueInNs = DurationUnitKt.convertDurationUnit($this$toDuration, unit, DurationUnit.NANOSECONDS);
        if (!Double.isNaN(valueInNs)) {
            long nanos = MathKt.roundToLong(valueInNs);
            boolean z = false;
            if (-4611686018426999999L <= nanos && nanos < 4611686018427000000L) {
                z = true;
            }
            if (z) {
                return durationOfNanos(nanos);
            }
            return durationOfMillisNormalized(MathKt.roundToLong(DurationUnitKt.convertDurationUnit($this$toDuration, unit, DurationUnit.MILLISECONDS)));
        }
        throw new IllegalArgumentException("Duration value cannot be NaN.".toString());
    }

    /* renamed from: times-mvk6XK0  reason: not valid java name */
    private static final long m1560timesmvk6XK0(int $this$times_u2dmvk6XK0, long duration) {
        return Duration.m1471timesUwyO8pc(duration, $this$times_u2dmvk6XK0);
    }

    /* renamed from: times-kIfJnKk  reason: not valid java name */
    private static final long m1559timeskIfJnKk(double $this$times_u2dkIfJnKk, long duration) {
        return Duration.m1470timesUwyO8pc(duration, $this$times_u2dkIfJnKk);
    }

    /* access modifiers changed from: private */
    /* JADX WARNING: Removed duplicated region for block: B:126:0x0277  */
    /* JADX WARNING: Removed duplicated region for block: B:127:0x0279  */
    /* JADX WARNING: Removed duplicated region for block: B:129:0x027c A[LOOP:4: B:114:0x0251->B:129:0x027c, LOOP_END] */
    /* JADX WARNING: Removed duplicated region for block: B:184:0x00d0 A[SYNTHETIC] */
    /* JADX WARNING: Removed duplicated region for block: B:197:0x0285 A[SYNTHETIC] */
    /* JADX WARNING: Removed duplicated region for block: B:47:0x00b5 A[LOOP:1: B:32:0x0073->B:47:0x00b5, LOOP_END] */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final long parseDuration(java.lang.String r31, boolean r32) {
        /*
            r0 = r31
            int r6 = r0.length()
            if (r6 == 0) goto L_0x0385
            r1 = 0
            kotlin.time.Duration$Companion r2 = kotlin.time.Duration.Companion
            long r7 = r2.m1536getZEROUwyO8pc()
            java.lang.String r2 = "Infinity"
            char r3 = r0.charAt(r1)
            switch(r3) {
                case 43: goto L_0x0019;
                case 44: goto L_0x0018;
                case 45: goto L_0x0019;
                default: goto L_0x0018;
            }
        L_0x0018:
            goto L_0x001b
        L_0x0019:
            int r1 = r1 + 1
        L_0x001b:
            r9 = 0
            if (r1 <= 0) goto L_0x0020
            r3 = 1
            goto L_0x0021
        L_0x0020:
            r3 = r9
        L_0x0021:
            r11 = r3
            r3 = 0
            r4 = 2
            if (r11 == 0) goto L_0x0033
            r5 = r0
            java.lang.CharSequence r5 = (java.lang.CharSequence) r5
            r12 = 45
            boolean r5 = kotlin.text.StringsKt.startsWith$default((java.lang.CharSequence) r5, (char) r12, (boolean) r9, (int) r4, (java.lang.Object) r3)
            if (r5 == 0) goto L_0x0033
            r5 = 1
            goto L_0x0034
        L_0x0033:
            r5 = r9
        L_0x0034:
            r12 = r5
            java.lang.String r13 = "No components"
            if (r6 <= r1) goto L_0x037f
            char r5 = r0.charAt(r1)
            r14 = 80
            java.lang.String r15 = "Unexpected order of duration components"
            java.lang.String r4 = "substring(...)"
            java.lang.String r9 = "null cannot be cast to non-null type java.lang.String"
            if (r5 != r14) goto L_0x01b7
            int r1 = r1 + 1
            if (r1 == r6) goto L_0x01b1
            java.lang.String r5 = "+-."
            r13 = 0
            r14 = 0
        L_0x0050:
            if (r1 >= r6) goto L_0x01a7
            char r10 = r0.charAt(r1)
            r3 = 84
            if (r10 != r3) goto L_0x0068
            if (r13 != 0) goto L_0x0062
            int r1 = r1 + 1
            if (r1 == r6) goto L_0x0062
            r13 = 1
            goto L_0x0050
        L_0x0062:
            java.lang.IllegalArgumentException r3 = new java.lang.IllegalArgumentException
            r3.<init>()
            throw r3
        L_0x0068:
            r3 = r31
            r10 = 0
            r19 = r3
            r20 = 0
            r21 = r1
            r0 = r21
        L_0x0073:
            r21 = r2
            int r2 = r19.length()
            if (r0 >= r2) goto L_0x00c4
            r2 = r19
            r19 = r5
            char r5 = r2.charAt(r0)
            r22 = 0
            r23 = r2
            r2 = 48
            if (r2 > r5) goto L_0x0091
            r2 = 58
            if (r5 >= r2) goto L_0x0091
            r2 = 1
            goto L_0x0092
        L_0x0091:
            r2 = 0
        L_0x0092:
            if (r2 != 0) goto L_0x00aa
            r2 = r19
            java.lang.CharSequence r2 = (java.lang.CharSequence) r2
            r24 = r6
            r16 = r10
            r17 = r11
            r6 = 0
            r10 = 2
            r11 = 0
            boolean r2 = kotlin.text.StringsKt.contains$default((java.lang.CharSequence) r2, (char) r5, (boolean) r11, (int) r10, (java.lang.Object) r6)
            if (r2 == 0) goto L_0x00a8
            goto L_0x00b2
        L_0x00a8:
            r2 = 0
            goto L_0x00b3
        L_0x00aa:
            r24 = r6
            r16 = r10
            r17 = r11
            r6 = 0
            r10 = 2
        L_0x00b2:
            r2 = 1
        L_0x00b3:
            if (r2 == 0) goto L_0x00d0
            int r0 = r0 + 1
            r10 = r16
            r11 = r17
            r5 = r19
            r2 = r21
            r19 = r23
            r6 = r24
            goto L_0x0073
        L_0x00c4:
            r24 = r6
            r16 = r10
            r17 = r11
            r23 = r19
            r6 = 0
            r10 = 2
            r19 = r5
        L_0x00d0:
            kotlin.jvm.internal.Intrinsics.checkNotNull(r3, r9)
            java.lang.String r0 = r3.substring(r1, r0)
            kotlin.jvm.internal.Intrinsics.checkNotNullExpressionValue(r0, r4)
            r2 = r0
            java.lang.CharSequence r2 = (java.lang.CharSequence) r2
            int r2 = r2.length()
            if (r2 != 0) goto L_0x00e7
            r2 = 1
            goto L_0x00e8
        L_0x00e7:
            r2 = 0
        L_0x00e8:
            if (r2 != 0) goto L_0x01a1
            int r2 = r0.length()
            int r1 = r1 + r2
            r2 = r31
            java.lang.CharSequence r2 = (java.lang.CharSequence) r2
            if (r1 < 0) goto L_0x00fd
            int r3 = r2.length()
            if (r1 >= r3) goto L_0x00fd
            r3 = 1
            goto L_0x00fe
        L_0x00fd:
            r3 = 0
        L_0x00fe:
            if (r3 == 0) goto L_0x0186
            char r2 = r2.charAt(r1)
            int r1 = r1 + 1
            kotlin.time.DurationUnit r3 = kotlin.time.DurationUnitKt.durationUnitByIsoChar(r2, r13)
            if (r14 == 0) goto L_0x011c
            r5 = r3
            java.lang.Enum r5 = (java.lang.Enum) r5
            int r5 = r14.compareTo(r5)
            if (r5 <= 0) goto L_0x0116
            goto L_0x011c
        L_0x0116:
            java.lang.IllegalArgumentException r4 = new java.lang.IllegalArgumentException
            r4.<init>(r15)
            throw r4
        L_0x011c:
            r14 = r3
            r25 = r0
            java.lang.CharSequence r25 = (java.lang.CharSequence) r25
            r29 = 6
            r30 = 0
            r26 = 46
            r27 = 0
            r28 = 0
            int r5 = kotlin.text.StringsKt.indexOf$default((java.lang.CharSequence) r25, (char) r26, (int) r27, (boolean) r28, (int) r29, (java.lang.Object) r30)
            kotlin.time.DurationUnit r11 = kotlin.time.DurationUnit.SECONDS
            if (r3 != r11) goto L_0x016e
            if (r5 <= 0) goto L_0x016e
            kotlin.jvm.internal.Intrinsics.checkNotNull(r0, r9)
            r11 = 0
            java.lang.String r6 = r0.substring(r11, r5)
            kotlin.jvm.internal.Intrinsics.checkNotNullExpressionValue(r6, r4)
            long r10 = parseOverLongIsoComponent(r6)
            long r10 = toDuration((long) r10, (kotlin.time.DurationUnit) r3)
            long r7 = kotlin.time.Duration.m1469plusLRDsOJo(r7, r10)
            kotlin.jvm.internal.Intrinsics.checkNotNull(r0, r9)
            java.lang.String r10 = r0.substring(r5)
            kotlin.jvm.internal.Intrinsics.checkNotNullExpressionValue(r10, r4)
            double r10 = java.lang.Double.parseDouble(r10)
            long r10 = toDuration((double) r10, (kotlin.time.DurationUnit) r3)
            long r7 = kotlin.time.Duration.m1469plusLRDsOJo(r7, r10)
            r0 = r31
            r11 = r17
            r5 = r19
            r2 = r21
            r6 = r24
            goto L_0x0050
        L_0x016e:
            long r10 = parseOverLongIsoComponent(r0)
            long r10 = toDuration((long) r10, (kotlin.time.DurationUnit) r3)
            long r7 = kotlin.time.Duration.m1469plusLRDsOJo(r7, r10)
            r0 = r31
            r11 = r17
            r5 = r19
            r2 = r21
            r6 = r24
            goto L_0x0050
        L_0x0186:
            r2 = r1
            r3 = 0
            java.lang.IllegalArgumentException r4 = new java.lang.IllegalArgumentException
            java.lang.StringBuilder r5 = new java.lang.StringBuilder
            r5.<init>()
            java.lang.String r6 = "Missing unit for value "
            java.lang.StringBuilder r5 = r5.append(r6)
            java.lang.StringBuilder r5 = r5.append(r0)
            java.lang.String r5 = r5.toString()
            r4.<init>(r5)
            throw r4
        L_0x01a1:
            java.lang.IllegalArgumentException r2 = new java.lang.IllegalArgumentException
            r2.<init>()
            throw r2
        L_0x01a7:
            r21 = r2
            r19 = r5
            r24 = r6
            r17 = r11
            goto L_0x0370
        L_0x01b1:
            java.lang.IllegalArgumentException r0 = new java.lang.IllegalArgumentException
            r0.<init>()
            throw r0
        L_0x01b7:
            r21 = r2
            r24 = r6
            r17 = r11
            if (r32 != 0) goto L_0x0379
            int r6 = r24 - r1
            int r0 = r21.length()
            int r0 = java.lang.Math.max(r6, r0)
            r5 = 1
            r3 = 0
            r10 = r4
            r2 = r21
            r6 = 48
            r4 = r0
            r0 = r31
            boolean r3 = kotlin.text.StringsKt.regionMatches((java.lang.String) r0, (int) r1, (java.lang.String) r2, (int) r3, (int) r4, (boolean) r5)
            if (r3 == 0) goto L_0x01e5
            kotlin.time.Duration$Companion r3 = kotlin.time.Duration.Companion
            long r7 = r3.m1534getINFINITEUwyO8pc()
            r21 = r2
            r6 = r24
            goto L_0x0370
        L_0x01e5:
            r3 = 0
            r4 = 0
            if (r17 != 0) goto L_0x01eb
            r11 = 1
            goto L_0x01ec
        L_0x01eb:
            r11 = 0
        L_0x01ec:
            if (r17 == 0) goto L_0x020f
            char r5 = r0.charAt(r1)
            r14 = 40
            if (r5 != r14) goto L_0x020f
            r5 = r0
            java.lang.CharSequence r5 = (java.lang.CharSequence) r5
            char r5 = kotlin.text.StringsKt.last(r5)
            r14 = 41
            if (r5 != r14) goto L_0x020f
            r11 = 1
            int r1 = r1 + 1
            int r5 = r24 + -1
            if (r1 == r5) goto L_0x0209
            goto L_0x0211
        L_0x0209:
            java.lang.IllegalArgumentException r6 = new java.lang.IllegalArgumentException
            r6.<init>(r13)
            throw r6
        L_0x020f:
            r5 = r24
        L_0x0211:
            if (r1 >= r5) goto L_0x036b
            if (r4 == 0) goto L_0x0241
            if (r11 == 0) goto L_0x0241
            r13 = r31
            r14 = 0
            r16 = r1
            r6 = r16
        L_0x021e:
            int r0 = r13.length()
            if (r6 >= r0) goto L_0x023c
            char r0 = r13.charAt(r6)
            r16 = 0
            r19 = r1
            r1 = 32
            if (r0 != r1) goto L_0x0232
            r0 = 1
            goto L_0x0233
        L_0x0232:
            r0 = 0
        L_0x0233:
            if (r0 == 0) goto L_0x023e
            int r6 = r6 + 1
            r0 = r31
            r1 = r19
            goto L_0x021e
        L_0x023c:
            r19 = r1
        L_0x023e:
            r1 = r6
            goto L_0x0245
        L_0x0241:
            r19 = r1
            r1 = r19
        L_0x0245:
            r4 = 1
            r0 = r31
            r6 = 0
            r13 = r0
            r14 = 0
            r16 = r1
            r21 = r2
            r2 = r16
        L_0x0251:
            r16 = r4
            int r4 = r13.length()
            if (r2 >= r4) goto L_0x0283
            char r4 = r13.charAt(r2)
            r19 = 0
            r20 = r6
            r6 = 48
            if (r6 > r4) goto L_0x026c
            r6 = 58
            if (r4 >= r6) goto L_0x026e
            r18 = 1
            goto L_0x0270
        L_0x026c:
            r6 = 58
        L_0x026e:
            r18 = 0
        L_0x0270:
            if (r18 != 0) goto L_0x0279
            r6 = 46
            if (r4 != r6) goto L_0x0277
            goto L_0x0279
        L_0x0277:
            r4 = 0
            goto L_0x027a
        L_0x0279:
            r4 = 1
        L_0x027a:
            if (r4 == 0) goto L_0x0285
            int r2 = r2 + 1
            r4 = r16
            r6 = r20
            goto L_0x0251
        L_0x0283:
            r20 = r6
        L_0x0285:
            kotlin.jvm.internal.Intrinsics.checkNotNull(r0, r9)
            java.lang.String r2 = r0.substring(r1, r2)
            kotlin.jvm.internal.Intrinsics.checkNotNullExpressionValue(r2, r10)
            r0 = r2
            java.lang.CharSequence r0 = (java.lang.CharSequence) r0
            int r0 = r0.length()
            if (r0 != 0) goto L_0x029c
            r0 = 1
            goto L_0x029d
        L_0x029c:
            r0 = 0
        L_0x029d:
            if (r0 != 0) goto L_0x0365
            int r0 = r2.length()
            int r1 = r1 + r0
            r0 = r31
            r4 = 0
            r6 = r0
            r13 = 0
            r14 = r1
        L_0x02aa:
            r19 = r4
            int r4 = r6.length()
            if (r14 >= r4) goto L_0x02ce
            char r4 = r6.charAt(r14)
            r20 = 0
            r22 = r6
            r6 = 97
            if (r6 > r4) goto L_0x02c4
            r6 = 123(0x7b, float:1.72E-43)
            if (r4 >= r6) goto L_0x02c4
            r4 = 1
            goto L_0x02c5
        L_0x02c4:
            r4 = 0
        L_0x02c5:
            if (r4 == 0) goto L_0x02d0
            int r14 = r14 + 1
            r4 = r19
            r6 = r22
            goto L_0x02aa
        L_0x02ce:
            r22 = r6
        L_0x02d0:
            kotlin.jvm.internal.Intrinsics.checkNotNull(r0, r9)
            java.lang.String r4 = r0.substring(r1, r14)
            kotlin.jvm.internal.Intrinsics.checkNotNullExpressionValue(r4, r10)
            int r0 = r4.length()
            int r1 = r1 + r0
            kotlin.time.DurationUnit r0 = kotlin.time.DurationUnitKt.durationUnitByShortName(r4)
            if (r3 == 0) goto L_0x02f7
            r6 = r0
            java.lang.Enum r6 = (java.lang.Enum) r6
            int r6 = r3.compareTo(r6)
            if (r6 <= 0) goto L_0x02f1
            goto L_0x02f7
        L_0x02f1:
            java.lang.IllegalArgumentException r6 = new java.lang.IllegalArgumentException
            r6.<init>(r15)
            throw r6
        L_0x02f7:
            r3 = r0
            r22 = r2
            java.lang.CharSequence r22 = (java.lang.CharSequence) r22
            r26 = 6
            r27 = 0
            r23 = 46
            r24 = 0
            r25 = 0
            int r6 = kotlin.text.StringsKt.indexOf$default((java.lang.CharSequence) r22, (char) r23, (int) r24, (boolean) r25, (int) r26, (java.lang.Object) r27)
            if (r6 <= 0) goto L_0x034f
            kotlin.jvm.internal.Intrinsics.checkNotNull(r2, r9)
            r13 = 0
            java.lang.String r14 = r2.substring(r13, r6)
            kotlin.jvm.internal.Intrinsics.checkNotNullExpressionValue(r14, r10)
            r19 = r14
            long r13 = java.lang.Long.parseLong(r19)
            long r13 = toDuration((long) r13, (kotlin.time.DurationUnit) r0)
            long r7 = kotlin.time.Duration.m1469plusLRDsOJo(r7, r13)
            kotlin.jvm.internal.Intrinsics.checkNotNull(r2, r9)
            java.lang.String r13 = r2.substring(r6)
            kotlin.jvm.internal.Intrinsics.checkNotNullExpressionValue(r13, r10)
            double r13 = java.lang.Double.parseDouble(r13)
            long r13 = toDuration((double) r13, (kotlin.time.DurationUnit) r0)
            long r7 = kotlin.time.Duration.m1469plusLRDsOJo(r7, r13)
            if (r1 < r5) goto L_0x0347
            r6 = 48
            r0 = r31
            r4 = r16
            r2 = r21
            goto L_0x0211
        L_0x0347:
            java.lang.IllegalArgumentException r9 = new java.lang.IllegalArgumentException
            java.lang.String r10 = "Fractional component must be last"
            r9.<init>(r10)
            throw r9
        L_0x034f:
            long r13 = java.lang.Long.parseLong(r2)
            long r13 = toDuration((long) r13, (kotlin.time.DurationUnit) r0)
            long r7 = kotlin.time.Duration.m1469plusLRDsOJo(r7, r13)
            r6 = 48
            r0 = r31
            r4 = r16
            r2 = r21
            goto L_0x0211
        L_0x0365:
            java.lang.IllegalArgumentException r0 = new java.lang.IllegalArgumentException
            r0.<init>()
            throw r0
        L_0x036b:
            r19 = r1
            r21 = r2
            r6 = r5
        L_0x0370:
            if (r12 == 0) goto L_0x0377
            long r2 = kotlin.time.Duration.m1486unaryMinusUwyO8pc(r7)
            goto L_0x0378
        L_0x0377:
            r2 = r7
        L_0x0378:
            return r2
        L_0x0379:
            java.lang.IllegalArgumentException r0 = new java.lang.IllegalArgumentException
            r0.<init>()
            throw r0
        L_0x037f:
            java.lang.IllegalArgumentException r0 = new java.lang.IllegalArgumentException
            r0.<init>(r13)
            throw r0
        L_0x0385:
            java.lang.IllegalArgumentException r0 = new java.lang.IllegalArgumentException
            java.lang.String r1 = "The string is empty"
            r0.<init>(r1)
            throw r0
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlin.time.DurationKt.parseDuration(java.lang.String, boolean):long");
    }

    private static final long parseOverLongIsoComponent(String value) {
        Iterable $this$all$iv;
        int it;
        int length = value.length();
        int startIndex = 0;
        if (length > 0 && StringsKt.contains$default((CharSequence) "+-", value.charAt(0), false, 2, (Object) null)) {
            startIndex = 0 + 1;
        }
        if (length - startIndex > 16) {
            Iterable $this$all$iv2 = new IntRange(startIndex, StringsKt.getLastIndex(value));
            if (!($this$all$iv2 instanceof Collection) || !((Collection) $this$all$iv2).isEmpty()) {
                Iterator it2 = $this$all$iv2.iterator();
                while (true) {
                    if (!it2.hasNext()) {
                        $this$all$iv = 1;
                        break;
                    }
                    char charAt = value.charAt(((IntIterator) it2).nextInt());
                    if ('0' > charAt || charAt >= ':') {
                        it = 0;
                        continue;
                    } else {
                        it = 1;
                        continue;
                    }
                    if (it == 0) {
                        $this$all$iv = null;
                        break;
                    }
                }
            } else {
                $this$all$iv = 1;
            }
            if ($this$all$iv != null) {
                return value.charAt(0) == '-' ? Long.MIN_VALUE : Long.MAX_VALUE;
            }
        }
        return StringsKt.startsWith$default(value, "+", false, 2, (Object) null) ? Long.parseLong(StringsKt.drop(value, 1)) : Long.parseLong(value);
    }

    private static final String substringWhile(String $this$substringWhile, int startIndex, Function1<? super Character, Boolean> predicate) {
        String $this$skipWhile$iv = $this$substringWhile;
        int i$iv = startIndex;
        while (i$iv < $this$skipWhile$iv.length() && predicate.invoke(Character.valueOf($this$skipWhile$iv.charAt(i$iv))).booleanValue()) {
            i$iv++;
        }
        Intrinsics.checkNotNull($this$substringWhile, "null cannot be cast to non-null type java.lang.String");
        String substring = $this$substringWhile.substring(startIndex, i$iv);
        Intrinsics.checkNotNullExpressionValue(substring, "substring(...)");
        return substring;
    }

    private static final int skipWhile(String $this$skipWhile, int startIndex, Function1<? super Character, Boolean> predicate) {
        int i = startIndex;
        while (i < $this$skipWhile.length() && predicate.invoke(Character.valueOf($this$skipWhile.charAt(i))).booleanValue()) {
            i++;
        }
        return i;
    }

    /* access modifiers changed from: private */
    public static final long nanosToMillis(long nanos) {
        return nanos / ((long) NANOS_IN_MILLIS);
    }

    /* access modifiers changed from: private */
    public static final long millisToNanos(long millis) {
        return ((long) NANOS_IN_MILLIS) * millis;
    }

    /* access modifiers changed from: private */
    public static final long durationOfNanos(long normalNanos) {
        return Duration.m1433constructorimpl(normalNanos << 1);
    }

    /* access modifiers changed from: private */
    public static final long durationOfMillis(long normalMillis) {
        return Duration.m1433constructorimpl((normalMillis << 1) + 1);
    }

    /* access modifiers changed from: private */
    public static final long durationOf(long normalValue, int unitDiscriminator) {
        return Duration.m1433constructorimpl((normalValue << 1) + ((long) unitDiscriminator));
    }

    /* access modifiers changed from: private */
    public static final long durationOfNanosNormalized(long nanos) {
        boolean z = false;
        if (-4611686018426999999L <= nanos && nanos < 4611686018427000000L) {
            z = true;
        }
        if (z) {
            return durationOfNanos(nanos);
        }
        return durationOfMillis(nanosToMillis(nanos));
    }

    /* access modifiers changed from: private */
    public static final long durationOfMillisNormalized(long millis) {
        boolean z = false;
        if (-4611686018426L <= millis && millis < 4611686018427L) {
            z = true;
        }
        if (!z) {
            return durationOfMillis(RangesKt.coerceIn(millis, -4611686018427387903L, (long) MAX_MILLIS));
        }
        long j = millis;
        return durationOfNanos(millisToNanos(millis));
    }
}
