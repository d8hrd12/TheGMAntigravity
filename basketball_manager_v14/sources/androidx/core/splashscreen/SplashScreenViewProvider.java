package androidx.core.splashscreen;

import android.app.Activity;
import android.content.res.Resources;
import android.os.Build;
import android.util.TypedValue;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.FrameLayout;
import android.window.SplashScreenView;
import androidx.core.splashscreen.ThemeUtils;
import java.time.Duration;
import java.time.Instant;
import kotlin.Lazy;
import kotlin.LazyKt;
import kotlin.Metadata;
import kotlin.jvm.internal.Intrinsics;

@Metadata(d1 = {"\u00008\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010\t\n\u0002\b\u0005\n\u0002\u0010\u0002\n\u0002\b\u0003\b\u0007\u0018\u00002\u00020\u0001:\u0002\u0019\u001aB\u0011\b\u0000\u0012\u0006\u0010\u0002\u001a\u00020\u0003¢\u0006\u0004\b\u0004\u0010\u0005B\u0019\b\u0011\u0012\u0006\u0010\u0006\u001a\u00020\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003¢\u0006\u0004\b\u0004\u0010\bJ\u0006\u0010\u0017\u001a\u00020\u0018R\u000e\u0010\t\u001a\u00020\nX\u0004¢\u0006\u0002\n\u0000R\u0011\u0010\u000b\u001a\u00020\f8F¢\u0006\u0006\u001a\u0004\b\r\u0010\u000eR\u0011\u0010\u000f\u001a\u00020\f8F¢\u0006\u0006\u001a\u0004\b\u0010\u0010\u000eR\u0011\u0010\u0011\u001a\u00020\u00128F¢\u0006\u0006\u001a\u0004\b\u0013\u0010\u0014R\u0011\u0010\u0015\u001a\u00020\u00128F¢\u0006\u0006\u001a\u0004\b\u0016\u0010\u0014¨\u0006\u001b"}, d2 = {"Landroidx/core/splashscreen/SplashScreenViewProvider;", "", "ctx", "Landroid/app/Activity;", "<init>", "(Landroid/app/Activity;)V", "platformView", "Landroid/window/SplashScreenView;", "(Landroid/window/SplashScreenView;Landroid/app/Activity;)V", "impl", "Landroidx/core/splashscreen/SplashScreenViewProvider$ViewImpl;", "view", "Landroid/view/View;", "getView", "()Landroid/view/View;", "iconView", "getIconView", "iconAnimationStartMillis", "", "getIconAnimationStartMillis", "()J", "iconAnimationDurationMillis", "getIconAnimationDurationMillis", "remove", "", "ViewImpl", "ViewImpl31", "core-splashscreen_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
/* compiled from: SplashScreenViewProvider.kt */
public final class SplashScreenViewProvider {
    private final ViewImpl impl;

    public SplashScreenViewProvider(Activity ctx) {
        ViewImpl $this$impl_u24lambda_u240;
        Intrinsics.checkNotNullParameter(ctx, "ctx");
        if (Build.VERSION.SDK_INT >= 31) {
            $this$impl_u24lambda_u240 = new ViewImpl31(ctx);
        } else {
            $this$impl_u24lambda_u240 = new ViewImpl(ctx);
        }
        $this$impl_u24lambda_u240.createSplashScreenView();
        this.impl = $this$impl_u24lambda_u240;
    }

    /* JADX INFO: this call moved to the top of the method (can break code semantics) */
    public SplashScreenViewProvider(SplashScreenView platformView, Activity ctx) {
        this(ctx);
        Intrinsics.checkNotNullParameter(platformView, "platformView");
        Intrinsics.checkNotNullParameter(ctx, "ctx");
        ViewImpl viewImpl = this.impl;
        Intrinsics.checkNotNull(viewImpl, "null cannot be cast to non-null type androidx.core.splashscreen.SplashScreenViewProvider.ViewImpl31");
        ((ViewImpl31) viewImpl).setPlatformView(platformView);
    }

    public final View getView() {
        return this.impl.getSplashScreenView();
    }

    public final View getIconView() {
        return this.impl.getIconView();
    }

    public final long getIconAnimationStartMillis() {
        return this.impl.getIconAnimationStartMillis();
    }

    public final long getIconAnimationDurationMillis() {
        return this.impl.getIconAnimationDurationMillis();
    }

    public final void remove() {
        this.impl.remove();
    }

    @Metadata(d1 = {"\u00002\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\t\n\u0002\b\u0006\b\u0012\u0018\u00002\u00020\u0001B\u000f\u0012\u0006\u0010\u0002\u001a\u00020\u0003¢\u0006\u0004\b\u0004\u0010\u0005J\b\u0010\u000e\u001a\u00020\u000fH\u0016J\b\u0010\u001c\u001a\u00020\u000fH\u0016R\u0011\u0010\u0002\u001a\u00020\u0003¢\u0006\b\n\u0000\u001a\u0004\b\u0006\u0010\u0007R\u001b\u0010\b\u001a\u00020\t8BX\u0002¢\u0006\f\n\u0004\b\f\u0010\r\u001a\u0004\b\n\u0010\u000bR\u0014\u0010\u0010\u001a\u00020\t8VX\u0004¢\u0006\u0006\u001a\u0004\b\u0011\u0010\u000bR\u0014\u0010\u0012\u001a\u00020\u00138VX\u0004¢\u0006\u0006\u001a\u0004\b\u0014\u0010\u0015R\u0014\u0010\u0016\u001a\u00020\u00178VX\u0004¢\u0006\u0006\u001a\u0004\b\u0018\u0010\u0019R\u0014\u0010\u001a\u001a\u00020\u00178VX\u0004¢\u0006\u0006\u001a\u0004\b\u001b\u0010\u0019¨\u0006\u001d"}, d2 = {"Landroidx/core/splashscreen/SplashScreenViewProvider$ViewImpl;", "", "activity", "Landroid/app/Activity;", "<init>", "(Landroid/app/Activity;)V", "getActivity", "()Landroid/app/Activity;", "_splashScreenView", "Landroid/view/ViewGroup;", "get_splashScreenView", "()Landroid/view/ViewGroup;", "_splashScreenView$delegate", "Lkotlin/Lazy;", "createSplashScreenView", "", "splashScreenView", "getSplashScreenView", "iconView", "Landroid/view/View;", "getIconView", "()Landroid/view/View;", "iconAnimationStartMillis", "", "getIconAnimationStartMillis", "()J", "iconAnimationDurationMillis", "getIconAnimationDurationMillis", "remove", "core-splashscreen_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
    /* compiled from: SplashScreenViewProvider.kt */
    private static class ViewImpl {
        private final Lazy _splashScreenView$delegate = LazyKt.lazy(new SplashScreenViewProvider$ViewImpl$$ExternalSyntheticLambda0(this));
        private final Activity activity;

        public ViewImpl(Activity activity2) {
            Intrinsics.checkNotNullParameter(activity2, "activity");
            this.activity = activity2;
        }

        public final Activity getActivity() {
            return this.activity;
        }

        private final ViewGroup get_splashScreenView() {
            return (ViewGroup) this._splashScreenView$delegate.getValue();
        }

        /* access modifiers changed from: private */
        public static final ViewGroup _splashScreenView_delegate$lambda$0(ViewImpl this$0) {
            View inflate = FrameLayout.inflate(this$0.activity, R.layout.splash_screen_view, (ViewGroup) null);
            Intrinsics.checkNotNull(inflate, "null cannot be cast to non-null type android.view.ViewGroup");
            return (ViewGroup) inflate;
        }

        public void createSplashScreenView() {
            View rootView = ((ViewGroup) this.activity.findViewById(16908290)).getRootView();
            ViewGroup viewGroup = rootView instanceof ViewGroup ? (ViewGroup) rootView : null;
            if (viewGroup != null) {
                viewGroup.addView(get_splashScreenView());
            }
        }

        public ViewGroup getSplashScreenView() {
            return get_splashScreenView();
        }

        public View getIconView() {
            View findViewById = getSplashScreenView().findViewById(R.id.splashscreen_icon_view);
            Intrinsics.checkNotNullExpressionValue(findViewById, "findViewById(...)");
            return findViewById;
        }

        public long getIconAnimationStartMillis() {
            return 0;
        }

        public long getIconAnimationDurationMillis() {
            return 0;
        }

        public void remove() {
            ViewParent parent = getSplashScreenView().getParent();
            ViewGroup viewGroup = parent instanceof ViewGroup ? (ViewGroup) parent : null;
            if (viewGroup != null) {
                viewGroup.removeView(getSplashScreenView());
            }
        }
    }

    @Metadata(d1 = {"\u00002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\t\n\u0002\b\u0006\b\u0003\u0018\u00002\u00020\u0001B\u000f\u0012\u0006\u0010\u0002\u001a\u00020\u0003¢\u0006\u0004\b\u0004\u0010\u0005J\b\u0010\f\u001a\u00020\rH\u0016J\b\u0010\u001a\u001a\u00020\rH\u0016R\u001a\u0010\u0006\u001a\u00020\u0007X.¢\u0006\u000e\n\u0000\u001a\u0004\b\b\u0010\t\"\u0004\b\n\u0010\u000bR\u0014\u0010\u000e\u001a\u00020\u00078VX\u0004¢\u0006\u0006\u001a\u0004\b\u000f\u0010\tR\u0014\u0010\u0010\u001a\u00020\u00118VX\u0004¢\u0006\u0006\u001a\u0004\b\u0012\u0010\u0013R\u0014\u0010\u0014\u001a\u00020\u00158VX\u0004¢\u0006\u0006\u001a\u0004\b\u0016\u0010\u0017R\u0014\u0010\u0018\u001a\u00020\u00158VX\u0004¢\u0006\u0006\u001a\u0004\b\u0019\u0010\u0017¨\u0006\u001b"}, d2 = {"Landroidx/core/splashscreen/SplashScreenViewProvider$ViewImpl31;", "Landroidx/core/splashscreen/SplashScreenViewProvider$ViewImpl;", "activity", "Landroid/app/Activity;", "<init>", "(Landroid/app/Activity;)V", "platformView", "Landroid/window/SplashScreenView;", "getPlatformView", "()Landroid/window/SplashScreenView;", "setPlatformView", "(Landroid/window/SplashScreenView;)V", "createSplashScreenView", "", "splashScreenView", "getSplashScreenView", "iconView", "Landroid/view/View;", "getIconView", "()Landroid/view/View;", "iconAnimationStartMillis", "", "getIconAnimationStartMillis", "()J", "iconAnimationDurationMillis", "getIconAnimationDurationMillis", "remove", "core-splashscreen_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
    /* compiled from: SplashScreenViewProvider.kt */
    private static final class ViewImpl31 extends ViewImpl {
        public SplashScreenView platformView;

        /* JADX INFO: super call moved to the top of the method (can break code semantics) */
        public ViewImpl31(Activity activity) {
            super(activity);
            Intrinsics.checkNotNullParameter(activity, "activity");
        }

        public final SplashScreenView getPlatformView() {
            SplashScreenView splashScreenView = this.platformView;
            if (splashScreenView != null) {
                return splashScreenView;
            }
            Intrinsics.throwUninitializedPropertyAccessException("platformView");
            return null;
        }

        public final void setPlatformView(SplashScreenView splashScreenView) {
            Intrinsics.checkNotNullParameter(splashScreenView, "<set-?>");
            this.platformView = splashScreenView;
        }

        public void createSplashScreenView() {
        }

        public SplashScreenView getSplashScreenView() {
            return getPlatformView();
        }

        public View getIconView() {
            if (getPlatformView().getIconView() == null) {
                return new View(getActivity());
            }
            View iconView = getPlatformView().getIconView();
            Intrinsics.checkNotNull(iconView);
            return iconView;
        }

        public long getIconAnimationStartMillis() {
            Instant iconAnimationStart = getPlatformView().getIconAnimationStart();
            if (iconAnimationStart != null) {
                return iconAnimationStart.toEpochMilli();
            }
            return 0;
        }

        public long getIconAnimationDurationMillis() {
            Duration iconAnimationDuration = getPlatformView().getIconAnimationDuration();
            if (iconAnimationDuration != null) {
                return iconAnimationDuration.toMillis();
            }
            return 0;
        }

        public void remove() {
            getPlatformView().remove();
            if (Build.VERSION.SDK_INT < 33) {
                Resources.Theme theme = getActivity().getTheme();
                Intrinsics.checkNotNullExpressionValue(theme, "getTheme(...)");
                View decorView = getActivity().getWindow().getDecorView();
                Intrinsics.checkNotNullExpressionValue(decorView, "getDecorView(...)");
                ThemeUtils.Api31.applyThemesSystemBarAppearance$default(theme, decorView, (TypedValue) null, 4, (Object) null);
            }
        }
    }
}
