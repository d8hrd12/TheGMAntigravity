package kotlin.io.path;

import androidx.core.view.MotionEventCompat;
import java.nio.file.FileSystemException;
import java.nio.file.FileSystemLoopException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.SecureDirectoryStream;
import java.nio.file.attribute.BasicFileAttributeView;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import kotlin.ExceptionsKt;
import kotlin.Metadata;
import kotlin.NoWhenBranchMatchedException;
import kotlin.Unit;
import kotlin.collections.CollectionsKt;
import kotlin.jvm.functions.Function0;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.functions.Function3;
import kotlin.jvm.internal.Intrinsics;

@Metadata(d1 = {"\u0000v\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u000f\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010 \n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0006\n\u0002\u0010\u0011\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\u001a$\u0010\u0000\u001a\u00020\u00012\u0006\u0010\u0002\u001a\u00020\u00032\f\u0010\u0004\u001a\b\u0012\u0004\u0012\u00020\u00010\u0005H\b¢\u0006\u0002\b\u0006\u001a\u001d\u0010\u0007\u001a\u00020\u00012\u0006\u0010\b\u001a\u00020\t2\u0006\u0010\u0002\u001a\u00020\u0003H\u0002¢\u0006\u0002\b\n\u001a'\u0010\u000b\u001a\u00020\u00012\u0006\u0010\f\u001a\u00020\t2\b\u0010\r\u001a\u0004\u0018\u00010\t2\u0006\u0010\u0002\u001a\u00020\u0003H\u0002¢\u0006\u0002\b\u000e\u001a&\u0010\u000f\u001a\u0004\u0018\u0001H\u0010\"\u0004\b\u0000\u0010\u00102\f\u0010\u0004\u001a\b\u0012\u0004\u0012\u0002H\u00100\u0005H\b¢\u0006\u0004\b\u0011\u0010\u0012\u001a\f\u0010\u0013\u001a\u00020\u0001*\u00020\tH\u0000\u001a\u0019\u0010\u0014\u001a\u00020\u0001*\u00020\t2\u0006\u0010\r\u001a\u00020\tH\u0002¢\u0006\u0002\b\u0015\u001aw\u0010\u0016\u001a\u00020\t*\u00020\t2\u0006\u0010\u0017\u001a\u00020\t2Q\b\u0002\u0010\u0018\u001aK\u0012\u0013\u0012\u00110\t¢\u0006\f\b\u001a\u0012\b\b\u001b\u0012\u0004\b\b(\u001c\u0012\u0013\u0012\u00110\t¢\u0006\f\b\u001a\u0012\b\b\u001b\u0012\u0004\b\b(\u0017\u0012\u0017\u0012\u00150\u001dj\u0002`\u001e¢\u0006\f\b\u001a\u0012\b\b\u001b\u0012\u0004\b\b(\u001f\u0012\u0004\u0012\u00020 0\u00192\u0006\u0010!\u001a\u00020\"2\u0006\u0010#\u001a\u00020\"H\u0007\u001a´\u0001\u0010\u0016\u001a\u00020\t*\u00020\t2\u0006\u0010\u0017\u001a\u00020\t2Q\b\u0002\u0010\u0018\u001aK\u0012\u0013\u0012\u00110\t¢\u0006\f\b\u001a\u0012\b\b\u001b\u0012\u0004\b\b(\u001c\u0012\u0013\u0012\u00110\t¢\u0006\f\b\u001a\u0012\b\b\u001b\u0012\u0004\b\b(\u0017\u0012\u0017\u0012\u00150\u001dj\u0002`\u001e¢\u0006\f\b\u001a\u0012\b\b\u001b\u0012\u0004\b\b(\u001f\u0012\u0004\u0012\u00020 0\u00192\u0006\u0010!\u001a\u00020\"2C\b\u0002\u0010$\u001a=\u0012\u0004\u0012\u00020%\u0012\u0013\u0012\u00110\t¢\u0006\f\b\u001a\u0012\b\b\u001b\u0012\u0004\b\b(\u001c\u0012\u0013\u0012\u00110\t¢\u0006\f\b\u001a\u0012\b\b\u001b\u0012\u0004\b\b(\u0017\u0012\u0004\u0012\u00020&0\u0019¢\u0006\u0002\b'H\u0007\u001a\f\u0010(\u001a\u00020\u0001*\u00020\tH\u0007\u001a\u001b\u0010)\u001a\f\u0012\b\u0012\u00060\u001dj\u0002`\u001e0**\u00020\tH\u0002¢\u0006\u0002\b+\u001a'\u0010,\u001a\u00020\u0001*\b\u0012\u0004\u0012\u00020\t0-2\u0006\u0010\u001b\u001a\u00020\t2\u0006\u0010\u0002\u001a\u00020\u0003H\u0002¢\u0006\u0002\b.\u001a1\u0010/\u001a\u00020\u0001*\b\u0012\u0004\u0012\u00020\t0-2\u0006\u0010\u001b\u001a\u00020\t2\b\u0010\r\u001a\u0004\u0018\u00010\t2\u0006\u0010\u0002\u001a\u00020\u0003H\u0002¢\u0006\u0002\b0\u001a5\u00101\u001a\u00020\"*\b\u0012\u0004\u0012\u00020\t0-2\u0006\u00102\u001a\u00020\t2\u0012\u00103\u001a\n\u0012\u0006\b\u0001\u0012\u00020504\"\u000205H\u0002¢\u0006\u0004\b6\u00107\u001a\u0011\u00108\u001a\u000209*\u00020&H\u0003¢\u0006\u0002\b:\u001a\u0011\u00108\u001a\u000209*\u00020 H\u0003¢\u0006\u0002\b:¨\u0006;"}, d2 = {"collectIfThrows", "", "collector", "Lkotlin/io/path/ExceptionsCollector;", "function", "Lkotlin/Function0;", "collectIfThrows$PathsKt__PathRecursiveFunctionsKt", "insecureEnterDirectory", "path", "Ljava/nio/file/Path;", "insecureEnterDirectory$PathsKt__PathRecursiveFunctionsKt", "insecureHandleEntry", "entry", "parent", "insecureHandleEntry$PathsKt__PathRecursiveFunctionsKt", "tryIgnoreNoSuchFileException", "R", "tryIgnoreNoSuchFileException$PathsKt__PathRecursiveFunctionsKt", "(Lkotlin/jvm/functions/Function0;)Ljava/lang/Object;", "checkFileName", "checkNotSameAs", "checkNotSameAs$PathsKt__PathRecursiveFunctionsKt", "copyToRecursively", "target", "onError", "Lkotlin/Function3;", "Lkotlin/ParameterName;", "name", "source", "Ljava/lang/Exception;", "Lkotlin/Exception;", "exception", "Lkotlin/io/path/OnErrorResult;", "followLinks", "", "overwrite", "copyAction", "Lkotlin/io/path/CopyActionContext;", "Lkotlin/io/path/CopyActionResult;", "Lkotlin/ExtensionFunctionType;", "deleteRecursively", "deleteRecursivelyImpl", "", "deleteRecursivelyImpl$PathsKt__PathRecursiveFunctionsKt", "enterDirectory", "Ljava/nio/file/SecureDirectoryStream;", "enterDirectory$PathsKt__PathRecursiveFunctionsKt", "handleEntry", "handleEntry$PathsKt__PathRecursiveFunctionsKt", "isDirectory", "entryName", "options", "", "Ljava/nio/file/LinkOption;", "isDirectory$PathsKt__PathRecursiveFunctionsKt", "(Ljava/nio/file/SecureDirectoryStream;Ljava/nio/file/Path;[Ljava/nio/file/LinkOption;)Z", "toFileVisitResult", "Ljava/nio/file/FileVisitResult;", "toFileVisitResult$PathsKt__PathRecursiveFunctionsKt", "kotlin-stdlib-jdk7"}, k = 5, mv = {1, 9, 0}, xi = 49, xs = "kotlin/io/path/PathsKt")
/* compiled from: PathRecursiveFunctions.kt */
class PathsKt__PathRecursiveFunctionsKt extends PathsKt__PathReadWriteKt {

    @Metadata(k = 3, mv = {1, 9, 0}, xi = 48)
    /* compiled from: PathRecursiveFunctions.kt */
    public /* synthetic */ class WhenMappings {
        public static final /* synthetic */ int[] $EnumSwitchMapping$0;
        public static final /* synthetic */ int[] $EnumSwitchMapping$1;

        static {
            int[] iArr = new int[CopyActionResult.values().length];
            try {
                iArr[CopyActionResult.CONTINUE.ordinal()] = 1;
            } catch (NoSuchFieldError e) {
            }
            try {
                iArr[CopyActionResult.TERMINATE.ordinal()] = 2;
            } catch (NoSuchFieldError e2) {
            }
            try {
                iArr[CopyActionResult.SKIP_SUBTREE.ordinal()] = 3;
            } catch (NoSuchFieldError e3) {
            }
            $EnumSwitchMapping$0 = iArr;
            int[] iArr2 = new int[OnErrorResult.values().length];
            try {
                iArr2[OnErrorResult.TERMINATE.ordinal()] = 1;
            } catch (NoSuchFieldError e4) {
            }
            try {
                iArr2[OnErrorResult.SKIP_SUBTREE.ordinal()] = 2;
            } catch (NoSuchFieldError e5) {
            }
            $EnumSwitchMapping$1 = iArr2;
        }
    }

    public static /* synthetic */ Path copyToRecursively$default(Path path, Path path2, Function3 function3, boolean z, boolean z2, int i, Object obj) {
        if ((i & 2) != 0) {
            function3 = PathsKt__PathRecursiveFunctionsKt$copyToRecursively$1.INSTANCE;
        }
        return PathsKt.copyToRecursively(path, path2, (Function3<? super Path, ? super Path, ? super Exception, ? extends OnErrorResult>) function3, z, z2);
    }

    public static final Path copyToRecursively(Path $this$copyToRecursively, Path target, Function3<? super Path, ? super Path, ? super Exception, ? extends OnErrorResult> onError, boolean followLinks, boolean overwrite) {
        Intrinsics.checkNotNullParameter($this$copyToRecursively, "<this>");
        Intrinsics.checkNotNullParameter(target, "target");
        Intrinsics.checkNotNullParameter(onError, "onError");
        if (!overwrite) {
            return PathsKt.copyToRecursively$default($this$copyToRecursively, target, (Function3) onError, followLinks, (Function3) null, 8, (Object) null);
        }
        Path path = $this$copyToRecursively;
        Path path2 = target;
        Function3<? super Path, ? super Path, ? super Exception, ? extends OnErrorResult> function3 = onError;
        boolean z = followLinks;
        return PathsKt.copyToRecursively($this$copyToRecursively, target, onError, followLinks, (Function3<? super CopyActionContext, ? super Path, ? super Path, ? extends CopyActionResult>) new PathsKt__PathRecursiveFunctionsKt$copyToRecursively$2(followLinks));
    }

    public static /* synthetic */ Path copyToRecursively$default(Path path, Path path2, Function3 function3, boolean z, Function3 function32, int i, Object obj) {
        if ((i & 2) != 0) {
            function3 = PathsKt__PathRecursiveFunctionsKt$copyToRecursively$3.INSTANCE;
        }
        if ((i & 8) != 0) {
            function32 = new PathsKt__PathRecursiveFunctionsKt$copyToRecursively$4(z);
        }
        return PathsKt.copyToRecursively(path, path2, (Function3<? super Path, ? super Path, ? super Exception, ? extends OnErrorResult>) function3, z, (Function3<? super CopyActionContext, ? super Path, ? super Path, ? extends CopyActionResult>) function32);
    }

    public static final Path copyToRecursively(Path $this$copyToRecursively, Path target, Function3<? super Path, ? super Path, ? super Exception, ? extends OnErrorResult> onError, boolean followLinks, Function3<? super CopyActionContext, ? super Path, ? super Path, ? extends CopyActionResult> copyAction) {
        Intrinsics.checkNotNullParameter($this$copyToRecursively, "<this>");
        Intrinsics.checkNotNullParameter(target, "target");
        Intrinsics.checkNotNullParameter(onError, "onError");
        Function3<? super CopyActionContext, ? super Path, ? super Path, ? extends CopyActionResult> function3 = copyAction;
        Intrinsics.checkNotNullParameter(copyAction, "copyAction");
        LinkOption[] linkOptions = LinkFollowing.INSTANCE.toLinkOptions(followLinks);
        LinkOption[] linkOptionArr = (LinkOption[]) Arrays.copyOf(linkOptions, linkOptions.length);
        if (Files.exists($this$copyToRecursively, (LinkOption[]) Arrays.copyOf(linkOptionArr, linkOptionArr.length))) {
            boolean isSubdirectory = false;
            if (Files.exists($this$copyToRecursively, (LinkOption[]) Arrays.copyOf(new LinkOption[0], 0)) && (followLinks || !Files.isSymbolicLink($this$copyToRecursively))) {
                boolean targetExistsAndNotSymlink = Files.exists(target, (LinkOption[]) Arrays.copyOf(new LinkOption[0], 0)) && !Files.isSymbolicLink(target);
                if (!targetExistsAndNotSymlink || !Files.isSameFile($this$copyToRecursively, target)) {
                    if (Intrinsics.areEqual((Object) $this$copyToRecursively.getFileSystem(), (Object) target.getFileSystem())) {
                        if (targetExistsAndNotSymlink) {
                            isSubdirectory = target.toRealPath(new LinkOption[0]).startsWith($this$copyToRecursively.toRealPath(new LinkOption[0]));
                        } else {
                            Path it = target.getParent();
                            if (it != null && Files.exists(it, (LinkOption[]) Arrays.copyOf(new LinkOption[0], 0)) && it.toRealPath(new LinkOption[0]).startsWith($this$copyToRecursively.toRealPath(new LinkOption[0]))) {
                                isSubdirectory = true;
                            }
                        }
                    }
                    if (isSubdirectory) {
                        throw new FileSystemException($this$copyToRecursively.toString(), target.toString(), "Recursively copying a directory into its subdirectory is prohibited.");
                    }
                }
            }
            Path normalizedTarget = target.normalize();
            ArrayList stack = new ArrayList();
            ArrayList arrayList = stack;
            Path path = normalizedTarget;
            PathsKt.visitFileTree$default($this$copyToRecursively, 0, followLinks, (Function1) new PathsKt__PathRecursiveFunctionsKt$copyToRecursively$5(stack, function3, $this$copyToRecursively, target, normalizedTarget, onError), 1, (Object) null);
            return target;
        }
        throw new NoSuchFileException($this$copyToRecursively.toString(), target.toString(), "The source file doesn't exist.");
    }

    private static final Path copyToRecursively$destination$PathsKt__PathRecursiveFunctionsKt(Path $this_copyToRecursively, Path $target, Path normalizedTarget, Path source) {
        Path destination = $target.resolve(PathsKt.relativeTo(source, $this_copyToRecursively).toString());
        if (destination.normalize().startsWith(normalizedTarget)) {
            Intrinsics.checkNotNull(destination);
            return destination;
        }
        throw new IllegalFileNameException(source, destination, "Copying files to outside the specified target directory is prohibited. The directory being recursively copied might contain an entry with an illegal name.");
    }

    /* access modifiers changed from: private */
    public static final FileVisitResult copyToRecursively$error$PathsKt__PathRecursiveFunctionsKt(Function3<? super Path, ? super Path, ? super Exception, ? extends OnErrorResult> $onError, Path $this_copyToRecursively, Path $target, Path normalizedTarget, Path source, Exception exception) {
        return toFileVisitResult$PathsKt__PathRecursiveFunctionsKt((OnErrorResult) $onError.invoke(source, copyToRecursively$destination$PathsKt__PathRecursiveFunctionsKt($this_copyToRecursively, $target, normalizedTarget, source), exception));
    }

    /* access modifiers changed from: private */
    public static final FileVisitResult copyToRecursively$copy$PathsKt__PathRecursiveFunctionsKt(ArrayList<Path> stack, Function3<? super CopyActionContext, ? super Path, ? super Path, ? extends CopyActionResult> $copyAction, Path $this_copyToRecursively, Path $target, Path normalizedTarget, Function3<? super Path, ? super Path, ? super Exception, ? extends OnErrorResult> $onError, Path source, BasicFileAttributes attributes) {
        try {
            if (!stack.isEmpty()) {
                PathsKt.checkFileName(source);
                checkNotSameAs$PathsKt__PathRecursiveFunctionsKt(source, (Path) CollectionsKt.last(stack));
            }
            Path path = $this_copyToRecursively;
            Path path2 = $target;
            Path path3 = normalizedTarget;
            Function3<? super Path, ? super Path, ? super Exception, ? extends OnErrorResult> function3 = $onError;
            Path path4 = source;
            return toFileVisitResult$PathsKt__PathRecursiveFunctionsKt((CopyActionResult) $copyAction.invoke(DefaultCopyActionContext.INSTANCE, source, copyToRecursively$destination$PathsKt__PathRecursiveFunctionsKt($this_copyToRecursively, $target, normalizedTarget, source)));
        } catch (Exception e) {
            return copyToRecursively$error$PathsKt__PathRecursiveFunctionsKt($onError, $this_copyToRecursively, $target, normalizedTarget, source, e);
        }
    }

    private static final FileVisitResult toFileVisitResult$PathsKt__PathRecursiveFunctionsKt(CopyActionResult $this$toFileVisitResult) {
        switch (WhenMappings.$EnumSwitchMapping$0[$this$toFileVisitResult.ordinal()]) {
            case 1:
                return FileVisitResult.CONTINUE;
            case 2:
                return FileVisitResult.TERMINATE;
            case 3:
                return FileVisitResult.SKIP_SUBTREE;
            default:
                throw new NoWhenBranchMatchedException();
        }
    }

    private static final FileVisitResult toFileVisitResult$PathsKt__PathRecursiveFunctionsKt(OnErrorResult $this$toFileVisitResult) {
        switch (WhenMappings.$EnumSwitchMapping$1[$this$toFileVisitResult.ordinal()]) {
            case 1:
                return FileVisitResult.TERMINATE;
            case 2:
                return FileVisitResult.SKIP_SUBTREE;
            default:
                throw new NoWhenBranchMatchedException();
        }
    }

    public static final void deleteRecursively(Path $this$deleteRecursively) {
        Intrinsics.checkNotNullParameter($this$deleteRecursively, "<this>");
        List<Exception> $this$forEach$iv = deleteRecursivelyImpl$PathsKt__PathRecursiveFunctionsKt($this$deleteRecursively);
        if (!$this$forEach$iv.isEmpty()) {
            FileSystemException fileSystemException = new FileSystemException("Failed to delete one or more files. See suppressed exceptions for details.");
            FileSystemException $this$deleteRecursively_u24lambda_u242 = fileSystemException;
            for (Exception it : $this$forEach$iv) {
                ExceptionsKt.addSuppressed($this$deleteRecursively_u24lambda_u242, it);
            }
            throw fileSystemException;
        }
    }

    /* JADX WARNING: Code restructure failed: missing block: B:18:0x0041, code lost:
        r7 = move-exception;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:19:0x0042, code lost:
        kotlin.io.CloseableKt.closeFinally(r6, r3);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:20:0x0045, code lost:
        throw r7;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private static final java.util.List<java.lang.Exception> deleteRecursivelyImpl$PathsKt__PathRecursiveFunctionsKt(java.nio.file.Path r12) {
        /*
            kotlin.io.path.ExceptionsCollector r0 = new kotlin.io.path.ExceptionsCollector
            r1 = 0
            r2 = 1
            r3 = 0
            r0.<init>(r1, r2, r3)
            r1 = 0
            r1 = 1
            java.nio.file.Path r2 = r12.getParent()
            if (r2 == 0) goto L_0x0048
            r4 = 0
            java.nio.file.DirectoryStream r5 = java.nio.file.Files.newDirectoryStream(r2)     // Catch:{ all -> 0x0016 }
            goto L_0x0018
        L_0x0016:
            r5 = move-exception
            r5 = r3
        L_0x0018:
            if (r5 == 0) goto L_0x0046
            r6 = r5
            java.io.Closeable r6 = (java.io.Closeable) r6
            r7 = r6
            java.nio.file.DirectoryStream r7 = (java.nio.file.DirectoryStream) r7     // Catch:{ all -> 0x003f }
            r8 = 0
            boolean r9 = r7 instanceof java.nio.file.SecureDirectoryStream     // Catch:{ all -> 0x003f }
            if (r9 == 0) goto L_0x0038
            r1 = 0
            r0.setPath(r2)     // Catch:{ all -> 0x003f }
            r9 = r7
            java.nio.file.SecureDirectoryStream r9 = (java.nio.file.SecureDirectoryStream) r9     // Catch:{ all -> 0x003f }
            java.nio.file.Path r10 = r12.getFileName()     // Catch:{ all -> 0x003f }
            java.lang.String r11 = "getFileName(...)"
            kotlin.jvm.internal.Intrinsics.checkNotNullExpressionValue(r10, r11)     // Catch:{ all -> 0x003f }
            handleEntry$PathsKt__PathRecursiveFunctionsKt(r9, r10, r3, r0)     // Catch:{ all -> 0x003f }
        L_0x0038:
            kotlin.Unit r7 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x003f }
            kotlin.io.CloseableKt.closeFinally(r6, r3)
            goto L_0x0046
        L_0x003f:
            r3 = move-exception
            throw r3     // Catch:{ all -> 0x0041 }
        L_0x0041:
            r7 = move-exception
            kotlin.io.CloseableKt.closeFinally(r6, r3)
            throw r7
        L_0x0046:
        L_0x0048:
            if (r1 == 0) goto L_0x004d
            insecureHandleEntry$PathsKt__PathRecursiveFunctionsKt(r12, r3, r0)
        L_0x004d:
            java.util.List r2 = r0.getCollectedExceptions()
            return r2
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlin.io.path.PathsKt__PathRecursiveFunctionsKt.deleteRecursivelyImpl$PathsKt__PathRecursiveFunctionsKt(java.nio.file.Path):java.util.List");
    }

    private static final void collectIfThrows$PathsKt__PathRecursiveFunctionsKt(ExceptionsCollector collector, Function0<Unit> function) {
        try {
            function.invoke();
        } catch (Exception exception) {
            collector.collect(exception);
        }
    }

    private static final <R> R tryIgnoreNoSuchFileException$PathsKt__PathRecursiveFunctionsKt(Function0<? extends R> function) {
        try {
            return function.invoke();
        } catch (NoSuchFileException e) {
            return null;
        }
    }

    private static final void handleEntry$PathsKt__PathRecursiveFunctionsKt(SecureDirectoryStream<Path> $this$handleEntry, Path name, Path parent, ExceptionsCollector collector) {
        collector.enterEntry(name);
        if (parent != null) {
            try {
                Path entry = collector.getPath();
                Intrinsics.checkNotNull(entry);
                PathsKt.checkFileName(entry);
                checkNotSameAs$PathsKt__PathRecursiveFunctionsKt(entry, parent);
            } catch (Exception exception$iv) {
                collector.collect(exception$iv);
            }
        }
        if (isDirectory$PathsKt__PathRecursiveFunctionsKt($this$handleEntry, name, LinkOption.NOFOLLOW_LINKS)) {
            int preEnterTotalExceptions = collector.getTotalExceptions();
            enterDirectory$PathsKt__PathRecursiveFunctionsKt($this$handleEntry, name, collector);
            if (preEnterTotalExceptions == collector.getTotalExceptions()) {
                try {
                    $this$handleEntry.deleteDirectory(name);
                    Unit unit = Unit.INSTANCE;
                } catch (NoSuchFileException e) {
                }
            }
        } else {
            try {
                $this$handleEntry.deleteFile(name);
                Unit unit2 = Unit.INSTANCE;
            } catch (NoSuchFileException e2) {
            }
        }
        collector.exitEntry(name);
    }

    /* JADX WARNING: Code restructure failed: missing block: B:21:0x004b, code lost:
        r3 = move-exception;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:?, code lost:
        kotlin.io.CloseableKt.closeFinally(r4, r2);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x004f, code lost:
        throw r3;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private static final void enterDirectory$PathsKt__PathRecursiveFunctionsKt(java.nio.file.SecureDirectoryStream<java.nio.file.Path> r10, java.nio.file.Path r11, kotlin.io.path.ExceptionsCollector r12) {
        /*
            r0 = 0
            r1 = 0
            r2 = 0
            r3 = 0
            r4 = 1
            r5 = 0
            java.nio.file.LinkOption[] r4 = new java.nio.file.LinkOption[r4]     // Catch:{ NoSuchFileException -> 0x0016 }
            java.nio.file.LinkOption r6 = java.nio.file.LinkOption.NOFOLLOW_LINKS     // Catch:{ NoSuchFileException -> 0x0016 }
            r7 = 0
            r4[r7] = r6     // Catch:{ NoSuchFileException -> 0x0016 }
            java.nio.file.SecureDirectoryStream r4 = r10.newDirectoryStream(r11, r4)     // Catch:{ NoSuchFileException -> 0x0016 }
            goto L_0x0018
        L_0x0014:
            r1 = move-exception
            goto L_0x0050
        L_0x0016:
            r3 = move-exception
            r4 = r5
        L_0x0018:
            if (r4 == 0) goto L_0x0054
            java.io.Closeable r4 = (java.io.Closeable) r4     // Catch:{ Exception -> 0x0014 }
            r2 = r4
            java.nio.file.SecureDirectoryStream r2 = (java.nio.file.SecureDirectoryStream) r2     // Catch:{ all -> 0x0049 }
            r3 = 0
            java.util.Iterator r6 = r2.iterator()     // Catch:{ all -> 0x0049 }
        L_0x0025:
            boolean r7 = r6.hasNext()     // Catch:{ all -> 0x0049 }
            if (r7 == 0) goto L_0x0042
            java.lang.Object r7 = r6.next()     // Catch:{ all -> 0x0049 }
            java.nio.file.Path r7 = (java.nio.file.Path) r7     // Catch:{ all -> 0x0049 }
            java.nio.file.Path r8 = r7.getFileName()     // Catch:{ all -> 0x0049 }
            java.lang.String r9 = "getFileName(...)"
            kotlin.jvm.internal.Intrinsics.checkNotNullExpressionValue(r8, r9)     // Catch:{ all -> 0x0049 }
            java.nio.file.Path r9 = r12.getPath()     // Catch:{ all -> 0x0049 }
            handleEntry$PathsKt__PathRecursiveFunctionsKt(r2, r8, r9, r12)     // Catch:{ all -> 0x0049 }
            goto L_0x0025
        L_0x0042:
            kotlin.Unit r2 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x0049 }
            kotlin.io.CloseableKt.closeFinally(r4, r5)     // Catch:{ Exception -> 0x0014 }
            goto L_0x0054
        L_0x0049:
            r2 = move-exception
            throw r2     // Catch:{ all -> 0x004b }
        L_0x004b:
            r3 = move-exception
            kotlin.io.CloseableKt.closeFinally(r4, r2)     // Catch:{ Exception -> 0x0014 }
            throw r3     // Catch:{ Exception -> 0x0014 }
        L_0x0050:
            r12.collect(r1)
            goto L_0x0056
        L_0x0054:
        L_0x0056:
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlin.io.path.PathsKt__PathRecursiveFunctionsKt.enterDirectory$PathsKt__PathRecursiveFunctionsKt(java.nio.file.SecureDirectoryStream, java.nio.file.Path, kotlin.io.path.ExceptionsCollector):void");
    }

    private static final boolean isDirectory$PathsKt__PathRecursiveFunctionsKt(SecureDirectoryStream<Path> $this$isDirectory, Path entryName, LinkOption... options) {
        Boolean bool;
        try {
            bool = Boolean.valueOf(((BasicFileAttributeView) $this$isDirectory.getFileAttributeView(entryName, BasicFileAttributeView.class, (LinkOption[]) Arrays.copyOf(options, options.length))).readAttributes().isDirectory());
        } catch (NoSuchFileException e) {
            bool = null;
        }
        if (bool != null) {
            return bool.booleanValue();
        }
        return false;
    }

    private static final void insecureHandleEntry$PathsKt__PathRecursiveFunctionsKt(Path entry, Path parent, ExceptionsCollector collector) {
        if (parent != null) {
            try {
                PathsKt.checkFileName(entry);
                checkNotSameAs$PathsKt__PathRecursiveFunctionsKt(entry, parent);
            } catch (Exception exception$iv) {
                collector.collect(exception$iv);
                return;
            }
        }
        if (Files.isDirectory(entry, (LinkOption[]) Arrays.copyOf(new LinkOption[]{LinkOption.NOFOLLOW_LINKS}, 1))) {
            int preEnterTotalExceptions = collector.getTotalExceptions();
            insecureEnterDirectory$PathsKt__PathRecursiveFunctionsKt(entry, collector);
            if (preEnterTotalExceptions == collector.getTotalExceptions()) {
                Files.deleteIfExists(entry);
                return;
            }
            return;
        }
        Files.deleteIfExists(entry);
    }

    /* JADX WARNING: Code restructure failed: missing block: B:21:0x0039, code lost:
        r3 = move-exception;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:?, code lost:
        kotlin.io.CloseableKt.closeFinally(r5, r2);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x003d, code lost:
        throw r3;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private static final void insecureEnterDirectory$PathsKt__PathRecursiveFunctionsKt(java.nio.file.Path r8, kotlin.io.path.ExceptionsCollector r9) {
        /*
            r0 = 0
            r1 = 0
            r2 = 0
            r3 = 0
            r4 = 0
            java.nio.file.DirectoryStream r5 = java.nio.file.Files.newDirectoryStream(r8)     // Catch:{ NoSuchFileException -> 0x000e }
            goto L_0x0010
        L_0x000c:
            r1 = move-exception
            goto L_0x003e
        L_0x000e:
            r3 = move-exception
            r5 = r4
        L_0x0010:
            if (r5 == 0) goto L_0x0042
            java.io.Closeable r5 = (java.io.Closeable) r5     // Catch:{ Exception -> 0x000c }
            r2 = r5
            java.nio.file.DirectoryStream r2 = (java.nio.file.DirectoryStream) r2     // Catch:{ all -> 0x0037 }
            r3 = 0
            java.util.Iterator r6 = r2.iterator()     // Catch:{ all -> 0x0037 }
        L_0x001d:
            boolean r7 = r6.hasNext()     // Catch:{ all -> 0x0037 }
            if (r7 == 0) goto L_0x0030
            java.lang.Object r7 = r6.next()     // Catch:{ all -> 0x0037 }
            java.nio.file.Path r7 = (java.nio.file.Path) r7     // Catch:{ all -> 0x0037 }
            kotlin.jvm.internal.Intrinsics.checkNotNull(r7)     // Catch:{ all -> 0x0037 }
            insecureHandleEntry$PathsKt__PathRecursiveFunctionsKt(r7, r8, r9)     // Catch:{ all -> 0x0037 }
            goto L_0x001d
        L_0x0030:
            kotlin.Unit r2 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x0037 }
            kotlin.io.CloseableKt.closeFinally(r5, r4)     // Catch:{ Exception -> 0x000c }
            goto L_0x0042
        L_0x0037:
            r2 = move-exception
            throw r2     // Catch:{ all -> 0x0039 }
        L_0x0039:
            r3 = move-exception
            kotlin.io.CloseableKt.closeFinally(r5, r2)     // Catch:{ Exception -> 0x000c }
            throw r3     // Catch:{ Exception -> 0x000c }
        L_0x003e:
            r9.collect(r1)
            goto L_0x0044
        L_0x0042:
        L_0x0044:
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlin.io.path.PathsKt__PathRecursiveFunctionsKt.insecureEnterDirectory$PathsKt__PathRecursiveFunctionsKt(java.nio.file.Path, kotlin.io.path.ExceptionsCollector):void");
    }

    public static final void checkFileName(Path $this$checkFileName) {
        Intrinsics.checkNotNullParameter($this$checkFileName, "<this>");
        String fileName = PathsKt.getName($this$checkFileName);
        switch (fileName.hashCode()) {
            case MotionEventCompat.AXIS_GENERIC_15:
                if (!fileName.equals(".")) {
                    return;
                }
                break;
            case 1472:
                if (!fileName.equals("..")) {
                    return;
                }
                break;
            case 1473:
                if (!fileName.equals("./")) {
                    return;
                }
                break;
            case 1518:
                if (!fileName.equals(".\\")) {
                    return;
                }
                break;
            case 45679:
                if (!fileName.equals("../")) {
                    return;
                }
                break;
            case 45724:
                if (!fileName.equals("..\\")) {
                    return;
                }
                break;
            default:
                return;
        }
        throw new IllegalFileNameException($this$checkFileName);
    }

    private static final void checkNotSameAs$PathsKt__PathRecursiveFunctionsKt(Path $this$checkNotSameAs, Path parent) {
        if (!Files.isSymbolicLink($this$checkNotSameAs) && Files.isSameFile($this$checkNotSameAs, parent)) {
            throw new FileSystemLoopException($this$checkNotSameAs.toString());
        }
    }
}
