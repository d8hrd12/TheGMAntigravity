package com.getcapacitor;

public class ServerPath {
    private final String path;
    private final PathType type;

    public enum PathType {
        BASE_PATH,
        ASSET_PATH
    }

    public ServerPath(PathType type2, String path2) {
        this.type = type2;
        this.path = path2;
    }

    public PathType getType() {
        return this.type;
    }

    public String getPath() {
        return this.path;
    }
}
