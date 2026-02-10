package androidx.core.os;

import android.os.Bundle;
import android.os.CancellationSignal;
import kotlin.Metadata;
import kotlin.jvm.internal.Intrinsics;

@Metadata(d1 = {"\u0000$\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u000b\b\u0007\u0018\u00002\u00020\u0001B-\b\u0000\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u0012\b\u0010\u0006\u001a\u0004\u0018\u00010\u0007\u0012\b\u0010\b\u001a\u0004\u0018\u00010\t¢\u0006\u0004\b\n\u0010\u000bR\u0011\u0010\u0002\u001a\u00020\u0003¢\u0006\b\n\u0000\u001a\u0004\b\f\u0010\rR\u0011\u0010\u0004\u001a\u00020\u0005¢\u0006\b\n\u0000\u001a\u0004\b\u000e\u0010\u000fR\u0013\u0010\u0006\u001a\u0004\u0018\u00010\u0007¢\u0006\b\n\u0000\u001a\u0004\b\u0010\u0010\u0011R\u0013\u0010\b\u001a\u0004\u0018\u00010\t¢\u0006\b\n\u0000\u001a\u0004\b\u0012\u0010\u0013¨\u0006\u0014"}, d2 = {"Landroidx/core/os/ProfilingRequest;", "", "profilingType", "", "params", "Landroid/os/Bundle;", "tag", "", "cancellationSignal", "Landroid/os/CancellationSignal;", "<init>", "(ILandroid/os/Bundle;Ljava/lang/String;Landroid/os/CancellationSignal;)V", "getProfilingType", "()I", "getParams", "()Landroid/os/Bundle;", "getTag", "()Ljava/lang/String;", "getCancellationSignal", "()Landroid/os/CancellationSignal;", "core_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
/* compiled from: Profiling.kt */
public final class ProfilingRequest {
    private final CancellationSignal cancellationSignal;
    private final Bundle params;
    private final int profilingType;
    private final String tag;

    public ProfilingRequest(int profilingType2, Bundle params2, String tag2, CancellationSignal cancellationSignal2) {
        Intrinsics.checkNotNullParameter(params2, "params");
        this.profilingType = profilingType2;
        this.params = params2;
        this.tag = tag2;
        this.cancellationSignal = cancellationSignal2;
    }

    public final int getProfilingType() {
        return this.profilingType;
    }

    public final Bundle getParams() {
        return this.params;
    }

    public final String getTag() {
        return this.tag;
    }

    public final CancellationSignal getCancellationSignal() {
        return this.cancellationSignal;
    }
}
