<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="设备" prop="deviceId">
				<el-select v-model="dataForm.deviceId" placeholder="请选择">
					<el-option v-for="item in deviceList" :key="item.id" :label="item.deviceName" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="门禁名称" prop="doorName">
				<el-input v-model="dataForm.doorName" placeholder="门禁名称"></el-input>
			</el-form-item>
			<el-form-item label="所属小区" prop="communityId">
				<el-select v-model="dataForm.communityId" placeholder="请选择">
					<el-option v-for="item in communityList" :key="item.id" :label="item.communityName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="门禁图片">
				<el-upload
					v-loading.fullscreen.lock="fullscreenLoading"
					:action="upurl"
					:show-file-list="false"
					:on-success="handleCoverSuccess"
					:on-error="handleError"
					:before-upload="beforeCoverUpload"
				>
					<el-image :src="dataForm.doorImg" style="width: 80px; height: 60px" />
				</el-upload>
			</el-form-item>
			<el-form-item label="配置码" prop="sysCode">
				<el-input v-model="dataForm.sysCode" placeholder="配置码"></el-input>
			</el-form-item>
			<el-form-item label="在线状态" prop="onlineStatus">
				<el-radio-group v-model="dataForm.onlineStatus">
					<el-radio :label="0">在线</el-radio>
					<el-radio :label="1">离线</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useDoorApi, useDoorSubmitApi } from '@/api/smart'
import { getDeviceList } from '@/api/smart'
import { getCommunityList } from '@/api/community/community'
import cache from '@/utils/cache'
import type { UploadProps } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	deviceId: '',
	doorImg: 'https://flobby529.oss-cn-nanjing.aliyuncs.com/image/door.png',
	doorName: '',
	communityId: '',
	sysCode: '',
	onlineStatus: 0
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getDoor(id)
	}
}

const getDoor = (id: number) => {
	useDoorApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	deviceId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	doorName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	communityId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	sysCode: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useDoorSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})

// 获取设备列表
const deviceList = ref<any[]>([])

const getDevice = () => {
	getDeviceList().then((res: any) => {
		deviceList.value = res.data
	})
}

//获取所有小区列表
const communityList = ref<any[]>([])
const getCommunityLists = () => {
	getCommunityList().then(res => {
		communityList.value = res.data
	})
}

// 图片上传
const upurl = import.meta.env.VITE_API_URL + '/smart/door/upload?accessToken=' + cache.getToken()
const fullscreenLoading = ref(false)

const handleCoverSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
	fullscreenLoading.value = false
	if (response.code === 500) {
		ElMessage.error('图片上传失败!')
		return
	}
	dataForm.doorImg = response.data.url
}

const handleError: UploadProps['onError'] = (file, uploadFiles) => {
	ElMessage.error('图片上传失败!')
	fullscreenLoading.value = false
}

//图片上传前
const beforeCoverUpload: UploadProps['beforeUpload'] = rawFile => {
	fullscreenLoading.value = true
	if (rawFile.type !== 'image/jpeg') {
		ElMessage.error('请选择图片格式!')
		return false
	} else if (rawFile.size / 1024 / 1024 > 10) {
		ElMessage.error('图片大小不能超过 2MB!')
		return false
	}
	return true
}

onMounted(() => {
	getDevice()
	getCommunityLists()
})
</script>
