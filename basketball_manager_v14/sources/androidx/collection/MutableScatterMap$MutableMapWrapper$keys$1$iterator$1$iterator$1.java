package androidx.collection;

import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.jvm.internal.DebugMetadata;
import kotlin.coroutines.jvm.internal.RestrictedSuspendLambda;
import kotlin.jvm.functions.Function2;
import kotlin.sequences.SequenceScope;

@Metadata(d1 = {"\u0000\u0012\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0010\b\u0010\u0000\u001a\u00020\u0001\"\u0004\b\u0000\u0010\u0002\"\u0004\b\u0001\u0010\u0003*\b\u0012\u0004\u0012\u00020\u00050\u0004H@"}, d2 = {"<anonymous>", "", "K", "V", "Lkotlin/sequences/SequenceScope;", ""}, k = 3, mv = {1, 8, 0}, xi = 48)
@DebugMetadata(c = "androidx.collection.MutableScatterMap$MutableMapWrapper$keys$1$iterator$1$iterator$1", f = "ScatterMap.kt", i = {0, 0, 0, 0, 0, 0, 0}, l = {1431}, m = "invokeSuspend", n = {"$this$iterator", "m$iv", "lastIndex$iv", "i$iv", "slot$iv", "bitCount$iv", "j$iv"}, s = {"L$0", "L$1", "I$0", "I$1", "J$0", "I$2", "I$3"})
/* compiled from: ScatterMap.kt */
final class MutableScatterMap$MutableMapWrapper$keys$1$iterator$1$iterator$1 extends RestrictedSuspendLambda implements Function2<SequenceScope<? super Integer>, Continuation<? super Unit>, Object> {
    int I$0;
    int I$1;
    int I$2;
    int I$3;
    long J$0;
    private /* synthetic */ Object L$0;
    Object L$1;
    int label;
    final /* synthetic */ MutableScatterMap<K, V> this$0;

    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    MutableScatterMap$MutableMapWrapper$keys$1$iterator$1$iterator$1(MutableScatterMap<K, V> mutableScatterMap, Continuation<? super MutableScatterMap$MutableMapWrapper$keys$1$iterator$1$iterator$1> continuation) {
        super(2, continuation);
        this.this$0 = mutableScatterMap;
    }

    public final Continuation<Unit> create(Object obj, Continuation<?> continuation) {
        MutableScatterMap$MutableMapWrapper$keys$1$iterator$1$iterator$1 mutableScatterMap$MutableMapWrapper$keys$1$iterator$1$iterator$1 = new MutableScatterMap$MutableMapWrapper$keys$1$iterator$1$iterator$1(this.this$0, continuation);
        mutableScatterMap$MutableMapWrapper$keys$1$iterator$1$iterator$1.L$0 = obj;
        return mutableScatterMap$MutableMapWrapper$keys$1$iterator$1$iterator$1;
    }

    public final Object invoke(SequenceScope<? super Integer> sequenceScope, Continuation<? super Unit> continuation) {
        return ((MutableScatterMap$MutableMapWrapper$keys$1$iterator$1$iterator$1) create(sequenceScope, continuation)).invokeSuspend(Unit.INSTANCE);
    }

    /* JADX WARNING: Code restructure failed: missing block: B:10:0x0072, code lost:
        if (r8 >= r9) goto L_0x00af;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:12:0x007c, code lost:
        if ((255 & r10) >= 128) goto L_0x0080;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:13:0x007e, code lost:
        r3 = true;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:14:0x0080, code lost:
        r3 = false;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:15:0x0081, code lost:
        if (r3 == false) goto L_0x00a5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:16:0x0083, code lost:
        r4 = kotlin.coroutines.jvm.internal.Boxing.boxInt((r12 << 3) + r8);
        r2.L$0 = r15;
        r2.L$1 = r14;
        r2.I$0 = r13;
        r2.I$1 = r12;
        r2.J$0 = r10;
        r2.I$2 = r9;
        r2.I$3 = r8;
        r2.label = 1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:17:0x00a1, code lost:
        if (r15.yield(r4, r2) != r0) goto L_0x00a5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:18:0x00a3, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:19:0x00a5, code lost:
        r10 = r10 >> r16;
        r8 = r8 + 1;
        r1 = r20;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x00b3, code lost:
        if (r9 != r16) goto L_0x00c7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x00b5, code lost:
        r8 = r6;
        r10 = r12;
        r9 = r13;
        r7 = r14;
        r6 = r15;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x00bf, code lost:
        if (r10 == r9) goto L_0x00c7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x00c1, code lost:
        r10 = r10 + 1;
        r1 = r20;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x00c9, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:6:0x0048, code lost:
        if (0 <= r9) goto L_0x004a;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:7:0x004a, code lost:
        r11 = r7[r10];
        r13 = r11;
        r16 = 8;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:8:0x005f, code lost:
        if (((((~r13) << 7) & r13) & -9187201950435737472L) == -9187201950435737472L) goto L_0x00bb;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:9:0x0061, code lost:
        r12 = r10;
        r10 = r11;
        r15 = r6;
        r14 = r7;
        r6 = r8;
        r13 = r9;
        r9 = 8 - ((~(r10 - r9)) >>> 31);
        r8 = 0;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final java.lang.Object invokeSuspend(java.lang.Object r21) {
        /*
            r20 = this;
            java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            r1 = r20
            int r2 = r1.label
            switch(r2) {
                case 0: goto L_0x0032;
                case 1: goto L_0x0013;
                default: goto L_0x000b;
            }
        L_0x000b:
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException
            java.lang.String r1 = "call to 'resume' before 'invoke' with coroutine"
            r0.<init>(r1)
            throw r0
        L_0x0013:
            r2 = r20
            r5 = r21
            r6 = 0
            r7 = 0
            int r8 = r2.I$3
            int r9 = r2.I$2
            long r10 = r2.J$0
            int r12 = r2.I$1
            int r13 = r2.I$0
            java.lang.Object r14 = r2.L$1
            long[] r14 = (long[]) r14
            java.lang.Object r15 = r2.L$0
            kotlin.sequences.SequenceScope r15 = (kotlin.sequences.SequenceScope) r15
            kotlin.ResultKt.throwOnFailure(r5)
            r16 = 8
            goto L_0x00a4
        L_0x0032:
            kotlin.ResultKt.throwOnFailure(r21)
            r2 = r20
            r5 = r21
            java.lang.Object r6 = r2.L$0
            kotlin.sequences.SequenceScope r6 = (kotlin.sequences.SequenceScope) r6
            androidx.collection.MutableScatterMap<K, V> r7 = r2.this$0
            androidx.collection.ScatterMap r7 = (androidx.collection.ScatterMap) r7
            r8 = 0
            long[] r7 = r7.metadata
            int r9 = r7.length
            int r9 = r9 + -2
            r10 = 0
            if (r10 > r9) goto L_0x00c6
        L_0x004a:
            r11 = r7[r10]
            r13 = r11
            r15 = 0
            r16 = 8
            long r3 = ~r13
            r18 = 7
            long r3 = r3 << r18
            long r3 = r3 & r13
            r18 = -9187201950435737472(0x8080808080808080, double:-2.937446524422997E-306)
            long r3 = r3 & r18
            int r3 = (r3 > r18 ? 1 : (r3 == r18 ? 0 : -1))
            if (r3 == 0) goto L_0x00bb
            int r3 = r10 - r9
            int r3 = ~r3
            int r3 = r3 >>> 31
            int r3 = 8 - r3
            r4 = 0
            r13 = r11
            r12 = r10
            r10 = r13
            r15 = r6
            r14 = r7
            r6 = r8
            r13 = r9
            r9 = r3
            r8 = r4
        L_0x0072:
            if (r8 >= r9) goto L_0x00af
            r3 = 255(0xff, double:1.26E-321)
            long r3 = r3 & r10
            r7 = 0
            r18 = 128(0x80, double:6.32E-322)
            int r18 = (r3 > r18 ? 1 : (r3 == r18 ? 0 : -1))
            if (r18 >= 0) goto L_0x0080
            r3 = 1
            goto L_0x0081
        L_0x0080:
            r3 = 0
        L_0x0081:
            if (r3 == 0) goto L_0x00a5
            int r3 = r12 << 3
            int r3 = r3 + r8
            r7 = 0
            java.lang.Integer r4 = kotlin.coroutines.jvm.internal.Boxing.boxInt(r3)
            r2.L$0 = r15
            r2.L$1 = r14
            r2.I$0 = r13
            r2.I$1 = r12
            r2.J$0 = r10
            r2.I$2 = r9
            r2.I$3 = r8
            r1 = 1
            r2.label = r1
            java.lang.Object r1 = r15.yield(r4, r2)
            if (r1 != r0) goto L_0x00a4
            return r0
        L_0x00a4:
        L_0x00a5:
            long r10 = r10 >> r16
            r17 = 1
            int r8 = r8 + 1
            r1 = r20
            goto L_0x0072
        L_0x00af:
            r17 = 1
            r1 = r16
            if (r9 != r1) goto L_0x00c7
            r8 = r6
            r10 = r12
            r9 = r13
            r7 = r14
            r6 = r15
            goto L_0x00bf
        L_0x00bb:
            r1 = r16
            r17 = 1
        L_0x00bf:
            if (r10 == r9) goto L_0x00c6
            int r10 = r10 + 1
            r1 = r20
            goto L_0x004a
        L_0x00c6:
        L_0x00c7:
            kotlin.Unit r0 = kotlin.Unit.INSTANCE
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.collection.MutableScatterMap$MutableMapWrapper$keys$1$iterator$1$iterator$1.invokeSuspend(java.lang.Object):java.lang.Object");
    }
}
