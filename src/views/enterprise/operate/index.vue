<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px" >
      <el-form-item label="搜索类型" prop="selectType">
        <el-select v-model="queryParams.selectType" placeholder="请选择搜索类型" clearable size="small" style="width: 100%" @change="selectTypeChange">
          <el-option label="按年" value="按年"/>
          <el-option label="按月" value="按月"/>
        </el-select>
      </el-form-item>
      <el-form-item label="企业名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入企业名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item  label="开始年份" prop="stringTime" v-if="showSelectYear">
        <el-date-picker
          v-model="queryParams.startYear"
          type="year"
          value-format="yyyy"
          placeholder="选择年份" popper-class="mySelect">
        </el-date-picker>
      </el-form-item>
      <el-form-item  label="结束年份" prop="endYear" v-if="showSelectYear">
        <el-date-picker
          v-model="queryParams.endYear"
          type="year"
          value-format="yyyy"
          placeholder="选择年份"  popper-class="mySelect">
        </el-date-picker>
      </el-form-item>
      <el-form-item  label="年份" prop="stringTime" v-if="showSelectMonth">
        <el-date-picker
          v-model="queryParams.year"
          type="year"
          value-format="yyyy"
          placeholder="选择年份"  popper-class="mySelect">
        </el-date-picker>
      </el-form-item>
      <el-form-item  label="开始月份" prop="endYear" v-if="showSelectMonth" >
        <el-date-picker
          v-model="queryParams.startMonth"
          type="month"
          value-format="M"
          format="M 月"
          placeholder="选择月份"  popper-class="mySelect">
        </el-date-picker>
      </el-form-item>
      <el-form-item  label="结束月份" prop="endYear" v-if="showSelectMonth">
        <el-date-picker
          v-model="queryParams.endMonth"
          type="month"
          value-format="M"
          format="M 月"
          placeholder="选择月份"  popper-class="mySelect">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8" >
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['enterprise:operate:add']"
        >新增
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['enterprise:operate:import']">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          @click="downloadTable"
          v-hasPermi="['enterprise:operate:export']"
        >下载
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leaveList"  stripe border :header-cell-style="{background:'#336699',color:'#eef1f6'}">
      <el-table-column
        prop="name"
        align="center"
        label="企业名称">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detail(scope.row)">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="税收总额" align="center" prop="total"/>
      <el-table-column label="地方税收留成" align="center" prop="retained"/>
      <el-table-column label="统计时间" align="center" prop="timeStr"/>
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
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
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
        <div class="el-upload__tip" style="color:red" slot="tip">提示：文件大小不能超过50M！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="annexSubmit">确 定</el-button>
        <el-button @click="annexUpload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改请假流程对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="enterForm" :rules="addRules" :inline="true" class="demo-form-inline"  label-width="120px" >
        <el-form-item label="企业名称" prop="name" >
          <el-input v-model="enterForm.name" placeholder="请输入企业名称"  style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="增值税" prop="addValue" >
          <el-input v-model="enterForm.addValue" placeholder="请填写增值税" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="企业所得税" prop="corporate" >
          <el-input v-model="enterForm.corporate" placeholder="请填写企业所得税" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="个人所得税" prop="individual" >
          <el-input v-model="enterForm.individual" placeholder="请填写个人所得税" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="城市建设维护税" prop="mainten" >
          <el-input v-model="enterForm.mainten" placeholder="请填写城市建设维护税" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="土地使用税" prop="landUse" >
          <el-input v-model="enterForm.landUse" placeholder="请填写土地使用税" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="土地增值税" prop="landAdd" >
          <el-input v-model="enterForm.landAdd" placeholder="请填写土地增值税" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="房产税" prop="property" >
          <el-input v-model="enterForm.property" placeholder="请填写房产税" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="印花税" prop="stamp" >
          <el-input v-model="enterForm.stamp" placeholder="请填写印花税" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="车船税" prop="vehicleVessel" >
          <el-input v-model="enterForm.vehicleVessel" placeholder="请填写车船税" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="教育附加" prop="educational" >
          <el-input v-model="enterForm.educational" placeholder="请填写教育附加" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="地方教育附加" prop="localEducational" >
          <el-input v-model="enterForm.localEducational" placeholder="请填写教育附加" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="税收总额" prop="total" >
          <el-input v-model="enterForm.total" placeholder="请填写教育附加" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="地方税收留成" prop="retained" >
          <el-input v-model="enterForm.retained" placeholder="请填写教育附加" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="strTime">
          <el-date-picker
            v-model="enterForm.strTime"
            type="month"
            value-format="yyyy年M月"
            style="width: 85%"
          >
          </el-date-picker>
        </el-form-item>



        <!-- <el-form-item label="审批意见" prop="deptLeaderApproved" v-if="showVerify.DeptLeaderVerify">
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
         </el-form-item>-->


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitShowVerifyDialog" v-show="showButton">确 定</el-button>
        <el-button type="primary" @click="submitForm" >确 定</el-button>
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

    <el-dialog title="查看详情" :visible.sync="detailOpen" width="80%">
      <el-table v-if="detailType === 'year'"
                :data="detailTableData"
                border
                style="width: 100%">
        <el-table-column label="企业名称" align="center" prop="name"/>
        <el-table-column label="税收总额" align="center" prop="total"/>
        <el-table-column label="地方税收留成" align="center" prop="retained"/>
        <el-table-column label="统计时间" align="center" prop="timeStr"/>
      </el-table>
      <el-table v-if="detailType === 'month'"
                :data="detailTableData"
                border
                style="width: 100%">
        <el-table-column label="企业名称" align="center" prop="name"/>
        <el-table-column label="税收总额" align="center" prop="total"/>
        <el-table-column label="地方税收留成" align="center" prop="retained"/>
        <el-table-column label="增值税" align="center" prop="addValue"/>
        <el-table-column label="企业所得税" align="center" prop="corporate"/>
        <el-table-column label="个人所得税" align="center" prop="individual"/>
        <el-table-column label="城市建设维护税" align="center" prop="mainten"/>
        <el-table-column label="土地使用税" align="center" prop="landUse"/>
        <el-table-column label="土地增值税" align="center" prop="landAdd"/>
        <el-table-column label="房产税" align="center" prop="property"/>
        <el-table-column label="印花税" align="center" prop="stamp"/>
        <el-table-column label="车船税" align="center" prop="vehicleVessel"/>
        <el-table-column label="教育附加" align="center" prop="educational"/>
        <el-table-column label="地方教育附加" align="center" prop="localEducational"/>
        <el-table-column label="统计时间" align="center" prop="strTime"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['enterprise:operate:modify']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['enterprise:operate:delete']"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import {
    tableDownload,projectList,addProject,submitApply,taskList,getProjectDetail,getMonthDetail,getDataDetail,
    updateProject,delProject,exportProject,importModel,exportOutModel,importAnnexUrl,tableDownload1
  } from '@/api/enterprise/operate';
  import {listUser} from '@/api/system/user';
  import {cancelApply, suspendOrActiveApply, showVerifyDialog, complete} from '@/api/activiti/process'
  import {calcTotalSecond, formatTotalDateSub} from '@/utils/dateUtil';
  import ApprovalHistory from '@/components/activiti/approvalHistory';
  import ProcessImg from '@/components/activiti/processImg';
  import { getToken } from "@/utils/auth";

  export default {
    components: {ApprovalHistory, ProcessImg},
    name: 'Operate',
    data() {
      return {
        rowData:'',
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
          url: process.env.VUE_APP_BASE_API + "/operation/excel",
          stringTime:''
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
          url: process.env.VUE_APP_BASE_API + "/operation/excel",
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
        detailOpen:false,
        detailType:'month',
        detailTableData:[],
        //参会人
        options:[],
        peopOptions:[],
        // 查询参数
        showSelectYear:false,
        showSelectMonth:true,
        queryParams: {
          flag:null,
          selectType:'按月',
          name:null,
          year:null,
          startYear:null,
          endYear:null,
          month:null,
          startMonth:null,
          endMonth:null,
          // stringTime:null,
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
          total:'',
          retained:'',
          addValue:'',
          corporate:'',
          individual:'',
          mainten:'',
          landUse:'',
          landAdd:'',
          property:'',
          stamp:'',
          vehicleVessel:'',
          educational:'',
          localEducational:'',
          strTime:'',
          file:'',//附件
          year:'',
          month:'',
        },

        // 表单校验
        addRules: {
          name: [
            {required: true, message: '企业名称不能为空', trigger: 'blur'}
          ],
          addValue: [
            {required: true, message: '增值税不能为空', trigger: 'blur'}
          ],
          corporate: [
            {required: true, message: '企业所得税不能为空', trigger: 'blur'}
          ],
          individual: [
            {required: true, message: '个人所得税不能为空', trigger: 'blur'}
          ],
          mainten: [
            {required: true, message: '城市建设维护税不能为空', trigger: 'blur'}
          ],
          landUse: [
            {required: true, message: '土地使用税不能为空', trigger: 'blur'}
          ],
          landAdd: [
            {required: true, message: '土地增值税不能为空', trigger: 'blur'}
          ],
          property: [
            {required: true, message: '房产税不能为空', trigger: 'blur'}
          ],
          stamp: [
            {required: true, message: '印花税不能为空', trigger: 'blur'}
          ],
          vehicleVessel: [
            {required: true, message: '车船税不能为空', trigger: 'blur'}
          ],
          educational: [
            {required: true, message: '教育附加不能为空', trigger: 'blur'}
          ],
          localEducational: [
            {required: true, message: '土地增值税不能为空', trigger: 'blur'}
          ],
          enterpriseName: [
            { required: true, message: '地方教育附加不能为空', trigger: 'blur'}
          ],
          strTime: [
            { required: true, message: '记录时间不能为空', trigger: 'blur'},
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
        if(this.showSelectYear){
          if(this.queryParams.startYear === null || this.queryParams.endYear === null){
            this.$message({
              message: '请选择搜索年份！',
              type: 'warning'
            });
            return;
          }else {
            this.queryParams.year = this.queryParams.startYear + '-' + this.queryParams.endYear;
          }
        }
        if(this.showSelectMonth){
          if(this.queryParams.year === null||this.queryParams.startMonth === null || this.queryParams.endMonth === null){
            this.$message({
              message: '请选择搜索年份和月份！',
              type: 'warning'
            });
            return;
          }else {
            this.queryParams.month = this.queryParams.startMonth + '-' + this.queryParams.endMonth;
          }
        }
        this.loading = true;
        projectList(this.queryParams).then(response => {
          // this.leaveList = response.rows
          this.leaveList  = response.rows;
          this.total = response.total
          this.loading = false
        })
      },
      getList1() {
        this.loading = true;
        let  queryParams1= {
          pageNum: 1,
          pageSize: 10
        }
        projectList(queryParams1).then(response => {
          // this.leaveList = response.rows
          let list = response.rows;
          this.leaveList = list.map(function (item) {
            if (item.isRegistration === 1) {
              item.isRegistration = "已备案"
            } else if (item.isRegistration === 0) {
              item.isRegistration = "未备案"
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
          total:null,
          retained:null,
          addValue:null,
          corporate:null,
          individual:null,
          mainten:null,
          landUse:null,
          landAdd:null,
          property:null,
          stamp:null,
          vehicleVessel:null,
          educational:null,
          localEducational:null,
          strTime:null,
          file:null,//附件
          year:null,
          month:null,
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
      handleQuery1() {
        this.queryParams.pageNum = 1
        this.getList1()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams.startYear = null;
        this.queryParams.endYear = null;
        this.queryParams.year = null;
        this.queryParams.startMonth = null;
        this.queryParams.endMonth = null;
        this.resetForm('queryForm')
        this.handleQuery1()
      },
      /**下载*/
      downloadTable(data){
        if(this.showSelectYear){
          if(this.queryParams.startYear === null || this.queryParams.endYear === null){
            this.$message({
              message: '请选择搜索年份！',
              type: 'warning'
            });
            return;
          }else {
            this.queryParams.flag = 0;
            this.queryParams.year = this.queryParams.startYear + '-' + this.queryParams.endYear;
            tableDownload1(this.queryParams).then((response) => {
              this.download(response.msg)
            });;
          }
        }
        if(this.showSelectMonth){
          if(this.queryParams.year === null||this.queryParams.startMonth === null || this.queryParams.endMonth === null){
            this.$message({
              message: '请选择搜索年份和月份！',
              type: 'warning'
            });
            return;
          }else {
            this.queryParams.flag = 1;
            this.queryParams.month = this.queryParams.startMonth + '-' + this.queryParams.endMonth;
            tableDownload(this.queryParams).then((response) => {
              this.download(response.msg)
            });;
          }
        }
        // console.log('搜索天剑',this.queryParams)
        /*  tableDownload(this.queryParams).then((response) => {
            this.download(response.msg)
          });;*/
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
        this.title = '新增企业经营情况'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        getDataDetail(row.id).then(response => {
          this.enterForm = response.data
          // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.open = true
          this.readonly = true
          this.title = '修改'
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
        this.rowData = row;
        this.reset();
        let query={
          name: row.name,
          timeStr: row.timeStr
        }
        if(this.queryParams.selectType === '按年'){
          let str = row.timeStr.substr(row.timeStr.length-1,1);
          if(str !== '年'){
            this.$message({
              message: '请先按年请先搜索再查看详情！',
              type: 'warning'
            });
            return;
          }
          getProjectDetail(query).then(response => {
            this.detailTableData = response.rows
            this.detailOpen = true;
            this.detailType = 'year';
            this.title = '申请详情'
          })
        }else{
          let str = row.timeStr.substr(row.timeStr.length-1,1);
          if(str !== '月'){
            this.$message({
              message: '请先按月请先搜索再查看详情！',
              type: 'warning'
            });
            return;
          }
          getMonthDetail(query).then(response => {
            this.detailTableData = response.rows
            this.detailOpen = true;
            this.detailType = 'month';
            this.title = '申请详情'
          })
        }

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
                  // this.getList()
                  this.detail(this.rowData);
                  this.getList1();
                }
              })
            } else {
              addProject(this.enterForm).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.getList1();
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
          this.detail(this.rowData)
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
      /** 下载模板操作 */
      importTemplate() {
        /*if(this.upload.stringTime){
          let stringTime = {
            stringTime:this.upload.stringTime[0] + '-' + this.upload.stringTime[1]
        }
          exportProject(stringTime).then((response) => {
            this.download(response.msg);
          });
        }else{


        }*/
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
      },
      selectTypeChange(val){
        this.queryParams.startYear = null;
        this.queryParams.endYear = null;
        this.queryParams.year = null;
        this.queryParams.startMonth = null;
        this.queryParams.endMonth = null;
        if(val==='按年'){
          this.showSelectYear = true;
          this.showSelectMonth = false;

        }else{
          this.showSelectYear = false;
          this.showSelectMonth = true;
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
  /*/deep/.el-date-picker__header--bordered {
    margin-bottom: 0;
    padding-bottom: 12px;
    border-bottom: solid 1px #e6ebf5;
    display: none;
  }*/
</style>
<style lang="scss">
  .mySelect .el-date-picker__header--bordered {
    margin-bottom: 0;
    padding-bottom: 12px;
    border-bottom: solid 1px #e6ebf5;
    display: none;
  }
</style>
