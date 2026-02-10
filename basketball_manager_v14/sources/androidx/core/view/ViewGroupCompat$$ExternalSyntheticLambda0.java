package androidx.core.view;

import android.view.View;
import android.view.WindowInsets;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class ViewGroupCompat$$ExternalSyntheticLambda0 implements View.OnApplyWindowInsetsListener {
    public final /* synthetic */ WindowInsets[] f$0;
    public final /* synthetic */ View.OnApplyWindowInsetsListener f$1;

    public /* synthetic */ ViewGroupCompat$$ExternalSyntheticLambda0(WindowInsets[] windowInsetsArr, View.OnApplyWindowInsetsListener onApplyWindowInsetsListener) {
        this.f$0 = windowInsetsArr;
        this.f$1 = onApplyWindowInsetsListener;
    }

    public final WindowInsets onApplyWindowInsets(View view, WindowInsets windowInsets) {
        return ViewGroupCompat.lambda$dispatchApplyWindowInsets$1(this.f$0, this.f$1, view, windowInsets);
    }
}
