package androidx.core.graphics;

import android.graphics.Path;
import android.util.Log;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.location.LocationRequestCompat;
import androidx.core.view.MotionEventCompat;
import java.util.ArrayList;
import kotlin.io.encoding.Base64;

public final class PathParser {
    private static final String LOGTAG = "PathParser";

    static float[] copyOfRange(float[] original, int start, int end) {
        if (start <= end) {
            int originalLength = original.length;
            if (start < 0 || start > originalLength) {
                throw new ArrayIndexOutOfBoundsException();
            }
            int resultLength = end - start;
            float[] result = new float[resultLength];
            System.arraycopy(original, start, result, 0, Math.min(resultLength, originalLength - start));
            return result;
        }
        throw new IllegalArgumentException();
    }

    public static Path createPathFromPathData(String pathData) {
        Path path = new Path();
        try {
            PathDataNode.nodesToPath(createNodesFromPathData(pathData), path);
            return path;
        } catch (RuntimeException e) {
            throw new RuntimeException("Error in parsing " + pathData, e);
        }
    }

    public static PathDataNode[] createNodesFromPathData(String pathData) {
        int start = 0;
        int end = 1;
        ArrayList<PathDataNode> list = new ArrayList<>();
        while (end < pathData.length()) {
            int end2 = nextStart(pathData, end);
            String s = pathData.substring(start, end2).trim();
            if (!s.isEmpty()) {
                addNode(list, s.charAt(0), getFloats(s));
            }
            start = end2;
            end = end2 + 1;
        }
        if (end - start == 1 && start < pathData.length()) {
            addNode(list, pathData.charAt(start), new float[0]);
        }
        return (PathDataNode[]) list.toArray(new PathDataNode[0]);
    }

    public static PathDataNode[] deepCopyNodes(PathDataNode[] source) {
        PathDataNode[] copy = new PathDataNode[source.length];
        for (int i = 0; i < source.length; i++) {
            copy[i] = new PathDataNode(source[i]);
        }
        return copy;
    }

    public static boolean canMorph(PathDataNode[] nodesFrom, PathDataNode[] nodesTo) {
        if (nodesFrom == null || nodesTo == null || nodesFrom.length != nodesTo.length) {
            return false;
        }
        for (int i = 0; i < nodesFrom.length; i++) {
            if (nodesFrom[i].mType != nodesTo[i].mType || nodesFrom[i].mParams.length != nodesTo[i].mParams.length) {
                return false;
            }
        }
        return true;
    }

    public static void updateNodes(PathDataNode[] target, PathDataNode[] source) {
        for (int i = 0; i < source.length; i++) {
            char unused = target[i].mType = source[i].mType;
            for (int j = 0; j < source[i].mParams.length; j++) {
                target[i].mParams[j] = source[i].mParams[j];
            }
        }
    }

    private static int nextStart(String s, int end) {
        while (end < s.length()) {
            char c = s.charAt(end);
            if (((c - 'A') * (c - 'Z') <= 0 || (c - 'a') * (c - 'z') <= 0) && c != 'e' && c != 'E') {
                return end;
            }
            end++;
        }
        return end;
    }

    private static void addNode(ArrayList<PathDataNode> list, char cmd, float[] val) {
        list.add(new PathDataNode(cmd, val));
    }

    private static class ExtractFloatResult {
        int mEndPosition;
        boolean mEndWithNegOrDot;

        ExtractFloatResult() {
        }
    }

    private static float[] getFloats(String s) {
        if (s.charAt(0) == 'z' || s.charAt(0) == 'Z') {
            return new float[0];
        }
        try {
            float[] results = new float[s.length()];
            int count = 0;
            int startPosition = 1;
            ExtractFloatResult result = new ExtractFloatResult();
            int totalLength = s.length();
            while (startPosition < totalLength) {
                extract(s, startPosition, result);
                int endPosition = result.mEndPosition;
                if (startPosition < endPosition) {
                    results[count] = Float.parseFloat(s.substring(startPosition, endPosition));
                    count++;
                }
                if (result.mEndWithNegOrDot != 0) {
                    startPosition = endPosition;
                } else {
                    startPosition = endPosition + 1;
                }
            }
            return copyOfRange(results, 0, count);
        } catch (NumberFormatException e) {
            throw new RuntimeException("error in parsing \"" + s + "\"", e);
        }
    }

    private static void extract(String s, int start, ExtractFloatResult result) {
        boolean foundSeparator = false;
        result.mEndWithNegOrDot = false;
        boolean secondDot = false;
        boolean isExponential = false;
        for (int currentIndex = start; currentIndex < s.length(); currentIndex++) {
            boolean isPrevExponential = isExponential;
            isExponential = false;
            switch (s.charAt(currentIndex)) {
                case ' ':
                case MotionEventCompat.AXIS_GENERIC_13 /*44*/:
                    foundSeparator = true;
                    break;
                case MotionEventCompat.AXIS_GENERIC_14 /*45*/:
                    if (currentIndex != start && !isPrevExponential) {
                        foundSeparator = true;
                        result.mEndWithNegOrDot = true;
                        break;
                    }
                case MotionEventCompat.AXIS_GENERIC_15 /*46*/:
                    if (secondDot) {
                        foundSeparator = true;
                        result.mEndWithNegOrDot = true;
                        break;
                    } else {
                        secondDot = true;
                        break;
                    }
                case 'E':
                case 'e':
                    isExponential = true;
                    break;
            }
            if (foundSeparator) {
                result.mEndPosition = currentIndex;
            }
        }
        result.mEndPosition = currentIndex;
    }

    public static void interpolatePathDataNodes(PathDataNode[] target, float fraction, PathDataNode[] from, PathDataNode[] to) {
        if (!interpolatePathDataNodes(target, from, to, fraction)) {
            throw new IllegalArgumentException("Can't interpolate between two incompatible pathData");
        }
    }

    @Deprecated
    public static boolean interpolatePathDataNodes(PathDataNode[] target, PathDataNode[] from, PathDataNode[] to, float fraction) {
        if (target.length != from.length || from.length != to.length) {
            throw new IllegalArgumentException("The nodes to be interpolated and resulting nodes must have the same length");
        } else if (!canMorph(from, to)) {
            return false;
        } else {
            for (int i = 0; i < target.length; i++) {
                target[i].interpolatePathDataNode(from[i], to[i], fraction);
            }
            return true;
        }
    }

    public static void nodesToPath(PathDataNode[] node, Path path) {
        float[] current = new float[6];
        char previousCommand = 'm';
        for (PathDataNode pathDataNode : node) {
            PathDataNode.addCommand(path, current, previousCommand, pathDataNode.mType, pathDataNode.mParams);
            previousCommand = pathDataNode.mType;
        }
    }

    public static class PathDataNode {
        /* access modifiers changed from: private */
        public final float[] mParams;
        /* access modifiers changed from: private */
        public char mType;

        public char getType() {
            return this.mType;
        }

        public float[] getParams() {
            return this.mParams;
        }

        PathDataNode(char type, float[] params) {
            this.mType = type;
            this.mParams = params;
        }

        PathDataNode(PathDataNode n) {
            this.mType = n.mType;
            this.mParams = PathParser.copyOfRange(n.mParams, 0, n.mParams.length);
        }

        @Deprecated
        public static void nodesToPath(PathDataNode[] node, Path path) {
            PathParser.nodesToPath(node, path);
        }

        public void interpolatePathDataNode(PathDataNode nodeFrom, PathDataNode nodeTo, float fraction) {
            this.mType = nodeFrom.mType;
            for (int i = 0; i < nodeFrom.mParams.length; i++) {
                this.mParams[i] = (nodeFrom.mParams[i] * (1.0f - fraction)) + (nodeTo.mParams[i] * fraction);
            }
        }

        /* access modifiers changed from: private */
        public static void addCommand(Path path, float[] current, char previousCmd, char cmd, float[] val) {
            int incr;
            int k;
            float currentX;
            float reflectiveCtrlPointY;
            boolean z;
            int k2;
            boolean z2;
            int k3;
            float currentX2;
            float reflectiveCtrlPointY2;
            Path path2 = path;
            float[] fArr = val;
            boolean z3 = false;
            float currentX3 = current[0];
            boolean z4 = true;
            float currentY = current[1];
            char c = 2;
            float ctrlPointX = current[2];
            float ctrlPointY = current[3];
            float currentSegmentStartX = current[4];
            float currentSegmentStartY = current[5];
            switch (cmd) {
                case 'A':
                case 'a':
                    incr = 7;
                    break;
                case 'C':
                case 'c':
                    incr = 6;
                    break;
                case 'H':
                case 'V':
                case LocationRequestCompat.QUALITY_LOW_POWER:
                case 'v':
                    incr = 1;
                    break;
                case Base64.mimeLineLength /*76*/:
                case 'M':
                case 'T':
                case AppCompatDelegate.FEATURE_SUPPORT_ACTION_BAR:
                case AppCompatDelegate.FEATURE_SUPPORT_ACTION_BAR_OVERLAY:
                case 't':
                    incr = 2;
                    break;
                case 'Q':
                case 'S':
                case 'q':
                case 's':
                    incr = 4;
                    break;
                case 'Z':
                case 'z':
                    path2.close();
                    currentX3 = currentSegmentStartX;
                    currentY = currentSegmentStartY;
                    ctrlPointX = currentSegmentStartX;
                    ctrlPointY = currentSegmentStartY;
                    path2.moveTo(currentX3, currentY);
                    incr = 2;
                    break;
                default:
                    incr = 2;
                    break;
            }
            int k4 = 0;
            float currentX4 = currentX3;
            float currentY2 = currentY;
            float ctrlPointX2 = ctrlPointX;
            float ctrlPointY2 = ctrlPointY;
            float currentSegmentStartX2 = currentSegmentStartX;
            float currentSegmentStartY2 = currentSegmentStartY;
            char previousCmd2 = previousCmd;
            while (k4 < fArr.length) {
                boolean z5 = z3;
                boolean z6 = z4;
                char c2 = c;
                switch (cmd) {
                    case 'A':
                        float f = currentY2;
                        k = k4;
                        float currentY3 = f;
                        char c3 = previousCmd2;
                        drawArc(path, currentX4, currentY3, fArr[k + 5], fArr[k + 6], fArr[k + 0], fArr[k + 1], fArr[k + 2], fArr[k + 3] != 0.0f ? z6 : z5, fArr[k + 4] != 0.0f ? z6 : z5);
                        float currentX5 = fArr[k + 5];
                        currentX = fArr[k + 6];
                        currentX4 = currentX5;
                        ctrlPointX2 = currentX5;
                        ctrlPointY2 = currentX;
                        break;
                    case 'C':
                        float f2 = currentY2;
                        k = k4;
                        float f3 = f2;
                        char previousCmd3 = previousCmd2;
                        float f4 = currentX4;
                        path2.cubicTo(fArr[k + 0], fArr[k + 1], fArr[k + 2], fArr[k + 3], fArr[k + 4], fArr[k + 5]);
                        float currentX6 = fArr[k + 4];
                        currentX = fArr[k + 5];
                        currentX4 = currentX6;
                        ctrlPointX2 = fArr[k + 2];
                        ctrlPointY2 = fArr[k + 3];
                        char c4 = previousCmd3;
                        break;
                    case 'H':
                        float f5 = currentY2;
                        k = k4;
                        float currentY4 = f5;
                        char previousCmd4 = previousCmd2;
                        float f6 = currentX4;
                        path2.lineTo(fArr[k + 0], currentY4);
                        currentX4 = fArr[k + 0];
                        currentX = currentY4;
                        char c5 = previousCmd4;
                        break;
                    case Base64.mimeLineLength /*76*/:
                        float f7 = currentY2;
                        k = k4;
                        float f8 = f7;
                        char previousCmd5 = previousCmd2;
                        float f9 = currentX4;
                        path2.lineTo(fArr[k + 0], fArr[k + 1]);
                        currentX4 = fArr[k + 0];
                        currentX = fArr[k + 1];
                        char c6 = previousCmd5;
                        break;
                    case 'M':
                        float f10 = currentY2;
                        k = k4;
                        float f11 = f10;
                        char previousCmd6 = previousCmd2;
                        float f12 = currentX4;
                        float currentX7 = fArr[k + 0];
                        float currentY5 = fArr[k + 1];
                        if (k <= 0) {
                            path2.moveTo(fArr[k + 0], fArr[k + 1]);
                            float currentSegmentStartX3 = currentX7;
                            currentX4 = currentX7;
                            currentX = currentY5;
                            currentSegmentStartX2 = currentSegmentStartX3;
                            currentSegmentStartY2 = currentY5;
                            char c7 = previousCmd6;
                            break;
                        } else {
                            path2.lineTo(fArr[k + 0], fArr[k + 1]);
                            currentX4 = currentX7;
                            currentX = currentY5;
                            char c8 = previousCmd6;
                            break;
                        }
                    case 'Q':
                        float f13 = currentY2;
                        k = k4;
                        float f14 = f13;
                        char previousCmd7 = previousCmd2;
                        float f15 = currentX4;
                        path2.quadTo(fArr[k + 0], fArr[k + 1], fArr[k + 2], fArr[k + 3]);
                        ctrlPointX2 = fArr[k + 0];
                        ctrlPointY2 = fArr[k + 1];
                        currentX4 = fArr[k + 2];
                        currentX = fArr[k + 3];
                        char c9 = previousCmd7;
                        break;
                    case 'S':
                        float f16 = currentY2;
                        k = k4;
                        float currentY6 = f16;
                        char previousCmd8 = previousCmd2;
                        float currentX8 = currentX4;
                        float reflectiveCtrlPointX = currentX8;
                        float reflectiveCtrlPointY3 = currentY6;
                        if (previousCmd8 == 'c' || previousCmd8 == 's' || previousCmd8 == 'C' || previousCmd8 == 'S') {
                            reflectiveCtrlPointX = (currentX8 * 2.0f) - ctrlPointX2;
                            reflectiveCtrlPointY = (currentY6 * 2.0f) - ctrlPointY2;
                        } else {
                            reflectiveCtrlPointY = reflectiveCtrlPointY3;
                        }
                        path2.cubicTo(reflectiveCtrlPointX, reflectiveCtrlPointY, fArr[k + 0], fArr[k + 1], fArr[k + 2], fArr[k + 3]);
                        ctrlPointX2 = fArr[k + 0];
                        ctrlPointY2 = fArr[k + 1];
                        currentX4 = fArr[k + 2];
                        currentX = fArr[k + 3];
                        char c10 = previousCmd8;
                        break;
                    case 'T':
                        float f17 = currentY2;
                        k = k4;
                        float currentY7 = f17;
                        char previousCmd9 = previousCmd2;
                        float currentX9 = currentX4;
                        float reflectiveCtrlPointX2 = currentX9;
                        float reflectiveCtrlPointY4 = currentY7;
                        if (previousCmd9 == 'q' || previousCmd9 == 't' || previousCmd9 == 'Q' || previousCmd9 == 'T') {
                            reflectiveCtrlPointX2 = (currentX9 * 2.0f) - ctrlPointX2;
                            reflectiveCtrlPointY4 = (currentY7 * 2.0f) - ctrlPointY2;
                        }
                        path2.quadTo(reflectiveCtrlPointX2, reflectiveCtrlPointY4, fArr[k + 0], fArr[k + 1]);
                        ctrlPointX2 = reflectiveCtrlPointX2;
                        ctrlPointY2 = reflectiveCtrlPointY4;
                        currentX4 = fArr[k + 0];
                        currentX = fArr[k + 1];
                        char c11 = previousCmd9;
                        break;
                    case 'V':
                        float f18 = currentY2;
                        k = k4;
                        float f19 = f18;
                        path2.lineTo(currentX4, fArr[k + 0]);
                        currentX = fArr[k + 0];
                        char c12 = previousCmd2;
                        break;
                    case 'a':
                        float f20 = fArr[k4 + 5] + currentX4;
                        float f21 = fArr[k4 + 6] + currentY2;
                        float f22 = fArr[k4 + 0];
                        float f23 = fArr[k4 + 1];
                        float f24 = fArr[k4 + 2];
                        if (fArr[k4 + 3] != 0.0f) {
                            k2 = k4;
                            z = z6;
                        } else {
                            k2 = k4;
                            z = z5;
                        }
                        if (fArr[k2 + 4] != 0.0f) {
                            k3 = k2;
                            currentX2 = currentX4;
                            z2 = z6;
                        } else {
                            k3 = k2;
                            currentX2 = currentX4;
                            z2 = z5;
                        }
                        float f25 = currentY2;
                        k = k3;
                        float currentY8 = f25;
                        drawArc(path, currentX2, currentY8, f20, f21, f22, f23, f24, z, z2);
                        currentX4 = currentX2 + fArr[k + 5];
                        currentX = fArr[k + 6] + currentY8;
                        ctrlPointX2 = currentX4;
                        ctrlPointY2 = currentX;
                        char c13 = previousCmd2;
                        break;
                    case 'c':
                        path2.rCubicTo(fArr[k4 + 0], fArr[k4 + 1], fArr[k4 + 2], fArr[k4 + 3], fArr[k4 + 4], fArr[k4 + 5]);
                        float ctrlPointX3 = fArr[k4 + 2] + currentX4;
                        float ctrlPointY3 = currentY2 + fArr[k4 + 3];
                        currentX4 += fArr[k4 + 4];
                        ctrlPointX2 = ctrlPointX3;
                        ctrlPointY2 = ctrlPointY3;
                        char c14 = previousCmd2;
                        currentX = currentY2 + fArr[k4 + 5];
                        k = k4;
                        break;
                    case LocationRequestCompat.QUALITY_LOW_POWER:
                        path2.rLineTo(fArr[k4 + 0], 0.0f);
                        currentX4 += fArr[k4 + 0];
                        char c15 = previousCmd2;
                        currentX = currentY2;
                        k = k4;
                        break;
                    case AppCompatDelegate.FEATURE_SUPPORT_ACTION_BAR:
                        path2.rLineTo(fArr[k4 + 0], fArr[k4 + 1]);
                        currentX4 += fArr[k4 + 0];
                        char c16 = previousCmd2;
                        currentX = currentY2 + fArr[k4 + 1];
                        k = k4;
                        break;
                    case AppCompatDelegate.FEATURE_SUPPORT_ACTION_BAR_OVERLAY:
                        currentX4 += fArr[k4 + 0];
                        float currentY9 = currentY2 + fArr[k4 + 1];
                        if (k4 <= 0) {
                            path2.rMoveTo(fArr[k4 + 0], fArr[k4 + 1]);
                            currentSegmentStartX2 = currentX4;
                            currentSegmentStartY2 = currentY9;
                            char c17 = previousCmd2;
                            currentX = currentY9;
                            k = k4;
                            break;
                        } else {
                            path2.rLineTo(fArr[k4 + 0], fArr[k4 + 1]);
                            char c18 = previousCmd2;
                            currentX = currentY9;
                            k = k4;
                            break;
                        }
                    case 'q':
                        path2.rQuadTo(fArr[k4 + 0], fArr[k4 + 1], fArr[k4 + 2], fArr[k4 + 3]);
                        float ctrlPointX4 = fArr[k4 + 0] + currentX4;
                        float ctrlPointY4 = currentY2 + fArr[k4 + 1];
                        currentX4 += fArr[k4 + 2];
                        ctrlPointX2 = ctrlPointX4;
                        ctrlPointY2 = ctrlPointY4;
                        char c19 = previousCmd2;
                        currentX = currentY2 + fArr[k4 + 3];
                        k = k4;
                        break;
                    case 's':
                        float reflectiveCtrlPointX3 = 0.0f;
                        if (previousCmd2 == 'c' || previousCmd2 == 's' || previousCmd2 == 'C' || previousCmd2 == 'S') {
                            reflectiveCtrlPointX3 = currentX4 - ctrlPointX2;
                            reflectiveCtrlPointY2 = currentY2 - ctrlPointY2;
                        } else {
                            reflectiveCtrlPointY2 = 0.0f;
                        }
                        path2.rCubicTo(reflectiveCtrlPointX3, reflectiveCtrlPointY2, fArr[k4 + 0], fArr[k4 + 1], fArr[k4 + 2], fArr[k4 + 3]);
                        float ctrlPointX5 = fArr[k4 + 0] + currentX4;
                        float ctrlPointY5 = currentY2 + fArr[k4 + 1];
                        currentX4 += fArr[k4 + 2];
                        ctrlPointX2 = ctrlPointX5;
                        ctrlPointY2 = ctrlPointY5;
                        char c20 = previousCmd2;
                        currentX = currentY2 + fArr[k4 + 3];
                        k = k4;
                        break;
                    case 't':
                        float reflectiveCtrlPointX4 = 0.0f;
                        float reflectiveCtrlPointY5 = 0.0f;
                        if (previousCmd2 == 'q' || previousCmd2 == 't' || previousCmd2 == 'Q' || previousCmd2 == 'T') {
                            reflectiveCtrlPointX4 = currentX4 - ctrlPointX2;
                            reflectiveCtrlPointY5 = currentY2 - ctrlPointY2;
                        }
                        path2.rQuadTo(reflectiveCtrlPointX4, reflectiveCtrlPointY5, fArr[k4 + 0], fArr[k4 + 1]);
                        float ctrlPointX6 = currentX4 + reflectiveCtrlPointX4;
                        currentX4 += fArr[k4 + 0];
                        ctrlPointX2 = ctrlPointX6;
                        ctrlPointY2 = currentY2 + reflectiveCtrlPointY5;
                        char c21 = previousCmd2;
                        currentX = currentY2 + fArr[k4 + 1];
                        k = k4;
                        break;
                    case 'v':
                        path2.rLineTo(0.0f, fArr[k4 + 0]);
                        char c22 = previousCmd2;
                        currentX = currentY2 + fArr[k4 + 0];
                        k = k4;
                        break;
                    default:
                        char c23 = previousCmd2;
                        float f26 = currentX4;
                        float currentY10 = currentY2;
                        k = k4;
                        currentX = currentY10;
                        break;
                }
                previousCmd2 = cmd;
                k4 = k + incr;
                path2 = path;
                currentY2 = currentX;
                z3 = z5;
                z4 = z6;
                c = c2;
            }
            current[z3] = currentX4;
            current[z4] = currentY2;
            current[c] = ctrlPointX2;
            current[3] = ctrlPointY2;
            current[4] = currentSegmentStartX2;
            current[5] = currentSegmentStartY2;
        }

        private static void drawArc(Path p, float x0, float y0, float x1, float y1, float a, float b, float theta, boolean isMoreThanHalf, boolean isPositiveArc) {
            double cy;
            double cx;
            double sweep;
            float f = x0;
            float f2 = y0;
            float f3 = x1;
            float f4 = y1;
            float f5 = a;
            float f6 = b;
            float f7 = theta;
            double thetaD = Math.toRadians((double) f7);
            double cosTheta = Math.cos(thetaD);
            double sinTheta = Math.sin(thetaD);
            double x0p = ((((double) f) * cosTheta) + (((double) f2) * sinTheta)) / ((double) f5);
            double y0p = ((((double) (-f)) * sinTheta) + (((double) f2) * cosTheta)) / ((double) f6);
            double x1p = ((((double) f3) * cosTheta) + (((double) f4) * sinTheta)) / ((double) f5);
            double y1p = ((((double) (-f3)) * sinTheta) + (((double) f4) * cosTheta)) / ((double) f6);
            double dx = x0p - x1p;
            double dy = y0p - y1p;
            double xm = (x0p + x1p) / 2.0d;
            double ym = (y0p + y1p) / 2.0d;
            double dsq = (dx * dx) + (dy * dy);
            if (dsq == 0.0d) {
                Log.w(PathParser.LOGTAG, " Points are coincident");
                return;
            }
            double disc = (1.0d / dsq) - 0.25d;
            if (disc < 0.0d) {
                Log.w(PathParser.LOGTAG, "Points are too far apart " + dsq);
                float adjust = (float) (Math.sqrt(dsq) / 1.99999d);
                drawArc(p, f, f2, f3, f4, f5 * adjust, f6 * adjust, f7, isMoreThanHalf, isPositiveArc);
                return;
            }
            boolean z = isPositiveArc;
            double s = Math.sqrt(disc);
            double sdx = s * dx;
            double sdy = s * dy;
            if (isMoreThanHalf == z) {
                cx = xm - sdy;
                cy = ym + sdx;
            } else {
                cx = xm + sdy;
                cy = ym - sdx;
            }
            double d = s;
            double eta0 = Math.atan2(y0p - cy, x0p - cx);
            double eta1 = Math.atan2(y1p - cy, x1p - cx);
            double sweep2 = eta1 - eta0;
            if (z == (sweep2 >= 0.0d)) {
                sweep = sweep2;
            } else if (sweep2 > 0.0d) {
                sweep = sweep2 - 6.283185307179586d;
            } else {
                sweep = sweep2 + 6.283185307179586d;
            }
            double cx2 = cx * ((double) f5);
            double cy2 = cy * ((double) f6);
            double d2 = eta1;
            double d3 = dsq;
            arcToBezier(p, (cx2 * cosTheta) - (cy2 * sinTheta), (cx2 * sinTheta) + (cy2 * cosTheta), (double) f5, (double) f6, (double) f, (double) f2, thetaD, eta0, sweep);
        }

        private static void arcToBezier(Path p, double cx, double cy, double a, double b, double e1x, double e1y, double theta, double start, double sweep) {
            double e1x2 = a;
            int numSegments = (int) Math.ceil(Math.abs((sweep * 4.0d) / 3.141592653589793d));
            double eta1 = start;
            double cosTheta = Math.cos(theta);
            double sinTheta = Math.sin(theta);
            double cosEta1 = Math.cos(eta1);
            double sinEta1 = Math.sin(eta1);
            double ep1y = ((-e1x2) * sinTheta * sinEta1) + (b * cosTheta * cosEta1);
            double anglePerSegment = sweep / ((double) numSegments);
            double eta12 = eta1;
            int i = 0;
            double eta13 = e1x;
            double ep1x = (((-e1x2) * cosTheta) * sinEta1) - ((b * sinTheta) * cosEta1);
            double e1y2 = e1y;
            while (i < numSegments) {
                double eta2 = eta12 + anglePerSegment;
                double sinEta2 = Math.sin(eta2);
                double cosEta2 = Math.cos(eta2);
                double anglePerSegment2 = anglePerSegment;
                double e2x = (cx + ((e1x2 * cosTheta) * cosEta2)) - ((b * sinTheta) * sinEta2);
                int numSegments2 = numSegments;
                double e2y = cy + (e1x2 * sinTheta * cosEta2) + (b * cosTheta * sinEta2);
                double cosTheta2 = cosTheta;
                double ep2x = (((-e1x2) * cosTheta2) * sinEta2) - ((b * sinTheta) * cosEta2);
                double ep2y = ((-e1x2) * sinTheta * sinEta2) + (b * cosTheta2 * cosEta2);
                double tanDiff2 = Math.tan((eta2 - eta12) / 2.0d);
                double alpha = (Math.sin(eta2 - eta12) * (Math.sqrt(((tanDiff2 * 3.0d) * tanDiff2) + 4.0d) - 1.0d)) / 3.0d;
                double q1x = eta13 + (alpha * ep1x);
                double ep2y2 = ep2y;
                double sinEta12 = sinEta1;
                Path path = p;
                path.rLineTo(0.0f, 0.0f);
                double d = q1x;
                float f = (float) q1x;
                Path path2 = path;
                float f2 = (float) (e1y2 + (alpha * ep1y));
                path2.cubicTo(f, f2, (float) (e2x - (alpha * ep2x)), (float) (e2y - (alpha * ep2y2)), (float) e2x, (float) e2y);
                eta12 = eta2;
                e1y2 = e2y;
                ep1x = ep2x;
                ep1y = ep2y2;
                i++;
                eta13 = e2x;
                numSegments = numSegments2;
                cosTheta = cosTheta2;
                anglePerSegment = anglePerSegment2;
                sinEta1 = sinEta12;
                sinTheta = sinTheta;
                cosEta1 = cosEta1;
                e1x2 = a;
            }
        }
    }

    private PathParser() {
    }
}
