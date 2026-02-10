package androidx.coordinatorlayout.widget;

import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Region;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.os.Parcel;
import android.os.Parcelable;
import android.os.SystemClock;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.util.Log;
import android.util.SparseArray;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.view.ViewTreeObserver;
import androidx.coordinatorlayout.R;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.drawable.DrawableCompat;
import androidx.core.util.ObjectsCompat;
import androidx.core.util.Pools;
import androidx.core.view.GravityCompat;
import androidx.core.view.NestedScrollingParent2;
import androidx.core.view.NestedScrollingParent3;
import androidx.core.view.NestedScrollingParentHelper;
import androidx.core.view.OnApplyWindowInsetsListener;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.customview.view.AbsSavedState;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CoordinatorLayout extends ViewGroup implements NestedScrollingParent2, NestedScrollingParent3 {
    static final Class<?>[] CONSTRUCTOR_PARAMS = {Context.class, AttributeSet.class};
    static final int EVENT_NESTED_SCROLL = 1;
    static final int EVENT_PRE_DRAW = 0;
    static final int EVENT_VIEW_REMOVED = 2;
    private static final float KEY_SCROLL_FRACTION_AMOUNT = 0.2f;
    static final String TAG = "CoordinatorLayout";
    static final Comparator<View> TOP_SORTED_CHILDREN_COMPARATOR = new ViewElevationComparator();
    private static final int TYPE_ON_INTERCEPT = 0;
    private static final int TYPE_ON_TOUCH = 1;
    static final String WIDGET_PACKAGE_NAME;
    static final ThreadLocal<Map<String, Constructor<Behavior>>> sConstructors = new ThreadLocal<>();
    private static final Pools.Pool<Rect> sRectPool = new Pools.SynchronizedPool(12);
    private OnApplyWindowInsetsListener mApplyWindowInsetsListener;
    private final int[] mBehaviorConsumed;
    private View mBehaviorTouchView;
    private final DirectedAcyclicGraph<View> mChildDag;
    private final List<View> mDependencySortedChildren;
    private boolean mDisallowInterceptReset;
    private boolean mDrawStatusBarBackground;
    private boolean mIsAttachedToWindow;
    private final int[] mKeyTriggeredScrollConsumed;
    private int[] mKeylines;
    private WindowInsetsCompat mLastInsets;
    private boolean mNeedsPreDrawListener;
    private final NestedScrollingParentHelper mNestedScrollingParentHelper;
    private View mNestedScrollingTarget;
    private final int[] mNestedScrollingV2ConsumedCompat;
    ViewGroup.OnHierarchyChangeListener mOnHierarchyChangeListener;
    private OnPreDrawListener mOnPreDrawListener;
    private Paint mScrimPaint;
    private Drawable mStatusBarBackground;
    private final List<View> mTempList1;

    public interface AttachedBehavior {
        Behavior getBehavior();
    }

    @Deprecated
    @Retention(RetentionPolicy.RUNTIME)
    public @interface DefaultBehavior {
        Class<? extends Behavior> value();
    }

    @Retention(RetentionPolicy.SOURCE)
    public @interface DispatchChangeEvent {
    }

    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r0v4, resolved type: java.lang.Class<?>[]} */
    /* JADX WARNING: Multi-variable type inference failed */
    static {
        /*
            java.lang.Class<androidx.coordinatorlayout.widget.CoordinatorLayout> r0 = androidx.coordinatorlayout.widget.CoordinatorLayout.class
            java.lang.Package r0 = r0.getPackage()
            if (r0 == 0) goto L_0x000d
            java.lang.String r1 = r0.getName()
            goto L_0x000e
        L_0x000d:
            r1 = 0
        L_0x000e:
            WIDGET_PACKAGE_NAME = r1
            androidx.coordinatorlayout.widget.CoordinatorLayout$ViewElevationComparator r0 = new androidx.coordinatorlayout.widget.CoordinatorLayout$ViewElevationComparator
            r0.<init>()
            TOP_SORTED_CHILDREN_COMPARATOR = r0
            r0 = 2
            java.lang.Class[] r0 = new java.lang.Class[r0]
            r1 = 0
            java.lang.Class<android.content.Context> r2 = android.content.Context.class
            r0[r1] = r2
            r1 = 1
            java.lang.Class<android.util.AttributeSet> r2 = android.util.AttributeSet.class
            r0[r1] = r2
            CONSTRUCTOR_PARAMS = r0
            java.lang.ThreadLocal r0 = new java.lang.ThreadLocal
            r0.<init>()
            sConstructors = r0
            androidx.core.util.Pools$SynchronizedPool r0 = new androidx.core.util.Pools$SynchronizedPool
            r1 = 12
            r0.<init>(r1)
            sRectPool = r0
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.coordinatorlayout.widget.CoordinatorLayout.<clinit>():void");
    }

    private static Rect acquireTempRect() {
        Rect rect = sRectPool.acquire();
        if (rect == null) {
            return new Rect();
        }
        return rect;
    }

    private static void releaseTempRect(Rect rect) {
        rect.setEmpty();
        sRectPool.release(rect);
    }

    public CoordinatorLayout(Context context) {
        this(context, (AttributeSet) null);
    }

    public CoordinatorLayout(Context context, AttributeSet attrs) {
        this(context, attrs, R.attr.coordinatorLayoutStyle);
    }

    public CoordinatorLayout(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        TypedArray typedArray;
        Context context2;
        CoordinatorLayout coordinatorLayout;
        this.mDependencySortedChildren = new ArrayList();
        this.mChildDag = new DirectedAcyclicGraph<>();
        this.mTempList1 = new ArrayList();
        this.mBehaviorConsumed = new int[2];
        this.mNestedScrollingV2ConsumedCompat = new int[2];
        this.mKeyTriggeredScrollConsumed = new int[2];
        this.mNestedScrollingParentHelper = new NestedScrollingParentHelper(this);
        if (defStyleAttr == 0) {
            typedArray = context.obtainStyledAttributes(attrs, R.styleable.CoordinatorLayout, 0, R.style.Widget_Support_CoordinatorLayout);
        } else {
            typedArray = context.obtainStyledAttributes(attrs, R.styleable.CoordinatorLayout, defStyleAttr, 0);
        }
        TypedArray a = typedArray;
        if (defStyleAttr == 0) {
            coordinatorLayout = this;
            context2 = context;
            ViewCompat.saveAttributeDataForStyleable(coordinatorLayout, context2, R.styleable.CoordinatorLayout, attrs, a, 0, R.style.Widget_Support_CoordinatorLayout);
            int i = defStyleAttr;
        } else {
            context2 = context;
            coordinatorLayout = this;
            ViewCompat.saveAttributeDataForStyleable(coordinatorLayout, context2, R.styleable.CoordinatorLayout, attrs, a, defStyleAttr, 0);
        }
        int keylineArrayRes = a.getResourceId(R.styleable.CoordinatorLayout_keylines, 0);
        if (keylineArrayRes != 0) {
            Resources res = context2.getResources();
            coordinatorLayout.mKeylines = res.getIntArray(keylineArrayRes);
            float density = res.getDisplayMetrics().density;
            int count = coordinatorLayout.mKeylines.length;
            for (int i2 = 0; i2 < count; i2++) {
                coordinatorLayout.mKeylines[i2] = (int) (((float) coordinatorLayout.mKeylines[i2]) * density);
            }
        }
        coordinatorLayout.mStatusBarBackground = a.getDrawable(R.styleable.CoordinatorLayout_statusBarBackground);
        a.recycle();
        setupForInsets();
        super.setOnHierarchyChangeListener(new HierarchyChangeListener());
        if (getImportantForAccessibility() == 0) {
            setImportantForAccessibility(1);
        }
    }

    public void setOnHierarchyChangeListener(ViewGroup.OnHierarchyChangeListener onHierarchyChangeListener) {
        this.mOnHierarchyChangeListener = onHierarchyChangeListener;
    }

    public void onAttachedToWindow() {
        super.onAttachedToWindow();
        resetTouchBehaviors();
        if (this.mNeedsPreDrawListener) {
            if (this.mOnPreDrawListener == null) {
                this.mOnPreDrawListener = new OnPreDrawListener();
            }
            getViewTreeObserver().addOnPreDrawListener(this.mOnPreDrawListener);
        }
        if (this.mLastInsets == null && ViewCompat.getFitsSystemWindows(this)) {
            ViewCompat.requestApplyInsets(this);
        }
        this.mIsAttachedToWindow = true;
    }

    public void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        resetTouchBehaviors();
        if (this.mNeedsPreDrawListener && this.mOnPreDrawListener != null) {
            getViewTreeObserver().removeOnPreDrawListener(this.mOnPreDrawListener);
        }
        if (this.mNestedScrollingTarget != null) {
            onStopNestedScroll(this.mNestedScrollingTarget);
        }
        this.mIsAttachedToWindow = false;
    }

    public void setStatusBarBackground(Drawable bg) {
        if (this.mStatusBarBackground != bg) {
            Drawable drawable = null;
            if (this.mStatusBarBackground != null) {
                this.mStatusBarBackground.setCallback((Drawable.Callback) null);
            }
            if (bg != null) {
                drawable = bg.mutate();
            }
            this.mStatusBarBackground = drawable;
            if (this.mStatusBarBackground != null) {
                if (this.mStatusBarBackground.isStateful()) {
                    this.mStatusBarBackground.setState(getDrawableState());
                }
                DrawableCompat.setLayoutDirection(this.mStatusBarBackground, getLayoutDirection());
                this.mStatusBarBackground.setVisible(getVisibility() == 0, false);
                this.mStatusBarBackground.setCallback(this);
            }
            postInvalidateOnAnimation();
        }
    }

    public Drawable getStatusBarBackground() {
        return this.mStatusBarBackground;
    }

    /* access modifiers changed from: protected */
    public void drawableStateChanged() {
        super.drawableStateChanged();
        int[] state = getDrawableState();
        boolean changed = false;
        Drawable d = this.mStatusBarBackground;
        if (d != null && d.isStateful()) {
            changed = false | d.setState(state);
        }
        if (changed) {
            invalidate();
        }
    }

    /* access modifiers changed from: protected */
    public boolean verifyDrawable(Drawable who) {
        return super.verifyDrawable(who) || who == this.mStatusBarBackground;
    }

    public void setVisibility(int visibility) {
        super.setVisibility(visibility);
        boolean visible = visibility == 0;
        if (this.mStatusBarBackground != null && this.mStatusBarBackground.isVisible() != visible) {
            this.mStatusBarBackground.setVisible(visible, false);
        }
    }

    public void setStatusBarBackgroundResource(int resId) {
        setStatusBarBackground(resId != 0 ? ContextCompat.getDrawable(getContext(), resId) : null);
    }

    public void setStatusBarBackgroundColor(int color) {
        setStatusBarBackground(new ColorDrawable(color));
    }

    /* access modifiers changed from: package-private */
    public final WindowInsetsCompat setWindowInsets(WindowInsetsCompat insets) {
        if (ObjectsCompat.equals(this.mLastInsets, insets)) {
            return insets;
        }
        this.mLastInsets = insets;
        boolean z = true;
        this.mDrawStatusBarBackground = insets != null && insets.getSystemWindowInsetTop() > 0;
        if (this.mDrawStatusBarBackground || getBackground() != null) {
            z = false;
        }
        setWillNotDraw(z);
        WindowInsetsCompat insets2 = dispatchApplyWindowInsetsToBehaviors(insets);
        requestLayout();
        return insets2;
    }

    public final WindowInsetsCompat getLastWindowInsets() {
        return this.mLastInsets;
    }

    private void cancelInterceptBehaviors() {
        MotionEvent cancelEvent = null;
        int childCount = getChildCount();
        for (int i = 0; i < childCount; i++) {
            View child = getChildAt(i);
            Behavior b = ((LayoutParams) child.getLayoutParams()).getBehavior();
            if (b != null) {
                if (cancelEvent == null) {
                    long now = SystemClock.uptimeMillis();
                    cancelEvent = MotionEvent.obtain(now, now, 3, 0.0f, 0.0f, 0);
                }
                b.onInterceptTouchEvent(this, child, cancelEvent);
            }
        }
        if (cancelEvent != null) {
            cancelEvent.recycle();
        }
    }

    private void resetTouchBehaviors() {
        if (this.mBehaviorTouchView != null) {
            Behavior b = ((LayoutParams) this.mBehaviorTouchView.getLayoutParams()).getBehavior();
            if (b != null) {
                long now = SystemClock.uptimeMillis();
                MotionEvent cancelEvent = MotionEvent.obtain(now, now, 3, 0.0f, 0.0f, 0);
                b.onTouchEvent(this, this.mBehaviorTouchView, cancelEvent);
                cancelEvent.recycle();
            }
            this.mBehaviorTouchView = null;
        }
        int childCount = getChildCount();
        for (int i = 0; i < childCount; i++) {
            ((LayoutParams) getChildAt(i).getLayoutParams()).resetTouchBehaviorTracking();
        }
        this.mDisallowInterceptReset = false;
    }

    private void getTopSortedChildren(List<View> out) {
        out.clear();
        boolean useCustomOrder = isChildrenDrawingOrderEnabled();
        int childCount = getChildCount();
        for (int i = childCount - 1; i >= 0; i--) {
            out.add(getChildAt(useCustomOrder ? getChildDrawingOrder(childCount, i) : i));
        }
        if (TOP_SORTED_CHILDREN_COMPARATOR != null) {
            Collections.sort(out, TOP_SORTED_CHILDREN_COMPARATOR);
        }
    }

    private boolean performIntercept(MotionEvent ev, int type) {
        int i = type;
        boolean intercepted = false;
        boolean newBlock = false;
        int action = ev.getActionMasked();
        MotionEvent cancelEvent = null;
        List<View> topmostChildList = this.mTempList1;
        getTopSortedChildren(topmostChildList);
        int childCount = topmostChildList.size();
        int i2 = 0;
        while (true) {
            if (i2 >= childCount) {
                MotionEvent motionEvent = ev;
                break;
            }
            View child = topmostChildList.get(i2);
            LayoutParams lp = (LayoutParams) child.getLayoutParams();
            Behavior b = lp.getBehavior();
            if ((!intercepted && !newBlock) || action == 0) {
                if (newBlock || intercepted || b == null) {
                    MotionEvent motionEvent2 = ev;
                } else {
                    intercepted = performEvent(b, child, ev, i);
                    if (intercepted) {
                        this.mBehaviorTouchView = child;
                        if (!(action == 3 || action == 1)) {
                            for (int j = 0; j < i2; j++) {
                                View priorChild = topmostChildList.get(j);
                                Behavior priorBehavior = ((LayoutParams) priorChild.getLayoutParams()).getBehavior();
                                if (priorBehavior != null) {
                                    if (cancelEvent == null) {
                                        cancelEvent = obtainCancelEvent(ev);
                                    }
                                    performEvent(priorBehavior, priorChild, cancelEvent, i);
                                }
                            }
                        }
                    }
                }
                boolean wasBlocking = lp.didBlockInteraction();
                boolean isBlocking = lp.isBlockingInteractionBelow(this, child);
                newBlock = isBlocking && !wasBlocking;
                if (isBlocking && !newBlock) {
                    break;
                }
            } else if (b != null) {
                if (cancelEvent == null) {
                    cancelEvent = obtainCancelEvent(ev);
                }
                performEvent(b, child, cancelEvent, i);
                MotionEvent motionEvent3 = ev;
            } else {
                MotionEvent motionEvent4 = ev;
            }
            i2++;
        }
        topmostChildList.clear();
        if (cancelEvent != null) {
            cancelEvent.recycle();
        }
        return intercepted;
    }

    private boolean performEvent(Behavior behavior, View child, MotionEvent ev, int type) {
        switch (type) {
            case 0:
                return behavior.onInterceptTouchEvent(this, child, ev);
            case 1:
                return behavior.onTouchEvent(this, child, ev);
            default:
                throw new IllegalArgumentException();
        }
    }

    private MotionEvent obtainCancelEvent(MotionEvent other) {
        MotionEvent event = MotionEvent.obtain(other);
        event.setAction(3);
        return event;
    }

    public boolean onInterceptTouchEvent(MotionEvent ev) {
        int action = ev.getActionMasked();
        if (action == 0) {
            resetTouchBehaviors();
        }
        boolean intercepted = performIntercept(ev, 0);
        if (action == 1 || action == 3) {
            this.mBehaviorTouchView = null;
            resetTouchBehaviors();
        }
        return intercepted;
    }

    public boolean onTouchEvent(MotionEvent ev) {
        boolean handled = false;
        boolean cancelSuper = false;
        int action = ev.getActionMasked();
        if (this.mBehaviorTouchView != null) {
            Behavior b = ((LayoutParams) this.mBehaviorTouchView.getLayoutParams()).getBehavior();
            if (b != null) {
                handled = b.onTouchEvent(this, this.mBehaviorTouchView, ev);
            }
        } else {
            handled = performIntercept(ev, 1);
            cancelSuper = action != 0 && handled;
        }
        if (this.mBehaviorTouchView == null || action == 3) {
            handled |= super.onTouchEvent(ev);
        } else if (cancelSuper) {
            MotionEvent cancelEvent = obtainCancelEvent(ev);
            super.onTouchEvent(cancelEvent);
            cancelEvent.recycle();
        }
        if (action == 1 || action == 3) {
            this.mBehaviorTouchView = null;
            resetTouchBehaviors();
        }
        return handled;
    }

    public void requestDisallowInterceptTouchEvent(boolean disallowIntercept) {
        super.requestDisallowInterceptTouchEvent(disallowIntercept);
        if (disallowIntercept && !this.mDisallowInterceptReset) {
            if (this.mBehaviorTouchView == null) {
                cancelInterceptBehaviors();
            }
            resetTouchBehaviors();
            this.mDisallowInterceptReset = true;
        }
    }

    private int getKeyline(int index) {
        if (this.mKeylines == null) {
            Log.e(TAG, "No keylines defined for " + this + " - attempted index lookup " + index);
            return 0;
        } else if (index >= 0 && index < this.mKeylines.length) {
            return this.mKeylines[index];
        } else {
            Log.e(TAG, "Keyline index " + index + " out of range for " + this);
            return 0;
        }
    }

    static Behavior parseBehavior(Context context, AttributeSet attrs, String name) {
        String fullName;
        if (TextUtils.isEmpty(name)) {
            return null;
        }
        if (name.startsWith(".")) {
            fullName = context.getPackageName() + name;
        } else if (name.indexOf(46) >= 0) {
            fullName = name;
        } else if (!TextUtils.isEmpty(WIDGET_PACKAGE_NAME)) {
            fullName = WIDGET_PACKAGE_NAME + '.' + name;
        } else {
            fullName = name;
        }
        try {
            Map<String, Constructor<Behavior>> constructors = sConstructors.get();
            if (constructors == null) {
                constructors = new HashMap<>();
                sConstructors.set(constructors);
            }
            Constructor<?> constructor = constructors.get(fullName);
            if (constructor == null) {
                constructor = Class.forName(fullName, false, context.getClassLoader()).getConstructor(CONSTRUCTOR_PARAMS);
                constructor.setAccessible(true);
                constructors.put(fullName, constructor);
            }
            return (Behavior) constructor.newInstance(new Object[]{context, attrs});
        } catch (Exception e) {
            throw new RuntimeException("Could not inflate Behavior subclass " + fullName, e);
        }
    }

    /* access modifiers changed from: package-private */
    public LayoutParams getResolvedLayoutParams(View child) {
        LayoutParams result = (LayoutParams) child.getLayoutParams();
        if (!result.mBehaviorResolved) {
            if (child instanceof AttachedBehavior) {
                Behavior attachedBehavior = ((AttachedBehavior) child).getBehavior();
                if (attachedBehavior == null) {
                    Log.e(TAG, "Attached behavior class is null");
                }
                result.setBehavior(attachedBehavior);
                result.mBehaviorResolved = true;
            } else {
                DefaultBehavior defaultBehavior = null;
                for (Class cls = child.getClass(); cls != null; cls = cls.getSuperclass()) {
                    DefaultBehavior defaultBehavior2 = (DefaultBehavior) cls.getAnnotation(DefaultBehavior.class);
                    defaultBehavior = defaultBehavior2;
                    if (defaultBehavior2 != null) {
                        break;
                    }
                }
                if (defaultBehavior != null) {
                    try {
                        result.setBehavior((Behavior) defaultBehavior.value().getDeclaredConstructor(new Class[0]).newInstance(new Object[0]));
                    } catch (Exception e) {
                        Log.e(TAG, "Default behavior class " + defaultBehavior.value().getName() + " could not be instantiated. Did you forget a default constructor?", e);
                    }
                }
                result.mBehaviorResolved = true;
            }
        }
        return result;
    }

    private void prepareChildren() {
        this.mDependencySortedChildren.clear();
        this.mChildDag.clear();
        int count = getChildCount();
        for (int i = 0; i < count; i++) {
            View view = getChildAt(i);
            LayoutParams lp = getResolvedLayoutParams(view);
            lp.findAnchorView(this, view);
            this.mChildDag.addNode(view);
            for (int j = 0; j < count; j++) {
                if (j != i) {
                    View other = getChildAt(j);
                    if (lp.dependsOn(this, view, other)) {
                        if (!this.mChildDag.contains(other)) {
                            this.mChildDag.addNode(other);
                        }
                        this.mChildDag.addEdge(other, view);
                    }
                }
            }
        }
        this.mDependencySortedChildren.addAll(this.mChildDag.getSortedList());
        Collections.reverse(this.mDependencySortedChildren);
    }

    /* access modifiers changed from: package-private */
    public void getDescendantRect(View descendant, Rect out) {
        ViewGroupUtils.getDescendantRect(this, descendant, out);
    }

    /* access modifiers changed from: protected */
    public int getSuggestedMinimumWidth() {
        return Math.max(super.getSuggestedMinimumWidth(), getPaddingLeft() + getPaddingRight());
    }

    /* access modifiers changed from: protected */
    public int getSuggestedMinimumHeight() {
        return Math.max(super.getSuggestedMinimumHeight(), getPaddingTop() + getPaddingBottom());
    }

    public void onMeasureChild(View child, int parentWidthMeasureSpec, int widthUsed, int parentHeightMeasureSpec, int heightUsed) {
        measureChildWithMargins(child, parentWidthMeasureSpec, widthUsed, parentHeightMeasureSpec, heightUsed);
    }

    /* access modifiers changed from: protected */
    /* JADX WARNING: Removed duplicated region for block: B:38:0x00e1  */
    /* JADX WARNING: Removed duplicated region for block: B:39:0x0113  */
    /* JADX WARNING: Removed duplicated region for block: B:42:0x011f  */
    /* JADX WARNING: Removed duplicated region for block: B:45:0x0151  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public void onMeasure(int r29, int r30) {
        /*
            r28 = this;
            r0 = r28
            r0.prepareChildren()
            r0.ensurePreDrawListener()
            int r7 = r0.getPaddingLeft()
            int r8 = r0.getPaddingTop()
            int r9 = r0.getPaddingRight()
            int r10 = r0.getPaddingBottom()
            int r11 = r0.getLayoutDirection()
            r1 = 1
            if (r11 != r1) goto L_0x0021
            r2 = r1
            goto L_0x0022
        L_0x0021:
            r2 = 0
        L_0x0022:
            r13 = r2
            int r14 = android.view.View.MeasureSpec.getMode(r29)
            int r15 = android.view.View.MeasureSpec.getSize(r29)
            int r2 = android.view.View.MeasureSpec.getMode(r30)
            int r16 = android.view.View.MeasureSpec.getSize(r30)
            int r17 = r7 + r9
            int r18 = r8 + r10
            int r3 = r0.getSuggestedMinimumWidth()
            int r4 = r0.getSuggestedMinimumHeight()
            r5 = 0
            androidx.core.view.WindowInsetsCompat r6 = r0.mLastInsets
            if (r6 == 0) goto L_0x004b
            boolean r6 = androidx.core.view.ViewCompat.getFitsSystemWindows(r0)
            if (r6 == 0) goto L_0x004b
            goto L_0x004c
        L_0x004b:
            r1 = 0
        L_0x004c:
            r19 = r1
            java.util.List<android.view.View> r1 = r0.mDependencySortedChildren
            int r1 = r1.size()
            r6 = 0
        L_0x0055:
            if (r6 >= r1) goto L_0x01b0
            java.util.List<android.view.View> r12 = r0.mDependencySortedChildren
            java.lang.Object r12 = r12.get(r6)
            android.view.View r12 = (android.view.View) r12
            r21 = r1
            int r1 = r12.getVisibility()
            r22 = r3
            r3 = 8
            if (r1 != r3) goto L_0x007c
            r12 = r2
            r20 = r6
            r23 = r8
            r24 = r9
            r25 = r10
            r3 = r22
            r26 = 0
            r22 = r7
            goto L_0x01a1
        L_0x007c:
            android.view.ViewGroup$LayoutParams r1 = r12.getLayoutParams()
            androidx.coordinatorlayout.widget.CoordinatorLayout$LayoutParams r1 = (androidx.coordinatorlayout.widget.CoordinatorLayout.LayoutParams) r1
            r3 = 0
            r23 = r3
            int r3 = r1.keyline
            if (r3 < 0) goto L_0x00ce
            if (r14 == 0) goto L_0x00ce
            int r3 = r1.keyline
            int r3 = r0.getKeyline(r3)
            r24 = r3
            int r3 = r1.gravity
            int r3 = resolveKeylineGravity(r3)
            int r3 = androidx.core.view.GravityCompat.getAbsoluteGravity(r3, r11)
            r3 = r3 & 7
            r25 = r1
            r1 = 3
            if (r3 != r1) goto L_0x00a6
            if (r13 == 0) goto L_0x00ab
        L_0x00a6:
            r1 = 5
            if (r3 != r1) goto L_0x00b8
            if (r13 == 0) goto L_0x00b8
        L_0x00ab:
            int r1 = r15 - r9
            int r1 = r1 - r24
            r27 = r4
            r4 = 0
            int r1 = java.lang.Math.max(r4, r1)
            r3 = r1
            goto L_0x00d5
        L_0x00b8:
            r27 = r4
            if (r3 != r1) goto L_0x00be
            if (r13 == 0) goto L_0x00c3
        L_0x00be:
            r1 = 3
            if (r3 != r1) goto L_0x00cc
            if (r13 == 0) goto L_0x00cc
        L_0x00c3:
            int r1 = r24 - r7
            r4 = 0
            int r1 = java.lang.Math.max(r4, r1)
            r3 = r1
            goto L_0x00d5
        L_0x00cc:
            r4 = 0
            goto L_0x00d3
        L_0x00ce:
            r25 = r1
            r27 = r4
            r4 = 0
        L_0x00d3:
            r3 = r23
        L_0x00d5:
            r1 = r29
            r20 = r30
            if (r19 == 0) goto L_0x0113
            boolean r23 = androidx.core.view.ViewCompat.getFitsSystemWindows(r12)
            if (r23 != 0) goto L_0x0113
            androidx.core.view.WindowInsetsCompat r4 = r0.mLastInsets
            int r4 = r4.getSystemWindowInsetLeft()
            r24 = r1
            androidx.core.view.WindowInsetsCompat r1 = r0.mLastInsets
            int r1 = r1.getSystemWindowInsetRight()
            int r4 = r4 + r1
            androidx.core.view.WindowInsetsCompat r1 = r0.mLastInsets
            int r1 = r1.getSystemWindowInsetTop()
            r26 = r1
            androidx.core.view.WindowInsetsCompat r1 = r0.mLastInsets
            int r1 = r1.getSystemWindowInsetBottom()
            int r1 = r26 + r1
            int r0 = r15 - r4
            int r0 = android.view.View.MeasureSpec.makeMeasureSpec(r0, r14)
            r24 = r0
            int r0 = r16 - r1
            int r20 = android.view.View.MeasureSpec.makeMeasureSpec(r0, r2)
            r4 = r20
            r1 = r24
            goto L_0x0119
        L_0x0113:
            r24 = r1
            r4 = r20
            r1 = r24
        L_0x0119:
            androidx.coordinatorlayout.widget.CoordinatorLayout$Behavior r0 = r25.getBehavior()
            if (r0 == 0) goto L_0x0151
            r20 = r6
            r6 = 0
            r23 = r12
            r12 = r2
            r2 = r23
            r23 = r22
            r22 = r7
            r7 = r23
            r23 = r25
            r25 = r10
            r10 = r23
            r23 = r8
            r24 = r9
            r9 = r27
            r26 = 0
            r8 = r5
            r5 = r4
            r4 = r3
            r3 = r1
            r1 = r28
            boolean r6 = r0.onMeasureChild(r1, r2, r3, r4, r5, r6)
            r27 = r0
            r1 = r2
            r2 = r3
            r3 = r4
            r4 = r5
            if (r6 != 0) goto L_0x014e
            goto L_0x0170
        L_0x014e:
            r0 = r28
            goto L_0x0176
        L_0x0151:
            r20 = r2
            r2 = r1
            r1 = r12
            r12 = r20
            r20 = r22
            r22 = r7
            r7 = r20
            r20 = r25
            r25 = r10
            r10 = r20
            r20 = r6
            r23 = r8
            r24 = r9
            r9 = r27
            r26 = 0
            r27 = r0
            r8 = r5
        L_0x0170:
            r5 = 0
            r0 = r28
            r0.onMeasureChild(r1, r2, r3, r4, r5)
        L_0x0176:
            int r5 = r1.getMeasuredWidth()
            int r5 = r17 + r5
            int r6 = r10.leftMargin
            int r5 = r5 + r6
            int r6 = r10.rightMargin
            int r5 = r5 + r6
            int r5 = java.lang.Math.max(r7, r5)
            int r6 = r1.getMeasuredHeight()
            int r6 = r18 + r6
            int r7 = r10.topMargin
            int r6 = r6 + r7
            int r7 = r10.bottomMargin
            int r6 = r6 + r7
            int r6 = java.lang.Math.max(r9, r6)
            int r7 = r1.getMeasuredState()
            int r7 = android.view.View.combineMeasuredStates(r8, r7)
            r3 = r5
            r4 = r6
            r5 = r7
        L_0x01a1:
            int r6 = r20 + 1
            r2 = r12
            r1 = r21
            r7 = r22
            r8 = r23
            r9 = r24
            r10 = r25
            goto L_0x0055
        L_0x01b0:
            r21 = r1
            r12 = r2
            r22 = r7
            r23 = r8
            r24 = r9
            r7 = r3
            r9 = r4
            r8 = r5
            r1 = -16777216(0xffffffffff000000, float:-1.7014118E38)
            r1 = r1 & r8
            r2 = r29
            int r1 = android.view.View.resolveSizeAndState(r7, r2, r1)
            int r3 = r8 << 16
            r4 = r30
            int r3 = android.view.View.resolveSizeAndState(r9, r4, r3)
            r0.setMeasuredDimension(r1, r3)
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.coordinatorlayout.widget.CoordinatorLayout.onMeasure(int, int):void");
    }

    private WindowInsetsCompat dispatchApplyWindowInsetsToBehaviors(WindowInsetsCompat insets) {
        Behavior b;
        if (insets.isConsumed()) {
            return insets;
        }
        int z = getChildCount();
        for (int i = 0; i < z; i++) {
            View child = getChildAt(i);
            if (ViewCompat.getFitsSystemWindows(child) && (b = ((LayoutParams) child.getLayoutParams()).getBehavior()) != null) {
                insets = b.onApplyWindowInsets(this, child, insets);
                if (insets.isConsumed()) {
                    break;
                }
            }
        }
        return insets;
    }

    public void onLayoutChild(View child, int layoutDirection) {
        LayoutParams lp = (LayoutParams) child.getLayoutParams();
        if (lp.checkAnchorChanged()) {
            throw new IllegalStateException("An anchor may not be changed after CoordinatorLayout measurement begins before layout is complete.");
        } else if (lp.mAnchorView != null) {
            layoutChildWithAnchor(child, lp.mAnchorView, layoutDirection);
        } else if (lp.keyline >= 0) {
            layoutChildWithKeyline(child, lp.keyline, layoutDirection);
        } else {
            layoutChild(child, layoutDirection);
        }
    }

    /* access modifiers changed from: protected */
    public void onLayout(boolean changed, int l, int t, int r, int b) {
        Behavior behavior;
        int layoutDirection = getLayoutDirection();
        int childCount = this.mDependencySortedChildren.size();
        for (int i = 0; i < childCount; i++) {
            View child = this.mDependencySortedChildren.get(i);
            if (child.getVisibility() != 8 && ((behavior = ((LayoutParams) child.getLayoutParams()).getBehavior()) == null || !behavior.onLayoutChild(this, child, layoutDirection))) {
                onLayoutChild(child, layoutDirection);
            }
        }
    }

    public void onDraw(Canvas c) {
        super.onDraw(c);
        if (this.mDrawStatusBarBackground && this.mStatusBarBackground != null) {
            int inset = this.mLastInsets != null ? this.mLastInsets.getSystemWindowInsetTop() : 0;
            if (inset > 0) {
                this.mStatusBarBackground.setBounds(0, 0, getWidth(), inset);
                this.mStatusBarBackground.draw(c);
            }
        }
    }

    public void setFitsSystemWindows(boolean fitSystemWindows) {
        super.setFitsSystemWindows(fitSystemWindows);
        setupForInsets();
    }

    /* access modifiers changed from: package-private */
    public void recordLastChildRect(View child, Rect r) {
        ((LayoutParams) child.getLayoutParams()).setLastChildRect(r);
    }

    /* access modifiers changed from: package-private */
    public void getLastChildRect(View child, Rect out) {
        out.set(((LayoutParams) child.getLayoutParams()).getLastChildRect());
    }

    /* access modifiers changed from: package-private */
    public void getChildRect(View child, boolean transform, Rect out) {
        if (child.isLayoutRequested() || child.getVisibility() == 8) {
            out.setEmpty();
        } else if (transform) {
            getDescendantRect(child, out);
        } else {
            out.set(child.getLeft(), child.getTop(), child.getRight(), child.getBottom());
        }
    }

    private void getDesiredAnchoredChildRectWithoutConstraints(int layoutDirection, Rect anchorRect, Rect out, LayoutParams lp, int childWidth, int childHeight) {
        int left;
        int top;
        LayoutParams layoutParams = lp;
        int absGravity = GravityCompat.getAbsoluteGravity(resolveAnchoredChildGravity(layoutParams.gravity), layoutDirection);
        int absAnchorGravity = GravityCompat.getAbsoluteGravity(resolveGravity(layoutParams.anchorGravity), layoutDirection);
        int hgrav = absGravity & 7;
        int vgrav = absGravity & 112;
        int anchorVgrav = absAnchorGravity & 112;
        switch (absAnchorGravity & 7) {
            case 1:
                left = anchorRect.left + (anchorRect.width() / 2);
                break;
            case 5:
                left = anchorRect.right;
                break;
            default:
                left = anchorRect.left;
                break;
        }
        switch (anchorVgrav) {
            case 16:
                top = anchorRect.top + (anchorRect.height() / 2);
                break;
            case 80:
                top = anchorRect.bottom;
                break;
            default:
                top = anchorRect.top;
                break;
        }
        switch (hgrav) {
            case 1:
                left -= childWidth / 2;
                break;
            case 5:
                break;
            default:
                left -= childWidth;
                break;
        }
        switch (vgrav) {
            case 16:
                top -= childHeight / 2;
                break;
            case 80:
                break;
            default:
                top -= childHeight;
                break;
        }
        out.set(left, top, left + childWidth, top + childHeight);
    }

    private void constrainChildRect(LayoutParams lp, Rect out, int childWidth, int childHeight) {
        int width = getWidth();
        int height = getHeight();
        int left = Math.max(getPaddingLeft() + lp.leftMargin, Math.min(out.left, ((width - getPaddingRight()) - childWidth) - lp.rightMargin));
        int top = Math.max(getPaddingTop() + lp.topMargin, Math.min(out.top, ((height - getPaddingBottom()) - childHeight) - lp.bottomMargin));
        out.set(left, top, left + childWidth, top + childHeight);
    }

    /* access modifiers changed from: package-private */
    public void getDesiredAnchoredChildRect(View child, int layoutDirection, Rect anchorRect, Rect out) {
        LayoutParams lp = (LayoutParams) child.getLayoutParams();
        int childWidth = child.getMeasuredWidth();
        int childHeight = child.getMeasuredHeight();
        Rect out2 = out;
        getDesiredAnchoredChildRectWithoutConstraints(layoutDirection, anchorRect, out2, lp, childWidth, childHeight);
        constrainChildRect(lp, out2, childWidth, childHeight);
    }

    private void layoutChildWithAnchor(View child, View anchor, int layoutDirection) {
        Rect anchorRect = acquireTempRect();
        Rect childRect = acquireTempRect();
        try {
            getDescendantRect(anchor, anchorRect);
            getDesiredAnchoredChildRect(child, layoutDirection, anchorRect, childRect);
            child.layout(childRect.left, childRect.top, childRect.right, childRect.bottom);
        } finally {
            releaseTempRect(anchorRect);
            releaseTempRect(childRect);
        }
    }

    private void layoutChildWithKeyline(View child, int keyline, int layoutDirection) {
        int keyline2;
        int i = layoutDirection;
        LayoutParams lp = (LayoutParams) child.getLayoutParams();
        int absGravity = GravityCompat.getAbsoluteGravity(resolveKeylineGravity(lp.gravity), i);
        int hgrav = absGravity & 7;
        int vgrav = absGravity & 112;
        int width = getWidth();
        int height = getHeight();
        int childWidth = child.getMeasuredWidth();
        int childHeight = child.getMeasuredHeight();
        if (i == 1) {
            keyline2 = width - keyline;
        } else {
            keyline2 = keyline;
        }
        int left = getKeyline(keyline2) - childWidth;
        int top = 0;
        switch (hgrav) {
            case 1:
                left += childWidth / 2;
                break;
            case 5:
                left += childWidth;
                break;
        }
        switch (vgrav) {
            case 16:
                top = 0 + (childHeight / 2);
                break;
            case 80:
                top = 0 + childHeight;
                break;
        }
        int left2 = Math.max(getPaddingLeft() + lp.leftMargin, Math.min(left, ((width - getPaddingRight()) - childWidth) - lp.rightMargin));
        int top2 = Math.max(getPaddingTop() + lp.topMargin, Math.min(top, ((height - getPaddingBottom()) - childHeight) - lp.bottomMargin));
        child.layout(left2, top2, left2 + childWidth, top2 + childHeight);
    }

    private void layoutChild(View child, int layoutDirection) {
        LayoutParams lp = (LayoutParams) child.getLayoutParams();
        Rect parent = acquireTempRect();
        parent.set(getPaddingLeft() + lp.leftMargin, getPaddingTop() + lp.topMargin, (getWidth() - getPaddingRight()) - lp.rightMargin, (getHeight() - getPaddingBottom()) - lp.bottomMargin);
        if (this.mLastInsets != null && ViewCompat.getFitsSystemWindows(this) && !ViewCompat.getFitsSystemWindows(child)) {
            parent.left += this.mLastInsets.getSystemWindowInsetLeft();
            parent.top += this.mLastInsets.getSystemWindowInsetTop();
            parent.right -= this.mLastInsets.getSystemWindowInsetRight();
            parent.bottom -= this.mLastInsets.getSystemWindowInsetBottom();
        }
        Rect out = acquireTempRect();
        GravityCompat.apply(resolveGravity(lp.gravity), child.getMeasuredWidth(), child.getMeasuredHeight(), parent, out, layoutDirection);
        child.layout(out.left, out.top, out.right, out.bottom);
        releaseTempRect(parent);
        releaseTempRect(out);
    }

    private static int resolveGravity(int gravity) {
        if ((gravity & 7) == 0) {
            gravity |= GravityCompat.START;
        }
        if ((gravity & 112) == 0) {
            return gravity | 48;
        }
        return gravity;
    }

    private static int resolveKeylineGravity(int gravity) {
        if (gravity == 0) {
            return 8388661;
        }
        return gravity;
    }

    private static int resolveAnchoredChildGravity(int gravity) {
        if (gravity == 0) {
            return 17;
        }
        return gravity;
    }

    /* access modifiers changed from: protected */
    public boolean drawChild(Canvas canvas, View child, long drawingTime) {
        View view = child;
        LayoutParams lp = (LayoutParams) view.getLayoutParams();
        if (lp.mBehavior != null) {
            float scrimAlpha = lp.mBehavior.getScrimOpacity(this, view);
            if (scrimAlpha > 0.0f) {
                if (this.mScrimPaint == null) {
                    this.mScrimPaint = new Paint();
                }
                this.mScrimPaint.setColor(lp.mBehavior.getScrimColor(this, view));
                this.mScrimPaint.setAlpha(clamp(Math.round(255.0f * scrimAlpha), 0, 255));
                int saved = canvas.save();
                if (view.isOpaque()) {
                    canvas.clipRect((float) view.getLeft(), (float) view.getTop(), (float) view.getRight(), (float) view.getBottom(), Region.Op.DIFFERENCE);
                }
                Canvas canvas2 = canvas;
                canvas2.drawRect((float) getPaddingLeft(), (float) getPaddingTop(), (float) (getWidth() - getPaddingRight()), (float) (getHeight() - getPaddingBottom()), this.mScrimPaint);
                canvas2.restoreToCount(saved);
            } else {
                Canvas canvas3 = canvas;
            }
        } else {
            Canvas canvas4 = canvas;
        }
        return super.drawChild(canvas, child, drawingTime);
    }

    private static int clamp(int value, int min, int max) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }

    /* access modifiers changed from: package-private */
    public final void onChildViewsChanged(int type) {
        boolean handled;
        int layoutDirection = getLayoutDirection();
        int childCount = this.mDependencySortedChildren.size();
        Rect inset = acquireTempRect();
        Rect drawRect = acquireTempRect();
        Rect lastDrawRect = acquireTempRect();
        for (int i = 0; i < childCount; i++) {
            View child = this.mDependencySortedChildren.get(i);
            LayoutParams lp = (LayoutParams) child.getLayoutParams();
            if (type != 0 || child.getVisibility() != 8) {
                for (int j = 0; j < i; j++) {
                    if (lp.mAnchorDirectChild == this.mDependencySortedChildren.get(j)) {
                        offsetChildToAnchor(child, layoutDirection);
                    }
                }
                getChildRect(child, true, drawRect);
                if (lp.insetEdge != 0 && !drawRect.isEmpty()) {
                    int absInsetEdge = GravityCompat.getAbsoluteGravity(lp.insetEdge, layoutDirection);
                    switch (absInsetEdge & 112) {
                        case 48:
                            inset.top = Math.max(inset.top, drawRect.bottom);
                            break;
                        case 80:
                            inset.bottom = Math.max(inset.bottom, getHeight() - drawRect.top);
                            break;
                    }
                    switch (absInsetEdge & 7) {
                        case 3:
                            inset.left = Math.max(inset.left, drawRect.right);
                            break;
                        case 5:
                            inset.right = Math.max(inset.right, getWidth() - drawRect.left);
                            break;
                    }
                }
                if (lp.dodgeInsetEdges != 0 && child.getVisibility() == 0) {
                    offsetChildByInset(child, inset, layoutDirection);
                }
                if (type != 2) {
                    getLastChildRect(child, lastDrawRect);
                    if (!lastDrawRect.equals(drawRect)) {
                        recordLastChildRect(child, drawRect);
                    }
                }
                for (int j2 = i + 1; j2 < childCount; j2++) {
                    View checkChild = this.mDependencySortedChildren.get(j2);
                    LayoutParams checkLp = (LayoutParams) checkChild.getLayoutParams();
                    Behavior b = checkLp.getBehavior();
                    if (b != null && b.layoutDependsOn(this, checkChild, child)) {
                        if (type != 0 || !checkLp.getChangedAfterNestedScroll()) {
                            switch (type) {
                                case 2:
                                    b.onDependentViewRemoved(this, checkChild, child);
                                    handled = true;
                                    break;
                                default:
                                    handled = b.onDependentViewChanged(this, checkChild, child);
                                    break;
                            }
                            if (type == 1) {
                                checkLp.setChangedAfterNestedScroll(handled);
                            }
                        } else {
                            checkLp.resetChangedAfterNestedScroll();
                        }
                    }
                }
            }
        }
        releaseTempRect(inset);
        releaseTempRect(drawRect);
        releaseTempRect(lastDrawRect);
    }

    private void offsetChildByInset(View child, Rect inset, int layoutDirection) {
        int distance;
        int distance2;
        int distance3;
        int distance4;
        if (child.isLaidOut() && child.getWidth() > 0 && child.getHeight() > 0) {
            LayoutParams lp = (LayoutParams) child.getLayoutParams();
            Behavior behavior = lp.getBehavior();
            Rect dodgeRect = acquireTempRect();
            Rect bounds = acquireTempRect();
            bounds.set(child.getLeft(), child.getTop(), child.getRight(), child.getBottom());
            if (behavior == null || !behavior.getInsetDodgeRect(this, child, dodgeRect)) {
                dodgeRect.set(bounds);
            } else if (!bounds.contains(dodgeRect)) {
                throw new IllegalArgumentException("Rect should be within the child's bounds. Rect:" + dodgeRect.toShortString() + " | Bounds:" + bounds.toShortString());
            }
            releaseTempRect(bounds);
            if (dodgeRect.isEmpty()) {
                releaseTempRect(dodgeRect);
                return;
            }
            int absDodgeInsetEdges = GravityCompat.getAbsoluteGravity(lp.dodgeInsetEdges, layoutDirection);
            boolean offsetY = false;
            if ((absDodgeInsetEdges & 48) == 48 && (distance4 = (dodgeRect.top - lp.topMargin) - lp.mInsetOffsetY) < inset.top) {
                setInsetOffsetY(child, inset.top - distance4);
                offsetY = true;
            }
            if ((absDodgeInsetEdges & 80) == 80 && (distance3 = ((getHeight() - dodgeRect.bottom) - lp.bottomMargin) + lp.mInsetOffsetY) < inset.bottom) {
                setInsetOffsetY(child, distance3 - inset.bottom);
                offsetY = true;
            }
            if (!offsetY) {
                setInsetOffsetY(child, 0);
            }
            boolean offsetX = false;
            if ((absDodgeInsetEdges & 3) == 3 && (distance2 = (dodgeRect.left - lp.leftMargin) - lp.mInsetOffsetX) < inset.left) {
                setInsetOffsetX(child, inset.left - distance2);
                offsetX = true;
            }
            if ((absDodgeInsetEdges & 5) == 5 && (distance = ((getWidth() - dodgeRect.right) - lp.rightMargin) + lp.mInsetOffsetX) < inset.right) {
                setInsetOffsetX(child, distance - inset.right);
                offsetX = true;
            }
            if (!offsetX) {
                setInsetOffsetX(child, 0);
            }
            releaseTempRect(dodgeRect);
        }
    }

    private void setInsetOffsetX(View child, int offsetX) {
        LayoutParams lp = (LayoutParams) child.getLayoutParams();
        if (lp.mInsetOffsetX != offsetX) {
            ViewCompat.offsetLeftAndRight(child, offsetX - lp.mInsetOffsetX);
            lp.mInsetOffsetX = offsetX;
        }
    }

    private void setInsetOffsetY(View child, int offsetY) {
        LayoutParams lp = (LayoutParams) child.getLayoutParams();
        if (lp.mInsetOffsetY != offsetY) {
            ViewCompat.offsetTopAndBottom(child, offsetY - lp.mInsetOffsetY);
            lp.mInsetOffsetY = offsetY;
        }
    }

    public void dispatchDependentViewsChanged(View view) {
        List<View> dependents = this.mChildDag.getIncomingEdgesInternal(view);
        if (dependents != null && !dependents.isEmpty()) {
            for (int i = 0; i < dependents.size(); i++) {
                View child = dependents.get(i);
                Behavior b = ((LayoutParams) child.getLayoutParams()).getBehavior();
                if (b != null) {
                    b.onDependentViewChanged(this, child, view);
                }
            }
        }
    }

    public List<View> getDependencies(View child) {
        List<View> result = this.mChildDag.getOutgoingEdges(child);
        return result == null ? Collections.emptyList() : result;
    }

    public List<View> getDependents(View child) {
        List<View> result = this.mChildDag.getIncomingEdges(child);
        return result == null ? Collections.emptyList() : result;
    }

    /* access modifiers changed from: package-private */
    public final List<View> getDependencySortedChildren() {
        prepareChildren();
        return Collections.unmodifiableList(this.mDependencySortedChildren);
    }

    /* access modifiers changed from: package-private */
    public void ensurePreDrawListener() {
        boolean hasDependencies = false;
        int childCount = getChildCount();
        int i = 0;
        while (true) {
            if (i >= childCount) {
                break;
            } else if (hasDependencies(getChildAt(i))) {
                hasDependencies = true;
                break;
            } else {
                i++;
            }
        }
        if (hasDependencies == this.mNeedsPreDrawListener) {
            return;
        }
        if (hasDependencies) {
            addPreDrawListener();
        } else {
            removePreDrawListener();
        }
    }

    private boolean hasDependencies(View child) {
        return this.mChildDag.hasOutgoingEdges(child);
    }

    /* access modifiers changed from: package-private */
    public void addPreDrawListener() {
        if (this.mIsAttachedToWindow) {
            if (this.mOnPreDrawListener == null) {
                this.mOnPreDrawListener = new OnPreDrawListener();
            }
            getViewTreeObserver().addOnPreDrawListener(this.mOnPreDrawListener);
        }
        this.mNeedsPreDrawListener = true;
    }

    /* access modifiers changed from: package-private */
    public void removePreDrawListener() {
        if (this.mIsAttachedToWindow && this.mOnPreDrawListener != null) {
            getViewTreeObserver().removeOnPreDrawListener(this.mOnPreDrawListener);
        }
        this.mNeedsPreDrawListener = false;
    }

    /* access modifiers changed from: package-private */
    public void offsetChildToAnchor(View child, int layoutDirection) {
        Behavior b;
        LayoutParams lp = (LayoutParams) child.getLayoutParams();
        if (lp.mAnchorView != null) {
            Rect anchorRect = acquireTempRect();
            Rect childRect = acquireTempRect();
            Rect desiredChildRect = acquireTempRect();
            getDescendantRect(lp.mAnchorView, anchorRect);
            boolean changed = false;
            getChildRect(child, false, childRect);
            int childWidth = child.getMeasuredWidth();
            int childHeight = child.getMeasuredHeight();
            getDesiredAnchoredChildRectWithoutConstraints(layoutDirection, anchorRect, desiredChildRect, lp, childWidth, childHeight);
            if (!(desiredChildRect.left == childRect.left && desiredChildRect.top == childRect.top)) {
                changed = true;
            }
            constrainChildRect(lp, desiredChildRect, childWidth, childHeight);
            int dx = desiredChildRect.left - childRect.left;
            int dy = desiredChildRect.top - childRect.top;
            if (dx != 0) {
                ViewCompat.offsetLeftAndRight(child, dx);
            }
            if (dy != 0) {
                ViewCompat.offsetTopAndBottom(child, dy);
            }
            if (changed && (b = lp.getBehavior()) != null) {
                b.onDependentViewChanged(this, child, lp.mAnchorView);
            }
            releaseTempRect(anchorRect);
            releaseTempRect(childRect);
            releaseTempRect(desiredChildRect);
            return;
        }
        int i = layoutDirection;
    }

    public boolean isPointInChildBounds(View child, int x, int y) {
        Rect r = acquireTempRect();
        getDescendantRect(child, r);
        try {
            return r.contains(x, y);
        } finally {
            releaseTempRect(r);
        }
    }

    public boolean doViewsOverlap(View first, View second) {
        boolean z = false;
        if (first.getVisibility() != 0 || second.getVisibility() != 0) {
            return false;
        }
        Rect firstRect = acquireTempRect();
        getChildRect(first, first.getParent() != this, firstRect);
        Rect secondRect = acquireTempRect();
        getChildRect(second, second.getParent() != this, secondRect);
        try {
            if (firstRect.left <= secondRect.right && firstRect.top <= secondRect.bottom && firstRect.right >= secondRect.left && firstRect.bottom >= secondRect.top) {
                z = true;
            }
            return z;
        } finally {
            releaseTempRect(firstRect);
            releaseTempRect(secondRect);
        }
    }

    public LayoutParams generateLayoutParams(AttributeSet attrs) {
        return new LayoutParams(getContext(), attrs);
    }

    /* access modifiers changed from: protected */
    public LayoutParams generateLayoutParams(ViewGroup.LayoutParams p) {
        if (p instanceof LayoutParams) {
            return new LayoutParams((LayoutParams) p);
        }
        if (p instanceof ViewGroup.MarginLayoutParams) {
            return new LayoutParams((ViewGroup.MarginLayoutParams) p);
        }
        return new LayoutParams(p);
    }

    /* access modifiers changed from: protected */
    public LayoutParams generateDefaultLayoutParams() {
        return new LayoutParams(-2, -2);
    }

    /* access modifiers changed from: protected */
    public boolean checkLayoutParams(ViewGroup.LayoutParams p) {
        return (p instanceof LayoutParams) && super.checkLayoutParams(p);
    }

    public boolean onStartNestedScroll(View child, View target, int axes) {
        return onStartNestedScroll(child, target, axes, 0);
    }

    public boolean onStartNestedScroll(View child, View target, int axes, int type) {
        int type2;
        int axes2;
        View target2;
        View child2;
        boolean handled = false;
        int childCount = getChildCount();
        int i = 0;
        while (i < childCount) {
            View view = getChildAt(i);
            if (view.getVisibility() == 8) {
                child2 = child;
                target2 = target;
                axes2 = axes;
                type2 = type;
            } else {
                LayoutParams lp = (LayoutParams) view.getLayoutParams();
                Behavior viewBehavior = lp.getBehavior();
                if (viewBehavior != null) {
                    child2 = child;
                    target2 = target;
                    axes2 = axes;
                    type2 = type;
                    boolean accepted = viewBehavior.onStartNestedScroll(this, view, child2, target2, axes2, type2);
                    lp.setNestedScrollAccepted(type2, accepted);
                    handled |= accepted;
                } else {
                    child2 = child;
                    target2 = target;
                    axes2 = axes;
                    type2 = type;
                    lp.setNestedScrollAccepted(type2, false);
                }
            }
            i++;
            child = child2;
            target = target2;
            axes = axes2;
            type = type2;
        }
        return handled;
    }

    public void onNestedScrollAccepted(View child, View target, int axes) {
        onNestedScrollAccepted(child, target, axes, 0);
    }

    public void onNestedScrollAccepted(View child, View target, int axes, int type) {
        int type2;
        int axes2;
        View target2;
        View child2;
        this.mNestedScrollingParentHelper.onNestedScrollAccepted(child, target, axes, type);
        this.mNestedScrollingTarget = target;
        int childCount = getChildCount();
        int i = 0;
        while (i < childCount) {
            View view = getChildAt(i);
            LayoutParams lp = (LayoutParams) view.getLayoutParams();
            if (!lp.isNestedScrollAccepted(type)) {
                child2 = child;
                target2 = target;
                axes2 = axes;
                type2 = type;
            } else {
                Behavior viewBehavior = lp.getBehavior();
                if (viewBehavior != null) {
                    child2 = child;
                    target2 = target;
                    axes2 = axes;
                    type2 = type;
                    viewBehavior.onNestedScrollAccepted(this, view, child2, target2, axes2, type2);
                } else {
                    child2 = child;
                    target2 = target;
                    axes2 = axes;
                    type2 = type;
                }
            }
            i++;
            child = child2;
            target = target2;
            axes = axes2;
            type = type2;
        }
    }

    public void onStopNestedScroll(View target) {
        onStopNestedScroll(target, 0);
    }

    public void onStopNestedScroll(View target, int type) {
        this.mNestedScrollingParentHelper.onStopNestedScroll(target, type);
        int childCount = getChildCount();
        for (int i = 0; i < childCount; i++) {
            View view = getChildAt(i);
            LayoutParams lp = (LayoutParams) view.getLayoutParams();
            if (lp.isNestedScrollAccepted(type)) {
                Behavior viewBehavior = lp.getBehavior();
                if (viewBehavior != null) {
                    viewBehavior.onStopNestedScroll(this, view, target, type);
                }
                lp.resetNestedScroll(type);
                lp.resetChangedAfterNestedScroll();
            }
        }
        this.mNestedScrollingTarget = null;
    }

    public void onNestedScroll(View target, int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed) {
        onNestedScroll(target, dxConsumed, dyConsumed, dxUnconsumed, dyUnconsumed, 0);
    }

    public void onNestedScroll(View target, int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed, int type) {
        onNestedScroll(target, dxConsumed, dyConsumed, dxUnconsumed, dyUnconsumed, 0, this.mNestedScrollingV2ConsumedCompat);
    }

    public void onNestedScroll(View target, int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed, int type, int[] consumed) {
        int xConsumed;
        int yConsumed;
        int childCount = getChildCount();
        boolean accepted = false;
        int xConsumed2 = 0;
        int yConsumed2 = 0;
        for (int i = 0; i < childCount; i++) {
            View view = getChildAt(i);
            if (view.getVisibility() != 8) {
                LayoutParams lp = (LayoutParams) view.getLayoutParams();
                int i2 = type;
                if (lp.isNestedScrollAccepted(i2)) {
                    LayoutParams lp2 = lp;
                    Behavior viewBehavior = lp2.getBehavior();
                    if (viewBehavior != null) {
                        this.mBehaviorConsumed[0] = 0;
                        this.mBehaviorConsumed[1] = 0;
                        LayoutParams layoutParams = lp2;
                        viewBehavior.onNestedScroll(this, view, target, dxConsumed, dyConsumed, dxUnconsumed, dyUnconsumed, i2, this.mBehaviorConsumed);
                        if (dxUnconsumed > 0) {
                            xConsumed = Math.max(xConsumed2, this.mBehaviorConsumed[0]);
                        } else {
                            xConsumed = Math.min(xConsumed2, this.mBehaviorConsumed[0]);
                        }
                        if (dyUnconsumed > 0) {
                            yConsumed = Math.max(yConsumed2, this.mBehaviorConsumed[1]);
                        } else {
                            yConsumed = Math.min(yConsumed2, this.mBehaviorConsumed[1]);
                        }
                        xConsumed2 = xConsumed;
                        yConsumed2 = yConsumed;
                        accepted = true;
                    }
                }
            }
        }
        consumed[0] = consumed[0] + xConsumed2;
        consumed[1] = consumed[1] + yConsumed2;
        if (accepted) {
            onChildViewsChanged(1);
        }
    }

    public boolean dispatchKeyEvent(KeyEvent event) {
        boolean handled = super.dispatchKeyEvent(event);
        if (handled || event.getAction() != 0) {
            return handled;
        }
        switch (event.getKeyCode()) {
            case 19:
                if (event.isAltPressed()) {
                    return moveVertically(-pageDelta());
                }
                return moveVertically(-lineDelta());
            case 20:
                if (event.isAltPressed()) {
                    return moveVertically(pageDelta());
                }
                return moveVertically(lineDelta());
            case 62:
                if (event.isShiftPressed()) {
                    return moveVertically(distanceToTop());
                }
                return moveVertically(distanceToBottom());
            case 92:
                return moveVertically(-pageDelta());
            case 93:
                return moveVertically(pageDelta());
            case 122:
                return moveVertically(distanceToTop());
            case 123:
                return moveVertically(distanceToBottom());
            default:
                return handled;
        }
    }

    private int lineDelta() {
        return (int) (((float) getHeight()) * KEY_SCROLL_FRACTION_AMOUNT);
    }

    private int pageDelta() {
        return getHeight();
    }

    private int distanceToTop() {
        return -getFullContentHeight();
    }

    private int distanceToBottom() {
        return getFullContentHeight() - getHeight();
    }

    private boolean moveVertically(int yScrollDelta) {
        return manuallyTriggersNestedScrollFromKeyEvent(findDeepestFocusedChild(this), yScrollDelta);
    }

    private View findDeepestFocusedChild(View startingParentView) {
        View focusedView = startingParentView;
        while (true) {
            View view = null;
            if (focusedView == null) {
                return null;
            }
            if (focusedView.isFocused()) {
                return focusedView;
            }
            if (focusedView instanceof ViewGroup) {
                view = ((ViewGroup) focusedView).getFocusedChild();
            }
            focusedView = view;
        }
    }

    private int getFullContentHeight() {
        int scrollRange = 0;
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            LayoutParams lp = (LayoutParams) child.getLayoutParams();
            scrollRange += child.getHeight() + lp.topMargin + lp.bottomMargin;
        }
        return scrollRange;
    }

    private boolean manuallyTriggersNestedScrollFromKeyEvent(View focusedView, int yScrollDelta) {
        onStartNestedScroll(this, focusedView, 2, 1);
        onNestedPreScroll(focusedView, 0, yScrollDelta, this.mKeyTriggeredScrollConsumed, 1);
        int yScrollDeltaConsumed = this.mKeyTriggeredScrollConsumed[1];
        this.mKeyTriggeredScrollConsumed[0] = 0;
        this.mKeyTriggeredScrollConsumed[1] = 0;
        onNestedScroll(focusedView, 0, yScrollDeltaConsumed, 0, yScrollDelta, 1, this.mKeyTriggeredScrollConsumed);
        onStopNestedScroll(focusedView, 1);
        if (this.mKeyTriggeredScrollConsumed[1] > 0) {
            return true;
        }
        return false;
    }

    public void onNestedPreScroll(View target, int dx, int dy, int[] consumed) {
        onNestedPreScroll(target, dx, dy, consumed, 0);
    }

    public void onNestedPreScroll(View target, int dx, int dy, int[] consumed, int type) {
        Behavior viewBehavior;
        int xConsumed;
        int yConsumed;
        int childCount = getChildCount();
        int xConsumed2 = 0;
        int yConsumed2 = 0;
        boolean accepted = false;
        for (int i = 0; i < childCount; i++) {
            View view = getChildAt(i);
            if (view.getVisibility() != 8) {
                LayoutParams lp = (LayoutParams) view.getLayoutParams();
                int i2 = type;
                if (lp.isNestedScrollAccepted(i2) && (viewBehavior = lp.getBehavior()) != null) {
                    this.mBehaviorConsumed[0] = 0;
                    this.mBehaviorConsumed[1] = 0;
                    viewBehavior.onNestedPreScroll(this, view, target, dx, dy, this.mBehaviorConsumed, i2);
                    if (dx > 0) {
                        xConsumed = Math.max(xConsumed2, this.mBehaviorConsumed[0]);
                    } else {
                        xConsumed = Math.min(xConsumed2, this.mBehaviorConsumed[0]);
                    }
                    if (dy > 0) {
                        yConsumed = Math.max(yConsumed2, this.mBehaviorConsumed[1]);
                    } else {
                        yConsumed = Math.min(yConsumed2, this.mBehaviorConsumed[1]);
                    }
                    xConsumed2 = xConsumed;
                    yConsumed2 = yConsumed;
                    accepted = true;
                }
            }
        }
        consumed[0] = xConsumed2;
        consumed[1] = yConsumed2;
        if (accepted) {
            onChildViewsChanged(1);
        }
    }

    public boolean onNestedFling(View target, float velocityX, float velocityY, boolean consumed) {
        boolean consumed2;
        float velocityY2;
        float velocityX2;
        View target2;
        boolean handled = false;
        int childCount = getChildCount();
        int i = 0;
        while (i < childCount) {
            View view = getChildAt(i);
            if (view.getVisibility() == 8) {
                target2 = target;
                velocityX2 = velocityX;
                velocityY2 = velocityY;
                consumed2 = consumed;
            } else {
                LayoutParams lp = (LayoutParams) view.getLayoutParams();
                if (!lp.isNestedScrollAccepted(0)) {
                    target2 = target;
                    velocityX2 = velocityX;
                    velocityY2 = velocityY;
                    consumed2 = consumed;
                } else {
                    Behavior viewBehavior = lp.getBehavior();
                    if (viewBehavior != null) {
                        target2 = target;
                        velocityX2 = velocityX;
                        velocityY2 = velocityY;
                        consumed2 = consumed;
                        handled = viewBehavior.onNestedFling(this, view, target2, velocityX2, velocityY2, consumed2) | handled;
                    } else {
                        target2 = target;
                        velocityX2 = velocityX;
                        velocityY2 = velocityY;
                        consumed2 = consumed;
                    }
                }
            }
            i++;
            target = target2;
            velocityX = velocityX2;
            velocityY = velocityY2;
            consumed = consumed2;
        }
        View view2 = target;
        float f = velocityX;
        float f2 = velocityY;
        boolean z = consumed;
        if (handled) {
            onChildViewsChanged(1);
        }
        return handled;
    }

    public boolean onNestedPreFling(View target, float velocityX, float velocityY) {
        float velocityY2;
        float velocityX2;
        View target2;
        boolean handled = false;
        int childCount = getChildCount();
        int i = 0;
        while (i < childCount) {
            View view = getChildAt(i);
            if (view.getVisibility() == 8) {
                target2 = target;
                velocityX2 = velocityX;
                velocityY2 = velocityY;
            } else {
                LayoutParams lp = (LayoutParams) view.getLayoutParams();
                if (!lp.isNestedScrollAccepted(0)) {
                    target2 = target;
                    velocityX2 = velocityX;
                    velocityY2 = velocityY;
                } else {
                    Behavior viewBehavior = lp.getBehavior();
                    if (viewBehavior != null) {
                        target2 = target;
                        velocityX2 = velocityX;
                        velocityY2 = velocityY;
                        handled = viewBehavior.onNestedPreFling(this, view, target2, velocityX2, velocityY2) | handled;
                    } else {
                        target2 = target;
                        velocityX2 = velocityX;
                        velocityY2 = velocityY;
                    }
                }
            }
            i++;
            target = target2;
            velocityX = velocityX2;
            velocityY = velocityY2;
        }
        return handled;
    }

    public int getNestedScrollAxes() {
        return this.mNestedScrollingParentHelper.getNestedScrollAxes();
    }

    class OnPreDrawListener implements ViewTreeObserver.OnPreDrawListener {
        OnPreDrawListener() {
        }

        public boolean onPreDraw() {
            CoordinatorLayout.this.onChildViewsChanged(0);
            return true;
        }
    }

    static class ViewElevationComparator implements Comparator<View> {
        ViewElevationComparator() {
        }

        public int compare(View lhs, View rhs) {
            float lz = ViewCompat.getZ(lhs);
            float rz = ViewCompat.getZ(rhs);
            if (lz > rz) {
                return -1;
            }
            if (lz < rz) {
                return 1;
            }
            return 0;
        }
    }

    public static abstract class Behavior<V extends View> {
        public Behavior() {
        }

        public Behavior(Context context, AttributeSet attrs) {
        }

        public void onAttachedToLayoutParams(LayoutParams params) {
        }

        public void onDetachedFromLayoutParams() {
        }

        public boolean onInterceptTouchEvent(CoordinatorLayout parent, V v, MotionEvent ev) {
            return false;
        }

        public boolean onTouchEvent(CoordinatorLayout parent, V v, MotionEvent ev) {
            return false;
        }

        public int getScrimColor(CoordinatorLayout parent, V v) {
            return ViewCompat.MEASURED_STATE_MASK;
        }

        public float getScrimOpacity(CoordinatorLayout parent, V v) {
            return 0.0f;
        }

        public boolean blocksInteractionBelow(CoordinatorLayout parent, V child) {
            return getScrimOpacity(parent, child) > 0.0f;
        }

        public boolean layoutDependsOn(CoordinatorLayout parent, V v, View dependency) {
            return false;
        }

        public boolean onDependentViewChanged(CoordinatorLayout parent, V v, View dependency) {
            return false;
        }

        public void onDependentViewRemoved(CoordinatorLayout parent, V v, View dependency) {
        }

        public boolean onMeasureChild(CoordinatorLayout parent, V v, int parentWidthMeasureSpec, int widthUsed, int parentHeightMeasureSpec, int heightUsed) {
            return false;
        }

        public boolean onLayoutChild(CoordinatorLayout parent, V v, int layoutDirection) {
            return false;
        }

        public static void setTag(View child, Object tag) {
            ((LayoutParams) child.getLayoutParams()).mBehaviorTag = tag;
        }

        public static Object getTag(View child) {
            return ((LayoutParams) child.getLayoutParams()).mBehaviorTag;
        }

        @Deprecated
        public boolean onStartNestedScroll(CoordinatorLayout coordinatorLayout, V v, View directTargetChild, View target, int axes) {
            return false;
        }

        public boolean onStartNestedScroll(CoordinatorLayout coordinatorLayout, V child, View directTargetChild, View target, int axes, int type) {
            if (type == 0) {
                return onStartNestedScroll(coordinatorLayout, child, directTargetChild, target, axes);
            }
            return false;
        }

        @Deprecated
        public void onNestedScrollAccepted(CoordinatorLayout coordinatorLayout, V v, View directTargetChild, View target, int axes) {
        }

        public void onNestedScrollAccepted(CoordinatorLayout coordinatorLayout, V child, View directTargetChild, View target, int axes, int type) {
            if (type == 0) {
                onNestedScrollAccepted(coordinatorLayout, child, directTargetChild, target, axes);
            }
        }

        @Deprecated
        public void onStopNestedScroll(CoordinatorLayout coordinatorLayout, V v, View target) {
        }

        public void onStopNestedScroll(CoordinatorLayout coordinatorLayout, V child, View target, int type) {
            if (type == 0) {
                onStopNestedScroll(coordinatorLayout, child, target);
            }
        }

        @Deprecated
        public void onNestedScroll(CoordinatorLayout coordinatorLayout, V v, View target, int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed) {
        }

        @Deprecated
        public void onNestedScroll(CoordinatorLayout coordinatorLayout, V child, View target, int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed, int type) {
            if (type == 0) {
                onNestedScroll(coordinatorLayout, child, target, dxConsumed, dyConsumed, dxUnconsumed, dyUnconsumed);
            }
        }

        public void onNestedScroll(CoordinatorLayout coordinatorLayout, V child, View target, int dxConsumed, int dyConsumed, int dxUnconsumed, int dyUnconsumed, int type, int[] consumed) {
            consumed[0] = consumed[0] + dxUnconsumed;
            consumed[1] = consumed[1] + dyUnconsumed;
            onNestedScroll(coordinatorLayout, child, target, dxConsumed, dyConsumed, dxUnconsumed, dyUnconsumed, type);
        }

        @Deprecated
        public void onNestedPreScroll(CoordinatorLayout coordinatorLayout, V v, View target, int dx, int dy, int[] consumed) {
        }

        public void onNestedPreScroll(CoordinatorLayout coordinatorLayout, V child, View target, int dx, int dy, int[] consumed, int type) {
            if (type == 0) {
                onNestedPreScroll(coordinatorLayout, child, target, dx, dy, consumed);
            }
        }

        public boolean onNestedFling(CoordinatorLayout coordinatorLayout, V v, View target, float velocityX, float velocityY, boolean consumed) {
            return false;
        }

        public boolean onNestedPreFling(CoordinatorLayout coordinatorLayout, V v, View target, float velocityX, float velocityY) {
            return false;
        }

        public WindowInsetsCompat onApplyWindowInsets(CoordinatorLayout coordinatorLayout, V v, WindowInsetsCompat insets) {
            return insets;
        }

        public boolean onRequestChildRectangleOnScreen(CoordinatorLayout coordinatorLayout, V v, Rect rectangle, boolean immediate) {
            return false;
        }

        public void onRestoreInstanceState(CoordinatorLayout parent, V v, Parcelable state) {
        }

        public Parcelable onSaveInstanceState(CoordinatorLayout parent, V v) {
            return View.BaseSavedState.EMPTY_STATE;
        }

        public boolean getInsetDodgeRect(CoordinatorLayout parent, V v, Rect rect) {
            return false;
        }
    }

    public static class LayoutParams extends ViewGroup.MarginLayoutParams {
        public int anchorGravity = 0;
        public int dodgeInsetEdges = 0;
        public int gravity = 0;
        public int insetEdge = 0;
        public int keyline = -1;
        View mAnchorDirectChild;
        int mAnchorId = -1;
        View mAnchorView;
        Behavior mBehavior;
        boolean mBehaviorResolved = false;
        Object mBehaviorTag;
        private boolean mDidAcceptNestedScrollNonTouch;
        private boolean mDidAcceptNestedScrollTouch;
        private boolean mDidBlockInteraction;
        private boolean mDidChangeAfterNestedScroll;
        int mInsetOffsetX;
        int mInsetOffsetY;
        final Rect mLastChildRect = new Rect();

        public LayoutParams(int width, int height) {
            super(width, height);
        }

        LayoutParams(Context context, AttributeSet attrs) {
            super(context, attrs);
            TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.CoordinatorLayout_Layout);
            this.gravity = a.getInteger(R.styleable.CoordinatorLayout_Layout_android_layout_gravity, 0);
            this.mAnchorId = a.getResourceId(R.styleable.CoordinatorLayout_Layout_layout_anchor, -1);
            this.anchorGravity = a.getInteger(R.styleable.CoordinatorLayout_Layout_layout_anchorGravity, 0);
            this.keyline = a.getInteger(R.styleable.CoordinatorLayout_Layout_layout_keyline, -1);
            this.insetEdge = a.getInt(R.styleable.CoordinatorLayout_Layout_layout_insetEdge, 0);
            this.dodgeInsetEdges = a.getInt(R.styleable.CoordinatorLayout_Layout_layout_dodgeInsetEdges, 0);
            this.mBehaviorResolved = a.hasValue(R.styleable.CoordinatorLayout_Layout_layout_behavior);
            if (this.mBehaviorResolved) {
                this.mBehavior = CoordinatorLayout.parseBehavior(context, attrs, a.getString(R.styleable.CoordinatorLayout_Layout_layout_behavior));
            }
            a.recycle();
            if (this.mBehavior != null) {
                this.mBehavior.onAttachedToLayoutParams(this);
            }
        }

        public LayoutParams(LayoutParams p) {
            super(p);
        }

        public LayoutParams(ViewGroup.MarginLayoutParams p) {
            super(p);
        }

        public LayoutParams(ViewGroup.LayoutParams p) {
            super(p);
        }

        public int getAnchorId() {
            return this.mAnchorId;
        }

        public void setAnchorId(int id) {
            invalidateAnchor();
            this.mAnchorId = id;
        }

        public Behavior getBehavior() {
            return this.mBehavior;
        }

        public void setBehavior(Behavior behavior) {
            if (this.mBehavior != behavior) {
                if (this.mBehavior != null) {
                    this.mBehavior.onDetachedFromLayoutParams();
                }
                this.mBehavior = behavior;
                this.mBehaviorTag = null;
                this.mBehaviorResolved = true;
                if (behavior != null) {
                    behavior.onAttachedToLayoutParams(this);
                }
            }
        }

        /* access modifiers changed from: package-private */
        public void setLastChildRect(Rect r) {
            this.mLastChildRect.set(r);
        }

        /* access modifiers changed from: package-private */
        public Rect getLastChildRect() {
            return this.mLastChildRect;
        }

        /* access modifiers changed from: package-private */
        public boolean checkAnchorChanged() {
            return this.mAnchorView == null && this.mAnchorId != -1;
        }

        /* access modifiers changed from: package-private */
        public boolean didBlockInteraction() {
            if (this.mBehavior == null) {
                this.mDidBlockInteraction = false;
            }
            return this.mDidBlockInteraction;
        }

        /* access modifiers changed from: package-private */
        public boolean isBlockingInteractionBelow(CoordinatorLayout parent, View child) {
            boolean z;
            if (this.mDidBlockInteraction) {
                return true;
            }
            boolean z2 = this.mDidBlockInteraction;
            if (this.mBehavior != null) {
                z = this.mBehavior.blocksInteractionBelow(parent, child);
            } else {
                z = false;
            }
            boolean z3 = z2 | z;
            this.mDidBlockInteraction = z3;
            return z3;
        }

        /* access modifiers changed from: package-private */
        public void resetTouchBehaviorTracking() {
            this.mDidBlockInteraction = false;
        }

        /* access modifiers changed from: package-private */
        public void resetNestedScroll(int type) {
            setNestedScrollAccepted(type, false);
        }

        /* access modifiers changed from: package-private */
        public void setNestedScrollAccepted(int type, boolean accept) {
            switch (type) {
                case 0:
                    this.mDidAcceptNestedScrollTouch = accept;
                    return;
                case 1:
                    this.mDidAcceptNestedScrollNonTouch = accept;
                    return;
                default:
                    return;
            }
        }

        /* access modifiers changed from: package-private */
        public boolean isNestedScrollAccepted(int type) {
            switch (type) {
                case 0:
                    return this.mDidAcceptNestedScrollTouch;
                case 1:
                    return this.mDidAcceptNestedScrollNonTouch;
                default:
                    return false;
            }
        }

        /* access modifiers changed from: package-private */
        public boolean getChangedAfterNestedScroll() {
            return this.mDidChangeAfterNestedScroll;
        }

        /* access modifiers changed from: package-private */
        public void setChangedAfterNestedScroll(boolean changed) {
            this.mDidChangeAfterNestedScroll = changed;
        }

        /* access modifiers changed from: package-private */
        public void resetChangedAfterNestedScroll() {
            this.mDidChangeAfterNestedScroll = false;
        }

        /* access modifiers changed from: package-private */
        public boolean dependsOn(CoordinatorLayout parent, View child, View dependency) {
            return dependency == this.mAnchorDirectChild || shouldDodge(dependency, parent.getLayoutDirection()) || (this.mBehavior != null && this.mBehavior.layoutDependsOn(parent, child, dependency));
        }

        /* access modifiers changed from: package-private */
        public void invalidateAnchor() {
            this.mAnchorDirectChild = null;
            this.mAnchorView = null;
        }

        /* access modifiers changed from: package-private */
        public View findAnchorView(CoordinatorLayout parent, View forChild) {
            if (this.mAnchorId == -1) {
                this.mAnchorDirectChild = null;
                this.mAnchorView = null;
                return null;
            }
            if (this.mAnchorView == null || !verifyAnchorView(forChild, parent)) {
                resolveAnchorView(forChild, parent);
            }
            return this.mAnchorView;
        }

        private void resolveAnchorView(View forChild, CoordinatorLayout parent) {
            this.mAnchorView = parent.findViewById(this.mAnchorId);
            if (this.mAnchorView != null) {
                if (this.mAnchorView != parent) {
                    View directChild = this.mAnchorView;
                    ViewParent p = this.mAnchorView.getParent();
                    while (p != parent && p != null) {
                        if (p != forChild) {
                            if (p instanceof View) {
                                directChild = (View) p;
                            }
                            p = p.getParent();
                        } else if (parent.isInEditMode()) {
                            this.mAnchorDirectChild = null;
                            this.mAnchorView = null;
                            return;
                        } else {
                            throw new IllegalStateException("Anchor must not be a descendant of the anchored view");
                        }
                    }
                    this.mAnchorDirectChild = directChild;
                } else if (parent.isInEditMode()) {
                    this.mAnchorDirectChild = null;
                    this.mAnchorView = null;
                } else {
                    throw new IllegalStateException("View can not be anchored to the the parent CoordinatorLayout");
                }
            } else if (parent.isInEditMode()) {
                this.mAnchorDirectChild = null;
                this.mAnchorView = null;
            } else {
                throw new IllegalStateException("Could not find CoordinatorLayout descendant view with id " + parent.getResources().getResourceName(this.mAnchorId) + " to anchor view " + forChild);
            }
        }

        private boolean verifyAnchorView(View forChild, CoordinatorLayout parent) {
            if (this.mAnchorView.getId() != this.mAnchorId) {
                return false;
            }
            View directChild = this.mAnchorView;
            for (ViewParent p = this.mAnchorView.getParent(); p != parent; p = p.getParent()) {
                if (p == null || p == forChild) {
                    this.mAnchorDirectChild = null;
                    this.mAnchorView = null;
                    return false;
                }
                if (p instanceof View) {
                    directChild = (View) p;
                }
            }
            this.mAnchorDirectChild = directChild;
            return true;
        }

        private boolean shouldDodge(View other, int layoutDirection) {
            int absInset = GravityCompat.getAbsoluteGravity(((LayoutParams) other.getLayoutParams()).insetEdge, layoutDirection);
            return absInset != 0 && (GravityCompat.getAbsoluteGravity(this.dodgeInsetEdges, layoutDirection) & absInset) == absInset;
        }
    }

    private class HierarchyChangeListener implements ViewGroup.OnHierarchyChangeListener {
        HierarchyChangeListener() {
        }

        public void onChildViewAdded(View parent, View child) {
            if (CoordinatorLayout.this.mOnHierarchyChangeListener != null) {
                CoordinatorLayout.this.mOnHierarchyChangeListener.onChildViewAdded(parent, child);
            }
        }

        public void onChildViewRemoved(View parent, View child) {
            CoordinatorLayout.this.onChildViewsChanged(2);
            if (CoordinatorLayout.this.mOnHierarchyChangeListener != null) {
                CoordinatorLayout.this.mOnHierarchyChangeListener.onChildViewRemoved(parent, child);
            }
        }
    }

    /* access modifiers changed from: protected */
    public void onRestoreInstanceState(Parcelable state) {
        Parcelable savedState;
        if (!(state instanceof SavedState)) {
            super.onRestoreInstanceState(state);
            return;
        }
        SavedState ss = (SavedState) state;
        super.onRestoreInstanceState(ss.getSuperState());
        SparseArray<Parcelable> behaviorStates = ss.behaviorStates;
        int count = getChildCount();
        for (int i = 0; i < count; i++) {
            View child = getChildAt(i);
            int childId = child.getId();
            Behavior b = getResolvedLayoutParams(child).getBehavior();
            if (!(childId == -1 || b == null || (savedState = behaviorStates.get(childId)) == null)) {
                b.onRestoreInstanceState(this, child, savedState);
            }
        }
    }

    /* access modifiers changed from: protected */
    public Parcelable onSaveInstanceState() {
        Parcelable state;
        SavedState ss = new SavedState(super.onSaveInstanceState());
        SparseArray<Parcelable> behaviorStates = new SparseArray<>();
        int count = getChildCount();
        for (int i = 0; i < count; i++) {
            View child = getChildAt(i);
            int childId = child.getId();
            Behavior b = ((LayoutParams) child.getLayoutParams()).getBehavior();
            if (!(childId == -1 || b == null || (state = b.onSaveInstanceState(this, child)) == null)) {
                behaviorStates.append(childId, state);
            }
        }
        ss.behaviorStates = behaviorStates;
        return ss;
    }

    public boolean requestChildRectangleOnScreen(View child, Rect rectangle, boolean immediate) {
        Behavior behavior = ((LayoutParams) child.getLayoutParams()).getBehavior();
        if (behavior == null || !behavior.onRequestChildRectangleOnScreen(this, child, rectangle, immediate)) {
            return super.requestChildRectangleOnScreen(child, rectangle, immediate);
        }
        return true;
    }

    private void setupForInsets() {
        if (ViewCompat.getFitsSystemWindows(this)) {
            if (this.mApplyWindowInsetsListener == null) {
                this.mApplyWindowInsetsListener = new OnApplyWindowInsetsListener() {
                    public WindowInsetsCompat onApplyWindowInsets(View v, WindowInsetsCompat insets) {
                        return CoordinatorLayout.this.setWindowInsets(insets);
                    }
                };
            }
            ViewCompat.setOnApplyWindowInsetsListener(this, this.mApplyWindowInsetsListener);
            setSystemUiVisibility(1280);
            return;
        }
        ViewCompat.setOnApplyWindowInsetsListener(this, (OnApplyWindowInsetsListener) null);
    }

    protected static class SavedState extends AbsSavedState {
        public static final Parcelable.Creator<SavedState> CREATOR = new Parcelable.ClassLoaderCreator<SavedState>() {
            public SavedState createFromParcel(Parcel in, ClassLoader loader) {
                return new SavedState(in, loader);
            }

            public SavedState createFromParcel(Parcel in) {
                return new SavedState(in, (ClassLoader) null);
            }

            public SavedState[] newArray(int size) {
                return new SavedState[size];
            }
        };
        SparseArray<Parcelable> behaviorStates;

        public SavedState(Parcel source, ClassLoader loader) {
            super(source, loader);
            int size = source.readInt();
            int[] ids = new int[size];
            source.readIntArray(ids);
            Parcelable[] states = source.readParcelableArray(loader);
            this.behaviorStates = new SparseArray<>(size);
            for (int i = 0; i < size; i++) {
                this.behaviorStates.append(ids[i], states[i]);
            }
        }

        public SavedState(Parcelable superState) {
            super(superState);
        }

        public void writeToParcel(Parcel dest, int flags) {
            super.writeToParcel(dest, flags);
            int size = this.behaviorStates != null ? this.behaviorStates.size() : 0;
            dest.writeInt(size);
            int[] ids = new int[size];
            Parcelable[] states = new Parcelable[size];
            for (int i = 0; i < size; i++) {
                ids[i] = this.behaviorStates.keyAt(i);
                states[i] = this.behaviorStates.valueAt(i);
            }
            dest.writeIntArray(ids);
            dest.writeParcelableArray(states, flags);
        }
    }
}
