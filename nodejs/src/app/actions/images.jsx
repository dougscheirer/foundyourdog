import { auth_fetch, auth_post, auth_put } from './login'
import cloudinary from 'cloudinary-core'

export const uploadReportImage = (image_info) => {
	return {
		type: 'upload_image',
		image_info : image_info
	}
}

export const getUnassignedImages = () => {
	return auth_fetch(
			'/api/auth/reports/images/unassigned?host=' + window.location.host,
			(res) => {
				const image_block = (res.uuid !== undefined) ? res : undefined;
				return {
					type: 'FOUND_UNASSIGNED_IMAGE',
					image: image_block
				}
			})
}

// upload is a little complex:
// 0) ask the server for some auth stuff
// 1) upload to cloudindary or us (dev mode) (and get URL info back)
// 2) send our server the URL info for the upload
export const uploadImage = (imageForm, file) => {
	return dispatch => {
		dispatch(auth_post('/api/auth/report/images/new', imageForm, (res) => {
			const imageObj = res;
			let form = new FormData();
			form.append('file', file);
			form.append('signature', imageObj.uploadSignature);
			form.append('api_key', imageObj.apiKey)
			form.append('timestamp', imageObj.upload_date)

			return dispatch =>
				fetch(imageObj.uploadUrl,
					{ method: "POST",
						body: form // ,
						// credentials: 'include'
					})
				.then((res) => {
					if (res.ok)	return res.json()
				})
				.then((res) => {
					if (!!res)
						dispatch(auth_put('/api/auth/report/images/' + imageObj.uuid,
							JSON.stringify({ ...imageObj, upload_location_response: res.secure_url }), (res) => {
								return getUnassignedImages()
					}))
				})
		}))
	}
}
