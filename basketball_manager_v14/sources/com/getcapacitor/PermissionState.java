package com.getcapacitor;

import java.util.Locale;

public enum PermissionState {
    GRANTED("granted"),
    DENIED("denied"),
    PROMPT("prompt"),
    PROMPT_WITH_RATIONALE("prompt-with-rationale");
    
    private String state;

    private PermissionState(String state2) {
        this.state = state2;
    }

    public String toString() {
        return this.state;
    }

    public static PermissionState byState(String state2) {
        return valueOf(state2.toUpperCase(Locale.ROOT).replace('-', '_'));
    }
}
