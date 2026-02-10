package kotlinx.coroutines;

import androidx.concurrent.futures.AbstractResolvableFuture$SafeAtomicHelper$$ExternalSyntheticBackportWithForwarding0;
import java.util.concurrent.CancellationException;
import java.util.concurrent.atomic.AtomicIntegerFieldUpdater;
import java.util.concurrent.atomic.AtomicReferenceFieldUpdater;
import kotlin.KotlinNothingValueException;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.CoroutineContext;
import kotlin.coroutines.intrinsics.IntrinsicsKt;
import kotlin.coroutines.jvm.internal.CoroutineStackFrame;
import kotlin.jvm.functions.Function0;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.internal.DefaultConstructorMarker;
import kotlin.jvm.internal.Intrinsics;
import kotlinx.coroutines.CancelHandler;
import kotlinx.coroutines.internal.DispatchedContinuation;
import kotlinx.coroutines.internal.Segment;
import kotlinx.coroutines.internal.StackTraceRecoveryKt;
import kotlinx.coroutines.internal.Symbol;

@Metadata(d1 = {"\u0000Ò\u0001\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0000\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010\u000b\n\u0002\b\n\n\u0002\u0010\u000e\n\u0002\b\u0003\n\u0002\u0010\u0001\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u000e\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0006\n\u0002\u0018\u0002\n\u0002\b\u0012\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\b\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0003\b\u0011\u0018\u0000*\u0006\b\u0000\u0010\u0001 \u00002\b\u0012\u0004\u0012\u0002H\u00010\u00022\b\u0012\u0004\u0012\u0002H\u00010\u00032\u00060\u0004j\u0002`\u00052\u00020\u0006B\u001b\u0012\f\u0010\u0007\u001a\b\u0012\u0004\u0012\u00028\u00000\b\u0012\u0006\u0010\t\u001a\u00020\n¢\u0006\u0002\u0010\u000bJ\u0012\u0010+\u001a\u00020,2\b\u0010-\u001a\u0004\u0018\u00010\u0012H\u0002J\u0018\u0010.\u001a\u00020/2\u0006\u00100\u001a\u0002012\b\u00102\u001a\u0004\u0018\u000103J\u001a\u0010.\u001a\u00020/2\u0006\u00100\u001a\u0002042\b\u00102\u001a\u0004\u0018\u000103H\u0002J\u0017\u00105\u001a\u00020/2\f\u00106\u001a\b\u0012\u0004\u0012\u00020/07H\bJ1\u00108\u001a\u00020/2!\u00109\u001a\u001d\u0012\u0013\u0012\u001103¢\u0006\f\b;\u0012\b\b<\u0012\u0004\b\b(2\u0012\u0004\u0012\u00020/0:2\u0006\u00102\u001a\u000203J\u001e\u0010=\u001a\u00020/2\n\u0010>\u001a\u0006\u0012\u0002\b\u00030?2\b\u00102\u001a\u0004\u0018\u000103H\u0002J\u0012\u0010@\u001a\u00020\u001d2\b\u00102\u001a\u0004\u0018\u000103H\u0016J\u001f\u0010A\u001a\u00020/2\b\u0010B\u001a\u0004\u0018\u00010\u00122\u0006\u00102\u001a\u000203H\u0010¢\u0006\u0002\bCJ\u0010\u0010D\u001a\u00020\u001d2\u0006\u00102\u001a\u000203H\u0002J\u0010\u0010E\u001a\u00020/2\u0006\u0010F\u001a\u00020\u0012H\u0016J\r\u0010G\u001a\u00020/H\u0000¢\u0006\u0002\bHJ\b\u0010I\u001a\u00020/H\u0002J\u0010\u0010J\u001a\u00020/2\u0006\u0010K\u001a\u00020\nH\u0002J\u0010\u0010L\u001a\u0002032\u0006\u0010M\u001a\u00020NH\u0016J\u0019\u0010O\u001a\u0004\u0018\u0001032\b\u0010$\u001a\u0004\u0018\u00010\u0012H\u0010¢\u0006\u0002\bPJ\n\u0010Q\u001a\u0004\u0018\u00010\u0012H\u0001J\u0010\u0010R\u001a\n\u0018\u00010Sj\u0004\u0018\u0001`TH\u0016J\u001f\u0010U\u001a\u0002H\u0001\"\u0004\b\u0001\u0010\u00012\b\u0010$\u001a\u0004\u0018\u00010\u0012H\u0010¢\u0006\u0004\bV\u0010WJ\b\u0010X\u001a\u00020/H\u0016J\n\u0010Y\u001a\u0004\u0018\u00010\u0010H\u0002J1\u0010Z\u001a\u00020/2'\u00100\u001a#\u0012\u0015\u0012\u0013\u0018\u000103¢\u0006\f\b;\u0012\b\b<\u0012\u0004\b\b(2\u0012\u0004\u0012\u00020/0:j\u0002`[H\u0016J\u001c\u0010Z\u001a\u00020/2\n\u0010>\u001a\u0006\u0012\u0002\b\u00030?2\u0006\u0010\\\u001a\u00020\nH\u0016J\u0010\u0010]\u001a\u00020/2\u0006\u00100\u001a\u00020\u0012H\u0002J\u0015\u0010^\u001a\u00020/2\u0006\u00100\u001a\u000201H\u0000¢\u0006\u0002\b_J\b\u0010`\u001a\u00020\u001dH\u0002J\u001a\u0010a\u001a\u00020/2\u0006\u00100\u001a\u00020\u00122\b\u0010$\u001a\u0004\u0018\u00010\u0012H\u0002J\b\u0010b\u001a\u00020(H\u0014J\u0015\u0010c\u001a\u00020/2\u0006\u00102\u001a\u000203H\u0000¢\u0006\u0002\bdJ\r\u0010e\u001a\u00020/H\u0000¢\u0006\u0002\bfJ\b\u0010g\u001a\u00020\u001dH\u0001J:\u0010h\u001a\u00020/2\u0006\u0010i\u001a\u00028\u00002#\u00109\u001a\u001f\u0012\u0013\u0012\u001103¢\u0006\f\b;\u0012\b\b<\u0012\u0004\b\b(2\u0012\u0004\u0012\u00020/\u0018\u00010:H\u0016¢\u0006\u0002\u0010jJA\u0010k\u001a\u00020/2\b\u0010-\u001a\u0004\u0018\u00010\u00122\u0006\u0010\t\u001a\u00020\n2%\b\u0002\u00109\u001a\u001f\u0012\u0013\u0012\u001103¢\u0006\f\b;\u0012\b\b<\u0012\u0004\b\b(2\u0012\u0004\u0012\u00020/\u0018\u00010:H\u0002J\u001b\u0010l\u001a\u00020/2\f\u0010m\u001a\b\u0012\u0004\u0012\u00028\u00000nH\u0016¢\u0006\u0002\u0010oJS\u0010p\u001a\u0004\u0018\u00010\u00122\u0006\u0010$\u001a\u00020q2\b\u0010-\u001a\u0004\u0018\u00010\u00122\u0006\u0010\t\u001a\u00020\n2#\u00109\u001a\u001f\u0012\u0013\u0012\u001103¢\u0006\f\b;\u0012\b\b<\u0012\u0004\b\b(2\u0012\u0004\u0012\u00020/\u0018\u00010:2\b\u0010r\u001a\u0004\u0018\u00010\u0012H\u0002J\u000f\u0010s\u001a\u0004\u0018\u00010\u0012H\u0010¢\u0006\u0002\btJ\b\u0010u\u001a\u00020(H\u0016J\b\u0010v\u001a\u00020\u001dH\u0002J!\u0010v\u001a\u0004\u0018\u00010\u00122\u0006\u0010i\u001a\u00028\u00002\b\u0010r\u001a\u0004\u0018\u00010\u0012H\u0016¢\u0006\u0002\u0010wJF\u0010v\u001a\u0004\u0018\u00010\u00122\u0006\u0010i\u001a\u00028\u00002\b\u0010r\u001a\u0004\u0018\u00010\u00122#\u00109\u001a\u001f\u0012\u0013\u0012\u001103¢\u0006\f\b;\u0012\b\b<\u0012\u0004\b\b(2\u0012\u0004\u0012\u00020/\u0018\u00010:H\u0016¢\u0006\u0002\u0010xJC\u0010y\u001a\u0004\u0018\u00010z2\b\u0010-\u001a\u0004\u0018\u00010\u00122\b\u0010r\u001a\u0004\u0018\u00010\u00122#\u00109\u001a\u001f\u0012\u0013\u0012\u001103¢\u0006\f\b;\u0012\b\b<\u0012\u0004\b\b(2\u0012\u0004\u0012\u00020/\u0018\u00010:H\u0002J\u0012\u0010{\u001a\u0004\u0018\u00010\u00122\u0006\u0010|\u001a\u000203H\u0016J\b\u0010}\u001a\u00020\u001dH\u0002J\u001a\u0010~\u001a\u00020/*\u000202\u0006\u0010i\u001a\u00028\u0000H\u0016¢\u0006\u0003\u0010\u0001J\u0015\u0010\u0001\u001a\u00020/*\u000202\u0006\u0010|\u001a\u000203H\u0016R\t\u0010\f\u001a\u00020\rX\u0004R\u0011\u0010\u000e\u001a\n\u0012\u0006\u0012\u0004\u0018\u00010\u00100\u000fX\u0004R\u0011\u0010\u0011\u001a\n\u0012\u0006\u0012\u0004\u0018\u00010\u00120\u000fX\u0004R\u001c\u0010\u0013\u001a\n\u0018\u00010\u0004j\u0004\u0018\u0001`\u00058VX\u0004¢\u0006\u0006\u001a\u0004\b\u0014\u0010\u0015R\u0014\u0010\u0016\u001a\u00020\u0017X\u0004¢\u0006\b\n\u0000\u001a\u0004\b\u0018\u0010\u0019R\u001a\u0010\u0007\u001a\b\u0012\u0004\u0012\u00028\u00000\bX\u0004¢\u0006\b\n\u0000\u001a\u0004\b\u001a\u0010\u001bR\u0014\u0010\u001c\u001a\u00020\u001d8VX\u0004¢\u0006\u0006\u001a\u0004\b\u001c\u0010\u001eR\u0014\u0010\u001f\u001a\u00020\u001d8VX\u0004¢\u0006\u0006\u001a\u0004\b\u001f\u0010\u001eR\u0014\u0010 \u001a\u00020\u001d8VX\u0004¢\u0006\u0006\u001a\u0004\b \u0010\u001eR\u0016\u0010!\u001a\u0004\u0018\u00010\u00108BX\u0004¢\u0006\u0006\u001a\u0004\b\"\u0010#R\u0016\u0010$\u001a\u0004\u0018\u00010\u00128@X\u0004¢\u0006\u0006\u001a\u0004\b%\u0010&R\u0014\u0010'\u001a\u00020(8BX\u0004¢\u0006\u0006\u001a\u0004\b)\u0010*¨\u0006\u0001"}, d2 = {"Lkotlinx/coroutines/CancellableContinuationImpl;", "T", "Lkotlinx/coroutines/DispatchedTask;", "Lkotlinx/coroutines/CancellableContinuation;", "Lkotlin/coroutines/jvm/internal/CoroutineStackFrame;", "Lkotlinx/coroutines/internal/CoroutineStackFrame;", "Lkotlinx/coroutines/Waiter;", "delegate", "Lkotlin/coroutines/Continuation;", "resumeMode", "", "(Lkotlin/coroutines/Continuation;I)V", "_decisionAndIndex", "Lkotlinx/atomicfu/AtomicInt;", "_parentHandle", "Lkotlinx/atomicfu/AtomicRef;", "Lkotlinx/coroutines/DisposableHandle;", "_state", "", "callerFrame", "getCallerFrame", "()Lkotlin/coroutines/jvm/internal/CoroutineStackFrame;", "context", "Lkotlin/coroutines/CoroutineContext;", "getContext", "()Lkotlin/coroutines/CoroutineContext;", "getDelegate$kotlinx_coroutines_core", "()Lkotlin/coroutines/Continuation;", "isActive", "", "()Z", "isCancelled", "isCompleted", "parentHandle", "getParentHandle", "()Lkotlinx/coroutines/DisposableHandle;", "state", "getState$kotlinx_coroutines_core", "()Ljava/lang/Object;", "stateDebugRepresentation", "", "getStateDebugRepresentation", "()Ljava/lang/String;", "alreadyResumedError", "", "proposedUpdate", "callCancelHandler", "", "handler", "Lkotlinx/coroutines/CancelHandler;", "cause", "", "Lkotlinx/coroutines/InternalCompletionHandler;", "callCancelHandlerSafely", "block", "Lkotlin/Function0;", "callOnCancellation", "onCancellation", "Lkotlin/Function1;", "Lkotlin/ParameterName;", "name", "callSegmentOnCancellation", "segment", "Lkotlinx/coroutines/internal/Segment;", "cancel", "cancelCompletedResult", "takenState", "cancelCompletedResult$kotlinx_coroutines_core", "cancelLater", "completeResume", "token", "detachChild", "detachChild$kotlinx_coroutines_core", "detachChildIfNonResuable", "dispatchResume", "mode", "getContinuationCancellationCause", "parent", "Lkotlinx/coroutines/Job;", "getExceptionalResult", "getExceptionalResult$kotlinx_coroutines_core", "getResult", "getStackTraceElement", "Ljava/lang/StackTraceElement;", "Lkotlinx/coroutines/internal/StackTraceElement;", "getSuccessfulResult", "getSuccessfulResult$kotlinx_coroutines_core", "(Ljava/lang/Object;)Ljava/lang/Object;", "initCancellability", "installParentHandle", "invokeOnCancellation", "Lkotlinx/coroutines/CompletionHandler;", "index", "invokeOnCancellationImpl", "invokeOnCancellationInternal", "invokeOnCancellationInternal$kotlinx_coroutines_core", "isReusable", "multipleHandlersError", "nameString", "parentCancelled", "parentCancelled$kotlinx_coroutines_core", "releaseClaimedReusableContinuation", "releaseClaimedReusableContinuation$kotlinx_coroutines_core", "resetStateReusable", "resume", "value", "(Ljava/lang/Object;Lkotlin/jvm/functions/Function1;)V", "resumeImpl", "resumeWith", "result", "Lkotlin/Result;", "(Ljava/lang/Object;)V", "resumedState", "Lkotlinx/coroutines/NotCompleted;", "idempotent", "takeState", "takeState$kotlinx_coroutines_core", "toString", "tryResume", "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;", "(Ljava/lang/Object;Ljava/lang/Object;Lkotlin/jvm/functions/Function1;)Ljava/lang/Object;", "tryResumeImpl", "Lkotlinx/coroutines/internal/Symbol;", "tryResumeWithException", "exception", "trySuspend", "resumeUndispatched", "Lkotlinx/coroutines/CoroutineDispatcher;", "(Lkotlinx/coroutines/CoroutineDispatcher;Ljava/lang/Object;)V", "resumeUndispatchedWithException", "kotlinx-coroutines-core"}, k = 1, mv = {1, 9, 0}, xi = 48)
/* compiled from: CancellableContinuationImpl.kt */
public class CancellableContinuationImpl<T> extends DispatchedTask<T> implements CancellableContinuation<T>, CoroutineStackFrame, Waiter {
    /* access modifiers changed from: private */
    public static final /* synthetic */ AtomicIntegerFieldUpdater _decisionAndIndex$volatile$FU;
    /* access modifiers changed from: private */
    public static final /* synthetic */ AtomicReferenceFieldUpdater _parentHandle$volatile$FU;
    /* access modifiers changed from: private */
    public static final /* synthetic */ AtomicReferenceFieldUpdater _state$volatile$FU;
    private volatile /* synthetic */ int _decisionAndIndex$volatile;
    private volatile /* synthetic */ Object _parentHandle$volatile;
    private volatile /* synthetic */ Object _state$volatile;
    private final CoroutineContext context;
    private final Continuation<T> delegate;

    static {
        Class<CancellableContinuationImpl> cls = CancellableContinuationImpl.class;
        _decisionAndIndex$volatile$FU = AtomicIntegerFieldUpdater.newUpdater(cls, "_decisionAndIndex$volatile");
        _state$volatile$FU = AtomicReferenceFieldUpdater.newUpdater(cls, Object.class, "_state$volatile");
        _parentHandle$volatile$FU = AtomicReferenceFieldUpdater.newUpdater(cls, Object.class, "_parentHandle$volatile");
    }

    private final /* synthetic */ int get_decisionAndIndex$volatile() {
        return this._decisionAndIndex$volatile;
    }

    private final /* synthetic */ Object get_parentHandle$volatile() {
        return this._parentHandle$volatile;
    }

    private final /* synthetic */ Object get_state$volatile() {
        return this._state$volatile;
    }

    private final /* synthetic */ void loop$atomicfu(Object obj, AtomicIntegerFieldUpdater atomicIntegerFieldUpdater, Function1<? super Integer, Unit> function1) {
        while (true) {
            function1.invoke(Integer.valueOf(atomicIntegerFieldUpdater.get(obj)));
        }
    }

    private final /* synthetic */ void loop$atomicfu(Object obj, AtomicReferenceFieldUpdater atomicReferenceFieldUpdater, Function1<Object, Unit> function1) {
        while (true) {
            function1.invoke(atomicReferenceFieldUpdater.get(obj));
        }
    }

    private final /* synthetic */ void set_decisionAndIndex$volatile(int i) {
        this._decisionAndIndex$volatile = i;
    }

    private final /* synthetic */ void set_parentHandle$volatile(Object obj) {
        this._parentHandle$volatile = obj;
    }

    private final /* synthetic */ void set_state$volatile(Object obj) {
        this._state$volatile = obj;
    }

    private final /* synthetic */ void update$atomicfu(Object obj, AtomicIntegerFieldUpdater atomicIntegerFieldUpdater, Function1<? super Integer, Integer> function1) {
        int i;
        do {
            i = atomicIntegerFieldUpdater.get(obj);
        } while (!atomicIntegerFieldUpdater.compareAndSet(obj, i, function1.invoke(Integer.valueOf(i)).intValue()));
    }

    public final Continuation<T> getDelegate$kotlinx_coroutines_core() {
        return this.delegate;
    }

    public CancellableContinuationImpl(Continuation<? super T> delegate2, int resumeMode) {
        super(resumeMode);
        this.delegate = delegate2;
        if (DebugKt.getASSERTIONS_ENABLED()) {
            if (!(resumeMode != -1)) {
                throw new AssertionError();
            }
        }
        this.context = this.delegate.getContext();
        this._decisionAndIndex$volatile = (0 << 29) + 536870911;
        this._state$volatile = Active.INSTANCE;
    }

    public CoroutineContext getContext() {
        return this.context;
    }

    private final DisposableHandle getParentHandle() {
        return (DisposableHandle) _parentHandle$volatile$FU.get(this);
    }

    public final Object getState$kotlinx_coroutines_core() {
        return _state$volatile$FU.get(this);
    }

    public boolean isActive() {
        return getState$kotlinx_coroutines_core() instanceof NotCompleted;
    }

    public boolean isCompleted() {
        return !(getState$kotlinx_coroutines_core() instanceof NotCompleted);
    }

    public boolean isCancelled() {
        return getState$kotlinx_coroutines_core() instanceof CancelledContinuation;
    }

    private final String getStateDebugRepresentation() {
        Object state$kotlinx_coroutines_core = getState$kotlinx_coroutines_core();
        if (state$kotlinx_coroutines_core instanceof NotCompleted) {
            return "Active";
        }
        if (state$kotlinx_coroutines_core instanceof CancelledContinuation) {
            return "Cancelled";
        }
        return "Completed";
    }

    public void initCancellability() {
        DisposableHandle handle = installParentHandle();
        if (handle != null && isCompleted()) {
            handle.dispose();
            _parentHandle$volatile$FU.set(this, NonDisposableHandle.INSTANCE);
        }
    }

    private final boolean isReusable() {
        if (DispatchedTaskKt.isReusableMode(this.resumeMode)) {
            Continuation<T> continuation = this.delegate;
            Intrinsics.checkNotNull(continuation, "null cannot be cast to non-null type kotlinx.coroutines.internal.DispatchedContinuation<*>");
            if (((DispatchedContinuation) continuation).isReusable$kotlinx_coroutines_core()) {
                return true;
            }
        }
        return false;
    }

    public final boolean resetStateReusable() {
        if (DebugKt.getASSERTIONS_ENABLED()) {
            if ((this.resumeMode == 2 ? 1 : 0) == 0) {
                throw new AssertionError();
            }
        }
        if (DebugKt.getASSERTIONS_ENABLED()) {
            if ((getParentHandle() != NonDisposableHandle.INSTANCE ? 1 : 0) == 0) {
                throw new AssertionError();
            }
        }
        Object state = _state$volatile$FU.get(this);
        if (DebugKt.getASSERTIONS_ENABLED() && (state instanceof NotCompleted)) {
            throw new AssertionError();
        } else if (!(state instanceof CompletedContinuation) || ((CompletedContinuation) state).idempotentResume == null) {
            _decisionAndIndex$volatile$FU.set(this, (0 << 29) + 536870911);
            _state$volatile$FU.set(this, Active.INSTANCE);
            return true;
        } else {
            detachChild$kotlinx_coroutines_core();
            return false;
        }
    }

    public CoroutineStackFrame getCallerFrame() {
        Continuation<T> continuation = this.delegate;
        if (continuation instanceof CoroutineStackFrame) {
            return (CoroutineStackFrame) continuation;
        }
        return null;
    }

    public StackTraceElement getStackTraceElement() {
        return null;
    }

    public Object takeState$kotlinx_coroutines_core() {
        return getState$kotlinx_coroutines_core();
    }

    public void cancelCompletedResult$kotlinx_coroutines_core(Object takenState, Throwable cause) {
        AtomicReferenceFieldUpdater handler$atomicfu$iv = _state$volatile$FU;
        while (true) {
            Object state = handler$atomicfu$iv.get(this);
            if (state instanceof NotCompleted) {
                throw new IllegalStateException("Not completed".toString());
            } else if (!(state instanceof CompletedExceptionally)) {
                if (state instanceof CompletedContinuation) {
                    if (!((CompletedContinuation) state).getCancelled()) {
                        if (AbstractResolvableFuture$SafeAtomicHelper$$ExternalSyntheticBackportWithForwarding0.m(_state$volatile$FU, this, state, CompletedContinuation.copy$default((CompletedContinuation) state, (Object) null, (CancelHandler) null, (Function1) null, (Object) null, cause, 15, (Object) null))) {
                            ((CompletedContinuation) state).invokeHandlers(this, cause);
                            return;
                        }
                        Throwable th = cause;
                    } else {
                        Throwable th2 = cause;
                        throw new IllegalStateException("Must be called at most once".toString());
                    }
                } else if (AbstractResolvableFuture$SafeAtomicHelper$$ExternalSyntheticBackportWithForwarding0.m(_state$volatile$FU, this, state, new CompletedContinuation(state, (CancelHandler) null, (Function1) null, (Object) null, cause, 14, (DefaultConstructorMarker) null))) {
                    return;
                }
            } else {
                return;
            }
        }
    }

    private final boolean cancelLater(Throwable cause) {
        if (!isReusable()) {
            return false;
        }
        Continuation<T> continuation = this.delegate;
        Intrinsics.checkNotNull(continuation, "null cannot be cast to non-null type kotlinx.coroutines.internal.DispatchedContinuation<*>");
        return ((DispatchedContinuation) continuation).postponeCancellation$kotlinx_coroutines_core(cause);
    }

    public boolean cancel(Throwable cause) {
        Object state;
        boolean z;
        Continuation continuation;
        AtomicReferenceFieldUpdater handler$atomicfu$iv = _state$volatile$FU;
        do {
            state = handler$atomicfu$iv.get(this);
            z = false;
            if (!(state instanceof NotCompleted)) {
                return false;
            }
            continuation = this;
            if ((state instanceof CancelHandler) || (state instanceof Segment)) {
                z = true;
            }
        } while (!AbstractResolvableFuture$SafeAtomicHelper$$ExternalSyntheticBackportWithForwarding0.m(_state$volatile$FU, this, state, new CancelledContinuation(continuation, cause, z)));
        NotCompleted notCompleted = (NotCompleted) state;
        if (notCompleted instanceof CancelHandler) {
            callCancelHandler((CancelHandler) state, cause);
        } else if (notCompleted instanceof Segment) {
            callSegmentOnCancellation((Segment) state, cause);
        }
        detachChildIfNonResuable();
        dispatchResume(this.resumeMode);
        return true;
    }

    public final void parentCancelled$kotlinx_coroutines_core(Throwable cause) {
        if (!cancelLater(cause)) {
            cancel(cause);
            detachChildIfNonResuable();
        }
    }

    private final void callCancelHandlerSafely(Function0<Unit> block) {
        try {
            block.invoke();
        } catch (Throwable ex) {
            CoroutineExceptionHandlerKt.handleCoroutineException(getContext(), new CompletionHandlerException("Exception in invokeOnCancellation handler for " + this, ex));
        }
    }

    private final void callCancelHandler(InternalCompletionHandler handler, Throwable cause) {
        try {
            handler.invoke(cause);
        } catch (Throwable ex$iv) {
            CoroutineExceptionHandlerKt.handleCoroutineException(getContext(), new CompletionHandlerException("Exception in invokeOnCancellation handler for " + this, ex$iv));
        }
    }

    public final void callCancelHandler(CancelHandler handler, Throwable cause) {
        try {
            handler.invoke(cause);
        } catch (Throwable ex$iv) {
            CoroutineExceptionHandlerKt.handleCoroutineException(getContext(), new CompletionHandlerException("Exception in invokeOnCancellation handler for " + this, ex$iv));
        }
    }

    private final void callSegmentOnCancellation(Segment<?> segment, Throwable cause) {
        int $this$index$iv = _decisionAndIndex$volatile$FU.get(this) & 536870911;
        if ($this$index$iv != 536870911) {
            try {
                segment.onCancellation($this$index$iv, cause, getContext());
            } catch (Throwable ex$iv) {
                CoroutineExceptionHandlerKt.handleCoroutineException(getContext(), new CompletionHandlerException("Exception in invokeOnCancellation handler for " + this, ex$iv));
            }
        } else {
            throw new IllegalStateException("The index for Segment.onCancellation(..) is broken".toString());
        }
    }

    public final void callOnCancellation(Function1<? super Throwable, Unit> onCancellation, Throwable cause) {
        try {
            onCancellation.invoke(cause);
        } catch (Throwable ex) {
            CoroutineExceptionHandlerKt.handleCoroutineException(getContext(), new CompletionHandlerException("Exception in resume onCancellation handler for " + this, ex));
        }
    }

    public Throwable getContinuationCancellationCause(Job parent) {
        return parent.getCancellationException();
    }

    private final boolean trySuspend() {
        int cur;
        AtomicIntegerFieldUpdater handler$atomicfu$iv = _decisionAndIndex$volatile$FU;
        do {
            cur = handler$atomicfu$iv.get(this);
            switch (cur >> 29) {
                case 0:
                    break;
                case 2:
                    return false;
                default:
                    throw new IllegalStateException("Already suspended".toString());
            }
        } while (!_decisionAndIndex$volatile$FU.compareAndSet(this, cur, (1 << 29) + (cur & 536870911)));
        return true;
    }

    private final boolean tryResume() {
        int cur;
        AtomicIntegerFieldUpdater handler$atomicfu$iv = _decisionAndIndex$volatile$FU;
        do {
            cur = handler$atomicfu$iv.get(this);
            switch (cur >> 29) {
                case 0:
                    break;
                case 1:
                    return false;
                default:
                    throw new IllegalStateException("Already resumed".toString());
            }
        } while (!_decisionAndIndex$volatile$FU.compareAndSet(this, cur, (2 << 29) + (cur & 536870911)));
        return true;
    }

    public final Object getResult() {
        Job job;
        Throwable th;
        boolean isReusable = isReusable();
        if (trySuspend()) {
            if (getParentHandle() == null) {
                installParentHandle();
            }
            if (isReusable) {
                releaseClaimedReusableContinuation$kotlinx_coroutines_core();
            }
            return IntrinsicsKt.getCOROUTINE_SUSPENDED();
        }
        if (isReusable) {
            releaseClaimedReusableContinuation$kotlinx_coroutines_core();
        }
        Object state = getState$kotlinx_coroutines_core();
        if (state instanceof CompletedExceptionally) {
            Throwable exception$iv = ((CompletedExceptionally) state).cause;
            if (DebugKt.getRECOVER_STACK_TRACES() && (this instanceof CoroutineStackFrame)) {
                exception$iv = StackTraceRecoveryKt.recoverFromStackFrame(exception$iv, this);
            }
            throw exception$iv;
        } else if (!DispatchedTaskKt.isCancellableMode(this.resumeMode) || (job = (Job) getContext().get(Job.Key)) == null || job.isActive()) {
            return getSuccessfulResult$kotlinx_coroutines_core(state);
        } else {
            CancellationException cause = job.getCancellationException();
            cancelCompletedResult$kotlinx_coroutines_core(state, cause);
            if (!DebugKt.getRECOVER_STACK_TRACES() || !(this instanceof CoroutineStackFrame)) {
                th = cause;
            } else {
                th = StackTraceRecoveryKt.recoverFromStackFrame(cause, this);
            }
            throw th;
        }
    }

    private final DisposableHandle installParentHandle() {
        Job parent = (Job) getContext().get(Job.Key);
        if (parent == null) {
            return null;
        }
        DisposableHandle handle = JobKt__JobKt.invokeOnCompletion$default(parent, true, false, new ChildContinuation(this), 2, (Object) null);
        AbstractResolvableFuture$SafeAtomicHelper$$ExternalSyntheticBackportWithForwarding0.m(_parentHandle$volatile$FU, this, (Object) null, handle);
        return handle;
    }

    public final void releaseClaimedReusableContinuation$kotlinx_coroutines_core() {
        Throwable cancellationCause;
        Continuation<T> continuation = this.delegate;
        DispatchedContinuation dispatchedContinuation = continuation instanceof DispatchedContinuation ? (DispatchedContinuation) continuation : null;
        if (dispatchedContinuation != null && (cancellationCause = dispatchedContinuation.tryReleaseClaimedContinuation$kotlinx_coroutines_core(this)) != null) {
            detachChild$kotlinx_coroutines_core();
            cancel(cancellationCause);
        }
    }

    public void resumeWith(Object result) {
        resumeImpl$default(this, CompletionStateKt.toState(result, (CancellableContinuation<?>) this), this.resumeMode, (Function1) null, 4, (Object) null);
    }

    public void resume(T value, Function1<? super Throwable, Unit> onCancellation) {
        resumeImpl(value, this.resumeMode, onCancellation);
    }

    public void invokeOnCancellation(Segment<?> segment, int index) {
        int i;
        int it;
        AtomicIntegerFieldUpdater handler$atomicfu$iv = _decisionAndIndex$volatile$FU;
        do {
            i = handler$atomicfu$iv.get(this);
            it = i;
            if (!((it & 536870911) == 536870911)) {
                throw new IllegalStateException("invokeOnCancellation should be called at most once".toString());
            }
        } while (!handler$atomicfu$iv.compareAndSet(this, i, ((it >> 29) << 29) + index));
        invokeOnCancellationImpl(segment);
    }

    public void invokeOnCancellation(Function1<? super Throwable, Unit> handler) {
        CancellableContinuationKt.invokeOnCancellation(this, new CancelHandler.UserSupplied(handler));
    }

    public final void invokeOnCancellationInternal$kotlinx_coroutines_core(CancelHandler handler) {
        invokeOnCancellationImpl(handler);
    }

    private final void invokeOnCancellationImpl(Object handler) {
        Object obj = handler;
        if (DebugKt.getASSERTIONS_ENABLED()) {
            if (!((obj instanceof CancelHandler) || (obj instanceof Segment))) {
                throw new AssertionError();
            }
        }
        AtomicReferenceFieldUpdater handler$atomicfu$iv = _state$volatile$FU;
        while (true) {
            Object state = handler$atomicfu$iv.get(this);
            if (!(state instanceof Active)) {
                if (state instanceof CancelHandler ? true : state instanceof Segment) {
                    multipleHandlersError(obj, state);
                } else if (state instanceof CompletedExceptionally) {
                    if (!((CompletedExceptionally) state).makeHandled()) {
                        multipleHandlersError(obj, state);
                    }
                    if (state instanceof CancelledContinuation) {
                        Throwable cause = null;
                        CompletedExceptionally completedExceptionally = state instanceof CompletedExceptionally ? (CompletedExceptionally) state : null;
                        if (completedExceptionally != null) {
                            cause = completedExceptionally.cause;
                        }
                        if (obj instanceof CancelHandler) {
                            callCancelHandler((CancelHandler) obj, cause);
                            return;
                        }
                        Intrinsics.checkNotNull(obj, "null cannot be cast to non-null type kotlinx.coroutines.internal.Segment<*>");
                        callSegmentOnCancellation((Segment) obj, cause);
                        return;
                    }
                    return;
                } else if (state instanceof CompletedContinuation) {
                    if (((CompletedContinuation) state).cancelHandler != null) {
                        multipleHandlersError(obj, state);
                    }
                    if (!(obj instanceof Segment)) {
                        Intrinsics.checkNotNull(obj, "null cannot be cast to non-null type kotlinx.coroutines.CancelHandler");
                        CancelHandler cancelHandler = (CancelHandler) obj;
                        if (((CompletedContinuation) state).getCancelled()) {
                            callCancelHandler((CancelHandler) obj, ((CompletedContinuation) state).cancelCause);
                            return;
                        } else {
                            if (AbstractResolvableFuture$SafeAtomicHelper$$ExternalSyntheticBackportWithForwarding0.m(_state$volatile$FU, this, state, CompletedContinuation.copy$default((CompletedContinuation) state, (Object) null, (CancelHandler) obj, (Function1) null, (Object) null, (Throwable) null, 29, (Object) null))) {
                                return;
                            }
                        }
                    } else {
                        return;
                    }
                } else if (!(obj instanceof Segment)) {
                    Intrinsics.checkNotNull(obj, "null cannot be cast to non-null type kotlinx.coroutines.CancelHandler");
                    CancelHandler cancelHandler2 = (CancelHandler) obj;
                    if (AbstractResolvableFuture$SafeAtomicHelper$$ExternalSyntheticBackportWithForwarding0.m(_state$volatile$FU, this, state, new CompletedContinuation(state, (CancelHandler) obj, (Function1) null, (Object) null, (Throwable) null, 28, (DefaultConstructorMarker) null))) {
                        return;
                    }
                } else {
                    return;
                }
            } else if (AbstractResolvableFuture$SafeAtomicHelper$$ExternalSyntheticBackportWithForwarding0.m(_state$volatile$FU, this, state, obj)) {
                return;
            }
        }
    }

    private final void multipleHandlersError(Object handler, Object state) {
        throw new IllegalStateException(("It's prohibited to register multiple handlers, tried to register " + handler + ", already has " + state).toString());
    }

    private final void dispatchResume(int mode) {
        if (!tryResume()) {
            DispatchedTaskKt.dispatch(this, mode);
        }
    }

    private final Object resumedState(NotCompleted state, Object proposedUpdate, int resumeMode, Function1<? super Throwable, Unit> onCancellation, Object idempotent) {
        if (proposedUpdate instanceof CompletedExceptionally) {
            boolean z = true;
            if (DebugKt.getASSERTIONS_ENABLED()) {
                if ((idempotent == null ? 1 : 0) == 0) {
                    throw new AssertionError();
                }
            }
            if (DebugKt.getASSERTIONS_ENABLED()) {
                if (onCancellation != null) {
                    z = false;
                }
                if (!z) {
                    throw new AssertionError();
                }
            }
        } else if ((DispatchedTaskKt.isCancellableMode(resumeMode) || idempotent != null) && !(onCancellation == null && !(state instanceof CancelHandler) && idempotent == null)) {
            return new CompletedContinuation(proposedUpdate, state instanceof CancelHandler ? (CancelHandler) state : null, onCancellation, idempotent, (Throwable) null, 16, (DefaultConstructorMarker) null);
        }
        Object obj = proposedUpdate;
        Object obj2 = obj;
        Function1<? super Throwable, Unit> function1 = onCancellation;
        Object obj3 = idempotent;
        return obj;
    }

    private final void resumeImpl(Object update, int resumeMode, Function1<? super Throwable, Unit> onCancellation) {
        AtomicReferenceFieldUpdater handler$atomicfu$iv = _state$volatile$FU;
        while (true) {
            Object state = handler$atomicfu$iv.get(this);
            if (state instanceof NotCompleted) {
                Object proposedUpdate = update;
                int resumeMode2 = resumeMode;
                Function1<? super Throwable, Unit> onCancellation2 = onCancellation;
                if (AbstractResolvableFuture$SafeAtomicHelper$$ExternalSyntheticBackportWithForwarding0.m(_state$volatile$FU, this, state, resumedState((NotCompleted) state, proposedUpdate, resumeMode2, onCancellation2, (Object) null))) {
                    detachChildIfNonResuable();
                    dispatchResume(resumeMode2);
                    return;
                }
                update = proposedUpdate;
                resumeMode = resumeMode2;
                onCancellation = onCancellation2;
            } else {
                Object proposedUpdate2 = update;
                int i = resumeMode;
                Function1<? super Throwable, Unit> onCancellation3 = onCancellation;
                if (!(state instanceof CancelledContinuation) || !((CancelledContinuation) state).makeResumed()) {
                    alreadyResumedError(proposedUpdate2);
                    throw new KotlinNothingValueException();
                } else if (onCancellation3 != null) {
                    callOnCancellation(onCancellation3, ((CancelledContinuation) state).cause);
                    return;
                } else {
                    return;
                }
            }
        }
    }

    static /* synthetic */ void resumeImpl$default(CancellableContinuationImpl cancellableContinuationImpl, Object obj, int i, Function1 function1, int i2, Object obj2) {
        if (obj2 == null) {
            if ((i2 & 4) != 0) {
                function1 = null;
            }
            cancellableContinuationImpl.resumeImpl(obj, i, function1);
            return;
        }
        throw new UnsupportedOperationException("Super calls with default arguments not supported in this target, function: resumeImpl");
    }

    private final Symbol tryResumeImpl(Object update, Object idempotent, Function1<? super Throwable, Unit> onCancellation) {
        AtomicReferenceFieldUpdater handler$atomicfu$iv = _state$volatile$FU;
        while (true) {
            Object state = handler$atomicfu$iv.get(this);
            if (state instanceof NotCompleted) {
                Object proposedUpdate = update;
                Object idempotent2 = idempotent;
                Function1<? super Throwable, Unit> function1 = onCancellation;
                if (AbstractResolvableFuture$SafeAtomicHelper$$ExternalSyntheticBackportWithForwarding0.m(_state$volatile$FU, this, state, resumedState((NotCompleted) state, proposedUpdate, this.resumeMode, function1, idempotent2))) {
                    detachChildIfNonResuable();
                    return CancellableContinuationImplKt.RESUME_TOKEN;
                }
                update = proposedUpdate;
                onCancellation = function1;
                idempotent = idempotent2;
            } else {
                Object proposedUpdate2 = update;
                Object idempotent3 = idempotent;
                Function1<? super Throwable, Unit> function12 = onCancellation;
                if (!(state instanceof CompletedContinuation) || idempotent3 == null || ((CompletedContinuation) state).idempotentResume != idempotent3) {
                    return null;
                }
                if (!DebugKt.getASSERTIONS_ENABLED() || Intrinsics.areEqual(((CompletedContinuation) state).result, proposedUpdate2) != 0) {
                    return CancellableContinuationImplKt.RESUME_TOKEN;
                }
                throw new AssertionError();
            }
        }
    }

    private final Void alreadyResumedError(Object proposedUpdate) {
        throw new IllegalStateException(("Already resumed, but proposed with update " + proposedUpdate).toString());
    }

    private final void detachChildIfNonResuable() {
        if (!isReusable()) {
            detachChild$kotlinx_coroutines_core();
        }
    }

    public final void detachChild$kotlinx_coroutines_core() {
        DisposableHandle handle = getParentHandle();
        if (handle != null) {
            handle.dispose();
            _parentHandle$volatile$FU.set(this, NonDisposableHandle.INSTANCE);
        }
    }

    public Object tryResume(T value, Object idempotent) {
        return tryResumeImpl(value, idempotent, (Function1<? super Throwable, Unit>) null);
    }

    public Object tryResume(T value, Object idempotent, Function1<? super Throwable, Unit> onCancellation) {
        return tryResumeImpl(value, idempotent, onCancellation);
    }

    public Object tryResumeWithException(Throwable exception) {
        return tryResumeImpl(new CompletedExceptionally(exception, false, 2, (DefaultConstructorMarker) null), (Object) null, (Function1<? super Throwable, Unit>) null);
    }

    public void completeResume(Object token) {
        if (DebugKt.getASSERTIONS_ENABLED()) {
            if (!(token == CancellableContinuationImplKt.RESUME_TOKEN)) {
                throw new AssertionError();
            }
        }
        dispatchResume(this.resumeMode);
    }

    public void resumeUndispatched(CoroutineDispatcher $this$resumeUndispatched, T value) {
        Continuation<T> continuation = this.delegate;
        CoroutineDispatcher coroutineDispatcher = null;
        DispatchedContinuation dc = continuation instanceof DispatchedContinuation ? (DispatchedContinuation) continuation : null;
        if (dc != null) {
            coroutineDispatcher = dc.dispatcher;
        }
        resumeImpl$default(this, value, coroutineDispatcher == $this$resumeUndispatched ? 4 : this.resumeMode, (Function1) null, 4, (Object) null);
    }

    public void resumeUndispatchedWithException(CoroutineDispatcher $this$resumeUndispatchedWithException, Throwable exception) {
        Continuation<T> continuation = this.delegate;
        CoroutineDispatcher coroutineDispatcher = null;
        DispatchedContinuation dc = continuation instanceof DispatchedContinuation ? (DispatchedContinuation) continuation : null;
        CompletedExceptionally completedExceptionally = new CompletedExceptionally(exception, false, 2, (DefaultConstructorMarker) null);
        if (dc != null) {
            coroutineDispatcher = dc.dispatcher;
        }
        resumeImpl$default(this, completedExceptionally, coroutineDispatcher == $this$resumeUndispatchedWithException ? 4 : this.resumeMode, (Function1) null, 4, (Object) null);
    }

    public <T> T getSuccessfulResult$kotlinx_coroutines_core(Object state) {
        if (state instanceof CompletedContinuation) {
            return ((CompletedContinuation) state).result;
        }
        return state;
    }

    public Throwable getExceptionalResult$kotlinx_coroutines_core(Object state) {
        Throwable it = super.getExceptionalResult$kotlinx_coroutines_core(state);
        if (it == null) {
            return null;
        }
        Continuation<T> continuation = this.delegate;
        if (!DebugKt.getRECOVER_STACK_TRACES() || !(continuation instanceof CoroutineStackFrame)) {
            return it;
        }
        return StackTraceRecoveryKt.recoverFromStackFrame(it, (CoroutineStackFrame) continuation);
    }

    public String toString() {
        return nameString() + '(' + DebugStringsKt.toDebugString(this.delegate) + "){" + getStateDebugRepresentation() + "}@" + DebugStringsKt.getHexAddress(this);
    }

    /* access modifiers changed from: protected */
    public String nameString() {
        return "CancellableContinuation";
    }
}
