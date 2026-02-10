package org.chromium.support_lib_boundary;

import java.lang.reflect.InvocationHandler;
import org.jspecify.annotations.NullMarked;

@NullMarked
public interface ServiceWorkerControllerBoundaryInterface {
    InvocationHandler getServiceWorkerWebSettings();

    void setServiceWorkerClient(InvocationHandler invocationHandler);
}
