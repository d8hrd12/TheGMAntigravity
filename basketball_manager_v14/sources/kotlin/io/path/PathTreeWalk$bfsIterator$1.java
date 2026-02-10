package kotlin.io.path;

import java.nio.file.Path;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.jvm.internal.DebugMetadata;
import kotlin.coroutines.jvm.internal.RestrictedSuspendLambda;
import kotlin.jvm.functions.Function2;
import kotlin.sequences.SequenceScope;

@Metadata(d1 = {"\u0000\u000e\n\u0000\n\u0002\u0010\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\u0010\u0000\u001a\u00020\u0001*\b\u0012\u0004\u0012\u00020\u00030\u0002H@"}, d2 = {"<anonymous>", "", "Lkotlin/sequences/SequenceScope;", "Ljava/nio/file/Path;"}, k = 3, mv = {1, 9, 0}, xi = 48)
@DebugMetadata(c = "kotlin.io.path.PathTreeWalk$bfsIterator$1", f = "PathTreeWalk.kt", i = {0, 0, 0, 0, 0, 0, 1, 1, 1}, l = {192, 198}, m = "invokeSuspend", n = {"$this$iterator", "queue", "entriesReader", "pathNode", "this_$iv", "path$iv", "$this$iterator", "queue", "entriesReader"}, s = {"L$0", "L$1", "L$2", "L$3", "L$4", "L$5", "L$0", "L$1", "L$2"})
/* compiled from: PathTreeWalk.kt */
final class PathTreeWalk$bfsIterator$1 extends RestrictedSuspendLambda implements Function2<SequenceScope<? super Path>, Continuation<? super Unit>, Object> {
    private /* synthetic */ Object L$0;
    Object L$1;
    Object L$2;
    Object L$3;
    Object L$4;
    Object L$5;
    int label;
    final /* synthetic */ PathTreeWalk this$0;

    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    PathTreeWalk$bfsIterator$1(PathTreeWalk pathTreeWalk, Continuation<? super PathTreeWalk$bfsIterator$1> continuation) {
        super(2, continuation);
        this.this$0 = pathTreeWalk;
    }

    public final Continuation<Unit> create(Object obj, Continuation<?> continuation) {
        PathTreeWalk$bfsIterator$1 pathTreeWalk$bfsIterator$1 = new PathTreeWalk$bfsIterator$1(this.this$0, continuation);
        pathTreeWalk$bfsIterator$1.L$0 = obj;
        return pathTreeWalk$bfsIterator$1;
    }

    public final Object invoke(SequenceScope<? super Path> sequenceScope, Continuation<? super Unit> continuation) {
        return ((PathTreeWalk$bfsIterator$1) create(sequenceScope, continuation)).invokeSuspend(Unit.INSTANCE);
    }

    /* Debug info: failed to restart local var, previous not found, register: 13 */
    /* JADX WARNING: Code restructure failed: missing block: B:10:0x009d, code lost:
        if (r6.getParent() == null) goto L_0x00a2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:11:0x009f, code lost:
        kotlin.io.path.PathsKt.checkFileName(r10);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:12:0x00a2, code lost:
        r11 = r7.getLinkOptions();
        r11 = (java.nio.file.LinkOption[]) java.util.Arrays.copyOf(r11, r11.length);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:13:0x00b9, code lost:
        if (java.nio.file.Files.isDirectory(r10, (java.nio.file.LinkOption[]) java.util.Arrays.copyOf(r11, r11.length)) == false) goto L_0x011d;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:15:0x00bf, code lost:
        if (kotlin.io.path.PathTreeWalkKt.createsCycle(r6) != false) goto L_0x0113;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:17:0x00c5, code lost:
        if (r7.getIncludeDirectories() == false) goto L_0x00ed;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:18:0x00c7, code lost:
        r1.L$0 = r5;
        r1.L$1 = r4;
        r1.L$2 = r3;
        r1.L$3 = r6;
        r1.L$4 = r7;
        r1.L$5 = r10;
        r1.label = 1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:19:0x00dc, code lost:
        if (r8.yield(r10, r1) != r0) goto L_0x00df;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:20:0x00de, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x00df, code lost:
        r8 = r7;
        r7 = r4;
        r4 = r8;
        r8 = r5;
        r5 = r6;
        r6 = r3;
        r3 = r10;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x00e6, code lost:
        r10 = r7;
        r7 = r4;
        r4 = r10;
        r10 = r3;
        r3 = r6;
        r6 = r5;
        r5 = r8;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x00ed, code lost:
        r8 = r7.getLinkOptions();
        r7 = (java.nio.file.LinkOption[]) java.util.Arrays.copyOf(r8, r8.length);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x0103, code lost:
        if (java.nio.file.Files.isDirectory(r10, (java.nio.file.LinkOption[]) java.util.Arrays.copyOf(r7, r7.length)) == false) goto L_0x0082;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x0105, code lost:
        r4.addAll(r3.readEntries(r6));
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x011c, code lost:
        throw new java.nio.file.FileSystemLoopException(r10.toString());
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x012e, code lost:
        if (java.nio.file.Files.exists(r10, (java.nio.file.LinkOption[]) java.util.Arrays.copyOf(new java.nio.file.LinkOption[]{java.nio.file.LinkOption.NOFOLLOW_LINKS}, 1)) == false) goto L_0x0082;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x0130, code lost:
        r1.L$0 = r5;
        r1.L$1 = r4;
        r1.L$2 = r3;
        r1.L$3 = null;
        r1.L$4 = null;
        r1.L$5 = null;
        r1.label = 2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x0146, code lost:
        if (r8.yield(r10, r1) != r0) goto L_0x0149;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x0148, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:0x0149, code lost:
        r6 = r5;
        r5 = r4;
        r4 = r3;
        r3 = r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:34:0x014e, code lost:
        r1 = r3;
        r3 = r4;
        r4 = r5;
        r5 = r6;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x0156, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:8:0x0089, code lost:
        if (r4.isEmpty() != false) goto L_0x0154;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:9:0x008b, code lost:
        r6 = (kotlin.io.path.PathNode) r4.removeFirst();
        r7 = r1.this$0;
        r8 = r5;
        r10 = r6.getPath();
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final java.lang.Object invokeSuspend(java.lang.Object r14) {
        /*
            r13 = this;
            java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r1 = r13.label
            r2 = 0
            switch(r1) {
                case 0: goto L_0x0048;
                case 1: goto L_0x0028;
                case 2: goto L_0x0012;
                default: goto L_0x000a;
            }
        L_0x000a:
            java.lang.IllegalStateException r14 = new java.lang.IllegalStateException
            java.lang.String r0 = "call to 'resume' before 'invoke' with coroutine"
            r14.<init>(r0)
            throw r14
        L_0x0012:
            r1 = 0
            java.lang.Object r3 = r13.L$2
            kotlin.io.path.DirectoryEntriesReader r3 = (kotlin.io.path.DirectoryEntriesReader) r3
            java.lang.Object r4 = r13.L$1
            kotlin.collections.ArrayDeque r4 = (kotlin.collections.ArrayDeque) r4
            java.lang.Object r5 = r13.L$0
            kotlin.sequences.SequenceScope r5 = (kotlin.sequences.SequenceScope) r5
            kotlin.ResultKt.throwOnFailure(r14)
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r13
            goto L_0x014e
        L_0x0028:
            r1 = 0
            java.lang.Object r3 = r13.L$5
            java.nio.file.Path r3 = (java.nio.file.Path) r3
            java.lang.Object r4 = r13.L$4
            kotlin.io.path.PathTreeWalk r4 = (kotlin.io.path.PathTreeWalk) r4
            java.lang.Object r5 = r13.L$3
            kotlin.io.path.PathNode r5 = (kotlin.io.path.PathNode) r5
            java.lang.Object r6 = r13.L$2
            kotlin.io.path.DirectoryEntriesReader r6 = (kotlin.io.path.DirectoryEntriesReader) r6
            java.lang.Object r7 = r13.L$1
            kotlin.collections.ArrayDeque r7 = (kotlin.collections.ArrayDeque) r7
            java.lang.Object r8 = r13.L$0
            kotlin.sequences.SequenceScope r8 = (kotlin.sequences.SequenceScope) r8
            kotlin.ResultKt.throwOnFailure(r14)
            r9 = r1
            r1 = r13
            goto L_0x00e6
        L_0x0048:
            kotlin.ResultKt.throwOnFailure(r14)
            java.lang.Object r1 = r13.L$0
            kotlin.sequences.SequenceScope r1 = (kotlin.sequences.SequenceScope) r1
            kotlin.collections.ArrayDeque r3 = new kotlin.collections.ArrayDeque
            r3.<init>()
            kotlin.io.path.DirectoryEntriesReader r4 = new kotlin.io.path.DirectoryEntriesReader
            kotlin.io.path.PathTreeWalk r5 = r13.this$0
            boolean r5 = r5.getFollowLinks()
            r4.<init>(r5)
            kotlin.io.path.PathNode r5 = new kotlin.io.path.PathNode
            kotlin.io.path.PathTreeWalk r6 = r13.this$0
            java.nio.file.Path r6 = r6.start
            kotlin.io.path.PathTreeWalk r7 = r13.this$0
            java.nio.file.Path r7 = r7.start
            kotlin.io.path.PathTreeWalk r8 = r13.this$0
            java.nio.file.LinkOption[] r8 = r8.getLinkOptions()
            java.lang.Object r7 = kotlin.io.path.PathTreeWalkKt.keyOf(r7, r8)
            r5.<init>(r6, r7, r2)
            r3.addLast(r5)
            r5 = r4
            r4 = r3
            r3 = r5
            r5 = r1
            r1 = r13
        L_0x0082:
            r6 = r4
            java.util.Collection r6 = (java.util.Collection) r6
            boolean r6 = r6.isEmpty()
            if (r6 != 0) goto L_0x0154
            java.lang.Object r6 = r4.removeFirst()
            kotlin.io.path.PathNode r6 = (kotlin.io.path.PathNode) r6
            kotlin.io.path.PathTreeWalk r7 = r1.this$0
            r8 = r5
            r9 = 0
            java.nio.file.Path r10 = r6.getPath()
            kotlin.io.path.PathNode r11 = r6.getParent()
            if (r11 == 0) goto L_0x00a2
            kotlin.io.path.PathsKt.checkFileName(r10)
        L_0x00a2:
            java.nio.file.LinkOption[] r11 = r7.getLinkOptions()
            int r12 = r11.length
            java.lang.Object[] r11 = java.util.Arrays.copyOf(r11, r12)
            java.nio.file.LinkOption[] r11 = (java.nio.file.LinkOption[]) r11
            int r12 = r11.length
            java.lang.Object[] r11 = java.util.Arrays.copyOf(r11, r12)
            java.nio.file.LinkOption[] r11 = (java.nio.file.LinkOption[]) r11
            boolean r11 = java.nio.file.Files.isDirectory(r10, r11)
            r12 = 1
            if (r11 == 0) goto L_0x011d
            boolean r11 = kotlin.io.path.PathTreeWalkKt.createsCycle(r6)
            if (r11 != 0) goto L_0x0113
            boolean r11 = r7.getIncludeDirectories()
            if (r11 == 0) goto L_0x00ed
            r11 = r1
            kotlin.coroutines.Continuation r11 = (kotlin.coroutines.Continuation) r11
            r1.L$0 = r5
            r1.L$1 = r4
            r1.L$2 = r3
            r1.L$3 = r6
            r1.L$4 = r7
            r1.L$5 = r10
            r1.label = r12
            java.lang.Object r8 = r8.yield(r10, r11)
            if (r8 != r0) goto L_0x00df
            return r0
        L_0x00df:
            r8 = r7
            r7 = r4
            r4 = r8
            r8 = r5
            r5 = r6
            r6 = r3
            r3 = r10
        L_0x00e6:
            r10 = r7
            r7 = r4
            r4 = r10
            r10 = r3
            r3 = r6
            r6 = r5
            r5 = r8
        L_0x00ed:
            java.nio.file.LinkOption[] r8 = r7.getLinkOptions()
            int r7 = r8.length
            java.lang.Object[] r7 = java.util.Arrays.copyOf(r8, r7)
            java.nio.file.LinkOption[] r7 = (java.nio.file.LinkOption[]) r7
            int r8 = r7.length
            java.lang.Object[] r7 = java.util.Arrays.copyOf(r7, r8)
            java.nio.file.LinkOption[] r7 = (java.nio.file.LinkOption[]) r7
            boolean r7 = java.nio.file.Files.isDirectory(r10, r7)
            if (r7 == 0) goto L_0x0082
            java.util.List r6 = r3.readEntries(r6)
            r7 = 0
            r8 = r6
            java.util.Collection r8 = (java.util.Collection) r8
            r4.addAll(r8)
            goto L_0x0082
        L_0x0113:
            java.nio.file.FileSystemLoopException r0 = new java.nio.file.FileSystemLoopException
            java.lang.String r2 = r10.toString()
            r0.<init>(r2)
            throw r0
        L_0x011d:
            java.nio.file.LinkOption[] r6 = new java.nio.file.LinkOption[r12]
            r7 = 0
            java.nio.file.LinkOption r11 = java.nio.file.LinkOption.NOFOLLOW_LINKS
            r6[r7] = r11
            java.lang.Object[] r6 = java.util.Arrays.copyOf(r6, r12)
            java.nio.file.LinkOption[] r6 = (java.nio.file.LinkOption[]) r6
            boolean r6 = java.nio.file.Files.exists(r10, r6)
            if (r6 == 0) goto L_0x0082
            r6 = r1
            kotlin.coroutines.Continuation r6 = (kotlin.coroutines.Continuation) r6
            r1.L$0 = r5
            r1.L$1 = r4
            r1.L$2 = r3
            r1.L$3 = r2
            r1.L$4 = r2
            r1.L$5 = r2
            r7 = 2
            r1.label = r7
            java.lang.Object r6 = r8.yield(r10, r6)
            if (r6 != r0) goto L_0x0149
            return r0
        L_0x0149:
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r1
            r1 = r9
        L_0x014e:
            r1 = r3
            r3 = r4
            r4 = r5
            r5 = r6
            goto L_0x0082
        L_0x0154:
            kotlin.Unit r0 = kotlin.Unit.INSTANCE
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlin.io.path.PathTreeWalk$bfsIterator$1.invokeSuspend(java.lang.Object):java.lang.Object");
    }
}
