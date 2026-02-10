package org.apache.cordova.engine;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.view.View;
import android.webkit.GeolocationPermissions;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebStorage;
import android.webkit.WebView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import org.apache.cordova.CordovaDialogsHelper;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.LOG;

public class SystemWebChromeClient extends WebChromeClient {
    private static final int FILECHOOSER_RESULTCODE = 5173;
    private static final String LOG_TAG = "SystemWebChromeClient";
    private long MAX_QUOTA = 104857600;
    private Context appContext;
    private CordovaDialogsHelper dialogsHelper;
    private View mCustomView;
    private WebChromeClient.CustomViewCallback mCustomViewCallback;
    private View mVideoProgressView;
    protected final SystemWebViewEngine parentEngine;

    public SystemWebChromeClient(SystemWebViewEngine parentEngine2) {
        this.parentEngine = parentEngine2;
        this.appContext = parentEngine2.webView.getContext();
        this.dialogsHelper = new CordovaDialogsHelper(this.appContext);
    }

    public boolean onJsAlert(WebView view, String url, String message, final JsResult result) {
        this.dialogsHelper.showAlert(message, new CordovaDialogsHelper.Result() {
            public void gotResult(boolean success, String value) {
                if (success) {
                    result.confirm();
                } else {
                    result.cancel();
                }
            }
        });
        return true;
    }

    public boolean onJsConfirm(WebView view, String url, String message, final JsResult result) {
        this.dialogsHelper.showConfirm(message, new CordovaDialogsHelper.Result() {
            public void gotResult(boolean success, String value) {
                if (success) {
                    result.confirm();
                } else {
                    result.cancel();
                }
            }
        });
        return true;
    }

    public boolean onJsPrompt(WebView view, String origin, String message, String defaultValue, final JsPromptResult result) {
        String handledRet = this.parentEngine.bridge.promptOnJsPrompt(origin, message, defaultValue);
        if (handledRet != null) {
            result.confirm(handledRet);
            return true;
        }
        this.dialogsHelper.showPrompt(message, defaultValue, new CordovaDialogsHelper.Result() {
            public void gotResult(boolean success, String value) {
                if (success) {
                    result.confirm(value);
                } else {
                    result.cancel();
                }
            }
        });
        return true;
    }

    public void onExceededDatabaseQuota(String url, String databaseIdentifier, long currentQuota, long estimatedSize, long totalUsedQuota, WebStorage.QuotaUpdater quotaUpdater) {
        LOG.d(LOG_TAG, "onExceededDatabaseQuota estimatedSize: %d  currentQuota: %d  totalUsedQuota: %d", Long.valueOf(estimatedSize), Long.valueOf(currentQuota), Long.valueOf(totalUsedQuota));
        quotaUpdater.updateQuota(this.MAX_QUOTA);
    }

    public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
        super.onGeolocationPermissionsShowPrompt(origin, callback);
        callback.invoke(origin, true, false);
        CordovaPlugin geolocation = this.parentEngine.pluginManager.getPlugin("Geolocation");
        if (geolocation != null && !geolocation.hasPermisssion()) {
            geolocation.requestPermissions(0);
        }
    }

    public void onShowCustomView(View view, WebChromeClient.CustomViewCallback callback) {
        this.parentEngine.getCordovaWebView().showCustomView(view, callback);
    }

    public void onHideCustomView() {
        this.parentEngine.getCordovaWebView().hideCustomView();
    }

    public View getVideoLoadingProgressView() {
        if (this.mVideoProgressView == null) {
            LinearLayout layout = new LinearLayout(this.parentEngine.getView().getContext());
            layout.setOrientation(1);
            RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(-2, -2);
            layoutParams.addRule(13);
            layout.setLayoutParams(layoutParams);
            ProgressBar bar = new ProgressBar(this.parentEngine.getView().getContext());
            LinearLayout.LayoutParams barLayoutParams = new LinearLayout.LayoutParams(-2, -2);
            barLayoutParams.gravity = 17;
            bar.setLayoutParams(barLayoutParams);
            layout.addView(bar);
            this.mVideoProgressView = layout;
        }
        return this.mVideoProgressView;
    }

    public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathsCallback, WebChromeClient.FileChooserParams fileChooserParams) {
        Boolean selectMultiple;
        Intent captureIntent;
        final ValueCallback<Uri[]> valueCallback = filePathsCallback;
        Intent fileIntent = fileChooserParams.createIntent();
        if (fileChooserParams.getMode() == 1) {
            selectMultiple = true;
        } else {
            selectMultiple = false;
        }
        fileIntent.putExtra("android.intent.extra.ALLOW_MULTIPLE", selectMultiple);
        String[] acceptTypes = fileChooserParams.getAcceptTypes();
        if (acceptTypes.length > 1) {
            fileIntent.setType("*/*");
            fileIntent.putExtra("android.intent.extra.MIME_TYPES", acceptTypes);
        }
        Uri tempUri = null;
        if (fileChooserParams.isCaptureEnabled()) {
            captureIntent = new Intent("android.media.action.IMAGE_CAPTURE");
            Context context = this.parentEngine.getView().getContext();
            if (!context.getPackageManager().hasSystemFeature("android.hardware.camera.any") || captureIntent.resolveActivity(context.getPackageManager()) == null) {
                LOG.w(LOG_TAG, "Device does not support photo capture");
                captureIntent = null;
            } else {
                try {
                    File tempFile = createTempFile(context);
                    LOG.d(LOG_TAG, "Temporary photo capture file: " + tempFile);
                    tempUri = createUriForFile(context, tempFile);
                    LOG.d(LOG_TAG, "Temporary photo capture URI: " + tempUri);
                    captureIntent.putExtra("output", tempUri);
                } catch (IOException e) {
                    LOG.e(LOG_TAG, "Unable to create temporary file for photo capture", (Throwable) e);
                    captureIntent = null;
                }
            }
        } else {
            captureIntent = null;
        }
        final Uri captureUri = tempUri;
        Intent chooserIntent = Intent.createChooser(fileIntent, (CharSequence) null);
        if (captureIntent != null) {
            chooserIntent.putExtra("android.intent.extra.INITIAL_INTENTS", new Intent[]{captureIntent});
        }
        try {
            LOG.i(LOG_TAG, "Starting intent for file chooser");
            this.parentEngine.cordova.startActivityForResult(new CordovaPlugin() {
                /* JADX WARNING: type inference failed for: r2v3, types: [java.lang.Object[]] */
                /* JADX WARNING: Multi-variable type inference failed */
                /* Code decompiled incorrectly, please refer to instructions dump. */
                public void onActivityResult(int r10, int r11, android.content.Intent r12) {
                    /*
                        r9 = this;
                        r0 = 0
                        r1 = -1
                        if (r11 != r1) goto L_0x00bd
                        java.util.ArrayList r1 = new java.util.ArrayList
                        r1.<init>()
                        java.lang.String r2 = "SystemWebChromeClient"
                        if (r12 == 0) goto L_0x0035
                        android.net.Uri r3 = r12.getData()
                        if (r3 == 0) goto L_0x0035
                        java.lang.StringBuilder r3 = new java.lang.StringBuilder
                        r3.<init>()
                        java.lang.String r4 = "Adding file (single): "
                        java.lang.StringBuilder r3 = r3.append(r4)
                        android.net.Uri r4 = r12.getData()
                        java.lang.StringBuilder r3 = r3.append(r4)
                        java.lang.String r3 = r3.toString()
                        org.apache.cordova.LOG.v(r2, r3)
                        android.net.Uri r3 = r12.getData()
                        r1.add(r3)
                        goto L_0x0090
                    L_0x0035:
                        android.net.Uri r3 = r10
                        if (r3 == 0) goto L_0x0057
                        java.lang.StringBuilder r3 = new java.lang.StringBuilder
                        r3.<init>()
                        java.lang.String r4 = "Adding camera capture: "
                        java.lang.StringBuilder r3 = r3.append(r4)
                        android.net.Uri r4 = r10
                        java.lang.StringBuilder r3 = r3.append(r4)
                        java.lang.String r3 = r3.toString()
                        org.apache.cordova.LOG.v(r2, r3)
                        android.net.Uri r3 = r10
                        r1.add(r3)
                        goto L_0x0090
                    L_0x0057:
                        if (r12 == 0) goto L_0x0090
                        android.content.ClipData r3 = r12.getClipData()
                        if (r3 == 0) goto L_0x0090
                        android.content.ClipData r3 = r12.getClipData()
                        int r4 = r3.getItemCount()
                        r5 = 0
                    L_0x0068:
                        if (r5 >= r4) goto L_0x0090
                        android.content.ClipData$Item r6 = r3.getItemAt(r5)
                        android.net.Uri r6 = r6.getUri()
                        java.lang.StringBuilder r7 = new java.lang.StringBuilder
                        r7.<init>()
                        java.lang.String r8 = "Adding file (multiple): "
                        java.lang.StringBuilder r7 = r7.append(r8)
                        java.lang.StringBuilder r7 = r7.append(r6)
                        java.lang.String r7 = r7.toString()
                        org.apache.cordova.LOG.v(r2, r7)
                        if (r6 == 0) goto L_0x008d
                        r1.add(r6)
                    L_0x008d:
                        int r5 = r5 + 1
                        goto L_0x0068
                    L_0x0090:
                        boolean r3 = r1.isEmpty()
                        if (r3 != 0) goto L_0x00bd
                        java.lang.StringBuilder r3 = new java.lang.StringBuilder
                        r3.<init>()
                        java.lang.String r4 = "Receive file chooser URL: "
                        java.lang.StringBuilder r3 = r3.append(r4)
                        java.lang.String r4 = r1.toString()
                        java.lang.StringBuilder r3 = r3.append(r4)
                        java.lang.String r3 = r3.toString()
                        org.apache.cordova.LOG.d(r2, r3)
                        int r2 = r1.size()
                        android.net.Uri[] r2 = new android.net.Uri[r2]
                        java.lang.Object[] r2 = r1.toArray(r2)
                        r0 = r2
                        android.net.Uri[] r0 = (android.net.Uri[]) r0
                    L_0x00bd:
                        android.webkit.ValueCallback r1 = r1
                        r1.onReceiveValue(r0)
                        return
                    */
                    throw new UnsupportedOperationException("Method not decompiled: org.apache.cordova.engine.SystemWebChromeClient.AnonymousClass4.onActivityResult(int, int, android.content.Intent):void");
                }
            }, chooserIntent, FILECHOOSER_RESULTCODE);
        } catch (ActivityNotFoundException e2) {
            LOG.w(LOG_TAG, "No activity found to handle file chooser intent.", (Throwable) e2);
            valueCallback.onReceiveValue((Object) null);
        }
        return true;
    }

    private File createTempFile(Context context) throws IOException {
        return File.createTempFile("temp", ".jpg", context.getCacheDir());
    }

    private Uri createUriForFile(Context context, File tempFile) throws IOException {
        return FileProvider.getUriForFile(context, context.getPackageName() + ".cdv.core.file.provider", tempFile);
    }

    public void onPermissionRequest(PermissionRequest request) {
        LOG.d(LOG_TAG, "onPermissionRequest: " + Arrays.toString(request.getResources()));
        request.grant(request.getResources());
    }

    public void destroyLastDialog() {
        this.dialogsHelper.destroyLastDialog();
    }
}
