package androidx.appcompat.widget;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import androidx.appcompat.R;
import androidx.appcompat.widget.LinearLayoutCompat;
import androidx.core.view.GravityCompat;
import androidx.core.view.ViewCompat;

public class AlertDialogLayout extends LinearLayoutCompat {
    public AlertDialogLayout(Context context) {
        super(context);
    }

    public AlertDialogLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    /* access modifiers changed from: protected */
    public void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        if (!tryOnMeasure(widthMeasureSpec, heightMeasureSpec)) {
            super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        }
    }

    private boolean tryOnMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int childHeightSpec;
        int i = widthMeasureSpec;
        int i2 = heightMeasureSpec;
        View topPanel = null;
        View buttonPanel = null;
        View middlePanel = null;
        int count = getChildCount();
        for (int i3 = 0; i3 < count; i3++) {
            View child = getChildAt(i3);
            if (child.getVisibility() != 8) {
                int id = child.getId();
                if (id == R.id.topPanel) {
                    topPanel = child;
                } else if (id == R.id.buttonPanel) {
                    buttonPanel = child;
                } else if ((id != R.id.contentPanel && id != R.id.customPanel) || middlePanel != null) {
                    return false;
                } else {
                    middlePanel = child;
                }
            }
        }
        int heightMode = View.MeasureSpec.getMode(i2);
        int heightSize = View.MeasureSpec.getSize(i2);
        int widthMode = View.MeasureSpec.getMode(i);
        int childState = 0;
        int usedHeight = getPaddingTop() + getPaddingBottom();
        if (topPanel != null) {
            topPanel.measure(i, 0);
            usedHeight += topPanel.getMeasuredHeight();
            childState = View.combineMeasuredStates(0, topPanel.getMeasuredState());
        }
        int buttonHeight = 0;
        int buttonWantsHeight = 0;
        if (buttonPanel != null) {
            buttonPanel.measure(i, 0);
            buttonHeight = resolveMinimumHeight(buttonPanel);
            buttonWantsHeight = buttonPanel.getMeasuredHeight() - buttonHeight;
            usedHeight += buttonHeight;
            childState = View.combineMeasuredStates(childState, buttonPanel.getMeasuredState());
        }
        int middleHeight = 0;
        if (middlePanel != null) {
            if (heightMode == 0) {
                View view = topPanel;
                childHeightSpec = 0;
            } else {
                View view2 = topPanel;
                childHeightSpec = View.MeasureSpec.makeMeasureSpec(Math.max(0, heightSize - usedHeight), heightMode);
            }
            middlePanel.measure(i, childHeightSpec);
            middleHeight = middlePanel.getMeasuredHeight();
            usedHeight += middleHeight;
            childState = View.combineMeasuredStates(childState, middlePanel.getMeasuredState());
        }
        int remainingHeight = heightSize - usedHeight;
        if (buttonPanel != null) {
            int usedHeight2 = usedHeight - buttonHeight;
            int heightToGive = Math.min(remainingHeight, buttonWantsHeight);
            if (heightToGive > 0) {
                remainingHeight -= heightToGive;
                buttonHeight += heightToGive;
            }
            buttonPanel.measure(i, View.MeasureSpec.makeMeasureSpec(buttonHeight, 1073741824));
            usedHeight = usedHeight2 + buttonPanel.getMeasuredHeight();
            childState = View.combineMeasuredStates(childState, buttonPanel.getMeasuredState());
            remainingHeight = remainingHeight;
        }
        if (middlePanel != null && remainingHeight > 0) {
            int heightToGive2 = remainingHeight;
            int remainingHeight2 = remainingHeight - heightToGive2;
            int childHeightSpec2 = View.MeasureSpec.makeMeasureSpec(middleHeight + heightToGive2, heightMode);
            middlePanel.measure(i, childHeightSpec2);
            usedHeight = (usedHeight - middleHeight) + middlePanel.getMeasuredHeight();
            int i4 = childHeightSpec2;
            childState = View.combineMeasuredStates(childState, middlePanel.getMeasuredState());
            remainingHeight = remainingHeight2;
        }
        int maxWidth = 0;
        int i5 = remainingHeight;
        int remainingHeight3 = 0;
        while (remainingHeight3 < count) {
            View child2 = getChildAt(remainingHeight3);
            int i6 = remainingHeight3;
            View buttonPanel2 = buttonPanel;
            if (child2.getVisibility() != 8) {
                maxWidth = Math.max(maxWidth, child2.getMeasuredWidth());
            }
            remainingHeight3 = i6 + 1;
            buttonPanel = buttonPanel2;
        }
        int i7 = remainingHeight3;
        View view3 = buttonPanel;
        setMeasuredDimension(View.resolveSizeAndState(maxWidth + getPaddingLeft() + getPaddingRight(), i, childState), View.resolveSizeAndState(usedHeight, i2, 0));
        if (widthMode == 1073741824) {
            return true;
        }
        forceUniformWidth(count, i2);
        return true;
    }

    private void forceUniformWidth(int count, int heightMeasureSpec) {
        int heightMeasureSpec2;
        int uniformMeasureSpec = View.MeasureSpec.makeMeasureSpec(getMeasuredWidth(), 1073741824);
        int i = 0;
        while (i < count) {
            View child = getChildAt(i);
            if (child.getVisibility() != 8) {
                LinearLayoutCompat.LayoutParams lp = (LinearLayoutCompat.LayoutParams) child.getLayoutParams();
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

    private static int resolveMinimumHeight(View v) {
        int minHeight = ViewCompat.getMinimumHeight(v);
        if (minHeight > 0) {
            return minHeight;
        }
        if (v instanceof ViewGroup) {
            ViewGroup vg = (ViewGroup) v;
            if (vg.getChildCount() == 1) {
                return resolveMinimumHeight(vg.getChildAt(0));
            }
        }
        return 0;
    }

    /* access modifiers changed from: protected */
    public void onLayout(boolean changed, int left, int top, int right, int bottom) {
        int childTop;
        int width;
        int paddingLeft;
        int i;
        int childLeft;
        int childTop2;
        AlertDialogLayout alertDialogLayout = this;
        int paddingLeft2 = alertDialogLayout.getPaddingLeft();
        int width2 = right - left;
        int childRight = width2 - alertDialogLayout.getPaddingRight();
        int childSpace = (width2 - paddingLeft2) - alertDialogLayout.getPaddingRight();
        int totalLength = alertDialogLayout.getMeasuredHeight();
        int count = alertDialogLayout.getChildCount();
        int gravity = alertDialogLayout.getGravity();
        int majorGravity = gravity & 112;
        int minorGravity = gravity & GravityCompat.RELATIVE_HORIZONTAL_GRAVITY_MASK;
        switch (majorGravity) {
            case 16:
                childTop = alertDialogLayout.getPaddingTop() + (((bottom - top) - totalLength) / 2);
                break;
            case 80:
                childTop = ((alertDialogLayout.getPaddingTop() + bottom) - top) - totalLength;
                break;
            default:
                childTop = alertDialogLayout.getPaddingTop();
                break;
        }
        Drawable dividerDrawable = alertDialogLayout.getDividerDrawable();
        int dividerHeight = dividerDrawable == null ? 0 : dividerDrawable.getIntrinsicHeight();
        int i2 = 0;
        while (i2 < count) {
            int childTop3 = childTop;
            View child = alertDialogLayout.getChildAt(i2);
            if (child == null || child.getVisibility() == 8) {
                i = i2;
                paddingLeft = paddingLeft2;
                width = width2;
            } else {
                int childWidth = child.getMeasuredWidth();
                int childHeight = child.getMeasuredHeight();
                paddingLeft = paddingLeft2;
                LinearLayoutCompat.LayoutParams lp = (LinearLayoutCompat.LayoutParams) child.getLayoutParams();
                View child2 = child;
                int layoutGravity = lp.gravity;
                if (layoutGravity < 0) {
                    layoutGravity = minorGravity;
                }
                width = width2;
                switch (GravityCompat.getAbsoluteGravity(layoutGravity, alertDialogLayout.getLayoutDirection()) & 7) {
                    case 1:
                        childLeft = ((paddingLeft + ((childSpace - childWidth) / 2)) + lp.leftMargin) - lp.rightMargin;
                        break;
                    case 5:
                        int i3 = layoutGravity;
                        childLeft = (childRight - childWidth) - lp.rightMargin;
                        break;
                    default:
                        int i4 = layoutGravity;
                        childLeft = paddingLeft + lp.leftMargin;
                        break;
                }
                if (alertDialogLayout.hasDividerBeforeChildAt(i2)) {
                    childTop2 = childTop3 + dividerHeight;
                } else {
                    childTop2 = childTop3;
                }
                int childTop4 = lp.topMargin + childTop2;
                View child3 = child2;
                i = i2;
                alertDialogLayout.setChildFrame(child3, childLeft, childTop4, childWidth, childHeight);
                childTop3 = childTop4 + lp.bottomMargin + childHeight;
            }
            childTop = childTop3;
            i2 = i + 1;
            alertDialogLayout = this;
            paddingLeft2 = paddingLeft;
            width2 = width;
        }
    }

    private void setChildFrame(View child, int left, int top, int width, int height) {
        child.layout(left, top, left + width, top + height);
    }
}
