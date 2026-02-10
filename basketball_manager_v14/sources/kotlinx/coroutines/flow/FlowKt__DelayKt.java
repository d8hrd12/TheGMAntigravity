package kotlinx.coroutines.flow;

import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.CoroutineContext;
import kotlin.jvm.functions.Function1;
import kotlin.time.Duration;
import kotlinx.coroutines.CoroutineScope;
import kotlinx.coroutines.DelayKt;
import kotlinx.coroutines.channels.ProduceKt;
import kotlinx.coroutines.channels.ReceiveChannel;
import kotlinx.coroutines.flow.internal.FlowCoroutineKt;

@Metadata(d1 = {"\u0000,\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0010\t\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0007\n\u0002\u0018\u0002\n\u0002\u0010\u0002\n\u0002\u0018\u0002\n\u0002\b\t\u001a2\u0010\u0000\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u00012\u0012\u0010\u0003\u001a\u000e\u0012\u0004\u0012\u0002H\u0002\u0012\u0004\u0012\u00020\u00050\u0004H\u0007\u001a7\u0010\u0000\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u00012\u0012\u0010\u0006\u001a\u000e\u0012\u0004\u0012\u0002H\u0002\u0012\u0004\u0012\u00020\u00070\u0004H\u0007¢\u0006\u0002\b\b\u001a&\u0010\u0000\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u00012\u0006\u0010\u0003\u001a\u00020\u0005H\u0007\u001a0\u0010\u0000\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u00012\u0006\u0010\u0006\u001a\u00020\u0007H\u0007ø\u0001\u0000¢\u0006\u0004\b\t\u0010\n\u001a7\u0010\u000b\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u00012\u0012\u0010\f\u001a\u000e\u0012\u0004\u0012\u0002H\u0002\u0012\u0004\u0012\u00020\u00050\u0004H\u0002¢\u0006\u0002\b\r\u001a\u001a\u0010\u000e\u001a\b\u0012\u0004\u0012\u00020\u00100\u000f*\u00020\u00112\u0006\u0010\u0012\u001a\u00020\u0005H\u0000\u001a&\u0010\u0013\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u00012\u0006\u0010\u0014\u001a\u00020\u0005H\u0007\u001a0\u0010\u0013\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u00012\u0006\u0010\u0015\u001a\u00020\u0007H\u0007ø\u0001\u0000¢\u0006\u0004\b\u0016\u0010\n\u001a0\u0010\u0006\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u00012\u0006\u0010\u0006\u001a\u00020\u0007H\u0007ø\u0001\u0000¢\u0006\u0004\b\u0017\u0010\n\u001a0\u0010\u0018\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u00012\u0006\u0010\u0006\u001a\u00020\u0007H\u0002ø\u0001\u0000¢\u0006\u0004\b\u0019\u0010\n\u0002\u0007\n\u0005\b¡\u001e0\u0001¨\u0006\u001a"}, d2 = {"debounce", "Lkotlinx/coroutines/flow/Flow;", "T", "timeoutMillis", "Lkotlin/Function1;", "", "timeout", "Lkotlin/time/Duration;", "debounceDuration", "debounce-HG0u8IE", "(Lkotlinx/coroutines/flow/Flow;J)Lkotlinx/coroutines/flow/Flow;", "debounceInternal", "timeoutMillisSelector", "debounceInternal$FlowKt__DelayKt", "fixedPeriodTicker", "Lkotlinx/coroutines/channels/ReceiveChannel;", "", "Lkotlinx/coroutines/CoroutineScope;", "delayMillis", "sample", "periodMillis", "period", "sample-HG0u8IE", "timeout-HG0u8IE", "timeoutInternal", "timeoutInternal-HG0u8IE$FlowKt__DelayKt", "kotlinx-coroutines-core"}, k = 5, mv = {1, 9, 0}, xi = 48, xs = "kotlinx/coroutines/flow/FlowKt")
/* compiled from: Delay.kt */
final /* synthetic */ class FlowKt__DelayKt {
    public static final <T> Flow<T> debounce(Flow<? extends T> $this$debounce, long timeoutMillis) {
        if (!(timeoutMillis >= 0)) {
            throw new IllegalArgumentException("Debounce timeout should not be negative".toString());
        } else if (timeoutMillis == 0) {
            return $this$debounce;
        } else {
            return debounceInternal$FlowKt__DelayKt($this$debounce, new FlowKt__DelayKt$debounce$2(timeoutMillis));
        }
    }

    public static final <T> Flow<T> debounce(Flow<? extends T> $this$debounce, Function1<? super T, Long> timeoutMillis) {
        return debounceInternal$FlowKt__DelayKt($this$debounce, timeoutMillis);
    }

    /* renamed from: debounce-HG0u8IE  reason: not valid java name */
    public static final <T> Flow<T> m1657debounceHG0u8IE(Flow<? extends T> $this$debounce_u2dHG0u8IE, long timeout) {
        return FlowKt.debounce($this$debounce_u2dHG0u8IE, DelayKt.m1608toDelayMillisLRDsOJo(timeout));
    }

    public static final <T> Flow<T> debounceDuration(Flow<? extends T> $this$debounce, Function1<? super T, Duration> timeout) {
        return debounceInternal$FlowKt__DelayKt($this$debounce, new FlowKt__DelayKt$debounce$3(timeout));
    }

    private static final <T> Flow<T> debounceInternal$FlowKt__DelayKt(Flow<? extends T> $this$debounceInternal, Function1<? super T, Long> timeoutMillisSelector) {
        return FlowCoroutineKt.scopedFlow(new FlowKt__DelayKt$debounceInternal$1(timeoutMillisSelector, $this$debounceInternal, (Continuation<? super FlowKt__DelayKt$debounceInternal$1>) null));
    }

    public static final <T> Flow<T> sample(Flow<? extends T> $this$sample, long periodMillis) {
        if (periodMillis > 0) {
            return FlowCoroutineKt.scopedFlow(new FlowKt__DelayKt$sample$2(periodMillis, $this$sample, (Continuation<? super FlowKt__DelayKt$sample$2>) null));
        }
        throw new IllegalArgumentException("Sample period should be positive".toString());
    }

    public static final ReceiveChannel<Unit> fixedPeriodTicker(CoroutineScope $this$fixedPeriodTicker, long delayMillis) {
        return ProduceKt.produce$default($this$fixedPeriodTicker, (CoroutineContext) null, 0, new FlowKt__DelayKt$fixedPeriodTicker$1(delayMillis, (Continuation<? super FlowKt__DelayKt$fixedPeriodTicker$1>) null), 1, (Object) null);
    }

    /* renamed from: sample-HG0u8IE  reason: not valid java name */
    public static final <T> Flow<T> m1658sampleHG0u8IE(Flow<? extends T> $this$sample_u2dHG0u8IE, long period) {
        return FlowKt.sample($this$sample_u2dHG0u8IE, DelayKt.m1608toDelayMillisLRDsOJo(period));
    }

    /* renamed from: timeout-HG0u8IE  reason: not valid java name */
    public static final <T> Flow<T> m1659timeoutHG0u8IE(Flow<? extends T> $this$timeout_u2dHG0u8IE, long timeout) {
        return m1660timeoutInternalHG0u8IE$FlowKt__DelayKt($this$timeout_u2dHG0u8IE, timeout);
    }

    /* renamed from: timeoutInternal-HG0u8IE$FlowKt__DelayKt  reason: not valid java name */
    private static final <T> Flow<T> m1660timeoutInternalHG0u8IE$FlowKt__DelayKt(Flow<? extends T> $this$timeoutInternal_u2dHG0u8IE, long timeout) {
        return FlowCoroutineKt.scopedFlow(new FlowKt__DelayKt$timeoutInternal$1(timeout, $this$timeoutInternal_u2dHG0u8IE, (Continuation<? super FlowKt__DelayKt$timeoutInternal$1>) null));
    }
}
