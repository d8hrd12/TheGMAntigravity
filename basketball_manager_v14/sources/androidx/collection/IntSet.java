package androidx.collection;

import java.util.NoSuchElementException;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.internal.DefaultConstructorMarker;
import kotlin.jvm.internal.Intrinsics;

@Metadata(d1 = {"\u0000R\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\b\n\u0002\b\u0005\n\u0002\u0010\u0015\n\u0002\b\u0002\n\u0002\u0010\u0016\n\u0002\b\u0004\n\u0002\u0010\u000b\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u000b\n\u0002\u0010\u0002\n\u0002\b\u0007\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010\r\n\u0002\b\u0007\n\u0002\u0018\u0002\n\u0000\b6\u0018\u00002\u00020\u0001B\u0007\b\u0004¢\u0006\u0002\u0010\u0002J:\u0010\u0011\u001a\u00020\u00122!\u0010\u0013\u001a\u001d\u0012\u0013\u0012\u00110\u0004¢\u0006\f\b\u0015\u0012\b\b\u0016\u0012\u0004\b\b(\u0017\u0012\u0004\u0012\u00020\u00120\u0014H\bø\u0001\u0000\u0002\b\n\u0006\b\u0001\u0012\u0002\u0010\u0001J\u0006\u0010\u0018\u001a\u00020\u0012J:\u0010\u0018\u001a\u00020\u00122!\u0010\u0013\u001a\u001d\u0012\u0013\u0012\u00110\u0004¢\u0006\f\b\u0015\u0012\b\b\u0016\u0012\u0004\b\b(\u0017\u0012\u0004\u0012\u00020\u00120\u0014H\bø\u0001\u0000\u0002\b\n\u0006\b\u0001\u0012\u0002\u0010\u0001J\u0011\u0010\u0019\u001a\u00020\u00122\u0006\u0010\u0017\u001a\u00020\u0004H\u0002J\b\u0010\u001a\u001a\u00020\u0004H\u0007J:\u0010\u001a\u001a\u00020\u00042!\u0010\u0013\u001a\u001d\u0012\u0013\u0012\u00110\u0004¢\u0006\f\b\u0015\u0012\b\b\u0016\u0012\u0004\b\b(\u0017\u0012\u0004\u0012\u00020\u00120\u0014H\bø\u0001\u0000\u0002\b\n\u0006\b\u0001\u0012\u0002\u0010\u0001J\u0013\u0010\u001b\u001a\u00020\u00122\b\u0010\u001c\u001a\u0004\u0018\u00010\u0001H\u0002J\u0016\u0010\u001d\u001a\u00020\u00042\u0006\u0010\u0017\u001a\u00020\u0004H\b¢\u0006\u0002\b\u001eJ\t\u0010\u001f\u001a\u00020\u0004H\bJ:\u0010\u001f\u001a\u00020\u00042!\u0010\u0013\u001a\u001d\u0012\u0013\u0012\u00110\u0004¢\u0006\f\b\u0015\u0012\b\b\u0016\u0012\u0004\b\b(\u0017\u0012\u0004\u0012\u00020\u00120\u0014H\bø\u0001\u0000\u0002\b\n\u0006\b\u0001\u0012\u0002\u0010\u0001J:\u0010 \u001a\u00020!2!\u0010\"\u001a\u001d\u0012\u0013\u0012\u00110\u0004¢\u0006\f\b\u0015\u0012\b\b\u0016\u0012\u0004\b\b(\u0017\u0012\u0004\u0012\u00020!0\u0014H\bø\u0001\u0000\u0002\b\n\u0006\b\u0001\u0012\u0002\u0010\u0001J:\u0010#\u001a\u00020!2!\u0010\"\u001a\u001d\u0012\u0013\u0012\u00110\u0004¢\u0006\f\b\u0015\u0012\b\b\u0016\u0012\u0004\b\b($\u0012\u0004\u0012\u00020!0\u0014H\bø\u0001\u0000\u0002\b\n\u0006\b\u0001\u0012\u0002\u0010\u0001J\b\u0010%\u001a\u00020\u0004H\u0016J\u0006\u0010&\u001a\u00020\u0012J\u0006\u0010'\u001a\u00020\u0012J:\u0010(\u001a\u00020)2\b\b\u0002\u0010*\u001a\u00020+2\b\b\u0002\u0010,\u001a\u00020+2\b\b\u0002\u0010-\u001a\u00020+2\b\b\u0002\u0010.\u001a\u00020\u00042\b\b\u0002\u0010/\u001a\u00020+H\u0007JT\u0010(\u001a\u00020)2\b\b\u0002\u0010*\u001a\u00020+2\b\b\u0002\u0010,\u001a\u00020+2\b\b\u0002\u0010-\u001a\u00020+2\b\b\u0002\u0010.\u001a\u00020\u00042\b\b\u0002\u0010/\u001a\u00020+2\u0014\b\u0004\u00100\u001a\u000e\u0012\u0004\u0012\u00020\u0004\u0012\u0004\u0012\u00020+0\u0014H\bø\u0001\u0000J\u0006\u00101\u001a\u00020\u0012J\b\u00102\u001a\u00020)H\u0016R\u0012\u0010\u0003\u001a\u00020\u00048\u0000@\u0000X\u000e¢\u0006\u0002\n\u0000R\u0012\u0010\u0005\u001a\u00020\u00048\u0000@\u0000X\u000e¢\u0006\u0002\n\u0000R\u0011\u0010\u0006\u001a\u00020\u00048G¢\u0006\u0006\u001a\u0004\b\u0007\u0010\bR\u0018\u0010\t\u001a\u00020\n8\u0000@\u0000X\u000e¢\u0006\b\n\u0000\u0012\u0004\b\u000b\u0010\u0002R\u0018\u0010\f\u001a\u00020\r8\u0000@\u0000X\u000e¢\u0006\b\n\u0000\u0012\u0004\b\u000e\u0010\u0002R\u0011\u0010\u000f\u001a\u00020\u00048G¢\u0006\u0006\u001a\u0004\b\u0010\u0010\b\u0001\u00013\u0002\u0007\n\u0005\b20\u0001¨\u00064"}, d2 = {"Landroidx/collection/IntSet;", "", "()V", "_capacity", "", "_size", "capacity", "getCapacity", "()I", "elements", "", "getElements$annotations", "metadata", "", "getMetadata$annotations", "size", "getSize", "all", "", "predicate", "Lkotlin/Function1;", "Lkotlin/ParameterName;", "name", "element", "any", "contains", "count", "equals", "other", "findElementIndex", "findElementIndex$collection", "first", "forEach", "", "block", "forEachIndex", "index", "hashCode", "isEmpty", "isNotEmpty", "joinToString", "", "separator", "", "prefix", "postfix", "limit", "truncated", "transform", "none", "toString", "Landroidx/collection/MutableIntSet;", "collection"}, k = 1, mv = {1, 8, 0}, xi = 48)
/* compiled from: IntSet.kt */
public abstract class IntSet {
    public int _capacity;
    public int _size;
    public int[] elements;
    public long[] metadata;

    public /* synthetic */ IntSet(DefaultConstructorMarker defaultConstructorMarker) {
        this();
    }

    public static /* synthetic */ void getElements$annotations() {
    }

    public static /* synthetic */ void getMetadata$annotations() {
    }

    public final String joinToString() {
        return joinToString$default(this, (CharSequence) null, (CharSequence) null, (CharSequence) null, 0, (CharSequence) null, 31, (Object) null);
    }

    public final String joinToString(CharSequence charSequence) {
        Intrinsics.checkNotNullParameter(charSequence, "separator");
        return joinToString$default(this, charSequence, (CharSequence) null, (CharSequence) null, 0, (CharSequence) null, 30, (Object) null);
    }

    public final String joinToString(CharSequence charSequence, CharSequence charSequence2) {
        Intrinsics.checkNotNullParameter(charSequence, "separator");
        Intrinsics.checkNotNullParameter(charSequence2, "prefix");
        return joinToString$default(this, charSequence, charSequence2, (CharSequence) null, 0, (CharSequence) null, 28, (Object) null);
    }

    public final String joinToString(CharSequence charSequence, CharSequence charSequence2, CharSequence charSequence3) {
        Intrinsics.checkNotNullParameter(charSequence, "separator");
        Intrinsics.checkNotNullParameter(charSequence2, "prefix");
        Intrinsics.checkNotNullParameter(charSequence3, "postfix");
        return joinToString$default(this, charSequence, charSequence2, charSequence3, 0, (CharSequence) null, 24, (Object) null);
    }

    public final String joinToString(CharSequence charSequence, CharSequence charSequence2, CharSequence charSequence3, int i) {
        Intrinsics.checkNotNullParameter(charSequence, "separator");
        Intrinsics.checkNotNullParameter(charSequence2, "prefix");
        Intrinsics.checkNotNullParameter(charSequence3, "postfix");
        return joinToString$default(this, charSequence, charSequence2, charSequence3, i, (CharSequence) null, 16, (Object) null);
    }

    private IntSet() {
        this.metadata = ScatterMapKt.EmptyGroup;
        this.elements = IntSetKt.getEmptyIntArray();
    }

    public final int getCapacity() {
        return this._capacity;
    }

    public final int getSize() {
        return this._size;
    }

    public final boolean any() {
        return this._size != 0;
    }

    public final boolean none() {
        return this._size == 0;
    }

    public final boolean isEmpty() {
        return this._size == 0;
    }

    public final boolean isNotEmpty() {
        return this._size != 0;
    }

    public final int first() {
        int[] k$iv = this.elements;
        long[] m$iv$iv = this.metadata;
        int lastIndex$iv$iv = m$iv$iv.length - 2;
        int i$iv$iv = 0;
        if (0 <= lastIndex$iv$iv) {
            while (true) {
                long slot$iv$iv = m$iv$iv[i$iv$iv];
                long $this$maskEmptyOrDeleted$iv$iv$iv = slot$iv$iv;
                if ((((~$this$maskEmptyOrDeleted$iv$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int bitCount$iv$iv = 8 - ((~(i$iv$iv - lastIndex$iv$iv)) >>> 31);
                    for (int j$iv$iv = 0; j$iv$iv < bitCount$iv$iv; j$iv$iv++) {
                        if ((255 & slot$iv$iv) < 128) {
                            return k$iv[(i$iv$iv << 3) + j$iv$iv];
                        }
                        slot$iv$iv >>= 8;
                    }
                    if (bitCount$iv$iv != 8) {
                        break;
                    }
                }
                if (i$iv$iv == lastIndex$iv$iv) {
                    break;
                }
                i$iv$iv++;
            }
        }
        throw new NoSuchElementException("The IntSet is empty");
    }

    public final int first(Function1<? super Integer, Boolean> predicate) {
        int i;
        Function1<? super Integer, Boolean> function1 = predicate;
        Intrinsics.checkNotNullParameter(function1, "predicate");
        int $i$f$first = 0;
        IntSet this_$iv = this;
        int[] k$iv = this_$iv.elements;
        long[] m$iv$iv = this_$iv.metadata;
        int lastIndex$iv$iv = m$iv$iv.length - 2;
        int i$iv$iv = 0;
        if (0 <= lastIndex$iv$iv) {
            while (true) {
                long slot$iv$iv = m$iv$iv[i$iv$iv];
                long $this$maskEmptyOrDeleted$iv$iv$iv = slot$iv$iv;
                int $i$f$first2 = $i$f$first;
                IntSet this_$iv2 = this_$iv;
                if ((((~$this$maskEmptyOrDeleted$iv$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int i2 = 8;
                    int bitCount$iv$iv = 8 - ((~(i$iv$iv - lastIndex$iv$iv)) >>> 31);
                    int j$iv$iv = 0;
                    while (j$iv$iv < bitCount$iv$iv) {
                        if ((255 & slot$iv$iv) < 128) {
                            int it = k$iv[(i$iv$iv << 3) + j$iv$iv];
                            i = i2;
                            if (function1.invoke(Integer.valueOf(it)).booleanValue()) {
                                return it;
                            }
                        } else {
                            i = i2;
                        }
                        slot$iv$iv >>= i;
                        j$iv$iv++;
                        i2 = i;
                    }
                    int i3 = i2;
                    if (bitCount$iv$iv != i2) {
                        break;
                    }
                }
                if (i$iv$iv == lastIndex$iv$iv) {
                    break;
                }
                i$iv$iv++;
                $i$f$first = $i$f$first2;
                this_$iv = this_$iv2;
            }
        } else {
            IntSet intSet = this_$iv;
        }
        throw new NoSuchElementException("Could not find a match");
    }

    public final void forEachIndex(Function1<? super Integer, Unit> block) {
        Intrinsics.checkNotNullParameter(block, "block");
        long[] m = this.metadata;
        int lastIndex = m.length - 2;
        int i = 0;
        if (0 <= lastIndex) {
            while (true) {
                long slot = m[i];
                long $this$maskEmptyOrDeleted$iv = slot;
                if ((((~$this$maskEmptyOrDeleted$iv) << 7) & $this$maskEmptyOrDeleted$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int bitCount = 8 - ((~(i - lastIndex)) >>> 31);
                    for (int j = 0; j < bitCount; j++) {
                        if ((255 & slot) < 128) {
                            block.invoke(Integer.valueOf((i << 3) + j));
                        }
                        slot >>= 8;
                    }
                    if (bitCount != 8) {
                        return;
                    }
                }
                if (i != lastIndex) {
                    i++;
                } else {
                    return;
                }
            }
        }
    }

    public final void forEach(Function1<? super Integer, Unit> block) {
        int i;
        Function1<? super Integer, Unit> function1 = block;
        Intrinsics.checkNotNullParameter(function1, "block");
        int[] k = this.elements;
        long[] m$iv = this.metadata;
        int lastIndex$iv = m$iv.length - 2;
        int i$iv = 0;
        if (0 <= lastIndex$iv) {
            while (true) {
                long slot$iv = m$iv[i$iv];
                long $this$maskEmptyOrDeleted$iv$iv = slot$iv;
                if ((((~$this$maskEmptyOrDeleted$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int i2 = 8;
                    int bitCount$iv = 8 - ((~(i$iv - lastIndex$iv)) >>> 31);
                    int j$iv = 0;
                    while (j$iv < bitCount$iv) {
                        if ((255 & slot$iv) < 128) {
                            i = i2;
                            function1.invoke(Integer.valueOf(k[(i$iv << 3) + j$iv]));
                        } else {
                            i = i2;
                        }
                        slot$iv >>= i;
                        j$iv++;
                        i2 = i;
                    }
                    int i3 = i2;
                    if (bitCount$iv != i2) {
                        return;
                    }
                }
                if (i$iv != lastIndex$iv) {
                    i$iv++;
                } else {
                    return;
                }
            }
        }
    }

    public final boolean all(Function1<? super Integer, Boolean> predicate) {
        int i;
        Function1<? super Integer, Boolean> function1 = predicate;
        Intrinsics.checkNotNullParameter(function1, "predicate");
        int[] k$iv = this.elements;
        long[] m$iv$iv = this.metadata;
        int lastIndex$iv$iv = m$iv$iv.length - 2;
        int i$iv$iv = 0;
        if (0 > lastIndex$iv$iv) {
            return true;
        }
        while (true) {
            long slot$iv$iv = m$iv$iv[i$iv$iv];
            long $this$maskEmptyOrDeleted$iv$iv$iv = slot$iv$iv;
            long slot$iv$iv2 = slot$iv$iv;
            if ((((~$this$maskEmptyOrDeleted$iv$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                int i2 = 8;
                int bitCount$iv$iv = 8 - ((~(i$iv$iv - lastIndex$iv$iv)) >>> 31);
                int j$iv$iv = 0;
                while (j$iv$iv < bitCount$iv$iv) {
                    if ((slot$iv$iv2 & 255) < 128) {
                        i = i2;
                        if (!function1.invoke(Integer.valueOf(k$iv[(i$iv$iv << 3) + j$iv$iv])).booleanValue()) {
                            return false;
                        }
                    } else {
                        i = i2;
                    }
                    slot$iv$iv2 >>= i;
                    j$iv$iv++;
                    i2 = i;
                }
                int i3 = i2;
                if (bitCount$iv$iv != i2) {
                    return true;
                }
            }
            if (i$iv$iv == lastIndex$iv$iv) {
                return true;
            }
            i$iv$iv++;
        }
    }

    public final boolean any(Function1<? super Integer, Boolean> predicate) {
        int i;
        Function1<? super Integer, Boolean> function1 = predicate;
        Intrinsics.checkNotNullParameter(function1, "predicate");
        int[] k$iv = this.elements;
        long[] m$iv$iv = this.metadata;
        int lastIndex$iv$iv = m$iv$iv.length - 2;
        int i$iv$iv = 0;
        if (0 > lastIndex$iv$iv) {
            return false;
        }
        while (true) {
            long slot$iv$iv = m$iv$iv[i$iv$iv];
            long $this$maskEmptyOrDeleted$iv$iv$iv = slot$iv$iv;
            long slot$iv$iv2 = slot$iv$iv;
            if ((((~$this$maskEmptyOrDeleted$iv$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                int i2 = 8;
                int bitCount$iv$iv = 8 - ((~(i$iv$iv - lastIndex$iv$iv)) >>> 31);
                int j$iv$iv = 0;
                while (j$iv$iv < bitCount$iv$iv) {
                    if ((slot$iv$iv2 & 255) < 128) {
                        i = i2;
                        if (function1.invoke(Integer.valueOf(k$iv[(i$iv$iv << 3) + j$iv$iv])).booleanValue()) {
                            return true;
                        }
                    } else {
                        i = i2;
                    }
                    slot$iv$iv2 >>= i;
                    j$iv$iv++;
                    i2 = i;
                }
                int i3 = i2;
                if (bitCount$iv$iv != i2) {
                    return false;
                }
            }
            if (i$iv$iv == lastIndex$iv$iv) {
                return false;
            }
            i$iv$iv++;
        }
    }

    public final int count() {
        return this._size;
    }

    public final int count(Function1<? super Integer, Boolean> predicate) {
        int i;
        Function1<? super Integer, Boolean> function1 = predicate;
        Intrinsics.checkNotNullParameter(function1, "predicate");
        int $i$f$count = 0;
        int count = 0;
        int[] k$iv = this.elements;
        long[] m$iv$iv = this.metadata;
        int lastIndex$iv$iv = m$iv$iv.length - 2;
        int i$iv$iv = 0;
        if (0 <= lastIndex$iv$iv) {
            while (true) {
                long slot$iv$iv = m$iv$iv[i$iv$iv];
                long $this$maskEmptyOrDeleted$iv$iv$iv = slot$iv$iv;
                int $i$f$count2 = $i$f$count;
                int count2 = count;
                if ((((~$this$maskEmptyOrDeleted$iv$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int i2 = 8;
                    int bitCount$iv$iv = 8 - ((~(i$iv$iv - lastIndex$iv$iv)) >>> 31);
                    int j$iv$iv = 0;
                    while (j$iv$iv < bitCount$iv$iv) {
                        if ((255 & slot$iv$iv) < 128) {
                            i = i2;
                            if (function1.invoke(Integer.valueOf(k$iv[(i$iv$iv << 3) + j$iv$iv])).booleanValue()) {
                                count2++;
                            }
                        } else {
                            i = i2;
                        }
                        slot$iv$iv >>= i;
                        j$iv$iv++;
                        i2 = i;
                    }
                    int i3 = i2;
                    if (bitCount$iv$iv != i2) {
                        return count2;
                    }
                    count = count2;
                } else {
                    count = count2;
                }
                if (i$iv$iv == lastIndex$iv$iv) {
                    break;
                }
                i$iv$iv++;
                $i$f$count = $i$f$count2;
            }
        }
        return count;
    }

    /* JADX WARNING: Code restructure failed: missing block: B:10:0x0087, code lost:
        r9 = r25;
        r7 = r17;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:11:0x0098, code lost:
        if (((((~r7) << 6) & r7) & -9187201950435737472L) == 0) goto L_0x00a1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:12:0x009a, code lost:
        r7 = -1;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final boolean contains(int r25) {
        /*
            r24 = this;
            r0 = r24
            r1 = 0
            r2 = 0
            int r3 = java.lang.Integer.hashCode(r25)
            r4 = -862048943(0xffffffffcc9e2d51, float:-8.2930312E7)
            int r3 = r3 * r4
            int r4 = r3 << 16
            r2 = r3 ^ r4
            r3 = 0
            r3 = r2 & 127(0x7f, float:1.78E-43)
            int r4 = r0._capacity
            r5 = 0
            int r5 = r2 >>> 7
            r5 = r5 & r4
            r6 = 0
        L_0x001c:
            long[] r7 = r0.metadata
            r8 = 0
            int r9 = r5 >> 3
            r10 = r5 & 7
            int r10 = r10 << 3
            r11 = r7[r9]
            long r11 = r11 >>> r10
            int r13 = r9 + 1
            r13 = r7[r13]
            int r15 = 64 - r10
            long r13 = r13 << r15
            r15 = r1
            r16 = r2
            long r1 = (long) r10
            long r1 = -r1
            r17 = 63
            long r1 = r1 >> r17
            long r1 = r1 & r13
            long r1 = r1 | r11
            r7 = r1
            r9 = 0
            long r10 = (long) r3
            r12 = 72340172838076673(0x101010101010101, double:7.748604185489348E-304)
            long r10 = r10 * r12
            long r10 = r10 ^ r7
            long r12 = r10 - r12
            r17 = r1
            long r1 = ~r10
            long r1 = r1 & r12
            r12 = -9187201950435737472(0x8080808080808080, double:-2.937446524422997E-306)
            long r1 = r1 & r12
        L_0x0053:
            r7 = r1
            r9 = 0
            r10 = 0
            int r14 = (r7 > r10 ? 1 : (r7 == r10 ? 0 : -1))
            r19 = 0
            r20 = 1
            if (r14 == 0) goto L_0x0062
            r7 = r20
            goto L_0x0064
        L_0x0062:
            r7 = r19
        L_0x0064:
            if (r7 == 0) goto L_0x0087
            r7 = r1
            r9 = 0
            r10 = r7
            r14 = 0
            int r21 = java.lang.Long.numberOfTrailingZeros(r10)
            int r10 = r21 >> 3
            int r10 = r10 + r5
            r7 = r10 & r4
            int[] r8 = r0.elements
            r8 = r8[r7]
            r9 = r25
            if (r8 != r9) goto L_0x007d
            goto L_0x009c
        L_0x007d:
            r10 = r1
            r8 = 0
            r19 = 1
            long r19 = r10 - r19
            long r10 = r10 & r19
            r1 = r10
            goto L_0x0053
        L_0x0087:
            r9 = r25
            r7 = r17
            r14 = 0
            r21 = r10
            long r10 = ~r7
            r23 = 6
            long r10 = r10 << r23
            long r10 = r10 & r7
            long r7 = r10 & r12
            int r7 = (r7 > r21 ? 1 : (r7 == r21 ? 0 : -1))
            if (r7 == 0) goto L_0x00a1
            r7 = -1
        L_0x009c:
            if (r7 < 0) goto L_0x00a0
            r19 = r20
        L_0x00a0:
            return r19
        L_0x00a1:
            int r6 = r6 + 8
            int r7 = r5 + r6
            r5 = r7 & r4
            r1 = r15
            r2 = r16
            goto L_0x001c
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.collection.IntSet.contains(int):boolean");
    }

    public static /* synthetic */ String joinToString$default(IntSet intSet, CharSequence charSequence, CharSequence charSequence2, CharSequence charSequence3, int i, CharSequence charSequence4, int i2, Object obj) {
        CharSequence charSequence5;
        if (obj == null) {
            if ((i2 & 1) != 0) {
            }
            if ((i2 & 2) != 0) {
                charSequence2 = "";
            }
            if ((i2 & 4) != 0) {
                charSequence3 = "";
            }
            if ((i2 & 8) != 0) {
                i = -1;
            }
            if ((i2 & 16) == 0) {
                charSequence5 = charSequence4;
            }
            int i3 = i;
            CharSequence charSequence6 = charSequence2;
            return intSet.joinToString(charSequence, charSequence6, charSequence3, i3, charSequence5);
        }
        throw new UnsupportedOperationException("Super calls with default arguments not supported in this target, function: joinToString");
    }

    public final String joinToString(CharSequence separator, CharSequence prefix, CharSequence postfix, int limit, CharSequence truncated) {
        int i;
        CharSequence charSequence = separator;
        CharSequence charSequence2 = prefix;
        CharSequence charSequence3 = postfix;
        CharSequence charSequence4 = truncated;
        Intrinsics.checkNotNullParameter(charSequence, "separator");
        Intrinsics.checkNotNullParameter(charSequence2, "prefix");
        Intrinsics.checkNotNullParameter(charSequence3, "postfix");
        Intrinsics.checkNotNullParameter(charSequence4, "truncated");
        StringBuilder sb = new StringBuilder();
        StringBuilder $this$joinToString_u24lambda_u2413 = sb;
        int i2 = 0;
        $this$joinToString_u24lambda_u2413.append(charSequence2);
        int index = 0;
        IntSet this_$iv = this;
        int $i$f$forEach = 0;
        int[] k$iv = this_$iv.elements;
        long[] m$iv$iv = this_$iv.metadata;
        int lastIndex$iv$iv = m$iv$iv.length - 2;
        int i$iv$iv = 0;
        if (0 <= lastIndex$iv$iv) {
            loop0:
            while (true) {
                long slot$iv$iv = m$iv$iv[i$iv$iv];
                int i3 = i2;
                int index2 = index;
                long $this$maskEmptyOrDeleted$iv$iv$iv = slot$iv$iv;
                IntSet this_$iv2 = this_$iv;
                int $i$f$forEach2 = $i$f$forEach;
                if ((((~$this$maskEmptyOrDeleted$iv$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int i4 = 8;
                    int bitCount$iv$iv = 8 - ((~(i$iv$iv - lastIndex$iv$iv)) >>> 31);
                    int j$iv$iv = 0;
                    int index3 = index2;
                    while (j$iv$iv < bitCount$iv$iv) {
                        if ((slot$iv$iv & 255) < 128) {
                            i = i4;
                            int element = k$iv[(i$iv$iv << 3) + j$iv$iv];
                            if (index3 == limit) {
                                $this$joinToString_u24lambda_u2413.append(charSequence4);
                                break loop0;
                            }
                            if (index3 != 0) {
                                $this$joinToString_u24lambda_u2413.append(charSequence);
                            }
                            $this$joinToString_u24lambda_u2413.append(element);
                            index3++;
                        } else {
                            int i5 = limit;
                            i = i4;
                        }
                        slot$iv$iv >>= i;
                        j$iv$iv++;
                        CharSequence charSequence5 = prefix;
                        i4 = i;
                    }
                    int i6 = limit;
                    int i7 = i4;
                    if (bitCount$iv$iv != i4) {
                        break;
                    }
                    index = index3;
                } else {
                    int i8 = limit;
                    index = index2;
                }
                if (i$iv$iv == lastIndex$iv$iv) {
                    break;
                }
                i$iv$iv++;
                CharSequence charSequence6 = prefix;
                this_$iv = this_$iv2;
                $i$f$forEach = $i$f$forEach2;
                i2 = i3;
            }
        } else {
            int i9 = limit;
            IntSet intSet = this_$iv;
        }
        int i10 = index;
        $this$joinToString_u24lambda_u2413.append(charSequence3);
        String sb2 = sb.toString();
        Intrinsics.checkNotNullExpressionValue(sb2, "StringBuilder().apply(builderAction).toString()");
        return sb2;
    }

    public static /* synthetic */ String joinToString$default(IntSet $this, CharSequence separator, CharSequence prefix, CharSequence postfix, int limit, CharSequence truncated, Function1 transform, int i, Object obj) {
        CharSequence separator2;
        int limit2;
        CharSequence truncated2;
        int i2;
        Function1 function1 = transform;
        if (obj == null) {
            if ((i & 1) == 0) {
                separator2 = separator;
            }
            String prefix2 = (i & 2) != 0 ? "" : prefix;
            String postfix2 = (i & 4) != 0 ? "" : postfix;
            if ((i & 8) != 0) {
                limit2 = -1;
            } else {
                limit2 = limit;
            }
            if ((i & 16) == 0) {
                truncated2 = truncated;
            }
            Intrinsics.checkNotNullParameter(separator2, "separator");
            Intrinsics.checkNotNullParameter(prefix2, "prefix");
            Intrinsics.checkNotNullParameter(postfix2, "postfix");
            Intrinsics.checkNotNullParameter(truncated2, "truncated");
            Intrinsics.checkNotNullParameter(function1, "transform");
            StringBuilder sb = new StringBuilder();
            StringBuilder $this$joinToString_u24lambda_u2415 = sb;
            int i3 = 0;
            $this$joinToString_u24lambda_u2415.append(prefix2);
            int index = 0;
            IntSet this_$iv = $this;
            int $i$f$forEach = 0;
            int[] k$iv = this_$iv.elements;
            CharSequence charSequence = prefix2;
            long[] m$iv$iv = this_$iv.metadata;
            int lastIndex$iv$iv = m$iv$iv.length - 2;
            long[] m$iv$iv2 = m$iv$iv;
            int i$iv$iv = 0;
            if (0 <= lastIndex$iv$iv) {
                loop0:
                while (true) {
                    long slot$iv$iv = m$iv$iv2[i$iv$iv];
                    int i4 = i3;
                    int index2 = index;
                    long $this$maskEmptyOrDeleted$iv$iv$iv = slot$iv$iv;
                    IntSet this_$iv2 = this_$iv;
                    int $i$f$forEach2 = $i$f$forEach;
                    if ((((~$this$maskEmptyOrDeleted$iv$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                        int i5 = 8;
                        int bitCount$iv$iv = 8 - ((~(i$iv$iv - lastIndex$iv$iv)) >>> 31);
                        int j$iv$iv = 0;
                        int index3 = index2;
                        while (j$iv$iv < bitCount$iv$iv) {
                            if ((slot$iv$iv & 255) < 128) {
                                int element = k$iv[(i$iv$iv << 3) + j$iv$iv];
                                if (index3 == limit2) {
                                    $this$joinToString_u24lambda_u2415.append(truncated2);
                                    break loop0;
                                }
                                if (index3 != 0) {
                                    $this$joinToString_u24lambda_u2415.append(separator2);
                                }
                                i2 = i5;
                                $this$joinToString_u24lambda_u2415.append((CharSequence) function1.invoke(Integer.valueOf(element)));
                                index3++;
                            } else {
                                i2 = i5;
                            }
                            slot$iv$iv >>= i2;
                            j$iv$iv++;
                            i5 = i2;
                        }
                        int i6 = i5;
                        if (bitCount$iv$iv != i5) {
                            break;
                        }
                        index = index3;
                    } else {
                        index = index2;
                    }
                    if (i$iv$iv == lastIndex$iv$iv) {
                        break;
                    }
                    i$iv$iv++;
                    this_$iv = this_$iv2;
                    $i$f$forEach = $i$f$forEach2;
                    i3 = i4;
                }
            } else {
                IntSet intSet = this_$iv;
            }
            int i7 = index;
            $this$joinToString_u24lambda_u2415.append(postfix2);
            String sb2 = sb.toString();
            Intrinsics.checkNotNullExpressionValue(sb2, "StringBuilder().apply(builderAction).toString()");
            return sb2;
        }
        throw new UnsupportedOperationException("Super calls with default arguments not supported in this target, function: joinToString");
    }

    public final String joinToString(CharSequence separator, CharSequence prefix, CharSequence postfix, int limit, CharSequence truncated, Function1<? super Integer, ? extends CharSequence> transform) {
        int index;
        int i;
        CharSequence charSequence = separator;
        CharSequence charSequence2 = prefix;
        CharSequence charSequence3 = postfix;
        CharSequence charSequence4 = truncated;
        Function1<? super Integer, ? extends CharSequence> function1 = transform;
        Intrinsics.checkNotNullParameter(charSequence, "separator");
        Intrinsics.checkNotNullParameter(charSequence2, "prefix");
        Intrinsics.checkNotNullParameter(charSequence3, "postfix");
        Intrinsics.checkNotNullParameter(charSequence4, "truncated");
        Intrinsics.checkNotNullParameter(function1, "transform");
        StringBuilder sb = new StringBuilder();
        StringBuilder $this$joinToString_u24lambda_u2415 = sb;
        int i2 = 0;
        $this$joinToString_u24lambda_u2415.append(charSequence2);
        int index2 = 0;
        IntSet this_$iv = this;
        int $i$f$forEach = 0;
        int[] k$iv = this_$iv.elements;
        long[] m$iv$iv = this_$iv.metadata;
        int lastIndex$iv$iv = m$iv$iv.length - 2;
        int i$iv$iv = 0;
        if (0 <= lastIndex$iv$iv) {
            loop0:
            while (true) {
                long slot$iv$iv = m$iv$iv[i$iv$iv];
                int i3 = i2;
                int index3 = index2;
                long $this$maskEmptyOrDeleted$iv$iv$iv = slot$iv$iv;
                IntSet this_$iv2 = this_$iv;
                int $i$f$forEach2 = $i$f$forEach;
                if ((((~$this$maskEmptyOrDeleted$iv$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int i4 = 8;
                    int bitCount$iv$iv = 8 - ((~(i$iv$iv - lastIndex$iv$iv)) >>> 31);
                    int j$iv$iv = 0;
                    index = index3;
                    while (j$iv$iv < bitCount$iv$iv) {
                        if ((slot$iv$iv & 255) < 128) {
                            int element = k$iv[(i$iv$iv << 3) + j$iv$iv];
                            i = i4;
                            if (index == limit) {
                                $this$joinToString_u24lambda_u2415.append(charSequence4);
                                break loop0;
                            }
                            if (index != 0) {
                                $this$joinToString_u24lambda_u2415.append(charSequence);
                            }
                            $this$joinToString_u24lambda_u2415.append((CharSequence) function1.invoke(Integer.valueOf(element)));
                            index++;
                        } else {
                            i = i4;
                            int i5 = limit;
                        }
                        slot$iv$iv >>= i;
                        j$iv$iv++;
                        charSequence = separator;
                        i4 = i;
                    }
                    int i6 = i4;
                    int i7 = limit;
                    if (bitCount$iv$iv != i6) {
                        break;
                    }
                } else {
                    int i8 = limit;
                    index = index3;
                }
                if (i$iv$iv == lastIndex$iv$iv) {
                    break;
                }
                i$iv$iv++;
                charSequence = separator;
                index2 = index;
                this_$iv = this_$iv2;
                $i$f$forEach = $i$f$forEach2;
                i2 = i3;
            }
            String sb2 = sb.toString();
            Intrinsics.checkNotNullExpressionValue(sb2, "StringBuilder().apply(builderAction).toString()");
            return sb2;
        }
        IntSet intSet = this_$iv;
        int index4 = limit;
        $this$joinToString_u24lambda_u2415.append(charSequence3);
        String sb22 = sb.toString();
        Intrinsics.checkNotNullExpressionValue(sb22, "StringBuilder().apply(builderAction).toString()");
        return sb22;
    }

    public int hashCode() {
        int hash = 0;
        int[] k$iv = this.elements;
        long[] m$iv$iv = this.metadata;
        int lastIndex$iv$iv = m$iv$iv.length - 2;
        int i$iv$iv = 0;
        if (0 <= lastIndex$iv$iv) {
            while (true) {
                long slot$iv$iv = m$iv$iv[i$iv$iv];
                long $this$maskEmptyOrDeleted$iv$iv$iv = slot$iv$iv;
                if ((((~$this$maskEmptyOrDeleted$iv$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int bitCount$iv$iv = 8 - ((~(i$iv$iv - lastIndex$iv$iv)) >>> 31);
                    for (int j$iv$iv = 0; j$iv$iv < bitCount$iv$iv; j$iv$iv++) {
                        if ((255 & slot$iv$iv) < 128) {
                            hash += Integer.hashCode(k$iv[(i$iv$iv << 3) + j$iv$iv]);
                        }
                        slot$iv$iv >>= 8;
                    }
                    if (bitCount$iv$iv != 8) {
                        break;
                    }
                }
                if (i$iv$iv == lastIndex$iv$iv) {
                    break;
                }
                i$iv$iv++;
            }
        }
        return hash;
    }

    /* JADX WARNING: type inference failed for: r24v0, types: [java.lang.Object] */
    /* JADX WARNING: Unknown variable types count: 1 */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public boolean equals(java.lang.Object r24) {
        /*
            r23 = this;
            r0 = r23
            r1 = r24
            r2 = 1
            if (r1 != r0) goto L_0x0008
            return r2
        L_0x0008:
            boolean r3 = r1 instanceof androidx.collection.IntSet
            r4 = 0
            if (r3 != 0) goto L_0x000e
            return r4
        L_0x000e:
            r3 = r1
            androidx.collection.IntSet r3 = (androidx.collection.IntSet) r3
            int r3 = r3._size
            int r5 = r0._size
            if (r3 == r5) goto L_0x0018
            return r4
        L_0x0018:
            r3 = r23
            r5 = 0
            int[] r6 = r3.elements
            r7 = r3
            r8 = 0
            long[] r9 = r7.metadata
            int r10 = r9.length
            int r10 = r10 + -2
            r11 = 0
            if (r11 > r10) goto L_0x009e
        L_0x0029:
            r12 = r9[r11]
            r14 = r12
            r16 = 0
            r17 = r2
            r18 = r3
            long r2 = ~r14
            r19 = 7
            long r2 = r2 << r19
            long r2 = r2 & r14
            r19 = -9187201950435737472(0x8080808080808080, double:-2.937446524422997E-306)
            long r2 = r2 & r19
            int r2 = (r2 > r19 ? 1 : (r2 == r19 ? 0 : -1))
            if (r2 == 0) goto L_0x0091
            int r2 = r11 - r10
            int r2 = ~r2
            int r2 = r2 >>> 31
            r3 = 8
            int r2 = 8 - r2
            r14 = 0
        L_0x004d:
            if (r14 >= r2) goto L_0x008a
            r15 = 255(0xff, double:1.26E-321)
            long r15 = r15 & r12
            r19 = 0
            r20 = 128(0x80, double:6.32E-322)
            int r20 = (r15 > r20 ? 1 : (r15 == r20 ? 0 : -1))
            if (r20 >= 0) goto L_0x005d
            r15 = r17
            goto L_0x005e
        L_0x005d:
            r15 = r4
        L_0x005e:
            if (r15 == 0) goto L_0x007d
            int r15 = r11 << 3
            int r15 = r15 + r14
            r16 = r15
            r19 = 0
            r20 = r4
            r4 = r6[r16]
            r21 = 0
            r22 = r3
            r3 = r1
            androidx.collection.IntSet r3 = (androidx.collection.IntSet) r3
            boolean r3 = r3.contains(r4)
            if (r3 != 0) goto L_0x0079
            return r20
        L_0x0079:
            goto L_0x0081
        L_0x007d:
            r22 = r3
            r20 = r4
        L_0x0081:
            long r12 = r12 >> r22
            int r14 = r14 + 1
            r4 = r20
            r3 = r22
            goto L_0x004d
        L_0x008a:
            r22 = r3
            r20 = r4
            if (r2 != r3) goto L_0x00a3
            goto L_0x0093
        L_0x0091:
            r20 = r4
        L_0x0093:
            if (r11 == r10) goto L_0x00a2
            int r11 = r11 + 1
            r2 = r17
            r3 = r18
            r4 = r20
            goto L_0x0029
        L_0x009e:
            r17 = r2
            r18 = r3
        L_0x00a2:
        L_0x00a3:
            return r17
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.collection.IntSet.equals(java.lang.Object):boolean");
    }

    public String toString() {
        return joinToString$default(this, (CharSequence) null, "[", "]", 0, (CharSequence) null, 25, (Object) null);
    }

    /* JADX WARNING: Code restructure failed: missing block: B:11:0x0081, code lost:
        r9 = r23;
        r7 = r17;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:12:0x0092, code lost:
        if (((((~r7) << 6) & r7) & -9187201950435737472L) == 0) goto L_0x0097;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:13:0x0094, code lost:
        return -1;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final int findElementIndex$collection(int r23) {
        /*
            r22 = this;
            r0 = r22
            r1 = 0
            r2 = 0
            int r3 = java.lang.Integer.hashCode(r23)
            r4 = -862048943(0xffffffffcc9e2d51, float:-8.2930312E7)
            int r3 = r3 * r4
            int r4 = r3 << 16
            r2 = r3 ^ r4
            r3 = 0
            r3 = r2 & 127(0x7f, float:1.78E-43)
            int r4 = r0._capacity
            r5 = 0
            int r5 = r2 >>> 7
            r5 = r5 & r4
            r6 = 0
        L_0x001c:
            long[] r7 = r0.metadata
            r8 = 0
            int r9 = r5 >> 3
            r10 = r5 & 7
            int r10 = r10 << 3
            r11 = r7[r9]
            long r11 = r11 >>> r10
            int r13 = r9 + 1
            r13 = r7[r13]
            int r15 = 64 - r10
            long r13 = r13 << r15
            r15 = r1
            r16 = r2
            long r1 = (long) r10
            long r1 = -r1
            r17 = 63
            long r1 = r1 >> r17
            long r1 = r1 & r13
            long r1 = r1 | r11
            r7 = r1
            r9 = 0
            long r10 = (long) r3
            r12 = 72340172838076673(0x101010101010101, double:7.748604185489348E-304)
            long r10 = r10 * r12
            long r10 = r10 ^ r7
            long r12 = r10 - r12
            r17 = r1
            long r1 = ~r10
            long r1 = r1 & r12
            r12 = -9187201950435737472(0x8080808080808080, double:-2.937446524422997E-306)
            long r1 = r1 & r12
        L_0x0053:
            r7 = r1
            r9 = 0
            r10 = 0
            int r14 = (r7 > r10 ? 1 : (r7 == r10 ? 0 : -1))
            if (r14 == 0) goto L_0x005d
            r14 = 1
            goto L_0x005e
        L_0x005d:
            r14 = 0
        L_0x005e:
            if (r14 == 0) goto L_0x0081
            r7 = r1
            r9 = 0
            r10 = r7
            r14 = 0
            int r19 = java.lang.Long.numberOfTrailingZeros(r10)
            int r10 = r19 >> 3
            int r10 = r10 + r5
            r7 = r10 & r4
            int[] r8 = r0.elements
            r8 = r8[r7]
            r9 = r23
            if (r8 != r9) goto L_0x0077
            return r7
        L_0x0077:
            r10 = r1
            r8 = 0
            r19 = 1
            long r19 = r10 - r19
            long r10 = r10 & r19
            r1 = r10
            goto L_0x0053
        L_0x0081:
            r9 = r23
            r7 = r17
            r14 = 0
            r19 = r10
            long r10 = ~r7
            r21 = 6
            long r10 = r10 << r21
            long r10 = r10 & r7
            long r7 = r10 & r12
            int r7 = (r7 > r19 ? 1 : (r7 == r19 ? 0 : -1))
            if (r7 == 0) goto L_0x0097
            r1 = -1
            return r1
        L_0x0097:
            int r6 = r6 + 8
            int r7 = r5 + r6
            r5 = r7 & r4
            r1 = r15
            r2 = r16
            goto L_0x001c
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.collection.IntSet.findElementIndex$collection(int):int");
    }

    public final String joinToString(CharSequence separator, CharSequence prefix, CharSequence postfix, int limit, Function1<? super Integer, ? extends CharSequence> transform) {
        StringBuilder sb;
        int i;
        CharSequence charSequence = separator;
        CharSequence charSequence2 = prefix;
        CharSequence charSequence3 = postfix;
        Function1<? super Integer, ? extends CharSequence> function1 = transform;
        Intrinsics.checkNotNullParameter(charSequence, "separator");
        Intrinsics.checkNotNullParameter(charSequence2, "prefix");
        Intrinsics.checkNotNullParameter(charSequence3, "postfix");
        Intrinsics.checkNotNullParameter(function1, "transform");
        int $i$f$joinToString = 0;
        StringBuilder sb2 = new StringBuilder();
        StringBuilder $this$joinToString_u24lambda_u2415$iv = sb2;
        int i2 = 0;
        $this$joinToString_u24lambda_u2415$iv.append(charSequence2);
        int index$iv = 0;
        int[] k$iv$iv = this.elements;
        long[] m$iv$iv$iv = this.metadata;
        int lastIndex$iv$iv$iv = m$iv$iv$iv.length - 2;
        long[] m$iv$iv$iv2 = m$iv$iv$iv;
        int i$iv$iv$iv = 0;
        if (0 <= lastIndex$iv$iv$iv) {
            loop0:
            while (true) {
                long slot$iv$iv$iv = m$iv$iv$iv2[i$iv$iv$iv];
                int $i$f$joinToString2 = $i$f$joinToString;
                sb = sb2;
                long $this$maskEmptyOrDeleted$iv$iv$iv$iv = slot$iv$iv$iv;
                int i3 = i2;
                int index$iv2 = index$iv;
                if ((((~$this$maskEmptyOrDeleted$iv$iv$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int i4 = 8;
                    int bitCount$iv$iv$iv = 8 - ((~(i$iv$iv$iv - lastIndex$iv$iv$iv)) >>> 31);
                    int j$iv$iv$iv = 0;
                    index$iv = index$iv2;
                    while (j$iv$iv$iv < bitCount$iv$iv$iv) {
                        if ((slot$iv$iv$iv & 255) < 128) {
                            int element$iv = k$iv$iv[(i$iv$iv$iv << 3) + j$iv$iv$iv];
                            i = i4;
                            if (index$iv == limit) {
                                $this$joinToString_u24lambda_u2415$iv.append(truncated$iv);
                                break loop0;
                            }
                            if (index$iv != 0) {
                                $this$joinToString_u24lambda_u2415$iv.append(charSequence);
                            }
                            $this$joinToString_u24lambda_u2415$iv.append((CharSequence) function1.invoke(Integer.valueOf(element$iv)));
                            index$iv++;
                        } else {
                            i = i4;
                            int i5 = limit;
                        }
                        slot$iv$iv$iv >>= i;
                        j$iv$iv$iv++;
                        charSequence = separator;
                        i4 = i;
                    }
                    int i6 = i4;
                    int i7 = limit;
                    if (bitCount$iv$iv$iv != i6) {
                        break;
                    }
                } else {
                    int i8 = limit;
                    index$iv = index$iv2;
                }
                if (i$iv$iv$iv == lastIndex$iv$iv$iv) {
                    break;
                }
                i$iv$iv$iv++;
                charSequence = separator;
                i2 = i3;
                $i$f$joinToString = $i$f$joinToString2;
                sb2 = sb;
            }
            String sb3 = sb.toString();
            Intrinsics.checkNotNullExpressionValue(sb3, "StringBuilder().apply(builderAction).toString()");
            return sb3;
        }
        sb = sb2;
        int i9 = limit;
        $this$joinToString_u24lambda_u2415$iv.append(charSequence3);
        String sb32 = sb.toString();
        Intrinsics.checkNotNullExpressionValue(sb32, "StringBuilder().apply(builderAction).toString()");
        return sb32;
    }

    public final String joinToString(CharSequence separator, CharSequence prefix, CharSequence postfix, Function1<? super Integer, ? extends CharSequence> transform) {
        StringBuilder sb;
        int i;
        CharSequence charSequence = separator;
        CharSequence charSequence2 = prefix;
        CharSequence charSequence3 = postfix;
        Function1<? super Integer, ? extends CharSequence> function1 = transform;
        Intrinsics.checkNotNullParameter(charSequence, "separator");
        Intrinsics.checkNotNullParameter(charSequence2, "prefix");
        Intrinsics.checkNotNullParameter(charSequence3, "postfix");
        Intrinsics.checkNotNullParameter(function1, "transform");
        int $i$f$joinToString = 0;
        StringBuilder sb2 = new StringBuilder();
        StringBuilder $this$joinToString_u24lambda_u2415$iv = sb2;
        int i2 = 0;
        $this$joinToString_u24lambda_u2415$iv.append(charSequence2);
        int index$iv = 0;
        int[] k$iv$iv = this.elements;
        long[] m$iv$iv$iv = this.metadata;
        int lastIndex$iv$iv$iv = m$iv$iv$iv.length - 2;
        long[] m$iv$iv$iv2 = m$iv$iv$iv;
        int i$iv$iv$iv = 0;
        if (0 <= lastIndex$iv$iv$iv) {
            loop0:
            while (true) {
                long slot$iv$iv$iv = m$iv$iv$iv2[i$iv$iv$iv];
                int $i$f$joinToString2 = $i$f$joinToString;
                sb = sb2;
                long $this$maskEmptyOrDeleted$iv$iv$iv$iv = slot$iv$iv$iv;
                int i3 = i2;
                int index$iv2 = index$iv;
                if ((((~$this$maskEmptyOrDeleted$iv$iv$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int i4 = 8;
                    int bitCount$iv$iv$iv = 8 - ((~(i$iv$iv$iv - lastIndex$iv$iv$iv)) >>> 31);
                    int j$iv$iv$iv = 0;
                    index$iv = index$iv2;
                    while (j$iv$iv$iv < bitCount$iv$iv$iv) {
                        if ((slot$iv$iv$iv & 255) < 128) {
                            int element$iv = k$iv$iv[(i$iv$iv$iv << 3) + j$iv$iv$iv];
                            if (index$iv == -1) {
                                $this$joinToString_u24lambda_u2415$iv.append(truncated$iv);
                                break loop0;
                            }
                            if (index$iv != 0) {
                                $this$joinToString_u24lambda_u2415$iv.append(charSequence);
                            }
                            i = i4;
                            $this$joinToString_u24lambda_u2415$iv.append((CharSequence) function1.invoke(Integer.valueOf(element$iv)));
                            index$iv++;
                        } else {
                            i = i4;
                        }
                        slot$iv$iv$iv >>= i;
                        j$iv$iv$iv++;
                        i4 = i;
                    }
                    int i5 = i4;
                    if (bitCount$iv$iv$iv != i4) {
                        break;
                    }
                } else {
                    index$iv = index$iv2;
                }
                if (i$iv$iv$iv == lastIndex$iv$iv$iv) {
                    break;
                }
                i$iv$iv$iv++;
                i2 = i3;
                $i$f$joinToString = $i$f$joinToString2;
                sb2 = sb;
            }
        } else {
            sb = sb2;
        }
        $this$joinToString_u24lambda_u2415$iv.append(charSequence3);
        String sb3 = sb.toString();
        Intrinsics.checkNotNullExpressionValue(sb3, "StringBuilder().apply(builderAction).toString()");
        return sb3;
    }

    public final String joinToString(CharSequence separator, CharSequence prefix, Function1<? super Integer, ? extends CharSequence> transform) {
        StringBuilder sb;
        int i;
        CharSequence charSequence = separator;
        CharSequence charSequence2 = prefix;
        Function1<? super Integer, ? extends CharSequence> function1 = transform;
        Intrinsics.checkNotNullParameter(charSequence, "separator");
        Intrinsics.checkNotNullParameter(charSequence2, "prefix");
        Intrinsics.checkNotNullParameter(function1, "transform");
        int $i$f$joinToString = 0;
        StringBuilder sb2 = new StringBuilder();
        StringBuilder $this$joinToString_u24lambda_u2415$iv = sb2;
        int i2 = 0;
        $this$joinToString_u24lambda_u2415$iv.append(charSequence2);
        int index$iv = 0;
        int[] k$iv$iv = this.elements;
        long[] m$iv$iv$iv = this.metadata;
        int lastIndex$iv$iv$iv = m$iv$iv$iv.length - 2;
        long[] m$iv$iv$iv2 = m$iv$iv$iv;
        int i$iv$iv$iv = 0;
        if (0 <= lastIndex$iv$iv$iv) {
            loop0:
            while (true) {
                long slot$iv$iv$iv = m$iv$iv$iv2[i$iv$iv$iv];
                int $i$f$joinToString2 = $i$f$joinToString;
                sb = sb2;
                long $this$maskEmptyOrDeleted$iv$iv$iv$iv = slot$iv$iv$iv;
                int i3 = i2;
                int index$iv2 = index$iv;
                if ((((~$this$maskEmptyOrDeleted$iv$iv$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int i4 = 8;
                    int bitCount$iv$iv$iv = 8 - ((~(i$iv$iv$iv - lastIndex$iv$iv$iv)) >>> 31);
                    int j$iv$iv$iv = 0;
                    index$iv = index$iv2;
                    while (j$iv$iv$iv < bitCount$iv$iv$iv) {
                        if ((slot$iv$iv$iv & 255) < 128) {
                            int element$iv = k$iv$iv[(i$iv$iv$iv << 3) + j$iv$iv$iv];
                            if (index$iv == -1) {
                                $this$joinToString_u24lambda_u2415$iv.append(truncated$iv);
                                break loop0;
                            }
                            if (index$iv != 0) {
                                $this$joinToString_u24lambda_u2415$iv.append(charSequence);
                            }
                            i = i4;
                            $this$joinToString_u24lambda_u2415$iv.append((CharSequence) function1.invoke(Integer.valueOf(element$iv)));
                            index$iv++;
                        } else {
                            i = i4;
                        }
                        slot$iv$iv$iv >>= i;
                        j$iv$iv$iv++;
                        i4 = i;
                    }
                    int i5 = i4;
                    if (bitCount$iv$iv$iv != i4) {
                        break;
                    }
                } else {
                    index$iv = index$iv2;
                }
                if (i$iv$iv$iv == lastIndex$iv$iv$iv) {
                    break;
                }
                i$iv$iv$iv++;
                i2 = i3;
                $i$f$joinToString = $i$f$joinToString2;
                sb2 = sb;
            }
        } else {
            sb = sb2;
        }
        $this$joinToString_u24lambda_u2415$iv.append(postfix$iv);
        String sb3 = sb.toString();
        Intrinsics.checkNotNullExpressionValue(sb3, "StringBuilder().apply(builderAction).toString()");
        return sb3;
    }

    public final String joinToString(CharSequence separator, Function1<? super Integer, ? extends CharSequence> transform) {
        StringBuilder sb;
        int i;
        CharSequence charSequence = separator;
        Function1<? super Integer, ? extends CharSequence> function1 = transform;
        Intrinsics.checkNotNullParameter(charSequence, "separator");
        Intrinsics.checkNotNullParameter(function1, "transform");
        CharSequence prefix$iv = "";
        int $i$f$joinToString = 0;
        StringBuilder sb2 = new StringBuilder();
        StringBuilder $this$joinToString_u24lambda_u2415$iv = sb2;
        int i2 = 0;
        $this$joinToString_u24lambda_u2415$iv.append(prefix$iv);
        int index$iv = 0;
        int[] k$iv$iv = this.elements;
        long[] m$iv$iv$iv = this.metadata;
        CharSequence charSequence2 = prefix$iv;
        int lastIndex$iv$iv$iv = m$iv$iv$iv.length - 2;
        long[] m$iv$iv$iv2 = m$iv$iv$iv;
        int i$iv$iv$iv = 0;
        if (0 <= lastIndex$iv$iv$iv) {
            loop0:
            while (true) {
                long slot$iv$iv$iv = m$iv$iv$iv2[i$iv$iv$iv];
                int $i$f$joinToString2 = $i$f$joinToString;
                sb = sb2;
                long $this$maskEmptyOrDeleted$iv$iv$iv$iv = slot$iv$iv$iv;
                int i3 = i2;
                int index$iv2 = index$iv;
                if ((((~$this$maskEmptyOrDeleted$iv$iv$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int i4 = 8;
                    int bitCount$iv$iv$iv = 8 - ((~(i$iv$iv$iv - lastIndex$iv$iv$iv)) >>> 31);
                    int j$iv$iv$iv = 0;
                    index$iv = index$iv2;
                    while (j$iv$iv$iv < bitCount$iv$iv$iv) {
                        if ((slot$iv$iv$iv & 255) < 128) {
                            int element$iv = k$iv$iv[(i$iv$iv$iv << 3) + j$iv$iv$iv];
                            if (index$iv == -1) {
                                $this$joinToString_u24lambda_u2415$iv.append(truncated$iv);
                                break loop0;
                            }
                            if (index$iv != 0) {
                                $this$joinToString_u24lambda_u2415$iv.append(charSequence);
                            }
                            i = i4;
                            $this$joinToString_u24lambda_u2415$iv.append((CharSequence) function1.invoke(Integer.valueOf(element$iv)));
                            index$iv++;
                        } else {
                            i = i4;
                        }
                        slot$iv$iv$iv >>= i;
                        j$iv$iv$iv++;
                        i4 = i;
                    }
                    int i5 = i4;
                    if (bitCount$iv$iv$iv != i4) {
                        break;
                    }
                } else {
                    index$iv = index$iv2;
                }
                if (i$iv$iv$iv == lastIndex$iv$iv$iv) {
                    break;
                }
                i$iv$iv$iv++;
                i2 = i3;
                $i$f$joinToString = $i$f$joinToString2;
                sb2 = sb;
            }
        } else {
            sb = sb2;
        }
        $this$joinToString_u24lambda_u2415$iv.append(postfix$iv);
        String sb3 = sb.toString();
        Intrinsics.checkNotNullExpressionValue(sb3, "StringBuilder().apply(builderAction).toString()");
        return sb3;
    }

    public final String joinToString(Function1<? super Integer, ? extends CharSequence> transform) {
        StringBuilder sb;
        int i;
        Function1<? super Integer, ? extends CharSequence> function1 = transform;
        Intrinsics.checkNotNullParameter(function1, "transform");
        CharSequence prefix$iv = "";
        int $i$f$joinToString = 0;
        StringBuilder sb2 = new StringBuilder();
        StringBuilder $this$joinToString_u24lambda_u2415$iv = sb2;
        int i2 = 0;
        $this$joinToString_u24lambda_u2415$iv.append(prefix$iv);
        int index$iv = 0;
        int[] k$iv$iv = this.elements;
        long[] m$iv$iv$iv = this.metadata;
        CharSequence charSequence = prefix$iv;
        int lastIndex$iv$iv$iv = m$iv$iv$iv.length - 2;
        long[] m$iv$iv$iv2 = m$iv$iv$iv;
        int i$iv$iv$iv = 0;
        if (0 <= lastIndex$iv$iv$iv) {
            loop0:
            while (true) {
                long slot$iv$iv$iv = m$iv$iv$iv2[i$iv$iv$iv];
                int $i$f$joinToString2 = $i$f$joinToString;
                sb = sb2;
                long $this$maskEmptyOrDeleted$iv$iv$iv$iv = slot$iv$iv$iv;
                int i3 = i2;
                int index$iv2 = index$iv;
                if ((((~$this$maskEmptyOrDeleted$iv$iv$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int i4 = 8;
                    int bitCount$iv$iv$iv = 8 - ((~(i$iv$iv$iv - lastIndex$iv$iv$iv)) >>> 31);
                    int j$iv$iv$iv = 0;
                    index$iv = index$iv2;
                    while (j$iv$iv$iv < bitCount$iv$iv$iv) {
                        if ((slot$iv$iv$iv & 255) < 128) {
                            int element$iv = k$iv$iv[(i$iv$iv$iv << 3) + j$iv$iv$iv];
                            if (index$iv == -1) {
                                $this$joinToString_u24lambda_u2415$iv.append(truncated$iv);
                                break loop0;
                            }
                            if (index$iv != 0) {
                                $this$joinToString_u24lambda_u2415$iv.append(separator$iv);
                            }
                            i = i4;
                            $this$joinToString_u24lambda_u2415$iv.append((CharSequence) function1.invoke(Integer.valueOf(element$iv)));
                            index$iv++;
                        } else {
                            i = i4;
                        }
                        slot$iv$iv$iv >>= i;
                        j$iv$iv$iv++;
                        i4 = i;
                    }
                    int i5 = i4;
                    if (bitCount$iv$iv$iv != i4) {
                        break;
                    }
                } else {
                    index$iv = index$iv2;
                }
                if (i$iv$iv$iv == lastIndex$iv$iv$iv) {
                    break;
                }
                i$iv$iv$iv++;
                i2 = i3;
                $i$f$joinToString = $i$f$joinToString2;
                sb2 = sb;
            }
        } else {
            sb = sb2;
        }
        $this$joinToString_u24lambda_u2415$iv.append(postfix$iv);
        String sb3 = sb.toString();
        Intrinsics.checkNotNullExpressionValue(sb3, "StringBuilder().apply(builderAction).toString()");
        return sb3;
    }
}
