package kotlinx.coroutines.channels;

import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.jvm.internal.DebugMetadata;
import kotlin.coroutines.jvm.internal.SuspendLambda;
import kotlin.jvm.functions.Function2;

@Metadata(d1 = {"\u0000\u000e\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\u0010\u0000\u001a\u00020\u0001\"\u0004\b\u0000\u0010\u0002\"\u0004\b\u0001\u0010\u0003\"\u0004\b\u0002\u0010\u0004*\b\u0012\u0004\u0012\u0002H\u00040\u0005H@"}, d2 = {"<anonymous>", "", "E", "R", "V", "Lkotlinx/coroutines/channels/ProducerScope;"}, k = 3, mv = {1, 9, 0}, xi = 48)
@DebugMetadata(c = "kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$zip$2", f = "Deprecated.kt", i = {0, 0, 0, 1, 1, 1, 1, 2, 2, 2}, l = {517, 499, 501}, m = "invokeSuspend", n = {"$this$produce", "otherIterator", "$this$consume$iv$iv", "$this$produce", "otherIterator", "$this$consume$iv$iv", "element1", "$this$produce", "otherIterator", "$this$consume$iv$iv"}, s = {"L$0", "L$1", "L$3", "L$0", "L$1", "L$3", "L$5", "L$0", "L$1", "L$3"})
/* compiled from: Deprecated.kt */
final class ChannelsKt__DeprecatedKt$zip$2 extends SuspendLambda implements Function2<ProducerScope<? super V>, Continuation<? super Unit>, Object> {
    final /* synthetic */ ReceiveChannel<R> $other;
    final /* synthetic */ ReceiveChannel<E> $this_zip;
    final /* synthetic */ Function2<E, R, V> $transform;
    private /* synthetic */ Object L$0;
    Object L$1;
    Object L$2;
    Object L$3;
    Object L$4;
    Object L$5;
    int label;

    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    ChannelsKt__DeprecatedKt$zip$2(ReceiveChannel<? extends R> receiveChannel, ReceiveChannel<? extends E> receiveChannel2, Function2<? super E, ? super R, ? extends V> function2, Continuation<? super ChannelsKt__DeprecatedKt$zip$2> continuation) {
        super(2, continuation);
        this.$other = receiveChannel;
        this.$this_zip = receiveChannel2;
        this.$transform = function2;
    }

    public final Continuation<Unit> create(Object obj, Continuation<?> continuation) {
        ChannelsKt__DeprecatedKt$zip$2 channelsKt__DeprecatedKt$zip$2 = new ChannelsKt__DeprecatedKt$zip$2(this.$other, this.$this_zip, this.$transform, continuation);
        channelsKt__DeprecatedKt$zip$2.L$0 = obj;
        return channelsKt__DeprecatedKt$zip$2;
    }

    public final Object invoke(ProducerScope<? super V> producerScope, Continuation<? super Unit> continuation) {
        return ((ChannelsKt__DeprecatedKt$zip$2) create(producerScope, continuation)).invokeSuspend(Unit.INSTANCE);
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Code restructure failed: missing block: B:23:?, code lost:
        r2.L$0 = r13;
        r2.L$1 = r12;
        r2.L$2 = r9;
        r2.L$3 = r11;
        r2.L$4 = r8;
        r2.L$5 = r3;
        r2.label = 1;
        r14 = r8.hasNext(r2);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x00cf, code lost:
        if (r14 != r0) goto L_0x00d2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x00d1, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x00d2, code lost:
        r16 = r5;
        r5 = r4;
        r4 = r14;
        r14 = r13;
        r13 = r12;
        r12 = r11;
        r11 = r10;
        r10 = r9;
        r9 = r8;
        r8 = r7;
        r7 = r6;
        r6 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x00e6, code lost:
        if (((java.lang.Boolean) r4).booleanValue() == false) goto L_0x015b;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x00e8, code lost:
        r4 = r9.next();
        r15 = 0;
        r2.L$0 = r14;
        r2.L$1 = r13;
        r2.L$2 = r10;
        r2.L$3 = r12;
        r2.L$4 = r9;
        r2.L$5 = r4;
        r2.label = 2;
        r3 = r13.hasNext(r2);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x0100, code lost:
        if (r3 != r0) goto L_0x0103;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x0102, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:0x0103, code lost:
        r16 = r4;
        r4 = r3;
        r3 = r10;
        r10 = r9;
        r9 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x0110, code lost:
        if (((java.lang.Boolean) r4).booleanValue() == false) goto L_0x0142;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:38:?, code lost:
        r1 = r3.invoke(r9, r13.next());
        r2.L$0 = r14;
        r2.L$1 = r13;
        r2.L$2 = r3;
        r2.L$3 = r12;
        r2.L$4 = r10;
        r18 = r3;
        r2.L$5 = null;
        r2.label = 3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:39:0x0130, code lost:
        if (r14.send(r1, r2) != r0) goto L_0x0133;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:40:0x0132, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:41:0x0133, code lost:
        r4 = r5;
        r5 = r6;
        r6 = r7;
        r7 = r8;
        r9 = r10;
        r10 = r11;
        r11 = r12;
        r8 = r15;
        r12 = r18;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:42:0x013d, code lost:
        r8 = r9;
        r9 = r12;
        r12 = r13;
        r13 = r14;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:43:0x0142, code lost:
        r9 = r3;
        r4 = r5;
        r5 = r6;
        r6 = r7;
        r7 = r8;
        r8 = r10;
        r10 = r11;
        r11 = r12;
        r12 = r13;
        r13 = r14;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:44:0x014f, code lost:
        r1 = r17;
        r3 = null;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:45:0x0154, code lost:
        r0 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:46:0x0155, code lost:
        r10 = r11;
        r4 = r5;
        r5 = r6;
        r6 = r7;
        r11 = r12;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:47:0x015b, code lost:
        r0 = kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:48:0x015e, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r12, r11);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:49:0x0166, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:50:0x0167, code lost:
        r0 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:51:0x0168, code lost:
        r4 = r5;
        r5 = r6;
        r6 = r7;
        r10 = r11;
        r11 = r12;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final java.lang.Object invokeSuspend(java.lang.Object r18) {
        /*
            r17 = this;
            java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            r1 = r17
            int r2 = r1.label
            r3 = 0
            switch(r2) {
                case 0: goto L_0x0094;
                case 1: goto L_0x0066;
                case 2: goto L_0x0036;
                case 3: goto L_0x0014;
                default: goto L_0x000c;
            }
        L_0x000c:
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException
            java.lang.String r1 = "call to 'resume' before 'invoke' with coroutine"
            r0.<init>(r1)
            throw r0
        L_0x0014:
            r2 = r17
            r4 = r18
            r5 = 0
            r6 = 0
            r7 = 0
            r8 = 0
            java.lang.Object r9 = r2.L$4
            kotlinx.coroutines.channels.ChannelIterator r9 = (kotlinx.coroutines.channels.ChannelIterator) r9
            r10 = 0
            java.lang.Object r11 = r2.L$3
            kotlinx.coroutines.channels.ReceiveChannel r11 = (kotlinx.coroutines.channels.ReceiveChannel) r11
            java.lang.Object r12 = r2.L$2
            kotlin.jvm.functions.Function2 r12 = (kotlin.jvm.functions.Function2) r12
            java.lang.Object r13 = r2.L$1
            kotlinx.coroutines.channels.ChannelIterator r13 = (kotlinx.coroutines.channels.ChannelIterator) r13
            java.lang.Object r14 = r2.L$0
            kotlinx.coroutines.channels.ProducerScope r14 = (kotlinx.coroutines.channels.ProducerScope) r14
            kotlin.ResultKt.throwOnFailure(r4)     // Catch:{ all -> 0x0091 }
            goto L_0x013d
        L_0x0036:
            r2 = r17
            r4 = r18
            r5 = 0
            r6 = 0
            r7 = 0
            r8 = 0
            java.lang.Object r9 = r2.L$5
            java.lang.Object r10 = r2.L$4
            kotlinx.coroutines.channels.ChannelIterator r10 = (kotlinx.coroutines.channels.ChannelIterator) r10
            java.lang.Object r11 = r2.L$3
            kotlinx.coroutines.channels.ReceiveChannel r11 = (kotlinx.coroutines.channels.ReceiveChannel) r11
            java.lang.Object r12 = r2.L$2
            kotlin.jvm.functions.Function2 r12 = (kotlin.jvm.functions.Function2) r12
            java.lang.Object r13 = r2.L$1
            kotlinx.coroutines.channels.ChannelIterator r13 = (kotlinx.coroutines.channels.ChannelIterator) r13
            java.lang.Object r14 = r2.L$0
            kotlinx.coroutines.channels.ProducerScope r14 = (kotlinx.coroutines.channels.ProducerScope) r14
            kotlin.ResultKt.throwOnFailure(r4)     // Catch:{ all -> 0x0062 }
            r15 = r11
            r11 = r3
            r3 = r12
            r12 = r15
            r15 = r8
            r8 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            goto L_0x010a
        L_0x0062:
            r0 = move-exception
            r10 = r3
            goto L_0x0171
        L_0x0066:
            r2 = r17
            r4 = r18
            r5 = 0
            r6 = 0
            r7 = 0
            java.lang.Object r8 = r2.L$4
            kotlinx.coroutines.channels.ChannelIterator r8 = (kotlinx.coroutines.channels.ChannelIterator) r8
            r10 = 0
            java.lang.Object r9 = r2.L$3
            kotlinx.coroutines.channels.ReceiveChannel r9 = (kotlinx.coroutines.channels.ReceiveChannel) r9
            r11 = r9
            java.lang.Object r9 = r2.L$2
            kotlin.jvm.functions.Function2 r9 = (kotlin.jvm.functions.Function2) r9
            java.lang.Object r12 = r2.L$1
            kotlinx.coroutines.channels.ChannelIterator r12 = (kotlinx.coroutines.channels.ChannelIterator) r12
            java.lang.Object r13 = r2.L$0
            kotlinx.coroutines.channels.ProducerScope r13 = (kotlinx.coroutines.channels.ProducerScope) r13
            kotlin.ResultKt.throwOnFailure(r4)     // Catch:{ all -> 0x0091 }
            r14 = r13
            r13 = r12
            r12 = r11
            r11 = r10
            r10 = r9
            r9 = r8
            r8 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            goto L_0x00e0
        L_0x0091:
            r0 = move-exception
            goto L_0x0171
        L_0x0094:
            kotlin.ResultKt.throwOnFailure(r18)
            r2 = r17
            r4 = r18
            java.lang.Object r5 = r2.L$0
            kotlinx.coroutines.channels.ProducerScope r5 = (kotlinx.coroutines.channels.ProducerScope) r5
            kotlinx.coroutines.channels.ReceiveChannel<R> r6 = r2.$other
            kotlinx.coroutines.channels.ChannelIterator r6 = r6.iterator()
            kotlinx.coroutines.channels.ReceiveChannel<E> r7 = r2.$this_zip
            kotlin.jvm.functions.Function2<E, R, V> r8 = r2.$transform
            r9 = 0
            r11 = r7
            r7 = 0
            r10 = 0
            r12 = r11
            r13 = 0
            kotlinx.coroutines.channels.ChannelIterator r14 = r12.iterator()     // Catch:{ all -> 0x016e }
            r12 = r6
            r6 = r7
            r7 = r13
            r13 = r5
            r5 = r9
            r9 = r8
            r8 = r14
        L_0x00bc:
            r2.L$0 = r13     // Catch:{ all -> 0x0091 }
            r2.L$1 = r12     // Catch:{ all -> 0x0091 }
            r2.L$2 = r9     // Catch:{ all -> 0x0091 }
            r2.L$3 = r11     // Catch:{ all -> 0x0091 }
            r2.L$4 = r8     // Catch:{ all -> 0x0091 }
            r2.L$5 = r3     // Catch:{ all -> 0x0091 }
            r14 = 1
            r2.label = r14     // Catch:{ all -> 0x0091 }
            java.lang.Object r14 = r8.hasNext(r2)     // Catch:{ all -> 0x0091 }
            if (r14 != r0) goto L_0x00d2
            return r0
        L_0x00d2:
            r16 = r5
            r5 = r4
            r4 = r14
            r14 = r13
            r13 = r12
            r12 = r11
            r11 = r10
            r10 = r9
            r9 = r8
            r8 = r7
            r7 = r6
            r6 = r16
        L_0x00e0:
            java.lang.Boolean r4 = (java.lang.Boolean) r4     // Catch:{ all -> 0x0167 }
            boolean r4 = r4.booleanValue()     // Catch:{ all -> 0x0167 }
            if (r4 == 0) goto L_0x015b
            java.lang.Object r4 = r9.next()     // Catch:{ all -> 0x0167 }
            r15 = 0
            r2.L$0 = r14     // Catch:{ all -> 0x0167 }
            r2.L$1 = r13     // Catch:{ all -> 0x0167 }
            r2.L$2 = r10     // Catch:{ all -> 0x0167 }
            r2.L$3 = r12     // Catch:{ all -> 0x0167 }
            r2.L$4 = r9     // Catch:{ all -> 0x0167 }
            r2.L$5 = r4     // Catch:{ all -> 0x0167 }
            r3 = 2
            r2.label = r3     // Catch:{ all -> 0x0167 }
            java.lang.Object r3 = r13.hasNext(r2)     // Catch:{ all -> 0x0167 }
            if (r3 != r0) goto L_0x0103
            return r0
        L_0x0103:
            r16 = r4
            r4 = r3
            r3 = r10
            r10 = r9
            r9 = r16
        L_0x010a:
            java.lang.Boolean r4 = (java.lang.Boolean) r4     // Catch:{ all -> 0x0154 }
            boolean r4 = r4.booleanValue()     // Catch:{ all -> 0x0154 }
            if (r4 == 0) goto L_0x0142
            java.lang.Object r4 = r13.next()     // Catch:{ all -> 0x0167 }
            java.lang.Object r1 = r3.invoke(r9, r4)     // Catch:{ all -> 0x0167 }
            r2.L$0 = r14     // Catch:{ all -> 0x0167 }
            r2.L$1 = r13     // Catch:{ all -> 0x0167 }
            r2.L$2 = r3     // Catch:{ all -> 0x0167 }
            r2.L$3 = r12     // Catch:{ all -> 0x0167 }
            r2.L$4 = r10     // Catch:{ all -> 0x0167 }
            r18 = r3
            r3 = 0
            r2.L$5 = r3     // Catch:{ all -> 0x0167 }
            r3 = 3
            r2.label = r3     // Catch:{ all -> 0x0167 }
            java.lang.Object r1 = r14.send(r1, r2)     // Catch:{ all -> 0x0167 }
            if (r1 != r0) goto L_0x0133
            return r0
        L_0x0133:
            r4 = r5
            r5 = r6
            r6 = r7
            r7 = r8
            r9 = r10
            r10 = r11
            r11 = r12
            r8 = r15
            r12 = r18
        L_0x013d:
            r8 = r9
            r9 = r12
            r12 = r13
            r13 = r14
            goto L_0x014f
        L_0x0142:
            r18 = r3
            r9 = r18
            r4 = r5
            r5 = r6
            r6 = r7
            r7 = r8
            r8 = r10
            r10 = r11
            r11 = r12
            r12 = r13
            r13 = r14
        L_0x014f:
            r1 = r17
            r3 = 0
            goto L_0x00bc
        L_0x0154:
            r0 = move-exception
            r10 = r11
            r4 = r5
            r5 = r6
            r6 = r7
            r11 = r12
            goto L_0x0171
        L_0x015b:
            kotlin.Unit r0 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x0167 }
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r12, r11)
            kotlin.Unit r0 = kotlin.Unit.INSTANCE
            return r0
        L_0x0167:
            r0 = move-exception
            r4 = r5
            r5 = r6
            r6 = r7
            r10 = r11
            r11 = r12
            goto L_0x0171
        L_0x016e:
            r0 = move-exception
            r6 = r7
            r5 = r9
        L_0x0171:
            r1 = r0
            throw r0     // Catch:{ all -> 0x0174 }
        L_0x0174:
            r0 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r11, r1)
            throw r0
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$zip$2.invokeSuspend(java.lang.Object):java.lang.Object");
    }
}
