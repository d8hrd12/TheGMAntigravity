package kotlinx.coroutines.selects;

import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.jvm.internal.DebugMetadata;
import kotlin.coroutines.jvm.internal.SuspendLambda;
import kotlin.jvm.functions.Function2;
import kotlinx.coroutines.CoroutineScope;

@Metadata(d1 = {"\u0000\f\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\u0010\u0000\u001a\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\u00020\u0003H@"}, d2 = {"<anonymous>", "", "R", "Lkotlinx/coroutines/CoroutineScope;"}, k = 3, mv = {1, 9, 0}, xi = 48)
@DebugMetadata(c = "kotlinx.coroutines.selects.UnbiasedSelectBuilderImpl$initSelectResult$1", f = "SelectOld.kt", i = {}, l = {67}, m = "invokeSuspend", n = {}, s = {})
/* compiled from: SelectOld.kt */
final class UnbiasedSelectBuilderImpl$initSelectResult$1 extends SuspendLambda implements Function2<CoroutineScope, Continuation<? super Unit>, Object> {
    int label;
    final /* synthetic */ UnbiasedSelectBuilderImpl<R> this$0;

    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    UnbiasedSelectBuilderImpl$initSelectResult$1(UnbiasedSelectBuilderImpl<R> unbiasedSelectBuilderImpl, Continuation<? super UnbiasedSelectBuilderImpl$initSelectResult$1> continuation) {
        super(2, continuation);
        this.this$0 = unbiasedSelectBuilderImpl;
    }

    public final Continuation<Unit> create(Object obj, Continuation<?> continuation) {
        return new UnbiasedSelectBuilderImpl$initSelectResult$1(this.this$0, continuation);
    }

    public final Object invoke(CoroutineScope coroutineScope, Continuation<? super Unit> continuation) {
        return ((UnbiasedSelectBuilderImpl$initSelectResult$1) create(coroutineScope, continuation)).invokeSuspend(Unit.INSTANCE);
    }

    /* JADX WARNING: Code restructure failed: missing block: B:15:0x0030, code lost:
        kotlinx.coroutines.selects.SelectOldKt.resumeUndispatched(r1.this$0.cont, r7);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:16:0x003f, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final java.lang.Object invokeSuspend(java.lang.Object r7) {
        /*
            r6 = this;
            java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r1 = r6.label
            switch(r1) {
                case 0: goto L_0x001a;
                case 1: goto L_0x0011;
                default: goto L_0x0009;
            }
        L_0x0009:
            java.lang.IllegalStateException r7 = new java.lang.IllegalStateException
            java.lang.String r0 = "call to 'resume' before 'invoke' with coroutine"
            r7.<init>(r0)
            throw r7
        L_0x0011:
            r0 = r6
            kotlin.ResultKt.throwOnFailure(r7)     // Catch:{ all -> 0x0018 }
            r1 = r0
            r0 = r7
            goto L_0x0030
        L_0x0018:
            r1 = move-exception
            goto L_0x0044
        L_0x001a:
            kotlin.ResultKt.throwOnFailure(r7)
            r1 = r6
            kotlinx.coroutines.selects.UnbiasedSelectBuilderImpl<R> r2 = r1.this$0     // Catch:{ all -> 0x0040 }
            r3 = r1
            kotlin.coroutines.Continuation r3 = (kotlin.coroutines.Continuation) r3     // Catch:{ all -> 0x0040 }
            r4 = 1
            r1.label = r4     // Catch:{ all -> 0x0040 }
            java.lang.Object r2 = r2.doSelect(r3)     // Catch:{ all -> 0x0040 }
            if (r2 != r0) goto L_0x002e
            return r0
        L_0x002e:
            r0 = r7
            r7 = r2
        L_0x0030:
            kotlinx.coroutines.selects.UnbiasedSelectBuilderImpl<R> r2 = r1.this$0
            kotlinx.coroutines.CancellableContinuationImpl r2 = r2.cont
            kotlinx.coroutines.CancellableContinuation r2 = (kotlinx.coroutines.CancellableContinuation) r2
            kotlinx.coroutines.selects.SelectOldKt.resumeUndispatched(r2, r7)
            kotlin.Unit r2 = kotlin.Unit.INSTANCE
            return r2
        L_0x0040:
            r0 = move-exception
            r5 = r1
            r1 = r0
            r0 = r5
        L_0x0044:
            kotlinx.coroutines.selects.UnbiasedSelectBuilderImpl<R> r2 = r0.this$0
            kotlinx.coroutines.CancellableContinuationImpl r2 = r2.cont
            kotlinx.coroutines.CancellableContinuation r2 = (kotlinx.coroutines.CancellableContinuation) r2
            kotlinx.coroutines.selects.SelectOldKt.resumeUndispatchedWithException(r2, r1)
            kotlin.Unit r2 = kotlin.Unit.INSTANCE
            return r2
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.selects.UnbiasedSelectBuilderImpl$initSelectResult$1.invokeSuspend(java.lang.Object):java.lang.Object");
    }
}
