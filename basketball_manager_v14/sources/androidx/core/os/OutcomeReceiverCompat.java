package androidx.core.os;

import java.lang.Throwable;

public interface OutcomeReceiverCompat<R, E extends Throwable> {
    void onResult(R r);

    void onError(E e) {
    }
}
