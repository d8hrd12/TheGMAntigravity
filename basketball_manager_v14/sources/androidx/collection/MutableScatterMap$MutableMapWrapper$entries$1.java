package androidx.collection;

import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import kotlin.Metadata;
import kotlin.jvm.internal.CollectionToArray;
import kotlin.jvm.internal.Intrinsics;
import kotlin.jvm.internal.TypeIntrinsics;
import kotlin.jvm.internal.markers.KMutableSet;

@Metadata(d1 = {"\u00005\n\u0000\n\u0002\u0010#\n\u0002\u0010'\n\u0000\n\u0002\u0010\b\n\u0002\b\u0003\n\u0002\u0010\u000b\n\u0002\b\u0003\n\u0002\u0010\u001e\n\u0000\n\u0002\u0010\u0002\n\u0002\b\u0004\n\u0002\u0010)\n\u0002\b\u0004*\u0001\u0000\b\n\u0018\u00002\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00028\u0000\u0012\u0004\u0012\u00028\u00010\u00020\u0001J\u001c\u0010\u0007\u001a\u00020\b2\u0012\u0010\t\u001a\u000e\u0012\u0004\u0012\u00028\u0000\u0012\u0004\u0012\u00028\u00010\u0002H\u0016J\"\u0010\n\u001a\u00020\b2\u0018\u0010\u000b\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00028\u0000\u0012\u0004\u0012\u00028\u00010\u00020\fH\u0016J\b\u0010\r\u001a\u00020\u000eH\u0016J\u001d\u0010\u000f\u001a\u00020\b2\u0012\u0010\t\u001a\u000e\u0012\u0004\u0012\u00028\u0000\u0012\u0004\u0012\u00028\u00010\u0002H\u0002J\"\u0010\u0010\u001a\u00020\b2\u0018\u0010\u000b\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00028\u0000\u0012\u0004\u0012\u00028\u00010\u00020\fH\u0016J\b\u0010\u0011\u001a\u00020\bH\u0016J\u001b\u0010\u0012\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00028\u0000\u0012\u0004\u0012\u00028\u00010\u00020\u0013H\u0002J\u001c\u0010\u0014\u001a\u00020\b2\u0012\u0010\t\u001a\u000e\u0012\u0004\u0012\u00028\u0000\u0012\u0004\u0012\u00028\u00010\u0002H\u0016J\"\u0010\u0015\u001a\u00020\b2\u0018\u0010\u000b\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00028\u0000\u0012\u0004\u0012\u00028\u00010\u00020\fH\u0016J\"\u0010\u0016\u001a\u00020\b2\u0018\u0010\u000b\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00028\u0000\u0012\u0004\u0012\u00028\u00010\u00020\fH\u0016R\u0014\u0010\u0003\u001a\u00020\u00048VX\u0004¢\u0006\u0006\u001a\u0004\b\u0005\u0010\u0006¨\u0006\u0017"}, d2 = {"androidx/collection/MutableScatterMap$MutableMapWrapper$entries$1", "", "", "size", "", "getSize", "()I", "add", "", "element", "addAll", "elements", "", "clear", "", "contains", "containsAll", "isEmpty", "iterator", "", "remove", "removeAll", "retainAll", "collection"}, k = 1, mv = {1, 8, 0}, xi = 48)
/* compiled from: ScatterMap.kt */
public final class MutableScatterMap$MutableMapWrapper$entries$1 implements Set<Map.Entry<K, V>>, KMutableSet {
    final /* synthetic */ MutableScatterMap<K, V> this$0;

    public Object[] toArray() {
        return CollectionToArray.toArray(this);
    }

    public <T> T[] toArray(T[] tArr) {
        Intrinsics.checkNotNullParameter(tArr, "array");
        return CollectionToArray.toArray(this, tArr);
    }

    MutableScatterMap$MutableMapWrapper$entries$1(MutableScatterMap<K, V> $receiver) {
        this.this$0 = $receiver;
    }

    public final /* bridge */ boolean contains(Object element) {
        if (!TypeIntrinsics.isMutableMapEntry(element)) {
            return false;
        }
        return contains((Map.Entry) element);
    }

    public final /* bridge */ boolean remove(Object element) {
        if (!TypeIntrinsics.isMutableMapEntry(element)) {
            return false;
        }
        return remove((Map.Entry) element);
    }

    public final /* bridge */ int size() {
        return getSize();
    }

    public int getSize() {
        return this.this$0._size;
    }

    public boolean isEmpty() {
        return this.this$0.isEmpty();
    }

    public Iterator<Map.Entry<K, V>> iterator() {
        return new MutableScatterMap$MutableMapWrapper$entries$1$iterator$1(this.this$0);
    }

    public void clear() {
        this.this$0.clear();
    }

    public boolean containsAll(Collection<? extends Object> elements) {
        Intrinsics.checkNotNullParameter(elements, "elements");
        Iterable<Map.Entry> $this$all$iv = elements;
        MutableScatterMap<K, V> mutableScatterMap = this.this$0;
        if (((Collection) $this$all$iv).isEmpty()) {
            return true;
        }
        for (Map.Entry it : $this$all$iv) {
            if (!Intrinsics.areEqual((Object) mutableScatterMap.get(it.getKey()), it.getValue())) {
                return false;
            }
        }
        return true;
    }

    public boolean contains(Map.Entry<K, V> element) {
        Intrinsics.checkNotNullParameter(element, "element");
        return Intrinsics.areEqual((Object) this.this$0.get(element.getKey()), (Object) element.getValue());
    }

    public boolean addAll(Collection<? extends Map.Entry<K, V>> elements) {
        Intrinsics.checkNotNullParameter(elements, "elements");
        throw new UnsupportedOperationException();
    }

    public boolean add(Map.Entry<K, V> element) {
        Intrinsics.checkNotNullParameter(element, "element");
        throw new UnsupportedOperationException();
    }

    public boolean retainAll(Collection<? extends Object> elements) {
        int i;
        int i2;
        Collection<? extends Object> collection = elements;
        Intrinsics.checkNotNullParameter(collection, "elements");
        boolean changed = false;
        MutableScatterMap<K, V> mutableScatterMap = this.this$0;
        long[] m$iv = this.this$0.metadata;
        int lastIndex$iv = m$iv.length - 2;
        int i$iv = 0;
        if (0 <= lastIndex$iv) {
            while (true) {
                long slot$iv = m$iv[i$iv];
                long $this$maskEmptyOrDeleted$iv$iv = slot$iv;
                if ((((~$this$maskEmptyOrDeleted$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int i3 = 8;
                    int bitCount$iv = 8 - ((~(i$iv - lastIndex$iv)) >>> 31);
                    int j$iv = 0;
                    while (j$iv < bitCount$iv) {
                        if ((255 & slot$iv) < 128) {
                            int index = (i$iv << 3) + j$iv;
                            boolean found = false;
                            Iterator<? extends Object> it = collection.iterator();
                            while (true) {
                                if (!it.hasNext()) {
                                    i2 = i;
                                    break;
                                }
                                Map.Entry entry = (Map.Entry) it.next();
                                i2 = i;
                                if (!Intrinsics.areEqual(entry.getKey(), mutableScatterMap.keys[index])) {
                                    i = i2;
                                } else if (Intrinsics.areEqual(entry.getValue(), mutableScatterMap.values[index])) {
                                    found = true;
                                    break;
                                } else {
                                    i = i2;
                                }
                            }
                            if (!found) {
                                mutableScatterMap.removeValueAt(index);
                                changed = true;
                            }
                        } else {
                            i2 = i;
                        }
                        slot$iv >>= i2;
                        j$iv++;
                        i3 = i2;
                    }
                    if (bitCount$iv != i) {
                        break;
                    }
                }
                if (i$iv == lastIndex$iv) {
                    break;
                }
                i$iv++;
            }
        }
        return changed;
    }

    public boolean removeAll(Collection<? extends Object> elements) {
        int i;
        int i2;
        Collection<? extends Object> collection = elements;
        Intrinsics.checkNotNullParameter(collection, "elements");
        boolean changed = false;
        MutableScatterMap<K, V> mutableScatterMap = this.this$0;
        long[] m$iv = this.this$0.metadata;
        int lastIndex$iv = m$iv.length - 2;
        int i$iv = 0;
        if (0 <= lastIndex$iv) {
            while (true) {
                long slot$iv = m$iv[i$iv];
                long $this$maskEmptyOrDeleted$iv$iv = slot$iv;
                if ((((~$this$maskEmptyOrDeleted$iv$iv) << 7) & $this$maskEmptyOrDeleted$iv$iv & -9187201950435737472L) != -9187201950435737472L) {
                    int i3 = 8;
                    int bitCount$iv = 8 - ((~(i$iv - lastIndex$iv)) >>> 31);
                    int j$iv = 0;
                    while (j$iv < bitCount$iv) {
                        if ((255 & slot$iv) < 128) {
                            int index = (i$iv << 3) + j$iv;
                            Iterator<? extends Object> it = collection.iterator();
                            while (true) {
                                if (!it.hasNext()) {
                                    i2 = i;
                                    break;
                                }
                                Map.Entry entry = (Map.Entry) it.next();
                                i2 = i;
                                if (!Intrinsics.areEqual(entry.getKey(), mutableScatterMap.keys[index])) {
                                    i = i2;
                                } else if (Intrinsics.areEqual(entry.getValue(), mutableScatterMap.values[index])) {
                                    mutableScatterMap.removeValueAt(index);
                                    changed = true;
                                    break;
                                } else {
                                    i = i2;
                                }
                            }
                        } else {
                            i2 = i;
                        }
                        slot$iv >>= i2;
                        j$iv++;
                        i3 = i2;
                    }
                    if (bitCount$iv != i) {
                        break;
                    }
                }
                if (i$iv == lastIndex$iv) {
                    break;
                }
                i$iv++;
            }
        }
        return changed;
    }

    /* JADX WARNING: Code restructure failed: missing block: B:14:0x00a6, code lost:
        r6 = r20;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:15:0x00b5, code lost:
        if (((((~r6) << 6) & r6) & -9187201950435737472L) == 0) goto L_0x00d3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:16:0x00b7, code lost:
        r6 = -1;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public boolean remove(java.util.Map.Entry<K, V> r27) {
        /*
            r26 = this;
            r0 = r26
            java.lang.String r1 = "element"
            r2 = r27
            kotlin.jvm.internal.Intrinsics.checkNotNullParameter(r2, r1)
            androidx.collection.MutableScatterMap<K, V> r1 = r0.this$0
            androidx.collection.ScatterMap r1 = (androidx.collection.ScatterMap) r1
            java.lang.Object r3 = r2.getKey()
            r4 = 0
            r5 = 0
            if (r3 == 0) goto L_0x001a
            int r7 = r3.hashCode()
            goto L_0x001b
        L_0x001a:
            r7 = 0
        L_0x001b:
            r8 = -862048943(0xffffffffcc9e2d51, float:-8.2930312E7)
            int r7 = r7 * r8
            int r8 = r7 << 16
            r5 = r7 ^ r8
            r7 = 0
            r7 = r5 & 127(0x7f, float:1.78E-43)
            int r8 = r1._capacity
            r9 = 0
            int r9 = r5 >>> 7
            r9 = r9 & r8
            r10 = 0
        L_0x002f:
            long[] r11 = r1.metadata
            r12 = 0
            int r13 = r9 >> 3
            r14 = r9 & 7
            int r14 = r14 << 3
            r15 = r11[r13]
            long r15 = r15 >>> r14
            int r17 = r13 + 1
            r17 = r11[r17]
            int r19 = 64 - r14
            long r17 = r17 << r19
            r20 = r7
            r19 = 0
            long r6 = (long) r14
            long r6 = -r6
            r21 = 63
            long r6 = r6 >> r21
            long r6 = r17 & r6
            long r6 = r6 | r15
            r11 = r6
            r13 = 0
            r15 = r4
            r16 = r5
            r14 = r20
            long r4 = (long) r14
            r17 = 72340172838076673(0x101010101010101, double:7.748604185489348E-304)
            long r4 = r4 * r17
            long r4 = r4 ^ r11
            long r17 = r4 - r17
            r20 = r6
            long r6 = ~r4
            long r6 = r17 & r6
            r17 = -9187201950435737472(0x8080808080808080, double:-2.937446524422997E-306)
            long r4 = r6 & r17
        L_0x0071:
            r6 = r4
            r11 = 0
            r12 = 0
            int r22 = (r6 > r12 ? 1 : (r6 == r12 ? 0 : -1))
            r23 = 1
            if (r22 == 0) goto L_0x007e
            r6 = r23
            goto L_0x0080
        L_0x007e:
            r6 = r19
        L_0x0080:
            if (r6 == 0) goto L_0x00a6
            r6 = r4
            r11 = 0
            r12 = r6
            r22 = 0
            int r24 = java.lang.Long.numberOfTrailingZeros(r12)
            int r12 = r24 >> 3
            int r12 = r12 + r9
            r6 = r12 & r8
            java.lang.Object[] r7 = r1.keys
            r7 = r7[r6]
            boolean r7 = kotlin.jvm.internal.Intrinsics.areEqual((java.lang.Object) r7, (java.lang.Object) r3)
            if (r7 == 0) goto L_0x009c
            goto L_0x00b9
        L_0x009c:
            r11 = r4
            r7 = 0
            r22 = 1
            long r22 = r11 - r22
            long r11 = r11 & r22
            r4 = r11
            goto L_0x0071
        L_0x00a6:
            r6 = r20
            r11 = 0
            r24 = r12
            long r12 = ~r6
            r22 = 6
            long r12 = r12 << r22
            long r12 = r12 & r6
            long r6 = r12 & r17
            int r6 = (r6 > r24 ? 1 : (r6 == r24 ? 0 : -1))
            if (r6 == 0) goto L_0x00d3
            r6 = -1
        L_0x00b9:
            if (r6 < 0) goto L_0x00d2
            androidx.collection.MutableScatterMap<K, V> r1 = r0.this$0
            java.lang.Object[] r1 = r1.values
            r1 = r1[r6]
            java.lang.Object r3 = r2.getValue()
            boolean r1 = kotlin.jvm.internal.Intrinsics.areEqual((java.lang.Object) r1, (java.lang.Object) r3)
            if (r1 == 0) goto L_0x00d2
            androidx.collection.MutableScatterMap<K, V> r1 = r0.this$0
            r1.removeValueAt(r6)
            return r23
        L_0x00d2:
            return r19
        L_0x00d3:
            int r10 = r10 + 8
            int r6 = r9 + r10
            r9 = r6 & r8
            r7 = r14
            r4 = r15
            r5 = r16
            goto L_0x002f
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.collection.MutableScatterMap$MutableMapWrapper$entries$1.remove(java.util.Map$Entry):boolean");
    }
}
