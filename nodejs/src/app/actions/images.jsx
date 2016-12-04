import { auth_fetch, auth_post } from './login'

export const uploadReportImage = (image_info) => {
	return {
		type: 'upload_image',
		image_info : image_info
	}
}

export const getUnassignedImages = () => {
	return auth_fetch(
			'/api/auth/reports/images/unassigned',
			(res) => {
				const image_block = (res.uuid !== undefined) ? res : undefined;
				return {
					type: 'FOUND_UNASSIGNED_IMAGE',
					image: image_block
				}
			})
}


export const uploadImage = (imageForm) => {
	return auth_post('/api/auth/report/images/new', imageForm, (res) => {
		return getUnassignedImages()
	})
}
