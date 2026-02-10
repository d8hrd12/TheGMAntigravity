package androidx.core.view.insets;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import androidx.core.R;
import androidx.core.graphics.Insets;
import androidx.core.view.insets.Protection;
import java.util.ArrayList;
import java.util.List;

public class ProtectionLayout extends FrameLayout {
    private static final Object PROTECTION_VIEW = new Object();
    private ProtectionGroup mGroup;
    private final List<Protection> mProtections;

    public ProtectionLayout(Context context) {
        super(context);
        this.mProtections = new ArrayList();
    }

    public ProtectionLayout(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public ProtectionLayout(Context context, AttributeSet attrs, int defStyleAttr) {
        this(context, attrs, defStyleAttr, 0);
    }

    public ProtectionLayout(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        this.mProtections = new ArrayList();
    }

    public ProtectionLayout(Context context, List<Protection> protections) {
        super(context);
        this.mProtections = new ArrayList();
        setProtections(protections);
    }

    public void setProtections(List<Protection> protections) {
        this.mProtections.clear();
        this.mProtections.addAll(protections);
        if (isAttachedToWindow()) {
            removeProtectionViews();
            addProtectionViews();
            requestApplyInsets();
        }
    }

    private SystemBarStateMonitor getOrInstallSystemBarStateMonitor() {
        ViewGroup rootView = (ViewGroup) getRootView();
        Object tag = rootView.getTag(R.id.tag_system_bar_state_monitor);
        if (tag instanceof SystemBarStateMonitor) {
            return (SystemBarStateMonitor) tag;
        }
        SystemBarStateMonitor monitor = new SystemBarStateMonitor(rootView);
        rootView.setTag(R.id.tag_system_bar_state_monitor, monitor);
        return monitor;
    }

    private void maybeUninstallSystemBarStateMonitor() {
        ViewGroup rootView = (ViewGroup) getRootView();
        Object tag = rootView.getTag(R.id.tag_system_bar_state_monitor);
        if (tag instanceof SystemBarStateMonitor) {
            SystemBarStateMonitor monitor = (SystemBarStateMonitor) tag;
            if (!monitor.hasCallback()) {
                monitor.detachFromWindow();
                rootView.setTag(R.id.tag_system_bar_state_monitor, (Object) null);
            }
        }
    }

    /* access modifiers changed from: protected */
    public void onAttachedToWindow() {
        super.onAttachedToWindow();
        if (this.mGroup != null) {
            removeProtectionViews();
        }
        addProtectionViews();
        requestApplyInsets();
    }

    /* access modifiers changed from: protected */
    public void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        removeProtectionViews();
        maybeUninstallSystemBarStateMonitor();
    }

    private void addProtectionViews() {
        if (!this.mProtections.isEmpty()) {
            this.mGroup = new ProtectionGroup(getOrInstallSystemBarStateMonitor(), this.mProtections);
            int nonProtectionChildCount = getChildCount();
            int size = this.mGroup.size();
            for (int i = 0; i < size; i++) {
                addProtectionView(getContext(), i + nonProtectionChildCount, this.mGroup.getProtection(i));
            }
        }
    }

    private void removeProtectionViews() {
        if (this.mGroup != null) {
            removeViews(getChildCount() - this.mGroup.size(), this.mGroup.size());
            int size = this.mGroup.size();
            for (int i = 0; i < size; i++) {
                this.mGroup.getProtection(i).getAttributes().setCallback((Protection.Attributes.Callback) null);
            }
            this.mGroup.dispose();
            this.mGroup = null;
        }
    }

    private void addProtectionView(Context context, int index, Protection protection) {
        int gravity;
        int height;
        int width;
        Protection.Attributes attrs = protection.getAttributes();
        switch (protection.getSide()) {
            case 1:
                width = attrs.getWidth();
                height = -1;
                gravity = 3;
                break;
            case 2:
                width = -1;
                height = attrs.getHeight();
                gravity = 48;
                break;
            case 4:
                width = attrs.getWidth();
                height = -1;
                gravity = 5;
                break;
            case 8:
                width = -1;
                height = attrs.getHeight();
                gravity = 80;
                break;
            default:
                throw new IllegalArgumentException("Unexpected side: " + protection.getSide());
        }
        final FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(width, height, gravity);
        Insets margin = attrs.getMargin();
        params.leftMargin = margin.left;
        params.topMargin = margin.top;
        params.rightMargin = margin.right;
        params.bottomMargin = margin.bottom;
        final View view = new View(context);
        view.setTag(PROTECTION_VIEW);
        view.setTranslationX(attrs.getTranslationX());
        view.setTranslationY(attrs.getTranslationY());
        view.setAlpha(attrs.getAlpha());
        view.setVisibility(attrs.isVisible() ? 0 : 4);
        view.setBackground(attrs.getDrawable());
        attrs.setCallback(new Protection.Attributes.Callback() {
            public void onWidthChanged(int width) {
                params.width = width;
                view.setLayoutParams(params);
            }

            public void onHeightChanged(int height) {
                params.height = height;
                view.setLayoutParams(params);
            }

            public void onMarginChanged(Insets margin) {
                params.leftMargin = margin.left;
                params.topMargin = margin.top;
                params.rightMargin = margin.right;
                params.bottomMargin = margin.bottom;
                view.setLayoutParams(params);
            }

            public void onVisibilityChanged(boolean visible) {
                view.setVisibility(visible ? 0 : 4);
            }

            public void onDrawableChanged(Drawable drawable) {
                view.setBackground(drawable);
            }

            public void onTranslationXChanged(float translationX) {
                view.setTranslationX(translationX);
            }

            public void onTranslationYChanged(float translationY) {
                view.setTranslationY(translationY);
            }

            public void onAlphaChanged(float alpha) {
                view.setAlpha(alpha);
            }
        });
        addView(view, index, params);
    }

    public void addView(View child, int index, ViewGroup.LayoutParams params) {
        if (!(child == null || child.getTag() == PROTECTION_VIEW)) {
            int maxIndex = getChildCount() - (this.mGroup != null ? this.mGroup.size() : 0);
            if (index > maxIndex || index < 0) {
                index = maxIndex;
            }
        }
        super.addView(child, index, params);
    }
}
