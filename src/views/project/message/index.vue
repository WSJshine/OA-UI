<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="建设单位" prop="constructionUnit">
        <el-input
          v-model="queryParams.constructionUnit"
          placeholder="请输入建设单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="负责人" prop="mainPerson">
        <el-input
          v-model="queryParams.mainPerson"
          placeholder="请输入负责人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

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
          v-hasPermi="['project:message:add']"
        >新增
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['project:message:import']">导入</el-button>
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

    <el-table v-loading="loading" :data="leaveList">
      <!--<el-table-column label="项目名称" align="center" prop="name"/>-->
      <el-table-column
        prop="name"
        align="center"
        label="项目名称">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goLink(scope.row)">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" align="center" prop="enterpriseName"/>
      <el-table-column label="文号" align="center" prop="number"/>
      <el-table-column label="建设性质" align="center" prop="nature"/>
       <!--<el-table-column label="审批单位" align="center" prop="approvalUnit"/>-->
       <el-table-column label="备案依据" align="center" prop="fillingBasis"/>
       <el-table-column label="建设单位" align="center" prop="constructionUnit"/>
      <el-table-column label="主要负责人" align="center" prop="mainPerson"/>

      <!--<el-table-column label="立项备案" align="center" prop="isRegistration"/>-->
      <el-table-column prop="isRegistration" label="立项备案" align="center" >
        <template slot-scope="scope" >
          <!--<el-button type="text" size="small" @click="downloadText(scope.row.enclosure)" v-if="scope.row.isRegistration === '未备案'">{{scope.row.isRegistration}}</el-button>-->
          <el-popconfirm title="确定将该项目备案吗？" @onConfirm="setRecord(scope.row.id)" v-if="scope.row.isRegistration === '未备案'">
          <el-button slot="reference" v-hasPermi="['project:message:upd']">{{scope.row.isRegistration}}</el-button>
          </el-popconfirm>
          <!--<a href="www.baidu.com">点击</a>-->
          <span v-else>{{scope.row.isRegistration}}</span>
        </template>
      </el-table-column>

      <el-table-column label="选址" align="center" prop="siteSelect"/>
      <el-table-column label="联系人" align="center" prop="contacts"/>
      <el-table-column label="联系电话" align="center" prop="phone"/>
      <el-table-column label="占地面积" align="center" prop="areaCovered"/>
      <!--<el-table-column label="总投资" align="center" prop="investment"/>-->
      <!--<el-table-column label="拟投入生产运营时间" align="center" prop="operationDate"/>-->
      <!--<el-table-column label="附件" align="center" prop="meetContent"/>-->
      <el-table-column prop="enclosure" label="附件" align="center" >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="downloadText(scope.row.enclosure)" v-hasPermi="['project:message:export']">{{scope.row.enclosure}}</el-button>
          <!--<a href="www.baidu.com">点击</a>-->
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div v-if="scope.row.instanceId">
           <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="detail(scope.row)"
              v-hasPermi="['workflow:leave']"
            >申请详情
            </el-button>-->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="historyList(scope.row)"
              v-hasPermi="['workflow:leave']"
            >审批历史
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="showProcessImgDialog(scope.row)"
              v-hasPermi="['workflow:leave']"
            >进度查看
            </el-button>
            <el-button
              v-if="scope.row.taskName.indexOf('已挂起') === -1 && path=='todo'"
              size="mini" showFormDialog
              type="text"
              icon="el-icon-edit"
              @click="showVerifyDialog(scope.row)"
              v-hasPermi="['workflow:leave']"
            >{{scope.row.taskName.indexOf('审批') !== -1?'审批':scope.row.taskName}}
            </el-button>
            <div v-if="scope.row.taskName.indexOf('已结束') === -1 && path=='advice'">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="cancelApply(scope.row)"
                v-hasPermi="['workflow:leave']"
              >撤销
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="suspendOrActiveApply(scope.row)"
                v-hasPermi="['workflow:leave']"
              >{{scope.row.suspendState=== '2' ? '激活' : '挂起'}}
              </el-button>
            </div>
          </div>
          <div v-else>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="goLink(scope.row)"
              v-hasPermi="['project:message:query']"
            >详情
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="submitApply(scope.row)"
              v-hasPermi="['project:message:upload']"
            >上传附件
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['project:message:modify']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['project:message:delete']"
            >删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

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
          <el-link type="info" style="font-size:12px" @click="importTemplate" v-hasPermi="['project:message:model']">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--上传附件-->
    <el-dialog :title="annexUpload.title" :visible.sync="annexUpload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1"  :headers="annexUpload.headers" :action="annexUpload.url + '?updateSupport=' + annexUpload.updateSupport" :disabled="annexUpload.isUploading" :on-progress="annexFileUploadProgress" :on-success="annexFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <!--<div class="el-upload__tip" slot="tip">
          &lt;!&ndash;<el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据&ndash;&gt;
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>-->
        <div class="el-upload__tip" style="color:red" slot="tip">提示：文件大小不能超过50M！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="annexSubmit">确 定</el-button>
        <el-button @click="annexUpload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改请假流程对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
        <el-form ref="form" :model="enterForm" :rules="addRules" :inline="true" class="demo-form-inline"  label-width="220px" >
          <el-form-item label="项目名称" prop="name" >
            <el-input v-model="enterForm.name" placeholder="请输入项目名称" :disabled=readonly style="width: 100%"></el-input>
          </el-form-item>
           <el-form-item label="企业名称" prop="enterpriseName">
             <el-input v-model="enterForm.enterpriseName" placeholder="请输入企业名称" :disabled=readonly style="width: 100%"></el-input>
           </el-form-item>
           <el-form-item label="项目文号" prop="number" >
             <el-input v-model="enterForm.number" placeholder="请填写项目文号" :disabled=readonly style="width: 100%"></el-input>
           </el-form-item>
           <el-form-item label="建设性质" prop="nature" >
             <el-input v-model="enterForm.nature" placeholder="请填写建设性质" :disabled=readonly style="width: 100%"></el-input>
           </el-form-item>
           <el-form-item label="审批单位" prop="approvalUnit" >
             <el-input v-model="enterForm.approvalUnit" placeholder="请填写审批单位" :disabled=readonly style="width: 100%"></el-input>
           </el-form-item>
           <el-form-item label="备案依据" prop="fillingBasis" >
             <el-input v-model="enterForm.fillingBasis" placeholder="请填写备案依据" :disabled=readonly style="width: 100%"></el-input>
           </el-form-item>
          <el-form-item label="建设单位" prop="constructionUnit" >
            <el-input v-model="enterForm.constructionUnit" placeholder="请填写建设单位" :disabled=readonly style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="主要负责人" prop="mainPerson" >
            <el-input v-model="enterForm.mainPerson" placeholder="请填写主要负责人" :disabled=readonly style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="选址" prop="siteSelect" >
            <el-input v-model="enterForm.siteSelect" placeholder="请填写选址" :disabled=readonly style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="contacts" >
            <el-input v-model="enterForm.contacts" placeholder="请填写联系人" :disabled=readonly style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone" >
            <el-input v-model="enterForm.phone" placeholder="请填写联系电话" :disabled=readonly style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="占地面积" prop="areaCovered" >
            <el-input v-model="enterForm.areaCovered" placeholder="请填写占地面积" :disabled=readonly style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="总投资" prop="investment" >
            <el-input v-model="enterForm.investment" placeholder="请填写总投资" :disabled=readonly style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="拟投入生产运营时间" prop="areaCovered" >
            <el-date-picker
              v-model="enterForm.operationDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
              style="width: 100%" :disabled=readonly>
            </el-date-picker>
          </el-form-item>

          <!--<el-form-item label="附件" prop="file" >
            &lt;!&ndash;<el-input v-model="enterForm.investment" placeholder="请填写总投资" style="width: 100%"></el-input>&ndash;&gt;
            <el-upload style="width: 100%" ref="upload" :limit="1"  :headers="annexUpload.headers" :action="annexUpload.url + '?updateSupport=' + annexUpload.updateSupport" :disabled="annexUpload.isUploading" :on-progress="annexFileUploadProgress" :on-success="annexFileSuccess" :auto-upload="false" >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="annexSubmit">上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
            </el-upload>
          </el-form-item>-->




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
    tableDownload,record,fileDownload,projectList,addProject,submitApply,taskList,getProjectDetail,updateProject,delProject,exportProject,importModel,exportOutModel,importAnnexUrl
  } from '@/api/project/message';
  import {listUser} from '@/api/system/user';
  import {cancelApply, suspendOrActiveApply, showVerifyDialog, complete} from '@/api/activiti/process'
  import {calcTotalSecond, formatTotalDateSub} from '@/utils/dateUtil';
  import ApprovalHistory from '@/components/activiti/approvalHistory';
  import ProcessImg from '@/components/activiti/processImg';
  import { getToken } from "@/utils/auth";

  export default {
    components: {ApprovalHistory, ProcessImg},
    name: 'Message',
    data() {
      return {
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
          url: process.env.VUE_APP_BASE_API + "/construction/import",
        },
        //附件上传
        annexUpload:{
          id:'',
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
          url: process.env.VUE_APP_BASE_API + "/construction/file",
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
        startAndEndTime: ['', ''],
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
          constructionUnit:null,
          mainPerson:null,
          pageNum: 1,
          pageSize: 10,
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
          name:'',
          enterpriseName:'',
          number:'',
          nature:'',
          approvalUnit:'',
          fillingBasis:'',
          constructionUnit:'',
          mainPerson:'',
          // readConverterExp:'',
          siteSelect:'',
          contacts:'',
          phone:'',
          areaCovered:'',
          investment:'',
          operationDate:'',
          file:'',//附件
        },

        // 表单校验
        addRules: {
          name: [
            {required: true, message: '项目名称不能为空', trigger: 'blur'}
          ],
          /*startAndEndTime: [
            {required: true, message: '会议时间不能为空', trigger: 'change'}
          ],*/
          enterpriseName: [
            { required: true, message: '企业名称不能为空', trigger: 'blur'}
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
    created() {
      this.loading= false;
      // this.getLeaveList = projectList
      projectList(this.queryParams).then(response => {
        let list = response.rows;
        this.leaveList = list.map(function (item) {
          if (item.isRegistration === 1) {
            item.isRegistration = "已备案"
          } else if (item.isRegistration === 0) {
            item.isRegistration = "未备案"
          }
          if(item.enclosure !== '' && item.enclosure !== null){
            item.enclosure = item.enclosure.substring(item.enclosure.lastIndexOf("/")+1);
          }
          return item;
        });

        this.total = response.total
        this.loading = false
      })
      /*const path = this.$route.path.split('/').pop()
      this.path = path
      console.log(this.path)
      // this.getLeaveList = projectList
      if ('advice' == path) {
        this.getLeaveList = projectList
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
            complete(this.enterForm).then(response => {
              if (response.code === 200) {
                if (this.showVerify.ModifyApply) {
                  updateProject(this.enterForm).then(response => {
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
        getProjectDetail(row.id).then(response => {
          this.enterForm = response.data
          // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          showVerifyDialog(row.taskId).then(response => {
            console.log(response.msg)
            if ('ModifyApply' === response.msg) {
              this.readonly = false
              this.showVerify.ModifyApply = true;
              this.enterForm.processParams.B_reApply = "true";
            } else {
              if ('HrVerify' === response.msg) {
                this.showVerify.HrVerify = true;
                this.enterForm.processParams.B_hrApproved = "true";
              } else if ('DeptLeaderVerify' === response.msg) {
                this.showVerify.DeptLeaderVerify = true;
                this.enterForm.processParams.B_deptLeaderApproved = "true";
              } else if ('ReportBack' === response.msg) {
                this.showVerify.ReportBack = true;
              } else if ('Sign' === response.msg) {
                this.enterForm.processParams.B_peopleSign = "true";
                this.showVerify.GetPeople = true;
              }
              this.readonly = true
            }
            this.open = true
            this.title = row.taskName
          })
        })
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
        projectList(this.queryParams).then(response => {
          let list = response.rows;
          this.leaveList = list.map(function (item) {
            if (item.isRegistration === 1) {
              item.isRegistration = "已备案"
            } else if (item.isRegistration === 0) {
              item.isRegistration = "未备案"
            }
            if(item.enclosure !== '' && item.enclosure !== null){
              item.enclosure = item.enclosure.substring(item.enclosure.lastIndexOf("/")+1);
            }
            return item;
          });
          this.total = response.total
          this.loading = false
        })
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
        this.enterForm = {
          name:null,
          enterpriseName:null,
          number:null,
          nature:null,
          approvalUnit:null,
          fillingBasis:null,
          constructionUnit:null,
          mainPerson:null,
          // readConverterExp:null,
          siteSelect:null,
          contacts:null,
          phone:null,
          areaCovered:null,
          investment:null,
          operationDate:null,
          file:null,//附件
        }
        this.startAndEndTime = ['', '']
        this.formatDateSub = null
        this.resetForm('enterForm')
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
        });;
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
        this.title = '新增项目'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        getProjectDetail(row.id).then(response => {
          this.enterForm = response.data
          // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = false
          this.title = '修改'
        })
      },
      goLink(row) {
        this.reset()
        getProjectDetail(row.id).then(response => {
          this.enterForm = response.data
          // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = true
          this.title = '查看详情'
        })
      },
      submitApply(row) {
       /* this.$confirm('确认要提交申请吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return submitApply(row.id)
        }).then(() => {
          this.getList()
          this.msgSuccess('提交成功')
        }).catch(function () {
        })*/
        this.annexUpload.id = row.id;
        this.annexUpload.title = "上传附件";
        this.annexUpload.open = true;
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
        this.reset()
        getProjectDetail(row.id).then(response => {
          this.enterForm = response.data
          // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = true
          this.title = '申请详情'
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.enterForm.id != null) {
              updateProject(this.enterForm).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                }
              })
            } else {
              addProject(this.enterForm).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.getList()
                }
              })
            }
          }
          /*let meetParticipants = '';
          for(let i = 0;i<this.form.peoples.length;i++){
            meetParticipants += this.form.peoples[i] +','
          }
          this.form.meetParticipants = meetParticipants.substring(0,meetParticipants.length-1);*/

          /*addProject(this.enterForm).then(response => {
            /!*if (response.code === 200) {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            }*!/
          })*/
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id
        this.$confirm('是否确认删除项目名称为"' + row.name + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delProject(ids)
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
      // 附件上传中处理
      annexFileUploadProgress(event, file, fileList) {
        this.annexUpload.isUploading = true;
      },
      // 附件上传成功处理
      annexFileSuccess(response, file, fileList) {
        console.log('附件上传',response)
        let data={
          id: this.annexUpload.id,
          file : response.fileUrl
        }
        importAnnexUrl(data).then((response) => {
          // this.download(response.msg);
          this.annexUpload.open = false;
          this.annexUpload.isUploading = false;
          this.$refs.upload.clearFiles();
          this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
          this.getList();
        });

      },
      //附件上传
      annexSubmit(){
        this.$refs.upload.submit();
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
      //设置备案
      setRecord(data){
        record(data).then((res)=>{
          this.getList();
        });
      },
      /**下载附件*/
      downloadText(data){
        fileDownload(data);
      },
      /** 下载模板操作 */
      importTemplate() {
        exportProject().then((response) => {
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
          return exportOutModel(queryParams)
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

        this.$forceUpdate()
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
