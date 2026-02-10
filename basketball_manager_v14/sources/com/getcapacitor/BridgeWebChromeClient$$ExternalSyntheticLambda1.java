package com.getcapacitor;

import android.content.DialogInterface;
import android.webkit.JsResult;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class BridgeWebChromeClient$$ExternalSyntheticLambda1 implements DialogInterface.OnClickListener {
    public final /* synthetic */ JsResult f$0;

    public /* synthetic */ BridgeWebChromeClient$$ExternalSyntheticLambda1(JsResult jsResult) {
        this.f$0 = jsResult;
    }

    public final void onClick(DialogInterface dialogInterface, int i) {
        BridgeWebChromeClient.lambda$onJsAlert$0(this.f$0, dialogInterface, i);
    }
}
