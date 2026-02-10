package androidx.webkit.internal;

import androidx.webkit.BlockingStartUpLocation;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewStartUpResult;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.reflect.InvocationHandler;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.chromium.support_lib_boundary.WebViewStartUpCallbackBoundaryInterface;
import org.chromium.support_lib_boundary.WebViewStartUpResultBoundaryInterface;
import org.chromium.support_lib_boundary.util.BoundaryInterfaceReflectionUtil;

public class WebViewStartUpCallbackAdapter implements WebViewStartUpCallbackBoundaryInterface {
    private final WebViewCompat.WebViewStartUpCallback mWebViewStartUpCallback;

    public WebViewStartUpCallbackAdapter(WebViewCompat.WebViewStartUpCallback webViewStartUpCallback) {
        this.mWebViewStartUpCallback = webViewStartUpCallback;
    }

    public void onSuccess(InvocationHandler resultInvocationHandler) {
        this.mWebViewStartUpCallback.onSuccess(webViewStartUpResultFromBoundaryInterface((WebViewStartUpResultBoundaryInterface) Objects.requireNonNull((WebViewStartUpResultBoundaryInterface) BoundaryInterfaceReflectionUtil.castToSuppLibClass(WebViewStartUpResultBoundaryInterface.class, resultInvocationHandler))));
    }

    private static class BlockingStartUpLocationImpl implements BlockingStartUpLocation {
        private final Throwable mThrowable;

        BlockingStartUpLocationImpl(Throwable t) {
            this.mThrowable = t;
        }

        public String getStackInformation() {
            StringWriter sw = new StringWriter();
            this.mThrowable.printStackTrace(new PrintWriter(sw));
            return sw.toString();
        }
    }

    private WebViewStartUpResult webViewStartUpResultFromBoundaryInterface(final WebViewStartUpResultBoundaryInterface result) {
        return new WebViewStartUpResult() {
            private final List<BlockingStartUpLocation> mBlockingStartUpLocations = convertFromThrowables(result.getBlockingStartUpLocations());

            public Long getTotalTimeInUiThreadMillis() {
                return result.getTotalTimeInUiThreadMillis();
            }

            public Long getMaxTimePerTaskInUiThreadMillis() {
                return result.getMaxTimePerTaskInUiThreadMillis();
            }

            public List<BlockingStartUpLocation> getBlockingStartUpLocations() {
                return this.mBlockingStartUpLocations;
            }

            private List<BlockingStartUpLocation> convertFromThrowables(List<Throwable> throwables) {
                List<BlockingStartUpLocation> blockingStartUpLocations = new ArrayList<>();
                for (Throwable location : throwables) {
                    blockingStartUpLocations.add(new BlockingStartUpLocationImpl(location));
                }
                return blockingStartUpLocations;
            }
        };
    }
}
