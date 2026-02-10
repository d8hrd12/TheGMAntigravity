package kotlin.text;

import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.jvm.internal.DebugMetadata;
import kotlin.coroutines.jvm.internal.RestrictedSuspendLambda;
import kotlin.jvm.functions.Function2;
import kotlin.sequences.SequenceScope;

@Metadata(d1 = {"\u0000\u000e\n\u0000\n\u0002\u0010\u0002\n\u0002\u0018\u0002\n\u0002\u0010\u000e\u0010\u0000\u001a\u00020\u0001*\b\u0012\u0004\u0012\u00020\u00030\u0002H@"}, d2 = {"<anonymous>", "", "Lkotlin/sequences/SequenceScope;", ""}, k = 3, mv = {1, 9, 0}, xi = 48)
@DebugMetadata(c = "kotlin.text.Regex$splitToSequence$1", f = "Regex.kt", i = {1, 1, 1}, l = {275, 283, 287}, m = "invokeSuspend", n = {"$this$sequence", "matcher", "splitCount"}, s = {"L$0", "L$1", "I$0"})
/* compiled from: Regex.kt */
final class Regex$splitToSequence$1 extends RestrictedSuspendLambda implements Function2<SequenceScope<? super String>, Continuation<? super Unit>, Object> {
    final /* synthetic */ CharSequence $input;
    final /* synthetic */ int $limit;
    int I$0;
    private /* synthetic */ Object L$0;
    Object L$1;
    int label;
    final /* synthetic */ Regex this$0;

    /* JADX INFO: super call moved to the top of the method (can break code semantics) */
    Regex$splitToSequence$1(Regex regex, CharSequence charSequence, int i, Continuation<? super Regex$splitToSequence$1> continuation) {
        super(2, continuation);
        this.this$0 = regex;
        this.$input = charSequence;
        this.$limit = i;
    }

    public final Continuation<Unit> create(Object obj, Continuation<?> continuation) {
        Regex$splitToSequence$1 regex$splitToSequence$1 = new Regex$splitToSequence$1(this.this$0, this.$input, this.$limit, continuation);
        regex$splitToSequence$1.L$0 = obj;
        return regex$splitToSequence$1;
    }

    public final Object invoke(SequenceScope<? super String> sequenceScope, Continuation<? super Unit> continuation) {
        return ((Regex$splitToSequence$1) create(sequenceScope, continuation)).invokeSuspend(Unit.INSTANCE);
    }

    /* Debug info: failed to restart local var, previous not found, register: 9 */
    /* JADX WARNING: Code restructure failed: missing block: B:12:0x0051, code lost:
        r6.L$0 = r4;
        r6.L$1 = r3;
        r6.I$0 = r1;
        r6.label = 2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:13:0x006f, code lost:
        if (r4.yield(r6.$input.subSequence(r5, r3.start()).toString(), r6) != r0) goto L_0x0072;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:14:0x0071, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:15:0x0072, code lost:
        r5 = r3.end();
        r1 = r1 + 1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:16:0x007a, code lost:
        if (r1 == (r6.$limit - 1)) goto L_0x0082;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:18:0x0080, code lost:
        if (r3.find() != false) goto L_0x0051;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:19:0x0082, code lost:
        r6.L$0 = null;
        r6.L$1 = null;
        r6.label = 3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:20:0x00a2, code lost:
        if (r4.yield(r6.$input.subSequence(r5, r6.$input.length()).toString(), r6) != r0) goto L_0x00a5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x00a4, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x00a7, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x00bc, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public final java.lang.Object invokeSuspend(java.lang.Object r10) {
        /*
            r9 = this;
            java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r1 = r9.label
            r2 = 1
            switch(r1) {
                case 0: goto L_0x002c;
                case 1: goto L_0x0027;
                case 2: goto L_0x0018;
                case 3: goto L_0x0012;
                default: goto L_0x000a;
            }
        L_0x000a:
            java.lang.IllegalStateException r10 = new java.lang.IllegalStateException
            java.lang.String r0 = "call to 'resume' before 'invoke' with coroutine"
            r10.<init>(r0)
            throw r10
        L_0x0012:
            kotlin.ResultKt.throwOnFailure(r10)
            r6 = r9
            goto L_0x00a5
        L_0x0018:
            int r1 = r9.I$0
            java.lang.Object r3 = r9.L$1
            java.util.regex.Matcher r3 = (java.util.regex.Matcher) r3
            java.lang.Object r4 = r9.L$0
            kotlin.sequences.SequenceScope r4 = (kotlin.sequences.SequenceScope) r4
            kotlin.ResultKt.throwOnFailure(r10)
            r6 = r9
            goto L_0x0072
        L_0x0027:
            kotlin.ResultKt.throwOnFailure(r10)
            goto L_0x00ba
        L_0x002c:
            kotlin.ResultKt.throwOnFailure(r10)
            java.lang.Object r1 = r9.L$0
            kotlin.sequences.SequenceScope r1 = (kotlin.sequences.SequenceScope) r1
            kotlin.text.Regex r3 = r9.this$0
            java.util.regex.Pattern r3 = r3.nativePattern
            java.lang.CharSequence r4 = r9.$input
            java.util.regex.Matcher r3 = r3.matcher(r4)
            int r4 = r9.$limit
            if (r4 == r2) goto L_0x00a8
            boolean r4 = r3.find()
            if (r4 != 0) goto L_0x004a
            goto L_0x00a8
        L_0x004a:
            r4 = 0
            r5 = 0
            r6 = r4
            r4 = r1
            r1 = r5
            r5 = r6
            r6 = r9
        L_0x0051:
            java.lang.CharSequence r7 = r6.$input
            int r8 = r3.start()
            java.lang.CharSequence r7 = r7.subSequence(r5, r8)
            java.lang.String r5 = r7.toString()
            r7 = r6
            kotlin.coroutines.Continuation r7 = (kotlin.coroutines.Continuation) r7
            r6.L$0 = r4
            r6.L$1 = r3
            r6.I$0 = r1
            r8 = 2
            r6.label = r8
            java.lang.Object r5 = r4.yield(r5, r7)
            if (r5 != r0) goto L_0x0072
            return r0
        L_0x0072:
            int r5 = r3.end()
            int r1 = r1 + r2
            int r7 = r6.$limit
            int r7 = r7 - r2
            if (r1 == r7) goto L_0x0082
            boolean r7 = r3.find()
            if (r7 != 0) goto L_0x0051
        L_0x0082:
            java.lang.CharSequence r1 = r6.$input
            java.lang.CharSequence r2 = r6.$input
            int r2 = r2.length()
            java.lang.CharSequence r1 = r1.subSequence(r5, r2)
            java.lang.String r1 = r1.toString()
            r2 = r6
            kotlin.coroutines.Continuation r2 = (kotlin.coroutines.Continuation) r2
            r3 = 0
            r6.L$0 = r3
            r6.L$1 = r3
            r3 = 3
            r6.label = r3
            java.lang.Object r1 = r4.yield(r1, r2)
            if (r1 != r0) goto L_0x00a5
            return r0
        L_0x00a5:
            kotlin.Unit r0 = kotlin.Unit.INSTANCE
            return r0
        L_0x00a8:
            java.lang.CharSequence r3 = r9.$input
            java.lang.String r3 = r3.toString()
            r4 = r9
            kotlin.coroutines.Continuation r4 = (kotlin.coroutines.Continuation) r4
            r9.label = r2
            java.lang.Object r1 = r1.yield(r3, r4)
            if (r1 != r0) goto L_0x00ba
            return r0
        L_0x00ba:
            kotlin.Unit r0 = kotlin.Unit.INSTANCE
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlin.text.Regex$splitToSequence$1.invokeSuspend(java.lang.Object):java.lang.Object");
    }
}
