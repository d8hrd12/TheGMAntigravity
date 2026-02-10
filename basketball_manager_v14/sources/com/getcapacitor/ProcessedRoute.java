package com.getcapacitor;

public class ProcessedRoute {
    private boolean ignoreAssetPath;
    private boolean isAsset;
    private String path;

    public String getPath() {
        return this.path;
    }

    public void setPath(String path2) {
        this.path = path2;
    }

    public boolean isAsset() {
        return this.isAsset;
    }

    public void setAsset(boolean asset) {
        this.isAsset = asset;
    }

    public boolean isIgnoreAssetPath() {
        return this.ignoreAssetPath;
    }

    public void setIgnoreAssetPath(boolean ignoreAssetPath2) {
        this.ignoreAssetPath = ignoreAssetPath2;
    }
}
