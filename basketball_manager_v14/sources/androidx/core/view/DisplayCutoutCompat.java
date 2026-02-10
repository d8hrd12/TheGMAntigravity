package androidx.core.view;

import android.graphics.Path;
import android.graphics.Rect;
import android.os.Build;
import android.view.DisplayCutout;
import androidx.core.graphics.Insets;
import androidx.core.util.ObjectsCompat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public final class DisplayCutoutCompat {
    private final DisplayCutout mDisplayCutout;

    /* JADX INFO: this call moved to the top of the method (can break code semantics) */
    public DisplayCutoutCompat(Rect safeInsets, List<Rect> boundingRects) {
        this(Build.VERSION.SDK_INT >= 28 ? Api28Impl.createDisplayCutout(safeInsets, boundingRects) : null);
    }

    public DisplayCutoutCompat(Insets safeInsets, Rect boundLeft, Rect boundTop, Rect boundRight, Rect boundBottom, Insets waterfallInsets) {
        this(constructDisplayCutout(safeInsets, boundLeft, boundTop, boundRight, boundBottom, waterfallInsets, (Path) null));
    }

    public DisplayCutoutCompat(Insets safeInsets, Rect boundLeft, Rect boundTop, Rect boundRight, Rect boundBottom, Insets waterfallInsets, Path cutoutPath) {
        this(constructDisplayCutout(safeInsets, boundLeft, boundTop, boundRight, boundBottom, waterfallInsets, cutoutPath));
    }

    private static DisplayCutout constructDisplayCutout(Insets safeInsets, Rect boundLeft, Rect boundTop, Rect boundRight, Rect boundBottom, Insets waterfallInsets, Path cutoutPath) {
        if (Build.VERSION.SDK_INT >= 33) {
            Rect boundLeft2 = boundLeft;
            Rect boundTop2 = boundTop;
            Rect boundRight2 = boundRight;
            Rect boundBottom2 = boundBottom;
            DisplayCutout createDisplayCutout = Api33Impl.createDisplayCutout(safeInsets.toPlatformInsets(), boundLeft2, boundTop2, boundRight2, boundBottom2, waterfallInsets.toPlatformInsets(), cutoutPath);
            Rect rect = boundLeft2;
            Rect rect2 = boundTop2;
            Rect boundLeft3 = boundRight2;
            Rect boundTop3 = boundBottom2;
            return createDisplayCutout;
        }
        Rect boundLeft4 = boundLeft;
        Rect boundTop4 = boundTop;
        Rect boundRight3 = boundRight;
        Rect boundBottom3 = boundBottom;
        Path path = cutoutPath;
        if (Build.VERSION.SDK_INT >= 30) {
            return Api30Impl.createDisplayCutout(safeInsets.toPlatformInsets(), boundLeft4, boundTop4, boundRight3, boundBottom3, waterfallInsets.toPlatformInsets());
        }
        if (Build.VERSION.SDK_INT >= 29) {
            return Api29Impl.createDisplayCutout(safeInsets.toPlatformInsets(), boundLeft4, boundTop4, boundRight3, boundBottom3);
        }
        if (Build.VERSION.SDK_INT < 28) {
            return null;
        }
        Rect safeInsetRect = new Rect(safeInsets.left, safeInsets.top, safeInsets.right, safeInsets.bottom);
        ArrayList<Rect> boundingRects = new ArrayList<>();
        if (boundLeft4 != null) {
            boundingRects.add(boundLeft4);
        }
        if (boundTop4 != null) {
            boundingRects.add(boundTop4);
        }
        if (boundRight3 != null) {
            boundingRects.add(boundRight3);
        }
        if (boundBottom3 != null) {
            boundingRects.add(boundBottom3);
        }
        return Api28Impl.createDisplayCutout(safeInsetRect, boundingRects);
    }

    private DisplayCutoutCompat(DisplayCutout displayCutout) {
        this.mDisplayCutout = displayCutout;
    }

    public int getSafeInsetTop() {
        if (Build.VERSION.SDK_INT >= 28) {
            return Api28Impl.getSafeInsetTop(this.mDisplayCutout);
        }
        return 0;
    }

    public int getSafeInsetBottom() {
        if (Build.VERSION.SDK_INT >= 28) {
            return Api28Impl.getSafeInsetBottom(this.mDisplayCutout);
        }
        return 0;
    }

    public int getSafeInsetLeft() {
        if (Build.VERSION.SDK_INT >= 28) {
            return Api28Impl.getSafeInsetLeft(this.mDisplayCutout);
        }
        return 0;
    }

    public int getSafeInsetRight() {
        if (Build.VERSION.SDK_INT >= 28) {
            return Api28Impl.getSafeInsetRight(this.mDisplayCutout);
        }
        return 0;
    }

    public List<Rect> getBoundingRects() {
        if (Build.VERSION.SDK_INT >= 28) {
            return Api28Impl.getBoundingRects(this.mDisplayCutout);
        }
        return Collections.emptyList();
    }

    public Insets getWaterfallInsets() {
        if (Build.VERSION.SDK_INT >= 30) {
            return Insets.toCompatInsets(Api30Impl.getWaterfallInsets(this.mDisplayCutout));
        }
        return Insets.NONE;
    }

    public Path getCutoutPath() {
        if (Build.VERSION.SDK_INT >= 31) {
            return Api31Impl.getCutoutPath(this.mDisplayCutout);
        }
        return null;
    }

    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        return ObjectsCompat.equals(this.mDisplayCutout, ((DisplayCutoutCompat) o).mDisplayCutout);
    }

    public int hashCode() {
        if (this.mDisplayCutout == null) {
            return 0;
        }
        return this.mDisplayCutout.hashCode();
    }

    public String toString() {
        return "DisplayCutoutCompat{" + this.mDisplayCutout + "}";
    }

    static DisplayCutoutCompat wrap(DisplayCutout displayCutout) {
        if (displayCutout == null) {
            return null;
        }
        return new DisplayCutoutCompat(displayCutout);
    }

    /* access modifiers changed from: package-private */
    public DisplayCutout unwrap() {
        return this.mDisplayCutout;
    }

    static class Api28Impl {
        private Api28Impl() {
        }

        static DisplayCutout createDisplayCutout(Rect safeInsets, List<Rect> boundingRects) {
            return new DisplayCutout(safeInsets, boundingRects);
        }

        static int getSafeInsetTop(DisplayCutout displayCutout) {
            return displayCutout.getSafeInsetTop();
        }

        static int getSafeInsetBottom(DisplayCutout displayCutout) {
            return displayCutout.getSafeInsetBottom();
        }

        static int getSafeInsetLeft(DisplayCutout displayCutout) {
            return displayCutout.getSafeInsetLeft();
        }

        static int getSafeInsetRight(DisplayCutout displayCutout) {
            return displayCutout.getSafeInsetRight();
        }

        static List<Rect> getBoundingRects(DisplayCutout displayCutout) {
            return displayCutout.getBoundingRects();
        }
    }

    static class Api29Impl {
        private Api29Impl() {
        }

        static DisplayCutout createDisplayCutout(android.graphics.Insets safeInsets, Rect boundLeft, Rect boundTop, Rect boundRight, Rect boundBottom) {
            return new DisplayCutout(safeInsets, boundLeft, boundTop, boundRight, boundBottom);
        }
    }

    static class Api30Impl {
        private Api30Impl() {
        }

        static DisplayCutout createDisplayCutout(android.graphics.Insets safeInsets, Rect boundLeft, Rect boundTop, Rect boundRight, Rect boundBottom, android.graphics.Insets waterfallInsets) {
            return new DisplayCutout(safeInsets, boundLeft, boundTop, boundRight, boundBottom, waterfallInsets);
        }

        static android.graphics.Insets getWaterfallInsets(DisplayCutout displayCutout) {
            return displayCutout.getWaterfallInsets();
        }
    }

    static class Api31Impl {
        private Api31Impl() {
        }

        static Path getCutoutPath(DisplayCutout displayCutout) {
            return displayCutout.getCutoutPath();
        }
    }

    static class Api33Impl {
        private Api33Impl() {
        }

        static DisplayCutout createDisplayCutout(android.graphics.Insets safeInsets, Rect boundLeft, Rect boundTop, Rect boundRight, Rect boundBottom, android.graphics.Insets waterfallInsets, Path cutoutPath) {
            DisplayCutout.Builder builder = new DisplayCutout.Builder().setSafeInsets(safeInsets).setWaterfallInsets(waterfallInsets);
            if (boundLeft != null) {
                builder.setBoundingRectLeft(boundLeft);
            }
            if (boundTop != null) {
                builder.setBoundingRectTop(boundTop);
            }
            if (boundRight != null) {
                builder.setBoundingRectRight(boundRight);
            }
            if (boundBottom != null) {
                builder.setBoundingRectBottom(boundBottom);
            }
            if (cutoutPath != null) {
                builder.setCutoutPath(cutoutPath);
            }
            return builder.build();
        }
    }
}
