<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="设备名称" prop="deviceName">
				<el-input v-model="dataForm.deviceName" placeholder="设备名称"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="dataForm.status">
					<el-radio :label="0">正常</el-radio>
					<el-radio :label="1">故障</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="设备类别" prop="deviceType">
				<el-select v-model="dataForm.deviceType" placeholder="请选择">
					<el-option v-for="item in deviceTypeList" :key="item.id" :label="item.type" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="设备序列号" prop="deviceSerial">
				<el-input v-model="dataForm.deviceSerial" placeholder="设备序列号"></el-input>
			</el-form-item>
			<el-form-item label="设备二维码" prop="qrCode">
				<div style="display: flex; flex-direction: column; justify-content: center; align-items: start">
					<el-button type="primary" style="width: 100px" @click="createQrCode()">生成二维码</el-button>
					<img v-if="showQrCode" :src="qrcode" />
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { Ref, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useDeviceApi, useDeviceSubmitApi } from '@/api/smart'
import { deviceTypeEntity } from '../entity'
import { useQRCode } from '@vueuse/integrations/useQRCode'

defineProps<{
	deviceTypeList: deviceTypeEntity[]
}>()

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const showQrCode = ref(false)
const dataForm = reactive({
	id: '',
	deviceName: '',
	status: '',
	deviceType: '',
	deviceSerial: '',
	qrCode: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''
	showQrCode.value = false
	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getDevice(id)
	}
}

const getDevice = (id: number) => {
	useDeviceApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	deviceName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	deviceType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	deviceSerial: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useDeviceSubmitApi(dataForm).then(() => {
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

let qrcode: Ref<string> = ref('')

const createQrCode = async () => {
	if (dataForm.deviceSerial == '') {
		ElMessage.error('请输入序列号')
		return
	}
	showQrCode.value = true
	// eslint-disable-next-line vue/no-ref-as-operand
	qrcode = await useQRCode(
		JSON.stringify({
			deviceName: dataForm.deviceName,
			deviceSerial: dataForm.deviceSerial
		})
	)
	dataForm.qrCode = qrcode.value
}
</script>
