package com.getcapacitor;

import android.content.Context;
import android.util.AttributeSet;
import android.view.KeyEvent;
import android.view.inputmethod.BaseInputConnection;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.webkit.ValueCallback;
import android.webkit.WebView;

public class CapacitorWebView extends WebView {
    private Bridge bridge;
    private BaseInputConnection capInputConnection;

    public CapacitorWebView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public void setBridge(Bridge bridge2) {
        this.bridge = bridge2;
    }

    public InputConnection onCreateInputConnection(EditorInfo outAttrs) {
        CapConfig config;
        if (this.bridge != null) {
            config = this.bridge.getConfig();
        } else {
            config = CapConfig.loadDefault(getContext());
        }
        if (!config.isInputCaptured()) {
            return super.onCreateInputConnection(outAttrs);
        }
        if (this.capInputConnection == null) {
            this.capInputConnection = new BaseInputConnection(this, false);
        }
        return this.capInputConnection;
    }

    public boolean dispatchKeyEvent(KeyEvent event) {
        if (event.getAction() != 2) {
            return super.dispatchKeyEvent(event);
        }
        evaluateJavascript("document.activeElement.value = document.activeElement.value + '" + event.getCharacters() + "';", (ValueCallback) null);
        return false;
    }
}
