package com.getcapacitor;

import com.getcapacitor.annotation.CapacitorPlugin;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class PluginHandle {
    private final Bridge bridge;
    private Plugin instance;
    private NativePlugin legacyPluginAnnotation;
    private CapacitorPlugin pluginAnnotation;
    private final Class<? extends Plugin> pluginClass;
    private final String pluginId;
    private final Map<String, PluginMethodHandle> pluginMethods;

    private PluginHandle(Class<? extends Plugin> clazz, Bridge bridge2) throws InvalidPluginException {
        this.pluginMethods = new HashMap();
        this.bridge = bridge2;
        this.pluginClass = clazz;
        CapacitorPlugin pluginAnnotation2 = (CapacitorPlugin) this.pluginClass.getAnnotation(CapacitorPlugin.class);
        if (pluginAnnotation2 == null) {
            NativePlugin legacyPluginAnnotation2 = (NativePlugin) this.pluginClass.getAnnotation(NativePlugin.class);
            if (legacyPluginAnnotation2 != null) {
                if (!legacyPluginAnnotation2.name().equals("")) {
                    this.pluginId = legacyPluginAnnotation2.name();
                } else {
                    this.pluginId = this.pluginClass.getSimpleName();
                }
                this.legacyPluginAnnotation = legacyPluginAnnotation2;
            } else {
                throw new InvalidPluginException("No @CapacitorPlugin annotation found for plugin " + this.pluginClass.getName());
            }
        } else {
            if (!pluginAnnotation2.name().equals("")) {
                this.pluginId = pluginAnnotation2.name();
            } else {
                this.pluginId = this.pluginClass.getSimpleName();
            }
            this.pluginAnnotation = pluginAnnotation2;
        }
        indexMethods(clazz);
    }

    public PluginHandle(Bridge bridge2, Class<? extends Plugin> pluginClass2) throws InvalidPluginException, PluginLoadException {
        this(pluginClass2, bridge2);
        load();
    }

    public PluginHandle(Bridge bridge2, Plugin plugin) throws InvalidPluginException {
        this((Class<? extends Plugin>) plugin.getClass(), bridge2);
        loadInstance(plugin);
    }

    public Class<? extends Plugin> getPluginClass() {
        return this.pluginClass;
    }

    public String getId() {
        return this.pluginId;
    }

    public NativePlugin getLegacyPluginAnnotation() {
        return this.legacyPluginAnnotation;
    }

    public CapacitorPlugin getPluginAnnotation() {
        return this.pluginAnnotation;
    }

    public Plugin getInstance() {
        return this.instance;
    }

    public Collection<PluginMethodHandle> getMethods() {
        return this.pluginMethods.values();
    }

    public Plugin load() throws PluginLoadException {
        if (this.instance != null) {
            return this.instance;
        }
        try {
            this.instance = (Plugin) this.pluginClass.getDeclaredConstructor(new Class[0]).newInstance(new Object[0]);
            return loadInstance(this.instance);
        } catch (Exception e) {
            throw new PluginLoadException("Unable to load plugin instance. Ensure plugin is publicly accessible");
        }
    }

    public Plugin loadInstance(Plugin plugin) {
        this.instance = plugin;
        this.instance.setPluginHandle(this);
        this.instance.setBridge(this.bridge);
        this.instance.load();
        this.instance.initializeActivityLaunchers();
        return this.instance;
    }

    public void invoke(String methodName, PluginCall call) throws PluginLoadException, InvalidPluginMethodException, InvocationTargetException, IllegalAccessException {
        if (this.instance == null) {
            load();
        }
        PluginMethodHandle methodMeta = this.pluginMethods.get(methodName);
        if (methodMeta != null) {
            methodMeta.getMethod().invoke(this.instance, new Object[]{call});
            return;
        }
        throw new InvalidPluginMethodException("No method " + methodName + " found for plugin " + this.pluginClass.getName());
    }

    private void indexMethods(Class<? extends Plugin> cls) {
        for (Method methodReflect : this.pluginClass.getMethods()) {
            PluginMethod method = (PluginMethod) methodReflect.getAnnotation(PluginMethod.class);
            if (method != null) {
                this.pluginMethods.put(methodReflect.getName(), new PluginMethodHandle(methodReflect, method));
            }
        }
    }
}
