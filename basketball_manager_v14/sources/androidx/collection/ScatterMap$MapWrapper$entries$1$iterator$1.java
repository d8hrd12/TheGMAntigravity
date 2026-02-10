package androidx.collection;

import java.util.Map;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.jvm.internal.DebugMetadata;
import kotlin.coroutines.jvm.internal.RestrictedSuspendLambda;
import kotlin.jvm.functions.Function2;
import kotlin.sequences.SequenceScope;

@Metadata(d1 = {"\u0000\u0012\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0010&\u0010\u0000\u001a\u00020\u0001\"\u0004\b\u0000\u0010\u0002\"\u0004\b\u0001\u0010\u0003*\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u0002H\u0002\u0012\u0004\u0012\u0002H\u00030\u00050\u0004H@"}, d2 = {"<anonymous>", "", "K", "V", "Lkotlin/sequences/SequenceScope;", ""}, k = 3, mv = {1, 8, 0}, xi = 48)
@DebugMetadata(c = "androidx.collection.ScatterMap$MapWrapper$entries$1$iterator$1", f = "ScatterMap.kt", i = {0, 0, 0, 0, 0, 0, 0}, l = {701}, m = "invokeSuspend", n = {"$this$iterator", "m$iv", "lastIndex$iv", "i$iv", "slot$iv", "bitCount$iv", "j$iv"}, s = {"L$0", "L$2", "I$0", "I$1", "J$0", "I$2", "I$3"})
/* compiled from: ScatterMap.kt */
final class ScatterMap$MapWrapper$entries$1$iterator$1 extends RestrictedSuspendLambda implements Function2<SequenceScope<? super Map.Entry<? extends K, ? extends V>>, Continuation<? super Unit>, Object> {
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
    ScatterMap$MapWrapper$entries$1$iterator$1(ScatterMap<K, V> scatterMap, Continuation<? super ScatterMap$MapWrapper$entries$1$iterator$1> continuation) {
        super(2, continuation);
        this.this$0 = scatterMap;
    }

    public final Continuation<Unit> create(Object obj, Continuation<?> continuation) {
        ScatterMap$MapWrapper$entries$1$iterator$1 scatterMap$MapWrapper$entries$1$iterator$1 = new ScatterMap$MapWrapper$entries$1$iterator$1(this.this$0, continuation);
        scatterMap$MapWrapper$entries$1$iterator$1.L$0 = obj;
        return scatterMap$MapWrapper$entries$1$iterator$1;
    }

    public final Object invoke(SequenceScope<? super Map.Entry<? extends K, ? extends V>> sequenceScope, Continuation<? super Unit> continuation) {
        return ((ScatterMap$MapWrapper$entries$1$iterator$1) create(sequenceScope, continuation)).invokeSuspend(Unit.INSTANCE);
    }

    /* JADX WARNING: Code restructure failed: missing block: B:10:0x007b, code lost:
        if (r8 >= r9) goto L_0x00cd;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:12:0x0086, code lost:
        if ((r10 & 255) >= 128) goto L_0x008a;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:13:0x0088, code lost:
        r7 = true;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:14:0x008a, code lost:
        r7 = false;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:15:0x008b, code lost:
        if (r7 == false) goto L_0x00c1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:16:0x008d, code lost:
        r23 = (r12 << 3) + r8;
        r18 = r5;
        r1 = new androidx.collection.MapEntry(r15.keys[r23], r15.values[r23]);
        r2.L$0 = r3;
        r2.L$1 = r15;
        r2.L$2 = r14;
        r2.I$0 = r13;
        r2.I$1 = r12;
        r2.J$0 = r10;
        r2.I$2 = r9;
        r2.I$3 = r8;
        r2.label = 1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:17:0x00bb, code lost:
        if (r3.yield(r1, r2) != r0) goto L_0x00be;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:18:0x00bd, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:19:0x00be, code lost:
        r5 = r18;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:20:0x00c1, code lost:
        r18 = r5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x00c3, code lost:
        r10 = r10 >> r16;
        r8 = r8 + 1;
        r1 = r22;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x00cd, code lost:
        r18 = r5;
        r1 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x00d3, code lost:
        if (r9 != r1) goto L_0x00de;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x00d5, code lost:
        r5 = r3;
        r8 = r6;
        r10 = r12;
        r9 = r13;
        r6 = r14;
        r7 = r15;
        r3 = r18;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x00de, code lost:
        r5 = r18;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x00e1, code lost:
        r1 = r16;
        r5 = r23;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x00e7, code lost:
        if (r10 == r9) goto L_0x00f1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x00e9, code lost:
        r10 = r10 + 1;
        r16 = r1;
        r1 = r22;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x00f1, code lost:
        r5 = r3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x00f4, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:6:0x004e, code lost:
        if (0 <= r9) goto L_0x0050;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:7:0x0050, code lost:
        r11 = r6[r10];
        r13 = r11;
        r23 = r5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:8:0x0065, code lost:
        if (((((~r13) << 7) & r13) & -9187201950435737472L) == -9187201950435737472L) goto L_0x00e1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:9:0x0067, code lost:
        r12 = r10;
        r10 = r11;
        r14 = r6;
        r15 = r7;
        r6 = r8;
        r13 = r9;
        r9 = 8 - ((~(r10 - r9)) >>> 31);
        r8 = 0;
        r5 = r3;
        r3 = r23;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final java.lang.Object invokeSuspend(java.lang.Object r23) {
        /*
            r22 = this;
            java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            r1 = r22
            int r2 = r1.label
            switch(r2) {
                case 0: goto L_0x0036;
                case 1: goto L_0x0013;
                default: goto L_0x000b;
            }
        L_0x000b:
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException
            java.lang.String r1 = "call to 'resume' before 'invoke' with coroutine"
            r0.<init>(r1)
            throw r0
        L_0x0013:
            r2 = r22
            r5 = r23
            r6 = 0
            r7 = 0
            int r8 = r2.I$3
            int r9 = r2.I$2
            long r10 = r2.J$0
            int r12 = r2.I$1
            int r13 = r2.I$0
            java.lang.Object r14 = r2.L$2
            long[] r14 = (long[]) r14
            java.lang.Object r15 = r2.L$1
            androidx.collection.ScatterMap r15 = (androidx.collection.ScatterMap) r15
            r16 = 8
            java.lang.Object r3 = r2.L$0
            kotlin.sequences.SequenceScope r3 = (kotlin.sequences.SequenceScope) r3
            kotlin.ResultKt.throwOnFailure(r5)
            goto L_0x00c0
        L_0x0036:
            r16 = 8
            kotlin.ResultKt.throwOnFailure(r23)
            r2 = r22
            r3 = r23
            java.lang.Object r5 = r2.L$0
            kotlin.sequences.SequenceScope r5 = (kotlin.sequences.SequenceScope) r5
            androidx.collection.ScatterMap<K, V> r6 = r2.this$0
            androidx.collection.ScatterMap<K, V> r7 = r2.this$0
            r8 = 0
            long[] r6 = r6.metadata
            int r9 = r6.length
            int r9 = r9 + -2
            r10 = 0
            if (r10 > r9) goto L_0x00f1
        L_0x0050:
            r11 = r6[r10]
            r13 = r11
            r15 = 0
            r23 = r5
            long r4 = ~r13
            r18 = 7
            long r4 = r4 << r18
            long r4 = r4 & r13
            r18 = -9187201950435737472(0x8080808080808080, double:-2.937446524422997E-306)
            long r4 = r4 & r18
            int r4 = (r4 > r18 ? 1 : (r4 == r18 ? 0 : -1))
            if (r4 == 0) goto L_0x00e1
            int r4 = r10 - r9
            int r4 = ~r4
            int r4 = r4 >>> 31
            int r4 = 8 - r4
            r5 = 0
            r13 = r11
            r12 = r10
            r10 = r13
            r14 = r6
            r15 = r7
            r6 = r8
            r13 = r9
            r9 = r4
            r8 = r5
            r5 = r3
            r3 = r23
        L_0x007b:
            if (r8 >= r9) goto L_0x00cd
            r18 = 255(0xff, double:1.26E-321)
            long r18 = r10 & r18
            r4 = 0
            r20 = 128(0x80, double:6.32E-322)
            int r7 = (r18 > r20 ? 1 : (r18 == r20 ? 0 : -1))
            if (r7 >= 0) goto L_0x008a
            r7 = 1
            goto L_0x008b
        L_0x008a:
            r7 = 0
        L_0x008b:
            if (r7 == 0) goto L_0x00c1
            int r4 = r12 << 3
            int r4 = r4 + r8
            r7 = 0
            androidx.collection.MapEntry r1 = new androidx.collection.MapEntry
            r23 = r4
            java.lang.Object[] r4 = r15.keys
            r4 = r4[r23]
            r18 = r5
            java.lang.Object[] r5 = r15.values
            r5 = r5[r23]
            r1.<init>(r4, r5)
            r2.L$0 = r3
            r2.L$1 = r15
            r2.L$2 = r14
            r2.I$0 = r13
            r2.I$1 = r12
            r2.J$0 = r10
            r2.I$2 = r9
            r2.I$3 = r8
            r4 = 1
            r2.label = r4
            java.lang.Object r1 = r3.yield(r1, r2)
            if (r1 != r0) goto L_0x00be
            return r0
        L_0x00be:
            r5 = r18
        L_0x00c0:
            goto L_0x00c3
        L_0x00c1:
            r18 = r5
        L_0x00c3:
            long r10 = r10 >> r16
            r17 = 1
            int r8 = r8 + 1
            r1 = r22
            goto L_0x007b
        L_0x00cd:
            r18 = r5
            r17 = 1
            r1 = r16
            if (r9 != r1) goto L_0x00de
            r5 = r3
            r8 = r6
            r10 = r12
            r9 = r13
            r6 = r14
            r7 = r15
            r3 = r18
            goto L_0x00e7
        L_0x00de:
            r5 = r18
            goto L_0x00f2
        L_0x00e1:
            r1 = r16
            r17 = 1
            r5 = r23
        L_0x00e7:
            if (r10 == r9) goto L_0x00f1
            int r10 = r10 + 1
            r16 = r1
            r1 = r22
            goto L_0x0050
        L_0x00f1:
            r5 = r3
        L_0x00f2:
            kotlin.Unit r0 = kotlin.Unit.INSTANCE
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.collection.ScatterMap$MapWrapper$entries$1$iterator$1.invokeSuspend(java.lang.Object):java.lang.Object");
    }
}
