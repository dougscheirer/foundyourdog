package com.foundyourdog.app.handlers;

/**
 * Created by federico on 24/07/15.
 */
public class EmptyPayload implements Validatable {
    @Override
    public boolean isValid() {
        return true;
    }
}
