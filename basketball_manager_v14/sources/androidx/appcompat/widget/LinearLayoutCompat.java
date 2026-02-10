package androidx.appcompat.widget;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.view.inspector.InspectionCompanion;
import android.view.inspector.PropertyMapper;
import android.view.inspector.PropertyReader;
import android.widget.LinearLayout;
import androidx.appcompat.R;
import androidx.core.view.GravityCompat;
import androidx.core.view.ViewCompat;
import com.getcapacitor.PluginMethod;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.HashSet;
import java.util.Set;
import java.util.function.IntFunction;

public class LinearLayoutCompat extends ViewGroup {
    private static final String ACCESSIBILITY_CLASS_NAME = "androidx.appcompat.widget.LinearLayoutCompat";
    public static final int HORIZONTAL = 0;
    private static final int INDEX_BOTTOM = 2;
    private static final int INDEX_CENTER_VERTICAL = 0;
    private static final int INDEX_FILL = 3;
    private static final int INDEX_TOP = 1;
    public static final int SHOW_DIVIDER_BEGINNING = 1;
    public static final int SHOW_DIVIDER_END = 4;
    public static final int SHOW_DIVIDER_MIDDLE = 2;
    public static final int SHOW_DIVIDER_NONE = 0;
    public static final int VERTICAL = 1;
    private static final int VERTICAL_GRAVITY_COUNT = 4;
    private boolean mBaselineAligned;
    private int mBaselineAlignedChildIndex;
    private int mBaselineChildTop;
    private Drawable mDivider;
    private int mDividerHeight;
    private int mDividerPadding;
    private int mDividerWidth;
    private int mGravity;
    private int[] mMaxAscent;
    private int[] mMaxDescent;
    private int mOrientation;
    private int mShowDividers;
    private int mTotalLength;
    private boolean mUseLargestChild;
    private float mWeightSum;

    @Retention(RetentionPolicy.SOURCE)
    public @interface DividerMode {
    }

    @Retention(RetentionPolicy.SOURCE)
    public @interface OrientationMode {
    }

    public final class InspectionCompanion implements android.view.inspector.InspectionCompanion<LinearLayoutCompat> {
        private int mBaselineAlignedChildIndexId;
        private int mBaselineAlignedId;
        private int mDividerId;
        private int mDividerPaddingId;
        private int mGravityId;
        private int mMeasureWithLargestChildId;
        private int mOrientationId;
        private boolean mPropertiesMapped = false;
        private int mShowDividersId;
        private int mWeightSumId;

        public void mapProperties(PropertyMapper propertyMapper) {
            this.mBaselineAlignedId = propertyMapper.mapBoolean("baselineAligned", 16843046);
            this.mBaselineAlignedChildIndexId = propertyMapper.mapInt("baselineAlignedChildIndex", 16843047);
            this.mGravityId = propertyMapper.mapGravity("gravity", 16842927);
            this.mOrientationId = propertyMapper.mapIntEnum("orientation", 16842948, new IntFunction<String>() {
                public String apply(int value) {
                    switch (value) {
                        case 0:
                            return "horizontal";
                        case 1:
                            return "vertical";
                        default:
                            return String.valueOf(value);
                    }
                }
            });
            this.mWeightSumId = propertyMapper.mapFloat("weightSum", 16843048);
            this.mDividerId = propertyMapper.mapObject("divider", R.attr.divider);
            this.mDividerPaddingId = propertyMapper.mapInt("dividerPadding", R.attr.dividerPadding);
            this.mMeasureWithLargestChildId = propertyMapper.mapBoolean("measureWithLargestChild", R.attr.measureWithLargestChild);
            this.mShowDividersId = propertyMapper.mapIntFlag("showDividers", R.attr.showDividers, new IntFunction<Set<String>>() {
                public Set<String> apply(int value) {
                    Set<String> flags = new HashSet<>();
                    if (value == 0) {
                        flags.add(PluginMethod.RETURN_NONE);
                    }
                    if (value == 1) {
                        flags.add("beginning");
                    }
                    if (value == 2) {
                        flags.add("middle");
                    }
                    if (value == 4) {
                        flags.add("end");
                    }
                    return flags;
                }
            });
            this.mPropertiesMapped = true;
        }

        public void readProperties(LinearLayoutCompat linearLayoutCompat, PropertyReader propertyReader) {
            if (this.mPropertiesMapped) {
                propertyReader.readBoolean(this.mBaselineAlignedId, linearLayoutCompat.isBaselineAligned());
                propertyReader.readInt(this.mBaselineAlignedChildIndexId, linearLayoutCompat.getBaselineAlignedChildIndex());
                propertyReader.readGravity(this.mGravityId, linearLayoutCompat.getGravity());
                propertyReader.readIntEnum(this.mOrientationId, linearLayoutCompat.getOrientation());
                propertyReader.readFloat(this.mWeightSumId, linearLayoutCompat.getWeightSum());
                propertyReader.readObject(this.mDividerId, linearLayoutCompat.getDividerDrawable());
                propertyReader.readInt(this.mDividerPaddingId, linearLayoutCompat.getDividerPadding());
                propertyReader.readBoolean(this.mMeasureWithLargestChildId, linearLayoutCompat.isMeasureWithLargestChildEnabled());
                propertyReader.readIntFlag(this.mShowDividersId, linearLayoutCompat.getShowDividers());
                return;
            }
            throw new InspectionCompanion.UninitializedPropertyMapException();
        }
    }

    public LinearLayoutCompat(Context context) {
        this(context, (AttributeSet) null);
    }

    public LinearLayoutCompat(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public LinearLayoutCompat(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        this.mBaselineAligned = true;
        this.mBaselineAlignedChildIndex = -1;
        this.mBaselineChildTop = 0;
        this.mGravity = 8388659;
        TintTypedArray a = TintTypedArray.obtainStyledAttributes(context, attrs, R.styleable.LinearLayoutCompat, defStyleAttr, 0);
        ViewCompat.saveAttributeDataForStyleable(this, context, R.styleable.LinearLayoutCompat, attrs, a.getWrappedTypeArray(), defStyleAttr, 0);
        int index = a.getInt(R.styleable.LinearLayoutCompat_android_orientation, -1);
        if (index >= 0) {
            setOrientation(index);
        }
        int index2 = a.getInt(R.styleable.LinearLayoutCompat_android_gravity, -1);
        if (index2 >= 0) {
            setGravity(index2);
        }
        boolean baselineAligned = a.getBoolean(R.styleable.LinearLayoutCompat_android_baselineAligned, true);
        if (!baselineAligned) {
            setBaselineAligned(baselineAligned);
        }
        this.mWeightSum = a.getFloat(R.styleable.LinearLayoutCompat_android_weightSum, -1.0f);
        this.mBaselineAlignedChildIndex = a.getInt(R.styleable.LinearLayoutCompat_android_baselineAlignedChildIndex, -1);
        this.mUseLargestChild = a.getBoolean(R.styleable.LinearLayoutCompat_measureWithLargestChild, false);
        setDividerDrawable(a.getDrawable(R.styleable.LinearLayoutCompat_divider));
        this.mShowDividers = a.getInt(R.styleable.LinearLayoutCompat_showDividers, 0);
        this.mDividerPadding = a.getDimensionPixelSize(R.styleable.LinearLayoutCompat_dividerPadding, 0);
        a.recycle();
    }

    public void setShowDividers(int showDividers) {
        if (showDividers != this.mShowDividers) {
            requestLayout();
        }
        this.mShowDividers = showDividers;
    }

    public boolean shouldDelayChildPressedState() {
        return false;
    }

    public int getShowDividers() {
        return this.mShowDividers;
    }

    public Drawable getDividerDrawable() {
        return this.mDivider;
    }

    public void setDividerDrawable(Drawable divider) {
        if (divider != this.mDivider) {
            this.mDivider = divider;
            boolean z = false;
            if (divider != null) {
                this.mDividerWidth = divider.getIntrinsicWidth();
                this.mDividerHeight = divider.getIntrinsicHeight();
            } else {
                this.mDividerWidth = 0;
                this.mDividerHeight = 0;
            }
            if (divider == null) {
                z = true;
            }
            setWillNotDraw(z);
            requestLayout();
        }
    }

    public void setDividerPadding(int padding) {
        this.mDividerPadding = padding;
    }

    public int getDividerPadding() {
        return this.mDividerPadding;
    }

    public int getDividerWidth() {
        return this.mDividerWidth;
    }

    /* access modifiers changed from: protected */
    public void onDraw(Canvas canvas) {
        if (this.mDivider != null) {
            if (this.mOrientation == 1) {
                drawDividersVertical(canvas);
            } else {
                drawDividersHorizontal(canvas);
            }
        }
    }

    /* access modifiers changed from: package-private */
    public void drawDividersVertical(Canvas canvas) {
        int bottom;
        int count = getVirtualChildCount();
        for (int i = 0; i < count; i++) {
            View child = getVirtualChildAt(i);
            if (!(child == null || child.getVisibility() == 8 || !hasDividerBeforeChildAt(i))) {
                drawHorizontalDivider(canvas, (child.getTop() - ((LayoutParams) child.getLayoutParams()).topMargin) - this.mDividerHeight);
            }
        }
        if (hasDividerBeforeChildAt(count) != 0) {
            View child2 = getVirtualChildAt(count - 1);
            if (child2 == null) {
                bottom = (getHeight() - getPaddingBottom()) - this.mDividerHeight;
            } else {
                bottom = child2.getBottom() + ((LayoutParams) child2.getLayoutParams()).bottomMargin;
            }
            drawHorizontalDivider(canvas, bottom);
        }
    }

    /* access modifiers changed from: package-private */
    public void drawDividersHorizontal(Canvas canvas) {
        int position;
        int position2;
        int count = getVirtualChildCount();
        boolean isLayoutRtl = ViewUtils.isLayoutRtl(this);
        for (int i = 0; i < count; i++) {
            View child = getVirtualChildAt(i);
            if (!(child == null || child.getVisibility() == 8 || !hasDividerBeforeChildAt(i))) {
                LayoutParams lp = (LayoutParams) child.getLayoutParams();
                if (isLayoutRtl) {
                    position2 = child.getRight() + lp.rightMargin;
                } else {
                    position2 = (child.getLeft() - lp.leftMargin) - this.mDividerWidth;
                }
                drawVerticalDivider(canvas, position2);
            }
        }
        if (hasDividerBeforeChildAt(count) != 0) {
            View child2 = getVirtualChildAt(count - 1);
            if (child2 != null) {
                LayoutParams lp2 = (LayoutParams) child2.getLayoutParams();
                if (isLayoutRtl) {
                    position = (child2.getLeft() - lp2.leftMargin) - this.mDividerWidth;
                } else {
                    position = child2.getRight() + lp2.rightMargin;
                }
            } else if (isLayoutRtl) {
                position = getPaddingLeft();
            } else {
                position = (getWidth() - getPaddingRight()) - this.mDividerWidth;
            }
            drawVerticalDivider(canvas, position);
        }
    }

    /* access modifiers changed from: package-private */
    public void drawHorizontalDivider(Canvas canvas, int top) {
        this.mDivider.setBounds(getPaddingLeft() + this.mDividerPadding, top, (getWidth() - getPaddingRight()) - this.mDividerPadding, this.mDividerHeight + top);
        this.mDivider.draw(canvas);
    }

    /* access modifiers changed from: package-private */
    public void drawVerticalDivider(Canvas canvas, int left) {
        this.mDivider.setBounds(left, getPaddingTop() + this.mDividerPadding, this.mDividerWidth + left, (getHeight() - getPaddingBottom()) - this.mDividerPadding);
        this.mDivider.draw(canvas);
    }

    public boolean isBaselineAligned() {
        return this.mBaselineAligned;
    }

    public void setBaselineAligned(boolean baselineAligned) {
        this.mBaselineAligned = baselineAligned;
    }

    public boolean isMeasureWithLargestChildEnabled() {
        return this.mUseLargestChild;
    }

    public void setMeasureWithLargestChildEnabled(boolean enabled) {
        this.mUseLargestChild = enabled;
    }

    public int getBaseline() {
        int majorGravity;
        if (this.mBaselineAlignedChildIndex < 0) {
            return super.getBaseline();
        }
        if (getChildCount() > this.mBaselineAlignedChildIndex) {
            View child = getChildAt(this.mBaselineAlignedChildIndex);
            int childBaseline = child.getBaseline();
            if (childBaseline != -1) {
                int childTop = this.mBaselineChildTop;
                if (this.mOrientation == 1 && (majorGravity = this.mGravity & 112) != 48) {
                    switch (majorGravity) {
                        case 16:
                            childTop += ((((getBottom() - getTop()) - getPaddingTop()) - getPaddingBottom()) - this.mTotalLength) / 2;
                            break;
                        case 80:
                            childTop = ((getBottom() - getTop()) - getPaddingBottom()) - this.mTotalLength;
                            break;
                    }
                }
                return ((LayoutParams) child.getLayoutParams()).topMargin + childTop + childBaseline;
            } else if (this.mBaselineAlignedChildIndex == 0) {
                return -1;
            } else {
                throw new RuntimeException("mBaselineAlignedChildIndex of LinearLayout points to a View that doesn't know how to get its baseline.");
            }
        } else {
            throw new RuntimeException("mBaselineAlignedChildIndex of LinearLayout set to an index that is out of bounds.");
        }
    }

    public int getBaselineAlignedChildIndex() {
        return this.mBaselineAlignedChildIndex;
    }

    public void setBaselineAlignedChildIndex(int i) {
        if (i < 0 || i >= getChildCount()) {
            throw new IllegalArgumentException("base aligned child index out of range (0, " + getChildCount() + ")");
        }
        this.mBaselineAlignedChildIndex = i;
    }

    /* access modifiers changed from: package-private */
    public View getVirtualChildAt(int index) {
        return getChildAt(index);
    }

    /* access modifiers changed from: package-private */
    public int getVirtualChildCount() {
        return getChildCount();
    }

    public float getWeightSum() {
        return this.mWeightSum;
    }

    public void setWeightSum(float weightSum) {
        this.mWeightSum = Math.max(0.0f, weightSum);
    }

    /* access modifiers changed from: protected */
    public void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        if (this.mOrientation == 1) {
            measureVertical(widthMeasureSpec, heightMeasureSpec);
        } else {
            measureHorizontal(widthMeasureSpec, heightMeasureSpec);
        }
    }

    /* access modifiers changed from: protected */
    public boolean hasDividerBeforeChildAt(int childIndex) {
        if (childIndex == 0) {
            if ((this.mShowDividers & 1) != 0) {
                return true;
            }
            return false;
        } else if (childIndex == getChildCount()) {
            if ((this.mShowDividers & 4) != 0) {
                return true;
            }
            return false;
        } else if ((this.mShowDividers & 2) == 0) {
            return false;
        } else {
            for (int i = childIndex - 1; i >= 0; i--) {
                if (getChildAt(i).getVisibility() != 8) {
                    return true;
                }
            }
            return false;
        }
    }

    /* access modifiers changed from: package-private */
    /* JADX WARNING: Removed duplicated region for block: B:156:0x03b0  */
    /* JADX WARNING: Removed duplicated region for block: B:157:0x03b3  */
    /* JADX WARNING: Removed duplicated region for block: B:160:0x03ba  */
    /* JADX WARNING: Removed duplicated region for block: B:163:0x03c4  */
    /* JADX WARNING: Removed duplicated region for block: B:174:0x0430  */
    /* JADX WARNING: Removed duplicated region for block: B:192:? A[RETURN, SYNTHETIC] */
    /* JADX WARNING: Removed duplicated region for block: B:59:0x016a  */
    /* JADX WARNING: Removed duplicated region for block: B:63:0x0179  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public void measureVertical(int r39, int r40) {
        /*
            r38 = this;
            r0 = r38
            r7 = 0
            r0.mTotalLength = r7
            r1 = 0
            r2 = 0
            r3 = 0
            r4 = 0
            r5 = 1
            r6 = 0
            int r8 = r0.getVirtualChildCount()
            int r9 = android.view.View.MeasureSpec.getMode(r39)
            int r10 = android.view.View.MeasureSpec.getMode(r40)
            r11 = 0
            r12 = 0
            int r13 = r0.mBaselineAlignedChildIndex
            boolean r14 = r0.mUseLargestChild
            r15 = 0
            r16 = 0
            r17 = r11
            r18 = r12
            r11 = r1
            r12 = r2
            r1 = r15
            r2 = r16
            r15 = r3
            r16 = r5
        L_0x002c:
            r3 = 8
            r20 = 1
            r21 = 0
            r7 = 1073741824(0x40000000, float:2.0)
            if (r2 >= r8) goto L_0x019d
            r23 = r1
            android.view.View r1 = r0.getVirtualChildAt(r2)
            if (r1 != 0) goto L_0x0055
            int r3 = r0.mTotalLength
            int r5 = r0.measureNullChild(r2)
            int r3 = r3 + r5
            r0.mTotalLength = r3
            r1 = r39
            r5 = r40
            r19 = r10
            r27 = r14
            r14 = r23
            r23 = r8
            goto L_0x0191
        L_0x0055:
            int r5 = r1.getVisibility()
            if (r5 != r3) goto L_0x006e
            int r3 = r0.getChildrenSkipCount(r1, r2)
            int r2 = r2 + r3
            r1 = r39
            r5 = r40
            r19 = r10
            r27 = r14
            r14 = r23
            r23 = r8
            goto L_0x0191
        L_0x006e:
            boolean r3 = r0.hasDividerBeforeChildAt(r2)
            if (r3 == 0) goto L_0x007b
            int r3 = r0.mTotalLength
            int r5 = r0.mDividerHeight
            int r3 = r3 + r5
            r0.mTotalLength = r3
        L_0x007b:
            android.view.ViewGroup$LayoutParams r3 = r1.getLayoutParams()
            androidx.appcompat.widget.LinearLayoutCompat$LayoutParams r3 = (androidx.appcompat.widget.LinearLayoutCompat.LayoutParams) r3
            float r5 = r3.weight
            float r25 = r6 + r5
            if (r10 != r7) goto L_0x00b4
            int r5 = r3.height
            if (r5 != 0) goto L_0x00b4
            float r5 = r3.weight
            int r5 = (r5 > r21 ? 1 : (r5 == r21 ? 0 : -1))
            if (r5 <= 0) goto L_0x00b4
            int r5 = r0.mTotalLength
            int r6 = r3.topMargin
            int r6 = r6 + r5
            int r7 = r3.bottomMargin
            int r6 = r6 + r7
            int r6 = java.lang.Math.max(r5, r6)
            r0.mTotalLength = r6
            r18 = 1
            r5 = r40
            r19 = r10
            r27 = r14
            r24 = r15
            r14 = r23
            r10 = r4
            r23 = r8
            r8 = r3
            r3 = r1
            r1 = r39
            goto L_0x0113
        L_0x00b4:
            r5 = -2147483648(0xffffffff80000000, float:-0.0)
            int r6 = r3.height
            if (r6 != 0) goto L_0x00c6
            float r6 = r3.weight
            int r6 = (r6 > r21 ? 1 : (r6 == r21 ? 0 : -1))
            if (r6 <= 0) goto L_0x00c6
            r5 = 0
            r6 = -2
            r3.height = r6
            r7 = r5
            goto L_0x00c7
        L_0x00c6:
            r7 = r5
        L_0x00c7:
            int r5 = (r25 > r21 ? 1 : (r25 == r21 ? 0 : -1))
            if (r5 != 0) goto L_0x00d0
            int r5 = r0.mTotalLength
            r6 = r5
            goto L_0x00d1
        L_0x00d0:
            r6 = 0
        L_0x00d1:
            r5 = r4
            r4 = 0
            r19 = r10
            r27 = r14
            r24 = r15
            r14 = r23
            r15 = -2147483648(0xffffffff80000000, float:-0.0)
            r10 = r5
            r23 = r8
            r5 = r40
            r8 = r3
            r3 = r39
            r0.measureChildBeforeLayout(r1, r2, r3, r4, r5, r6)
            r37 = r3
            r3 = r1
            r1 = r37
            if (r7 == r15) goto L_0x00f1
            r8.height = r7
        L_0x00f1:
            int r4 = r3.getMeasuredHeight()
            int r6 = r0.mTotalLength
            int r15 = r6 + r4
            r29 = r7
            int r7 = r8.topMargin
            int r15 = r15 + r7
            int r7 = r8.bottomMargin
            int r15 = r15 + r7
            int r7 = r0.getNextLocationOffset(r3)
            int r15 = r15 + r7
            int r7 = java.lang.Math.max(r6, r15)
            r0.mTotalLength = r7
            if (r27 == 0) goto L_0x0113
            int r7 = java.lang.Math.max(r4, r14)
            r14 = r7
        L_0x0113:
            if (r13 < 0) goto L_0x011d
            int r4 = r2 + 1
            if (r13 != r4) goto L_0x011d
            int r4 = r0.mTotalLength
            r0.mBaselineChildTop = r4
        L_0x011d:
            if (r2 >= r13) goto L_0x012e
            float r4 = r8.weight
            int r4 = (r4 > r21 ? 1 : (r4 == r21 ? 0 : -1))
            if (r4 > 0) goto L_0x0126
            goto L_0x012e
        L_0x0126:
            java.lang.RuntimeException r4 = new java.lang.RuntimeException
            java.lang.String r6 = "A child of LinearLayout with index less than mBaselineAlignedChildIndex has weight > 0, which won't work.  Either remove the weight, or don't set mBaselineAlignedChildIndex."
            r4.<init>(r6)
            throw r4
        L_0x012e:
            r4 = 0
            r6 = 1073741824(0x40000000, float:2.0)
            if (r9 == r6) goto L_0x013c
            int r6 = r8.width
            r7 = -1
            if (r6 != r7) goto L_0x013d
            r17 = 1
            r4 = 1
            goto L_0x013d
        L_0x013c:
            r7 = -1
        L_0x013d:
            int r6 = r8.leftMargin
            int r15 = r8.rightMargin
            int r6 = r6 + r15
            int r15 = r3.getMeasuredWidth()
            int r15 = r15 + r6
            int r11 = java.lang.Math.max(r11, r15)
            int r7 = r3.getMeasuredState()
            int r7 = android.view.View.combineMeasuredStates(r12, r7)
            if (r16 == 0) goto L_0x0160
            int r12 = r8.width
            r26 = r4
            r4 = -1
            if (r12 != r4) goto L_0x0162
            r4 = r20
            goto L_0x0163
        L_0x0160:
            r26 = r4
        L_0x0162:
            r4 = 0
        L_0x0163:
            float r12 = r8.weight
            int r12 = (r12 > r21 ? 1 : (r12 == r21 ? 0 : -1))
            if (r12 <= 0) goto L_0x0178
            if (r26 == 0) goto L_0x016e
            r12 = r6
            goto L_0x016f
        L_0x016e:
            r12 = r15
        L_0x016f:
            int r10 = java.lang.Math.max(r10, r12)
            r28 = r15
            r15 = r24
            goto L_0x0186
        L_0x0178:
            if (r26 == 0) goto L_0x017d
            r12 = r6
            goto L_0x017e
        L_0x017d:
            r12 = r15
        L_0x017e:
            r28 = r15
            r15 = r24
            int r15 = java.lang.Math.max(r15, r12)
        L_0x0186:
            int r12 = r0.getChildrenSkipCount(r3, r2)
            int r2 = r2 + r12
            r16 = r4
            r12 = r7
            r4 = r10
            r6 = r25
        L_0x0191:
            int r2 = r2 + 1
            r1 = r14
            r10 = r19
            r8 = r23
            r14 = r27
            r7 = 0
            goto L_0x002c
        L_0x019d:
            r5 = r40
            r23 = r8
            r19 = r10
            r27 = r14
            r14 = r1
            r10 = r4
            r4 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r39
            int r2 = r0.mTotalLength
            if (r2 <= 0) goto L_0x01bf
            r2 = r23
            boolean r7 = r0.hasDividerBeforeChildAt(r2)
            if (r7 == 0) goto L_0x01c1
            int r7 = r0.mTotalLength
            int r8 = r0.mDividerHeight
            int r7 = r7 + r8
            r0.mTotalLength = r7
            goto L_0x01c1
        L_0x01bf:
            r2 = r23
        L_0x01c1:
            if (r27 == 0) goto L_0x0227
            r7 = r19
            if (r7 == r4) goto L_0x01cd
            if (r7 != 0) goto L_0x01ca
            goto L_0x01cd
        L_0x01ca:
            r23 = r6
            goto L_0x022b
        L_0x01cd:
            r4 = 0
            r0.mTotalLength = r4
            r4 = 0
        L_0x01d1:
            if (r4 >= r2) goto L_0x0222
            android.view.View r8 = r0.getVirtualChildAt(r4)
            if (r8 != 0) goto L_0x01e8
            int r3 = r0.mTotalLength
            int r23 = r0.measureNullChild(r4)
            int r3 = r3 + r23
            r0.mTotalLength = r3
            r25 = r4
            r23 = r6
            goto L_0x0219
        L_0x01e8:
            int r3 = r8.getVisibility()
            r23 = r6
            r6 = 8
            if (r3 != r6) goto L_0x01f8
            int r3 = r0.getChildrenSkipCount(r8, r4)
            int r4 = r4 + r3
            goto L_0x021b
        L_0x01f8:
            android.view.ViewGroup$LayoutParams r3 = r8.getLayoutParams()
            androidx.appcompat.widget.LinearLayoutCompat$LayoutParams r3 = (androidx.appcompat.widget.LinearLayoutCompat.LayoutParams) r3
            int r6 = r0.mTotalLength
            int r24 = r6 + r14
            r25 = r4
            int r4 = r3.topMargin
            int r24 = r24 + r4
            int r4 = r3.bottomMargin
            int r24 = r24 + r4
            int r4 = r0.getNextLocationOffset(r8)
            int r4 = r24 + r4
            int r4 = java.lang.Math.max(r6, r4)
            r0.mTotalLength = r4
        L_0x0219:
            r4 = r25
        L_0x021b:
            int r4 = r4 + 1
            r6 = r23
            r3 = 8
            goto L_0x01d1
        L_0x0222:
            r25 = r4
            r23 = r6
            goto L_0x022b
        L_0x0227:
            r23 = r6
            r7 = r19
        L_0x022b:
            int r3 = r0.mTotalLength
            int r4 = r0.getPaddingTop()
            int r6 = r0.getPaddingBottom()
            int r4 = r4 + r6
            int r3 = r3 + r4
            r0.mTotalLength = r3
            int r3 = r0.mTotalLength
            int r4 = r0.getSuggestedMinimumHeight()
            int r3 = java.lang.Math.max(r3, r4)
            r4 = 0
            int r6 = android.view.View.resolveSizeAndState(r3, r5, r4)
            r4 = 16777215(0xffffff, float:2.3509886E-38)
            r3 = r6 & r4
            int r4 = r0.mTotalLength
            int r4 = r3 - r4
            if (r18 != 0) goto L_0x02de
            if (r4 == 0) goto L_0x0261
            int r8 = (r23 > r21 ? 1 : (r23 == r21 ? 0 : -1))
            if (r8 <= 0) goto L_0x0261
            r24 = r3
            r25 = r4
            r29 = r10
            goto L_0x02e4
        L_0x0261:
            int r8 = java.lang.Math.max(r15, r10)
            if (r27 == 0) goto L_0x02cc
            r15 = 1073741824(0x40000000, float:2.0)
            if (r7 == r15) goto L_0x02cc
            r15 = 0
        L_0x026c:
            if (r15 >= r2) goto L_0x02c3
            r24 = r3
            android.view.View r3 = r0.getVirtualChildAt(r15)
            if (r3 == 0) goto L_0x02b2
            r25 = r4
            int r4 = r3.getVisibility()
            r20 = r8
            r8 = 8
            if (r4 != r8) goto L_0x0285
            r29 = r10
            goto L_0x02b8
        L_0x0285:
            android.view.ViewGroup$LayoutParams r4 = r3.getLayoutParams()
            androidx.appcompat.widget.LinearLayoutCompat$LayoutParams r4 = (androidx.appcompat.widget.LinearLayoutCompat.LayoutParams) r4
            float r8 = r4.weight
            int r22 = (r8 > r21 ? 1 : (r8 == r21 ? 0 : -1))
            if (r22 <= 0) goto L_0x02ab
            r22 = r4
            int r4 = r3.getMeasuredWidth()
            r28 = r8
            r8 = 1073741824(0x40000000, float:2.0)
            int r4 = android.view.View.MeasureSpec.makeMeasureSpec(r4, r8)
            r29 = r10
            int r10 = android.view.View.MeasureSpec.makeMeasureSpec(r14, r8)
            r3.measure(r4, r10)
            goto L_0x02b8
        L_0x02ab:
            r22 = r4
            r28 = r8
            r29 = r10
            goto L_0x02b8
        L_0x02b2:
            r25 = r4
            r20 = r8
            r29 = r10
        L_0x02b8:
            int r15 = r15 + 1
            r8 = r20
            r3 = r24
            r4 = r25
            r10 = r29
            goto L_0x026c
        L_0x02c3:
            r24 = r3
            r25 = r4
            r20 = r8
            r29 = r10
            goto L_0x02d4
        L_0x02cc:
            r24 = r3
            r25 = r4
            r20 = r8
            r29 = r10
        L_0x02d4:
            r34 = r7
            r35 = r13
            r8 = r20
            r4 = r25
            goto L_0x040e
        L_0x02de:
            r24 = r3
            r25 = r4
            r29 = r10
        L_0x02e4:
            float r3 = r0.mWeightSum
            int r3 = (r3 > r21 ? 1 : (r3 == r21 ? 0 : -1))
            if (r3 <= 0) goto L_0x02ed
            float r3 = r0.mWeightSum
            goto L_0x02ef
        L_0x02ed:
            r3 = r23
        L_0x02ef:
            r4 = 0
            r0.mTotalLength = r4
            r8 = 0
            r10 = r8
            r8 = r25
        L_0x02f6:
            if (r10 >= r2) goto L_0x03f6
            android.view.View r4 = r0.getVirtualChildAt(r10)
            r25 = r3
            int r3 = r4.getVisibility()
            r30 = r10
            r10 = 8
            if (r3 != r10) goto L_0x0310
            r34 = r7
            r35 = r13
            r3 = r25
            goto L_0x03ed
        L_0x0310:
            android.view.ViewGroup$LayoutParams r3 = r4.getLayoutParams()
            androidx.appcompat.widget.LinearLayoutCompat$LayoutParams r3 = (androidx.appcompat.widget.LinearLayoutCompat.LayoutParams) r3
            float r10 = r3.weight
            int r31 = (r10 > r21 ? 1 : (r10 == r21 ? 0 : -1))
            if (r31 <= 0) goto L_0x0388
            r31 = r10
            float r10 = (float) r8
            float r10 = r10 * r31
            float r10 = r10 / r25
            int r10 = (int) r10
            float r25 = r25 - r31
            int r8 = r8 - r10
            int r32 = r0.getPaddingLeft()
            int r33 = r0.getPaddingRight()
            int r32 = r32 + r33
            r33 = r8
            int r8 = r3.leftMargin
            int r32 = r32 + r8
            int r8 = r3.rightMargin
            int r8 = r32 + r8
            r32 = r10
            int r10 = r3.width
            int r8 = getChildMeasureSpec(r1, r8, r10)
            int r10 = r3.height
            if (r10 != 0) goto L_0x0362
            r10 = 1073741824(0x40000000, float:2.0)
            if (r7 == r10) goto L_0x034f
            r34 = r7
            goto L_0x0364
        L_0x034f:
            r34 = r7
            if (r32 <= 0) goto L_0x0357
            r7 = r32
            goto L_0x0358
        L_0x0357:
            r7 = 0
        L_0x0358:
            int r7 = android.view.View.MeasureSpec.makeMeasureSpec(r7, r10)
            r4.measure(r8, r7)
            r35 = r13
            goto L_0x037a
        L_0x0362:
            r34 = r7
        L_0x0364:
            int r7 = r4.getMeasuredHeight()
            int r7 = r7 + r32
            if (r7 >= 0) goto L_0x036d
            r7 = 0
        L_0x036d:
            r35 = r13
            r10 = 1073741824(0x40000000, float:2.0)
            int r13 = android.view.View.MeasureSpec.makeMeasureSpec(r7, r10)
            r4.measure(r8, r13)
        L_0x037a:
            int r7 = r4.getMeasuredState()
            r7 = r7 & -256(0xffffffffffffff00, float:NaN)
            int r12 = android.view.View.combineMeasuredStates(r12, r7)
            r8 = r33
            goto L_0x038e
        L_0x0388:
            r34 = r7
            r31 = r10
            r35 = r13
        L_0x038e:
            int r7 = r3.leftMargin
            int r10 = r3.rightMargin
            int r7 = r7 + r10
            int r10 = r4.getMeasuredWidth()
            int r10 = r10 + r7
            int r11 = java.lang.Math.max(r11, r10)
            r13 = 1073741824(0x40000000, float:2.0)
            if (r9 == r13) goto L_0x03aa
            int r13 = r3.width
            r32 = r7
            r7 = -1
            if (r13 != r7) goto L_0x03ac
            r7 = r20
            goto L_0x03ad
        L_0x03aa:
            r32 = r7
        L_0x03ac:
            r7 = 0
        L_0x03ad:
            if (r7 == 0) goto L_0x03b3
            r13 = r32
            goto L_0x03b4
        L_0x03b3:
            r13 = r10
        L_0x03b4:
            int r13 = java.lang.Math.max(r15, r13)
            if (r16 == 0) goto L_0x03c4
            int r15 = r3.width
            r33 = r7
            r7 = -1
            if (r15 != r7) goto L_0x03c7
            r15 = r20
            goto L_0x03c8
        L_0x03c4:
            r33 = r7
            r7 = -1
        L_0x03c7:
            r15 = 0
        L_0x03c8:
            int r7 = r0.mTotalLength
            int r16 = r4.getMeasuredHeight()
            int r16 = r7 + r16
            r36 = r8
            int r8 = r3.topMargin
            int r16 = r16 + r8
            int r8 = r3.bottomMargin
            int r16 = r16 + r8
            int r8 = r0.getNextLocationOffset(r4)
            int r8 = r16 + r8
            int r8 = java.lang.Math.max(r7, r8)
            r0.mTotalLength = r8
            r16 = r15
            r8 = r36
            r15 = r13
            r3 = r25
        L_0x03ed:
            int r10 = r30 + 1
            r7 = r34
            r13 = r35
            r4 = 0
            goto L_0x02f6
        L_0x03f6:
            r25 = r3
            r34 = r7
            r30 = r10
            r35 = r13
            int r3 = r0.mTotalLength
            int r4 = r0.getPaddingTop()
            int r7 = r0.getPaddingBottom()
            int r4 = r4 + r7
            int r3 = r3 + r4
            r0.mTotalLength = r3
            r4 = r8
            r8 = r15
        L_0x040e:
            if (r16 != 0) goto L_0x0415
            r10 = 1073741824(0x40000000, float:2.0)
            if (r9 == r10) goto L_0x0415
            r11 = r8
        L_0x0415:
            int r3 = r0.getPaddingLeft()
            int r7 = r0.getPaddingRight()
            int r3 = r3 + r7
            int r11 = r11 + r3
            int r3 = r0.getSuggestedMinimumWidth()
            int r3 = java.lang.Math.max(r11, r3)
            int r7 = android.view.View.resolveSizeAndState(r3, r1, r12)
            r0.setMeasuredDimension(r7, r6)
            if (r17 == 0) goto L_0x0433
            r0.forceUniformWidth(r2, r5)
        L_0x0433:
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.widget.LinearLayoutCompat.measureVertical(int, int):void");
    }

    private void forceUniformWidth(int count, int heightMeasureSpec) {
        int heightMeasureSpec2;
        int uniformMeasureSpec = View.MeasureSpec.makeMeasureSpec(getMeasuredWidth(), 1073741824);
        int i = 0;
        while (i < count) {
            View child = getVirtualChildAt(i);
            if (child.getVisibility() != 8) {
                LayoutParams lp = (LayoutParams) child.getLayoutParams();
                if (lp.width == -1) {
                    int oldHeight = lp.height;
                    lp.height = child.getMeasuredHeight();
                    heightMeasureSpec2 = heightMeasureSpec;
                    measureChildWithMargins(child, uniformMeasureSpec, 0, heightMeasureSpec2, 0);
                    lp.height = oldHeight;
                } else {
                    heightMeasureSpec2 = heightMeasureSpec;
                }
            } else {
                heightMeasureSpec2 = heightMeasureSpec;
            }
            i++;
            heightMeasureSpec = heightMeasureSpec2;
        }
    }

    /* access modifiers changed from: package-private */
    /* JADX WARNING: Removed duplicated region for block: B:197:0x0536  */
    /* JADX WARNING: Removed duplicated region for block: B:205:0x056e  */
    /* JADX WARNING: Removed duplicated region for block: B:226:0x060e  */
    /* JADX WARNING: Removed duplicated region for block: B:244:? A[RETURN, SYNTHETIC] */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public void measureHorizontal(int r47, int r48) {
        /*
            r46 = this;
            r0 = r46
            r7 = 0
            r0.mTotalLength = r7
            r1 = 0
            r2 = 0
            r3 = 0
            r4 = 0
            r5 = 1
            r6 = 0
            int r8 = r0.getVirtualChildCount()
            int r9 = android.view.View.MeasureSpec.getMode(r47)
            int r10 = android.view.View.MeasureSpec.getMode(r48)
            r11 = 0
            r12 = 0
            int[] r13 = r0.mMaxAscent
            if (r13 == 0) goto L_0x0021
            int[] r13 = r0.mMaxDescent
            if (r13 != 0) goto L_0x002a
        L_0x0021:
            r13 = 4
            int[] r14 = new int[r13]
            r0.mMaxAscent = r14
            int[] r13 = new int[r13]
            r0.mMaxDescent = r13
        L_0x002a:
            int[] r13 = r0.mMaxAscent
            int[] r14 = r0.mMaxDescent
            r16 = 3
            r15 = -1
            r13[r16] = r15
            r17 = 2
            r13[r17] = r15
            r18 = 1
            r13[r18] = r15
            r13[r7] = r15
            r14[r16] = r15
            r14[r17] = r15
            r14[r18] = r15
            r14[r7] = r15
            boolean r15 = r0.mBaselineAligned
            r20 = r6
            boolean r6 = r0.mUseLargestChild
            r21 = r6
            r6 = 1073741824(0x40000000, float:2.0)
            if (r9 != r6) goto L_0x0054
            r22 = r18
            goto L_0x0056
        L_0x0054:
            r22 = r7
        L_0x0056:
            r23 = 0
            r24 = 0
            r45 = r11
            r11 = r1
            r1 = r20
            r20 = r5
            r5 = r24
            r24 = r12
            r12 = r2
            r2 = r23
            r23 = r45
        L_0x006a:
            r7 = 8
            r28 = 0
            if (r5 >= r8) goto L_0x0271
            r29 = r1
            android.view.View r1 = r0.getVirtualChildAt(r5)
            if (r1 != 0) goto L_0x0098
            int r7 = r0.mTotalLength
            int r26 = r0.measureNullChild(r5)
            int r7 = r7 + r26
            r0.mTotalLength = r7
            r6 = r5
            r34 = r8
            r32 = r9
            r33 = r13
            r30 = r15
            r31 = r21
            r1 = r29
            r5 = r48
            r21 = r14
            r14 = r3
            r3 = r47
            goto L_0x025c
        L_0x0098:
            int r6 = r1.getVisibility()
            if (r6 != r7) goto L_0x00b9
            int r6 = r0.getChildrenSkipCount(r1, r5)
            int r5 = r5 + r6
            r6 = r5
            r34 = r8
            r32 = r9
            r33 = r13
            r30 = r15
            r31 = r21
            r1 = r29
            r5 = r48
            r21 = r14
            r14 = r3
            r3 = r47
            goto L_0x025c
        L_0x00b9:
            boolean r6 = r0.hasDividerBeforeChildAt(r5)
            if (r6 == 0) goto L_0x00c6
            int r6 = r0.mTotalLength
            int r7 = r0.mDividerWidth
            int r6 = r6 + r7
            r0.mTotalLength = r6
        L_0x00c6:
            android.view.ViewGroup$LayoutParams r6 = r1.getLayoutParams()
            r7 = r6
            androidx.appcompat.widget.LinearLayoutCompat$LayoutParams r7 = (androidx.appcompat.widget.LinearLayoutCompat.LayoutParams) r7
            float r6 = r7.weight
            float r29 = r29 + r6
            r6 = 1073741824(0x40000000, float:2.0)
            if (r9 != r6) goto L_0x0142
            int r6 = r7.width
            if (r6 != 0) goto L_0x0142
            float r6 = r7.weight
            int r6 = (r6 > r28 ? 1 : (r6 == r28 ? 0 : -1))
            if (r6 <= 0) goto L_0x0142
            if (r22 == 0) goto L_0x00f4
            int r6 = r0.mTotalLength
            r31 = r2
            int r2 = r7.leftMargin
            r26 = r2
            int r2 = r7.rightMargin
            int r2 = r26 + r2
            int r6 = r6 + r2
            r0.mTotalLength = r6
            r32 = r3
            goto L_0x0106
        L_0x00f4:
            r31 = r2
            int r2 = r0.mTotalLength
            int r6 = r7.leftMargin
            int r6 = r6 + r2
            r32 = r3
            int r3 = r7.rightMargin
            int r6 = r6 + r3
            int r3 = java.lang.Math.max(r2, r6)
            r0.mTotalLength = r3
        L_0x0106:
            if (r15 == 0) goto L_0x0128
            r2 = 0
            int r3 = android.view.View.MeasureSpec.makeMeasureSpec(r2, r2)
            r1.measure(r3, r3)
            r3 = r47
            r2 = r5
            r34 = r8
            r33 = r13
            r30 = r15
            r13 = r31
            r5 = r48
            r15 = r4
            r31 = r21
            r21 = r14
            r14 = r32
            r32 = r9
            goto L_0x01c5
        L_0x0128:
            r24 = 1
            r3 = r47
            r2 = r5
            r34 = r8
            r33 = r13
            r30 = r15
            r13 = r31
            r5 = r48
            r15 = r4
            r31 = r21
            r21 = r14
            r14 = r32
            r32 = r9
            goto L_0x01c5
        L_0x0142:
            r31 = r2
            r32 = r3
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            int r3 = r7.width
            if (r3 != 0) goto L_0x0156
            float r3 = r7.weight
            int r3 = (r3 > r28 ? 1 : (r3 == r28 ? 0 : -1))
            if (r3 <= 0) goto L_0x0156
            r2 = 0
            r3 = -2
            r7.width = r3
        L_0x0156:
            int r3 = (r29 > r28 ? 1 : (r29 == r28 ? 0 : -1))
            if (r3 != 0) goto L_0x0163
            int r3 = r0.mTotalLength
            r45 = r4
            r4 = r3
            r3 = r45
            goto L_0x0165
        L_0x0163:
            r3 = r4
            r4 = 0
        L_0x0165:
            r6 = 0
            r34 = r8
            r33 = r13
            r30 = r15
            r13 = r31
            r8 = 1073741824(0x40000000, float:2.0)
            r15 = r3
            r31 = r21
            r3 = r47
            r21 = r14
            r14 = r32
            r32 = r9
            r9 = r2
            r2 = r5
            r5 = r48
            r0.measureChildBeforeLayout(r1, r2, r3, r4, r5, r6)
            r4 = -2147483648(0xffffffff80000000, float:-0.0)
            if (r9 == r4) goto L_0x0188
            r7.width = r9
        L_0x0188:
            int r4 = r1.getMeasuredWidth()
            if (r22 == 0) goto L_0x01a2
            int r6 = r0.mTotalLength
            int r8 = r7.leftMargin
            int r8 = r8 + r4
            r26 = r6
            int r6 = r7.rightMargin
            int r8 = r8 + r6
            int r6 = r0.getNextLocationOffset(r1)
            int r8 = r8 + r6
            int r6 = r26 + r8
            r0.mTotalLength = r6
            goto L_0x01be
        L_0x01a2:
            int r6 = r0.mTotalLength
            int r8 = r6 + r4
            r26 = r8
            int r8 = r7.leftMargin
            int r8 = r26 + r8
            r26 = r8
            int r8 = r7.rightMargin
            int r8 = r26 + r8
            int r26 = r0.getNextLocationOffset(r1)
            int r8 = r8 + r26
            int r8 = java.lang.Math.max(r6, r8)
            r0.mTotalLength = r8
        L_0x01be:
            if (r31 == 0) goto L_0x01c5
            int r6 = java.lang.Math.max(r4, r13)
            r13 = r6
        L_0x01c5:
            r4 = 0
            r6 = 1073741824(0x40000000, float:2.0)
            if (r10 == r6) goto L_0x01d2
            int r6 = r7.height
            r8 = -1
            if (r6 != r8) goto L_0x01d2
            r23 = 1
            r4 = 1
        L_0x01d2:
            int r6 = r7.topMargin
            int r8 = r7.bottomMargin
            int r6 = r6 + r8
            int r8 = r1.getMeasuredHeight()
            int r8 = r8 + r6
            int r9 = r1.getMeasuredState()
            int r9 = android.view.View.combineMeasuredStates(r12, r9)
            if (r30 == 0) goto L_0x021c
            int r12 = r1.getBaseline()
            r26 = r4
            r4 = -1
            if (r12 == r4) goto L_0x0219
            int r4 = r7.gravity
            if (r4 >= 0) goto L_0x01f6
            int r4 = r0.mGravity
            goto L_0x01f8
        L_0x01f6:
            int r4 = r7.gravity
        L_0x01f8:
            r4 = r4 & 112(0x70, float:1.57E-43)
            int r35 = r4 >> 4
            r27 = -2
            r27 = r35 & -2
            int r27 = r27 >> 1
            r35 = r4
            r4 = r33[r27]
            int r4 = java.lang.Math.max(r4, r12)
            r33[r27] = r4
            r4 = r21[r27]
            r36 = r6
            int r6 = r8 - r12
            int r4 = java.lang.Math.max(r4, r6)
            r21[r27] = r4
            goto L_0x0220
        L_0x0219:
            r36 = r6
            goto L_0x0220
        L_0x021c:
            r26 = r4
            r36 = r6
        L_0x0220:
            int r4 = java.lang.Math.max(r11, r8)
            if (r20 == 0) goto L_0x022e
            int r6 = r7.height
            r11 = -1
            if (r6 != r11) goto L_0x022e
            r6 = r18
            goto L_0x022f
        L_0x022e:
            r6 = 0
        L_0x022f:
            float r11 = r7.weight
            int r11 = (r11 > r28 ? 1 : (r11 == r28 ? 0 : -1))
            if (r11 <= 0) goto L_0x0242
            if (r26 == 0) goto L_0x023b
            r11 = r36
            goto L_0x023c
        L_0x023b:
            r11 = r8
        L_0x023c:
            int r11 = java.lang.Math.max(r15, r11)
            r15 = r11
            goto L_0x024e
        L_0x0242:
            if (r26 == 0) goto L_0x0248
            r11 = r36
            goto L_0x0249
        L_0x0248:
            r11 = r8
        L_0x0249:
            int r11 = java.lang.Math.max(r14, r11)
            r14 = r11
        L_0x024e:
            int r11 = r0.getChildrenSkipCount(r1, r2)
            int r2 = r2 + r11
            r11 = r4
            r20 = r6
            r12 = r9
            r4 = r15
            r1 = r29
            r6 = r2
            r2 = r13
        L_0x025c:
            int r6 = r6 + 1
            r5 = r6
            r3 = r14
            r14 = r21
            r15 = r30
            r21 = r31
            r9 = r32
            r13 = r33
            r8 = r34
            r6 = 1073741824(0x40000000, float:2.0)
            r7 = 0
            goto L_0x006a
        L_0x0271:
            r29 = r1
            r34 = r8
            r32 = r9
            r33 = r13
            r30 = r15
            r31 = r21
            r13 = r2
            r15 = r4
            r2 = r5
            r21 = r14
            r5 = r48
            r14 = r3
            r3 = r47
            int r1 = r0.mTotalLength
            if (r1 <= 0) goto L_0x029b
            r1 = r34
            boolean r2 = r0.hasDividerBeforeChildAt(r1)
            if (r2 == 0) goto L_0x029d
            int r2 = r0.mTotalLength
            int r4 = r0.mDividerWidth
            int r2 = r2 + r4
            r0.mTotalLength = r2
            goto L_0x029d
        L_0x029b:
            r1 = r34
        L_0x029d:
            r2 = r33[r18]
            r4 = -1
            if (r2 != r4) goto L_0x02b0
            r25 = 0
            r2 = r33[r25]
            if (r2 != r4) goto L_0x02b0
            r2 = r33[r17]
            if (r2 != r4) goto L_0x02b0
            r2 = r33[r16]
            if (r2 == r4) goto L_0x02e0
        L_0x02b0:
            r2 = r33[r16]
            r25 = 0
            r4 = r33[r25]
            r6 = r33[r18]
            r8 = r33[r17]
            int r6 = java.lang.Math.max(r6, r8)
            int r4 = java.lang.Math.max(r4, r6)
            int r2 = java.lang.Math.max(r2, r4)
            r4 = r21[r16]
            r6 = r21[r25]
            r8 = r21[r18]
            r9 = r21[r17]
            int r8 = java.lang.Math.max(r8, r9)
            int r6 = java.lang.Math.max(r6, r8)
            int r4 = java.lang.Math.max(r4, r6)
            int r6 = r2 + r4
            int r11 = java.lang.Math.max(r11, r6)
        L_0x02e0:
            if (r31 == 0) goto L_0x034b
            r2 = r32
            r4 = -2147483648(0xffffffff80000000, float:-0.0)
            if (r2 == r4) goto L_0x02ea
            if (r2 != 0) goto L_0x034d
        L_0x02ea:
            r4 = 0
            r0.mTotalLength = r4
            r4 = 0
        L_0x02ee:
            if (r4 >= r1) goto L_0x0348
            android.view.View r6 = r0.getVirtualChildAt(r4)
            if (r6 != 0) goto L_0x0302
            int r8 = r0.mTotalLength
            int r9 = r0.measureNullChild(r4)
            int r8 = r8 + r9
            r0.mTotalLength = r8
            r32 = r4
            goto L_0x0341
        L_0x0302:
            int r8 = r6.getVisibility()
            if (r8 != r7) goto L_0x030e
            int r8 = r0.getChildrenSkipCount(r6, r4)
            int r4 = r4 + r8
            goto L_0x0343
        L_0x030e:
            android.view.ViewGroup$LayoutParams r8 = r6.getLayoutParams()
            androidx.appcompat.widget.LinearLayoutCompat$LayoutParams r8 = (androidx.appcompat.widget.LinearLayoutCompat.LayoutParams) r8
            if (r22 == 0) goto L_0x032a
            int r9 = r0.mTotalLength
            int r7 = r8.leftMargin
            int r7 = r7 + r13
            r32 = r4
            int r4 = r8.rightMargin
            int r7 = r7 + r4
            int r4 = r0.getNextLocationOffset(r6)
            int r7 = r7 + r4
            int r9 = r9 + r7
            r0.mTotalLength = r9
            goto L_0x0341
        L_0x032a:
            r32 = r4
            int r4 = r0.mTotalLength
            int r7 = r4 + r13
            int r9 = r8.leftMargin
            int r7 = r7 + r9
            int r9 = r8.rightMargin
            int r7 = r7 + r9
            int r9 = r0.getNextLocationOffset(r6)
            int r7 = r7 + r9
            int r7 = java.lang.Math.max(r4, r7)
            r0.mTotalLength = r7
        L_0x0341:
            r4 = r32
        L_0x0343:
            int r4 = r4 + 1
            r7 = 8
            goto L_0x02ee
        L_0x0348:
            r32 = r4
            goto L_0x034d
        L_0x034b:
            r2 = r32
        L_0x034d:
            int r4 = r0.mTotalLength
            int r6 = r0.getPaddingLeft()
            int r7 = r0.getPaddingRight()
            int r6 = r6 + r7
            int r4 = r4 + r6
            r0.mTotalLength = r4
            int r4 = r0.mTotalLength
            int r6 = r0.getSuggestedMinimumWidth()
            int r4 = java.lang.Math.max(r4, r6)
            r6 = 0
            int r7 = android.view.View.resolveSizeAndState(r4, r3, r6)
            r6 = 16777215(0xffffff, float:2.3509886E-38)
            r4 = r7 & r6
            int r6 = r0.mTotalLength
            int r6 = r4 - r6
            if (r24 != 0) goto L_0x03fc
            if (r6 == 0) goto L_0x0385
            int r9 = (r29 > r28 ? 1 : (r29 == r28 ? 0 : -1))
            if (r9 <= 0) goto L_0x0385
            r34 = r4
            r35 = r6
            r36 = r7
            r32 = -16777216(0xffffffffff000000, float:-1.7014118E38)
            goto L_0x0404
        L_0x0385:
            int r9 = java.lang.Math.max(r14, r15)
            if (r31 == 0) goto L_0x03ee
            r14 = 1073741824(0x40000000, float:2.0)
            if (r2 == r14) goto L_0x03ee
            r14 = 0
        L_0x0390:
            if (r14 >= r1) goto L_0x03e5
            r32 = -16777216(0xffffffffff000000, float:-1.7014118E38)
            android.view.View r8 = r0.getVirtualChildAt(r14)
            if (r8 == 0) goto L_0x03d6
            r34 = r4
            int r4 = r8.getVisibility()
            r35 = r6
            r6 = 8
            if (r4 != r6) goto L_0x03a9
            r36 = r7
            goto L_0x03dc
        L_0x03a9:
            android.view.ViewGroup$LayoutParams r4 = r8.getLayoutParams()
            androidx.appcompat.widget.LinearLayoutCompat$LayoutParams r4 = (androidx.appcompat.widget.LinearLayoutCompat.LayoutParams) r4
            float r6 = r4.weight
            int r16 = (r6 > r28 ? 1 : (r6 == r28 ? 0 : -1))
            if (r16 <= 0) goto L_0x03cf
            r16 = r4
            r17 = r6
            r4 = 1073741824(0x40000000, float:2.0)
            int r6 = android.view.View.MeasureSpec.makeMeasureSpec(r13, r4)
            r36 = r7
            int r7 = r8.getMeasuredHeight()
            int r7 = android.view.View.MeasureSpec.makeMeasureSpec(r7, r4)
            r8.measure(r6, r7)
            goto L_0x03dc
        L_0x03cf:
            r16 = r4
            r17 = r6
            r36 = r7
            goto L_0x03dc
        L_0x03d6:
            r34 = r4
            r35 = r6
            r36 = r7
        L_0x03dc:
            int r14 = r14 + 1
            r4 = r34
            r6 = r35
            r7 = r36
            goto L_0x0390
        L_0x03e5:
            r34 = r4
            r35 = r6
            r36 = r7
            r32 = -16777216(0xffffffffff000000, float:-1.7014118E38)
            goto L_0x03f6
        L_0x03ee:
            r34 = r4
            r35 = r6
            r36 = r7
            r32 = -16777216(0xffffffffff000000, float:-1.7014118E38)
        L_0x03f6:
            r40 = r2
            r6 = r35
            goto L_0x05e6
        L_0x03fc:
            r34 = r4
            r35 = r6
            r36 = r7
            r32 = -16777216(0xffffffffff000000, float:-1.7014118E38)
        L_0x0404:
            float r4 = r0.mWeightSum
            int r4 = (r4 > r28 ? 1 : (r4 == r28 ? 0 : -1))
            if (r4 <= 0) goto L_0x040d
            float r4 = r0.mWeightSum
            goto L_0x040f
        L_0x040d:
            r4 = r29
        L_0x040f:
            r19 = -1
            r33[r16] = r19
            r33[r17] = r19
            r33[r18] = r19
            r6 = 0
            r33[r6] = r19
            r21[r16] = r19
            r21[r17] = r19
            r21[r18] = r19
            r21[r6] = r19
            r7 = -1
            r0.mTotalLength = r6
            r6 = 0
            r8 = r7
            r7 = r35
        L_0x0429:
            if (r6 >= r1) goto L_0x0589
            android.view.View r9 = r0.getVirtualChildAt(r6)
            if (r9 == 0) goto L_0x0579
            int r11 = r9.getVisibility()
            r35 = r4
            r4 = 8
            if (r11 != r4) goto L_0x0443
            r40 = r2
            r38 = r6
            r27 = -2
            goto L_0x0581
        L_0x0443:
            android.view.ViewGroup$LayoutParams r11 = r9.getLayoutParams()
            androidx.appcompat.widget.LinearLayoutCompat$LayoutParams r11 = (androidx.appcompat.widget.LinearLayoutCompat.LayoutParams) r11
            float r4 = r11.weight
            int r37 = (r4 > r28 ? 1 : (r4 == r28 ? 0 : -1))
            if (r37 <= 0) goto L_0x04c0
            r37 = r4
            float r4 = (float) r7
            float r4 = r4 * r37
            float r4 = r4 / r35
            int r4 = (int) r4
            float r35 = r35 - r37
            int r7 = r7 - r4
            int r38 = r0.getPaddingTop()
            int r39 = r0.getPaddingBottom()
            int r38 = r38 + r39
            r39 = r4
            int r4 = r11.topMargin
            int r38 = r38 + r4
            int r4 = r11.bottomMargin
            int r4 = r38 + r4
            r38 = r6
            int r6 = r11.height
            int r4 = getChildMeasureSpec(r5, r4, r6)
            int r6 = r11.width
            if (r6 != 0) goto L_0x0498
            r6 = 1073741824(0x40000000, float:2.0)
            if (r2 == r6) goto L_0x0483
            r40 = r2
            goto L_0x049a
        L_0x0483:
            if (r39 <= 0) goto L_0x0489
            r6 = r39
            goto L_0x048a
        L_0x0489:
            r6 = 0
        L_0x048a:
            r40 = r2
            r2 = 1073741824(0x40000000, float:2.0)
            int r6 = android.view.View.MeasureSpec.makeMeasureSpec(r6, r2)
            r9.measure(r6, r4)
            r41 = r7
            goto L_0x04b0
        L_0x0498:
            r40 = r2
        L_0x049a:
            int r2 = r9.getMeasuredWidth()
            int r2 = r2 + r39
            if (r2 >= 0) goto L_0x04a3
            r2 = 0
        L_0x04a3:
            r41 = r7
            r6 = 1073741824(0x40000000, float:2.0)
            int r7 = android.view.View.MeasureSpec.makeMeasureSpec(r2, r6)
            r9.measure(r7, r4)
        L_0x04b0:
            int r2 = r9.getMeasuredState()
            r2 = r2 & r32
            int r12 = android.view.View.combineMeasuredStates(r12, r2)
            r7 = r41
            r4 = r35
            goto L_0x04c8
        L_0x04c0:
            r40 = r2
            r37 = r4
            r38 = r6
            r4 = r35
        L_0x04c8:
            if (r22 == 0) goto L_0x04e4
            int r2 = r0.mTotalLength
            int r6 = r9.getMeasuredWidth()
            r35 = r2
            int r2 = r11.leftMargin
            int r6 = r6 + r2
            int r2 = r11.rightMargin
            int r6 = r6 + r2
            int r2 = r0.getNextLocationOffset(r9)
            int r6 = r6 + r2
            int r2 = r35 + r6
            r0.mTotalLength = r2
            r35 = r4
            goto L_0x04fe
        L_0x04e4:
            int r2 = r0.mTotalLength
            int r6 = r9.getMeasuredWidth()
            int r6 = r6 + r2
            r35 = r4
            int r4 = r11.leftMargin
            int r6 = r6 + r4
            int r4 = r11.rightMargin
            int r6 = r6 + r4
            int r4 = r0.getNextLocationOffset(r9)
            int r6 = r6 + r4
            int r4 = java.lang.Math.max(r2, r6)
            r0.mTotalLength = r4
        L_0x04fe:
            r6 = 1073741824(0x40000000, float:2.0)
            if (r10 == r6) goto L_0x050a
            int r2 = r11.height
            r4 = -1
            if (r2 != r4) goto L_0x050a
            r2 = r18
            goto L_0x050b
        L_0x050a:
            r2 = 0
        L_0x050b:
            int r4 = r11.topMargin
            int r6 = r11.bottomMargin
            int r4 = r4 + r6
            int r6 = r9.getMeasuredHeight()
            int r6 = r6 + r4
            int r8 = java.lang.Math.max(r8, r6)
            r39 = r2
            if (r2 == 0) goto L_0x0520
            r2 = r4
            goto L_0x0521
        L_0x0520:
            r2 = r6
        L_0x0521:
            int r2 = java.lang.Math.max(r14, r2)
            if (r20 == 0) goto L_0x0531
            int r14 = r11.height
            r41 = r2
            r2 = -1
            if (r14 != r2) goto L_0x0533
            r2 = r18
            goto L_0x0534
        L_0x0531:
            r41 = r2
        L_0x0533:
            r2 = 0
        L_0x0534:
            if (r30 == 0) goto L_0x056e
            int r14 = r9.getBaseline()
            r20 = r2
            r2 = -1
            if (r14 == r2) goto L_0x0569
            int r2 = r11.gravity
            if (r2 >= 0) goto L_0x0546
            int r2 = r0.mGravity
            goto L_0x0548
        L_0x0546:
            int r2 = r11.gravity
        L_0x0548:
            r2 = r2 & 112(0x70, float:1.57E-43)
            int r42 = r2 >> 4
            r27 = -2
            r42 = r42 & -2
            int r42 = r42 >> 1
            r43 = r2
            r2 = r33[r42]
            int r2 = java.lang.Math.max(r2, r14)
            r33[r42] = r2
            r2 = r21[r42]
            r44 = r4
            int r4 = r6 - r14
            int r2 = java.lang.Math.max(r2, r4)
            r21[r42] = r2
            goto L_0x0574
        L_0x0569:
            r44 = r4
            r27 = -2
            goto L_0x0574
        L_0x056e:
            r20 = r2
            r44 = r4
            r27 = -2
        L_0x0574:
            r14 = r41
            r4 = r35
            goto L_0x0583
        L_0x0579:
            r40 = r2
            r35 = r4
            r38 = r6
            r27 = -2
        L_0x0581:
            r4 = r35
        L_0x0583:
            int r6 = r38 + 1
            r2 = r40
            goto L_0x0429
        L_0x0589:
            r40 = r2
            r35 = r4
            r38 = r6
            int r2 = r0.mTotalLength
            int r4 = r0.getPaddingLeft()
            int r6 = r0.getPaddingRight()
            int r4 = r4 + r6
            int r2 = r2 + r4
            r0.mTotalLength = r2
            r2 = r33[r18]
            r4 = -1
            if (r2 != r4) goto L_0x05b3
            r25 = 0
            r2 = r33[r25]
            if (r2 != r4) goto L_0x05b3
            r2 = r33[r17]
            if (r2 != r4) goto L_0x05b3
            r2 = r33[r16]
            if (r2 == r4) goto L_0x05b1
            goto L_0x05b3
        L_0x05b1:
            r11 = r8
            goto L_0x05e4
        L_0x05b3:
            r2 = r33[r16]
            r25 = 0
            r4 = r33[r25]
            r6 = r33[r18]
            r9 = r33[r17]
            int r6 = java.lang.Math.max(r6, r9)
            int r4 = java.lang.Math.max(r4, r6)
            int r2 = java.lang.Math.max(r2, r4)
            r4 = r21[r16]
            r6 = r21[r25]
            r9 = r21[r18]
            r11 = r21[r17]
            int r9 = java.lang.Math.max(r9, r11)
            int r6 = java.lang.Math.max(r6, r9)
            int r4 = java.lang.Math.max(r4, r6)
            int r6 = r2 + r4
            int r6 = java.lang.Math.max(r8, r6)
            r11 = r6
        L_0x05e4:
            r6 = r7
            r9 = r14
        L_0x05e6:
            if (r20 != 0) goto L_0x05ed
            r14 = 1073741824(0x40000000, float:2.0)
            if (r10 == r14) goto L_0x05ed
            r11 = r9
        L_0x05ed:
            int r2 = r0.getPaddingTop()
            int r4 = r0.getPaddingBottom()
            int r2 = r2 + r4
            int r11 = r11 + r2
            int r2 = r0.getSuggestedMinimumHeight()
            int r2 = java.lang.Math.max(r11, r2)
            r4 = r12 & r32
            r4 = r36 | r4
            int r7 = r12 << 16
            int r7 = android.view.View.resolveSizeAndState(r2, r5, r7)
            r0.setMeasuredDimension(r4, r7)
            if (r23 == 0) goto L_0x0611
            r0.forceUniformHeight(r1, r3)
        L_0x0611:
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.widget.LinearLayoutCompat.measureHorizontal(int, int):void");
    }

    private void forceUniformHeight(int count, int widthMeasureSpec) {
        int widthMeasureSpec2;
        int uniformMeasureSpec = View.MeasureSpec.makeMeasureSpec(getMeasuredHeight(), 1073741824);
        int i = 0;
        while (i < count) {
            View child = getVirtualChildAt(i);
            if (child.getVisibility() != 8) {
                LayoutParams lp = (LayoutParams) child.getLayoutParams();
                if (lp.height == -1) {
                    int oldWidth = lp.width;
                    lp.width = child.getMeasuredWidth();
                    widthMeasureSpec2 = widthMeasureSpec;
                    measureChildWithMargins(child, widthMeasureSpec2, 0, uniformMeasureSpec, 0);
                    lp.width = oldWidth;
                } else {
                    widthMeasureSpec2 = widthMeasureSpec;
                }
            } else {
                widthMeasureSpec2 = widthMeasureSpec;
            }
            i++;
            widthMeasureSpec = widthMeasureSpec2;
        }
    }

    /* access modifiers changed from: package-private */
    public int getChildrenSkipCount(View child, int index) {
        return 0;
    }

    /* access modifiers changed from: package-private */
    public int measureNullChild(int childIndex) {
        return 0;
    }

    /* access modifiers changed from: package-private */
    public void measureChildBeforeLayout(View child, int childIndex, int widthMeasureSpec, int totalWidth, int heightMeasureSpec, int totalHeight) {
        measureChildWithMargins(child, widthMeasureSpec, totalWidth, heightMeasureSpec, totalHeight);
    }

    /* access modifiers changed from: package-private */
    public int getLocationOffset(View child) {
        return 0;
    }

    /* access modifiers changed from: package-private */
    public int getNextLocationOffset(View child) {
        return 0;
    }

    /* access modifiers changed from: protected */
    public void onLayout(boolean changed, int l, int t, int r, int b) {
        if (this.mOrientation == 1) {
            layoutVertical(l, t, r, b);
        } else {
            layoutHorizontal(l, t, r, b);
        }
    }

    /* access modifiers changed from: package-private */
    public void layoutVertical(int left, int top, int right, int bottom) {
        int childTop;
        int childTop2;
        int gravity;
        int childTop3;
        int childLeft;
        int childLeft2;
        int paddingLeft = getPaddingLeft();
        int width = right - left;
        int childRight = width - getPaddingRight();
        int childSpace = (width - paddingLeft) - getPaddingRight();
        int count = getVirtualChildCount();
        int majorGravity = this.mGravity & 112;
        int minorGravity = this.mGravity & GravityCompat.RELATIVE_HORIZONTAL_GRAVITY_MASK;
        switch (majorGravity) {
            case 16:
                childTop = getPaddingTop() + (((bottom - top) - this.mTotalLength) / 2);
                break;
            case 80:
                childTop = ((getPaddingTop() + bottom) - top) - this.mTotalLength;
                break;
            default:
                childTop = getPaddingTop();
                break;
        }
        int i = 0;
        while (i < count) {
            int childTop4 = childTop;
            View child = getVirtualChildAt(i);
            if (child == null) {
                childTop2 = childTop4 + measureNullChild(i);
            } else if (child.getVisibility() != 8) {
                int childWidth = child.getMeasuredWidth();
                int childHeight = child.getMeasuredHeight();
                LayoutParams lp = (LayoutParams) child.getLayoutParams();
                int gravity2 = lp.gravity;
                if (gravity2 < 0) {
                    gravity = minorGravity;
                } else {
                    gravity = gravity2;
                }
                int gravity3 = getLayoutDirection();
                switch (GravityCompat.getAbsoluteGravity(gravity, gravity3) & 7) {
                    case 1:
                        childTop3 = childTop4;
                        childLeft = ((((childSpace - childWidth) / 2) + paddingLeft) + lp.leftMargin) - lp.rightMargin;
                        break;
                    case 5:
                        childTop3 = childTop4;
                        childLeft = (childRight - childWidth) - lp.rightMargin;
                        break;
                    default:
                        childTop3 = childTop4;
                        childLeft = paddingLeft + lp.leftMargin;
                        break;
                }
                if (hasDividerBeforeChildAt(i) != 0) {
                    childLeft2 = childLeft;
                    childTop3 += this.mDividerHeight;
                } else {
                    childLeft2 = childLeft;
                }
                int childTop5 = childTop3 + lp.topMargin;
                int childLeft3 = childLeft2;
                int childLeft4 = gravity3;
                setChildFrame(child, childLeft3, childTop5 + getLocationOffset(child), childWidth, childHeight);
                int childTop6 = childTop5 + lp.bottomMargin + childHeight + getNextLocationOffset(child);
                i += getChildrenSkipCount(child, i);
                childTop2 = childTop6;
            } else {
                childTop2 = childTop4;
            }
            i++;
        }
    }

    /* access modifiers changed from: package-private */
    /* JADX WARNING: Removed duplicated region for block: B:25:0x00c5  */
    /* JADX WARNING: Removed duplicated region for block: B:26:0x00c9  */
    /* JADX WARNING: Removed duplicated region for block: B:29:0x00d0  */
    /* JADX WARNING: Removed duplicated region for block: B:30:0x00d2  */
    /* JADX WARNING: Removed duplicated region for block: B:34:0x00ee  */
    /* JADX WARNING: Removed duplicated region for block: B:38:0x00ff  */
    /* JADX WARNING: Removed duplicated region for block: B:41:0x0117  */
    /* JADX WARNING: Removed duplicated region for block: B:42:0x011e  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public void layoutHorizontal(int r31, int r32, int r33, int r34) {
        /*
            r30 = this;
            r0 = r30
            boolean r6 = androidx.appcompat.widget.ViewUtils.isLayoutRtl(r0)
            int r7 = r0.getPaddingTop()
            int r8 = r34 - r32
            int r1 = r0.getPaddingBottom()
            int r9 = r8 - r1
            int r1 = r8 - r7
            int r2 = r0.getPaddingBottom()
            int r10 = r1 - r2
            int r11 = r0.getVirtualChildCount()
            int r1 = r0.mGravity
            r2 = 8388615(0x800007, float:1.1754953E-38)
            r12 = r1 & r2
            int r1 = r0.mGravity
            r13 = r1 & 112(0x70, float:1.57E-43)
            boolean r14 = r0.mBaselineAligned
            int[] r15 = r0.mMaxAscent
            int[] r1 = r0.mMaxDescent
            int r2 = r0.getLayoutDirection()
            int r3 = androidx.core.view.GravityCompat.getAbsoluteGravity(r12, r2)
            r16 = 2
            switch(r3) {
                case 1: goto L_0x004d;
                case 5: goto L_0x0041;
                default: goto L_0x003c;
            }
        L_0x003c:
            int r3 = r0.getPaddingLeft()
            goto L_0x005a
        L_0x0041:
            int r3 = r0.getPaddingLeft()
            int r3 = r3 + r33
            int r3 = r3 - r31
            int r4 = r0.mTotalLength
            int r3 = r3 - r4
            goto L_0x005a
        L_0x004d:
            int r3 = r0.getPaddingLeft()
            int r4 = r33 - r31
            int r5 = r0.mTotalLength
            int r4 = r4 - r5
            int r4 = r4 / 2
            int r3 = r3 + r4
        L_0x005a:
            r4 = 0
            r5 = 1
            if (r6 == 0) goto L_0x0066
            int r4 = r11 + -1
            r5 = -1
            r17 = r4
            r18 = r5
            goto L_0x006a
        L_0x0066:
            r17 = r4
            r18 = r5
        L_0x006a:
            r4 = 0
        L_0x006b:
            if (r4 >= r11) goto L_0x0166
            int r5 = r18 * r4
            int r5 = r17 + r5
            r19 = r1
            android.view.View r1 = r0.getVirtualChildAt(r5)
            r20 = 1
            if (r1 != 0) goto L_0x0089
            int r21 = r0.measureNullChild(r5)
            int r3 = r3 + r21
            r21 = r2
            r25 = r6
            r23 = r7
            goto L_0x015a
        L_0x0089:
            r21 = r2
            int r2 = r1.getVisibility()
            r22 = r3
            r3 = 8
            if (r2 == r3) goto L_0x0151
            r2 = r4
            int r4 = r1.getMeasuredWidth()
            int r3 = r1.getMeasuredHeight()
            r23 = -1
            android.view.ViewGroup$LayoutParams r24 = r1.getLayoutParams()
            r25 = r6
            r6 = r24
            androidx.appcompat.widget.LinearLayoutCompat$LayoutParams r6 = (androidx.appcompat.widget.LinearLayoutCompat.LayoutParams) r6
            r24 = r2
            r2 = -1
            if (r14 == 0) goto L_0x00bd
            r26 = r3
            int r3 = r6.height
            if (r3 == r2) goto L_0x00bf
            int r23 = r1.getBaseline()
            r3 = r23
            goto L_0x00c1
        L_0x00bd:
            r26 = r3
        L_0x00bf:
            r3 = r23
        L_0x00c1:
            int r2 = r6.gravity
            if (r2 >= 0) goto L_0x00c9
            r2 = r13
            r27 = r2
            goto L_0x00cb
        L_0x00c9:
            r27 = r2
        L_0x00cb:
            r2 = r27 & 112(0x70, float:1.57E-43)
            switch(r2) {
                case 16: goto L_0x00ff;
                case 48: goto L_0x00ee;
                case 80: goto L_0x00d2;
                default: goto L_0x00d0;
            }
        L_0x00d0:
            r2 = r7
            goto L_0x0111
        L_0x00d2:
            int r2 = r9 - r26
            r28 = r2
            int r2 = r6.bottomMargin
            int r2 = r28 - r2
            r28 = r2
            r2 = -1
            if (r3 == r2) goto L_0x00eb
            int r2 = r1.getMeasuredHeight()
            int r2 = r2 - r3
            r23 = r19[r16]
            int r23 = r23 - r2
            int r2 = r28 - r23
            goto L_0x0111
        L_0x00eb:
            r2 = r28
            goto L_0x0111
        L_0x00ee:
            int r2 = r6.topMargin
            int r2 = r2 + r7
            r28 = r2
            r2 = -1
            if (r3 == r2) goto L_0x00fc
            r2 = r15[r20]
            int r2 = r2 - r3
            int r2 = r28 + r2
            goto L_0x0111
        L_0x00fc:
            r2 = r28
            goto L_0x0111
        L_0x00ff:
            int r2 = r10 - r26
            int r2 = r2 / 2
            int r2 = r2 + r7
            r23 = r2
            int r2 = r6.topMargin
            int r2 = r23 + r2
            r23 = r2
            int r2 = r6.bottomMargin
            int r2 = r23 - r2
        L_0x0111:
            boolean r23 = r0.hasDividerBeforeChildAt(r5)
            if (r23 == 0) goto L_0x011e
            r23 = r2
            int r2 = r0.mDividerWidth
            int r2 = r22 + r2
            goto L_0x0122
        L_0x011e:
            r23 = r2
            r2 = r22
        L_0x0122:
            r22 = r2
            int r2 = r6.leftMargin
            int r22 = r22 + r2
            int r2 = r0.getLocationOffset(r1)
            int r2 = r22 + r2
            r29 = r26
            r26 = r3
            r3 = r23
            r23 = r7
            r7 = r5
            r5 = r29
            r0.setChildFrame(r1, r2, r3, r4, r5)
            int r2 = r6.rightMargin
            int r2 = r2 + r4
            int r28 = r0.getNextLocationOffset(r1)
            int r2 = r2 + r28
            int r22 = r22 + r2
            int r2 = r0.getChildrenSkipCount(r1, r7)
            int r2 = r24 + r2
            r4 = r2
            r3 = r22
            goto L_0x015a
        L_0x0151:
            r24 = r4
            r25 = r6
            r23 = r7
            r7 = r5
            r3 = r22
        L_0x015a:
            int r4 = r4 + 1
            r1 = r19
            r2 = r21
            r7 = r23
            r6 = r25
            goto L_0x006b
        L_0x0166:
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.widget.LinearLayoutCompat.layoutHorizontal(int, int, int, int):void");
    }

    private void setChildFrame(View child, int left, int top, int width, int height) {
        child.layout(left, top, left + width, top + height);
    }

    public void setOrientation(int orientation) {
        if (this.mOrientation != orientation) {
            this.mOrientation = orientation;
            requestLayout();
        }
    }

    public int getOrientation() {
        return this.mOrientation;
    }

    public void setGravity(int gravity) {
        if (this.mGravity != gravity) {
            if ((8388615 & gravity) == 0) {
                gravity |= GravityCompat.START;
            }
            if ((gravity & 112) == 0) {
                gravity |= 48;
            }
            this.mGravity = gravity;
            requestLayout();
        }
    }

    public int getGravity() {
        return this.mGravity;
    }

    public void setHorizontalGravity(int horizontalGravity) {
        int gravity = horizontalGravity & GravityCompat.RELATIVE_HORIZONTAL_GRAVITY_MASK;
        if ((8388615 & this.mGravity) != gravity) {
            this.mGravity = (this.mGravity & -8388616) | gravity;
            requestLayout();
        }
    }

    public void setVerticalGravity(int verticalGravity) {
        int gravity = verticalGravity & 112;
        if ((this.mGravity & 112) != gravity) {
            this.mGravity = (this.mGravity & -113) | gravity;
            requestLayout();
        }
    }

    public LayoutParams generateLayoutParams(AttributeSet attrs) {
        return new LayoutParams(getContext(), attrs);
    }

    /* access modifiers changed from: protected */
    public LayoutParams generateDefaultLayoutParams() {
        if (this.mOrientation == 0) {
            return new LayoutParams(-2, -2);
        }
        if (this.mOrientation == 1) {
            return new LayoutParams(-1, -2);
        }
        return null;
    }

    /* access modifiers changed from: protected */
    public LayoutParams generateLayoutParams(ViewGroup.LayoutParams p) {
        if (p instanceof LayoutParams) {
            return new LayoutParams((ViewGroup.MarginLayoutParams) (LayoutParams) p);
        }
        if (p instanceof ViewGroup.MarginLayoutParams) {
            return new LayoutParams((ViewGroup.MarginLayoutParams) p);
        }
        return new LayoutParams(p);
    }

    /* access modifiers changed from: protected */
    public boolean checkLayoutParams(ViewGroup.LayoutParams p) {
        return p instanceof LayoutParams;
    }

    public void onInitializeAccessibilityEvent(AccessibilityEvent event) {
        super.onInitializeAccessibilityEvent(event);
        event.setClassName(ACCESSIBILITY_CLASS_NAME);
    }

    public void onInitializeAccessibilityNodeInfo(AccessibilityNodeInfo info) {
        super.onInitializeAccessibilityNodeInfo(info);
        info.setClassName(ACCESSIBILITY_CLASS_NAME);
    }

    public static class LayoutParams extends LinearLayout.LayoutParams {
        public LayoutParams(Context c, AttributeSet attrs) {
            super(c, attrs);
        }

        public LayoutParams(int width, int height) {
            super(width, height);
        }

        public LayoutParams(int width, int height, float weight) {
            super(width, height, weight);
        }

        public LayoutParams(ViewGroup.LayoutParams p) {
            super(p);
        }

        public LayoutParams(ViewGroup.MarginLayoutParams source) {
            super(source);
        }
    }
}
