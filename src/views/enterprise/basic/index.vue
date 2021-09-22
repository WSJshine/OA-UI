<template>
  <div class="app-container">
    <el-form :model="buttonForm" ref="buttonForm" :inline="true"  label-width="68px">

      <el-row :gutter="10" class="mb8" >
        <el-col :span="1.5">
          <el-form-item>
            <el-button type="primary" size="mini" @click="beforeAdd('1')">主办科室审核</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="1.5">
          <el-form-item>
            <el-button type="primary" size="mini" @click="beforeAdd('2')">分管秘书长审核</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="1.5">
          <el-form-item>
            <el-button type="primary" size="mini" @click="beforeAdd('3')">核稿</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="1.5">
          <el-form-item>
            <el-button type="primary" size="mini" @click="beforeAdd('4')">秘书长意见</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="1.5">
          <el-form-item>
            <el-button type="primary" size="mini" @click="beforeAdd('5')">会签</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="1.5">
          <el-form-item>
            <el-button type="primary" size="mini" @click="beforeAdd('6')">签发</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="1.5">
          <el-form-item>
            <el-button type="primary" size="mini" @click="beforeAdd('111')">归档</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form :model="queryParams" ref="queryForm" :rules="addRules" :inline="true" class="demo-form-inline">
      <el-row :gutter="20">
        <el-col :span="6" :offset="1">
          <el-form-item label="发文代字" prop="sendWord" >
            <el-input
              v-model="queryParams.sendWord"
              placeholder="请输入发文代字"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="发文年号" prop="sendYear" >
            <el-input
              v-model="queryParams.sendYear"
              placeholder="请输入发文年号"
              :disabled="true"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="发文序号" prop="sendNum" >
            <el-input
              v-model="queryParams.sendNum"
              placeholder="请输入发文序号"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :offset="1">
          <el-form-item label="标题" prop="docTitle" label-width="68px">
            <el-input
              v-model="queryParams.docTitle"
              placeholder="请输入标题"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="签发人" prop="backups2" label-width="68px">
            <el-input
              v-model="queryParams.backups2"
              placeholder="请输入签发人"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="发文日期" prop="sendTime" >
            <el-input
              v-model="queryParams.sendTime"
              placeholder="请输入发文日期"
              :disabled="true"
              size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6" :offset="1">
          <el-form-item label="主办机关" prop="mainDept" >
            <el-select v-model="queryParams.mainDept"  clearable multiple collapse-tags placeholder="请选择主送机关">
              <el-option
                v-for="item in firstSendList"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="抄送机关" prop="fromDept" >
            <el-select v-model="queryParams.fromDept"   clearable multiple collapse-tags  placeholder="请选择抄送机关">
              <el-option
                v-for="item in secondSendList"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="发文单位" prop="sendCompany" >
            <el-input
              v-model="queryParams.sendCompany"
              placeholder="请输入发文单位"
              :disabled="true"
              size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6" :offset="1">
          <el-form-item label="收文单位" prop="acceptCompany" >
            <el-select v-model="queryParams.acceptCompany"  clearable multiple collapse-tags
                       placeholder="请选择" style="width:100%"
                       @change="contentChange">
              <el-option
                v-for="item in threeSendList"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12" :offset="1">
          <el-form-item label="公文备注" prop="docRemark" >
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="queryParams.docRemark" style="width: 300px">
            </el-input>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row :gutter="20">
        <el-col :span="6" :offset="1">
          <el-form-item label="添加正文" prop="docAttachment" >
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
              :on-success="docFileSuccess"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传Excel、PDF、Word文件，且不超过10MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="添加附件" prop="backups1" >
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
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传Excel、PDF、Word文件，且不超过10MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>


    <el-dialog
      width="30%"
      custom-class="innerDlog"
      :title="myTitle"
      :visible.sync="innerVisible" >
      <el-form :model="innerForm" >
        <el-form-item :label="myTitle" :label-width="formLabelWidth">
          <!--<el-cascader :options="deptUserList"   :props="{ value:'name',label:'type' }" v-model="innerForm.chargeLeader" :show-all-levels="false"  clearable></el-cascader>-->
          <el-cascader :options="deptUserList" collapse-tags
                       :props="{ checkStrictly: true,value:'name',label:'type' }"
                       v-model="innerForm.chargeLeader"
                       clearable >
          </el-cascader>
        </el-form-item>
        <el-form-item label="意见" :label-width="formLabelWidth">

          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            style="width: 70%"
            v-model="innerForm.comment">
          </el-input>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button type="primary" @click="submitForm1">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    meetList,addMeet,submitApply,taskList,getMeet,uploadFile,sendDocument1,getlistDept,getDeptUser
  } from '@/api/change/issue';
  import {listUser} from '@/api/system/user';
  import {cancelApply, suspendOrActiveApply, showVerifyDialog, complete} from '@/api/activiti/process'
  import {calcTotalSecond, formatTotalDateSub} from '@/utils/dateUtil'
  import ApprovalHistory from '@/components/activiti/approvalHistory'
  import ProcessImg from '@/components/activiti/processImg'

  export default {
    components: {ApprovalHistory, ProcessImg},
    name: 'Basic',
    data() {
      return {
        myTitle:'',
        innerVisible: false,
        innerForm:{
          comment:'',//备注
          chargeLeader:'',//主管领导
        },
        formLabelWidth: '120px',
        deptUserList:[],
        fileList: [],
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
        buttonForm:{},
        // 查询参数
        queryParams: {
          docTitle: '',//标题
          sendCompany: '',//发文单位
          acceptCompany: '',//收文单位英文
          acceptName: '',//收文单位中文
          docAttachment: '',//正文附件地址
          sendWord: '',//发文代字
          sendYear: '',//发文年号
          sendNum: '',//发文序号
          mainDept: '',//主送单位
          fromDept: '',//抄送单位
          backups1: '',//附件地址
          docRemark:'',//公文备注
          sendTime:'',//发文日期
          backups2:'',//签发人
          processParams: {
            flag:'',
            comment:'',
          },
        },
        firstSendList:[],
        secondSendList:[],
        threeSendList:[],
        firstSendAccounts:[],
        firstSendNames:[],
        // 表单参数
        form: {
          meetTitle:'',
          backups1:'',
          processParams: {},
          // peoples: [],
          meetParticipants:'',
          meetContent:''
        },

        // 表单校验
        addRules: {
          docTitle: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ],
          backups2: [
            { required: true, message: '签发人不能为空', trigger: 'blur'}
          ],
          acceptCompany: [
            {required: true, message: '请选择收文单位', trigger: 'change'}
          ],
          docAttachment: [
            {required: true, message: '正文附件不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.reset();
      let datetime = new Date();
      let year = datetime.getFullYear();
      let month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
      let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
      let nowTime = year+'年'+month+'月'+date+'日';
      this.queryParams.sendYear = year;
      this.queryParams.sendTime = nowTime;
      getlistDept().then(response => {
        if (response.code === 200) {
          this.firstSendList = response.data;
          this.secondSendList = response.data;
          this.threeSendList = response.data;
        }
      });
      this.loading= false;
      this.queryParams.sendCompany = localStorage.getItem('deptName');

      // this.getLeaveList = meetList
      /*meetList().then(response => {
        if (response.code === 200) {
          this.getLeaveList = response.list
        }
      })*/
      /*const path = this.$route.path.split('/').pop()
      this.path = path
      console.log(this.path)
      // this.getLeaveList = meetList
      if ('advice' == path) {
        this.getLeaveList = meetList
      } else if ('todo' == path) {
        this.getLeaveList = taskList
      } else if ('done' == path) {
        this.getLeaveList = taskDoneList
      }

      this.getList()*/
    },
    methods: {
      //上传文件
      upload(){

      },
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
        this.innerVisible = false;
        this.open = false
        this.dialogTableVisible = false
        this.processImg = false
        this.showButton = false
        this.reset()

      },
      // 表单重置
      reset() {
        this.innerVisible = false;
        this.fileList = [];
        this.queryParams= {
          docTitle: null,//标题
          sendCompany: null,//发文单位
          acceptCompany: null,//收文单位
          docAttachment: null,//正文附件地址
          sendWord: null,//发文代字
          sendYear: null,//发文年号
          sendNum: null,//发文序号
          mainDept: null,//主送单位
          fromDept: null,//抄送单位
          backups1: null,//附件地址
          docRemark:null,//公文备注
          sendTime:null,//发文日期
          backups2:null,//签发人
          processParams: {
            flag:'',
            comment:'',
          },
        };
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
      /*  /!** 搜索按钮操作 *!/
        handleQuery() {
          this.queryParams.pageNum = 1
          this.getList()
        },*/
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')

      },
      submitForm1(){
        this.queryParams.processParams.comment = this.innerForm.comment;
        let data = this.queryParams.processParams.flag;
        let data1= this.innerForm.chargeLeader[this.innerForm.chargeLeader.length-1];
        switch (data) {
          case '1':
            this.queryParams.processParams.mainner=data1;
            break;
          case '2':
            this.queryParams.processParams.secretaryer=data1;
            break;
          case '3':
            this.queryParams.processParams.reviewer=data1;
            break;
          case '4':
            this.queryParams.processParams.opinioner=data1;
            break;
          case '5':
            this.queryParams.processParams.signer=data1;
            break;
          case '6':
            this.queryParams.processParams.accepter=data1;
            break;
          case '111':
            this.queryParams.processParams.file=data1;
            break;
        }
        this.submitForm();
      },
      beforeAdd(data){
        getDeptUser().then(res=>{
          this.deptUserList = res;
        });
        this.innerVisible = true;
        this.queryParams.processParams.flag=data;
        switch (data) {
          case '1':
            this.queryParams.processParams.mainner='';
            this.myTitle='主办科室审核';
            break;
          case '2':
            this.queryParams.processParams.secretaryer='';
            this.myTitle='分管秘书长审核';
            break;
          case '3':
            this.queryParams.processParams.reviewer='';
            this.myTitle='核稿';
            break;
          case '4':
            this.queryParams.processParams.opinioner='';
            this.myTitle='秘书长意见';
            break;
          case '5':
            this.queryParams.processParams.signer='';
            this.myTitle='会签';
            break;
          case '6':
            this.queryParams.processParams.accepter='';
            this.myTitle='签发';
            break;
          case '111':
            this.queryParams.processParams.file='';
            this.myTitle='归档';
            break;
        }
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
        this.title = '申请会议'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        getMeet(row.id).then(response => {
          this.form = response.data
          this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = false
          this.title = '修改请假流程'
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
        getMeet(row.id).then(response => {
          this.form = response.data
          this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = true
          this.title = '申请详情'
        })
      },
      /** 提交按钮 */
      submitForm() {
        /*this.$refs['form'].validate(valid => {
         /!* let meetParticipants = '';
          for(let i = 0;i<this.form.peoples.length;i++){
            meetParticipants += this.form.peoples[i] +','
          }
          this.form.meetParticipants = meetParticipants.substring(0,meetParticipants.length-1);*!/

          addMeet(this.queryParams).then(response => {
            /!*if (response.code === 200) {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            }*!/
          })
        })*/
        if(this.queryParams.docAttachment === ''|| this.queryParams.docAttachment === null){
          this.$message.error('请选择正文文件');
          return;
        }

        let acceptName='';
        let acceptUser='';

        if(this.firstSendAccounts){
          for(let i = 0;i<this.firstSendAccounts.length;i++){
            acceptUser +=this.firstSendAccounts[i]+',';
            acceptName +=this.firstSendNames[i]+','
          }
        }
        acceptName = acceptName.substring(0, acceptName.lastIndexOf(','));//去掉最后一个逗号
        acceptUser = acceptUser.substring(0, acceptUser.lastIndexOf(','));
        this.queryParams.acceptName = acceptName;
        this.queryParams.acceptCompany = acceptUser;
        this.queryParams.sendYear = '【'+ this.queryParams.sendYear +'】';
        let mainDept = '';
        let fromDept = '';
        if(this.queryParams.mainDept){
          for(let i = 0;i<this.queryParams.mainDept.length;i++){
            mainDept +=this.queryParams.mainDept[i]+','
          }
        }
        if(this.queryParams.fromDept){
          for(let i = 0;i<this.queryParams.fromDept.length;i++){
            fromDept +=this.queryParams.fromDept[i]+','
          }
        }

        this.queryParams.mainDept = mainDept.substring(0, mainDept.lastIndexOf(','));
        this.queryParams.fromDept = fromDept.substring(0, fromDept.lastIndexOf(','));

        sendDocument1(this.queryParams).then(response => {
          if (response.code === 200) {
            this.msgSuccess('添加成功')
            this.reset();
            // this.open = false
            // this.getList()
          }
        })
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
        this.queryParams.backups1 = response.fileUrl;
        if(response.code!==200){
          this.$message.error('上传失败!');
        }
      },
      docFileSuccess(response,file,fileList){
        this.queryParams.docAttachment = response.fileUrl;
        if(response.code!==200){
          this.$message.error('上传失败!');
        }
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleBeforeUpload(file) {
        let extension = file.name.split(".")[1];
        let extensionList = ["pdf", "doc", "docx",'xls','xlsx'];
        if (extensionList.indexOf(extension) < 0) {
          this.$message.warning("只能上传Excel、PDF、Word文件");
          return false;
        }
        const isLt50M = (file.size / 1024 / 1024) < 10;
        if (!isLt50M) {
          this.$message.error('上传文件大小不能超过 10MB!');
          return false;
        }
        console.log(file);
      },
      /*contentChange1 (val) {
        this.threeSendList.find((item)=>{ //这里的firstSendList就是数据源
          if(item.deptId == val){
            this.queryParams.acceptCompany = item.deptId; //这里的value我改成了account
            this.queryParams.acceptName = item.deptName; //这里的label我改成了name
          }
        });
      },*/
      contentChange (val) {
        this.firstSendAccounts=[];
        this.firstSendNames=[];
        for(let i=0;i<=val.length-1;i++){
          this.threeSendList.find((item)=>{ //这里的firstSendList就是数据源
            if(item.deptId == val[i]){
              this.firstSendAccounts.push(item.deptId) //这里的value我改成了account
              this.firstSendNames.push(item.deptName) //这里的label我改成了name
            }
          });
        }
        console.log('多选ID',this.firstSendAccounts)
        console.log('多选name：',this.firstSendNames)
      },
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
  .app-container {
    padding: 40px;
  }
</style>
