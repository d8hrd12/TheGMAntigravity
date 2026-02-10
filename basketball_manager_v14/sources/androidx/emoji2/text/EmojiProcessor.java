package androidx.emoji2.text;

import android.text.Editable;
import android.text.Selection;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.method.MetaKeyKeyListener;
import android.view.KeyEvent;
import android.view.inputmethod.InputConnection;
import androidx.emoji2.text.EmojiCompat;
import androidx.emoji2.text.MetadataRepo;
import java.util.Arrays;
import java.util.Set;

final class EmojiProcessor {
    private static final int ACTION_ADVANCE_BOTH = 1;
    private static final int ACTION_ADVANCE_END = 2;
    private static final int ACTION_FLUSH = 3;
    private static final int MAX_LOOK_AROUND_CHARACTER = 16;
    private final int[] mEmojiAsDefaultStyleExceptions;
    private EmojiCompat.GlyphChecker mGlyphChecker;
    private final MetadataRepo mMetadataRepo;
    private final EmojiCompat.SpanFactory mSpanFactory;
    private final boolean mUseEmojiAsDefaultStyle;

    private interface EmojiProcessCallback<T> {
        T getResult();

        boolean handleEmoji(CharSequence charSequence, int i, int i2, TypefaceEmojiRasterizer typefaceEmojiRasterizer);
    }

    EmojiProcessor(MetadataRepo metadataRepo, EmojiCompat.SpanFactory spanFactory, EmojiCompat.GlyphChecker glyphChecker, boolean useEmojiAsDefaultStyle, int[] emojiAsDefaultStyleExceptions, Set<int[]> emojiExclusions) {
        this.mSpanFactory = spanFactory;
        this.mMetadataRepo = metadataRepo;
        this.mGlyphChecker = glyphChecker;
        this.mUseEmojiAsDefaultStyle = useEmojiAsDefaultStyle;
        this.mEmojiAsDefaultStyleExceptions = emojiAsDefaultStyleExceptions;
        initExclusions(emojiExclusions);
    }

    private void initExclusions(Set<int[]> emojiExclusions) {
        if (!emojiExclusions.isEmpty()) {
            for (int[] codepoints : emojiExclusions) {
                String emoji = new String(codepoints, 0, codepoints.length);
                process(emoji, 0, emoji.length(), 1, true, new MarkExclusionCallback(emoji));
            }
        }
    }

    /* access modifiers changed from: package-private */
    public int getEmojiMatch(CharSequence charSequence) {
        return getEmojiMatch(charSequence, this.mMetadataRepo.getMetadataVersion());
    }

    /* access modifiers changed from: package-private */
    public int getEmojiMatch(CharSequence charSequence, int metadataVersion) {
        ProcessorSm sm = new ProcessorSm(this.mMetadataRepo.getRootNode(), this.mUseEmojiAsDefaultStyle, this.mEmojiAsDefaultStyleExceptions);
        int end = charSequence.length();
        int currentOffset = 0;
        int potentialSubsequenceMatch = 0;
        int subsequenceMatch = 0;
        while (currentOffset < end) {
            int codePoint = Character.codePointAt(charSequence, currentOffset);
            int action = sm.check(codePoint);
            TypefaceEmojiRasterizer currentNode = sm.getCurrentMetadata();
            switch (action) {
                case 1:
                    currentOffset += Character.charCount(codePoint);
                    potentialSubsequenceMatch = 0;
                    break;
                case 2:
                    currentOffset += Character.charCount(codePoint);
                    break;
                case 3:
                    currentNode = sm.getFlushMetadata();
                    if (currentNode.getCompatAdded() <= metadataVersion) {
                        subsequenceMatch++;
                        break;
                    }
                    break;
            }
            if (currentNode != null && currentNode.getCompatAdded() <= metadataVersion) {
                potentialSubsequenceMatch++;
            }
        }
        if (subsequenceMatch != 0) {
            return 2;
        }
        if (sm.isInFlushableState() && sm.getCurrentMetadata().getCompatAdded() <= metadataVersion) {
            return 1;
        }
        if (potentialSubsequenceMatch == 0) {
            return 0;
        }
        return 2;
    }

    /* access modifiers changed from: package-private */
    public int getEmojiStart(CharSequence charSequence, int offset) {
        if (offset < 0) {
            return -1;
        } else if (offset >= charSequence.length()) {
            CharSequence charSequence2 = charSequence;
            return -1;
        } else {
            if (charSequence instanceof Spanned) {
                Spanned spanned = (Spanned) charSequence;
                EmojiSpan[] spans = (EmojiSpan[]) spanned.getSpans(offset, offset + 1, EmojiSpan.class);
                if (spans.length > 0) {
                    return spanned.getSpanStart(spans[0]);
                }
            }
            return ((EmojiProcessLookupCallback) process(charSequence, Math.max(0, offset - 16), Math.min(charSequence.length(), offset + 16), Integer.MAX_VALUE, true, new EmojiProcessLookupCallback(offset))).start;
        }
    }

    /* access modifiers changed from: package-private */
    public int getEmojiEnd(CharSequence charSequence, int offset) {
        if (offset < 0) {
            return -1;
        } else if (offset >= charSequence.length()) {
            CharSequence charSequence2 = charSequence;
            return -1;
        } else {
            if (charSequence instanceof Spanned) {
                Spanned spanned = (Spanned) charSequence;
                EmojiSpan[] spans = (EmojiSpan[]) spanned.getSpans(offset, offset + 1, EmojiSpan.class);
                if (spans.length > 0) {
                    return spanned.getSpanEnd(spans[0]);
                }
            }
            return ((EmojiProcessLookupCallback) process(charSequence, Math.max(0, offset - 16), Math.min(charSequence.length(), offset + 16), Integer.MAX_VALUE, true, new EmojiProcessLookupCallback(offset))).end;
        }
    }

    /* access modifiers changed from: package-private */
    /* JADX WARNING: Removed duplicated region for block: B:21:0x003c  */
    /* JADX WARNING: Removed duplicated region for block: B:37:0x0070 A[SYNTHETIC, Splitter:B:37:0x0070] */
    /* JADX WARNING: Removed duplicated region for block: B:69:0x00d5  */
    /* JADX WARNING: Removed duplicated region for block: B:71:0x00da  */
    /* JADX WARNING: Removed duplicated region for block: B:76:0x00e6  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public java.lang.CharSequence process(java.lang.CharSequence r10, int r11, int r12, int r13, boolean r14) {
        /*
            r9 = this;
            boolean r1 = r10 instanceof androidx.emoji2.text.SpannableBuilder
            if (r1 == 0) goto L_0x000a
            r0 = r10
            androidx.emoji2.text.SpannableBuilder r0 = (androidx.emoji2.text.SpannableBuilder) r0
            r0.beginBatchEdit()
        L_0x000a:
            r0 = 0
            if (r1 != 0) goto L_0x0031
            boolean r2 = r10 instanceof android.text.Spannable     // Catch:{ all -> 0x002c }
            if (r2 == 0) goto L_0x0012
            goto L_0x0031
        L_0x0012:
            boolean r2 = r10 instanceof android.text.Spanned     // Catch:{ all -> 0x002c }
            if (r2 == 0) goto L_0x003a
            r2 = r10
            android.text.Spanned r2 = (android.text.Spanned) r2     // Catch:{ all -> 0x002c }
            int r3 = r11 + -1
            int r4 = r12 + 1
            java.lang.Class<androidx.emoji2.text.EmojiSpan> r5 = androidx.emoji2.text.EmojiSpan.class
            int r2 = r2.nextSpanTransition(r3, r4, r5)     // Catch:{ all -> 0x002c }
            if (r2 > r12) goto L_0x003a
            androidx.emoji2.text.UnprecomputeTextOnModificationSpannable r3 = new androidx.emoji2.text.UnprecomputeTextOnModificationSpannable     // Catch:{ all -> 0x002c }
            r3.<init>((java.lang.CharSequence) r10)     // Catch:{ all -> 0x002c }
            r0 = r3
            goto L_0x003a
        L_0x002c:
            r0 = move-exception
            r3 = r10
            r7 = r14
            goto L_0x00e4
        L_0x0031:
            androidx.emoji2.text.UnprecomputeTextOnModificationSpannable r2 = new androidx.emoji2.text.UnprecomputeTextOnModificationSpannable     // Catch:{ all -> 0x00e1 }
            r3 = r10
            android.text.Spannable r3 = (android.text.Spannable) r3     // Catch:{ all -> 0x00e1 }
            r2.<init>((android.text.Spannable) r3)     // Catch:{ all -> 0x00e1 }
            r0 = r2
        L_0x003a:
            if (r0 == 0) goto L_0x006c
            java.lang.Class<androidx.emoji2.text.EmojiSpan> r2 = androidx.emoji2.text.EmojiSpan.class
            java.lang.Object[] r2 = r0.getSpans(r11, r12, r2)     // Catch:{ all -> 0x002c }
            androidx.emoji2.text.EmojiSpan[] r2 = (androidx.emoji2.text.EmojiSpan[]) r2     // Catch:{ all -> 0x002c }
            if (r2 == 0) goto L_0x006c
            int r3 = r2.length     // Catch:{ all -> 0x002c }
            if (r3 <= 0) goto L_0x006c
            int r3 = r2.length     // Catch:{ all -> 0x002c }
            r4 = 0
        L_0x004b:
            if (r4 >= r3) goto L_0x0069
            r5 = r2[r4]     // Catch:{ all -> 0x002c }
            int r6 = r0.getSpanStart(r5)     // Catch:{ all -> 0x002c }
            int r7 = r0.getSpanEnd(r5)     // Catch:{ all -> 0x002c }
            if (r6 == r12) goto L_0x005c
            r0.removeSpan(r5)     // Catch:{ all -> 0x002c }
        L_0x005c:
            int r8 = java.lang.Math.min(r6, r11)     // Catch:{ all -> 0x002c }
            r11 = r8
            int r8 = java.lang.Math.max(r7, r12)     // Catch:{ all -> 0x002c }
            r12 = r8
            int r4 = r4 + 1
            goto L_0x004b
        L_0x0069:
            r4 = r11
            r5 = r12
            goto L_0x006e
        L_0x006c:
            r4 = r11
            r5 = r12
        L_0x006e:
            if (r4 == r5) goto L_0x00d5
            int r11 = r10.length()     // Catch:{ all -> 0x00cf }
            if (r4 < r11) goto L_0x007a
            r3 = r10
            r7 = r14
            goto L_0x00d7
        L_0x007a:
            r11 = 2147483647(0x7fffffff, float:NaN)
            if (r13 == r11) goto L_0x0099
            if (r0 == 0) goto L_0x0099
            int r11 = r0.length()     // Catch:{ all -> 0x0092 }
            java.lang.Class<androidx.emoji2.text.EmojiSpan> r12 = androidx.emoji2.text.EmojiSpan.class
            r2 = 0
            java.lang.Object[] r11 = r0.getSpans(r2, r11, r12)     // Catch:{ all -> 0x0092 }
            androidx.emoji2.text.EmojiSpan[] r11 = (androidx.emoji2.text.EmojiSpan[]) r11     // Catch:{ all -> 0x0092 }
            int r11 = r11.length     // Catch:{ all -> 0x0092 }
            int r13 = r13 - r11
            r6 = r13
            goto L_0x009a
        L_0x0092:
            r0 = move-exception
            r3 = r10
            r7 = r14
            r11 = r4
            r12 = r5
            goto L_0x00e4
        L_0x0099:
            r6 = r13
        L_0x009a:
            androidx.emoji2.text.EmojiProcessor$EmojiProcessAddSpanCallback r8 = new androidx.emoji2.text.EmojiProcessor$EmojiProcessAddSpanCallback     // Catch:{ all -> 0x00c8 }
            androidx.emoji2.text.EmojiCompat$SpanFactory r11 = r9.mSpanFactory     // Catch:{ all -> 0x00c8 }
            r8.<init>(r0, r11)     // Catch:{ all -> 0x00c8 }
            r2 = r9
            r3 = r10
            r7 = r14
            java.lang.Object r10 = r2.process(r3, r4, r5, r6, r7, r8)     // Catch:{ all -> 0x00c3 }
            androidx.emoji2.text.UnprecomputeTextOnModificationSpannable r10 = (androidx.emoji2.text.UnprecomputeTextOnModificationSpannable) r10     // Catch:{ all -> 0x00c3 }
            if (r10 == 0) goto L_0x00b9
            android.text.Spannable r11 = r10.getUnwrappedSpannable()     // Catch:{ all -> 0x00c3 }
            if (r1 == 0) goto L_0x00b8
            r12 = r3
            androidx.emoji2.text.SpannableBuilder r12 = (androidx.emoji2.text.SpannableBuilder) r12
            r12.endBatchEdit()
        L_0x00b8:
            return r11
        L_0x00b9:
            if (r1 == 0) goto L_0x00c2
            r11 = r3
            androidx.emoji2.text.SpannableBuilder r11 = (androidx.emoji2.text.SpannableBuilder) r11
            r11.endBatchEdit()
        L_0x00c2:
            return r3
        L_0x00c3:
            r0 = move-exception
            r11 = r4
            r12 = r5
            r13 = r6
            goto L_0x00e4
        L_0x00c8:
            r0 = move-exception
            r3 = r10
            r7 = r14
            r11 = r4
            r12 = r5
            r13 = r6
            goto L_0x00e4
        L_0x00cf:
            r0 = move-exception
            r3 = r10
            r7 = r14
            r11 = r4
            r12 = r5
            goto L_0x00e4
        L_0x00d5:
            r3 = r10
            r7 = r14
        L_0x00d7:
            if (r1 == 0) goto L_0x00e0
            r10 = r3
            androidx.emoji2.text.SpannableBuilder r10 = (androidx.emoji2.text.SpannableBuilder) r10
            r10.endBatchEdit()
        L_0x00e0:
            return r3
        L_0x00e1:
            r0 = move-exception
            r3 = r10
            r7 = r14
        L_0x00e4:
            if (r1 == 0) goto L_0x00ec
            r10 = r3
            androidx.emoji2.text.SpannableBuilder r10 = (androidx.emoji2.text.SpannableBuilder) r10
            r10.endBatchEdit()
        L_0x00ec:
            throw r0
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.emoji2.text.EmojiProcessor.process(java.lang.CharSequence, int, int, int, boolean):java.lang.CharSequence");
    }

    private <T> T process(CharSequence charSequence, int start, int end, int maxEmojiCount, boolean processAll, EmojiProcessCallback<T> emojiProcessCallback) {
        int addedCount = 0;
        ProcessorSm sm = new ProcessorSm(this.mMetadataRepo.getRootNode(), this.mUseEmojiAsDefaultStyle, this.mEmojiAsDefaultStyleExceptions);
        int currentOffset = start;
        int codePoint = Character.codePointAt(charSequence, currentOffset);
        boolean keepProcessing = true;
        while (currentOffset < end && addedCount < maxEmojiCount && keepProcessing) {
            switch (sm.check(codePoint)) {
                case 1:
                    start += Character.charCount(Character.codePointAt(charSequence, start));
                    currentOffset = start;
                    if (currentOffset >= end) {
                        break;
                    } else {
                        codePoint = Character.codePointAt(charSequence, currentOffset);
                        break;
                    }
                case 2:
                    currentOffset += Character.charCount(codePoint);
                    if (currentOffset >= end) {
                        break;
                    } else {
                        codePoint = Character.codePointAt(charSequence, currentOffset);
                        break;
                    }
                case 3:
                    if (processAll || !hasGlyph(charSequence, start, currentOffset, sm.getFlushMetadata())) {
                        keepProcessing = emojiProcessCallback.handleEmoji(charSequence, start, currentOffset, sm.getFlushMetadata());
                        addedCount++;
                    }
                    start = currentOffset;
                    break;
            }
        }
        if (sm.isInFlushableState() && addedCount < maxEmojiCount && keepProcessing && (processAll || !hasGlyph(charSequence, start, currentOffset, sm.getCurrentMetadata()))) {
            emojiProcessCallback.handleEmoji(charSequence, start, currentOffset, sm.getCurrentMetadata());
            int addedCount2 = addedCount + 1;
        }
        return emojiProcessCallback.getResult();
    }

    static boolean handleOnKeyDown(Editable editable, int keyCode, KeyEvent event) {
        boolean handled;
        switch (keyCode) {
            case 67:
                handled = delete(editable, event, false);
                break;
            case 112:
                handled = delete(editable, event, true);
                break;
            default:
                handled = false;
                break;
        }
        if (!handled) {
            return false;
        }
        MetaKeyKeyListener.adjustMetaAfterKeypress(editable);
        return true;
    }

    private static boolean delete(Editable content, KeyEvent event, boolean forwardDelete) {
        EmojiSpan[] spans;
        if (hasModifiers(event)) {
            return false;
        }
        int start = Selection.getSelectionStart(content);
        int end = Selection.getSelectionEnd(content);
        if (!hasInvalidSelection(start, end) && (spans = (EmojiSpan[]) content.getSpans(start, end, EmojiSpan.class)) != null && spans.length > 0) {
            int length = spans.length;
            int index = 0;
            while (index < length) {
                EmojiSpan span = spans[index];
                int spanStart = content.getSpanStart(span);
                int spanEnd = content.getSpanEnd(span);
                if ((!forwardDelete || spanStart != start) && ((forwardDelete || spanEnd != start) && (start <= spanStart || start >= spanEnd))) {
                    index++;
                } else {
                    content.delete(spanStart, spanEnd);
                    return true;
                }
            }
        }
        return false;
    }

    static boolean handleDeleteSurroundingText(InputConnection inputConnection, Editable editable, int beforeLength, int afterLength, boolean inCodePoints) {
        int end;
        int start;
        if (editable == null || inputConnection == null || beforeLength < 0 || afterLength < 0) {
            return false;
        }
        int selectionStart = Selection.getSelectionStart(editable);
        int selectionEnd = Selection.getSelectionEnd(editable);
        if (hasInvalidSelection(selectionStart, selectionEnd)) {
            return false;
        }
        if (inCodePoints) {
            start = CodepointIndexFinder.findIndexBackward(editable, selectionStart, Math.max(beforeLength, 0));
            end = CodepointIndexFinder.findIndexForward(editable, selectionEnd, Math.max(afterLength, 0));
            if (start == -1 || end == -1) {
                return false;
            }
        } else {
            start = Math.max(selectionStart - beforeLength, 0);
            end = Math.min(selectionEnd + afterLength, editable.length());
        }
        EmojiSpan[] spans = (EmojiSpan[]) editable.getSpans(start, end, EmojiSpan.class);
        if (spans == null || spans.length <= 0) {
            return false;
        }
        for (EmojiSpan span : spans) {
            int spanStart = editable.getSpanStart(span);
            int spanEnd = editable.getSpanEnd(span);
            start = Math.min(spanStart, start);
            end = Math.max(spanEnd, end);
        }
        int start2 = Math.max(start, 0);
        int end2 = Math.min(end, editable.length());
        inputConnection.beginBatchEdit();
        editable.delete(start2, end2);
        inputConnection.endBatchEdit();
        return true;
    }

    private static boolean hasInvalidSelection(int start, int end) {
        return start == -1 || end == -1 || start != end;
    }

    private static boolean hasModifiers(KeyEvent event) {
        return !KeyEvent.metaStateHasNoModifiers(event.getMetaState());
    }

    private boolean hasGlyph(CharSequence charSequence, int start, int end, TypefaceEmojiRasterizer rasterizer) {
        if (rasterizer.getHasGlyph() == 0) {
            rasterizer.setHasGlyph(this.mGlyphChecker.hasGlyph(charSequence, start, end, rasterizer.getSdkAdded()));
        }
        return rasterizer.getHasGlyph() == 2;
    }

    static final class ProcessorSm {
        private static final int STATE_DEFAULT = 1;
        private static final int STATE_WALKING = 2;
        private int mCurrentDepth;
        private MetadataRepo.Node mCurrentNode;
        private final int[] mEmojiAsDefaultStyleExceptions;
        private MetadataRepo.Node mFlushNode;
        private int mLastCodepoint;
        private final MetadataRepo.Node mRootNode;
        private int mState = 1;
        private final boolean mUseEmojiAsDefaultStyle;

        ProcessorSm(MetadataRepo.Node rootNode, boolean useEmojiAsDefaultStyle, int[] emojiAsDefaultStyleExceptions) {
            this.mRootNode = rootNode;
            this.mCurrentNode = rootNode;
            this.mUseEmojiAsDefaultStyle = useEmojiAsDefaultStyle;
            this.mEmojiAsDefaultStyleExceptions = emojiAsDefaultStyleExceptions;
        }

        /* access modifiers changed from: package-private */
        public int check(int codePoint) {
            int action;
            MetadataRepo.Node node = this.mCurrentNode.get(codePoint);
            switch (this.mState) {
                case 2:
                    if (node == null) {
                        if (isTextStyle(codePoint) == 0) {
                            if (isEmojiStyle(codePoint) == 0) {
                                if (this.mCurrentNode.getData() != null) {
                                    if (this.mCurrentDepth == 1) {
                                        if (!shouldUseEmojiPresentationStyleForSingleCodepoint()) {
                                            action = reset();
                                            break;
                                        } else {
                                            this.mFlushNode = this.mCurrentNode;
                                            action = 3;
                                            reset();
                                            break;
                                        }
                                    } else {
                                        this.mFlushNode = this.mCurrentNode;
                                        action = 3;
                                        reset();
                                        break;
                                    }
                                } else {
                                    action = reset();
                                    break;
                                }
                            } else {
                                action = 2;
                                break;
                            }
                        } else {
                            action = reset();
                            break;
                        }
                    } else {
                        this.mCurrentNode = node;
                        this.mCurrentDepth++;
                        action = 2;
                        break;
                    }
                default:
                    if (node != null) {
                        this.mState = 2;
                        this.mCurrentNode = node;
                        this.mCurrentDepth = 1;
                        action = 2;
                        break;
                    } else {
                        action = reset();
                        break;
                    }
            }
            this.mLastCodepoint = codePoint;
            return action;
        }

        private int reset() {
            this.mState = 1;
            this.mCurrentNode = this.mRootNode;
            this.mCurrentDepth = 0;
            return 1;
        }

        /* access modifiers changed from: package-private */
        public TypefaceEmojiRasterizer getFlushMetadata() {
            return this.mFlushNode.getData();
        }

        /* access modifiers changed from: package-private */
        public TypefaceEmojiRasterizer getCurrentMetadata() {
            return this.mCurrentNode.getData();
        }

        /* access modifiers changed from: package-private */
        public boolean isInFlushableState() {
            if (this.mState != 2 || this.mCurrentNode.getData() == null || (this.mCurrentDepth <= 1 && !shouldUseEmojiPresentationStyleForSingleCodepoint())) {
                return false;
            }
            return true;
        }

        private boolean shouldUseEmojiPresentationStyleForSingleCodepoint() {
            if (this.mCurrentNode.getData().isDefaultEmoji() || isEmojiStyle(this.mLastCodepoint)) {
                return true;
            }
            if (this.mUseEmojiAsDefaultStyle) {
                if (this.mEmojiAsDefaultStyleExceptions == null) {
                    return true;
                }
                if (Arrays.binarySearch(this.mEmojiAsDefaultStyleExceptions, this.mCurrentNode.getData().getCodepointAt(0)) < 0) {
                    return true;
                }
            }
            return false;
        }

        private static boolean isEmojiStyle(int codePoint) {
            return codePoint == 65039;
        }

        private static boolean isTextStyle(int codePoint) {
            return codePoint == 65038;
        }
    }

    private static final class CodepointIndexFinder {
        private static final int INVALID_INDEX = -1;

        private CodepointIndexFinder() {
        }

        static int findIndexBackward(CharSequence cs, int from, int numCodePoints) {
            int currentIndex = from;
            boolean waitingHighSurrogate = false;
            int length = cs.length();
            if (currentIndex < 0 || length < currentIndex || numCodePoints < 0) {
                return -1;
            }
            int remainingCodePoints = numCodePoints;
            while (remainingCodePoints != 0) {
                currentIndex--;
                if (currentIndex >= 0) {
                    char c = cs.charAt(currentIndex);
                    if (waitingHighSurrogate) {
                        if (!Character.isHighSurrogate(c)) {
                            return -1;
                        }
                        waitingHighSurrogate = false;
                        remainingCodePoints--;
                    } else if (!Character.isSurrogate(c)) {
                        remainingCodePoints--;
                    } else if (Character.isHighSurrogate(c)) {
                        return -1;
                    } else {
                        waitingHighSurrogate = true;
                    }
                } else if (waitingHighSurrogate) {
                    return -1;
                } else {
                    return 0;
                }
            }
            return currentIndex;
        }

        static int findIndexForward(CharSequence cs, int from, int numCodePoints) {
            int currentIndex = from;
            boolean waitingLowSurrogate = false;
            int length = cs.length();
            if (currentIndex < 0 || length < currentIndex || numCodePoints < 0) {
                return -1;
            }
            int remainingCodePoints = numCodePoints;
            while (remainingCodePoints != 0) {
                if (currentIndex < length) {
                    char c = cs.charAt(currentIndex);
                    if (waitingLowSurrogate) {
                        if (!Character.isLowSurrogate(c)) {
                            return -1;
                        }
                        remainingCodePoints--;
                        waitingLowSurrogate = false;
                        currentIndex++;
                    } else if (!Character.isSurrogate(c)) {
                        remainingCodePoints--;
                        currentIndex++;
                    } else if (Character.isLowSurrogate(c)) {
                        return -1;
                    } else {
                        waitingLowSurrogate = true;
                        currentIndex++;
                    }
                } else if (waitingLowSurrogate) {
                    return -1;
                } else {
                    return length;
                }
            }
            return currentIndex;
        }
    }

    private static class EmojiProcessAddSpanCallback implements EmojiProcessCallback<UnprecomputeTextOnModificationSpannable> {
        private final EmojiCompat.SpanFactory mSpanFactory;
        public UnprecomputeTextOnModificationSpannable spannable;

        EmojiProcessAddSpanCallback(UnprecomputeTextOnModificationSpannable spannable2, EmojiCompat.SpanFactory spanFactory) {
            this.spannable = spannable2;
            this.mSpanFactory = spanFactory;
        }

        public boolean handleEmoji(CharSequence charSequence, int start, int end, TypefaceEmojiRasterizer metadata) {
            Spannable spannable2;
            if (metadata.isPreferredSystemRender()) {
                return true;
            }
            if (this.spannable == null) {
                if (charSequence instanceof Spannable) {
                    spannable2 = (Spannable) charSequence;
                } else {
                    spannable2 = new SpannableString(charSequence);
                }
                this.spannable = new UnprecomputeTextOnModificationSpannable(spannable2);
            }
            this.spannable.setSpan(this.mSpanFactory.createSpan(metadata), start, end, 33);
            return true;
        }

        public UnprecomputeTextOnModificationSpannable getResult() {
            return this.spannable;
        }
    }

    private static class EmojiProcessLookupCallback implements EmojiProcessCallback<EmojiProcessLookupCallback> {
        public int end = -1;
        private final int mOffset;
        public int start = -1;

        EmojiProcessLookupCallback(int offset) {
            this.mOffset = offset;
        }

        public boolean handleEmoji(CharSequence charSequence, int start2, int end2, TypefaceEmojiRasterizer metadata) {
            if (start2 <= this.mOffset && this.mOffset < end2) {
                this.start = start2;
                this.end = end2;
                return false;
            } else if (end2 <= this.mOffset) {
                return true;
            } else {
                return false;
            }
        }

        public EmojiProcessLookupCallback getResult() {
            return this;
        }
    }

    private static class MarkExclusionCallback implements EmojiProcessCallback<MarkExclusionCallback> {
        private final String mExclusion;

        MarkExclusionCallback(String emoji) {
            this.mExclusion = emoji;
        }

        public boolean handleEmoji(CharSequence charSequence, int start, int end, TypefaceEmojiRasterizer metadata) {
            if (!TextUtils.equals(charSequence.subSequence(start, end), this.mExclusion)) {
                return true;
            }
            metadata.setExclusion(true);
            return false;
        }

        public MarkExclusionCallback getResult() {
            return this;
        }
    }
}
