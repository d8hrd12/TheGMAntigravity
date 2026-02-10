package com.getcapacitor;

import android.content.res.AssetManager;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;

public class PluginManager {
    private final AssetManager assetManager;

    public PluginManager(AssetManager assetManager2) {
        this.assetManager = assetManager2;
    }

    public List<Class<? extends Plugin>> loadPluginClasses() throws PluginLoadException {
        JSONArray pluginsJSON = parsePluginsJSON();
        ArrayList<Class<? extends Plugin>> pluginList = new ArrayList<>();
        try {
            int size = pluginsJSON.length();
            for (int i = 0; i < size; i++) {
                pluginList.add(Class.forName(pluginsJSON.getJSONObject(i).getString("classpath")).asSubclass(Plugin.class));
            }
            return pluginList;
        } catch (JSONException e) {
            throw new PluginLoadException("Could not parse capacitor.plugins.json as JSON");
        } catch (ClassNotFoundException e2) {
            throw new PluginLoadException("Could not find class by class path: " + e2.getMessage());
        }
    }

    private JSONArray parsePluginsJSON() throws PluginLoadException {
        BufferedReader reader;
        try {
            reader = new BufferedReader(new InputStreamReader(this.assetManager.open("capacitor.plugins.json")));
            StringBuilder builder = new StringBuilder();
            while (true) {
                String readLine = reader.readLine();
                String line = readLine;
                if (readLine != null) {
                    builder.append(line);
                } else {
                    JSONArray jSONArray = new JSONArray(builder.toString());
                    reader.close();
                    return jSONArray;
                }
            }
        } catch (IOException e) {
            throw new PluginLoadException("Could not load capacitor.plugins.json");
        } catch (JSONException e2) {
            throw new PluginLoadException("Could not parse capacitor.plugins.json as JSON");
        } catch (Throwable th) {
            th.addSuppressed(th);
        }
        throw th;
    }
}
