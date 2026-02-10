package androidx.core.os;

import android.os.ProfilingManager;
import java.util.function.Consumer;
import kotlin.jvm.functions.Function0;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class Profiling$registerForAllProfilingResults$1$$ExternalSyntheticLambda2 implements Function0 {
    public final /* synthetic */ ProfilingManager f$0;
    public final /* synthetic */ Consumer f$1;

    public /* synthetic */ Profiling$registerForAllProfilingResults$1$$ExternalSyntheticLambda2(ProfilingManager profilingManager, Consumer consumer) {
        this.f$0 = profilingManager;
        this.f$1 = consumer;
    }

    public final Object invoke() {
        return Profiling$registerForAllProfilingResults$1.invokeSuspend$lambda$2(this.f$0, this.f$1);
    }
}
