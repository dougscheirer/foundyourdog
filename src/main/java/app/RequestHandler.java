package app;

import java.util.Map;

public interface RequestHandler<V extends Validatable> {

    Answer process(V value, Map<String, String> urlParams, boolean shouldReturnHtml);

}
