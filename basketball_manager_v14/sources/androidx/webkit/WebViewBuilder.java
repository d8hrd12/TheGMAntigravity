package androidx.webkit;

import android.content.Context;
import android.webkit.WebView;
import androidx.webkit.internal.WebViewFeatureInternal;
import androidx.webkit.internal.WebViewGlueCommunicator;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.chromium.support_lib_boundary.WebViewBuilderBoundaryInterface;

public final class WebViewBuilder {
    WebViewBuilderBoundaryInterface mBuilderStateBoundary;
    private Policy mPolicy;

    @Target({ElementType.METHOD, ElementType.TYPE, ElementType.FIELD})
    @Retention(RetentionPolicy.CLASS)
    public @interface Experimental {
    }

    public WebViewBuilder setPolicy(Policy policy) {
        this.mPolicy = policy;
        return this;
    }

    public WebView build(Context context) throws WebViewBuilderException {
        if (WebViewFeatureInternal.WEBVIEW_BUILDER.isSupportedByWebView()) {
            if (this.mBuilderStateBoundary == null) {
                this.mBuilderStateBoundary = WebViewGlueCommunicator.getFactory().getWebViewBuilder();
            }
            WebViewBuilderBoundaryInterface.Config config = new WebViewBuilderBoundaryInterface.Config();
            this.mPolicy.configure(config);
            return this.mBuilderStateBoundary.build(context, config);
        }
        throw WebViewFeatureInternal.getUnsupportedOperationException();
    }
}
