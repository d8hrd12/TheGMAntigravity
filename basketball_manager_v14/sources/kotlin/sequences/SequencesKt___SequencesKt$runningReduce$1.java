package kotlin.sequences;

import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.jvm.internal.DebugMetadata;
import kotlin.coroutines.jvm.internal.RestrictedSuspendLambda;
import kotlin.jvm.functions.Function2;

@Metadata(d1 = {"\u0000\u000e\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\u0010\u0000\u001a\u00020\u0001\"\u0004\b\u0000\u0010\u0002\"\b\b\u0001\u0010\u0003*\u0002H\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u0004H@"}, d2 = {"<anonymous>", "", "S", "T", "Lkotlin/sequences/SequenceScope;"}, k = 3, mv = {1, 9, 0}, xi = 48)
@DebugMetadata(c = "kotlin.sequences.SequencesKt___SequencesKt$runningReduce$1", f = "_Sequences.kt", i = {0, 0, 0, 1, 1, 1}, l = {2368, 2371}, m = "invokeSuspend", n = {"$this$sequence", "iterator", "accumulator", "$this$sequence", "iterator", "accumulator"}, s = {"L$0", "L$1", "L$2", "L$0", "L$1", "L$2"})
/* compiled from: _Sequences.kt */
final class SequencesKt___SequencesKt$runningReduce$1 extends RestrictedSuspendLambda implements Function2<SequenceScope<? super S>, Continuation<? super Unit>, Object> {
    final /* synthetic */ Function2<S, T, S> $operation;
    final /* synthetic */ Sequence<T> $this_runningReduce;
    private /* synthetic */ Object L$0;
    Object L$1;
    Object L$2;
    int label;

    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    SequencesKt___SequencesKt$runningReduce$1(Sequence<? extends T> sequence, Function2<? super S, ? super T, ? extends S> function2, Continuation<? super SequencesKt___SequencesKt$runningReduce$1> continuation) {
        super(2, continuation);
        this.$this_runningReduce = sequence;
        this.$operation = function2;
    }

    public final Continuation<Unit> create(Object obj, Continuation<?> continuation) {
        SequencesKt___SequencesKt$runningReduce$1 sequencesKt___SequencesKt$runningReduce$1 = new SequencesKt___SequencesKt$runningReduce$1(this.$this_runningReduce, this.$operation, continuation);
        sequencesKt___SequencesKt$runningReduce$1.L$0 = obj;
        return sequencesKt___SequencesKt$runningReduce$1;
    }

    public final Object invoke(SequenceScope<? super S> sequenceScope, Continuation<? super Unit> continuation) {
        return ((SequencesKt___SequencesKt$runningReduce$1) create(sequenceScope, continuation)).invokeSuspend(Unit.INSTANCE);
    }

    /* Debug info: failed to restart local var, previous not found, register: 7 */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r1v5, resolved type: java.lang.Object} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r3v2, resolved type: kotlin.sequences.SequenceScope} */
    /* JADX WARNING: Code restructure failed: missing block: B:11:0x0059, code lost:
        r4 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:13:0x005e, code lost:
        if (r2.hasNext() == false) goto L_0x007f;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:14:0x0060, code lost:
        r1 = r4.$operation.invoke(r1, r2.next());
        r4.L$0 = r3;
        r4.L$1 = r2;
        r4.L$2 = r1;
        r4.label = 2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:15:0x007a, code lost:
        if (r3.yield(r1, r4) != r0) goto L_0x005a;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:16:0x007c, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:19:0x0081, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Multi-variable type inference failed */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final java.lang.Object invokeSuspend(java.lang.Object r8) {
        /*
            r7 = this;
            java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r1 = r7.label
            switch(r1) {
                case 0: goto L_0x002e;
                case 1: goto L_0x0020;
                case 2: goto L_0x0011;
                default: goto L_0x0009;
            }
        L_0x0009:
            java.lang.IllegalStateException r8 = new java.lang.IllegalStateException
            java.lang.String r0 = "call to 'resume' before 'invoke' with coroutine"
            r8.<init>(r0)
            throw r8
        L_0x0011:
            java.lang.Object r1 = r7.L$2
            java.lang.Object r2 = r7.L$1
            java.util.Iterator r2 = (java.util.Iterator) r2
            java.lang.Object r3 = r7.L$0
            kotlin.sequences.SequenceScope r3 = (kotlin.sequences.SequenceScope) r3
            kotlin.ResultKt.throwOnFailure(r8)
            r4 = r7
            goto L_0x007d
        L_0x0020:
            java.lang.Object r1 = r7.L$2
            java.lang.Object r2 = r7.L$1
            java.util.Iterator r2 = (java.util.Iterator) r2
            java.lang.Object r3 = r7.L$0
            kotlin.sequences.SequenceScope r3 = (kotlin.sequences.SequenceScope) r3
            kotlin.ResultKt.throwOnFailure(r8)
            goto L_0x0059
        L_0x002e:
            kotlin.ResultKt.throwOnFailure(r8)
            java.lang.Object r1 = r7.L$0
            r3 = r1
            kotlin.sequences.SequenceScope r3 = (kotlin.sequences.SequenceScope) r3
            kotlin.sequences.Sequence<T> r1 = r7.$this_runningReduce
            java.util.Iterator r2 = r1.iterator()
            boolean r1 = r2.hasNext()
            if (r1 == 0) goto L_0x007e
            java.lang.Object r1 = r2.next()
            r4 = r7
            kotlin.coroutines.Continuation r4 = (kotlin.coroutines.Continuation) r4
            r7.L$0 = r3
            r7.L$1 = r2
            r7.L$2 = r1
            r5 = 1
            r7.label = r5
            java.lang.Object r4 = r3.yield(r1, r4)
            if (r4 != r0) goto L_0x0059
            return r0
        L_0x0059:
            r4 = r7
        L_0x005a:
            boolean r5 = r2.hasNext()
            if (r5 == 0) goto L_0x007f
            kotlin.jvm.functions.Function2<S, T, S> r5 = r4.$operation
            java.lang.Object r6 = r2.next()
            java.lang.Object r1 = r5.invoke(r1, r6)
            r5 = r4
            kotlin.coroutines.Continuation r5 = (kotlin.coroutines.Continuation) r5
            r4.L$0 = r3
            r4.L$1 = r2
            r4.L$2 = r1
            r6 = 2
            r4.label = r6
            java.lang.Object r5 = r3.yield(r1, r5)
            if (r5 != r0) goto L_0x007d
            return r0
        L_0x007d:
            goto L_0x005a
        L_0x007e:
            r4 = r7
        L_0x007f:
            kotlin.Unit r0 = kotlin.Unit.INSTANCE
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlin.sequences.SequencesKt___SequencesKt$runningReduce$1.invokeSuspend(java.lang.Object):java.lang.Object");
    }
}
