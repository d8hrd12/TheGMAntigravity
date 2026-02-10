package com.getcapacitor;

import java.lang.reflect.Method;

public class PluginMethodHandle {
    private final Method method;
    private final String name;
    private final String returnType;

    public PluginMethodHandle(Method method2, PluginMethod methodDecorator) {
        this.method = method2;
        this.name = method2.getName();
        this.returnType = methodDecorator.returnType();
    }

    public String getReturnType() {
        return this.returnType;
    }

    public String getName() {
        return this.name;
    }

    public Method getMethod() {
        return this.method;
    }
}
