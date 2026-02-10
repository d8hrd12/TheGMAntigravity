package androidx.core.view.insets;

import android.graphics.RectF;
import androidx.core.graphics.Insets;
import androidx.core.view.insets.SystemBarStateMonitor;
import java.util.ArrayList;
import java.util.List;

class ProtectionGroup implements SystemBarStateMonitor.Callback {
    private int mAnimationCount;
    private boolean mDisposed;
    private Insets mInsets = Insets.NONE;
    private Insets mInsetsIgnoringVisibility = Insets.NONE;
    private final SystemBarStateMonitor mMonitor;
    private final ArrayList<Protection> mProtections = new ArrayList<>();

    ProtectionGroup(SystemBarStateMonitor monitor, List<Protection> protections) {
        addProtections(protections, false);
        addProtections(protections, true);
        monitor.addCallback(this);
        this.mMonitor = monitor;
    }

    private void addProtections(List<Protection> protections, boolean occupiesCorners) {
        int size = protections.size();
        for (int i = 0; i < size; i++) {
            Protection protection = protections.get(i);
            if (protection.occupiesCorners() == occupiesCorners) {
                Object controller = protection.getController();
                if (controller == null) {
                    protection.setController(this);
                    this.mProtections.add(protection);
                } else {
                    throw new IllegalStateException(protection + " is already controlled by " + controller);
                }
            }
        }
    }

    private void updateInsets() {
        Insets consumed = Insets.NONE;
        for (int i = this.mProtections.size() - 1; i >= 0; i--) {
            consumed = Insets.max(consumed, this.mProtections.get(i).dispatchInsets(this.mInsets, this.mInsetsIgnoringVisibility, consumed));
        }
    }

    public void onInsetsChanged(Insets insets, Insets insetsIgnoringVisibility) {
        this.mInsets = insets;
        this.mInsetsIgnoringVisibility = insetsIgnoringVisibility;
        updateInsets();
    }

    public void onColorHintChanged(int color) {
        for (int i = this.mProtections.size() - 1; i >= 0; i--) {
            this.mProtections.get(i).dispatchColorHint(color);
        }
    }

    public void onAnimationStart() {
        this.mAnimationCount++;
    }

    public void onAnimationProgress(int sides, Insets insets, RectF alpha) {
        Insets insetsStable = this.mInsetsIgnoringVisibility;
        for (int i = this.mProtections.size() - 1; i >= 0; i--) {
            Protection protection = this.mProtections.get(i);
            int side = protection.getSide();
            if ((side & sides) != 0) {
                protection.setSystemVisible(true);
                switch (side) {
                    case 1:
                        if (insetsStable.left > 0) {
                            protection.setSystemInsetAmount(((float) insets.left) / ((float) insetsStable.left));
                        }
                        protection.setSystemAlpha(alpha.left);
                        break;
                    case 2:
                        if (insetsStable.top > 0) {
                            protection.setSystemInsetAmount(((float) insets.top) / ((float) insetsStable.top));
                        }
                        protection.setSystemAlpha(alpha.top);
                        break;
                    case 4:
                        if (insetsStable.right > 0) {
                            protection.setSystemInsetAmount(((float) insets.right) / ((float) insetsStable.right));
                        }
                        protection.setSystemAlpha(alpha.right);
                        break;
                    case 8:
                        if (insetsStable.bottom > 0) {
                            protection.setSystemInsetAmount(((float) insets.bottom) / ((float) insetsStable.bottom));
                        }
                        protection.setSystemAlpha(alpha.bottom);
                        break;
                }
            }
        }
    }

    public void onAnimationEnd() {
        boolean wasAnimating = this.mAnimationCount > 0;
        this.mAnimationCount--;
        if (wasAnimating && this.mAnimationCount == 0) {
            updateInsets();
        }
    }

    /* access modifiers changed from: package-private */
    public int size() {
        return this.mProtections.size();
    }

    /* access modifiers changed from: package-private */
    public Protection getProtection(int index) {
        return this.mProtections.get(index);
    }

    /* access modifiers changed from: package-private */
    public void dispose() {
        if (!this.mDisposed) {
            this.mDisposed = true;
            this.mMonitor.removeCallback(this);
            for (int i = this.mProtections.size() - 1; i >= 0; i--) {
                this.mProtections.get(i).setController((Object) null);
            }
            this.mProtections.clear();
        }
    }
}
