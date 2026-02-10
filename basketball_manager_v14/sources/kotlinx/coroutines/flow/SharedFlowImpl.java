package kotlinx.coroutines.flow;

import java.util.ArrayList;
import java.util.List;
import kotlin.Metadata;
import kotlin.Result;
import kotlin.Unit;
import kotlin.collections.CollectionsKt;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.CoroutineContext;
import kotlin.coroutines.intrinsics.IntrinsicsKt;
import kotlin.coroutines.jvm.internal.DebugProbesKt;
import kotlin.jvm.internal.Intrinsics;
import kotlinx.coroutines.CancellableContinuation;
import kotlinx.coroutines.CancellableContinuationImpl;
import kotlinx.coroutines.CancellableContinuationKt;
import kotlinx.coroutines.DebugKt;
import kotlinx.coroutines.DisposableHandle;
import kotlinx.coroutines.channels.BufferOverflow;
import kotlinx.coroutines.flow.internal.AbstractSharedFlow;
import kotlinx.coroutines.flow.internal.AbstractSharedFlowKt;
import kotlinx.coroutines.flow.internal.AbstractSharedFlowSlot;
import kotlinx.coroutines.flow.internal.FusibleFlow;

@Metadata(d1 = {"\u0000\u0001\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0011\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\t\n\u0002\b\u000f\n\u0002\u0010 \n\u0002\b\t\n\u0002\u0010\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0001\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u000f\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\n\n\u0002\u0010\u000b\n\u0002\b\u0012\b\u0010\u0018\u0000*\u0004\b\u0000\u0010\u00012\b\u0012\u0004\u0012\u00020\u00030\u00022\b\u0012\u0004\u0012\u0002H\u00010\u00042\b\u0012\u0004\u0012\u0002H\u00010\u00052\b\u0012\u0004\u0012\u0002H\u00010\u0006:\u0001hB\u001d\u0012\u0006\u0010\u0007\u001a\u00020\b\u0012\u0006\u0010\t\u001a\u00020\b\u0012\u0006\u0010\n\u001a\u00020\u000b¢\u0006\u0002\u0010\fJ\u0016\u0010+\u001a\u00020,2\u0006\u0010-\u001a\u00020\u0003H@¢\u0006\u0002\u0010.J\u0010\u0010/\u001a\u00020,2\u0006\u00100\u001a\u000201H\u0002J\b\u00102\u001a\u00020,H\u0002J\u001c\u00103\u001a\u0002042\f\u00105\u001a\b\u0012\u0004\u0012\u00028\u000006H@¢\u0006\u0002\u00107J\u0010\u00108\u001a\u00020,2\u0006\u00109\u001a\u00020\u0012H\u0002J\b\u0010:\u001a\u00020\u0003H\u0014J\u001d\u0010;\u001a\n\u0012\u0006\u0012\u0004\u0018\u00010\u00030\u000e2\u0006\u0010<\u001a\u00020\bH\u0014¢\u0006\u0002\u0010=J\b\u0010>\u001a\u00020,H\u0002J\u0016\u0010?\u001a\u00020,2\u0006\u0010@\u001a\u00028\u0000H@¢\u0006\u0002\u0010AJ\u0016\u0010B\u001a\u00020,2\u0006\u0010@\u001a\u00028\u0000H@¢\u0006\u0002\u0010AJ\u0012\u0010C\u001a\u00020,2\b\u0010D\u001a\u0004\u0018\u00010\u000fH\u0002J1\u0010E\u001a\u0010\u0012\f\u0012\n\u0012\u0004\u0012\u00020,\u0018\u00010F0\u000e2\u0014\u0010G\u001a\u0010\u0012\f\u0012\n\u0012\u0004\u0012\u00020,\u0018\u00010F0\u000eH\u0002¢\u0006\u0002\u0010HJ&\u0010I\u001a\b\u0012\u0004\u0012\u00028\u00000J2\u0006\u0010K\u001a\u00020L2\u0006\u0010M\u001a\u00020\b2\u0006\u0010\n\u001a\u00020\u000bH\u0016J\u0012\u0010N\u001a\u0004\u0018\u00010\u000f2\u0006\u0010O\u001a\u00020\u0012H\u0002J7\u0010P\u001a\n\u0012\u0006\u0012\u0004\u0018\u00010\u000f0\u000e2\u0010\u0010Q\u001a\f\u0012\u0006\u0012\u0004\u0018\u00010\u000f\u0018\u00010\u000e2\u0006\u0010R\u001a\u00020\b2\u0006\u0010S\u001a\u00020\bH\u0002¢\u0006\u0002\u0010TJ\b\u0010U\u001a\u00020,H\u0016J\u0015\u0010V\u001a\u00020W2\u0006\u0010@\u001a\u00028\u0000H\u0016¢\u0006\u0002\u0010XJ\u0015\u0010Y\u001a\u00020W2\u0006\u0010@\u001a\u00028\u0000H\u0002¢\u0006\u0002\u0010XJ\u0015\u0010Z\u001a\u00020W2\u0006\u0010@\u001a\u00028\u0000H\u0002¢\u0006\u0002\u0010XJ\u0010\u0010[\u001a\u00020\u00122\u0006\u0010-\u001a\u00020\u0003H\u0002J\u0012\u0010\\\u001a\u0004\u0018\u00010\u000f2\u0006\u0010-\u001a\u00020\u0003H\u0002J(\u0010]\u001a\u00020,2\u0006\u0010^\u001a\u00020\u00122\u0006\u0010_\u001a\u00020\u00122\u0006\u0010`\u001a\u00020\u00122\u0006\u0010a\u001a\u00020\u0012H\u0002J%\u0010b\u001a\u0010\u0012\f\u0012\n\u0012\u0004\u0012\u00020,\u0018\u00010F0\u000e2\u0006\u0010c\u001a\u00020\u0012H\u0000¢\u0006\u0004\bd\u0010eJ\r\u0010f\u001a\u00020\u0012H\u0000¢\u0006\u0002\bgR\u001a\u0010\r\u001a\f\u0012\u0006\u0012\u0004\u0018\u00010\u000f\u0018\u00010\u000eX\u000e¢\u0006\u0004\n\u0002\u0010\u0010R\u000e\u0010\t\u001a\u00020\bX\u0004¢\u0006\u0002\n\u0000R\u0014\u0010\u0011\u001a\u00020\u00128BX\u0004¢\u0006\u0006\u001a\u0004\b\u0013\u0010\u0014R\u000e\u0010\u0015\u001a\u00020\bX\u000e¢\u0006\u0002\n\u0000R\u0014\u0010\u0016\u001a\u00020\u00128BX\u0004¢\u0006\u0006\u001a\u0004\b\u0017\u0010\u0014R\u001a\u0010\u0018\u001a\u00028\u00008DX\u0004¢\u0006\f\u0012\u0004\b\u0019\u0010\u001a\u001a\u0004\b\u001b\u0010\u001cR\u000e\u0010\u001d\u001a\u00020\u0012X\u000e¢\u0006\u0002\n\u0000R\u000e\u0010\n\u001a\u00020\u000bX\u0004¢\u0006\u0002\n\u0000R\u0014\u0010\u001e\u001a\u00020\u00128BX\u0004¢\u0006\u0006\u001a\u0004\b\u001f\u0010\u0014R\u000e\u0010 \u001a\u00020\bX\u000e¢\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\bX\u0004¢\u0006\u0002\n\u0000R\u001a\u0010!\u001a\b\u0012\u0004\u0012\u00028\u00000\"8VX\u0004¢\u0006\u0006\u001a\u0004\b#\u0010$R\u000e\u0010%\u001a\u00020\u0012X\u000e¢\u0006\u0002\n\u0000R\u0014\u0010&\u001a\u00020\b8BX\u0004¢\u0006\u0006\u001a\u0004\b'\u0010(R\u0014\u0010)\u001a\u00020\b8BX\u0004¢\u0006\u0006\u001a\u0004\b*\u0010(¨\u0006i"}, d2 = {"Lkotlinx/coroutines/flow/SharedFlowImpl;", "T", "Lkotlinx/coroutines/flow/internal/AbstractSharedFlow;", "Lkotlinx/coroutines/flow/SharedFlowSlot;", "Lkotlinx/coroutines/flow/MutableSharedFlow;", "Lkotlinx/coroutines/flow/CancellableFlow;", "Lkotlinx/coroutines/flow/internal/FusibleFlow;", "replay", "", "bufferCapacity", "onBufferOverflow", "Lkotlinx/coroutines/channels/BufferOverflow;", "(IILkotlinx/coroutines/channels/BufferOverflow;)V", "buffer", "", "", "[Ljava/lang/Object;", "bufferEndIndex", "", "getBufferEndIndex", "()J", "bufferSize", "head", "getHead", "lastReplayedLocked", "getLastReplayedLocked$annotations", "()V", "getLastReplayedLocked", "()Ljava/lang/Object;", "minCollectorIndex", "queueEndIndex", "getQueueEndIndex", "queueSize", "replayCache", "", "getReplayCache", "()Ljava/util/List;", "replayIndex", "replaySize", "getReplaySize", "()I", "totalSize", "getTotalSize", "awaitValue", "", "slot", "(Lkotlinx/coroutines/flow/SharedFlowSlot;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "cancelEmitter", "emitter", "Lkotlinx/coroutines/flow/SharedFlowImpl$Emitter;", "cleanupTailLocked", "collect", "", "collector", "Lkotlinx/coroutines/flow/FlowCollector;", "(Lkotlinx/coroutines/flow/FlowCollector;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "correctCollectorIndexesOnDropOldest", "newHead", "createSlot", "createSlotArray", "size", "(I)[Lkotlinx/coroutines/flow/SharedFlowSlot;", "dropOldestLocked", "emit", "value", "(Ljava/lang/Object;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "emitSuspend", "enqueueLocked", "item", "findSlotsToResumeLocked", "Lkotlin/coroutines/Continuation;", "resumesIn", "([Lkotlin/coroutines/Continuation;)[Lkotlin/coroutines/Continuation;", "fuse", "Lkotlinx/coroutines/flow/Flow;", "context", "Lkotlin/coroutines/CoroutineContext;", "capacity", "getPeekedValueLockedAt", "index", "growBuffer", "curBuffer", "curSize", "newSize", "([Ljava/lang/Object;II)[Ljava/lang/Object;", "resetReplayCache", "tryEmit", "", "(Ljava/lang/Object;)Z", "tryEmitLocked", "tryEmitNoCollectorsLocked", "tryPeekLocked", "tryTakeValue", "updateBufferLocked", "newReplayIndex", "newMinCollectorIndex", "newBufferEndIndex", "newQueueEndIndex", "updateCollectorIndexLocked", "oldIndex", "updateCollectorIndexLocked$kotlinx_coroutines_core", "(J)[Lkotlin/coroutines/Continuation;", "updateNewCollectorIndexLocked", "updateNewCollectorIndexLocked$kotlinx_coroutines_core", "Emitter", "kotlinx-coroutines-core"}, k = 1, mv = {1, 9, 0}, xi = 48)
/* compiled from: SharedFlow.kt */
public class SharedFlowImpl<T> extends AbstractSharedFlow<SharedFlowSlot> implements MutableSharedFlow<T>, CancellableFlow<T>, FusibleFlow<T> {
    private Object[] buffer;
    /* access modifiers changed from: private */
    public final int bufferCapacity;
    private int bufferSize;
    private long minCollectorIndex;
    private final BufferOverflow onBufferOverflow;
    /* access modifiers changed from: private */
    public int queueSize;
    private final int replay;
    private long replayIndex;

    @Metadata(k = 3, mv = {1, 9, 0}, xi = 48)
    /* compiled from: SharedFlow.kt */
    public /* synthetic */ class WhenMappings {
        public static final /* synthetic */ int[] $EnumSwitchMapping$0;

        static {
            int[] iArr = new int[BufferOverflow.values().length];
            try {
                iArr[BufferOverflow.SUSPEND.ordinal()] = 1;
            } catch (NoSuchFieldError e) {
            }
            try {
                iArr[BufferOverflow.DROP_LATEST.ordinal()] = 2;
            } catch (NoSuchFieldError e2) {
            }
            try {
                iArr[BufferOverflow.DROP_OLDEST.ordinal()] = 3;
            } catch (NoSuchFieldError e3) {
            }
            $EnumSwitchMapping$0 = iArr;
        }
    }

    protected static /* synthetic */ void getLastReplayedLocked$annotations() {
    }

    public Object collect(FlowCollector<? super T> flowCollector, Continuation<?> continuation) {
        return collect$suspendImpl(this, flowCollector, continuation);
    }

    public Object emit(T t, Continuation<? super Unit> continuation) {
        return emit$suspendImpl(this, t, continuation);
    }

    public SharedFlowImpl(int replay2, int bufferCapacity2, BufferOverflow onBufferOverflow2) {
        this.replay = replay2;
        this.bufferCapacity = bufferCapacity2;
        this.onBufferOverflow = onBufferOverflow2;
    }

    /* access modifiers changed from: private */
    public final long getHead() {
        return Math.min(this.minCollectorIndex, this.replayIndex);
    }

    private final int getReplaySize() {
        return (int) ((getHead() + ((long) this.bufferSize)) - this.replayIndex);
    }

    /* access modifiers changed from: private */
    public final int getTotalSize() {
        return this.bufferSize + this.queueSize;
    }

    private final long getBufferEndIndex() {
        return getHead() + ((long) this.bufferSize);
    }

    private final long getQueueEndIndex() {
        return getHead() + ((long) this.bufferSize) + ((long) this.queueSize);
    }

    public List<T> getReplayCache() {
        synchronized (this) {
            int replaySize = getReplaySize();
            if (replaySize == 0) {
                List<T> emptyList = CollectionsKt.emptyList();
                return emptyList;
            }
            ArrayList result = new ArrayList(replaySize);
            Object[] buffer2 = this.buffer;
            Intrinsics.checkNotNull(buffer2);
            for (int i = 0; i < replaySize; i++) {
                result.add(SharedFlowKt.getBufferAt(buffer2, this.replayIndex + ((long) i)));
            }
            return result;
        }
    }

    /* access modifiers changed from: protected */
    public final T getLastReplayedLocked() {
        Object[] objArr = this.buffer;
        Intrinsics.checkNotNull(objArr);
        return SharedFlowKt.getBufferAt(objArr, (this.replayIndex + ((long) getReplaySize())) - 1);
    }

    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r7v9, resolved type: java.lang.Object} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r8v8, resolved type: kotlinx.coroutines.flow.SharedFlowSlot} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r2v15, resolved type: java.lang.Object} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r3v6, resolved type: kotlinx.coroutines.flow.SharedFlowImpl<T>} */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x008e, code lost:
        r2 = (kotlinx.coroutines.Job) r0.getContext().get(kotlinx.coroutines.Job.Key);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x009d, code lost:
        r6 = r2;
        r2 = r7;
        r7 = r6;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x00a1, code lost:
        r4 = r3.tryTakeValue(r8);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x00a8, code lost:
        if (r4 != kotlinx.coroutines.flow.SharedFlowKt.NO_VALUE) goto L_0x00bd;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x00aa, code lost:
        r0.L$0 = r3;
        r0.L$1 = r2;
        r0.L$2 = r8;
        r0.L$3 = r7;
        r0.label = 2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x00b9, code lost:
        if (r3.awaitValue(r8, r0) != r1) goto L_0x00bc;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:0x00bb, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:35:0x00bd, code lost:
        if (r7 == null) goto L_0x00c2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x00bf, code lost:
        kotlinx.coroutines.JobKt.ensureActive(r7);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:37:0x00c2, code lost:
        r0.L$0 = r3;
        r0.L$1 = r2;
        r0.L$2 = r8;
        r0.L$3 = r7;
        r0.label = 3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:38:0x00d1, code lost:
        if (r2.emit(r4, r0) != r1) goto L_0x00d4;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:39:0x00d3, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:40:0x00d4, code lost:
        r6 = r2;
        r2 = r7;
        r7 = r6;
     */
    /* JADX WARNING: Multi-variable type inference failed */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:14:0x0044  */
    /* JADX WARNING: Removed duplicated region for block: B:17:0x0058  */
    /* JADX WARNING: Removed duplicated region for block: B:20:0x006a  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    static /* synthetic */ <T> java.lang.Object collect$suspendImpl(kotlinx.coroutines.flow.SharedFlowImpl<T> r7, kotlinx.coroutines.flow.FlowCollector<? super T> r8, kotlin.coroutines.Continuation<?> r9) {
        /*
            boolean r0 = r9 instanceof kotlinx.coroutines.flow.SharedFlowImpl$collect$1
            if (r0 == 0) goto L_0x0014
            r0 = r9
            kotlinx.coroutines.flow.SharedFlowImpl$collect$1 r0 = (kotlinx.coroutines.flow.SharedFlowImpl$collect$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r9 = r0.label
            int r9 = r9 - r2
            r0.label = r9
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.flow.SharedFlowImpl$collect$1 r0 = new kotlinx.coroutines.flow.SharedFlowImpl$collect$1
            r0.<init>(r7, r9)
        L_0x0019:
            java.lang.Object r9 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x006a;
                case 1: goto L_0x0058;
                case 2: goto L_0x0044;
                case 3: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r7 = new java.lang.IllegalStateException
            java.lang.String r8 = "call to 'resume' before 'invoke' with coroutine"
            r7.<init>(r8)
            throw r7
        L_0x002c:
            java.lang.Object r7 = r0.L$3
            kotlinx.coroutines.Job r7 = (kotlinx.coroutines.Job) r7
            java.lang.Object r8 = r0.L$2
            kotlinx.coroutines.flow.SharedFlowSlot r8 = (kotlinx.coroutines.flow.SharedFlowSlot) r8
            java.lang.Object r2 = r0.L$1
            kotlinx.coroutines.flow.FlowCollector r2 = (kotlinx.coroutines.flow.FlowCollector) r2
            java.lang.Object r3 = r0.L$0
            kotlinx.coroutines.flow.SharedFlowImpl r3 = (kotlinx.coroutines.flow.SharedFlowImpl) r3
            kotlin.ResultKt.throwOnFailure(r9)     // Catch:{ all -> 0x00d8 }
            r6 = r2
            r2 = r7
            r7 = r6
            goto L_0x00d7
        L_0x0044:
            java.lang.Object r7 = r0.L$3
            kotlinx.coroutines.Job r7 = (kotlinx.coroutines.Job) r7
            java.lang.Object r8 = r0.L$2
            kotlinx.coroutines.flow.SharedFlowSlot r8 = (kotlinx.coroutines.flow.SharedFlowSlot) r8
            java.lang.Object r2 = r0.L$1
            kotlinx.coroutines.flow.FlowCollector r2 = (kotlinx.coroutines.flow.FlowCollector) r2
            java.lang.Object r3 = r0.L$0
            kotlinx.coroutines.flow.SharedFlowImpl r3 = (kotlinx.coroutines.flow.SharedFlowImpl) r3
            kotlin.ResultKt.throwOnFailure(r9)     // Catch:{ all -> 0x00d8 }
            goto L_0x00bc
        L_0x0058:
            java.lang.Object r7 = r0.L$2
            r8 = r7
            kotlinx.coroutines.flow.SharedFlowSlot r8 = (kotlinx.coroutines.flow.SharedFlowSlot) r8
            java.lang.Object r7 = r0.L$1
            kotlinx.coroutines.flow.FlowCollector r7 = (kotlinx.coroutines.flow.FlowCollector) r7
            java.lang.Object r2 = r0.L$0
            r3 = r2
            kotlinx.coroutines.flow.SharedFlowImpl r3 = (kotlinx.coroutines.flow.SharedFlowImpl) r3
            kotlin.ResultKt.throwOnFailure(r9)     // Catch:{ all -> 0x00d8 }
            goto L_0x008d
        L_0x006a:
            kotlin.ResultKt.throwOnFailure(r9)
            r3 = r7
            r7 = r8
            kotlinx.coroutines.flow.internal.AbstractSharedFlowSlot r8 = r3.allocateSlot()
            kotlinx.coroutines.flow.SharedFlowSlot r8 = (kotlinx.coroutines.flow.SharedFlowSlot) r8
            boolean r2 = r7 instanceof kotlinx.coroutines.flow.SubscribedFlowCollector     // Catch:{ all -> 0x00d8 }
            if (r2 == 0) goto L_0x008e
            r2 = r7
            kotlinx.coroutines.flow.SubscribedFlowCollector r2 = (kotlinx.coroutines.flow.SubscribedFlowCollector) r2     // Catch:{ all -> 0x00d8 }
            r0.L$0 = r3     // Catch:{ all -> 0x00d8 }
            r0.L$1 = r7     // Catch:{ all -> 0x00d8 }
            r0.L$2 = r8     // Catch:{ all -> 0x00d8 }
            r4 = 1
            r0.label = r4     // Catch:{ all -> 0x00d8 }
            java.lang.Object r2 = r2.onSubscription(r0)     // Catch:{ all -> 0x00d8 }
            if (r2 != r1) goto L_0x008d
            return r1
        L_0x008d:
        L_0x008e:
            r2 = 0
            kotlin.coroutines.CoroutineContext r4 = r0.getContext()     // Catch:{ all -> 0x00d8 }
            kotlinx.coroutines.Job$Key r2 = kotlinx.coroutines.Job.Key     // Catch:{ all -> 0x00d8 }
            kotlin.coroutines.CoroutineContext$Key r2 = (kotlin.coroutines.CoroutineContext.Key) r2     // Catch:{ all -> 0x00d8 }
            kotlin.coroutines.CoroutineContext$Element r2 = r4.get(r2)     // Catch:{ all -> 0x00d8 }
            kotlinx.coroutines.Job r2 = (kotlinx.coroutines.Job) r2     // Catch:{ all -> 0x00d8 }
        L_0x009d:
            r6 = r2
            r2 = r7
            r7 = r6
        L_0x00a1:
            java.lang.Object r4 = r3.tryTakeValue(r8)     // Catch:{ all -> 0x00d8 }
            kotlinx.coroutines.internal.Symbol r5 = kotlinx.coroutines.flow.SharedFlowKt.NO_VALUE     // Catch:{ all -> 0x00d8 }
            if (r4 != r5) goto L_0x00bd
            r0.L$0 = r3     // Catch:{ all -> 0x00d8 }
            r0.L$1 = r2     // Catch:{ all -> 0x00d8 }
            r0.L$2 = r8     // Catch:{ all -> 0x00d8 }
            r0.L$3 = r7     // Catch:{ all -> 0x00d8 }
            r4 = 2
            r0.label = r4     // Catch:{ all -> 0x00d8 }
            java.lang.Object r4 = r3.awaitValue(r8, r0)     // Catch:{ all -> 0x00d8 }
            if (r4 != r1) goto L_0x00bc
            return r1
        L_0x00bc:
            goto L_0x00a1
        L_0x00bd:
            if (r7 == 0) goto L_0x00c2
            kotlinx.coroutines.JobKt.ensureActive((kotlinx.coroutines.Job) r7)     // Catch:{ all -> 0x00d8 }
        L_0x00c2:
            r0.L$0 = r3     // Catch:{ all -> 0x00d8 }
            r0.L$1 = r2     // Catch:{ all -> 0x00d8 }
            r0.L$2 = r8     // Catch:{ all -> 0x00d8 }
            r0.L$3 = r7     // Catch:{ all -> 0x00d8 }
            r5 = 3
            r0.label = r5     // Catch:{ all -> 0x00d8 }
            java.lang.Object r5 = r2.emit(r4, r0)     // Catch:{ all -> 0x00d8 }
            if (r5 != r1) goto L_0x00d4
            return r1
        L_0x00d4:
            r6 = r2
            r2 = r7
            r7 = r6
        L_0x00d7:
            goto L_0x009d
        L_0x00d8:
            r7 = move-exception
            r1 = r8
            kotlinx.coroutines.flow.internal.AbstractSharedFlowSlot r1 = (kotlinx.coroutines.flow.internal.AbstractSharedFlowSlot) r1
            r3.freeSlot(r1)
            throw r7
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.flow.SharedFlowImpl.collect$suspendImpl(kotlinx.coroutines.flow.SharedFlowImpl, kotlinx.coroutines.flow.FlowCollector, kotlin.coroutines.Continuation):java.lang.Object");
    }

    public boolean tryEmit(T value) {
        int i;
        boolean emitted;
        Continuation[] continuationArr = AbstractSharedFlowKt.EMPTY_RESUMES;
        synchronized (this) {
            if (tryEmitLocked(value)) {
                continuationArr = findSlotsToResumeLocked(continuationArr);
                emitted = true;
            } else {
                emitted = false;
            }
        }
        for (Continuation cont : continuationArr) {
            if (cont != null) {
                Result.Companion companion = Result.Companion;
                cont.resumeWith(Result.m101constructorimpl(Unit.INSTANCE));
            }
        }
        return emitted;
    }

    static /* synthetic */ <T> Object emit$suspendImpl(SharedFlowImpl<T> $this, T value, Continuation<? super Unit> $completion) {
        if ($this.tryEmit(value)) {
            return Unit.INSTANCE;
        }
        Object emitSuspend = $this.emitSuspend(value, $completion);
        return emitSuspend == IntrinsicsKt.getCOROUTINE_SUSPENDED() ? emitSuspend : Unit.INSTANCE;
    }

    /* access modifiers changed from: private */
    public final boolean tryEmitLocked(T value) {
        if (getNCollectors() == 0) {
            return tryEmitNoCollectorsLocked(value);
        }
        if (this.bufferSize >= this.bufferCapacity && this.minCollectorIndex <= this.replayIndex) {
            switch (WhenMappings.$EnumSwitchMapping$0[this.onBufferOverflow.ordinal()]) {
                case 1:
                    return false;
                case 2:
                    return true;
            }
        }
        enqueueLocked(value);
        this.bufferSize++;
        if (this.bufferSize > this.bufferCapacity) {
            dropOldestLocked();
        }
        if (getReplaySize() > this.replay) {
            updateBufferLocked(this.replayIndex + 1, this.minCollectorIndex, getBufferEndIndex(), getQueueEndIndex());
        }
        return true;
    }

    private final boolean tryEmitNoCollectorsLocked(T value) {
        if (DebugKt.getASSERTIONS_ENABLED()) {
            if (!(getNCollectors() == 0)) {
                throw new AssertionError();
            }
        }
        if (this.replay == 0) {
            return true;
        }
        enqueueLocked(value);
        this.bufferSize++;
        if (this.bufferSize > this.replay) {
            dropOldestLocked();
        }
        this.minCollectorIndex = getHead() + ((long) this.bufferSize);
        return true;
    }

    private final void dropOldestLocked() {
        Object[] objArr = this.buffer;
        Intrinsics.checkNotNull(objArr);
        SharedFlowKt.setBufferAt(objArr, getHead(), (Object) null);
        this.bufferSize--;
        long newHead = getHead() + 1;
        if (this.replayIndex < newHead) {
            this.replayIndex = newHead;
        }
        if (this.minCollectorIndex < newHead) {
            correctCollectorIndexesOnDropOldest(newHead);
        }
        if (DebugKt.getASSERTIONS_ENABLED()) {
            if (!(getHead() == newHead)) {
                throw new AssertionError();
            }
        }
    }

    private final void correctCollectorIndexesOnDropOldest(long newHead) {
        AbstractSharedFlowSlot[] $this$forEach$iv$iv;
        long j = newHead;
        AbstractSharedFlow this_$iv = this;
        if (!(this_$iv.nCollectors == 0 || ($this$forEach$iv$iv = this_$iv.slots) == null)) {
            for (AbstractSharedFlowSlot slot$iv : $this$forEach$iv$iv) {
                if (slot$iv != null) {
                    SharedFlowSlot slot = (SharedFlowSlot) slot$iv;
                    if (slot.index >= 0 && slot.index < j) {
                        slot.index = j;
                    }
                }
            }
        }
        this.minCollectorIndex = j;
    }

    /* access modifiers changed from: private */
    public final void enqueueLocked(Object item) {
        int curSize = getTotalSize();
        Object[] curBuffer = this.buffer;
        if (curBuffer == null) {
            curBuffer = growBuffer((Object[]) null, 0, 2);
        } else if (curSize >= curBuffer.length) {
            curBuffer = growBuffer(curBuffer, curSize, curBuffer.length * 2);
        }
        SharedFlowKt.setBufferAt(curBuffer, getHead() + ((long) curSize), item);
    }

    private final Object[] growBuffer(Object[] curBuffer, int curSize, int newSize) {
        if (newSize > 0) {
            Object[] newBuffer = new Object[newSize];
            this.buffer = newBuffer;
            if (curBuffer == null) {
                return newBuffer;
            }
            long head = getHead();
            for (int i = 0; i < curSize; i++) {
                SharedFlowKt.setBufferAt(newBuffer, ((long) i) + head, SharedFlowKt.getBufferAt(curBuffer, ((long) i) + head));
            }
            return newBuffer;
        }
        throw new IllegalStateException("Buffer size overflow".toString());
    }

    /* access modifiers changed from: private */
    public final Object emitSuspend(T value, Continuation<? super Unit> $completion) {
        Emitter it;
        Continuation[] continuationArr;
        CancellableContinuationImpl cancellable$iv = new CancellableContinuationImpl(IntrinsicsKt.intercepted($completion), 1);
        cancellable$iv.initCancellability();
        CancellableContinuation cont = cancellable$iv;
        Continuation[] continuationArr2 = AbstractSharedFlowKt.EMPTY_RESUMES;
        synchronized (this) {
            if (tryEmitLocked(value)) {
                Result.Companion companion = Result.Companion;
                cont.resumeWith(Result.m101constructorimpl(Unit.INSTANCE));
                continuationArr = findSlotsToResumeLocked(continuationArr2);
                it = null;
            } else {
                Emitter it2 = new Emitter(this, getHead() + ((long) getTotalSize()), value, cont);
                enqueueLocked(it2);
                this.queueSize = this.queueSize + 1;
                if (this.bufferCapacity == 0) {
                    continuationArr2 = findSlotsToResumeLocked(continuationArr2);
                }
                it = it2;
                continuationArr = continuationArr2;
            }
        }
        if (it != null) {
            CancellableContinuationKt.disposeOnCancellation(cont, it);
        }
        for (Continuation r : continuationArr) {
            if (r != null) {
                Result.Companion companion2 = Result.Companion;
                r.resumeWith(Result.m101constructorimpl(Unit.INSTANCE));
            }
        }
        Object result = cancellable$iv.getResult();
        if (result == IntrinsicsKt.getCOROUTINE_SUSPENDED()) {
            DebugProbesKt.probeCoroutineSuspended($completion);
        }
        return result == IntrinsicsKt.getCOROUTINE_SUSPENDED() ? result : Unit.INSTANCE;
    }

    /* access modifiers changed from: private */
    public final void cancelEmitter(Emitter emitter) {
        synchronized (this) {
            if (emitter.index >= getHead()) {
                Object[] buffer2 = this.buffer;
                Intrinsics.checkNotNull(buffer2);
                if (SharedFlowKt.getBufferAt(buffer2, emitter.index) == emitter) {
                    SharedFlowKt.setBufferAt(buffer2, emitter.index, SharedFlowKt.NO_VALUE);
                    cleanupTailLocked();
                    Unit unit = Unit.INSTANCE;
                }
            }
        }
    }

    public final long updateNewCollectorIndexLocked$kotlinx_coroutines_core() {
        long index = this.replayIndex;
        if (index < this.minCollectorIndex) {
            this.minCollectorIndex = index;
        }
        return index;
    }

    /* JADX WARNING: Removed duplicated region for block: B:81:0x015c  */
    /* JADX WARNING: Removed duplicated region for block: B:82:0x015f  */
    /* JADX WARNING: Removed duplicated region for block: B:84:0x0163  */
    /* JADX WARNING: Removed duplicated region for block: B:95:? A[RETURN, SYNTHETIC] */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final kotlin.coroutines.Continuation<kotlin.Unit>[] updateCollectorIndexLocked$kotlinx_coroutines_core(long r26) {
        /*
            r25 = this;
            r0 = r25
            boolean r1 = kotlinx.coroutines.DebugKt.getASSERTIONS_ENABLED()
            if (r1 == 0) goto L_0x001b
            r1 = 0
            long r2 = r0.minCollectorIndex
            int r2 = (r26 > r2 ? 1 : (r26 == r2 ? 0 : -1))
            if (r2 < 0) goto L_0x0011
            r1 = 1
            goto L_0x0012
        L_0x0011:
            r1 = 0
        L_0x0012:
            if (r1 == 0) goto L_0x0015
            goto L_0x001b
        L_0x0015:
            java.lang.AssertionError r1 = new java.lang.AssertionError
            r1.<init>()
            throw r1
        L_0x001b:
            long r1 = r0.minCollectorIndex
            int r1 = (r26 > r1 ? 1 : (r26 == r1 ? 0 : -1))
            if (r1 <= 0) goto L_0x0024
            kotlin.coroutines.Continuation<kotlin.Unit>[] r1 = kotlinx.coroutines.flow.internal.AbstractSharedFlowKt.EMPTY_RESUMES
            return r1
        L_0x0024:
            long r11 = r0.getHead()
            r1 = 0
            int r3 = r0.bufferSize
            long r3 = (long) r3
            long r3 = r3 + r11
            int r1 = r0.bufferCapacity
            r5 = 1
            if (r1 != 0) goto L_0x0039
            int r1 = r0.queueSize
            if (r1 <= 0) goto L_0x0039
            long r3 = r3 + r5
        L_0x0039:
            r1 = r0
            kotlinx.coroutines.flow.internal.AbstractSharedFlow r1 = (kotlinx.coroutines.flow.internal.AbstractSharedFlow) r1
            r2 = 0
            int r7 = r1.nCollectors
            if (r7 == 0) goto L_0x007f
            kotlinx.coroutines.flow.internal.AbstractSharedFlowSlot[] r7 = r1.slots
            if (r7 == 0) goto L_0x007c
            r8 = 0
            int r13 = r7.length
            r14 = 0
        L_0x004c:
            if (r14 >= r13) goto L_0x0079
            r15 = r7[r14]
            r16 = r15
            r17 = 0
            if (r16 == 0) goto L_0x006f
            r18 = r5
            r5 = r16
            kotlinx.coroutines.flow.SharedFlowSlot r5 = (kotlinx.coroutines.flow.SharedFlowSlot) r5
            r6 = 0
            long r9 = r5.index
            r21 = 0
            int r9 = (r9 > r21 ? 1 : (r9 == r21 ? 0 : -1))
            if (r9 < 0) goto L_0x006d
            long r9 = r5.index
            int r9 = (r9 > r3 ? 1 : (r9 == r3 ? 0 : -1))
            if (r9 >= 0) goto L_0x006d
            long r3 = r5.index
        L_0x006d:
            goto L_0x0071
        L_0x006f:
            r18 = r5
        L_0x0071:
            int r14 = r14 + 1
            r5 = r18
            goto L_0x004c
        L_0x0079:
            r18 = r5
            goto L_0x007e
        L_0x007c:
            r18 = r5
        L_0x007e:
            goto L_0x0081
        L_0x007f:
            r18 = r5
        L_0x0081:
            boolean r1 = kotlinx.coroutines.DebugKt.getASSERTIONS_ENABLED()
            if (r1 == 0) goto L_0x009a
            r1 = 0
            long r5 = r0.minCollectorIndex
            int r2 = (r3 > r5 ? 1 : (r3 == r5 ? 0 : -1))
            if (r2 < 0) goto L_0x0090
            r1 = 1
            goto L_0x0091
        L_0x0090:
            r1 = 0
        L_0x0091:
            if (r1 == 0) goto L_0x0094
            goto L_0x009a
        L_0x0094:
            java.lang.AssertionError r1 = new java.lang.AssertionError
            r1.<init>()
            throw r1
        L_0x009a:
            long r1 = r0.minCollectorIndex
            int r1 = (r3 > r1 ? 1 : (r3 == r1 ? 0 : -1))
            if (r1 > 0) goto L_0x00a3
            kotlin.coroutines.Continuation<kotlin.Unit>[] r1 = kotlinx.coroutines.flow.internal.AbstractSharedFlowKt.EMPTY_RESUMES
            return r1
        L_0x00a3:
            long r1 = r0.getBufferEndIndex()
            int r5 = r0.getNCollectors()
            if (r5 <= 0) goto L_0x00ba
            long r5 = r1 - r3
            int r5 = (int) r5
            int r6 = r0.queueSize
            int r7 = r0.bufferCapacity
            int r7 = r7 - r5
            int r5 = java.lang.Math.min(r6, r7)
            goto L_0x00bc
        L_0x00ba:
            int r5 = r0.queueSize
        L_0x00bc:
            r9 = r5
            kotlin.coroutines.Continuation<kotlin.Unit>[] r5 = kotlinx.coroutines.flow.internal.AbstractSharedFlowKt.EMPTY_RESUMES
            int r6 = r0.queueSize
            long r6 = (long) r6
            long r7 = r1 + r6
            if (r9 <= 0) goto L_0x010c
            kotlin.coroutines.Continuation[] r5 = new kotlin.coroutines.Continuation[r9]
            r6 = 0
            java.lang.Object[] r10 = r0.buffer
            kotlin.jvm.internal.Intrinsics.checkNotNull(r10)
            r13 = r1
        L_0x00cf:
            int r15 = (r13 > r7 ? 1 : (r13 == r7 ? 0 : -1))
            if (r15 >= 0) goto L_0x0108
            java.lang.Object r15 = kotlinx.coroutines.flow.SharedFlowKt.getBufferAt(r10, r13)
            r16 = r3
            kotlinx.coroutines.internal.Symbol r3 = kotlinx.coroutines.flow.SharedFlowKt.NO_VALUE
            if (r15 == r3) goto L_0x0103
            java.lang.String r3 = "null cannot be cast to non-null type kotlinx.coroutines.flow.SharedFlowImpl.Emitter"
            kotlin.jvm.internal.Intrinsics.checkNotNull(r15, r3)
            r3 = r15
            kotlinx.coroutines.flow.SharedFlowImpl$Emitter r3 = (kotlinx.coroutines.flow.SharedFlowImpl.Emitter) r3
            int r3 = r6 + 1
            r4 = r15
            kotlinx.coroutines.flow.SharedFlowImpl$Emitter r4 = (kotlinx.coroutines.flow.SharedFlowImpl.Emitter) r4
            kotlin.coroutines.Continuation<kotlin.Unit> r4 = r4.cont
            r5[r6] = r4
            kotlinx.coroutines.internal.Symbol r4 = kotlinx.coroutines.flow.SharedFlowKt.NO_VALUE
            kotlinx.coroutines.flow.SharedFlowKt.setBufferAt(r10, r13, r4)
            r4 = r15
            kotlinx.coroutines.flow.SharedFlowImpl$Emitter r4 = (kotlinx.coroutines.flow.SharedFlowImpl.Emitter) r4
            java.lang.Object r4 = r4.value
            kotlinx.coroutines.flow.SharedFlowKt.setBufferAt(r10, r1, r4)
            long r1 = r1 + r18
            if (r3 >= r9) goto L_0x0101
            r6 = r3
            goto L_0x0103
        L_0x0101:
            r10 = r5
            goto L_0x010f
        L_0x0103:
            long r13 = r13 + r18
            r3 = r16
            goto L_0x00cf
        L_0x0108:
            r16 = r3
            r10 = r5
            goto L_0x010f
        L_0x010c:
            r16 = r3
            r10 = r5
        L_0x010f:
            long r3 = r1 - r11
            int r13 = (int) r3
            int r3 = r0.getNCollectors()
            if (r3 != 0) goto L_0x011a
            r3 = r1
            goto L_0x011c
        L_0x011a:
            r3 = r16
        L_0x011c:
            long r5 = r0.replayIndex
            int r14 = r0.replay
            int r14 = java.lang.Math.min(r14, r13)
            long r14 = (long) r14
            long r14 = r1 - r14
            long r5 = java.lang.Math.max(r5, r14)
            int r14 = r0.bufferCapacity
            if (r14 != 0) goto L_0x014e
            int r14 = (r5 > r7 ? 1 : (r5 == r7 ? 0 : -1))
            if (r14 >= 0) goto L_0x014e
            java.lang.Object[] r14 = r0.buffer
            kotlin.jvm.internal.Intrinsics.checkNotNull(r14)
            java.lang.Object r14 = kotlinx.coroutines.flow.SharedFlowKt.getBufferAt(r14, r5)
            kotlinx.coroutines.internal.Symbol r15 = kotlinx.coroutines.flow.SharedFlowKt.NO_VALUE
            boolean r14 = kotlin.jvm.internal.Intrinsics.areEqual((java.lang.Object) r14, (java.lang.Object) r15)
            if (r14 == 0) goto L_0x014e
            long r1 = r1 + r18
            long r5 = r5 + r18
            r23 = r5
            r5 = r1
            r1 = r23
            goto L_0x0153
        L_0x014e:
            r23 = r5
            r5 = r1
            r1 = r23
        L_0x0153:
            r0.updateBufferLocked(r1, r3, r5, r7)
            r0.cleanupTailLocked()
            int r14 = r10.length
            if (r14 != 0) goto L_0x015f
            r20 = 1
            goto L_0x0161
        L_0x015f:
            r20 = 0
        L_0x0161:
            if (r20 != 0) goto L_0x0167
            kotlin.coroutines.Continuation[] r10 = r0.findSlotsToResumeLocked(r10)
        L_0x0167:
            return r10
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.flow.SharedFlowImpl.updateCollectorIndexLocked$kotlinx_coroutines_core(long):kotlin.coroutines.Continuation[]");
    }

    private final void updateBufferLocked(long newReplayIndex, long newMinCollectorIndex, long newBufferEndIndex, long newQueueEndIndex) {
        long j = newReplayIndex;
        long j2 = newMinCollectorIndex;
        long newHead = Math.min(j2, j);
        boolean z = true;
        if (DebugKt.getASSERTIONS_ENABLED()) {
            if ((newHead >= getHead() ? 1 : 0) == 0) {
                throw new AssertionError();
            }
        }
        for (long index = getHead(); index < newHead; index++) {
            Object[] objArr = this.buffer;
            Intrinsics.checkNotNull(objArr);
            SharedFlowKt.setBufferAt(objArr, index, (Object) null);
        }
        this.replayIndex = j;
        this.minCollectorIndex = j2;
        this.bufferSize = (int) (newBufferEndIndex - newHead);
        this.queueSize = (int) (newQueueEndIndex - newBufferEndIndex);
        if (DebugKt.getASSERTIONS_ENABLED()) {
            if ((this.bufferSize >= 0 ? 1 : 0) == 0) {
                throw new AssertionError();
            }
        }
        if (DebugKt.getASSERTIONS_ENABLED()) {
            if ((this.queueSize >= 0 ? 1 : 0) == 0) {
                throw new AssertionError();
            }
        }
        if (DebugKt.getASSERTIONS_ENABLED()) {
            if (this.replayIndex > getHead() + ((long) this.bufferSize)) {
                z = false;
            }
            if (!z) {
                throw new AssertionError();
            }
        }
    }

    private final void cleanupTailLocked() {
        if (this.bufferCapacity != 0 || this.queueSize > 1) {
            Object[] buffer2 = this.buffer;
            Intrinsics.checkNotNull(buffer2);
            while (this.queueSize > 0 && SharedFlowKt.getBufferAt(buffer2, (getHead() + ((long) getTotalSize())) - 1) == SharedFlowKt.NO_VALUE) {
                this.queueSize--;
                SharedFlowKt.setBufferAt(buffer2, getHead() + ((long) getTotalSize()), (Object) null);
            }
        }
    }

    private final Object tryTakeValue(SharedFlowSlot slot) {
        Object value;
        Continuation[] continuationArr = AbstractSharedFlowKt.EMPTY_RESUMES;
        synchronized (this) {
            long index = tryPeekLocked(slot);
            if (index < 0) {
                value = SharedFlowKt.NO_VALUE;
            } else {
                long oldIndex = slot.index;
                Object newValue = getPeekedValueLockedAt(index);
                slot.index = 1 + index;
                continuationArr = updateCollectorIndexLocked$kotlinx_coroutines_core(oldIndex);
                value = newValue;
            }
        }
        for (Continuation resume : continuationArr) {
            if (resume != null) {
                Result.Companion companion = Result.Companion;
                resume.resumeWith(Result.m101constructorimpl(Unit.INSTANCE));
            }
        }
        return value;
    }

    /* access modifiers changed from: private */
    public final long tryPeekLocked(SharedFlowSlot slot) {
        long index = slot.index;
        if (index < getBufferEndIndex()) {
            return index;
        }
        if (this.bufferCapacity <= 0 && index <= getHead() && this.queueSize != 0) {
            return index;
        }
        return -1;
    }

    private final Object getPeekedValueLockedAt(long index) {
        Object[] objArr = this.buffer;
        Intrinsics.checkNotNull(objArr);
        Object item = SharedFlowKt.getBufferAt(objArr, index);
        if (item instanceof Emitter) {
            return ((Emitter) item).value;
        }
        return item;
    }

    /* access modifiers changed from: private */
    public final Object awaitValue(SharedFlowSlot slot, Continuation<? super Unit> $completion) {
        CancellableContinuationImpl cancellable$iv = new CancellableContinuationImpl(IntrinsicsKt.intercepted($completion), 1);
        cancellable$iv.initCancellability();
        CancellableContinuation cont = cancellable$iv;
        synchronized (this) {
            if (tryPeekLocked(slot) < 0) {
                slot.cont = cont;
                slot.cont = cont;
            } else {
                Result.Companion companion = Result.Companion;
                cont.resumeWith(Result.m101constructorimpl(Unit.INSTANCE));
            }
            Unit unit = Unit.INSTANCE;
        }
        Object result = cancellable$iv.getResult();
        if (result == IntrinsicsKt.getCOROUTINE_SUSPENDED()) {
            DebugProbesKt.probeCoroutineSuspended($completion);
        }
        return result == IntrinsicsKt.getCOROUTINE_SUSPENDED() ? result : Unit.INSTANCE;
    }

    /* JADX WARNING: type inference failed for: r0v12, types: [java.lang.Object[], java.lang.Object] */
    /* access modifiers changed from: private */
    /* JADX WARNING: Multi-variable type inference failed */
    /* JADX WARNING: Unknown variable types count: 1 */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final kotlin.coroutines.Continuation<kotlin.Unit>[] findSlotsToResumeLocked(kotlin.coroutines.Continuation<kotlin.Unit>[] r21) {
        /*
            r20 = this;
            r0 = r20
            r1 = 0
            r1 = r21
            r2 = 0
            r3 = r21
            int r2 = r3.length
            r4 = r0
            kotlinx.coroutines.flow.internal.AbstractSharedFlow r4 = (kotlinx.coroutines.flow.internal.AbstractSharedFlow) r4
            r5 = 0
            int r6 = r4.nCollectors
            if (r6 == 0) goto L_0x0071
            kotlinx.coroutines.flow.internal.AbstractSharedFlowSlot[] r6 = r4.slots
            if (r6 == 0) goto L_0x0070
            r7 = 0
            int r8 = r6.length
            r9 = 0
        L_0x001c:
            if (r9 >= r8) goto L_0x006e
            r10 = r6[r9]
            r11 = r10
            r12 = 0
            if (r11 == 0) goto L_0x0065
            r13 = r11
            kotlinx.coroutines.flow.SharedFlowSlot r13 = (kotlinx.coroutines.flow.SharedFlowSlot) r13
            r14 = 0
            kotlin.coroutines.Continuation<? super kotlin.Unit> r15 = r13.cont
            if (r15 != 0) goto L_0x002f
            r17 = r2
            goto L_0x0062
        L_0x002f:
            long r16 = r0.tryPeekLocked(r13)
            r18 = 0
            int r16 = (r16 > r18 ? 1 : (r16 == r18 ? 0 : -1))
            if (r16 < 0) goto L_0x0060
            int r0 = r1.length
            if (r2 < r0) goto L_0x0053
            int r0 = r1.length
            r16 = r0
            r0 = 2
            r17 = r2
            int r2 = r16 * 2
            int r0 = java.lang.Math.max(r0, r2)
            java.lang.Object[] r0 = java.util.Arrays.copyOf(r1, r0)
            java.lang.String r2 = "copyOf(...)"
            kotlin.jvm.internal.Intrinsics.checkNotNullExpressionValue(r0, r2)
            r1 = r0
            goto L_0x0055
        L_0x0053:
            r17 = r2
        L_0x0055:
            r0 = r1
            kotlin.coroutines.Continuation[] r0 = (kotlin.coroutines.Continuation[]) r0
            int r2 = r17 + 1
            r0[r17] = r15
            r0 = 0
            r13.cont = r0
            goto L_0x0064
        L_0x0060:
            r17 = r2
        L_0x0062:
            r2 = r17
        L_0x0064:
            goto L_0x0067
        L_0x0065:
            r17 = r2
        L_0x0067:
            int r9 = r9 + 1
            r0 = r20
            goto L_0x001c
        L_0x006e:
            r17 = r2
        L_0x0070:
        L_0x0071:
            r0 = r1
            kotlin.coroutines.Continuation[] r0 = (kotlin.coroutines.Continuation[]) r0
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.flow.SharedFlowImpl.findSlotsToResumeLocked(kotlin.coroutines.Continuation[]):kotlin.coroutines.Continuation[]");
    }

    /* access modifiers changed from: protected */
    public SharedFlowSlot createSlot() {
        return new SharedFlowSlot();
    }

    /* access modifiers changed from: protected */
    public SharedFlowSlot[] createSlotArray(int size) {
        return new SharedFlowSlot[size];
    }

    public void resetReplayCache() {
        synchronized (this) {
            try {
                try {
                    updateBufferLocked(getBufferEndIndex(), this.minCollectorIndex, getBufferEndIndex(), getQueueEndIndex());
                    Unit unit = Unit.INSTANCE;
                } catch (Throwable th) {
                    th = th;
                    throw th;
                }
            } catch (Throwable th2) {
                th = th2;
                throw th;
            }
        }
    }

    public Flow<T> fuse(CoroutineContext context, int capacity, BufferOverflow onBufferOverflow2) {
        return SharedFlowKt.fuseSharedFlow(this, context, capacity, onBufferOverflow2);
    }

    @Metadata(d1 = {"\u0000(\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\t\n\u0000\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010\u0002\n\u0002\b\u0003\b\u0002\u0018\u00002\u00020\u0001B1\u0012\n\u0010\u0002\u001a\u0006\u0012\u0002\b\u00030\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u0012\b\u0010\u0006\u001a\u0004\u0018\u00010\u0007\u0012\f\u0010\b\u001a\b\u0012\u0004\u0012\u00020\n0\t¢\u0006\u0002\u0010\u000bJ\b\u0010\f\u001a\u00020\nH\u0016R\u0016\u0010\b\u001a\b\u0012\u0004\u0012\u00020\n0\t8\u0006X\u0004¢\u0006\u0002\n\u0000R\u0014\u0010\u0002\u001a\u0006\u0012\u0002\b\u00030\u00038\u0006X\u0004¢\u0006\u0002\n\u0000R\u0012\u0010\u0004\u001a\u00020\u00058\u0006@\u0006X\u000e¢\u0006\u0002\n\u0000R\u0012\u0010\u0006\u001a\u0004\u0018\u00010\u00078\u0006X\u0004¢\u0006\u0002\n\u0000¨\u0006\r"}, d2 = {"Lkotlinx/coroutines/flow/SharedFlowImpl$Emitter;", "Lkotlinx/coroutines/DisposableHandle;", "flow", "Lkotlinx/coroutines/flow/SharedFlowImpl;", "index", "", "value", "", "cont", "Lkotlin/coroutines/Continuation;", "", "(Lkotlinx/coroutines/flow/SharedFlowImpl;JLjava/lang/Object;Lkotlin/coroutines/Continuation;)V", "dispose", "kotlinx-coroutines-core"}, k = 1, mv = {1, 9, 0}, xi = 48)
    /* compiled from: SharedFlow.kt */
    private static final class Emitter implements DisposableHandle {
        public final Continuation<Unit> cont;
        public final SharedFlowImpl<?> flow;
        public long index;
        public final Object value;

        public Emitter(SharedFlowImpl<?> flow2, long index2, Object value2, Continuation<? super Unit> cont2) {
            this.flow = flow2;
            this.index = index2;
            this.value = value2;
            this.cont = cont2;
        }

        public void dispose() {
            this.flow.cancelEmitter(this);
        }
    }
}
