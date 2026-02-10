package androidx.emoji2.text;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.text.Spanned;
import android.text.TextPaint;
import android.text.style.CharacterStyle;

public final class TypefaceEmojiSpan extends EmojiSpan {
    private static Paint sDebugPaint;
    private TextPaint mWorkingPaint;

    public TypefaceEmojiSpan(TypefaceEmojiRasterizer metadata) {
        super(metadata);
    }

    public void draw(Canvas canvas, CharSequence text, int start, int end, float x, int top, int y, int bottom, Paint paint) {
        TextPaint textPaint;
        int i = top;
        int i2 = bottom;
        Paint paint2 = paint;
        TextPaint textPaint2 = applyCharacterSpanStyles(text, start, end, paint2);
        if (textPaint2 == null || textPaint2.bgColor == 0) {
            textPaint = textPaint2;
        } else {
            drawBackground(canvas, textPaint2, x, x + ((float) getWidth()), (float) i, (float) i2);
            textPaint = textPaint2;
        }
        if (EmojiCompat.get().isEmojiSpanIndicatorEnabled()) {
            canvas.drawRect(x, (float) i, x + ((float) getWidth()), (float) i2, getDebugPaint());
        } else {
            float f = x;
        }
        getTypefaceRasterizer().draw(canvas, x, (float) y, textPaint != null ? textPaint : paint2);
    }

    /* access modifiers changed from: package-private */
    public void drawBackground(Canvas c, TextPaint textPaint, float leftX, float rightX, float top, float bottom) {
        int previousColor = textPaint.getColor();
        Paint.Style previousStyle = textPaint.getStyle();
        textPaint.setColor(textPaint.bgColor);
        textPaint.setStyle(Paint.Style.FILL);
        float top2 = bottom;
        TextPaint textPaint2 = textPaint;
        c.drawRect(leftX, top, rightX, top2, textPaint2);
        textPaint2.setStyle(previousStyle);
        textPaint2.setColor(previousColor);
    }

    private TextPaint applyCharacterSpanStyles(CharSequence text, int start, int end, Paint paint) {
        if (text instanceof Spanned) {
            CharacterStyle[] spans = (CharacterStyle[]) ((Spanned) text).getSpans(start, end, CharacterStyle.class);
            if (spans.length != 0 && (spans.length != 1 || spans[0] != this)) {
                TextPaint wp = this.mWorkingPaint;
                if (wp == null) {
                    wp = new TextPaint();
                    this.mWorkingPaint = wp;
                }
                wp.set(paint);
                for (CharacterStyle updateDrawState : spans) {
                    updateDrawState.updateDrawState(wp);
                }
                return wp;
            } else if (paint instanceof TextPaint) {
                return (TextPaint) paint;
            } else {
                return null;
            }
        } else if (paint instanceof TextPaint) {
            return (TextPaint) paint;
        } else {
            return null;
        }
    }

    private static Paint getDebugPaint() {
        if (sDebugPaint == null) {
            sDebugPaint = new TextPaint();
            sDebugPaint.setColor(EmojiCompat.get().getEmojiSpanIndicatorColor());
            sDebugPaint.setStyle(Paint.Style.FILL);
        }
        return sDebugPaint;
    }
}
