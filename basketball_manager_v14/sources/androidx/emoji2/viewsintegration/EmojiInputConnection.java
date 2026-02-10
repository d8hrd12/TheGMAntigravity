package androidx.emoji2.viewsintegration;

import android.text.Editable;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.view.inputmethod.InputConnectionWrapper;
import android.widget.TextView;
import androidx.emoji2.text.EmojiCompat;

final class EmojiInputConnection extends InputConnectionWrapper {
    private final EmojiCompatDeleteHelper mEmojiCompatDeleteHelper;
    private final TextView mTextView;

    EmojiInputConnection(TextView textView, InputConnection inputConnection, EditorInfo outAttrs) {
        this(textView, inputConnection, outAttrs, new EmojiCompatDeleteHelper());
    }

    EmojiInputConnection(TextView textView, InputConnection inputConnection, EditorInfo outAttrs, EmojiCompatDeleteHelper emojiCompatDeleteHelper) {
        super(inputConnection, false);
        this.mTextView = textView;
        this.mEmojiCompatDeleteHelper = emojiCompatDeleteHelper;
        this.mEmojiCompatDeleteHelper.updateEditorInfoAttrs(outAttrs);
    }

    public boolean deleteSurroundingText(int beforeLength, int afterLength) {
        int beforeLength2 = beforeLength;
        int afterLength2 = afterLength;
        return this.mEmojiCompatDeleteHelper.handleDeleteSurroundingText(this, getEditable(), beforeLength2, afterLength2, false) != 0 || super.deleteSurroundingText(beforeLength2, afterLength2);
    }

    public boolean deleteSurroundingTextInCodePoints(int beforeLength, int afterLength) {
        int beforeLength2 = beforeLength;
        int afterLength2 = afterLength;
        return this.mEmojiCompatDeleteHelper.handleDeleteSurroundingText(this, getEditable(), beforeLength2, afterLength2, true) != 0 || super.deleteSurroundingTextInCodePoints(beforeLength2, afterLength2);
    }

    private Editable getEditable() {
        return this.mTextView.getEditableText();
    }

    public static class EmojiCompatDeleteHelper {
        public boolean handleDeleteSurroundingText(InputConnection inputConnection, Editable editable, int beforeLength, int afterLength, boolean inCodePoints) {
            return EmojiCompat.handleDeleteSurroundingText(inputConnection, editable, beforeLength, afterLength, inCodePoints);
        }

        public void updateEditorInfoAttrs(EditorInfo outAttrs) {
            if (EmojiCompat.isConfigured()) {
                EmojiCompat.get().updateEditorInfo(outAttrs);
            }
        }
    }
}
