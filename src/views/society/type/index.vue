﻿<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.TypeName" placeholder="活动类型名称" clearable></el-input>
			</el-form-item>

			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<!-- <el-form-item>
				<el-button v-auth="'sys:user:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item> -->
			<el-form-item>
				<el-button v-auth="'sys:user:delete'" type="success" @click="getAllType()">查询所有</el-button>
			</el-form-item>
			<!-- <el-form-item v-auth="'sys:user:import'">
				<el-upload :action="uploadUserExcelUrl" :before-upload="beforeUpload" :on-success="handleSuccess" :show-file-list="false">
					<el-button type="info">导入</el-button>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:user:export'" type="success" @click="downloadExcel()">导出</el-button>
			</el-form-item> -->
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="序号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="name" label="分类名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="communityName" label="所属社区" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="status" label="状态" dict-type="schedule_status"></fast-table-column>
			<fast-table-column prop="deleted" label="删除状态" dict-type="activity_delete"></fast-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="250">
				<template #default="scope">
					<el-button type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'sys:user:delete'" type="primary" link @click="deleteActivity(scope.row.id)">删除</el-button>
					<el-button v-auth="'sys:user:delete'" type="primary" link @click="changeStatus(scope.row.id)">禁用/启用</el-button>
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
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="SysUserIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-updates.vue'
import { IHooksOptions } from '@/hooks/interface'
// import constant from '@/utils/constant'
import { useDeleteApi, useStatusApi } from '@/api/society/activity'
import { ElMessage, UploadProps } from 'element-plus'
import cache from '@/utils/cache'

const getOption = reactive({ urls: '/soft2242/activity/type/page' })
const state: IHooksOptions = reactive({
	// dataListUrl: '/soft2242/activity/type/page',
	dataListUrl: getOption.urls,
	deleteUrl: '/soft2242/activity/type/delete',
	queryForm: {
		TypeName: ''
	}
})

const uploadUserExcelUrl = import.meta.env.VITE_API_URL + '/soft2242/order/import?accessToken=' + cache.getToken()

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}
const getAllType = () => {
	getOption.urls = '/soft2242/activity/type/page2'
	getDataList()
}

// const downloadExcel = () => {
// 	useOrderExportApi()
// 	return
// }
const deleteActivity = (id: number) => {
	useDeleteApi(id)
	getDataList()
	return
}
const changeStatus = (id: number) => {
	useStatusApi(id)
	getDataList()
	return
}
const handleSuccess: UploadProps['onSuccess'] = (res, file) => {
	if (res.code !== 0) {
		ElMessage.error('上传失败：' + res.msg)
		return false
	}

	ElMessage.success({
		message: '上传成功',
		duration: 500,
		onClose: () => {
			getDataList()
		}
	})
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
	if (file.size / 1024 / 1024 / 1024 / 1024 > 1) {
		ElMessage.error('文件大小不能超过100M')
		return false
	}
	return true
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
