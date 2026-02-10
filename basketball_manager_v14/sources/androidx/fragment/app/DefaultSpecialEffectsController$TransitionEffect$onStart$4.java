package androidx.fragment.app;

import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import androidx.core.os.CancellationSignal;
import androidx.fragment.app.DefaultSpecialEffectsController;
import androidx.fragment.app.SpecialEffectsController;
import java.util.Collection;
import java.util.Iterator;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.jvm.functions.Function0;
import kotlin.jvm.internal.Intrinsics;
import kotlin.jvm.internal.Lambda;
import kotlin.jvm.internal.Ref;

@Metadata(d1 = {"\u0000\b\n\u0000\n\u0002\u0010\u0002\n\u0000\u0010\u0000\u001a\u00020\u0001H\n¢\u0006\u0002\b\u0002"}, d2 = {"<anonymous>", "", "invoke"}, k = 3, mv = {1, 8, 0}, xi = 48)
/* compiled from: DefaultSpecialEffectsController.kt */
final class DefaultSpecialEffectsController$TransitionEffect$onStart$4 extends Lambda implements Function0<Unit> {
    final /* synthetic */ ViewGroup $container;
    final /* synthetic */ Object $mergedTransition;
    final /* synthetic */ Ref.ObjectRef<Function0<Unit>> $seekCancelLambda;
    final /* synthetic */ DefaultSpecialEffectsController.TransitionEffect this$0;

    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    DefaultSpecialEffectsController$TransitionEffect$onStart$4(DefaultSpecialEffectsController.TransitionEffect transitionEffect, ViewGroup viewGroup, Object obj, Ref.ObjectRef<Function0<Unit>> objectRef) {
        super(0);
        this.this$0 = transitionEffect;
        this.$container = viewGroup;
        this.$mergedTransition = obj;
        this.$seekCancelLambda = objectRef;
    }

    public final void invoke() {
        if (FragmentManager.isLoggingEnabled(2)) {
            Log.v(FragmentManager.TAG, "Attempting to create TransitionSeekController");
        }
        this.this$0.setController(this.this$0.getTransitionImpl().controlDelayedTransition(this.$container, this.$mergedTransition));
        if (this.this$0.getController() == null) {
            if (FragmentManager.isLoggingEnabled(2)) {
                Log.v(FragmentManager.TAG, "TransitionSeekController was not created.");
            }
            this.this$0.setNoControllerReturned(true);
            return;
        }
        Ref.ObjectRef<Function0<Unit>> objectRef = this.$seekCancelLambda;
        final DefaultSpecialEffectsController.TransitionEffect transitionEffect = this.this$0;
        final Object obj = this.$mergedTransition;
        final ViewGroup viewGroup = this.$container;
        objectRef.element = new Function0<Unit>() {
            public final void invoke() {
                Iterable $this$all$iv = transitionEffect.getTransitionInfos();
                boolean z = true;
                if (!($this$all$iv instanceof Collection) || !((Collection) $this$all$iv).isEmpty()) {
                    Iterator it = $this$all$iv.iterator();
                    while (true) {
                        if (it.hasNext()) {
                            if (!((DefaultSpecialEffectsController.TransitionInfo) it.next()).getOperation().isSeeking()) {
                                z = false;
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                }
                if (z) {
                    if (FragmentManager.isLoggingEnabled(2)) {
                        Log.v(FragmentManager.TAG, "Animating to start");
                    }
                    FragmentTransitionImpl transitionImpl = transitionEffect.getTransitionImpl();
                    Object controller = transitionEffect.getController();
                    Intrinsics.checkNotNull(controller);
                    transitionImpl.animateToStart(controller, new DefaultSpecialEffectsController$TransitionEffect$onStart$4$1$$ExternalSyntheticLambda0(transitionEffect, viewGroup));
                    return;
                }
                if (FragmentManager.isLoggingEnabled(2)) {
                    Log.v(FragmentManager.TAG, "Completing animating immediately");
                }
                CancellationSignal cancelSignal = new CancellationSignal();
                transitionEffect.getTransitionImpl().setListenerForTransitionEnd(transitionEffect.getTransitionInfos().get(0).getOperation().getFragment(), obj, cancelSignal, new DefaultSpecialEffectsController$TransitionEffect$onStart$4$1$$ExternalSyntheticLambda1(transitionEffect));
                cancelSignal.cancel();
            }

            /* access modifiers changed from: private */
            public static final void invoke$lambda$2(DefaultSpecialEffectsController.TransitionEffect this$02, ViewGroup $container2) {
                Intrinsics.checkNotNullParameter(this$02, "this$0");
                Intrinsics.checkNotNullParameter($container2, "$container");
                for (DefaultSpecialEffectsController.TransitionInfo transitionInfo : this$02.getTransitionInfos()) {
                    SpecialEffectsController.Operation operation = transitionInfo.getOperation();
                    View view = operation.getFragment().getView();
                    if (view != null) {
                        operation.getFinalState().applyState(view, $container2);
                    }
                }
            }

            /* access modifiers changed from: private */
            public static final void invoke$lambda$4(DefaultSpecialEffectsController.TransitionEffect this$02) {
                Intrinsics.checkNotNullParameter(this$02, "this$0");
                if (FragmentManager.isLoggingEnabled(2)) {
                    Log.v(FragmentManager.TAG, "Transition for all operations has completed");
                }
                for (DefaultSpecialEffectsController.TransitionInfo it : this$02.getTransitionInfos()) {
                    it.getOperation().completeEffect(this$02);
                }
            }
        };
        if (FragmentManager.isLoggingEnabled(2)) {
            Log.v(FragmentManager.TAG, "Started executing operations from " + this.this$0.getFirstOut() + " to " + this.this$0.getLastIn());
        }
    }
}
