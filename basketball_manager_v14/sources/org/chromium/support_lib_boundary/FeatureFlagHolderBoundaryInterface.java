package org.chromium.support_lib_boundary;

import org.jspecify.annotations.NullMarked;

@NullMarked
public interface FeatureFlagHolderBoundaryInterface {
    String[] getSupportedFeatures();
}
