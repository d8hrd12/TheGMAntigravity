package kotlin.collections.builders;

import java.io.NotSerializableException;
import java.io.Serializable;
import java.util.Arrays;
import java.util.Collection;
import java.util.ConcurrentModificationException;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.NoSuchElementException;
import java.util.RandomAccess;
import kotlin.Metadata;
import kotlin.collections.AbstractList;
import kotlin.collections.AbstractMutableList;
import kotlin.collections.ArraysKt;
import kotlin.collections.CollectionsKt;
import kotlin.jvm.internal.DefaultConstructorMarker;
import kotlin.jvm.internal.Intrinsics;
import kotlin.jvm.internal.markers.KMutableList;
import kotlin.jvm.internal.markers.KMutableListIterator;

@Metadata(d1 = {"\u0000p\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010!\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\u0002\n\u0002\u0010\u0011\n\u0002\b\u0002\n\u0002\u0010\u000b\n\u0002\b\u0007\n\u0002\u0010\u0002\n\u0002\b\u0004\n\u0002\u0010\u001e\n\u0002\b\u0005\n\u0002\u0010 \n\u0002\b\b\n\u0002\u0010\u0000\n\u0002\b\b\n\u0002\u0010)\n\u0002\b\u0002\n\u0002\u0010+\n\u0002\b\u0016\n\u0002\u0010\u000e\n\u0002\b\u0005\b\u0000\u0018\u0000 Q*\u0004\b\u0000\u0010\u00012\b\u0012\u0004\u0012\u0002H\u00010\u00022\u00060\u0003j\u0002`\u00042\b\u0012\u0004\u0012\u0002H\u00010\u00052\u00060\u0006j\u0002`\u0007:\u0003PQRB\u000f\u0012\b\b\u0002\u0010\b\u001a\u00020\t¢\u0006\u0002\u0010\nJ\u0015\u0010\u0014\u001a\u00020\u000f2\u0006\u0010\u0015\u001a\u00028\u0000H\u0016¢\u0006\u0002\u0010\u0016J\u001d\u0010\u0014\u001a\u00020\u00172\u0006\u0010\u0018\u001a\u00020\t2\u0006\u0010\u0015\u001a\u00028\u0000H\u0016¢\u0006\u0002\u0010\u0019J\u001e\u0010\u001a\u001a\u00020\u000f2\u0006\u0010\u0018\u001a\u00020\t2\f\u0010\u001b\u001a\b\u0012\u0004\u0012\u00028\u00000\u001cH\u0016J\u0016\u0010\u001a\u001a\u00020\u000f2\f\u0010\u001b\u001a\b\u0012\u0004\u0012\u00028\u00000\u001cH\u0016J&\u0010\u001d\u001a\u00020\u00172\u0006\u0010\u001e\u001a\u00020\t2\f\u0010\u001b\u001a\b\u0012\u0004\u0012\u00028\u00000\u001c2\u0006\u0010\u001f\u001a\u00020\tH\u0002J\u001d\u0010 \u001a\u00020\u00172\u0006\u0010\u001e\u001a\u00020\t2\u0006\u0010\u0015\u001a\u00028\u0000H\u0002¢\u0006\u0002\u0010\u0019J\f\u0010!\u001a\b\u0012\u0004\u0012\u00028\u00000\"J\b\u0010#\u001a\u00020\u0017H\u0002J\b\u0010$\u001a\u00020\u0017H\u0016J\u0014\u0010%\u001a\u00020\u000f2\n\u0010&\u001a\u0006\u0012\u0002\b\u00030\"H\u0002J\u0010\u0010'\u001a\u00020\u00172\u0006\u0010(\u001a\u00020\tH\u0002J\u0010\u0010)\u001a\u00020\u00172\u0006\u0010\u001f\u001a\u00020\tH\u0002J\u0013\u0010*\u001a\u00020\u000f2\b\u0010&\u001a\u0004\u0018\u00010+H\u0002J\u0016\u0010,\u001a\u00028\u00002\u0006\u0010\u0018\u001a\u00020\tH\u0002¢\u0006\u0002\u0010-J\b\u0010.\u001a\u00020\tH\u0016J\u0015\u0010/\u001a\u00020\t2\u0006\u0010\u0015\u001a\u00028\u0000H\u0016¢\u0006\u0002\u00100J\u0018\u00101\u001a\u00020\u00172\u0006\u0010\u001e\u001a\u00020\t2\u0006\u0010\u001f\u001a\u00020\tH\u0002J\b\u00102\u001a\u00020\u000fH\u0016J\u000f\u00103\u001a\b\u0012\u0004\u0012\u00028\u000004H\u0002J\u0015\u00105\u001a\u00020\t2\u0006\u0010\u0015\u001a\u00028\u0000H\u0016¢\u0006\u0002\u00100J\u000e\u00106\u001a\b\u0012\u0004\u0012\u00028\u000007H\u0016J\u0016\u00106\u001a\b\u0012\u0004\u0012\u00028\u0000072\u0006\u0010\u0018\u001a\u00020\tH\u0016J\b\u00108\u001a\u00020\u0017H\u0002J\u0015\u00109\u001a\u00020\u000f2\u0006\u0010\u0015\u001a\u00028\u0000H\u0016¢\u0006\u0002\u0010\u0016J\u0016\u0010:\u001a\u00020\u000f2\f\u0010\u001b\u001a\b\u0012\u0004\u0012\u00028\u00000\u001cH\u0016J\u0015\u0010;\u001a\u00028\u00002\u0006\u0010\u0018\u001a\u00020\tH\u0016¢\u0006\u0002\u0010-J\u0015\u0010<\u001a\u00028\u00002\u0006\u0010\u001e\u001a\u00020\tH\u0002¢\u0006\u0002\u0010-J\u0018\u0010=\u001a\u00020\u00172\u0006\u0010>\u001a\u00020\t2\u0006\u0010?\u001a\u00020\tH\u0002J\u0016\u0010@\u001a\u00020\u000f2\f\u0010\u001b\u001a\b\u0012\u0004\u0012\u00028\u00000\u001cH\u0016J.\u0010A\u001a\u00020\t2\u0006\u0010>\u001a\u00020\t2\u0006\u0010?\u001a\u00020\t2\f\u0010\u001b\u001a\b\u0012\u0004\u0012\u00028\u00000\u001c2\u0006\u0010B\u001a\u00020\u000fH\u0002J\u001e\u0010C\u001a\u00028\u00002\u0006\u0010\u0018\u001a\u00020\t2\u0006\u0010\u0015\u001a\u00028\u0000H\u0002¢\u0006\u0002\u0010DJ\u001e\u0010E\u001a\b\u0012\u0004\u0012\u00028\u00000\u00022\u0006\u0010F\u001a\u00020\t2\u0006\u0010G\u001a\u00020\tH\u0016J\u0015\u0010H\u001a\n\u0012\u0006\u0012\u0004\u0018\u00010+0\fH\u0016¢\u0006\u0002\u0010IJ'\u0010H\u001a\b\u0012\u0004\u0012\u0002HJ0\f\"\u0004\b\u0001\u0010J2\f\u0010K\u001a\b\u0012\u0004\u0012\u0002HJ0\fH\u0016¢\u0006\u0002\u0010LJ\b\u0010M\u001a\u00020NH\u0016J\b\u0010O\u001a\u00020+H\u0002R\u0016\u0010\u000b\u001a\b\u0012\u0004\u0012\u00028\u00000\fX\u000e¢\u0006\u0004\n\u0002\u0010\rR\u000e\u0010\u000e\u001a\u00020\u000fX\u000e¢\u0006\u0002\n\u0000R\u000e\u0010\u0010\u001a\u00020\tX\u000e¢\u0006\u0002\n\u0000R\u0014\u0010\u0011\u001a\u00020\t8VX\u0004¢\u0006\u0006\u001a\u0004\b\u0012\u0010\u0013¨\u0006S"}, d2 = {"Lkotlin/collections/builders/ListBuilder;", "E", "", "Ljava/util/RandomAccess;", "Lkotlin/collections/RandomAccess;", "Lkotlin/collections/AbstractMutableList;", "Ljava/io/Serializable;", "Lkotlin/io/Serializable;", "initialCapacity", "", "(I)V", "backing", "", "[Ljava/lang/Object;", "isReadOnly", "", "length", "size", "getSize", "()I", "add", "element", "(Ljava/lang/Object;)Z", "", "index", "(ILjava/lang/Object;)V", "addAll", "elements", "", "addAllInternal", "i", "n", "addAtInternal", "build", "", "checkIsMutable", "clear", "contentEquals", "other", "ensureCapacityInternal", "minCapacity", "ensureExtraCapacity", "equals", "", "get", "(I)Ljava/lang/Object;", "hashCode", "indexOf", "(Ljava/lang/Object;)I", "insertAtInternal", "isEmpty", "iterator", "", "lastIndexOf", "listIterator", "", "registerModification", "remove", "removeAll", "removeAt", "removeAtInternal", "removeRangeInternal", "rangeOffset", "rangeLength", "retainAll", "retainOrRemoveAllInternal", "retain", "set", "(ILjava/lang/Object;)Ljava/lang/Object;", "subList", "fromIndex", "toIndex", "toArray", "()[Ljava/lang/Object;", "T", "array", "([Ljava/lang/Object;)[Ljava/lang/Object;", "toString", "", "writeReplace", "BuilderSubList", "Companion", "Itr", "kotlin-stdlib"}, k = 1, mv = {1, 9, 0}, xi = 48)
/* compiled from: ListBuilder.kt */
public final class ListBuilder<E> extends AbstractMutableList<E> implements List<E>, RandomAccess, Serializable, KMutableList {
    private static final Companion Companion = new Companion((DefaultConstructorMarker) null);
    private static final ListBuilder Empty;
    /* access modifiers changed from: private */
    public E[] backing;
    /* access modifiers changed from: private */
    public boolean isReadOnly;
    /* access modifiers changed from: private */
    public int length;

    public ListBuilder() {
        this(0, 1, (DefaultConstructorMarker) null);
    }

    public ListBuilder(int initialCapacity) {
        this.backing = ListBuilderKt.arrayOfUninitializedElements(initialCapacity);
    }

    /* JADX INFO: this call moved to the top of the method (can break code semantics) */
    public /* synthetic */ ListBuilder(int i, int i2, DefaultConstructorMarker defaultConstructorMarker) {
        this((i2 & 1) != 0 ? 10 : i);
    }

    @Metadata(d1 = {"\u0000\u0016\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0010\u0001\n\u0000\b\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002¢\u0006\u0002\u0010\u0002R\u0014\u0010\u0003\u001a\b\u0012\u0004\u0012\u00020\u00050\u0004X\u0004¢\u0006\u0002\n\u0000¨\u0006\u0006"}, d2 = {"Lkotlin/collections/builders/ListBuilder$Companion;", "", "()V", "Empty", "Lkotlin/collections/builders/ListBuilder;", "", "kotlin-stdlib"}, k = 1, mv = {1, 9, 0}, xi = 48)
    /* compiled from: ListBuilder.kt */
    private static final class Companion {
        public /* synthetic */ Companion(DefaultConstructorMarker defaultConstructorMarker) {
            this();
        }

        private Companion() {
        }
    }

    static {
        ListBuilder it = new ListBuilder(0);
        it.isReadOnly = true;
        Empty = it;
    }

    public final List<E> build() {
        checkIsMutable();
        this.isReadOnly = true;
        return this.length > 0 ? this : Empty;
    }

    private final Object writeReplace() {
        if (this.isReadOnly) {
            return new SerializedCollection(this, 0);
        }
        throw new NotSerializableException("The list cannot be serialized while it is being built.");
    }

    public int getSize() {
        return this.length;
    }

    public boolean isEmpty() {
        return this.length == 0;
    }

    public E get(int index) {
        AbstractList.Companion.checkElementIndex$kotlin_stdlib(index, this.length);
        return this.backing[index];
    }

    public E set(int index, E element) {
        checkIsMutable();
        AbstractList.Companion.checkElementIndex$kotlin_stdlib(index, this.length);
        Object old = this.backing[index];
        this.backing[index] = element;
        return old;
    }

    public int indexOf(Object element) {
        for (int i = 0; i < this.length; i++) {
            if (Intrinsics.areEqual((Object) this.backing[i], element)) {
                return i;
            }
        }
        return -1;
    }

    public int lastIndexOf(Object element) {
        for (int i = this.length - 1; i >= 0; i--) {
            if (Intrinsics.areEqual((Object) this.backing[i], element)) {
                return i;
            }
        }
        return -1;
    }

    public Iterator<E> iterator() {
        return listIterator(0);
    }

    public ListIterator<E> listIterator() {
        return listIterator(0);
    }

    public ListIterator<E> listIterator(int index) {
        AbstractList.Companion.checkPositionIndex$kotlin_stdlib(index, this.length);
        return new Itr<>(this, index);
    }

    public boolean add(E element) {
        checkIsMutable();
        addAtInternal(this.length, element);
        return true;
    }

    public void add(int index, E element) {
        checkIsMutable();
        AbstractList.Companion.checkPositionIndex$kotlin_stdlib(index, this.length);
        addAtInternal(index, element);
    }

    public boolean addAll(Collection<? extends E> elements) {
        Intrinsics.checkNotNullParameter(elements, "elements");
        checkIsMutable();
        int n = elements.size();
        addAllInternal(this.length, elements, n);
        return n > 0;
    }

    public boolean addAll(int index, Collection<? extends E> elements) {
        Intrinsics.checkNotNullParameter(elements, "elements");
        checkIsMutable();
        AbstractList.Companion.checkPositionIndex$kotlin_stdlib(index, this.length);
        int n = elements.size();
        addAllInternal(index, elements, n);
        return n > 0;
    }

    public void clear() {
        checkIsMutable();
        removeRangeInternal(0, this.length);
    }

    public E removeAt(int index) {
        checkIsMutable();
        AbstractList.Companion.checkElementIndex$kotlin_stdlib(index, this.length);
        return removeAtInternal(index);
    }

    public boolean remove(Object element) {
        checkIsMutable();
        int i = indexOf(element);
        if (i >= 0) {
            remove(i);
        }
        return i >= 0;
    }

    public boolean removeAll(Collection<? extends Object> elements) {
        Intrinsics.checkNotNullParameter(elements, "elements");
        checkIsMutable();
        return retainOrRemoveAllInternal(0, this.length, elements, false) > 0;
    }

    public boolean retainAll(Collection<? extends Object> elements) {
        Intrinsics.checkNotNullParameter(elements, "elements");
        checkIsMutable();
        return retainOrRemoveAllInternal(0, this.length, elements, true) > 0;
    }

    public List<E> subList(int fromIndex, int toIndex) {
        AbstractList.Companion.checkRangeIndexes$kotlin_stdlib(fromIndex, toIndex, this.length);
        return new BuilderSubList<>(this.backing, fromIndex, toIndex - fromIndex, (BuilderSubList) null, this);
    }

    public <T> T[] toArray(T[] array) {
        Intrinsics.checkNotNullParameter(array, "array");
        if (array.length < this.length) {
            T[] copyOfRange = Arrays.copyOfRange(this.backing, 0, this.length, array.getClass());
            Intrinsics.checkNotNullExpressionValue(copyOfRange, "copyOfRange(...)");
            return copyOfRange;
        }
        ArraysKt.copyInto((T[]) this.backing, array, 0, 0, this.length);
        return CollectionsKt.terminateCollectionToArray(this.length, array);
    }

    public Object[] toArray() {
        return ArraysKt.copyOfRange((T[]) this.backing, 0, this.length);
    }

    public boolean equals(Object other) {
        return other == this || ((other instanceof List) && contentEquals((List) other));
    }

    public int hashCode() {
        return ListBuilderKt.subarrayContentHashCode(this.backing, 0, this.length);
    }

    public String toString() {
        return ListBuilderKt.subarrayContentToString(this.backing, 0, this.length, this);
    }

    private final void registerModification() {
        this.modCount++;
    }

    private final void checkIsMutable() {
        if (this.isReadOnly) {
            throw new UnsupportedOperationException();
        }
    }

    private final void ensureExtraCapacity(int n) {
        ensureCapacityInternal(this.length + n);
    }

    private final void ensureCapacityInternal(int minCapacity) {
        if (minCapacity < 0) {
            throw new OutOfMemoryError();
        } else if (minCapacity > this.backing.length) {
            this.backing = ListBuilderKt.copyOfUninitializedElements(this.backing, AbstractList.Companion.newCapacity$kotlin_stdlib(this.backing.length, minCapacity));
        }
    }

    private final boolean contentEquals(List<?> other) {
        return ListBuilderKt.subarrayContentEquals(this.backing, 0, this.length, other);
    }

    private final void insertAtInternal(int i, int n) {
        ensureExtraCapacity(n);
        ArraysKt.copyInto((T[]) this.backing, (T[]) this.backing, i + n, i, this.length);
        this.length += n;
    }

    /* access modifiers changed from: private */
    public final void addAtInternal(int i, E element) {
        registerModification();
        insertAtInternal(i, 1);
        this.backing[i] = element;
    }

    /* access modifiers changed from: private */
    public final void addAllInternal(int i, Collection<? extends E> elements, int n) {
        registerModification();
        insertAtInternal(i, n);
        Iterator it = elements.iterator();
        for (int j = 0; j < n; j++) {
            this.backing[i + j] = it.next();
        }
    }

    /* access modifiers changed from: private */
    public final E removeAtInternal(int i) {
        registerModification();
        Object old = this.backing[i];
        ArraysKt.copyInto((T[]) this.backing, (T[]) this.backing, i, i + 1, this.length);
        ListBuilderKt.resetAt(this.backing, this.length - 1);
        this.length--;
        return old;
    }

    /* access modifiers changed from: private */
    public final void removeRangeInternal(int rangeOffset, int rangeLength) {
        if (rangeLength > 0) {
            registerModification();
        }
        ArraysKt.copyInto((T[]) this.backing, (T[]) this.backing, rangeOffset, rangeOffset + rangeLength, this.length);
        ListBuilderKt.resetRange(this.backing, this.length - rangeLength, this.length);
        this.length -= rangeLength;
    }

    /* access modifiers changed from: private */
    public final int retainOrRemoveAllInternal(int rangeOffset, int rangeLength, Collection<? extends E> elements, boolean retain) {
        int i = 0;
        int j = 0;
        while (i < rangeLength) {
            if (elements.contains(this.backing[rangeOffset + i]) == retain) {
                this.backing[j + rangeOffset] = this.backing[i + rangeOffset];
                j++;
                i++;
            } else {
                i++;
            }
        }
        int removed = rangeLength - j;
        ArraysKt.copyInto((T[]) this.backing, (T[]) this.backing, rangeOffset + j, rangeOffset + rangeLength, this.length);
        ListBuilderKt.resetRange(this.backing, this.length - removed, this.length);
        if (removed > 0) {
            registerModification();
        }
        this.length -= removed;
        return removed;
    }

    @Metadata(d1 = {"\u0000*\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010+\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\u0004\n\u0002\u0010\u0002\n\u0002\b\u0004\n\u0002\u0010\u000b\n\u0002\b\t\b\u0002\u0018\u0000*\u0004\b\u0001\u0010\u00012\b\u0012\u0004\u0012\u0002H\u00010\u0002B\u001b\u0012\f\u0010\u0003\u001a\b\u0012\u0004\u0012\u00028\u00010\u0004\u0012\u0006\u0010\u0005\u001a\u00020\u0006¢\u0006\u0002\u0010\u0007J\u0015\u0010\n\u001a\u00020\u000b2\u0006\u0010\f\u001a\u00028\u0001H\u0016¢\u0006\u0002\u0010\rJ\b\u0010\u000e\u001a\u00020\u000bH\u0002J\t\u0010\u000f\u001a\u00020\u0010H\u0002J\b\u0010\u0011\u001a\u00020\u0010H\u0016J\u000e\u0010\u0012\u001a\u00028\u0001H\u0002¢\u0006\u0002\u0010\u0013J\b\u0010\u0014\u001a\u00020\u0006H\u0016J\r\u0010\u0015\u001a\u00028\u0001H\u0016¢\u0006\u0002\u0010\u0013J\b\u0010\u0016\u001a\u00020\u0006H\u0016J\b\u0010\u0017\u001a\u00020\u000bH\u0016J\u0015\u0010\u0018\u001a\u00020\u000b2\u0006\u0010\f\u001a\u00028\u0001H\u0016¢\u0006\u0002\u0010\rR\u000e\u0010\b\u001a\u00020\u0006X\u000e¢\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u000e¢\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\u0006X\u000e¢\u0006\u0002\n\u0000R\u0014\u0010\u0003\u001a\b\u0012\u0004\u0012\u00028\u00010\u0004X\u0004¢\u0006\u0002\n\u0000¨\u0006\u0019"}, d2 = {"Lkotlin/collections/builders/ListBuilder$Itr;", "E", "", "list", "Lkotlin/collections/builders/ListBuilder;", "index", "", "(Lkotlin/collections/builders/ListBuilder;I)V", "expectedModCount", "lastIndex", "add", "", "element", "(Ljava/lang/Object;)V", "checkForComodification", "hasNext", "", "hasPrevious", "next", "()Ljava/lang/Object;", "nextIndex", "previous", "previousIndex", "remove", "set", "kotlin-stdlib"}, k = 1, mv = {1, 9, 0}, xi = 48)
    /* compiled from: ListBuilder.kt */
    private static final class Itr<E> implements ListIterator<E>, KMutableListIterator {
        private int expectedModCount = this.list.modCount;
        private int index;
        private int lastIndex = -1;
        private final ListBuilder<E> list;

        public Itr(ListBuilder<E> list2, int index2) {
            Intrinsics.checkNotNullParameter(list2, "list");
            this.list = list2;
            this.index = index2;
        }

        public boolean hasPrevious() {
            return this.index > 0;
        }

        public boolean hasNext() {
            return this.index < this.list.length;
        }

        public int previousIndex() {
            return this.index - 1;
        }

        public int nextIndex() {
            return this.index;
        }

        public E previous() {
            checkForComodification();
            if (this.index > 0) {
                this.index--;
                this.lastIndex = this.index;
                return this.list.backing[this.lastIndex];
            }
            throw new NoSuchElementException();
        }

        public E next() {
            checkForComodification();
            if (this.index < this.list.length) {
                int i = this.index;
                this.index = i + 1;
                this.lastIndex = i;
                return this.list.backing[this.lastIndex];
            }
            throw new NoSuchElementException();
        }

        public void set(E element) {
            checkForComodification();
            if (this.lastIndex != -1) {
                this.list.set(this.lastIndex, element);
                return;
            }
            throw new IllegalStateException("Call next() or previous() before replacing element from the iterator.".toString());
        }

        public void add(E element) {
            checkForComodification();
            ListBuilder<E> listBuilder = this.list;
            int i = this.index;
            this.index = i + 1;
            listBuilder.add(i, element);
            this.lastIndex = -1;
            this.expectedModCount = this.list.modCount;
        }

        public void remove() {
            checkForComodification();
            if (this.lastIndex != -1) {
                this.list.remove(this.lastIndex);
                this.index = this.lastIndex;
                this.lastIndex = -1;
                this.expectedModCount = this.list.modCount;
                return;
            }
            throw new IllegalStateException("Call next() or previous() before removing element from the iterator.".toString());
        }

        private final void checkForComodification() {
            if (this.list.modCount != this.expectedModCount) {
                throw new ConcurrentModificationException();
            }
        }
    }

    @Metadata(d1 = {"\u0000t\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010!\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0011\n\u0000\n\u0002\u0010\b\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u000b\n\u0002\b\u0007\n\u0002\u0010\u0002\n\u0002\b\u0004\n\u0002\u0010\u001e\n\u0002\b\t\n\u0002\u0010 \n\u0000\n\u0002\u0010\u0000\n\u0002\b\u0007\n\u0002\u0010)\n\u0002\b\u0002\n\u0002\u0010+\n\u0002\b\u0016\n\u0002\u0010\u000e\n\u0002\b\u0003\u0018\u0000*\u0004\b\u0001\u0010\u00012\b\u0012\u0004\u0012\u0002H\u00010\u00022\u00060\u0003j\u0002`\u00042\b\u0012\u0004\u0012\u0002H\u00010\u00052\u00060\u0006j\u0002`\u0007:\u0001PBA\u0012\f\u0010\b\u001a\b\u0012\u0004\u0012\u00028\u00010\t\u0012\u0006\u0010\n\u001a\u00020\u000b\u0012\u0006\u0010\f\u001a\u00020\u000b\u0012\u000e\u0010\r\u001a\n\u0012\u0004\u0012\u00028\u0001\u0018\u00010\u0000\u0012\f\u0010\u000e\u001a\b\u0012\u0004\u0012\u00028\u00010\u000f¢\u0006\u0002\u0010\u0010J\u0015\u0010\u0018\u001a\u00020\u00132\u0006\u0010\u0019\u001a\u00028\u0001H\u0016¢\u0006\u0002\u0010\u001aJ\u001d\u0010\u0018\u001a\u00020\u001b2\u0006\u0010\u001c\u001a\u00020\u000b2\u0006\u0010\u0019\u001a\u00028\u0001H\u0016¢\u0006\u0002\u0010\u001dJ\u001e\u0010\u001e\u001a\u00020\u00132\u0006\u0010\u001c\u001a\u00020\u000b2\f\u0010\u001f\u001a\b\u0012\u0004\u0012\u00028\u00010 H\u0016J\u0016\u0010\u001e\u001a\u00020\u00132\f\u0010\u001f\u001a\b\u0012\u0004\u0012\u00028\u00010 H\u0016J&\u0010!\u001a\u00020\u001b2\u0006\u0010\"\u001a\u00020\u000b2\f\u0010\u001f\u001a\b\u0012\u0004\u0012\u00028\u00010 2\u0006\u0010#\u001a\u00020\u000bH\u0002J\u001d\u0010$\u001a\u00020\u001b2\u0006\u0010\"\u001a\u00020\u000b2\u0006\u0010\u0019\u001a\u00028\u0001H\u0002¢\u0006\u0002\u0010\u001dJ\b\u0010%\u001a\u00020\u001bH\u0002J\b\u0010&\u001a\u00020\u001bH\u0002J\b\u0010'\u001a\u00020\u001bH\u0016J\u0014\u0010(\u001a\u00020\u00132\n\u0010)\u001a\u0006\u0012\u0002\b\u00030*H\u0002J\u0013\u0010+\u001a\u00020\u00132\b\u0010)\u001a\u0004\u0018\u00010,H\u0002J\u0016\u0010-\u001a\u00028\u00012\u0006\u0010\u001c\u001a\u00020\u000bH\u0002¢\u0006\u0002\u0010.J\b\u0010/\u001a\u00020\u000bH\u0016J\u0015\u00100\u001a\u00020\u000b2\u0006\u0010\u0019\u001a\u00028\u0001H\u0016¢\u0006\u0002\u00101J\b\u00102\u001a\u00020\u0013H\u0016J\u000f\u00103\u001a\b\u0012\u0004\u0012\u00028\u000104H\u0002J\u0015\u00105\u001a\u00020\u000b2\u0006\u0010\u0019\u001a\u00028\u0001H\u0016¢\u0006\u0002\u00101J\u000e\u00106\u001a\b\u0012\u0004\u0012\u00028\u000107H\u0016J\u0016\u00106\u001a\b\u0012\u0004\u0012\u00028\u0001072\u0006\u0010\u001c\u001a\u00020\u000bH\u0016J\b\u00108\u001a\u00020\u001bH\u0002J\u0015\u00109\u001a\u00020\u00132\u0006\u0010\u0019\u001a\u00028\u0001H\u0016¢\u0006\u0002\u0010\u001aJ\u0016\u0010:\u001a\u00020\u00132\f\u0010\u001f\u001a\b\u0012\u0004\u0012\u00028\u00010 H\u0016J\u0015\u0010;\u001a\u00028\u00012\u0006\u0010\u001c\u001a\u00020\u000bH\u0016¢\u0006\u0002\u0010.J\u0015\u0010<\u001a\u00028\u00012\u0006\u0010\"\u001a\u00020\u000bH\u0002¢\u0006\u0002\u0010.J\u0018\u0010=\u001a\u00020\u001b2\u0006\u0010>\u001a\u00020\u000b2\u0006\u0010?\u001a\u00020\u000bH\u0002J\u0016\u0010@\u001a\u00020\u00132\f\u0010\u001f\u001a\b\u0012\u0004\u0012\u00028\u00010 H\u0016J.\u0010A\u001a\u00020\u000b2\u0006\u0010>\u001a\u00020\u000b2\u0006\u0010?\u001a\u00020\u000b2\f\u0010\u001f\u001a\b\u0012\u0004\u0012\u00028\u00010 2\u0006\u0010B\u001a\u00020\u0013H\u0002J\u001e\u0010C\u001a\u00028\u00012\u0006\u0010\u001c\u001a\u00020\u000b2\u0006\u0010\u0019\u001a\u00028\u0001H\u0002¢\u0006\u0002\u0010DJ\u001e\u0010E\u001a\b\u0012\u0004\u0012\u00028\u00010\u00022\u0006\u0010F\u001a\u00020\u000b2\u0006\u0010G\u001a\u00020\u000bH\u0016J\u0015\u0010H\u001a\n\u0012\u0006\u0012\u0004\u0018\u00010,0\tH\u0016¢\u0006\u0002\u0010IJ'\u0010H\u001a\b\u0012\u0004\u0012\u0002HJ0\t\"\u0004\b\u0002\u0010J2\f\u0010K\u001a\b\u0012\u0004\u0012\u0002HJ0\tH\u0016¢\u0006\u0002\u0010LJ\b\u0010M\u001a\u00020NH\u0016J\b\u0010O\u001a\u00020,H\u0002R\u0016\u0010\b\u001a\b\u0012\u0004\u0012\u00028\u00010\tX\u000e¢\u0006\u0004\n\u0002\u0010\u0011R\u0014\u0010\u0012\u001a\u00020\u00138BX\u0004¢\u0006\u0006\u001a\u0004\b\u0012\u0010\u0014R\u000e\u0010\f\u001a\u00020\u000bX\u000e¢\u0006\u0002\n\u0000R\u000e\u0010\n\u001a\u00020\u000bX\u0004¢\u0006\u0002\n\u0000R\u0016\u0010\r\u001a\n\u0012\u0004\u0012\u00028\u0001\u0018\u00010\u0000X\u0004¢\u0006\u0002\n\u0000R\u0014\u0010\u000e\u001a\b\u0012\u0004\u0012\u00028\u00010\u000fX\u0004¢\u0006\u0002\n\u0000R\u0014\u0010\u0015\u001a\u00020\u000b8VX\u0004¢\u0006\u0006\u001a\u0004\b\u0016\u0010\u0017¨\u0006Q"}, d2 = {"Lkotlin/collections/builders/ListBuilder$BuilderSubList;", "E", "", "Ljava/util/RandomAccess;", "Lkotlin/collections/RandomAccess;", "Lkotlin/collections/AbstractMutableList;", "Ljava/io/Serializable;", "Lkotlin/io/Serializable;", "backing", "", "offset", "", "length", "parent", "root", "Lkotlin/collections/builders/ListBuilder;", "([Ljava/lang/Object;IILkotlin/collections/builders/ListBuilder$BuilderSubList;Lkotlin/collections/builders/ListBuilder;)V", "[Ljava/lang/Object;", "isReadOnly", "", "()Z", "size", "getSize", "()I", "add", "element", "(Ljava/lang/Object;)Z", "", "index", "(ILjava/lang/Object;)V", "addAll", "elements", "", "addAllInternal", "i", "n", "addAtInternal", "checkForComodification", "checkIsMutable", "clear", "contentEquals", "other", "", "equals", "", "get", "(I)Ljava/lang/Object;", "hashCode", "indexOf", "(Ljava/lang/Object;)I", "isEmpty", "iterator", "", "lastIndexOf", "listIterator", "", "registerModification", "remove", "removeAll", "removeAt", "removeAtInternal", "removeRangeInternal", "rangeOffset", "rangeLength", "retainAll", "retainOrRemoveAllInternal", "retain", "set", "(ILjava/lang/Object;)Ljava/lang/Object;", "subList", "fromIndex", "toIndex", "toArray", "()[Ljava/lang/Object;", "T", "array", "([Ljava/lang/Object;)[Ljava/lang/Object;", "toString", "", "writeReplace", "Itr", "kotlin-stdlib"}, k = 1, mv = {1, 9, 0}, xi = 48)
    /* compiled from: ListBuilder.kt */
    public static final class BuilderSubList<E> extends AbstractMutableList<E> implements List<E>, RandomAccess, Serializable, KMutableList {
        /* access modifiers changed from: private */
        public E[] backing;
        /* access modifiers changed from: private */
        public int length;
        /* access modifiers changed from: private */
        public final int offset;
        private final BuilderSubList<E> parent;
        /* access modifiers changed from: private */
        public final ListBuilder<E> root;

        public BuilderSubList(E[] backing2, int offset2, int length2, BuilderSubList<E> parent2, ListBuilder<E> root2) {
            Intrinsics.checkNotNullParameter(backing2, "backing");
            Intrinsics.checkNotNullParameter(root2, "root");
            this.backing = backing2;
            this.offset = offset2;
            this.length = length2;
            this.parent = parent2;
            this.root = root2;
            this.modCount = this.root.modCount;
        }

        private final Object writeReplace() {
            if (isReadOnly()) {
                return new SerializedCollection(this, 0);
            }
            throw new NotSerializableException("The list cannot be serialized while it is being built.");
        }

        public int getSize() {
            checkForComodification();
            return this.length;
        }

        public boolean isEmpty() {
            checkForComodification();
            return this.length == 0;
        }

        public E get(int index) {
            checkForComodification();
            AbstractList.Companion.checkElementIndex$kotlin_stdlib(index, this.length);
            return this.backing[this.offset + index];
        }

        public E set(int index, E element) {
            checkIsMutable();
            checkForComodification();
            AbstractList.Companion.checkElementIndex$kotlin_stdlib(index, this.length);
            Object old = this.backing[this.offset + index];
            this.backing[this.offset + index] = element;
            return old;
        }

        public int indexOf(Object element) {
            checkForComodification();
            for (int i = 0; i < this.length; i++) {
                if (Intrinsics.areEqual((Object) this.backing[this.offset + i], element)) {
                    return i;
                }
            }
            return -1;
        }

        public int lastIndexOf(Object element) {
            checkForComodification();
            for (int i = this.length - 1; i >= 0; i--) {
                if (Intrinsics.areEqual((Object) this.backing[this.offset + i], element)) {
                    return i;
                }
            }
            return -1;
        }

        public Iterator<E> iterator() {
            return listIterator(0);
        }

        public ListIterator<E> listIterator() {
            return listIterator(0);
        }

        public ListIterator<E> listIterator(int index) {
            checkForComodification();
            AbstractList.Companion.checkPositionIndex$kotlin_stdlib(index, this.length);
            return new Itr<>(this, index);
        }

        public boolean add(E element) {
            checkIsMutable();
            checkForComodification();
            addAtInternal(this.offset + this.length, element);
            return true;
        }

        public void add(int index, E element) {
            checkIsMutable();
            checkForComodification();
            AbstractList.Companion.checkPositionIndex$kotlin_stdlib(index, this.length);
            addAtInternal(this.offset + index, element);
        }

        public boolean addAll(Collection<? extends E> elements) {
            Intrinsics.checkNotNullParameter(elements, "elements");
            checkIsMutable();
            checkForComodification();
            int n = elements.size();
            addAllInternal(this.offset + this.length, elements, n);
            return n > 0;
        }

        public boolean addAll(int index, Collection<? extends E> elements) {
            Intrinsics.checkNotNullParameter(elements, "elements");
            checkIsMutable();
            checkForComodification();
            AbstractList.Companion.checkPositionIndex$kotlin_stdlib(index, this.length);
            int n = elements.size();
            addAllInternal(this.offset + index, elements, n);
            return n > 0;
        }

        public void clear() {
            checkIsMutable();
            checkForComodification();
            removeRangeInternal(this.offset, this.length);
        }

        public E removeAt(int index) {
            checkIsMutable();
            checkForComodification();
            AbstractList.Companion.checkElementIndex$kotlin_stdlib(index, this.length);
            return removeAtInternal(this.offset + index);
        }

        public boolean remove(Object element) {
            checkIsMutable();
            checkForComodification();
            int i = indexOf(element);
            if (i >= 0) {
                remove(i);
            }
            return i >= 0;
        }

        public boolean removeAll(Collection<? extends Object> elements) {
            Intrinsics.checkNotNullParameter(elements, "elements");
            checkIsMutable();
            checkForComodification();
            return retainOrRemoveAllInternal(this.offset, this.length, elements, false) > 0;
        }

        public boolean retainAll(Collection<? extends Object> elements) {
            Intrinsics.checkNotNullParameter(elements, "elements");
            checkIsMutable();
            checkForComodification();
            return retainOrRemoveAllInternal(this.offset, this.length, elements, true) > 0;
        }

        public List<E> subList(int fromIndex, int toIndex) {
            AbstractList.Companion.checkRangeIndexes$kotlin_stdlib(fromIndex, toIndex, this.length);
            return new BuilderSubList<>(this.backing, this.offset + fromIndex, toIndex - fromIndex, this, this.root);
        }

        public <T> T[] toArray(T[] array) {
            Intrinsics.checkNotNullParameter(array, "array");
            checkForComodification();
            if (array.length < this.length) {
                T[] copyOfRange = Arrays.copyOfRange(this.backing, this.offset, this.offset + this.length, array.getClass());
                Intrinsics.checkNotNullExpressionValue(copyOfRange, "copyOfRange(...)");
                return copyOfRange;
            }
            ArraysKt.copyInto((T[]) this.backing, array, 0, this.offset, this.offset + this.length);
            return CollectionsKt.terminateCollectionToArray(this.length, array);
        }

        public Object[] toArray() {
            checkForComodification();
            return ArraysKt.copyOfRange((T[]) this.backing, this.offset, this.offset + this.length);
        }

        public boolean equals(Object other) {
            checkForComodification();
            return other == this || ((other instanceof List) && contentEquals((List) other));
        }

        public int hashCode() {
            checkForComodification();
            return ListBuilderKt.subarrayContentHashCode(this.backing, this.offset, this.length);
        }

        public String toString() {
            checkForComodification();
            return ListBuilderKt.subarrayContentToString(this.backing, this.offset, this.length, this);
        }

        private final void registerModification() {
            this.modCount++;
        }

        private final void checkForComodification() {
            if (this.root.modCount != this.modCount) {
                throw new ConcurrentModificationException();
            }
        }

        private final void checkIsMutable() {
            if (isReadOnly()) {
                throw new UnsupportedOperationException();
            }
        }

        private final boolean isReadOnly() {
            return this.root.isReadOnly;
        }

        private final boolean contentEquals(List<?> other) {
            return ListBuilderKt.subarrayContentEquals(this.backing, this.offset, this.length, other);
        }

        private final void addAtInternal(int i, E element) {
            registerModification();
            if (this.parent != null) {
                this.parent.addAtInternal(i, element);
            } else {
                this.root.addAtInternal(i, element);
            }
            this.backing = this.root.backing;
            this.length++;
        }

        private final void addAllInternal(int i, Collection<? extends E> elements, int n) {
            registerModification();
            if (this.parent != null) {
                this.parent.addAllInternal(i, elements, n);
            } else {
                this.root.addAllInternal(i, elements, n);
            }
            this.backing = this.root.backing;
            this.length += n;
        }

        private final E removeAtInternal(int i) {
            Object old;
            registerModification();
            if (this.parent != null) {
                old = this.parent.removeAtInternal(i);
            } else {
                old = this.root.removeAtInternal(i);
            }
            this.length--;
            return old;
        }

        private final void removeRangeInternal(int rangeOffset, int rangeLength) {
            if (rangeLength > 0) {
                registerModification();
            }
            if (this.parent != null) {
                this.parent.removeRangeInternal(rangeOffset, rangeLength);
            } else {
                this.root.removeRangeInternal(rangeOffset, rangeLength);
            }
            this.length -= rangeLength;
        }

        private final int retainOrRemoveAllInternal(int rangeOffset, int rangeLength, Collection<? extends E> elements, boolean retain) {
            int removed;
            if (this.parent != null) {
                removed = this.parent.retainOrRemoveAllInternal(rangeOffset, rangeLength, elements, retain);
            } else {
                removed = this.root.retainOrRemoveAllInternal(rangeOffset, rangeLength, elements, retain);
            }
            if (removed > 0) {
                registerModification();
            }
            this.length -= removed;
            return removed;
        }

        @Metadata(d1 = {"\u0000*\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010+\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\u0004\n\u0002\u0010\u0002\n\u0002\b\u0004\n\u0002\u0010\u000b\n\u0002\b\t\b\u0002\u0018\u0000*\u0004\b\u0002\u0010\u00012\b\u0012\u0004\u0012\u0002H\u00010\u0002B\u001b\u0012\f\u0010\u0003\u001a\b\u0012\u0004\u0012\u00028\u00020\u0004\u0012\u0006\u0010\u0005\u001a\u00020\u0006¢\u0006\u0002\u0010\u0007J\u0015\u0010\n\u001a\u00020\u000b2\u0006\u0010\f\u001a\u00028\u0002H\u0016¢\u0006\u0002\u0010\rJ\b\u0010\u000e\u001a\u00020\u000bH\u0002J\t\u0010\u000f\u001a\u00020\u0010H\u0002J\b\u0010\u0011\u001a\u00020\u0010H\u0016J\u000e\u0010\u0012\u001a\u00028\u0002H\u0002¢\u0006\u0002\u0010\u0013J\b\u0010\u0014\u001a\u00020\u0006H\u0016J\r\u0010\u0015\u001a\u00028\u0002H\u0016¢\u0006\u0002\u0010\u0013J\b\u0010\u0016\u001a\u00020\u0006H\u0016J\b\u0010\u0017\u001a\u00020\u000bH\u0016J\u0015\u0010\u0018\u001a\u00020\u000b2\u0006\u0010\f\u001a\u00028\u0002H\u0016¢\u0006\u0002\u0010\rR\u000e\u0010\b\u001a\u00020\u0006X\u000e¢\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u000e¢\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\u0006X\u000e¢\u0006\u0002\n\u0000R\u0014\u0010\u0003\u001a\b\u0012\u0004\u0012\u00028\u00020\u0004X\u0004¢\u0006\u0002\n\u0000¨\u0006\u0019"}, d2 = {"Lkotlin/collections/builders/ListBuilder$BuilderSubList$Itr;", "E", "", "list", "Lkotlin/collections/builders/ListBuilder$BuilderSubList;", "index", "", "(Lkotlin/collections/builders/ListBuilder$BuilderSubList;I)V", "expectedModCount", "lastIndex", "add", "", "element", "(Ljava/lang/Object;)V", "checkForComodification", "hasNext", "", "hasPrevious", "next", "()Ljava/lang/Object;", "nextIndex", "previous", "previousIndex", "remove", "set", "kotlin-stdlib"}, k = 1, mv = {1, 9, 0}, xi = 48)
        /* compiled from: ListBuilder.kt */
        private static final class Itr<E> implements ListIterator<E>, KMutableListIterator {
            private int expectedModCount = this.list.modCount;
            private int index;
            private int lastIndex = -1;
            private final BuilderSubList<E> list;

            public Itr(BuilderSubList<E> list2, int index2) {
                Intrinsics.checkNotNullParameter(list2, "list");
                this.list = list2;
                this.index = index2;
            }

            public boolean hasPrevious() {
                return this.index > 0;
            }

            public boolean hasNext() {
                return this.index < this.list.length;
            }

            public int previousIndex() {
                return this.index - 1;
            }

            public int nextIndex() {
                return this.index;
            }

            public E previous() {
                checkForComodification();
                if (this.index > 0) {
                    this.index--;
                    this.lastIndex = this.index;
                    return this.list.backing[this.list.offset + this.lastIndex];
                }
                throw new NoSuchElementException();
            }

            public E next() {
                checkForComodification();
                if (this.index < this.list.length) {
                    int i = this.index;
                    this.index = i + 1;
                    this.lastIndex = i;
                    return this.list.backing[this.list.offset + this.lastIndex];
                }
                throw new NoSuchElementException();
            }

            public void set(E element) {
                checkForComodification();
                if (this.lastIndex != -1) {
                    this.list.set(this.lastIndex, element);
                    return;
                }
                throw new IllegalStateException("Call next() or previous() before replacing element from the iterator.".toString());
            }

            public void add(E element) {
                checkForComodification();
                BuilderSubList<E> builderSubList = this.list;
                int i = this.index;
                this.index = i + 1;
                builderSubList.add(i, element);
                this.lastIndex = -1;
                this.expectedModCount = this.list.modCount;
            }

            public void remove() {
                checkForComodification();
                if (this.lastIndex != -1) {
                    this.list.remove(this.lastIndex);
                    this.index = this.lastIndex;
                    this.lastIndex = -1;
                    this.expectedModCount = this.list.modCount;
                    return;
                }
                throw new IllegalStateException("Call next() or previous() before removing element from the iterator.".toString());
            }

            private final void checkForComodification() {
                if (this.list.root.modCount != this.expectedModCount) {
                    throw new ConcurrentModificationException();
                }
            }
        }
    }
}
