package kotlinx.coroutines;

import kotlin.ExceptionsKt;
import kotlin.Metadata;
import kotlin.coroutines.Continuation;
import kotlin.jvm.internal.Intrinsics;
import kotlinx.coroutines.scheduling.Task;

@Metadata(d1 = {"\u00004\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u0003\n\u0002\b\u000f\b!\u0018\u0000*\u0006\b\u0000\u0010\u0001 \u00002\u00060\u0002j\u0002`\u0003B\u000f\b\u0000\u0012\u0006\u0010\u0004\u001a\u00020\u0005¢\u0006\u0002\u0010\u0006J\u001f\u0010\u000b\u001a\u00020\f2\b\u0010\r\u001a\u0004\u0018\u00010\u000e2\u0006\u0010\u000f\u001a\u00020\u0010H\u0010¢\u0006\u0002\b\u0011J\u0019\u0010\u0012\u001a\u0004\u0018\u00010\u00102\b\u0010\u0013\u001a\u0004\u0018\u00010\u000eH\u0010¢\u0006\u0002\b\u0014J\u001f\u0010\u0015\u001a\u0002H\u0001\"\u0004\b\u0001\u0010\u00012\b\u0010\u0013\u001a\u0004\u0018\u00010\u000eH\u0010¢\u0006\u0004\b\u0016\u0010\u0017J!\u0010\u0018\u001a\u00020\f2\b\u0010\u0019\u001a\u0004\u0018\u00010\u00102\b\u0010\u001a\u001a\u0004\u0018\u00010\u0010H\u0000¢\u0006\u0002\b\u001bJ\u0006\u0010\u001c\u001a\u00020\fJ\u000f\u0010\u001d\u001a\u0004\u0018\u00010\u000eH ¢\u0006\u0002\b\u001eR\u0018\u0010\u0007\u001a\b\u0012\u0004\u0012\u00028\u00000\bX \u0004¢\u0006\u0006\u001a\u0004\b\t\u0010\nR\u0012\u0010\u0004\u001a\u00020\u00058\u0006@\u0006X\u000e¢\u0006\u0002\n\u0000¨\u0006\u001f"}, d2 = {"Lkotlinx/coroutines/DispatchedTask;", "T", "Lkotlinx/coroutines/scheduling/Task;", "Lkotlinx/coroutines/SchedulerTask;", "resumeMode", "", "(I)V", "delegate", "Lkotlin/coroutines/Continuation;", "getDelegate$kotlinx_coroutines_core", "()Lkotlin/coroutines/Continuation;", "cancelCompletedResult", "", "takenState", "", "cause", "", "cancelCompletedResult$kotlinx_coroutines_core", "getExceptionalResult", "state", "getExceptionalResult$kotlinx_coroutines_core", "getSuccessfulResult", "getSuccessfulResult$kotlinx_coroutines_core", "(Ljava/lang/Object;)Ljava/lang/Object;", "handleFatalException", "exception", "finallyException", "handleFatalException$kotlinx_coroutines_core", "run", "takeState", "takeState$kotlinx_coroutines_core", "kotlinx-coroutines-core"}, k = 1, mv = {1, 9, 0}, xi = 48)
/* compiled from: DispatchedTask.kt */
public abstract class DispatchedTask<T> extends Task {
    public int resumeMode;

    public abstract Continuation<T> getDelegate$kotlinx_coroutines_core();

    public abstract Object takeState$kotlinx_coroutines_core();

    public DispatchedTask(int resumeMode2) {
        this.resumeMode = resumeMode2;
    }

    public void cancelCompletedResult$kotlinx_coroutines_core(Object takenState, Throwable cause) {
    }

    public <T> T getSuccessfulResult$kotlinx_coroutines_core(Object state) {
        return state;
    }

    public Throwable getExceptionalResult$kotlinx_coroutines_core(Object state) {
        CompletedExceptionally completedExceptionally = state instanceof CompletedExceptionally ? (CompletedExceptionally) state : null;
        if (completedExceptionally != null) {
            return completedExceptionally.cause;
        }
        return null;
    }

    /* JADX WARNING: Code restructure failed: missing block: B:57:0x00f2, code lost:
        if (r11.clearThreadContext() != false) goto L_0x00f4;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:68:0x0117, code lost:
        if (r11.clearThreadContext() != false) goto L_0x0119;
     */
    /* JADX WARNING: Removed duplicated region for block: B:55:0x00ee A[SYNTHETIC, Splitter:B:55:0x00ee] */
    /* JADX WARNING: Removed duplicated region for block: B:66:0x0113 A[SYNTHETIC, Splitter:B:66:0x0113] */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final void run() {
        /*
            r21 = this;
            r1 = r21
            boolean r0 = kotlinx.coroutines.DebugKt.getASSERTIONS_ENABLED()
            if (r0 == 0) goto L_0x001a
            r0 = 0
            int r2 = r1.resumeMode
            r3 = -1
            if (r2 == r3) goto L_0x0010
            r2 = 1
            goto L_0x0011
        L_0x0010:
            r2 = 0
        L_0x0011:
            if (r2 == 0) goto L_0x0014
            goto L_0x001a
        L_0x0014:
            java.lang.AssertionError r0 = new java.lang.AssertionError
            r0.<init>()
            throw r0
        L_0x001a:
            kotlinx.coroutines.scheduling.TaskContext r2 = r1.taskContext
            r3 = 0
            kotlin.coroutines.Continuation r0 = r1.getDelegate$kotlinx_coroutines_core()     // Catch:{ all -> 0x0120 }
            java.lang.String r4 = "null cannot be cast to non-null type kotlinx.coroutines.internal.DispatchedContinuation<T of kotlinx.coroutines.DispatchedTask>"
            kotlin.jvm.internal.Intrinsics.checkNotNull(r0, r4)     // Catch:{ all -> 0x0120 }
            kotlinx.coroutines.internal.DispatchedContinuation r0 = (kotlinx.coroutines.internal.DispatchedContinuation) r0     // Catch:{ all -> 0x0120 }
            r4 = r0
            kotlin.coroutines.Continuation<T> r0 = r4.continuation     // Catch:{ all -> 0x0120 }
            r5 = r0
            java.lang.Object r0 = r4.countOrElement     // Catch:{ all -> 0x0120 }
            r6 = r0
            r7 = 0
            kotlin.coroutines.CoroutineContext r0 = r5.getContext()     // Catch:{ all -> 0x0120 }
            r8 = r0
            java.lang.Object r0 = kotlinx.coroutines.internal.ThreadContextKt.updateThreadContext(r8, r6)     // Catch:{ all -> 0x0120 }
            r9 = r0
            kotlinx.coroutines.internal.Symbol r0 = kotlinx.coroutines.internal.ThreadContextKt.NO_THREAD_ELEMENTS     // Catch:{ all -> 0x0120 }
            r10 = 0
            if (r9 == r0) goto L_0x004a
            kotlinx.coroutines.UndispatchedCoroutine r0 = kotlinx.coroutines.CoroutineContextKt.updateUndispatchedCompletion(r5, r8, r9)     // Catch:{ all -> 0x0045 }
            goto L_0x004b
        L_0x0045:
            r0 = move-exception
            r19 = r2
            goto L_0x0123
        L_0x004a:
            r0 = r10
        L_0x004b:
            r11 = r0
            r0 = 0
            kotlin.coroutines.CoroutineContext r12 = r5.getContext()     // Catch:{ all -> 0x010c }
            java.lang.Object r13 = r1.takeState$kotlinx_coroutines_core()     // Catch:{ all -> 0x010c }
            java.lang.Throwable r14 = r1.getExceptionalResult$kotlinx_coroutines_core(r13)     // Catch:{ all -> 0x010c }
            if (r14 != 0) goto L_0x0076
            int r15 = r1.resumeMode     // Catch:{ all -> 0x006f }
            boolean r15 = kotlinx.coroutines.DispatchedTaskKt.isCancellableMode(r15)     // Catch:{ all -> 0x006f }
            if (r15 == 0) goto L_0x0076
            kotlinx.coroutines.Job$Key r10 = kotlinx.coroutines.Job.Key     // Catch:{ all -> 0x006f }
            kotlin.coroutines.CoroutineContext$Key r10 = (kotlin.coroutines.CoroutineContext.Key) r10     // Catch:{ all -> 0x006f }
            kotlin.coroutines.CoroutineContext$Element r10 = r12.get(r10)     // Catch:{ all -> 0x006f }
            kotlinx.coroutines.Job r10 = (kotlinx.coroutines.Job) r10     // Catch:{ all -> 0x006f }
            goto L_0x0076
        L_0x006f:
            r0 = move-exception
            r19 = r2
            r20 = r4
            goto L_0x0111
        L_0x0076:
            if (r10 == 0) goto L_0x00c5
            boolean r15 = r10.isActive()     // Catch:{ all -> 0x010c }
            if (r15 != 0) goto L_0x00c5
            java.util.concurrent.CancellationException r15 = r10.getCancellationException()     // Catch:{ all -> 0x010c }
            r16 = r0
            r0 = r15
            java.lang.Throwable r0 = (java.lang.Throwable) r0     // Catch:{ all -> 0x010c }
            r1.cancelCompletedResult$kotlinx_coroutines_core(r13, r0)     // Catch:{ all -> 0x010c }
            r0 = r5
            r17 = 0
            kotlin.Result$Companion r18 = kotlin.Result.Companion     // Catch:{ all -> 0x010c }
            r18 = 0
            boolean r19 = kotlinx.coroutines.DebugKt.getRECOVER_STACK_TRACES()     // Catch:{ all -> 0x010c }
            if (r19 == 0) goto L_0x00b1
            r19 = r2
            boolean r2 = r0 instanceof kotlin.coroutines.jvm.internal.CoroutineStackFrame     // Catch:{ all -> 0x00ad }
            if (r2 != 0) goto L_0x00a0
            r20 = r4
            goto L_0x00b5
        L_0x00a0:
            r2 = r15
            java.lang.Throwable r2 = (java.lang.Throwable) r2     // Catch:{ all -> 0x00ad }
            r20 = r4
            r4 = r0
            kotlin.coroutines.jvm.internal.CoroutineStackFrame r4 = (kotlin.coroutines.jvm.internal.CoroutineStackFrame) r4     // Catch:{ all -> 0x010a }
            java.lang.Throwable r2 = kotlinx.coroutines.internal.StackTraceRecoveryKt.recoverFromStackFrame(r2, r4)     // Catch:{ all -> 0x010a }
            goto L_0x00b8
        L_0x00ad:
            r0 = move-exception
            r20 = r4
            goto L_0x0111
        L_0x00b1:
            r19 = r2
            r20 = r4
        L_0x00b5:
            r2 = r15
            java.lang.Throwable r2 = (java.lang.Throwable) r2     // Catch:{ all -> 0x010a }
        L_0x00b8:
            java.lang.Object r2 = kotlin.ResultKt.createFailure(r2)     // Catch:{ all -> 0x010a }
            java.lang.Object r2 = kotlin.Result.m101constructorimpl(r2)     // Catch:{ all -> 0x010a }
            r0.resumeWith(r2)     // Catch:{ all -> 0x010a }
            goto L_0x00e8
        L_0x00c5:
            r16 = r0
            r19 = r2
            r20 = r4
            if (r14 == 0) goto L_0x00db
            kotlin.Result$Companion r0 = kotlin.Result.Companion     // Catch:{ all -> 0x010a }
            java.lang.Object r0 = kotlin.ResultKt.createFailure(r14)     // Catch:{ all -> 0x010a }
            java.lang.Object r0 = kotlin.Result.m101constructorimpl(r0)     // Catch:{ all -> 0x010a }
            r5.resumeWith(r0)     // Catch:{ all -> 0x010a }
            goto L_0x00e8
        L_0x00db:
            kotlin.Result$Companion r0 = kotlin.Result.Companion     // Catch:{ all -> 0x010a }
            java.lang.Object r0 = r1.getSuccessfulResult$kotlinx_coroutines_core(r13)     // Catch:{ all -> 0x010a }
            java.lang.Object r0 = kotlin.Result.m101constructorimpl(r0)     // Catch:{ all -> 0x010a }
            r5.resumeWith(r0)     // Catch:{ all -> 0x010a }
        L_0x00e8:
            kotlin.Unit r0 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x010a }
            if (r11 == 0) goto L_0x00f4
            boolean r0 = r11.clearThreadContext()     // Catch:{ all -> 0x011e }
            if (r0 == 0) goto L_0x00f7
        L_0x00f4:
            kotlinx.coroutines.internal.ThreadContextKt.restoreThreadContext(r8, r9)     // Catch:{ all -> 0x011e }
        L_0x00f7:
            kotlin.Result$Companion r0 = kotlin.Result.Companion     // Catch:{ all -> 0x0108 }
            r0 = r1
            kotlinx.coroutines.DispatchedTask r0 = (kotlinx.coroutines.DispatchedTask) r0     // Catch:{ all -> 0x0108 }
            r2 = 0
            r19.afterTask()     // Catch:{ all -> 0x0108 }
            kotlin.Unit r0 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x0108 }
            java.lang.Object r0 = kotlin.Result.m101constructorimpl(r0)     // Catch:{ all -> 0x0108 }
            goto L_0x013e
        L_0x0108:
            r0 = move-exception
            goto L_0x0134
        L_0x010a:
            r0 = move-exception
            goto L_0x0111
        L_0x010c:
            r0 = move-exception
            r19 = r2
            r20 = r4
        L_0x0111:
            if (r11 == 0) goto L_0x0119
            boolean r2 = r11.clearThreadContext()     // Catch:{ all -> 0x011e }
            if (r2 == 0) goto L_0x011c
        L_0x0119:
            kotlinx.coroutines.internal.ThreadContextKt.restoreThreadContext(r8, r9)     // Catch:{ all -> 0x011e }
        L_0x011c:
            throw r0     // Catch:{ all -> 0x011e }
        L_0x011e:
            r0 = move-exception
            goto L_0x0123
        L_0x0120:
            r0 = move-exception
            r19 = r2
        L_0x0123:
            r3 = r0
            kotlin.Result$Companion r0 = kotlin.Result.Companion     // Catch:{ all -> 0x0133 }
            r0 = r21
            r2 = 0
            r19.afterTask()     // Catch:{ all -> 0x0133 }
            kotlin.Unit r0 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x0133 }
            java.lang.Object r0 = kotlin.Result.m101constructorimpl(r0)     // Catch:{ all -> 0x0133 }
            goto L_0x013e
        L_0x0133:
            r0 = move-exception
        L_0x0134:
            kotlin.Result$Companion r2 = kotlin.Result.Companion
            java.lang.Object r0 = kotlin.ResultKt.createFailure(r0)
            java.lang.Object r0 = kotlin.Result.m101constructorimpl(r0)
        L_0x013e:
            java.lang.Throwable r2 = kotlin.Result.m104exceptionOrNullimpl(r0)
            r1.handleFatalException$kotlinx_coroutines_core(r3, r2)
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.DispatchedTask.run():void");
    }

    public final void handleFatalException$kotlinx_coroutines_core(Throwable exception, Throwable finallyException) {
        if (exception != null || finallyException != null) {
            if (!(exception == null || finallyException == null)) {
                ExceptionsKt.addSuppressed(exception, finallyException);
            }
            Throwable cause = exception == null ? finallyException : exception;
            Intrinsics.checkNotNull(cause);
            CoroutineExceptionHandlerKt.handleCoroutineException(getDelegate$kotlinx_coroutines_core().getContext(), new CoroutinesInternalError("Fatal exception in coroutines machinery for " + this + ". Please read KDoc to 'handleFatalException' method and report this incident to maintainers", cause));
        }
    }
}
