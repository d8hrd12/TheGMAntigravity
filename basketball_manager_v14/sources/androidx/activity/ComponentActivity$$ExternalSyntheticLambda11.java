package androidx.activity;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class ComponentActivity$$ExternalSyntheticLambda11 implements Runnable {
    public final /* synthetic */ ComponentActivity f$0;
    public final /* synthetic */ OnBackPressedDispatcher f$1;

    public /* synthetic */ ComponentActivity$$ExternalSyntheticLambda11(ComponentActivity componentActivity, OnBackPressedDispatcher onBackPressedDispatcher) {
        this.f$0 = componentActivity;
        this.f$1 = onBackPressedDispatcher;
    }

    public final void run() {
        ComponentActivity.onBackPressedDispatcher_delegate$lambda$13$lambda$12$lambda$11(this.f$0, this.f$1);
    }
}
