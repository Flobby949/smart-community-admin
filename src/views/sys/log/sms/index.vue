<template>
	<el-card>
		<el-table :data="dataList" border style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="id" header-align="center" align="center" width="100"></el-table-column>
			<fast-table-column prop="platform" label="平台类型" dict-type="sms_platform"></fast-table-column>
			<el-table-column prop="ip" label="ip地址" header-align="center" align="center"></el-table-column>
			<el-table-column prop="template" label="短信模板" header-align="center" align="center"></el-table-column>
			<el-table-column prop="address" label="地址" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="status" label="状态" dict-type="enable_disable"></fast-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center">
				<template #default="{ row }">
					{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="page"
			:page-sizes="pageSizes"
			:page-size="limit"
			:total="total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>
	</el-card>
</template>

<script setup lang="ts">
import { dayjs } from 'element-plus'
import { ref } from 'vue'
import { onMounted } from 'vue'
import service from '@/utils/request'
function getData(page = 1, limit = 10) {
	service({
		url: '/sms/platform/list',
		method: 'get',
		params: {
			page,
			limit
		}
	}).then(res => {
		console.log(res.data)

		dataList.value = res.data.items
		total.value = res.data.total
	})
}

const dataList = ref<any[]>([])

const page = ref(1)
const limit = ref(5)
const total = ref(0)
const pageSizes = ref([5, 8, 10, 20, 25])

const sizeChangeHandle = (val: number) => {
	limit.value = val
	getData(page.value, limit.value)
}

const currentChangeHandle = (val: number) => {
	page.value = val
	getData(page.value, limit.value)
}

onMounted(() => {
	getData()
})
</script>
