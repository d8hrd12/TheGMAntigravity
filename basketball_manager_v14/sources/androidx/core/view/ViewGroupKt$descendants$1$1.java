package androidx.core.view;

import android.view.View;
import android.view.ViewGroup;
import java.util.Iterator;
import kotlin.Metadata;
import kotlin.jvm.functions.Function1;
import kotlin.sequences.Sequence;

@Metadata(k = 3, mv = {2, 0, 0}, xi = 48)
/* compiled from: ViewGroup.kt */
final class ViewGroupKt$descendants$1$1 implements Function1<View, Iterator<? extends View>> {
    public static final ViewGroupKt$descendants$1$1 INSTANCE = new ViewGroupKt$descendants$1$1();

    ViewGroupKt$descendants$1$1() {
    }

    public final Iterator<View> invoke(View child) {
        Sequence<View> children;
        ViewGroup viewGroup = child instanceof ViewGroup ? (ViewGroup) child : null;
        if (viewGroup == null || (children = ViewGroupKt.getChildren(viewGroup)) == null) {
            return null;
        }
        return children.iterator();
    }
}
