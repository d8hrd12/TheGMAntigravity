package androidx.core.splashscreen;

import androidx.core.splashscreen.SplashScreen;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class SplashScreen$Impl$$ExternalSyntheticLambda1 implements Runnable {
    public final /* synthetic */ SplashScreenViewProvider f$0;
    public final /* synthetic */ SplashScreen.OnExitAnimationListener f$1;

    public /* synthetic */ SplashScreen$Impl$$ExternalSyntheticLambda1(SplashScreenViewProvider splashScreenViewProvider, SplashScreen.OnExitAnimationListener onExitAnimationListener) {
        this.f$0 = splashScreenViewProvider;
        this.f$1 = onExitAnimationListener;
    }

    public final void run() {
        SplashScreen.Impl.dispatchOnExitAnimation$lambda$3(this.f$0, this.f$1);
    }
}
