package kotlinx.coroutines.internal;

import java.lang.Comparable;
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicIntegerFieldUpdater;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.internal.Intrinsics;
import kotlinx.coroutines.DebugKt;
import kotlinx.coroutines.internal.ThreadSafeHeapNode;

@Metadata(d1 = {"\u0000P\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010\u000f\n\u0002\u0010\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0011\n\u0002\b\u0002\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0010\b\n\u0002\b\u0006\n\u0002\u0010\u0002\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0014\b\u0017\u0018\u0000*\u0012\b\u0000\u0010\u0001*\u00020\u0002*\b\u0012\u0004\u0012\u0002H\u00010\u00032\u00060\u0004j\u0002`\u0005B\u0005¢\u0006\u0002\u0010\u0006J\u0015\u0010\u0016\u001a\u00020\u00172\u0006\u0010\u0018\u001a\u00028\u0000H\u0001¢\u0006\u0002\u0010\u0019J\u0013\u0010\u001a\u001a\u00020\u00172\u0006\u0010\u0018\u001a\u00028\u0000¢\u0006\u0002\u0010\u0019J,\u0010\u001b\u001a\u00020\r2\u0006\u0010\u0018\u001a\u00028\u00002\u0014\u0010\u001c\u001a\u0010\u0012\u0006\u0012\u0004\u0018\u00018\u0000\u0012\u0004\u0012\u00020\r0\u001dH\b¢\u0006\u0002\u0010\u001eJ0\u0010\u001f\u001a\u0004\u0018\u00018\u00002!\u0010 \u001a\u001d\u0012\u0013\u0012\u00118\u0000¢\u0006\f\b!\u0012\b\b\"\u0012\u0004\b\b(\u000f\u0012\u0004\u0012\u00020\r0\u001d¢\u0006\u0002\u0010#J\u000f\u0010$\u001a\u0004\u0018\u00018\u0000H\u0001¢\u0006\u0002\u0010%J\r\u0010&\u001a\u0004\u0018\u00018\u0000¢\u0006\u0002\u0010%J\u0015\u0010'\u001a\n\u0012\u0006\u0012\u0004\u0018\u00018\u00000\nH\u0002¢\u0006\u0002\u0010(J\u0013\u0010)\u001a\u00020\r2\u0006\u0010\u0018\u001a\u00028\u0000¢\u0006\u0002\u0010*J\u0015\u0010+\u001a\u00028\u00002\u0006\u0010,\u001a\u00020\u0010H\u0001¢\u0006\u0002\u0010-J$\u0010.\u001a\u0004\u0018\u00018\u00002\u0012\u0010 \u001a\u000e\u0012\u0004\u0012\u00028\u0000\u0012\u0004\u0012\u00020\r0\u001dH\b¢\u0006\u0002\u0010#J\r\u0010/\u001a\u0004\u0018\u00018\u0000¢\u0006\u0002\u0010%J\u0011\u00100\u001a\u00020\u00172\u0006\u00101\u001a\u00020\u0010H\u0010J\u0011\u00102\u001a\u00020\u00172\u0006\u00101\u001a\u00020\u0010H\u0010J\u0018\u00103\u001a\u00020\u00172\u0006\u00101\u001a\u00020\u00102\u0006\u00104\u001a\u00020\u0010H\u0002R\t\u0010\u0007\u001a\u00020\bX\u0004R\u001a\u0010\t\u001a\f\u0012\u0006\u0012\u0004\u0018\u00018\u0000\u0018\u00010\nX\u000e¢\u0006\u0004\n\u0002\u0010\u000bR\u0011\u0010\f\u001a\u00020\r8F¢\u0006\u0006\u001a\u0004\b\f\u0010\u000eR$\u0010\u0011\u001a\u00020\u00102\u0006\u0010\u000f\u001a\u00020\u00108F@BX\u000e¢\u0006\f\u001a\u0004\b\u0012\u0010\u0013\"\u0004\b\u0014\u0010\u0015¨\u00065"}, d2 = {"Lkotlinx/coroutines/internal/ThreadSafeHeap;", "T", "Lkotlinx/coroutines/internal/ThreadSafeHeapNode;", "", "", "Lkotlinx/coroutines/internal/SynchronizedObject;", "()V", "_size", "Lkotlinx/atomicfu/AtomicInt;", "a", "", "[Lkotlinx/coroutines/internal/ThreadSafeHeapNode;", "isEmpty", "", "()Z", "value", "", "size", "getSize", "()I", "setSize", "(I)V", "addImpl", "", "node", "(Lkotlinx/coroutines/internal/ThreadSafeHeapNode;)V", "addLast", "addLastIf", "cond", "Lkotlin/Function1;", "(Lkotlinx/coroutines/internal/ThreadSafeHeapNode;Lkotlin/jvm/functions/Function1;)Z", "find", "predicate", "Lkotlin/ParameterName;", "name", "(Lkotlin/jvm/functions/Function1;)Lkotlinx/coroutines/internal/ThreadSafeHeapNode;", "firstImpl", "()Lkotlinx/coroutines/internal/ThreadSafeHeapNode;", "peek", "realloc", "()[Lkotlinx/coroutines/internal/ThreadSafeHeapNode;", "remove", "(Lkotlinx/coroutines/internal/ThreadSafeHeapNode;)Z", "removeAtImpl", "index", "(I)Lkotlinx/coroutines/internal/ThreadSafeHeapNode;", "removeFirstIf", "removeFirstOrNull", "siftDownFrom", "i", "siftUpFrom", "swap", "j", "kotlinx-coroutines-core"}, k = 1, mv = {1, 9, 0}, xi = 48)
/* compiled from: ThreadSafeHeap.kt */
public class ThreadSafeHeap<T extends ThreadSafeHeapNode & Comparable<? super T>> {
    /* access modifiers changed from: private */
    public static final /* synthetic */ AtomicIntegerFieldUpdater _size$volatile$FU = AtomicIntegerFieldUpdater.newUpdater(ThreadSafeHeap.class, "_size$volatile");
    private volatile /* synthetic */ int _size$volatile;
    private T[] a;

    private final /* synthetic */ int get_size$volatile() {
        return this._size$volatile;
    }

    private final /* synthetic */ void set_size$volatile(int i) {
        this._size$volatile = i;
    }

    public final int getSize() {
        return _size$volatile$FU.get(this);
    }

    private final void setSize(int value) {
        _size$volatile$FU.set(this, value);
    }

    public final boolean isEmpty() {
        return getSize() == 0;
    }

    public final T find(Function1<? super T, Boolean> predicate) {
        ThreadSafeHeapNode value;
        synchronized (this) {
            int i = 0;
            int size = getSize();
            while (true) {
                value = null;
                if (i >= size) {
                    break;
                }
                ThreadSafeHeapNode[] threadSafeHeapNodeArr = this.a;
                if (threadSafeHeapNodeArr != null) {
                    value = threadSafeHeapNodeArr[i];
                }
                Intrinsics.checkNotNull(value);
                if (predicate.invoke(value).booleanValue()) {
                    break;
                }
                i++;
            }
        }
        return value;
    }

    public final T peek() {
        T firstImpl;
        synchronized (this) {
            firstImpl = firstImpl();
        }
        return firstImpl;
    }

    public final T removeFirstOrNull() {
        T t;
        synchronized (this) {
            if (getSize() > 0) {
                t = removeAtImpl(0);
            } else {
                t = null;
            }
        }
        return t;
    }

    /* JADX WARNING: Code restructure failed: missing block: B:14:0x0025, code lost:
        return r5;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final T removeFirstIf(kotlin.jvm.functions.Function1<? super T, java.lang.Boolean> r8) {
        /*
            r7 = this;
            r0 = 0
            r1 = 0
            r2 = 0
            monitor-enter(r7)
            r3 = 0
            kotlinx.coroutines.internal.ThreadSafeHeapNode r4 = r7.firstImpl()     // Catch:{ all -> 0x0026 }
            r5 = 0
            if (r4 != 0) goto L_0x000f
            monitor-exit(r7)
            return r5
        L_0x000f:
            java.lang.Object r6 = r8.invoke(r4)     // Catch:{ all -> 0x0026 }
            java.lang.Boolean r6 = (java.lang.Boolean) r6     // Catch:{ all -> 0x0026 }
            boolean r6 = r6.booleanValue()     // Catch:{ all -> 0x0026 }
            if (r6 == 0) goto L_0x0021
            r5 = 0
            kotlinx.coroutines.internal.ThreadSafeHeapNode r5 = r7.removeAtImpl(r5)     // Catch:{ all -> 0x0026 }
            goto L_0x0022
        L_0x0021:
        L_0x0022:
            monitor-exit(r7)
            return r5
        L_0x0026:
            r3 = move-exception
            monitor-exit(r7)
            throw r3
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.internal.ThreadSafeHeap.removeFirstIf(kotlin.jvm.functions.Function1):kotlinx.coroutines.internal.ThreadSafeHeapNode");
    }

    public final void addLast(T node) {
        synchronized (this) {
            addImpl(node);
            Unit unit = Unit.INSTANCE;
        }
    }

    public final boolean addLastIf(T node, Function1<? super T, Boolean> cond) {
        boolean z;
        synchronized (this) {
            if (cond.invoke(firstImpl()).booleanValue()) {
                addImpl(node);
                z = true;
            } else {
                z = false;
            }
        }
        return z;
    }

    public final boolean remove(T node) {
        boolean z;
        synchronized (this) {
            z = false;
            if (node.getHeap() != null) {
                int index = node.getIndex();
                if (DebugKt.getASSERTIONS_ENABLED()) {
                    if (index >= 0) {
                        z = true;
                    }
                    if (!z) {
                        throw new AssertionError();
                    }
                }
                removeAtImpl(index);
                z = true;
            }
        }
        return z;
    }

    public final T firstImpl() {
        T[] tArr = this.a;
        if (tArr != null) {
            return tArr[0];
        }
        return null;
    }

    public final T removeAtImpl(int index) {
        boolean z = false;
        if (DebugKt.getASSERTIONS_ENABLED()) {
            if ((getSize() > 0 ? 1 : 0) == 0) {
                throw new AssertionError();
            }
        }
        ThreadSafeHeapNode[] a2 = this.a;
        Intrinsics.checkNotNull(a2);
        setSize(getSize() - 1);
        if (index < getSize()) {
            swap(index, getSize());
            int j = (index - 1) / 2;
            if (index > 0) {
                ThreadSafeHeapNode threadSafeHeapNode = a2[index];
                Intrinsics.checkNotNull(threadSafeHeapNode);
                ThreadSafeHeapNode threadSafeHeapNode2 = a2[j];
                Intrinsics.checkNotNull(threadSafeHeapNode2);
                if (((Comparable) threadSafeHeapNode).compareTo(threadSafeHeapNode2) < 0) {
                    swap(index, j);
                    siftUpFrom(j);
                }
            }
            siftDownFrom(index);
        }
        ThreadSafeHeapNode result = a2[getSize()];
        Intrinsics.checkNotNull(result);
        if (DebugKt.getASSERTIONS_ENABLED()) {
            if (result.getHeap() == this) {
                z = true;
            }
            if (!z) {
                throw new AssertionError();
            }
        }
        result.setHeap((ThreadSafeHeap<?>) null);
        result.setIndex(-1);
        a2[getSize()] = null;
        return result;
    }

    public final void addImpl(T node) {
        if (DebugKt.getASSERTIONS_ENABLED()) {
            if (!(node.getHeap() == null)) {
                throw new AssertionError();
            }
        }
        node.setHeap(this);
        ThreadSafeHeapNode[] a2 = realloc();
        int i = getSize();
        setSize(i + 1);
        a2[i] = node;
        node.setIndex(i);
        siftUpFrom(i);
    }

    private final void siftUpFrom(int i) {
        while (i > 0) {
            ThreadSafeHeapNode[] a2 = this.a;
            Intrinsics.checkNotNull(a2);
            int j = (i - 1) / 2;
            ThreadSafeHeapNode threadSafeHeapNode = a2[j];
            Intrinsics.checkNotNull(threadSafeHeapNode);
            ThreadSafeHeapNode threadSafeHeapNode2 = a2[i];
            Intrinsics.checkNotNull(threadSafeHeapNode2);
            if (((Comparable) threadSafeHeapNode).compareTo(threadSafeHeapNode2) > 0) {
                swap(i, j);
                i = j;
            } else {
                return;
            }
        }
    }

    private final void siftDownFrom(int i) {
        while (true) {
            int j = (i * 2) + 1;
            if (j < getSize()) {
                ThreadSafeHeapNode[] a2 = this.a;
                Intrinsics.checkNotNull(a2);
                if (j + 1 < getSize()) {
                    ThreadSafeHeapNode threadSafeHeapNode = a2[j + 1];
                    Intrinsics.checkNotNull(threadSafeHeapNode);
                    ThreadSafeHeapNode threadSafeHeapNode2 = a2[j];
                    Intrinsics.checkNotNull(threadSafeHeapNode2);
                    if (((Comparable) threadSafeHeapNode).compareTo(threadSafeHeapNode2) < 0) {
                        j++;
                    }
                }
                ThreadSafeHeapNode threadSafeHeapNode3 = a2[i];
                Intrinsics.checkNotNull(threadSafeHeapNode3);
                ThreadSafeHeapNode threadSafeHeapNode4 = a2[j];
                Intrinsics.checkNotNull(threadSafeHeapNode4);
                if (((Comparable) threadSafeHeapNode3).compareTo(threadSafeHeapNode4) > 0) {
                    swap(i, j);
                    i = j;
                } else {
                    return;
                }
            } else {
                return;
            }
        }
    }

    private final T[] realloc() {
        ThreadSafeHeapNode[] a2 = this.a;
        if (a2 == null) {
            ThreadSafeHeapNode[] it = new ThreadSafeHeapNode[4];
            this.a = it;
            return it;
        } else if (getSize() < a2.length) {
            return a2;
        } else {
            T[] it2 = Arrays.copyOf(a2, getSize() * 2);
            Intrinsics.checkNotNullExpressionValue(it2, "copyOf(...)");
            this.a = it2;
            return (ThreadSafeHeapNode[]) it2;
        }
    }

    private final void swap(int i, int j) {
        ThreadSafeHeapNode[] a2 = this.a;
        Intrinsics.checkNotNull(a2);
        ThreadSafeHeapNode ni = a2[j];
        Intrinsics.checkNotNull(ni);
        ThreadSafeHeapNode nj = a2[i];
        Intrinsics.checkNotNull(nj);
        a2[i] = ni;
        a2[j] = nj;
        ni.setIndex(i);
        nj.setIndex(j);
    }
}
