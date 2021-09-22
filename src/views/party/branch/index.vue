<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="branchType" placeholder="请输入党支部类型" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
          <el-form-item label="企业名称" prop="enterprise">
            <el-input v-model="queryParams.enterprise" placeholder="请输入企业名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="党支部名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入党支部名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="党支部书记" prop="secretary">
            <el-input v-model="queryParams.secretary" placeholder="请输入党支部书记" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['party:branch:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['party:branch:import']">导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange" stripe border :header-cell-style="{background:'#336699',color:'#eef1f6'}">
          <el-table-column label="党支部名称" align="center" prop="name"/>
          <el-table-column label="企业名" align="center" prop="enterprise"/>
          <el-table-column label="党员人数" align="center" prop="number"/>
          <el-table-column label="办公电话" align="center" prop="phone"/>
          <el-table-column label="党支部书记" align="center" prop="secretary"/>
          <el-table-column label="党支部类型" align="center" prop="branchType"/>
          <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button  size="mini" type="text" icon="el-icon-delete" @click="handleMember(scope.row)" >添加党员</el-button>
              <el-button  size="mini" type="text" icon="el-icon-delete" @click="handleAccount(scope.row)" v-if="scope.row.account===''">添加账户</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['party:branch:modify']">修改</el-button>
              <el-button  size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['party:branch:delete']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="党支部名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入党支部名称" ></el-input>
        </el-form-item>
        <el-form-item label="企业名" prop="enterprise">
          <!--<el-select v-model="form.enterprise1" placeholder="请选择" @change="contentChange">
            <el-option
              v-for="item in enterpriseList"
              :key="item.id"
              :label="item.enterpriseName"
              :value="item.id">
            </el-option>
          </el-select>-->
          <el-select v-model="form.enterprise1"  clearable multiple collapse-tags placeholder="请选择" >
            <el-option
              v-for="item in enterpriseList"
              :key="item.id"
              :label="item.enterpriseName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="党支部类型" prop="branchType">
          <el-select v-model="form.branchType" placeholder="请选择" @change="contentChange1">
            <el-option
              v-for="item in branchOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="办公电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入办公电话" ></el-input>
        </el-form-item>
        <el-form-item label="党支部书记" prop="secretary">
          <el-input v-model="form.secretary" placeholder="请输入党支部书记"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--添加账户-->
    <el-dialog :title="title" :visible.sync="accountOpen" width="600px" append-to-body>
      <el-form ref="form" :model="accountForm" :rules="rules" label-width="80px">
        <el-form-item label="账户名" prop="enterprise">
          <el-select v-model="accountForm.userName" placeholder="请选择">
            <el-option
              v-for="item in accountList"
              :key="item.userName"
              :label="item.nickName"
              :value="item.userName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAccount">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--添加党员-->
    <el-dialog :title="title" :visible.sync="memberOpen" width="600px" append-to-body>
      <el-form ref="memberForm" :model="memberForm"  label-width="80px">
        <el-form-item label="党员名称" prop="enterprise">
          <el-select v-model="memberForm.enterprise"  clearable multiple collapse-tags placeholder="请选择" >
            <el-option
              v-for="item in memberList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMember">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listUser,
    getUser,
    delUser,
    addUser,
    updateUser,
    addAccount,
    addMember,
    exportUser,
    resetUserPwd,
    changeUserStatus,
    importTemplate,
    getlistPrise,
    getMemberList,
    getAccountList,
  } from "@/api/party/branch";
  import { getToken } from "@/utils/auth";
  import { treeselect1 } from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  export default {
    components: { Treeselect },
    name: "Branch",
    data() {
      return {
        enterpriseList:[],
        memberList:[],
        accountList:[],
        enterpriseId:'',
        enterpriseName:'',
        branchOptions:[
          {
            value: '2',
            label: '党委'
          },{
            value: '3',
            label: '党总支'
          },{
            value: '4',
            label: '联合支部'
          },
        ],
        branchValue:'',
        branchLabel:'',
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
        // 用户表格数据
        userList: null,
        // 弹出层标题
        title: "",
        // 部门树选项
        deptOptions: undefined,
        // 是否显示弹出层
        open: false,
        memberOpen:false,
        accountOpen:false,
        accountAddId:'',
        // 部门名称
        branchType:undefined,
        // 默认密码
        initPassword: undefined,
        // 日期范围
        dateRange: [],
        // 状态数据字典
        statusOptions: [],
        // 性别状态字典
        sexOptions: [],
        // 岗位选项
        postOptions: [],
        // 角色选项
        roleOptions: [],
        // 表单参数
        form: {

        },
        fId:'',
        accountForm:{
          userName:'',
          id:''
        },
        memberForm:{
          enterprise:'',
          id:'',
          ids:''
        },
        defaultProps: {
          children: "children",
          label: "label",
        },
        // 用户导入参数
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
          url: process.env.VUE_APP_BASE_API + "/party/branch/import",
        },
        // 查询参数
        queryParams: {
          fId:undefined,
          pageNum: 1,
          pageSize: 10,
          name: undefined,
          enterprise: undefined,
          secretary: undefined,
          id: undefined,
        },
        // 表单校验
        rules: {
          userName: [
            { required: true, message: "用户名称不能为空", trigger: "blur" },
          ],
          nickName: [
            { required: true, message: "用户昵称不能为空", trigger: "blur" },
          ],
          deptId: [
            { required: true, message: "归属部门不能为空", trigger: "blur" },
          ],
          password: [
            { required: true, message: "用户密码不能为空", trigger: "blur" },
          ],
          email: [
            { required: true, message: "邮箱地址不能为空", trigger: "blur" },
            {
              type: "email",
              message: "'请输入正确的邮箱地址",
              trigger: ["blur", "change"],
            },
          ],
          phonenumber: [
            { required: true, message: "手机号码不能为空", trigger: "blur" },
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur",
            },
          ],
        },
      };
    },
    watch: {
      // 根据名称筛选部门树
      branchType(val) {
        this.$refs.tree.filter(val);
      },

    },
    created() {
      this.getList();
      this.getTreeselect();
      this.getDicts("sys_normal_disable").then((response) => {
        this.statusOptions = response.data;
      });
      this.getDicts("sys_user_sex").then((response) => {
        this.sexOptions = response.data;
      });
      this.getConfigKey("sys.user.initPassword").then((response) => {
        this.initPassword = response.msg;
      });
    },
    methods: {
      /** 查询用户列表 */
      getList() {
        this.loading = true;
        listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
          (response) => {
            this.userList = response.rows;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselect1().then((response) => {
          this.deptOptions = response.data;
        });
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点单击事件
      handleNodeClick(data) {
        this.queryParams.fId = data.id;
        this.getList();
      },
      // 用户状态修改
      handleStatusChange(row) {
        let text = row.status === "0" ? "启用" : "停用";
        this.$confirm(
          '确认要"' + text + '""' + row.userName + '"用户吗?',
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(function () {
            return changeUserStatus(row.id, row.status);
          })
          .then(() => {
            this.msgSuccess(text + "成功");
          })
          .catch(function () {
            row.status = row.status === "0" ? "1" : "0";
          });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          userId: undefined,
          deptId: undefined,
          userName: undefined,
          nickName: undefined,
          password: undefined,
          phonenumber: undefined,
          email: undefined,
          sex: undefined,
          status: "0",
          remark: undefined,
          postIds: [],
          roleIds: [],
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.page = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map((item) => item.userId);
        this.single = selection.length != 1;
        this.multiple = !selection.length;
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.getTreeselect();
        getlistPrise().then(response => {
          if (response.code === 200) {

            this.enterpriseList = response.rows;
          }
        });
        this.open = true;
        this.title = "添加党支部";
        /*getUser().then((response) => {
          this.postOptions = response.posts;
          this.roleOptions = response.roles;
          this.open = true;
          this.title = "添加用户";
          this.form.password = this.initPassword;
        });*/
      },
      contentChange (val) {
        this.enterpriseId = '';
        this.enterpriseName = '';
        this.enterpriseList.find((item)=>{ //这里的firstSendList就是数据源
          if(item.id == val){
            this.enterpriseId = item.id; //这里的value我改成了account
            this.enterpriseName = item.enterpriseName; //这里的label我改成了name
          }
        });
      },
      contentChange1 (val) {
        this.branchValue = '';
        this.branchLabel = '';
        this.branchOptions.find((item)=>{ //这里的firstSendList就是数据源
          if(item.value == val){
            this.branchValue = item.value; //这里的value我改成了account
            this.branchLabel = item.label; //这里的label我改成了name
          }
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.getTreeselect();
        const userId = row.id || this.ids;
        getlistPrise().then(response => {
          if (response.code === 200) {

            this.enterpriseList = response.rows;
          }
        });
        getUser(userId).then((response) => {
          this.form = response.data
          this.open = true
          this.fId = response.data.fId
          this.title = '修改党支部信息'
        });
      },
      handleMember(row) {
        this.reset();
        this.getTreeselect();
        this.memberOpen = true;
        this.memberForm.id = row.id;
        // const userId = row.id || this.ids;
        getMemberList().then(response => {
          if (response.code === 200) {
            this.memberList = response.rows;
          }
        });
      },
      handleAccount(row) {
        this.reset();
        this.getTreeselect();
        this.accountOpen = true
        this.accountForm.id = row.id;
        // const userId = row.id || this.ids;
        getAccountList().then(response => {
          if (response.code === 200) {
            this.accountList = response.rows;
          }
        });
        /*addAccount(userId).then((response) => {
          this.form = response.data


          this.title = '修改党支部信息'
          /!*this.form = response.data;
          this.postOptions = response.posts;
          this.roleOptions = response.roles;
          this.form.postIds = response.postIds;
          this.form.roleIds = response.roleIds;
          this.open = true;
          this.title = "修改用户";
          this.form.password = "";*!/
        });*/
      },
      /** 添加党员提交 */
      submitMember(){
        if(this.memberForm.enterprise === '' || this.memberForm.enterprise.length === 0){
          this.$message({
            message: '请选择要添加的党员哦！',
            type: 'warning'
          });
        }else{
          let ids = '';
          for(let i = 0; i<this.memberForm.enterprise.length;i++){
            ids += this.memberForm.enterprise[i] + ','
          }
          ids = ids.substring(0, ids.lastIndexOf(','));
          this.memberForm.ids = ids;
          addMember(this.memberForm).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.memberOpen = false;
              this.getList();
            }
          });
        }
      },
      /*添加账号*/
      submitAccount(){
        if(this.accountForm.userName === '' || this.accountForm.userName.length === 0){
          this.$message({
            message: '请选择要添加的账号哦！',
            type: 'warning'
          });
        }else{
          addAccount(this.accountForm).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("添加成功");
              this.accountOpen = false;
              this.getList();
            }
          });
        }
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate((valid) => {//enterprise
          // this.form.fId = this.branchValue;
          this.form.branchType = this.branchLabel;
          // this.form.enterpriseId = this.enterpriseId;
          // this.form.enterprise = this.enterpriseName;
          let enterIds=''
          if(this.form.enterprise1.length !== 0){
            for(let i = 0; i<this.form.enterprise1.length;i++){
              enterIds += this.form.enterprise1[i] + ','
            }
          }
          enterIds = enterIds.substring(0, enterIds.lastIndexOf(','));
          this.form.enterIds = enterIds;
          if(this.branchValue === ''){
            this.form.fId = this.fId;
          }else{
              if(this.branchValue === this.fId){
                this.form.fId = this.fId;
              }else{
                this.form.fId = this.branchValue;
              }
          }


          if (valid) {
            if (this.form.id != undefined) {
              updateUser(this.form).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addUser(this.form).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              });
            }
          }
        });
        treeselect1().then((response) => {
          this.deptOptions = response.data;
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const userIds = row.id || this.ids;
        this.$confirm(
          '是否确认删除用户编号为"' + userIds + '"的数据项?',
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(function () {
            return delUser(userIds);
          })
          .then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
          .catch(function () {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm("是否确认导出所有用户数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return exportUser(queryParams);
          })
          .then((response) => {
            this.download(response.msg);
          })
          .catch(function () {});
      },
      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = "导入";
        this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
        importTemplate().then((response) => {
          this.download(response.msg);
        });
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
    },
  };
</script>
<style lang="scss" scoped>
  /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #F1FAFA;
    /*background: 	#F1FAFA;*/
    /*background: #A0EEE1;*/
  }
</style>
