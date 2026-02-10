package androidx.webkit.internal;

import android.webkit.WebView;
import androidx.webkit.WebViewRenderProcess;
import androidx.webkit.WebViewRenderProcessClient;
import java.lang.reflect.InvocationHandler;
import java.util.concurrent.Executor;
import org.chromium.support_lib_boundary.WebViewRendererClientBoundaryInterface;

public class WebViewRenderProcessClientAdapter implements WebViewRendererClientBoundaryInterface {
    private static final String[] sSupportedFeatures = {"WEB_VIEW_RENDERER_CLIENT_BASIC_USAGE"};
    private final Executor mExecutor;
    private final WebViewRenderProcessClient mWebViewRenderProcessClient;

    public WebViewRenderProcessClientAdapter(Executor executor, WebViewRenderProcessClient webViewRenderProcessClient) {
        this.mExecutor = executor;
        this.mWebViewRenderProcessClient = webViewRenderProcessClient;
    }

    public WebViewRenderProcessClient getWebViewRenderProcessClient() {
        return this.mWebViewRenderProcessClient;
    }

    public final String[] getSupportedFeatures() {
        return sSupportedFeatures;
    }

    public final void onRendererUnresponsive(WebView view, InvocationHandler renderer) {
        WebViewRenderProcess rendererObject = WebViewRenderProcessImpl.forInvocationHandler(renderer);
        WebViewRenderProcessClient client = this.mWebViewRenderProcessClient;
        if (this.mExecutor == null) {
            client.onRenderProcessUnresponsive(view, rendererObject);
        } else {
            this.mExecutor.execute(new WebViewRenderProcessClientAdapter$$ExternalSyntheticLambda1(client, view, rendererObject));
        }
    }

    public final void onRendererResponsive(WebView view, InvocationHandler renderer) {
        WebViewRenderProcess rendererObject = WebViewRenderProcessImpl.forInvocationHandler(renderer);
        WebViewRenderProcessClient client = this.mWebViewRenderProcessClient;
        if (this.mExecutor == null) {
            client.onRenderProcessResponsive(view, rendererObject);
        } else {
            this.mExecutor.execute(new WebViewRenderProcessClientAdapter$$ExternalSyntheticLambda0(client, view, rendererObject));
        }
    }
}
