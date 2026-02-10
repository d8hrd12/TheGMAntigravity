package kotlin.collections;

import java.util.Iterator;
import java.util.List;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.jvm.internal.DebugMetadata;
import kotlin.coroutines.jvm.internal.RestrictedSuspendLambda;
import kotlin.jvm.functions.Function2;
import kotlin.sequences.SequenceScope;

@Metadata(d1 = {"\u0000\u0010\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010 \u0010\u0000\u001a\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u0002H\u00020\u00040\u0003H@"}, d2 = {"<anonymous>", "", "T", "Lkotlin/sequences/SequenceScope;", ""}, k = 3, mv = {1, 9, 0}, xi = 48)
@DebugMetadata(c = "kotlin.collections.SlidingWindowKt$windowedIterator$1", f = "SlidingWindow.kt", i = {0, 0, 0, 2, 2, 3, 3}, l = {34, 40, 49, 55, 58}, m = "invokeSuspend", n = {"$this$iterator", "buffer", "gap", "$this$iterator", "buffer", "$this$iterator", "buffer"}, s = {"L$0", "L$1", "I$0", "L$0", "L$1", "L$0", "L$1"})
/* compiled from: SlidingWindow.kt */
final class SlidingWindowKt$windowedIterator$1 extends RestrictedSuspendLambda implements Function2<SequenceScope<? super List<? extends T>>, Continuation<? super Unit>, Object> {
    final /* synthetic */ Iterator<T> $iterator;
    final /* synthetic */ boolean $partialWindows;
    final /* synthetic */ boolean $reuseBuffer;
    final /* synthetic */ int $size;
    final /* synthetic */ int $step;
    int I$0;
    private /* synthetic */ Object L$0;
    Object L$1;
    Object L$2;
    int label;

    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    SlidingWindowKt$windowedIterator$1(int i, int i2, Iterator<? extends T> it, boolean z, boolean z2, Continuation<? super SlidingWindowKt$windowedIterator$1> continuation) {
        super(2, continuation);
        this.$size = i;
        this.$step = i2;
        this.$iterator = it;
        this.$reuseBuffer = z;
        this.$partialWindows = z2;
    }

    public final Continuation<Unit> create(Object obj, Continuation<?> continuation) {
        SlidingWindowKt$windowedIterator$1 slidingWindowKt$windowedIterator$1 = new SlidingWindowKt$windowedIterator$1(this.$size, this.$step, this.$iterator, this.$reuseBuffer, this.$partialWindows, continuation);
        slidingWindowKt$windowedIterator$1.L$0 = obj;
        return slidingWindowKt$windowedIterator$1;
    }

    public final Object invoke(SequenceScope<? super List<? extends T>> sequenceScope, Continuation<? super Unit> continuation) {
        return ((SlidingWindowKt$windowedIterator$1) create(sequenceScope, continuation)).invokeSuspend(Unit.INSTANCE);
    }

    /* Debug info: failed to restart local var, previous not found, register: 10 */
    /* JADX WARNING: Code restructure failed: missing block: B:13:0x007a, code lost:
        if (r3.hasNext() == false) goto L_0x00b9;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:14:0x007c, code lost:
        r8 = r3.next();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:15:0x0080, code lost:
        if (r4 <= 0) goto L_0x0085;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:16:0x0082, code lost:
        r4 = r4 - 1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:17:0x0085, code lost:
        r5.add(r8);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:18:0x008e, code lost:
        if (r5.size() != r7.$size) goto L_0x0076;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:19:0x0090, code lost:
        r7.L$0 = r6;
        r7.L$1 = r5;
        r7.L$2 = r3;
        r7.I$0 = r1;
        r7.label = 1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:20:0x00a2, code lost:
        if (r6.yield(r5, r7) != r0) goto L_0x00a5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x00a4, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x00a5, code lost:
        r4 = r5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x00a8, code lost:
        if (r7.$reuseBuffer == false) goto L_0x00af;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x00aa, code lost:
        r4.clear();
        r5 = r4;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x00af, code lost:
        r5 = new java.util.ArrayList(r7.$size);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x00b7, code lost:
        r4 = r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x00c0, code lost:
        if (r5.isEmpty() != false) goto L_0x0192;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x00c4, code lost:
        if (r7.$partialWindows != false) goto L_0x00ce;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:0x00cc, code lost:
        if (r5.size() != r7.$size) goto L_0x0192;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:34:0x00ce, code lost:
        r7.L$0 = null;
        r7.L$1 = null;
        r7.L$2 = null;
        r7.label = 2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:35:0x00de, code lost:
        if (r6.yield(r5, r7) != r0) goto L_0x0192;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x00e0, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:39:0x00f3, code lost:
        if (r1.hasNext() == false) goto L_0x013c;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:40:0x00f5, code lost:
        r3.add(r1.next());
     */
    /* JADX WARNING: Code restructure failed: missing block: B:41:0x0100, code lost:
        if (r3.isFull() == false) goto L_0x00ef;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:43:0x0108, code lost:
        if (r3.size() >= r7.$size) goto L_0x0111;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:44:0x010a, code lost:
        r3 = r3.expanded(r7.$size);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:46:0x0113, code lost:
        if (r7.$reuseBuffer == false) goto L_0x0119;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:47:0x0115, code lost:
        r5 = r3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:48:0x0119, code lost:
        r5 = new java.util.ArrayList(r3);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:49:0x0123, code lost:
        r7.L$0 = r4;
        r7.L$1 = r3;
        r7.L$2 = r1;
        r7.label = 3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:50:0x0133, code lost:
        if (r4.yield(r5, r7) != r0) goto L_0x0136;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:51:0x0135, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:52:0x0136, code lost:
        r3.removeFirst(r7.$step);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:54:0x013e, code lost:
        if (r7.$partialWindows == false) goto L_0x0192;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:55:0x0140, code lost:
        r1 = r3;
        r3 = r4;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:57:0x0148, code lost:
        if (r1.size() <= r7.$step) goto L_0x0175;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:59:0x014c, code lost:
        if (r7.$reuseBuffer == false) goto L_0x0152;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:60:0x014e, code lost:
        r4 = r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:61:0x0152, code lost:
        r4 = new java.util.ArrayList(r1);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:62:0x015c, code lost:
        r7.L$0 = r3;
        r7.L$1 = r1;
        r7.L$2 = null;
        r7.label = 4;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:63:0x016c, code lost:
        if (r3.yield(r4, r7) != r0) goto L_0x016f;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:64:0x016e, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:65:0x016f, code lost:
        r1.removeFirst(r7.$step);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:67:0x017c, code lost:
        if (r1.isEmpty() != false) goto L_0x0192;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:68:0x017e, code lost:
        r7.L$0 = null;
        r7.L$1 = null;
        r7.L$2 = null;
        r7.label = 5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:69:0x018e, code lost:
        if (r3.yield(r1, r7) != r0) goto L_0x0192;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:70:0x0190, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:72:0x0194, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final java.lang.Object invokeSuspend(java.lang.Object r11) {
        /*
            r10 = this;
            java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r1 = r10.label
            r2 = 0
            switch(r1) {
                case 0: goto L_0x0052;
                case 1: goto L_0x003e;
                case 2: goto L_0x0038;
                case 3: goto L_0x0026;
                case 4: goto L_0x0018;
                case 5: goto L_0x0012;
                default: goto L_0x000a;
            }
        L_0x000a:
            java.lang.IllegalStateException r11 = new java.lang.IllegalStateException
            java.lang.String r0 = "call to 'resume' before 'invoke' with coroutine"
            r11.<init>(r0)
            throw r11
        L_0x0012:
            kotlin.ResultKt.throwOnFailure(r11)
            r7 = r10
            goto L_0x0191
        L_0x0018:
            java.lang.Object r1 = r10.L$1
            kotlin.collections.RingBuffer r1 = (kotlin.collections.RingBuffer) r1
            java.lang.Object r3 = r10.L$0
            kotlin.sequences.SequenceScope r3 = (kotlin.sequences.SequenceScope) r3
            kotlin.ResultKt.throwOnFailure(r11)
            r7 = r10
            goto L_0x016f
        L_0x0026:
            java.lang.Object r1 = r10.L$2
            java.util.Iterator r1 = (java.util.Iterator) r1
            java.lang.Object r3 = r10.L$1
            kotlin.collections.RingBuffer r3 = (kotlin.collections.RingBuffer) r3
            java.lang.Object r4 = r10.L$0
            kotlin.sequences.SequenceScope r4 = (kotlin.sequences.SequenceScope) r4
            kotlin.ResultKt.throwOnFailure(r11)
            r7 = r10
            goto L_0x0136
        L_0x0038:
            kotlin.ResultKt.throwOnFailure(r11)
            r7 = r10
            goto L_0x00e1
        L_0x003e:
            int r1 = r10.I$0
            java.lang.Object r3 = r10.L$2
            java.util.Iterator r3 = (java.util.Iterator) r3
            java.lang.Object r4 = r10.L$1
            java.util.ArrayList r4 = (java.util.ArrayList) r4
            java.lang.Object r5 = r10.L$0
            kotlin.sequences.SequenceScope r5 = (kotlin.sequences.SequenceScope) r5
            kotlin.ResultKt.throwOnFailure(r11)
            r7 = r10
            r6 = r5
            goto L_0x00a6
        L_0x0052:
            kotlin.ResultKt.throwOnFailure(r11)
            java.lang.Object r1 = r10.L$0
            kotlin.sequences.SequenceScope r1 = (kotlin.sequences.SequenceScope) r1
            int r3 = r10.$size
            r4 = 1024(0x400, float:1.435E-42)
            int r3 = kotlin.ranges.RangesKt.coerceAtMost((int) r3, (int) r4)
            int r4 = r10.$step
            int r5 = r10.$size
            int r4 = r4 - r5
            if (r4 < 0) goto L_0x00e3
            java.util.ArrayList r5 = new java.util.ArrayList
            r5.<init>(r3)
            r3 = 0
            java.util.Iterator<T> r6 = r10.$iterator
            r7 = r6
            r6 = r1
            r1 = r4
            r4 = r3
            r3 = r7
            r7 = r10
        L_0x0076:
            boolean r8 = r3.hasNext()
            if (r8 == 0) goto L_0x00b9
            java.lang.Object r8 = r3.next()
            if (r4 <= 0) goto L_0x0085
            int r4 = r4 + -1
            goto L_0x0076
        L_0x0085:
            r5.add(r8)
            int r8 = r5.size()
            int r9 = r7.$size
            if (r8 != r9) goto L_0x0076
            r4 = r7
            kotlin.coroutines.Continuation r4 = (kotlin.coroutines.Continuation) r4
            r7.L$0 = r6
            r7.L$1 = r5
            r7.L$2 = r3
            r7.I$0 = r1
            r8 = 1
            r7.label = r8
            java.lang.Object r4 = r6.yield(r5, r4)
            if (r4 != r0) goto L_0x00a5
            return r0
        L_0x00a5:
            r4 = r5
        L_0x00a6:
            boolean r5 = r7.$reuseBuffer
            if (r5 == 0) goto L_0x00af
            r4.clear()
            r5 = r4
            goto L_0x00b7
        L_0x00af:
            java.util.ArrayList r4 = new java.util.ArrayList
            int r5 = r7.$size
            r4.<init>(r5)
            r5 = r4
        L_0x00b7:
            r4 = r1
            goto L_0x0076
        L_0x00b9:
            r1 = r5
            java.util.Collection r1 = (java.util.Collection) r1
            boolean r1 = r1.isEmpty()
            if (r1 != 0) goto L_0x0192
            boolean r1 = r7.$partialWindows
            if (r1 != 0) goto L_0x00ce
            int r1 = r5.size()
            int r3 = r7.$size
            if (r1 != r3) goto L_0x0192
        L_0x00ce:
            r1 = r7
            kotlin.coroutines.Continuation r1 = (kotlin.coroutines.Continuation) r1
            r7.L$0 = r2
            r7.L$1 = r2
            r7.L$2 = r2
            r2 = 2
            r7.label = r2
            java.lang.Object r1 = r6.yield(r5, r1)
            if (r1 != r0) goto L_0x00e1
            return r0
        L_0x00e1:
            goto L_0x0192
        L_0x00e3:
            kotlin.collections.RingBuffer r4 = new kotlin.collections.RingBuffer
            r4.<init>(r3)
            java.util.Iterator<T> r3 = r10.$iterator
            r7 = r4
            r4 = r1
            r1 = r3
            r3 = r7
            r7 = r10
        L_0x00ef:
            boolean r5 = r1.hasNext()
            if (r5 == 0) goto L_0x013c
            java.lang.Object r5 = r1.next()
            r3.add(r5)
            boolean r5 = r3.isFull()
            if (r5 == 0) goto L_0x00ef
            int r5 = r3.size()
            int r6 = r7.$size
            if (r5 >= r6) goto L_0x0111
            int r5 = r7.$size
            kotlin.collections.RingBuffer r3 = r3.expanded(r5)
            goto L_0x00ef
        L_0x0111:
            boolean r5 = r7.$reuseBuffer
            if (r5 == 0) goto L_0x0119
            r5 = r3
            java.util.List r5 = (java.util.List) r5
            goto L_0x0123
        L_0x0119:
            java.util.ArrayList r5 = new java.util.ArrayList
            r6 = r3
            java.util.Collection r6 = (java.util.Collection) r6
            r5.<init>(r6)
            java.util.List r5 = (java.util.List) r5
        L_0x0123:
            r6 = r7
            kotlin.coroutines.Continuation r6 = (kotlin.coroutines.Continuation) r6
            r7.L$0 = r4
            r7.L$1 = r3
            r7.L$2 = r1
            r8 = 3
            r7.label = r8
            java.lang.Object r5 = r4.yield(r5, r6)
            if (r5 != r0) goto L_0x0136
            return r0
        L_0x0136:
            int r5 = r7.$step
            r3.removeFirst(r5)
            goto L_0x00ef
        L_0x013c:
            boolean r1 = r7.$partialWindows
            if (r1 == 0) goto L_0x0192
            r1 = r3
            r3 = r4
        L_0x0142:
            int r4 = r1.size()
            int r5 = r7.$step
            if (r4 <= r5) goto L_0x0175
            boolean r4 = r7.$reuseBuffer
            if (r4 == 0) goto L_0x0152
            r4 = r1
            java.util.List r4 = (java.util.List) r4
            goto L_0x015c
        L_0x0152:
            java.util.ArrayList r4 = new java.util.ArrayList
            r5 = r1
            java.util.Collection r5 = (java.util.Collection) r5
            r4.<init>(r5)
            java.util.List r4 = (java.util.List) r4
        L_0x015c:
            r5 = r7
            kotlin.coroutines.Continuation r5 = (kotlin.coroutines.Continuation) r5
            r7.L$0 = r3
            r7.L$1 = r1
            r7.L$2 = r2
            r6 = 4
            r7.label = r6
            java.lang.Object r4 = r3.yield(r4, r5)
            if (r4 != r0) goto L_0x016f
            return r0
        L_0x016f:
            int r4 = r7.$step
            r1.removeFirst(r4)
            goto L_0x0142
        L_0x0175:
            r4 = r1
            java.util.Collection r4 = (java.util.Collection) r4
            boolean r4 = r4.isEmpty()
            if (r4 != 0) goto L_0x0192
            r4 = r7
            kotlin.coroutines.Continuation r4 = (kotlin.coroutines.Continuation) r4
            r7.L$0 = r2
            r7.L$1 = r2
            r7.L$2 = r2
            r2 = 5
            r7.label = r2
            java.lang.Object r1 = r3.yield(r1, r4)
            if (r1 != r0) goto L_0x0191
            return r0
        L_0x0191:
        L_0x0192:
            kotlin.Unit r0 = kotlin.Unit.INSTANCE
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlin.collections.SlidingWindowKt$windowedIterator$1.invokeSuspend(java.lang.Object):java.lang.Object");
    }
}
