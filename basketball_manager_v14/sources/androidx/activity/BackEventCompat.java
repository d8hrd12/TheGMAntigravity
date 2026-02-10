package androidx.activity;

import android.os.Build;
import android.window.BackEvent;
import java.lang.annotation.ElementType;
import java.lang.annotation.RetentionPolicy;
import kotlin.Metadata;
import kotlin.annotation.AnnotationRetention;
import kotlin.annotation.AnnotationTarget;
import kotlin.annotation.Retention;
import kotlin.annotation.Target;
import kotlin.jvm.internal.DefaultConstructorMarker;

@Metadata(d1 = {"\u00000\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u0007\n\u0002\b\u0003\n\u0002\u0010\b\n\u0000\n\u0002\u0010\t\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u000b\n\u0002\u0010\u000e\n\u0002\b\u0003\u0018\u0000 \u001b2\u00020\u0001:\u0002\u001a\u001bB5\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0003\u0012\b\b\u0001\u0010\u0005\u001a\u00020\u0003\u0012\u0006\u0010\u0006\u001a\u00020\u0007\u0012\b\b\u0002\u0010\b\u001a\u00020\t¢\u0006\u0004\b\n\u0010\u000bB\u0011\b\u0017\u0012\u0006\u0010\f\u001a\u00020\r¢\u0006\u0004\b\n\u0010\u000eJ\b\u0010\u0017\u001a\u00020\rH\u0007J\b\u0010\u0018\u001a\u00020\u0019H\u0016R\u0011\u0010\u0002\u001a\u00020\u0003¢\u0006\b\n\u0000\u001a\u0004\b\u000f\u0010\u0010R\u0011\u0010\u0004\u001a\u00020\u0003¢\u0006\b\n\u0000\u001a\u0004\b\u0011\u0010\u0010R\u0011\u0010\u0005\u001a\u00020\u0003¢\u0006\b\n\u0000\u001a\u0004\b\u0012\u0010\u0010R\u0011\u0010\u0006\u001a\u00020\u0007¢\u0006\b\n\u0000\u001a\u0004\b\u0013\u0010\u0014R\u0011\u0010\b\u001a\u00020\t¢\u0006\b\n\u0000\u001a\u0004\b\u0015\u0010\u0016¨\u0006\u001c"}, d2 = {"Landroidx/activity/BackEventCompat;", "", "touchX", "", "touchY", "progress", "swipeEdge", "", "frameTimeMillis", "", "<init>", "(FFFIJ)V", "backEvent", "Landroid/window/BackEvent;", "(Landroid/window/BackEvent;)V", "getTouchX", "()F", "getTouchY", "getProgress", "getSwipeEdge", "()I", "getFrameTimeMillis", "()J", "toBackEvent", "toString", "", "SwipeEdge", "Companion", "activity_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
/* compiled from: BackEventCompat.kt */
public final class BackEventCompat {
    public static final Companion Companion = new Companion((DefaultConstructorMarker) null);
    public static final int EDGE_LEFT = 0;
    public static final int EDGE_NONE = 2;
    public static final int EDGE_RIGHT = 1;
    private final long frameTimeMillis;
    private final float progress;
    private final int swipeEdge;
    private final float touchX;
    private final float touchY;

    @Target(allowedTargets = {AnnotationTarget.TYPE})
    @Retention(AnnotationRetention.SOURCE)
    @java.lang.annotation.Target({ElementType.TYPE_USE})
    @Metadata(d1 = {"\u0000\n\n\u0002\u0018\u0002\n\u0002\u0010\u001b\n\u0000\b\u0002\u0018\u00002\u00020\u0001B\u0000¨\u0006\u0002"}, d2 = {"Landroidx/activity/BackEventCompat$SwipeEdge;", "", "activity_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
    @java.lang.annotation.Retention(RetentionPolicy.SOURCE)
    /* compiled from: BackEventCompat.kt */
    public @interface SwipeEdge {
    }

    public BackEventCompat(float touchX2, float touchY2, float progress2, int swipeEdge2, long frameTimeMillis2) {
        this.touchX = touchX2;
        this.touchY = touchY2;
        this.progress = progress2;
        this.swipeEdge = swipeEdge2;
        this.frameTimeMillis = frameTimeMillis2;
    }

    /* JADX INFO: this call moved to the top of the method (can break code semantics) */
    public /* synthetic */ BackEventCompat(float f, float f2, float f3, int i, long j, int i2, DefaultConstructorMarker defaultConstructorMarker) {
        this(f, f2, f3, i, (i2 & 16) != 0 ? 0 : j);
    }

    public final float getTouchX() {
        return this.touchX;
    }

    public final float getTouchY() {
        return this.touchY;
    }

    public final float getProgress() {
        return this.progress;
    }

    public final int getSwipeEdge() {
        return this.swipeEdge;
    }

    public final long getFrameTimeMillis() {
        return this.frameTimeMillis;
    }

    public BackEventCompat(float touchX2, float touchY2, float progress2, int swipeEdge2) {
        this(touchX2, touchY2, progress2, swipeEdge2, 0, 16, (DefaultConstructorMarker) null);
    }

    /* JADX WARNING: Illegal instructions before constructor call */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public BackEventCompat(android.window.BackEvent r9) {
        /*
            r8 = this;
            java.lang.String r0 = "backEvent"
            kotlin.jvm.internal.Intrinsics.checkNotNullParameter(r9, r0)
            androidx.activity.Api34Impl r0 = androidx.activity.Api34Impl.INSTANCE
            float r2 = r0.touchX(r9)
            androidx.activity.Api34Impl r0 = androidx.activity.Api34Impl.INSTANCE
            float r3 = r0.touchY(r9)
            androidx.activity.Api34Impl r0 = androidx.activity.Api34Impl.INSTANCE
            float r4 = r0.progress(r9)
            androidx.activity.Api34Impl r0 = androidx.activity.Api34Impl.INSTANCE
            int r5 = r0.swipeEdge(r9)
            int r0 = android.os.Build.VERSION.SDK_INT
            r1 = 36
            if (r0 < r1) goto L_0x002c
            androidx.activity.Api36Impl r0 = androidx.activity.Api36Impl.INSTANCE
            long r0 = r0.frameTimeMillis(r9)
            r6 = r0
            goto L_0x002f
        L_0x002c:
            r0 = 0
            r6 = r0
        L_0x002f:
            r1 = r8
            r1.<init>(r2, r3, r4, r5, r6)
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.activity.BackEventCompat.<init>(android.window.BackEvent):void");
    }

    public final BackEvent toBackEvent() {
        if (Build.VERSION.SDK_INT >= 36) {
            return Api36Impl.INSTANCE.createOnBackEvent(this.touchX, this.touchY, this.progress, this.swipeEdge, this.frameTimeMillis);
        }
        return Api34Impl.INSTANCE.createOnBackEvent(this.touchX, this.touchY, this.progress, this.swipeEdge);
    }

    public String toString() {
        return "BackEventCompat{touchX=" + this.touchX + ", touchY=" + this.touchY + ", progress=" + this.progress + ", swipeEdge=" + this.swipeEdge + ", frameTimeMillis=" + this.frameTimeMillis + '}';
    }

    @Metadata(d1 = {"\u0000\u0014\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0010\b\n\u0002\b\u0003\b\u0003\u0018\u00002\u00020\u0001B\t\b\u0002¢\u0006\u0004\b\u0002\u0010\u0003R\u000e\u0010\u0004\u001a\u00020\u0005XT¢\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0005XT¢\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\u0005XT¢\u0006\u0002\n\u0000¨\u0006\b"}, d2 = {"Landroidx/activity/BackEventCompat$Companion;", "", "<init>", "()V", "EDGE_LEFT", "", "EDGE_RIGHT", "EDGE_NONE", "activity_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
    /* compiled from: BackEventCompat.kt */
    public static final class Companion {
        public /* synthetic */ Companion(DefaultConstructorMarker defaultConstructorMarker) {
            this();
        }

        private Companion() {
        }
    }
}
