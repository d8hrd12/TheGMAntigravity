package androidx.core.os;

import android.os.ProfilingResult;
import java.util.function.Consumer;
import kotlinx.coroutines.channels.ProducerScope;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class Profiling$registerForAllProfilingResults$1$$ExternalSyntheticLambda0 implements Consumer {
    public final /* synthetic */ ProducerScope f$0;

    public /* synthetic */ Profiling$registerForAllProfilingResults$1$$ExternalSyntheticLambda0(ProducerScope producerScope) {
        this.f$0 = producerScope;
    }

    public final void accept(Object obj) {
        Profiling$registerForAllProfilingResults$1.invokeSuspend$lambda$0(this.f$0, (ProfilingResult) obj);
    }
}
