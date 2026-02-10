package androidx.vectordrawable.graphics.drawable;

import android.animation.Animator;
import android.animation.AnimatorInflater;
import android.animation.AnimatorSet;
import android.animation.Keyframe;
import android.animation.ObjectAnimator;
import android.animation.PropertyValuesHolder;
import android.animation.TypeEvaluator;
import android.animation.ValueAnimator;
import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.content.res.XmlResourceParser;
import android.graphics.Path;
import android.graphics.PathMeasure;
import android.util.AttributeSet;
import android.util.Log;
import android.util.TypedValue;
import android.util.Xml;
import android.view.InflateException;
import androidx.core.content.res.TypedArrayUtils;
import androidx.core.graphics.PathParser;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;

public class AnimatorInflaterCompat {
    private static final boolean DBG_ANIMATOR_INFLATER = false;
    private static final int MAX_NUM_POINTS = 100;
    private static final String TAG = "AnimatorInflater";
    private static final int TOGETHER = 0;
    private static final int VALUE_TYPE_COLOR = 3;
    private static final int VALUE_TYPE_FLOAT = 0;
    private static final int VALUE_TYPE_INT = 1;
    private static final int VALUE_TYPE_PATH = 2;
    private static final int VALUE_TYPE_UNDEFINED = 4;

    public static Animator loadAnimator(Context context, int id) throws Resources.NotFoundException {
        return AnimatorInflater.loadAnimator(context, id);
    }

    public static Animator loadAnimator(Context context, Resources resources, Resources.Theme theme, int id) throws Resources.NotFoundException {
        return loadAnimator(context, resources, theme, id, 1.0f);
    }

    public static Animator loadAnimator(Context context, Resources resources, Resources.Theme theme, int id, float pathErrorScale) throws Resources.NotFoundException {
        XmlResourceParser parser = null;
        try {
            XmlResourceParser parser2 = resources.getAnimation(id);
            Animator animator = createAnimatorFromXml(context, resources, theme, parser2, pathErrorScale);
            if (parser2 != null) {
                parser2.close();
            }
            return animator;
        } catch (XmlPullParserException ex) {
            Resources.NotFoundException rnf = new Resources.NotFoundException("Can't load animation resource ID #0x" + Integer.toHexString(id));
            rnf.initCause(ex);
            throw rnf;
        } catch (IOException ex2) {
            Resources.NotFoundException rnf2 = new Resources.NotFoundException("Can't load animation resource ID #0x" + Integer.toHexString(id));
            rnf2.initCause(ex2);
            throw rnf2;
        } catch (Throwable th) {
            if (parser != null) {
                parser.close();
            }
            throw th;
        }
    }

    private static class PathDataEvaluator implements TypeEvaluator<PathParser.PathDataNode[]> {
        private PathParser.PathDataNode[] mNodeArray;

        PathDataEvaluator() {
        }

        PathDataEvaluator(PathParser.PathDataNode[] nodeArray) {
            this.mNodeArray = nodeArray;
        }

        public PathParser.PathDataNode[] evaluate(float fraction, PathParser.PathDataNode[] startPathData, PathParser.PathDataNode[] endPathData) {
            if (PathParser.canMorph(startPathData, endPathData)) {
                if (!PathParser.canMorph(this.mNodeArray, startPathData)) {
                    this.mNodeArray = PathParser.deepCopyNodes(startPathData);
                }
                for (int i = 0; i < startPathData.length; i++) {
                    this.mNodeArray[i].interpolatePathDataNode(startPathData[i], endPathData[i], fraction);
                }
                return this.mNodeArray;
            }
            throw new IllegalArgumentException("Can't interpolate between two incompatible pathData");
        }
    }

    private static PropertyValuesHolder getPVH(TypedArray styledAttributes, int valueType, int valueFromId, int valueToId, String propertyName) {
        int valueType2;
        int valueTo;
        int valueFrom;
        int valueTo2;
        float valueTo3;
        float valueFrom2;
        float valueTo4;
        TypedArray typedArray = styledAttributes;
        int i = valueFromId;
        int i2 = valueToId;
        String str = propertyName;
        TypedValue tvFrom = typedArray.peekValue(i);
        boolean hasFrom = tvFrom != null;
        int fromType = hasFrom ? tvFrom.type : 0;
        TypedValue tvTo = typedArray.peekValue(i2);
        boolean hasTo = tvTo != null;
        int toType = hasTo ? tvTo.type : 0;
        int i3 = valueType;
        if (i3 != 4) {
            valueType2 = i3;
        } else if ((!hasFrom || !isColorType(fromType)) && (!hasTo || !isColorType(toType))) {
            valueType2 = 0;
        } else {
            valueType2 = 3;
        }
        boolean getFloats = valueType2 == 0;
        PropertyValuesHolder returnValue = null;
        if (valueType2 == 2) {
            String fromString = typedArray.getString(i);
            String toString = typedArray.getString(i2);
            PathParser.PathDataNode[] nodesFrom = PathParser.createNodesFromPathData(fromString);
            TypedValue typedValue = tvFrom;
            PathParser.PathDataNode[] nodesTo = PathParser.createNodesFromPathData(toString);
            if (nodesFrom == null && nodesTo == null) {
                boolean z = hasFrom;
                TypedValue typedValue2 = tvTo;
                boolean z2 = hasTo;
                return null;
            } else if (nodesFrom != null) {
                TypeEvaluator evaluator = new PathDataEvaluator();
                if (nodesTo == null) {
                    PathParser.PathDataNode[] pathDataNodeArr = nodesTo;
                    boolean z3 = hasFrom;
                    TypedValue typedValue3 = tvTo;
                    boolean z4 = hasTo;
                    return PropertyValuesHolder.ofObject(str, evaluator, new Object[]{nodesFrom});
                } else if (PathParser.canMorph(nodesFrom, nodesTo)) {
                    boolean z5 = hasFrom;
                    PathParser.PathDataNode[] pathDataNodeArr2 = nodesTo;
                    TypedValue typedValue4 = tvTo;
                    boolean z6 = hasTo;
                    return PropertyValuesHolder.ofObject(str, evaluator, new Object[]{nodesFrom, nodesTo});
                } else {
                    TypedValue typedValue5 = tvTo;
                    boolean z7 = hasTo;
                    throw new InflateException(" Can't morph from " + fromString + " to " + toString);
                }
            } else {
                PathParser.PathDataNode[] nodesTo2 = nodesTo;
                boolean z8 = hasFrom;
                TypedValue typedValue6 = tvTo;
                boolean z9 = hasTo;
                if (nodesTo2 != null) {
                    return PropertyValuesHolder.ofObject(str, new PathDataEvaluator(), new Object[]{nodesTo2});
                }
                return null;
            }
        } else {
            boolean hasFrom2 = hasFrom;
            TypedValue typedValue7 = tvTo;
            boolean hasTo2 = hasTo;
            TypeEvaluator evaluator2 = null;
            if (valueType2 == 3) {
                evaluator2 = ArgbEvaluator.getInstance();
            }
            if (getFloats) {
                if (hasFrom2) {
                    if (fromType == 5) {
                        valueFrom2 = typedArray.getDimension(i, 0.0f);
                    } else {
                        valueFrom2 = typedArray.getFloat(i, 0.0f);
                    }
                    if (hasTo2) {
                        if (toType == 5) {
                            valueTo4 = typedArray.getDimension(i2, 0.0f);
                        } else {
                            valueTo4 = typedArray.getFloat(i2, 0.0f);
                        }
                        returnValue = PropertyValuesHolder.ofFloat(str, new float[]{valueFrom2, valueTo4});
                    } else {
                        returnValue = PropertyValuesHolder.ofFloat(str, new float[]{valueFrom2});
                    }
                } else {
                    if (toType == 5) {
                        valueTo3 = typedArray.getDimension(i2, 0.0f);
                    } else {
                        valueTo3 = typedArray.getFloat(i2, 0.0f);
                    }
                    returnValue = PropertyValuesHolder.ofFloat(str, new float[]{valueTo3});
                }
            } else if (hasFrom2) {
                if (fromType == 5) {
                    valueFrom = (int) typedArray.getDimension(i, 0.0f);
                } else if (isColorType(fromType) != 0) {
                    valueFrom = typedArray.getColor(i, 0);
                } else {
                    valueFrom = typedArray.getInt(i, 0);
                }
                if (hasTo2) {
                    if (toType == 5) {
                        valueTo2 = (int) typedArray.getDimension(i2, 0.0f);
                    } else if (isColorType(toType)) {
                        valueTo2 = typedArray.getColor(i2, 0);
                    } else {
                        valueTo2 = typedArray.getInt(i2, 0);
                    }
                    returnValue = PropertyValuesHolder.ofInt(str, new int[]{valueFrom, valueTo2});
                } else {
                    returnValue = PropertyValuesHolder.ofInt(str, new int[]{valueFrom});
                }
            } else if (hasTo2) {
                if (toType == 5) {
                    valueTo = (int) typedArray.getDimension(i2, 0.0f);
                } else if (isColorType(toType) != 0) {
                    valueTo = typedArray.getColor(i2, 0);
                } else {
                    valueTo = typedArray.getInt(i2, 0);
                }
                returnValue = PropertyValuesHolder.ofInt(str, new int[]{valueTo});
            }
            if (returnValue == null || evaluator2 == null) {
                return returnValue;
            }
            returnValue.setEvaluator(evaluator2);
            return returnValue;
        }
    }

    private static void parseAnimatorFromTypeArray(ValueAnimator anim, TypedArray arrayAnimator, TypedArray arrayObjectAnimator, float pixelSize, XmlPullParser parser) {
        long duration = (long) TypedArrayUtils.getNamedInt(arrayAnimator, parser, "duration", 1, 300);
        long startDelay = (long) TypedArrayUtils.getNamedInt(arrayAnimator, parser, "startOffset", 2, 0);
        int valueType = TypedArrayUtils.getNamedInt(arrayAnimator, parser, "valueType", 7, 4);
        if (TypedArrayUtils.hasAttribute(parser, "valueFrom") && TypedArrayUtils.hasAttribute(parser, "valueTo")) {
            if (valueType == 4) {
                valueType = inferValueTypeFromValues(arrayAnimator, 5, 6);
            }
            PropertyValuesHolder pvh = getPVH(arrayAnimator, valueType, 5, 6, "");
            if (pvh != null) {
                anim.setValues(new PropertyValuesHolder[]{pvh});
            }
        }
        anim.setDuration(duration);
        anim.setStartDelay(startDelay);
        anim.setRepeatCount(TypedArrayUtils.getNamedInt(arrayAnimator, parser, "repeatCount", 3, 0));
        anim.setRepeatMode(TypedArrayUtils.getNamedInt(arrayAnimator, parser, "repeatMode", 4, 1));
        if (arrayObjectAnimator != null) {
            setupObjectAnimator(anim, arrayObjectAnimator, valueType, pixelSize, parser);
        }
    }

    private static void setupObjectAnimator(ValueAnimator anim, TypedArray arrayObjectAnimator, int valueType, float pixelSize, XmlPullParser parser) {
        ObjectAnimator oa = (ObjectAnimator) anim;
        String pathData = TypedArrayUtils.getNamedString(arrayObjectAnimator, parser, "pathData", 1);
        if (pathData != null) {
            String propertyXName = TypedArrayUtils.getNamedString(arrayObjectAnimator, parser, "propertyXName", 2);
            String propertyYName = TypedArrayUtils.getNamedString(arrayObjectAnimator, parser, "propertyYName", 3);
            if (valueType == 2 || valueType == 4) {
            }
            if (propertyXName == null && propertyYName == null) {
                throw new InflateException(arrayObjectAnimator.getPositionDescription() + " propertyXName or propertyYName is needed for PathData");
            }
            setupPathMotion(PathParser.createPathFromPathData(pathData), oa, 0.5f * pixelSize, propertyXName, propertyYName);
            return;
        }
        oa.setPropertyName(TypedArrayUtils.getNamedString(arrayObjectAnimator, parser, "propertyName", 0));
    }

    private static void setupPathMotion(Path path, ObjectAnimator oa, float precision, String propertyXName, String propertyYName) {
        Path path2 = path;
        ObjectAnimator objectAnimator = oa;
        String str = propertyXName;
        String str2 = propertyYName;
        PathMeasure measureForTotalLength = new PathMeasure(path2, false);
        float totalLength = 0.0f;
        ArrayList<Float> contourLengths = new ArrayList<>();
        contourLengths.add(Float.valueOf(0.0f));
        while (true) {
            totalLength += measureForTotalLength.getLength();
            contourLengths.add(Float.valueOf(totalLength));
            if (!measureForTotalLength.nextContour()) {
                break;
            }
            path2 = path;
        }
        PathMeasure pathMeasure = new PathMeasure(path2, false);
        int i = 1;
        int numPoints = Math.min(100, ((int) (totalLength / precision)) + 1);
        float[] mX = new float[numPoints];
        float[] mY = new float[numPoints];
        float[] position = new float[2];
        int contourIndex = 0;
        float step = totalLength / ((float) (numPoints - 1));
        float currentDistance = 0.0f;
        int i2 = 0;
        while (i2 < numPoints) {
            int i3 = i;
            pathMeasure.getPosTan(currentDistance - contourLengths.get(contourIndex).floatValue(), position, (float[]) null);
            mX[i2] = position[0];
            mY[i2] = position[i3];
            currentDistance += step;
            if (contourIndex + 1 < contourLengths.size() && currentDistance > contourLengths.get(contourIndex + 1).floatValue()) {
                contourIndex++;
                pathMeasure.nextContour();
            }
            i2++;
            Path path3 = path;
            i = i3;
        }
        int i4 = i;
        PropertyValuesHolder x = null;
        PropertyValuesHolder y = null;
        if (str != null) {
            x = PropertyValuesHolder.ofFloat(str, mX);
        }
        if (str2 != null) {
            y = PropertyValuesHolder.ofFloat(str2, mY);
        }
        if (x == null) {
            PropertyValuesHolder[] propertyValuesHolderArr = new PropertyValuesHolder[i4];
            propertyValuesHolderArr[0] = y;
            objectAnimator.setValues(propertyValuesHolderArr);
            return;
        }
        int i5 = i4;
        if (y == null) {
            PropertyValuesHolder[] propertyValuesHolderArr2 = new PropertyValuesHolder[i5];
            propertyValuesHolderArr2[0] = x;
            objectAnimator.setValues(propertyValuesHolderArr2);
            return;
        }
        int i6 = i5;
        PropertyValuesHolder[] propertyValuesHolderArr3 = new PropertyValuesHolder[2];
        propertyValuesHolderArr3[0] = x;
        propertyValuesHolderArr3[i6] = y;
        objectAnimator.setValues(propertyValuesHolderArr3);
    }

    private static Animator createAnimatorFromXml(Context context, Resources res, Resources.Theme theme, XmlPullParser parser, float pixelSize) throws XmlPullParserException, IOException {
        return createAnimatorFromXml(context, res, theme, parser, Xml.asAttributeSet(parser), (AnimatorSet) null, 0, pixelSize);
    }

    private static Animator createAnimatorFromXml(Context context, Resources res, Resources.Theme theme, XmlPullParser parser, AttributeSet attrs, AnimatorSet parent, int sequenceOrdering, float pixelSize) throws XmlPullParserException, IOException {
        AnimatorSet animatorSet = parent;
        int depth = parser.getDepth();
        Animator anim = null;
        ArrayList<Animator> childAnims = null;
        while (true) {
            int next = parser.next();
            int type = next;
            if (next != 3 || parser.getDepth() > depth) {
                if (type == 1) {
                    Context context2 = context;
                    Resources resources = res;
                    Resources.Theme theme2 = theme;
                    XmlPullParser xmlPullParser = parser;
                    break;
                } else if (type == 2) {
                    String name = parser.getName();
                    boolean gotValues = false;
                    if (name.equals("objectAnimator")) {
                        Context context3 = context;
                        XmlPullParser xmlPullParser2 = parser;
                        anim = loadObjectAnimator(context, res, theme, attrs, pixelSize, parser);
                    } else if (name.equals("animator")) {
                        XmlPullParser xmlPullParser3 = parser;
                        anim = loadAnimator(context, res, theme, attrs, (ValueAnimator) null, pixelSize, xmlPullParser3);
                        XmlPullParser xmlPullParser4 = xmlPullParser3;
                        Context context4 = context;
                    } else {
                        Resources resources2 = res;
                        Resources.Theme theme3 = theme;
                        XmlPullParser xmlPullParser5 = parser;
                        if (name.equals("set")) {
                            Animator anim2 = new AnimatorSet();
                            AttributeSet attributeSet = attrs;
                            TypedArray a = TypedArrayUtils.obtainAttributes(resources2, theme3, attributeSet, AndroidResources.STYLEABLE_ANIMATOR_SET);
                            createAnimatorFromXml(context, resources2, theme3, xmlPullParser5, attributeSet, (AnimatorSet) anim2, TypedArrayUtils.getNamedInt(a, xmlPullParser5, "ordering", 0, 0), pixelSize);
                            a.recycle();
                            Context context5 = context;
                            anim = anim2;
                        } else if (name.equals("propertyValuesHolder")) {
                            PropertyValuesHolder[] values = loadValues(context, resources2, theme3, xmlPullParser5, Xml.asAttributeSet(xmlPullParser5));
                            if (values != null && (anim instanceof ValueAnimator)) {
                                ((ValueAnimator) anim).setValues(values);
                            }
                            gotValues = true;
                        } else {
                            Context context6 = context;
                            throw new RuntimeException("Unknown animator name: " + xmlPullParser5.getName());
                        }
                    }
                    if (animatorSet != null && !gotValues) {
                        if (childAnims == null) {
                            childAnims = new ArrayList<>();
                        }
                        childAnims.add(anim);
                    }
                }
            } else {
                Context context7 = context;
                Resources resources3 = res;
                Resources.Theme theme4 = theme;
                XmlPullParser xmlPullParser6 = parser;
                break;
            }
        }
        if (!(animatorSet == null || childAnims == null)) {
            Animator[] animsArray = new Animator[childAnims.size()];
            int index = 0;
            Iterator<Animator> it = childAnims.iterator();
            while (it.hasNext()) {
                animsArray[index] = it.next();
                index++;
            }
            if (sequenceOrdering == 0) {
                animatorSet.playTogether(animsArray);
            } else {
                animatorSet.playSequentially(animsArray);
            }
        }
        return anim;
    }

    private static PropertyValuesHolder[] loadValues(Context context, Resources res, Resources.Theme theme, XmlPullParser parser, AttributeSet attrs) throws XmlPullParserException, IOException {
        XmlPullParser xmlPullParser = parser;
        ArrayList<PropertyValuesHolder> values = null;
        while (true) {
            int eventType = xmlPullParser.getEventType();
            int type = eventType;
            if (eventType == 3 || type == 1) {
                AttributeSet attributeSet = attrs;
                PropertyValuesHolder[] valuesArray = null;
            } else if (type != 2) {
                xmlPullParser.next();
            } else {
                if (xmlPullParser.getName().equals("propertyValuesHolder")) {
                    TypedArray a = TypedArrayUtils.obtainAttributes(res, theme, attrs, AndroidResources.STYLEABLE_PROPERTY_VALUES_HOLDER);
                    String propertyName = TypedArrayUtils.getNamedString(a, xmlPullParser, "propertyName", 3);
                    int valueType = TypedArrayUtils.getNamedInt(a, xmlPullParser, "valueType", 2, 4);
                    PropertyValuesHolder pvh = loadPvh(context, res, theme, xmlPullParser, propertyName, valueType);
                    if (pvh == null) {
                        pvh = getPVH(a, valueType, 0, 1, propertyName);
                    }
                    if (pvh != null) {
                        if (values == null) {
                            values = new ArrayList<>();
                        }
                        values.add(pvh);
                    }
                    a.recycle();
                } else {
                    AttributeSet attributeSet2 = attrs;
                }
                parser.next();
                xmlPullParser = parser;
            }
        }
        AttributeSet attributeSet3 = attrs;
        PropertyValuesHolder[] valuesArray2 = null;
        if (values != null) {
            int count = values.size();
            valuesArray2 = new PropertyValuesHolder[count];
            for (int i = 0; i < count; i++) {
                valuesArray2[i] = values.get(i);
            }
        }
        return valuesArray2;
    }

    private static int inferValueTypeOfKeyframe(Resources res, Resources.Theme theme, AttributeSet attrs, XmlPullParser parser) {
        int valueType;
        TypedArray a = TypedArrayUtils.obtainAttributes(res, theme, attrs, AndroidResources.STYLEABLE_KEYFRAME);
        boolean hasValue = false;
        TypedValue keyframeValue = TypedArrayUtils.peekNamedValue(a, parser, "value", 0);
        if (keyframeValue != null) {
            hasValue = true;
        }
        if (!hasValue || !isColorType(keyframeValue.type)) {
            valueType = 0;
        } else {
            valueType = 3;
        }
        a.recycle();
        return valueType;
    }

    private static int inferValueTypeFromValues(TypedArray styledAttributes, int valueFromId, int valueToId) {
        TypedValue tvFrom = styledAttributes.peekValue(valueFromId);
        boolean hasTo = true;
        int toType = 0;
        boolean hasFrom = tvFrom != null;
        int fromType = hasFrom ? tvFrom.type : 0;
        TypedValue tvTo = styledAttributes.peekValue(valueToId);
        if (tvTo == null) {
            hasTo = false;
        }
        if (hasTo) {
            toType = tvTo.type;
        }
        if ((!hasFrom || !isColorType(fromType)) && (!hasTo || !isColorType(toType))) {
            return 0;
        }
        return 3;
    }

    private static void dumpKeyframes(Object[] keyframes, String header) {
        if (keyframes != null && keyframes.length != 0) {
            Log.d(TAG, header);
            int count = keyframes.length;
            for (int i = 0; i < count; i++) {
                Keyframe keyframe = keyframes[i];
                Object obj = "null";
                StringBuilder append = new StringBuilder().append("Keyframe ").append(i).append(": fraction ").append(keyframe.getFraction() < 0.0f ? obj : Float.valueOf(keyframe.getFraction())).append(", , value : ");
                if (keyframe.hasValue()) {
                    obj = keyframe.getValue();
                }
                Log.d(TAG, append.append(obj).toString());
            }
        }
    }

    /* JADX WARNING: Removed duplicated region for block: B:18:0x0054  */
    /* JADX WARNING: Removed duplicated region for block: B:54:0x0119  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    private static android.animation.PropertyValuesHolder loadPvh(android.content.Context r18, android.content.res.Resources r19, android.content.res.Resources.Theme r20, org.xmlpull.v1.XmlPullParser r21, java.lang.String r22, int r23) throws org.xmlpull.v1.XmlPullParserException, java.io.IOException {
        /*
            r0 = 0
            r1 = 0
            r2 = r1
            r1 = r23
        L_0x0005:
            int r3 = r21.next()
            r4 = r3
            r5 = 3
            if (r3 == r5) goto L_0x0052
            r3 = 1
            if (r4 == r3) goto L_0x0052
            java.lang.String r3 = r21.getName()
            java.lang.String r5 = "keyframe"
            boolean r5 = r3.equals(r5)
            if (r5 == 0) goto L_0x0051
            r5 = 4
            if (r1 != r5) goto L_0x002f
            android.util.AttributeSet r5 = android.util.Xml.asAttributeSet(r21)
            r7 = r19
            r8 = r20
            r11 = r21
            int r1 = inferValueTypeOfKeyframe(r7, r8, r5, r11)
            r10 = r1
            goto L_0x0036
        L_0x002f:
            r7 = r19
            r8 = r20
            r11 = r21
            r10 = r1
        L_0x0036:
            android.util.AttributeSet r9 = android.util.Xml.asAttributeSet(r11)
            r6 = r18
            android.animation.Keyframe r1 = loadKeyframe(r6, r7, r8, r9, r10, r11)
            if (r1 == 0) goto L_0x004d
            if (r2 != 0) goto L_0x004a
            java.util.ArrayList r5 = new java.util.ArrayList
            r5.<init>()
            r2 = r5
        L_0x004a:
            r2.add(r1)
        L_0x004d:
            r21.next()
            r1 = r10
        L_0x0051:
            goto L_0x0005
        L_0x0052:
            if (r2 == 0) goto L_0x0119
            int r3 = r2.size()
            r6 = r3
            if (r3 <= 0) goto L_0x0116
            r3 = 0
            java.lang.Object r7 = r2.get(r3)
            android.animation.Keyframe r7 = (android.animation.Keyframe) r7
            int r8 = r6 + -1
            java.lang.Object r8 = r2.get(r8)
            android.animation.Keyframe r8 = (android.animation.Keyframe) r8
            float r9 = r8.getFraction()
            r10 = 1065353216(0x3f800000, float:1.0)
            int r11 = (r9 > r10 ? 1 : (r9 == r10 ? 0 : -1))
            r12 = 0
            if (r11 >= 0) goto L_0x008a
            int r11 = (r9 > r12 ? 1 : (r9 == r12 ? 0 : -1))
            if (r11 >= 0) goto L_0x007d
            r8.setFraction(r10)
            goto L_0x008a
        L_0x007d:
            int r11 = r2.size()
            android.animation.Keyframe r13 = createNewKeyframe(r8, r10)
            r2.add(r11, r13)
            int r6 = r6 + 1
        L_0x008a:
            float r11 = r7.getFraction()
            int r13 = (r11 > r12 ? 1 : (r11 == r12 ? 0 : -1))
            if (r13 == 0) goto L_0x00a3
            int r13 = (r11 > r12 ? 1 : (r11 == r12 ? 0 : -1))
            if (r13 >= 0) goto L_0x009a
            r7.setFraction(r12)
            goto L_0x00a3
        L_0x009a:
            android.animation.Keyframe r13 = createNewKeyframe(r7, r12)
            r2.add(r3, r13)
            int r6 = r6 + 1
        L_0x00a3:
            android.animation.Keyframe[] r3 = new android.animation.Keyframe[r6]
            r2.toArray(r3)
            r13 = 0
        L_0x00a9:
            if (r13 >= r6) goto L_0x0105
            r14 = r3[r13]
            float r15 = r14.getFraction()
            int r15 = (r15 > r12 ? 1 : (r15 == r12 ? 0 : -1))
            if (r15 >= 0) goto L_0x00fb
            if (r13 != 0) goto L_0x00bd
            r14.setFraction(r12)
            r16 = r12
            goto L_0x00fd
        L_0x00bd:
            int r15 = r6 + -1
            if (r13 != r15) goto L_0x00c7
            r14.setFraction(r10)
            r16 = r12
            goto L_0x00fd
        L_0x00c7:
            r15 = r13
            r16 = r13
            int r17 = r15 + 1
            r10 = r16
            r16 = r12
            r12 = r17
        L_0x00d2:
            int r5 = r6 + -1
            if (r12 >= r5) goto L_0x00e6
            r5 = r3[r12]
            float r5 = r5.getFraction()
            int r5 = (r5 > r16 ? 1 : (r5 == r16 ? 0 : -1))
            if (r5 < 0) goto L_0x00e1
            goto L_0x00e6
        L_0x00e1:
            r10 = r12
            int r12 = r12 + 1
            r5 = 3
            goto L_0x00d2
        L_0x00e6:
            int r5 = r10 + 1
            r5 = r3[r5]
            float r5 = r5.getFraction()
            int r12 = r15 + -1
            r12 = r3[r12]
            float r12 = r12.getFraction()
            float r5 = r5 - r12
            distributeKeyframes(r3, r5, r15, r10)
            goto L_0x00fd
        L_0x00fb:
            r16 = r12
        L_0x00fd:
            int r13 = r13 + 1
            r12 = r16
            r5 = 3
            r10 = 1065353216(0x3f800000, float:1.0)
            goto L_0x00a9
        L_0x0105:
            r5 = r22
            android.animation.PropertyValuesHolder r0 = android.animation.PropertyValuesHolder.ofKeyframe(r5, r3)
            r10 = 3
            if (r1 != r10) goto L_0x011b
            androidx.vectordrawable.graphics.drawable.ArgbEvaluator r10 = androidx.vectordrawable.graphics.drawable.ArgbEvaluator.getInstance()
            r0.setEvaluator(r10)
            goto L_0x011b
        L_0x0116:
            r5 = r22
            goto L_0x011b
        L_0x0119:
            r5 = r22
        L_0x011b:
            return r0
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.vectordrawable.graphics.drawable.AnimatorInflaterCompat.loadPvh(android.content.Context, android.content.res.Resources, android.content.res.Resources$Theme, org.xmlpull.v1.XmlPullParser, java.lang.String, int):android.animation.PropertyValuesHolder");
    }

    private static Keyframe createNewKeyframe(Keyframe sampleKeyframe, float fraction) {
        if (sampleKeyframe.getType() == Float.TYPE) {
            return Keyframe.ofFloat(fraction);
        }
        if (sampleKeyframe.getType() == Integer.TYPE) {
            return Keyframe.ofInt(fraction);
        }
        return Keyframe.ofObject(fraction);
    }

    private static void distributeKeyframes(Keyframe[] keyframes, float gap, int startIndex, int endIndex) {
        float increment = gap / ((float) ((endIndex - startIndex) + 2));
        for (int i = startIndex; i <= endIndex; i++) {
            keyframes[i].setFraction(keyframes[i - 1].getFraction() + increment);
        }
    }

    private static Keyframe loadKeyframe(Context context, Resources res, Resources.Theme theme, AttributeSet attrs, int valueType, XmlPullParser parser) throws XmlPullParserException, IOException {
        Keyframe keyframe;
        TypedArray a = TypedArrayUtils.obtainAttributes(res, theme, attrs, AndroidResources.STYLEABLE_KEYFRAME);
        Keyframe keyframe2 = null;
        float fraction = TypedArrayUtils.getNamedFloat(a, parser, "fraction", 3, -1.0f);
        TypedValue keyframeValue = TypedArrayUtils.peekNamedValue(a, parser, "value", 0);
        boolean hasValue = keyframeValue != null;
        if (valueType == 4) {
            if (!hasValue || !isColorType(keyframeValue.type)) {
                valueType = 0;
            } else {
                valueType = 3;
            }
        }
        if (hasValue) {
            switch (valueType) {
                case 0:
                    keyframe2 = Keyframe.ofFloat(fraction, TypedArrayUtils.getNamedFloat(a, parser, "value", 0, 0.0f));
                    break;
                case 1:
                case 3:
                    keyframe2 = Keyframe.ofInt(fraction, TypedArrayUtils.getNamedInt(a, parser, "value", 0, 0));
                    break;
            }
        } else {
            if (valueType == 0) {
                keyframe = Keyframe.ofFloat(fraction);
            } else {
                keyframe = Keyframe.ofInt(fraction);
            }
            keyframe2 = keyframe;
        }
        int resID = TypedArrayUtils.getNamedResourceId(a, parser, "interpolator", 1, 0);
        if (resID > 0) {
            keyframe2.setInterpolator(AnimationUtilsCompat.loadInterpolator(context, resID));
        }
        a.recycle();
        return keyframe2;
    }

    private static ObjectAnimator loadObjectAnimator(Context context, Resources res, Resources.Theme theme, AttributeSet attrs, float pathErrorScale, XmlPullParser parser) throws Resources.NotFoundException {
        ObjectAnimator anim = new ObjectAnimator();
        loadAnimator(context, res, theme, attrs, anim, pathErrorScale, parser);
        return anim;
    }

    private static ValueAnimator loadAnimator(Context context, Resources res, Resources.Theme theme, AttributeSet attrs, ValueAnimator anim, float pathErrorScale, XmlPullParser parser) throws Resources.NotFoundException {
        TypedArray arrayAnimator = TypedArrayUtils.obtainAttributes(res, theme, attrs, AndroidResources.STYLEABLE_ANIMATOR);
        TypedArray arrayObjectAnimator = TypedArrayUtils.obtainAttributes(res, theme, attrs, AndroidResources.STYLEABLE_PROPERTY_ANIMATOR);
        if (anim == null) {
            anim = new ValueAnimator();
        }
        parseAnimatorFromTypeArray(anim, arrayAnimator, arrayObjectAnimator, pathErrorScale, parser);
        int resID = TypedArrayUtils.getNamedResourceId(arrayAnimator, parser, "interpolator", 0, 0);
        if (resID > 0) {
            anim.setInterpolator(AnimationUtilsCompat.loadInterpolator(context, resID));
        }
        arrayAnimator.recycle();
        if (arrayObjectAnimator != null) {
            arrayObjectAnimator.recycle();
        }
        return anim;
    }

    private static boolean isColorType(int type) {
        return type >= 28 && type <= 31;
    }

    private AnimatorInflaterCompat() {
    }
}
