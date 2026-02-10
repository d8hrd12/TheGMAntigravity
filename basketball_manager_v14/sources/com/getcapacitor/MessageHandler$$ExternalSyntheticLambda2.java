package com.getcapacitor;

import android.net.Uri;
import android.webkit.WebView;
import androidx.webkit.JavaScriptReplyProxy;
import androidx.webkit.WebMessageCompat;
import androidx.webkit.WebViewCompat;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class MessageHandler$$ExternalSyntheticLambda2 implements WebViewCompat.WebMessageListener {
    public final /* synthetic */ MessageHandler f$0;

    public /* synthetic */ MessageHandler$$ExternalSyntheticLambda2(MessageHandler messageHandler) {
        this.f$0 = messageHandler;
    }

    public final void onPostMessage(WebView webView, WebMessageCompat webMessageCompat, Uri uri, boolean z, JavaScriptReplyProxy javaScriptReplyProxy) {
        this.f$0.lambda$new$0(webView, webMessageCompat, uri, z, javaScriptReplyProxy);
    }
}
