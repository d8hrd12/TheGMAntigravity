package org.apache.cordova;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.os.Handler;
import android.view.animation.AccelerateInterpolator;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.splashscreen.SplashScreenViewProvider;
import org.json.JSONArray;
import org.json.JSONException;

public class SplashScreenPlugin extends CordovaPlugin {
    private static final boolean DEFAULT_AUTO_HIDE = true;
    private static final int DEFAULT_DELAY_TIME = -1;
    private static final boolean DEFAULT_FADE = true;
    private static final int DEFAULT_FADE_TIME = 500;
    static final String PLUGIN_NAME = "CordovaSplashScreenPlugin";
    private boolean autoHide;
    private int delayTime;
    /* access modifiers changed from: private */
    public int fadeDuration;
    private boolean isFadeEnabled;
    private boolean keepOnScreen = true;

    /* access modifiers changed from: protected */
    public void pluginInitialize() {
        this.autoHide = this.preferences.getBoolean("AutoHideSplashScreen", true);
        this.delayTime = this.preferences.getInteger("SplashScreenDelay", -1);
        LOG.d(PLUGIN_NAME, "Auto Hide: " + this.autoHide);
        if (this.delayTime != -1) {
            LOG.d(PLUGIN_NAME, "Delay: " + this.delayTime + "ms");
        }
        this.isFadeEnabled = this.preferences.getBoolean("FadeSplashScreen", true);
        this.fadeDuration = this.preferences.getInteger("FadeSplashScreenDuration", DEFAULT_FADE_TIME);
        LOG.d(PLUGIN_NAME, "Fade: " + this.isFadeEnabled);
        if (this.isFadeEnabled) {
            LOG.d(PLUGIN_NAME, "Fade Duration: " + this.fadeDuration + "ms");
        }
    }

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (!action.equals("hide") || this.autoHide) {
            return false;
        }
        this.keepOnScreen = false;
        callbackContext.success();
        return true;
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public java.lang.Object onMessage(java.lang.String r2, java.lang.Object r3) {
        /*
            r1 = this;
            int r0 = r2.hashCode()
            switch(r0) {
                case -505277536: goto L_0x0012;
                case 545384656: goto L_0x0008;
                default: goto L_0x0007;
            }
        L_0x0007:
            goto L_0x001c
        L_0x0008:
            java.lang.String r0 = "setupSplashScreen"
            boolean r0 = r2.equals(r0)
            if (r0 == 0) goto L_0x0007
            r0 = 0
            goto L_0x001d
        L_0x0012:
            java.lang.String r0 = "onPageFinished"
            boolean r0 = r2.equals(r0)
            if (r0 == 0) goto L_0x0007
            r0 = 1
            goto L_0x001d
        L_0x001c:
            r0 = -1
        L_0x001d:
            switch(r0) {
                case 0: goto L_0x0025;
                case 1: goto L_0x0021;
                default: goto L_0x0020;
            }
        L_0x0020:
            goto L_0x002c
        L_0x0021:
            r1.attemptCloseOnPageFinished()
            goto L_0x002c
        L_0x0025:
            r0 = r3
            androidx.core.splashscreen.SplashScreen r0 = (androidx.core.splashscreen.SplashScreen) r0
            r1.setupSplashScreen(r0)
        L_0x002c:
            r0 = 0
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: org.apache.cordova.SplashScreenPlugin.onMessage(java.lang.String, java.lang.Object):java.lang.Object");
    }

    private void setupSplashScreen(SplashScreen splashScreen) {
        splashScreen.setKeepOnScreenCondition(new SplashScreenPlugin$$ExternalSyntheticLambda0(this));
        if (this.autoHide && this.delayTime != -1) {
            new Handler(this.cordova.getContext().getMainLooper()).postDelayed(new SplashScreenPlugin$$ExternalSyntheticLambda1(this), (long) this.delayTime);
        }
        if (this.isFadeEnabled) {
            splashScreen.setOnExitAnimationListener(new SplashScreen.OnExitAnimationListener() {
                public void onSplashScreenExit(final SplashScreenViewProvider splashScreenViewProvider) {
                    splashScreenViewProvider.getView().animate().alpha(0.0f).setDuration((long) SplashScreenPlugin.this.fadeDuration).setStartDelay(0).setInterpolator(new AccelerateInterpolator()).setListener(new AnimatorListenerAdapter() {
                        public void onAnimationEnd(Animator animation) {
                            super.onAnimationEnd(animation);
                            splashScreenViewProvider.remove();
                        }
                    }).start();
                }
            });
        }
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$setupSplashScreen$0$org-apache-cordova-SplashScreenPlugin  reason: not valid java name */
    public /* synthetic */ boolean m1710lambda$setupSplashScreen$0$orgapachecordovaSplashScreenPlugin() {
        return this.keepOnScreen;
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$setupSplashScreen$1$org-apache-cordova-SplashScreenPlugin  reason: not valid java name */
    public /* synthetic */ void m1711lambda$setupSplashScreen$1$orgapachecordovaSplashScreenPlugin() {
        this.keepOnScreen = false;
    }

    private void attemptCloseOnPageFinished() {
        if (this.autoHide && this.delayTime == -1) {
            this.keepOnScreen = false;
        }
    }
}
