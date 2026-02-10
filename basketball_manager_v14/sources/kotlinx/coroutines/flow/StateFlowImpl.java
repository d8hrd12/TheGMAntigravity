package kotlinx.coroutines.flow;

import java.util.List;
import java.util.concurrent.atomic.AtomicReferenceFieldUpdater;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.collections.CollectionsKt;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.CoroutineContext;
import kotlinx.coroutines.channels.BufferOverflow;
import kotlinx.coroutines.flow.internal.AbstractSharedFlow;
import kotlinx.coroutines.flow.internal.FusibleFlow;
import kotlinx.coroutines.flow.internal.NullSurrogateKt;

@Metadata(d1 = {"\u0000v\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010 \n\u0002\b\u0003\n\u0002\u0010\b\n\u0002\b\u0005\n\u0002\u0010\u0001\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000b\n\u0002\b\u0005\n\u0002\u0010\u0011\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0007\b\u0002\u0018\u0000*\u0004\b\u0000\u0010\u00012\b\u0012\u0004\u0012\u00020\u00030\u00022\b\u0012\u0004\u0012\u0002H\u00010\u00042\b\u0012\u0004\u0012\u0002H\u00010\u00052\b\u0012\u0004\u0012\u0002H\u00010\u0006B\r\u0012\u0006\u0010\u0007\u001a\u00020\b¢\u0006\u0002\u0010\tJ\u001c\u0010\u0016\u001a\u00020\u00172\f\u0010\u0018\u001a\b\u0012\u0004\u0012\u00028\u00000\u0019H@¢\u0006\u0002\u0010\u001aJ\u001d\u0010\u001b\u001a\u00020\u001c2\u0006\u0010\u001d\u001a\u00028\u00002\u0006\u0010\u001e\u001a\u00028\u0000H\u0016¢\u0006\u0002\u0010\u001fJ\b\u0010 \u001a\u00020\u0003H\u0014J\u001d\u0010!\u001a\n\u0012\u0006\u0012\u0004\u0018\u00010\u00030\"2\u0006\u0010#\u001a\u00020\u0011H\u0014¢\u0006\u0002\u0010$J\u0016\u0010%\u001a\u00020&2\u0006\u0010\u0012\u001a\u00028\u0000H@¢\u0006\u0002\u0010'J&\u0010(\u001a\b\u0012\u0004\u0012\u00028\u00000)2\u0006\u0010*\u001a\u00020+2\u0006\u0010,\u001a\u00020\u00112\u0006\u0010-\u001a\u00020.H\u0016J\b\u0010/\u001a\u00020&H\u0016J\u0015\u00100\u001a\u00020\u001c2\u0006\u0010\u0012\u001a\u00028\u0000H\u0016¢\u0006\u0002\u00101J\u001a\u00102\u001a\u00020\u001c2\b\u00103\u001a\u0004\u0018\u00010\b2\u0006\u00104\u001a\u00020\bH\u0002R\u000f\u0010\n\u001a\b\u0012\u0004\u0012\u00020\b0\u000bX\u0004R\u001a\u0010\f\u001a\b\u0012\u0004\u0012\u00028\u00000\r8VX\u0004¢\u0006\u0006\u001a\u0004\b\u000e\u0010\u000fR\u000e\u0010\u0010\u001a\u00020\u0011X\u000e¢\u0006\u0002\n\u0000R$\u0010\u0012\u001a\u00028\u00002\u0006\u0010\u0012\u001a\u00028\u00008V@VX\u000e¢\u0006\f\u001a\u0004\b\u0013\u0010\u0014\"\u0004\b\u0015\u0010\t¨\u00065"}, d2 = {"Lkotlinx/coroutines/flow/StateFlowImpl;", "T", "Lkotlinx/coroutines/flow/internal/AbstractSharedFlow;", "Lkotlinx/coroutines/flow/StateFlowSlot;", "Lkotlinx/coroutines/flow/MutableStateFlow;", "Lkotlinx/coroutines/flow/CancellableFlow;", "Lkotlinx/coroutines/flow/internal/FusibleFlow;", "initialState", "", "(Ljava/lang/Object;)V", "_state", "Lkotlinx/atomicfu/AtomicRef;", "replayCache", "", "getReplayCache", "()Ljava/util/List;", "sequence", "", "value", "getValue", "()Ljava/lang/Object;", "setValue", "collect", "", "collector", "Lkotlinx/coroutines/flow/FlowCollector;", "(Lkotlinx/coroutines/flow/FlowCollector;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "compareAndSet", "", "expect", "update", "(Ljava/lang/Object;Ljava/lang/Object;)Z", "createSlot", "createSlotArray", "", "size", "(I)[Lkotlinx/coroutines/flow/StateFlowSlot;", "emit", "", "(Ljava/lang/Object;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "fuse", "Lkotlinx/coroutines/flow/Flow;", "context", "Lkotlin/coroutines/CoroutineContext;", "capacity", "onBufferOverflow", "Lkotlinx/coroutines/channels/BufferOverflow;", "resetReplayCache", "tryEmit", "(Ljava/lang/Object;)Z", "updateState", "expectedState", "newState", "kotlinx-coroutines-core"}, k = 1, mv = {1, 9, 0}, xi = 48)
/* compiled from: StateFlow.kt */
final class StateFlowImpl<T> extends AbstractSharedFlow<StateFlowSlot> implements MutableStateFlow<T>, CancellableFlow<T>, FusibleFlow<T> {
    /* access modifiers changed from: private */
    public static final /* synthetic */ AtomicReferenceFieldUpdater _state$volatile$FU = AtomicReferenceFieldUpdater.newUpdater(StateFlowImpl.class, Object.class, "_state$volatile");
    private volatile /* synthetic */ Object _state$volatile;
    private int sequence;

    private final /* synthetic */ Object get_state$volatile() {
        return this._state$volatile;
    }

    private final /* synthetic */ void set_state$volatile(Object obj) {
        this._state$volatile = obj;
    }

    public StateFlowImpl(Object initialState) {
        this._state$volatile = initialState;
    }

    public T getValue() {
        Object this_$iv = NullSurrogateKt.NULL;
        Object value$iv = _state$volatile$FU.get(this);
        if (value$iv == this_$iv) {
            return null;
        }
        return value$iv;
    }

    public void setValue(T value) {
        updateState((Object) null, value == null ? NullSurrogateKt.NULL : value);
    }

    public boolean compareAndSet(T expect, T update) {
        return updateState(expect == null ? NullSurrogateKt.NULL : expect, update == null ? NullSurrogateKt.NULL : update);
    }

    /* JADX WARNING: Code restructure failed: missing block: B:21:0x003f, code lost:
        r2 = (kotlinx.coroutines.flow.StateFlowSlot[]) r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x0043, code lost:
        if (r2 == null) goto L_0x0059;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0045, code lost:
        r4 = r2.length;
        r5 = 0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x0048, code lost:
        if (r5 >= r4) goto L_0x0059;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x004a, code lost:
        r9 = r2[r5];
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x004e, code lost:
        if (r9 == null) goto L_0x0053;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0050, code lost:
        r9.makePending();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x0053, code lost:
        r5 = r5 + 1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x005c, code lost:
        monitor-enter(r11);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:34:0x0060, code lost:
        if (r11.sequence != r0) goto L_0x0069;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:35:0x0062, code lost:
        r11.sequence = r0 + 1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x0067, code lost:
        monitor-exit(r11);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:37:0x0068, code lost:
        return true;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:39:?, code lost:
        r0 = r11.sequence;
        r1 = getSlots();
        r4 = kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:40:0x0074, code lost:
        monitor-exit(r11);
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private final boolean updateState(java.lang.Object r12, java.lang.Object r13) {
        /*
            r11 = this;
            r0 = 0
            r1 = 0
            r2 = 0
            r3 = 0
            monitor-enter(r11)
            r4 = 0
            java.util.concurrent.atomic.AtomicReferenceFieldUpdater r5 = _state$volatile$FU     // Catch:{ all -> 0x0081 }
            java.lang.Object r5 = r5.get(r11)     // Catch:{ all -> 0x0081 }
            r6 = 0
            if (r12 == 0) goto L_0x001a
            boolean r7 = kotlin.jvm.internal.Intrinsics.areEqual((java.lang.Object) r5, (java.lang.Object) r12)     // Catch:{ all -> 0x0081 }
            if (r7 != 0) goto L_0x001a
            monitor-exit(r11)
            return r6
        L_0x001a:
            boolean r7 = kotlin.jvm.internal.Intrinsics.areEqual((java.lang.Object) r5, (java.lang.Object) r13)     // Catch:{ all -> 0x0081 }
            r8 = 1
            if (r7 == 0) goto L_0x0023
            monitor-exit(r11)
            return r8
        L_0x0023:
            java.util.concurrent.atomic.AtomicReferenceFieldUpdater r7 = _state$volatile$FU     // Catch:{ all -> 0x0081 }
            r7.set(r11, r13)     // Catch:{ all -> 0x0081 }
            int r7 = r11.sequence     // Catch:{ all -> 0x0081 }
            r0 = r7
            r7 = r0 & 1
            if (r7 != 0) goto L_0x007a
            int r0 = r0 + 1
            r11.sequence = r0     // Catch:{ all -> 0x0081 }
            kotlinx.coroutines.flow.internal.AbstractSharedFlowSlot[] r7 = r11.getSlots()     // Catch:{ all -> 0x0081 }
            r1 = r7
            kotlin.Unit r4 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x0081 }
            monitor-exit(r11)
        L_0x003f:
            r2 = r1
            kotlinx.coroutines.flow.StateFlowSlot[] r2 = (kotlinx.coroutines.flow.StateFlowSlot[]) r2
            if (r2 == 0) goto L_0x0059
            r3 = 0
            int r4 = r2.length
            r5 = r6
        L_0x0048:
            if (r5 >= r4) goto L_0x0058
            r7 = r2[r5]
            r9 = r7
            r10 = 0
            if (r9 == 0) goto L_0x0053
            r9.makePending()
        L_0x0053:
            int r5 = r5 + 1
            goto L_0x0048
        L_0x0058:
        L_0x0059:
            r2 = 0
            r3 = 0
            monitor-enter(r11)
            r4 = 0
            int r5 = r11.sequence     // Catch:{ all -> 0x0077 }
            if (r5 != r0) goto L_0x0069
            int r5 = r0 + 1
            r11.sequence = r5     // Catch:{ all -> 0x0077 }
            monitor-exit(r11)
            return r8
        L_0x0069:
            int r5 = r11.sequence     // Catch:{ all -> 0x0077 }
            r0 = r5
            kotlinx.coroutines.flow.internal.AbstractSharedFlowSlot[] r5 = r11.getSlots()     // Catch:{ all -> 0x0077 }
            r1 = r5
            kotlin.Unit r4 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x0077 }
            monitor-exit(r11)
            goto L_0x003f
        L_0x0077:
            r4 = move-exception
            monitor-exit(r11)
            throw r4
        L_0x007a:
            int r6 = r0 + 2
            r11.sequence = r6     // Catch:{ all -> 0x0081 }
            monitor-exit(r11)
            return r8
        L_0x0081:
            r4 = move-exception
            monitor-exit(r11)
            throw r4
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.flow.StateFlowImpl.updateState(java.lang.Object, java.lang.Object):boolean");
    }

    public List<T> getReplayCache() {
        return CollectionsKt.listOf(getValue());
    }

    public boolean tryEmit(T value) {
        setValue(value);
        return true;
    }

    public Object emit(T value, Continuation<? super Unit> $completion) {
        setValue(value);
        return Unit.INSTANCE;
    }

    public void resetReplayCache() {
        throw new UnsupportedOperationException("MutableStateFlow.resetReplayCache is not supported");
    }

    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r11v8, resolved type: java.lang.Object} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r3v7, resolved type: kotlinx.coroutines.flow.StateFlowSlot} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r2v14, resolved type: java.lang.Object} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r5v6, resolved type: kotlinx.coroutines.flow.StateFlowImpl} */
    /* JADX WARNING: type inference failed for: r2v9, types: [kotlinx.coroutines.flow.internal.AbstractSharedFlowSlot] */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0093, code lost:
        r2 = (kotlinx.coroutines.Job) r0.getContext().get(kotlinx.coroutines.Job.Key);
        r4 = null;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x00a3, code lost:
        r6 = get_state$volatile$FU().get(r5);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x00ab, code lost:
        if (r2 == null) goto L_0x00b0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x00ad, code lost:
        kotlinx.coroutines.JobKt.ensureActive(r2);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x00b0, code lost:
        if (r4 == null) goto L_0x00b8;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:0x00b6, code lost:
        if (kotlin.jvm.internal.Intrinsics.areEqual(r4, r6) != false) goto L_0x00d9;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:35:0x00bb, code lost:
        if (r6 != kotlinx.coroutines.flow.internal.NullSurrogateKt.NULL) goto L_0x00bf;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x00bd, code lost:
        r8 = null;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:37:0x00bf, code lost:
        r8 = r6;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:38:0x00c0, code lost:
        r0.L$0 = r5;
        r0.L$1 = r11;
        r0.L$2 = r3;
        r0.L$3 = r2;
        r0.L$4 = r6;
        r0.label = 2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:39:0x00d1, code lost:
        if (r11.emit(r8, r0) != r1) goto L_0x00d4;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:40:0x00d3, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:41:0x00d4, code lost:
        r4 = r11;
        r11 = r6;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:42:0x00d6, code lost:
        r6 = r11;
        r11 = r4;
        r4 = r6;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:44:0x00dd, code lost:
        if (r3.takePending() != false) goto L_0x00a3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:45:0x00df, code lost:
        r0.L$0 = r5;
        r0.L$1 = r11;
        r0.L$2 = r3;
        r0.L$3 = r2;
        r0.L$4 = r4;
        r0.label = 3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:46:0x00f0, code lost:
        if (r3.awaitPending(r0) != r1) goto L_0x00a3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:47:0x00f2, code lost:
        return r1;
     */
    /* JADX WARNING: Incorrect type for immutable var: ssa=kotlinx.coroutines.flow.FlowCollector<? super T>, code=kotlinx.coroutines.flow.FlowCollector, for r11v0, types: [java.lang.Object, kotlinx.coroutines.flow.FlowCollector<? super T>] */
    /* JADX WARNING: Multi-variable type inference failed */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:14:0x0046  */
    /* JADX WARNING: Removed duplicated region for block: B:17:0x005d  */
    /* JADX WARNING: Removed duplicated region for block: B:20:0x006f  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public java.lang.Object collect(kotlinx.coroutines.flow.FlowCollector r11, kotlin.coroutines.Continuation<?> r12) {
        /*
            r10 = this;
            boolean r0 = r12 instanceof kotlinx.coroutines.flow.StateFlowImpl$collect$1
            if (r0 == 0) goto L_0x0014
            r0 = r12
            kotlinx.coroutines.flow.StateFlowImpl$collect$1 r0 = (kotlinx.coroutines.flow.StateFlowImpl$collect$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r12 = r0.label
            int r12 = r12 - r2
            r0.label = r12
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.flow.StateFlowImpl$collect$1 r0 = new kotlinx.coroutines.flow.StateFlowImpl$collect$1
            r0.<init>(r10, r12)
        L_0x0019:
            java.lang.Object r12 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x006f;
                case 1: goto L_0x005d;
                case 2: goto L_0x0046;
                case 3: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r11 = new java.lang.IllegalStateException
            java.lang.String r12 = "call to 'resume' before 'invoke' with coroutine"
            r11.<init>(r12)
            throw r11
        L_0x002c:
            java.lang.Object r11 = r0.L$4
            java.lang.Object r2 = r0.L$3
            kotlinx.coroutines.Job r2 = (kotlinx.coroutines.Job) r2
            java.lang.Object r3 = r0.L$2
            kotlinx.coroutines.flow.StateFlowSlot r3 = (kotlinx.coroutines.flow.StateFlowSlot) r3
            java.lang.Object r4 = r0.L$1
            kotlinx.coroutines.flow.FlowCollector r4 = (kotlinx.coroutines.flow.FlowCollector) r4
            java.lang.Object r5 = r0.L$0
            kotlinx.coroutines.flow.StateFlowImpl r5 = (kotlinx.coroutines.flow.StateFlowImpl) r5
            kotlin.ResultKt.throwOnFailure(r12)     // Catch:{ all -> 0x00f4 }
            r9 = r4
            r4 = r11
            r11 = r9
            goto L_0x00f3
        L_0x0046:
            java.lang.Object r11 = r0.L$4
            java.lang.Object r2 = r0.L$3
            kotlinx.coroutines.Job r2 = (kotlinx.coroutines.Job) r2
            java.lang.Object r3 = r0.L$2
            kotlinx.coroutines.flow.StateFlowSlot r3 = (kotlinx.coroutines.flow.StateFlowSlot) r3
            java.lang.Object r4 = r0.L$1
            kotlinx.coroutines.flow.FlowCollector r4 = (kotlinx.coroutines.flow.FlowCollector) r4
            java.lang.Object r5 = r0.L$0
            kotlinx.coroutines.flow.StateFlowImpl r5 = (kotlinx.coroutines.flow.StateFlowImpl) r5
            kotlin.ResultKt.throwOnFailure(r12)     // Catch:{ all -> 0x00f4 }
            goto L_0x00d6
        L_0x005d:
            java.lang.Object r11 = r0.L$2
            r3 = r11
            kotlinx.coroutines.flow.StateFlowSlot r3 = (kotlinx.coroutines.flow.StateFlowSlot) r3
            java.lang.Object r11 = r0.L$1
            kotlinx.coroutines.flow.FlowCollector r11 = (kotlinx.coroutines.flow.FlowCollector) r11
            java.lang.Object r2 = r0.L$0
            r5 = r2
            kotlinx.coroutines.flow.StateFlowImpl r5 = (kotlinx.coroutines.flow.StateFlowImpl) r5
            kotlin.ResultKt.throwOnFailure(r12)     // Catch:{ all -> 0x00f4 }
            goto L_0x0092
        L_0x006f:
            kotlin.ResultKt.throwOnFailure(r12)
            r5 = r10
            kotlinx.coroutines.flow.internal.AbstractSharedFlowSlot r2 = r5.allocateSlot()
            r3 = r2
            kotlinx.coroutines.flow.StateFlowSlot r3 = (kotlinx.coroutines.flow.StateFlowSlot) r3
            boolean r2 = r11 instanceof kotlinx.coroutines.flow.SubscribedFlowCollector     // Catch:{ all -> 0x00f4 }
            if (r2 == 0) goto L_0x0093
            r2 = r11
            kotlinx.coroutines.flow.SubscribedFlowCollector r2 = (kotlinx.coroutines.flow.SubscribedFlowCollector) r2     // Catch:{ all -> 0x00f4 }
            r0.L$0 = r5     // Catch:{ all -> 0x00f4 }
            r0.L$1 = r11     // Catch:{ all -> 0x00f4 }
            r0.L$2 = r3     // Catch:{ all -> 0x00f4 }
            r4 = 1
            r0.label = r4     // Catch:{ all -> 0x00f4 }
            java.lang.Object r2 = r2.onSubscription(r0)     // Catch:{ all -> 0x00f4 }
            if (r2 != r1) goto L_0x0092
            return r1
        L_0x0092:
        L_0x0093:
            r2 = 0
            kotlin.coroutines.CoroutineContext r4 = r0.getContext()     // Catch:{ all -> 0x00f4 }
            kotlinx.coroutines.Job$Key r2 = kotlinx.coroutines.Job.Key     // Catch:{ all -> 0x00f4 }
            kotlin.coroutines.CoroutineContext$Key r2 = (kotlin.coroutines.CoroutineContext.Key) r2     // Catch:{ all -> 0x00f4 }
            kotlin.coroutines.CoroutineContext$Element r2 = r4.get(r2)     // Catch:{ all -> 0x00f4 }
            kotlinx.coroutines.Job r2 = (kotlinx.coroutines.Job) r2     // Catch:{ all -> 0x00f4 }
            r4 = 0
        L_0x00a3:
            java.util.concurrent.atomic.AtomicReferenceFieldUpdater r6 = _state$volatile$FU     // Catch:{ all -> 0x00f4 }
            java.lang.Object r6 = r6.get(r5)     // Catch:{ all -> 0x00f4 }
            if (r2 == 0) goto L_0x00b0
            kotlinx.coroutines.JobKt.ensureActive((kotlinx.coroutines.Job) r2)     // Catch:{ all -> 0x00f4 }
        L_0x00b0:
            if (r4 == 0) goto L_0x00b8
            boolean r7 = kotlin.jvm.internal.Intrinsics.areEqual((java.lang.Object) r4, (java.lang.Object) r6)     // Catch:{ all -> 0x00f4 }
            if (r7 != 0) goto L_0x00d9
        L_0x00b8:
            kotlinx.coroutines.internal.Symbol r4 = kotlinx.coroutines.flow.internal.NullSurrogateKt.NULL     // Catch:{ all -> 0x00f4 }
            r7 = 0
            if (r6 != r4) goto L_0x00bf
            r8 = 0
            goto L_0x00c0
        L_0x00bf:
            r8 = r6
        L_0x00c0:
            r0.L$0 = r5     // Catch:{ all -> 0x00f4 }
            r0.L$1 = r11     // Catch:{ all -> 0x00f4 }
            r0.L$2 = r3     // Catch:{ all -> 0x00f4 }
            r0.L$3 = r2     // Catch:{ all -> 0x00f4 }
            r0.L$4 = r6     // Catch:{ all -> 0x00f4 }
            r4 = 2
            r0.label = r4     // Catch:{ all -> 0x00f4 }
            java.lang.Object r4 = r11.emit(r8, r0)     // Catch:{ all -> 0x00f4 }
            if (r4 != r1) goto L_0x00d4
            return r1
        L_0x00d4:
            r4 = r11
            r11 = r6
        L_0x00d6:
            r6 = r11
            r11 = r4
            r4 = r6
        L_0x00d9:
            boolean r6 = r3.takePending()     // Catch:{ all -> 0x00f4 }
            if (r6 != 0) goto L_0x00a3
            r0.L$0 = r5     // Catch:{ all -> 0x00f4 }
            r0.L$1 = r11     // Catch:{ all -> 0x00f4 }
            r0.L$2 = r3     // Catch:{ all -> 0x00f4 }
            r0.L$3 = r2     // Catch:{ all -> 0x00f4 }
            r0.L$4 = r4     // Catch:{ all -> 0x00f4 }
            r6 = 3
            r0.label = r6     // Catch:{ all -> 0x00f4 }
            java.lang.Object r6 = r3.awaitPending(r0)     // Catch:{ all -> 0x00f4 }
            if (r6 != r1) goto L_0x00f3
            return r1
        L_0x00f3:
            goto L_0x00a3
        L_0x00f4:
            r11 = move-exception
            r1 = r3
            kotlinx.coroutines.flow.internal.AbstractSharedFlowSlot r1 = (kotlinx.coroutines.flow.internal.AbstractSharedFlowSlot) r1
            r5.freeSlot(r1)
            throw r11
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.flow.StateFlowImpl.collect(kotlinx.coroutines.flow.FlowCollector, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* access modifiers changed from: protected */
    public StateFlowSlot createSlot() {
        return new StateFlowSlot();
    }

    /* access modifiers changed from: protected */
    public StateFlowSlot[] createSlotArray(int size) {
        return new StateFlowSlot[size];
    }

    public Flow<T> fuse(CoroutineContext context, int capacity, BufferOverflow onBufferOverflow) {
        return StateFlowKt.fuseStateFlow(this, context, capacity, onBufferOverflow);
    }
}
