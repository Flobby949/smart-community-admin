<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="communityId" label="所属小区">
				<el-select v-model="dataForm.communityId" class="m-2" placeholder="所属小区">
					<el-option v-for="item in communityList" :key="item.id" :label="item.communityName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item prop="buildingName" label="楼宇名称">
				<el-input v-model="dataForm.buildingName" placeholder="楼宇名称"></el-input>
			</el-form-item>
			<el-form-item prop="units" label="层数">
				<el-input v-model="dataForm.units" placeholder="所在单元"></el-input>
			</el-form-item>
			<el-form-item prop="usedArea" label="占地面积">
				<el-input v-model="dataForm.usedArea" placeholder="占地面积"></el-input>
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
import { useBuildingApi, useBuildingSubmitApi } from '@/api/building/building'
import { getCommunityList } from '@/api/community/community'
// import type { UploadProps } from 'element-plus'
// import cache from '@/utils/cache'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const communityList = ref<any[]>([])
const postList = ref<any[]>([])
const roleList = ref<any[]>([])
const orgList = ref([])
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	communityId: [] as any[],
	buildingName: '',
	units: '',
	usedArea: '',
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
		getBuilding(id)
	}
	getCommunityLists()
}

// 获取信息
const getBuilding = (id: number) => {
	useBuildingApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}
//获取所有小区列表
const getCommunityLists = () => {
	getCommunityList().then(res => {
		communityList.value = res.data
	})
}

const dataRules = ref({
	username: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	realName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	mobile: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	orgId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useBuildingSubmitApi(dataForm).then(() => {
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
// const upurl = import.meta.env.VITE_API_URL + '/safe/inspectionitem/upload?accessToken=' + cache.getToken()

// //图片上传
// const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
// 	console.log(response)
// 	dataForm.photo = response.data.url
// 	console.log(dataForm)
// }

// //图片上传前
// const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
// 	if (rawFile.type !== 'image/jpeg') {
// 		ElMessage.error('Avatar picture must be JPG format!')
// 		return false
// 	} else if (rawFile.size / 1024 / 1024 > 10) {
// 		ElMessage.error('Avatar picture size can not exceed 2MB!')
// 		return false
// 	}
// 	return true
// }

defineExpose({
	init
})
</script>
