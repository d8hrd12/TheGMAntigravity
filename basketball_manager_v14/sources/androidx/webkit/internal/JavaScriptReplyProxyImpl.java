package androidx.webkit.internal;

import androidx.webkit.JavaScriptReplyProxy;
import java.lang.reflect.InvocationHandler;
import java.util.Objects;
import org.chromium.support_lib_boundary.JsReplyProxyBoundaryInterface;
import org.chromium.support_lib_boundary.util.BoundaryInterfaceReflectionUtil;

public class JavaScriptReplyProxyImpl extends JavaScriptReplyProxy {
    private final JsReplyProxyBoundaryInterface mBoundaryInterface;

    public JavaScriptReplyProxyImpl(JsReplyProxyBoundaryInterface boundaryInterface) {
        this.mBoundaryInterface = boundaryInterface;
    }

    public static JavaScriptReplyProxyImpl forInvocationHandler(InvocationHandler invocationHandler) {
        JsReplyProxyBoundaryInterface boundaryInterface = (JsReplyProxyBoundaryInterface) BoundaryInterfaceReflectionUtil.castToSuppLibClass(JsReplyProxyBoundaryInterface.class, invocationHandler);
        return (JavaScriptReplyProxyImpl) boundaryInterface.getOrCreatePeer(new JavaScriptReplyProxyImpl$$ExternalSyntheticLambda0(boundaryInterface));
    }

    static /* synthetic */ Object lambda$forInvocationHandler$0(JsReplyProxyBoundaryInterface boundaryInterface) throws Exception {
        return new JavaScriptReplyProxyImpl(boundaryInterface);
    }

    public void postMessage(String message) {
        if (WebViewFeatureInternal.WEB_MESSAGE_LISTENER.isSupportedByWebView()) {
            this.mBoundaryInterface.postMessage(message);
            return;
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }

    public void postMessage(byte[] arrayBuffer) {
        Objects.requireNonNull(arrayBuffer, "ArrayBuffer must be non-null");
        if (WebViewFeatureInternal.WEB_MESSAGE_ARRAY_BUFFER.isSupportedByWebView()) {
            this.mBoundaryInterface.postMessageWithPayload(BoundaryInterfaceReflectionUtil.createInvocationHandlerFor(new WebMessagePayloadAdapter(arrayBuffer)));
            return;
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }
}
