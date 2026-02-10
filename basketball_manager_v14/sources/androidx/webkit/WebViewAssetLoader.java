package androidx.webkit;

import android.content.Context;
import android.content.res.Resources;
import android.net.Uri;
import android.util.Log;
import android.webkit.WebResourceResponse;
import androidx.core.util.Pair;
import androidx.webkit.internal.AssetHelper;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public final class WebViewAssetLoader {
    public static final String DEFAULT_DOMAIN = "appassets.androidplatform.net";
    private static final String TAG = "WebViewAssetLoader";
    private final List<PathMatcher> mMatchers;

    public interface PathHandler {
        WebResourceResponse handle(String str);
    }

    public static final class AssetsPathHandler implements PathHandler {
        private final AssetHelper mAssetHelper;

        public AssetsPathHandler(Context context) {
            this.mAssetHelper = new AssetHelper(context);
        }

        AssetsPathHandler(AssetHelper assetHelper) {
            this.mAssetHelper = assetHelper;
        }

        public WebResourceResponse handle(String path) {
            try {
                return new WebResourceResponse(AssetHelper.guessMimeType(path), (String) null, this.mAssetHelper.openAsset(path));
            } catch (IOException e) {
                Log.e(WebViewAssetLoader.TAG, "Error opening asset path: " + path, e);
                return new WebResourceResponse((String) null, (String) null, (InputStream) null);
            }
        }
    }

    public static final class ResourcesPathHandler implements PathHandler {
        private final AssetHelper mAssetHelper;

        public ResourcesPathHandler(Context context) {
            this.mAssetHelper = new AssetHelper(context);
        }

        ResourcesPathHandler(AssetHelper assetHelper) {
            this.mAssetHelper = assetHelper;
        }

        public WebResourceResponse handle(String path) {
            try {
                return new WebResourceResponse(AssetHelper.guessMimeType(path), (String) null, this.mAssetHelper.openResource(path));
            } catch (Resources.NotFoundException e) {
                Log.e(WebViewAssetLoader.TAG, "Resource not found from the path: " + path, e);
                return new WebResourceResponse((String) null, (String) null, (InputStream) null);
            } catch (IOException e2) {
                Log.e(WebViewAssetLoader.TAG, "Error opening resource from the path: " + path, e2);
                return new WebResourceResponse((String) null, (String) null, (InputStream) null);
            }
        }
    }

    public static final class InternalStoragePathHandler implements PathHandler {
        private static final String[] FORBIDDEN_DATA_DIRS = {"app_webview/", "databases/", "lib/", "shared_prefs/", "code_cache/"};
        private final File mDirectory;

        public InternalStoragePathHandler(Context context, File directory) {
            try {
                this.mDirectory = new File(AssetHelper.getCanonicalDirPath(directory));
                if (!isAllowedInternalStorageDir(context)) {
                    throw new IllegalArgumentException("The given directory \"" + directory + "\" doesn't exist under an allowed app internal storage directory");
                }
            } catch (IOException e) {
                throw new IllegalArgumentException("Failed to resolve the canonical path for the given directory: " + directory.getPath(), e);
            }
        }

        private boolean isAllowedInternalStorageDir(Context context) throws IOException {
            String dir = AssetHelper.getCanonicalDirPath(this.mDirectory);
            String cacheDir = AssetHelper.getCanonicalDirPath(context.getCacheDir());
            String dataDir = AssetHelper.getCanonicalDirPath(AssetHelper.getDataDir(context));
            if ((!dir.startsWith(cacheDir) && !dir.startsWith(dataDir)) || dir.equals(cacheDir) || dir.equals(dataDir)) {
                return false;
            }
            String[] strArr = FORBIDDEN_DATA_DIRS;
            int length = strArr.length;
            for (int i = 0; i < length; i++) {
                if (dir.startsWith(dataDir + strArr[i])) {
                    return false;
                }
            }
            return true;
        }

        public WebResourceResponse handle(String path) {
            try {
                File file = AssetHelper.getCanonicalFileIfChild(this.mDirectory, path);
                if (file != null) {
                    return new WebResourceResponse(AssetHelper.guessMimeType(path), (String) null, AssetHelper.openFile(file));
                }
                Log.e(WebViewAssetLoader.TAG, String.format("The requested file: %s is outside the mounted directory: %s", new Object[]{path, this.mDirectory}));
                return new WebResourceResponse((String) null, (String) null, (InputStream) null);
            } catch (IOException e) {
                Log.e(WebViewAssetLoader.TAG, "Error opening the requested path: " + path, e);
            }
        }
    }

    static class PathMatcher {
        static final String HTTPS_SCHEME = "https";
        static final String HTTP_SCHEME = "http";
        final String mAuthority;
        final PathHandler mHandler;
        final boolean mHttpEnabled;
        final String mPath;

        PathMatcher(String authority, String path, boolean httpEnabled, PathHandler handler) {
            if (path.isEmpty() || path.charAt(0) != '/') {
                throw new IllegalArgumentException("Path should start with a slash '/'.");
            } else if (path.endsWith("/")) {
                this.mAuthority = authority;
                this.mPath = path;
                this.mHttpEnabled = httpEnabled;
                this.mHandler = handler;
            } else {
                throw new IllegalArgumentException("Path should end with a slash '/'");
            }
        }

        public PathHandler match(Uri uri) {
            if (uri.getScheme().equals("http") && !this.mHttpEnabled) {
                return null;
            }
            if ((uri.getScheme().equals("http") || uri.getScheme().equals("https")) && uri.getAuthority().equals(this.mAuthority) && uri.getPath().startsWith(this.mPath)) {
                return this.mHandler;
            }
            return null;
        }

        public String getSuffixPath(String path) {
            return path.replaceFirst(this.mPath, "");
        }
    }

    public static final class Builder {
        private String mDomain = WebViewAssetLoader.DEFAULT_DOMAIN;
        private final List<Pair<String, PathHandler>> mHandlerList = new ArrayList();
        private boolean mHttpAllowed;

        public Builder setDomain(String domain) {
            this.mDomain = domain;
            return this;
        }

        public Builder setHttpAllowed(boolean httpAllowed) {
            this.mHttpAllowed = httpAllowed;
            return this;
        }

        public Builder addPathHandler(String path, PathHandler handler) {
            this.mHandlerList.add(Pair.create(path, handler));
            return this;
        }

        public WebViewAssetLoader build() {
            List<PathMatcher> pathMatcherList = new ArrayList<>();
            for (Pair<String, PathHandler> pair : this.mHandlerList) {
                pathMatcherList.add(new PathMatcher(this.mDomain, (String) pair.first, this.mHttpAllowed, (PathHandler) pair.second));
            }
            return new WebViewAssetLoader(pathMatcherList);
        }
    }

    WebViewAssetLoader(List<PathMatcher> pathMatchers) {
        this.mMatchers = pathMatchers;
    }

    public WebResourceResponse shouldInterceptRequest(Uri url) {
        WebResourceResponse response;
        for (PathMatcher matcher : this.mMatchers) {
            PathHandler handler = matcher.match(url);
            if (handler != null && (response = handler.handle(matcher.getSuffixPath(url.getPath()))) != null) {
                return response;
            }
        }
        return null;
    }
}
