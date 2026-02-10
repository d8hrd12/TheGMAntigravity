package androidx.activity;

import android.app.Activity;
import android.graphics.Rect;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlinx.coroutines.flow.FlowCollector;

@Metadata(k = 3, mv = {2, 0, 0}, xi = 48)
/* compiled from: PipHintTracker.kt */
final class PipHintTrackerKt$trackPipAnimationHintView$2<T> implements FlowCollector {
    final /* synthetic */ Activity $this_trackPipAnimationHintView;

    PipHintTrackerKt$trackPipAnimationHintView$2(Activity activity) {
        this.$this_trackPipAnimationHintView = activity;
    }

    public final Object emit(Rect hint, Continuation<? super Unit> $completion) {
        Api26Impl.INSTANCE.setPipParamsSourceRectHint(this.$this_trackPipAnimationHintView, hint);
        return Unit.INSTANCE;
    }
}
