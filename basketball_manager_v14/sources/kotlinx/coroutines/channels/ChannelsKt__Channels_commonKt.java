package kotlinx.coroutines.channels;

import java.util.concurrent.CancellationException;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.jvm.functions.Function1;
import kotlinx.coroutines.ExceptionsKt;

@Metadata(d1 = {"\u00008\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0003\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0010 \n\u0000\u001a\u001a\u0010\u0002\u001a\u00020\u0003*\u0006\u0012\u0002\b\u00030\u00042\b\u0010\u0005\u001a\u0004\u0018\u00010\u0006H\u0001\u001aP\u0010\u0007\u001a\u0002H\b\"\u0004\b\u0000\u0010\t\"\u0004\b\u0001\u0010\b*\b\u0012\u0004\u0012\u0002H\t0\u00042\u001d\u0010\n\u001a\u0019\u0012\n\u0012\b\u0012\u0004\u0012\u0002H\t0\u0004\u0012\u0004\u0012\u0002H\b0\u000b¢\u0006\u0002\b\fH\b\u0002\n\n\b\b\u0001\u0012\u0002\u0010\u0001 \u0001¢\u0006\u0002\u0010\r\u001a2\u0010\u000e\u001a\u00020\u0003\"\u0004\b\u0000\u0010\t*\b\u0012\u0004\u0012\u0002H\t0\u00042\u0012\u0010\u000f\u001a\u000e\u0012\u0004\u0012\u0002H\t\u0012\u0004\u0012\u00020\u00030\u000bHH¢\u0006\u0002\u0010\u0010\u001a$\u0010\u0011\u001a\n\u0012\u0006\u0012\u0004\u0018\u0001H\t0\u0012\"\b\b\u0000\u0010\t*\u00020\u0013*\b\u0012\u0004\u0012\u0002H\t0\u0004H\u0007\u001a$\u0010\u0014\u001a\u0004\u0018\u0001H\t\"\b\b\u0000\u0010\t*\u00020\u0013*\b\u0012\u0004\u0012\u0002H\t0\u0004H@¢\u0006\u0002\u0010\u0015\u001a$\u0010\u0016\u001a\b\u0012\u0004\u0012\u0002H\t0\u0017\"\u0004\b\u0000\u0010\t*\b\u0012\u0004\u0012\u0002H\t0\u0004H@¢\u0006\u0002\u0010\u0015\"\u000e\u0010\u0000\u001a\u00020\u0001XT¢\u0006\u0002\n\u0000¨\u0006\u0018"}, d2 = {"DEFAULT_CLOSE_MESSAGE", "", "cancelConsumed", "", "Lkotlinx/coroutines/channels/ReceiveChannel;", "cause", "", "consume", "R", "E", "block", "Lkotlin/Function1;", "Lkotlin/ExtensionFunctionType;", "(Lkotlinx/coroutines/channels/ReceiveChannel;Lkotlin/jvm/functions/Function1;)Ljava/lang/Object;", "consumeEach", "action", "(Lkotlinx/coroutines/channels/ReceiveChannel;Lkotlin/jvm/functions/Function1;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "onReceiveOrNull", "Lkotlinx/coroutines/selects/SelectClause1;", "", "receiveOrNull", "(Lkotlinx/coroutines/channels/ReceiveChannel;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "toList", "", "kotlinx-coroutines-core"}, k = 5, mv = {1, 9, 0}, xi = 48, xs = "kotlinx/coroutines/channels/ChannelsKt")
/* compiled from: Channels.common.kt */
final /* synthetic */ class ChannelsKt__Channels_commonKt {
    public static final <E, R> R consume(ReceiveChannel<? extends E> $this$consume, Function1<? super ReceiveChannel<? extends E>, ? extends R> block) {
        Throwable cause;
        try {
            R invoke = block.invoke($this$consume);
            ChannelsKt.cancelConsumed($this$consume, (Throwable) null);
            return invoke;
        } catch (Throwable e) {
            ChannelsKt.cancelConsumed($this$consume, cause);
            throw e;
        }
    }

    /* JADX WARNING: Code restructure failed: missing block: B:20:?, code lost:
        r0.L$0 = r6;
        r0.L$1 = r5;
        r0.L$2 = r3;
        r0.label = 1;
        r7 = r3.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x006d, code lost:
        if (r7 != r1) goto L_0x0070;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x006f, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0070, code lost:
        r8 = r0;
        r0 = r11;
        r11 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r4;
        r4 = r3;
        r3 = r2;
        r2 = r1;
        r1 = r8;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x0080, code lost:
        if (((java.lang.Boolean) r11).booleanValue() == false) goto L_0x0092;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0082, code lost:
        r7.invoke(r4.next());
        r11 = r0;
        r0 = r1;
        r1 = r2;
        r2 = r3;
        r3 = r4;
        r4 = r5;
        r5 = r6;
        r6 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x0092, code lost:
        r11 = kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0095, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r5);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x009c, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x009d, code lost:
        r11 = move-exception;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x009e, code lost:
        r4 = r1;
        r1 = r11;
        r11 = r0;
        r0 = r4;
        r4 = r5;
        r5 = r6;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x004b  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final <E> java.lang.Object consumeEach(kotlinx.coroutines.channels.ReceiveChannel<? extends E> r9, kotlin.jvm.functions.Function1<? super E, kotlin.Unit> r10, kotlin.coroutines.Continuation<? super kotlin.Unit> r11) {
        /*
            boolean r0 = r11 instanceof kotlinx.coroutines.channels.ChannelsKt__Channels_commonKt$consumeEach$1
            if (r0 == 0) goto L_0x0014
            r0 = r11
            kotlinx.coroutines.channels.ChannelsKt__Channels_commonKt$consumeEach$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__Channels_commonKt$consumeEach$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r11 = r0.label
            int r11 = r11 - r2
            r0.label = r11
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__Channels_commonKt$consumeEach$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__Channels_commonKt$consumeEach$1
            r0.<init>(r11)
        L_0x0019:
            java.lang.Object r11 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x004b;
                case 1: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r9 = new java.lang.IllegalStateException
            java.lang.String r10 = "call to 'resume' before 'invoke' with coroutine"
            r9.<init>(r10)
            throw r9
        L_0x002c:
            r9 = 0
            r10 = 0
            r2 = 0
            java.lang.Object r3 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r3 = (kotlinx.coroutines.channels.ChannelIterator) r3
            r4 = 0
            java.lang.Object r5 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r5 = (kotlinx.coroutines.channels.ReceiveChannel) r5
            java.lang.Object r6 = r0.L$0
            kotlin.jvm.functions.Function1 r6 = (kotlin.jvm.functions.Function1) r6
            kotlin.ResultKt.throwOnFailure(r11)     // Catch:{ all -> 0x0048 }
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r0
            r0 = r11
            goto L_0x007a
        L_0x0048:
            r1 = move-exception
            goto L_0x00a8
        L_0x004b:
            kotlin.ResultKt.throwOnFailure(r11)
            r2 = 0
            r5 = r9
            r9 = 0
            r4 = 0
            r3 = r5
            r6 = 0
            kotlinx.coroutines.channels.ChannelIterator r7 = r3.iterator()     // Catch:{ all -> 0x00a5 }
            r3 = r10
            r10 = r9
            r9 = r2
            r2 = r6
            r6 = r3
            r3 = r7
        L_0x0060:
            r0.L$0 = r6     // Catch:{ all -> 0x0048 }
            r0.L$1 = r5     // Catch:{ all -> 0x0048 }
            r0.L$2 = r3     // Catch:{ all -> 0x0048 }
            r7 = 1
            r0.label = r7     // Catch:{ all -> 0x0048 }
            java.lang.Object r7 = r3.hasNext(r0)     // Catch:{ all -> 0x0048 }
            if (r7 != r1) goto L_0x0070
            return r1
        L_0x0070:
            r8 = r0
            r0 = r11
            r11 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r8
        L_0x007a:
            java.lang.Boolean r11 = (java.lang.Boolean) r11     // Catch:{ all -> 0x009d }
            boolean r11 = r11.booleanValue()     // Catch:{ all -> 0x009d }
            if (r11 == 0) goto L_0x0092
            java.lang.Object r11 = r4.next()     // Catch:{ all -> 0x009d }
            r7.invoke(r11)     // Catch:{ all -> 0x009d }
            r11 = r0
            r0 = r1
            r1 = r2
            r2 = r3
            r3 = r4
            r4 = r5
            r5 = r6
            r6 = r7
            goto L_0x0060
        L_0x0092:
            kotlin.Unit r11 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x009d }
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r5)
            kotlin.Unit r10 = kotlin.Unit.INSTANCE
            return r10
        L_0x009d:
            r11 = move-exception
            r4 = r1
            r1 = r11
            r11 = r0
            r0 = r4
            r4 = r5
            r5 = r6
            goto L_0x00a8
        L_0x00a5:
            r1 = move-exception
            r10 = r9
            r9 = r2
        L_0x00a8:
            r2 = r1
            throw r1     // Catch:{ all -> 0x00ab }
        L_0x00ab:
            r1 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r5, r2)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__Channels_commonKt.consumeEach(kotlinx.coroutines.channels.ReceiveChannel, kotlin.jvm.functions.Function1, kotlin.coroutines.Continuation):java.lang.Object");
    }

    private static final <E> Object consumeEach$$forInline(ReceiveChannel<? extends E> $this$consumeEach, Function1<? super E, Unit> action, Continuation<? super Unit> $completion) {
        Throwable cause$iv;
        ReceiveChannel<? extends E> $this$consumeEach_u24lambda_u241 = $this$consumeEach;
        try {
            ChannelIterator it = $this$consumeEach_u24lambda_u241.iterator();
            while (((Boolean) it.hasNext((Continuation<? super Boolean>) null)).booleanValue()) {
                action.invoke(it.next());
            }
            Unit unit = Unit.INSTANCE;
            ChannelsKt.cancelConsumed($this$consumeEach_u24lambda_u241, (Throwable) null);
            return Unit.INSTANCE;
        } catch (Throwable e$iv) {
            ChannelsKt.cancelConsumed($this$consumeEach_u24lambda_u241, cause$iv);
            throw e$iv;
        }
    }

    /* JADX WARNING: Code restructure failed: missing block: B:20:?, code lost:
        r0.L$0 = r9;
        r0.L$1 = r8;
        r0.L$2 = r7;
        r0.L$3 = r5;
        r0.label = 1;
        r10 = r5.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x007f, code lost:
        if (r10 != r1) goto L_0x0082;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x0081, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0082, code lost:
        r13 = r0;
        r0 = r15;
        r15 = r10;
        r10 = r9;
        r9 = r8;
        r8 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r4;
        r4 = r3;
        r3 = r2;
        r2 = r1;
        r1 = r13;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x0095, code lost:
        if (((java.lang.Boolean) r15).booleanValue() == false) goto L_0x00ad;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0097, code lost:
        r9.add(r6.next());
        r15 = r0;
        r0 = r1;
        r1 = r2;
        r2 = r3;
        r3 = r4;
        r4 = r5;
        r5 = r6;
        r6 = r7;
        r7 = r8;
        r8 = r9;
        r9 = r10;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x00ad, code lost:
        r15 = kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x00b0, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r8, r7);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x00bb, code lost:
        return kotlin.collections.CollectionsKt.build(r10);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x00bc, code lost:
        r15 = move-exception;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x00bd, code lost:
        r2 = r1;
        r1 = r15;
        r15 = r0;
        r0 = r2;
        r2 = r3;
        r3 = r4;
        r6 = r7;
        r7 = r8;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x0053  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final <E> java.lang.Object toList(kotlinx.coroutines.channels.ReceiveChannel<? extends E> r14, kotlin.coroutines.Continuation<? super java.util.List<? extends E>> r15) {
        /*
            boolean r0 = r15 instanceof kotlinx.coroutines.channels.ChannelsKt__Channels_commonKt$toList$1
            if (r0 == 0) goto L_0x0014
            r0 = r15
            kotlinx.coroutines.channels.ChannelsKt__Channels_commonKt$toList$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__Channels_commonKt$toList$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r15 = r0.label
            int r15 = r15 - r2
            r0.label = r15
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__Channels_commonKt$toList$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__Channels_commonKt$toList$1
            r0.<init>(r15)
        L_0x0019:
            java.lang.Object r15 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x0053;
                case 1: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r14 = new java.lang.IllegalStateException
            java.lang.String r15 = "call to 'resume' before 'invoke' with coroutine"
            r14.<init>(r15)
            throw r14
        L_0x002c:
            r14 = 0
            r2 = 0
            r3 = 0
            r4 = 0
            java.lang.Object r5 = r0.L$3
            kotlinx.coroutines.channels.ChannelIterator r5 = (kotlinx.coroutines.channels.ChannelIterator) r5
            r6 = 0
            java.lang.Object r7 = r0.L$2
            kotlinx.coroutines.channels.ReceiveChannel r7 = (kotlinx.coroutines.channels.ReceiveChannel) r7
            java.lang.Object r8 = r0.L$1
            java.util.List r8 = (java.util.List) r8
            java.lang.Object r9 = r0.L$0
            java.util.List r9 = (java.util.List) r9
            kotlin.ResultKt.throwOnFailure(r15)     // Catch:{ all -> 0x0050 }
            r10 = r9
            r9 = r8
            r8 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r0
            r0 = r15
            goto L_0x008f
        L_0x0050:
            r1 = move-exception
            goto L_0x00ca
        L_0x0053:
            kotlin.ResultKt.throwOnFailure(r15)
            java.util.List r2 = kotlin.collections.CollectionsKt.createListBuilder()
            r3 = r2
            r4 = 0
            r5 = 0
            r7 = r14
            r14 = 0
            r6 = 0
            r8 = r7
            r9 = 0
            kotlinx.coroutines.channels.ChannelIterator r10 = r8.iterator()     // Catch:{ all -> 0x00c6 }
            r8 = r3
            r3 = r14
            r14 = r4
            r4 = r9
            r9 = r2
            r2 = r5
            r5 = r10
        L_0x0070:
            r0.L$0 = r9     // Catch:{ all -> 0x0050 }
            r0.L$1 = r8     // Catch:{ all -> 0x0050 }
            r0.L$2 = r7     // Catch:{ all -> 0x0050 }
            r0.L$3 = r5     // Catch:{ all -> 0x0050 }
            r10 = 1
            r0.label = r10     // Catch:{ all -> 0x0050 }
            java.lang.Object r10 = r5.hasNext(r0)     // Catch:{ all -> 0x0050 }
            if (r10 != r1) goto L_0x0082
            return r1
        L_0x0082:
            r13 = r0
            r0 = r15
            r15 = r10
            r10 = r9
            r9 = r8
            r8 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r13
        L_0x008f:
            java.lang.Boolean r15 = (java.lang.Boolean) r15     // Catch:{ all -> 0x00bc }
            boolean r15 = r15.booleanValue()     // Catch:{ all -> 0x00bc }
            if (r15 == 0) goto L_0x00ad
            java.lang.Object r15 = r6.next()     // Catch:{ all -> 0x00bc }
            r11 = r15
            r12 = 0
            r9.add(r11)     // Catch:{ all -> 0x00bc }
            r15 = r0
            r0 = r1
            r1 = r2
            r2 = r3
            r3 = r4
            r4 = r5
            r5 = r6
            r6 = r7
            r7 = r8
            r8 = r9
            r9 = r10
            goto L_0x0070
        L_0x00ad:
            kotlin.Unit r15 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x00bc }
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r8, r7)
            java.util.List r14 = kotlin.collections.CollectionsKt.build(r10)
            return r14
        L_0x00bc:
            r15 = move-exception
            r2 = r1
            r1 = r15
            r15 = r0
            r0 = r2
            r2 = r3
            r3 = r4
            r6 = r7
            r7 = r8
            goto L_0x00ca
        L_0x00c6:
            r1 = move-exception
            r3 = r14
            r14 = r4
            r2 = r5
        L_0x00ca:
            r4 = r1
            throw r1     // Catch:{ all -> 0x00cd }
        L_0x00cd:
            r1 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r7, r4)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__Channels_commonKt.toList(kotlinx.coroutines.channels.ReceiveChannel, kotlin.coroutines.Continuation):java.lang.Object");
    }

    public static final void cancelConsumed(ReceiveChannel<?> $this$cancelConsumed, Throwable cause) {
        CancellationException cancellationException = null;
        if (cause != null) {
            Throwable it = cause;
            if (it instanceof CancellationException) {
                cancellationException = (CancellationException) it;
            }
            if (cancellationException == null) {
                cancellationException = ExceptionsKt.CancellationException("Channel was consumed, consumer had failed", it);
            }
        }
        $this$cancelConsumed.cancel(cancellationException);
    }
}
