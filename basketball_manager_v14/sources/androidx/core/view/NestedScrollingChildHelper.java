package androidx.core.view;

import android.view.View;
import android.view.ViewParent;

public class NestedScrollingChildHelper {
    private boolean mIsNestedScrollingEnabled;
    private ViewParent mNestedScrollingParentNonTouch;
    private ViewParent mNestedScrollingParentTouch;
    private int[] mTempNestedScrollConsumed;
    private final View mView;

    public NestedScrollingChildHelper(View view) {
        this.mView = view;
    }

    public void setNestedScrollingEnabled(boolean enabled) {
        if (this.mIsNestedScrollingEnabled) {
            ViewCompat.stopNestedScroll(this.mView);
        }
        this.mIsNestedScrollingEnabled = enabled;
    }

    public boolean isNestedScrollingEnabled() {
        return this.mIsNestedScrollingEnabled;
    }

    public boolean hasNestedScrollingParent() {
        return hasNestedScrollingParent(0);
    }

    public boolean hasNestedScrollingParent(int type) {
        return getNestedScrollingParentForType(type) != null;
    }

    public boolean startNestedScroll(int axes) {
        return startNestedScroll(axes, 0);
    }

    public boolean startNestedScroll(int axes, int type) {
        if (hasNestedScrollingParent(type)) {
            return true;
        }
        if (!isNestedScrollingEnabled()) {
            return false;
        }
        View child = this.mView;
        for (ViewParent p = this.mView.getParent(); p != null; p = p.getParent()) {
            if (ViewParentCompat.onStartNestedScroll(p, child, this.mView, axes, type)) {
                setNestedScrollingParentForType(type, p);
                ViewParentCompat.onNestedScrollAccepted(p, child, this.mView, axes, type);
                return true;
            }
            if (p instanceof View) {
                child = (View) p;
            }
        }
        return false;
    }

    public void stopNestedScroll() {
        stopNestedScroll(0);
    }

    public void stopNestedScroll(int type) {
        ViewParent parent = getNestedScrollingParentForType(type);
        if (parent != null) {
            ViewParentCompat.onStopNestedScroll(parent, this.mView, type);
            setNestedScrollingParentForType(type, (ViewParent) null);
        }
    }

    public boolean dispatchNestedScroll(int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed, int[] offsetInWindow) {
        return dispatchNestedScrollInternal(dxConsumed, dyConsumed, dxUnconsumed, dyUnconsumed, offsetInWindow, 0, (int[]) null);
    }

    public boolean dispatchNestedScroll(int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed, int[] offsetInWindow, int type) {
        return dispatchNestedScrollInternal(dxConsumed, dyConsumed, dxUnconsumed, dyUnconsumed, offsetInWindow, type, (int[]) null);
    }

    public void dispatchNestedScroll(int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed, int[] offsetInWindow, int type, int[] consumed) {
        dispatchNestedScrollInternal(dxConsumed, dyConsumed, dxUnconsumed, dyUnconsumed, offsetInWindow, type, consumed);
    }

    /*  JADX ERROR: JadxRuntimeException in pass: SimplifyVisitor
        jadx.core.utils.exceptions.JadxRuntimeException: Don't wrap MOVE or CONST insns: 0x0009: MOVE  (r9v0 int) = (r19v0 'type' int)
        	at jadx.core.dex.instructions.args.InsnArg.wrapArg(InsnArg.java:164)
        	at jadx.core.dex.visitors.shrink.CodeShrinkVisitor.assignInline(CodeShrinkVisitor.java:133)
        	at jadx.core.dex.visitors.shrink.CodeShrinkVisitor.checkInline(CodeShrinkVisitor.java:118)
        	at jadx.core.dex.visitors.shrink.CodeShrinkVisitor.shrinkBlock(CodeShrinkVisitor.java:65)
        	at jadx.core.dex.visitors.shrink.CodeShrinkVisitor.shrinkMethod(CodeShrinkVisitor.java:43)
        	at jadx.core.dex.visitors.SimplifyVisitor.visit(SimplifyVisitor.java:71)
        */
    private boolean dispatchNestedScrollInternal(int r14, int r15, int r16, int r17, int[] r18, int r19, int[] r20) {
        /*
            r13 = this;
            r0 = r18
            boolean r1 = r13.isNestedScrollingEnabled()
            r2 = 0
            if (r1 == 0) goto L_0x0060
            r9 = r19
            android.view.ViewParent r3 = r13.getNestedScrollingParentForType(r9)
            if (r3 != 0) goto L_0x0012
            return r2
        L_0x0012:
            r1 = 1
            if (r14 != 0) goto L_0x0023
            if (r15 != 0) goto L_0x0023
            if (r16 != 0) goto L_0x0023
            if (r17 == 0) goto L_0x001c
            goto L_0x0023
        L_0x001c:
            if (r0 == 0) goto L_0x0060
            r0[r2] = r2
            r0[r1] = r2
            goto L_0x0060
        L_0x0023:
            r4 = 0
            r5 = 0
            if (r0 == 0) goto L_0x0033
            android.view.View r6 = r13.mView
            r6.getLocationInWindow(r0)
            r4 = r0[r2]
            r5 = r0[r1]
            r11 = r4
            r12 = r5
            goto L_0x0035
        L_0x0033:
            r11 = r4
            r12 = r5
        L_0x0035:
            if (r20 != 0) goto L_0x0041
            int[] r4 = r13.getTempNestedScrollConsumed()
            r4[r2] = r2
            r4[r1] = r2
            r10 = r4
            goto L_0x0043
        L_0x0041:
            r10 = r20
        L_0x0043:
            android.view.View r4 = r13.mView
            r5 = r14
            r6 = r15
            r7 = r16
            r8 = r17
            androidx.core.view.ViewParentCompat.onNestedScroll(r3, r4, r5, r6, r7, r8, r9, r10)
            if (r0 == 0) goto L_0x005f
            android.view.View r4 = r13.mView
            r4.getLocationInWindow(r0)
            r4 = r0[r2]
            int r4 = r4 - r11
            r0[r2] = r4
            r2 = r0[r1]
            int r2 = r2 - r12
            r0[r1] = r2
        L_0x005f:
            return r1
        L_0x0060:
            return r2
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.core.view.NestedScrollingChildHelper.dispatchNestedScrollInternal(int, int, int, int, int[], int, int[]):boolean");
    }

    public boolean dispatchNestedPreScroll(int dx, int dy, int[] consumed, int[] offsetInWindow) {
        return dispatchNestedPreScroll(dx, dy, consumed, offsetInWindow, 0);
    }

    public boolean dispatchNestedPreScroll(int dx, int dy, int[] consumed, int[] offsetInWindow, int type) {
        int startY;
        int startX;
        int[] consumed2;
        if (isNestedScrollingEnabled()) {
            ViewParent parent = getNestedScrollingParentForType(type);
            if (parent == null) {
                return false;
            }
            if (dx != 0 || dy != 0) {
                if (offsetInWindow != null) {
                    this.mView.getLocationInWindow(offsetInWindow);
                    startX = offsetInWindow[0];
                    startY = offsetInWindow[1];
                } else {
                    startX = 0;
                    startY = 0;
                }
                if (consumed == null) {
                    consumed2 = getTempNestedScrollConsumed();
                } else {
                    consumed2 = consumed;
                }
                consumed2[0] = 0;
                consumed2[1] = 0;
                ViewParentCompat.onNestedPreScroll(parent, this.mView, dx, dy, consumed2, type);
                if (offsetInWindow != null) {
                    this.mView.getLocationInWindow(offsetInWindow);
                    offsetInWindow[0] = offsetInWindow[0] - startX;
                    offsetInWindow[1] = offsetInWindow[1] - startY;
                }
                return (consumed2[0] == 0 && consumed2[1] == 0) ? false : true;
            } else if (offsetInWindow != null) {
                offsetInWindow[0] = 0;
                offsetInWindow[1] = 0;
                int i = dx;
                int i2 = dy;
                int i3 = type;
            } else {
                int i4 = dx;
                int i5 = dy;
                int i6 = type;
            }
        } else {
            int i7 = dy;
            int i8 = type;
        }
        return false;
    }

    public boolean dispatchNestedFling(float velocityX, float velocityY, boolean consumed) {
        ViewParent parent;
        if (!isNestedScrollingEnabled() || (parent = getNestedScrollingParentForType(0)) == null) {
            return false;
        }
        return ViewParentCompat.onNestedFling(parent, this.mView, velocityX, velocityY, consumed);
    }

    public boolean dispatchNestedPreFling(float velocityX, float velocityY) {
        ViewParent parent;
        if (!isNestedScrollingEnabled() || (parent = getNestedScrollingParentForType(0)) == null) {
            return false;
        }
        return ViewParentCompat.onNestedPreFling(parent, this.mView, velocityX, velocityY);
    }

    public void onDetachedFromWindow() {
        ViewCompat.stopNestedScroll(this.mView);
    }

    public void onStopNestedScroll(View child) {
        ViewCompat.stopNestedScroll(this.mView);
    }

    private ViewParent getNestedScrollingParentForType(int type) {
        switch (type) {
            case 0:
                return this.mNestedScrollingParentTouch;
            case 1:
                return this.mNestedScrollingParentNonTouch;
            default:
                return null;
        }
    }

    private void setNestedScrollingParentForType(int type, ViewParent p) {
        switch (type) {
            case 0:
                this.mNestedScrollingParentTouch = p;
                return;
            case 1:
                this.mNestedScrollingParentNonTouch = p;
                return;
            default:
                return;
        }
    }

    private int[] getTempNestedScrollConsumed() {
        if (this.mTempNestedScrollConsumed == null) {
            this.mTempNestedScrollConsumed = new int[2];
        }
        return this.mTempNestedScrollConsumed;
    }
}
