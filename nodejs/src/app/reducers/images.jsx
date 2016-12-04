const initialState = {
};

export const images = (state = initialState, action) => {
	switch (action.type) {
		case 'UPLOAD_IMAGE':
			return { ...state,
				image_info: action.image_info }
		case 'FOUND_UNASSIGNED_IMAGE':
			return { ...state,
				unassigned_image: action.image
			}
		default:
			return state
	}
}