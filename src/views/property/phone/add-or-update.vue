<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" style="width: 500px">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<!-- <el-form-item>
				<el-select v-model="dataForm.type" placeholder="电话类型">
					<el-option label="物业电话" value="0"></el-option>
					<el-option label="快递电话" value="1"></el-option>
				</el-select>
			</el-form-item> -->

			<el-form-item label="电话类型" prop="type">
				<el-select v-model="dataForm.type" placeholder="请选择">
					<el-option label="物业电话" value="0"></el-option>
					<el-option label="快递电话" value="1"></el-option>
				</el-select>
			</el-form-item>

			<!-- <el-form-item label="电话类型(0:物业电话，1：快递电话)" prop="type">
				<el-input v-model="dataForm.type" placeholder="电话类型(0:物业电话，1：快递电话)"></el-input>
			</el-form-item> -->
			<el-form-item label="名字" prop="name">
				<el-input v-model="dataForm.name" placeholder="名字"></el-input>
			</el-form-item>
			<el-form-item label="电话" prop="phone">
				<el-input v-model="dataForm.phone" placeholder="电话"></el-input>
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
import { usePhoneApi, usePhoneSubmitApi } from '@/api/property/phone'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	type: '0',
	name: '',
	phone: ''
})

const init = async (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getPhone(id)
	}
}

const getPhone = (id: number) => {
	usePhoneApi(id).then(res => {
		Object.assign(dataForm, res.data)
		dataForm.type = '' + dataForm.type
		console.log(dataForm)
	})
}

const dataRules = ref({
	type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	phone: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		usePhoneSubmitApi(dataForm).then(() => {
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
</script>
