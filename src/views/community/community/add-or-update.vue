<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="communityName" label="社区名称">
				<!-- <el-select v-model="dataForm.communityId" placeholder="社区名称"></el-select> -->
				<el-input v-model="dataForm.communityName" placeholder="社区名称"></el-input>
			</el-form-item>
			<el-form-item prop="address" label="社区地址">
				<el-input v-model="dataForm.address" placeholder="社区地址"></el-input>
			</el-form-item>
			<el-form-item prop="units" label="占地面积">
				<el-input v-model="dataForm.coverArea" placeholder="占地面积"></el-input>
			</el-form-item>
			<el-form-item label="项目图片">
				<el-upload
					class="avatar-uploader"
					:action="upurl"
					:show-file-list="false"
					:on-success="handleAvatarSuccess"
					:before-upload="beforeAvatarUpload"
				>
					<el-image v-if="dataForm.communityImgs" :src="dataForm.communityImgs" style="width: 80px; height: 60px" />
					<el-icon v-else class="avatar-uploader-icon" style="width: 80px; height: 60px">上传</el-icon>
				</el-upload>
			</el-form-item>
			<el-form-item prop="content" label="备注">
				<el-input v-model="dataForm.content" placeholder="备注"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useCommunityApi, useCommunitySubmitApi } from '@/api/community/community'
import type { UploadProps } from 'element-plus'
import cache from '@/utils/cache'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef: any = ref()

const dataForm = reactive({
	photo: '',
	id: '',
	communityName: '',
	address: '',
	communityImgs: '',
	coverArea: '',
	content: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
		for (const key in dataForm) {
			dataForm[key] = ''
		}
	}

	//id 存在则为修改
	if (id) {
		getCommunity(id)
	}
}

// 获取信息
const getCommunity = (id: number) => {
	useCommunityApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	communityName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	address: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useCommunitySubmitApi(dataForm).then(() => {
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
const upurl = import.meta.env.VITE_API_URL + '/sys/community/upload?accessToken=' + cache.getToken()

//图片上传
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
	console.log(response)
	dataForm.communityImgs = response.data.url
	console.log(dataForm)
}

//图片上传前
const validTypes: [string, string] = ['image/jpeg', 'image/png']
const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
	if (!validTypes.includes(rawFile.type)) {
		ElMessage.error('请选择 JPEG 或 PNG 文件！')
		return false
	} else if (rawFile.size / 1024 / 1024 > 10) {
		ElMessage.error('图片大小不能超过10M!')
		return false
	}
	return true
}

defineExpose({
	init
})
</script>
