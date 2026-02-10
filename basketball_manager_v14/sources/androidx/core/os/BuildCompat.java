package androidx.core.os;

import android.os.Build;
import android.os.ext.SdkExtensions;
import java.lang.annotation.RetentionPolicy;
import java.util.Locale;
import kotlin.Deprecated;
import kotlin.Metadata;
import kotlin.ReplaceWith;
import kotlin.annotation.AnnotationRetention;
import kotlin.annotation.Retention;
import kotlin.jvm.JvmStatic;
import kotlin.jvm.internal.Intrinsics;
import kotlin.time.DurationKt;

@Metadata(d1 = {"\u0000\"\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u000f\n\u0002\u0010\b\n\u0002\b\u0006\bÆ\u0002\u0018\u00002\u00020\u0001:\u0002\u001b\u001cB\t\b\u0002¢\u0006\u0004\b\u0002\u0010\u0003J\u0018\u0010\u0004\u001a\u00020\u00052\u0006\u0010\u0006\u001a\u00020\u00072\u0006\u0010\b\u001a\u00020\u0007H\u0007J\b\u0010\t\u001a\u00020\u0005H\u0007J\b\u0010\n\u001a\u00020\u0005H\u0007J\b\u0010\u000b\u001a\u00020\u0005H\u0007J\b\u0010\f\u001a\u00020\u0005H\u0007J\b\u0010\r\u001a\u00020\u0005H\u0007J\b\u0010\u000e\u001a\u00020\u0005H\u0007J\b\u0010\u000f\u001a\u00020\u0005H\u0007J\b\u0010\u0010\u001a\u00020\u0005H\u0007J\b\u0010\u0011\u001a\u00020\u0005H\u0007J\b\u0010\u0012\u001a\u00020\u0005H\u0007J\b\u0010\u0013\u001a\u00020\u0005H\u0007J\b\u0010\u0014\u001a\u00020\u0005H\u0007J\b\u0010\u0015\u001a\u00020\u0005H\u0007R\u0010\u0010\u0016\u001a\u00020\u00178\u0006X\u0004¢\u0006\u0002\n\u0000R\u0010\u0010\u0018\u001a\u00020\u00178\u0006X\u0004¢\u0006\u0002\n\u0000R\u0010\u0010\u0019\u001a\u00020\u00178\u0006X\u0004¢\u0006\u0002\n\u0000R\u0010\u0010\u001a\u001a\u00020\u00178\u0006X\u0004¢\u0006\u0002\n\u0000¨\u0006\u001d"}, d2 = {"Landroidx/core/os/BuildCompat;", "", "<init>", "()V", "isAtLeastPreReleaseCodename", "", "codename", "", "buildCodename", "isAtLeastN", "isAtLeastNMR1", "isAtLeastO", "isAtLeastOMR1", "isAtLeastP", "isAtLeastQ", "isAtLeastR", "isAtLeastS", "isAtLeastSv2", "isAtLeastT", "isAtLeastU", "isAtLeastV", "isAtLeastB", "R_EXTENSION_INT", "", "S_EXTENSION_INT", "T_EXTENSION_INT", "AD_SERVICES_EXTENSION_INT", "PrereleaseSdkCheck", "Api30Impl", "core_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
/* compiled from: BuildCompat.kt */
public final class BuildCompat {
    public static final int AD_SERVICES_EXTENSION_INT;
    public static final BuildCompat INSTANCE = new BuildCompat();
    public static final int R_EXTENSION_INT;
    public static final int S_EXTENSION_INT;
    public static final int T_EXTENSION_INT;

    @Metadata(d1 = {"\u0000\n\n\u0002\u0018\u0002\n\u0002\u0010\u001b\n\u0000\b\u0002\u0018\u00002\u00020\u0001B\u0000¨\u0006\u0002"}, d2 = {"Landroidx/core/os/BuildCompat$PrereleaseSdkCheck;", "", "core_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
    @Retention(AnnotationRetention.BINARY)
    @java.lang.annotation.Retention(RetentionPolicy.CLASS)
    /* compiled from: BuildCompat.kt */
    public @interface PrereleaseSdkCheck {
    }

    private BuildCompat() {
    }

    private static final Integer isAtLeastPreReleaseCodename$codenameToInt(String codename) {
        String upperCase = codename.toUpperCase(Locale.ROOT);
        Intrinsics.checkNotNullExpressionValue(upperCase, "toUpperCase(...)");
        if (Intrinsics.areEqual((Object) upperCase, (Object) "BAKLAVA")) {
            return 0;
        }
        return null;
    }

    @JvmStatic
    public static final boolean isAtLeastPreReleaseCodename(String codename, String buildCodename) {
        Intrinsics.checkNotNullParameter(codename, "codename");
        Intrinsics.checkNotNullParameter(buildCodename, "buildCodename");
        if (Intrinsics.areEqual((Object) "REL", (Object) buildCodename)) {
            return false;
        }
        Integer buildCodenameInt = isAtLeastPreReleaseCodename$codenameToInt(buildCodename);
        Integer codenameInt = isAtLeastPreReleaseCodename$codenameToInt(codename);
        if (buildCodenameInt == null || codenameInt == null) {
            if (buildCodenameInt == null && codenameInt == null) {
                String upperCase = buildCodename.toUpperCase(Locale.ROOT);
                Intrinsics.checkNotNullExpressionValue(upperCase, "toUpperCase(...)");
                String upperCase2 = codename.toUpperCase(Locale.ROOT);
                Intrinsics.checkNotNullExpressionValue(upperCase2, "toUpperCase(...)");
                if (upperCase.compareTo(upperCase2) >= 0) {
                    return true;
                }
                return false;
            } else if (buildCodenameInt != null) {
                return true;
            } else {
                return false;
            }
        } else if (buildCodenameInt.intValue() >= codenameInt.intValue()) {
            return true;
        } else {
            return false;
        }
    }

    @JvmStatic
    @Deprecated(message = "Android N is a finalized release and this method is no longer necessary. It will be removed in a future release of this library. Instead, use `Build.VERSION.SDK_INT >= 24`.", replaceWith = @ReplaceWith(expression = "android.os.Build.VERSION.SDK_INT >= 24", imports = {}))
    public static final boolean isAtLeastN() {
        return true;
    }

    @JvmStatic
    @Deprecated(message = "Android N MR1 is a finalized release and this method is no longer necessary. It will be removed in a future release of this library. Instead, use `Build.VERSION.SDK_INT >= 25`.", replaceWith = @ReplaceWith(expression = "android.os.Build.VERSION.SDK_INT >= 25", imports = {}))
    public static final boolean isAtLeastNMR1() {
        return Build.VERSION.SDK_INT >= 25;
    }

    @JvmStatic
    @Deprecated(message = "Android O is a finalized release and this method is no longer necessary. It will be removed in a future release of this library. Instead use `Build.VERSION.SDK_INT >= 26`.", replaceWith = @ReplaceWith(expression = "android.os.Build.VERSION.SDK_INT >= 26", imports = {}))
    public static final boolean isAtLeastO() {
        return Build.VERSION.SDK_INT >= 26;
    }

    @JvmStatic
    @Deprecated(message = "Android O MR1 is a finalized release and this method is no longer necessary. It will be removed in a future release of this library. Instead, use `Build.VERSION.SDK_INT >= 27`.", replaceWith = @ReplaceWith(expression = "android.os.Build.VERSION.SDK_INT >= 27", imports = {}))
    public static final boolean isAtLeastOMR1() {
        return Build.VERSION.SDK_INT >= 27;
    }

    @JvmStatic
    @Deprecated(message = "Android P is a finalized release and this method is no longer necessary. It will be removed in a future release of this library. Instead, use `Build.VERSION.SDK_INT >= 28`.", replaceWith = @ReplaceWith(expression = "android.os.Build.VERSION.SDK_INT >= 28", imports = {}))
    public static final boolean isAtLeastP() {
        return Build.VERSION.SDK_INT >= 28;
    }

    @JvmStatic
    @Deprecated(message = "Android Q is a finalized release and this method is no longer necessary. It will be removed in a future release of this library. Instead, use `Build.VERSION.SDK_INT >= 29`.", replaceWith = @ReplaceWith(expression = "android.os.Build.VERSION.SDK_INT >= 29", imports = {}))
    public static final boolean isAtLeastQ() {
        return Build.VERSION.SDK_INT >= 29;
    }

    @JvmStatic
    @Deprecated(message = "Android R is a finalized release and this method is no longer necessary. It will be removed in a future release of this library. Instead, use `Build.VERSION.SDK_INT >= 30`.", replaceWith = @ReplaceWith(expression = "android.os.Build.VERSION.SDK_INT >= 30", imports = {}))
    public static final boolean isAtLeastR() {
        return Build.VERSION.SDK_INT >= 30;
    }

    @JvmStatic
    @Deprecated(message = "Android S is a finalized release and this method is no longer necessary. It will be removed in a future release of this library. Instead, use `Build.VERSION.SDK_INT >= 31`.", replaceWith = @ReplaceWith(expression = "android.os.Build.VERSION.SDK_INT >= 31", imports = {}))
    public static final boolean isAtLeastS() {
        if (Build.VERSION.SDK_INT < 31) {
            if (Build.VERSION.SDK_INT >= 30) {
                String str = Build.VERSION.CODENAME;
                Intrinsics.checkNotNullExpressionValue(str, "CODENAME");
                if (isAtLeastPreReleaseCodename("S", str)) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    @JvmStatic
    @Deprecated(message = "Android Sv2 is a finalized release and this method is no longer necessary. It will be removed in a future release of this library. Instead, use `Build.VERSION.SDK_INT >= 32`.", replaceWith = @ReplaceWith(expression = "android.os.Build.VERSION.SDK_INT >= 32", imports = {}))
    public static final boolean isAtLeastSv2() {
        if (Build.VERSION.SDK_INT < 32) {
            if (Build.VERSION.SDK_INT >= 31) {
                String str = Build.VERSION.CODENAME;
                Intrinsics.checkNotNullExpressionValue(str, "CODENAME");
                if (isAtLeastPreReleaseCodename("Sv2", str)) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    @JvmStatic
    @Deprecated(message = "Android Tiramisu is a finalized release and this method is no longer necessary. It will be removed in a future release of this library. Instead, use `Build.VERSION.SDK_INT >= 33`.", replaceWith = @ReplaceWith(expression = "android.os.Build.VERSION.SDK_INT >= 33", imports = {}))
    public static final boolean isAtLeastT() {
        if (Build.VERSION.SDK_INT < 33) {
            if (Build.VERSION.SDK_INT >= 32) {
                String str = Build.VERSION.CODENAME;
                Intrinsics.checkNotNullExpressionValue(str, "CODENAME");
                if (isAtLeastPreReleaseCodename("Tiramisu", str)) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    @JvmStatic
    @Deprecated(message = "Android UpsideDownCase is a finalized release and this method is no longer necessary. It will be removed in a future release of this library. Instead, use `Build.VERSION.SDK_INT >= 34`.", replaceWith = @ReplaceWith(expression = "android.os.Build.VERSION.SDK_INT >= 34", imports = {}))
    public static final boolean isAtLeastU() {
        if (Build.VERSION.SDK_INT < 34) {
            if (Build.VERSION.SDK_INT >= 33) {
                String str = Build.VERSION.CODENAME;
                Intrinsics.checkNotNullExpressionValue(str, "CODENAME");
                if (isAtLeastPreReleaseCodename("UpsideDownCake", str)) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    @JvmStatic
    @Deprecated(message = "Android VanillaIceCream is a finalized release and this method is no longer necessary. It will be removed in a future release of this library. Instead, use `Build.VERSION.SDK_INT >= 35`.", replaceWith = @ReplaceWith(expression = "android.os.Build.VERSION.SDK_INT >= 35", imports = {}))
    public static final boolean isAtLeastV() {
        if (Build.VERSION.SDK_INT < 35) {
            if (Build.VERSION.SDK_INT >= 34) {
                String str = Build.VERSION.CODENAME;
                Intrinsics.checkNotNullExpressionValue(str, "CODENAME");
                if (isAtLeastPreReleaseCodename("VanillaIceCream", str)) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    @JvmStatic
    public static final boolean isAtLeastB() {
        if (Build.VERSION.SDK_INT < 36) {
            if (Build.VERSION.SDK_INT >= 35) {
                String str = Build.VERSION.CODENAME;
                Intrinsics.checkNotNullExpressionValue(str, "CODENAME");
                if (isAtLeastPreReleaseCodename("Baklava", str)) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    static {
        int i;
        int i2;
        int i3;
        int i4 = 0;
        if (Build.VERSION.SDK_INT >= 30) {
            i = Api30Impl.INSTANCE.getExtensionVersion(30);
        } else {
            i = 0;
        }
        R_EXTENSION_INT = i;
        if (Build.VERSION.SDK_INT >= 30) {
            i2 = Api30Impl.INSTANCE.getExtensionVersion(31);
        } else {
            i2 = 0;
        }
        S_EXTENSION_INT = i2;
        if (Build.VERSION.SDK_INT >= 30) {
            i3 = Api30Impl.INSTANCE.getExtensionVersion(33);
        } else {
            i3 = 0;
        }
        T_EXTENSION_INT = i3;
        if (Build.VERSION.SDK_INT >= 30) {
            i4 = Api30Impl.INSTANCE.getExtensionVersion(DurationKt.NANOS_IN_MILLIS);
        }
        AD_SERVICES_EXTENSION_INT = i4;
    }

    @Metadata(d1 = {"\u0000\u0014\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0010\b\n\u0002\b\u0002\bÃ\u0002\u0018\u00002\u00020\u0001B\t\b\u0002¢\u0006\u0004\b\u0002\u0010\u0003J\u000e\u0010\u0004\u001a\u00020\u00052\u0006\u0010\u0006\u001a\u00020\u0005¨\u0006\u0007"}, d2 = {"Landroidx/core/os/BuildCompat$Api30Impl;", "", "<init>", "()V", "getExtensionVersion", "", "extension", "core_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
    /* compiled from: BuildCompat.kt */
    private static final class Api30Impl {
        public static final Api30Impl INSTANCE = new Api30Impl();

        private Api30Impl() {
        }

        public final int getExtensionVersion(int extension) {
            return SdkExtensions.getExtensionVersion(extension);
        }
    }
}
