package kotlinx.coroutines.flow;

import kotlin.Metadata;
import kotlin.jvm.functions.Function4;

@Metadata(d1 = {"\u0000\u0019\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002*\u0001\u0000\b\n\u0018\u00002\b\u0012\u0004\u0012\u00028\u00000\u0001J\u001c\u0010\u0002\u001a\u00020\u00032\f\u0010\u0004\u001a\b\u0012\u0004\u0012\u00028\u00000\u0005H@¢\u0006\u0002\u0010\u0006¨\u0006\u0007¸\u0006\u0000"}, d2 = {"kotlinx/coroutines/flow/internal/SafeCollector_commonKt$unsafeFlow$1", "Lkotlinx/coroutines/flow/Flow;", "collect", "", "collector", "Lkotlinx/coroutines/flow/FlowCollector;", "(Lkotlinx/coroutines/flow/FlowCollector;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "kotlinx-coroutines-core"}, k = 1, mv = {1, 9, 0}, xi = 48)
/* compiled from: SafeCollector.common.kt */
public final class FlowKt__ErrorsKt$retryWhen$$inlined$unsafeFlow$1 implements Flow<T> {
    final /* synthetic */ Function4 $predicate$inlined;
    final /* synthetic */ Flow $this_retryWhen$inlined;

    /* JADX WARNING: Code restructure failed: missing block: B:13:0x0068, code lost:
        r6 = 0;
        r7 = r2.$this_retryWhen$inlined;
        r0.L$0 = r2;
        r0.L$1 = r13;
        r0.L$2 = null;
        r0.J$0 = r4;
        r0.I$0 = 0;
        r0.label = 1;
        r7 = kotlinx.coroutines.flow.FlowKt.catchImpl(r7, r13, r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:14:0x007d, code lost:
        if (r7 != r1) goto L_0x0080;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:15:0x007f, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:16:0x0080, code lost:
        r5 = r13;
        r13 = r3;
        r3 = r4;
        r10 = r0;
        r0 = r14;
        r14 = r7;
        r7 = r2;
        r2 = r1;
        r1 = r10;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:17:0x008a, code lost:
        r14 = (java.lang.Throwable) r14;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:18:0x008c, code lost:
        if (r14 == null) goto L_0x00c1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:19:0x008e, code lost:
        r6 = r7.$predicate$inlined;
        r8 = kotlin.coroutines.jvm.internal.Boxing.boxLong(r3);
        r1.L$0 = r7;
        r1.L$1 = r5;
        r1.L$2 = r14;
        r1.J$0 = r3;
        r1.label = 2;
        r6 = r6.invoke(r5, r14, r8, r1);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:20:0x00a3, code lost:
        if (r6 != r2) goto L_0x00a6;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x00a5, code lost:
        return r2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x00a6, code lost:
        r10 = r5;
        r5 = r14;
        r14 = r6;
        r6 = r10;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x00b0, code lost:
        if (((java.lang.Boolean) r14).booleanValue() == false) goto L_0x00c0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x00b2, code lost:
        r4 = r3 + 1;
        r3 = r13;
        r13 = r6;
        r6 = 1;
        r14 = r0;
        r0 = r1;
        r1 = r2;
        r2 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x00c0, code lost:
        throw r5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x00c1, code lost:
        r10 = r3;
        r3 = r13;
        r13 = r5;
        r4 = r10;
        r14 = r0;
        r0 = r1;
        r1 = r2;
        r2 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x00c9, code lost:
        if (r6 != 0) goto L_0x0068;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x00ce, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Incorrect type for immutable var: ssa=kotlinx.coroutines.flow.FlowCollector<? super T>, code=kotlinx.coroutines.flow.FlowCollector, for r13v0, types: [kotlinx.coroutines.flow.FlowCollector<? super T>] */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:11:0x0047  */
    /* JADX WARNING: Removed duplicated region for block: B:12:0x005d  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public java.lang.Object collect(kotlinx.coroutines.flow.FlowCollector r13, kotlin.coroutines.Continuation<? super kotlin.Unit> r14) {
        /*
            r12 = this;
            boolean r0 = r14 instanceof kotlinx.coroutines.flow.FlowKt__ErrorsKt$retryWhen$$inlined$unsafeFlow$1.AnonymousClass1
            if (r0 == 0) goto L_0x0014
            r0 = r14
            kotlinx.coroutines.flow.FlowKt__ErrorsKt$retryWhen$$inlined$unsafeFlow$1$1 r0 = (kotlinx.coroutines.flow.FlowKt__ErrorsKt$retryWhen$$inlined$unsafeFlow$1.AnonymousClass1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r14 = r0.label
            int r14 = r14 - r2
            r0.label = r14
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.flow.FlowKt__ErrorsKt$retryWhen$$inlined$unsafeFlow$1$1 r0 = new kotlinx.coroutines.flow.FlowKt__ErrorsKt$retryWhen$$inlined$unsafeFlow$1$1
            r0.<init>(r12, r14)
        L_0x0019:
            java.lang.Object r14 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x005d;
                case 1: goto L_0x0047;
                case 2: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r13 = new java.lang.IllegalStateException
            java.lang.String r14 = "call to 'resume' before 'invoke' with coroutine"
            r13.<init>(r14)
            throw r13
        L_0x002c:
            r13 = 0
            long r2 = r0.J$0
            java.lang.Object r4 = r0.L$2
            java.lang.Throwable r4 = (java.lang.Throwable) r4
            java.lang.Object r5 = r0.L$1
            kotlinx.coroutines.flow.FlowCollector r5 = (kotlinx.coroutines.flow.FlowCollector) r5
            java.lang.Object r6 = r0.L$0
            kotlinx.coroutines.flow.FlowKt__ErrorsKt$retryWhen$$inlined$unsafeFlow$1 r6 = (kotlinx.coroutines.flow.FlowKt__ErrorsKt$retryWhen$$inlined$unsafeFlow$1) r6
            kotlin.ResultKt.throwOnFailure(r14)
            r7 = r6
            r6 = r5
            r5 = r4
            r3 = r2
            r2 = r1
            r1 = r0
            r0 = r14
            goto L_0x00aa
        L_0x0047:
            r13 = 0
            int r2 = r0.I$0
            long r3 = r0.J$0
            java.lang.Object r5 = r0.L$1
            kotlinx.coroutines.flow.FlowCollector r5 = (kotlinx.coroutines.flow.FlowCollector) r5
            java.lang.Object r6 = r0.L$0
            kotlinx.coroutines.flow.FlowKt__ErrorsKt$retryWhen$$inlined$unsafeFlow$1 r6 = (kotlinx.coroutines.flow.FlowKt__ErrorsKt$retryWhen$$inlined$unsafeFlow$1) r6
            kotlin.ResultKt.throwOnFailure(r14)
            r7 = r6
            r6 = r2
            r2 = r1
            r1 = r0
            r0 = r14
            goto L_0x008a
        L_0x005d:
            kotlin.ResultKt.throwOnFailure(r14)
            r2 = r12
            r3 = r0
            kotlin.coroutines.Continuation r3 = (kotlin.coroutines.Continuation) r3
            r3 = 0
            r4 = 0
        L_0x0068:
            r6 = 0
            kotlinx.coroutines.flow.Flow r7 = r2.$this_retryWhen$inlined
            r0.L$0 = r2
            r0.L$1 = r13
            r8 = 0
            r0.L$2 = r8
            r0.J$0 = r4
            r0.I$0 = r6
            r8 = 1
            r0.label = r8
            java.lang.Object r7 = kotlinx.coroutines.flow.FlowKt.catchImpl(r7, r13, r0)
            if (r7 != r1) goto L_0x0080
            return r1
        L_0x0080:
            r10 = r4
            r5 = r13
            r13 = r3
            r3 = r10
            r10 = r0
            r0 = r14
            r14 = r7
            r7 = r2
            r2 = r1
            r1 = r10
        L_0x008a:
            java.lang.Throwable r14 = (java.lang.Throwable) r14
            if (r14 == 0) goto L_0x00c1
            kotlin.jvm.functions.Function4 r6 = r7.$predicate$inlined
            java.lang.Long r8 = kotlin.coroutines.jvm.internal.Boxing.boxLong(r3)
            r1.L$0 = r7
            r1.L$1 = r5
            r1.L$2 = r14
            r1.J$0 = r3
            r9 = 2
            r1.label = r9
            java.lang.Object r6 = r6.invoke(r5, r14, r8, r1)
            if (r6 != r2) goto L_0x00a6
            return r2
        L_0x00a6:
            r10 = r5
            r5 = r14
            r14 = r6
            r6 = r10
        L_0x00aa:
            java.lang.Boolean r14 = (java.lang.Boolean) r14
            boolean r14 = r14.booleanValue()
            if (r14 == 0) goto L_0x00c0
            r14 = 1
            r8 = 1
            long r3 = r3 + r8
            r4 = r3
            r3 = r13
            r13 = r6
            r6 = r14
            r14 = r0
            r0 = r1
            r1 = r2
            r2 = r7
            goto L_0x00c9
        L_0x00c0:
            throw r5
        L_0x00c1:
            r10 = r3
            r3 = r13
            r13 = r5
            r4 = r10
            r14 = r0
            r0 = r1
            r1 = r2
            r2 = r7
        L_0x00c9:
            if (r6 != 0) goto L_0x0068
            kotlin.Unit r13 = kotlin.Unit.INSTANCE
            return r13
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.flow.FlowKt__ErrorsKt$retryWhen$$inlined$unsafeFlow$1.collect(kotlinx.coroutines.flow.FlowCollector, kotlin.coroutines.Continuation):java.lang.Object");
    }

    public FlowKt__ErrorsKt$retryWhen$$inlined$unsafeFlow$1(Flow flow, Function4 function4) {
        this.$this_retryWhen$inlined = flow;
        this.$predicate$inlined = function4;
    }
}
