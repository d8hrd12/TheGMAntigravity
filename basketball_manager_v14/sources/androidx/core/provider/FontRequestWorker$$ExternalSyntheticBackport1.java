package androidx.core.provider;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/* compiled from: D8$$SyntheticClass */
public final /* synthetic */ class FontRequestWorker$$ExternalSyntheticBackport1 {
    public static /* synthetic */ List m(Object[] objArr) {
        ArrayList arrayList = new ArrayList(objArr.length);
        for (Object requireNonNull : objArr) {
            arrayList.add(Objects.requireNonNull(requireNonNull));
        }
        return Collections.unmodifiableList(arrayList);
    }
}
