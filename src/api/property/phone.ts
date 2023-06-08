import service from '@/utils/request'

export const usePhoneApi = (id: number) => {
	return service.get('/property/phone/' + id)
}

export const usePhoneSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/property/phone', dataForm)
	} else {
		return service.post('/property/phone', dataForm)
	}
}