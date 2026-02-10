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
@DebugMetadata(c = "kotlin.io.path.PathTreeWalk$dfsIterator$1", f = "PathTreeWalk.kt", i = {0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3}, l = {192, 198, 211, 217}, m = "invokeSuspend", n = {"$this$iterator", "stack", "entriesReader", "startNode", "this_$iv", "path$iv", "$this$iterator", "stack", "entriesReader", "$this$iterator", "stack", "entriesReader", "pathNode", "this_$iv", "path$iv", "$this$iterator", "stack", "entriesReader"}, s = {"L$0", "L$1", "L$2", "L$3", "L$4", "L$5", "L$0", "L$1", "L$2", "L$0", "L$1", "L$2", "L$3", "L$4", "L$5", "L$0", "L$1", "L$2"})
/* compiled from: PathTreeWalk.kt */
final class PathTreeWalk$dfsIterator$1 extends RestrictedSuspendLambda implements Function2<SequenceScope<? super Path>, Continuation<? super Unit>, Object> {
    private /* synthetic */ Object L$0;
    Object L$1;
    Object L$2;
    Object L$3;
    Object L$4;
    Object L$5;
    int label;
    final /* synthetic */ PathTreeWalk this$0;

    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    PathTreeWalk$dfsIterator$1(PathTreeWalk pathTreeWalk, Continuation<? super PathTreeWalk$dfsIterator$1> continuation) {
        super(2, continuation);
        this.this$0 = pathTreeWalk;
    }

    public final Continuation<Unit> create(Object obj, Continuation<?> continuation) {
        PathTreeWalk$dfsIterator$1 pathTreeWalk$dfsIterator$1 = new PathTreeWalk$dfsIterator$1(this.this$0, continuation);
        pathTreeWalk$dfsIterator$1.L$0 = obj;
        return pathTreeWalk$dfsIterator$1;
    }

    public final Object invoke(SequenceScope<? super Path> sequenceScope, Continuation<? super Unit> continuation) {
        return ((PathTreeWalk$dfsIterator$1) create(sequenceScope, continuation)).invokeSuspend(Unit.INSTANCE);
    }

    /* Debug info: failed to restart local var, previous not found, register: 17 */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r6v11, resolved type: java.lang.Object} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r9v11, resolved type: kotlin.sequences.SequenceScope} */
    /* JADX WARNING: type inference failed for: r16v5 */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x0111, code lost:
        r13 = r12;
        r12 = r6;
        r6 = r9;
        r9 = r13;
        r13 = r7;
        r7 = r10;
        r10 = r8;
        r8 = r11;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x0119, code lost:
        r11 = r10.getLinkOptions();
        r10 = (java.nio.file.LinkOption[]) java.util.Arrays.copyOf(r11, r11.length);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x012f, code lost:
        if (java.nio.file.Files.isDirectory(r13, (java.nio.file.LinkOption[]) java.util.Arrays.copyOf(r10, r10.length)) == false) goto L_0x0142;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x0131, code lost:
        r6.setContentIterator(r7.readEntries(r6).iterator());
        r8.addLast(r6);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x0142, code lost:
        r6 = r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:34:0x0174, code lost:
        r6 = r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:37:0x017e, code lost:
        if (r8.isEmpty() != false) goto L_0x0266;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:38:0x0180, code lost:
        r11 = ((kotlin.io.path.PathNode) r8.last()).getContentIterator();
        kotlin.jvm.internal.Intrinsics.checkNotNull(r11);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:39:0x0191, code lost:
        if (r11.hasNext() == false) goto L_0x0260;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:40:0x0193, code lost:
        r10 = r11.next();
        r11 = r6.this$0;
        r12 = r9;
        r14 = r10.getPath();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:41:0x01a5, code lost:
        if (r10.getParent() == null) goto L_0x01aa;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:42:0x01a7, code lost:
        kotlin.io.path.PathsKt.checkFileName(r14);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:43:0x01aa, code lost:
        r15 = r11.getLinkOptions();
        r16 = r3;
        r3 = (java.nio.file.LinkOption[]) java.util.Arrays.copyOf(r15, r15.length);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:44:0x01c2, code lost:
        if (java.nio.file.Files.isDirectory(r14, (java.nio.file.LinkOption[]) java.util.Arrays.copyOf(r3, r3.length)) == false) goto L_0x022e;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:46:0x01c8, code lost:
        if (kotlin.io.path.PathTreeWalkKt.createsCycle(r10) != false) goto L_0x0224;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:47:0x01ca, code lost:
        r16 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:48:0x01ce, code lost:
        if (r11.getIncludeDirectories() == false) goto L_0x01f7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:49:0x01d0, code lost:
        r6.L$0 = r9;
        r6.L$1 = r8;
        r6.L$2 = r7;
        r6.L$3 = r10;
        r6.L$4 = r11;
        r6.L$5 = r14;
        r6.label = 3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:50:0x01e6, code lost:
        if (r12.yield(r14, r6) != r1) goto L_0x01e9;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:51:0x01e8, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:52:0x01e9, code lost:
        r12 = r11;
        r11 = r8;
        r8 = r12;
        r12 = r9;
        r9 = r10;
        r10 = r7;
        r7 = r14;
        r16 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:53:0x01f0, code lost:
        r14 = r11;
        r11 = r8;
        r8 = r14;
        r14 = r7;
        r7 = r10;
        r10 = r9;
        r9 = r12;
        r16 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:54:0x01f7, code lost:
        r3 = r11.getLinkOptions();
        r3 = (java.nio.file.LinkOption[]) java.util.Arrays.copyOf(r3, r3.length);
        r16 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:55:0x020d, code lost:
        if (java.nio.file.Files.isDirectory(r14, (java.nio.file.LinkOption[]) java.util.Arrays.copyOf(r3, r3.length)) == false) goto L_0x0220;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:56:0x020f, code lost:
        r10.setContentIterator(r7.readEntries(r10).iterator());
        r8.addLast(r10);
        r16 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:57:0x0220, code lost:
        r3 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:59:0x022d, code lost:
        throw new java.nio.file.FileSystemLoopException(r14.toString());
     */
    /* JADX WARNING: Code restructure failed: missing block: B:60:0x022e, code lost:
        r3 = new java.nio.file.LinkOption[1];
        r3[r16] = java.nio.file.LinkOption.NOFOLLOW_LINKS;
        r16 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:61:0x023e, code lost:
        if (java.nio.file.Files.exists(r14, (java.nio.file.LinkOption[]) java.util.Arrays.copyOf(r3, 1)) == false) goto L_0x0220;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:62:0x0240, code lost:
        r6.L$0 = r9;
        r6.L$1 = r8;
        r6.L$2 = r7;
        r6.L$3 = null;
        r6.L$4 = null;
        r6.L$5 = null;
        r6.label = 4;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:63:0x0256, code lost:
        if (r12.yield(r14, r6) != r1) goto L_0x0259;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:64:0x0258, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:65:0x0259, code lost:
        r3 = r6;
        r16 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:66:0x025b, code lost:
        r6 = r3;
        r3 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:67:0x0260, code lost:
        r16 = r3;
        r8.removeLast();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:69:0x0268, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Multi-variable type inference failed */
    /* JADX WARNING: Unknown variable types count: 1 */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final java.lang.Object invokeSuspend(java.lang.Object r18) {
        /*
            r17 = this;
            r0 = r17
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            r3 = 0
            r4 = 1
            r5 = 0
            switch(r2) {
                case 0: goto L_0x0085;
                case 1: goto L_0x0065;
                case 2: goto L_0x0051;
                case 3: goto L_0x002d;
                case 4: goto L_0x0016;
                default: goto L_0x000e;
            }
        L_0x000e:
            java.lang.IllegalStateException r1 = new java.lang.IllegalStateException
            java.lang.String r2 = "call to 'resume' before 'invoke' with coroutine"
            r1.<init>(r2)
            throw r1
        L_0x0016:
            r2 = r18
            r6 = 0
            java.lang.Object r7 = r0.L$2
            kotlin.io.path.DirectoryEntriesReader r7 = (kotlin.io.path.DirectoryEntriesReader) r7
            java.lang.Object r8 = r0.L$1
            kotlin.collections.ArrayDeque r8 = (kotlin.collections.ArrayDeque) r8
            java.lang.Object r9 = r0.L$0
            kotlin.sequences.SequenceScope r9 = (kotlin.sequences.SequenceScope) r9
            kotlin.ResultKt.throwOnFailure(r2)
            r16 = r3
            r3 = r0
            goto L_0x025b
        L_0x002d:
            r2 = r18
            r6 = 0
            java.lang.Object r7 = r0.L$5
            java.nio.file.Path r7 = (java.nio.file.Path) r7
            java.lang.Object r8 = r0.L$4
            kotlin.io.path.PathTreeWalk r8 = (kotlin.io.path.PathTreeWalk) r8
            java.lang.Object r9 = r0.L$3
            kotlin.io.path.PathNode r9 = (kotlin.io.path.PathNode) r9
            java.lang.Object r10 = r0.L$2
            kotlin.io.path.DirectoryEntriesReader r10 = (kotlin.io.path.DirectoryEntriesReader) r10
            java.lang.Object r11 = r0.L$1
            kotlin.collections.ArrayDeque r11 = (kotlin.collections.ArrayDeque) r11
            java.lang.Object r12 = r0.L$0
            kotlin.sequences.SequenceScope r12 = (kotlin.sequences.SequenceScope) r12
            kotlin.ResultKt.throwOnFailure(r2)
            r16 = r3
            r13 = r6
            r6 = r0
            goto L_0x01f0
        L_0x0051:
            r2 = r18
            r6 = 0
            java.lang.Object r7 = r0.L$2
            kotlin.io.path.DirectoryEntriesReader r7 = (kotlin.io.path.DirectoryEntriesReader) r7
            java.lang.Object r8 = r0.L$1
            kotlin.collections.ArrayDeque r8 = (kotlin.collections.ArrayDeque) r8
            java.lang.Object r9 = r0.L$0
            kotlin.sequences.SequenceScope r9 = (kotlin.sequences.SequenceScope) r9
            kotlin.ResultKt.throwOnFailure(r2)
            goto L_0x0174
        L_0x0065:
            r2 = r18
            r6 = 0
            java.lang.Object r7 = r0.L$5
            java.nio.file.Path r7 = (java.nio.file.Path) r7
            java.lang.Object r8 = r0.L$4
            kotlin.io.path.PathTreeWalk r8 = (kotlin.io.path.PathTreeWalk) r8
            java.lang.Object r9 = r0.L$3
            kotlin.io.path.PathNode r9 = (kotlin.io.path.PathNode) r9
            java.lang.Object r10 = r0.L$2
            kotlin.io.path.DirectoryEntriesReader r10 = (kotlin.io.path.DirectoryEntriesReader) r10
            java.lang.Object r11 = r0.L$1
            kotlin.collections.ArrayDeque r11 = (kotlin.collections.ArrayDeque) r11
            java.lang.Object r12 = r0.L$0
            kotlin.sequences.SequenceScope r12 = (kotlin.sequences.SequenceScope) r12
            kotlin.ResultKt.throwOnFailure(r2)
            goto L_0x0111
        L_0x0085:
            kotlin.ResultKt.throwOnFailure(r18)
            r2 = r18
            java.lang.Object r6 = r0.L$0
            r9 = r6
            kotlin.sequences.SequenceScope r9 = (kotlin.sequences.SequenceScope) r9
            kotlin.collections.ArrayDeque r6 = new kotlin.collections.ArrayDeque
            r6.<init>()
            r8 = r6
            kotlin.io.path.DirectoryEntriesReader r6 = new kotlin.io.path.DirectoryEntriesReader
            kotlin.io.path.PathTreeWalk r7 = r0.this$0
            boolean r7 = r7.getFollowLinks()
            r6.<init>(r7)
            r7 = r6
            kotlin.io.path.PathNode r6 = new kotlin.io.path.PathNode
            kotlin.io.path.PathTreeWalk r10 = r0.this$0
            java.nio.file.Path r10 = r10.start
            kotlin.io.path.PathTreeWalk r11 = r0.this$0
            java.nio.file.Path r11 = r11.start
            kotlin.io.path.PathTreeWalk r12 = r0.this$0
            java.nio.file.LinkOption[] r12 = r12.getLinkOptions()
            java.lang.Object r11 = kotlin.io.path.PathTreeWalkKt.keyOf(r11, r12)
            r6.<init>(r10, r11, r5)
            kotlin.io.path.PathTreeWalk r10 = r0.this$0
            r11 = r9
            r12 = 0
            java.nio.file.Path r13 = r6.getPath()
            kotlin.io.path.PathNode r14 = r6.getParent()
            if (r14 == 0) goto L_0x00cd
            kotlin.io.path.PathsKt.checkFileName(r13)
        L_0x00cd:
            java.nio.file.LinkOption[] r14 = r10.getLinkOptions()
            int r15 = r14.length
            java.lang.Object[] r14 = java.util.Arrays.copyOf(r14, r15)
            java.nio.file.LinkOption[] r14 = (java.nio.file.LinkOption[]) r14
            int r15 = r14.length
            java.lang.Object[] r14 = java.util.Arrays.copyOf(r14, r15)
            java.nio.file.LinkOption[] r14 = (java.nio.file.LinkOption[]) r14
            boolean r14 = java.nio.file.Files.isDirectory(r13, r14)
            if (r14 == 0) goto L_0x014e
            boolean r14 = kotlin.io.path.PathTreeWalkKt.createsCycle(r6)
            if (r14 != 0) goto L_0x0144
            boolean r14 = r10.getIncludeDirectories()
            if (r14 == 0) goto L_0x0119
            r14 = r0
            kotlin.coroutines.Continuation r14 = (kotlin.coroutines.Continuation) r14
            r0.L$0 = r9
            r0.L$1 = r8
            r0.L$2 = r7
            r0.L$3 = r6
            r0.L$4 = r10
            r0.L$5 = r13
            r0.label = r4
            java.lang.Object r11 = r11.yield(r13, r14)
            if (r11 != r1) goto L_0x0109
            return r1
        L_0x0109:
            r11 = r9
            r9 = r6
            r6 = r12
            r12 = r11
            r11 = r8
            r8 = r10
            r10 = r7
            r7 = r13
        L_0x0111:
            r13 = r12
            r12 = r6
            r6 = r9
            r9 = r13
            r13 = r7
            r7 = r10
            r10 = r8
            r8 = r11
        L_0x0119:
            java.nio.file.LinkOption[] r11 = r10.getLinkOptions()
            int r10 = r11.length
            java.lang.Object[] r10 = java.util.Arrays.copyOf(r11, r10)
            java.nio.file.LinkOption[] r10 = (java.nio.file.LinkOption[]) r10
            int r11 = r10.length
            java.lang.Object[] r10 = java.util.Arrays.copyOf(r10, r11)
            java.nio.file.LinkOption[] r10 = (java.nio.file.LinkOption[]) r10
            boolean r10 = java.nio.file.Files.isDirectory(r13, r10)
            if (r10 == 0) goto L_0x0142
            java.util.List r10 = r7.readEntries(r6)
            r11 = 0
            java.util.Iterator r13 = r10.iterator()
            r6.setContentIterator(r13)
            r8.addLast(r6)
        L_0x0142:
            r6 = r0
            goto L_0x0177
        L_0x0144:
            java.nio.file.FileSystemLoopException r1 = new java.nio.file.FileSystemLoopException
            java.lang.String r3 = r13.toString()
            r1.<init>(r3)
            throw r1
        L_0x014e:
            java.nio.file.LinkOption[] r6 = new java.nio.file.LinkOption[r4]
            java.nio.file.LinkOption r10 = java.nio.file.LinkOption.NOFOLLOW_LINKS
            r6[r3] = r10
            java.lang.Object[] r6 = java.util.Arrays.copyOf(r6, r4)
            java.nio.file.LinkOption[] r6 = (java.nio.file.LinkOption[]) r6
            boolean r6 = java.nio.file.Files.exists(r13, r6)
            if (r6 == 0) goto L_0x0176
            r6 = r0
            kotlin.coroutines.Continuation r6 = (kotlin.coroutines.Continuation) r6
            r0.L$0 = r9
            r0.L$1 = r8
            r0.L$2 = r7
            r10 = 2
            r0.label = r10
            java.lang.Object r6 = r11.yield(r13, r6)
            if (r6 != r1) goto L_0x0173
            return r1
        L_0x0173:
            r6 = r12
        L_0x0174:
            r6 = r0
            goto L_0x0177
        L_0x0176:
            r6 = r0
        L_0x0177:
            r10 = r8
            java.util.Collection r10 = (java.util.Collection) r10
            boolean r10 = r10.isEmpty()
            if (r10 != 0) goto L_0x0266
            java.lang.Object r10 = r8.last()
            kotlin.io.path.PathNode r10 = (kotlin.io.path.PathNode) r10
            java.util.Iterator r11 = r10.getContentIterator()
            kotlin.jvm.internal.Intrinsics.checkNotNull(r11)
            boolean r10 = r11.hasNext()
            if (r10 == 0) goto L_0x0260
            java.lang.Object r10 = r11.next()
            kotlin.io.path.PathNode r10 = (kotlin.io.path.PathNode) r10
            kotlin.io.path.PathTreeWalk r11 = r6.this$0
            r12 = r9
            r13 = 0
            java.nio.file.Path r14 = r10.getPath()
            kotlin.io.path.PathNode r15 = r10.getParent()
            if (r15 == 0) goto L_0x01aa
            kotlin.io.path.PathsKt.checkFileName(r14)
        L_0x01aa:
            java.nio.file.LinkOption[] r15 = r11.getLinkOptions()
            r16 = r3
            int r3 = r15.length
            java.lang.Object[] r3 = java.util.Arrays.copyOf(r15, r3)
            java.nio.file.LinkOption[] r3 = (java.nio.file.LinkOption[]) r3
            int r15 = r3.length
            java.lang.Object[] r3 = java.util.Arrays.copyOf(r3, r15)
            java.nio.file.LinkOption[] r3 = (java.nio.file.LinkOption[]) r3
            boolean r3 = java.nio.file.Files.isDirectory(r14, r3)
            if (r3 == 0) goto L_0x022e
            boolean r3 = kotlin.io.path.PathTreeWalkKt.createsCycle(r10)
            if (r3 != 0) goto L_0x0224
            boolean r3 = r11.getIncludeDirectories()
            if (r3 == 0) goto L_0x01f7
            r3 = r6
            kotlin.coroutines.Continuation r3 = (kotlin.coroutines.Continuation) r3
            r6.L$0 = r9
            r6.L$1 = r8
            r6.L$2 = r7
            r6.L$3 = r10
            r6.L$4 = r11
            r6.L$5 = r14
            r15 = 3
            r6.label = r15
            java.lang.Object r3 = r12.yield(r14, r3)
            if (r3 != r1) goto L_0x01e9
            return r1
        L_0x01e9:
            r12 = r11
            r11 = r8
            r8 = r12
            r12 = r9
            r9 = r10
            r10 = r7
            r7 = r14
        L_0x01f0:
            r14 = r11
            r11 = r8
            r8 = r14
            r14 = r7
            r7 = r10
            r10 = r9
            r9 = r12
        L_0x01f7:
            java.nio.file.LinkOption[] r3 = r11.getLinkOptions()
            int r11 = r3.length
            java.lang.Object[] r3 = java.util.Arrays.copyOf(r3, r11)
            java.nio.file.LinkOption[] r3 = (java.nio.file.LinkOption[]) r3
            int r11 = r3.length
            java.lang.Object[] r3 = java.util.Arrays.copyOf(r3, r11)
            java.nio.file.LinkOption[] r3 = (java.nio.file.LinkOption[]) r3
            boolean r3 = java.nio.file.Files.isDirectory(r14, r3)
            if (r3 == 0) goto L_0x0220
            java.util.List r3 = r7.readEntries(r10)
            r11 = 0
            java.util.Iterator r12 = r3.iterator()
            r10.setContentIterator(r12)
            r8.addLast(r10)
        L_0x0220:
            r3 = r16
            goto L_0x0177
        L_0x0224:
            java.nio.file.FileSystemLoopException r1 = new java.nio.file.FileSystemLoopException
            java.lang.String r3 = r14.toString()
            r1.<init>(r3)
            throw r1
        L_0x022e:
            java.nio.file.LinkOption[] r3 = new java.nio.file.LinkOption[r4]
            java.nio.file.LinkOption r10 = java.nio.file.LinkOption.NOFOLLOW_LINKS
            r3[r16] = r10
            java.lang.Object[] r3 = java.util.Arrays.copyOf(r3, r4)
            java.nio.file.LinkOption[] r3 = (java.nio.file.LinkOption[]) r3
            boolean r3 = java.nio.file.Files.exists(r14, r3)
            if (r3 == 0) goto L_0x0220
            r3 = r6
            kotlin.coroutines.Continuation r3 = (kotlin.coroutines.Continuation) r3
            r6.L$0 = r9
            r6.L$1 = r8
            r6.L$2 = r7
            r6.L$3 = r5
            r6.L$4 = r5
            r6.L$5 = r5
            r10 = 4
            r6.label = r10
            java.lang.Object r3 = r12.yield(r14, r3)
            if (r3 != r1) goto L_0x0259
            return r1
        L_0x0259:
            r3 = r6
            r6 = r13
        L_0x025b:
            r6 = r3
            r3 = r16
            goto L_0x0177
        L_0x0260:
            r16 = r3
            r8.removeLast()
            goto L_0x0220
        L_0x0266:
            kotlin.Unit r1 = kotlin.Unit.INSTANCE
            return r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlin.io.path.PathTreeWalk$dfsIterator$1.invokeSuspend(java.lang.Object):java.lang.Object");
    }
}
