package androidx.activity;

import android.content.res.Resources;
import kotlin.Metadata;
import kotlin.jvm.JvmStatic;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.internal.DefaultConstructorMarker;
import kotlin.jvm.internal.Intrinsics;

@Metadata(d1 = {"\u0000\"\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\b\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0010\u000b\n\u0002\b\u000e\u0018\u0000 \u00162\u00020\u0001:\u0001\u0016B5\b\u0002\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0003\u0012\u0006\u0010\u0005\u001a\u00020\u0003\u0012\u0012\u0010\u0006\u001a\u000e\u0012\u0004\u0012\u00020\b\u0012\u0004\u0012\u00020\t0\u0007¢\u0006\u0004\b\n\u0010\u000bJ\u0015\u0010\u0011\u001a\u00020\u00032\u0006\u0010\u0012\u001a\u00020\tH\u0000¢\u0006\u0002\b\u0013J\u0015\u0010\u0014\u001a\u00020\u00032\u0006\u0010\u0012\u001a\u00020\tH\u0000¢\u0006\u0002\b\u0015R\u000e\u0010\u0002\u001a\u00020\u0003X\u0004¢\u0006\u0002\n\u0000R\u0014\u0010\u0004\u001a\u00020\u0003X\u0004¢\u0006\b\n\u0000\u001a\u0004\b\f\u0010\rR\u0014\u0010\u0005\u001a\u00020\u0003X\u0004¢\u0006\b\n\u0000\u001a\u0004\b\u000e\u0010\rR \u0010\u0006\u001a\u000e\u0012\u0004\u0012\u00020\b\u0012\u0004\u0012\u00020\t0\u0007X\u0004¢\u0006\b\n\u0000\u001a\u0004\b\u000f\u0010\u0010¨\u0006\u0017"}, d2 = {"Landroidx/activity/SystemBarStyle;", "", "lightScrim", "", "darkScrim", "nightMode", "detectDarkMode", "Lkotlin/Function1;", "Landroid/content/res/Resources;", "", "<init>", "(IIILkotlin/jvm/functions/Function1;)V", "getDarkScrim$activity_release", "()I", "getNightMode$activity_release", "getDetectDarkMode$activity_release", "()Lkotlin/jvm/functions/Function1;", "getScrim", "isDark", "getScrim$activity_release", "getScrimWithEnforcedContrast", "getScrimWithEnforcedContrast$activity_release", "Companion", "activity_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
/* compiled from: EdgeToEdge.kt */
public final class SystemBarStyle {
    public static final Companion Companion = new Companion((DefaultConstructorMarker) null);
    private final int darkScrim;
    private final Function1<Resources, Boolean> detectDarkMode;
    private final int lightScrim;
    private final int nightMode;

    public /* synthetic */ SystemBarStyle(int i, int i2, int i3, Function1 function1, DefaultConstructorMarker defaultConstructorMarker) {
        this(i, i2, i3, function1);
    }

    private SystemBarStyle(int lightScrim2, int darkScrim2, int nightMode2, Function1<? super Resources, Boolean> detectDarkMode2) {
        this.lightScrim = lightScrim2;
        this.darkScrim = darkScrim2;
        this.nightMode = nightMode2;
        this.detectDarkMode = detectDarkMode2;
    }

    public final int getDarkScrim$activity_release() {
        return this.darkScrim;
    }

    public final int getNightMode$activity_release() {
        return this.nightMode;
    }

    public final Function1<Resources, Boolean> getDetectDarkMode$activity_release() {
        return this.detectDarkMode;
    }

    @Metadata(d1 = {"\u0000*\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0010\u000b\n\u0002\b\u0004\b\u0003\u0018\u00002\u00020\u0001B\t\b\u0002¢\u0006\u0004\b\u0002\u0010\u0003J2\u0010\u0004\u001a\u00020\u00052\b\b\u0001\u0010\u0006\u001a\u00020\u00072\b\b\u0001\u0010\b\u001a\u00020\u00072\u0014\b\u0002\u0010\t\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\f0\nH\u0007J\u0012\u0010\r\u001a\u00020\u00052\b\b\u0001\u0010\u000e\u001a\u00020\u0007H\u0007J\u001c\u0010\u000f\u001a\u00020\u00052\b\b\u0001\u0010\u000e\u001a\u00020\u00072\b\b\u0001\u0010\b\u001a\u00020\u0007H\u0007¨\u0006\u0010"}, d2 = {"Landroidx/activity/SystemBarStyle$Companion;", "", "<init>", "()V", "auto", "Landroidx/activity/SystemBarStyle;", "lightScrim", "", "darkScrim", "detectDarkMode", "Lkotlin/Function1;", "Landroid/content/res/Resources;", "", "dark", "scrim", "light", "activity_release"}, k = 1, mv = {2, 0, 0}, xi = 48)
    /* compiled from: EdgeToEdge.kt */
    public static final class Companion {
        public /* synthetic */ Companion(DefaultConstructorMarker defaultConstructorMarker) {
            this();
        }

        private Companion() {
        }

        public static /* synthetic */ SystemBarStyle auto$default(Companion companion, int i, int i2, Function1 function1, int i3, Object obj) {
            if ((i3 & 4) != 0) {
                new SystemBarStyle$Companion$$ExternalSyntheticLambda2
                /*  JADX ERROR: Method code generation error
                    jadx.core.utils.exceptions.CodegenException: Error generate insn: 0x0006: CONSTRUCTOR  (r3v2 ? I:androidx.activity.SystemBarStyle$Companion$$ExternalSyntheticLambda2) =  call: androidx.activity.SystemBarStyle$Companion$$ExternalSyntheticLambda2.<init>():void type: CONSTRUCTOR in method: androidx.activity.SystemBarStyle.Companion.auto$default(androidx.activity.SystemBarStyle$Companion, int, int, kotlin.jvm.functions.Function1, int, java.lang.Object):androidx.activity.SystemBarStyle, dex: classes.dex
                    	at jadx.core.codegen.InsnGen.makeInsn(InsnGen.java:256)
                    	at jadx.core.codegen.InsnGen.makeInsn(InsnGen.java:221)
                    	at jadx.core.codegen.RegionGen.makeSimpleBlock(RegionGen.java:109)
                    	at jadx.core.codegen.RegionGen.makeRegion(RegionGen.java:55)
                    	at jadx.core.codegen.RegionGen.makeSimpleRegion(RegionGen.java:92)
                    	at jadx.core.codegen.RegionGen.makeRegion(RegionGen.java:58)
                    	at jadx.core.codegen.RegionGen.makeRegionIndent(RegionGen.java:98)
                    	at jadx.core.codegen.RegionGen.makeIf(RegionGen.java:142)
                    	at jadx.core.codegen.RegionGen.makeRegion(RegionGen.java:62)
                    	at jadx.core.codegen.RegionGen.makeSimpleRegion(RegionGen.java:92)
                    	at jadx.core.codegen.RegionGen.makeRegion(RegionGen.java:58)
                    	at jadx.core.codegen.MethodGen.addRegionInsns(MethodGen.java:211)
                    	at jadx.core.codegen.MethodGen.addInstructions(MethodGen.java:204)
                    	at jadx.core.codegen.ClassGen.addMethodCode(ClassGen.java:318)
                    	at jadx.core.codegen.ClassGen.addMethod(ClassGen.java:271)
                    	at jadx.core.codegen.ClassGen.lambda$addInnerClsAndMethods$2(ClassGen.java:240)
                    	at java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:183)
                    	at java.util.ArrayList.forEach(ArrayList.java:1259)
                    	at java.util.stream.SortedOps$RefSortingSink.end(SortedOps.java:395)
                    	at java.util.stream.Sink$ChainedReference.end(Sink.java:258)
                    	at java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:483)
                    	at java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:472)
                    	at java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:150)
                    	at java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:173)
                    	at java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
                    	at java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:485)
                    	at jadx.core.codegen.ClassGen.addInnerClsAndMethods(ClassGen.java:236)
                    	at jadx.core.codegen.ClassGen.addClassBody(ClassGen.java:227)
                    	at jadx.core.codegen.ClassGen.addClassCode(ClassGen.java:112)
                    	at jadx.core.codegen.ClassGen.addInnerClass(ClassGen.java:249)
                    	at jadx.core.codegen.ClassGen.lambda$addInnerClsAndMethods$2(ClassGen.java:238)
                    	at java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:183)
                    	at java.util.ArrayList.forEach(ArrayList.java:1259)
                    	at java.util.stream.SortedOps$RefSortingSink.end(SortedOps.java:395)
                    	at java.util.stream.Sink$ChainedReference.end(Sink.java:258)
                    	at java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:483)
                    	at java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:472)
                    	at java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:150)
                    	at java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:173)
                    	at java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
                    	at java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:485)
                    	at jadx.core.codegen.ClassGen.addInnerClsAndMethods(ClassGen.java:236)
                    	at jadx.core.codegen.ClassGen.addClassBody(ClassGen.java:227)
                    	at jadx.core.codegen.ClassGen.addClassCode(ClassGen.java:112)
                    	at jadx.core.codegen.ClassGen.makeClass(ClassGen.java:78)
                    	at jadx.core.codegen.CodeGen.wrapCodeGen(CodeGen.java:44)
                    	at jadx.core.codegen.CodeGen.generateJavaCode(CodeGen.java:33)
                    	at jadx.core.codegen.CodeGen.generate(CodeGen.java:21)
                    	at jadx.core.ProcessClass.generateCode(ProcessClass.java:61)
                    	at jadx.core.dex.nodes.ClassNode.decompile(ClassNode.java:273)
                    Caused by: jadx.core.utils.exceptions.JadxRuntimeException: Code variable not set in r3v2 ?
                    	at jadx.core.dex.instructions.args.SSAVar.getCodeVar(SSAVar.java:189)
                    	at jadx.core.codegen.InsnGen.makeConstructor(InsnGen.java:620)
                    	at jadx.core.codegen.InsnGen.makeInsnBody(InsnGen.java:364)
                    	at jadx.core.codegen.InsnGen.makeInsn(InsnGen.java:250)
                    	... 49 more
                    */
                /*
                    r4 = r4 & 4
                    if (r4 == 0) goto L_0x0009
                    androidx.activity.SystemBarStyle$Companion$$ExternalSyntheticLambda2 r3 = new androidx.activity.SystemBarStyle$Companion$$ExternalSyntheticLambda2
                    r3.<init>()
                L_0x0009:
                    androidx.activity.SystemBarStyle r0 = r0.auto(r1, r2, r3)
                    return r0
                */
                throw new UnsupportedOperationException("Method not decompiled: androidx.activity.SystemBarStyle.Companion.auto$default(androidx.activity.SystemBarStyle$Companion, int, int, kotlin.jvm.functions.Function1, int, java.lang.Object):androidx.activity.SystemBarStyle");
            }

            /* access modifiers changed from: private */
            public static final boolean auto$lambda$0(Resources resources) {
                Intrinsics.checkNotNullParameter(resources, "resources");
                return (resources.getConfiguration().uiMode & 48) == 32;
            }

            @JvmStatic
            public final SystemBarStyle auto(int lightScrim, int darkScrim, Function1<? super Resources, Boolean> detectDarkMode) {
                Intrinsics.checkNotNullParameter(detectDarkMode, "detectDarkMode");
                return new SystemBarStyle(lightScrim, darkScrim, 0, detectDarkMode, (DefaultConstructorMarker) null);
            }

            @JvmStatic
            public final SystemBarStyle auto(int lightScrim, int darkScrim) {
                return auto$default(this, lightScrim, darkScrim, (Function1) null, 4, (Object) null);
            }

            @JvmStatic
            public final SystemBarStyle dark(int scrim) {
                return new SystemBarStyle(scrim, scrim, 2, new SystemBarStyle$Companion$$ExternalSyntheticLambda1(), (DefaultConstructorMarker) null);
            }

            /* access modifiers changed from: private */
            public static final boolean dark$lambda$1(Resources resources) {
                Intrinsics.checkNotNullParameter(resources, "<unused var>");
                return true;
            }

            @JvmStatic
            public final SystemBarStyle light(int scrim, int darkScrim) {
                return new SystemBarStyle(scrim, darkScrim, 1, new SystemBarStyle$Companion$$ExternalSyntheticLambda0(), (DefaultConstructorMarker) null);
            }

            /* access modifiers changed from: private */
            public static final boolean light$lambda$2(Resources resources) {
                Intrinsics.checkNotNullParameter(resources, "<unused var>");
                return false;
            }
        }

        @JvmStatic
        public static final SystemBarStyle auto(int lightScrim2, int darkScrim2) {
            return Companion.auto(lightScrim2, darkScrim2);
        }

        @JvmStatic
        public static final SystemBarStyle auto(int lightScrim2, int darkScrim2, Function1<? super Resources, Boolean> detectDarkMode2) {
            return Companion.auto(lightScrim2, darkScrim2, detectDarkMode2);
        }

        @JvmStatic
        public static final SystemBarStyle dark(int scrim) {
            return Companion.dark(scrim);
        }

        @JvmStatic
        public static final SystemBarStyle light(int scrim, int darkScrim2) {
            return Companion.light(scrim, darkScrim2);
        }

        public final int getScrim$activity_release(boolean isDark) {
            return isDark ? this.darkScrim : this.lightScrim;
        }

        public final int getScrimWithEnforcedContrast$activity_release(boolean isDark) {
            if (this.nightMode == 0) {
                return 0;
            }
            if (isDark) {
                return this.darkScrim;
            }
            return this.lightScrim;
        }
    }
