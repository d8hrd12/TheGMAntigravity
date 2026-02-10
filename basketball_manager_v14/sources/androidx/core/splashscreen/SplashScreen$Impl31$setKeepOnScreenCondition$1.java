package androidx.core.splashscreen;

import android.view.View;
import android.view.ViewTreeObserver;
import androidx.core.splashscreen.SplashScreen;
import kotlin.Metadata;

@Metadata(d1 = {"\u0000\u0011\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0000*\u0001\u0000\b\n\u0018\u00002\u00020\u0001J\b\u0010\u0002\u001a\u00020\u0003H\u0016¨\u0006\u0004"}, d2 = {"androidx/core/splashscreen/SplashScreen$Impl31$setKeepOnScreenCondition$1", "Landroid/view/ViewTreeObserver$OnPreDrawListener;", "onPreDraw", "", "core-splashscreen_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
/* compiled from: SplashScreen.kt */
public final class SplashScreen$Impl31$setKeepOnScreenCondition$1 implements ViewTreeObserver.OnPreDrawListener {
    final /* synthetic */ View $contentView;
    final /* synthetic */ SplashScreen.Impl31 this$0;

    SplashScreen$Impl31$setKeepOnScreenCondition$1(SplashScreen.Impl31 $receiver, View $contentView2) {
        this.this$0 = $receiver;
        this.$contentView = $contentView2;
    }

    public boolean onPreDraw() {
        if (this.this$0.getSplashScreenWaitPredicate().shouldKeepOnScreen()) {
            return false;
        }
        this.$contentView.getViewTreeObserver().removeOnPreDrawListener(this);
        return true;
    }
}
