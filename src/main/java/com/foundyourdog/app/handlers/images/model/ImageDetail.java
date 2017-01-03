package com.foundyourdog.app.handlers.images.model;

import com.foundyourdog.app.handlers.Validatable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class ImageDetail extends ImageDetailResponse implements Validatable {
	public ImageDetail() {
	}
	
	@Override
	public boolean isValid() {
		// TODO Auto-generated method stub
		return true;
	}
}
