package org.chromium.support_lib_boundary;

import java.lang.reflect.InvocationHandler;
import org.jspecify.annotations.NullMarked;

@NullMarked
public interface WebViewStartUpCallbackBoundaryInterface {
    void onSuccess(InvocationHandler invocationHandler);
}
