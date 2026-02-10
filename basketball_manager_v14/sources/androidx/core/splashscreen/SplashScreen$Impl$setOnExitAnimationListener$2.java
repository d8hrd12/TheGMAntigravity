package androidx.core.splashscreen;

import android.view.View;
import androidx.core.splashscreen.SplashScreen;
import kotlin.Metadata;
import kotlin.jvm.internal.Intrinsics;

@Metadata(d1 = {"\u0000\u001f\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\b*\u0001\u0000\b\n\u0018\u00002\u00020\u0001JP\u0010\u0002\u001a\u00020\u00032\u0006\u0010\u0004\u001a\u00020\u00052\u0006\u0010\u0006\u001a\u00020\u00072\u0006\u0010\b\u001a\u00020\u00072\u0006\u0010\t\u001a\u00020\u00072\u0006\u0010\n\u001a\u00020\u00072\u0006\u0010\u000b\u001a\u00020\u00072\u0006\u0010\f\u001a\u00020\u00072\u0006\u0010\r\u001a\u00020\u00072\u0006\u0010\u000e\u001a\u00020\u0007H\u0016¨\u0006\u000f"}, d2 = {"androidx/core/splashscreen/SplashScreen$Impl$setOnExitAnimationListener$2", "Landroid/view/View$OnLayoutChangeListener;", "onLayoutChange", "", "view", "Landroid/view/View;", "left", "", "top", "right", "bottom", "oldLeft", "oldTop", "oldRight", "oldBottom", "core-splashscreen_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
/* compiled from: SplashScreen.kt */
public final class SplashScreen$Impl$setOnExitAnimationListener$2 implements View.OnLayoutChangeListener {
    final /* synthetic */ SplashScreenViewProvider $splashScreenViewProvider;
    final /* synthetic */ SplashScreen.Impl this$0;

    SplashScreen$Impl$setOnExitAnimationListener$2(SplashScreen.Impl $receiver, SplashScreenViewProvider $splashScreenViewProvider2) {
        this.this$0 = $receiver;
        this.$splashScreenViewProvider = $splashScreenViewProvider2;
    }

    public void onLayoutChange(View view, int left, int top, int right, int bottom, int oldLeft, int oldTop, int oldRight, int oldBottom) {
        Intrinsics.checkNotNullParameter(view, "view");
        if (view.isAttachedToWindow()) {
            view.removeOnLayoutChangeListener(this);
            if (!this.this$0.getSplashScreenWaitPredicate().shouldKeepOnScreen()) {
                this.this$0.dispatchOnExitAnimation(this.$splashScreenViewProvider);
            } else {
                this.this$0.mSplashScreenViewProvider = this.$splashScreenViewProvider;
            }
        }
    }
}
