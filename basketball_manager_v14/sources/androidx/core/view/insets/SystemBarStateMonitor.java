package androidx.core.view.insets;

import android.content.res.Configuration;
import android.graphics.RectF;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsAnimationCompat;
import androidx.core.view.WindowInsetsCompat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

class SystemBarStateMonitor {
    /* access modifiers changed from: private */
    public final ArrayList<Callback> mCallbacks = new ArrayList<>();
    /* access modifiers changed from: private */
    public int mColorHint;
    private final View mDetector;
    private Insets mInsets = Insets.NONE;
    private Insets mInsetsIgnoringVisibility = Insets.NONE;

    interface Callback {
        void onAnimationEnd();

        void onAnimationProgress(int i, Insets insets, RectF rectF);

        void onAnimationStart();

        void onColorHintChanged(int i);

        void onInsetsChanged(Insets insets, Insets insets2);
    }

    SystemBarStateMonitor(final ViewGroup rootView) {
        int i;
        Drawable drawable = rootView.getBackground();
        if (drawable instanceof ColorDrawable) {
            i = ((ColorDrawable) drawable).getColor();
        } else {
            i = 0;
        }
        this.mColorHint = i;
        this.mDetector = new View(rootView.getContext()) {
            /* access modifiers changed from: protected */
            public void onConfigurationChanged(Configuration newConfig) {
                int color;
                Drawable drawable = rootView.getBackground();
                if (drawable instanceof ColorDrawable) {
                    color = ((ColorDrawable) drawable).getColor();
                } else {
                    color = 0;
                }
                if (SystemBarStateMonitor.this.mColorHint != color) {
                    int unused = SystemBarStateMonitor.this.mColorHint = color;
                    for (int i = SystemBarStateMonitor.this.mCallbacks.size() - 1; i >= 0; i--) {
                        ((Callback) SystemBarStateMonitor.this.mCallbacks.get(i)).onColorHintChanged(color);
                    }
                }
            }
        };
        this.mDetector.setWillNotDraw(true);
        ViewCompat.setOnApplyWindowInsetsListener(this.mDetector, new SystemBarStateMonitor$$ExternalSyntheticLambda0(this));
        ViewCompat.setWindowInsetsAnimationCallback(this.mDetector, new WindowInsetsAnimationCompat.Callback(0) {
            private final HashMap<WindowInsetsAnimationCompat, Integer> mAnimationSidesMap = new HashMap<>();

            public void onPrepare(WindowInsetsAnimationCompat animation) {
                if (animatesSystemBars(animation)) {
                    for (int i = SystemBarStateMonitor.this.mCallbacks.size() - 1; i >= 0; i--) {
                        ((Callback) SystemBarStateMonitor.this.mCallbacks.get(i)).onAnimationStart();
                    }
                }
            }

            public WindowInsetsAnimationCompat.BoundsCompat onStart(WindowInsetsAnimationCompat animation, WindowInsetsAnimationCompat.BoundsCompat bounds) {
                if (!animatesSystemBars(animation)) {
                    return bounds;
                }
                Insets upper = bounds.getUpperBound();
                Insets lower = bounds.getLowerBound();
                int sides = 0;
                if (upper.left != lower.left) {
                    sides = 0 | 1;
                }
                if (upper.top != lower.top) {
                    sides |= 2;
                }
                if (upper.right != lower.right) {
                    sides |= 4;
                }
                if (upper.bottom != lower.bottom) {
                    sides |= 8;
                }
                this.mAnimationSidesMap.put(animation, Integer.valueOf(sides));
                return bounds;
            }

            public WindowInsetsCompat onProgress(WindowInsetsCompat windowInsets, List<WindowInsetsAnimationCompat> runningAnimations) {
                RectF alpha = new RectF(1.0f, 1.0f, 1.0f, 1.0f);
                int animatingSides = 0;
                for (int i = runningAnimations.size() - 1; i >= 0; i--) {
                    WindowInsetsAnimationCompat animation = runningAnimations.get(i);
                    Integer possibleSides = this.mAnimationSidesMap.get(animation);
                    if (possibleSides != null) {
                        int sides = possibleSides.intValue();
                        float animAlpha = animation.getAlpha();
                        if ((sides & 1) != 0) {
                            alpha.left = animAlpha;
                        }
                        if ((sides & 2) != 0) {
                            alpha.top = animAlpha;
                        }
                        if ((sides & 4) != 0) {
                            alpha.right = animAlpha;
                        }
                        if ((sides & 8) != 0) {
                            alpha.bottom = animAlpha;
                        }
                        animatingSides |= sides;
                    }
                }
                Insets insets = SystemBarStateMonitor.this.getInsets(windowInsets);
                for (int i2 = SystemBarStateMonitor.this.mCallbacks.size() - 1; i2 >= 0; i2--) {
                    ((Callback) SystemBarStateMonitor.this.mCallbacks.get(i2)).onAnimationProgress(animatingSides, insets, alpha);
                }
                return windowInsets;
            }

            public void onEnd(WindowInsetsAnimationCompat animation) {
                if (animatesSystemBars(animation)) {
                    this.mAnimationSidesMap.remove(animation);
                    for (int i = SystemBarStateMonitor.this.mCallbacks.size() - 1; i >= 0; i--) {
                        ((Callback) SystemBarStateMonitor.this.mCallbacks.get(i)).onAnimationEnd();
                    }
                }
            }

            private boolean animatesSystemBars(WindowInsetsAnimationCompat anim) {
                return (anim.getTypeMask() & WindowInsetsCompat.Type.systemBars()) != 0;
            }
        });
        rootView.addView(this.mDetector, 0);
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$new$0$androidx-core-view-insets-SystemBarStateMonitor  reason: not valid java name */
    public /* synthetic */ WindowInsetsCompat m70lambda$new$0$androidxcoreviewinsetsSystemBarStateMonitor(View view, WindowInsetsCompat windowInsets) {
        Insets insets = getInsets(windowInsets);
        Insets insetsIgnoringVis = getInsetsIgnoringVisibility(windowInsets);
        if (!insets.equals(this.mInsets) || !insetsIgnoringVis.equals(this.mInsetsIgnoringVisibility)) {
            this.mInsets = insets;
            this.mInsetsIgnoringVisibility = insetsIgnoringVis;
            for (int i = this.mCallbacks.size() - 1; i >= 0; i--) {
                this.mCallbacks.get(i).onInsetsChanged(insets, insetsIgnoringVis);
            }
        }
        return windowInsets;
    }

    /* access modifiers changed from: private */
    public Insets getInsets(WindowInsetsCompat w) {
        return Insets.min(w.getInsets(WindowInsetsCompat.Type.systemBars()), w.getInsets(WindowInsetsCompat.Type.tappableElement()));
    }

    private Insets getInsetsIgnoringVisibility(WindowInsetsCompat w) {
        return Insets.min(w.getInsetsIgnoringVisibility(WindowInsetsCompat.Type.systemBars()), w.getInsetsIgnoringVisibility(WindowInsetsCompat.Type.tappableElement()));
    }

    /* access modifiers changed from: package-private */
    public void addCallback(Callback callback) {
        if (!this.mCallbacks.contains(callback)) {
            this.mCallbacks.add(callback);
            callback.onInsetsChanged(this.mInsets, this.mInsetsIgnoringVisibility);
            callback.onColorHintChanged(this.mColorHint);
        }
    }

    /* access modifiers changed from: package-private */
    public void removeCallback(Callback callback) {
        this.mCallbacks.remove(callback);
    }

    /* access modifiers changed from: package-private */
    public boolean hasCallback() {
        return !this.mCallbacks.isEmpty();
    }

    /* access modifiers changed from: package-private */
    public void detachFromWindow() {
        this.mDetector.post(new SystemBarStateMonitor$$ExternalSyntheticLambda1(this));
    }

    /* access modifiers changed from: package-private */
    /* renamed from: lambda$detachFromWindow$1$androidx-core-view-insets-SystemBarStateMonitor  reason: not valid java name */
    public /* synthetic */ void m69lambda$detachFromWindow$1$androidxcoreviewinsetsSystemBarStateMonitor() {
        ViewParent parent = this.mDetector.getParent();
        if (parent instanceof ViewGroup) {
            ((ViewGroup) parent).removeView(this.mDetector);
        }
    }
}
