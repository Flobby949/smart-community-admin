<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-select v-model="state.queryForm.type" placeholder="电话类型">
					<el-option label="物业电话" value="0"></el-option>
					<el-option label="快递电话" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.name" placeholder="名字"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.phone" placeholder="电话"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'property:phone:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'property:phone:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column type="index" align="center" width="90" label="编号"> </el-table-column>
			<!-- <el-table-column prop="communityId" label="社区id" header-align="center" align="center"></el-table-column> -->
			<!-- <el-table-column prop="type" label="电话类型(0:物业电话，1：快递电话)" header-align="center" align="center"></el-table-column> -->
			<fast-table-column prop="type" label="电话类型" dict-type="phone_type"></fast-table-column>
			<el-table-column prop="name" label="名字" header-align="center" align="center"></el-table-column>
			<el-table-column prop="phone" label="电话" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'property:phone:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'property:phone:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="OnePhoneIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/property/phone/page',
	deleteUrl: '/property/phone',
	queryForm: {
		communityId: '',
		type: '',
		name: '',
		phone: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
