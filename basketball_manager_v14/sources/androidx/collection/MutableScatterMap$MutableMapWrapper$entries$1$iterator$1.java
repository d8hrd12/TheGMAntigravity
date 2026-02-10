package androidx.collection;

import java.util.Iterator;
import java.util.Map;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.jvm.internal.DebugMetadata;
import kotlin.coroutines.jvm.internal.RestrictedSuspendLambda;
import kotlin.jvm.functions.Function2;
import kotlin.jvm.internal.Intrinsics;
import kotlin.jvm.internal.markers.KMutableIterator;
import kotlin.sequences.SequenceScope;
import kotlin.sequences.SequencesKt;

@Metadata(d1 = {"\u0000-\n\u0000\n\u0002\u0010)\n\u0002\u0010'\n\u0000\n\u0002\u0010\b\n\u0002\b\u0005\n\u0002\u0010(\n\u0002\b\u0005\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0000*\u0001\u0000\b\n\u0018\u00002\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00028\u0000\u0012\u0004\u0012\u00028\u00010\u00020\u0001J\t\u0010\u000f\u001a\u00020\u0010H\u0002J\u0015\u0010\u0011\u001a\u000e\u0012\u0004\u0012\u00028\u0000\u0012\u0004\u0012\u00028\u00010\u0002H\u0002J\b\u0010\u0012\u001a\u00020\u0013H\u0016R\u001a\u0010\u0003\u001a\u00020\u0004X\u000e¢\u0006\u000e\n\u0000\u001a\u0004\b\u0005\u0010\u0006\"\u0004\b\u0007\u0010\bR,\u0010\t\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00028\u0000\u0012\u0004\u0012\u00028\u00010\u00020\nX\u000e¢\u0006\u000e\n\u0000\u001a\u0004\b\u000b\u0010\f\"\u0004\b\r\u0010\u000e¨\u0006\u0014"}, d2 = {"androidx/collection/MutableScatterMap$MutableMapWrapper$entries$1$iterator$1", "", "", "current", "", "getCurrent", "()I", "setCurrent", "(I)V", "iterator", "", "getIterator", "()Ljava/util/Iterator;", "setIterator", "(Ljava/util/Iterator;)V", "hasNext", "", "next", "remove", "", "collection"}, k = 1, mv = {1, 8, 0}, xi = 48)
/* compiled from: ScatterMap.kt */
public final class MutableScatterMap$MutableMapWrapper$entries$1$iterator$1 implements Iterator<Map.Entry<K, V>>, KMutableIterator {
    private int current = -1;
    private Iterator<? extends Map.Entry<K, V>> iterator;
    final /* synthetic */ MutableScatterMap<K, V> this$0;

    MutableScatterMap$MutableMapWrapper$entries$1$iterator$1(final MutableScatterMap<K, V> $receiver) {
        this.this$0 = $receiver;
        this.iterator = SequencesKt.iterator(new AnonymousClass1((Continuation<? super AnonymousClass1>) null));
    }

    public final Iterator<Map.Entry<K, V>> getIterator() {
        return this.iterator;
    }

    public final void setIterator(Iterator<? extends Map.Entry<K, V>> it) {
        Intrinsics.checkNotNullParameter(it, "<set-?>");
        this.iterator = it;
    }

    public final int getCurrent() {
        return this.current;
    }

    public final void setCurrent(int i) {
        this.current = i;
    }

    @Metadata(d1 = {"\u0000\u0012\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0010'\u0010\u0000\u001a\u00020\u0001\"\u0004\b\u0000\u0010\u0002\"\u0004\b\u0001\u0010\u0003*\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u0002H\u0002\u0012\u0004\u0012\u0002H\u00030\u00050\u0004H@"}, d2 = {"<anonymous>", "", "K", "V", "Lkotlin/sequences/SequenceScope;", ""}, k = 3, mv = {1, 8, 0}, xi = 48)
    @DebugMetadata(c = "androidx.collection.MutableScatterMap$MutableMapWrapper$entries$1$iterator$1$1", f = "ScatterMap.kt", i = {0, 0, 0, 0, 0, 0, 0}, l = {1328}, m = "invokeSuspend", n = {"$this$iterator", "m$iv", "lastIndex$iv", "i$iv", "slot$iv", "bitCount$iv", "j$iv"}, s = {"L$0", "L$3", "I$0", "I$1", "J$0", "I$2", "I$3"})
    /* renamed from: androidx.collection.MutableScatterMap$MutableMapWrapper$entries$1$iterator$1$1  reason: invalid class name */
    /* compiled from: ScatterMap.kt */
    static final class AnonymousClass1 extends RestrictedSuspendLambda implements Function2<SequenceScope<? super Map.Entry<K, V>>, Continuation<? super Unit>, Object> {
        int I$0;
        int I$1;
        int I$2;
        int I$3;
        long J$0;
        private /* synthetic */ Object L$0;
        Object L$1;
        Object L$2;
        Object L$3;
        int label;

        public final Continuation<Unit> create(Object obj, Continuation<?> continuation) {
            AnonymousClass1 r0 = new AnonymousClass1($receiver, this, continuation);
            r0.L$0 = obj;
            return r0;
        }

        public final Object invoke(SequenceScope<? super Map.Entry<K, V>> sequenceScope, Continuation<? super Unit> continuation) {
            return ((AnonymousClass1) create(sequenceScope, continuation)).invokeSuspend(Unit.INSTANCE);
        }

        /* JADX WARNING: Code restructure failed: missing block: B:10:0x0084, code lost:
            if (r8 >= r9) goto L_0x00e1;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:12:0x008f, code lost:
            if ((r10 & 255) >= 128) goto L_0x0093;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:13:0x0091, code lost:
            r7 = true;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:14:0x0093, code lost:
            r7 = false;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:15:0x0094, code lost:
            if (r7 == false) goto L_0x00d5;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:16:0x0096, code lost:
            r3.setCurrent((r12 << 3) + r8);
            r23 = r5;
            r18 = r6;
            r1 = new androidx.collection.MutableMapEntry(r15.keys, r15.values, r3.getCurrent());
            r2.L$0 = r4;
            r2.L$1 = r3;
            r2.L$2 = r15;
            r2.L$3 = r14;
            r2.I$0 = r13;
            r2.I$1 = r12;
            r2.J$0 = r10;
            r2.I$2 = r9;
            r2.I$3 = r8;
            r2.label = 1;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:17:0x00cb, code lost:
            if (r4.yield(r1, r2) != r0) goto L_0x00ce;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:18:0x00cd, code lost:
            return r0;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:19:0x00ce, code lost:
            r5 = r23;
            r6 = r18;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:20:0x00d5, code lost:
            r23 = r5;
            r18 = r6;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:21:0x00d9, code lost:
            r10 = r10 >> r16;
            r8 = r8 + 1;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:22:0x00e1, code lost:
            r23 = r5;
            r18 = r6;
            r1 = r16;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:23:0x00e9, code lost:
            if (r9 != r1) goto L_0x00f5;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:24:0x00eb, code lost:
            r6 = r3;
            r10 = r12;
            r9 = r13;
            r5 = r14;
            r7 = r15;
            r8 = r18;
            r3 = r23;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:25:0x00f5, code lost:
            r5 = r23;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:26:0x00f8, code lost:
            r1 = r16;
            r0 = r23;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:27:0x00fe, code lost:
            if (r10 == r9) goto L_0x0108;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:28:0x0100, code lost:
            r10 = r10 + 1;
            r16 = r1;
            r1 = r22;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:29:0x0108, code lost:
            r5 = r3;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:31:0x010b, code lost:
            return kotlin.Unit.INSTANCE;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:6:0x0056, code lost:
            if (0 <= r9) goto L_0x0058;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:7:0x0058, code lost:
            r11 = r5[r10];
            r13 = r11;
            r23 = r0;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:8:0x006d, code lost:
            if (((((~r13) << 7) & r13) & -9187201950435737472L) == -9187201950435737472L) goto L_0x00f8;
         */
        /* JADX WARNING: Code restructure failed: missing block: B:9:0x006f, code lost:
            r12 = r10;
            r10 = r11;
            r14 = r5;
            r15 = r7;
            r13 = r9;
            r9 = 8 - ((~(r10 - r9)) >>> 31);
            r5 = r3;
            r3 = r6;
            r6 = r8;
            r0 = r23;
            r8 = 0;
         */
        /* Code decompiled incorrectly, please refer to instructions dump. */
        public final java.lang.Object invokeSuspend(java.lang.Object r23) {
            /*
                r22 = this;
                java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
                r1 = r22
                int r2 = r1.label
                switch(r2) {
                    case 0: goto L_0x003a;
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
                java.lang.Object r14 = r2.L$3
                long[] r14 = (long[]) r14
                java.lang.Object r15 = r2.L$2
                androidx.collection.MutableScatterMap r15 = (androidx.collection.MutableScatterMap) r15
                r16 = 8
                java.lang.Object r3 = r2.L$1
                androidx.collection.MutableScatterMap$MutableMapWrapper$entries$1$iterator$1 r3 = (androidx.collection.MutableScatterMap$MutableMapWrapper$entries$1$iterator$1) r3
                java.lang.Object r4 = r2.L$0
                kotlin.sequences.SequenceScope r4 = (kotlin.sequences.SequenceScope) r4
                kotlin.ResultKt.throwOnFailure(r5)
                goto L_0x00d4
            L_0x003a:
                r16 = 8
                kotlin.ResultKt.throwOnFailure(r23)
                r2 = r22
                r3 = r23
                java.lang.Object r4 = r2.L$0
                kotlin.sequences.SequenceScope r4 = (kotlin.sequences.SequenceScope) r4
                androidx.collection.MutableScatterMap<K, V> r5 = r3
                androidx.collection.ScatterMap r5 = (androidx.collection.ScatterMap) r5
                androidx.collection.MutableScatterMap$MutableMapWrapper$entries$1$iterator$1<K, V> r6 = r2
                androidx.collection.MutableScatterMap<K, V> r7 = r3
                r8 = 0
                long[] r5 = r5.metadata
                int r9 = r5.length
                int r9 = r9 + -2
                r10 = 0
                if (r10 > r9) goto L_0x0108
            L_0x0058:
                r11 = r5[r10]
                r13 = r11
                r15 = 0
                r23 = r0
                long r0 = ~r13
                r18 = 7
                long r0 = r0 << r18
                long r0 = r0 & r13
                r18 = -9187201950435737472(0x8080808080808080, double:-2.937446524422997E-306)
                long r0 = r0 & r18
                int r0 = (r0 > r18 ? 1 : (r0 == r18 ? 0 : -1))
                if (r0 == 0) goto L_0x00f8
                int r0 = r10 - r9
                int r0 = ~r0
                int r0 = r0 >>> 31
                int r0 = 8 - r0
                r1 = 0
                r13 = r11
                r12 = r10
                r10 = r13
                r14 = r5
                r15 = r7
                r13 = r9
                r9 = r0
                r5 = r3
                r3 = r6
                r6 = r8
                r0 = r23
                r8 = r1
            L_0x0084:
                if (r8 >= r9) goto L_0x00e1
                r18 = 255(0xff, double:1.26E-321)
                long r18 = r10 & r18
                r1 = 0
                r20 = 128(0x80, double:6.32E-322)
                int r7 = (r18 > r20 ? 1 : (r18 == r20 ? 0 : -1))
                if (r7 >= 0) goto L_0x0093
                r7 = 1
                goto L_0x0094
            L_0x0093:
                r7 = 0
            L_0x0094:
                if (r7 == 0) goto L_0x00d5
                int r1 = r12 << 3
                int r1 = r1 + r8
                r7 = 0
                r3.setCurrent(r1)
                androidx.collection.MutableMapEntry r1 = new androidx.collection.MutableMapEntry
                r23 = r5
                java.lang.Object[] r5 = r15.keys
                r18 = r6
                java.lang.Object[] r6 = r15.values
                r19 = r7
                int r7 = r3.getCurrent()
                r1.<init>(r5, r6, r7)
                r2.L$0 = r4
                r2.L$1 = r3
                r2.L$2 = r15
                r2.L$3 = r14
                r2.I$0 = r13
                r2.I$1 = r12
                r2.J$0 = r10
                r2.I$2 = r9
                r2.I$3 = r8
                r5 = 1
                r2.label = r5
                java.lang.Object r1 = r4.yield(r1, r2)
                if (r1 != r0) goto L_0x00ce
                return r0
            L_0x00ce:
                r5 = r23
                r6 = r18
                r7 = r19
            L_0x00d4:
                goto L_0x00d9
            L_0x00d5:
                r23 = r5
                r18 = r6
            L_0x00d9:
                long r10 = r10 >> r16
                r17 = 1
                int r8 = r8 + 1
                goto L_0x0084
            L_0x00e1:
                r23 = r5
                r18 = r6
                r17 = 1
                r1 = r16
                if (r9 != r1) goto L_0x00f5
                r6 = r3
                r10 = r12
                r9 = r13
                r5 = r14
                r7 = r15
                r8 = r18
                r3 = r23
                goto L_0x00fe
            L_0x00f5:
                r5 = r23
                goto L_0x0109
            L_0x00f8:
                r1 = r16
                r17 = 1
                r0 = r23
            L_0x00fe:
                if (r10 == r9) goto L_0x0108
                int r10 = r10 + 1
                r16 = r1
                r1 = r22
                goto L_0x0058
            L_0x0108:
                r5 = r3
            L_0x0109:
                kotlin.Unit r0 = kotlin.Unit.INSTANCE
                return r0
            */
            throw new UnsupportedOperationException("Method not decompiled: androidx.collection.MutableScatterMap$MutableMapWrapper$entries$1$iterator$1.AnonymousClass1.invokeSuspend(java.lang.Object):java.lang.Object");
        }
    }

    public boolean hasNext() {
        return this.iterator.hasNext();
    }

    public Map.Entry<K, V> next() {
        return (Map.Entry) this.iterator.next();
    }

    public void remove() {
        if (this.current != -1) {
            this.this$0.removeValueAt(this.current);
            this.current = -1;
        }
    }
}
