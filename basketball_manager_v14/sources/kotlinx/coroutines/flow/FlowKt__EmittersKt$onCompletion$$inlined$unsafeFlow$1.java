package kotlinx.coroutines.flow;

import kotlin.Metadata;
import kotlin.jvm.functions.Function3;

@Metadata(d1 = {"\u0000\u0019\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002*\u0001\u0000\b\n\u0018\u00002\b\u0012\u0004\u0012\u00028\u00000\u0001J\u001c\u0010\u0002\u001a\u00020\u00032\f\u0010\u0004\u001a\b\u0012\u0004\u0012\u00028\u00000\u0005H@¢\u0006\u0002\u0010\u0006¨\u0006\u0007¸\u0006\u0000"}, d2 = {"kotlinx/coroutines/flow/internal/SafeCollector_commonKt$unsafeFlow$1", "Lkotlinx/coroutines/flow/Flow;", "collect", "", "collector", "Lkotlinx/coroutines/flow/FlowCollector;", "(Lkotlinx/coroutines/flow/FlowCollector;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "kotlinx-coroutines-core"}, k = 1, mv = {1, 9, 0}, xi = 48)
/* compiled from: SafeCollector.common.kt */
public final class FlowKt__EmittersKt$onCompletion$$inlined$unsafeFlow$1 implements Flow<T> {
    final /* synthetic */ Function3 $action$inlined;
    final /* synthetic */ Flow $this_onCompletion$inlined;

    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0068, code lost:
        r5 = new kotlinx.coroutines.flow.internal.SafeCollector(r2, r0.getContext());
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:?, code lost:
        r2 = r4.$action$inlined;
        r0.L$0 = r5;
        r0.L$1 = null;
        r0.label = 3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x0081, code lost:
        if (r2.invoke(r5, null, r0) != r1) goto L_0x0084;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0083, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x0084, code lost:
        r1 = r5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0085, code lost:
        r1.releaseIntercepted();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x008c, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x008d, code lost:
        r2 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x008e, code lost:
        r1 = r5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:0x008f, code lost:
        r1.releaseIntercepted();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:34:0x0092, code lost:
        throw r2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:40:0x00ac, code lost:
        throw r1;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002d  */
    /* JADX WARNING: Removed duplicated region for block: B:14:0x0038  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x0041  */
    /* JADX WARNING: Removed duplicated region for block: B:18:0x004e  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0025  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public java.lang.Object collect(kotlinx.coroutines.flow.FlowCollector<? super T> r9, kotlin.coroutines.Continuation<? super kotlin.Unit> r10) {
        /*
            r8 = this;
            boolean r0 = r10 instanceof kotlinx.coroutines.flow.FlowKt__EmittersKt$onCompletion$$inlined$unsafeFlow$1.AnonymousClass1
            if (r0 == 0) goto L_0x0014
            r0 = r10
            kotlinx.coroutines.flow.FlowKt__EmittersKt$onCompletion$$inlined$unsafeFlow$1$1 r0 = (kotlinx.coroutines.flow.FlowKt__EmittersKt$onCompletion$$inlined$unsafeFlow$1.AnonymousClass1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r10 = r0.label
            int r10 = r10 - r2
            r0.label = r10
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.flow.FlowKt__EmittersKt$onCompletion$$inlined$unsafeFlow$1$1 r0 = new kotlinx.coroutines.flow.FlowKt__EmittersKt$onCompletion$$inlined$unsafeFlow$1$1
            r0.<init>(r8, r10)
        L_0x0019:
            java.lang.Object r10 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            r3 = 0
            switch(r2) {
                case 0: goto L_0x004e;
                case 1: goto L_0x0041;
                case 2: goto L_0x0038;
                case 3: goto L_0x002d;
                default: goto L_0x0025;
            }
        L_0x0025:
            java.lang.IllegalStateException r9 = new java.lang.IllegalStateException
            java.lang.String r10 = "call to 'resume' before 'invoke' with coroutine"
            r9.<init>(r10)
            throw r9
        L_0x002d:
            r9 = 0
            java.lang.Object r1 = r0.L$0
            kotlinx.coroutines.flow.internal.SafeCollector r1 = (kotlinx.coroutines.flow.internal.SafeCollector) r1
            kotlin.ResultKt.throwOnFailure(r10)     // Catch:{ all -> 0x0036 }
            goto L_0x0085
        L_0x0036:
            r2 = move-exception
            goto L_0x008f
        L_0x0038:
            r9 = 0
            java.lang.Object r1 = r0.L$0
            java.lang.Throwable r1 = (java.lang.Throwable) r1
            kotlin.ResultKt.throwOnFailure(r10)
            goto L_0x00ac
        L_0x0041:
            r9 = 0
            java.lang.Object r2 = r0.L$1
            kotlinx.coroutines.flow.FlowCollector r2 = (kotlinx.coroutines.flow.FlowCollector) r2
            java.lang.Object r4 = r0.L$0
            kotlinx.coroutines.flow.FlowKt__EmittersKt$onCompletion$$inlined$unsafeFlow$1 r4 = (kotlinx.coroutines.flow.FlowKt__EmittersKt$onCompletion$$inlined$unsafeFlow$1) r4
            kotlin.ResultKt.throwOnFailure(r10)     // Catch:{ all -> 0x0093 }
            goto L_0x0068
        L_0x004e:
            kotlin.ResultKt.throwOnFailure(r10)
            r4 = r8
            r2 = r0
            kotlin.coroutines.Continuation r2 = (kotlin.coroutines.Continuation) r2
            r2 = r9
            r9 = 0
            kotlinx.coroutines.flow.Flow r5 = r4.$this_onCompletion$inlined     // Catch:{ all -> 0x0093 }
            r0.L$0 = r4     // Catch:{ all -> 0x0093 }
            r0.L$1 = r2     // Catch:{ all -> 0x0093 }
            r6 = 1
            r0.label = r6     // Catch:{ all -> 0x0093 }
            java.lang.Object r5 = r5.collect(r2, r0)     // Catch:{ all -> 0x0093 }
            if (r5 != r1) goto L_0x0068
            return r1
        L_0x0068:
            kotlinx.coroutines.flow.internal.SafeCollector r5 = new kotlinx.coroutines.flow.internal.SafeCollector
            r6 = 0
            kotlin.coroutines.CoroutineContext r7 = r0.getContext()
            r5.<init>(r2, r7)
            kotlin.jvm.functions.Function3 r2 = r4.$action$inlined     // Catch:{ all -> 0x008d }
            r0.L$0 = r5     // Catch:{ all -> 0x008d }
            r0.L$1 = r3     // Catch:{ all -> 0x008d }
            r6 = 3
            r0.label = r6     // Catch:{ all -> 0x008d }
            java.lang.Object r2 = r2.invoke(r5, r3, r0)     // Catch:{ all -> 0x008d }
            if (r2 != r1) goto L_0x0084
            return r1
        L_0x0084:
            r1 = r5
        L_0x0085:
            r1.releaseIntercepted()
            kotlin.Unit r9 = kotlin.Unit.INSTANCE
            return r9
        L_0x008d:
            r2 = move-exception
            r1 = r5
        L_0x008f:
            r1.releaseIntercepted()
            throw r2
        L_0x0093:
            r2 = move-exception
            kotlinx.coroutines.flow.ThrowingCollector r5 = new kotlinx.coroutines.flow.ThrowingCollector
            r5.<init>(r2)
            kotlinx.coroutines.flow.FlowCollector r5 = (kotlinx.coroutines.flow.FlowCollector) r5
            kotlin.jvm.functions.Function3 r6 = r4.$action$inlined
            r0.L$0 = r2
            r0.L$1 = r3
            r3 = 2
            r0.label = r3
            java.lang.Object r3 = kotlinx.coroutines.flow.FlowKt__EmittersKt.invokeSafely$FlowKt__EmittersKt(r5, r6, r2, r0)
            if (r3 != r1) goto L_0x00ab
            return r1
        L_0x00ab:
            r1 = r2
        L_0x00ac:
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.flow.FlowKt__EmittersKt$onCompletion$$inlined$unsafeFlow$1.collect(kotlinx.coroutines.flow.FlowCollector, kotlin.coroutines.Continuation):java.lang.Object");
    }

    public FlowKt__EmittersKt$onCompletion$$inlined$unsafeFlow$1(Flow flow, Function3 function3) {
        this.$this_onCompletion$inlined = flow;
        this.$action$inlined = function3;
    }
}
