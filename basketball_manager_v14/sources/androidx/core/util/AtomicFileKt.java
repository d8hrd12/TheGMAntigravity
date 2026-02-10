package androidx.core.util;

import android.util.AtomicFile;
import java.io.FileOutputStream;
import java.nio.charset.Charset;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.internal.Intrinsics;
import kotlin.text.Charsets;

@Metadata(d1 = {"\u00002\n\u0000\n\u0002\u0010\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010\u0012\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\u001a0\u0010\u0000\u001a\u00020\u0001*\u00020\u00022!\u0010\u0003\u001a\u001d\u0012\u0013\u0012\u00110\u0005¢\u0006\f\b\u0006\u0012\b\b\u0007\u0012\u0004\b\b(\b\u0012\u0004\u0012\u00020\u00010\u0004H\b\u001a\u0012\u0010\t\u001a\u00020\u0001*\u00020\u00022\u0006\u0010\n\u001a\u00020\u000b\u001a\u001c\u0010\f\u001a\u00020\u0001*\u00020\u00022\u0006\u0010\r\u001a\u00020\u000e2\b\b\u0002\u0010\u000f\u001a\u00020\u0010\u001a\r\u0010\u0011\u001a\u00020\u000b*\u00020\u0002H\b\u001a\u0014\u0010\u0012\u001a\u00020\u000e*\u00020\u00022\b\b\u0002\u0010\u000f\u001a\u00020\u0010¨\u0006\u0013"}, d2 = {"tryWrite", "", "Landroid/util/AtomicFile;", "block", "Lkotlin/Function1;", "Ljava/io/FileOutputStream;", "Lkotlin/ParameterName;", "name", "out", "writeBytes", "array", "", "writeText", "text", "", "charset", "Ljava/nio/charset/Charset;", "readBytes", "readText", "core-ktx_release"}, k = 2, mv = {2, 0, 0}, xi = 48)
/* compiled from: AtomicFile.kt */
public final class AtomicFileKt {
    public static final void tryWrite(AtomicFile $this$tryWrite, Function1<? super FileOutputStream, Unit> block) {
        FileOutputStream stream = $this$tryWrite.startWrite();
        try {
            block.invoke(stream);
            $this$tryWrite.finishWrite(stream);
        } catch (Throwable th) {
            $this$tryWrite.failWrite(stream);
            throw th;
        }
    }

    public static final void writeBytes(AtomicFile $this$writeBytes, byte[] array) {
        AtomicFile $this$tryWrite$iv = $this$writeBytes;
        FileOutputStream stream$iv = $this$tryWrite$iv.startWrite();
        try {
            stream$iv.write(array);
            $this$tryWrite$iv.finishWrite(stream$iv);
        } catch (Throwable th) {
            $this$tryWrite$iv.failWrite(stream$iv);
            throw th;
        }
    }

    public static /* synthetic */ void writeText$default(AtomicFile atomicFile, String str, Charset charset, int i, Object obj) {
        if ((i & 2) != 0) {
            charset = Charsets.UTF_8;
        }
        writeText(atomicFile, str, charset);
    }

    public static final void writeText(AtomicFile $this$writeText, String text, Charset charset) {
        byte[] bytes = text.getBytes(charset);
        Intrinsics.checkNotNullExpressionValue(bytes, "getBytes(...)");
        writeBytes($this$writeText, bytes);
    }

    public static final byte[] readBytes(AtomicFile $this$readBytes) {
        return $this$readBytes.readFully();
    }

    public static /* synthetic */ String readText$default(AtomicFile atomicFile, Charset charset, int i, Object obj) {
        if ((i & 1) != 0) {
            charset = Charsets.UTF_8;
        }
        return readText(atomicFile, charset);
    }

    public static final String readText(AtomicFile $this$readText, Charset charset) {
        return new String($this$readText.readFully(), charset);
    }
}
