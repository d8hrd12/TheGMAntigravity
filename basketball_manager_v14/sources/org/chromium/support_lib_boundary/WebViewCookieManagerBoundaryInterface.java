package org.chromium.support_lib_boundary;

import java.util.List;
import org.jspecify.annotations.NullMarked;

@NullMarked
public interface WebViewCookieManagerBoundaryInterface {
    List<String> getCookieInfo(String str);
}
