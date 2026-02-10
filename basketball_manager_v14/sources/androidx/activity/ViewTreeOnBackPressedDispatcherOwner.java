package androidx.activity;

import android.view.View;
import kotlin.Metadata;
import kotlin.jvm.internal.Intrinsics;

@Metadata(d1 = {"\u0000\u0014\n\u0000\n\u0002\u0010\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\u001a\u0019\u0010\u0000\u001a\u00020\u0001*\u00020\u00022\u0006\u0010\u0003\u001a\u00020\u0004H\u0007¢\u0006\u0002\b\u0005\u001a\u0013\u0010\u0006\u001a\u0004\u0018\u00010\u0004*\u00020\u0002H\u0007¢\u0006\u0002\b\u0007¨\u0006\b"}, d2 = {"setViewTreeOnBackPressedDispatcherOwner", "", "Landroid/view/View;", "onBackPressedDispatcherOwner", "Landroidx/activity/OnBackPressedDispatcherOwner;", "set", "findViewTreeOnBackPressedDispatcherOwner", "get", "activity_release"}, k = 2, mv = {2, 0, 0}, xi = 48)
/* compiled from: ViewTreeOnBackPressedDispatcherOwner.kt */
public final class ViewTreeOnBackPressedDispatcherOwner {
    public static final void set(View $this$setViewTreeOnBackPressedDispatcherOwner, OnBackPressedDispatcherOwner onBackPressedDispatcherOwner) {
        Intrinsics.checkNotNullParameter($this$setViewTreeOnBackPressedDispatcherOwner, "<this>");
        Intrinsics.checkNotNullParameter(onBackPressedDispatcherOwner, "onBackPressedDispatcherOwner");
        $this$setViewTreeOnBackPressedDispatcherOwner.setTag(R.id.view_tree_on_back_pressed_dispatcher_owner, onBackPressedDispatcherOwner);
    }

    /* JADX WARNING: type inference failed for: r3v1, types: [android.view.ViewParent] */
    /* JADX WARNING: Multi-variable type inference failed */
    /* JADX WARNING: Unknown variable types count: 1 */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final androidx.activity.OnBackPressedDispatcherOwner get(android.view.View r5) {
        /*
            java.lang.String r0 = "<this>"
            kotlin.jvm.internal.Intrinsics.checkNotNullParameter(r5, r0)
            r0 = r5
        L_0x0006:
            r1 = 0
            if (r0 == 0) goto L_0x0028
            int r2 = androidx.activity.R.id.view_tree_on_back_pressed_dispatcher_owner
            java.lang.Object r2 = r0.getTag(r2)
            boolean r3 = r2 instanceof androidx.activity.OnBackPressedDispatcherOwner
            if (r3 == 0) goto L_0x0016
            androidx.activity.OnBackPressedDispatcherOwner r2 = (androidx.activity.OnBackPressedDispatcherOwner) r2
            goto L_0x0017
        L_0x0016:
            r2 = r1
        L_0x0017:
            if (r2 == 0) goto L_0x001b
            return r2
        L_0x001b:
            android.view.ViewParent r3 = androidx.core.viewtree.ViewTree.getParentOrViewTreeDisjointParent(r0)
            boolean r4 = r3 instanceof android.view.View
            if (r4 == 0) goto L_0x0026
            r1 = r3
            android.view.View r1 = (android.view.View) r1
        L_0x0026:
            r0 = r1
            goto L_0x0006
        L_0x0028:
            return r1
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.activity.ViewTreeOnBackPressedDispatcherOwner.get(android.view.View):androidx.activity.OnBackPressedDispatcherOwner");
    }
}
