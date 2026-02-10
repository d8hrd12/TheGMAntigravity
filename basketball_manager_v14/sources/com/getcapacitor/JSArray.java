package com.getcapacitor;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;

public class JSArray extends JSONArray {
    public JSArray() {
    }

    public JSArray(String json) throws JSONException {
        super(json);
    }

    public JSArray(Collection copyFrom) {
        super(copyFrom);
    }

    public JSArray(Object array) throws JSONException {
        super(array);
    }

    public <E> List<E> toList() throws JSONException {
        List<E> items = new ArrayList<>();
        int i = 0;
        while (i < length()) {
            Object o = get(i);
            try {
                items.add(get(i));
                i++;
            } catch (Exception e) {
                throw new JSONException("Not all items are instances of the given type");
            }
        }
        return items;
    }

    public static JSArray from(Object array) {
        try {
            return new JSArray(array);
        } catch (JSONException e) {
            return null;
        }
    }
}
