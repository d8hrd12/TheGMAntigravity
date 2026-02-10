package androidx.core.view;

import android.os.Build;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.view.accessibility.AccessibilityEvent;
import androidx.annotation.ReplaceWith;
import androidx.core.R;

public final class ViewGroupCompat {
    private static final WindowInsets CONSUMED = WindowInsetsCompat.CONSUMED.toWindowInsets();
    public static final int LAYOUT_MODE_CLIP_BOUNDS = 0;
    public static final int LAYOUT_MODE_OPTICAL_BOUNDS = 1;
    static boolean sCompatInsetsDispatchInstalled = false;

    private ViewGroupCompat() {
    }

    @ReplaceWith(expression = "group.onRequestSendAccessibilityEvent(child, event)")
    @Deprecated
    public static boolean onRequestSendAccessibilityEvent(ViewGroup group, View child, AccessibilityEvent event) {
        return group.onRequestSendAccessibilityEvent(child, event);
    }

    @ReplaceWith(expression = "group.setMotionEventSplittingEnabled(split)")
    @Deprecated
    public static void setMotionEventSplittingEnabled(ViewGroup group, boolean split) {
        group.setMotionEventSplittingEnabled(split);
    }

    @ReplaceWith(expression = "group.getLayoutMode()")
    @Deprecated
    public static int getLayoutMode(ViewGroup group) {
        return group.getLayoutMode();
    }

    @ReplaceWith(expression = "group.setLayoutMode(mode)")
    @Deprecated
    public static void setLayoutMode(ViewGroup group, int mode) {
        group.setLayoutMode(mode);
    }

    public static void setTransitionGroup(ViewGroup group, boolean isTransitionGroup) {
        Api21Impl.setTransitionGroup(group, isTransitionGroup);
    }

    public static boolean isTransitionGroup(ViewGroup group) {
        return Api21Impl.isTransitionGroup(group);
    }

    public static int getNestedScrollAxes(ViewGroup group) {
        return Api21Impl.getNestedScrollAxes(group);
    }

    public static void installCompatInsetsDispatch(View root) {
        if (Build.VERSION.SDK_INT < 30) {
            View.OnApplyWindowInsetsListener listener = new ViewGroupCompat$$ExternalSyntheticLambda1();
            root.setTag(R.id.tag_compat_insets_dispatch, listener);
            root.setOnApplyWindowInsetsListener(listener);
            sCompatInsetsDispatchInstalled = true;
        }
    }

    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r4v3, resolved type: java.lang.Object} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r6v10, resolved type: android.view.View$OnApplyWindowInsetsListener} */
    /* access modifiers changed from: package-private */
    /* JADX WARNING: Multi-variable type inference failed */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static android.view.WindowInsets dispatchApplyWindowInsets(android.view.View r11, android.view.WindowInsets r12) {
        /*
            int r0 = androidx.core.R.id.tag_on_apply_window_listener
            java.lang.Object r0 = r11.getTag(r0)
            int r1 = androidx.core.R.id.tag_window_insets_animation_callback
            java.lang.Object r1 = r11.getTag(r1)
            boolean r2 = r0 instanceof android.view.View.OnApplyWindowInsetsListener
            if (r2 == 0) goto L_0x0014
            r2 = r0
            android.view.View$OnApplyWindowInsetsListener r2 = (android.view.View.OnApplyWindowInsetsListener) r2
            goto L_0x001d
        L_0x0014:
            boolean r2 = r1 instanceof android.view.View.OnApplyWindowInsetsListener
            if (r2 == 0) goto L_0x001c
            r2 = r1
            android.view.View$OnApplyWindowInsetsListener r2 = (android.view.View.OnApplyWindowInsetsListener) r2
            goto L_0x001d
        L_0x001c:
            r2 = 0
        L_0x001d:
            r3 = 1
            android.view.WindowInsets[] r3 = new android.view.WindowInsets[r3]
            android.view.WindowInsets r4 = CONSUMED
            r5 = 0
            r3[r5] = r4
            androidx.core.view.ViewGroupCompat$$ExternalSyntheticLambda0 r4 = new androidx.core.view.ViewGroupCompat$$ExternalSyntheticLambda0
            r4.<init>(r3, r2)
            r11.setOnApplyWindowInsetsListener(r4)
            r11.dispatchApplyWindowInsets(r12)
            int r4 = androidx.core.R.id.tag_compat_insets_dispatch
            java.lang.Object r4 = r11.getTag(r4)
            boolean r6 = r4 instanceof android.view.View.OnApplyWindowInsetsListener
            if (r6 == 0) goto L_0x0040
            r6 = r4
            android.view.View$OnApplyWindowInsetsListener r6 = (android.view.View.OnApplyWindowInsetsListener) r6
            goto L_0x0041
        L_0x0040:
            r6 = r2
        L_0x0041:
            r11.setOnApplyWindowInsetsListener(r6)
            r6 = r3[r5]
            if (r6 == 0) goto L_0x006a
            r6 = r3[r5]
            boolean r6 = r6.isConsumed()
            if (r6 != 0) goto L_0x006a
            boolean r6 = r11 instanceof android.view.ViewGroup
            if (r6 == 0) goto L_0x006a
            r6 = r11
            android.view.ViewGroup r6 = (android.view.ViewGroup) r6
            int r7 = r6.getChildCount()
            r8 = 0
        L_0x005c:
            if (r8 >= r7) goto L_0x006a
            android.view.View r9 = r6.getChildAt(r8)
            r10 = r3[r5]
            dispatchApplyWindowInsets(r9, r10)
            int r8 = r8 + 1
            goto L_0x005c
        L_0x006a:
            r6 = r3[r5]
            if (r6 == 0) goto L_0x0071
            r5 = r3[r5]
            goto L_0x0073
        L_0x0071:
            android.view.WindowInsets r5 = CONSUMED
        L_0x0073:
            return r5
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.core.view.ViewGroupCompat.dispatchApplyWindowInsets(android.view.View, android.view.WindowInsets):android.view.WindowInsets");
    }

    static /* synthetic */ WindowInsets lambda$dispatchApplyWindowInsets$1(WindowInsets[] outInsets, View.OnApplyWindowInsetsListener listener, View v, WindowInsets w) {
        WindowInsets windowInsets;
        if (listener != null) {
            windowInsets = listener.onApplyWindowInsets(v, w);
        } else {
            windowInsets = v.onApplyWindowInsets(w);
        }
        outInsets[0] = windowInsets;
        return CONSUMED;
    }

    static class Api21Impl {
        private Api21Impl() {
        }

        static void setTransitionGroup(ViewGroup viewGroup, boolean isTransitionGroup) {
            viewGroup.setTransitionGroup(isTransitionGroup);
        }

        static boolean isTransitionGroup(ViewGroup viewGroup) {
            return viewGroup.isTransitionGroup();
        }

        static int getNestedScrollAxes(ViewGroup viewGroup) {
            return viewGroup.getNestedScrollAxes();
        }
    }
}
