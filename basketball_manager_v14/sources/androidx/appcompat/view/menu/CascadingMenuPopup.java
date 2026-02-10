package androidx.appcompat.view.menu;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Rect;
import android.os.Handler;
import android.os.Parcelable;
import android.os.SystemClock;
import android.util.AttributeSet;
import android.view.KeyEvent;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewTreeObserver;
import android.widget.ListView;
import android.widget.PopupWindow;
import androidx.appcompat.R;
import androidx.appcompat.view.menu.MenuPresenter;
import androidx.appcompat.widget.MenuItemHoverListener;
import androidx.appcompat.widget.MenuPopupWindow;
import androidx.core.view.GravityCompat;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.ArrayList;
import java.util.List;

final class CascadingMenuPopup extends MenuPopup implements MenuPresenter, View.OnKeyListener, PopupWindow.OnDismissListener {
    static final int HORIZ_POSITION_LEFT = 0;
    static final int HORIZ_POSITION_RIGHT = 1;
    private static final int ITEM_LAYOUT = R.layout.abc_cascading_menu_item_layout;
    static final int SUBMENU_TIMEOUT_MS = 200;
    private View mAnchorView;
    private final View.OnAttachStateChangeListener mAttachStateChangeListener = new View.OnAttachStateChangeListener() {
        public void onViewAttachedToWindow(View v) {
        }

        public void onViewDetachedFromWindow(View v) {
            if (CascadingMenuPopup.this.mTreeObserver != null) {
                if (!CascadingMenuPopup.this.mTreeObserver.isAlive()) {
                    CascadingMenuPopup.this.mTreeObserver = v.getViewTreeObserver();
                }
                CascadingMenuPopup.this.mTreeObserver.removeGlobalOnLayoutListener(CascadingMenuPopup.this.mGlobalLayoutListener);
            }
            v.removeOnAttachStateChangeListener(this);
        }
    };
    private final Context mContext;
    private int mDropDownGravity = 0;
    private boolean mForceShowIcon;
    final ViewTreeObserver.OnGlobalLayoutListener mGlobalLayoutListener = new ViewTreeObserver.OnGlobalLayoutListener() {
        public void onGlobalLayout() {
            if (CascadingMenuPopup.this.isShowing() && CascadingMenuPopup.this.mShowingMenus.size() > 0 && !CascadingMenuPopup.this.mShowingMenus.get(0).window.isModal()) {
                View anchor = CascadingMenuPopup.this.mShownAnchorView;
                if (anchor == null || !anchor.isShown()) {
                    CascadingMenuPopup.this.dismiss();
                    return;
                }
                for (CascadingMenuInfo info : CascadingMenuPopup.this.mShowingMenus) {
                    info.window.show();
                }
            }
        }
    };
    private boolean mHasXOffset;
    private boolean mHasYOffset;
    private int mLastPosition;
    private final MenuItemHoverListener mMenuItemHoverListener = new MenuItemHoverListener() {
        public void onItemHoverExit(MenuBuilder menu, MenuItem item) {
            CascadingMenuPopup.this.mSubMenuHoverHandler.removeCallbacksAndMessages(menu);
        }

        public void onItemHoverEnter(final MenuBuilder menu, final MenuItem item) {
            final CascadingMenuInfo nextInfo;
            CascadingMenuPopup.this.mSubMenuHoverHandler.removeCallbacksAndMessages((Object) null);
            int menuIndex = -1;
            int i = 0;
            int count = CascadingMenuPopup.this.mShowingMenus.size();
            while (true) {
                if (i >= count) {
                    break;
                } else if (menu == CascadingMenuPopup.this.mShowingMenus.get(i).menu) {
                    menuIndex = i;
                    break;
                } else {
                    i++;
                }
            }
            if (menuIndex != -1) {
                int nextIndex = menuIndex + 1;
                if (nextIndex < CascadingMenuPopup.this.mShowingMenus.size()) {
                    nextInfo = CascadingMenuPopup.this.mShowingMenus.get(nextIndex);
                } else {
                    nextInfo = null;
                }
                CascadingMenuPopup.this.mSubMenuHoverHandler.postAtTime(new Runnable() {
                    public void run() {
                        if (nextInfo != null) {
                            CascadingMenuPopup.this.mShouldCloseImmediately = true;
                            nextInfo.menu.close(false);
                            CascadingMenuPopup.this.mShouldCloseImmediately = false;
                        }
                        if (item.isEnabled() && item.hasSubMenu()) {
                            menu.performItemAction(item, 4);
                        }
                    }
                }, menu, SystemClock.uptimeMillis() + 200);
            }
        }
    };
    private final int mMenuMaxWidth;
    private PopupWindow.OnDismissListener mOnDismissListener;
    private final boolean mOverflowOnly;
    private final List<MenuBuilder> mPendingMenus = new ArrayList();
    private final int mPopupStyleAttr;
    private final int mPopupStyleRes;
    private MenuPresenter.Callback mPresenterCallback;
    private int mRawDropDownGravity = 0;
    boolean mShouldCloseImmediately;
    private boolean mShowTitle;
    final List<CascadingMenuInfo> mShowingMenus = new ArrayList();
    View mShownAnchorView;
    final Handler mSubMenuHoverHandler;
    ViewTreeObserver mTreeObserver;
    private int mXOffset;
    private int mYOffset;

    @Retention(RetentionPolicy.SOURCE)
    public @interface HorizPosition {
    }

    public CascadingMenuPopup(Context context, View anchor, int popupStyleAttr, int popupStyleRes, boolean overflowOnly) {
        this.mContext = context;
        this.mAnchorView = anchor;
        this.mPopupStyleAttr = popupStyleAttr;
        this.mPopupStyleRes = popupStyleRes;
        this.mOverflowOnly = overflowOnly;
        this.mForceShowIcon = false;
        this.mLastPosition = getInitialMenuPosition();
        Resources res = context.getResources();
        this.mMenuMaxWidth = Math.max(res.getDisplayMetrics().widthPixels / 2, res.getDimensionPixelSize(R.dimen.abc_config_prefDialogWidth));
        this.mSubMenuHoverHandler = new Handler();
    }

    public void setForceShowIcon(boolean forceShow) {
        this.mForceShowIcon = forceShow;
    }

    private MenuPopupWindow createPopupWindow() {
        MenuPopupWindow popupWindow = new MenuPopupWindow(this.mContext, (AttributeSet) null, this.mPopupStyleAttr, this.mPopupStyleRes);
        popupWindow.setHoverListener(this.mMenuItemHoverListener);
        popupWindow.setOnItemClickListener(this);
        popupWindow.setOnDismissListener(this);
        popupWindow.setAnchorView(this.mAnchorView);
        popupWindow.setDropDownGravity(this.mDropDownGravity);
        popupWindow.setModal(true);
        popupWindow.setInputMethodMode(2);
        return popupWindow;
    }

    public void show() {
        if (!isShowing()) {
            for (MenuBuilder menu : this.mPendingMenus) {
                showMenu(menu);
            }
            this.mPendingMenus.clear();
            this.mShownAnchorView = this.mAnchorView;
            if (this.mShownAnchorView != null) {
                boolean addGlobalListener = this.mTreeObserver == null;
                this.mTreeObserver = this.mShownAnchorView.getViewTreeObserver();
                if (addGlobalListener) {
                    this.mTreeObserver.addOnGlobalLayoutListener(this.mGlobalLayoutListener);
                }
                this.mShownAnchorView.addOnAttachStateChangeListener(this.mAttachStateChangeListener);
            }
        }
    }

    public void dismiss() {
        int length = this.mShowingMenus.size();
        if (length > 0) {
            CascadingMenuInfo[] addedMenus = (CascadingMenuInfo[]) this.mShowingMenus.toArray(new CascadingMenuInfo[length]);
            for (int i = length - 1; i >= 0; i--) {
                CascadingMenuInfo info = addedMenus[i];
                if (info.window.isShowing()) {
                    info.window.dismiss();
                }
            }
        }
    }

    public boolean onKey(View v, int keyCode, KeyEvent event) {
        if (event.getAction() != 1 || keyCode != 82) {
            return false;
        }
        dismiss();
        return true;
    }

    private int getInitialMenuPosition() {
        return this.mAnchorView.getLayoutDirection() == 1 ? 0 : 1;
    }

    private int getNextMenuPosition(int nextMenuWidth) {
        ListView lastListView = this.mShowingMenus.get(this.mShowingMenus.size() - 1).getListView();
        int[] screenLocation = new int[2];
        lastListView.getLocationOnScreen(screenLocation);
        Rect displayFrame = new Rect();
        this.mShownAnchorView.getWindowVisibleDisplayFrame(displayFrame);
        if (this.mLastPosition == 1) {
            if (screenLocation[0] + lastListView.getWidth() + nextMenuWidth > displayFrame.right) {
                return 0;
            }
            return 1;
        } else if (screenLocation[0] - nextMenuWidth < 0) {
            return 1;
        } else {
            return 0;
        }
    }

    public void addMenu(MenuBuilder menu) {
        menu.addMenuPresenter(this, this.mContext);
        if (isShowing()) {
            showMenu(menu);
        } else {
            this.mPendingMenus.add(menu);
        }
    }

    /* JADX WARNING: type inference failed for: r16v3 */
    /* JADX WARNING: type inference failed for: r16v4 */
    /* JADX WARNING: type inference failed for: r16v5 */
    /* JADX WARNING: Multi-variable type inference failed */
    /* JADX WARNING: Unknown variable types count: 1 */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private void showMenu(androidx.appcompat.view.menu.MenuBuilder r19) {
        /*
            r18 = this;
            r0 = r18
            r1 = r19
            android.content.Context r2 = r0.mContext
            android.view.LayoutInflater r2 = android.view.LayoutInflater.from(r2)
            androidx.appcompat.view.menu.MenuAdapter r3 = new androidx.appcompat.view.menu.MenuAdapter
            boolean r4 = r0.mOverflowOnly
            int r5 = ITEM_LAYOUT
            r3.<init>(r1, r2, r4, r5)
            boolean r4 = r0.isShowing()
            r5 = 1
            if (r4 != 0) goto L_0x0022
            boolean r4 = r0.mForceShowIcon
            if (r4 == 0) goto L_0x0022
            r3.setForceShowIcon(r5)
            goto L_0x002f
        L_0x0022:
            boolean r4 = r0.isShowing()
            if (r4 == 0) goto L_0x002f
            boolean r4 = androidx.appcompat.view.menu.MenuPopup.shouldPreserveIconSpacing(r1)
            r3.setForceShowIcon(r4)
        L_0x002f:
            android.content.Context r4 = r0.mContext
            int r6 = r0.mMenuMaxWidth
            r7 = 0
            int r4 = measureIndividualMenuWidth(r3, r7, r4, r6)
            androidx.appcompat.widget.MenuPopupWindow r6 = r0.createPopupWindow()
            r6.setAdapter(r3)
            r6.setContentWidth(r4)
            int r8 = r0.mDropDownGravity
            r6.setDropDownGravity(r8)
            java.util.List<androidx.appcompat.view.menu.CascadingMenuPopup$CascadingMenuInfo> r8 = r0.mShowingMenus
            int r8 = r8.size()
            if (r8 <= 0) goto L_0x0063
            java.util.List<androidx.appcompat.view.menu.CascadingMenuPopup$CascadingMenuInfo> r8 = r0.mShowingMenus
            java.util.List<androidx.appcompat.view.menu.CascadingMenuPopup$CascadingMenuInfo> r9 = r0.mShowingMenus
            int r9 = r9.size()
            int r9 = r9 - r5
            java.lang.Object r8 = r8.get(r9)
            androidx.appcompat.view.menu.CascadingMenuPopup$CascadingMenuInfo r8 = (androidx.appcompat.view.menu.CascadingMenuPopup.CascadingMenuInfo) r8
            android.view.View r9 = r0.findParentViewForSubmenu(r8, r1)
            goto L_0x0065
        L_0x0063:
            r8 = 0
            r9 = 0
        L_0x0065:
            r10 = 0
            if (r9 == 0) goto L_0x00e6
            r6.setTouchModal(r10)
            r6.setEnterTransition(r7)
            int r11 = r0.getNextMenuPosition(r4)
            if (r11 != r5) goto L_0x0076
            r12 = r5
            goto L_0x0077
        L_0x0076:
            r12 = r10
        L_0x0077:
            r0.mLastPosition = r11
            int r13 = android.os.Build.VERSION.SDK_INT
            r14 = 26
            r15 = 5
            if (r13 < r14) goto L_0x0088
            r6.setAnchorView(r9)
            r13 = 0
            r14 = 0
            r16 = r10
            goto L_0x00c1
        L_0x0088:
            r13 = 2
            int[] r14 = new int[r13]
            android.view.View r7 = r0.mAnchorView
            r7.getLocationOnScreen(r14)
            int[] r7 = new int[r13]
            r9.getLocationOnScreen(r7)
            int r13 = r0.mDropDownGravity
            r13 = r13 & 7
            if (r13 != r15) goto L_0x00b2
            r13 = r14[r10]
            r16 = r10
            android.view.View r10 = r0.mAnchorView
            int r10 = r10.getWidth()
            int r13 = r13 + r10
            r14[r16] = r13
            r10 = r7[r16]
            int r13 = r9.getWidth()
            int r10 = r10 + r13
            r7[r16] = r10
            goto L_0x00b4
        L_0x00b2:
            r16 = r10
        L_0x00b4:
            r10 = r7[r16]
            r13 = r14[r16]
            int r13 = r10 - r13
            r10 = r7[r5]
            r17 = r14[r5]
            int r10 = r10 - r17
            r14 = r10
        L_0x00c1:
            int r7 = r0.mDropDownGravity
            r7 = r7 & r15
            if (r7 != r15) goto L_0x00d2
            if (r12 == 0) goto L_0x00cb
            int r7 = r13 + r4
            goto L_0x00dc
        L_0x00cb:
            int r7 = r9.getWidth()
            int r7 = r13 - r7
            goto L_0x00dc
        L_0x00d2:
            if (r12 == 0) goto L_0x00da
            int r7 = r9.getWidth()
            int r7 = r7 + r13
            goto L_0x00dc
        L_0x00da:
            int r7 = r13 - r4
        L_0x00dc:
            r6.setHorizontalOffset(r7)
            r6.setOverlapAnchor(r5)
            r6.setVerticalOffset(r14)
            goto L_0x0101
        L_0x00e6:
            r16 = r10
            boolean r5 = r0.mHasXOffset
            if (r5 == 0) goto L_0x00f1
            int r5 = r0.mXOffset
            r6.setHorizontalOffset(r5)
        L_0x00f1:
            boolean r5 = r0.mHasYOffset
            if (r5 == 0) goto L_0x00fa
            int r5 = r0.mYOffset
            r6.setVerticalOffset(r5)
        L_0x00fa:
            android.graphics.Rect r5 = r0.getEpicenterBounds()
            r6.setEpicenterBounds(r5)
        L_0x0101:
            androidx.appcompat.view.menu.CascadingMenuPopup$CascadingMenuInfo r5 = new androidx.appcompat.view.menu.CascadingMenuPopup$CascadingMenuInfo
            int r7 = r0.mLastPosition
            r5.<init>(r6, r1, r7)
            java.util.List<androidx.appcompat.view.menu.CascadingMenuPopup$CascadingMenuInfo> r7 = r0.mShowingMenus
            r7.add(r5)
            r6.show()
            android.widget.ListView r7 = r6.getListView()
            r7.setOnKeyListener(r0)
            if (r8 != 0) goto L_0x0147
            boolean r10 = r0.mShowTitle
            if (r10 == 0) goto L_0x0147
            java.lang.CharSequence r10 = r1.getHeaderTitle()
            if (r10 == 0) goto L_0x0147
            int r10 = androidx.appcompat.R.layout.abc_popup_menu_header_item_layout
            r11 = r16
            android.view.View r10 = r2.inflate(r10, r7, r11)
            android.widget.FrameLayout r10 = (android.widget.FrameLayout) r10
            r12 = 16908310(0x1020016, float:2.387729E-38)
            android.view.View r12 = r10.findViewById(r12)
            android.widget.TextView r12 = (android.widget.TextView) r12
            r10.setEnabled(r11)
            java.lang.CharSequence r13 = r1.getHeaderTitle()
            r12.setText(r13)
            r13 = 0
            r7.addHeaderView(r10, r13, r11)
            r6.show()
        L_0x0147:
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.view.menu.CascadingMenuPopup.showMenu(androidx.appcompat.view.menu.MenuBuilder):void");
    }

    private MenuItem findMenuItemForSubmenu(MenuBuilder parent, MenuBuilder submenu) {
        int count = parent.size();
        for (int i = 0; i < count; i++) {
            MenuItem item = parent.getItem(i);
            if (item.hasSubMenu() && submenu == item.getSubMenu()) {
                return item;
            }
        }
        return null;
    }

    /* JADX WARNING: type inference failed for: r6v4, types: [android.widget.ListAdapter] */
    /* JADX WARNING: Multi-variable type inference failed */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private android.view.View findParentViewForSubmenu(androidx.appcompat.view.menu.CascadingMenuPopup.CascadingMenuInfo r11, androidx.appcompat.view.menu.MenuBuilder r12) {
        /*
            r10 = this;
            androidx.appcompat.view.menu.MenuBuilder r0 = r11.menu
            android.view.MenuItem r0 = r10.findMenuItemForSubmenu(r0, r12)
            r1 = 0
            if (r0 != 0) goto L_0x000a
            return r1
        L_0x000a:
            android.widget.ListView r2 = r11.getListView()
            android.widget.ListAdapter r3 = r2.getAdapter()
            boolean r4 = r3 instanceof android.widget.HeaderViewListAdapter
            if (r4 == 0) goto L_0x0025
            r4 = r3
            android.widget.HeaderViewListAdapter r4 = (android.widget.HeaderViewListAdapter) r4
            int r5 = r4.getHeadersCount()
            android.widget.ListAdapter r6 = r4.getWrappedAdapter()
            r4 = r6
            androidx.appcompat.view.menu.MenuAdapter r4 = (androidx.appcompat.view.menu.MenuAdapter) r4
            goto L_0x0029
        L_0x0025:
            r5 = 0
            r4 = r3
            androidx.appcompat.view.menu.MenuAdapter r4 = (androidx.appcompat.view.menu.MenuAdapter) r4
        L_0x0029:
            r6 = -1
            r7 = 0
            int r8 = r4.getCount()
        L_0x002f:
            if (r7 >= r8) goto L_0x003c
            androidx.appcompat.view.menu.MenuItemImpl r9 = r4.getItem((int) r7)
            if (r0 != r9) goto L_0x0039
            r6 = r7
            goto L_0x003c
        L_0x0039:
            int r7 = r7 + 1
            goto L_0x002f
        L_0x003c:
            r7 = -1
            if (r6 != r7) goto L_0x0040
            return r1
        L_0x0040:
            int r6 = r6 + r5
            int r7 = r2.getFirstVisiblePosition()
            int r7 = r6 - r7
            if (r7 < 0) goto L_0x0055
            int r8 = r2.getChildCount()
            if (r7 < r8) goto L_0x0050
            goto L_0x0055
        L_0x0050:
            android.view.View r1 = r2.getChildAt(r7)
            return r1
        L_0x0055:
            return r1
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.appcompat.view.menu.CascadingMenuPopup.findParentViewForSubmenu(androidx.appcompat.view.menu.CascadingMenuPopup$CascadingMenuInfo, androidx.appcompat.view.menu.MenuBuilder):android.view.View");
    }

    public boolean isShowing() {
        return this.mShowingMenus.size() > 0 && this.mShowingMenus.get(0).window.isShowing();
    }

    public void onDismiss() {
        CascadingMenuInfo dismissedInfo = null;
        int i = 0;
        int count = this.mShowingMenus.size();
        while (true) {
            if (i >= count) {
                break;
            }
            CascadingMenuInfo info = this.mShowingMenus.get(i);
            if (!info.window.isShowing()) {
                dismissedInfo = info;
                break;
            }
            i++;
        }
        if (dismissedInfo != null) {
            dismissedInfo.menu.close(false);
        }
    }

    public void updateMenuView(boolean cleared) {
        for (CascadingMenuInfo info : this.mShowingMenus) {
            toMenuAdapter(info.getListView().getAdapter()).notifyDataSetChanged();
        }
    }

    public void setCallback(MenuPresenter.Callback cb) {
        this.mPresenterCallback = cb;
    }

    public boolean onSubMenuSelected(SubMenuBuilder subMenu) {
        for (CascadingMenuInfo info : this.mShowingMenus) {
            if (subMenu == info.menu) {
                info.getListView().requestFocus();
                return true;
            }
        }
        if (!subMenu.hasVisibleItems()) {
            return false;
        }
        addMenu(subMenu);
        if (this.mPresenterCallback != null) {
            this.mPresenterCallback.onOpenSubMenu(subMenu);
        }
        return true;
    }

    private int findIndexOfAddedMenu(MenuBuilder menu) {
        int count = this.mShowingMenus.size();
        for (int i = 0; i < count; i++) {
            if (menu == this.mShowingMenus.get(i).menu) {
                return i;
            }
        }
        return -1;
    }

    public void onCloseMenu(MenuBuilder menu, boolean allMenusAreClosing) {
        int menuIndex = findIndexOfAddedMenu(menu);
        if (menuIndex >= 0) {
            int nextMenuIndex = menuIndex + 1;
            if (nextMenuIndex < this.mShowingMenus.size()) {
                this.mShowingMenus.get(nextMenuIndex).menu.close(false);
            }
            CascadingMenuInfo info = this.mShowingMenus.remove(menuIndex);
            info.menu.removeMenuPresenter(this);
            if (this.mShouldCloseImmediately) {
                info.window.setExitTransition((Object) null);
                info.window.setAnimationStyle(0);
            }
            info.window.dismiss();
            int count = this.mShowingMenus.size();
            if (count > 0) {
                this.mLastPosition = this.mShowingMenus.get(count - 1).position;
            } else {
                this.mLastPosition = getInitialMenuPosition();
            }
            if (count == 0) {
                dismiss();
                if (this.mPresenterCallback != null) {
                    this.mPresenterCallback.onCloseMenu(menu, true);
                }
                if (this.mTreeObserver != null) {
                    if (this.mTreeObserver.isAlive()) {
                        this.mTreeObserver.removeGlobalOnLayoutListener(this.mGlobalLayoutListener);
                    }
                    this.mTreeObserver = null;
                }
                this.mShownAnchorView.removeOnAttachStateChangeListener(this.mAttachStateChangeListener);
                this.mOnDismissListener.onDismiss();
            } else if (allMenusAreClosing) {
                this.mShowingMenus.get(0).menu.close(false);
            }
        }
    }

    public boolean flagActionItems() {
        return false;
    }

    public Parcelable onSaveInstanceState() {
        return null;
    }

    public void onRestoreInstanceState(Parcelable state) {
    }

    public void setGravity(int dropDownGravity) {
        if (this.mRawDropDownGravity != dropDownGravity) {
            this.mRawDropDownGravity = dropDownGravity;
            this.mDropDownGravity = GravityCompat.getAbsoluteGravity(dropDownGravity, this.mAnchorView.getLayoutDirection());
        }
    }

    public void setAnchorView(View anchor) {
        if (this.mAnchorView != anchor) {
            this.mAnchorView = anchor;
            this.mDropDownGravity = GravityCompat.getAbsoluteGravity(this.mRawDropDownGravity, this.mAnchorView.getLayoutDirection());
        }
    }

    public void setOnDismissListener(PopupWindow.OnDismissListener listener) {
        this.mOnDismissListener = listener;
    }

    public ListView getListView() {
        if (this.mShowingMenus.isEmpty()) {
            return null;
        }
        return this.mShowingMenus.get(this.mShowingMenus.size() - 1).getListView();
    }

    public void setHorizontalOffset(int x) {
        this.mHasXOffset = true;
        this.mXOffset = x;
    }

    public void setVerticalOffset(int y) {
        this.mHasYOffset = true;
        this.mYOffset = y;
    }

    public void setShowTitle(boolean showTitle) {
        this.mShowTitle = showTitle;
    }

    /* access modifiers changed from: protected */
    public boolean closeMenuOnSubMenuOpened() {
        return false;
    }

    private static class CascadingMenuInfo {
        public final MenuBuilder menu;
        public final int position;
        public final MenuPopupWindow window;

        public CascadingMenuInfo(MenuPopupWindow window2, MenuBuilder menu2, int position2) {
            this.window = window2;
            this.menu = menu2;
            this.position = position2;
        }

        public ListView getListView() {
            return this.window.getListView();
        }
    }
}
