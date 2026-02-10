package androidx.webkit;

import java.lang.Throwable;

public interface OutcomeReceiverCompat<T, E extends Throwable> {
    void onResult(T t);

    void onError(E e) {
    }
}
