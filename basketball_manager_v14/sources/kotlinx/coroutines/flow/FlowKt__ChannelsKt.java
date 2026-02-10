package kotlinx.coroutines.flow;

import kotlin.Deprecated;
import kotlin.DeprecationLevel;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.CoroutineContext;
import kotlin.coroutines.intrinsics.IntrinsicsKt;
import kotlin.jvm.internal.DefaultConstructorMarker;
import kotlinx.coroutines.CoroutineScope;
import kotlinx.coroutines.channels.BroadcastChannel;
import kotlinx.coroutines.channels.BufferOverflow;
import kotlinx.coroutines.channels.ReceiveChannel;
import kotlinx.coroutines.flow.internal.ChannelFlowKt;

@Metadata(d1 = {"\u00000\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010\u000b\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0002\u001a\u001e\u0010\u0000\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u0003H\u0007\u001a\u001c\u0010\u0004\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u0005\u001a,\u0010\u0006\u001a\u00020\u0007\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\b2\f\u0010\t\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0005H@¢\u0006\u0002\u0010\n\u001a6\u0010\u000b\u001a\u00020\u0007\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\b2\f\u0010\t\u001a\b\u0012\u0004\u0012\u0002H\u00020\u00052\u0006\u0010\f\u001a\u00020\rH@¢\u0006\u0004\b\u000e\u0010\u000f\u001a$\u0010\u0010\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0005\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u00012\u0006\u0010\u0011\u001a\u00020\u0012\u001a\u001c\u0010\u0013\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u0005¨\u0006\u0014"}, d2 = {"asFlow", "Lkotlinx/coroutines/flow/Flow;", "T", "Lkotlinx/coroutines/channels/BroadcastChannel;", "consumeAsFlow", "Lkotlinx/coroutines/channels/ReceiveChannel;", "emitAll", "", "Lkotlinx/coroutines/flow/FlowCollector;", "channel", "(Lkotlinx/coroutines/flow/FlowCollector;Lkotlinx/coroutines/channels/ReceiveChannel;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "emitAllImpl", "consume", "", "emitAllImpl$FlowKt__ChannelsKt", "(Lkotlinx/coroutines/flow/FlowCollector;Lkotlinx/coroutines/channels/ReceiveChannel;ZLkotlin/coroutines/Continuation;)Ljava/lang/Object;", "produceIn", "scope", "Lkotlinx/coroutines/CoroutineScope;", "receiveAsFlow", "kotlinx-coroutines-core"}, k = 5, mv = {1, 9, 0}, xi = 48, xs = "kotlinx/coroutines/flow/FlowKt")
/* compiled from: Channels.kt */
final /* synthetic */ class FlowKt__ChannelsKt {
    public static final <T> Object emitAll(FlowCollector<? super T> $this$emitAll, ReceiveChannel<? extends T> channel, Continuation<? super Unit> $completion) {
        Object emitAllImpl$FlowKt__ChannelsKt = emitAllImpl$FlowKt__ChannelsKt($this$emitAll, channel, true, $completion);
        return emitAllImpl$FlowKt__ChannelsKt == IntrinsicsKt.getCOROUTINE_SUSPENDED() ? emitAllImpl$FlowKt__ChannelsKt : Unit.INSTANCE;
    }

    /* access modifiers changed from: private */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x006d, code lost:
        r0.L$0 = r7;
        r0.L$1 = r2;
        r0.L$2 = r3;
        r0.Z$0 = r9;
        r0.label = 1;
        r4 = r3.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x007c, code lost:
        if (r4 != r1) goto L_0x007f;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x007e, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x007f, code lost:
        r6 = r4;
        r4 = r7;
        r7 = r9;
        r9 = r8;
        r8 = r3;
        r3 = r2;
        r2 = r1;
        r1 = r0;
        r0 = r10;
        r10 = r6;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x008f, code lost:
        if (((java.lang.Boolean) r10).booleanValue() == false) goto L_0x00b0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0091, code lost:
        r10 = r8.next();
        r1.L$0 = r4;
        r1.L$1 = r3;
        r1.L$2 = r8;
        r1.Z$0 = r7;
        r1.label = 2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x00a4, code lost:
        if (r4.emit(r10, r1) != r2) goto L_0x00a7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x00a6, code lost:
        return r2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x00a7, code lost:
        r10 = r0;
        r0 = r1;
        r1 = r2;
        r2 = r3;
        r3 = r8;
        r8 = r9;
        r9 = r7;
        r7 = r4;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:0x00b0, code lost:
        if (r7 == false) goto L_0x00b5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:34:0x00b2, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r3, r9);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x00b8, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:37:0x00b9, code lost:
        r8 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:38:0x00ba, code lost:
        r10 = r0;
        r0 = r1;
        r2 = r3;
     */
    /* JADX WARNING: Incorrect type for immutable var: ssa=kotlinx.coroutines.flow.FlowCollector<? super T>, code=kotlinx.coroutines.flow.FlowCollector, for r7v0, types: [kotlinx.coroutines.flow.FlowCollector, kotlinx.coroutines.flow.FlowCollector<? super T>] */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:14:0x0045  */
    /* JADX WARNING: Removed duplicated region for block: B:19:0x0060  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final <T> java.lang.Object emitAllImpl$FlowKt__ChannelsKt(kotlinx.coroutines.flow.FlowCollector r7, kotlinx.coroutines.channels.ReceiveChannel<? extends T> r8, boolean r9, kotlin.coroutines.Continuation<? super kotlin.Unit> r10) {
        /*
            boolean r0 = r10 instanceof kotlinx.coroutines.flow.FlowKt__ChannelsKt$emitAllImpl$1
            if (r0 == 0) goto L_0x0014
            r0 = r10
            kotlinx.coroutines.flow.FlowKt__ChannelsKt$emitAllImpl$1 r0 = (kotlinx.coroutines.flow.FlowKt__ChannelsKt$emitAllImpl$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r10 = r0.label
            int r10 = r10 - r2
            r0.label = r10
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.flow.FlowKt__ChannelsKt$emitAllImpl$1 r0 = new kotlinx.coroutines.flow.FlowKt__ChannelsKt$emitAllImpl$1
            r0.<init>(r10)
        L_0x0019:
            java.lang.Object r10 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x0060;
                case 1: goto L_0x0045;
                case 2: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r7 = new java.lang.IllegalStateException
            java.lang.String r8 = "call to 'resume' before 'invoke' with coroutine"
            r7.<init>(r8)
            throw r7
        L_0x002c:
            boolean r7 = r0.Z$0
            java.lang.Object r8 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r8 = (kotlinx.coroutines.channels.ChannelIterator) r8
            r9 = 0
            java.lang.Object r2 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r2 = (kotlinx.coroutines.channels.ReceiveChannel) r2
            java.lang.Object r3 = r0.L$0
            kotlinx.coroutines.flow.FlowCollector r3 = (kotlinx.coroutines.flow.FlowCollector) r3
            kotlin.ResultKt.throwOnFailure(r10)     // Catch:{ all -> 0x005d }
            r6 = r9
            r9 = r7
            r7 = r3
            r3 = r8
            r8 = r6
            goto L_0x00af
        L_0x0045:
            boolean r7 = r0.Z$0
            java.lang.Object r8 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r8 = (kotlinx.coroutines.channels.ChannelIterator) r8
            r9 = 0
            java.lang.Object r2 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r2 = (kotlinx.coroutines.channels.ReceiveChannel) r2
            java.lang.Object r3 = r0.L$0
            kotlinx.coroutines.flow.FlowCollector r3 = (kotlinx.coroutines.flow.FlowCollector) r3
            kotlin.ResultKt.throwOnFailure(r10)     // Catch:{ all -> 0x005d }
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r0
            r0 = r10
            goto L_0x0089
        L_0x005d:
            r8 = move-exception
            goto L_0x00c3
        L_0x0060:
            kotlin.ResultKt.throwOnFailure(r10)
            r2 = r8
            kotlinx.coroutines.flow.FlowKt.ensureActive(r7)
            r8 = 0
            kotlinx.coroutines.channels.ChannelIterator r3 = r2.iterator()     // Catch:{ all -> 0x00be }
        L_0x006d:
            r0.L$0 = r7     // Catch:{ all -> 0x00be }
            r0.L$1 = r2     // Catch:{ all -> 0x00be }
            r0.L$2 = r3     // Catch:{ all -> 0x00be }
            r0.Z$0 = r9     // Catch:{ all -> 0x00be }
            r4 = 1
            r0.label = r4     // Catch:{ all -> 0x00be }
            java.lang.Object r4 = r3.hasNext(r0)     // Catch:{ all -> 0x00be }
            if (r4 != r1) goto L_0x007f
            return r1
        L_0x007f:
            r6 = r4
            r4 = r7
            r7 = r9
            r9 = r8
            r8 = r3
            r3 = r2
            r2 = r1
            r1 = r0
            r0 = r10
            r10 = r6
        L_0x0089:
            java.lang.Boolean r10 = (java.lang.Boolean) r10     // Catch:{ all -> 0x00b9 }
            boolean r10 = r10.booleanValue()     // Catch:{ all -> 0x00b9 }
            if (r10 == 0) goto L_0x00b0
            java.lang.Object r10 = r8.next()     // Catch:{ all -> 0x00b9 }
            r1.L$0 = r4     // Catch:{ all -> 0x00b9 }
            r1.L$1 = r3     // Catch:{ all -> 0x00b9 }
            r1.L$2 = r8     // Catch:{ all -> 0x00b9 }
            r1.Z$0 = r7     // Catch:{ all -> 0x00b9 }
            r5 = 2
            r1.label = r5     // Catch:{ all -> 0x00b9 }
            java.lang.Object r5 = r4.emit(r10, r1)     // Catch:{ all -> 0x00b9 }
            if (r5 != r2) goto L_0x00a7
            return r2
        L_0x00a7:
            r10 = r0
            r0 = r1
            r1 = r2
            r2 = r3
            r3 = r8
            r8 = r9
            r9 = r7
            r7 = r4
        L_0x00af:
            goto L_0x006d
        L_0x00b0:
            if (r7 == 0) goto L_0x00b5
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r3, r9)
        L_0x00b5:
            kotlin.Unit r7 = kotlin.Unit.INSTANCE
            return r7
        L_0x00b9:
            r8 = move-exception
            r10 = r0
            r0 = r1
            r2 = r3
            goto L_0x00c3
        L_0x00be:
            r7 = move-exception
            r6 = r8
            r8 = r7
            r7 = r9
            r9 = r6
        L_0x00c3:
            r9 = r8
            throw r8     // Catch:{ all -> 0x00c6 }
        L_0x00c6:
            r8 = move-exception
            if (r7 == 0) goto L_0x00cc
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r2, r9)
        L_0x00cc:
            throw r8
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.flow.FlowKt__ChannelsKt.emitAllImpl$FlowKt__ChannelsKt(kotlinx.coroutines.flow.FlowCollector, kotlinx.coroutines.channels.ReceiveChannel, boolean, kotlin.coroutines.Continuation):java.lang.Object");
    }

    public static final <T> Flow<T> receiveAsFlow(ReceiveChannel<? extends T> $this$receiveAsFlow) {
        return new ChannelAsFlow<>($this$receiveAsFlow, false, (CoroutineContext) null, 0, (BufferOverflow) null, 28, (DefaultConstructorMarker) null);
    }

    public static final <T> Flow<T> consumeAsFlow(ReceiveChannel<? extends T> $this$consumeAsFlow) {
        return new ChannelAsFlow<>($this$consumeAsFlow, true, (CoroutineContext) null, 0, (BufferOverflow) null, 28, (DefaultConstructorMarker) null);
    }

    @Deprecated(level = DeprecationLevel.ERROR, message = "'BroadcastChannel' is obsolete and all corresponding operators are deprecated in the favour of StateFlow and SharedFlow")
    public static final <T> Flow<T> asFlow(BroadcastChannel<T> $this$asFlow) {
        return new FlowKt__ChannelsKt$asFlow$$inlined$unsafeFlow$1($this$asFlow);
    }

    public static final <T> ReceiveChannel<T> produceIn(Flow<? extends T> $this$produceIn, CoroutineScope scope) {
        return ChannelFlowKt.asChannelFlow($this$produceIn).produceImpl(scope);
    }
}
