package androidx.core.graphics;

import android.content.ContentResolver;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Typeface;
import android.graphics.fonts.Font;
import android.graphics.fonts.FontFamily;
import android.graphics.fonts.FontStyle;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.text.TextUtils;
import android.util.Log;
import androidx.core.content.res.FontResourcesParserCompat;
import androidx.core.provider.FontsContractCompat;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class TypefaceCompatApi29Impl extends TypefaceCompatBaseImpl {
    private static final String TAG = "TypefaceCompatApi29Impl";

    private static int getMatchScore(FontStyle o1, FontStyle o2) {
        return (Math.abs(o1.getWeight() - o2.getWeight()) / 100) + (o1.getSlant() == o2.getSlant() ? 0 : 2);
    }

    private Font findBaseFont(FontFamily family, int style) {
        int i;
        int i2;
        if ((style & 1) != 0) {
            i = 700;
        } else {
            i = 400;
        }
        if ((style & 2) != 0) {
            i2 = 1;
        } else {
            i2 = 0;
        }
        FontStyle desiredStyle = new FontStyle(i, i2);
        Font bestFont = family.getFont(0);
        int bestScore = getMatchScore(desiredStyle, bestFont.getStyle());
        for (int i3 = 1; i3 < family.getSize(); i3++) {
            Font candidate = family.getFont(i3);
            int score = getMatchScore(desiredStyle, candidate.getStyle());
            if (score < bestScore) {
                bestFont = candidate;
                bestScore = score;
            }
        }
        return bestFont;
    }

    /* access modifiers changed from: protected */
    public FontsContractCompat.FontInfo findBestInfo(FontsContractCompat.FontInfo[] fonts, int style) {
        throw new RuntimeException("Do not use this function in API 29 or later.");
    }

    /* access modifiers changed from: protected */
    public Typeface createFromInputStream(Context context, InputStream is) {
        throw new RuntimeException("Do not use this function in API 29 or later.");
    }

    public Typeface createFromFontInfo(Context context, CancellationSignal cancellationSignal, FontsContractCompat.FontInfo[] fonts, int style) {
        try {
            FontFamily family = getFontFamily(cancellationSignal, fonts, context.getContentResolver());
            if (family == null) {
                return null;
            }
            return new Typeface.CustomFallbackBuilder(family).setStyle(findBaseFont(family, style).getStyle()).build();
        } catch (Exception e) {
            Log.w(TAG, "Font load failed", e);
            return null;
        }
    }

    /* access modifiers changed from: protected */
    public Font getFontFromSystemFont(FontsContractCompat.FontInfo font) {
        throw new UnsupportedOperationException("Getting font from Typeface is not supported before API31");
    }

    private Font getFontFromProvider(CancellationSignal cancellationSignal, FontsContractCompat.FontInfo font, ContentResolver resolver) {
        ParcelFileDescriptor pfd;
        int i;
        try {
            pfd = resolver.openFileDescriptor(font.getUri(), "r", cancellationSignal);
            if (pfd == null) {
                if (pfd != null) {
                    pfd.close();
                }
                return null;
            }
            Font.Builder weight = new Font.Builder(pfd).setWeight(font.getWeight());
            if (font.isItalic()) {
                i = 1;
            } else {
                i = 0;
            }
            Font.Builder builder = weight.setSlant(i).setTtcIndex(font.getTtcIndex());
            if (!TextUtils.isEmpty(font.getVariationSettings())) {
                builder.setFontVariationSettings(font.getVariationSettings());
            }
            Font build = builder.build();
            if (pfd != null) {
                pfd.close();
            }
            return build;
        } catch (IOException e) {
            Log.w(TAG, "Font load failed", e);
            return null;
        } catch (Throwable th) {
            th.addSuppressed(th);
        }
        throw th;
    }

    private Font getFont(CancellationSignal cancellationSignal, FontsContractCompat.FontInfo font, ContentResolver resolver) {
        if (font.isSystemFont()) {
            return getFontFromSystemFont(font);
        }
        return getFontFromProvider(cancellationSignal, font, resolver);
    }

    /* access modifiers changed from: protected */
    public FontFamily getFontFamily(CancellationSignal cancellationSignal, FontsContractCompat.FontInfo[] fonts, ContentResolver resolver) {
        FontFamily.Builder familyBuilder = null;
        for (FontsContractCompat.FontInfo font : fonts) {
            Font platformFont = getFont(cancellationSignal, font, resolver);
            if (platformFont != null) {
                if (familyBuilder == null) {
                    familyBuilder = new FontFamily.Builder(platformFont);
                } else {
                    familyBuilder.addFont(platformFont);
                }
            }
        }
        if (familyBuilder == null) {
            return null;
        }
        return familyBuilder.build();
    }

    public Typeface createFromFontInfoWithFallback(Context context, CancellationSignal cancellationSignal, List<FontsContractCompat.FontInfo[]> fonts, int style) {
        ContentResolver resolver = context.getContentResolver();
        try {
            FontFamily family = getFontFamily(cancellationSignal, fonts.get(0), resolver);
            if (family == null) {
                return null;
            }
            Typeface.CustomFallbackBuilder builder = new Typeface.CustomFallbackBuilder(family);
            for (int i = 1; i < fonts.size(); i++) {
                FontFamily fallbackFamily = getFontFamily(cancellationSignal, fonts.get(i), resolver);
                if (fallbackFamily != null) {
                    builder.addCustomFallback(fallbackFamily);
                }
            }
            return builder.setStyle(findBaseFont(family, style).getStyle()).build();
        } catch (Exception e) {
            Log.w(TAG, "Font load failed", e);
            return null;
        }
    }

    public Typeface createFromFontFamilyFilesResourceEntry(Context context, FontResourcesParserCompat.FontFamilyFilesResourceEntry familyEntry, Resources resources, int style) {
        int i;
        FontFamily.Builder familyBuilder = null;
        try {
            for (FontResourcesParserCompat.FontFileResourceEntry entry : familyEntry.getEntries()) {
                try {
                    Font.Builder weight = new Font.Builder(resources, entry.getResourceId()).setWeight(entry.getWeight());
                    if (entry.isItalic()) {
                        i = 1;
                    } else {
                        i = 0;
                    }
                    Font platformFont = weight.setSlant(i).setTtcIndex(entry.getTtcIndex()).setFontVariationSettings(entry.getVariationSettings()).build();
                    if (familyBuilder == null) {
                        familyBuilder = new FontFamily.Builder(platformFont);
                    } else {
                        familyBuilder.addFont(platformFont);
                    }
                } catch (IOException e) {
                }
            }
            if (familyBuilder == null) {
                return null;
            }
            FontFamily family = familyBuilder.build();
            return new Typeface.CustomFallbackBuilder(family).setStyle(findBaseFont(family, style).getStyle()).build();
        } catch (Exception e2) {
            Log.w(TAG, "Font load failed", e2);
            return null;
        }
    }

    public Typeface createFromResourcesFontFile(Context context, Resources resources, int id, String path, int style) {
        try {
            Font font = new Font.Builder(resources, id).build();
            return new Typeface.CustomFallbackBuilder(new FontFamily.Builder(font).build()).setStyle(font.getStyle()).build();
        } catch (Exception e) {
            Log.w(TAG, "Font load failed", e);
            return null;
        }
    }

    /* access modifiers changed from: package-private */
    public Typeface createWeightStyle(Context context, Typeface base, int weight, boolean italic) {
        return Typeface.create(base, weight, italic);
    }
}
