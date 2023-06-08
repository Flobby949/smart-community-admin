<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.communityName" placeholder="请输入社区名"></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.state" class="m-2" placeholder="Select" size="large">
					<el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.key" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'owner:index:page'" type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'owner:index:page'" @click="resetData()"><svg-icon icon="icon-reload"></svg-icon>重置</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column type="index" label="序号" header-align="center" align="center" width="60"></el-table-column>
			<el-table-column label="昵称" header-align="center" align="center">
				<template #default="scope">
					<div v-if="scope.row.username" class="test1">
						<el-avatar :size="40" :src="scope.row.avatar" />
						<span class="nicheng">{{ scope.row.username }}</span>
					</div>
					<div v-else class="test1">
						<span class="nicheng">/</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="houseName" label="房产名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="realName" label="姓名" header-align="center" width="70%" align="center"></el-table-column>
			<el-table-column prop="phone" label="手机号" header-align="center" width="120%" align="center"></el-table-column>
			<el-table-column label="身份证" header-align="center" align="center">
				<template #default="scope">
					<span v-if="scope.row.identityCard">{{ scope.row.identityCard }}</span>
					<span v-else>/</span>
				</template>
			</el-table-column>
			<fast-table-column prop="identity" label="类型" dict-type="owner_identity" width="100%"></fast-table-column>
			<el-table-column prop="updateTime" label="绑定日期" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="state" label="状态" width="100%" dict-type="owner_state"></fast-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button v-if="scope.row.identity === 0" v-auth="'owner:index:info'" type="primary" link @click="toInfo(scope.row.id)">查看</el-button>
					<el-button v-else v-auth="'owner:index:info'" type="primary" link @click="LookInfo(scope.row)">查看</el-button>
					<el-popconfirm title="您确定要删除这条信息吗?" @confirm="deleteFamilyHandle(scope.row.id)" @cancel="cancelDelete()">
						<template #reference>
							<el-button v-if="scope.row.identity != 0" v-auth="'owner:info:delete'" type="danger" link>删除</el-button>
						</template>
					</el-popconfirm>
					<el-button
						v-if="scope.row.state === 0 && scope.row.identity === 0"
						v-auth="'owner:index:apApply'"
						type="success"
						link
						@click="approvedApply(scope.row.id)"
						>通过</el-button
					>
					<el-button
						v-if="scope.row.state === 0 && scope.row.identity === 0"
						v-auth="'owner:index:reApply'"
						type="warning"
						link
						@click="refuseApply(scope.row.id)"
						>驳回</el-button
					>
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
		<el-dialog v-model="familyInfoDG" width="30%">
			<el-descriptions :column="1" border>
				<el-descriptions-item label="用户名：" label-align="center" align="left">{{ familyInfo.username }}</el-descriptions-item>
				<el-descriptions-item label="小区住址：" label-align="center" align="left">{{ familyInfo.houseName }}</el-descriptions-item>
				<el-descriptions-item label="姓名：" label-align="center" align="left">{{ familyInfo.realName }}</el-descriptions-item>
				<el-descriptions-item label="性别：" label-align="center" align="left">
					<span v-if="familyInfo.gender == 0">保密</span><span v-if="familyInfo.gender == 1">男</span
					><span v-if="familyInfo.gender == 2">女</span></el-descriptions-item
				>
				<el-descriptions-item label="类型：：" label-align="center" align="left">{{
					familyInfo.identity == 1 ? '家属' : '租客'
				}}</el-descriptions-item>
				<el-descriptions-item label="身份证号：" label-align="center" align="left">{{ familyInfo.identityCard }}</el-descriptions-item>
				<el-descriptions-item label="绑定日期：" label-align="center" align="left">{{ familyInfo.createTime }}</el-descriptions-item>
			</el-descriptions>
		</el-dialog>
	</el-card>
</template>

<script setup lang="ts" name="OneOwnerIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { IHooksOptions } from '@/hooks/interface'
import { apApply, reApply, fInfo, deFamily } from '@/api/owner/owner'
import { router } from '@/router'
const familyInfoDG = ref(false)
const familyInfo = reactive({
	username: '',
	realName: '',
	houseName: '',
	identity: -1,
	gender: -1,
	phone: '',
	identityCard: '',
	createTime: ''
})
const options = [
	{
		label: '全部',
		key: null
	},
	{
		label: '未审核',
		key: 0
	},
	{
		label: '已通过',
		key: 1
	},
	{
		label: '未通过',
		key: 2
	}
]
const state: IHooksOptions = reactive({
	dataListUrl: '/one/owner/page',
	queryForm: {
		communityName: '',
		state: null
	}
})
const approvedApply = (id: number) => {
	apApply(id).then((res: any) => {
		if (res.code == 0) {
			ElMessage.success('审批成功')
			getDataList()
		} else {
			ElMessage.error('审批失败')
		}
	})
}
const cancelDelete = () => {
	ElMessage.info('已取消删除')
}
const refuseApply = (id: number) => {
	reApply(id).then((res: any) => {
		if (res.code == 0) {
			ElMessage.success('审批成功')
			getDataList()
		} else {
			ElMessage.error('审批失败')
		}
	})
}
const resetData = () => {
	state.queryForm.communityName = ''
	state.queryForm.state = null
	getDataList()
}
const LookInfo = (row: any) => {
	familyInfoDG.value = true
	familyInfo.houseName = row.houseName
	if (row.username) {
		familyInfo.username = row.username
	} else {
		familyInfo.username = '/'
	}
	fInfo(row.id).then((res: any) => {
		familyInfo.realName = res.data.realName
		familyInfo.gender = res.data.gender
		familyInfo.phone = res.data.phone
		if (res.data.identityCard) {
			familyInfo.identityCard = res.data.identityCard
		} else {
			familyInfo.identityCard = '/'
		}
		familyInfo.identity = res.data.identity
		familyInfo.createTime = res.data.createTime
	})
}
const deleteFamilyHandle = (id: number) => {
	deFamily(id).then((res: any) => {
		ElMessage.success('删除成功')
		getDataList()
	})
}
const toInfo = (id: any) => {
	localStorage.setItem('ownerId', id)
	router.push('info')
}
const { getDataList, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
<style scoped>
.nicheng {
	margin-left: 8px;
}
.test1 {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
>
