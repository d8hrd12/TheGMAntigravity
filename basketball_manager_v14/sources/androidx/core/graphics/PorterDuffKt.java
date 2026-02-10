package androidx.core.graphics;

import android.graphics.PorterDuff;
import android.graphics.PorterDuffColorFilter;
import android.graphics.PorterDuffXfermode;
import kotlin.Metadata;

@Metadata(d1 = {"\u0000\u0018\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0000\u001a\r\u0010\u0000\u001a\u00020\u0001*\u00020\u0002H\b\u001a\u0015\u0010\u0003\u001a\u00020\u0004*\u00020\u00022\u0006\u0010\u0005\u001a\u00020\u0006H\b¨\u0006\u0007"}, d2 = {"toXfermode", "Landroid/graphics/PorterDuffXfermode;", "Landroid/graphics/PorterDuff$Mode;", "toColorFilter", "Landroid/graphics/PorterDuffColorFilter;", "color", "", "core-ktx_release"}, k = 2, mv = {2, 0, 0}, xi = 48)
/* compiled from: PorterDuff.kt */
public final class PorterDuffKt {
    public static final PorterDuffXfermode toXfermode(PorterDuff.Mode $this$toXfermode) {
        return new PorterDuffXfermode($this$toXfermode);
    }

    public static final PorterDuffColorFilter toColorFilter(PorterDuff.Mode $this$toColorFilter, int color) {
        return new PorterDuffColorFilter(color, $this$toColorFilter);
    }
}
