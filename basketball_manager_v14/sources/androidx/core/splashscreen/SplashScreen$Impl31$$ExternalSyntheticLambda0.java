package androidx.core.splashscreen;

import android.window.SplashScreen;
import android.window.SplashScreenView;
import androidx.core.splashscreen.SplashScreen;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class SplashScreen$Impl31$$ExternalSyntheticLambda0 implements SplashScreen.OnExitAnimationListener {
    public final /* synthetic */ SplashScreen.Impl31 f$0;
    public final /* synthetic */ SplashScreen.OnExitAnimationListener f$1;

    public /* synthetic */ SplashScreen$Impl31$$ExternalSyntheticLambda0(SplashScreen.Impl31 impl31, SplashScreen.OnExitAnimationListener onExitAnimationListener) {
        this.f$0 = impl31;
        this.f$1 = onExitAnimationListener;
    }

    public final void onSplashScreenExit(SplashScreenView splashScreenView) {
        SplashScreen.Impl31.setOnExitAnimationListener$lambda$0(this.f$0, this.f$1, splashScreenView);
    }
}
