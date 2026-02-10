package kotlinx.coroutines.flow.internal;

import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.jvm.internal.DebugMetadata;
import kotlin.coroutines.jvm.internal.SuspendLambda;
import kotlin.jvm.functions.Function0;
import kotlin.jvm.functions.Function2;
import kotlin.jvm.functions.Function3;
import kotlinx.coroutines.CoroutineScope;
import kotlinx.coroutines.flow.Flow;
import kotlinx.coroutines.flow.FlowCollector;

@Metadata(d1 = {"\u0000\u000e\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\u0010\u0000\u001a\u00020\u0001\"\u0004\b\u0000\u0010\u0002\"\u0004\b\u0001\u0010\u0003*\u00020\u0004H@"}, d2 = {"<anonymous>", "", "R", "T", "Lkotlinx/coroutines/CoroutineScope;"}, k = 3, mv = {1, 9, 0}, xi = 48)
@DebugMetadata(c = "kotlinx.coroutines.flow.internal.CombineKt$combineInternal$2", f = "Combine.kt", i = {0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2}, l = {51, 73, 76}, m = "invokeSuspend", n = {"latestValues", "resultChannel", "lastReceivedEpoch", "remainingAbsentValues", "currentEpoch", "latestValues", "resultChannel", "lastReceivedEpoch", "remainingAbsentValues", "currentEpoch", "latestValues", "resultChannel", "lastReceivedEpoch", "remainingAbsentValues", "currentEpoch"}, s = {"L$0", "L$1", "L$2", "I$0", "I$1", "L$0", "L$1", "L$2", "I$0", "I$1", "L$0", "L$1", "L$2", "I$0", "I$1"})
/* compiled from: Combine.kt */
final class CombineKt$combineInternal$2 extends SuspendLambda implements Function2<CoroutineScope, Continuation<? super Unit>, Object> {
    final /* synthetic */ Function0<T[]> $arrayFactory;
    final /* synthetic */ Flow<T>[] $flows;
    final /* synthetic */ FlowCollector<R> $this_combineInternal;
    final /* synthetic */ Function3<FlowCollector<? super R>, T[], Continuation<? super Unit>, Object> $transform;
    int I$0;
    int I$1;
    private /* synthetic */ Object L$0;
    Object L$1;
    Object L$2;
    int label;

    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    CombineKt$combineInternal$2(Flow<? extends T>[] flowArr, Function0<T[]> function0, Function3<? super FlowCollector<? super R>, ? super T[], ? super Continuation<? super Unit>, ? extends Object> function3, FlowCollector<? super R> flowCollector, Continuation<? super CombineKt$combineInternal$2> continuation) {
        super(2, continuation);
        this.$flows = flowArr;
        this.$arrayFactory = function0;
        this.$transform = function3;
        this.$this_combineInternal = flowCollector;
    }

    public final Continuation<Unit> create(Object obj, Continuation<?> continuation) {
        CombineKt$combineInternal$2 combineKt$combineInternal$2 = new CombineKt$combineInternal$2(this.$flows, this.$arrayFactory, this.$transform, this.$this_combineInternal, continuation);
        combineKt$combineInternal$2.L$0 = obj;
        return combineKt$combineInternal$2;
    }

    public final Object invoke(CoroutineScope coroutineScope, Continuation<? super Unit> continuation) {
        return ((CombineKt$combineInternal$2) create(coroutineScope, continuation)).invokeSuspend(Unit.INSTANCE);
    }

    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r5v2, resolved type: byte} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r5v5, resolved type: byte} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r5v7, resolved type: byte} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r5v9, resolved type: byte} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r5v11, resolved type: byte} */
    /* JADX WARNING: Multi-variable type inference failed */
    /* JADX WARNING: Removed duplicated region for block: B:17:0x00dc A[RETURN] */
    /* JADX WARNING: Removed duplicated region for block: B:18:0x00dd  */
    /* JADX WARNING: Removed duplicated region for block: B:31:0x0113  */
    /* JADX WARNING: Removed duplicated region for block: B:41:0x015b  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final java.lang.Object invokeSuspend(java.lang.Object r21) {
        /*
            r20 = this;
            java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            r1 = r20
            int r2 = r1.label
            switch(r2) {
                case 0: goto L_0x0074;
                case 1: goto L_0x004f;
                case 2: goto L_0x0031;
                case 3: goto L_0x0013;
                default: goto L_0x000b;
            }
        L_0x000b:
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException
            java.lang.String r2 = "call to 'resume' before 'invoke' with coroutine"
            r0.<init>(r2)
            throw r0
        L_0x0013:
            r2 = r20
            r3 = r21
            int r4 = r2.I$1
            int r5 = r2.I$0
            java.lang.Object r6 = r2.L$2
            byte[] r6 = (byte[]) r6
            java.lang.Object r7 = r2.L$1
            kotlinx.coroutines.channels.Channel r7 = (kotlinx.coroutines.channels.Channel) r7
            java.lang.Object r8 = r2.L$0
            java.lang.Object[] r8 = (java.lang.Object[]) r8
            kotlin.ResultKt.throwOnFailure(r3)
            r11 = r5
            r5 = r4
            r4 = r6
            r6 = r11
            r11 = r8
            goto L_0x0159
        L_0x0031:
            r2 = r20
            r3 = r21
            int r4 = r2.I$1
            int r5 = r2.I$0
            java.lang.Object r6 = r2.L$2
            byte[] r6 = (byte[]) r6
            java.lang.Object r7 = r2.L$1
            kotlinx.coroutines.channels.Channel r7 = (kotlinx.coroutines.channels.Channel) r7
            java.lang.Object r8 = r2.L$0
            java.lang.Object[] r8 = (java.lang.Object[]) r8
            kotlin.ResultKt.throwOnFailure(r3)
            r11 = r5
            r5 = r4
            r4 = r6
            r6 = r11
            r11 = r8
            goto L_0x0136
        L_0x004f:
            r2 = r20
            r3 = r21
            int r4 = r2.I$1
            int r5 = r2.I$0
            java.lang.Object r6 = r2.L$2
            byte[] r6 = (byte[]) r6
            java.lang.Object r7 = r2.L$1
            kotlinx.coroutines.channels.Channel r7 = (kotlinx.coroutines.channels.Channel) r7
            java.lang.Object r8 = r2.L$0
            java.lang.Object[] r8 = (java.lang.Object[]) r8
            kotlin.ResultKt.throwOnFailure(r3)
            r9 = r3
            kotlinx.coroutines.channels.ChannelResult r9 = (kotlinx.coroutines.channels.ChannelResult) r9
            java.lang.Object r9 = r9.m1641unboximpl()
            r19 = r5
            r5 = r4
            r4 = r6
            r6 = r19
            goto L_0x00de
        L_0x0074:
            kotlin.ResultKt.throwOnFailure(r21)
            r2 = r20
            r3 = r21
            java.lang.Object r4 = r2.L$0
            r5 = r4
            kotlinx.coroutines.CoroutineScope r5 = (kotlinx.coroutines.CoroutineScope) r5
            kotlinx.coroutines.flow.Flow<T>[] r4 = r2.$flows
            int r4 = r4.length
            if (r4 != 0) goto L_0x0088
            kotlin.Unit r0 = kotlin.Unit.INSTANCE
            return r0
        L_0x0088:
            java.lang.Object[] r6 = new java.lang.Object[r4]
            kotlinx.coroutines.internal.Symbol r7 = kotlinx.coroutines.flow.internal.NullSurrogateKt.UNINITIALIZED
            r10 = 6
            r11 = 0
            r8 = 0
            r9 = 0
            kotlin.collections.ArraysKt.fill$default((java.lang.Object[]) r6, (java.lang.Object) r7, (int) r8, (int) r9, (int) r10, (java.lang.Object) r11)
            r11 = r6
            r6 = 6
            r7 = 0
            kotlinx.coroutines.channels.Channel r16 = kotlinx.coroutines.channels.ChannelKt.Channel$default(r4, r7, r7, r6, r7)
            java.util.concurrent.atomic.AtomicInteger r15 = new java.util.concurrent.atomic.AtomicInteger
            r15.<init>(r4)
            r18 = r4
            r6 = 0
            r14 = r6
        L_0x00a3:
            if (r14 >= r4) goto L_0x00bb
            kotlinx.coroutines.flow.internal.CombineKt$combineInternal$2$1 r12 = new kotlinx.coroutines.flow.internal.CombineKt$combineInternal$2$1
            kotlinx.coroutines.flow.Flow<T>[] r13 = r2.$flows
            r17 = 0
            r12.<init>(r13, r14, r15, r16, r17)
            r8 = r12
            kotlin.jvm.functions.Function2 r8 = (kotlin.jvm.functions.Function2) r8
            r9 = 3
            r10 = 0
            r6 = 0
            r7 = 0
            kotlinx.coroutines.Job unused = kotlinx.coroutines.BuildersKt__Builders_commonKt.launch$default(r5, r6, r7, r8, r9, r10)
            int r14 = r14 + 1
            goto L_0x00a3
        L_0x00bb:
            byte[] r4 = new byte[r4]
            r5 = 0
            r7 = r16
            r6 = r18
        L_0x00c2:
            int r8 = r5 + 1
            byte r5 = (byte) r8
            r8 = r2
            kotlin.coroutines.Continuation r8 = (kotlin.coroutines.Continuation) r8
            r2.L$0 = r11
            r2.L$1 = r7
            r2.L$2 = r4
            r2.I$0 = r6
            r2.I$1 = r5
            r9 = 1
            r2.label = r9
            java.lang.Object r9 = r7.m1650receiveCatchingJP2dKIU(r8)
            if (r9 != r0) goto L_0x00dd
            return r0
        L_0x00dd:
            r8 = r11
        L_0x00de:
            java.lang.Object r9 = kotlinx.coroutines.channels.ChannelResult.m1634getOrNullimpl(r9)
            kotlin.collections.IndexedValue r9 = (kotlin.collections.IndexedValue) r9
            if (r9 != 0) goto L_0x00e9
            kotlin.Unit r0 = kotlin.Unit.INSTANCE
            return r0
        L_0x00e9:
            int r10 = r9.getIndex()
            r11 = r8[r10]
            java.lang.Object r12 = r9.getValue()
            r8[r10] = r12
            kotlinx.coroutines.internal.Symbol r9 = kotlinx.coroutines.flow.internal.NullSurrogateKt.UNINITIALIZED
            if (r11 != r9) goto L_0x00fc
            int r6 = r6 + -1
        L_0x00fc:
            byte r9 = r4[r10]
            if (r9 == r5) goto L_0x0111
            byte r9 = (byte) r5
            r4[r10] = r9
            java.lang.Object r9 = r7.m1651tryReceivePtdJZtk()
            java.lang.Object r9 = kotlinx.coroutines.channels.ChannelResult.m1634getOrNullimpl(r9)
            kotlin.collections.IndexedValue r9 = (kotlin.collections.IndexedValue) r9
            if (r9 != 0) goto L_0x0110
            goto L_0x0111
        L_0x0110:
            goto L_0x00e9
        L_0x0111:
            if (r6 != 0) goto L_0x015b
            kotlin.jvm.functions.Function0<T[]> r9 = r2.$arrayFactory
            java.lang.Object r9 = r9.invoke()
            java.lang.Object[] r9 = (java.lang.Object[]) r9
            if (r9 != 0) goto L_0x0137
            kotlin.jvm.functions.Function3<kotlinx.coroutines.flow.FlowCollector<? super R>, T[], kotlin.coroutines.Continuation<? super kotlin.Unit>, java.lang.Object> r9 = r2.$transform
            kotlinx.coroutines.flow.FlowCollector<R> r10 = r2.$this_combineInternal
            r2.L$0 = r8
            r2.L$1 = r7
            r2.L$2 = r4
            r2.I$0 = r6
            r2.I$1 = r5
            r11 = 2
            r2.label = r11
            java.lang.Object r9 = r9.invoke(r10, r8, r2)
            if (r9 != r0) goto L_0x0135
            return r0
        L_0x0135:
            r11 = r8
        L_0x0136:
            goto L_0x00c2
        L_0x0137:
            r13 = 14
            r14 = 0
            r10 = 0
            r11 = 0
            r12 = 0
            kotlin.collections.ArraysKt.copyInto$default((java.lang.Object[]) r8, (java.lang.Object[]) r9, (int) r10, (int) r11, (int) r12, (int) r13, (java.lang.Object) r14)
            kotlin.jvm.functions.Function3<kotlinx.coroutines.flow.FlowCollector<? super R>, T[], kotlin.coroutines.Continuation<? super kotlin.Unit>, java.lang.Object> r10 = r2.$transform
            kotlinx.coroutines.flow.FlowCollector<R> r11 = r2.$this_combineInternal
            r2.L$0 = r8
            r2.L$1 = r7
            r2.L$2 = r4
            r2.I$0 = r6
            r2.I$1 = r5
            r12 = 3
            r2.label = r12
            java.lang.Object r9 = r10.invoke(r11, r9, r2)
            if (r9 != r0) goto L_0x0158
            return r0
        L_0x0158:
            r11 = r8
        L_0x0159:
            goto L_0x00c2
        L_0x015b:
            r11 = r8
            goto L_0x00c2
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.flow.internal.CombineKt$combineInternal$2.invokeSuspend(java.lang.Object):java.lang.Object");
    }
}
