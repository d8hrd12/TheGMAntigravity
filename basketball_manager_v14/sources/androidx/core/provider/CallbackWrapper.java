package androidx.core.provider;

import android.graphics.Typeface;
import androidx.core.provider.FontRequestWorker;
import androidx.core.provider.FontsContractCompat;
import java.util.concurrent.Executor;

class CallbackWrapper {
    private final FontsContractCompat.FontRequestCallback mCallback;
    private final Executor mExecutor;

    CallbackWrapper(FontsContractCompat.FontRequestCallback callback, Executor executor) {
        this.mCallback = callback;
        this.mExecutor = executor;
    }

    CallbackWrapper(FontsContractCompat.FontRequestCallback callback) {
        this(callback, RequestExecutor.createHandlerExecutor(CalleeHandler.create()));
    }

    private void onTypefaceRetrieved(final Typeface typeface) {
        final FontsContractCompat.FontRequestCallback callback = this.mCallback;
        this.mExecutor.execute(new Runnable() {
            public void run() {
                callback.onTypefaceRetrieved(typeface);
            }
        });
    }

    private void onTypefaceRequestFailed(final int reason) {
        final FontsContractCompat.FontRequestCallback callback = this.mCallback;
        this.mExecutor.execute(new Runnable() {
            public void run() {
                callback.onTypefaceRequestFailed(reason);
            }
        });
    }

    /* access modifiers changed from: package-private */
    public void onTypefaceResult(FontRequestWorker.TypefaceResult typefaceResult) {
        if (typefaceResult.isSuccess()) {
            onTypefaceRetrieved(typefaceResult.mTypeface);
        } else {
            onTypefaceRequestFailed(typefaceResult.mResult);
        }
    }
}
