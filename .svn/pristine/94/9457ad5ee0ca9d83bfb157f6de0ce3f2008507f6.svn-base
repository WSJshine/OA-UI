<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目名称" prop="name">
        <!--<el-select v-model="queryParams.name" placeholder="请选择项目名称" clearable size="small">
          <el-option label="请选择项目名称" value=""/>
        </el-select>-->
        <el-input
          v-model="queryParams.name"
          placeholder="请选择项目名称"
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
    <!--<el-row :gutter="10" class="mb8" >
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['meeting:advice:add']"
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
          @click="handleAdd"
          v-hasPermi="['enterprise:basic:export']"
        >下载
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>-->

    <el-table v-loading="loading" :data="leaveList">
      <el-table-column label="项目名称" align="center" prop="name"/>
      <el-table-column label="文号" align="center" prop="number"/>
      <el-table-column label="项目状态" align="center" prop="operation"/>

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
              @click="historyList(scope.row)"
              v-hasPermi="['workflow:leave']"
            >审批历史
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="showProcessImgDialog(scope.row)"
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
            >{{scope.row.operation}}
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['workflow:leave']"
            >查看进度
            </el-button>
            <!--<el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['meeting:advice:delete']"
            >删除
            </el-button>-->
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
      <el-form  :model="moreTipForm" label-width="80px" v-if="drawerDetail">
        <el-form-item label="项目名称" prop="name">
           <el-input v-model="moreTipForm.name" :disabled="true" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="项目文号" prop="number">
          <el-input v-model="moreTipForm.number" :disabled="true" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="原文件" prop="number">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="downloadText(moreTipForm.path)">{{moreTipForm.projectName}}</el-button>
          </template>
        </el-form-item>

          <el-upload ref="upload" :limit="1"  :headers="annexUpload.headers" :action="annexUpload.url + '?updateSupport=' + annexUpload.updateSupport" :disabled="annexUpload.isUploading" :on-progress="annexFileUploadProgress" :on-success="annexFileSuccess1" :auto-upload="false" drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" style="color:red" slot="tip">提示222：文件可不上传！</div>
            <div class="el-upload__tip" style="color:red" slot="tip">提示：文件大小不能超过50M！</div>
          </el-upload>

      </el-form>
      <el-upload v-else ref="upload" :limit="1"  :headers="annexUpload.headers" :action="annexUpload.url + '?updateSupport=' + annexUpload.updateSupport" :disabled="annexUpload.isUploading" :on-progress="annexFileUploadProgress" :on-success="annexFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示111：文件可不上传！</div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：文件大小不能超过50M！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="annexSubmit" v-if="drawerDetail === false">确 定</el-button>
        <el-button type="primary"  @click="annexSubmit" v-if="drawerDetail === true">确 定</el-button>
        <el-button @click="annexUpload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 环评对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
      <el-form ref="form" :model="enterForm" :rules="addRules" :inline="true" class="demo-form-inline"  label-width="220px" >
        <el-form-item label="项目名称 " prop="name" v-if="tipOneDetail">
          <el-input v-model="enterForm.name" placeholder="请输入环评审批单位 " :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="项目文号 " prop="number" v-if="tipOneDetail">
          <el-input v-model="enterForm.number" placeholder="请输入环评审批单位 " :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="环评审批单位 " prop="approvalUnit" >
          <el-input v-model="enterForm.approvalUnit" placeholder="请输入环评审批单位 "  style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="环评投资" prop="investment">
          <el-input v-model="enterForm.investment" placeholder="请输入环评投资"  style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="废水类型" prop="water" >
          <el-input v-model="enterForm.water" placeholder="请填写废水类型" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="固废类型" prop="soild" >
          <el-input v-model="enterForm.soild" placeholder="请填写固废类型" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="生态影响" prop="impact" >
          <el-input v-model="enterForm.impact" placeholder="请填写生态影响" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="废水处理措施" prop="waterMeasures" >
          <el-input v-model="enterForm.waterMeasures" placeholder="请填写废水处理措施" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="固废处理措施" prop="soildMeasures" >
          <el-input v-model="enterForm.soildMeasures" placeholder="请填写固废处理措施" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="生态影响处理措施" prop="impactMeasures" >
          <el-input v-model="enterForm.impactMeasures" placeholder="请填写生态影响处理措施" style="width: 100%"></el-input>
        </el-form-item>

        <el-form-item label="附件" prop="file" >
          <el-upload style="width: 100%" ref="upload" :limit="1"  :headers="annexUpload.headers" :action="annexUpload.url + '?updateSupport=' + annexUpload.updateSupport" :disabled="annexUpload.isUploading" :on-progress="annexFileUploadProgress" :on-success="annexFileSuccess" :auto-upload="false" >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="annexSubmit">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
          </el-upload>
        </el-form-item>
        <el-form-item prop="eiaEnclosure" label="原附件" align="center" v-if="tipOneDetail">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="downloadText(enterForm.eiaEnclosure)">{{enterForm.eiaEnclosure}}</el-button>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-show="readonly">确 定</el-button>
        <el-button type="primary" @click="submitForm" v-show=!readonly&&!showButton>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 控规对话框 -->
    <el-dialog :title="title" :visible.sync="tipTwoOpen" width="70%" append-to-body>
      <el-form ref="form" :model="tipTwoForm" :rules="addRules" :inline="true" class="demo-form-inline"  label-width="220px" >
        <el-form-item label="项目名称 " prop="name" v-if="tipOneDetail">
          <el-input v-model="tipTwoForm.name" placeholder="请输入环评审批单位 " :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="项目文号 " prop="number" v-if="tipOneDetail">
          <el-input v-model="tipTwoForm.number" placeholder="请输入环评审批单位 " :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="建筑面积 " prop="builtArea" >
          <el-input v-model="tipTwoForm.builtArea" placeholder="请输入建筑面积"  style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="用地性质" prop="nature">
          <el-input v-model="tipTwoForm.nature" placeholder="请输入用地性质"  style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="建筑层数" prop="buildingFloors" >
          <el-input v-model="tipTwoForm.buildingFloors" placeholder="请填写建筑层数" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="建筑密度" prop="density" >
          <el-input v-model="tipTwoForm.density" placeholder="请填写建筑密度" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="建筑高度" prop="height" >
          <el-input v-model="tipTwoForm.height" placeholder="请填写建筑高度" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="投资强度" prop="strength" >
          <el-input v-model="tipTwoForm.strength" placeholder="请填写投资强度" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="行业分类" prop="type" >
          <el-input v-model="tipTwoForm.type" placeholder="请填写行业分类" style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="file" >
          <el-upload style="width: 100%" ref="upload" :limit="1"  :headers="annexUpload.headers" :action="annexUpload.url + '?updateSupport=' + annexUpload.updateSupport" :disabled="annexUpload.isUploading" :on-progress="annexFileUploadProgress" :on-success="annexFileSuccess" :auto-upload="false" >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="annexSubmit">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
          </el-upload>
        </el-form-item>
        <el-form-item prop="eiaEnclosure" label="原附件" align="center" v-if="tipTwoDetail">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="downloadText(tipTwoForm.enclosure)">{{tipTwoForm.enclosure}}</el-button>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTwoForm" v-show="readonly">确 定</el-button>
        <el-button type="primary" @click="submitTwoForm" v-show=!readonly&&!showButton>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--查看进度-->
    <el-drawer
      title="我是标题"
      direction="ttb"
      :visible.sync="drawer"
      size="12%"
      :with-header="false">
      <el-steps :space="200" :active="drawerTip" finish-status="success" style="padding-left: 100px;padding-top: 30px">
        <el-step
          v-for="(item,index) of stepTitle"
          :key="index"
          :title="item"
          @click.native="handleStep(index)"
        />
      </el-steps>
    </el-drawer>

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
    getDrawerDetail,fileDownload,projectList,addProject,addTipTwo,submitApply,taskList,getProjectDetail,getTipTwoDetail,updateProject,updateTipTwo,delProject,exportProject,importModel,exportOutModel,importAnnexUrl
  } from '@/api/project/engine';
  import {listUser} from '@/api/system/user';
  import {cancelApply, suspendOrActiveApply, showVerifyDialog, complete} from '@/api/activiti/process'
  import {calcTotalSecond, formatTotalDateSub} from '@/utils/dateUtil';
  import ApprovalHistory from '@/components/activiti/approvalHistory';
  import ProcessImg from '@/components/activiti/processImg';
  import { getToken } from "@/utils/auth";

  export default {
    components: {ApprovalHistory, ProcessImg},
    name: 'Engine',
    data() {
      return {
        tipOneDetail:false,
        tipTwoDetail:false,
        drawerDetail:false,

        drawer: false,
        drawerRowId:'',//查看进度那一行的ID
        drawerTip:'',//走的第几步了
        moreTipForm:{
          id:'',
          name:'',
          number:'',
          path:'',
          projectName:''
        },
        viewIndex:'',
        stepTitle:['环评','控规','获取土地证','土地组卷','土地出让','修规','获取用地规划许可证','获取工程许可证','获取施工许可证','验收','完成'],
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
          flag:'',
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
          url: process.env.VUE_APP_BASE_API + "/engineer/file",
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
        tipTwoOpen: false,
        //参会人
        options:[],
        peopOptions:[],
        // 查询参数
        queryParams: {
          name:null,
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
          engineerId:'',
          name:'',
          number:'',
          approvalUnit:'',
          investment:'',
          water:'',
          soild:'',
          impact:'',
          waterMeasures:'',
          soildMeasures:'',
          impactMeasures:'',
          eiaEnclosure:'',
          file:'',//附件
        },
        tipTwoForm:{
          engineerId:'',
          name:'',
          number:'',
          builtArea:'',
          nature:'',
          buildingFloors:'',
          density:'',
          height:'',
          strength:'',
          type:'',
          enclosure:'',
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
          engineerId:null,
          name:null,
          number:null,
          approvalUnit:null,
          investment:null,
          water:null,
          soild:null,
          impact:null,
          waterMeasures:null,
          soildMeasures:null,
          impactMeasures:null,
          eiaEnclosure:null,
          file:null,//附件
        },
        this.tipTwoForm = {
          engineerId:null,
          name:null,
          number:null,
          builtArea:null,
          nature:null,
          buildingFloors:null,
          density:null,
          height:null,
          strength:null,
          type:null,
          enclosure:null,
        },
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
      /** 查看进度操作 */
      handleUpdate(row) {

        this.drawer = true;
        this.drawerRowId = row.id;
        this.drawerTip = row.flag;
        // this.annexUpload.flag = row.flag;

      },
      handleStep(index){
        console.log('第几个',index);
        this.viewIndex = index;
        this.reset()
        let data={
          id:this.drawerRowId
        }
        if(this.drawerTip !== 0){
            if(index === 0){
              getProjectDetail(data).then(response => {
                this.enterForm = response.data
                this.tipOneDetail = true;

                // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
                this.open = true
                this.readonly = true
                this.title = '环评信息详情及修改'
              })
            }else if(index === 1){
              getTipTwoDetail(data).then(response => {
                this.tipTwoForm = response.data
                this.tipTwoDetail = true;
                // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
                this.tipTwoOpen = true
                this.readonly = true
                this.title = '控规信息详情及修改'
              })
            }
        }

        if(index > 1){

          let url = '';
          switch (index) {
            case 2:
              url = '/engineer/getLand/'
              break;
            case 3:
              url = '/engineer/getVolume/'
              break;
            case 4:
              url = '/engineer/getTransfer/'
              break;
            case 5:
              url = '/engineer/getRepair/'
              break;
            case 6:
            url = '/engineer/getLandUse/'
              break;
            case 7:
            url = '/engineer/getPermit/'
              break;
            case 8:
            url = '/engineer/getConstruct/'
              break;
            case 9:
              url = '/engineer/getCheck/'
              break;
          }
          getDrawerDetail(url,this.drawerRowId).then(response => {
           /* this.drawerDetail.name = response.name;
            this.projectNum = response.number;
            this.projectFile = response.langEnclosure;*/

// 截取最后一个/之后的
            var name=response.data.path.substring(response.data.path.lastIndexOf("/")+1);
            this.moreTipForm = response.data;
            this.moreTipForm.projectName = name;
            this.drawerDetail = true;
            this.annexUpload.open = true;
          })

        }

      },
      submitApply(row) {
        this.drawerDetail = false;
        this.annexUpload.flag = row.flag;
        this.drawerTip = row.flag;
        if(row.flag === 0){
          this.enterForm.engineerId = row.id;
          this.open = true;
        }
        if(row.flag === 1){
          this.tipTwoForm.engineerId = row.id;
          this.tipTwoOpen = true;
        }
        if(row.flag >1){
          this.annexUpload.id = row.id;
          this.annexUpload.title = "上传附件";
          this.annexUpload.open = true;
        }


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
              console.log('回来客户就是的浪费',this.enterForm)
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
        })
      },
      submitTwoForm(){
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.tipTwoForm.id != null) {
              updateTipTwo(this.tipTwoForm).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.tipTwoOpen = false
                  this.getList()
                }
              })
            } else {
              addTipTwo(this.tipTwoForm).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.tipTwoOpen = false
                  this.getList()
                }
              })
            }
          }
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
      // 表格里附件上传成功处理
      annexFileSuccess(response, file, fileList) {
        let data={
          id: this.annexUpload.id,
          file : response.fileUrl
        }
        let updata={
          id:this.moreTipForm.id,
          file : response.fileUrl
        }
        console.log('发的鬼地方',response,this.viewIndex,this.drawerTip);
        if(this.viewIndex === 0){
          this.enterForm.eiaEnclosure = response.fileUrl;
        }else if(this.viewIndex === 1){
          this.tipTwoForm.enclosure = response.fileUrl;
        }

        let url = ''
        /*if(this.drawerDetail === true){
          this.drawerTip= this.drawerTip-1;
        }*/
        switch (this.drawerTip) {
          case 0:
            this.enterForm.eiaEnclosure = response.fileUrl;
            console.log('hdflksf骷髅精灵',this.enterForm)
            break;
          case 1:
            // url = '/engineer/plan';
            this.tipTwoForm.enclosure = response.fileUrl;
            break;
          case 2:
            url = '/engineer/land';
            break;
          case 3:
            url = '/engineer/volume';
            break;
          case 4:
            url = '/engineer/transfer';
            break;
          case 5:
            url = '/engineer/repair';
            break;
          case 6:
            url = '/engineer/landUse';
            break;
          case 7:
            url = '/engineer/permit';
            break;
          case 8:
            url = '/engineer/construct';
            break;
          case 9:
            url = '/engineer/check';
            break;
        }
        if(this.drawerTip > 1){
          if(this.drawerDetail === true){
            importAnnexUrl(updata,url).then((response) => {
              this.annexUpload.open = false;
              this.annexUpload.isUploading = false;
              this.$refs.upload.clearFiles();
              this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
              this.getList();
            });
          }else{
            importAnnexUrl(data,url).then((response) => {
              this.annexUpload.open = false;
              this.annexUpload.isUploading = false;
              this.$refs.upload.clearFiles();
              this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
              this.getList();
            });
          }


        }

      },
      //修改时附件上传成功
      annexFileSuccess1(response, file, fileList) {
        let data={
          id: this.annexUpload.id,
          file : response.fileUrl
        }
        let updata={
          id: this.moreTipForm.id,
          file : response.fileUrl
        }

        console.log('发的鬼地方',response,this.viewIndex,this.drawerTip);
        if(this.viewIndex === 0){
          this.enterForm.eiaEnclosure = response.fileUrl;
        }else if(this.viewIndex === 1){
          this.tipTwoForm.enclosure = response.fileUrl;
        }

        let url = ''
        /*if(this.drawerDetail === true){
          this.drawerTip= this.drawerTip-1;
        }*/
        switch (this.viewIndex) {
          case 0:
            this.enterForm.eiaEnclosure = response.fileUrl;
            console.log('hdflksf骷髅精灵',this.enterForm)
            break;
          case 1:
            // url = '/engineer/plan';
            this.tipTwoForm.enclosure = response.fileUrl;
            break;
          case 2:
            url = '/engineer/land';
            break;
          case 3:
            url = '/engineer/volume';
            break;
          case 4:
            url = '/engineer/transfer';
            break;
          case 5:
            updata={
              id:this.moreTipForm.id,
              enclosure : response.fileUrl
            }
            url = '/engineer/modifyRepair';
            break;
          case 6:
            url = '/engineer/landUse';
            break;
          case 7:
            url = '/engineer/permit';
            break;
          case 8:
            url = '/engineer/construct';
            break;
          case 9:
            url = '/engineer/check';
            break;
        }
        if(this.drawerTip > 1){
          if(this.drawerDetail === true){
            importAnnexUrl(updata,url).then((response) => {
              this.annexUpload.open = false;
              this.annexUpload.isUploading = false;
              this.$refs.upload.clearFiles();
              this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
              this.getList();
            });
          }else{
            importAnnexUrl(data,url).then((response) => {
              this.annexUpload.open = false;
              this.annexUpload.isUploading = false;
              this.$refs.upload.clearFiles();
              this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
              this.getList();
            });
          }


        }

      },
      //附件上传
      annexSubmit(){
        this.$refs.upload.submit();
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
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
