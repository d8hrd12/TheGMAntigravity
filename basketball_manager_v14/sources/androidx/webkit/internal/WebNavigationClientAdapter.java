package androidx.webkit.internal;

import androidx.webkit.WebNavigationClient;
import java.lang.reflect.InvocationHandler;
import org.chromium.support_lib_boundary.WebViewNavigationBoundaryInterface;
import org.chromium.support_lib_boundary.WebViewNavigationClientBoundaryInterface;
import org.chromium.support_lib_boundary.WebViewPageBoundaryInterface;
import org.chromium.support_lib_boundary.util.BoundaryInterfaceReflectionUtil;

public class WebNavigationClientAdapter implements WebViewNavigationClientBoundaryInterface {
    WebNavigationClient mWebNavigationClient;

    public WebNavigationClientAdapter(WebNavigationClient client) {
        this.mWebNavigationClient = client;
    }

    public WebNavigationClient getWebNavigationClient() {
        return this.mWebNavigationClient;
    }

    public void onNavigationStarted(InvocationHandler navigation) {
        WebViewNavigationBoundaryInterface boundaryInterface = (WebViewNavigationBoundaryInterface) BoundaryInterfaceReflectionUtil.castToSuppLibClass(WebViewNavigationBoundaryInterface.class, navigation);
        this.mWebNavigationClient.onNavigationStarted((NavigationAdapter) boundaryInterface.getOrCreatePeer(new WebNavigationClientAdapter$$ExternalSyntheticLambda1(boundaryInterface)));
    }

    static /* synthetic */ Object lambda$onNavigationStarted$0(WebViewNavigationBoundaryInterface boundaryInterface) throws Exception {
        return new NavigationAdapter(boundaryInterface);
    }

    public void onNavigationRedirected(InvocationHandler navigation) {
        WebViewNavigationBoundaryInterface boundaryInterface = (WebViewNavigationBoundaryInterface) BoundaryInterfaceReflectionUtil.castToSuppLibClass(WebViewNavigationBoundaryInterface.class, navigation);
        this.mWebNavigationClient.onNavigationRedirected((NavigationAdapter) boundaryInterface.getOrCreatePeer(new WebNavigationClientAdapter$$ExternalSyntheticLambda3(boundaryInterface)));
    }

    static /* synthetic */ Object lambda$onNavigationRedirected$1(WebViewNavigationBoundaryInterface boundaryInterface) throws Exception {
        return new NavigationAdapter(boundaryInterface);
    }

    public void onNavigationCompleted(InvocationHandler navigation) {
        WebViewNavigationBoundaryInterface boundaryInterface = (WebViewNavigationBoundaryInterface) BoundaryInterfaceReflectionUtil.castToSuppLibClass(WebViewNavigationBoundaryInterface.class, navigation);
        this.mWebNavigationClient.onNavigationCompleted((NavigationAdapter) boundaryInterface.getOrCreatePeer(new WebNavigationClientAdapter$$ExternalSyntheticLambda6(boundaryInterface)));
    }

    static /* synthetic */ Object lambda$onNavigationCompleted$2(WebViewNavigationBoundaryInterface boundaryInterface) throws Exception {
        return new NavigationAdapter(boundaryInterface);
    }

    public void onPageDeleted(InvocationHandler page) {
        WebViewPageBoundaryInterface boundaryInterface = (WebViewPageBoundaryInterface) BoundaryInterfaceReflectionUtil.castToSuppLibClass(WebViewPageBoundaryInterface.class, page);
        this.mWebNavigationClient.onPageDeleted((PageImpl) boundaryInterface.getOrCreatePeer(new WebNavigationClientAdapter$$ExternalSyntheticLambda2(boundaryInterface)));
    }

    static /* synthetic */ Object lambda$onPageDeleted$3(WebViewPageBoundaryInterface boundaryInterface) throws Exception {
        return new PageImpl(boundaryInterface);
    }

    public void onPageLoadEventFired(InvocationHandler page) {
        WebViewPageBoundaryInterface boundaryInterface = (WebViewPageBoundaryInterface) BoundaryInterfaceReflectionUtil.castToSuppLibClass(WebViewPageBoundaryInterface.class, page);
        this.mWebNavigationClient.onPageLoadEventFired((PageImpl) boundaryInterface.getOrCreatePeer(new WebNavigationClientAdapter$$ExternalSyntheticLambda4(boundaryInterface)));
    }

    static /* synthetic */ Object lambda$onPageLoadEventFired$4(WebViewPageBoundaryInterface boundaryInterface) throws Exception {
        return new PageImpl(boundaryInterface);
    }

    public void onPageDOMContentLoadedEventFired(InvocationHandler page) {
        WebViewPageBoundaryInterface boundaryInterface = (WebViewPageBoundaryInterface) BoundaryInterfaceReflectionUtil.castToSuppLibClass(WebViewPageBoundaryInterface.class, page);
        this.mWebNavigationClient.onPageDomContentLoadedEventFired((PageImpl) boundaryInterface.getOrCreatePeer(new WebNavigationClientAdapter$$ExternalSyntheticLambda5(boundaryInterface)));
    }

    static /* synthetic */ Object lambda$onPageDOMContentLoadedEventFired$5(WebViewPageBoundaryInterface boundaryInterface) throws Exception {
        return new PageImpl(boundaryInterface);
    }

    public void onFirstContentfulPaint(InvocationHandler page) {
        WebViewPageBoundaryInterface boundaryInterface = (WebViewPageBoundaryInterface) BoundaryInterfaceReflectionUtil.castToSuppLibClass(WebViewPageBoundaryInterface.class, page);
        this.mWebNavigationClient.onFirstContentfulPaint((PageImpl) boundaryInterface.getOrCreatePeer(new WebNavigationClientAdapter$$ExternalSyntheticLambda0(boundaryInterface)));
    }

    static /* synthetic */ Object lambda$onFirstContentfulPaint$6(WebViewPageBoundaryInterface boundaryInterface) throws Exception {
        return new PageImpl(boundaryInterface);
    }

    public String[] getSupportedFeatures() {
        return new String[]{"WEB_VIEW_NAVIGATION_CLIENT_BASIC_USAGE"};
    }
}
