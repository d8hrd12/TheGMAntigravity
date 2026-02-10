package kotlinx.coroutines.selects;

import kotlin.Metadata;
import kotlin.Result;
import kotlin.ResultKt;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.intrinsics.IntrinsicsKt;
import kotlin.coroutines.jvm.internal.DebugProbesKt;
import kotlin.jvm.functions.Function1;
import kotlinx.coroutines.CancellableContinuation;
import kotlinx.coroutines.CoroutineDispatcher;

@Metadata(d1 = {"\u0000&\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0010\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010\u0003\n\u0000\u001a5\u0010\u0000\u001a\u0002H\u0001\"\u0004\b\u0000\u0010\u00012\u001f\b\u0004\u0010\u0002\u001a\u0019\u0012\n\u0012\b\u0012\u0004\u0012\u0002H\u00010\u0004\u0012\u0004\u0012\u00020\u00050\u0003¢\u0006\u0002\b\u0006HH¢\u0006\u0002\u0010\u0007\u001a5\u0010\b\u001a\u0002H\u0001\"\u0004\b\u0000\u0010\u00012\u001f\b\u0004\u0010\u0002\u001a\u0019\u0012\n\u0012\b\u0012\u0004\u0012\u0002H\u00010\u0004\u0012\u0004\u0012\u00020\u00050\u0003¢\u0006\u0002\b\u0006HH¢\u0006\u0002\u0010\u0007\u001a%\u0010\t\u001a\u00020\u0005\"\u0004\b\u0000\u0010\n*\b\u0012\u0004\u0012\u0002H\n0\u000b2\u0006\u0010\f\u001a\u0002H\nH\u0002¢\u0006\u0002\u0010\r\u001a\u0018\u0010\u000e\u001a\u00020\u0005*\u0006\u0012\u0002\b\u00030\u000b2\u0006\u0010\u000f\u001a\u00020\u0010H\u0002¨\u0006\u0011"}, d2 = {"selectOld", "R", "builder", "Lkotlin/Function1;", "Lkotlinx/coroutines/selects/SelectBuilder;", "", "Lkotlin/ExtensionFunctionType;", "(Lkotlin/jvm/functions/Function1;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "selectUnbiasedOld", "resumeUndispatched", "T", "Lkotlinx/coroutines/CancellableContinuation;", "result", "(Lkotlinx/coroutines/CancellableContinuation;Ljava/lang/Object;)V", "resumeUndispatchedWithException", "exception", "", "kotlinx-coroutines-core"}, k = 2, mv = {1, 9, 0}, xi = 48)
/* compiled from: SelectOld.kt */
public final class SelectOldKt {
    public static final <R> Object selectOld(Function1<? super SelectBuilder<? super R>, Unit> builder, Continuation<? super R> $completion) {
        SelectBuilderImpl scope = new SelectBuilderImpl($completion);
        try {
            builder.invoke(scope);
        } catch (Throwable e) {
            scope.handleBuilderException(e);
        }
        Object result = scope.getResult();
        if (result == IntrinsicsKt.getCOROUTINE_SUSPENDED()) {
            DebugProbesKt.probeCoroutineSuspended($completion);
        }
        return result;
    }

    private static final <R> Object selectOld$$forInline(Function1<? super SelectBuilder<? super R>, Unit> builder, Continuation<? super R> $completion) {
        SelectBuilderImpl scope = new SelectBuilderImpl($completion);
        try {
            builder.invoke(scope);
        } catch (Throwable e) {
            scope.handleBuilderException(e);
        }
        Object result = scope.getResult();
        if (result == IntrinsicsKt.getCOROUTINE_SUSPENDED()) {
            DebugProbesKt.probeCoroutineSuspended($completion);
        }
        return result;
    }

    public static final <R> Object selectUnbiasedOld(Function1<? super SelectBuilder<? super R>, Unit> builder, Continuation<? super R> $completion) {
        UnbiasedSelectBuilderImpl scope = new UnbiasedSelectBuilderImpl($completion);
        try {
            builder.invoke(scope);
        } catch (Throwable e) {
            scope.handleBuilderException(e);
        }
        Object initSelectResult = scope.initSelectResult();
        if (initSelectResult == IntrinsicsKt.getCOROUTINE_SUSPENDED()) {
            DebugProbesKt.probeCoroutineSuspended($completion);
        }
        return initSelectResult;
    }

    private static final <R> Object selectUnbiasedOld$$forInline(Function1<? super SelectBuilder<? super R>, Unit> builder, Continuation<? super R> $completion) {
        UnbiasedSelectBuilderImpl scope = new UnbiasedSelectBuilderImpl($completion);
        try {
            builder.invoke(scope);
        } catch (Throwable e) {
            scope.handleBuilderException(e);
        }
        Object initSelectResult = scope.initSelectResult();
        if (initSelectResult == IntrinsicsKt.getCOROUTINE_SUSPENDED()) {
            DebugProbesKt.probeCoroutineSuspended($completion);
        }
        return initSelectResult;
    }

    /* access modifiers changed from: private */
    public static final <T> void resumeUndispatched(CancellableContinuation<? super T> $this$resumeUndispatched, T result) {
        CoroutineDispatcher dispatcher = (CoroutineDispatcher) $this$resumeUndispatched.getContext().get(CoroutineDispatcher.Key);
        if (dispatcher != null) {
            $this$resumeUndispatched.resumeUndispatched(dispatcher, result);
            return;
        }
        Result.Companion companion = Result.Companion;
        $this$resumeUndispatched.resumeWith(Result.m101constructorimpl(result));
    }

    /* access modifiers changed from: private */
    public static final void resumeUndispatchedWithException(CancellableContinuation<?> $this$resumeUndispatchedWithException, Throwable exception) {
        CoroutineDispatcher dispatcher = (CoroutineDispatcher) $this$resumeUndispatchedWithException.getContext().get(CoroutineDispatcher.Key);
        if (dispatcher != null) {
            $this$resumeUndispatchedWithException.resumeUndispatchedWithException(dispatcher, exception);
            return;
        }
        Result.Companion companion = Result.Companion;
        $this$resumeUndispatchedWithException.resumeWith(Result.m101constructorimpl(ResultKt.createFailure(exception)));
    }
}
