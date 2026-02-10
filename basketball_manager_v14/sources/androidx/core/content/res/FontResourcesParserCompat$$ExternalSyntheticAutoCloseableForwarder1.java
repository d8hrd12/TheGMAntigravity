package androidx.core.content.res;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.TimeUnit;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class FontResourcesParserCompat$$ExternalSyntheticAutoCloseableForwarder1 {
    public static /* synthetic */ void m(ExecutorService executorService) {
        boolean isTerminated;
        if (executorService != ForkJoinPool.commonPool() && !(isTerminated = executorService.isTerminated())) {
            executorService.shutdown();
            boolean z = false;
            while (!isTerminated) {
                try {
                    isTerminated = executorService.awaitTermination(1, TimeUnit.DAYS);
                } catch (InterruptedException e) {
                    if (!z) {
                        executorService.shutdownNow();
                        z = true;
                    }
                }
            }
            if (z) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
