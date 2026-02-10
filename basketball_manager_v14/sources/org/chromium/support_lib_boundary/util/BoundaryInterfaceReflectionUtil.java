package org.chromium.support_lib_boundary.util;

import android.os.Build;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.Arrays;
import java.util.Collection;
import org.jspecify.annotations.NullMarked;

@NullMarked
public class BoundaryInterfaceReflectionUtil {
    static final /* synthetic */ boolean $assertionsDisabled = false;

    public static boolean instanceOfInOwnClassLoader(Object obj, String className) {
        try {
            return Class.forName(className, false, obj.getClass().getClassLoader()).isInstance(obj);
        } catch (ClassNotFoundException e) {
            return false;
        }
    }

    public static Method dupeMethod(Method method, ClassLoader delegateLoader) throws ClassNotFoundException, NoSuchMethodException {
        return Class.forName(method.getDeclaringClass().getName(), true, delegateLoader).getDeclaredMethod(method.getName(), method.getParameterTypes());
    }

    public static <T> T castToSuppLibClass(Class<T> clazz, InvocationHandler invocationHandler) {
        if (invocationHandler == null) {
            return null;
        }
        return clazz.cast(Proxy.newProxyInstance(BoundaryInterfaceReflectionUtil.class.getClassLoader(), new Class[]{clazz}, invocationHandler));
    }

    public static InvocationHandler createInvocationHandlerFor(Object delegate) {
        if (delegate == null) {
            return null;
        }
        return new InvocationHandlerWithDelegateGetter(delegate);
    }

    public static InvocationHandler[] createInvocationHandlersForArray(Object[] delegates) {
        if (delegates == null) {
            return null;
        }
        InvocationHandler[] handlers = new InvocationHandler[delegates.length];
        for (int i = 0; i < handlers.length; i++) {
            handlers[i] = createInvocationHandlerFor(delegates[i]);
        }
        return handlers;
    }

    public static Object getDelegateFromInvocationHandler(InvocationHandler invocationHandler) {
        if (invocationHandler == null) {
            return null;
        }
        return ((InvocationHandlerWithDelegateGetter) invocationHandler).getDelegate();
    }

    private static class InvocationHandlerWithDelegateGetter implements InvocationHandler {
        private final Object mDelegate;

        public InvocationHandlerWithDelegateGetter(Object delegate) {
            this.mDelegate = delegate;
        }

        public Object invoke(Object o, Method method, Object[] objects) throws Throwable {
            try {
                return BoundaryInterfaceReflectionUtil.dupeMethod(method, this.mDelegate.getClass().getClassLoader()).invoke(this.mDelegate, objects);
            } catch (InvocationTargetException e) {
                throw e.getTargetException();
            } catch (ReflectiveOperationException e2) {
                throw new RuntimeException("Reflection failed for method " + method, e2);
            }
        }

        public Object getDelegate() {
            return this.mDelegate;
        }
    }

    private static boolean isDebuggable() {
        return "eng".equals(Build.TYPE) || "userdebug".equals(Build.TYPE);
    }

    public static boolean containsFeature(Collection<String> features, String soughtFeature) {
        if (!soughtFeature.endsWith(Features.DEV_SUFFIX)) {
            return features.contains(soughtFeature) || (isDebuggable() && features.contains(new StringBuilder().append(soughtFeature).append(Features.DEV_SUFFIX).toString()));
        }
        throw new AssertionError();
    }

    public static boolean containsFeature(String[] features, String soughtFeature) {
        return containsFeature((Collection<String>) Arrays.asList(features), soughtFeature);
    }
}
