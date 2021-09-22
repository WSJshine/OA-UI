<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="栏目类型" prop="noticeType">
        <el-select v-model="queryParams.type" placeholder="栏目类型" clearable size="small">
          <el-option label="园区动态" value="1"/>
          <el-option label="企业信息" value="3"/>
          <el-option label="项目招商" value="4"/>
        </el-select>
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
          v-hasPermi="['website:column']"
        >新增
        </el-button>
        <span style="margin-left: 20px">请选择栏目类型</span>
        <el-select v-model="textForm.type"   clearable   placeholder="请选择栏目类型" style="margin-left: 10px">
          <el-option label="园区动态" value="1"/>
          <el-option label="企业信息" value="3"/>
          <el-option label="项目招商" value="4"/>
        </el-select>
      </el-col>

      <!--<el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['system:user:import']">导入</el-button>
      </el-col>-->
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="primary"-->
          <!--size="mini"-->
          <!--@click="handleAdd"-->
          <!--v-hasPermi="['enterprise:basic:export']"-->
        <!--&gt;下载-->
        <!--</el-button>-->
      <!--</el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="websiteList" stripe border :header-cell-style="{background:'#336699',color:'#eef1f6'}">
      <el-table-column label="文章标题" align="center" prop="title"/>
      <el-table-column label="文章类型" align="center" prop="columnType"/>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="文章简介" align="center" prop="introduce"/>-->
      <!--<el-table-column prop="enclosure" label="附件" align="center" >-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="text" size="small" @click="downloadText(scope.row.enclosure)">{{scope.row.enclosure}}</el-button>-->
          <!--&lt;!&ndash;<a href="www.baidu.com">点击</a>&ndash;&gt;-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="detail(scope.row)"
            >查看文章
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['website:column']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['website:column']"
            >删除
            </el-button>
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
    <!--<el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>-->
      <!--<el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>-->
        <!--<i class="el-icon-upload"></i>-->
        <!--<div class="el-upload__text">-->
          <!--将文件拖到此处，或-->
          <!--<em>点击上传</em>-->
        <!--</div>-->
        <!--<div class="el-upload__tip" slot="tip">-->
          <!--&lt;!&ndash;<el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据&ndash;&gt;-->
          <!--<el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>-->
        <!--</div>-->
        <!--<div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>-->
      <!--</el-upload>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button type="primary" @click="submitFileForm">确 定</el-button>-->
        <!--<el-button @click="upload.open = false">取 消</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->

    <!--上传附件-->
    <!--<el-dialog :title="annexUpload.title" :visible.sync="annexUpload.open" width="400px" append-to-body>-->
      <!--<el-upload ref="upload" :limit="1"  :headers="annexUpload.headers" :action="annexUpload.url + '?updateSupport=' + annexUpload.updateSupport" :disabled="annexUpload.isUploading" :on-progress="annexFileUploadProgress" :on-success="annexFileSuccess" :auto-upload="false" drag>-->
        <!--<i class="el-icon-upload"></i>-->
        <!--<div class="el-upload__text">-->
          <!--将文件拖到此处，或-->
          <!--<em>点击上传</em>-->
        <!--</div>-->
        <!--&lt;!&ndash;<div class="el-upload__tip" slot="tip">-->
          <!--&lt;!&ndash;<el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据&ndash;&gt;-->
          <!--<el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>-->
        <!--</div>&ndash;&gt;-->
        <!--<div class="el-upload__tip" style="color:red" slot="tip">提示：文件大小不能超过50M！</div>-->
      <!--</el-upload>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button type="primary" @click="annexSubmit">确 定</el-button>-->
        <!--<el-button @click="annexUpload.open = false">取 消</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->

    <!-- 添加或修改请假流程对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="enterForm" :rules="addRules" class="demo-form-inline"  label-width="100px" >
        <el-form-item label="文章标题" prop="title" >
          <el-input v-model="enterForm.title" placeholder="请输入文章标题" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="简述" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入文章简述"
            v-model="enterForm.remark" :disabled=readonly>
          </el-input>
        </el-form-item>
        <el-col :span="24">
          <el-form-item label="内容">
            <editor v-model="enterForm.content" :min-height="192"/>
          </el-form-item>
        </el-col>
        <!--<el-form-item label="项目文号" prop="number" >-->
          <!--<el-input v-model="enterForm.number" placeholder="请填写项目文号" style="width: 100%"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="合同名称" prop="cName" >-->
          <!--<el-input v-model="enterForm.cName" placeholder="请填写建设性质" style="width: 100%"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="commentTitle" :visible.sync="openComment" width="80%" append-to-body>
      <el-form ref="enterForm" :model="enterForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="">
              <!--{{enterForm.title}}-->
              <b v-html="enterForm.title" style="padding-left: 90%;"></b>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="">
              <!--<span v-html="enterForm.content"></span>-->
              <p v-html="enterForm.content" class="myHtml" style="white-space: pre-wrap;line-height:30px;padding-right: 30px"></p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    websiteList,addWebsite,getWebsiteDetail,
    updateWebsite,delWebsite,importAnnexUrl,fileDownload
  } from '@/api/website/portal';
  import { getToken } from "@/utils/auth";
  import Editor from '@/components/Editor';
  export default {
    name: 'Portal',
    components: {
      Editor
    },
    data() {
      return {
        // 路径
        path: '',
        // 查询方法
        getWebsiteList: null,
        textForm: {
          type:'',//流程类型
        },
        // 请假时长
        formatDateSub: '',
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
        websiteList: [],
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
          pageNum: 1,
          pageSize: 10,
          type: null,
          title: null,
          applyTime: null,
        },
        openComment: false,
        commentTitle:'',
        detailopen: false,
        // 表单参数
        enterForm: {
          title:'',
          type:'',
          remark:'',
          content:'',
          name:'',
          number:'',
          cName:'',
          introduce:'',
          file:'',//附件
          id:'',
        },

        // 表单校验
        addRules: {
          name: [
            {required: true, message: '文章名称不能为空', trigger: 'blur'}
          ],
          /*startAndEndTime: [
            {required: true, message: '会议时间不能为空', trigger: 'change'}
          ],*/
          // content: [
          //   { required: true, message: '文章内容不能为空', trigger: 'blur'}
          // ],
          /*meetParticipants: [
            {required: true, message: '参会人不能为空',}
          ],*/
          content: [
            {required: true, message: '文章主要内容不能为空', trigger: 'blur'}
          ]
        },
        rules:{}
      }
    },
    created() {
      this.loading= false;
      websiteList(this.queryParams).then(response => {
        this.total = response.total;
        this.websiteList = response.rows;
        this.loading = false
      })

    },
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true
        websiteList(this.queryParams).then(response => {
          this.websiteList = response.rows;
          this.total = response.total
          this.loading = false
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.openComment = false
        this.reset()

      },
      // 表单重置
      reset() {
        this.enterForm = {
          type : null,
          title : null,
          content : null,
          name:null,
          number:null,
          cName:null,
          introduce:null,
          file:null,//附件
          id:null,
        }
        this.resetForm('enterForm')
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
        if(this.textForm.type.length === 0){
          this.open = false
          this.$message({
            message: '请选择栏目类型哦！',
            type: 'warning'
          });
        }else {
          this.reset()
          this.open = true
          this.readonly = false
          this.enterForm.type = this.textForm.type;
          console.log(this.textForm.type)
          this.title = '新增'
        }



      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        getWebsiteDetail(row.id).then(response => {
          this.enterForm = response.data
          this.open = true
          this.readonly = false
          this.title = '修改'
        })
      },

      /** 表单数据展示 */
      detail(row) {
        this.reset()
        getWebsiteDetail(row.id).then(response => {
          this.openComment = true;
          this.enterForm = response.data;
          this.commentTitle = "查看文章";
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.enterForm.id != null) {
              updateWebsite(this.enterForm).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                }
              })
            } else {
              addWebsite(this.enterForm).then(response => {
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
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id
        this.$confirm('是否确认删除项目名称为"' + row.title + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delWebsite(ids)
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
      // handleImport() {
      //   this.upload.title = "导入";
      //   this.upload.open = true;
      // },
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
      /**下载附件*/
      downloadText(data){
        fileDownload(data);
      },
      // /** 下载模板操作 */
      // importTemplate() {
      //   exportProject().then((response) => {
      //     this.download(response.msg);
      //   });
      // },
      // /** 导出按钮操作 */
      // handleExport() {
      //   const queryParams = this.queryParams
      //   this.$confirm('是否确认导出所有请假流程数据项?', '警告', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(function () {
      //     return exportOutModel(queryParams)
      //   }).then(response => {
      //     this.download(response.msg)
      //   }).catch(function () {
      //   })
      // },
      // handleSelectChange(val) {
      //   this.$forceUpdate()
      // }
    },
    watch: {
    }
  }

</script>
<style>
  .myHtml  >.ql-align-center>img{
    width: 100%;
  }
</style>
