package kotlinx.coroutines.channels;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.concurrent.CancellationException;
import kotlin.Deprecated;
import kotlin.DeprecationLevel;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlin.coroutines.CoroutineContext;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.functions.Function2;
import kotlin.jvm.functions.Function3;
import kotlin.jvm.internal.Intrinsics;
import kotlinx.coroutines.CoroutineStart;
import kotlinx.coroutines.Dispatchers;
import kotlinx.coroutines.GlobalScope;
import kotlinx.coroutines.channels.ReceiveChannel;

@Metadata(d1 = {"\u0000®\u0001\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0011\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000b\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0006\n\u0002\u0010\b\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u000b\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010\u001f\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0011\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u000b\n\u0002\u0010$\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010%\n\u0002\b\u0002\n\u0002\u0010!\n\u0000\n\u0002\u0010#\n\u0000\n\u0002\u0010\"\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0005\u001aJ\u0010\u0000\u001a#\u0012\u0015\u0012\u0013\u0018\u00010\u0002¢\u0006\f\b\u0003\u0012\b\b\u0004\u0012\u0004\b\b(\u0005\u0012\u0004\u0012\u00020\u00060\u0001j\u0002`\u00072\u001a\u0010\b\u001a\u000e\u0012\n\b\u0001\u0012\u0006\u0012\u0002\b\u00030\n0\t\"\u0006\u0012\u0002\b\u00030\nH\u0001¢\u0006\u0002\u0010\u000b\u001a\u001e\u0010\f\u001a\u00020\r\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\nH@¢\u0006\u0002\u0010\u000f\u001aC\u0010\u0010\u001a\u0002H\u0011\"\u0004\b\u0000\u0010\u000e\"\u0004\b\u0001\u0010\u0011*\b\u0012\u0004\u0012\u0002H\u000e0\u00122\u001d\u0010\u0013\u001a\u0019\u0012\n\u0012\b\u0012\u0004\u0012\u0002H\u000e0\n\u0012\u0004\u0012\u0002H\u00110\u0001¢\u0006\u0002\b\u0014H\b¢\u0006\u0002\u0010\u0015\u001a2\u0010\u0016\u001a\u00020\u0006\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\u00122\u0012\u0010\u0017\u001a\u000e\u0012\u0004\u0012\u0002H\u000e\u0012\u0004\u0012\u00020\u00060\u0001HH¢\u0006\u0002\u0010\u0018\u001a1\u0010\u0019\u001a#\u0012\u0015\u0012\u0013\u0018\u00010\u0002¢\u0006\f\b\u0003\u0012\b\b\u0004\u0012\u0004\b\b(\u0005\u0012\u0004\u0012\u00020\u00060\u0001j\u0002`\u0007*\u0006\u0012\u0002\b\u00030\nH\u0001\u001a\u001e\u0010\u001a\u001a\u00020\u001b\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\nH@¢\u0006\u0002\u0010\u000f\u001a\u001e\u0010\u001c\u001a\b\u0012\u0004\u0012\u0002H\u000e0\n\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\nH\u0007\u001aW\u0010\u001d\u001a\b\u0012\u0004\u0012\u0002H\u000e0\n\"\u0004\b\u0000\u0010\u000e\"\u0004\b\u0001\u0010\u001e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\b\b\u0002\u0010\u001f\u001a\u00020 2\"\u0010!\u001a\u001e\b\u0001\u0012\u0004\u0012\u0002H\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u0002H\u001e0#\u0012\u0006\u0012\u0004\u0018\u00010$0\"H\u0001¢\u0006\u0002\u0010%\u001a0\u0010&\u001a\b\u0012\u0004\u0012\u0002H\u000e0\n\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\u0006\u0010'\u001a\u00020\u001b2\b\b\u0002\u0010\u001f\u001a\u00020 H\u0007\u001aQ\u0010(\u001a\b\u0012\u0004\u0012\u0002H\u000e0\n\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\b\b\u0002\u0010\u001f\u001a\u00020 2\"\u0010)\u001a\u001e\b\u0001\u0012\u0004\u0012\u0002H\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\r0#\u0012\u0006\u0012\u0004\u0018\u00010$0\"H\u0007¢\u0006\u0002\u0010%\u001a&\u0010*\u001a\u0002H\u000e\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\u0006\u0010+\u001a\u00020\u001bH@¢\u0006\u0002\u0010,\u001a(\u0010-\u001a\u0004\u0018\u0001H\u000e\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\u0006\u0010+\u001a\u00020\u001bH@¢\u0006\u0002\u0010,\u001aQ\u0010.\u001a\b\u0012\u0004\u0012\u0002H\u000e0\n\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\b\b\u0002\u0010\u001f\u001a\u00020 2\"\u0010)\u001a\u001e\b\u0001\u0012\u0004\u0012\u0002H\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\r0#\u0012\u0006\u0012\u0004\u0018\u00010$0\"H\u0001¢\u0006\u0002\u0010%\u001af\u0010/\u001a\b\u0012\u0004\u0012\u0002H\u000e0\n\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\b\b\u0002\u0010\u001f\u001a\u00020 27\u0010)\u001a3\b\u0001\u0012\u0013\u0012\u00110\u001b¢\u0006\f\b\u0003\u0012\b\b\u0004\u0012\u0004\b\b(+\u0012\u0004\u0012\u0002H\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\r0#\u0012\u0006\u0012\u0004\u0018\u00010$00H\u0007¢\u0006\u0002\u00101\u001aQ\u00102\u001a\b\u0012\u0004\u0012\u0002H\u000e0\n\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\b\b\u0002\u0010\u001f\u001a\u00020 2\"\u0010)\u001a\u001e\b\u0001\u0012\u0004\u0012\u0002H\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\r0#\u0012\u0006\u0012\u0004\u0018\u00010$0\"H\u0007¢\u0006\u0002\u0010%\u001a$\u00103\u001a\b\u0012\u0004\u0012\u0002H\u000e0\n\"\b\b\u0000\u0010\u000e*\u00020$*\n\u0012\u0006\u0012\u0004\u0018\u0001H\u000e0\nH\u0001\u001a>\u00104\u001a\u0002H5\"\b\b\u0000\u0010\u000e*\u00020$\"\u0010\b\u0001\u00105*\n\u0012\u0006\b\u0000\u0012\u0002H\u000e06*\n\u0012\u0006\u0012\u0004\u0018\u0001H\u000e0\n2\u0006\u00107\u001a\u0002H5H@¢\u0006\u0002\u00108\u001a<\u00104\u001a\u0002H5\"\b\b\u0000\u0010\u000e*\u00020$\"\u000e\b\u0001\u00105*\b\u0012\u0004\u0012\u0002H\u000e09*\n\u0012\u0006\u0012\u0004\u0018\u0001H\u000e0\n2\u0006\u00107\u001a\u0002H5H@¢\u0006\u0002\u0010:\u001a\u001e\u0010;\u001a\u0002H\u000e\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\nH@¢\u0006\u0002\u0010\u000f\u001a \u0010<\u001a\u0004\u0018\u0001H\u000e\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\nH@¢\u0006\u0002\u0010\u000f\u001a]\u0010=\u001a\b\u0012\u0004\u0012\u0002H\u00110\n\"\u0004\b\u0000\u0010\u000e\"\u0004\b\u0001\u0010\u0011*\b\u0012\u0004\u0012\u0002H\u000e0\n2\b\b\u0002\u0010\u001f\u001a\u00020 2(\u0010>\u001a$\b\u0001\u0012\u0004\u0012\u0002H\u000e\u0012\u0010\u0012\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u0002H\u00110\n0#\u0012\u0006\u0012\u0004\u0018\u00010$0\"H\u0007¢\u0006\u0002\u0010%\u001a&\u0010?\u001a\u00020\u001b\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\u0006\u0010@\u001a\u0002H\u000eH@¢\u0006\u0002\u0010A\u001a\u001e\u0010B\u001a\u0002H\u000e\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\nH@¢\u0006\u0002\u0010\u000f\u001a&\u0010C\u001a\u00020\u001b\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\u0006\u0010@\u001a\u0002H\u000eH@¢\u0006\u0002\u0010A\u001a \u0010D\u001a\u0004\u0018\u0001H\u000e\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\nH@¢\u0006\u0002\u0010\u000f\u001aW\u0010E\u001a\b\u0012\u0004\u0012\u0002H\u00110\n\"\u0004\b\u0000\u0010\u000e\"\u0004\b\u0001\u0010\u0011*\b\u0012\u0004\u0012\u0002H\u000e0\n2\b\b\u0002\u0010\u001f\u001a\u00020 2\"\u0010>\u001a\u001e\b\u0001\u0012\u0004\u0012\u0002H\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u0002H\u00110#\u0012\u0006\u0012\u0004\u0018\u00010$0\"H\u0001¢\u0006\u0002\u0010%\u001al\u0010F\u001a\b\u0012\u0004\u0012\u0002H\u00110\n\"\u0004\b\u0000\u0010\u000e\"\u0004\b\u0001\u0010\u0011*\b\u0012\u0004\u0012\u0002H\u000e0\n2\b\b\u0002\u0010\u001f\u001a\u00020 27\u0010>\u001a3\b\u0001\u0012\u0013\u0012\u00110\u001b¢\u0006\f\b\u0003\u0012\b\b\u0004\u0012\u0004\b\b(+\u0012\u0004\u0012\u0002H\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u0002H\u00110#\u0012\u0006\u0012\u0004\u0018\u00010$00H\u0001¢\u0006\u0002\u00101\u001ar\u0010G\u001a\b\u0012\u0004\u0012\u0002H\u00110\n\"\u0004\b\u0000\u0010\u000e\"\b\b\u0001\u0010\u0011*\u00020$*\b\u0012\u0004\u0012\u0002H\u000e0\n2\b\b\u0002\u0010\u001f\u001a\u00020 29\u0010>\u001a5\b\u0001\u0012\u0013\u0012\u00110\u001b¢\u0006\f\b\u0003\u0012\b\b\u0004\u0012\u0004\b\b(+\u0012\u0004\u0012\u0002H\u000e\u0012\f\u0012\n\u0012\u0006\u0012\u0004\u0018\u0001H\u00110#\u0012\u0006\u0012\u0004\u0018\u00010$00H\u0007¢\u0006\u0002\u00101\u001a]\u0010H\u001a\b\u0012\u0004\u0012\u0002H\u00110\n\"\u0004\b\u0000\u0010\u000e\"\b\b\u0001\u0010\u0011*\u00020$*\b\u0012\u0004\u0012\u0002H\u000e0\n2\b\b\u0002\u0010\u001f\u001a\u00020 2$\u0010>\u001a \b\u0001\u0012\u0004\u0012\u0002H\u000e\u0012\f\u0012\n\u0012\u0006\u0012\u0004\u0018\u0001H\u00110#\u0012\u0006\u0012\u0004\u0018\u00010$0\"H\u0007¢\u0006\u0002\u0010%\u001a<\u0010I\u001a\u0004\u0018\u0001H\u000e\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\u001a\u0010J\u001a\u0016\u0012\u0006\b\u0000\u0012\u0002H\u000e0Kj\n\u0012\u0006\b\u0000\u0012\u0002H\u000e`LH@¢\u0006\u0002\u0010M\u001a<\u0010N\u001a\u0004\u0018\u0001H\u000e\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\u001a\u0010J\u001a\u0016\u0012\u0006\b\u0000\u0012\u0002H\u000e0Kj\n\u0012\u0006\b\u0000\u0012\u0002H\u000e`LH@¢\u0006\u0002\u0010M\u001a\u001e\u0010O\u001a\u00020\r\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\nH@¢\u0006\u0002\u0010\u000f\u001a$\u0010P\u001a\b\u0012\u0004\u0012\u0002H\u000e0\n\"\b\b\u0000\u0010\u000e*\u00020$*\n\u0012\u0006\u0012\u0004\u0018\u0001H\u000e0\nH\u0007\u001a\u001e\u0010Q\u001a\u0002H\u000e\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\nH@¢\u0006\u0002\u0010\u000f\u001a \u0010R\u001a\u0004\u0018\u0001H\u000e\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\nH@¢\u0006\u0002\u0010\u000f\u001a0\u0010S\u001a\b\u0012\u0004\u0012\u0002H\u000e0\n\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\u0006\u0010'\u001a\u00020\u001b2\b\b\u0002\u0010\u001f\u001a\u00020 H\u0007\u001aQ\u0010T\u001a\b\u0012\u0004\u0012\u0002H\u000e0\n\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\b\b\u0002\u0010\u001f\u001a\u00020 2\"\u0010)\u001a\u001e\b\u0001\u0012\u0004\u0012\u0002H\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\r0#\u0012\u0006\u0012\u0004\u0018\u00010$0\"H\u0007¢\u0006\u0002\u0010%\u001a6\u0010U\u001a\u0002H5\"\u0004\b\u0000\u0010\u000e\"\u000e\b\u0001\u00105*\b\u0012\u0004\u0012\u0002H\u000e09*\b\u0012\u0004\u0012\u0002H\u000e0\n2\u0006\u00107\u001a\u0002H5H@¢\u0006\u0002\u0010:\u001a8\u0010V\u001a\u0002H5\"\u0004\b\u0000\u0010\u000e\"\u0010\b\u0001\u00105*\n\u0012\u0006\b\u0000\u0012\u0002H\u000e06*\b\u0012\u0004\u0012\u0002H\u000e0\n2\u0006\u00107\u001a\u0002H5H@¢\u0006\u0002\u00108\u001a<\u0010W\u001a\u000e\u0012\u0004\u0012\u0002H\u001e\u0012\u0004\u0012\u0002HY0X\"\u0004\b\u0000\u0010\u001e\"\u0004\b\u0001\u0010Y*\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u0002H\u001e\u0012\u0004\u0012\u0002HY0Z0\nH@¢\u0006\u0002\u0010\u000f\u001aR\u0010W\u001a\u0002H[\"\u0004\b\u0000\u0010\u001e\"\u0004\b\u0001\u0010Y\"\u0018\b\u0002\u0010[*\u0012\u0012\u0006\b\u0000\u0012\u0002H\u001e\u0012\u0006\b\u0000\u0012\u0002HY0\\*\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u0002H\u001e\u0012\u0004\u0012\u0002HY0Z0\n2\u0006\u00107\u001a\u0002H[H@¢\u0006\u0002\u0010]\u001a$\u0010^\u001a\b\u0012\u0004\u0012\u0002H\u000e0_\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\nH@¢\u0006\u0002\u0010\u000f\u001a$\u0010`\u001a\b\u0012\u0004\u0012\u0002H\u000e0a\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\nH@¢\u0006\u0002\u0010\u000f\u001a$\u0010b\u001a\b\u0012\u0004\u0012\u0002H\u000e0c\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\nH@¢\u0006\u0002\u0010\u000f\u001a.\u0010d\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u0002H\u000e0e0\n\"\u0004\b\u0000\u0010\u000e*\b\u0012\u0004\u0012\u0002H\u000e0\n2\b\b\u0002\u0010\u001f\u001a\u00020 H\u0007\u001a?\u0010f\u001a\u0014\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u0002H\u000e\u0012\u0004\u0012\u0002H\u00110Z0\n\"\u0004\b\u0000\u0010\u000e\"\u0004\b\u0001\u0010\u0011*\b\u0012\u0004\u0012\u0002H\u000e0\n2\f\u0010g\u001a\b\u0012\u0004\u0012\u0002H\u00110\nH\u0004\u001az\u0010f\u001a\b\u0012\u0004\u0012\u0002HY0\n\"\u0004\b\u0000\u0010\u000e\"\u0004\b\u0001\u0010\u0011\"\u0004\b\u0002\u0010Y*\b\u0012\u0004\u0012\u0002H\u000e0\n2\f\u0010g\u001a\b\u0012\u0004\u0012\u0002H\u00110\n2\b\b\u0002\u0010\u001f\u001a\u00020 26\u0010>\u001a2\u0012\u0013\u0012\u0011H\u000e¢\u0006\f\b\u0003\u0012\b\b\u0004\u0012\u0004\b\b(h\u0012\u0013\u0012\u0011H\u0011¢\u0006\f\b\u0003\u0012\b\b\u0004\u0012\u0004\b\b(i\u0012\u0004\u0012\u0002HY0\"H\u0001¨\u0006j"}, d2 = {"consumesAll", "Lkotlin/Function1;", "", "Lkotlin/ParameterName;", "name", "cause", "", "Lkotlinx/coroutines/CompletionHandler;", "channels", "", "Lkotlinx/coroutines/channels/ReceiveChannel;", "([Lkotlinx/coroutines/channels/ReceiveChannel;)Lkotlin/jvm/functions/Function1;", "any", "", "E", "(Lkotlinx/coroutines/channels/ReceiveChannel;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "consume", "R", "Lkotlinx/coroutines/channels/BroadcastChannel;", "block", "Lkotlin/ExtensionFunctionType;", "(Lkotlinx/coroutines/channels/BroadcastChannel;Lkotlin/jvm/functions/Function1;)Ljava/lang/Object;", "consumeEach", "action", "(Lkotlinx/coroutines/channels/BroadcastChannel;Lkotlin/jvm/functions/Function1;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "consumes", "count", "", "distinct", "distinctBy", "K", "context", "Lkotlin/coroutines/CoroutineContext;", "selector", "Lkotlin/Function2;", "Lkotlin/coroutines/Continuation;", "", "(Lkotlinx/coroutines/channels/ReceiveChannel;Lkotlin/coroutines/CoroutineContext;Lkotlin/jvm/functions/Function2;)Lkotlinx/coroutines/channels/ReceiveChannel;", "drop", "n", "dropWhile", "predicate", "elementAt", "index", "(Lkotlinx/coroutines/channels/ReceiveChannel;ILkotlin/coroutines/Continuation;)Ljava/lang/Object;", "elementAtOrNull", "filter", "filterIndexed", "Lkotlin/Function3;", "(Lkotlinx/coroutines/channels/ReceiveChannel;Lkotlin/coroutines/CoroutineContext;Lkotlin/jvm/functions/Function3;)Lkotlinx/coroutines/channels/ReceiveChannel;", "filterNot", "filterNotNull", "filterNotNullTo", "C", "", "destination", "(Lkotlinx/coroutines/channels/ReceiveChannel;Ljava/util/Collection;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "Lkotlinx/coroutines/channels/SendChannel;", "(Lkotlinx/coroutines/channels/ReceiveChannel;Lkotlinx/coroutines/channels/SendChannel;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "first", "firstOrNull", "flatMap", "transform", "indexOf", "element", "(Lkotlinx/coroutines/channels/ReceiveChannel;Ljava/lang/Object;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "last", "lastIndexOf", "lastOrNull", "map", "mapIndexed", "mapIndexedNotNull", "mapNotNull", "maxWith", "comparator", "Ljava/util/Comparator;", "Lkotlin/Comparator;", "(Lkotlinx/coroutines/channels/ReceiveChannel;Ljava/util/Comparator;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "minWith", "none", "requireNoNulls", "single", "singleOrNull", "take", "takeWhile", "toChannel", "toCollection", "toMap", "", "V", "Lkotlin/Pair;", "M", "", "(Lkotlinx/coroutines/channels/ReceiveChannel;Ljava/util/Map;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "toMutableList", "", "toMutableSet", "", "toSet", "", "withIndex", "Lkotlin/collections/IndexedValue;", "zip", "other", "a", "b", "kotlinx-coroutines-core"}, k = 5, mv = {1, 9, 0}, xi = 48, xs = "kotlinx/coroutines/channels/ChannelsKt")
/* compiled from: Deprecated.kt */
final /* synthetic */ class ChannelsKt__DeprecatedKt {
    @Deprecated(level = DeprecationLevel.ERROR, message = "BroadcastChannel is deprecated in the favour of SharedFlow and is no longer supported")
    public static final <E, R> R consume(BroadcastChannel<E> $this$consume, Function1<? super ReceiveChannel<? extends E>, ? extends R> block) {
        ReceiveChannel channel = $this$consume.openSubscription();
        try {
            return block.invoke(channel);
        } finally {
            ReceiveChannel.DefaultImpls.cancel$default(channel, (CancellationException) null, 1, (Object) null);
        }
    }

    /* JADX WARNING: Code restructure failed: missing block: B:20:?, code lost:
        r0.L$0 = r7;
        r0.L$1 = r6;
        r0.L$2 = r5;
        r0.label = 1;
        r8 = r5.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x006d, code lost:
        if (r8 != r1) goto L_0x0070;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x006f, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0070, code lost:
        r9 = r0;
        r0 = r12;
        r12 = r8;
        r8 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r2;
        r2 = r1;
        r1 = r9;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x007f, code lost:
        if (((java.lang.Boolean) r12).booleanValue() == false) goto L_0x0090;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0081, code lost:
        r8.invoke(r6.next());
        r12 = r0;
        r0 = r1;
        r1 = r2;
        r2 = r5;
        r5 = r6;
        r6 = r7;
        r7 = r8;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x0090, code lost:
        r12 = kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0093, code lost:
        kotlinx.coroutines.channels.ReceiveChannel.DefaultImpls.cancel$default(r7, (java.util.concurrent.CancellationException) null, 1, (java.lang.Object) null);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x009a, code lost:
        return kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x009b, code lost:
        r12 = move-exception;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x009c, code lost:
        r6 = r1;
        r1 = r12;
        r12 = r0;
        r0 = r6;
        r6 = r7;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002e  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x004b  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0026  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.ERROR, message = "BroadcastChannel is deprecated in the favour of SharedFlow and is no longer supported")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final <E> java.lang.Object consumeEach(kotlinx.coroutines.channels.BroadcastChannel<E> r10, kotlin.jvm.functions.Function1<? super E, kotlin.Unit> r11, kotlin.coroutines.Continuation<? super kotlin.Unit> r12) {
        /*
            boolean r0 = r12 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$consumeEach$1
            if (r0 == 0) goto L_0x0014
            r0 = r12
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$consumeEach$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$consumeEach$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r12 = r0.label
            int r12 = r12 - r2
            r0.label = r12
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$consumeEach$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$consumeEach$1
            r0.<init>(r12)
        L_0x0019:
            java.lang.Object r12 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            r3 = 1
            r4 = 0
            switch(r2) {
                case 0: goto L_0x004b;
                case 1: goto L_0x002e;
                default: goto L_0x0026;
            }
        L_0x0026:
            java.lang.IllegalStateException r10 = new java.lang.IllegalStateException
            java.lang.String r11 = "call to 'resume' before 'invoke' with coroutine"
            r10.<init>(r11)
            throw r10
        L_0x002e:
            r10 = 0
            r11 = 0
            r2 = 0
            java.lang.Object r5 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r5 = (kotlinx.coroutines.channels.ChannelIterator) r5
            java.lang.Object r6 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r6 = (kotlinx.coroutines.channels.ReceiveChannel) r6
            java.lang.Object r7 = r0.L$0
            kotlin.jvm.functions.Function1 r7 = (kotlin.jvm.functions.Function1) r7
            kotlin.ResultKt.throwOnFailure(r12)     // Catch:{ all -> 0x0048 }
            r8 = r7
            r7 = r6
            r6 = r5
            r5 = r2
            r2 = r1
            r1 = r0
            r0 = r12
            goto L_0x0079
        L_0x0048:
            r1 = move-exception
            goto L_0x00a5
        L_0x004b:
            kotlin.ResultKt.throwOnFailure(r12)
            r2 = 0
            r5 = 0
            kotlinx.coroutines.channels.ReceiveChannel r6 = r10.openSubscription()
            r10 = r6
            r7 = 0
            kotlinx.coroutines.channels.ChannelIterator r8 = r10.iterator()     // Catch:{ all -> 0x00a2 }
            r10 = r2
            r2 = r7
            r7 = r11
            r11 = r5
            r5 = r8
        L_0x0061:
            r0.L$0 = r7     // Catch:{ all -> 0x0048 }
            r0.L$1 = r6     // Catch:{ all -> 0x0048 }
            r0.L$2 = r5     // Catch:{ all -> 0x0048 }
            r0.label = r3     // Catch:{ all -> 0x0048 }
            java.lang.Object r8 = r5.hasNext(r0)     // Catch:{ all -> 0x0048 }
            if (r8 != r1) goto L_0x0070
            return r1
        L_0x0070:
            r9 = r0
            r0 = r12
            r12 = r8
            r8 = r7
            r7 = r6
            r6 = r5
            r5 = r2
            r2 = r1
            r1 = r9
        L_0x0079:
            java.lang.Boolean r12 = (java.lang.Boolean) r12     // Catch:{ all -> 0x009b }
            boolean r12 = r12.booleanValue()     // Catch:{ all -> 0x009b }
            if (r12 == 0) goto L_0x0090
            java.lang.Object r12 = r6.next()     // Catch:{ all -> 0x009b }
            r8.invoke(r12)     // Catch:{ all -> 0x009b }
            r12 = r0
            r0 = r1
            r1 = r2
            r2 = r5
            r5 = r6
            r6 = r7
            r7 = r8
            goto L_0x0061
        L_0x0090:
            kotlin.Unit r12 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x009b }
            kotlinx.coroutines.channels.ReceiveChannel.DefaultImpls.cancel$default((kotlinx.coroutines.channels.ReceiveChannel) r7, (java.util.concurrent.CancellationException) r4, (int) r3, (java.lang.Object) r4)
            kotlin.Unit r11 = kotlin.Unit.INSTANCE
            return r11
        L_0x009b:
            r12 = move-exception
            r6 = r1
            r1 = r12
            r12 = r0
            r0 = r6
            r6 = r7
            goto L_0x00a5
        L_0x00a2:
            r1 = move-exception
            r10 = r2
            r11 = r5
        L_0x00a5:
            kotlinx.coroutines.channels.ReceiveChannel.DefaultImpls.cancel$default((kotlinx.coroutines.channels.ReceiveChannel) r6, (java.util.concurrent.CancellationException) r4, (int) r3, (java.lang.Object) r4)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.consumeEach(kotlinx.coroutines.channels.BroadcastChannel, kotlin.jvm.functions.Function1, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX INFO: finally extract failed */
    @Deprecated(level = DeprecationLevel.ERROR, message = "BroadcastChannel is deprecated in the favour of SharedFlow and is no longer supported")
    private static final <E> Object consumeEach$$forInline(BroadcastChannel<E> $this$consumeEach, Function1<? super E, Unit> action, Continuation<? super Unit> $completion) {
        ReceiveChannel<E> $this$consumeEach_u24lambda_u240 = $this$consumeEach.openSubscription();
        try {
            ChannelIterator it = $this$consumeEach_u24lambda_u240.iterator();
            while (((Boolean) it.hasNext((Continuation<? super Boolean>) null)).booleanValue()) {
                action.invoke(it.next());
            }
            Unit unit = Unit.INSTANCE;
            ReceiveChannel.DefaultImpls.cancel$default((ReceiveChannel) $this$consumeEach_u24lambda_u240, (CancellationException) null, 1, (Object) null);
            return Unit.INSTANCE;
        } catch (Throwable th) {
            ReceiveChannel.DefaultImpls.cancel$default((ReceiveChannel) $this$consumeEach_u24lambda_u240, (CancellationException) null, 1, (Object) null);
            throw th;
        }
    }

    public static final Function1<Throwable, Unit> consumesAll(ReceiveChannel<?>... channels) {
        return new ChannelsKt__DeprecatedKt$consumesAll$1(channels);
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Code restructure failed: missing block: B:20:0x0064, code lost:
        r0.L$0 = r7;
        r0.L$1 = r6;
        r0.I$0 = r5;
        r0.I$1 = r2;
        r0.label = 1;
        r9 = r6.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x0073, code lost:
        if (r9 != r1) goto L_0x0076;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x0075, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0076, code lost:
        r11 = r0;
        r0 = r14;
        r14 = r9;
        r9 = r8;
        r8 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r2;
        r2 = r1;
        r1 = r11;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x0086, code lost:
        if (((java.lang.Boolean) r14).booleanValue() == false) goto L_0x009e;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0088, code lost:
        r14 = r7.next();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x008c, code lost:
        r10 = r5 + 1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x008e, code lost:
        if (r6 != r5) goto L_0x0095;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x0090, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r8, r9);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x0094, code lost:
        return r14;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x0095, code lost:
        r14 = r0;
        r0 = r1;
        r1 = r2;
        r5 = r6;
        r6 = r7;
        r7 = r8;
        r8 = r9;
        r2 = r10;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:0x009e, code lost:
        r7 = r8;
        r8 = r9;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x00ba, code lost:
        throw new java.lang.IndexOutOfBoundsException("ReceiveChannel doesn't contain element at index " + r6 + '.');
     */
    /* JADX WARNING: Code restructure failed: missing block: B:37:0x00bb, code lost:
        r13 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:38:0x00bc, code lost:
        r14 = r0;
        r0 = r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:39:0x00bf, code lost:
        r13 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:40:0x00c0, code lost:
        r7 = r8;
        r8 = r9;
        r14 = r0;
        r0 = r1;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x0030  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x004e  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0028  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object elementAt(kotlinx.coroutines.channels.ReceiveChannel r12, int r13, kotlin.coroutines.Continuation r14) {
        /*
            boolean r0 = r14 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$elementAt$1
            if (r0 == 0) goto L_0x0014
            r0 = r14
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$elementAt$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$elementAt$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r14 = r0.label
            int r14 = r14 - r2
            r0.label = r14
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$elementAt$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$elementAt$1
            r0.<init>(r14)
        L_0x0019:
            java.lang.Object r14 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            r3 = 46
            java.lang.String r4 = "ReceiveChannel doesn't contain element at index "
            switch(r2) {
                case 0: goto L_0x004e;
                case 1: goto L_0x0030;
                default: goto L_0x0028;
            }
        L_0x0028:
            java.lang.IllegalStateException r12 = new java.lang.IllegalStateException
            java.lang.String r13 = "call to 'resume' before 'invoke' with coroutine"
            r12.<init>(r13)
            throw r12
        L_0x0030:
            r12 = 0
            r13 = 0
            int r2 = r0.I$1
            int r5 = r0.I$0
            java.lang.Object r6 = r0.L$1
            kotlinx.coroutines.channels.ChannelIterator r6 = (kotlinx.coroutines.channels.ChannelIterator) r6
            java.lang.Object r7 = r0.L$0
            kotlinx.coroutines.channels.ReceiveChannel r7 = (kotlinx.coroutines.channels.ReceiveChannel) r7
            r8 = 0
            kotlin.ResultKt.throwOnFailure(r14)     // Catch:{ all -> 0x004b }
            r9 = r8
            r8 = r7
            r7 = r6
            r6 = r5
            r5 = r2
            r2 = r1
            r1 = r0
            r0 = r14
            goto L_0x0080
        L_0x004b:
            r13 = move-exception
            goto L_0x00e2
        L_0x004e:
            kotlin.ResultKt.throwOnFailure(r14)
            r7 = r12
            r12 = 0
            r8 = 0
            r2 = r7
            r5 = 0
            if (r13 < 0) goto L_0x00c7
            r6 = 0
            kotlinx.coroutines.channels.ChannelIterator r9 = r2.iterator()     // Catch:{ all -> 0x00c5 }
            r2 = r5
            r5 = r13
            r13 = r2
            r2 = r6
            r6 = r9
        L_0x0064:
            r0.L$0 = r7     // Catch:{ all -> 0x00c5 }
            r0.L$1 = r6     // Catch:{ all -> 0x00c5 }
            r0.I$0 = r5     // Catch:{ all -> 0x00c5 }
            r0.I$1 = r2     // Catch:{ all -> 0x00c5 }
            r9 = 1
            r0.label = r9     // Catch:{ all -> 0x00c5 }
            java.lang.Object r9 = r6.hasNext(r0)     // Catch:{ all -> 0x00c5 }
            if (r9 != r1) goto L_0x0076
            return r1
        L_0x0076:
            r11 = r0
            r0 = r14
            r14 = r9
            r9 = r8
            r8 = r7
            r7 = r6
            r6 = r5
            r5 = r2
            r2 = r1
            r1 = r11
        L_0x0080:
            java.lang.Boolean r14 = (java.lang.Boolean) r14     // Catch:{ all -> 0x00bf }
            boolean r14 = r14.booleanValue()     // Catch:{ all -> 0x00bf }
            if (r14 == 0) goto L_0x009e
            java.lang.Object r14 = r7.next()     // Catch:{ all -> 0x00bf }
            int r10 = r5 + 1
            if (r6 != r5) goto L_0x0095
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r8, r9)
            return r14
        L_0x0095:
            r14 = r0
            r0 = r1
            r1 = r2
            r5 = r6
            r6 = r7
            r7 = r8
            r8 = r9
            r2 = r10
            goto L_0x0064
        L_0x009e:
            r7 = r8
            r8 = r9
            java.lang.IndexOutOfBoundsException r14 = new java.lang.IndexOutOfBoundsException     // Catch:{ all -> 0x00bb }
            java.lang.StringBuilder r2 = new java.lang.StringBuilder     // Catch:{ all -> 0x00bb }
            r2.<init>()     // Catch:{ all -> 0x00bb }
            java.lang.StringBuilder r2 = r2.append(r4)     // Catch:{ all -> 0x00bb }
            java.lang.StringBuilder r2 = r2.append(r6)     // Catch:{ all -> 0x00bb }
            java.lang.StringBuilder r2 = r2.append(r3)     // Catch:{ all -> 0x00bb }
            java.lang.String r2 = r2.toString()     // Catch:{ all -> 0x00bb }
            r14.<init>(r2)     // Catch:{ all -> 0x00bb }
            throw r14     // Catch:{ all -> 0x00bb }
        L_0x00bb:
            r13 = move-exception
            r14 = r0
            r0 = r1
            goto L_0x00e2
        L_0x00bf:
            r13 = move-exception
            r7 = r8
            r8 = r9
            r14 = r0
            r0 = r1
            goto L_0x00e2
        L_0x00c5:
            r13 = move-exception
            goto L_0x00e2
        L_0x00c7:
            java.lang.IndexOutOfBoundsException r1 = new java.lang.IndexOutOfBoundsException     // Catch:{ all -> 0x00c5 }
            java.lang.StringBuilder r2 = new java.lang.StringBuilder     // Catch:{ all -> 0x00c5 }
            r2.<init>()     // Catch:{ all -> 0x00c5 }
            java.lang.StringBuilder r2 = r2.append(r4)     // Catch:{ all -> 0x00c5 }
            java.lang.StringBuilder r2 = r2.append(r13)     // Catch:{ all -> 0x00c5 }
            java.lang.StringBuilder r2 = r2.append(r3)     // Catch:{ all -> 0x00c5 }
            java.lang.String r2 = r2.toString()     // Catch:{ all -> 0x00c5 }
            r1.<init>(r2)     // Catch:{ all -> 0x00c5 }
            throw r1     // Catch:{ all -> 0x00c5 }
        L_0x00e2:
            r1 = r13
            throw r13     // Catch:{ all -> 0x00e5 }
        L_0x00e5:
            r13 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r7, r1)
            throw r13
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.elementAt(kotlinx.coroutines.channels.ReceiveChannel, int, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Code restructure failed: missing block: B:24:?, code lost:
        r0.L$0 = r6;
        r0.L$1 = r8;
        r0.I$0 = r5;
        r0.I$1 = r2;
        r0.label = 1;
        r7 = r8.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x0076, code lost:
        if (r7 != r1) goto L_0x0079;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x0078, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0079, code lost:
        r10 = r0;
        r0 = r13;
        r13 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r4;
        r4 = r2;
        r2 = r1;
        r1 = r10;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x0088, code lost:
        if (((java.lang.Boolean) r13).booleanValue() == false) goto L_0x009f;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x008a, code lost:
        r13 = r8.next();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x008e, code lost:
        r9 = r4 + 1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:0x0090, code lost:
        if (r6 != r4) goto L_0x0097;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:34:0x0092, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r7, r5);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:35:0x0096, code lost:
        return r13;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x0097, code lost:
        r4 = r5;
        r13 = r0;
        r0 = r1;
        r1 = r2;
        r5 = r6;
        r6 = r7;
        r2 = r9;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:37:0x009f, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r7, r5);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:38:0x00a3, code lost:
        return null;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:39:0x00a4, code lost:
        r11 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:40:0x00a5, code lost:
        r6 = r7;
        r3 = r5;
        r13 = r0;
        r0 = r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:41:0x00aa, code lost:
        r11 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:42:0x00ab, code lost:
        r3 = r4;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002d  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x004a  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0025  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object elementAtOrNull(kotlinx.coroutines.channels.ReceiveChannel r11, int r12, kotlin.coroutines.Continuation r13) {
        /*
            boolean r0 = r13 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$elementAtOrNull$1
            if (r0 == 0) goto L_0x0014
            r0 = r13
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$elementAtOrNull$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$elementAtOrNull$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r13 = r0.label
            int r13 = r13 - r2
            r0.label = r13
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$elementAtOrNull$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$elementAtOrNull$1
            r0.<init>(r13)
        L_0x0019:
            java.lang.Object r13 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            r3 = 0
            switch(r2) {
                case 0: goto L_0x004a;
                case 1: goto L_0x002d;
                default: goto L_0x0025;
            }
        L_0x0025:
            java.lang.IllegalStateException r11 = new java.lang.IllegalStateException
            java.lang.String r12 = "call to 'resume' before 'invoke' with coroutine"
            r11.<init>(r12)
            throw r11
        L_0x002d:
            r11 = 0
            r12 = 0
            int r2 = r0.I$1
            int r4 = r0.I$0
            java.lang.Object r5 = r0.L$1
            kotlinx.coroutines.channels.ChannelIterator r5 = (kotlinx.coroutines.channels.ChannelIterator) r5
            java.lang.Object r6 = r0.L$0
            kotlinx.coroutines.channels.ReceiveChannel r6 = (kotlinx.coroutines.channels.ReceiveChannel) r6
            kotlin.ResultKt.throwOnFailure(r13)     // Catch:{ all -> 0x0047 }
            r8 = r5
            r7 = r6
            r5 = r3
            r6 = r4
            r4 = r2
            r2 = r1
            r1 = r0
            r0 = r13
            goto L_0x0082
        L_0x0047:
            r11 = move-exception
            goto L_0x00b1
        L_0x004a:
            kotlin.ResultKt.throwOnFailure(r13)
            r2 = 0
            r4 = r11
            r5 = 0
            if (r12 >= 0) goto L_0x005b
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r11, r3)
            return r3
        L_0x005b:
            r6 = r11
            r11 = r3
            r7 = 0
            kotlinx.coroutines.channels.ChannelIterator r8 = r4.iterator()     // Catch:{ all -> 0x00ad }
            r4 = r11
            r11 = r5
            r5 = r12
            r12 = r2
            r2 = r7
        L_0x0067:
            r0.L$0 = r6     // Catch:{ all -> 0x00aa }
            r0.L$1 = r8     // Catch:{ all -> 0x00aa }
            r0.I$0 = r5     // Catch:{ all -> 0x00aa }
            r0.I$1 = r2     // Catch:{ all -> 0x00aa }
            r7 = 1
            r0.label = r7     // Catch:{ all -> 0x00aa }
            java.lang.Object r7 = r8.hasNext(r0)     // Catch:{ all -> 0x00aa }
            if (r7 != r1) goto L_0x0079
            return r1
        L_0x0079:
            r10 = r0
            r0 = r13
            r13 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r2
            r2 = r1
            r1 = r10
        L_0x0082:
            java.lang.Boolean r13 = (java.lang.Boolean) r13     // Catch:{ all -> 0x00a4 }
            boolean r13 = r13.booleanValue()     // Catch:{ all -> 0x00a4 }
            if (r13 == 0) goto L_0x009f
            java.lang.Object r13 = r8.next()     // Catch:{ all -> 0x00a4 }
            int r9 = r4 + 1
            if (r6 != r4) goto L_0x0097
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r7, r5)
            return r13
        L_0x0097:
            r4 = r5
            r13 = r0
            r0 = r1
            r1 = r2
            r5 = r6
            r6 = r7
            r2 = r9
            goto L_0x0067
        L_0x009f:
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r7, r5)
            return r3
        L_0x00a4:
            r11 = move-exception
            r6 = r7
            r3 = r5
            r13 = r0
            r0 = r1
            goto L_0x00b1
        L_0x00aa:
            r11 = move-exception
            r3 = r4
            goto L_0x00b1
        L_0x00ad:
            r12 = move-exception
            r3 = r11
            r11 = r12
            r12 = r2
        L_0x00b1:
            r1 = r11
            throw r11     // Catch:{ all -> 0x00b4 }
        L_0x00b4:
            r11 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r1)
            throw r11
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.elementAtOrNull(kotlinx.coroutines.channels.ReceiveChannel, int, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0062, code lost:
        if (((java.lang.Boolean) r6).booleanValue() == false) goto L_0x006c;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x0064, code lost:
        r5 = r2.next();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x0068, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r3, r4);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x006b, code lost:
        return r5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0073, code lost:
        throw new java.util.NoSuchElementException("ReceiveChannel is empty.");
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x003e  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object first(kotlinx.coroutines.channels.ReceiveChannel r7, kotlin.coroutines.Continuation r8) {
        /*
            boolean r0 = r8 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$first$1
            if (r0 == 0) goto L_0x0014
            r0 = r8
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$first$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$first$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r8 = r0.label
            int r8 = r8 - r2
            r0.label = r8
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$first$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$first$1
            r0.<init>(r8)
        L_0x0019:
            java.lang.Object r8 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x003e;
                case 1: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r7 = new java.lang.IllegalStateException
            java.lang.String r8 = "call to 'resume' before 'invoke' with coroutine"
            r7.<init>(r8)
            throw r7
        L_0x002c:
            r7 = 0
            r1 = 0
            java.lang.Object r2 = r0.L$1
            kotlinx.coroutines.channels.ChannelIterator r2 = (kotlinx.coroutines.channels.ChannelIterator) r2
            java.lang.Object r3 = r0.L$0
            kotlinx.coroutines.channels.ReceiveChannel r3 = (kotlinx.coroutines.channels.ReceiveChannel) r3
            r4 = 0
            kotlin.ResultKt.throwOnFailure(r8)     // Catch:{ all -> 0x003c }
            r6 = r8
            goto L_0x005c
        L_0x003c:
            r1 = move-exception
            goto L_0x0075
        L_0x003e:
            kotlin.ResultKt.throwOnFailure(r8)
            r3 = r7
            r7 = 0
            r4 = 0
            r2 = r3
            r5 = 0
            kotlinx.coroutines.channels.ChannelIterator r6 = r2.iterator()     // Catch:{ all -> 0x0074 }
            r2 = r6
            r0.L$0 = r3     // Catch:{ all -> 0x0074 }
            r0.L$1 = r2     // Catch:{ all -> 0x0074 }
            r6 = 1
            r0.label = r6     // Catch:{ all -> 0x0074 }
            java.lang.Object r6 = r2.hasNext(r0)     // Catch:{ all -> 0x0074 }
            if (r6 != r1) goto L_0x005b
            return r1
        L_0x005b:
            r1 = r5
        L_0x005c:
            java.lang.Boolean r6 = (java.lang.Boolean) r6     // Catch:{ all -> 0x003c }
            boolean r5 = r6.booleanValue()     // Catch:{ all -> 0x003c }
            if (r5 == 0) goto L_0x006c
            java.lang.Object r5 = r2.next()     // Catch:{ all -> 0x003c }
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r3, r4)
            return r5
        L_0x006c:
            java.util.NoSuchElementException r5 = new java.util.NoSuchElementException     // Catch:{ all -> 0x003c }
            java.lang.String r6 = "ReceiveChannel is empty."
            r5.<init>(r6)     // Catch:{ all -> 0x003c }
            throw r5     // Catch:{ all -> 0x003c }
        L_0x0074:
            r1 = move-exception
        L_0x0075:
            r2 = r1
            throw r1     // Catch:{ all -> 0x0078 }
        L_0x0078:
            r1 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r3, r2)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.first(kotlinx.coroutines.channels.ReceiveChannel, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0063, code lost:
        if (((java.lang.Boolean) r5).booleanValue() != false) goto L_0x006a;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:24:0x0066, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r4, r2);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x0069, code lost:
        return r3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:?, code lost:
        r3 = r7.next();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x006f, code lost:
        r1 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0070, code lost:
        r3 = r2;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002d  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x0040  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0025  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object firstOrNull(kotlinx.coroutines.channels.ReceiveChannel r8, kotlin.coroutines.Continuation r9) {
        /*
            boolean r0 = r9 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$firstOrNull$1
            if (r0 == 0) goto L_0x0014
            r0 = r9
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$firstOrNull$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$firstOrNull$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r9 = r0.label
            int r9 = r9 - r2
            r0.label = r9
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$firstOrNull$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$firstOrNull$1
            r0.<init>(r9)
        L_0x0019:
            java.lang.Object r9 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            r3 = 0
            switch(r2) {
                case 0: goto L_0x0040;
                case 1: goto L_0x002d;
                default: goto L_0x0025;
            }
        L_0x0025:
            java.lang.IllegalStateException r8 = new java.lang.IllegalStateException
            java.lang.String r9 = "call to 'resume' before 'invoke' with coroutine"
            r8.<init>(r9)
            throw r8
        L_0x002d:
            r8 = 0
            r1 = 0
            java.lang.Object r2 = r0.L$1
            kotlinx.coroutines.channels.ChannelIterator r2 = (kotlinx.coroutines.channels.ChannelIterator) r2
            java.lang.Object r4 = r0.L$0
            kotlinx.coroutines.channels.ReceiveChannel r4 = (kotlinx.coroutines.channels.ReceiveChannel) r4
            kotlin.ResultKt.throwOnFailure(r9)     // Catch:{ all -> 0x003e }
            r5 = r9
            r7 = r2
            r2 = r3
            goto L_0x005d
        L_0x003e:
            r1 = move-exception
        L_0x003f:
            goto L_0x0074
        L_0x0040:
            kotlin.ResultKt.throwOnFailure(r9)
            r4 = r8
            r8 = 0
            r2 = 0
            r5 = r4
            r6 = 0
            kotlinx.coroutines.channels.ChannelIterator r7 = r5.iterator()     // Catch:{ all -> 0x0072 }
            r0.L$0 = r4     // Catch:{ all -> 0x0072 }
            r0.L$1 = r7     // Catch:{ all -> 0x0072 }
            r5 = 1
            r0.label = r5     // Catch:{ all -> 0x0072 }
            java.lang.Object r5 = r7.hasNext(r0)     // Catch:{ all -> 0x0072 }
            if (r5 != r1) goto L_0x005c
            return r1
        L_0x005c:
            r1 = r6
        L_0x005d:
            java.lang.Boolean r5 = (java.lang.Boolean) r5     // Catch:{ all -> 0x006f }
            boolean r5 = r5.booleanValue()     // Catch:{ all -> 0x006f }
            if (r5 != 0) goto L_0x006a
        L_0x0066:
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r4, r2)
            return r3
        L_0x006a:
            java.lang.Object r3 = r7.next()     // Catch:{ all -> 0x006f }
            goto L_0x0066
        L_0x006f:
            r1 = move-exception
            r3 = r2
            goto L_0x003f
        L_0x0072:
            r1 = move-exception
            r3 = r2
        L_0x0074:
            r2 = r1
            throw r1     // Catch:{ all -> 0x0077 }
        L_0x0077:
            r1 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r4, r2)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.firstOrNull(kotlinx.coroutines.channels.ReceiveChannel, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Code restructure failed: missing block: B:20:?, code lost:
        r1.L$0 = r10;
        r1.L$1 = r9;
        r1.L$2 = r8;
        r1.L$3 = r7;
        r1.label = 1;
        r12 = r7.hasNext(r1);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x007e, code lost:
        if (r12 != r0) goto L_0x0081;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x0080, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0081, code lost:
        r16 = r3;
        r3 = r2;
        r2 = r12;
        r12 = r11;
        r11 = r10;
        r10 = r9;
        r9 = r8;
        r8 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x0094, code lost:
        if (((java.lang.Boolean) r2).booleanValue() == false) goto L_0x00c3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x00a0, code lost:
        if (kotlin.jvm.internal.Intrinsics.areEqual(r11, r8.next()) == false) goto L_0x00ac;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x00a2, code lost:
        r0 = kotlin.coroutines.jvm.internal.Boxing.boxInt(r10.element);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x00a8, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r9, r12);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x00ab, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:?, code lost:
        r10.element++;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:34:0x00b1, code lost:
        r2 = r3;
        r3 = r5;
        r5 = r6;
        r6 = r7;
        r7 = r8;
        r8 = r9;
        r9 = r10;
        r10 = r11;
        r11 = r12;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:35:0x00bc, code lost:
        r0 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x00bd, code lost:
        r2 = r3;
        r3 = r5;
        r5 = r6;
        r8 = r9;
        r11 = r12;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:37:0x00c3, code lost:
        r8 = r9;
        r11 = r12;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:39:?, code lost:
        r0 = kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:40:0x00c8, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r8, r11);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:41:0x00d3, code lost:
        return kotlin.coroutines.jvm.internal.Boxing.boxInt(-1);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:42:0x00d4, code lost:
        r0 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:43:0x00d5, code lost:
        r2 = r3;
        r3 = r5;
        r5 = r6;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:44:0x00d9, code lost:
        r0 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:45:0x00da, code lost:
        r8 = r9;
        r11 = r12;
        r2 = r3;
        r3 = r5;
        r5 = r6;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:46:0x00e0, code lost:
        r0 = th;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002f  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x0051  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0027  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object indexOf(kotlinx.coroutines.channels.ReceiveChannel r17, java.lang.Object r18, kotlin.coroutines.Continuation r19) {
        /*
            r0 = r19
            boolean r1 = r0 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$indexOf$1
            if (r1 == 0) goto L_0x0016
            r1 = r0
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$indexOf$1 r1 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$indexOf$1) r1
            int r2 = r1.label
            r3 = -2147483648(0xffffffff80000000, float:-0.0)
            r2 = r2 & r3
            if (r2 == 0) goto L_0x0016
            int r0 = r1.label
            int r0 = r0 - r3
            r1.label = r0
            goto L_0x001b
        L_0x0016:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$indexOf$1 r1 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$indexOf$1
            r1.<init>(r0)
        L_0x001b:
            java.lang.Object r2 = r1.result
            java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r3 = r1.label
            r4 = 1
            switch(r3) {
                case 0: goto L_0x0051;
                case 1: goto L_0x002f;
                default: goto L_0x0027;
            }
        L_0x0027:
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException
            java.lang.String r1 = "call to 'resume' before 'invoke' with coroutine"
            r0.<init>(r1)
            throw r0
        L_0x002f:
            r3 = 0
            r5 = 0
            r6 = 0
            java.lang.Object r7 = r1.L$3
            kotlinx.coroutines.channels.ChannelIterator r7 = (kotlinx.coroutines.channels.ChannelIterator) r7
            java.lang.Object r8 = r1.L$2
            kotlinx.coroutines.channels.ReceiveChannel r8 = (kotlinx.coroutines.channels.ReceiveChannel) r8
            java.lang.Object r9 = r1.L$1
            kotlin.jvm.internal.Ref$IntRef r9 = (kotlin.jvm.internal.Ref.IntRef) r9
            java.lang.Object r10 = r1.L$0
            r11 = 0
            kotlin.ResultKt.throwOnFailure(r2)     // Catch:{ all -> 0x004e }
            r12 = r11
            r11 = r10
            r10 = r9
            r9 = r8
            r8 = r7
            r7 = r6
            r6 = r5
            r5 = r3
            r3 = r2
            goto L_0x008e
        L_0x004e:
            r0 = move-exception
            goto L_0x00e5
        L_0x0051:
            kotlin.ResultKt.throwOnFailure(r2)
            r3 = r17
            r5 = r18
            kotlin.jvm.internal.Ref$IntRef r6 = new kotlin.jvm.internal.Ref$IntRef
            r6.<init>()
            r7 = 0
            r8 = r3
            r3 = 0
            r11 = 0
            r9 = r8
            r10 = 0
            kotlinx.coroutines.channels.ChannelIterator r12 = r9.iterator()     // Catch:{ all -> 0x00e2 }
            r9 = r6
            r6 = r10
            r10 = r5
            r5 = r3
            r3 = r7
            r7 = r12
        L_0x0070:
            r1.L$0 = r10     // Catch:{ all -> 0x00e0 }
            r1.L$1 = r9     // Catch:{ all -> 0x00e0 }
            r1.L$2 = r8     // Catch:{ all -> 0x00e0 }
            r1.L$3 = r7     // Catch:{ all -> 0x00e0 }
            r1.label = r4     // Catch:{ all -> 0x00e0 }
            java.lang.Object r12 = r7.hasNext(r1)     // Catch:{ all -> 0x00e0 }
            if (r12 != r0) goto L_0x0081
            return r0
        L_0x0081:
            r16 = r3
            r3 = r2
            r2 = r12
            r12 = r11
            r11 = r10
            r10 = r9
            r9 = r8
            r8 = r7
            r7 = r6
            r6 = r5
            r5 = r16
        L_0x008e:
            java.lang.Boolean r2 = (java.lang.Boolean) r2     // Catch:{ all -> 0x00d9 }
            boolean r2 = r2.booleanValue()     // Catch:{ all -> 0x00d9 }
            if (r2 == 0) goto L_0x00c3
            java.lang.Object r2 = r8.next()     // Catch:{ all -> 0x00d9 }
            r13 = r2
            r14 = 0
            boolean r15 = kotlin.jvm.internal.Intrinsics.areEqual((java.lang.Object) r11, (java.lang.Object) r13)     // Catch:{ all -> 0x00d9 }
            if (r15 == 0) goto L_0x00ac
            int r0 = r10.element     // Catch:{ all -> 0x00d9 }
            java.lang.Integer r0 = kotlin.coroutines.jvm.internal.Boxing.boxInt(r0)     // Catch:{ all -> 0x00d9 }
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r9, r12)
            return r0
        L_0x00ac:
            int r2 = r10.element     // Catch:{ all -> 0x00bc }
            int r2 = r2 + r4
            r10.element = r2     // Catch:{ all -> 0x00bc }
            r2 = r3
            r3 = r5
            r5 = r6
            r6 = r7
            r7 = r8
            r8 = r9
            r9 = r10
            r10 = r11
            r11 = r12
            goto L_0x0070
        L_0x00bc:
            r0 = move-exception
            r2 = r3
            r3 = r5
            r5 = r6
            r8 = r9
            r11 = r12
            goto L_0x00e5
        L_0x00c3:
            r8 = r9
            r11 = r12
            kotlin.Unit r0 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x00d4 }
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r8, r11)
            r0 = -1
            java.lang.Integer r0 = kotlin.coroutines.jvm.internal.Boxing.boxInt(r0)
            return r0
        L_0x00d4:
            r0 = move-exception
            r2 = r3
            r3 = r5
            r5 = r6
            goto L_0x00e5
        L_0x00d9:
            r0 = move-exception
            r8 = r9
            r11 = r12
            r2 = r3
            r3 = r5
            r5 = r6
            goto L_0x00e5
        L_0x00e0:
            r0 = move-exception
            goto L_0x00e5
        L_0x00e2:
            r0 = move-exception
            r5 = r3
            r3 = r7
        L_0x00e5:
            r4 = r0
            throw r0     // Catch:{ all -> 0x00e8 }
        L_0x00e8:
            r0 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r8, r4)
            throw r0
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.indexOf(kotlinx.coroutines.channels.ReceiveChannel, java.lang.Object, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r4v7, resolved type: java.lang.Object} */
    /* JADX DEBUG: Multi-variable search result rejected for TypeSearchVarInfo{r5v9, resolved type: kotlinx.coroutines.channels.ReceiveChannel} */
    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x007e, code lost:
        if (((java.lang.Boolean) r2).booleanValue() == false) goto L_0x00c4;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x0080, code lost:
        r8 = r3;
        r3 = r4.next();
        r2 = r8;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0087, code lost:
        r0.L$0 = r5;
        r0.L$1 = r4;
        r0.L$2 = r3;
        r0.label = 2;
        r7 = r4.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x0094, code lost:
        if (r7 != r1) goto L_0x0097;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0096, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x0097, code lost:
        r8 = r0;
        r0 = r10;
        r10 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r4;
        r4 = r3;
        r3 = r2;
        r2 = r1;
        r1 = r8;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:0x00a7, code lost:
        if (((java.lang.Boolean) r10).booleanValue() == false) goto L_0x00b7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:35:0x00ad, code lost:
        r4 = r3;
        r3 = r5.next();
        r10 = r0;
        r0 = r1;
        r1 = r2;
        r2 = r4;
        r4 = r5;
        r5 = r6;
        r6 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x00b7, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r7);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:37:0x00bb, code lost:
        return r4;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:38:0x00bc, code lost:
        r10 = move-exception;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:39:0x00bd, code lost:
        r5 = r6;
        r6 = r7;
        r8 = r1;
        r1 = r10;
        r10 = r0;
        r0 = r8;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:42:0x00cb, code lost:
        throw new java.util.NoSuchElementException("ReceiveChannel is empty.");
     */
    /* JADX WARNING: Multi-variable type inference failed */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x0049  */
    /* JADX WARNING: Removed duplicated region for block: B:19:0x005c  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object last(kotlinx.coroutines.channels.ReceiveChannel r9, kotlin.coroutines.Continuation r10) {
        /*
            boolean r0 = r10 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$last$1
            if (r0 == 0) goto L_0x0014
            r0 = r10
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$last$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$last$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r10 = r0.label
            int r10 = r10 - r2
            r0.label = r10
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$last$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$last$1
            r0.<init>(r10)
        L_0x0019:
            java.lang.Object r10 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x005c;
                case 1: goto L_0x0049;
                case 2: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r9 = new java.lang.IllegalStateException
            java.lang.String r10 = "call to 'resume' before 'invoke' with coroutine"
            r9.<init>(r10)
            throw r9
        L_0x002c:
            r9 = 0
            r2 = 0
            java.lang.Object r3 = r0.L$2
            java.lang.Object r4 = r0.L$1
            kotlinx.coroutines.channels.ChannelIterator r4 = (kotlinx.coroutines.channels.ChannelIterator) r4
            java.lang.Object r5 = r0.L$0
            kotlinx.coroutines.channels.ReceiveChannel r5 = (kotlinx.coroutines.channels.ReceiveChannel) r5
            r6 = 0
            kotlin.ResultKt.throwOnFailure(r10)     // Catch:{ all -> 0x0046 }
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r0
            r0 = r10
            goto L_0x00a1
        L_0x0046:
            r1 = move-exception
            goto L_0x00cd
        L_0x0049:
            r9 = 0
            r2 = 0
            java.lang.Object r3 = r0.L$1
            kotlinx.coroutines.channels.ChannelIterator r3 = (kotlinx.coroutines.channels.ChannelIterator) r3
            r6 = 0
            java.lang.Object r4 = r0.L$0
            r5 = r4
            kotlinx.coroutines.channels.ReceiveChannel r5 = (kotlinx.coroutines.channels.ReceiveChannel) r5
            kotlin.ResultKt.throwOnFailure(r10)     // Catch:{ all -> 0x00cc }
            r4 = r3
            r3 = r2
            r2 = r10
            goto L_0x0078
        L_0x005c:
            kotlin.ResultKt.throwOnFailure(r10)
            r5 = r9
            r9 = 0
            r6 = 0
            r2 = r5
            r3 = 0
            kotlinx.coroutines.channels.ChannelIterator r4 = r2.iterator()     // Catch:{ all -> 0x00cc }
            r0.L$0 = r5     // Catch:{ all -> 0x00cc }
            r0.L$1 = r4     // Catch:{ all -> 0x00cc }
            r2 = 1
            r0.label = r2     // Catch:{ all -> 0x00cc }
            java.lang.Object r2 = r4.hasNext(r0)     // Catch:{ all -> 0x00cc }
            if (r2 != r1) goto L_0x0078
            return r1
        L_0x0078:
            java.lang.Boolean r2 = (java.lang.Boolean) r2     // Catch:{ all -> 0x00cc }
            boolean r2 = r2.booleanValue()     // Catch:{ all -> 0x00cc }
            if (r2 == 0) goto L_0x00c4
            java.lang.Object r2 = r4.next()     // Catch:{ all -> 0x00cc }
            r8 = r3
            r3 = r2
            r2 = r8
        L_0x0087:
            r0.L$0 = r5     // Catch:{ all -> 0x00cc }
            r0.L$1 = r4     // Catch:{ all -> 0x00cc }
            r0.L$2 = r3     // Catch:{ all -> 0x00cc }
            r7 = 2
            r0.label = r7     // Catch:{ all -> 0x00cc }
            java.lang.Object r7 = r4.hasNext(r0)     // Catch:{ all -> 0x00cc }
            if (r7 != r1) goto L_0x0097
            return r1
        L_0x0097:
            r8 = r0
            r0 = r10
            r10 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r8
        L_0x00a1:
            java.lang.Boolean r10 = (java.lang.Boolean) r10     // Catch:{ all -> 0x00bc }
            boolean r10 = r10.booleanValue()     // Catch:{ all -> 0x00bc }
            if (r10 == 0) goto L_0x00b7
            java.lang.Object r10 = r5.next()     // Catch:{ all -> 0x00bc }
            r4 = r3
            r3 = r10
            r10 = r0
            r0 = r1
            r1 = r2
            r2 = r4
            r4 = r5
            r5 = r6
            r6 = r7
            goto L_0x0087
        L_0x00b7:
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r7)
            return r4
        L_0x00bc:
            r10 = move-exception
            r5 = r6
            r6 = r7
            r8 = r1
            r1 = r10
            r10 = r0
            r0 = r8
            goto L_0x00cd
        L_0x00c4:
            java.util.NoSuchElementException r1 = new java.util.NoSuchElementException     // Catch:{ all -> 0x00cc }
            java.lang.String r2 = "ReceiveChannel is empty."
            r1.<init>(r2)     // Catch:{ all -> 0x00cc }
            throw r1     // Catch:{ all -> 0x00cc }
        L_0x00cc:
            r1 = move-exception
        L_0x00cd:
            r2 = r1
            throw r1     // Catch:{ all -> 0x00d0 }
        L_0x00d0:
            r1 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r5, r2)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.last(kotlinx.coroutines.channels.ReceiveChannel, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Code restructure failed: missing block: B:20:?, code lost:
        r1.L$0 = r12;
        r1.L$1 = r11;
        r1.L$2 = r10;
        r1.L$3 = r9;
        r1.L$4 = r7;
        r1.label = 1;
        r13 = r7.hasNext(r1);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x008f, code lost:
        if (r13 != r0) goto L_0x0092;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x0091, code lost:
        return r0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0092, code lost:
        r16 = r3;
        r3 = r2;
        r2 = r13;
        r13 = r12;
        r12 = r11;
        r11 = r10;
        r10 = r9;
        r9 = r8;
        r8 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r16;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x00a6, code lost:
        if (((java.lang.Boolean) r2).booleanValue() == false) goto L_0x00c8;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x00b1, code lost:
        if (kotlin.jvm.internal.Intrinsics.areEqual(r13, r8.next()) == false) goto L_0x00b7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x00b3, code lost:
        r12.element = r11.element;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x00b7, code lost:
        r11.element++;
        r2 = r3;
        r3 = r5;
        r5 = r6;
        r6 = r7;
        r7 = r8;
        r8 = r9;
        r9 = r10;
        r10 = r11;
        r11 = r12;
        r12 = r13;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x00c8, code lost:
        r0 = kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x00cb, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r10, r9);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:0x00d7, code lost:
        return kotlin.coroutines.jvm.internal.Boxing.boxInt(r12.element);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:34:0x00d8, code lost:
        r0 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:35:0x00d9, code lost:
        r2 = r3;
        r3 = r5;
        r5 = r6;
        r8 = r9;
        r9 = r10;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002f  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x0056  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0027  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object lastIndexOf(kotlinx.coroutines.channels.ReceiveChannel r17, java.lang.Object r18, kotlin.coroutines.Continuation r19) {
        /*
            r0 = r19
            boolean r1 = r0 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$lastIndexOf$1
            if (r1 == 0) goto L_0x0016
            r1 = r0
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$lastIndexOf$1 r1 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$lastIndexOf$1) r1
            int r2 = r1.label
            r3 = -2147483648(0xffffffff80000000, float:-0.0)
            r2 = r2 & r3
            if (r2 == 0) goto L_0x0016
            int r0 = r1.label
            int r0 = r0 - r3
            r1.label = r0
            goto L_0x001b
        L_0x0016:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$lastIndexOf$1 r1 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$lastIndexOf$1
            r1.<init>(r0)
        L_0x001b:
            java.lang.Object r2 = r1.result
            java.lang.Object r0 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r3 = r1.label
            r4 = 1
            switch(r3) {
                case 0: goto L_0x0056;
                case 1: goto L_0x002f;
                default: goto L_0x0027;
            }
        L_0x0027:
            java.lang.IllegalStateException r0 = new java.lang.IllegalStateException
            java.lang.String r1 = "call to 'resume' before 'invoke' with coroutine"
            r0.<init>(r1)
            throw r0
        L_0x002f:
            r3 = 0
            r5 = 0
            r6 = 0
            java.lang.Object r7 = r1.L$4
            kotlinx.coroutines.channels.ChannelIterator r7 = (kotlinx.coroutines.channels.ChannelIterator) r7
            r8 = 0
            java.lang.Object r9 = r1.L$3
            kotlinx.coroutines.channels.ReceiveChannel r9 = (kotlinx.coroutines.channels.ReceiveChannel) r9
            java.lang.Object r10 = r1.L$2
            kotlin.jvm.internal.Ref$IntRef r10 = (kotlin.jvm.internal.Ref.IntRef) r10
            java.lang.Object r11 = r1.L$1
            kotlin.jvm.internal.Ref$IntRef r11 = (kotlin.jvm.internal.Ref.IntRef) r11
            java.lang.Object r12 = r1.L$0
            kotlin.ResultKt.throwOnFailure(r2)     // Catch:{ all -> 0x0053 }
            r13 = r12
            r12 = r11
            r11 = r10
            r10 = r9
            r9 = r8
            r8 = r7
            r7 = r6
            r6 = r5
            r5 = r3
            r3 = r2
            goto L_0x00a0
        L_0x0053:
            r0 = move-exception
            goto L_0x00e3
        L_0x0056:
            kotlin.ResultKt.throwOnFailure(r2)
            r3 = r17
            r5 = r18
            kotlin.jvm.internal.Ref$IntRef r6 = new kotlin.jvm.internal.Ref$IntRef
            r6.<init>()
            r7 = -1
            r6.element = r7
            kotlin.jvm.internal.Ref$IntRef r7 = new kotlin.jvm.internal.Ref$IntRef
            r7.<init>()
            r8 = 0
            r9 = r3
            r3 = 0
            r10 = 0
            r11 = r9
            r12 = 0
            kotlinx.coroutines.channels.ChannelIterator r13 = r11.iterator()     // Catch:{ all -> 0x00df }
            r11 = r6
            r6 = r12
            r12 = r5
            r5 = r3
            r3 = r8
            r8 = r10
            r10 = r7
            r7 = r13
        L_0x007f:
            r1.L$0 = r12     // Catch:{ all -> 0x0053 }
            r1.L$1 = r11     // Catch:{ all -> 0x0053 }
            r1.L$2 = r10     // Catch:{ all -> 0x0053 }
            r1.L$3 = r9     // Catch:{ all -> 0x0053 }
            r1.L$4 = r7     // Catch:{ all -> 0x0053 }
            r1.label = r4     // Catch:{ all -> 0x0053 }
            java.lang.Object r13 = r7.hasNext(r1)     // Catch:{ all -> 0x0053 }
            if (r13 != r0) goto L_0x0092
            return r0
        L_0x0092:
            r16 = r3
            r3 = r2
            r2 = r13
            r13 = r12
            r12 = r11
            r11 = r10
            r10 = r9
            r9 = r8
            r8 = r7
            r7 = r6
            r6 = r5
            r5 = r16
        L_0x00a0:
            java.lang.Boolean r2 = (java.lang.Boolean) r2     // Catch:{ all -> 0x00d8 }
            boolean r2 = r2.booleanValue()     // Catch:{ all -> 0x00d8 }
            if (r2 == 0) goto L_0x00c8
            java.lang.Object r2 = r8.next()     // Catch:{ all -> 0x00d8 }
            r14 = 0
            boolean r15 = kotlin.jvm.internal.Intrinsics.areEqual((java.lang.Object) r13, (java.lang.Object) r2)     // Catch:{ all -> 0x00d8 }
            if (r15 == 0) goto L_0x00b7
            int r2 = r11.element     // Catch:{ all -> 0x00d8 }
            r12.element = r2     // Catch:{ all -> 0x00d8 }
        L_0x00b7:
            int r2 = r11.element     // Catch:{ all -> 0x00d8 }
            int r2 = r2 + r4
            r11.element = r2     // Catch:{ all -> 0x00d8 }
            r2 = r3
            r3 = r5
            r5 = r6
            r6 = r7
            r7 = r8
            r8 = r9
            r9 = r10
            r10 = r11
            r11 = r12
            r12 = r13
            goto L_0x007f
        L_0x00c8:
            kotlin.Unit r0 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x00d8 }
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r10, r9)
            int r0 = r12.element
            java.lang.Integer r0 = kotlin.coroutines.jvm.internal.Boxing.boxInt(r0)
            return r0
        L_0x00d8:
            r0 = move-exception
            r2 = r3
            r3 = r5
            r5 = r6
            r8 = r9
            r9 = r10
            goto L_0x00e3
        L_0x00df:
            r0 = move-exception
            r5 = r3
            r3 = r8
            r8 = r10
        L_0x00e3:
            r4 = r0
            throw r0     // Catch:{ all -> 0x00e6 }
        L_0x00e6:
            r0 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r9, r4)
            throw r0
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.lastIndexOf(kotlinx.coroutines.channels.ReceiveChannel, java.lang.Object, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x0081, code lost:
        if (((java.lang.Boolean) r7).booleanValue() != false) goto L_0x0088;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0083, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r9);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x0087, code lost:
        return null;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x0088, code lost:
        r3 = r9;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:?, code lost:
        r8 = r4;
        r4 = r4.next();
        r9 = r5;
        r5 = r8;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:34:0x0091, code lost:
        r0.L$0 = r6;
        r0.L$1 = r5;
        r0.L$2 = r4;
        r0.label = 2;
        r7 = r5.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:35:0x009e, code lost:
        if (r7 != r1) goto L_0x00a1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x00a0, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:37:0x00a1, code lost:
        r8 = r0;
        r0 = r10;
        r10 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r4;
        r4 = r3;
        r3 = r2;
        r2 = r1;
        r1 = r8;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:40:0x00b1, code lost:
        if (((java.lang.Boolean) r10).booleanValue() == false) goto L_0x00c1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:42:0x00b7, code lost:
        r5 = r4;
        r4 = r6.next();
        r10 = r0;
        r0 = r1;
        r1 = r2;
        r2 = r3;
        r3 = r5;
        r5 = r6;
        r6 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:43:0x00c1, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r7, r4);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:44:0x00c5, code lost:
        return r5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:45:0x00c6, code lost:
        r9 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:46:0x00c7, code lost:
        r6 = r7;
        r10 = r0;
        r0 = r1;
        r2 = r3;
        r3 = r4;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:47:0x00cd, code lost:
        r9 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:48:0x00cf, code lost:
        r1 = move-exception;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:49:0x00d0, code lost:
        r3 = r9;
        r9 = r1;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002d  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x0048  */
    /* JADX WARNING: Removed duplicated region for block: B:21:0x005e  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0025  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object lastOrNull(kotlinx.coroutines.channels.ReceiveChannel r9, kotlin.coroutines.Continuation r10) {
        /*
            boolean r0 = r10 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$lastOrNull$1
            if (r0 == 0) goto L_0x0014
            r0 = r10
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$lastOrNull$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$lastOrNull$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r10 = r0.label
            int r10 = r10 - r2
            r0.label = r10
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$lastOrNull$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$lastOrNull$1
            r0.<init>(r10)
        L_0x0019:
            java.lang.Object r10 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            r3 = 0
            switch(r2) {
                case 0: goto L_0x005e;
                case 1: goto L_0x0048;
                case 2: goto L_0x002d;
                default: goto L_0x0025;
            }
        L_0x0025:
            java.lang.IllegalStateException r9 = new java.lang.IllegalStateException
            java.lang.String r10 = "call to 'resume' before 'invoke' with coroutine"
            r9.<init>(r10)
            throw r9
        L_0x002d:
            r9 = 0
            r2 = 0
            java.lang.Object r4 = r0.L$2
            java.lang.Object r5 = r0.L$1
            kotlinx.coroutines.channels.ChannelIterator r5 = (kotlinx.coroutines.channels.ChannelIterator) r5
            java.lang.Object r6 = r0.L$0
            kotlinx.coroutines.channels.ReceiveChannel r6 = (kotlinx.coroutines.channels.ReceiveChannel) r6
            kotlin.ResultKt.throwOnFailure(r10)     // Catch:{ all -> 0x0046 }
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r0
            r0 = r10
            goto L_0x00ab
        L_0x0046:
            r9 = move-exception
            goto L_0x005c
        L_0x0048:
            r2 = 0
            r9 = 0
            java.lang.Object r4 = r0.L$1
            kotlinx.coroutines.channels.ChannelIterator r4 = (kotlinx.coroutines.channels.ChannelIterator) r4
            java.lang.Object r5 = r0.L$0
            kotlinx.coroutines.channels.ReceiveChannel r5 = (kotlinx.coroutines.channels.ReceiveChannel) r5
            kotlin.ResultKt.throwOnFailure(r10)     // Catch:{ all -> 0x005a }
            r7 = r10
            r6 = r5
            r5 = r9
            r9 = r3
            goto L_0x007b
        L_0x005a:
            r9 = move-exception
            r6 = r5
        L_0x005c:
            goto L_0x00d6
        L_0x005e:
            kotlin.ResultKt.throwOnFailure(r10)
            r6 = r9
            r2 = 0
            r9 = 0
            r4 = r6
            r5 = 0
            kotlinx.coroutines.channels.ChannelIterator r7 = r4.iterator()     // Catch:{ all -> 0x00d3 }
            r4 = r7
            r0.L$0 = r6     // Catch:{ all -> 0x00d3 }
            r0.L$1 = r4     // Catch:{ all -> 0x00d3 }
            r7 = 1
            r0.label = r7     // Catch:{ all -> 0x00d3 }
            java.lang.Object r7 = r4.hasNext(r0)     // Catch:{ all -> 0x00d3 }
            if (r7 != r1) goto L_0x007b
            return r1
        L_0x007b:
            java.lang.Boolean r7 = (java.lang.Boolean) r7     // Catch:{ all -> 0x00cf }
            boolean r7 = r7.booleanValue()     // Catch:{ all -> 0x00cf }
            if (r7 != 0) goto L_0x0088
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r9)
            return r3
        L_0x0088:
            r3 = r9
            java.lang.Object r9 = r4.next()     // Catch:{ all -> 0x00cd }
            r8 = r4
            r4 = r9
            r9 = r5
            r5 = r8
        L_0x0091:
            r0.L$0 = r6     // Catch:{ all -> 0x00cd }
            r0.L$1 = r5     // Catch:{ all -> 0x00cd }
            r0.L$2 = r4     // Catch:{ all -> 0x00cd }
            r7 = 2
            r0.label = r7     // Catch:{ all -> 0x00cd }
            java.lang.Object r7 = r5.hasNext(r0)     // Catch:{ all -> 0x00cd }
            if (r7 != r1) goto L_0x00a1
            return r1
        L_0x00a1:
            r8 = r0
            r0 = r10
            r10 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r8
        L_0x00ab:
            java.lang.Boolean r10 = (java.lang.Boolean) r10     // Catch:{ all -> 0x00c6 }
            boolean r10 = r10.booleanValue()     // Catch:{ all -> 0x00c6 }
            if (r10 == 0) goto L_0x00c1
            java.lang.Object r10 = r6.next()     // Catch:{ all -> 0x00c6 }
            r5 = r4
            r4 = r10
            r10 = r0
            r0 = r1
            r1 = r2
            r2 = r3
            r3 = r5
            r5 = r6
            r6 = r7
            goto L_0x0091
        L_0x00c1:
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r7, r4)
            return r5
        L_0x00c6:
            r9 = move-exception
            r6 = r7
            r10 = r0
            r0 = r1
            r2 = r3
            r3 = r4
            goto L_0x00d6
        L_0x00cd:
            r9 = move-exception
            goto L_0x00d6
        L_0x00cf:
            r1 = move-exception
            r3 = r9
            r9 = r1
            goto L_0x005c
        L_0x00d3:
            r1 = move-exception
            r3 = r9
            r9 = r1
        L_0x00d6:
            r1 = r9
            throw r9     // Catch:{ all -> 0x00d9 }
        L_0x00d9:
            r9 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r1)
            throw r9
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.lastOrNull(kotlinx.coroutines.channels.ReceiveChannel, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0077, code lost:
        if (((java.lang.Boolean) r3).booleanValue() == false) goto L_0x00a3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x0079, code lost:
        r3 = r6.next();
        r0.L$0 = r5;
        r0.L$1 = r3;
        r0.label = 2;
        r7 = r6.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x0088, code lost:
        if (r7 != r1) goto L_0x008b;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x008a, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:0x008b, code lost:
        r1 = r2;
        r2 = r3;
        r3 = r5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x0094, code lost:
        if (((java.lang.Boolean) r7).booleanValue() != false) goto L_0x009b;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:37:0x0096, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r3, r4);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:38:0x009a, code lost:
        return r2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:41:0x00a2, code lost:
        throw new java.lang.IllegalArgumentException("ReceiveChannel has more than one element.");
     */
    /* JADX WARNING: Code restructure failed: missing block: B:44:0x00aa, code lost:
        throw new java.util.NoSuchElementException("ReceiveChannel is empty.");
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x003d  */
    /* JADX WARNING: Removed duplicated region for block: B:21:0x0051  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object single(kotlinx.coroutines.channels.ReceiveChannel r9, kotlin.coroutines.Continuation r10) {
        /*
            boolean r0 = r10 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$single$1
            if (r0 == 0) goto L_0x0014
            r0 = r10
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$single$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$single$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r10 = r0.label
            int r10 = r10 - r2
            r0.label = r10
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$single$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$single$1
            r0.<init>(r10)
        L_0x0019:
            java.lang.Object r10 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x0051;
                case 1: goto L_0x003d;
                case 2: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r9 = new java.lang.IllegalStateException
            java.lang.String r10 = "call to 'resume' before 'invoke' with coroutine"
            r9.<init>(r10)
            throw r9
        L_0x002c:
            r9 = 0
            r1 = 0
            java.lang.Object r2 = r0.L$1
            java.lang.Object r3 = r0.L$0
            kotlinx.coroutines.channels.ReceiveChannel r3 = (kotlinx.coroutines.channels.ReceiveChannel) r3
            r4 = 0
            kotlin.ResultKt.throwOnFailure(r10)     // Catch:{ all -> 0x003a }
            r7 = r10
            goto L_0x008e
        L_0x003a:
            r1 = move-exception
            goto L_0x00ac
        L_0x003d:
            r9 = 0
            r2 = 0
            java.lang.Object r3 = r0.L$1
            kotlinx.coroutines.channels.ChannelIterator r3 = (kotlinx.coroutines.channels.ChannelIterator) r3
            r4 = 0
            java.lang.Object r5 = r0.L$0
            kotlinx.coroutines.channels.ReceiveChannel r5 = (kotlinx.coroutines.channels.ReceiveChannel) r5
            kotlin.ResultKt.throwOnFailure(r10)     // Catch:{ all -> 0x004e }
            r6 = r3
            r3 = r10
            goto L_0x0071
        L_0x004e:
            r1 = move-exception
            r3 = r5
            goto L_0x00ac
        L_0x0051:
            kotlin.ResultKt.throwOnFailure(r10)
            r3 = r9
            r9 = 0
            r4 = 0
            r2 = r3
            r5 = 0
            kotlinx.coroutines.channels.ChannelIterator r6 = r2.iterator()     // Catch:{ all -> 0x00ab }
            r0.L$0 = r3     // Catch:{ all -> 0x00ab }
            r0.L$1 = r6     // Catch:{ all -> 0x00ab }
            r2 = 1
            r0.label = r2     // Catch:{ all -> 0x00ab }
            java.lang.Object r2 = r6.hasNext(r0)     // Catch:{ all -> 0x00ab }
            if (r2 != r1) goto L_0x006d
            return r1
        L_0x006d:
            r8 = r3
            r3 = r2
            r2 = r5
            r5 = r8
        L_0x0071:
            java.lang.Boolean r3 = (java.lang.Boolean) r3     // Catch:{ all -> 0x004e }
            boolean r3 = r3.booleanValue()     // Catch:{ all -> 0x004e }
            if (r3 == 0) goto L_0x00a3
            java.lang.Object r3 = r6.next()     // Catch:{ all -> 0x004e }
            r0.L$0 = r5     // Catch:{ all -> 0x004e }
            r0.L$1 = r3     // Catch:{ all -> 0x004e }
            r7 = 2
            r0.label = r7     // Catch:{ all -> 0x004e }
            java.lang.Object r7 = r6.hasNext(r0)     // Catch:{ all -> 0x004e }
            if (r7 != r1) goto L_0x008b
            return r1
        L_0x008b:
            r1 = r2
            r2 = r3
            r3 = r5
        L_0x008e:
            java.lang.Boolean r7 = (java.lang.Boolean) r7     // Catch:{ all -> 0x003a }
            boolean r5 = r7.booleanValue()     // Catch:{ all -> 0x003a }
            if (r5 != 0) goto L_0x009b
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r3, r4)
            return r2
        L_0x009b:
            java.lang.IllegalArgumentException r5 = new java.lang.IllegalArgumentException     // Catch:{ all -> 0x003a }
            java.lang.String r6 = "ReceiveChannel has more than one element."
            r5.<init>(r6)     // Catch:{ all -> 0x003a }
            throw r5     // Catch:{ all -> 0x003a }
        L_0x00a3:
            java.util.NoSuchElementException r1 = new java.util.NoSuchElementException     // Catch:{ all -> 0x004e }
            java.lang.String r3 = "ReceiveChannel is empty."
            r1.<init>(r3)     // Catch:{ all -> 0x004e }
            throw r1     // Catch:{ all -> 0x004e }
        L_0x00ab:
            r1 = move-exception
        L_0x00ac:
            r2 = r1
            throw r1     // Catch:{ all -> 0x00af }
        L_0x00af:
            r1 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r3, r2)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.single(kotlinx.coroutines.channels.ReceiveChannel, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0082, code lost:
        if (((java.lang.Boolean) r5).booleanValue() != false) goto L_0x0089;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x0084, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r4);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x0088, code lost:
        return null;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:?, code lost:
        r5 = r7.next();
        r0.L$0 = r6;
        r0.L$1 = r5;
        r0.label = 2;
        r8 = r7.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:34:0x0098, code lost:
        if (r8 != r1) goto L_0x009b;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:35:0x009a, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x009b, code lost:
        r1 = r2;
        r2 = r5;
        r5 = r4;
        r4 = r6;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:39:0x00a5, code lost:
        if (((java.lang.Boolean) r8).booleanValue() == false) goto L_0x00ac;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:40:0x00a7, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r4, r5);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:41:0x00ab, code lost:
        return null;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:42:0x00ac, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r4, r5);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:43:0x00b0, code lost:
        return r2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:44:0x00b1, code lost:
        r10 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:45:0x00b2, code lost:
        r3 = r5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:46:0x00b4, code lost:
        r10 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:47:0x00b5, code lost:
        r1 = r2;
        r3 = r4;
        r4 = r6;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:48:0x00b9, code lost:
        r10 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:49:0x00ba, code lost:
        r3 = r4;
        r1 = r2;
        r4 = r6;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002d  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x003f  */
    /* JADX WARNING: Removed duplicated region for block: B:21:0x005b  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0025  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object singleOrNull(kotlinx.coroutines.channels.ReceiveChannel r10, kotlin.coroutines.Continuation r11) {
        /*
            boolean r0 = r11 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$singleOrNull$1
            if (r0 == 0) goto L_0x0014
            r0 = r11
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$singleOrNull$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$singleOrNull$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r11 = r0.label
            int r11 = r11 - r2
            r0.label = r11
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$singleOrNull$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$singleOrNull$1
            r0.<init>(r11)
        L_0x0019:
            java.lang.Object r11 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            r3 = 0
            switch(r2) {
                case 0: goto L_0x005b;
                case 1: goto L_0x003f;
                case 2: goto L_0x002d;
                default: goto L_0x0025;
            }
        L_0x0025:
            java.lang.IllegalStateException r10 = new java.lang.IllegalStateException
            java.lang.String r11 = "call to 'resume' before 'invoke' with coroutine"
            r10.<init>(r11)
            throw r10
        L_0x002d:
            r10 = 0
            r1 = 0
            java.lang.Object r2 = r0.L$1
            java.lang.Object r4 = r0.L$0
            kotlinx.coroutines.channels.ReceiveChannel r4 = (kotlinx.coroutines.channels.ReceiveChannel) r4
            kotlin.ResultKt.throwOnFailure(r11)     // Catch:{ all -> 0x003c }
            r8 = r11
            r5 = r3
            goto L_0x009f
        L_0x003c:
            r10 = move-exception
            goto L_0x00c3
        L_0x003f:
            r10 = 0
            r2 = 0
            java.lang.Object r4 = r0.L$1
            kotlinx.coroutines.channels.ChannelIterator r4 = (kotlinx.coroutines.channels.ChannelIterator) r4
            java.lang.Object r5 = r0.L$0
            kotlinx.coroutines.channels.ReceiveChannel r5 = (kotlinx.coroutines.channels.ReceiveChannel) r5
            kotlin.ResultKt.throwOnFailure(r11)     // Catch:{ all -> 0x0054 }
            r6 = r2
            r2 = r10
            r10 = r6
            r7 = r4
            r6 = r5
            r5 = r11
            r4 = r3
            goto L_0x007c
        L_0x0054:
            r1 = move-exception
            r4 = r5
            r9 = r1
            r1 = r10
            r10 = r9
            goto L_0x00c3
        L_0x005b:
            kotlin.ResultKt.throwOnFailure(r11)
            r4 = r10
            r10 = 0
            r2 = 0
            r5 = r4
            r6 = 0
            kotlinx.coroutines.channels.ChannelIterator r7 = r5.iterator()     // Catch:{ all -> 0x00be }
            r0.L$0 = r4     // Catch:{ all -> 0x00be }
            r0.L$1 = r7     // Catch:{ all -> 0x00be }
            r5 = 1
            r0.label = r5     // Catch:{ all -> 0x00be }
            java.lang.Object r5 = r7.hasNext(r0)     // Catch:{ all -> 0x00be }
            if (r5 != r1) goto L_0x0077
            return r1
        L_0x0077:
            r9 = r2
            r2 = r10
            r10 = r6
            r6 = r4
            r4 = r9
        L_0x007c:
            java.lang.Boolean r5 = (java.lang.Boolean) r5     // Catch:{ all -> 0x00b9 }
            boolean r5 = r5.booleanValue()     // Catch:{ all -> 0x00b9 }
            if (r5 != 0) goto L_0x0089
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r4)
            return r3
        L_0x0089:
            java.lang.Object r5 = r7.next()     // Catch:{ all -> 0x00b4 }
            r0.L$0 = r6     // Catch:{ all -> 0x00b4 }
            r0.L$1 = r5     // Catch:{ all -> 0x00b4 }
            r8 = 2
            r0.label = r8     // Catch:{ all -> 0x00b4 }
            java.lang.Object r8 = r7.hasNext(r0)     // Catch:{ all -> 0x00b4 }
            if (r8 != r1) goto L_0x009b
            return r1
        L_0x009b:
            r1 = r2
            r2 = r5
            r5 = r4
            r4 = r6
        L_0x009f:
            java.lang.Boolean r8 = (java.lang.Boolean) r8     // Catch:{ all -> 0x00b1 }
            boolean r6 = r8.booleanValue()     // Catch:{ all -> 0x00b1 }
            if (r6 == 0) goto L_0x00ac
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r4, r5)
            return r3
        L_0x00ac:
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r4, r5)
            return r2
        L_0x00b1:
            r10 = move-exception
            r3 = r5
            goto L_0x00c3
        L_0x00b4:
            r10 = move-exception
            r1 = r2
            r3 = r4
            r4 = r6
            goto L_0x00c3
        L_0x00b9:
            r10 = move-exception
            r3 = r4
            r1 = r2
            r4 = r6
            goto L_0x00c3
        L_0x00be:
            r1 = move-exception
            r3 = r1
            r1 = r10
            r10 = r3
            r3 = r2
        L_0x00c3:
            r2 = r10
            throw r10     // Catch:{ all -> 0x00c6 }
        L_0x00c6:
            r10 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r4, r2)
            throw r10
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.singleOrNull(kotlinx.coroutines.channels.ReceiveChannel, kotlin.coroutines.Continuation):java.lang.Object");
    }

    public static /* synthetic */ ReceiveChannel drop$default(ReceiveChannel receiveChannel, int i, CoroutineContext coroutineContext, int i2, Object obj) {
        if ((i2 & 2) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ProduceKt.produce$default(GlobalScope.INSTANCE, coroutineContext, 0, (CoroutineStart) null, ChannelsKt.consumes(receiveChannel), new ChannelsKt__DeprecatedKt$drop$1(i, receiveChannel, (Continuation<? super ChannelsKt__DeprecatedKt$drop$1>) null), 6, (Object) null);
    }

    public static /* synthetic */ ReceiveChannel dropWhile$default(ReceiveChannel receiveChannel, CoroutineContext coroutineContext, Function2 function2, int i, Object obj) {
        if ((i & 1) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ProduceKt.produce$default(GlobalScope.INSTANCE, coroutineContext, 0, (CoroutineStart) null, ChannelsKt.consumes(receiveChannel), new ChannelsKt__DeprecatedKt$dropWhile$1(receiveChannel, function2, (Continuation<? super ChannelsKt__DeprecatedKt$dropWhile$1>) null), 6, (Object) null);
    }

    public static /* synthetic */ ReceiveChannel filter$default(ReceiveChannel receiveChannel, CoroutineContext coroutineContext, Function2 function2, int i, Object obj) {
        if ((i & 1) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ChannelsKt.filter(receiveChannel, coroutineContext, function2);
    }

    public static final <E> ReceiveChannel<E> filter(ReceiveChannel<? extends E> $this$filter, CoroutineContext context, Function2<? super E, ? super Continuation<? super Boolean>, ? extends Object> predicate) {
        return ProduceKt.produce$default(GlobalScope.INSTANCE, context, 0, (CoroutineStart) null, ChannelsKt.consumes($this$filter), new ChannelsKt__DeprecatedKt$filter$1($this$filter, predicate, (Continuation<? super ChannelsKt__DeprecatedKt$filter$1>) null), 6, (Object) null);
    }

    public static /* synthetic */ ReceiveChannel filterIndexed$default(ReceiveChannel receiveChannel, CoroutineContext coroutineContext, Function3 function3, int i, Object obj) {
        if ((i & 1) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ProduceKt.produce$default(GlobalScope.INSTANCE, coroutineContext, 0, (CoroutineStart) null, ChannelsKt.consumes(receiveChannel), new ChannelsKt__DeprecatedKt$filterIndexed$1(receiveChannel, function3, (Continuation<? super ChannelsKt__DeprecatedKt$filterIndexed$1>) null), 6, (Object) null);
    }

    public static /* synthetic */ ReceiveChannel filterNot$default(ReceiveChannel receiveChannel, CoroutineContext coroutineContext, Function2 function2, int i, Object obj) {
        if ((i & 1) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ChannelsKt.filter(receiveChannel, coroutineContext, new ChannelsKt__DeprecatedKt$filterNot$1(function2, (Continuation<? super ChannelsKt__DeprecatedKt$filterNot$1>) null));
    }

    public static final <E> ReceiveChannel<E> filterNotNull(ReceiveChannel<? extends E> $this$filterNotNull) {
        ReceiveChannel<E> filter$default = filter$default($this$filterNotNull, (CoroutineContext) null, new ChannelsKt__DeprecatedKt$filterNotNull$1((Continuation<? super ChannelsKt__DeprecatedKt$filterNotNull$1>) null), 1, (Object) null);
        Intrinsics.checkNotNull(filter$default, "null cannot be cast to non-null type kotlinx.coroutines.channels.ReceiveChannel<E of kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.filterNotNull>");
        return filter$default;
    }

    /* JADX WARNING: Code restructure failed: missing block: B:20:?, code lost:
        r0.L$0 = r6;
        r0.L$1 = r5;
        r0.L$2 = r3;
        r0.label = 1;
        r7 = r3.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x006e, code lost:
        if (r7 != r1) goto L_0x0071;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x0070, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0071, code lost:
        r9 = r0;
        r0 = r12;
        r12 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r4;
        r4 = r3;
        r3 = r2;
        r2 = r1;
        r1 = r9;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x0081, code lost:
        if (((java.lang.Boolean) r12).booleanValue() == false) goto L_0x0097;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0083, code lost:
        r12 = r4.next();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x0088, code lost:
        if (r12 == null) goto L_0x008d;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x008a, code lost:
        r7.add(r12);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x008d, code lost:
        r12 = r0;
        r0 = r1;
        r1 = r2;
        r2 = r3;
        r3 = r4;
        r4 = r5;
        r5 = r6;
        r6 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x0097, code lost:
        r12 = kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x009a, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r5);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:33:0x00a0, code lost:
        return r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:34:0x00a1, code lost:
        r12 = move-exception;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:35:0x00a2, code lost:
        r4 = r1;
        r1 = r12;
        r12 = r0;
        r0 = r4;
        r4 = r5;
        r5 = r6;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x004b  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object filterNotNullTo(kotlinx.coroutines.channels.ReceiveChannel r10, java.util.Collection r11, kotlin.coroutines.Continuation r12) {
        /*
            boolean r0 = r12 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$filterNotNullTo$1
            if (r0 == 0) goto L_0x0014
            r0 = r12
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$filterNotNullTo$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$filterNotNullTo$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r12 = r0.label
            int r12 = r12 - r2
            r0.label = r12
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$filterNotNullTo$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$filterNotNullTo$1
            r0.<init>(r12)
        L_0x0019:
            java.lang.Object r12 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x004b;
                case 1: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r10 = new java.lang.IllegalStateException
            java.lang.String r11 = "call to 'resume' before 'invoke' with coroutine"
            r10.<init>(r11)
            throw r10
        L_0x002c:
            r10 = 0
            r11 = 0
            r2 = 0
            java.lang.Object r3 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r3 = (kotlinx.coroutines.channels.ChannelIterator) r3
            r4 = 0
            java.lang.Object r5 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r5 = (kotlinx.coroutines.channels.ReceiveChannel) r5
            java.lang.Object r6 = r0.L$0
            java.util.Collection r6 = (java.util.Collection) r6
            kotlin.ResultKt.throwOnFailure(r12)     // Catch:{ all -> 0x0048 }
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r0
            r0 = r12
            goto L_0x007b
        L_0x0048:
            r1 = move-exception
            goto L_0x00ac
        L_0x004b:
            kotlin.ResultKt.throwOnFailure(r12)
            r2 = 0
            r5 = r10
            r10 = 0
            r4 = 0
            r3 = r5
            r6 = 0
            kotlinx.coroutines.channels.ChannelIterator r7 = r3.iterator()     // Catch:{ all -> 0x00a9 }
            r3 = r11
            r11 = r10
            r10 = r2
            r2 = r6
            r6 = r3
            r3 = r7
        L_0x0061:
            r0.L$0 = r6     // Catch:{ all -> 0x0048 }
            r0.L$1 = r5     // Catch:{ all -> 0x0048 }
            r0.L$2 = r3     // Catch:{ all -> 0x0048 }
            r7 = 1
            r0.label = r7     // Catch:{ all -> 0x0048 }
            java.lang.Object r7 = r3.hasNext(r0)     // Catch:{ all -> 0x0048 }
            if (r7 != r1) goto L_0x0071
            return r1
        L_0x0071:
            r9 = r0
            r0 = r12
            r12 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r9
        L_0x007b:
            java.lang.Boolean r12 = (java.lang.Boolean) r12     // Catch:{ all -> 0x00a1 }
            boolean r12 = r12.booleanValue()     // Catch:{ all -> 0x00a1 }
            if (r12 == 0) goto L_0x0097
            java.lang.Object r12 = r4.next()     // Catch:{ all -> 0x00a1 }
            r8 = 0
            if (r12 == 0) goto L_0x008d
            r7.add(r12)     // Catch:{ all -> 0x00a1 }
        L_0x008d:
            r12 = r0
            r0 = r1
            r1 = r2
            r2 = r3
            r3 = r4
            r4 = r5
            r5 = r6
            r6 = r7
            goto L_0x0061
        L_0x0097:
            kotlin.Unit r12 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x00a1 }
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r5)
            return r7
        L_0x00a1:
            r12 = move-exception
            r4 = r1
            r1 = r12
            r12 = r0
            r0 = r4
            r4 = r5
            r5 = r6
            goto L_0x00ac
        L_0x00a9:
            r1 = move-exception
            r11 = r10
            r10 = r2
        L_0x00ac:
            r2 = r1
            throw r1     // Catch:{ all -> 0x00af }
        L_0x00af:
            r1 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r5, r2)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.filterNotNullTo(kotlinx.coroutines.channels.ReceiveChannel, java.util.Collection, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:13:0x0042  */
    /* JADX WARNING: Removed duplicated region for block: B:18:0x005f  */
    /* JADX WARNING: Removed duplicated region for block: B:26:0x0085  */
    /* JADX WARNING: Removed duplicated region for block: B:30:0x0092 A[Catch:{ all -> 0x00c6 }] */
    /* JADX WARNING: Removed duplicated region for block: B:39:0x00bc A[Catch:{ all -> 0x00c6 }] */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object filterNotNullTo(kotlinx.coroutines.channels.ReceiveChannel r11, kotlinx.coroutines.channels.SendChannel r12, kotlin.coroutines.Continuation r13) {
        /*
            boolean r0 = r13 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$filterNotNullTo$3
            if (r0 == 0) goto L_0x0014
            r0 = r13
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$filterNotNullTo$3 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$filterNotNullTo$3) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r13 = r0.label
            int r13 = r13 - r2
            r0.label = r13
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$filterNotNullTo$3 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$filterNotNullTo$3
            r0.<init>(r13)
        L_0x0019:
            java.lang.Object r13 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x005f;
                case 1: goto L_0x0042;
                case 2: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r11 = new java.lang.IllegalStateException
            java.lang.String r12 = "call to 'resume' before 'invoke' with coroutine"
            r11.<init>(r12)
            throw r11
        L_0x002c:
            r11 = 0
            r12 = 0
            r2 = 0
            r3 = 0
            java.lang.Object r4 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r4 = (kotlinx.coroutines.channels.ChannelIterator) r4
            r5 = 0
            java.lang.Object r6 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r6 = (kotlinx.coroutines.channels.ReceiveChannel) r6
            java.lang.Object r7 = r0.L$0
            kotlinx.coroutines.channels.SendChannel r7 = (kotlinx.coroutines.channels.SendChannel) r7
            kotlin.ResultKt.throwOnFailure(r13)     // Catch:{ all -> 0x005c }
            goto L_0x00af
        L_0x0042:
            r11 = 0
            r12 = 0
            r2 = 0
            java.lang.Object r3 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r3 = (kotlinx.coroutines.channels.ChannelIterator) r3
            r5 = 0
            java.lang.Object r4 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r4 = (kotlinx.coroutines.channels.ReceiveChannel) r4
            r6 = r4
            java.lang.Object r4 = r0.L$0
            kotlinx.coroutines.channels.SendChannel r4 = (kotlinx.coroutines.channels.SendChannel) r4
            kotlin.ResultKt.throwOnFailure(r13)     // Catch:{ all -> 0x005c }
            r7 = r4
            r4 = r2
            r2 = r1
            r1 = r0
            r0 = r13
            goto L_0x008a
        L_0x005c:
            r1 = move-exception
            goto L_0x00d6
        L_0x005f:
            kotlin.ResultKt.throwOnFailure(r13)
            r2 = 0
            r6 = r11
            r11 = 0
            r5 = 0
            r3 = r6
            r4 = 0
            kotlinx.coroutines.channels.ChannelIterator r7 = r3.iterator()     // Catch:{ all -> 0x00d3 }
            r10 = r13
            r13 = r11
            r11 = r2
            r2 = r1
            r1 = r0
            r0 = r10
        L_0x0075:
            r1.L$0 = r12     // Catch:{ all -> 0x00cc }
            r1.L$1 = r6     // Catch:{ all -> 0x00cc }
            r1.L$2 = r7     // Catch:{ all -> 0x00cc }
            r3 = 1
            r1.label = r3     // Catch:{ all -> 0x00cc }
            java.lang.Object r3 = r7.hasNext(r1)     // Catch:{ all -> 0x00cc }
            if (r3 != r2) goto L_0x0085
            return r2
        L_0x0085:
            r10 = r7
            r7 = r12
            r12 = r13
            r13 = r3
            r3 = r10
        L_0x008a:
            java.lang.Boolean r13 = (java.lang.Boolean) r13     // Catch:{ all -> 0x00c6 }
            boolean r13 = r13.booleanValue()     // Catch:{ all -> 0x00c6 }
            if (r13 == 0) goto L_0x00bc
            java.lang.Object r13 = r3.next()     // Catch:{ all -> 0x00c6 }
            r8 = 0
            if (r13 == 0) goto L_0x00b8
            r1.L$0 = r7     // Catch:{ all -> 0x00c6 }
            r1.L$1 = r6     // Catch:{ all -> 0x00c6 }
            r1.L$2 = r3     // Catch:{ all -> 0x00c6 }
            r9 = 2
            r1.label = r9     // Catch:{ all -> 0x00c6 }
            java.lang.Object r9 = r7.send(r13, r1)     // Catch:{ all -> 0x00c6 }
            if (r9 != r2) goto L_0x00a9
            return r2
        L_0x00a9:
            r13 = r0
            r0 = r1
            r1 = r2
            r2 = r4
            r4 = r3
            r3 = r8
        L_0x00af:
            r10 = r13
            r13 = r12
            r12 = r7
            r7 = r4
            r4 = r2
            r2 = r1
            r1 = r0
            r0 = r10
            goto L_0x00bb
        L_0x00b8:
            r13 = r12
            r12 = r7
            r7 = r3
        L_0x00bb:
            goto L_0x0075
        L_0x00bc:
            kotlin.Unit r13 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x00c6 }
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r5)
            return r7
        L_0x00c6:
            r13 = move-exception
            r10 = r1
            r1 = r13
            r13 = r0
            r0 = r10
            goto L_0x00d6
        L_0x00cc:
            r12 = move-exception
            r10 = r1
            r1 = r12
            r12 = r13
            r13 = r0
            r0 = r10
            goto L_0x00d6
        L_0x00d3:
            r1 = move-exception
            r12 = r11
            r11 = r2
        L_0x00d6:
            r2 = r1
            throw r1     // Catch:{ all -> 0x00d9 }
        L_0x00d9:
            r1 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r2)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.filterNotNullTo(kotlinx.coroutines.channels.ReceiveChannel, kotlinx.coroutines.channels.SendChannel, kotlin.coroutines.Continuation):java.lang.Object");
    }

    public static /* synthetic */ ReceiveChannel take$default(ReceiveChannel receiveChannel, int i, CoroutineContext coroutineContext, int i2, Object obj) {
        if ((i2 & 2) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ProduceKt.produce$default(GlobalScope.INSTANCE, coroutineContext, 0, (CoroutineStart) null, ChannelsKt.consumes(receiveChannel), new ChannelsKt__DeprecatedKt$take$1(i, receiveChannel, (Continuation<? super ChannelsKt__DeprecatedKt$take$1>) null), 6, (Object) null);
    }

    public static /* synthetic */ ReceiveChannel takeWhile$default(ReceiveChannel receiveChannel, CoroutineContext coroutineContext, Function2 function2, int i, Object obj) {
        if ((i & 1) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ProduceKt.produce$default(GlobalScope.INSTANCE, coroutineContext, 0, (CoroutineStart) null, ChannelsKt.consumes(receiveChannel), new ChannelsKt__DeprecatedKt$takeWhile$1(receiveChannel, function2, (Continuation<? super ChannelsKt__DeprecatedKt$takeWhile$1>) null), 6, (Object) null);
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Incorrect type for immutable var: ssa=C, code=kotlinx.coroutines.channels.SendChannel, for r12v0, types: [C] */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:14:0x004a  */
    /* JADX WARNING: Removed duplicated region for block: B:19:0x0067  */
    /* JADX WARNING: Removed duplicated region for block: B:31:0x009a A[Catch:{ all -> 0x00bf }] */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final <E, C extends kotlinx.coroutines.channels.SendChannel<? super E>> java.lang.Object toChannel(kotlinx.coroutines.channels.ReceiveChannel<? extends E> r11, kotlinx.coroutines.channels.SendChannel r12, kotlin.coroutines.Continuation<? super C> r13) {
        /*
            boolean r0 = r13 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toChannel$1
            if (r0 == 0) goto L_0x0014
            r0 = r13
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toChannel$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toChannel$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r13 = r0.label
            int r13 = r13 - r2
            r0.label = r13
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toChannel$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toChannel$1
            r0.<init>(r13)
        L_0x0019:
            java.lang.Object r13 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x0067;
                case 1: goto L_0x004a;
                case 2: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r11 = new java.lang.IllegalStateException
            java.lang.String r12 = "call to 'resume' before 'invoke' with coroutine"
            r11.<init>(r12)
            throw r11
        L_0x002c:
            r11 = 0
            r12 = 0
            r2 = 0
            r3 = 0
            java.lang.Object r4 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r4 = (kotlinx.coroutines.channels.ChannelIterator) r4
            r5 = 0
            java.lang.Object r6 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r6 = (kotlinx.coroutines.channels.ReceiveChannel) r6
            java.lang.Object r7 = r0.L$0
            kotlinx.coroutines.channels.SendChannel r7 = (kotlinx.coroutines.channels.SendChannel) r7
            kotlin.ResultKt.throwOnFailure(r13)     // Catch:{ all -> 0x0064 }
            r10 = r13
            r13 = r12
            r12 = r7
            r7 = r4
            r4 = r2
            r2 = r1
            r1 = r0
            r0 = r10
            goto L_0x00b3
        L_0x004a:
            r11 = 0
            r12 = 0
            r2 = 0
            java.lang.Object r3 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r3 = (kotlinx.coroutines.channels.ChannelIterator) r3
            r5 = 0
            java.lang.Object r4 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r4 = (kotlinx.coroutines.channels.ReceiveChannel) r4
            r6 = r4
            java.lang.Object r4 = r0.L$0
            kotlinx.coroutines.channels.SendChannel r4 = (kotlinx.coroutines.channels.SendChannel) r4
            kotlin.ResultKt.throwOnFailure(r13)     // Catch:{ all -> 0x0064 }
            r7 = r4
            r4 = r2
            r2 = r1
            r1 = r0
            r0 = r13
            goto L_0x0092
        L_0x0064:
            r1 = move-exception
            goto L_0x00cf
        L_0x0067:
            kotlin.ResultKt.throwOnFailure(r13)
            r2 = 0
            r6 = r11
            r11 = 0
            r5 = 0
            r3 = r6
            r4 = 0
            kotlinx.coroutines.channels.ChannelIterator r7 = r3.iterator()     // Catch:{ all -> 0x00cc }
            r10 = r13
            r13 = r11
            r11 = r2
            r2 = r1
            r1 = r0
            r0 = r10
        L_0x007d:
            r1.L$0 = r12     // Catch:{ all -> 0x00c5 }
            r1.L$1 = r6     // Catch:{ all -> 0x00c5 }
            r1.L$2 = r7     // Catch:{ all -> 0x00c5 }
            r3 = 1
            r1.label = r3     // Catch:{ all -> 0x00c5 }
            java.lang.Object r3 = r7.hasNext(r1)     // Catch:{ all -> 0x00c5 }
            if (r3 != r2) goto L_0x008d
            return r2
        L_0x008d:
            r10 = r7
            r7 = r12
            r12 = r13
            r13 = r3
            r3 = r10
        L_0x0092:
            java.lang.Boolean r13 = (java.lang.Boolean) r13     // Catch:{ all -> 0x00bf }
            boolean r13 = r13.booleanValue()     // Catch:{ all -> 0x00bf }
            if (r13 == 0) goto L_0x00b5
            java.lang.Object r13 = r3.next()     // Catch:{ all -> 0x00bf }
            r8 = 0
            r1.L$0 = r7     // Catch:{ all -> 0x00bf }
            r1.L$1 = r6     // Catch:{ all -> 0x00bf }
            r1.L$2 = r3     // Catch:{ all -> 0x00bf }
            r9 = 2
            r1.label = r9     // Catch:{ all -> 0x00bf }
            java.lang.Object r9 = r7.send(r13, r1)     // Catch:{ all -> 0x00bf }
            if (r9 != r2) goto L_0x00af
            return r2
        L_0x00af:
            r13 = r12
            r12 = r7
            r7 = r3
            r3 = r8
        L_0x00b3:
            goto L_0x007d
        L_0x00b5:
            kotlin.Unit r13 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x00bf }
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r5)
            return r7
        L_0x00bf:
            r13 = move-exception
            r10 = r1
            r1 = r13
            r13 = r0
            r0 = r10
            goto L_0x00cf
        L_0x00c5:
            r12 = move-exception
            r10 = r1
            r1 = r12
            r12 = r13
            r13 = r0
            r0 = r10
            goto L_0x00cf
        L_0x00cc:
            r1 = move-exception
            r12 = r11
            r11 = r2
        L_0x00cf:
            r2 = r1
            throw r1     // Catch:{ all -> 0x00d2 }
        L_0x00d2:
            r1 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r2)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.toChannel(kotlinx.coroutines.channels.ReceiveChannel, kotlinx.coroutines.channels.SendChannel, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Code restructure failed: missing block: B:20:?, code lost:
        r0.L$0 = r6;
        r0.L$1 = r5;
        r0.L$2 = r3;
        r0.label = 1;
        r7 = r3.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x006e, code lost:
        if (r7 != r1) goto L_0x0071;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x0070, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0071, code lost:
        r10 = r0;
        r0 = r13;
        r13 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r4;
        r4 = r3;
        r3 = r2;
        r2 = r1;
        r1 = r10;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x0081, code lost:
        if (((java.lang.Boolean) r13).booleanValue() == false) goto L_0x0096;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0083, code lost:
        r7.add(r4.next());
        r13 = r0;
        r0 = r1;
        r1 = r2;
        r2 = r3;
        r3 = r4;
        r4 = r5;
        r5 = r6;
        r6 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x0096, code lost:
        r13 = kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0099, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r5);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x009f, code lost:
        return r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x00a0, code lost:
        r13 = move-exception;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x00a1, code lost:
        r4 = r1;
        r1 = r13;
        r13 = r0;
        r0 = r4;
        r4 = r5;
        r5 = r6;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x004b  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final <E, C extends java.util.Collection<? super E>> java.lang.Object toCollection(kotlinx.coroutines.channels.ReceiveChannel<? extends E> r11, C r12, kotlin.coroutines.Continuation<? super C> r13) {
        /*
            boolean r0 = r13 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toCollection$1
            if (r0 == 0) goto L_0x0014
            r0 = r13
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toCollection$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toCollection$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r13 = r0.label
            int r13 = r13 - r2
            r0.label = r13
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toCollection$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toCollection$1
            r0.<init>(r13)
        L_0x0019:
            java.lang.Object r13 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x004b;
                case 1: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r11 = new java.lang.IllegalStateException
            java.lang.String r12 = "call to 'resume' before 'invoke' with coroutine"
            r11.<init>(r12)
            throw r11
        L_0x002c:
            r11 = 0
            r12 = 0
            r2 = 0
            java.lang.Object r3 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r3 = (kotlinx.coroutines.channels.ChannelIterator) r3
            r4 = 0
            java.lang.Object r5 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r5 = (kotlinx.coroutines.channels.ReceiveChannel) r5
            java.lang.Object r6 = r0.L$0
            java.util.Collection r6 = (java.util.Collection) r6
            kotlin.ResultKt.throwOnFailure(r13)     // Catch:{ all -> 0x0048 }
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r0
            r0 = r13
            goto L_0x007b
        L_0x0048:
            r1 = move-exception
            goto L_0x00ab
        L_0x004b:
            kotlin.ResultKt.throwOnFailure(r13)
            r2 = 0
            r5 = r11
            r11 = 0
            r4 = 0
            r3 = r5
            r6 = 0
            kotlinx.coroutines.channels.ChannelIterator r7 = r3.iterator()     // Catch:{ all -> 0x00a8 }
            r3 = r12
            r12 = r11
            r11 = r2
            r2 = r6
            r6 = r3
            r3 = r7
        L_0x0061:
            r0.L$0 = r6     // Catch:{ all -> 0x0048 }
            r0.L$1 = r5     // Catch:{ all -> 0x0048 }
            r0.L$2 = r3     // Catch:{ all -> 0x0048 }
            r7 = 1
            r0.label = r7     // Catch:{ all -> 0x0048 }
            java.lang.Object r7 = r3.hasNext(r0)     // Catch:{ all -> 0x0048 }
            if (r7 != r1) goto L_0x0071
            return r1
        L_0x0071:
            r10 = r0
            r0 = r13
            r13 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r10
        L_0x007b:
            java.lang.Boolean r13 = (java.lang.Boolean) r13     // Catch:{ all -> 0x00a0 }
            boolean r13 = r13.booleanValue()     // Catch:{ all -> 0x00a0 }
            if (r13 == 0) goto L_0x0096
            java.lang.Object r13 = r4.next()     // Catch:{ all -> 0x00a0 }
            r8 = r13
            r9 = 0
            r7.add(r8)     // Catch:{ all -> 0x00a0 }
            r13 = r0
            r0 = r1
            r1 = r2
            r2 = r3
            r3 = r4
            r4 = r5
            r5 = r6
            r6 = r7
            goto L_0x0061
        L_0x0096:
            kotlin.Unit r13 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x00a0 }
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r5)
            return r7
        L_0x00a0:
            r13 = move-exception
            r4 = r1
            r1 = r13
            r13 = r0
            r0 = r4
            r4 = r5
            r5 = r6
            goto L_0x00ab
        L_0x00a8:
            r1 = move-exception
            r12 = r11
            r11 = r2
        L_0x00ab:
            r2 = r1
            throw r1     // Catch:{ all -> 0x00ae }
        L_0x00ae:
            r1 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r5, r2)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.toCollection(kotlinx.coroutines.channels.ReceiveChannel, java.util.Collection, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Code restructure failed: missing block: B:20:?, code lost:
        r0.L$0 = r6;
        r0.L$1 = r5;
        r0.L$2 = r3;
        r0.label = 1;
        r7 = r3.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x006e, code lost:
        if (r7 != r1) goto L_0x0071;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x0070, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0071, code lost:
        r12 = r0;
        r0 = r15;
        r15 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r4;
        r4 = r3;
        r3 = r2;
        r2 = r1;
        r1 = r12;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x0081, code lost:
        if (((java.lang.Boolean) r15).booleanValue() == false) goto L_0x00a0;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0083, code lost:
        r8 = (kotlin.Pair) r4.next();
        r7.put(r8.getFirst(), r8.getSecond());
        r15 = r0;
        r0 = r1;
        r1 = r2;
        r2 = r3;
        r3 = r4;
        r4 = r5;
        r5 = r6;
        r6 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x00a0, code lost:
        r15 = kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x00a3, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r5);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x00a9, code lost:
        return r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x00aa, code lost:
        r15 = move-exception;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x00ab, code lost:
        r4 = r1;
        r1 = r15;
        r15 = r0;
        r0 = r4;
        r4 = r5;
        r5 = r6;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x004b  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final <K, V, M extends java.util.Map<? super K, ? super V>> java.lang.Object toMap(kotlinx.coroutines.channels.ReceiveChannel<? extends kotlin.Pair<? extends K, ? extends V>> r13, M r14, kotlin.coroutines.Continuation<? super M> r15) {
        /*
            boolean r0 = r15 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toMap$2
            if (r0 == 0) goto L_0x0014
            r0 = r15
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toMap$2 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toMap$2) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r15 = r0.label
            int r15 = r15 - r2
            r0.label = r15
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toMap$2 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$toMap$2
            r0.<init>(r15)
        L_0x0019:
            java.lang.Object r15 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x004b;
                case 1: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r13 = new java.lang.IllegalStateException
            java.lang.String r14 = "call to 'resume' before 'invoke' with coroutine"
            r13.<init>(r14)
            throw r13
        L_0x002c:
            r13 = 0
            r14 = 0
            r2 = 0
            java.lang.Object r3 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r3 = (kotlinx.coroutines.channels.ChannelIterator) r3
            r4 = 0
            java.lang.Object r5 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r5 = (kotlinx.coroutines.channels.ReceiveChannel) r5
            java.lang.Object r6 = r0.L$0
            java.util.Map r6 = (java.util.Map) r6
            kotlin.ResultKt.throwOnFailure(r15)     // Catch:{ all -> 0x0048 }
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r0
            r0 = r15
            goto L_0x007b
        L_0x0048:
            r1 = move-exception
            goto L_0x00b5
        L_0x004b:
            kotlin.ResultKt.throwOnFailure(r15)
            r2 = 0
            r5 = r13
            r13 = 0
            r4 = 0
            r3 = r5
            r6 = 0
            kotlinx.coroutines.channels.ChannelIterator r7 = r3.iterator()     // Catch:{ all -> 0x00b2 }
            r3 = r14
            r14 = r13
            r13 = r2
            r2 = r6
            r6 = r3
            r3 = r7
        L_0x0061:
            r0.L$0 = r6     // Catch:{ all -> 0x0048 }
            r0.L$1 = r5     // Catch:{ all -> 0x0048 }
            r0.L$2 = r3     // Catch:{ all -> 0x0048 }
            r7 = 1
            r0.label = r7     // Catch:{ all -> 0x0048 }
            java.lang.Object r7 = r3.hasNext(r0)     // Catch:{ all -> 0x0048 }
            if (r7 != r1) goto L_0x0071
            return r1
        L_0x0071:
            r12 = r0
            r0 = r15
            r15 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r12
        L_0x007b:
            java.lang.Boolean r15 = (java.lang.Boolean) r15     // Catch:{ all -> 0x00aa }
            boolean r15 = r15.booleanValue()     // Catch:{ all -> 0x00aa }
            if (r15 == 0) goto L_0x00a0
            java.lang.Object r15 = r4.next()     // Catch:{ all -> 0x00aa }
            r8 = r15
            kotlin.Pair r8 = (kotlin.Pair) r8     // Catch:{ all -> 0x00aa }
            r9 = 0
            java.lang.Object r10 = r8.getFirst()     // Catch:{ all -> 0x00aa }
            java.lang.Object r11 = r8.getSecond()     // Catch:{ all -> 0x00aa }
            r7.put(r10, r11)     // Catch:{ all -> 0x00aa }
            r15 = r0
            r0 = r1
            r1 = r2
            r2 = r3
            r3 = r4
            r4 = r5
            r5 = r6
            r6 = r7
            goto L_0x0061
        L_0x00a0:
            kotlin.Unit r15 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x00aa }
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r5)
            return r7
        L_0x00aa:
            r15 = move-exception
            r4 = r1
            r1 = r15
            r15 = r0
            r0 = r4
            r4 = r5
            r5 = r6
            goto L_0x00b5
        L_0x00b2:
            r1 = move-exception
            r14 = r13
            r13 = r2
        L_0x00b5:
            r2 = r1
            throw r1     // Catch:{ all -> 0x00b8 }
        L_0x00b8:
            r1 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r5, r2)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.toMap(kotlinx.coroutines.channels.ReceiveChannel, java.util.Map, kotlin.coroutines.Continuation):java.lang.Object");
    }

    public static /* synthetic */ ReceiveChannel flatMap$default(ReceiveChannel receiveChannel, CoroutineContext coroutineContext, Function2 function2, int i, Object obj) {
        if ((i & 1) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ProduceKt.produce$default(GlobalScope.INSTANCE, coroutineContext, 0, (CoroutineStart) null, ChannelsKt.consumes(receiveChannel), new ChannelsKt__DeprecatedKt$flatMap$1(receiveChannel, function2, (Continuation<? super ChannelsKt__DeprecatedKt$flatMap$1>) null), 6, (Object) null);
    }

    public static /* synthetic */ ReceiveChannel map$default(ReceiveChannel receiveChannel, CoroutineContext coroutineContext, Function2 function2, int i, Object obj) {
        if ((i & 1) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ChannelsKt.map(receiveChannel, coroutineContext, function2);
    }

    public static final <E, R> ReceiveChannel<R> map(ReceiveChannel<? extends E> $this$map, CoroutineContext context, Function2<? super E, ? super Continuation<? super R>, ? extends Object> transform) {
        return ProduceKt.produce$default(GlobalScope.INSTANCE, context, 0, (CoroutineStart) null, ChannelsKt.consumes($this$map), new ChannelsKt__DeprecatedKt$map$1($this$map, transform, (Continuation<? super ChannelsKt__DeprecatedKt$map$1>) null), 6, (Object) null);
    }

    public static /* synthetic */ ReceiveChannel mapIndexed$default(ReceiveChannel receiveChannel, CoroutineContext coroutineContext, Function3 function3, int i, Object obj) {
        if ((i & 1) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ChannelsKt.mapIndexed(receiveChannel, coroutineContext, function3);
    }

    public static final <E, R> ReceiveChannel<R> mapIndexed(ReceiveChannel<? extends E> $this$mapIndexed, CoroutineContext context, Function3<? super Integer, ? super E, ? super Continuation<? super R>, ? extends Object> transform) {
        return ProduceKt.produce$default(GlobalScope.INSTANCE, context, 0, (CoroutineStart) null, ChannelsKt.consumes($this$mapIndexed), new ChannelsKt__DeprecatedKt$mapIndexed$1($this$mapIndexed, transform, (Continuation<? super ChannelsKt__DeprecatedKt$mapIndexed$1>) null), 6, (Object) null);
    }

    public static /* synthetic */ ReceiveChannel mapIndexedNotNull$default(ReceiveChannel receiveChannel, CoroutineContext coroutineContext, Function3 function3, int i, Object obj) {
        if ((i & 1) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ChannelsKt.filterNotNull(ChannelsKt.mapIndexed(receiveChannel, coroutineContext, function3));
    }

    public static /* synthetic */ ReceiveChannel mapNotNull$default(ReceiveChannel receiveChannel, CoroutineContext coroutineContext, Function2 function2, int i, Object obj) {
        if ((i & 1) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ChannelsKt.filterNotNull(ChannelsKt.map(receiveChannel, coroutineContext, function2));
    }

    public static /* synthetic */ ReceiveChannel withIndex$default(ReceiveChannel receiveChannel, CoroutineContext coroutineContext, int i, Object obj) {
        if ((i & 1) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ProduceKt.produce$default(GlobalScope.INSTANCE, coroutineContext, 0, (CoroutineStart) null, ChannelsKt.consumes(receiveChannel), new ChannelsKt__DeprecatedKt$withIndex$1(receiveChannel, (Continuation<? super ChannelsKt__DeprecatedKt$withIndex$1>) null), 6, (Object) null);
    }

    public static /* synthetic */ ReceiveChannel distinctBy$default(ReceiveChannel receiveChannel, CoroutineContext coroutineContext, Function2 function2, int i, Object obj) {
        if ((i & 1) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ChannelsKt.distinctBy(receiveChannel, coroutineContext, function2);
    }

    public static final <E, K> ReceiveChannel<E> distinctBy(ReceiveChannel<? extends E> $this$distinctBy, CoroutineContext context, Function2<? super E, ? super Continuation<? super K>, ? extends Object> selector) {
        return ProduceKt.produce$default(GlobalScope.INSTANCE, context, 0, (CoroutineStart) null, ChannelsKt.consumes($this$distinctBy), new ChannelsKt__DeprecatedKt$distinctBy$1($this$distinctBy, selector, (Continuation<? super ChannelsKt__DeprecatedKt$distinctBy$1>) null), 6, (Object) null);
    }

    public static final <E> Object toMutableSet(ReceiveChannel<? extends E> $this$toMutableSet, Continuation<? super Set<E>> $completion) {
        return ChannelsKt.toCollection($this$toMutableSet, new LinkedHashSet(), $completion);
    }

    /* JADX WARNING: Code restructure failed: missing block: B:20:0x0054, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r2, r3);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x0057, code lost:
        return r6;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002c  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x003a  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0024  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object any(kotlinx.coroutines.channels.ReceiveChannel r8, kotlin.coroutines.Continuation r9) {
        /*
            boolean r0 = r9 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$any$1
            if (r0 == 0) goto L_0x0014
            r0 = r9
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$any$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$any$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r9 = r0.label
            int r9 = r9 - r2
            r0.label = r9
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$any$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$any$1
            r0.<init>(r9)
        L_0x0019:
            java.lang.Object r9 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            switch(r2) {
                case 0: goto L_0x003a;
                case 1: goto L_0x002c;
                default: goto L_0x0024;
            }
        L_0x0024:
            java.lang.IllegalStateException r8 = new java.lang.IllegalStateException
            java.lang.String r9 = "call to 'resume' before 'invoke' with coroutine"
            r8.<init>(r9)
            throw r8
        L_0x002c:
            r8 = 0
            r1 = 0
            java.lang.Object r2 = r0.L$0
            kotlinx.coroutines.channels.ReceiveChannel r2 = (kotlinx.coroutines.channels.ReceiveChannel) r2
            r3 = 0
            kotlin.ResultKt.throwOnFailure(r9)     // Catch:{ all -> 0x0038 }
            r6 = r9
            goto L_0x0054
        L_0x0038:
            r1 = move-exception
            goto L_0x0059
        L_0x003a:
            kotlin.ResultKt.throwOnFailure(r9)
            r2 = r8
            r8 = 0
            r3 = 0
            r4 = r2
            r5 = 0
            kotlinx.coroutines.channels.ChannelIterator r6 = r4.iterator()     // Catch:{ all -> 0x0058 }
            r0.L$0 = r2     // Catch:{ all -> 0x0058 }
            r7 = 1
            r0.label = r7     // Catch:{ all -> 0x0058 }
            java.lang.Object r6 = r6.hasNext(r0)     // Catch:{ all -> 0x0058 }
            if (r6 != r1) goto L_0x0054
            return r1
        L_0x0054:
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r2, r3)
            return r6
        L_0x0058:
            r1 = move-exception
        L_0x0059:
            r3 = r1
            throw r1     // Catch:{ all -> 0x005c }
        L_0x005c:
            r1 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r2, r3)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.any(kotlinx.coroutines.channels.ReceiveChannel, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Code restructure failed: missing block: B:20:?, code lost:
        r0.L$0 = r8;
        r0.L$1 = r7;
        r0.L$2 = r5;
        r0.label = 1;
        r9 = r5.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:21:0x0074, code lost:
        if (r9 != r1) goto L_0x0077;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:22:0x0076, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x0077, code lost:
        r12 = r0;
        r0 = r14;
        r14 = r9;
        r9 = r8;
        r8 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r4;
        r4 = r2;
        r2 = r1;
        r1 = r12;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x0088, code lost:
        if (((java.lang.Boolean) r14).booleanValue() == false) goto L_0x009e;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x008a, code lost:
        r14 = r6.next();
        r9.element++;
        r14 = r0;
        r0 = r1;
        r1 = r2;
        r2 = r4;
        r4 = r5;
        r5 = r6;
        r6 = r7;
        r7 = r8;
        r8 = r9;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x009e, code lost:
        r14 = kotlin.Unit.INSTANCE;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x00a1, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r8, r7);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x00ad, code lost:
        return kotlin.coroutines.jvm.internal.Boxing.boxInt(r9.element);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x00ae, code lost:
        r14 = move-exception;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x00af, code lost:
        r2 = r1;
        r1 = r14;
        r14 = r0;
        r0 = r2;
        r2 = r4;
        r6 = r7;
        r7 = r8;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002d  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x004d  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0025  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object count(kotlinx.coroutines.channels.ReceiveChannel r13, kotlin.coroutines.Continuation r14) {
        /*
            boolean r0 = r14 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$count$1
            if (r0 == 0) goto L_0x0014
            r0 = r14
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$count$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$count$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r14 = r0.label
            int r14 = r14 - r2
            r0.label = r14
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$count$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$count$1
            r0.<init>(r14)
        L_0x0019:
            java.lang.Object r14 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            r3 = 1
            switch(r2) {
                case 0: goto L_0x004d;
                case 1: goto L_0x002d;
                default: goto L_0x0025;
            }
        L_0x0025:
            java.lang.IllegalStateException r13 = new java.lang.IllegalStateException
            java.lang.String r14 = "call to 'resume' before 'invoke' with coroutine"
            r13.<init>(r14)
            throw r13
        L_0x002d:
            r13 = 0
            r2 = 0
            r4 = 0
            java.lang.Object r5 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r5 = (kotlinx.coroutines.channels.ChannelIterator) r5
            r6 = 0
            java.lang.Object r7 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r7 = (kotlinx.coroutines.channels.ReceiveChannel) r7
            java.lang.Object r8 = r0.L$0
            kotlin.jvm.internal.Ref$IntRef r8 = (kotlin.jvm.internal.Ref.IntRef) r8
            kotlin.ResultKt.throwOnFailure(r14)     // Catch:{ all -> 0x004a }
            r9 = r8
            r8 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r2
            r2 = r1
            r1 = r0
            r0 = r14
            goto L_0x0082
        L_0x004a:
            r1 = move-exception
            goto L_0x00ba
        L_0x004d:
            kotlin.ResultKt.throwOnFailure(r14)
            kotlin.jvm.internal.Ref$IntRef r2 = new kotlin.jvm.internal.Ref$IntRef
            r2.<init>()
            r4 = 0
            r7 = r13
            r13 = 0
            r6 = 0
            r5 = r7
            r8 = 0
            kotlinx.coroutines.channels.ChannelIterator r9 = r5.iterator()     // Catch:{ all -> 0x00b7 }
            r5 = r2
            r2 = r13
            r13 = r4
            r4 = r8
            r8 = r5
            r5 = r9
        L_0x0068:
            r0.L$0 = r8     // Catch:{ all -> 0x004a }
            r0.L$1 = r7     // Catch:{ all -> 0x004a }
            r0.L$2 = r5     // Catch:{ all -> 0x004a }
            r0.label = r3     // Catch:{ all -> 0x004a }
            java.lang.Object r9 = r5.hasNext(r0)     // Catch:{ all -> 0x004a }
            if (r9 != r1) goto L_0x0077
            return r1
        L_0x0077:
            r12 = r0
            r0 = r14
            r14 = r9
            r9 = r8
            r8 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r2
            r2 = r1
            r1 = r12
        L_0x0082:
            java.lang.Boolean r14 = (java.lang.Boolean) r14     // Catch:{ all -> 0x00ae }
            boolean r14 = r14.booleanValue()     // Catch:{ all -> 0x00ae }
            if (r14 == 0) goto L_0x009e
            java.lang.Object r14 = r6.next()     // Catch:{ all -> 0x00ae }
            r10 = 0
            int r11 = r9.element     // Catch:{ all -> 0x00ae }
            int r11 = r11 + r3
            r9.element = r11     // Catch:{ all -> 0x00ae }
            r14 = r0
            r0 = r1
            r1 = r2
            r2 = r4
            r4 = r5
            r5 = r6
            r6 = r7
            r7 = r8
            r8 = r9
            goto L_0x0068
        L_0x009e:
            kotlin.Unit r14 = kotlin.Unit.INSTANCE     // Catch:{ all -> 0x00ae }
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r8, r7)
            int r13 = r9.element
            java.lang.Integer r13 = kotlin.coroutines.jvm.internal.Boxing.boxInt(r13)
            return r13
        L_0x00ae:
            r14 = move-exception
            r2 = r1
            r1 = r14
            r14 = r0
            r0 = r2
            r2 = r4
            r6 = r7
            r7 = r8
            goto L_0x00ba
        L_0x00b7:
            r1 = move-exception
            r2 = r13
            r13 = r4
        L_0x00ba:
            r3 = r1
            throw r1     // Catch:{ all -> 0x00bd }
        L_0x00bd:
            r1 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r7, r3)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.count(kotlinx.coroutines.channels.ReceiveChannel, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0091, code lost:
        if (((java.lang.Boolean) r4).booleanValue() != false) goto L_0x0097;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x0093, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r5, r2);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x0096, code lost:
        return null;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x0097, code lost:
        r3 = r2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:34:?, code lost:
        r2 = r7.next();
        r4 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:35:0x009d, code lost:
        r0.L$0 = r6;
        r0.L$1 = r5;
        r0.L$2 = r4;
        r0.L$3 = r2;
        r0.label = 2;
        r7 = r4.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x00ac, code lost:
        if (r7 != r1) goto L_0x00af;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:37:0x00ae, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:38:0x00af, code lost:
        r9 = r0;
        r0 = r12;
        r12 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r4;
        r4 = r3;
        r3 = r2;
        r2 = r1;
        r1 = r9;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:41:0x00bf, code lost:
        if (((java.lang.Boolean) r12).booleanValue() == false) goto L_0x00de;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:42:0x00c1, code lost:
        r12 = r5.next();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:43:0x00c9, code lost:
        if (r7.compare(r3, r12) >= 0) goto L_0x00d5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:44:0x00cb, code lost:
        r3 = r4;
        r4 = r2;
        r2 = r12;
        r12 = r0;
        r0 = r1;
        r1 = r4;
        r4 = r5;
        r5 = r6;
        r6 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:45:0x00d5, code lost:
        r12 = r0;
        r0 = r1;
        r1 = r2;
        r2 = r3;
        r3 = r4;
        r4 = r5;
        r5 = r6;
        r6 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:46:0x00de, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r4);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:47:0x00e2, code lost:
        return r3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:48:0x00e3, code lost:
        r10 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:49:0x00e4, code lost:
        r5 = r6;
        r3 = r4;
        r12 = r0;
        r0 = r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:50:0x00e9, code lost:
        r10 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:51:0x00eb, code lost:
        r10 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:52:0x00ec, code lost:
        r3 = r2;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002d  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x004d  */
    /* JADX WARNING: Removed duplicated region for block: B:21:0x0068  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0025  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object maxWith(kotlinx.coroutines.channels.ReceiveChannel r10, java.util.Comparator r11, kotlin.coroutines.Continuation r12) {
        /*
            boolean r0 = r12 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$maxWith$1
            if (r0 == 0) goto L_0x0014
            r0 = r12
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$maxWith$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$maxWith$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r12 = r0.label
            int r12 = r12 - r2
            r0.label = r12
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$maxWith$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$maxWith$1
            r0.<init>(r12)
        L_0x0019:
            java.lang.Object r12 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            r3 = 0
            switch(r2) {
                case 0: goto L_0x0068;
                case 1: goto L_0x004d;
                case 2: goto L_0x002d;
                default: goto L_0x0025;
            }
        L_0x0025:
            java.lang.IllegalStateException r10 = new java.lang.IllegalStateException
            java.lang.String r11 = "call to 'resume' before 'invoke' with coroutine"
            r10.<init>(r11)
            throw r10
        L_0x002d:
            r10 = 0
            r11 = 0
            java.lang.Object r2 = r0.L$3
            java.lang.Object r4 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r4 = (kotlinx.coroutines.channels.ChannelIterator) r4
            java.lang.Object r5 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r5 = (kotlinx.coroutines.channels.ReceiveChannel) r5
            java.lang.Object r6 = r0.L$0
            java.util.Comparator r6 = (java.util.Comparator) r6
            kotlin.ResultKt.throwOnFailure(r12)     // Catch:{ all -> 0x004a }
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r0
            r0 = r12
            goto L_0x00b9
        L_0x004a:
            r10 = move-exception
            goto L_0x00f2
        L_0x004d:
            r11 = 0
            r10 = 0
            java.lang.Object r2 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r2 = (kotlinx.coroutines.channels.ChannelIterator) r2
            java.lang.Object r4 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r4 = (kotlinx.coroutines.channels.ReceiveChannel) r4
            java.lang.Object r5 = r0.L$0
            java.util.Comparator r5 = (java.util.Comparator) r5
            kotlin.ResultKt.throwOnFailure(r12)     // Catch:{ all -> 0x0064 }
            r7 = r2
            r2 = r3
            r6 = r5
            r5 = r4
            r4 = r12
            goto L_0x008b
        L_0x0064:
            r10 = move-exception
            r5 = r4
            goto L_0x00f2
        L_0x0068:
            kotlin.ResultKt.throwOnFailure(r12)
            r5 = r11
            r11 = 0
            r2 = 0
            r4 = r10
            r6 = 0
            kotlinx.coroutines.channels.ChannelIterator r7 = r4.iterator()     // Catch:{ all -> 0x00ee }
            r0.L$0 = r5     // Catch:{ all -> 0x00ee }
            r0.L$1 = r10     // Catch:{ all -> 0x00ee }
            r0.L$2 = r7     // Catch:{ all -> 0x00ee }
            r4 = 1
            r0.label = r4     // Catch:{ all -> 0x00ee }
            java.lang.Object r4 = r7.hasNext(r0)     // Catch:{ all -> 0x00ee }
            if (r4 != r1) goto L_0x0087
            return r1
        L_0x0087:
            r9 = r5
            r5 = r10
            r10 = r6
            r6 = r9
        L_0x008b:
            java.lang.Boolean r4 = (java.lang.Boolean) r4     // Catch:{ all -> 0x00eb }
            boolean r4 = r4.booleanValue()     // Catch:{ all -> 0x00eb }
            if (r4 != 0) goto L_0x0097
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r5, r2)
            return r3
        L_0x0097:
            r3 = r2
            java.lang.Object r2 = r7.next()     // Catch:{ all -> 0x00e9 }
            r4 = r7
        L_0x009d:
            r0.L$0 = r6     // Catch:{ all -> 0x00e9 }
            r0.L$1 = r5     // Catch:{ all -> 0x00e9 }
            r0.L$2 = r4     // Catch:{ all -> 0x00e9 }
            r0.L$3 = r2     // Catch:{ all -> 0x00e9 }
            r7 = 2
            r0.label = r7     // Catch:{ all -> 0x00e9 }
            java.lang.Object r7 = r4.hasNext(r0)     // Catch:{ all -> 0x00e9 }
            if (r7 != r1) goto L_0x00af
            return r1
        L_0x00af:
            r9 = r0
            r0 = r12
            r12 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r9
        L_0x00b9:
            java.lang.Boolean r12 = (java.lang.Boolean) r12     // Catch:{ all -> 0x00e3 }
            boolean r12 = r12.booleanValue()     // Catch:{ all -> 0x00e3 }
            if (r12 == 0) goto L_0x00de
            java.lang.Object r12 = r5.next()     // Catch:{ all -> 0x00e3 }
            int r8 = r7.compare(r3, r12)     // Catch:{ all -> 0x00e3 }
            if (r8 >= 0) goto L_0x00d5
            r3 = r4
            r4 = r2
            r2 = r12
            r12 = r0
            r0 = r1
            r1 = r4
            r4 = r5
            r5 = r6
            r6 = r7
            goto L_0x009d
        L_0x00d5:
            r12 = r0
            r0 = r1
            r1 = r2
            r2 = r3
            r3 = r4
            r4 = r5
            r5 = r6
            r6 = r7
            goto L_0x009d
        L_0x00de:
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r4)
            return r3
        L_0x00e3:
            r10 = move-exception
            r5 = r6
            r3 = r4
            r12 = r0
            r0 = r1
            goto L_0x00f2
        L_0x00e9:
            r10 = move-exception
            goto L_0x00f2
        L_0x00eb:
            r10 = move-exception
            r3 = r2
            goto L_0x00f2
        L_0x00ee:
            r1 = move-exception
            r5 = r10
            r10 = r1
            r3 = r2
        L_0x00f2:
            r1 = r10
            throw r10     // Catch:{ all -> 0x00f5 }
        L_0x00f5:
            r10 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r5, r1)
            throw r10
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.maxWith(kotlinx.coroutines.channels.ReceiveChannel, java.util.Comparator, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Code restructure failed: missing block: B:29:0x0091, code lost:
        if (((java.lang.Boolean) r4).booleanValue() != false) goto L_0x0097;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:30:0x0093, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r5, r2);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:31:0x0096, code lost:
        return null;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:32:0x0097, code lost:
        r3 = r2;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:34:?, code lost:
        r2 = r7.next();
        r4 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:35:0x009d, code lost:
        r0.L$0 = r6;
        r0.L$1 = r5;
        r0.L$2 = r4;
        r0.L$3 = r2;
        r0.label = 2;
        r7 = r4.hasNext(r0);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:36:0x00ac, code lost:
        if (r7 != r1) goto L_0x00af;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:37:0x00ae, code lost:
        return r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:38:0x00af, code lost:
        r9 = r0;
        r0 = r12;
        r12 = r7;
        r7 = r6;
        r6 = r5;
        r5 = r4;
        r4 = r3;
        r3 = r2;
        r2 = r1;
        r1 = r9;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:41:0x00bf, code lost:
        if (((java.lang.Boolean) r12).booleanValue() == false) goto L_0x00de;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:42:0x00c1, code lost:
        r12 = r5.next();
     */
    /* JADX WARNING: Code restructure failed: missing block: B:43:0x00c9, code lost:
        if (r7.compare(r3, r12) <= 0) goto L_0x00d5;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:44:0x00cb, code lost:
        r3 = r4;
        r4 = r2;
        r2 = r12;
        r12 = r0;
        r0 = r1;
        r1 = r4;
        r4 = r5;
        r5 = r6;
        r6 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:45:0x00d5, code lost:
        r12 = r0;
        r0 = r1;
        r1 = r2;
        r2 = r3;
        r3 = r4;
        r4 = r5;
        r5 = r6;
        r6 = r7;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:46:0x00de, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r4);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:47:0x00e2, code lost:
        return r3;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:48:0x00e3, code lost:
        r10 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:49:0x00e4, code lost:
        r5 = r6;
        r3 = r4;
        r12 = r0;
        r0 = r1;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:50:0x00e9, code lost:
        r10 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:51:0x00eb, code lost:
        r10 = th;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:52:0x00ec, code lost:
        r3 = r2;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002d  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x004d  */
    /* JADX WARNING: Removed duplicated region for block: B:21:0x0068  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0025  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object minWith(kotlinx.coroutines.channels.ReceiveChannel r10, java.util.Comparator r11, kotlin.coroutines.Continuation r12) {
        /*
            boolean r0 = r12 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$minWith$1
            if (r0 == 0) goto L_0x0014
            r0 = r12
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$minWith$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$minWith$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r12 = r0.label
            int r12 = r12 - r2
            r0.label = r12
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$minWith$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$minWith$1
            r0.<init>(r12)
        L_0x0019:
            java.lang.Object r12 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            r3 = 0
            switch(r2) {
                case 0: goto L_0x0068;
                case 1: goto L_0x004d;
                case 2: goto L_0x002d;
                default: goto L_0x0025;
            }
        L_0x0025:
            java.lang.IllegalStateException r10 = new java.lang.IllegalStateException
            java.lang.String r11 = "call to 'resume' before 'invoke' with coroutine"
            r10.<init>(r11)
            throw r10
        L_0x002d:
            r10 = 0
            r11 = 0
            java.lang.Object r2 = r0.L$3
            java.lang.Object r4 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r4 = (kotlinx.coroutines.channels.ChannelIterator) r4
            java.lang.Object r5 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r5 = (kotlinx.coroutines.channels.ReceiveChannel) r5
            java.lang.Object r6 = r0.L$0
            java.util.Comparator r6 = (java.util.Comparator) r6
            kotlin.ResultKt.throwOnFailure(r12)     // Catch:{ all -> 0x004a }
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r0
            r0 = r12
            goto L_0x00b9
        L_0x004a:
            r10 = move-exception
            goto L_0x00f2
        L_0x004d:
            r11 = 0
            r10 = 0
            java.lang.Object r2 = r0.L$2
            kotlinx.coroutines.channels.ChannelIterator r2 = (kotlinx.coroutines.channels.ChannelIterator) r2
            java.lang.Object r4 = r0.L$1
            kotlinx.coroutines.channels.ReceiveChannel r4 = (kotlinx.coroutines.channels.ReceiveChannel) r4
            java.lang.Object r5 = r0.L$0
            java.util.Comparator r5 = (java.util.Comparator) r5
            kotlin.ResultKt.throwOnFailure(r12)     // Catch:{ all -> 0x0064 }
            r7 = r2
            r2 = r3
            r6 = r5
            r5 = r4
            r4 = r12
            goto L_0x008b
        L_0x0064:
            r10 = move-exception
            r5 = r4
            goto L_0x00f2
        L_0x0068:
            kotlin.ResultKt.throwOnFailure(r12)
            r5 = r11
            r11 = 0
            r2 = 0
            r4 = r10
            r6 = 0
            kotlinx.coroutines.channels.ChannelIterator r7 = r4.iterator()     // Catch:{ all -> 0x00ee }
            r0.L$0 = r5     // Catch:{ all -> 0x00ee }
            r0.L$1 = r10     // Catch:{ all -> 0x00ee }
            r0.L$2 = r7     // Catch:{ all -> 0x00ee }
            r4 = 1
            r0.label = r4     // Catch:{ all -> 0x00ee }
            java.lang.Object r4 = r7.hasNext(r0)     // Catch:{ all -> 0x00ee }
            if (r4 != r1) goto L_0x0087
            return r1
        L_0x0087:
            r9 = r5
            r5 = r10
            r10 = r6
            r6 = r9
        L_0x008b:
            java.lang.Boolean r4 = (java.lang.Boolean) r4     // Catch:{ all -> 0x00eb }
            boolean r4 = r4.booleanValue()     // Catch:{ all -> 0x00eb }
            if (r4 != 0) goto L_0x0097
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r5, r2)
            return r3
        L_0x0097:
            r3 = r2
            java.lang.Object r2 = r7.next()     // Catch:{ all -> 0x00e9 }
            r4 = r7
        L_0x009d:
            r0.L$0 = r6     // Catch:{ all -> 0x00e9 }
            r0.L$1 = r5     // Catch:{ all -> 0x00e9 }
            r0.L$2 = r4     // Catch:{ all -> 0x00e9 }
            r0.L$3 = r2     // Catch:{ all -> 0x00e9 }
            r7 = 2
            r0.label = r7     // Catch:{ all -> 0x00e9 }
            java.lang.Object r7 = r4.hasNext(r0)     // Catch:{ all -> 0x00e9 }
            if (r7 != r1) goto L_0x00af
            return r1
        L_0x00af:
            r9 = r0
            r0 = r12
            r12 = r7
            r7 = r6
            r6 = r5
            r5 = r4
            r4 = r3
            r3 = r2
            r2 = r1
            r1 = r9
        L_0x00b9:
            java.lang.Boolean r12 = (java.lang.Boolean) r12     // Catch:{ all -> 0x00e3 }
            boolean r12 = r12.booleanValue()     // Catch:{ all -> 0x00e3 }
            if (r12 == 0) goto L_0x00de
            java.lang.Object r12 = r5.next()     // Catch:{ all -> 0x00e3 }
            int r8 = r7.compare(r3, r12)     // Catch:{ all -> 0x00e3 }
            if (r8 <= 0) goto L_0x00d5
            r3 = r4
            r4 = r2
            r2 = r12
            r12 = r0
            r0 = r1
            r1 = r4
            r4 = r5
            r5 = r6
            r6 = r7
            goto L_0x009d
        L_0x00d5:
            r12 = r0
            r0 = r1
            r1 = r2
            r2 = r3
            r3 = r4
            r4 = r5
            r5 = r6
            r6 = r7
            goto L_0x009d
        L_0x00de:
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r6, r4)
            return r3
        L_0x00e3:
            r10 = move-exception
            r5 = r6
            r3 = r4
            r12 = r0
            r0 = r1
            goto L_0x00f2
        L_0x00e9:
            r10 = move-exception
            goto L_0x00f2
        L_0x00eb:
            r10 = move-exception
            r3 = r2
            goto L_0x00f2
        L_0x00ee:
            r1 = move-exception
            r5 = r10
            r10 = r1
            r3 = r2
        L_0x00f2:
            r1 = r10
            throw r10     // Catch:{ all -> 0x00f5 }
        L_0x00f5:
            r10 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r5, r1)
            throw r10
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.minWith(kotlinx.coroutines.channels.ReceiveChannel, java.util.Comparator, kotlin.coroutines.Continuation):java.lang.Object");
    }

    /* JADX WARNING: Can't fix incorrect switch cases order */
    /* JADX WARNING: Code restructure failed: missing block: B:23:0x005b, code lost:
        if (((java.lang.Boolean) r7).booleanValue() != false) goto L_0x005e;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:25:0x005e, code lost:
        r3 = false;
     */
    /* JADX WARNING: Code restructure failed: missing block: B:26:0x005f, code lost:
        r3 = kotlin.coroutines.jvm.internal.Boxing.boxBoolean(r3);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:27:0x0063, code lost:
        kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r2, r4);
     */
    /* JADX WARNING: Code restructure failed: missing block: B:28:0x0066, code lost:
        return r3;
     */
    /* JADX WARNING: Removed duplicated region for block: B:10:0x002d  */
    /* JADX WARNING: Removed duplicated region for block: B:15:0x003b  */
    /* JADX WARNING: Removed duplicated region for block: B:8:0x0025  */
    @kotlin.Deprecated(level = kotlin.DeprecationLevel.HIDDEN, message = "Binary compatibility")
    /* Code decompiled incorrectly, please refer to instructions dump. */
    public static final /* synthetic */ java.lang.Object none(kotlinx.coroutines.channels.ReceiveChannel r8, kotlin.coroutines.Continuation r9) {
        /*
            boolean r0 = r9 instanceof kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$none$1
            if (r0 == 0) goto L_0x0014
            r0 = r9
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$none$1 r0 = (kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$none$1) r0
            int r1 = r0.label
            r2 = -2147483648(0xffffffff80000000, float:-0.0)
            r1 = r1 & r2
            if (r1 == 0) goto L_0x0014
            int r9 = r0.label
            int r9 = r9 - r2
            r0.label = r9
            goto L_0x0019
        L_0x0014:
            kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$none$1 r0 = new kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt$none$1
            r0.<init>(r9)
        L_0x0019:
            java.lang.Object r9 = r0.result
            java.lang.Object r1 = kotlin.coroutines.intrinsics.IntrinsicsKt.getCOROUTINE_SUSPENDED()
            int r2 = r0.label
            r3 = 1
            switch(r2) {
                case 0: goto L_0x003b;
                case 1: goto L_0x002d;
                default: goto L_0x0025;
            }
        L_0x0025:
            java.lang.IllegalStateException r8 = new java.lang.IllegalStateException
            java.lang.String r9 = "call to 'resume' before 'invoke' with coroutine"
            r8.<init>(r9)
            throw r8
        L_0x002d:
            r8 = 0
            r1 = 0
            java.lang.Object r2 = r0.L$0
            kotlinx.coroutines.channels.ReceiveChannel r2 = (kotlinx.coroutines.channels.ReceiveChannel) r2
            r4 = 0
            kotlin.ResultKt.throwOnFailure(r9)     // Catch:{ all -> 0x0039 }
            r7 = r9
            goto L_0x0055
        L_0x0039:
            r1 = move-exception
            goto L_0x0068
        L_0x003b:
            kotlin.ResultKt.throwOnFailure(r9)
            r2 = r8
            r8 = 0
            r4 = 0
            r5 = r2
            r6 = 0
            kotlinx.coroutines.channels.ChannelIterator r7 = r5.iterator()     // Catch:{ all -> 0x0067 }
            r0.L$0 = r2     // Catch:{ all -> 0x0067 }
            r0.label = r3     // Catch:{ all -> 0x0067 }
            java.lang.Object r7 = r7.hasNext(r0)     // Catch:{ all -> 0x0067 }
            if (r7 != r1) goto L_0x0054
            return r1
        L_0x0054:
            r1 = r6
        L_0x0055:
            java.lang.Boolean r7 = (java.lang.Boolean) r7     // Catch:{ all -> 0x0039 }
            boolean r5 = r7.booleanValue()     // Catch:{ all -> 0x0039 }
            if (r5 != 0) goto L_0x005e
            goto L_0x005f
        L_0x005e:
            r3 = 0
        L_0x005f:
            java.lang.Boolean r3 = kotlin.coroutines.jvm.internal.Boxing.boxBoolean(r3)     // Catch:{ all -> 0x0039 }
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r2, r4)
            return r3
        L_0x0067:
            r1 = move-exception
        L_0x0068:
            r3 = r1
            throw r1     // Catch:{ all -> 0x006b }
        L_0x006b:
            r1 = move-exception
            kotlinx.coroutines.channels.ChannelsKt.cancelConsumed(r2, r3)
            throw r1
        */
        throw new UnsupportedOperationException("Method not decompiled: kotlinx.coroutines.channels.ChannelsKt__DeprecatedKt.none(kotlinx.coroutines.channels.ReceiveChannel, kotlin.coroutines.Continuation):java.lang.Object");
    }

    public static /* synthetic */ ReceiveChannel zip$default(ReceiveChannel receiveChannel, ReceiveChannel receiveChannel2, CoroutineContext coroutineContext, Function2 function2, int i, Object obj) {
        if ((i & 2) != 0) {
            coroutineContext = Dispatchers.getUnconfined();
        }
        return ChannelsKt.zip(receiveChannel, receiveChannel2, coroutineContext, function2);
    }

    public static final <E, R, V> ReceiveChannel<V> zip(ReceiveChannel<? extends E> $this$zip, ReceiveChannel<? extends R> other, CoroutineContext context, Function2<? super E, ? super R, ? extends V> transform) {
        return ProduceKt.produce$default(GlobalScope.INSTANCE, context, 0, (CoroutineStart) null, ChannelsKt.consumesAll($this$zip, other), new ChannelsKt__DeprecatedKt$zip$2(other, $this$zip, transform, (Continuation<? super ChannelsKt__DeprecatedKt$zip$2>) null), 6, (Object) null);
    }

    public static final Function1<Throwable, Unit> consumes(ReceiveChannel<?> $this$consumes) {
        return new ChannelsKt__DeprecatedKt$consumes$1($this$consumes);
    }
}
