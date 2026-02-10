package com.getcapacitor;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.GeolocationPermissions;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.MimeTypeMap;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.EditText;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.content.FileProvider;
import com.getcapacitor.util.PermissionHelper;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class BridgeWebChromeClient extends WebChromeClient {
    private ActivityResultLauncher activityLauncher;
    private ActivityResultListener activityListener;
    private Bridge bridge;
    private ActivityResultLauncher permissionLauncher;
    private PermissionListener permissionListener;

    private interface ActivityResultListener {
        void onActivityResult(ActivityResult activityResult);
    }

    private interface PermissionListener {
        void onPermissionSelect(Boolean bool);
    }

    public BridgeWebChromeClient(Bridge bridge2) {
        this.bridge = bridge2;
        this.permissionLauncher = bridge2.registerForActivityResult(new ActivityResultContracts.RequestMultiplePermissions(), new BridgeWebChromeClient$$ExternalSyntheticLambda5(this));
        this.activityLauncher = bridge2.registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new BridgeWebChromeClient$$ExternalSyntheticLambda6(this));
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$new$0(Map isGranted) {
        if (this.permissionListener != null) {
            boolean granted = true;
            for (Map.Entry<String, Boolean> permission : isGranted.entrySet()) {
                if (!permission.getValue().booleanValue()) {
                    granted = false;
                }
            }
            this.permissionListener.onPermissionSelect(Boolean.valueOf(granted));
        }
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$new$1(ActivityResult result) {
        if (this.activityListener != null) {
            this.activityListener.onActivityResult(result);
        }
    }

    public void onShowCustomView(View view, WebChromeClient.CustomViewCallback callback) {
        callback.onCustomViewHidden();
        super.onShowCustomView(view, callback);
    }

    public void onHideCustomView() {
        super.onHideCustomView();
    }

    public void onPermissionRequest(PermissionRequest request) {
        List<String> permissionList = new ArrayList<>();
        if (Arrays.asList(request.getResources()).contains("android.webkit.resource.VIDEO_CAPTURE")) {
            permissionList.add("android.permission.CAMERA");
        }
        if (Arrays.asList(request.getResources()).contains("android.webkit.resource.AUDIO_CAPTURE")) {
            permissionList.add("android.permission.MODIFY_AUDIO_SETTINGS");
            permissionList.add("android.permission.RECORD_AUDIO");
        }
        if (!permissionList.isEmpty()) {
            this.permissionListener = new BridgeWebChromeClient$$ExternalSyntheticLambda11(request);
            this.permissionLauncher.launch((String[]) permissionList.toArray(new String[0]));
            return;
        }
        request.grant(request.getResources());
    }

    static /* synthetic */ void lambda$onPermissionRequest$0(PermissionRequest request, Boolean isGranted) {
        if (isGranted.booleanValue()) {
            request.grant(request.getResources());
        } else {
            request.deny();
        }
    }

    public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
        if (this.bridge.getActivity().isFinishing()) {
            return true;
        }
        AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());
        builder.setMessage(message).setPositiveButton("OK", new BridgeWebChromeClient$$ExternalSyntheticLambda1(result)).setOnCancelListener(new BridgeWebChromeClient$$ExternalSyntheticLambda2(result));
        builder.create().show();
        return true;
    }

    static /* synthetic */ void lambda$onJsAlert$0(JsResult result, DialogInterface dialog, int buttonIndex) {
        dialog.dismiss();
        result.confirm();
    }

    static /* synthetic */ void lambda$onJsAlert$1(JsResult result, DialogInterface dialog) {
        dialog.dismiss();
        result.cancel();
    }

    public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
        if (this.bridge.getActivity().isFinishing()) {
            return true;
        }
        AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());
        builder.setMessage(message).setPositiveButton("OK", new BridgeWebChromeClient$$ExternalSyntheticLambda12(result)).setNegativeButton("Cancel", new BridgeWebChromeClient$$ExternalSyntheticLambda13(result)).setOnCancelListener(new BridgeWebChromeClient$$ExternalSyntheticLambda14(result));
        builder.create().show();
        return true;
    }

    static /* synthetic */ void lambda$onJsConfirm$0(JsResult result, DialogInterface dialog, int buttonIndex) {
        dialog.dismiss();
        result.confirm();
    }

    static /* synthetic */ void lambda$onJsConfirm$1(JsResult result, DialogInterface dialog, int buttonIndex) {
        dialog.dismiss();
        result.cancel();
    }

    static /* synthetic */ void lambda$onJsConfirm$2(JsResult result, DialogInterface dialog) {
        dialog.dismiss();
        result.cancel();
    }

    public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
        if (this.bridge.getActivity().isFinishing()) {
            return true;
        }
        AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());
        EditText input = new EditText(view.getContext());
        builder.setMessage(message).setView(input).setPositiveButton("OK", new BridgeWebChromeClient$$ExternalSyntheticLambda8(input, result)).setNegativeButton("Cancel", new BridgeWebChromeClient$$ExternalSyntheticLambda9(result)).setOnCancelListener(new BridgeWebChromeClient$$ExternalSyntheticLambda10(result));
        builder.create().show();
        return true;
    }

    static /* synthetic */ void lambda$onJsPrompt$0(EditText input, JsPromptResult result, DialogInterface dialog, int buttonIndex) {
        dialog.dismiss();
        result.confirm(input.getText().toString().trim());
    }

    static /* synthetic */ void lambda$onJsPrompt$1(JsPromptResult result, DialogInterface dialog, int buttonIndex) {
        dialog.dismiss();
        result.cancel();
    }

    static /* synthetic */ void lambda$onJsPrompt$2(JsPromptResult result, DialogInterface dialog) {
        dialog.dismiss();
        result.cancel();
    }

    public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
        super.onGeolocationPermissionsShowPrompt(origin, callback);
        Logger.debug("onGeolocationPermissionsShowPrompt: DOING IT HERE FOR ORIGIN: " + origin);
        String[] geoPermissions = {"android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION"};
        if (!PermissionHelper.hasPermissions(this.bridge.getContext(), geoPermissions)) {
            this.permissionListener = new BridgeWebChromeClient$$ExternalSyntheticLambda4(this, callback, origin);
            this.permissionLauncher.launch(geoPermissions);
            return;
        }
        callback.invoke(origin, true, false);
        Logger.debug("onGeolocationPermissionsShowPrompt: has required permission");
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$onGeolocationPermissionsShowPrompt$0(GeolocationPermissions.Callback callback, String origin, Boolean isGranted) {
        if (isGranted.booleanValue()) {
            callback.invoke(origin, true, false);
            return;
        }
        String[] coarsePermission = {"android.permission.ACCESS_COARSE_LOCATION"};
        if (Build.VERSION.SDK_INT < 31 || !PermissionHelper.hasPermissions(this.bridge.getContext(), coarsePermission)) {
            callback.invoke(origin, false, false);
        } else {
            callback.invoke(origin, true, false);
        }
    }

    public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
        List<String> acceptTypes = Arrays.asList(fileChooserParams.getAcceptTypes());
        boolean captureEnabled = fileChooserParams.isCaptureEnabled();
        boolean capturePhoto = captureEnabled && acceptTypes.contains("image/*");
        boolean captureVideo = captureEnabled && acceptTypes.contains("video/*");
        if (!capturePhoto && !captureVideo) {
            showFilePicker(filePathCallback, fileChooserParams);
        } else if (isMediaCaptureSupported()) {
            showMediaCaptureOrFilePicker(filePathCallback, fileChooserParams, captureVideo);
        } else {
            this.permissionListener = new BridgeWebChromeClient$$ExternalSyntheticLambda3(this, filePathCallback, fileChooserParams, captureVideo);
            this.permissionLauncher.launch(new String[]{"android.permission.CAMERA"});
        }
        return true;
    }

    /* access modifiers changed from: private */
    public /* synthetic */ void lambda$onShowFileChooser$0(ValueCallback filePathCallback, WebChromeClient.FileChooserParams fileChooserParams, boolean captureVideo, Boolean isGranted) {
        if (isGranted.booleanValue()) {
            showMediaCaptureOrFilePicker(filePathCallback, fileChooserParams, captureVideo);
            return;
        }
        Logger.warn(Logger.tags("FileChooser"), "Camera permission not granted");
        filePathCallback.onReceiveValue((Object) null);
    }

    private boolean isMediaCaptureSupported() {
        if (PermissionHelper.hasPermissions(this.bridge.getContext(), new String[]{"android.permission.CAMERA"}) || !PermissionHelper.hasDefinedPermission(this.bridge.getContext(), "android.permission.CAMERA")) {
            return true;
        }
        return false;
    }

    private void showMediaCaptureOrFilePicker(ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams, boolean isVideo) {
        boolean shown;
        if (isVideo) {
            shown = showVideoCapturePicker(filePathCallback);
        } else {
            shown = showImageCapturePicker(filePathCallback);
        }
        if (!shown) {
            Logger.warn(Logger.tags("FileChooser"), "Media capture intent could not be launched. Falling back to default file picker.");
            showFilePicker(filePathCallback, fileChooserParams);
        }
    }

    private boolean showImageCapturePicker(ValueCallback<Uri[]> filePathCallback) {
        Intent takePictureIntent = new Intent("android.media.action.IMAGE_CAPTURE");
        if (takePictureIntent.resolveActivity(this.bridge.getActivity().getPackageManager()) == null) {
            return false;
        }
        try {
            Uri imageFileUri = createImageFileUri();
            takePictureIntent.putExtra("output", imageFileUri);
            this.activityListener = new BridgeWebChromeClient$$ExternalSyntheticLambda7(imageFileUri, filePathCallback);
            this.activityLauncher.launch(takePictureIntent);
            return true;
        } catch (Exception ex) {
            Logger.error("Unable to create temporary media capture file: " + ex.getMessage());
            return false;
        }
    }

    static /* synthetic */ void lambda$showImageCapturePicker$0(Uri imageFileUri, ValueCallback filePathCallback, ActivityResult activityResult) {
        Uri[] result = null;
        if (activityResult.getResultCode() == -1) {
            result = new Uri[]{imageFileUri};
        }
        filePathCallback.onReceiveValue(result);
    }

    private boolean showVideoCapturePicker(ValueCallback<Uri[]> filePathCallback) {
        Intent takeVideoIntent = new Intent("android.media.action.VIDEO_CAPTURE");
        if (takeVideoIntent.resolveActivity(this.bridge.getActivity().getPackageManager()) == null) {
            return false;
        }
        this.activityListener = new BridgeWebChromeClient$$ExternalSyntheticLambda0(filePathCallback);
        this.activityLauncher.launch(takeVideoIntent);
        return true;
    }

    static /* synthetic */ void lambda$showVideoCapturePicker$0(ValueCallback filePathCallback, ActivityResult activityResult) {
        Uri[] result = null;
        if (activityResult.getResultCode() == -1) {
            result = new Uri[]{activityResult.getData().getData()};
        }
        filePathCallback.onReceiveValue(result);
    }

    private void showFilePicker(ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
        Intent intent = fileChooserParams.createIntent();
        if (fileChooserParams.getMode() == 1) {
            intent.putExtra("android.intent.extra.ALLOW_MULTIPLE", true);
        }
        if (fileChooserParams.getAcceptTypes().length > 1 || intent.getType().startsWith(".")) {
            String[] validTypes = getValidTypes(fileChooserParams.getAcceptTypes());
            intent.putExtra("android.intent.extra.MIME_TYPES", validTypes);
            if (intent.getType().startsWith(".")) {
                intent.setType(validTypes[0]);
            }
        }
        try {
            this.activityListener = new BridgeWebChromeClient$$ExternalSyntheticLambda15(filePathCallback);
            this.activityLauncher.launch(intent);
        } catch (ActivityNotFoundException e) {
            filePathCallback.onReceiveValue((Object) null);
        }
    }

    static /* synthetic */ void lambda$showFilePicker$0(ValueCallback filePathCallback, ActivityResult activityResult) {
        Uri[] result;
        Intent resultIntent = activityResult.getData();
        if (activityResult.getResultCode() != -1 || resultIntent.getClipData() == null) {
            result = WebChromeClient.FileChooserParams.parseResult(activityResult.getResultCode(), resultIntent);
        } else {
            int numFiles = resultIntent.getClipData().getItemCount();
            result = new Uri[numFiles];
            for (int i = 0; i < numFiles; i++) {
                result[i] = resultIntent.getClipData().getItemAt(i).getUri();
            }
        }
        filePathCallback.onReceiveValue(result);
    }

    private String[] getValidTypes(String[] currentTypes) {
        List<String> validTypes = new ArrayList<>();
        MimeTypeMap mtm = MimeTypeMap.getSingleton();
        for (String mime : currentTypes) {
            if (mime.startsWith(".")) {
                String extensionMime = mtm.getMimeTypeFromExtension(mime.substring(1));
                if (extensionMime != null && !validTypes.contains(extensionMime)) {
                    validTypes.add(extensionMime);
                }
            } else if (!validTypes.contains(mime)) {
                validTypes.add(mime);
            }
        }
        Object[] validObj = validTypes.toArray();
        return (String[]) Arrays.copyOf(validObj, validObj.length, String[].class);
    }

    public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
        String tag = Logger.tags("Console");
        if (consoleMessage.message() != null && isValidMsg(consoleMessage.message())) {
            String msg = String.format("File: %s - Line %d - Msg: %s", new Object[]{consoleMessage.sourceId(), Integer.valueOf(consoleMessage.lineNumber()), consoleMessage.message()});
            String level = consoleMessage.messageLevel().name();
            if ("ERROR".equalsIgnoreCase(level)) {
                Logger.error(tag, msg, (Throwable) null);
            } else if ("WARNING".equalsIgnoreCase(level)) {
                Logger.warn(tag, msg);
            } else if ("TIP".equalsIgnoreCase(level)) {
                Logger.debug(tag, msg);
            } else {
                Logger.info(tag, msg);
            }
        }
        return true;
    }

    public boolean isValidMsg(String msg) {
        return !msg.contains("%cresult %c") && !msg.contains("%cnative %c") && !msg.equalsIgnoreCase("console.groupEnd");
    }

    private Uri createImageFileUri() throws IOException {
        Activity activity = this.bridge.getActivity();
        return FileProvider.getUriForFile(activity, this.bridge.getContext().getPackageName() + ".fileprovider", createImageFile(activity));
    }

    private File createImageFile(Activity activity) throws IOException {
        return File.createTempFile("JPEG_" + new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date()) + "_", ".jpg", activity.getExternalFilesDir(Environment.DIRECTORY_PICTURES));
    }
}
