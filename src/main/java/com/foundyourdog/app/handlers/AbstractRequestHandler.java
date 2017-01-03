package com.foundyourdog.app.handlers;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Map;

import spark.Request;
import spark.Response;
import spark.Route;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.foundyourdog.app.model.Model;

public abstract class AbstractRequestHandler<V extends Validatable> implements RequestHandler<V>, Route {

	private Class<V> valueClass;
	protected Model model;

	private static final int HTTP_BAD_REQUEST = 400;

	public AbstractRequestHandler(Class<V> valueClass, Model model) {
		this.valueClass = valueClass;
		this.model = model;
	}

	private static boolean shouldReturnHtml(Request request) {
		String accept = request.headers("Accept");
		return accept != null && accept.contains("text/html");
	}

	public static String dataToJson(Object data) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			mapper.enable(SerializationFeature.INDENT_OUTPUT);
			return mapper.writeValueAsString(data);
		} catch (IOException e) {
			throw new RuntimeException("IOException from a StringWriter?");
		}
	}

	public final Answer process(V value, Map<String, String> urlParams, boolean shouldReturnHtml, Request request) {
		if (value != null && !value.isValid()) {
			return new Answer(HTTP_BAD_REQUEST);
		} else {
			return processImpl(value, urlParams, shouldReturnHtml, request);
		}
	}

	protected abstract Answer processImpl(V value, Map<String, String> urlParams, boolean shouldReturnHtml,
			Request request);

	@Override
	public Object handle(Request request, Response response) throws Exception {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			// set the date format for our app
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			objectMapper.setDateFormat(df);
					
			V value = null;
			if (valueClass != EmptyPayload.class) {
				value = objectMapper.readValue(request.body(), valueClass);
			}
			Map<String, String> urlParams = request.params();
			Answer answer = process(value, urlParams, shouldReturnHtml(request), request);
			response.status(answer.getCode());
			if (shouldReturnHtml(request)) {
				response.type("text/html");
			} else {
				response.type("application/json");
			}
			response.body(answer.getBody());
			return answer.getBody();
		} catch (JsonMappingException e) {
			response.status(400);
			response.body(e.getMessage());
			return e.getMessage();
		}
	}

}
