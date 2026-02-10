package com.getcapacitor.plugin.util;

enum MimeType {
    APPLICATION_JSON("application/json"),
    APPLICATION_VND_API_JSON("application/vnd.api+json"),
    TEXT_HTML("text/html");
    
    private final String value;

    private MimeType(String value2) {
        this.value = value2;
    }

    /* access modifiers changed from: package-private */
    public String getValue() {
        return this.value;
    }
}
