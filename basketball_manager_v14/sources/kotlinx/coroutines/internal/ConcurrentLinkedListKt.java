package kotlinx.coroutines.internal;

import androidx.concurrent.futures.AbstractResolvableFuture$SafeAtomicHelper$$ExternalSyntheticBackportWithForwarding0;
import java.util.concurrent.atomic.AtomicIntegerArray;
import java.util.concurrent.atomic.AtomicIntegerFieldUpdater;
import java.util.concurrent.atomic.AtomicReferenceArray;
import java.util.concurrent.atomic.AtomicReferenceFieldUpdater;
import kotlin.Metadata;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.functions.Function2;
import kotlinx.coroutines.channels.ChannelSegment$$ExternalSyntheticBackportWithForwarding0;

@Metadata(d1 = {"\u0000N\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000b\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\t\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0006\u001a8\u0010\u0004\u001a\u00020\u0005*\u00020\u00062\u0006\u0010\u0007\u001a\u00020\u00032!\u0010\b\u001a\u001d\u0012\u0013\u0012\u00110\u0003¢\u0006\f\b\n\u0012\b\b\u000b\u0012\u0004\b\b(\f\u0012\u0004\u0012\u00020\u00050\tH\b\u001a!\u0010\r\u001a\u0002H\u000e\"\u000e\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\u000f*\u0002H\u000eH\u0000¢\u0006\u0002\u0010\u0010\u001as\u0010\u0011\u001a\b\u0012\u0004\u0012\u0002H\u00130\u0012\"\u000e\b\u0000\u0010\u0013*\b\u0012\u0004\u0012\u0002H\u00130\u0014*\b\u0012\u0004\u0012\u0002H\u00130\u00152\u0006\u0010\u0016\u001a\u00020\u00172\u0006\u0010\u0018\u001a\u0002H\u001328\b\b\u0010\u0019\u001a2\u0012\u0013\u0012\u00110\u0017¢\u0006\f\b\n\u0012\b\b\u000b\u0012\u0004\b\b(\u0016\u0012\u0013\u0012\u0011H\u0013¢\u0006\f\b\n\u0012\b\b\u000b\u0012\u0004\b\b(\u001b\u0012\u0004\u0012\u0002H\u00130\u001aH\b\u001ag\u0010\u001c\u001a\b\u0012\u0004\u0012\u0002H\u00130\u0012\"\u000e\b\u0000\u0010\u0013*\b\u0012\u0004\u0012\u0002H\u00130\u0014*\u0002H\u00132\u0006\u0010\u0016\u001a\u00020\u001726\u0010\u0019\u001a2\u0012\u0013\u0012\u00110\u0017¢\u0006\f\b\n\u0012\b\b\u000b\u0012\u0004\b\b(\u0016\u0012\u0013\u0012\u0011H\u0013¢\u0006\f\b\n\u0012\b\b\u000b\u0012\u0004\b\b(\u001b\u0012\u0004\u0012\u0002H\u00130\u001aH\u0000¢\u0006\u0002\u0010\u001d\u001a+\u0010\u001e\u001a\u00020\u0005\"\u000e\b\u0000\u0010\u0013*\b\u0012\u0004\u0012\u0002H\u00130\u0014*\b\u0012\u0004\u0012\u0002H\u00130\u00152\u0006\u0010\u001f\u001a\u0002H\u0013H\b\"\u000e\u0010\u0000\u001a\u00020\u0001X\u0004¢\u0006\u0002\n\u0000\"\u000e\u0010\u0002\u001a\u00020\u0003XT¢\u0006\u0002\n\u0000¨\u0006 "}, d2 = {"CLOSED", "Lkotlinx/coroutines/internal/Symbol;", "POINTERS_SHIFT", "", "addConditionally", "", "Lkotlinx/atomicfu/AtomicInt;", "delta", "condition", "Lkotlin/Function1;", "Lkotlin/ParameterName;", "name", "cur", "close", "N", "Lkotlinx/coroutines/internal/ConcurrentLinkedListNode;", "(Lkotlinx/coroutines/internal/ConcurrentLinkedListNode;)Lkotlinx/coroutines/internal/ConcurrentLinkedListNode;", "findSegmentAndMoveForward", "Lkotlinx/coroutines/internal/SegmentOrClosed;", "S", "Lkotlinx/coroutines/internal/Segment;", "Lkotlinx/atomicfu/AtomicRef;", "id", "", "startFrom", "createNewSegment", "Lkotlin/Function2;", "prev", "findSegmentInternal", "(Lkotlinx/coroutines/internal/Segment;JLkotlin/jvm/functions/Function2;)Ljava/lang/Object;", "moveForward", "to", "kotlinx-coroutines-core"}, k = 2, mv = {1, 9, 0}, xi = 48)
/* compiled from: ConcurrentLinkedList.kt */
public final class ConcurrentLinkedListKt {
    /* access modifiers changed from: private */
    public static final Symbol CLOSED = new Symbol("CLOSED");
    private static final int POINTERS_SHIFT = 16;

    public static final <S extends Segment<S>> Object findSegmentInternal(S $this$findSegmentInternal, long id, Function2<? super Long, ? super S, ? extends S> createNewSegment) {
        Segment cur = $this$findSegmentInternal;
        while (true) {
            if (cur.id >= id && !cur.isRemoved()) {
                return SegmentOrClosed.m1680constructorimpl(cur);
            }
            Object it$iv = cur.getNextOrClosed();
            if (it$iv == CLOSED) {
                return SegmentOrClosed.m1680constructorimpl(CLOSED);
            }
            Segment next = (Segment) ((ConcurrentLinkedListNode) it$iv);
            if (next != null) {
                cur = next;
            } else {
                Segment newTail = (Segment) createNewSegment.invoke(Long.valueOf(cur.id + 1), cur);
                if (cur.trySetNext(newTail)) {
                    if (cur.isRemoved()) {
                        cur.remove();
                    }
                    cur = newTail;
                }
            }
        }
    }

    public static final /* synthetic */ <S extends Segment<S>> boolean moveForward$atomicfu(Object dispatchReceiver$atomicfu, AtomicReferenceFieldUpdater handler$atomicfu, S to) {
        while (true) {
            Segment cur = (Segment) handler$atomicfu.get(dispatchReceiver$atomicfu);
            if (cur.id >= to.id) {
                return true;
            }
            if (!to.tryIncPointers$kotlinx_coroutines_core()) {
                return false;
            }
            if (AbstractResolvableFuture$SafeAtomicHelper$$ExternalSyntheticBackportWithForwarding0.m(handler$atomicfu, dispatchReceiver$atomicfu, cur, to)) {
                if (cur.decPointers$kotlinx_coroutines_core()) {
                    cur.remove();
                }
                return true;
            } else if (to.decPointers$kotlinx_coroutines_core()) {
                to.remove();
            }
        }
    }

    public static final /* synthetic */ <S extends Segment<S>> boolean moveForward$atomicfu$array(AtomicReferenceArray handler$atomicfu, int index$atomicfu, S to) {
        while (true) {
            Segment cur = (Segment) handler$atomicfu.get(index$atomicfu);
            if (cur.id >= to.id) {
                return true;
            }
            if (!to.tryIncPointers$kotlinx_coroutines_core()) {
                return false;
            }
            if (ChannelSegment$$ExternalSyntheticBackportWithForwarding0.m(handler$atomicfu, index$atomicfu, cur, to)) {
                if (cur.decPointers$kotlinx_coroutines_core()) {
                    cur.remove();
                }
                return true;
            } else if (to.decPointers$kotlinx_coroutines_core()) {
                to.remove();
            }
        }
    }

    public static final /* synthetic */ <S extends Segment<S>> Object findSegmentAndMoveForward$atomicfu(Object dispatchReceiver$atomicfu, AtomicReferenceFieldUpdater handler$atomicfu, long id, S startFrom, Function2<? super Long, ? super S, ? extends S> createNewSegment) {
        Object s;
        boolean z;
        do {
            s = findSegmentInternal(startFrom, id, createNewSegment);
            if (SegmentOrClosed.m1685isClosedimpl(s)) {
                break;
            }
            Segment to$iv = SegmentOrClosed.m1683getSegmentimpl(s);
            while (true) {
                Segment cur$iv = (Segment) handler$atomicfu.get(dispatchReceiver$atomicfu);
                z = true;
                if (cur$iv.id >= to$iv.id) {
                    break;
                } else if (!to$iv.tryIncPointers$kotlinx_coroutines_core()) {
                    z = false;
                    continue;
                    break;
                } else if (AbstractResolvableFuture$SafeAtomicHelper$$ExternalSyntheticBackportWithForwarding0.m(handler$atomicfu, dispatchReceiver$atomicfu, cur$iv, to$iv)) {
                    if (cur$iv.decPointers$kotlinx_coroutines_core()) {
                        cur$iv.remove();
                        continue;
                    } else {
                        continue;
                    }
                } else if (to$iv.decPointers$kotlinx_coroutines_core()) {
                    to$iv.remove();
                }
            }
        } while (!z);
        return s;
    }

    public static final /* synthetic */ <S extends Segment<S>> Object findSegmentAndMoveForward$atomicfu$array(AtomicReferenceArray handler$atomicfu, int index$atomicfu, long id, S startFrom, Function2<? super Long, ? super S, ? extends S> createNewSegment) {
        Object s;
        boolean z;
        do {
            s = findSegmentInternal(startFrom, id, createNewSegment);
            if (SegmentOrClosed.m1685isClosedimpl(s)) {
                break;
            }
            Segment to$iv = SegmentOrClosed.m1683getSegmentimpl(s);
            while (true) {
                Segment cur$iv = (Segment) handler$atomicfu.get(index$atomicfu);
                z = true;
                if (cur$iv.id >= to$iv.id) {
                    break;
                } else if (!to$iv.tryIncPointers$kotlinx_coroutines_core()) {
                    z = false;
                    continue;
                    break;
                } else if (ChannelSegment$$ExternalSyntheticBackportWithForwarding0.m(handler$atomicfu, index$atomicfu, cur$iv, to$iv)) {
                    if (cur$iv.decPointers$kotlinx_coroutines_core()) {
                        cur$iv.remove();
                        continue;
                    } else {
                        continue;
                    }
                } else if (to$iv.decPointers$kotlinx_coroutines_core()) {
                    to$iv.remove();
                }
            }
        } while (!z);
        return s;
    }

    public static final <N extends ConcurrentLinkedListNode<N>> N close(N $this$close) {
        ConcurrentLinkedListNode this_$iv = $this$close;
        while (true) {
            Object it$iv = this_$iv.getNextOrClosed();
            if (it$iv == CLOSED) {
                return this_$iv;
            }
            ConcurrentLinkedListNode next = (ConcurrentLinkedListNode) it$iv;
            if (next != null) {
                this_$iv = next;
            } else if (this_$iv.markAsClosed()) {
                return this_$iv;
            }
        }
    }

    private static final /* synthetic */ boolean addConditionally$atomicfu(Object dispatchReceiver$atomicfu, AtomicIntegerFieldUpdater handler$atomicfu, int delta, Function1<? super Integer, Boolean> condition) {
        int cur;
        do {
            cur = handler$atomicfu.get(dispatchReceiver$atomicfu);
            if (!condition.invoke(Integer.valueOf(cur)).booleanValue()) {
                return false;
            }
        } while (!handler$atomicfu.compareAndSet(dispatchReceiver$atomicfu, cur, cur + delta));
        return true;
    }

    private static final /* synthetic */ boolean addConditionally$atomicfu$array(AtomicIntegerArray handler$atomicfu, int index$atomicfu, int delta, Function1<? super Integer, Boolean> condition) {
        int cur;
        do {
            cur = handler$atomicfu.get(index$atomicfu);
            if (!condition.invoke(Integer.valueOf(cur)).booleanValue()) {
                return false;
            }
        } while (!handler$atomicfu.compareAndSet(index$atomicfu, cur, cur + delta));
        return true;
    }
}
