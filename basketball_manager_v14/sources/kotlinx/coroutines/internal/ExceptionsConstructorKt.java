package kotlinx.coroutines.internal;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import kotlin.Metadata;
import kotlin.Pair;
import kotlin.Result;
import kotlin.ResultKt;
import kotlin.TuplesKt;
import kotlin.jvm.JvmClassMappingKt;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.internal.Intrinsics;
import kotlin.reflect.KClass;
import kotlinx.coroutines.CopyableThrowable;

@Metadata(d1 = {"\u0000&\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u000b\u001a2\u0010\u0004\u001a\u0014\u0012\u0004\u0012\u00020\u0006\u0012\u0006\u0012\u0004\u0018\u00010\u00060\u0005j\u0002`\u0007\"\b\b\u0000\u0010\b*\u00020\u00062\f\u0010\t\u001a\b\u0012\u0004\u0012\u0002H\b0\nH\u0002\u001a.\u0010\u000b\u001a\u0014\u0012\u0004\u0012\u00020\u0006\u0012\u0006\u0012\u0004\u0018\u00010\u00060\u0005j\u0002`\u00072\u0012\u0010\f\u001a\u000e\u0012\u0004\u0012\u00020\u0006\u0012\u0004\u0012\u00020\u00060\u0005H\u0002\u001a!\u0010\r\u001a\u0004\u0018\u0001H\b\"\b\b\u0000\u0010\b*\u00020\u00062\u0006\u0010\u000e\u001a\u0002H\bH\u0000¢\u0006\u0002\u0010\u000f\u001a\u001b\u0010\u0010\u001a\u00020\u0003*\u0006\u0012\u0002\b\u00030\n2\b\b\u0002\u0010\u0011\u001a\u00020\u0003H\u0010\u001a\u0018\u0010\u0012\u001a\u00020\u0003*\u0006\u0012\u0002\b\u00030\n2\u0006\u0010\u0013\u001a\u00020\u0003H\u0002\"\u000e\u0010\u0000\u001a\u00020\u0001X\u0004¢\u0006\u0002\n\u0000\"\u000e\u0010\u0002\u001a\u00020\u0003X\u0004¢\u0006\u0002\n\u0000*(\b\u0002\u0010\u0014\"\u0010\u0012\u0004\u0012\u00020\u0006\u0012\u0006\u0012\u0004\u0018\u00010\u00060\u00052\u0010\u0012\u0004\u0012\u00020\u0006\u0012\u0006\u0012\u0004\u0018\u00010\u00060\u0005¨\u0006\u0015"}, d2 = {"ctorCache", "Lkotlinx/coroutines/internal/CtorCache;", "throwableFields", "", "createConstructor", "Lkotlin/Function1;", "", "Lkotlinx/coroutines/internal/Ctor;", "E", "clz", "Ljava/lang/Class;", "safeCtor", "block", "tryCopyException", "exception", "(Ljava/lang/Throwable;)Ljava/lang/Throwable;", "fieldsCount", "accumulator", "fieldsCountOrDefault", "defaultValue", "Ctor", "kotlinx-coroutines-core"}, k = 2, mv = {1, 9, 0}, xi = 48)
/* compiled from: ExceptionsConstructor.kt */
public final class ExceptionsConstructorKt {
    private static final CtorCache ctorCache;
    private static final int throwableFields = fieldsCountOrDefault(Throwable.class, -1);

    static {
        CtorCache ctorCache2;
        try {
            if (FastServiceLoaderKt.getANDROID_DETECTED()) {
                ctorCache2 = WeakMapCtorCache.INSTANCE;
            } else {
                ctorCache2 = ClassValueCtorCache.INSTANCE;
            }
        } catch (Throwable th) {
            ctorCache2 = WeakMapCtorCache.INSTANCE;
        }
        ctorCache = ctorCache2;
    }

    public static final <E extends Throwable> E tryCopyException(E exception) {
        E e;
        if (!(exception instanceof CopyableThrowable)) {
            return (Throwable) ctorCache.get(exception.getClass()).invoke(exception);
        }
        try {
            Result.Companion companion = Result.Companion;
            e = Result.m101constructorimpl(((CopyableThrowable) exception).createCopy());
        } catch (Throwable th) {
            Result.Companion companion2 = Result.Companion;
            e = Result.m101constructorimpl(ResultKt.createFailure(th));
        }
        if (Result.m107isFailureimpl(e)) {
            e = null;
        }
        return (Throwable) e;
    }

    /* access modifiers changed from: private */
    public static final <E extends Throwable> Function1<Throwable, Throwable> createConstructor(Class<E> clz) {
        Function1<Throwable, Throwable> function1;
        int i;
        Pair<A, B> pair;
        Function1 nullResult = ExceptionsConstructorKt$createConstructor$nullResult$1.INSTANCE;
        int i2 = 0;
        Class<E> cls = clz;
        if (throwableFields != fieldsCountOrDefault(cls, 0)) {
            return nullResult;
        }
        Constructor[] constructors = cls.getConstructors();
        Collection destination$iv$iv = new ArrayList(constructors.length);
        Constructor[] constructorArr = constructors;
        int length = constructorArr.length;
        int i3 = 0;
        while (true) {
            Object maxElem$iv = null;
            if (i3 < length) {
                Constructor constructor = constructorArr[i3];
                Class[] p = constructor.getParameterTypes();
                switch (p.length) {
                    case 0:
                        i = i2;
                        pair = TuplesKt.to(safeCtor(new ExceptionsConstructorKt$createConstructor$1$4(constructor)), Integer.valueOf(i));
                        break;
                    case 1:
                        i = i2;
                        Class cls2 = p[i];
                        if (!Intrinsics.areEqual((Object) cls2, (Object) String.class)) {
                            if (!Intrinsics.areEqual((Object) cls2, (Object) Throwable.class)) {
                                pair = TuplesKt.to(null, -1);
                                break;
                            } else {
                                pair = TuplesKt.to(safeCtor(new ExceptionsConstructorKt$createConstructor$1$3(constructor)), 1);
                                break;
                            }
                        } else {
                            pair = TuplesKt.to(safeCtor(new ExceptionsConstructorKt$createConstructor$1$2(constructor)), 2);
                            break;
                        }
                    case 2:
                        i = i2;
                        if (Intrinsics.areEqual((Object) p[i2], (Object) String.class) && Intrinsics.areEqual((Object) p[1], (Object) Throwable.class)) {
                            pair = TuplesKt.to(safeCtor(new ExceptionsConstructorKt$createConstructor$1$1(constructor)), 3);
                            break;
                        } else {
                            pair = TuplesKt.to(null, -1);
                            break;
                        }
                    default:
                        i = i2;
                        pair = TuplesKt.to(null, -1);
                        break;
                }
                destination$iv$iv.add(pair);
                i3++;
                i2 = i;
            } else {
                Iterator iterator$iv = ((List) destination$iv$iv).iterator();
                if (iterator$iv.hasNext()) {
                    maxElem$iv = iterator$iv.next();
                    if (iterator$iv.hasNext()) {
                        int maxValue$iv = ((Number) ((Pair) maxElem$iv).getSecond()).intValue();
                        do {
                            Object e$iv = iterator$iv.next();
                            int v$iv = ((Number) ((Pair) e$iv).getSecond()).intValue();
                            if (maxValue$iv < v$iv) {
                                maxValue$iv = v$iv;
                                maxElem$iv = e$iv;
                            }
                        } while (iterator$iv.hasNext());
                    }
                }
                Pair pair2 = (Pair) maxElem$iv;
                if (pair2 == null || (function1 = (Function1) pair2.getFirst()) == null) {
                    return nullResult;
                }
                return function1;
            }
        }
    }

    private static final Function1<Throwable, Throwable> safeCtor(Function1<? super Throwable, ? extends Throwable> block) {
        return new ExceptionsConstructorKt$safeCtor$1(block);
    }

    private static final int fieldsCountOrDefault(Class<?> $this$fieldsCountOrDefault, int defaultValue) {
        Integer num;
        KClass<?> kotlinClass = JvmClassMappingKt.getKotlinClass($this$fieldsCountOrDefault);
        try {
            Result.Companion companion = Result.Companion;
            num = Result.m101constructorimpl(Integer.valueOf(fieldsCount$default($this$fieldsCountOrDefault, 0, 1, (Object) null)));
        } catch (Throwable th) {
            Result.Companion companion2 = Result.Companion;
            num = Result.m101constructorimpl(ResultKt.createFailure(th));
        }
        Integer valueOf = Integer.valueOf(defaultValue);
        if (Result.m107isFailureimpl(num)) {
            num = valueOf;
        }
        return ((Number) num).intValue();
    }

    static /* synthetic */ int fieldsCount$default(Class cls, int i, int i2, Object obj) {
        if ((i2 & 1) != 0) {
            i = 0;
        }
        return fieldsCount(cls, i);
    }

    private static final int fieldsCount(Class<?> $this$fieldsCount, int accumulator) {
        while (true) {
            int count$iv = 0;
            for (Field it : $this$fieldsCount.getDeclaredFields()) {
                if (!Modifier.isStatic(it.getModifiers())) {
                    count$iv++;
                }
            }
            int totalFields = accumulator + count$iv;
            Class<?> superClass = $this$fieldsCount.getSuperclass();
            if (superClass == null) {
                return totalFields;
            }
            $this$fieldsCount = superClass;
            accumulator = totalFields;
        }
    }
}
