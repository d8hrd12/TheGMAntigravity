package kotlinx.coroutines.channels;

import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.jvm.internal.DebugMetadata;
import kotlin.coroutines.jvm.internal.SuspendLambda;
import kotlin.jvm.functions.Function2;
import kotlinx.coroutines.CoroutineScope;
import kotlinx.coroutines.selects.SelectInstance;

@Metadata(d1 = {"\u0000\f\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\u0010\u0000\u001a\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\u00020\u0003H@"}, d2 = {"<anonymous>", "", "E", "Lkotlinx/coroutines/CoroutineScope;"}, k = 3, mv = {1, 9, 0}, xi = 48)
@DebugMetadata(c = "kotlinx.coroutines.channels.BroadcastChannelImpl$registerSelectForSend$2", f = "BroadcastChannel.kt", i = {}, l = {288}, m = "invokeSuspend", n = {}, s = {})
/* compiled from: BroadcastChannel.kt */
final class BroadcastChannelImpl$registerSelectForSend$2 extends SuspendLambda implements Function2<CoroutineScope, Continuation<? super Unit>, Object> {
    final /* synthetic */ Object $element;
    final /* synthetic */ SelectInstance<?> $select;
    int label;
    final /* synthetic */ BroadcastChannelImpl<E> this$0;

    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    BroadcastChannelImpl$registerSelectForSend$2(BroadcastChannelImpl<E> broadcastChannelImpl, Object obj, SelectInstance<?> selectInstance, Continuation<? super BroadcastChannelImpl$registerSelectForSend$2> continuation) {
        super(2, continuation);
        this.this$0 = broadcastChannelImpl;
        this.$element = obj;
        this.$select = selectInstance;
    }

    public final Continuation<Unit> create(Object obj, Continuation<?> continuation) {
        return new BroadcastChannelImpl$registerSelectForSend$2(this.this$0, this.$element, this.$select, continuation);
    }

    public final Object invoke(CoroutineScope coroutineScope, Continuation<? super Unit> continuation) {
        return ((BroadcastChannelImpl$registerSelectForSend$2) create(coroutineScope, continuation)).invokeSuspend(Unit.INSTANCE);
    }

    /* JADX INFO: finally extract failed */
    /* JADX WARNING: Code restructure failed: missing block: B:14:0x0030, code lost:
        r1 = 1;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final java.lang.Object invokeSuspend(java.lang.Object r13) {
        /*
            r12 = this;
            java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r1 = r12.label
            r2 = 0
            r3 = 1
            switch(r1) {
                case 0: goto L_0x001a;
                case 1: goto L_0x0013;
                default: goto L_0x000b;
            }
        L_0x000b:
            java.lang.IllegalStateException r13 = new java.lang.IllegalStateException
            java.lang.String r0 = "call to 'resume' before 'invoke' with coroutine"
            r13.<init>(r0)
            throw r13
        L_0x0013:
            r0 = r12
            kotlin.ResultKt.throwOnFailure(r13)     // Catch:{ all -> 0x0018 }
            goto L_0x0030
        L_0x0018:
            r1 = move-exception
            goto L_0x0036
        L_0x001a:
            kotlin.ResultKt.throwOnFailure(r13)
            r1 = r12
            kotlinx.coroutines.channels.BroadcastChannelImpl<E> r4 = r1.this$0     // Catch:{ all -> 0x0032 }
            java.lang.Object r5 = r1.$element     // Catch:{ all -> 0x0032 }
            r6 = r1
            kotlin.coroutines.Continuation r6 = (kotlin.coroutines.Continuation) r6     // Catch:{ all -> 0x0032 }
            r1.label = r3     // Catch:{ all -> 0x0032 }
            java.lang.Object r4 = r4.send(r5, r6)     // Catch:{ all -> 0x0032 }
            if (r4 != r0) goto L_0x002f
            return r0
        L_0x002f:
            r0 = r1
        L_0x0030:
            r1 = r3
            goto L_0x004b
        L_0x0032:
            r0 = move-exception
            r11 = r1
            r1 = r0
            r0 = r11
        L_0x0036:
            kotlinx.coroutines.channels.BroadcastChannelImpl<E> r4 = r0.this$0
            boolean r4 = r4.isClosedForSend()
            if (r4 == 0) goto L_0x00b5
            boolean r4 = r1 instanceof kotlinx.coroutines.channels.ClosedSendChannelException
            if (r4 != 0) goto L_0x004a
            kotlinx.coroutines.channels.BroadcastChannelImpl<E> r4 = r0.this$0
            java.lang.Throwable r4 = r4.getSendException()
            if (r4 != r1) goto L_0x00b5
        L_0x004a:
            r1 = r2
        L_0x004b:
            kotlinx.coroutines.channels.BroadcastChannelImpl<E> r4 = r0.this$0
            java.util.concurrent.locks.ReentrantLock r4 = r4.lock
            kotlinx.coroutines.channels.BroadcastChannelImpl<E> r5 = r0.this$0
            kotlinx.coroutines.selects.SelectInstance<?> r6 = r0.$select
            r7 = 0
            r8 = r4
            java.util.concurrent.locks.Lock r8 = (java.util.concurrent.locks.Lock) r8
            r8.lock()
            r4 = 0
            boolean r9 = kotlinx.coroutines.DebugKt.getASSERTIONS_ENABLED()     // Catch:{ all -> 0x00b0 }
            if (r9 == 0) goto L_0x0079
            r9 = 0
            java.util.HashMap r10 = r5.onSendInternalResult     // Catch:{ all -> 0x00b0 }
            java.lang.Object r10 = r10.get(r6)     // Catch:{ all -> 0x00b0 }
            if (r10 != 0) goto L_0x0070
            r2 = r3
        L_0x0070:
            if (r2 == 0) goto L_0x0073
            goto L_0x0079
        L_0x0073:
            java.lang.AssertionError r2 = new java.lang.AssertionError     // Catch:{ all -> 0x00b0 }
            r2.<init>()     // Catch:{ all -> 0x00b0 }
            throw r2     // Catch:{ all -> 0x00b0 }
        L_0x0079:
            java.util.HashMap r2 = r5.onSendInternalResult     // Catch:{ all -> 0x00b0 }
            java.util.Map r2 = (java.util.Map) r2     // Catch:{ all -> 0x00b0 }
            if (r1 == 0) goto L_0x0084
            kotlin.Unit r3 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x00b0 }
            goto L_0x0088
        L_0x0084:
            kotlinx.coroutines.internal.Symbol r3 = kotlinx.coroutines.channels.BufferedChannelKt.getCHANNEL_CLOSED()     // Catch:{ all -> 0x00b0 }
        L_0x0088:
            r2.put(r6, r3)     // Catch:{ all -> 0x00b0 }
            java.lang.String r1 = "null cannot be cast to non-null type kotlinx.coroutines.selects.SelectImplementation<*>"
            kotlin.jvm.internal.Intrinsics.checkNotNull(r6, r1)     // Catch:{ all -> 0x00b0 }
            r1 = r6
            kotlinx.coroutines.selects.SelectImplementation r1 = (kotlinx.coroutines.selects.SelectImplementation) r1     // Catch:{ all -> 0x00b0 }
            r1 = r6
            kotlinx.coroutines.selects.SelectImplementation r1 = (kotlinx.coroutines.selects.SelectImplementation) r1     // Catch:{ all -> 0x00b0 }
            kotlin.Unit r2 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x00b0 }
            kotlinx.coroutines.selects.TrySelectDetailedResult r1 = r1.trySelectDetailed(r5, r2)     // Catch:{ all -> 0x00b0 }
            kotlinx.coroutines.selects.TrySelectDetailedResult r2 = kotlinx.coroutines.selects.TrySelectDetailedResult.REREGISTER     // Catch:{ all -> 0x00b0 }
            if (r1 == r2) goto L_0x00a7
            java.util.HashMap r1 = r5.onSendInternalResult     // Catch:{ all -> 0x00b0 }
            r1.remove(r6)     // Catch:{ all -> 0x00b0 }
        L_0x00a7:
            kotlin.Unit r1 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x00b0 }
            r8.unlock()
            kotlin.Unit r1 = kotlin.Unit.INSTANCE
            return r1
        L_0x00b0:
            r1 = move-exception
            r8.unlock()
            throw r1
        L_0x00b5:
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.BroadcastChannelImpl$registerSelectForSend$2.invokeSuspend(java.lang.Object):java.lang.Object");
    }
}
