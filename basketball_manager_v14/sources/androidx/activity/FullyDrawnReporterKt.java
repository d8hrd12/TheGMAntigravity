package androidx.activity;

import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.jvm.functions.Function1;

@Metadata(d1 = {"\u0000\u001c\n\u0000\n\u0002\u0010\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\u001a0\u0010\u0000\u001a\u00020\u0001*\u00020\u00022\u001c\u0010\u0003\u001a\u0018\b\u0001\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00010\u0005\u0012\u0006\u0012\u0004\u0018\u00010\u00060\u0004HH¢\u0006\u0002\u0010\u0007¨\u0006\b"}, d2 = {"reportWhenComplete", "", "Landroidx/activity/FullyDrawnReporter;", "reporter", "Lkotlin/Function1;", "Lkotlin/coroutines/Continuation;", "", "(Landroidx/activity/FullyDrawnReporter;Lkotlin/jvm/functions/Function1;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "activity_release"}, k = 2, mv = {2, 0, 0}, xi = 48)
/* compiled from: FullyDrawnReporter.kt */
public final class FullyDrawnReporterKt {
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0056, code lost:
        r6.removeReporter();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x005d, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:14:0x0037  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final java.lang.Object reportWhenComplete(androidx.activity.FullyDrawnReporter r5, kotlin.jvm.functions.Function1<? super kotlin.coroutines.Continuation<? super kotlin.Unit>, ? extends java.lang.Object> r6, kotlin.coroutines.Continuation<? super kotlin.Unit> r7) {
        /*
            boolean r0 = r7 instanceof androidx.activity.FullyDrawnReporterKt$reportWhenComplete$1
            if (r0 == 0) goto L_0x0014
            r0 = r7
            androidx.activity.FullyDrawnReporterKt$reportWhenComplete$1 r0 = (androidx.activity.FullyDrawnReporterKt$reportWhenComplete$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r1 = r0.label
            int r1 = r1 - r2
            r0.label = r1
            goto L_0x0019
        L_0x0014:
            androidx.activity.FullyDrawnReporterKt$reportWhenComplete$1 r0 = new androidx.activity.FullyDrawnReporterKt$reportWhenComplete$1
            r0.<init>(r7)
        L_0x0019:
            java.lang.Object r1 = r0.result
            java.lang.Object r2 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r3 = r0.label
            switch(r3) {
                case 0: goto L_0x0037;
                case 1: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r5 = new java.lang.IllegalStateException
            java.lang.String r6 = "call to 'resume' before 'invoke' with coroutine"
            r5.<init>(r6)
            throw r5
        L_0x002c:
            r5 = 0
            java.lang.Object r6 = r0.L$0
            androidx.activity.FullyDrawnReporter r6 = (androidx.activity.FullyDrawnReporter) r6
            kotlin.ResultKt.throwOnFailure(r1)     // Catch:{ all -> 0x0035 }
            goto L_0x0056
        L_0x0035:
            r2 = move-exception
            goto L_0x0061
        L_0x0037:
            kotlin.ResultKt.throwOnFailure(r1)
            r3 = 0
            r5.addReporter()
            boolean r4 = r5.isFullyDrawnReported()
            if (r4 == 0) goto L_0x0047
            kotlin.Unit r6 = kotlin.Unit.INSTANCE
            return r6
        L_0x0047:
            r0.L$0 = r5     // Catch:{ all -> 0x005e }
            r4 = 1
            r0.label = r4     // Catch:{ all -> 0x005e }
            java.lang.Object r4 = r6.invoke(r0)     // Catch:{ all -> 0x005e }
            if (r4 != r2) goto L_0x0054
            return r2
        L_0x0054:
            r6 = r5
            r5 = r3
        L_0x0056:
            r6.removeReporter()
            kotlin.Unit r2 = kotlin.Unit.INSTANCE
            return r2
        L_0x005e:
            r2 = move-exception
            r6 = r5
            r5 = r3
        L_0x0061:
            r6.removeReporter()
            throw r2
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.activity.FullyDrawnReporterKt.reportWhenComplete(androidx.activity.FullyDrawnReporter, kotlin.jvm.functions.Function1, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX INFO: finally extract failed */
    private static final Object reportWhenComplete$$forInline(FullyDrawnReporter $this$reportWhenComplete, Function1<? super Continuation<? super Unit>, ? extends Object> reporter, Continuation<? super Unit> $completion) {
        $this$reportWhenComplete.addReporter();
        if ($this$reportWhenComplete.isFullyDrawnReported()) {
            return Unit.INSTANCE;
        }
        try {
            reporter.invoke($completion);
            $this$reportWhenComplete.removeReporter();
            return Unit.INSTANCE;
        } catch (Throwable th) {
            $this$reportWhenComplete.removeReporter();
            throw th;
        }
    }
}
