<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="党员名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入党员名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="党员类别" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择党员类别" clearable size="small">
          <el-option label="正式党员" value="正式党员"/>
          <el-option label="预备党员" value="预备党员"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所属党支部" prop="branchId">
        <el-select v-model="queryParams.branchId"  clearable placeholder="请选择所属党支部">
          <el-option
            v-for="item in firstSendList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属企业" prop="enterpriseId">
        <el-select v-model="queryParams.enterpriseId"  clearable placeholder="请选择所属企业">
          <el-option
            v-for="item in secondSendList"
            :key="item.id"
            :label="item.enterpriseName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--<el-row :gutter="10" class="mb8" v-if="path=='advice'">	-->
    <el-row :gutter="10" class="mb8" >
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['party:member:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['system:user:import']">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          @click="downloadTable"
          v-hasPermi="['party:member:export']"
        >下载
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leaveList" stripe border :header-cell-style="{background:'#336699',color:'#eef1f6'}">
      <!--<el-table-column label="姓名" align="center" prop="name"/>-->
      <el-table-column
        prop="name"
        align="center"
        label="姓名">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goLink(scope.row)">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="sex"/>
      <el-table-column label="身份证号" align="center" prop="idNumber"/>
      <el-table-column label="学历" align="center" prop="education"/>
      <el-table-column label="党员类别" align="center" prop="type"/>
      <el-table-column label="所属党部" align="center" prop="branchStr"/>
      <el-table-column label="所属企业" align="center" prop="enterpriseStr"/>
      <el-table-column label="是否是流动党员" align="center" prop="isFlowStr"/>
      <el-table-column label="加入党组织日期" align="center" prop="joinTime"/>
      <el-table-column label="转正时间" align="center" prop="formalTime"/>
      <el-table-column label="是否已交党费" align="center" prop="duesStr"/>
      <el-table-column label="党费交至日期" align="center" prop="duesTime"/>
      <el-table-column label="电话" align="center" prop="phone"/>
      <el-table-column label="住址" align="center" prop="address"/>
      <el-table-column label="党籍状态" align="center" prop="state"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div v-if="scope.row.instanceId">
            <!--<el-button
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
           <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="submitApply(scope.row)"
            >提交申请
            </el-button>-->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="goLink(scope.row)"
              v-hasPermi="['party:member:query']"
            >详情
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['party:member:modify']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="changeUpdate(scope.row)"
              v-hasPermi="['party:member:trans']"
              v-if="scope.row.flowStatus === '无'"
            >转移
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['party:member:delete']"
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

    <!-- 添加或修改请假流程对话框readonly -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="addRules" label-width="150px" :inline="true">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" :disabled=readonly></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <!--<el-input v-model="form.reason" type="textarea" placeholder="请选择负责人" :disabled=readonly></el-input>-->
          <el-select v-model="form.sex" clearable placeholder="请选择" :disabled=readonly >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="form.idNumber" placeholder="请输入身份证号" :disabled=readonly></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-input v-model="form.education" placeholder="请输入学历" :disabled=readonly></el-input>
        </el-form-item>
        <el-form-item label="党员类别" prop="type">
          <!--<el-input v-model="form.reason" type="textarea" placeholder="请选择负责人" :disabled=readonly></el-input>-->
          <el-select v-model="form.type" clearable placeholder="请选择" :disabled=readonly>
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属党支部" prop="branchId">
          <el-select v-model="form.branchId"  clearable placeholder="请选择所属党支部" :disabled=readonly>
            <el-option
              v-for="item in firstSendList"
              :key="item.id"
              :label="item.name"
              :value="item.id" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属企业" prop="enterpriseId">
          <el-select v-model="form.enterpriseId"  clearable placeholder="请选择所属企业" :disabled=readonly>
            <el-option
              v-for="item in secondSendList"
              :key="item.id"
              :label="item.enterpriseName"
              :value="item.id" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否流动党员" prop="isFlow">
          <el-select v-model="form.isFlow" clearable placeholder="请选择" :disabled=readonly>
            <el-option
              v-for="item in isOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入党时间" prop="joinTime">
          <el-date-picker
            v-model="form.joinTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间" :disabled=readonly>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="转正时间" prop="joinTime">
          <el-date-picker
            v-model="form.formalTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间" :disabled=readonly>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否缴纳党费" prop="isFlow">
          <el-select v-model="form.isDues" clearable placeholder="请选择" :disabled=readonly>
            <el-option
              v-for="item in isDueOption"
              :key="item.value"
              :label="item.label"
              :value="item.value" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="党费交至时间" prop="joinTime">
          <el-date-picker
            v-model="form.duesTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间" :disabled=readonly>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话" :disabled=readonly></el-input>
        </el-form-item>
        <el-form-item label="住址" prop="address">
          <el-input v-model="form.address" placeholder="请输入住址" :disabled=readonly></el-input>
        </el-form-item>
        <el-form-item label="流动关系备注" prop="flowStatus">
          <el-input v-model="form.flowStatus" placeholder="请输入住址" :disabled=readonly></el-input>
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

    <!--转移-->
    <el-dialog title="转移" :visible.sync="change">
      <el-form ref="form" :model="form" :rules="addRules" label-width="80px">
        <!--<el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" :disabled=readonly></el-input>
        </el-form-item>-->
        <el-form-item label="党组织" prop="sex">
          <!--<el-input v-model="form.reason" type="textarea" placeholder="请选择负责人" :disabled=readonly></el-input>-->
          <el-select v-model="partyForm.party" clearable placeholder="请选择">
            <el-option
              v-for="item in partyForm.partyOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitChange">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

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
    memberList,addMember,submitApply,taskList,getMember,delMember,updateLeave,getParty,changeParty,getlistPrise,getlistParty,exportProject,
    importModel,exportOutModel,tableDownload
  } from '@/api/party/member';
  import {listUser} from '@/api/system/user';
  import {cancelApply, suspendOrActiveApply, showVerifyDialog, complete} from '@/api/activiti/process'
  import {calcTotalSecond, formatTotalDateSub} from '@/utils/dateUtil'
  import ApprovalHistory from '@/components/activiti/approvalHistory'
  import ProcessImg from '@/components/activiti/processImg'
  import { getToken } from "@/utils/auth";

  export default {
    components: {ApprovalHistory, ProcessImg},
    name: 'Member',
    data() {
      return {
        firstSend:'',
        firstSendList:[],
        secondSend:'',
        secondSendList:[],
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
          url: process.env.VUE_APP_BASE_API + "/party/member/importData",
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
        // 转移
        change: false,
        //参会人
        options: [{
          value: '男',
          label: '男'
        }, {
          value: '女',
          label: '女'
        }],
        isOptions: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        isDueOption: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        typeOptions: [{
          value: '正式党员',
          label: '正式党员'
        }, {
          value: '预备党员',
          label: '预备党员'
        }],
        peopOptions:[],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          title: null,
          reason: null,
          leaveStartTime: null,
          leaveEndTime: null,
          totalTime: null,
          instanceId: null,
          applyUser: null,
          applyTime: null,
          realityStartTime: null,
          realityEndTime: null,
          name:null,
          type: null,
          branchId:null,
          enterpriseId:null,
        },
        // 表单参数
        /*form: {
          meetTitle:'',
          backups1:'',
          processParams: {},
          // peoples: [],
          meetParticipants:'',
          meetContent:''
        },*/
        form: {},
        partyForm:{
          party:'',
          partyOptions:[]
        },
        memberId:'',
        // 表单校验
        addRules: {
          meetTitle: [
            {required: true, message: '会议标题不能为空', trigger: 'blur'}
          ],
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
    created() {
      getlistParty().then(response => {
        if (response.code === 200) {
          this.firstSendList = response.rows;

        }
      });
      getlistPrise().then(response => {
        if (response.code === 200) {

          this.secondSendList = response.rows;
        }
      });
      // this.loading= false;
      // this.getLeaveList = memberList
     /* memberList().then(response => {
        if (response.code === 200) {
          this.getLeaveList = response.list
        }
      })*/
      const path = this.$route.path.split('/').pop()
      this.path = path
      console.log(this.path)
      // this.getLeaveList = memberList
      if ('member' == path) {
        this.getLeaveList = memberList
        /*let perem = {
          pageNum : 1,
          pageSize: 10
        }
        this.getLeaveList = memberList(perem).then(response => {
          if (response.code === 200) {
            this.getLeaveList = response.list
          }
        })*/
      } else if ('todo' == path) {
        this.getLeaveList = taskList
      } else if ('done' == path) {
        this.getLeaveList = taskDoneList
      }

      this.getList()
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
        getMember(row.id).then(response => {
          this.form = response.data
          this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
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
      /** 历史列表 */
      historyList(row) {
        this.dialogTableVisible = true
        this.instanceId = row.instanceId
      },
      /** 查询请假流程列表 */
      getList() {
        this.loading = true
        this.getLeaveList(this.queryParams).then(response => {
          this.leaveList = response.rows
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
        this.form = {
          id: null,
          type: null,
          title: null,
          reason: null,
          leaveStartTime: null,
          leaveEndTime: null,
          totalTime: null,
          instanceId: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          applyUser: null,
          applyTime: null,
          realityStartTime: null,
          realityEndTime: null,
          processParams: {},
        }
        this.startAndEndTime = ['', '']
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
      partyReset(){
        this.partyForm = {
          party:'',
          partyOptions:[]
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
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        listUser().then(res =>{
          // this.options = res.rows;
          this.peopOptions = res.rows;
        })

        this.readonly = false
        this.title = '新增党员'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        getMember(row.id).then(response => {
         /* this.form = response.data
          // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = false
          this.title = '修改请假流程'*/
          this.form = response.data
          this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = false
          this.title = '修改党员信息'
        })
      },
      goLink(row) {
        this.reset()
        getMember(row.id).then(response => {
          this.form = response.data
          this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = true
          this.title = '查看党员信息'
        })
      },
      /** 转移操作 */
      changeUpdate(row) {
        this.partyReset()
        this.memberId = row.id
        getParty().then(response => {
          this.change = true
          this.partyForm.partyOptions = response.rows
          /* this.form = response.data
           // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
           this.open = true
           this.readonly = false
           this.title = '修改请假流程'*/
          /*this.form = response.data
          this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = false
          this.title = '修改党支部信息'*/
        })
      },
      /**确定转移*/
      submitChange(){
        let perem1 = {
          id : this.memberId,
          branchId : this.partyForm.party
        }
        changeParty(perem1).then(response => {
          if(response.code === 200){
            this.msgSuccess('提交成功')
            this.getList()
          }
          this.change = false
          // this.partyForm.partyOptions = response.rows
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
        this.reset()
        getMember(row.id).then(response => {
          this.form = response.data
          this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = true
          this.title = '申请详情'
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateLeave(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                }
              })
            } else {
              addMember(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.getList()
                }
              })
            }
          }

          /*addMember(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            }
          })*/
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除?' , '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delMember(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function () {
        })
      },
      handleImport() {
        this.upload.title = "导入";
        this.upload.open = true;
      },
      /**下载*/
      downloadTable(data){
        console.log('搜索天剑',this.queryParams)
        tableDownload(this.queryParams).then((response) => {
          this.download(response.msg)
        });;
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
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
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
        console.log(this.form.processParams.B_deptLeaderApproved)
        this.$forceUpdate()
      }
    },
    watch: {
      startAndEndTime: {
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
      }
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
