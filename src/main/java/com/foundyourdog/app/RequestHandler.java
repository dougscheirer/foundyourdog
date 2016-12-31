package com.foundyourdog.app;

import java.util.Map;

import spark.Request;

public interface RequestHandler<V extends Validatable> {

    Answer process(V value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request);

}
