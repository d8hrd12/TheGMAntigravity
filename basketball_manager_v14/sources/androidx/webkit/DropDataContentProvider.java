package androidx.webkit;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.ParcelFileDescriptor;
import androidx.webkit.internal.WebViewGlueCommunicator;
import java.io.FileNotFoundException;
import org.chromium.support_lib_boundary.DropDataContentProviderBoundaryInterface;

public final class DropDataContentProvider extends ContentProvider {
    DropDataContentProviderBoundaryInterface mImpl;

    public boolean onCreate() {
        return true;
    }

    public ParcelFileDescriptor openFile(Uri uri, String mode) throws FileNotFoundException {
        return getDropImpl().openFile(this, uri);
    }

    public Cursor query(Uri uri, String[] projection, String selection, String[] selectionArgs, String sortOrder) {
        return getDropImpl().query(uri, projection, selection, selectionArgs, sortOrder);
    }

    public String getType(Uri uri) {
        return getDropImpl().getType(uri);
    }

    public Uri insert(Uri uri, ContentValues contentValues) {
        throw new UnsupportedOperationException("Insert method is not supported.");
    }

    public int delete(Uri uri, String selection, String[] selectionArgs) {
        throw new UnsupportedOperationException("delete method is not supported.");
    }

    public int update(Uri uri, ContentValues contentValues, String s, String[] strings) {
        throw new UnsupportedOperationException("update method is not supported.");
    }

    public Bundle call(String method, String arg, Bundle extras) {
        return getDropImpl().call(method, arg, extras);
    }

    private DropDataContentProviderBoundaryInterface getDropImpl() {
        if (this.mImpl == null) {
            this.mImpl = WebViewGlueCommunicator.getFactory().getDropDataProvider();
            this.mImpl.onCreate();
        }
        return this.mImpl;
    }
}
