package androidx.webkit.internal;

import android.content.Context;
import android.content.res.Resources;
import android.util.TypedValue;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.zip.GZIPInputStream;

public class AssetHelper {
    public static final String DEFAULT_MIME_TYPE = "text/plain";
    private final Context mContext;

    public AssetHelper(Context context) {
        this.mContext = context;
    }

    private static InputStream handleSvgzStream(String path, InputStream stream) throws IOException {
        return path.endsWith(".svgz") ? new GZIPInputStream(stream) : stream;
    }

    private static String removeLeadingSlash(String path) {
        if (path.length() <= 1 || path.charAt(0) != '/') {
            return path;
        }
        return path.substring(1);
    }

    private int getFieldId(String resourceType, String resourceName) {
        return this.mContext.getResources().getIdentifier(resourceName, resourceType, this.mContext.getPackageName());
    }

    private int getValueType(int fieldId) {
        TypedValue value = new TypedValue();
        this.mContext.getResources().getValue(fieldId, value, true);
        return value.type;
    }

    public InputStream openResource(String path) throws Resources.NotFoundException, IOException {
        String path2 = removeLeadingSlash(path);
        String[] pathSegments = path2.split("/", -1);
        if (pathSegments.length == 2) {
            String resourceType = pathSegments[0];
            String resourceName = pathSegments[1];
            int dotIndex = resourceName.lastIndexOf(46);
            if (dotIndex != -1) {
                resourceName = resourceName.substring(0, dotIndex);
            }
            int fieldId = getFieldId(resourceType, resourceName);
            int valueType = getValueType(fieldId);
            if (valueType == 3) {
                return handleSvgzStream(path2, this.mContext.getResources().openRawResource(fieldId));
            }
            throw new IOException(String.format("Expected %s resource to be of TYPE_STRING but was %d", new Object[]{path2, Integer.valueOf(valueType)}));
        }
        throw new IllegalArgumentException("Incorrect resource path: " + path2);
    }

    public InputStream openAsset(String path) throws IOException {
        String path2 = removeLeadingSlash(path);
        return handleSvgzStream(path2, this.mContext.getAssets().open(path2, 2));
    }

    public static InputStream openFile(File file) throws FileNotFoundException, IOException {
        return handleSvgzStream(file.getPath(), new FileInputStream(file));
    }

    public static File getCanonicalFileIfChild(File parent, String child) throws IOException {
        String parentCanonicalPath = getCanonicalDirPath(parent);
        String childCanonicalPath = new File(parent, child).getCanonicalPath();
        if (childCanonicalPath.startsWith(parentCanonicalPath)) {
            return new File(childCanonicalPath);
        }
        return null;
    }

    public static String getCanonicalDirPath(File file) throws IOException {
        String canonicalPath = file.getCanonicalPath();
        if (!canonicalPath.endsWith("/")) {
            return canonicalPath + "/";
        }
        return canonicalPath;
    }

    public static File getDataDir(Context context) {
        return ApiHelperForN.getDataDir(context);
    }

    public static String guessMimeType(String filePath) {
        String mimeType = MimeUtil.getMimeFromFileName(filePath);
        return mimeType == null ? DEFAULT_MIME_TYPE : mimeType;
    }
}
