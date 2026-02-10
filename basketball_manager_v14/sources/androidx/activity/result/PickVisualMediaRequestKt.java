package androidx.activity.result;

import androidx.activity.result.PickVisualMediaRequest;
import androidx.activity.result.contract.ActivityResultContracts;
import kotlin.Metadata;
import kotlin.jvm.internal.Intrinsics;

@Metadata(d1 = {"\u0000,\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\t\n\u0000\n\u0002\u0018\u0002\n\u0000\u001a\u0012\u0010\u0000\u001a\u00020\u00012\b\b\u0002\u0010\u0002\u001a\u00020\u0003H\u0007\u001a\u001c\u0010\u0000\u001a\u00020\u00012\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0003\u0010\u0004\u001a\u00020\u0005H\u0007\u001a.\u0010\u0000\u001a\u00020\u00012\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0003\u0010\u0004\u001a\u00020\u00052\b\b\u0002\u0010\u0006\u001a\u00020\u00072\b\b\u0002\u0010\b\u001a\u00020\t\u001a6\u0010\u0000\u001a\u00020\u00012\u0006\u0010\n\u001a\u00020\u000b2\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0003\u0010\u0004\u001a\u00020\u00052\b\b\u0002\u0010\u0006\u001a\u00020\u00072\b\b\u0002\u0010\b\u001a\u00020\t\u001a:\u0010\u0000\u001a\u00020\u00012\b\u0010\f\u001a\u0004\u0018\u00010\r2\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0003\u0010\u0004\u001a\u00020\u00052\b\b\u0002\u0010\u0006\u001a\u00020\u00072\b\b\u0002\u0010\b\u001a\u00020\tH\u0007\u001aB\u0010\u0000\u001a\u00020\u00012\b\u0010\f\u001a\u0004\u0018\u00010\r2\u0006\u0010\n\u001a\u00020\u000b2\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0003\u0010\u0004\u001a\u00020\u00052\b\b\u0002\u0010\u0006\u001a\u00020\u00072\b\b\u0002\u0010\b\u001a\u00020\tH\u0007¨\u0006\u000e"}, d2 = {"PickVisualMediaRequest", "Landroidx/activity/result/PickVisualMediaRequest;", "mediaType", "Landroidx/activity/result/contract/ActivityResultContracts$PickVisualMedia$VisualMediaType;", "maxItems", "", "isOrderedSelection", "", "defaultTab", "Landroidx/activity/result/contract/ActivityResultContracts$PickVisualMedia$DefaultTab;", "accentColor", "", "mediaCapabilitiesForTranscoding", "Landroidx/activity/result/contract/ActivityResultContracts$PickVisualMedia$MediaCapabilities;", "activity_release"}, k = 2, mv = {2, 0, 0}, xi = 48)
/* compiled from: PickVisualMediaRequest.kt */
public final class PickVisualMediaRequestKt {
    public static /* synthetic */ PickVisualMediaRequest PickVisualMediaRequest$default(ActivityResultContracts.PickVisualMedia.VisualMediaType visualMediaType, int i, Object obj) {
        if ((i & 1) != 0) {
            visualMediaType = ActivityResultContracts.PickVisualMedia.ImageAndVideo.INSTANCE;
        }
        return Intrinsics.checkNotNullParameter(visualMediaType, "mediaType");
    }

    public static /* synthetic */ PickVisualMediaRequest PickVisualMediaRequest$default(ActivityResultContracts.PickVisualMedia.VisualMediaType visualMediaType, int i, int i2, Object obj) {
        if ((i2 & 1) != 0) {
            visualMediaType = ActivityResultContracts.PickVisualMedia.ImageAndVideo.INSTANCE;
        }
        if ((i2 & 2) != 0) {
            i = ActivityResultContracts.PickMultipleVisualMedia.Companion.getMaxItems$activity_release();
        }
        return Intrinsics.checkNotNullParameter(visualMediaType, "mediaType");
    }

    public static /* synthetic */ PickVisualMediaRequest PickVisualMediaRequest$default(ActivityResultContracts.PickVisualMedia.VisualMediaType visualMediaType, int i, boolean z, ActivityResultContracts.PickVisualMedia.DefaultTab defaultTab, int i2, Object obj) {
        if ((i2 & 1) != 0) {
            visualMediaType = ActivityResultContracts.PickVisualMedia.ImageAndVideo.INSTANCE;
        }
        if ((i2 & 2) != 0) {
            i = ActivityResultContracts.PickMultipleVisualMedia.Companion.getMaxItems$activity_release();
        }
        if ((i2 & 4) != 0) {
            z = false;
        }
        if ((i2 & 8) != 0) {
            defaultTab = ActivityResultContracts.PickVisualMedia.DefaultTab.PhotosTab.INSTANCE;
        }
        return PickVisualMediaRequest(visualMediaType, i, z, defaultTab);
    }

    public static final PickVisualMediaRequest PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.VisualMediaType mediaType, int maxItems, boolean isOrderedSelection, ActivityResultContracts.PickVisualMedia.DefaultTab defaultTab) {
        Intrinsics.checkNotNullParameter(mediaType, "mediaType");
        Intrinsics.checkNotNullParameter(defaultTab, "defaultTab");
        return new PickVisualMediaRequest.Builder().setMediaType(mediaType).setMaxItems(maxItems).setOrderedSelection(isOrderedSelection).setDefaultTab(defaultTab).build();
    }

    public static /* synthetic */ PickVisualMediaRequest PickVisualMediaRequest$default(long j, ActivityResultContracts.PickVisualMedia.VisualMediaType visualMediaType, int i, boolean z, ActivityResultContracts.PickVisualMedia.DefaultTab defaultTab, int i2, Object obj) {
        ActivityResultContracts.PickVisualMedia.VisualMediaType visualMediaType2;
        int i3;
        ActivityResultContracts.PickVisualMedia.DefaultTab defaultTab2;
        if ((i2 & 2) != 0) {
            visualMediaType2 = ActivityResultContracts.PickVisualMedia.ImageAndVideo.INSTANCE;
        } else {
            visualMediaType2 = visualMediaType;
        }
        if ((i2 & 4) != 0) {
            i3 = ActivityResultContracts.PickMultipleVisualMedia.Companion.getMaxItems$activity_release();
        } else {
            i3 = i;
        }
        boolean z2 = (i2 & 8) != 0 ? false : z;
        if ((i2 & 16) != 0) {
            defaultTab2 = ActivityResultContracts.PickVisualMedia.DefaultTab.PhotosTab.INSTANCE;
        } else {
            defaultTab2 = defaultTab;
        }
        return PickVisualMediaRequest(j, visualMediaType2, i3, z2, defaultTab2);
    }

    public static final PickVisualMediaRequest PickVisualMediaRequest(long accentColor, ActivityResultContracts.PickVisualMedia.VisualMediaType mediaType, int maxItems, boolean isOrderedSelection, ActivityResultContracts.PickVisualMedia.DefaultTab defaultTab) {
        Intrinsics.checkNotNullParameter(mediaType, "mediaType");
        Intrinsics.checkNotNullParameter(defaultTab, "defaultTab");
        return new PickVisualMediaRequest.Builder().setMediaType(mediaType).setMaxItems(maxItems).setOrderedSelection(isOrderedSelection).setDefaultTab(defaultTab).setAccentColor(accentColor).build();
    }

    public static /* synthetic */ PickVisualMediaRequest PickVisualMediaRequest$default(ActivityResultContracts.PickVisualMedia.MediaCapabilities mediaCapabilities, ActivityResultContracts.PickVisualMedia.VisualMediaType visualMediaType, int i, boolean z, ActivityResultContracts.PickVisualMedia.DefaultTab defaultTab, int i2, Object obj) {
        if ((i2 & 2) != 0) {
            visualMediaType = ActivityResultContracts.PickVisualMedia.ImageAndVideo.INSTANCE;
        }
        if ((i2 & 4) != 0) {
            i = ActivityResultContracts.PickMultipleVisualMedia.Companion.getMaxItems$activity_release();
        }
        if ((i2 & 8) != 0) {
            z = false;
        }
        if ((i2 & 16) != 0) {
            defaultTab = ActivityResultContracts.PickVisualMedia.DefaultTab.PhotosTab.INSTANCE;
        }
        return PickVisualMediaRequest(mediaCapabilities, visualMediaType, i, z, defaultTab);
    }

    public static final PickVisualMediaRequest PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.MediaCapabilities mediaCapabilitiesForTranscoding, ActivityResultContracts.PickVisualMedia.VisualMediaType mediaType, int maxItems, boolean isOrderedSelection, ActivityResultContracts.PickVisualMedia.DefaultTab defaultTab) {
        Intrinsics.checkNotNullParameter(mediaType, "mediaType");
        Intrinsics.checkNotNullParameter(defaultTab, "defaultTab");
        return new PickVisualMediaRequest.Builder().setMediaType(mediaType).setMaxItems(maxItems).setOrderedSelection(isOrderedSelection).setDefaultTab(defaultTab).setMediaCapabilitiesForTranscoding(mediaCapabilitiesForTranscoding).build();
    }

    public static /* synthetic */ PickVisualMediaRequest PickVisualMediaRequest$default(ActivityResultContracts.PickVisualMedia.MediaCapabilities mediaCapabilities, long j, ActivityResultContracts.PickVisualMedia.VisualMediaType visualMediaType, int i, boolean z, ActivityResultContracts.PickVisualMedia.DefaultTab defaultTab, int i2, Object obj) {
        ActivityResultContracts.PickVisualMedia.VisualMediaType visualMediaType2;
        ActivityResultContracts.PickVisualMedia.DefaultTab defaultTab2;
        if ((i2 & 4) != 0) {
            visualMediaType2 = ActivityResultContracts.PickVisualMedia.ImageAndVideo.INSTANCE;
        } else {
            visualMediaType2 = visualMediaType;
        }
        int maxItems$activity_release = (i2 & 8) != 0 ? ActivityResultContracts.PickMultipleVisualMedia.Companion.getMaxItems$activity_release() : i;
        boolean z2 = (i2 & 16) != 0 ? false : z;
        if ((i2 & 32) != 0) {
            defaultTab2 = ActivityResultContracts.PickVisualMedia.DefaultTab.PhotosTab.INSTANCE;
        } else {
            defaultTab2 = defaultTab;
        }
        return PickVisualMediaRequest(mediaCapabilities, j, visualMediaType2, maxItems$activity_release, z2, defaultTab2);
    }

    public static final PickVisualMediaRequest PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.MediaCapabilities mediaCapabilitiesForTranscoding, long accentColor, ActivityResultContracts.PickVisualMedia.VisualMediaType mediaType, int maxItems, boolean isOrderedSelection, ActivityResultContracts.PickVisualMedia.DefaultTab defaultTab) {
        Intrinsics.checkNotNullParameter(mediaType, "mediaType");
        Intrinsics.checkNotNullParameter(defaultTab, "defaultTab");
        return new PickVisualMediaRequest.Builder().setMediaType(mediaType).setMaxItems(maxItems).setOrderedSelection(isOrderedSelection).setDefaultTab(defaultTab).setAccentColor(accentColor).setMediaCapabilitiesForTranscoding(mediaCapabilitiesForTranscoding).build();
    }
}
