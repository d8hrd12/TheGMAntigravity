package androidx.core.flagging;

import android.os.Build;
import android.os.flagging.AconfigPackage;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;
import kotlin.Metadata;
import kotlin.jvm.JvmStatic;
import kotlin.jvm.internal.DefaultConstructorMarker;
import kotlin.jvm.internal.Intrinsics;

@Metadata(d1 = {"\u0000\f\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0004\b\u0007\u0018\u0000 \u00042\u00020\u0001:\u0001\u0004B\u0007¢\u0006\u0004\b\u0002\u0010\u0003¨\u0006\u0005"}, d2 = {"Landroidx/core/flagging/Flags;", "", "<init>", "()V", "Companion", "core_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
/* compiled from: Flags.kt */
public final class Flags {
    public static final Companion Companion = new Companion((DefaultConstructorMarker) null);
    /* access modifiers changed from: private */
    public static final Map<String, AconfigPackage> aconfigCache = (Build.VERSION.SDK_INT >= 36 ? new ConcurrentHashMap<>() : null);
    /* access modifiers changed from: private */
    public static final Set<String> missingPackageCache;

    @Metadata(d1 = {"\u0000(\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0010%\n\u0002\u0010\u000e\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010#\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0004\b\u0003\u0018\u00002\u00020\u0001B\t\b\u0002¢\u0006\u0004\b\u0002\u0010\u0003J\"\u0010\n\u001a\u00020\u000b2\u0006\u0010\f\u001a\u00020\u00062\u0006\u0010\r\u001a\u00020\u00062\b\b\u0002\u0010\u000e\u001a\u00020\u000bH\u0007R\u001e\u0010\u0004\u001a\u0010\u0012\u0004\u0012\u00020\u0006\u0012\u0004\u0012\u00020\u0007\u0018\u00010\u00058CX\u0004¢\u0006\u0002\n\u0000R\u0018\u0010\b\u001a\n\u0012\u0004\u0012\u00020\u0006\u0018\u00010\t8CX\u0004¢\u0006\u0002\n\u0000¨\u0006\u000f"}, d2 = {"Landroidx/core/flagging/Flags$Companion;", "", "<init>", "()V", "aconfigCache", "", "", "Landroid/os/flagging/AconfigPackage;", "missingPackageCache", "", "getBooleanFlagValue", "", "packageName", "flagName", "defaultValue", "core_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
    /* compiled from: Flags.kt */
    public static final class Companion {
        public /* synthetic */ Companion(DefaultConstructorMarker defaultConstructorMarker) {
            this();
        }

        private Companion() {
        }

        public static /* synthetic */ boolean getBooleanFlagValue$default(Companion companion, String str, String str2, boolean z, int i, Object obj) {
            if ((i & 4) != 0) {
                z = false;
            }
            return companion.getBooleanFlagValue(str, str2, z);
        }

        /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r3v7, resolved type: java.lang.Object} */
        /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r2v5, resolved type: android.os.flagging.AconfigPackage} */
        /* JADX WARNING: Multi-variable type inference failed */
        @kotlin.jvm.JvmStatic
        /* Code decompiled incorrectly, please refer to instructions dump. */
        public final boolean getBooleanFlagValue(java.lang.String r6, java.lang.String r7, boolean r8) {
            /*
                r5 = this;
                java.lang.String r0 = "packageName"
                kotlin.jvm.internal.Intrinsics.checkNotNullParameter(r6, r0)
                java.lang.String r0 = "flagName"
                kotlin.jvm.internal.Intrinsics.checkNotNullParameter(r7, r0)
                int r0 = android.os.Build.VERSION.SDK_INT
                r1 = 36
                if (r0 >= r1) goto L_0x0011
                return r8
            L_0x0011:
                java.util.Map r0 = androidx.core.flagging.Flags.aconfigCache
                kotlin.jvm.internal.Intrinsics.checkNotNull(r0)
                java.util.Set r1 = androidx.core.flagging.Flags.missingPackageCache
                kotlin.jvm.internal.Intrinsics.checkNotNull(r1)
                r2 = 0
                boolean r3 = r0.containsKey(r6)
                if (r3 == 0) goto L_0x002e
                java.lang.Object r3 = r0.get(r6)
                r2 = r3
                android.os.flagging.AconfigPackage r2 = (android.os.flagging.AconfigPackage) r2
                goto L_0x004b
            L_0x002e:
                boolean r3 = r1.contains(r6)
                if (r3 == 0) goto L_0x0036
                r2 = 0
                goto L_0x004b
            L_0x0036:
                android.os.flagging.AconfigPackage r3 = android.os.flagging.AconfigPackage.load(r6)     // Catch:{ AconfigStorageReadException -> 0x0042 }
                r2 = r3
                r0.put(r6, r2)     // Catch:{ AconfigStorageReadException -> 0x0042 }
                kotlin.Unit r3 = kotlin.Unit.INSTANCE     // Catch:{ AconfigStorageReadException -> 0x0042 }
                goto L_0x004b
            L_0x0042:
                r3 = move-exception
                r2 = 0
                boolean r4 = r1.add(r6)
                java.lang.Boolean.valueOf(r4)
            L_0x004b:
                if (r2 == 0) goto L_0x0052
                boolean r3 = r2.getBooleanFlagValue(r7, r8)
                goto L_0x0053
            L_0x0052:
                r3 = r8
            L_0x0053:
                return r3
            */
            throw new UnsupportedOperationException("Method not decompiled: androidx.core.flagging.Flags.Companion.getBooleanFlagValue(java.lang.String, java.lang.String, boolean):boolean");
        }

        @JvmStatic
        public final boolean getBooleanFlagValue(String packageName, String flagName) {
            Intrinsics.checkNotNullParameter(packageName, "packageName");
            Intrinsics.checkNotNullParameter(flagName, "flagName");
            return getBooleanFlagValue$default(this, packageName, flagName, false, 4, (Object) null);
        }
    }

    static {
        Set<String> set = null;
        if (Build.VERSION.SDK_INT >= 36) {
            set = new CopyOnWriteArraySet<>();
        }
        missingPackageCache = set;
    }

    @JvmStatic
    public static final boolean getBooleanFlagValue(String packageName, String flagName) {
        return Companion.getBooleanFlagValue(packageName, flagName);
    }

    @JvmStatic
    public static final boolean getBooleanFlagValue(String packageName, String flagName, boolean defaultValue) {
        return Companion.getBooleanFlagValue(packageName, flagName, defaultValue);
    }
}
