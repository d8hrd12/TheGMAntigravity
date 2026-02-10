package androidx.collection;

import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.jvm.internal.DebugMetadata;
import kotlin.coroutines.jvm.internal.RestrictedSuspendLambda;
import kotlin.jvm.functions.Function2;
import kotlin.sequences.SequenceScope;

@Metadata(d1 = {"\u0000\u000e\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\u0010\u0000\u001a\u00020\u0001\"\u0004\b\u0000\u0010\u0002\"\u0004\b\u0001\u0010\u0003*\b\u0012\u0004\u0012\u0002H\u00020\u0004H@"}, d2 = {"<anonymous>", "", "K", "V", "Lkotlin/sequences/SequenceScope;"}, k = 3, mv = {1, 8, 0}, xi = 48)
@DebugMetadata(c = "androidx.collection.ScatterMap$MapWrapper$keys$1$iterator$1", f = "ScatterMap.kt", i = {0, 0, 0, 0, 0, 0, 0, 0}, l = {726}, m = "invokeSuspend", n = {"$this$iterator", "k$iv", "m$iv$iv", "lastIndex$iv$iv", "i$iv$iv", "slot$iv$iv", "bitCount$iv$iv", "j$iv$iv"}, s = {"L$0", "L$1", "L$2", "I$0", "I$1", "J$0", "I$2", "I$3"})
/* compiled from: ScatterMap.kt */
final class ScatterMap$MapWrapper$keys$1$iterator$1 extends RestrictedSuspendLambda implements Function2<SequenceScope<? super K>, Continuation<? super Unit>, Object> {
    int I$0;
    int I$1;
    int I$2;
    int I$3;
    long J$0;
    private /* synthetic */ Object L$0;
    Object L$1;
    Object L$2;
    int label;
    final /* synthetic */ ScatterMap<K, V> this$0;

    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    ScatterMap$MapWrapper$keys$1$iterator$1(ScatterMap<K, V> scatterMap, Continuation<? super ScatterMap$MapWrapper$keys$1$iterator$1> continuation) {
        super(2, continuation);
        this.this$0 = scatterMap;
    }

    public final Continuation<Unit> create(Object obj, Continuation<?> continuation) {
        ScatterMap$MapWrapper$keys$1$iterator$1 scatterMap$MapWrapper$keys$1$iterator$1 = new ScatterMap$MapWrapper$keys$1$iterator$1(this.this$0, continuation);
        scatterMap$MapWrapper$keys$1$iterator$1.L$0 = obj;
        return scatterMap$MapWrapper$keys$1$iterator$1;
    }

    public final Object invoke(SequenceScope<? super K> sequenceScope, Continuation<? super Unit> continuation) {
        return ((ScatterMap$MapWrapper$keys$1$iterator$1) create(sequenceScope, continuation)).invokeSuspend(Unit.INSTANCE);
    }

    /* JADX WARNING: Code restructure failed: missing block: B:10:0x0085, code lost:
        if (r10 >= r11) goto L_0x00ce;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:12:0x0090, code lost:
        if ((255 & r12) >= 128) goto L_0x0094;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:13:0x0092, code lost:
        r8 = true;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:14:0x0094, code lost:
        r8 = false;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:15:0x0095, code lost:
        if (r8 == false) goto L_0x00c4;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:16:0x0097, code lost:
        r8 = r4[(r14 << 3) + r10];
        r2.L$0 = r0;
        r2.L$1 = r4;
        r2.L$2 = r3;
        r2.I$0 = r15;
        r2.I$1 = r14;
        r2.J$0 = r12;
        r2.I$2 = r11;
        r2.I$3 = r10;
        r19 = r3;
        r2.label = 1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:17:0x00b9, code lost:
        if (r0.yield(r8, r2) != r1) goto L_0x00bc;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:18:0x00bb, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:19:0x00bc, code lost:
        r3 = r19;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:20:0x00c4, code lost:
        r19 = r3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x00c6, code lost:
        r12 = r12 >> r16;
        r10 = r10 + 1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x00ce, code lost:
        r19 = r3;
        r3 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x00d4, code lost:
        if (r11 != r3) goto L_0x00f3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x00d6, code lost:
        r18 = r1;
        r16 = r3;
        r9 = r14;
        r8 = r15;
        r3 = r0;
        r0 = r2;
        r2 = r5;
        r5 = r6;
        r6 = r4;
        r4 = r19;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x00e4, code lost:
        r0 = r22;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x00e8, code lost:
        if (r9 == r8) goto L_0x00f0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x00ea, code lost:
        r9 = r9 + 1;
        r1 = r21;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x00f0, code lost:
        r6 = r5;
        r5 = r2;
        r2 = r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x00f6, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:6:0x0058, code lost:
        if (0 <= r8) goto L_0x005a;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:7:0x005a, code lost:
        r10 = r4[r9];
        r12 = r10;
        r22 = r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:8:0x006d, code lost:
        if (((((~r12) << 7) & r12) & -9187201950435737472L) == -9187201950435737472L) goto L_0x00e4;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:9:0x006f, code lost:
        r15 = r8;
        r14 = r9;
        r12 = r10;
        r11 = 8 - ((~(r9 - r8)) >>> 31);
        r10 = 0;
        r0 = r3;
        r3 = r4;
        r4 = r6;
        r1 = r18;
        r6 = r5;
        r5 = r2;
        r2 = r22;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final java.lang.Object invokeSuspend(java.lang.Object r22) {
        /*
            r21 = this;
            java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            r1 = r21
            int r2 = r1.label
            switch(r2) {
                case 0: goto L_0x003c;
                case 1: goto L_0x0013;
                default: goto L_0x000b;
            }
        L_0x000b:
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException
            java.lang.String r1 = "call to 'resume' before 'invoke' with coroutine"
            r0.<init>(r1)
            throw r0
        L_0x0013:
            r2 = r21
            r5 = r22
            r6 = 0
            r7 = 0
            r8 = 0
            r9 = 0
            int r10 = r2.I$3
            int r11 = r2.I$2
            long r12 = r2.J$0
            int r14 = r2.I$1
            int r15 = r2.I$0
            r16 = 8
            java.lang.Object r3 = r2.L$2
            long[] r3 = (long[]) r3
            java.lang.Object r4 = r2.L$1
            java.lang.Object[] r4 = (java.lang.Object[]) r4
            r18 = r0
            java.lang.Object r0 = r2.L$0
            kotlin.sequences.SequenceScope r0 = (kotlin.sequences.SequenceScope) r0
            kotlin.ResultKt.throwOnFailure(r5)
            r1 = r18
            goto L_0x00c1
        L_0x003c:
            r18 = r0
            r16 = 8
            kotlin.ResultKt.throwOnFailure(r22)
            r0 = r21
            r2 = r22
            java.lang.Object r3 = r0.L$0
            kotlin.sequences.SequenceScope r3 = (kotlin.sequences.SequenceScope) r3
            androidx.collection.ScatterMap<K, V> r4 = r0.this$0
            r5 = 0
            java.lang.Object[] r6 = r4.keys
            r7 = 0
            long[] r4 = r4.metadata
            int r8 = r4.length
            int r8 = r8 + -2
            r9 = 0
            if (r9 > r8) goto L_0x00f0
        L_0x005a:
            r10 = r4[r9]
            r12 = r10
            r14 = 0
            r22 = r0
            long r0 = ~r12
            r15 = 7
            long r0 = r0 << r15
            long r0 = r0 & r12
            r19 = -9187201950435737472(0x8080808080808080, double:-2.937446524422997E-306)
            long r0 = r0 & r19
            int r0 = (r0 > r19 ? 1 : (r0 == r19 ? 0 : -1))
            if (r0 == 0) goto L_0x00e4
            int r0 = r9 - r8
            int r0 = ~r0
            int r0 = r0 >>> 31
            int r0 = 8 - r0
            r1 = 0
            r15 = r8
            r14 = r9
            r12 = r10
            r11 = r0
            r10 = r1
            r0 = r3
            r3 = r4
            r4 = r6
            r1 = r18
            r6 = r5
            r5 = r2
            r2 = r22
        L_0x0085:
            if (r10 >= r11) goto L_0x00ce
            r8 = 255(0xff, double:1.26E-321)
            long r8 = r8 & r12
            r18 = 0
            r19 = 128(0x80, double:6.32E-322)
            int r19 = (r8 > r19 ? 1 : (r8 == r19 ? 0 : -1))
            if (r19 >= 0) goto L_0x0094
            r8 = 1
            goto L_0x0095
        L_0x0094:
            r8 = 0
        L_0x0095:
            if (r8 == 0) goto L_0x00c4
            int r8 = r14 << 3
            int r8 = r8 + r10
            r9 = 0
            r8 = r4[r8]
            r18 = 0
            r2.L$0 = r0
            r2.L$1 = r4
            r2.L$2 = r3
            r2.I$0 = r15
            r2.I$1 = r14
            r2.J$0 = r12
            r2.I$2 = r11
            r2.I$3 = r10
            r19 = r3
            r3 = 1
            r2.label = r3
            java.lang.Object r3 = r0.yield(r8, r2)
            if (r3 != r1) goto L_0x00bc
            return r1
        L_0x00bc:
            r8 = r9
            r9 = r18
            r3 = r19
        L_0x00c1:
            goto L_0x00c6
        L_0x00c4:
            r19 = r3
        L_0x00c6:
            long r12 = r12 >> r16
            r17 = 1
            int r10 = r10 + 1
            goto L_0x0085
        L_0x00ce:
            r19 = r3
            r17 = 1
            r3 = r16
            if (r11 != r3) goto L_0x00f3
            r18 = r1
            r16 = r3
            r9 = r14
            r8 = r15
            r3 = r0
            r0 = r2
            r2 = r5
            r5 = r6
            r6 = r4
            r4 = r19
            goto L_0x00e8
        L_0x00e4:
            r17 = 1
            r0 = r22
        L_0x00e8:
            if (r9 == r8) goto L_0x00f0
            int r9 = r9 + 1
            r1 = r21
            goto L_0x005a
        L_0x00f0:
            r6 = r5
            r5 = r2
            r2 = r0
        L_0x00f3:
            kotlin.Unit r0 = kotlin.Unit.INSTANCE
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.collection.ScatterMap$MapWrapper$keys$1$iterator$1.invokeSuspend(java.lang.Object):java.lang.Object");
    }
}
