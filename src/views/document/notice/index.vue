<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="标题" prop="docTitle">
        <el-input
          v-model="queryParams.docTitle"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>

      <el-row :gutter="10" class="mb8" >
        <el-col :span="1.5">
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['document:send:task']"
            >新增
            </el-button>
            <span style="margin-left: 20px">流程模型</span>
            <el-select v-model="textForm.docType"   clearable   placeholder="请选择流程模型" style="margin-left: 10px">
              <el-option
                v-for="item in acceptTypeList"
                :key="item.key"
                :label="item.name"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
    </el-form>
    <el-table v-loading="loading" :data="leaveList" stripe border :header-cell-style="{background:'#336699',color:'#eef1f6'}">
      <el-table-column label="通知名称" align="center" prop="docTitle"/>
      <el-table-column label="各局办通知拟稿" align="center" prop="sendUser"/>
      <el-table-column label="发起时间" align="center" prop="sendTime"/>
      <el-table-column label="流程实例ID" align="center" prop="instanceId"/>

      <!--<el-table-column label="申请时间" align="center" prop="applyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>-->
      <!--<el-table-column label="备注" align="center" prop="docRemark"/>-->

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div v-if="scope.row.instanceId">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="detail(scope.row)"
              v-hasPermi="['workflow:leave']"
            >申请详情
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
              icon="el-icon-edit"
              @click="submitApply(scope.row)"
            >提交申请
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['workflow:leave']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['meeting:advice:delete']"
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

    <!-- 添加或修改请假流程对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>

      <el-form ref="form" :model="textForm" :rules="addRules" :inline="true" class="demo-form-inline"  label-width="120px" >
        <el-form-item label="通知名称" prop="name" >
          <el-input v-model="textForm.docTitle" placeholder="请输入通知名称"  style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="发布通知单位" prop="addValue" >
          <el-input v-model="textForm.sendCompany" placeholder="请填写发布通知单位" :disabled="true" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="接收通知人" prop="acceptCompany" >
          <el-cascader :options="deptUserList"
                       :props="{multiple: true , checkStrictly: true,value:'name',label:'type' }"
                       v-model="textForm.chargeLeaderList"
                       clearable  style="width: 100%"  @change="myChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="分管领导意见" prop="vehicleVessel" >
          <el-input v-model="textForm.vehicleVessel" :disabled="true" style="width: 100%"></el-input>
        </el-form-item>
        <!--<el-form-item label="是否归档" prop="educational" >
          <el-input v-model="textForm.educational" placeholder="请填写教育附加" style="width: 100%"></el-input>
        </el-form-item>-->

        <el-form-item label="发送时间" prop="areaCovered" v-if="readonly===false">
          <el-input style="width: 100%;margin-left: 10px" :disabled="true" v-model="textForm.sendTime" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="附件" prop="file" >
            <el-upload
              class="upload-demo"
              action="http://172.168.10.205:8082/ruoyi-admin/document/send/file"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-upload="handleBeforeUpload"
              multiple
              :limit="1"
              accept=".pdf, .doc, .docx, .xls, .xlsx"
              :on-exceed="handleExceed"
              :on-success="fileSuccess"
              :file-list="fileList"
            style="padding-left: 0">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传Excel、PDF、Word文件，且不超过10MB</div>
            </el-upload>
        </el-form-item>
        <!--<el-form-item label="公告内容" prop="docRemark" >
          <el-input type="textarea" v-model="textForm.docRemark" placeholder="请填写公告内容" style="width: 150%" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>-->

          <el-form-item label="公告内容">
            <editor v-model="textForm.docRemark" :min-height="192"/>
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


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitShowVerifyDialog" >下一步</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="30%"
      custom-class="innerDlog"
      title="请选择主管领导"
      :visible.sync="innerVisible">
      <el-form :model="innerForm" >
        <el-form-item label="主管领导" :label-width="formLabelWidth">
          <!--<el-cascader :options="deptUserList"   :props="{ value:'name',label:'type' }" v-model="innerForm.chargeLeader" :show-all-levels="false"  clearable></el-cascader>-->
          <el-cascader :options="deptUserList" collapse-tags
                       :props="{ checkStrictly: true,value:'name',label:'type' }"
                       v-model="innerForm.chargeLeader"
                       clearable >
          </el-cascader>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">

          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            style="width: 70%"
            v-model="innerForm.backups1">
          </el-input>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button type="primary" @click="submitForm">确 定</el-button>
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

    <el-dialog title="查看进度" :visible.sync="processImg" style="width: 110%">
      <ProcessImg :instanceId="instanceId"></ProcessImg>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /* import {
     listLeave,
     getLeave,
     delLeave,
     addLeave,
     updateLeave,
     exportLeave,
     submitApply,
     taskDoneList,
     taskList,
     meetList
   } from '@/api/workflow/leave'*/

  import {
    meetList,updateSend,addMeet,submitApply,taskList,getMeet,getTypeList,getlistDept,getDeptUser
  } from '@/api/document/notice';
  import {listUser} from '@/api/system/user';
  import {cancelApply, suspendOrActiveApply, showVerifyDialog, complete} from '@/api/activiti/process'
  import {calcTotalSecond, formatTotalDateSub} from '@/utils/dateUtil'
  import ApprovalHistory from '@/components/activiti/approvalHistory'
  import ProcessImg from '@/components/activiti/processImg'
  import Editor from '@/components/Editor';
  export default {
    components: {ApprovalHistory, ProcessImg,Editor},
    name: 'Notice',
    data() {
      return {
        outerVisible: false,
        innerVisible: false,
        formLabelWidth: '120px',
        fileList: [],
        nikeNames:'',
        firstSend:'',
        firstSendList:[],
        secondSend:'',
        secondSendList:[],
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
        //主管领导
        deptUserList:[],
        //流程模型
        acceptTypeList:[],
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

        formInline: {
          petitionFrom:''
        },
        //详情
        detailQuery : {
          businessKey :'',
          processKey : '',
        },
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          type: null,
          docTitle: null,
          reason: null,
          leaveStartTime: null,
          leaveEndTime: null,
          totalTime: null,
          instanceId: null,
          applyUser: null,
          applyTime: null,
          realityStartTime: null,
          realityEndTime: null,
          processKey:null,
          processParams: {},
        },
        innerForm:{
          leader:'',//领导
          backups1:'',//备注
          chargeLeader:'',//主管领导
          generalDirector:'',//综合主任
        },
        // 表单参数
        textForm: {
          docTitle:'',//标题
          sendCompany:'',//各局办通知拟稿
          // backups1:'',
          // processParams: {},
          // // peoples: [],
          // meetParticipants:'',
          // meetContent:'',
          sendNum:'',//编号
          sendUser:'',//主办科室和拟稿人
          mainDept:'',//主送
          fromDept:'',//抄送
          sendTime:'',//时间
          docRemark:'',//备注
          docAttachment:'',//附件地址
          docType:'',//流程类型
          leader:'',//领导
          chargeLeader:'',//主管领导
          generalDirector:'',//综合主任
          backups1:'',//备注
          chargeLeaderList:[],
        },

        // 表单校验
        addRules: {
          /* docTitle: [
             {required: true, message: '会议标题不能为空', trigger: 'blur'}
           ],
           /!*startAndEndTime: [
             {required: true, message: '会议时间不能为空', trigger: 'change'}
           ],*!/
           backups1: [
             { required: true, message: '负责人不能为空', trigger: 'change'}
           ],
           /!*meetParticipants: [
             {required: true, message: '参会人不能为空',}
           ],*!/
           meetContent: [
             {required: true, message: '会议主要内容不能为空', trigger: 'blur'}
           ]*/
        }
      }
    },
    created() {
      let datetime = new Date();
      let year = datetime.getFullYear();
      let month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
      let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
      let nowTime = year+'年'+month+'月'+date+'日';
      this.textForm.sendTime = nowTime;
      this.loading= false;
      // this.getLeaveList = meetList
      getTypeList().then(response => {
        if (response.code === 200) {
          this.acceptTypeList = response.data
        }
      })
      const path = this.$route.path.split('/').pop()
      this.path = path
      console.log(this.path)
      // this.getLeaveList = meetList
      if ('send' == path) {
        meetList(this.queryParams).then(res=>{
          if (res.code === 200) {
            this.leaveList = res.rows;
            this.loading = false;
          }
        })
      } else if ('todo' == path) {
        this.getLeaveList = taskList
      } else if ('done' == path) {
        this.getLeaveList = taskDoneList
      }

      this.getList()
    },
    methods: {
      myChange(val){
       /* let type =[];
        let name =[];

        for(let i=0;i<=val.length-1;i++){
          this.deptUserList.find((item)=>{ //这里的firstSendList就是数据源
            let tt = val[i].length-1;
            let mm = val[i][tt];
            if(item.name == mm){
              this.firstSendAccounts.push(item.type) //这里的value我改成了account
              this.firstSendNames.push(item.name) //这里的label我改成了name
            }
          });
        }*/
        console.log('及科技馆我我浪费的两个',val)
      },
      submitShowVerifyDialog() {
        this.innerVisible = true;
        this.readonly = false;
        getDeptUser().then(res=>{
          this.deptUserList = res;
        })

      },
      // 审批菜单控制
      showVerifyDialog(row) {
        this.showButton = true
        this.reset()
        getMeet(row.id).then(response => {
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
        /*this.getLeaveList(this.queryParams).then(response => {
          this.leaveList = response.rows
          this.total = response.total
          this.loading = false
        })*/
        meetList(this.queryParams).then(res=>{
          if (res.code === 200) {
            this.leaveList = res.rows;
            this.total = res.total
            this.loading = false;
          }
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.innerVisible = false
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
        this.textForm={
          docTitle:'',//标题
          sendCompany:'',//各局办通知拟稿
          // backups1:'',
          // processParams: {},
          // // peoples: [],
          // meetParticipants:'',
          // meetContent:'',
          sendNum:'',//编号
          sendUser:'',//主办科室和拟稿人
          mainDept:'',//主送
          fromDept:'',//抄送
          sendTime:'',//时间
          docRemark:'',//备注
          docAttachment:'',//附件地址
          docType:'',//流程类型
          leader:'',//领导
          chargeLeader:'',//主管领导
          generalDirector:'',//综合主任
          backups1:'',//备注
          chargeLeaderList:[]
        };
        this.innerForm ={
            leader:'',//领导
            backups1:'',//备注
            chargeLeader:'',//主管领导
            generalDirector:'',//综合主任
        };
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
        if(this.textForm.docType.length === 0){
          this.open = false
          this.$message({
            message: '请选择流程模型哦！',
            type: 'warning'
          });
        }else{
          this.textForm.sendCompany=localStorage.getItem("deptName");
            let datetime = new Date();
            let year = datetime.getFullYear();
            let month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
            let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
            let nowTime = year+'年'+month+'月'+date+'日';
            this.textForm.sendTime = nowTime;
            getDeptUser().then(res=>{
              this.deptUserList = res;
            });
            this.open = true
            // this.readonly = false
            this.title = '许昌市示范区拟稿';
            this.nikeNames = localStorage.getItem('nickName');
            this.textForm.sendUser = this.nikeNames;

            getlistDept().then(response => {
              if (response.code === 200) {
                this.firstSendList = response.data;
                this.secondSendList = response.data;
              }
            });
        }
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        /* getMeet(row.id).then(response => {
           this.form = response.data
           this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
           this.open = true
           this.readonly = false
           this.title = '修改请假流程'
         })*/
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
        getDeptUser().then(res=>{
          this.deptUserList = res;
        });
        this.detailQuery.businessKey = row.id;
        this.detailQuery.processKey = row.processKey;
        getMeet(this.detailQuery).then(response => {
          this.textForm = response.data
          response.data.chargeLeaderList = eval('(' + response.data.backups4 + ')');
          // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = true
          this.title = '查看详情及修改'
        })
        /*this.textForm.chargeLeaderList = [
          {
            name: "许昌魏都产业聚集区",// {name: "许昌魏都产业聚集区", type: "许昌魏都产业聚集区"},
            type: "许昌魏都产业聚集区"},
          {
            name: 'admin1',//{name: "admin1", type: "管理员1"},
            type: "管理员1"
          }
        ]*/
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      fileSuccess(response,file,fileList){
        this.textForm.docAttachment = response.fileUrl;
        console.log('上传成功之后',response)
      },
      handleBeforeUpload(file) {
        let extension = file.name.split(".")[1];
        let extensionList = ["pdf", "doc", "docx"];
        /* if (extensionList.indexOf(extension) < 0) {
           this.$message.warning("只能上传PDF、Word文件");
           return false;
         }*/
        const isLt50M = (file.size / 1024 / 1024) < 10;
        if (!isLt50M) {
          this.$message.error('上传文件大小不能超过 10MB!');
          return false;
        }
        console.log(file);
      },
      /*正文附件*/
      selectArticle(){

      },
      /** 提交按钮 */
      submitForm() {
        if(!this.textForm.chargeLeaderList){
          this.$message({
            message: '警告哦，请选择通知接收人！',
            type: 'warning'
          }).then(()=>{
            return;
          });

        }else{
          let ll = '';
          // let acceptName='';
          let acceptCompany='';
          for(let i = 0 ; i <this.textForm.chargeLeaderList.length;i++){
            if(this.textForm.chargeLeaderList[i].length!== 0){
              ll = this.textForm.chargeLeaderList[i].length;
              // acceptName = this.textForm.chargeLeaderList[i][ll-1].type + ','+ acceptName;
              acceptCompany = this.textForm.chargeLeaderList[i][ll-1] + ','+ acceptCompany;
            }
          }

          // acceptName= acceptName.substring(0,acceptName.length - 1);
          acceptCompany= acceptCompany.substring(0,acceptCompany.length - 1);
          // this.textForm.acceptName = acceptName;
          this.textForm.acceptCompany = acceptCompany;
        }
        if(this.innerForm.chargeLeader){
          let i = this.innerForm.chargeLeader.length;
          this.textForm.chargeLeader = this.innerForm.chargeLeader[i-1];
          this.textForm.backups1 = this.innerForm.backups1;
        }
        if(this.readonly === true){
          updateSend(this.textForm).then(response => {
            if (response.code === 200) {
              this.msgSuccess('提交成功')
              this.innerVisible = false;
              // this.submitShowVerifyDialog();
              this.open = false;
              this.reset();
              this.getList()
            }
          })
        }else{
          console.log('高科技公开',this.textForm)
          addMeet(this.textForm).then(response => {
            if (response.code === 200) {
              this.msgSuccess('提交成功')
              this.innerVisible = false;
              // this.submitShowVerifyDialog();
              this.open = false;
              this.reset();
              this.getList()
            }
          })
        }

      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除会议编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delLeave(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function () {
        })
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
      }
    },
    watch: {
     /* startAndEndTime: {
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
<style lang="scss" >
  .el-dialog__body {
    padding: 0px 0px;
  }
  .el-dialog__header {
    text-align: center;
  }

  .th3 {
    /*font-size: 14px;*/
    /*color: #FFFFFF;*/
    /*background-color: #000000;*/
    BORDER-RIGHT: #FF0000 0px solid; //显示右边框为1px，如果不想显示就为0px
    BORDER-TOP: #FF0000 0px solid; //显示上边框为1px，如果不想显示就为0px
    BORDER-LEFT: #FF0000 0px solid; //显示左边框为1px，如果不想显示就为0px
    BORDER-BOTTOM: #FF0000 1.5px solid; //显下右边框为1px，如果不想显示就为0px
  }

  .th1{
    BORDER-TOP: #FF0000 1.5px solid; //显示上边框为1px，如果不想显示就为0px
    BORDER-BOTTOM: #FF0000 1.5px solid; //显下右边框为1px，如果不想显示就为0px
  }
  .th31{
    BORDER-LEFT: #FF0000 1.5px solid; //显示左边框为1px，如果不想显示就为0px
  }
  .upload-demo{
    padding-left: 150px;
  }
  .innerDlog{
    /*height: 300px!important;*/
  }

 /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
   background: #F1FAFA;
   /*background: 	#F1FAFA;*/
   /*background: #A0EEE1;*/
 }

</style>
