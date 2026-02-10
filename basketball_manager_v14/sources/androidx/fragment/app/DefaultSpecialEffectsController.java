package androidx.fragment.app;

import android.animation.AnimatorSet;
import android.content.Context;
import android.graphics.Rect;
import android.os.Build;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import androidx.activity.BackEventCompat;
import androidx.collection.ArrayMap;
import androidx.core.app.SharedElementCallback;
import androidx.core.os.CancellationSignal;
import androidx.core.view.OneShotPreDrawListener;
import androidx.core.view.ViewCompat;
import androidx.core.view.ViewGroupCompat;
import androidx.fragment.app.FragmentAnim;
import androidx.fragment.app.SpecialEffectsController;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.Set;
import kotlin.Metadata;
import kotlin.Pair;
import kotlin.TuplesKt;
import kotlin.Unit;
import kotlin.collections.CollectionsKt;
import kotlin.jvm.functions.Function0;
import kotlin.jvm.internal.Intrinsics;
import kotlin.jvm.internal.Ref;

@Metadata(d1 = {"\u0000X\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010%\n\u0002\u0010\u000e\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u001e\n\u0002\b\t\b\u0000\u0018\u00002\u00020\u0001:\b\u001f !\"#$%&B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003¢\u0006\u0002\u0010\u0004J\u0016\u0010\u0005\u001a\u00020\u00062\f\u0010\u0007\u001a\b\u0012\u0004\u0012\u00020\t0\bH\u0003J\u001e\u0010\n\u001a\u00020\u00062\f\u0010\u000b\u001a\b\u0012\u0004\u0012\u00020\f0\b2\u0006\u0010\r\u001a\u00020\u000eH\u0016J2\u0010\u000f\u001a\u00020\u00062\f\u0010\u0010\u001a\b\u0012\u0004\u0012\u00020\u00110\b2\u0006\u0010\r\u001a\u00020\u000e2\b\u0010\u0012\u001a\u0004\u0018\u00010\f2\b\u0010\u0013\u001a\u0004\u0018\u00010\fH\u0002J$\u0010\u0014\u001a\u00020\u00062\u0012\u0010\u0015\u001a\u000e\u0012\u0004\u0012\u00020\u0017\u0012\u0004\u0012\u00020\u00180\u00162\u0006\u0010\u0019\u001a\u00020\u0018H\u0002J\u0016\u0010\u001a\u001a\u00020\u00062\f\u0010\u000b\u001a\b\u0012\u0004\u0012\u00020\f0\bH\u0002J&\u0010\u001b\u001a\u00020\u0006*\u000e\u0012\u0004\u0012\u00020\u0017\u0012\u0004\u0012\u00020\u00180\u001c2\f\u0010\u001d\u001a\b\u0012\u0004\u0012\u00020\u00170\u001eH\u0002¨\u0006'"}, d2 = {"Landroidx/fragment/app/DefaultSpecialEffectsController;", "Landroidx/fragment/app/SpecialEffectsController;", "container", "Landroid/view/ViewGroup;", "(Landroid/view/ViewGroup;)V", "collectAnimEffects", "", "animationInfos", "", "Landroidx/fragment/app/DefaultSpecialEffectsController$AnimationInfo;", "collectEffects", "operations", "Landroidx/fragment/app/SpecialEffectsController$Operation;", "isPop", "", "createTransitionEffect", "transitionInfos", "Landroidx/fragment/app/DefaultSpecialEffectsController$TransitionInfo;", "firstOut", "lastIn", "findNamedViews", "namedViews", "", "", "Landroid/view/View;", "view", "syncAnimations", "retainMatchingViews", "Landroidx/collection/ArrayMap;", "names", "", "AnimationEffect", "AnimationInfo", "AnimatorEffect", "Api24Impl", "Api26Impl", "SpecialEffectsInfo", "TransitionEffect", "TransitionInfo", "fragment_release"}, k = 1, mv = {1, 8, 0}, xi = 48)
/* compiled from: DefaultSpecialEffectsController.kt */
public final class DefaultSpecialEffectsController extends SpecialEffectsController {
    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    public DefaultSpecialEffectsController(ViewGroup container) {
        super(container);
        Intrinsics.checkNotNullParameter(container, "container");
    }

    public void collectEffects(List<? extends SpecialEffectsController.Operation> operations, boolean isPop) {
        int i;
        Object element$iv;
        SpecialEffectsController.Operation operation;
        boolean z;
        List<? extends SpecialEffectsController.Operation> $this$firstOrNull$iv = operations;
        boolean z2 = isPop;
        Intrinsics.checkNotNullParameter($this$firstOrNull$iv, "operations");
        int i2 = 2;
        if (FragmentManager.isLoggingEnabled(2)) {
            Log.v(FragmentManager.TAG, "Collecting Effects");
        }
        Iterator it = $this$firstOrNull$iv.iterator();
        while (true) {
            if (!it.hasNext()) {
                i = i2;
                element$iv = null;
                break;
            }
            element$iv = it.next();
            SpecialEffectsController.Operation operation2 = (SpecialEffectsController.Operation) element$iv;
            SpecialEffectsController.Operation.State.Companion companion = SpecialEffectsController.Operation.State.Companion;
            i = i2;
            View view = operation2.getFragment().mView;
            Intrinsics.checkNotNullExpressionValue(view, "operation.fragment.mView");
            if (companion.asOperationState(view) == SpecialEffectsController.Operation.State.VISIBLE && operation2.getFinalState() != SpecialEffectsController.Operation.State.VISIBLE) {
                break;
            }
            i2 = i;
        }
        SpecialEffectsController.Operation firstOut = (SpecialEffectsController.Operation) element$iv;
        List $this$lastOrNull$iv = operations;
        ListIterator iterator$iv = $this$lastOrNull$iv.listIterator($this$lastOrNull$iv.size());
        while (true) {
            if (!iterator$iv.hasPrevious()) {
                operation = null;
                break;
            }
            Object previous = iterator$iv.previous();
            SpecialEffectsController.Operation operation3 = (SpecialEffectsController.Operation) previous;
            SpecialEffectsController.Operation.State.Companion companion2 = SpecialEffectsController.Operation.State.Companion;
            View view2 = operation3.getFragment().mView;
            Intrinsics.checkNotNullExpressionValue(view2, "operation.fragment.mView");
            if (companion2.asOperationState(view2) == SpecialEffectsController.Operation.State.VISIBLE || operation3.getFinalState() != SpecialEffectsController.Operation.State.VISIBLE) {
                z = false;
                continue;
            } else {
                z = true;
                continue;
            }
            if (z) {
                operation = previous;
                break;
            }
        }
        SpecialEffectsController.Operation lastIn = operation;
        if (FragmentManager.isLoggingEnabled(i)) {
            Log.v(FragmentManager.TAG, "Executing operations from " + firstOut + " to " + lastIn);
        }
        List animations = new ArrayList();
        List transitions = new ArrayList();
        syncAnimations(operations);
        for (SpecialEffectsController.Operation operation4 : $this$firstOrNull$iv) {
            animations.add(new AnimationInfo(operation4, z2));
            transitions.add(new TransitionInfo(operation4, z2, !z2 ? operation4 == lastIn : operation4 == firstOut));
            operation4.addCompletionListener(new DefaultSpecialEffectsController$$ExternalSyntheticLambda0(this, operation4));
        }
        createTransitionEffect(transitions, z2, firstOut, lastIn);
        collectAnimEffects(animations);
    }

    /* access modifiers changed from: private */
    public static final void collectEffects$lambda$2(DefaultSpecialEffectsController this$0, SpecialEffectsController.Operation $operation) {
        Intrinsics.checkNotNullParameter(this$0, "this$0");
        Intrinsics.checkNotNullParameter($operation, "$operation");
        this$0.applyContainerChangesToOperation$fragment_release($operation);
    }

    private final void syncAnimations(List<? extends SpecialEffectsController.Operation> operations) {
        Fragment lastOpFragment = ((SpecialEffectsController.Operation) CollectionsKt.last(operations)).getFragment();
        for (SpecialEffectsController.Operation operation : operations) {
            operation.getFragment().mAnimationInfo.mEnterAnim = lastOpFragment.mAnimationInfo.mEnterAnim;
            operation.getFragment().mAnimationInfo.mExitAnim = lastOpFragment.mAnimationInfo.mExitAnim;
            operation.getFragment().mAnimationInfo.mPopEnterAnim = lastOpFragment.mAnimationInfo.mPopEnterAnim;
            operation.getFragment().mAnimationInfo.mPopExitAnim = lastOpFragment.mAnimationInfo.mPopExitAnim;
        }
    }

    private final void collectAnimEffects(List<AnimationInfo> animationInfos) {
        List<AnimationInfo> animationsToRun = new ArrayList<>();
        Collection destination$iv$iv = new ArrayList();
        for (AnimationInfo it : animationInfos) {
            CollectionsKt.addAll(destination$iv$iv, it.getOperation().getEffects$fragment_release());
        }
        boolean startedAnyTransition = !((List) destination$iv$iv).isEmpty();
        boolean startedAnyAnimator = false;
        for (AnimationInfo animatorInfo : animationInfos) {
            Context context = getContainer().getContext();
            SpecialEffectsController.Operation operation = animatorInfo.getOperation();
            Intrinsics.checkNotNullExpressionValue(context, "context");
            FragmentAnim.AnimationOrAnimator anim = animatorInfo.getAnimation(context);
            if (anim != null) {
                if (anim.animator == null) {
                    animationsToRun.add(animatorInfo);
                } else {
                    Fragment fragment = operation.getFragment();
                    if (!(!operation.getEffects$fragment_release().isEmpty())) {
                        startedAnyAnimator = true;
                        if (operation.getFinalState() == SpecialEffectsController.Operation.State.GONE) {
                            operation.setAwaitingContainerChanges(false);
                        }
                        operation.addEffect(new AnimatorEffect(animatorInfo));
                    } else if (FragmentManager.isLoggingEnabled(2)) {
                        Log.v(FragmentManager.TAG, "Ignoring Animator set on " + fragment + " as this Fragment was involved in a Transition.");
                    }
                }
            }
        }
        for (AnimationInfo animationInfo : animationsToRun) {
            SpecialEffectsController.Operation operation2 = animationInfo.getOperation();
            Fragment fragment2 = operation2.getFragment();
            if (startedAnyTransition) {
                if (FragmentManager.isLoggingEnabled(2)) {
                    Log.v(FragmentManager.TAG, "Ignoring Animation set on " + fragment2 + " as Animations cannot run alongside Transitions.");
                }
            } else if (!startedAnyAnimator) {
                operation2.addEffect(new AnimationEffect(animationInfo));
            } else if (FragmentManager.isLoggingEnabled(2)) {
                Log.v(FragmentManager.TAG, "Ignoring Animation set on " + fragment2 + " as Animations cannot run alongside Animators.");
            }
        }
    }

    private final void createTransitionEffect(List<TransitionInfo> transitionInfos, boolean isPop, SpecialEffectsController.Operation firstOut, SpecialEffectsController.Operation lastIn) {
        boolean z;
        boolean z2;
        ArrayList sharedElementFirstOutViews;
        Pair pair;
        ArrayList sharedElementLastInViews;
        Iterator it;
        Object sharedElementTransition;
        int i;
        SharedElementCallback enteringCallback;
        int i2;
        SharedElementCallback exitingCallback;
        SpecialEffectsController.Operation operation = firstOut;
        SpecialEffectsController.Operation operation2 = lastIn;
        Collection destination$iv$iv = new ArrayList();
        for (Object element$iv$iv : transitionInfos) {
            if (!((TransitionInfo) element$iv$iv).isVisibilityUnchanged()) {
                destination$iv$iv.add(element$iv$iv);
            }
        }
        Collection destination$iv$iv2 = new ArrayList();
        Iterator it2 = ((List) destination$iv$iv).iterator();
        while (true) {
            boolean z3 = false;
            if (!it2.hasNext()) {
                break;
            }
            Object element$iv$iv2 = it2.next();
            if (((TransitionInfo) element$iv$iv2).getHandlingImpl() != null) {
                z3 = true;
            }
            if (z3) {
                destination$iv$iv2.add(element$iv$iv2);
            }
        }
        List<TransitionInfo> filteredInfos = (List) destination$iv$iv2;
        FragmentTransitionImpl fragmentTransitionImpl = null;
        for (TransitionInfo transitionInfo : filteredInfos) {
            FragmentTransitionImpl chosenImpl = fragmentTransitionImpl;
            FragmentTransitionImpl handlingImpl = transitionInfo.getHandlingImpl();
            if (chosenImpl == null || handlingImpl == chosenImpl) {
                fragmentTransitionImpl = handlingImpl;
            } else {
                throw new IllegalArgumentException(("Mixing framework transitions and AndroidX transitions is not allowed. Fragment " + transitionInfo.getOperation().getFragment() + " returned Transition " + transitionInfo.getTransition() + " which uses a different Transition type than other Fragments.").toString());
            }
        }
        if (fragmentTransitionImpl != null) {
            FragmentTransitionImpl transitionImpl = fragmentTransitionImpl;
            ArrayList sharedElementFirstOutViews2 = new ArrayList();
            ArrayList sharedElementLastInViews2 = new ArrayList();
            ArrayMap sharedElementNameMapping = new ArrayMap();
            ArrayList enteringNames = new ArrayList();
            ArrayList exitingNames = new ArrayList();
            ArrayMap firstOutViews = new ArrayMap();
            ArrayMap lastInViews = new ArrayMap();
            Iterator it3 = filteredInfos.iterator();
            ArrayList arrayList = enteringNames;
            Object sharedElementTransition2 = null;
            ArrayList enteringNames2 = arrayList;
            while (it3.hasNext()) {
                TransitionInfo transitionInfo2 = (TransitionInfo) it3.next();
                if (!transitionInfo2.hasSharedElementTransition() || operation == null || operation2 == null) {
                    filteredInfos = filteredInfos;
                    sharedElementFirstOutViews2 = sharedElementFirstOutViews2;
                    transitionImpl = transitionImpl;
                    sharedElementLastInViews2 = sharedElementLastInViews2;
                    it3 = it3;
                } else {
                    Object sharedElementTransition3 = transitionImpl.wrapTransitionInSet(transitionImpl.cloneTransition(transitionInfo2.getSharedElementTransition()));
                    ArrayList sharedElementSourceNames = operation2.getFragment().getSharedElementSourceNames();
                    Intrinsics.checkNotNullExpressionValue(sharedElementSourceNames, "lastIn.fragment.sharedElementSourceNames");
                    exitingNames = sharedElementSourceNames;
                    ArrayList<String> sharedElementSourceNames2 = operation.getFragment().getSharedElementSourceNames();
                    Intrinsics.checkNotNullExpressionValue(sharedElementSourceNames2, "firstOut.fragment.sharedElementSourceNames");
                    ArrayList firstOutTargetNames = operation.getFragment().getSharedElementTargetNames();
                    List filteredInfos2 = filteredInfos;
                    Intrinsics.checkNotNullExpressionValue(firstOutTargetNames, "firstOut.fragment.sharedElementTargetNames");
                    int size = firstOutTargetNames.size();
                    FragmentTransitionImpl transitionImpl2 = transitionImpl;
                    int index = 0;
                    while (true) {
                        sharedElementFirstOutViews = sharedElementFirstOutViews2;
                        if (index >= size) {
                            break;
                        }
                        int nameIndex = exitingNames.indexOf(firstOutTargetNames.get(index));
                        int i3 = size;
                        if (nameIndex != -1) {
                            exitingNames.set(nameIndex, sharedElementSourceNames2.get(index));
                        }
                        index++;
                        sharedElementFirstOutViews2 = sharedElementFirstOutViews;
                        size = i3;
                    }
                    ArrayList sharedElementTargetNames = operation2.getFragment().getSharedElementTargetNames();
                    Intrinsics.checkNotNullExpressionValue(sharedElementTargetNames, "lastIn.fragment.sharedElementTargetNames");
                    enteringNames2 = sharedElementTargetNames;
                    if (!isPop) {
                        pair = TuplesKt.to(operation.getFragment().getExitTransitionCallback(), operation2.getFragment().getEnterTransitionCallback());
                    } else {
                        pair = TuplesKt.to(operation.getFragment().getEnterTransitionCallback(), operation2.getFragment().getExitTransitionCallback());
                    }
                    SharedElementCallback exitingCallback2 = (SharedElementCallback) pair.component1();
                    SharedElementCallback enteringCallback2 = (SharedElementCallback) pair.component2();
                    int numSharedElements = exitingNames.size();
                    ArrayList<String> arrayList2 = sharedElementSourceNames2;
                    int i4 = 0;
                    while (true) {
                        sharedElementLastInViews = sharedElementLastInViews2;
                        ArrayList firstOutTargetNames2 = firstOutTargetNames;
                        if (i4 >= numSharedElements) {
                            break;
                        }
                        int numSharedElements2 = numSharedElements;
                        String exitingName = exitingNames.get(i4);
                        Intrinsics.checkNotNullExpressionValue(exitingName, "exitingNames[i]");
                        String enteringName = enteringNames2.get(i4);
                        Intrinsics.checkNotNullExpressionValue(enteringName, "enteringNames[i]");
                        sharedElementNameMapping.put(exitingName, enteringName);
                        i4++;
                        sharedElementLastInViews2 = sharedElementLastInViews;
                        firstOutTargetNames = firstOutTargetNames2;
                        numSharedElements = numSharedElements2;
                    }
                    if (FragmentManager.isLoggingEnabled(2)) {
                        Log.v(FragmentManager.TAG, ">>> entering view names <<<");
                        Iterator<String> it4 = enteringNames2.iterator();
                        while (true) {
                            Iterator<String> it5 = it4;
                            if (!it4.hasNext()) {
                                break;
                            }
                            Log.v(FragmentManager.TAG, "Name: " + it5.next());
                            sharedElementTransition3 = sharedElementTransition3;
                            it4 = it5;
                            it3 = it3;
                        }
                        sharedElementTransition = sharedElementTransition3;
                        it = it3;
                        Log.v(FragmentManager.TAG, ">>> exiting view names <<<");
                        for (Iterator<String> it6 = exitingNames.iterator(); it6.hasNext(); it6 = it6) {
                            Log.v(FragmentManager.TAG, "Name: " + it6.next());
                        }
                    } else {
                        sharedElementTransition = sharedElementTransition3;
                        it = it3;
                    }
                    View view = operation.getFragment().mView;
                    Intrinsics.checkNotNullExpressionValue(view, "firstOut.fragment.mView");
                    findNamedViews(firstOutViews, view);
                    firstOutViews.retainAll(exitingNames);
                    if (exitingCallback2 != null) {
                        if (FragmentManager.isLoggingEnabled(2)) {
                            Log.v(FragmentManager.TAG, "Executing exit callback for operation " + operation);
                        }
                        exitingCallback2.onMapSharedElements(exitingNames, firstOutViews);
                        int size2 = exitingNames.size() - 1;
                        if (size2 >= 0) {
                            while (true) {
                                int i5 = size2;
                                int i6 = size2 - 1;
                                String str = exitingNames.get(i5);
                                Intrinsics.checkNotNullExpressionValue(str, "exitingNames[i]");
                                String name = str;
                                View view2 = (View) firstOutViews.get(name);
                                if (view2 == null) {
                                    sharedElementNameMapping.remove(name);
                                    exitingCallback = exitingCallback2;
                                    i2 = i6;
                                    int i7 = i5;
                                } else {
                                    exitingCallback = exitingCallback2;
                                    if (!Intrinsics.areEqual((Object) name, (Object) ViewCompat.getTransitionName(view2))) {
                                        i2 = i6;
                                        int i8 = i5;
                                        sharedElementNameMapping.put(ViewCompat.getTransitionName(view2), (String) sharedElementNameMapping.remove(name));
                                    } else {
                                        i2 = i6;
                                        int i9 = i5;
                                    }
                                }
                                if (i2 < 0) {
                                    break;
                                }
                                exitingCallback2 = exitingCallback;
                                size2 = i2;
                            }
                        }
                    } else {
                        sharedElementNameMapping.retainAll(firstOutViews.keySet());
                    }
                    View view3 = operation2.getFragment().mView;
                    Intrinsics.checkNotNullExpressionValue(view3, "lastIn.fragment.mView");
                    findNamedViews(lastInViews, view3);
                    lastInViews.retainAll(enteringNames2);
                    lastInViews.retainAll(sharedElementNameMapping.values());
                    if (enteringCallback2 != null) {
                        if (FragmentManager.isLoggingEnabled(2)) {
                            Log.v(FragmentManager.TAG, "Executing enter callback for operation " + operation2);
                        }
                        enteringCallback2.onMapSharedElements(enteringNames2, lastInViews);
                        int size3 = enteringNames2.size() - 1;
                        if (size3 >= 0) {
                            while (true) {
                                int i10 = size3;
                                int i11 = size3 - 1;
                                String str2 = enteringNames2.get(i10);
                                Intrinsics.checkNotNullExpressionValue(str2, "enteringNames[i]");
                                String name2 = str2;
                                View view4 = (View) lastInViews.get(name2);
                                if (view4 == null) {
                                    String key = FragmentTransition.findKeyForValue(sharedElementNameMapping, name2);
                                    if (key != null) {
                                        sharedElementNameMapping.remove(key);
                                        enteringCallback = enteringCallback2;
                                        i = i11;
                                    } else {
                                        enteringCallback = enteringCallback2;
                                        i = i11;
                                    }
                                } else if (!Intrinsics.areEqual((Object) name2, (Object) ViewCompat.getTransitionName(view4))) {
                                    String key2 = FragmentTransition.findKeyForValue(sharedElementNameMapping, name2);
                                    if (key2 != null) {
                                        enteringCallback = enteringCallback2;
                                        i = i11;
                                        sharedElementNameMapping.put(key2, ViewCompat.getTransitionName(view4));
                                    } else {
                                        enteringCallback = enteringCallback2;
                                        i = i11;
                                    }
                                } else {
                                    enteringCallback = enteringCallback2;
                                    i = i11;
                                }
                                if (i < 0) {
                                    break;
                                }
                                enteringCallback2 = enteringCallback;
                                size3 = i;
                            }
                        }
                    } else {
                        FragmentTransition.retainValues(sharedElementNameMapping, lastInViews);
                    }
                    Set keySet = sharedElementNameMapping.keySet();
                    Intrinsics.checkNotNullExpressionValue(keySet, "sharedElementNameMapping.keys");
                    retainMatchingViews(firstOutViews, keySet);
                    Collection values = sharedElementNameMapping.values();
                    Intrinsics.checkNotNullExpressionValue(values, "sharedElementNameMapping.values");
                    retainMatchingViews(lastInViews, values);
                    if (sharedElementNameMapping.isEmpty()) {
                        Log.i(FragmentManager.TAG, "Ignoring shared elements transition " + sharedElementTransition + " between " + operation + " and " + operation2 + " as there are no matching elements in both the entering and exiting fragment. In order to run a SharedElementTransition, both fragments involved must have the element.");
                        sharedElementTransition2 = null;
                        sharedElementFirstOutViews.clear();
                        sharedElementLastInViews.clear();
                        filteredInfos = filteredInfos2;
                        sharedElementFirstOutViews2 = sharedElementFirstOutViews;
                        transitionImpl = transitionImpl2;
                        sharedElementLastInViews2 = sharedElementLastInViews;
                        it3 = it;
                    } else {
                        sharedElementTransition2 = sharedElementTransition;
                        filteredInfos = filteredInfos2;
                        sharedElementFirstOutViews2 = sharedElementFirstOutViews;
                        transitionImpl = transitionImpl2;
                        sharedElementLastInViews2 = sharedElementLastInViews;
                        it3 = it;
                    }
                }
            }
            List filteredInfos3 = filteredInfos;
            FragmentTransitionImpl transitionImpl3 = transitionImpl;
            ArrayList sharedElementFirstOutViews3 = sharedElementFirstOutViews2;
            ArrayList sharedElementLastInViews3 = sharedElementLastInViews2;
            if (sharedElementTransition2 == null) {
                Iterable $this$all$iv = filteredInfos3;
                if (!($this$all$iv instanceof Collection) || !((Collection) $this$all$iv).isEmpty()) {
                    Iterator it7 = $this$all$iv.iterator();
                    while (true) {
                        if (!it7.hasNext()) {
                            z = true;
                            break;
                        }
                        if (((TransitionInfo) it7.next()).getTransition() == null) {
                            z2 = true;
                            continue;
                        } else {
                            z2 = false;
                            continue;
                        }
                        if (!z2) {
                            z = false;
                            break;
                        }
                    }
                } else {
                    z = true;
                }
                if (z) {
                    return;
                }
            }
            List<TransitionInfo> filteredInfos4 = filteredInfos3;
            TransitionEffect transitionEffect = new TransitionEffect(filteredInfos4, operation, operation2, transitionImpl3, sharedElementTransition2, sharedElementFirstOutViews3, sharedElementLastInViews3, sharedElementNameMapping, enteringNames2, exitingNames, firstOutViews, lastInViews, isPop);
            for (TransitionInfo transitionInfo3 : filteredInfos4) {
                TransitionEffect transitionEffect2 = transitionEffect;
                transitionInfo3.getOperation().addEffect(transitionEffect2);
                transitionEffect = transitionEffect2;
            }
        }
    }

    private final void retainMatchingViews(ArrayMap<String, View> $this$retainMatchingViews, Collection<String> names) {
        Set<Map.Entry<String, View>> entrySet = $this$retainMatchingViews.entrySet();
        Intrinsics.checkNotNullExpressionValue(entrySet, "entries");
        CollectionsKt.retainAll(entrySet, new DefaultSpecialEffectsController$retainMatchingViews$1(names));
    }

    private final void findNamedViews(Map<String, View> namedViews, View view) {
        String transitionName = ViewCompat.getTransitionName(view);
        if (transitionName != null) {
            namedViews.put(transitionName, view);
        }
        if (view instanceof ViewGroup) {
            int count = ((ViewGroup) view).getChildCount();
            for (int i = 0; i < count; i++) {
                View child = ((ViewGroup) view).getChildAt(i);
                if (child.getVisibility() == 0) {
                    Intrinsics.checkNotNullExpressionValue(child, "child");
                    findNamedViews(namedViews, child);
                }
            }
        }
    }

    @Metadata(d1 = {"\u0000\u001a\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000b\n\u0002\b\u0004\b\u0010\u0018\u00002\u00020\u0001B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003¢\u0006\u0002\u0010\u0004R\u0011\u0010\u0005\u001a\u00020\u00068F¢\u0006\u0006\u001a\u0004\b\u0005\u0010\u0007R\u0011\u0010\u0002\u001a\u00020\u0003¢\u0006\b\n\u0000\u001a\u0004\b\b\u0010\t¨\u0006\n"}, d2 = {"Landroidx/fragment/app/DefaultSpecialEffectsController$SpecialEffectsInfo;", "", "operation", "Landroidx/fragment/app/SpecialEffectsController$Operation;", "(Landroidx/fragment/app/SpecialEffectsController$Operation;)V", "isVisibilityUnchanged", "", "()Z", "getOperation", "()Landroidx/fragment/app/SpecialEffectsController$Operation;", "fragment_release"}, k = 1, mv = {1, 8, 0}, xi = 48)
    /* compiled from: DefaultSpecialEffectsController.kt */
    public static class SpecialEffectsInfo {
        private final SpecialEffectsController.Operation operation;

        public SpecialEffectsInfo(SpecialEffectsController.Operation operation2) {
            Intrinsics.checkNotNullParameter(operation2, "operation");
            this.operation = operation2;
        }

        public final SpecialEffectsController.Operation getOperation() {
            return this.operation;
        }

        public final boolean isVisibilityUnchanged() {
            View view = this.operation.getFragment().mView;
            SpecialEffectsController.Operation.State currentState = view != null ? SpecialEffectsController.Operation.State.Companion.asOperationState(view) : null;
            SpecialEffectsController.Operation.State finalState = this.operation.getFinalState();
            return currentState == finalState || !(currentState == SpecialEffectsController.Operation.State.VISIBLE || finalState == SpecialEffectsController.Operation.State.VISIBLE);
        }
    }

    @Metadata(d1 = {"\u0000&\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\b\u0002\u0018\u00002\u00020\u0001B\u0015\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005¢\u0006\u0002\u0010\u0006J\u0010\u0010\n\u001a\u0004\u0018\u00010\b2\u0006\u0010\u000b\u001a\u00020\fR\u0010\u0010\u0007\u001a\u0004\u0018\u00010\bX\u000e¢\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\u0005X\u000e¢\u0006\u0002\n\u0000R\u000e\u0010\u0004\u001a\u00020\u0005X\u0004¢\u0006\u0002\n\u0000¨\u0006\r"}, d2 = {"Landroidx/fragment/app/DefaultSpecialEffectsController$AnimationInfo;", "Landroidx/fragment/app/DefaultSpecialEffectsController$SpecialEffectsInfo;", "operation", "Landroidx/fragment/app/SpecialEffectsController$Operation;", "isPop", "", "(Landroidx/fragment/app/SpecialEffectsController$Operation;Z)V", "animation", "Landroidx/fragment/app/FragmentAnim$AnimationOrAnimator;", "isAnimLoaded", "getAnimation", "context", "Landroid/content/Context;", "fragment_release"}, k = 1, mv = {1, 8, 0}, xi = 48)
    /* compiled from: DefaultSpecialEffectsController.kt */
    private static final class AnimationInfo extends SpecialEffectsInfo {
        private FragmentAnim.AnimationOrAnimator animation;
        private boolean isAnimLoaded;
        private final boolean isPop;

        /* JADX INFO: super call moved to the top of the method (can break code semantics) */
        public AnimationInfo(SpecialEffectsController.Operation operation, boolean isPop2) {
            super(operation);
            Intrinsics.checkNotNullParameter(operation, "operation");
            this.isPop = isPop2;
        }

        public final FragmentAnim.AnimationOrAnimator getAnimation(Context context) {
            Intrinsics.checkNotNullParameter(context, "context");
            if (this.isAnimLoaded) {
                return this.animation;
            }
            FragmentAnim.AnimationOrAnimator it = FragmentAnim.loadAnimation(context, getOperation().getFragment(), getOperation().getFinalState() == SpecialEffectsController.Operation.State.VISIBLE, this.isPop);
            this.animation = it;
            this.isAnimLoaded = true;
            return it;
        }
    }

    @Metadata(d1 = {"\u0000(\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010\u0000\n\u0002\b\u0006\b\u0002\u0018\u00002\u00020\u0001B\u001d\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u0012\u0006\u0010\u0006\u001a\u00020\u0005¢\u0006\u0002\u0010\u0007J\u0014\u0010\n\u001a\u0004\u0018\u00010\t2\b\u0010\u0012\u001a\u0004\u0018\u00010\u000fH\u0002J\u0006\u0010\u0014\u001a\u00020\u0005R\u0013\u0010\b\u001a\u0004\u0018\u00010\t8F¢\u0006\u0006\u001a\u0004\b\n\u0010\u000bR\u0011\u0010\f\u001a\u00020\u0005¢\u0006\b\n\u0000\u001a\u0004\b\f\u0010\rR\u0013\u0010\u000e\u001a\u0004\u0018\u00010\u000f¢\u0006\b\n\u0000\u001a\u0004\b\u0010\u0010\u0011R\u0013\u0010\u0012\u001a\u0004\u0018\u00010\u000f¢\u0006\b\n\u0000\u001a\u0004\b\u0013\u0010\u0011¨\u0006\u0015"}, d2 = {"Landroidx/fragment/app/DefaultSpecialEffectsController$TransitionInfo;", "Landroidx/fragment/app/DefaultSpecialEffectsController$SpecialEffectsInfo;", "operation", "Landroidx/fragment/app/SpecialEffectsController$Operation;", "isPop", "", "providesSharedElementTransition", "(Landroidx/fragment/app/SpecialEffectsController$Operation;ZZ)V", "handlingImpl", "Landroidx/fragment/app/FragmentTransitionImpl;", "getHandlingImpl", "()Landroidx/fragment/app/FragmentTransitionImpl;", "isOverlapAllowed", "()Z", "sharedElementTransition", "", "getSharedElementTransition", "()Ljava/lang/Object;", "transition", "getTransition", "hasSharedElementTransition", "fragment_release"}, k = 1, mv = {1, 8, 0}, xi = 48)
    /* compiled from: DefaultSpecialEffectsController.kt */
    private static final class TransitionInfo extends SpecialEffectsInfo {
        private final boolean isOverlapAllowed;
        private final Object sharedElementTransition;
        private final Object transition;

        /* JADX INFO: super call moved to the top of the method (can break code semantics) */
        public TransitionInfo(SpecialEffectsController.Operation operation, boolean isPop, boolean providesSharedElementTransition) {
            super(operation);
            Object obj;
            boolean z;
            Object obj2;
            Intrinsics.checkNotNullParameter(operation, "operation");
            if (operation.getFinalState() == SpecialEffectsController.Operation.State.VISIBLE) {
                Fragment fragment = operation.getFragment();
                obj = isPop ? fragment.getReenterTransition() : fragment.getEnterTransition();
            } else {
                Fragment fragment2 = operation.getFragment();
                obj = isPop ? fragment2.getReturnTransition() : fragment2.getExitTransition();
            }
            this.transition = obj;
            if (operation.getFinalState() != SpecialEffectsController.Operation.State.VISIBLE) {
                z = true;
            } else if (isPop) {
                z = operation.getFragment().getAllowReturnTransitionOverlap();
            } else {
                z = operation.getFragment().getAllowEnterTransitionOverlap();
            }
            this.isOverlapAllowed = z;
            if (!providesSharedElementTransition) {
                obj2 = null;
            } else if (isPop) {
                obj2 = operation.getFragment().getSharedElementReturnTransition();
            } else {
                obj2 = operation.getFragment().getSharedElementEnterTransition();
            }
            this.sharedElementTransition = obj2;
        }

        public final Object getTransition() {
            return this.transition;
        }

        public final boolean isOverlapAllowed() {
            return this.isOverlapAllowed;
        }

        public final Object getSharedElementTransition() {
            return this.sharedElementTransition;
        }

        public final boolean hasSharedElementTransition() {
            return this.sharedElementTransition != null;
        }

        public final FragmentTransitionImpl getHandlingImpl() {
            FragmentTransitionImpl transitionImpl = getHandlingImpl(this.transition);
            FragmentTransitionImpl sharedElementTransitionImpl = getHandlingImpl(this.sharedElementTransition);
            if (transitionImpl == null || sharedElementTransitionImpl == null || transitionImpl == sharedElementTransitionImpl) {
                return transitionImpl == null ? sharedElementTransitionImpl : transitionImpl;
            }
            throw new IllegalArgumentException(("Mixing framework transitions and AndroidX transitions is not allowed. Fragment " + getOperation().getFragment() + " returned Transition " + this.transition + " which uses a different Transition  type than its shared element transition " + this.sharedElementTransition).toString());
        }

        private final FragmentTransitionImpl getHandlingImpl(Object transition2) {
            if (transition2 == null) {
                return null;
            }
            if (FragmentTransition.PLATFORM_IMPL != null && FragmentTransition.PLATFORM_IMPL.canHandle(transition2)) {
                return FragmentTransition.PLATFORM_IMPL;
            }
            if (FragmentTransition.SUPPORT_IMPL != null && FragmentTransition.SUPPORT_IMPL.canHandle(transition2)) {
                return FragmentTransition.SUPPORT_IMPL;
            }
            throw new IllegalArgumentException("Transition " + transition2 + " for fragment " + getOperation().getFragment() + " is not a valid framework Transition or AndroidX Transition");
        }
    }

    @Metadata(d1 = {"\u0000 \n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\b\u0002\u0018\u00002\u00020\u0001B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003¢\u0006\u0002\u0010\u0004J\u0010\u0010\u0007\u001a\u00020\b2\u0006\u0010\t\u001a\u00020\nH\u0016J\u0010\u0010\u000b\u001a\u00020\b2\u0006\u0010\t\u001a\u00020\nH\u0016R\u0011\u0010\u0002\u001a\u00020\u0003¢\u0006\b\n\u0000\u001a\u0004\b\u0005\u0010\u0006¨\u0006\f"}, d2 = {"Landroidx/fragment/app/DefaultSpecialEffectsController$AnimationEffect;", "Landroidx/fragment/app/SpecialEffectsController$Effect;", "animationInfo", "Landroidx/fragment/app/DefaultSpecialEffectsController$AnimationInfo;", "(Landroidx/fragment/app/DefaultSpecialEffectsController$AnimationInfo;)V", "getAnimationInfo", "()Landroidx/fragment/app/DefaultSpecialEffectsController$AnimationInfo;", "onCancel", "", "container", "Landroid/view/ViewGroup;", "onCommit", "fragment_release"}, k = 1, mv = {1, 8, 0}, xi = 48)
    /* compiled from: DefaultSpecialEffectsController.kt */
    private static final class AnimationEffect extends SpecialEffectsController.Effect {
        private final AnimationInfo animationInfo;

        public AnimationEffect(AnimationInfo animationInfo2) {
            Intrinsics.checkNotNullParameter(animationInfo2, "animationInfo");
            this.animationInfo = animationInfo2;
        }

        public final AnimationInfo getAnimationInfo() {
            return this.animationInfo;
        }

        public void onCommit(ViewGroup container) {
            Intrinsics.checkNotNullParameter(container, "container");
            if (this.animationInfo.isVisibilityUnchanged()) {
                this.animationInfo.getOperation().completeEffect(this);
                return;
            }
            Context context = container.getContext();
            SpecialEffectsController.Operation operation = this.animationInfo.getOperation();
            View viewToAnimate = operation.getFragment().mView;
            AnimationInfo animationInfo2 = this.animationInfo;
            Intrinsics.checkNotNullExpressionValue(context, "context");
            FragmentAnim.AnimationOrAnimator animation = animationInfo2.getAnimation(context);
            if (animation != null) {
                Animation anim = animation.animation;
                if (anim == null) {
                    throw new IllegalStateException("Required value was null.".toString());
                } else if (operation.getFinalState() != SpecialEffectsController.Operation.State.REMOVED) {
                    viewToAnimate.startAnimation(anim);
                    this.animationInfo.getOperation().completeEffect(this);
                } else {
                    container.startViewTransition(viewToAnimate);
                    Animation animation2 = new FragmentAnim.EndViewTransitionAnimation(anim, container, viewToAnimate);
                    animation2.setAnimationListener(new DefaultSpecialEffectsController$AnimationEffect$onCommit$1(operation, container, viewToAnimate, this));
                    viewToAnimate.startAnimation(animation2);
                    if (FragmentManager.isLoggingEnabled(2)) {
                        Log.v(FragmentManager.TAG, "Animation from operation " + operation + " has started.");
                    }
                }
            } else {
                throw new IllegalStateException("Required value was null.".toString());
            }
        }

        public void onCancel(ViewGroup container) {
            Intrinsics.checkNotNullParameter(container, "container");
            SpecialEffectsController.Operation operation = this.animationInfo.getOperation();
            View viewToAnimate = operation.getFragment().mView;
            viewToAnimate.clearAnimation();
            container.endViewTransition(viewToAnimate);
            this.animationInfo.getOperation().completeEffect(this);
            if (FragmentManager.isLoggingEnabled(2)) {
                Log.v(FragmentManager.TAG, "Animation from operation " + operation + " has been cancelled.");
            }
        }
    }

    @Metadata(d1 = {"\u00008\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0007\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\b\u0002\u0018\u00002\u00020\u0001B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003¢\u0006\u0002\u0010\u0004J\u0010\u0010\u0010\u001a\u00020\u00112\u0006\u0010\u0012\u001a\u00020\u0013H\u0016J\u0010\u0010\u0014\u001a\u00020\u00112\u0006\u0010\u0012\u001a\u00020\u0013H\u0016J\u0018\u0010\u0015\u001a\u00020\u00112\u0006\u0010\u0016\u001a\u00020\u00172\u0006\u0010\u0012\u001a\u00020\u0013H\u0016J\u0010\u0010\u0018\u001a\u00020\u00112\u0006\u0010\u0012\u001a\u00020\u0013H\u0016R\u001c\u0010\u0005\u001a\u0004\u0018\u00010\u0006X\u000e¢\u0006\u000e\n\u0000\u001a\u0004\b\u0007\u0010\b\"\u0004\b\t\u0010\nR\u0011\u0010\u0002\u001a\u00020\u0003¢\u0006\b\n\u0000\u001a\u0004\b\u000b\u0010\fR\u0014\u0010\r\u001a\u00020\u000e8VX\u0004¢\u0006\u0006\u001a\u0004\b\r\u0010\u000f¨\u0006\u0019"}, d2 = {"Landroidx/fragment/app/DefaultSpecialEffectsController$AnimatorEffect;", "Landroidx/fragment/app/SpecialEffectsController$Effect;", "animatorInfo", "Landroidx/fragment/app/DefaultSpecialEffectsController$AnimationInfo;", "(Landroidx/fragment/app/DefaultSpecialEffectsController$AnimationInfo;)V", "animator", "Landroid/animation/AnimatorSet;", "getAnimator", "()Landroid/animation/AnimatorSet;", "setAnimator", "(Landroid/animation/AnimatorSet;)V", "getAnimatorInfo", "()Landroidx/fragment/app/DefaultSpecialEffectsController$AnimationInfo;", "isSeekingSupported", "", "()Z", "onCancel", "", "container", "Landroid/view/ViewGroup;", "onCommit", "onProgress", "backEvent", "Landroidx/activity/BackEventCompat;", "onStart", "fragment_release"}, k = 1, mv = {1, 8, 0}, xi = 48)
    /* compiled from: DefaultSpecialEffectsController.kt */
    private static final class AnimatorEffect extends SpecialEffectsController.Effect {
        private AnimatorSet animator;
        private final AnimationInfo animatorInfo;

        public AnimatorEffect(AnimationInfo animatorInfo2) {
            Intrinsics.checkNotNullParameter(animatorInfo2, "animatorInfo");
            this.animatorInfo = animatorInfo2;
        }

        public final AnimationInfo getAnimatorInfo() {
            return this.animatorInfo;
        }

        public boolean isSeekingSupported() {
            return true;
        }

        public final AnimatorSet getAnimator() {
            return this.animator;
        }

        public final void setAnimator(AnimatorSet animatorSet) {
            this.animator = animatorSet;
        }

        public void onStart(ViewGroup container) {
            AnimatorEffect animatorEffect;
            Intrinsics.checkNotNullParameter(container, "container");
            if (!this.animatorInfo.isVisibilityUnchanged()) {
                Context context = container.getContext();
                AnimationInfo animationInfo = this.animatorInfo;
                Intrinsics.checkNotNullExpressionValue(context, "context");
                FragmentAnim.AnimationOrAnimator animation = animationInfo.getAnimation(context);
                this.animator = animation != null ? animation.animator : null;
                SpecialEffectsController.Operation operation = this.animatorInfo.getOperation();
                Fragment fragment = operation.getFragment();
                boolean isHideOperation = operation.getFinalState() == SpecialEffectsController.Operation.State.GONE;
                View viewToAnimate = fragment.mView;
                container.startViewTransition(viewToAnimate);
                AnimatorSet animatorSet = this.animator;
                if (animatorSet != null) {
                    animatorEffect = this;
                    animatorSet.addListener(new DefaultSpecialEffectsController$AnimatorEffect$onStart$1(container, viewToAnimate, isHideOperation, operation, animatorEffect));
                } else {
                    animatorEffect = this;
                    ViewGroup viewGroup = container;
                }
                AnimatorSet animatorSet2 = animatorEffect.animator;
                if (animatorSet2 != null) {
                    animatorSet2.setTarget(viewToAnimate);
                }
            }
        }

        public void onProgress(BackEventCompat backEvent, ViewGroup container) {
            Intrinsics.checkNotNullParameter(backEvent, "backEvent");
            Intrinsics.checkNotNullParameter(container, "container");
            SpecialEffectsController.Operation operation = this.animatorInfo.getOperation();
            AnimatorSet animatorSet = this.animator;
            if (animatorSet == null) {
                this.animatorInfo.getOperation().completeEffect(this);
            } else if (Build.VERSION.SDK_INT >= 34 && operation.getFragment().mTransitioning) {
                if (FragmentManager.isLoggingEnabled(2)) {
                    Log.v(FragmentManager.TAG, "Adding BackProgressCallbacks for Animators to operation " + operation);
                }
                long totalDuration = Api24Impl.INSTANCE.totalDuration(animatorSet);
                long time = (long) (backEvent.getProgress() * ((float) totalDuration));
                if (time == 0) {
                    time = 1;
                }
                if (time == totalDuration) {
                    time = totalDuration - 1;
                }
                if (FragmentManager.isLoggingEnabled(2)) {
                    Log.v(FragmentManager.TAG, "Setting currentPlayTime to " + time + " for Animator " + animatorSet + " on operation " + operation);
                }
                Api26Impl.INSTANCE.setCurrentPlayTime(animatorSet, time);
            }
        }

        public void onCommit(ViewGroup container) {
            Intrinsics.checkNotNullParameter(container, "container");
            SpecialEffectsController.Operation operation = this.animatorInfo.getOperation();
            AnimatorSet animatorSet = this.animator;
            if (animatorSet == null) {
                this.animatorInfo.getOperation().completeEffect(this);
                return;
            }
            animatorSet.start();
            if (FragmentManager.isLoggingEnabled(2)) {
                Log.v(FragmentManager.TAG, "Animator from operation " + operation + " has started.");
            }
        }

        public void onCancel(ViewGroup container) {
            Intrinsics.checkNotNullParameter(container, "container");
            AnimatorSet animator2 = this.animator;
            if (animator2 == null) {
                this.animatorInfo.getOperation().completeEffect(this);
                return;
            }
            SpecialEffectsController.Operation operation = this.animatorInfo.getOperation();
            if (!operation.isSeeking()) {
                animator2.end();
            } else if (Build.VERSION.SDK_INT >= 26) {
                Api26Impl.INSTANCE.reverse(animator2);
            }
            if (FragmentManager.isLoggingEnabled(2)) {
                Log.v(FragmentManager.TAG, "Animator from operation " + operation + " has been canceled" + (operation.isSeeking() ? " with seeking." : ".") + ' ');
            }
        }
    }

    @Metadata(d1 = {"\u0000x\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0010\u000e\n\u0002\b\u0005\n\u0002\u0010\u000b\n\u0002\b\u001e\n\u0002\u0018\u0002\n\u0002\b\u0007\n\u0002\u0010\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0000\b\u0002\u0018\u00002\u00020\u0001BÝ\u0001\u0012\f\u0010\u0002\u001a\b\u0012\u0004\u0012\u00020\u00040\u0003\u0012\b\u0010\u0005\u001a\u0004\u0018\u00010\u0006\u0012\b\u0010\u0007\u001a\u0004\u0018\u00010\u0006\u0012\u0006\u0010\b\u001a\u00020\t\u0012\b\u0010\n\u001a\u0004\u0018\u00010\u000b\u0012\u0016\u0010\f\u001a\u0012\u0012\u0004\u0012\u00020\u000e0\rj\b\u0012\u0004\u0012\u00020\u000e`\u000f\u0012\u0016\u0010\u0010\u001a\u0012\u0012\u0004\u0012\u00020\u000e0\rj\b\u0012\u0004\u0012\u00020\u000e`\u000f\u0012\u0012\u0010\u0011\u001a\u000e\u0012\u0004\u0012\u00020\u0013\u0012\u0004\u0012\u00020\u00130\u0012\u0012\u0016\u0010\u0014\u001a\u0012\u0012\u0004\u0012\u00020\u00130\rj\b\u0012\u0004\u0012\u00020\u0013`\u000f\u0012\u0016\u0010\u0015\u001a\u0012\u0012\u0004\u0012\u00020\u00130\rj\b\u0012\u0004\u0012\u00020\u0013`\u000f\u0012\u0012\u0010\u0016\u001a\u000e\u0012\u0004\u0012\u00020\u0013\u0012\u0004\u0012\u00020\u000e0\u0012\u0012\u0012\u0010\u0017\u001a\u000e\u0012\u0004\u0012\u00020\u0013\u0012\u0004\u0012\u00020\u000e0\u0012\u0012\u0006\u0010\u0018\u001a\u00020\u0019¢\u0006\u0002\u0010\u001aJ(\u0010?\u001a\u00020@2\u0016\u0010A\u001a\u0012\u0012\u0004\u0012\u00020\u000e0\rj\b\u0012\u0004\u0012\u00020\u000e`\u000f2\u0006\u0010B\u001a\u00020\u000eH\u0002J@\u0010C\u001a\u001e\u0012\u0014\u0012\u0012\u0012\u0004\u0012\u00020\u000e0\rj\b\u0012\u0004\u0012\u00020\u000e`\u000f\u0012\u0004\u0012\u00020\u000b0D2\u0006\u0010E\u001a\u00020F2\b\u0010\u0007\u001a\u0004\u0018\u00010\u00062\b\u0010\u0005\u001a\u0004\u0018\u00010\u0006H\u0002J\u0010\u0010G\u001a\u00020@2\u0006\u0010E\u001a\u00020FH\u0016J\u0010\u0010H\u001a\u00020@2\u0006\u0010E\u001a\u00020FH\u0016J\u0018\u0010I\u001a\u00020@2\u0006\u0010J\u001a\u00020K2\u0006\u0010E\u001a\u00020FH\u0016J\u0010\u0010L\u001a\u00020@2\u0006\u0010E\u001a\u00020FH\u0016J6\u0010M\u001a\u00020@2\u0016\u0010N\u001a\u0012\u0012\u0004\u0012\u00020\u000e0\rj\b\u0012\u0004\u0012\u00020\u000e`\u000f2\u0006\u0010E\u001a\u00020F2\f\u0010O\u001a\b\u0012\u0004\u0012\u00020@0PH\u0002R\u001c\u0010\u001b\u001a\u0004\u0018\u00010\u000bX\u000e¢\u0006\u000e\n\u0000\u001a\u0004\b\u001c\u0010\u001d\"\u0004\b\u001e\u0010\u001fR!\u0010\u0014\u001a\u0012\u0012\u0004\u0012\u00020\u00130\rj\b\u0012\u0004\u0012\u00020\u0013`\u000f¢\u0006\b\n\u0000\u001a\u0004\b \u0010!R!\u0010\u0015\u001a\u0012\u0012\u0004\u0012\u00020\u00130\rj\b\u0012\u0004\u0012\u00020\u0013`\u000f¢\u0006\b\n\u0000\u001a\u0004\b\"\u0010!R\u0013\u0010\u0005\u001a\u0004\u0018\u00010\u0006¢\u0006\b\n\u0000\u001a\u0004\b#\u0010$R\u001d\u0010\u0016\u001a\u000e\u0012\u0004\u0012\u00020\u0013\u0012\u0004\u0012\u00020\u000e0\u0012¢\u0006\b\n\u0000\u001a\u0004\b%\u0010&R\u0011\u0010\u0018\u001a\u00020\u0019¢\u0006\b\n\u0000\u001a\u0004\b\u0018\u0010'R\u0014\u0010(\u001a\u00020\u00198VX\u0004¢\u0006\u0006\u001a\u0004\b(\u0010'R\u0013\u0010\u0007\u001a\u0004\u0018\u00010\u0006¢\u0006\b\n\u0000\u001a\u0004\b)\u0010$R\u001d\u0010\u0017\u001a\u000e\u0012\u0004\u0012\u00020\u0013\u0012\u0004\u0012\u00020\u000e0\u0012¢\u0006\b\n\u0000\u001a\u0004\b*\u0010&R\u001a\u0010+\u001a\u00020\u0019X\u000e¢\u0006\u000e\n\u0000\u001a\u0004\b,\u0010'\"\u0004\b-\u0010.R!\u0010\f\u001a\u0012\u0012\u0004\u0012\u00020\u000e0\rj\b\u0012\u0004\u0012\u00020\u000e`\u000f¢\u0006\b\n\u0000\u001a\u0004\b/\u0010!R!\u0010\u0010\u001a\u0012\u0012\u0004\u0012\u00020\u000e0\rj\b\u0012\u0004\u0012\u00020\u000e`\u000f¢\u0006\b\n\u0000\u001a\u0004\b0\u0010!R\u001d\u0010\u0011\u001a\u000e\u0012\u0004\u0012\u00020\u0013\u0012\u0004\u0012\u00020\u00130\u0012¢\u0006\b\n\u0000\u001a\u0004\b1\u0010&R\u0013\u0010\n\u001a\u0004\u0018\u00010\u000b¢\u0006\b\n\u0000\u001a\u0004\b2\u0010\u001dR\u0011\u0010\b\u001a\u00020\t¢\u0006\b\n\u0000\u001a\u0004\b3\u00104R\u0017\u0010\u0002\u001a\b\u0012\u0004\u0012\u00020\u00040\u0003¢\u0006\b\n\u0000\u001a\u0004\b5\u00106R\u0017\u00107\u001a\u000208¢\u0006\u000e\n\u0000\u0012\u0004\b9\u0010:\u001a\u0004\b;\u0010<R\u0011\u0010=\u001a\u00020\u00198F¢\u0006\u0006\u001a\u0004\b>\u0010'¨\u0006Q"}, d2 = {"Landroidx/fragment/app/DefaultSpecialEffectsController$TransitionEffect;", "Landroidx/fragment/app/SpecialEffectsController$Effect;", "transitionInfos", "", "Landroidx/fragment/app/DefaultSpecialEffectsController$TransitionInfo;", "firstOut", "Landroidx/fragment/app/SpecialEffectsController$Operation;", "lastIn", "transitionImpl", "Landroidx/fragment/app/FragmentTransitionImpl;", "sharedElementTransition", "", "sharedElementFirstOutViews", "Ljava/util/ArrayList;", "Landroid/view/View;", "Lkotlin/collections/ArrayList;", "sharedElementLastInViews", "sharedElementNameMapping", "Landroidx/collection/ArrayMap;", "", "enteringNames", "exitingNames", "firstOutViews", "lastInViews", "isPop", "", "(Ljava/util/List;Landroidx/fragment/app/SpecialEffectsController$Operation;Landroidx/fragment/app/SpecialEffectsController$Operation;Landroidx/fragment/app/FragmentTransitionImpl;Ljava/lang/Object;Ljava/util/ArrayList;Ljava/util/ArrayList;Landroidx/collection/ArrayMap;Ljava/util/ArrayList;Ljava/util/ArrayList;Landroidx/collection/ArrayMap;Landroidx/collection/ArrayMap;Z)V", "controller", "getController", "()Ljava/lang/Object;", "setController", "(Ljava/lang/Object;)V", "getEnteringNames", "()Ljava/util/ArrayList;", "getExitingNames", "getFirstOut", "()Landroidx/fragment/app/SpecialEffectsController$Operation;", "getFirstOutViews", "()Landroidx/collection/ArrayMap;", "()Z", "isSeekingSupported", "getLastIn", "getLastInViews", "noControllerReturned", "getNoControllerReturned", "setNoControllerReturned", "(Z)V", "getSharedElementFirstOutViews", "getSharedElementLastInViews", "getSharedElementNameMapping", "getSharedElementTransition", "getTransitionImpl", "()Landroidx/fragment/app/FragmentTransitionImpl;", "getTransitionInfos", "()Ljava/util/List;", "transitionSignal", "Landroidx/core/os/CancellationSignal;", "getTransitionSignal$annotations", "()V", "getTransitionSignal", "()Landroidx/core/os/CancellationSignal;", "transitioning", "getTransitioning", "captureTransitioningViews", "", "transitioningViews", "view", "createMergedTransition", "Lkotlin/Pair;", "container", "Landroid/view/ViewGroup;", "onCancel", "onCommit", "onProgress", "backEvent", "Landroidx/activity/BackEventCompat;", "onStart", "runTransition", "enteringViews", "executeTransition", "Lkotlin/Function0;", "fragment_release"}, k = 1, mv = {1, 8, 0}, xi = 48)
    /* compiled from: DefaultSpecialEffectsController.kt */
    private static final class TransitionEffect extends SpecialEffectsController.Effect {
        private Object controller;
        private final ArrayList<String> enteringNames;
        private final ArrayList<String> exitingNames;
        private final SpecialEffectsController.Operation firstOut;
        private final ArrayMap<String, View> firstOutViews;
        private final boolean isPop;
        private final SpecialEffectsController.Operation lastIn;
        private final ArrayMap<String, View> lastInViews;
        private boolean noControllerReturned;
        private final ArrayList<View> sharedElementFirstOutViews;
        private final ArrayList<View> sharedElementLastInViews;
        private final ArrayMap<String, String> sharedElementNameMapping;
        private final Object sharedElementTransition;
        private final FragmentTransitionImpl transitionImpl;
        private final List<TransitionInfo> transitionInfos;
        private final CancellationSignal transitionSignal = new CancellationSignal();

        public static /* synthetic */ void getTransitionSignal$annotations() {
        }

        public final List<TransitionInfo> getTransitionInfos() {
            return this.transitionInfos;
        }

        public final SpecialEffectsController.Operation getFirstOut() {
            return this.firstOut;
        }

        public final SpecialEffectsController.Operation getLastIn() {
            return this.lastIn;
        }

        public final FragmentTransitionImpl getTransitionImpl() {
            return this.transitionImpl;
        }

        public final Object getSharedElementTransition() {
            return this.sharedElementTransition;
        }

        public final ArrayList<View> getSharedElementFirstOutViews() {
            return this.sharedElementFirstOutViews;
        }

        public final ArrayList<View> getSharedElementLastInViews() {
            return this.sharedElementLastInViews;
        }

        public final ArrayMap<String, String> getSharedElementNameMapping() {
            return this.sharedElementNameMapping;
        }

        public final ArrayList<String> getEnteringNames() {
            return this.enteringNames;
        }

        public final ArrayList<String> getExitingNames() {
            return this.exitingNames;
        }

        public final ArrayMap<String, View> getFirstOutViews() {
            return this.firstOutViews;
        }

        public final ArrayMap<String, View> getLastInViews() {
            return this.lastInViews;
        }

        public final boolean isPop() {
            return this.isPop;
        }

        public TransitionEffect(List<TransitionInfo> transitionInfos2, SpecialEffectsController.Operation firstOut2, SpecialEffectsController.Operation lastIn2, FragmentTransitionImpl transitionImpl2, Object sharedElementTransition2, ArrayList<View> sharedElementFirstOutViews2, ArrayList<View> sharedElementLastInViews2, ArrayMap<String, String> sharedElementNameMapping2, ArrayList<String> enteringNames2, ArrayList<String> exitingNames2, ArrayMap<String, View> firstOutViews2, ArrayMap<String, View> lastInViews2, boolean isPop2) {
            Intrinsics.checkNotNullParameter(transitionInfos2, "transitionInfos");
            Intrinsics.checkNotNullParameter(transitionImpl2, "transitionImpl");
            Intrinsics.checkNotNullParameter(sharedElementFirstOutViews2, "sharedElementFirstOutViews");
            Intrinsics.checkNotNullParameter(sharedElementLastInViews2, "sharedElementLastInViews");
            Intrinsics.checkNotNullParameter(sharedElementNameMapping2, "sharedElementNameMapping");
            Intrinsics.checkNotNullParameter(enteringNames2, "enteringNames");
            Intrinsics.checkNotNullParameter(exitingNames2, "exitingNames");
            Intrinsics.checkNotNullParameter(firstOutViews2, "firstOutViews");
            Intrinsics.checkNotNullParameter(lastInViews2, "lastInViews");
            this.transitionInfos = transitionInfos2;
            this.firstOut = firstOut2;
            this.lastIn = lastIn2;
            this.transitionImpl = transitionImpl2;
            this.sharedElementTransition = sharedElementTransition2;
            this.sharedElementFirstOutViews = sharedElementFirstOutViews2;
            this.sharedElementLastInViews = sharedElementLastInViews2;
            this.sharedElementNameMapping = sharedElementNameMapping2;
            this.enteringNames = enteringNames2;
            this.exitingNames = exitingNames2;
            this.firstOutViews = firstOutViews2;
            this.lastInViews = lastInViews2;
            this.isPop = isPop2;
        }

        public final CancellationSignal getTransitionSignal() {
            return this.transitionSignal;
        }

        public final Object getController() {
            return this.controller;
        }

        public final void setController(Object obj) {
            this.controller = obj;
        }

        public final boolean getNoControllerReturned() {
            return this.noControllerReturned;
        }

        public final void setNoControllerReturned(boolean z) {
            this.noControllerReturned = z;
        }

        public boolean isSeekingSupported() {
            Iterable $this$all$iv;
            boolean z;
            if (!this.transitionImpl.isSeekingSupported()) {
                return false;
            }
            Iterable $this$all$iv2 = this.transitionInfos;
            if (!($this$all$iv2 instanceof Collection) || !((Collection) $this$all$iv2).isEmpty()) {
                Iterator it = $this$all$iv2.iterator();
                while (true) {
                    if (!it.hasNext()) {
                        $this$all$iv = 1;
                        break;
                    }
                    TransitionInfo it2 = (TransitionInfo) it.next();
                    if (Build.VERSION.SDK_INT < 34 || it2.getTransition() == null || !this.transitionImpl.isSeekingSupported(it2.getTransition())) {
                        z = false;
                        continue;
                    } else {
                        z = true;
                        continue;
                    }
                    if (!z) {
                        $this$all$iv = null;
                        break;
                    }
                }
            } else {
                $this$all$iv = 1;
            }
            if ($this$all$iv == null) {
                return false;
            }
            if (this.sharedElementTransition == null || this.transitionImpl.isSeekingSupported(this.sharedElementTransition)) {
                return true;
            }
            return false;
        }

        public final boolean getTransitioning() {
            Iterable<TransitionInfo> $this$all$iv = this.transitionInfos;
            if (($this$all$iv instanceof Collection) && ((Collection) $this$all$iv).isEmpty()) {
                return true;
            }
            for (TransitionInfo it : $this$all$iv) {
                if (!it.getOperation().getFragment().mTransitioning) {
                    return false;
                }
            }
            return true;
        }

        public void onStart(ViewGroup container) {
            Intrinsics.checkNotNullParameter(container, "container");
            if (!container.isLaidOut()) {
                for (TransitionInfo transitionInfo : this.transitionInfos) {
                    SpecialEffectsController.Operation operation = transitionInfo.getOperation();
                    if (FragmentManager.isLoggingEnabled(2)) {
                        Log.v(FragmentManager.TAG, "SpecialEffectsController: Container " + container + " has not been laid out. Skipping onStart for operation " + operation);
                    }
                }
                return;
            }
            if (getTransitioning() && this.sharedElementTransition != null && !isSeekingSupported()) {
                Log.i(FragmentManager.TAG, "Ignoring shared elements transition " + this.sharedElementTransition + " between " + this.firstOut + " and " + this.lastIn + " as neither fragment has set a Transition. In order to run a SharedElementTransition, you must also set either an enter or exit transition on a fragment involved in the transaction. The sharedElementTransition will run after the back gesture has been committed.");
            }
            if (isSeekingSupported() && getTransitioning()) {
                Ref.ObjectRef seekCancelLambda = new Ref.ObjectRef();
                Pair<ArrayList<View>, Object> createMergedTransition = createMergedTransition(container, this.lastIn, this.firstOut);
                ArrayList enteringViews = createMergedTransition.component1();
                Object mergedTransition = createMergedTransition.component2();
                Iterable<TransitionInfo> $this$map$iv = this.transitionInfos;
                Collection destination$iv$iv = new ArrayList(CollectionsKt.collectionSizeOrDefault($this$map$iv, 10));
                for (TransitionInfo it : $this$map$iv) {
                    destination$iv$iv.add(it.getOperation());
                }
                for (SpecialEffectsController.Operation operation2 : (List) destination$iv$iv) {
                    this.transitionImpl.setListenerForTransitionEnd(operation2.getFragment(), mergedTransition, this.transitionSignal, new DefaultSpecialEffectsController$TransitionEffect$$ExternalSyntheticLambda3(seekCancelLambda), new DefaultSpecialEffectsController$TransitionEffect$$ExternalSyntheticLambda4(operation2, this));
                }
                runTransition(enteringViews, container, new DefaultSpecialEffectsController$TransitionEffect$onStart$4(this, container, mergedTransition, seekCancelLambda));
            }
        }

        /* access modifiers changed from: private */
        public static final void onStart$lambda$6$lambda$4(Ref.ObjectRef $seekCancelLambda) {
            Intrinsics.checkNotNullParameter($seekCancelLambda, "$seekCancelLambda");
            Function0 function0 = (Function0) $seekCancelLambda.element;
            if (function0 != null) {
                function0.invoke();
            }
        }

        /* access modifiers changed from: private */
        public static final void onStart$lambda$6$lambda$5(SpecialEffectsController.Operation $operation, TransitionEffect this$0) {
            Intrinsics.checkNotNullParameter($operation, "$operation");
            Intrinsics.checkNotNullParameter(this$0, "this$0");
            if (FragmentManager.isLoggingEnabled(2)) {
                Log.v(FragmentManager.TAG, "Transition for operation " + $operation + " has completed");
            }
            $operation.completeEffect(this$0);
        }

        public void onProgress(BackEventCompat backEvent, ViewGroup container) {
            Intrinsics.checkNotNullParameter(backEvent, "backEvent");
            Intrinsics.checkNotNullParameter(container, "container");
            Object it = this.controller;
            if (it != null) {
                this.transitionImpl.setCurrentPlayTime(it, backEvent.getProgress());
            }
        }

        public void onCommit(ViewGroup container) {
            int i;
            ViewGroup viewGroup = container;
            Intrinsics.checkNotNullParameter(viewGroup, "container");
            int i2 = 2;
            if (!viewGroup.isLaidOut()) {
                i = 2;
            } else if (this.noControllerReturned) {
                i = 2;
            } else if (this.controller != null) {
                FragmentTransitionImpl fragmentTransitionImpl = this.transitionImpl;
                Object obj = this.controller;
                Intrinsics.checkNotNull(obj);
                fragmentTransitionImpl.animateToEnd(obj);
                if (FragmentManager.isLoggingEnabled(2)) {
                    Log.v(FragmentManager.TAG, "Ending execution of operations from " + this.firstOut + " to " + this.lastIn);
                    return;
                }
                return;
            } else {
                Pair<ArrayList<View>, Object> createMergedTransition = createMergedTransition(viewGroup, this.lastIn, this.firstOut);
                ArrayList enteringViews = createMergedTransition.component1();
                Object mergedTransition = createMergedTransition.component2();
                Iterable<TransitionInfo> $this$map$iv = this.transitionInfos;
                Collection destination$iv$iv = new ArrayList(CollectionsKt.collectionSizeOrDefault($this$map$iv, 10));
                for (TransitionInfo it : $this$map$iv) {
                    destination$iv$iv.add(it.getOperation());
                }
                for (SpecialEffectsController.Operation operation : (List) destination$iv$iv) {
                    this.transitionImpl.setListenerForTransitionEnd(operation.getFragment(), mergedTransition, this.transitionSignal, new DefaultSpecialEffectsController$TransitionEffect$$ExternalSyntheticLambda5(operation, this));
                    i2 = i2;
                }
                int i3 = i2;
                runTransition(enteringViews, viewGroup, new DefaultSpecialEffectsController$TransitionEffect$onCommit$4(this, viewGroup, mergedTransition));
                if (FragmentManager.isLoggingEnabled(i3)) {
                    Log.v(FragmentManager.TAG, "Completed executing operations from " + this.firstOut + " to " + this.lastIn);
                    return;
                }
                return;
            }
            for (TransitionInfo transitionInfo : this.transitionInfos) {
                SpecialEffectsController.Operation operation2 = transitionInfo.getOperation();
                if (FragmentManager.isLoggingEnabled(i)) {
                    if (this.noControllerReturned) {
                        Log.v(FragmentManager.TAG, "SpecialEffectsController: TransitionSeekController was not created. Completing operation " + operation2);
                    } else {
                        Log.v(FragmentManager.TAG, "SpecialEffectsController: Container " + viewGroup + " has not been laid out. Completing operation " + operation2);
                    }
                }
                transitionInfo.getOperation().completeEffect(this);
            }
            this.noControllerReturned = false;
        }

        /* access modifiers changed from: private */
        public static final void onCommit$lambda$11$lambda$10(SpecialEffectsController.Operation $operation, TransitionEffect this$0) {
            Intrinsics.checkNotNullParameter($operation, "$operation");
            Intrinsics.checkNotNullParameter(this$0, "this$0");
            if (FragmentManager.isLoggingEnabled(2)) {
                Log.v(FragmentManager.TAG, "Transition for operation " + $operation + " has completed");
            }
            $operation.completeEffect(this$0);
        }

        private final Pair<ArrayList<View>, Object> createMergedTransition(ViewGroup container, SpecialEffectsController.Operation lastIn2, SpecialEffectsController.Operation firstOut2) {
            ArrayList transitioningViews;
            ViewGroup viewGroup = container;
            SpecialEffectsController.Operation operation = lastIn2;
            SpecialEffectsController.Operation operation2 = firstOut2;
            View nonExistentView = new View(viewGroup.getContext());
            View firstOutEpicenterView = null;
            boolean hasLastInEpicenter = false;
            Rect lastInEpicenterRect = new Rect();
            for (TransitionInfo transitionInfo : this.transitionInfos) {
                if (!(!transitionInfo.hasSharedElementTransition() || operation2 == null || operation == null || this.sharedElementNameMapping.isEmpty() || this.sharedElementTransition == null)) {
                    FragmentTransition.callSharedElementStartEnd(operation.getFragment(), operation2.getFragment(), this.isPop, this.firstOutViews, true);
                    OneShotPreDrawListener.add(viewGroup, new DefaultSpecialEffectsController$TransitionEffect$$ExternalSyntheticLambda0(operation, operation2, this));
                    this.sharedElementFirstOutViews.addAll(this.firstOutViews.values());
                    if (!this.exitingNames.isEmpty()) {
                        String epicenterViewName = this.exitingNames.get(0);
                        Intrinsics.checkNotNullExpressionValue(epicenterViewName, "exitingNames[0]");
                        firstOutEpicenterView = this.firstOutViews.get(epicenterViewName);
                        this.transitionImpl.setEpicenter(this.sharedElementTransition, firstOutEpicenterView);
                    }
                    this.sharedElementLastInViews.addAll(this.lastInViews.values());
                    if (!this.enteringNames.isEmpty()) {
                        String epicenterViewName2 = this.enteringNames.get(0);
                        Intrinsics.checkNotNullExpressionValue(epicenterViewName2, "enteringNames[0]");
                        View lastInEpicenterView = this.lastInViews.get(epicenterViewName2);
                        if (lastInEpicenterView != null) {
                            hasLastInEpicenter = true;
                            OneShotPreDrawListener.add(viewGroup, new DefaultSpecialEffectsController$TransitionEffect$$ExternalSyntheticLambda1(this.transitionImpl, lastInEpicenterView, lastInEpicenterRect));
                        }
                    }
                    this.transitionImpl.setSharedElementTargets(this.sharedElementTransition, nonExistentView, this.sharedElementFirstOutViews);
                    this.transitionImpl.scheduleRemoveTargets(this.sharedElementTransition, (Object) null, (ArrayList<View>) null, (Object) null, (ArrayList<View>) null, this.sharedElementTransition, this.sharedElementLastInViews);
                }
            }
            ArrayList enteringViews = new ArrayList();
            Object mergedTransition = null;
            Object mergedNonOverlappingTransition = null;
            Iterator<TransitionInfo> it = this.transitionInfos.iterator();
            while (it.hasNext()) {
                TransitionInfo transitionInfo2 = it.next();
                SpecialEffectsController.Operation operation3 = transitionInfo2.getOperation();
                boolean hasLastInEpicenter2 = hasLastInEpicenter;
                Object transition = this.transitionImpl.cloneTransition(transitionInfo2.getTransition());
                if (transition != null) {
                    ArrayList transitioningViews2 = new ArrayList();
                    Iterator<TransitionInfo> it2 = it;
                    View view = operation3.getFragment().mView;
                    TransitionInfo transitionInfo3 = transitionInfo2;
                    Intrinsics.checkNotNullExpressionValue(view, "operation.fragment.mView");
                    captureTransitioningViews(transitioningViews2, view);
                    if (this.sharedElementTransition != null && (operation3 == operation2 || operation3 == operation)) {
                        if (operation3 == operation2) {
                            transitioningViews2.removeAll(CollectionsKt.toSet(this.sharedElementFirstOutViews));
                        } else {
                            transitioningViews2.removeAll(CollectionsKt.toSet(this.sharedElementLastInViews));
                        }
                    }
                    if (transitioningViews2.isEmpty()) {
                        this.transitionImpl.addTarget(transition, nonExistentView);
                        transitioningViews = transitioningViews2;
                    } else {
                        this.transitionImpl.addTargets(transition, transitioningViews2);
                        ArrayList transitioningViews3 = transitioningViews2;
                        this.transitionImpl.scheduleRemoveTargets(transition, transition, transitioningViews3, (Object) null, (ArrayList<View>) null, (Object) null, (ArrayList<View>) null);
                        transitioningViews = transitioningViews3;
                        if (operation3.getFinalState() == SpecialEffectsController.Operation.State.GONE) {
                            operation3.setAwaitingContainerChanges(false);
                            ArrayList transitioningViewsToHide = new ArrayList(transitioningViews);
                            transitioningViewsToHide.remove(operation3.getFragment().mView);
                            this.transitionImpl.scheduleHideFragmentView(transition, operation3.getFragment().mView, transitioningViewsToHide);
                            OneShotPreDrawListener.add(viewGroup, new DefaultSpecialEffectsController$TransitionEffect$$ExternalSyntheticLambda2(transitioningViews));
                        }
                    }
                    View nonExistentView2 = nonExistentView;
                    if (operation3.getFinalState() == SpecialEffectsController.Operation.State.VISIBLE) {
                        enteringViews.addAll(transitioningViews);
                        if (hasLastInEpicenter2) {
                            this.transitionImpl.setEpicenter(transition, lastInEpicenterRect);
                        }
                        if (FragmentManager.isLoggingEnabled(2)) {
                            Log.v(FragmentManager.TAG, "Entering Transition: " + transition);
                            Log.v(FragmentManager.TAG, ">>>>> EnteringViews <<<<<");
                            for (Iterator it3 = transitioningViews.iterator(); it3.hasNext(); it3 = it3) {
                                Object next = it3.next();
                                Intrinsics.checkNotNullExpressionValue(next, "transitioningViews");
                                Log.v(FragmentManager.TAG, "View: " + ((View) next));
                            }
                        }
                    } else {
                        this.transitionImpl.setEpicenter(transition, firstOutEpicenterView);
                        if (FragmentManager.isLoggingEnabled(2)) {
                            Log.v(FragmentManager.TAG, "Exiting Transition: " + transition);
                            Log.v(FragmentManager.TAG, ">>>>> ExitingViews <<<<<");
                            for (Iterator it4 = transitioningViews.iterator(); it4.hasNext(); it4 = it4) {
                                Object next2 = it4.next();
                                Intrinsics.checkNotNullExpressionValue(next2, "transitioningViews");
                                Log.v(FragmentManager.TAG, "View: " + ((View) next2));
                            }
                        }
                    }
                    if (transitionInfo3.isOverlapAllowed()) {
                        mergedTransition = this.transitionImpl.mergeTransitionsTogether(mergedTransition, transition, (Object) null);
                        operation = lastIn2;
                        operation2 = firstOut2;
                        hasLastInEpicenter = hasLastInEpicenter2;
                        nonExistentView = nonExistentView2;
                        it = it2;
                    } else {
                        mergedNonOverlappingTransition = this.transitionImpl.mergeTransitionsTogether(mergedNonOverlappingTransition, transition, (Object) null);
                        operation = lastIn2;
                        operation2 = firstOut2;
                        hasLastInEpicenter = hasLastInEpicenter2;
                        nonExistentView = nonExistentView2;
                        it = it2;
                    }
                } else {
                    Iterator<TransitionInfo> it5 = it;
                    TransitionInfo transitionInfo4 = transitionInfo2;
                    operation = lastIn2;
                    operation2 = firstOut2;
                    hasLastInEpicenter = hasLastInEpicenter2;
                }
            }
            boolean z = hasLastInEpicenter;
            Object mergedTransition2 = this.transitionImpl.mergeTransitionsInSequence(mergedTransition, mergedNonOverlappingTransition, this.sharedElementTransition);
            if (FragmentManager.isLoggingEnabled(2)) {
                Log.v(FragmentManager.TAG, "Final merged transition: " + mergedTransition2 + " for container " + viewGroup);
            }
            return new Pair<>(enteringViews, mergedTransition2);
        }

        /* access modifiers changed from: private */
        public static final void createMergedTransition$lambda$12(SpecialEffectsController.Operation $lastIn, SpecialEffectsController.Operation $firstOut, TransitionEffect this$0) {
            Intrinsics.checkNotNullParameter(this$0, "this$0");
            FragmentTransition.callSharedElementStartEnd($lastIn.getFragment(), $firstOut.getFragment(), this$0.isPop, this$0.lastInViews, false);
        }

        /* access modifiers changed from: private */
        public static final void createMergedTransition$lambda$13(FragmentTransitionImpl $impl, View $lastInEpicenterView, Rect $lastInEpicenterRect) {
            Intrinsics.checkNotNullParameter($impl, "$impl");
            Intrinsics.checkNotNullParameter($lastInEpicenterRect, "$lastInEpicenterRect");
            $impl.getBoundsOnScreen($lastInEpicenterView, $lastInEpicenterRect);
        }

        /* access modifiers changed from: private */
        public static final void createMergedTransition$lambda$14(ArrayList $transitioningViews) {
            Intrinsics.checkNotNullParameter($transitioningViews, "$transitioningViews");
            FragmentTransition.setViewVisibility($transitioningViews, 4);
        }

        private final void runTransition(ArrayList<View> enteringViews, ViewGroup container, Function0<Unit> executeTransition) {
            FragmentTransition.setViewVisibility(enteringViews, 4);
            ArrayList inNames = this.transitionImpl.prepareSetNameOverridesReordered(this.sharedElementLastInViews);
            if (FragmentManager.isLoggingEnabled(2)) {
                Log.v(FragmentManager.TAG, ">>>>> Beginning transition <<<<<");
                Log.v(FragmentManager.TAG, ">>>>> SharedElementFirstOutViews <<<<<");
                Iterator<View> it = this.sharedElementFirstOutViews.iterator();
                while (it.hasNext()) {
                    View next = it.next();
                    Intrinsics.checkNotNullExpressionValue(next, "sharedElementFirstOutViews");
                    View view = next;
                    Log.v(FragmentManager.TAG, "View: " + view + " Name: " + ViewCompat.getTransitionName(view));
                }
                Log.v(FragmentManager.TAG, ">>>>> SharedElementLastInViews <<<<<");
                Iterator<View> it2 = this.sharedElementLastInViews.iterator();
                while (it2.hasNext()) {
                    View next2 = it2.next();
                    Intrinsics.checkNotNullExpressionValue(next2, "sharedElementLastInViews");
                    View view2 = next2;
                    Log.v(FragmentManager.TAG, "View: " + view2 + " Name: " + ViewCompat.getTransitionName(view2));
                }
            }
            executeTransition.invoke();
            this.transitionImpl.setNameOverridesReordered(container, this.sharedElementFirstOutViews, this.sharedElementLastInViews, inNames, this.sharedElementNameMapping);
            FragmentTransition.setViewVisibility(enteringViews, 0);
            this.transitionImpl.swapSharedElementTargets(this.sharedElementTransition, this.sharedElementFirstOutViews, this.sharedElementLastInViews);
        }

        public void onCancel(ViewGroup container) {
            Intrinsics.checkNotNullParameter(container, "container");
            this.transitionSignal.cancel();
        }

        private final void captureTransitioningViews(ArrayList<View> transitioningViews, View view) {
            if (view instanceof ViewGroup) {
                if (!ViewGroupCompat.isTransitionGroup((ViewGroup) view)) {
                    int count = ((ViewGroup) view).getChildCount();
                    for (int i = 0; i < count; i++) {
                        View child = ((ViewGroup) view).getChildAt(i);
                        if (child.getVisibility() == 0) {
                            Intrinsics.checkNotNullExpressionValue(child, "child");
                            captureTransitioningViews(transitioningViews, child);
                        }
                    }
                } else if (!transitioningViews.contains(view)) {
                    transitioningViews.add(view);
                }
            } else if (transitioningViews.contains(view) == 0) {
                transitioningViews.add(view);
            }
        }
    }

    @Metadata(d1 = {"\u0000\u0018\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\t\n\u0000\n\u0002\u0018\u0002\n\u0000\bÁ\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002¢\u0006\u0002\u0010\u0002J\u0010\u0010\u0003\u001a\u00020\u00042\u0006\u0010\u0005\u001a\u00020\u0006H\u0007¨\u0006\u0007"}, d2 = {"Landroidx/fragment/app/DefaultSpecialEffectsController$Api24Impl;", "", "()V", "totalDuration", "", "animatorSet", "Landroid/animation/AnimatorSet;", "fragment_release"}, k = 1, mv = {1, 8, 0}, xi = 48)
    /* compiled from: DefaultSpecialEffectsController.kt */
    public static final class Api24Impl {
        public static final Api24Impl INSTANCE = new Api24Impl();

        private Api24Impl() {
        }

        public final long totalDuration(AnimatorSet animatorSet) {
            Intrinsics.checkNotNullParameter(animatorSet, "animatorSet");
            return animatorSet.getTotalDuration();
        }
    }

    @Metadata(d1 = {"\u0000 \n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\t\n\u0000\bÁ\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002¢\u0006\u0002\u0010\u0002J\u0010\u0010\u0003\u001a\u00020\u00042\u0006\u0010\u0005\u001a\u00020\u0006H\u0007J\u0018\u0010\u0007\u001a\u00020\u00042\u0006\u0010\u0005\u001a\u00020\u00062\u0006\u0010\b\u001a\u00020\tH\u0007¨\u0006\n"}, d2 = {"Landroidx/fragment/app/DefaultSpecialEffectsController$Api26Impl;", "", "()V", "reverse", "", "animatorSet", "Landroid/animation/AnimatorSet;", "setCurrentPlayTime", "time", "", "fragment_release"}, k = 1, mv = {1, 8, 0}, xi = 48)
    /* compiled from: DefaultSpecialEffectsController.kt */
    public static final class Api26Impl {
        public static final Api26Impl INSTANCE = new Api26Impl();

        private Api26Impl() {
        }

        public final void reverse(AnimatorSet animatorSet) {
            Intrinsics.checkNotNullParameter(animatorSet, "animatorSet");
            animatorSet.reverse();
        }

        public final void setCurrentPlayTime(AnimatorSet animatorSet, long time) {
            Intrinsics.checkNotNullParameter(animatorSet, "animatorSet");
            animatorSet.setCurrentPlayTime(time);
        }
    }
}
