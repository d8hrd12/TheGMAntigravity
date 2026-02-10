package kotlinx.coroutines.future;

import java.util.concurrent.CompletionException;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.EmptyCoroutineContext;
import kotlin.jvm.functions.Function2;
import kotlin.jvm.internal.Lambda;
import kotlinx.coroutines.CompletableDeferred;
import kotlinx.coroutines.CoroutineExceptionHandlerKt;

@Metadata(d1 = {"\u0000\u0012\n\u0000\n\u0002\u0010\u0000\n\u0002\b\u0004\n\u0002\u0010\u0003\n\u0002\b\u0002\u0010\u0000\u001a\n \u0002*\u0004\u0018\u00010\u00010\u0001\"\u0004\b\u0000\u0010\u00032\u000e\u0010\u0004\u001a\n \u0002*\u0004\u0018\u0001H\u0003H\u00032\u000e\u0010\u0005\u001a\n \u0002*\u0004\u0018\u00010\u00060\u0006H\n¢\u0006\u0004\b\u0007\u0010\b"}, d2 = {"<anonymous>", "", "kotlin.jvm.PlatformType", "T", "value", "exception", "", "invoke", "(Ljava/lang/Object;Ljava/lang/Throwable;)Ljava/lang/Object;"}, k = 3, mv = {1, 9, 0}, xi = 48)
/* compiled from: Future.kt */
final class FutureKt$asDeferred$2 extends Lambda implements Function2<T, Throwable, Object> {
    final /* synthetic */ CompletableDeferred<T> $result;

    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    FutureKt$asDeferred$2(CompletableDeferred<T> completableDeferred) {
        super(2);
        this.$result = completableDeferred;
    }

    public final Object invoke(T value, Throwable exception) {
        boolean z;
        Throwable th;
        if (exception == null) {
            try {
                z = this.$result.complete(value);
            } catch (Throwable e) {
                CoroutineExceptionHandlerKt.handleCoroutineException(EmptyCoroutineContext.INSTANCE, e);
                return Unit.INSTANCE;
            }
        } else {
            CompletableDeferred<T> completableDeferred = this.$result;
            CompletionException completionException = exception instanceof CompletionException ? (CompletionException) exception : null;
            if (completionException == null || (th = completionException.getCause()) == null) {
                th = exception;
            }
            z = completableDeferred.completeExceptionally(th);
        }
        return Boolean.valueOf(z);
    }
}
