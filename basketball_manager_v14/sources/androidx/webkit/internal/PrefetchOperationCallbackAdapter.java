package androidx.webkit.internal;

import androidx.webkit.OutcomeReceiverCompat;
import androidx.webkit.PrefetchException;
import androidx.webkit.PrefetchNetworkException;
import java.lang.reflect.InvocationHandler;
import org.chromium.support_lib_boundary.PrefetchOperationCallbackBoundaryInterface;
import org.chromium.support_lib_boundary.util.BoundaryInterfaceReflectionUtil;

public class PrefetchOperationCallbackAdapter {
    public static InvocationHandler buildInvocationHandler(final OutcomeReceiverCompat<Void, PrefetchException> callback) {
        return BoundaryInterfaceReflectionUtil.createInvocationHandlerFor(new PrefetchOperationCallbackBoundaryInterface() {
            public void onSuccess() {
                OutcomeReceiverCompat.this.onResult(null);
            }

            public void onFailure(int type, String message, int networkErrorCode) {
                if (type == 1) {
                    OutcomeReceiverCompat.this.onError(new PrefetchNetworkException(message, networkErrorCode));
                } else {
                    OutcomeReceiverCompat.this.onError(new PrefetchException(message));
                }
            }
        });
    }
}
