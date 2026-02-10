package androidx.webkit;

public class PrefetchNetworkException extends PrefetchException {
    public static final int NO_HTTP_RESPONSE_STATUS_CODE = 0;
    public final int httpResponseStatusCode;

    public PrefetchNetworkException(String error) {
        this(error, 0);
    }

    public PrefetchNetworkException(String error, int httpResponseStatusCode2) {
        super(error);
        this.httpResponseStatusCode = httpResponseStatusCode2;
    }

    public PrefetchNetworkException(int httpResponseStatusCode2) {
        this.httpResponseStatusCode = httpResponseStatusCode2;
    }

    public PrefetchNetworkException() {
        this(0);
    }
}
