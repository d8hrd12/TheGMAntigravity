package kotlin.sequences;

import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.jvm.internal.DebugMetadata;
import kotlin.coroutines.jvm.internal.RestrictedSuspendLambda;
import kotlin.jvm.functions.Function2;
import kotlin.jvm.functions.Function3;

@Metadata(d1 = {"\u0000\u000e\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\u0010\u0000\u001a\u00020\u0001\"\u0004\b\u0000\u0010\u0002\"\b\b\u0001\u0010\u0003*\u0002H\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u0004H@"}, d2 = {"<anonymous>", "", "S", "T", "Lkotlin/sequences/SequenceScope;"}, k = 3, mv = {1, 9, 0}, xi = 48)
@DebugMetadata(c = "kotlin.sequences.SequencesKt___SequencesKt$runningReduceIndexed$1", f = "_Sequences.kt", i = {0, 0, 0, 1, 1, 1, 1}, l = {2397, 2401}, m = "invokeSuspend", n = {"$this$sequence", "iterator", "accumulator", "$this$sequence", "iterator", "accumulator", "index"}, s = {"L$0", "L$1", "L$2", "L$0", "L$1", "L$2", "I$0"})
/* compiled from: _Sequences.kt */
final class SequencesKt___SequencesKt$runningReduceIndexed$1 extends RestrictedSuspendLambda implements Function2<SequenceScope<? super S>, Continuation<? super Unit>, Object> {
    final /* synthetic */ Function3<Integer, S, T, S> $operation;
    final /* synthetic */ Sequence<T> $this_runningReduceIndexed;
    int I$0;
    private /* synthetic */ Object L$0;
    Object L$1;
    Object L$2;
    int label;

    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    SequencesKt___SequencesKt$runningReduceIndexed$1(Sequence<? extends T> sequence, Function3<? super Integer, ? super S, ? super T, ? extends S> function3, Continuation<? super SequencesKt___SequencesKt$runningReduceIndexed$1> continuation) {
        super(2, continuation);
        this.$this_runningReduceIndexed = sequence;
        this.$operation = function3;
    }

    public final Continuation<Unit> create(Object obj, Continuation<?> continuation) {
        SequencesKt___SequencesKt$runningReduceIndexed$1 sequencesKt___SequencesKt$runningReduceIndexed$1 = new SequencesKt___SequencesKt$runningReduceIndexed$1(this.$this_runningReduceIndexed, this.$operation, continuation);
        sequencesKt___SequencesKt$runningReduceIndexed$1.L$0 = obj;
        return sequencesKt___SequencesKt$runningReduceIndexed$1;
    }

    public final Object invoke(SequenceScope<? super S> sequenceScope, Continuation<? super Unit> continuation) {
        return ((SequencesKt___SequencesKt$runningReduceIndexed$1) create(sequenceScope, continuation)).invokeSuspend(Unit.INSTANCE);
    }

    /* Debug info: failed to restart local var, previous not found, register: 9 */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r1v8, resolved type: java.lang.Object} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r3v3, resolved type: kotlin.sequences.SequenceScope} */
    /* JADX WARNING: Code restructure failed: missing block: B:11:0x005f, code lost:
        r5 = r3;
        r3 = r2;
        r2 = 1;
        r4 = r5;
        r5 = r9;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:13:0x0069, code lost:
        if (r3.hasNext() == false) goto L_0x0099;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:14:0x006b, code lost:
        r6 = r5.$operation;
        r7 = r2 + 1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:15:0x006f, code lost:
        if (r2 >= 0) goto L_0x0074;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:16:0x0071, code lost:
        kotlin.collections.CollectionsKt.throwIndexOverflow();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:17:0x0074, code lost:
        r2 = r6.invoke(kotlin.coroutines.jvm.internal.Boxing.boxInt(r2), r1, r3.next());
        r5.L$0 = r4;
        r5.L$1 = r3;
        r5.L$2 = r2;
        r5.I$0 = r7;
        r5.label = 2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:18:0x0092, code lost:
        if (r4.yield(r2, r5) != r0) goto L_0x0095;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:19:0x0094, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:20:0x0095, code lost:
        r1 = r2;
        r2 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x009b, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Multi-variable type inference failed */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final java.lang.Object invokeSuspend(java.lang.Object r10) {
        /*
            r9 = this;
            java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r1 = r9.label
            switch(r1) {
                case 0: goto L_0x0034;
                case 1: goto L_0x0026;
                case 2: goto L_0x0011;
                default: goto L_0x0009;
            }
        L_0x0009:
            java.lang.IllegalStateException r10 = new java.lang.IllegalStateException
            java.lang.String r0 = "call to 'resume' before 'invoke' with coroutine"
            r10.<init>(r0)
            throw r10
        L_0x0011:
            int r1 = r9.I$0
            java.lang.Object r2 = r9.L$2
            java.lang.Object r3 = r9.L$1
            java.util.Iterator r3 = (java.util.Iterator) r3
            java.lang.Object r4 = r9.L$0
            kotlin.sequences.SequenceScope r4 = (kotlin.sequences.SequenceScope) r4
            kotlin.ResultKt.throwOnFailure(r10)
            r5 = r2
            r2 = r1
            r1 = r5
            r5 = r9
            goto L_0x0097
        L_0x0026:
            java.lang.Object r1 = r9.L$2
            java.lang.Object r2 = r9.L$1
            java.util.Iterator r2 = (java.util.Iterator) r2
            java.lang.Object r3 = r9.L$0
            kotlin.sequences.SequenceScope r3 = (kotlin.sequences.SequenceScope) r3
            kotlin.ResultKt.throwOnFailure(r10)
            goto L_0x005f
        L_0x0034:
            kotlin.ResultKt.throwOnFailure(r10)
            java.lang.Object r1 = r9.L$0
            r3 = r1
            kotlin.sequences.SequenceScope r3 = (kotlin.sequences.SequenceScope) r3
            kotlin.sequences.Sequence<T> r1 = r9.$this_runningReduceIndexed
            java.util.Iterator r2 = r1.iterator()
            boolean r1 = r2.hasNext()
            if (r1 == 0) goto L_0x0098
            java.lang.Object r1 = r2.next()
            r4 = r9
            kotlin.coroutines.Continuation r4 = (kotlin.coroutines.Continuation) r4
            r9.L$0 = r3
            r9.L$1 = r2
            r9.L$2 = r1
            r5 = 1
            r9.label = r5
            java.lang.Object r4 = r3.yield(r1, r4)
            if (r4 != r0) goto L_0x005f
            return r0
        L_0x005f:
            r4 = 1
            r5 = r3
            r3 = r2
            r2 = r4
            r4 = r5
            r5 = r9
        L_0x0065:
            boolean r6 = r3.hasNext()
            if (r6 == 0) goto L_0x0099
            kotlin.jvm.functions.Function3<java.lang.Integer, S, T, S> r6 = r5.$operation
            int r7 = r2 + 1
            if (r2 >= 0) goto L_0x0074
            kotlin.collections.CollectionsKt.throwIndexOverflow()
        L_0x0074:
            java.lang.Integer r2 = kotlin.coroutines.jvm.internal.Boxing.boxInt(r2)
            java.lang.Object r8 = r3.next()
            java.lang.Object r2 = r6.invoke(r2, r1, r8)
            r1 = r5
            kotlin.coroutines.Continuation r1 = (kotlin.coroutines.Continuation) r1
            r5.L$0 = r4
            r5.L$1 = r3
            r5.L$2 = r2
            r5.I$0 = r7
            r6 = 2
            r5.label = r6
            java.lang.Object r1 = r4.yield(r2, r1)
            if (r1 != r0) goto L_0x0095
            return r0
        L_0x0095:
            r1 = r2
            r2 = r7
        L_0x0097:
            goto L_0x0065
        L_0x0098:
            r5 = r9
        L_0x0099:
            kotlin.Unit r0 = kotlin.Unit.INSTANCE
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlin.sequences.SequencesKt___SequencesKt$runningReduceIndexed$1.invokeSuspend(java.lang.Object):java.lang.Object");
    }
}
