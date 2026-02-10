package kotlinx.coroutines.future;

import java.util.concurrent.CancellationException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.ExecutionException;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.CoroutineContext;
import kotlin.coroutines.EmptyCoroutineContext;
import kotlin.coroutines.intrinsics.IntrinsicsKt;
import kotlin.coroutines.jvm.internal.DebugProbesKt;
import kotlin.jvm.functions.Function2;
import kotlinx.coroutines.CancellableContinuation;
import kotlinx.coroutines.CancellableContinuationImpl;
import kotlinx.coroutines.CompletableDeferred;
import kotlinx.coroutines.CompletableDeferredKt;
import kotlinx.coroutines.CoroutineContextKt;
import kotlinx.coroutines.CoroutineScope;
import kotlinx.coroutines.CoroutineStart;
import kotlinx.coroutines.Deferred;
import kotlinx.coroutines.ExceptionsKt;
import kotlinx.coroutines.Job;
import kotlinx.coroutines.JobKt;

@Metadata(d1 = {"\u0000D\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\u001a\u001c\u0010\u0000\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u0003\u001a\u0010\u0010\u0000\u001a\b\u0012\u0004\u0012\u00020\u00040\u0001*\u00020\u0005\u001a\u001c\u0010\u0006\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0003\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u0007\u001a\u001e\u0010\b\u001a\u0002H\u0002\"\u0004\b\u0000\u0010\u0002*\b\u0012\u0004\u0012\u0002H\u00020\u0007H@¢\u0006\u0002\u0010\t\u001aX\u0010\n\u001a\b\u0012\u0004\u0012\u0002H\u00020\u0001\"\u0004\b\u0000\u0010\u0002*\u00020\u000b2\b\b\u0002\u0010\f\u001a\u00020\r2\b\b\u0002\u0010\u000e\u001a\u00020\u000f2'\u0010\u0010\u001a#\b\u0001\u0012\u0004\u0012\u00020\u000b\u0012\n\u0012\b\u0012\u0004\u0012\u0002H\u00020\u0012\u0012\u0006\u0012\u0004\u0018\u00010\u00130\u0011¢\u0006\u0002\b\u0014¢\u0006\u0002\u0010\u0015\u001a\u0018\u0010\u0016\u001a\u00020\u0004*\u00020\u00052\n\u0010\n\u001a\u0006\u0012\u0002\b\u00030\u0001H\u0002¨\u0006\u0017"}, d2 = {"asCompletableFuture", "Ljava/util/concurrent/CompletableFuture;", "T", "Lkotlinx/coroutines/Deferred;", "", "Lkotlinx/coroutines/Job;", "asDeferred", "Ljava/util/concurrent/CompletionStage;", "await", "(Ljava/util/concurrent/CompletionStage;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "future", "Lkotlinx/coroutines/CoroutineScope;", "context", "Lkotlin/coroutines/CoroutineContext;", "start", "Lkotlinx/coroutines/CoroutineStart;", "block", "Lkotlin/Function2;", "Lkotlin/coroutines/Continuation;", "", "Lkotlin/ExtensionFunctionType;", "(Lkotlinx/coroutines/CoroutineScope;Lkotlin/coroutines/CoroutineContext;Lkotlinx/coroutines/CoroutineStart;Lkotlin/jvm/functions/Function2;)Ljava/util/concurrent/CompletableFuture;", "setupCancellation", "kotlinx-coroutines-core"}, k = 2, mv = {1, 9, 0}, xi = 48)
/* compiled from: Future.kt */
public final class FutureKt {
    public static /* synthetic */ CompletableFuture future$default(CoroutineScope coroutineScope, CoroutineContext coroutineContext, CoroutineStart coroutineStart, Function2 function2, int i, Object obj) {
        if ((i & 1) != 0) {
            coroutineContext = EmptyCoroutineContext.INSTANCE;
        }
        if ((i & 2) != 0) {
            coroutineStart = CoroutineStart.DEFAULT;
        }
        return future(coroutineScope, coroutineContext, coroutineStart, function2);
    }

    public static final <T> CompletableFuture<T> future(CoroutineScope $this$future, CoroutineContext context, CoroutineStart start, Function2<? super CoroutineScope, ? super Continuation<? super T>, ? extends Object> block) {
        if (!start.isLazy()) {
            CoroutineContext newContext = CoroutineContextKt.newCoroutineContext($this$future, context);
            CompletableFuture future = new CompletableFuture();
            CompletableFutureCoroutine coroutine = new CompletableFutureCoroutine(newContext, future);
            future.handle(coroutine);
            coroutine.start(start, coroutine, block);
            return future;
        }
        throw new IllegalArgumentException((start + " start is not supported").toString());
    }

    public static final <T> CompletableFuture<T> asCompletableFuture(Deferred<? extends T> $this$asCompletableFuture) {
        CompletableFuture future = new CompletableFuture();
        setupCancellation($this$asCompletableFuture, future);
        $this$asCompletableFuture.invokeOnCompletion(new FutureKt$asCompletableFuture$1(future, $this$asCompletableFuture));
        return future;
    }

    public static final CompletableFuture<Unit> asCompletableFuture(Job $this$asCompletableFuture) {
        CompletableFuture future = new CompletableFuture();
        setupCancellation($this$asCompletableFuture, future);
        $this$asCompletableFuture.invokeOnCompletion(new FutureKt$asCompletableFuture$2(future));
        return future;
    }

    private static final void setupCancellation(Job $this$setupCancellation, CompletableFuture<?> future) {
        future.handle(new FutureKt$$ExternalSyntheticLambda1($this$setupCancellation));
    }

    /* access modifiers changed from: private */
    public static final Unit setupCancellation$lambda$2(Job $this_setupCancellation, Object obj, Throwable exception) {
        CancellationException cancellationException = null;
        if (exception != null) {
            Throwable it = exception;
            if (it instanceof CancellationException) {
                cancellationException = (CancellationException) it;
            }
            if (cancellationException == null) {
                cancellationException = ExceptionsKt.CancellationException("CompletableFuture was completed exceptionally", it);
            }
        }
        $this_setupCancellation.cancel(cancellationException);
        return Unit.INSTANCE;
    }

    public static final <T> Deferred<T> asDeferred(CompletionStage<T> $this$asDeferred) {
        Throwable original;
        CompletableFuture<T> completableFuture = $this$asDeferred.toCompletableFuture();
        if (completableFuture.isDone()) {
            try {
                return CompletableDeferredKt.CompletableDeferred(completableFuture.get());
            } catch (Throwable th) {
                ExecutionException executionException = th instanceof ExecutionException ? th : null;
                if (executionException == null || (original = executionException.getCause()) == null) {
                    original = th;
                }
                CompletableDeferred it = CompletableDeferredKt.CompletableDeferred$default((Job) null, 1, (Object) null);
                it.completeExceptionally(original);
                return it;
            }
        } else {
            CompletableDeferred result = CompletableDeferredKt.CompletableDeferred$default((Job) null, 1, (Object) null);
            $this$asDeferred.handle(new FutureKt$$ExternalSyntheticLambda0(new FutureKt$asDeferred$2(result)));
            JobKt.cancelFutureOnCompletion(result, completableFuture);
            return result;
        }
    }

    /* access modifiers changed from: private */
    public static final Object asDeferred$lambda$4(Function2 $tmp0, Object p0, Throwable p1) {
        return $tmp0.invoke(p0, p1);
    }

    public static final <T> Object await(CompletionStage<T> $this$await, Continuation<? super T> $completion) {
        CompletableFuture future = $this$await.toCompletableFuture();
        if (future.isDone()) {
            try {
                return future.get();
            } catch (ExecutionException e) {
                Throwable cause = e.getCause();
                if (cause == null) {
                    cause = e;
                }
                throw cause;
            }
        } else {
            CancellableContinuationImpl cancellable$iv = new CancellableContinuationImpl(IntrinsicsKt.intercepted($completion), 1);
            cancellable$iv.initCancellability();
            CancellableContinuation cont = cancellable$iv;
            ContinuationHandler consumer = new ContinuationHandler(cont);
            $this$await.handle(consumer);
            cont.invokeOnCancellation(new FutureKt$await$2$1(future, consumer));
            Object result = cancellable$iv.getResult();
            if (result == IntrinsicsKt.getCOROUTINE_SUSPENDED()) {
                DebugProbesKt.probeCoroutineSuspended($completion);
            }
            return result;
        }
    }
}
