package androidx.webkit;

import android.os.Handler;
import android.os.Looper;
import java.util.concurrent.Executor;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class WebStorageCompat$$ExternalSyntheticLambda1 implements Executor {
    public final void execute(Runnable runnable) {
        new Handler(Looper.getMainLooper()).post(runnable);
    }
}
