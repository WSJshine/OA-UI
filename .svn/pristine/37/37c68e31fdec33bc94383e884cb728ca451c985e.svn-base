<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <!--<el-form-item label="企业名称" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择公企业名称" clearable size="small">
          <el-option label="请选择企业名称" value=""/>
        </el-select>
      </el-form-item>-->
      <el-form-item label="企业名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入企业名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="企业性质" prop="enterpriseNature">
        <el-select v-model="queryParams.enterpriseNature" placeholder="请选择企业性质" clearable size="small" style="width: 100%">
          <el-option label="占地企业" value="占地企业"/>
          <el-option label="承租企业" value="承租企业"/>
        </el-select>
      </el-form-item>
      <el-form-item label="土地性质" prop="landNature">
        <el-select v-model="queryParams.landNature" placeholder="请选择土地性质" clearable size="small" style="width: 100%">
          <el-option label="租用" value="租用"/>
          <el-option label="征用" value="征用"/>
        </el-select>
      </el-form-item>
     <!-- <el-form-item label="所属地块" prop="area">
        <el-input
          v-model="queryParams.area"
          placeholder="请输入所属地块"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属网格" prop="grid">
        <el-input
          v-model="queryParams.grid"
          placeholder="请输入所属网格"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--<el-row :gutter="10" class="mb8" v-if="path=='advice'">-->
    <el-row :gutter="10" class="mb8" >
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['enterprise:basic:add']"
        >新增
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['enterprise:basic:import']">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          @click="downloadTable"
          v-hasPermi="['enterprise:basic:export']"
        >下载
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
<el-row :span="24">

  <el-col :span="24">
    <el-table
      :data="useLandTable"
      border stripe :header-cell-style="{background:'#336699',color:'#eef1f6'}">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table v-loading="loading" :data="props.row.children"
                    border stripe
                    >
            <el-table-column
              prop="name"
              align="center"
              label="企业名称">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="detail(scope.row)">{{scope.row.name}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="土地面积" align="center" prop="landArea"/>
            <el-table-column label="建筑物面积" align="center" prop="buildingArea"/>
            <el-table-column label="入园时间" align="center" prop="admissionTime"/>
            <el-table-column label="企业负责人姓名及联系方式" align="center" prop="financePerson"/>
            <el-table-column label="土地性质" align="center" prop="landNature"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <div>
                 <!-- <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-view"
                    @click="detail(scope.row)"
                    v-hasPermi="['enterprise:basic:query']"
                  >详情
                  </el-button>-->
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['enterprise:basic:modify']"
                  >修改
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['enterprise:basic:delete']"
                  >删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        align="center"
        label="企业名称">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detail(scope.row)">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="areaCovered"
        label="占地面积（亩)"
        width="180">
      </el-table-column>
      <el-table-column
        prop="employees"
        label="承租企业数量">
      </el-table-column>
      <el-table-column
        prop="landArea"
        label="总租赁土地面积">
      </el-table-column>
      <el-table-column
        prop="buildingArea"
        label="总租赁建筑物面积">
      </el-table-column>
      <el-table-column
        prop="financePerson"
        label="负责人及联系方式">
      </el-table-column>
      <el-table-column
        prop="subcontract"
        label="分包人员">
      </el-table-column>
      <el-table-column
        prop="landNature"
        label="土地性质">
      </el-table-column>
      <el-table-column
        prop="area"
        label="所属地块">
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div>
           <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="detail(scope.row)"
              v-hasPermi="['enterprise:basic:query']"
            >详情
            </el-button>-->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['enterprise:basic:modify']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['enterprise:basic:delete']"
            >删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-col>
</el-row>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!--上传-->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <!--<el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据-->
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改请假流程对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
      <!--<el-form ref="form" :model="enterForm" :rules="addRules" :inline="true" class="demo-form-inline"  label-width="200px" >-->
      <el-form ref="form" :model="enterForm" :rules="addRules"   label-width="160px" >
        <el-row :span="24">
          <el-col :span="8" >
            <el-form-item label="企业名称" prop="name" >
              <el-input v-model="enterForm.name" placeholder="请输入企业名称" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="分包人员" prop="subcontract" >
              <el-input v-if="isSubcontract" v-model="enterForm.subcontract" placeholder="请填写分包人员" :disabled="true" style="width: 100%"></el-input>
              <el-input v-else-if="readonly" v-model="enterForm.subcontract" placeholder="请填写分包人员" :disabled="true" style="width: 100%"></el-input>
              <el-cascader :options="deptUserList"  v-else  :show-all-levels="false"
                           :props="{ checkStrictly: true,value:'name',label:'type' }"
                           v-model="enterForm.account"
                           clearable  @change="subcontractChange" ref="myCascader">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="占地面积(亩)" prop="areaCovered" >
              <el-input v-model="enterForm.areaCovered" placeholder="请填写占地面积" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :span="24">
          <el-col :span="8" >
            <el-form-item label="企业性质" prop="enterpriseNature" >
              <!--<el-input v-model="enterForm.enterpriseNature" placeholder="请填写企业性质" :disabled=readonly style="width: 100%"></el-input>-->
              <el-select v-model="enterForm.enterpriseNature" :disabled=readonly  placeholder="请选择企业性质" clearable size="small" style="width: 100%" @change="enterpriseChange">
                <el-option label="占地企业" value="占地企业"/>
                <el-option label="承租企业" value="承租企业"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="土地性质" prop="landNature" >
              <!--<el-input v-model="enterForm.landNature" placeholder="请填写土地性质" :disabled=readonly style="width: 100%"></el-input>-->
              <el-select v-model="enterForm.landNature" :disabled=readonly  placeholder="请选择土地性质" clearable size="small" style="width: 100%">
                <el-option label="租用" value="租用"/>
                <el-option label="征用" value="征用"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="8" >
            <el-form-item label="所属地块" prop="area" >
              <el-input v-model="enterForm.area" placeholder="请填写所属地块" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="企业负责人及联系方式" prop="financePerson" >
              <el-input v-model="enterForm.financePerson" placeholder="请填写企业负责人及联系方式" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="停产企业" prop="isStopProduction">
              <!--<el-input v-model="enterForm.isStopProduction" placeholder="请填写占地面积" :disabled=readonly style="width: 100%"></el-input>-->
              <el-radio v-model="enterForm.isStopProduction" label="是" >是</el-radio>
              <el-radio v-model="enterForm.isStopProduction" label="否">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">承租企业信息</el-divider>
        <el-row :span="24" v-if="isUseLand" ><!--占地企业-->
          <el-col :span="8" >
            <el-form-item label="承租企业数量" prop="employees">
              <el-input v-model="enterForm.employees" placeholder="请填写承租企业数量" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="总租赁土地面积" prop="landArea">
              <el-input v-model="enterForm.landArea" placeholder="请填写总租赁土地面积" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="总租赁建筑物面积" prop="buildingArea">
              <el-input v-model="enterForm.buildingArea" placeholder="请填写总租赁建筑物面积" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :span="24" v-if="isUseLand">
          <el-col :span="8">
            <el-form-item label="租金" prop="annualRent" >
              <el-input v-model="enterForm.annualRent" placeholder="请填写年租金" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24" v-if="ups1Disable">
          <el-col :span="8" >
            <el-form-item label="土地面积" prop="landArea">
              <el-input v-model="enterForm.landArea" placeholder="请填写土地面积" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="建筑物面积" prop="buildingArea">
              <el-input v-model="enterForm.buildingArea" placeholder="请填写建筑物面积" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="年租金" prop="annualRent"  >
              <el-input v-model="enterForm.annualRent" placeholder="请填写年租金" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>

          </el-col>
        </el-row>

        <el-row :span="24" v-if="ups1Disable" >
          <el-col :span="8" >
            <el-form-item label="出租企业名称" prop="fName" v-if="ups1Disable" >
              <el-select v-model="enterForm.fName" placeholder="请选择"  style="width: 100%" @change="contentChange">
                <el-option
                  v-for="item in ups1Options"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="入园时间" prop="admissionTime"  v-if="ups1Disable" >
              <el-input v-model="enterForm.admissionTime" placeholder="请填写入园时间" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>

        </el-row>


        <el-row :span="24" v-if="isUseLand" >
          <el-divider content-position="left">建筑总面积(平方米)</el-divider>
          <el-col :span="8" >
            <el-form-item label="合计" prop="buildingAreaTotal">
              <el-input v-model="enterForm.buildingAreaTotal" placeholder="请填写合计面积" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="自用" prop="buildingSelf">
              <el-input v-model="enterForm.buildingSelf" placeholder="请填写自用面积" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="租赁" prop="buildingLease">
              <el-input v-model="enterForm.buildingLease" placeholder="请填写租赁面积" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24" v-if="isUseLand" >
          <el-col :span="8" >
            <el-form-item label="闲置" prop="buildingFree">
              <el-input v-model="enterForm.buildingFree" placeholder="请填写闲置面积" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">经营状况(万元)</el-divider>
        <el-row :span="24" >
          <el-col :span="8" >
            <el-form-item label="企业产品" prop="capacity" >
              <el-input v-model="enterForm.capacity" placeholder="请填写企业产品" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="产值" prop="output" >
              <el-input v-model="enterForm.output" placeholder="请填写产值" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="营业收入" prop="business" >
              <el-input v-model="enterForm.business" placeholder="请填写营业收入" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="8" >
            <el-form-item label="用工数量" prop="employeesNum" >
              <el-input v-model="enterForm.employeesNum" placeholder="请填写用工数量" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="税收总额" prop="total" >
              <el-input v-model="enterForm.total" placeholder="请填写税收总额" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="地方财政收入" prop="revenue" >
              <el-input v-model="enterForm.revenue" placeholder="请填写地方财政收入" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">其他信息</el-divider>
        <el-row :span="24">
          <el-col :span="8" >
            <el-form-item label="所属网格" prop="grid" >
              <el-input v-model="enterForm.grid" placeholder="请填写所属网格" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="主要销售地" prop="placeSale" >
              <el-input v-model="enterForm.placeSale" placeholder="请填写主要销售地" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="法定负责人及联系方式" prop="legalPerson" >
              <el-input v-model="enterForm.legalPerson" placeholder="请填写法定负责人" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="8" >
            <el-form-item label="统一社会信用代码" prop="code">
              <el-input v-model="enterForm.code" placeholder="请输入统一社会信用代码" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
            <el-form-item label="税收所属分局及街道" prop="branchStreet" >
              <el-input v-model="enterForm.branchStreet" placeholder="请填写税收所属分局及街道" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :span="24">
          <el-col :span="16" >
            <el-form-item label="企业信息备注" prop="remark" >
              <el-input v-model="enterForm.remark" placeholder="请填写备注" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>



        <el-form-item label="从新申请" prop="reApply" v-if="showVerify.ModifyApply">
          <el-radio v-model="form.processParams.B_reApply" label="true" @change="handleSelectChange">重新申请</el-radio>
          <el-radio v-model="form.processParams.B_reApply" label="false" @change="handleSelectChange">放弃申请</el-radio>
        </el-form-item>

        <el-form-item label="审批意见" prop="deptLeaderApproved" v-if="showVerify.DeptLeaderVerify">
          <el-radio v-model="form.processParams.B_deptLeaderApproved" label="true" @change="handleSelectChange">同意
          </el-radio>
          <el-radio v-model="form.processParams.B_deptLeaderApproved" label="false" @change="handleSelectChange">拒绝
          </el-radio>
        </el-form-item>

        <el-form-item label="审批意见" prop="hrApproved" v-if="showVerify.HrVerify">
          <el-radio v-model="form.processParams.B_hrApproved" label="true" @change="handleSelectChange">同意</el-radio>
          <el-radio v-model="form.processParams.B_hrApproved" label="false" @change="handleSelectChange">拒绝</el-radio>
        </el-form-item>

        <el-form-item label="审批意见" prop="sign" v-if="showVerify.GetPeople">
          <el-radio v-model="form.processParams.B_peopleSign" label="true" @change="handleSelectChange">签到</el-radio>
          <el-radio v-model="form.processParams.B_peopleSign" label="false" @change="handleSelectChange">拒绝签到</el-radio>
        </el-form-item>

        <!--<el-form-item label="批注" prop="comment" v-if="showButton&& !(showVerify.ModifyApply||showVerify.ReportBack)">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.processParams.COM_comment">
          </el-input>
        </el-form-item>-->


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitShowVerifyDialog" v-show="showButton">确 定</el-button>
        <el-button type="primary" @click="submitForm" v-show=!readonly&&!showButton>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--审批历史-->
    <el-dialog title="审批历史" :visible.sync="dialogTableVisible">
      <ApprovalHistory :instanceId="instanceId"></ApprovalHistory>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看进度" :visible.sync="processImg">
      <ProcessImg :instanceId="instanceId"></ProcessImg>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    tableDownload,enterList,addEnter,updateEnter,delEnter,submitApply,taskList,getMeet,exportModel,getEnterDetail,beforeAdd,
    getDeptUser,getAllUps1
  } from '@/api/enterprise/basicInfo';
  import {listUser} from '@/api/system/user';
  import {cancelApply, suspendOrActiveApply, showVerifyDialog, complete} from '@/api/activiti/process'
  import {calcTotalSecond, formatTotalDateSub} from '@/utils/dateUtil';
  import ApprovalHistory from '@/components/activiti/approvalHistory';
  import ProcessImg from '@/components/activiti/processImg';
  import { getToken } from "@/utils/auth";

  export default {
    components: {ApprovalHistory, ProcessImg},
    name: 'BasicInfo',
    data() {
      return {
        deptUserList:[],
        isSubcontract:false,
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/enterprise/excel",
        },
        // 审批确定按钮
        showButton: false,
        // 审批人控制表单
        showVerify: {
          ModifyApply: false,
          DeptLeaderVerify: false,
          HrVerify: false,
          ReportBack: false,
          GetPeople: false,
        },
        // 路径
        path: '',
        // 查询方法
        getLeaveList: null,

        //流程图窗口开关
        processImg: false,
        //审批历史窗口开关
        dialogTableVisible: false,
        //历史审批窗口参数
        instanceId: '',

        // 请假时长
        formatDateSub: '',
        // startAndEndTime: ['', ''],
        readonly: false,
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 请假流程表格数据
        leaveList: [],
        useLandTable: [],
        // tableHeight:0,
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        //参会人
        options:[],
        peopOptions:[],
        // 查询参数
        queryParams: {
          name:null,
          enterpriseNature:'占地企业',
          area:null,//所属 地块、
          grid:null,//所属网格、
          landNature:null,
          pageNum: 1,
          pageSize: 5,
          type: null,
          title: null,
          reason: null,
          leaveStartTime: null,
          leaveEndTime: null,
          totalTime: null,
          instanceId: null,
          applyUser: null,
          applyTime: null,
          realityStartTime: null,
          realityEndTime: null
        },
        // 表单参数
        enterForm: {
          name:'',//企业名称
          code:'',//社会统一信用代码
          enterpriseNature:'占地企业',//企业性质
          areaCovered:'',//占地面积、
          landNature:'',//土地性质、
          employeesNum:'',//企业人数
          legalPerson:'',//法定负责人、
          legalPho:'',//法定负责人联系电话、
          financePerson:'',//财务负责人、
          financePho:'',//财务负责人联系电话、
          area:'东片区西片区（京广铁路桥以东）',//所属 地块、
          grid:'',//所属网格、
          subcontract:'',//分包人员、
          branchStreet:'',//税收所属分局及街道、
          capacity:'',//企业产品、
          placeSale:'',//主要销售地
          employees:'',//从业人员
          revenue:'',//财政收入
          business:'',//营业收入
          profit:'',//利润
          account:'',
          isStopProduction:'否',
          landArea:'',
          buildingArea:'',
          annualRent:'',
          admissionTime:'',
          buildingAreaTotal:'',
          buildingLease:'',
          buildingSelf:'',
          buildingFree:'',
          fName:'',
          fId:'',
          remark:'',
          /*backups1:'',
          processParams: {},
          // peoples: [],
          meetParticipants:'',
          meetContent:''*/
        },
        ups1Options:[],
        ups1Disable:false,
        isUseLand:true,
        // 表单校验
        addRules: {
          name: [
            {required: true, message: '企业名称不能为空', trigger: 'blur'}
          ],
          landNature: [
            { required: true, message: '请选择土地性质', trigger: 'change' }
          ],
         /* code: [
            {required: true, message: '社会统一信用代码不能为空', trigger: 'blur'}
          ],*/
          /*startAndEndTime: [
            {required: true, message: '会议时间不能为空', trigger: 'change'}
          ],*/
          backups1: [
            { required: true, message: '负责人不能为空', trigger: 'change'}
          ],
          /*meetParticipants: [
            {required: true, message: '参会人不能为空',}
          ],*/
          meetContent: [
            {required: true, message: '会议主要内容不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    created() {//这不是一进来就运行吗
      this.loading= false;
      // this.getLeaveList = enterList
      enterList(this.queryParams).then(response => {
        if (response.code === 200) {
          // this.getLeaveList = response.list
          // this.leaveList = response.rows
          this.useLandTable = response.rows//这个是右边表格
          // for(let i = 0;i<response.rows.length;i++){//这个循环是往左边表格里加数据
          //   if(response.rows[i].children !== []){
          //     let children = response.rows[i].children;
          //     for(let j = 0; j<children.length;j++){
          //       this.leaveList.push(children[j])
          //     }
          //   }
          // }
          // this.tableHeight = this.leaveList.length *80;
          // let element = this.$refs['myTable'];
          // console.log('好困好困',element)
          this.total = response.total
          this.loading = false
        }
      });
      /* this.getLeaveList(this.queryParams).then(response => {
         this.leaveList = response.rows
         this.total = response.total
         this.loading = false
       })*/
      /*const path = this.$route.path.split('/').pop()
      this.path = path
      console.log(this.path)
      // this.getLeaveList = enterList
      if ('advice' == path) {
        this.getLeaveList = enterList
      } else if ('todo' == path) {
        this.getLeaveList = taskList
      } else if ('done' == path) {
        this.getLeaveList = taskDoneList
      }

      this.getList()*/
    },
    methods: {
      submitShowVerifyDialog() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            complete(this.form).then(response => {
              if (response.code === 200) {
                if (this.showVerify.ModifyApply) {
                  updateLeave(this.form).then(response => {
                    if (response.code === 200) {
                      this.msgSuccess('修改成功')
                      this.open = false
                      this.getList()
                    }
                  })
                } else {
                  this.msgSuccess('操作成功')
                  this.open = false
                  this.getList()
                }
                this.reset()
              }
            })
          }
        })
      },
      // 审批菜单控制
      showVerifyDialog(row) {
        this.showButton = true
        this.reset()
        getMeet(row.id).then(response => {
          this.form = response.data
          // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          showVerifyDialog(row.taskId).then(response => {
            console.log(response.msg)
            if ('ModifyApply' === response.msg) {
              this.readonly = false
              this.showVerify.ModifyApply = true;
              this.form.processParams.B_reApply = "true";
            } else {
              if ('HrVerify' === response.msg) {
                this.showVerify.HrVerify = true;
                this.form.processParams.B_hrApproved = "true";
              } else if ('DeptLeaderVerify' === response.msg) {
                this.showVerify.DeptLeaderVerify = true;
                this.form.processParams.B_deptLeaderApproved = "true";
              } else if ('ReportBack' === response.msg) {
                this.showVerify.ReportBack = true;
              } else if ('Sign' === response.msg) {
                this.form.processParams.B_peopleSign = "true";
                this.showVerify.GetPeople = true;
              }
              this.readonly = true
            }
            this.open = true
            this.title = row.taskName
          })
        })
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          // for(let i = 0;i<this.useLandTable.length;i++){
            let children = this.useLandTable[rowIndex].children;
            // if (rowIndex % 2 === 0) {
            //   return {
            //     rowspan: 2,
            //     colspan: 1
            //   };
            // } else {
              return {
                rowspan: children.length,
                colspan: 0
              };
            // }
          // }

        }
      },
      contentChange (val) {
        this.ups1Options.find((item)=>{ //这里的firstSendList就是数据源
          if(item.name == val){
            this.enterForm.fId = item.id;
          }
        });
      },
      /** 历史列表 */
      historyList(row) {
        this.dialogTableVisible = true
        this.instanceId = row.instanceId
      },
      /** 查询请假流程列表 */
      getList() {
        this.loading = true
        /*this.getLeaveList(this.queryParams).then(response => {
          this.leaveList = response.rows
          this.total = response.total
          this.loading = false
        })*/
        enterList(this.queryParams).then(response => {
          if (response.code === 200) {
            // this.leaveList = response.rows
            this.useLandTable = response.rows
            // for(let i = 0;i<this.useLandTable.length;i++){
            //   if(this.useLandTable[i].children !== []){
            //     let children = this.useLandTable[i].children;
            //     for(let j = 0; j<children.length;j++){
            //       this.leaveList.push(children[j])
            //     }
            //   }
            // }
            this.total = response.total
            this.loading = false
          }
        });
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.dialogTableVisible = false
        this.processImg = false
        this.showButton = false
        this.reset()

      },
      // 表单重置
      reset() {
        this.isSubcontract = false;
        this.enterForm = {
          name:'',//企业名称
          code:'',//社会统一信用代码
          enterpriseNature:'占地企业',//企业性质
          areaCovered:'',//占地面积、
          landNature:'',//土地性质、
          employeesNum:'',//企业人数
          legalPerson:'',//法定负责人、
          legalPho:'',//法定负责人联系电话、
          financePerson:'',//财务负责人、
          financePho:'',//财务负责人联系电话、
          area:'东片区西片区（京广铁路桥以东）',//所属 地块、
          grid:'',//所属网格、
          subcontract:'',//分包人员、
          branchStreet:'',//税收所属分局及街道、
          capacity:'',//企业产品、
          placeSale:'',//主要销售地
          employees:'',//从业人员
          revenue:'',//财政收入
          business:'',//营业收入
          profit:'',//利润
          account:'',
          isStopProduction:'否',
          landArea:'',
          buildingArea:'',
          annualRent:'',
          admissionTime:'',
          buildingAreaTotal:'',
          buildingLease:'',
          buildingSelf:'',
          buildingFree:'',
          fName:'',
          fId:'',
          remark:''
        }
        // this.startAndEndTime = ['', '']
        this.formatDateSub = null
        this.resetForm('form')
        this.instanceId = ''
        this.showVerify = {
          ModifyApply: false,
          DeptLeaderVerify: false,
          HrVerify: false,
          ReportBack: false,
        }
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      /**下载*/
      downloadTable(data){
        console.log('搜索天剑',this.queryParams)
        tableDownload(this.queryParams).then((response) => {
          this.download(response.msg)
        });
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        listUser().then(res =>{
          this.options = res.rows;
          this.peopOptions = res.rows;
        })
        this.readonly = false
        this.title = '企业新增';
        beforeAdd().then((response) => {
          if(response.result === false){
            getDeptUser().then(res=>{
              this.deptUserList = res;
            })
          }else{
            this.enterForm.subcontract = response.nickName;
            this.enterForm.account = response.userName;
            this.isSubcontract = true;
          }
        });
      },
      subcontractChange(val){
        let length = val.length-1;
        this.enterForm.account = val[length];
        // let labelValue = this.$refs['myCascader'];
        // let index = this.deptUserList.findIndex(item => (item.name === val[0]))
        // let smallIndex = this.deptUserList[index].children.findIndex(item => (item.name === val[1]))
        // let labelValue =  this.deptUserList[index].children[smallIndex].type
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        getEnterDetail(row.id).then(response => {//isUseLand
          this.enterForm = response.data;
          if(response.data.enterpriseNature === '占地企业'){
            this.ups1Disable = false;
            this.isUseLand = true;
          }else{
            this.ups1Disable = true;
            this.isUseLand = false;
          }
          // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = false
          this.title = '修改企业信息'
        })
      },
      submitApply(row) {
        this.$confirm('确认要提交申请吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return submitApply(row.id)
        }).then(() => {
          this.getList()
          this.msgSuccess('提交成功')
        }).catch(function () {
        })
      },
      cancelApply(row) {
        this.$confirm('确认要撤销申请吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return cancelApply(row.instanceId)
        }).then(() => {
          this.getList()
          this.msgSuccess('撤销成功')
        }).catch(function () {
        })
      },
      suspendOrActiveApply(row) {
        var suspendOrActive = row.suspendState === '2' ? '激活' : '挂起'
        this.$confirm('确认要' + suspendOrActive + '申请吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          const data = {'instanceId': row.instanceId, 'suspendState': row.suspendState}
          return suspendOrActiveApply(data)
        }).then(() => {
          this.getList()
          this.msgSuccess('撤销成功')
        }).catch(function () {
        })
      },
      /** 表单数据展示 */
      detail(row) {
        /*this.reset()
        getMeet(row.id).then(response => {
          this.enterForm = response.data
          // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = true
          this.title = '申请详情'
        })*/
        this.reset()
        getEnterDetail(row.id).then(response => {
          this.enterForm = response.data;
          if(response.data.enterpriseNature === '占地企业'){
            this.ups1Disable = false;
            this.isUseLand = true;
          }else{
            this.ups1Disable = true;
            this.isUseLand = false;
          }
          // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = true
          this.title = '详情'
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if(this.enterForm.account ===''){
            this.$message({
              message: '警告!未选择分包人员！',
              type: 'warning'
            });
            return;
          }
          if (valid) {
            if (this.enterForm.id != null) {

              updateEnter(this.enterForm).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                }
              })
            } else {
              addEnter(this.enterForm).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.getList()
                }
              })
            }
          }
          /* let meetParticipants = '';
           for(let i = 0;i<this.enterForm.peoples.length;i++){
             meetParticipants += this.enterForm.peoples[i] +','
           }
           this.enterForm.meetParticipants = meetParticipants.substring(0,meetParticipants.length-1);

           addEnter(this.enterForm).then(response => {
           })*/
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id;
        this.$confirm('是否确认删除企业名称为"' + row.name + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delEnter(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function () {
        })
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
        this.getList();
      },
      handleImport() {
        this.upload.title = "导入";
        this.upload.open = true;
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
      /** 下载模板操作 */
      importTemplate() {
        exportModel().then((response) => {
          this.download(response.msg);
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有请假流程数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return exportLeave(queryParams)
        }).then(response => {
          this.download(response.msg)
        }).catch(function () {
        })
      },
      showProcessImgDialog(row) {
        this.processImg = true
        this.instanceId = row.instanceId
      },
      handleSelectChange(val) {
        console.log(this.form.processParams.B_deptLeaderApproved)
        this.$forceUpdate()
      },
      enterpriseChange(val){
        if(val === '占地企业'){
          this.ups1Disable = false;
          this.isUseLand = true;
        }else{
          getAllUps1().then(res => {
            this.ups1Options = res.data;
          });
          this.ups1Disable = true;
          this.isUseLand = false;
        }
      }
    },
    watch: {
      /*startAndEndTime: {
        handler(newValue) {
          // this.form.leaveStartTime = newValue[0]
          // this.form.leaveEndTime = newValue[1]
          this.form.meetStartTime = newValue[0]
          this.form.meetEndTime = newValue[1]
          if (newValue[0] && newValue[1]) {
            this.form.totalTime = calcTotalSecond(newValue[0], newValue[1])
            this.formatDateSub = formatTotalDateSub(this.form.totalTime)
          }

        },
        deep: true
      }*/
    }
  }

</script>
<style lang="scss" scoped>
  /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #F1FAFA;
    /*background: 	#F1FAFA;*/
    /*background: #A0EEE1;*/
  }
</style>
