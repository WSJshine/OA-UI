<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="noticeTitle">
        <el-input
          v-model="queryParams.noticeTitle"
          placeholder="请输入公告标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="操作人员" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入操作人员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="类型" clearable size="small">
          <el-option label="习语" value="1"/>
          <el-option label="党建" value="2"/>
          <el-option label="党章" value="3"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['party:building:add']"
        >新增</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange" stripe border :header-cell-style="{background:'#336699',color:'#eef1f6'}">
      <!--<el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="序号" type="index" align="center" prop="index" />
      <el-table-column
        label="标题"
        align="center"
        prop="title"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="类型" align="center" prop="conType" />
      <el-table-column label="创建时间" align="center" prop="backups1">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.backups1, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['party:building:modify']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleComment(scope.row)"
          >查看文章</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['party:building:delete']"
          >删除</el-button>
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

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入文章标题" ></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" placeholder="类型" clearable size="small">
              <el-option label="习语" value="1"/>
              <el-option label="党建" value="2"/>
              <el-option label="党章" value="3"/>
            </el-select>
          </el-form-item>
          <el-col :span="24">
            <el-form-item label="内容">
              <editor v-model="form.content" :min-height="192"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
<!--添加评论-->
    <el-dialog :title="commentTitle" :visible.sync="openComment" width="80%" append-to-body>
      <el-form ref="commentForm" :model="commentForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="">
              <!--<b id='myTitle' style="padding-left: 43%;"></b>-->
              <!--<p id='myContent' style="white-space: pre-wrap;line-height:30px;padding-top: 30px"></p>-->
              <b v-html="commentForm.title" style="padding-left: 90%;"></b>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="">
              <p v-html="commentForm.content" style="white-space: pre-wrap;line-height:30px;padding-right: 30px"></p>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="心得体会">
              <el-collapse v-model="activeNames" v-for="item in myComment">
                <el-collapse-item  v-if="item.toName === null"  :name="item.id" :title="item.name">
                  <div  style="width: 90%">{{item.content}}</div>
                  <div >
                    <el-link type="primary"  :underline="false" @click="deleteComment(item.id)" v-if="item.flag === 1">删除</el-link>
                  </div>
                </el-collapse-item>
                <el-collapse-item  v-else-if="item.toName !== null"  :name="item.id" :title="item.name+'回复'+item.toName">
                  <div  style="width: 90%">{{item.content}}</div>
                  <div >
                    <el-link type="primary"  :underline="false" @click="deleteComment(item.id)" v-if="item.flag === 1">删除</el-link>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="添加心得">
              <!--<editor v-model="commentForm.comment" :min-height="192"/>-->
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                maxlength="300"
                show-word-limit
                v-model="commentForm.comment">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subComment">添加心得</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listNotice, getNotice, delNotice, addNotice, updateNotice, exportNotice,getComment,delComment,addComment } from "@/api/party/propaganda";
  import Editor from '@/components/Editor';

  export default {
    name: "Propaganda",
    components: {
      Editor
    },
    data() {
      return {
        myComment:[],
        activeNames:['1'],
        commentId:'',
        commentForm:{
          comment:''
        },
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
        // 公告表格数据
        noticeList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        openComment: false,
        commentTitle:'',
        detailopen: false,
        // 类型数据字典
        statusOptions: [],
        // 状态数据字典
        typeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          noticeTitle: undefined,
          createBy: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          title: [
            { required: true, message: "文章标题不能为空", trigger: "blur" }
          ],
          type: [
            { required: true, message: "类型不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("sys_notice_status").then(response => {
        this.statusOptions = response.data;
      });
      this.getDicts("sys_notice_type").then(response => {
        this.typeOptions = response.data;
      });
    },
    methods: {
      /** 查询公告列表 */
      getList() {
        this.loading = true;
        listNotice(this.queryParams).then(response => {
          this.noticeList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 公告状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },
      // 公告状态字典翻译
      typeFormat(row, column) {
        return this.selectDictLabel(this.typeOptions, row.type);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.openComment = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          noticeId: undefined,
          noticeTitle: undefined,
          noticeType: undefined,
          type:undefined,
          noticeContent: undefined,
          status: "0"
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.noticeId)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加党建阵地";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const noticeId = row.id || this.ids
        getNotice(noticeId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改";
        });
      },//detailopen
      //查看文章
      handleComment(row) {
        this.reset();
        const noticeId = row.id || this.ids;
        getNotice(noticeId).then(response => {
          if(response.code === 200){
            this.openComment = true;
            this.commentForm = response.data;
            this.commentTitle = "详情及心得体会";
            this.getCom(noticeId);
          }
        });
        this.commentId = noticeId;
      },
      getCom(id){
        let query = {
          buildingId : id,
          size :0
        };
        getComment(query).then(res => {
          this.myComment = res.rows;
        })
      },
      // 删除评论
      deleteComment(id){
        this.$confirm('是否确认删除该评论"', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return  delComment(id);
        }).then(() => {
          this.getCom(this.commentId);
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      subComment(){
      let addCommentData={
        buildingId : this.commentId,
        content : this.commentForm.comment
      };
        addComment(addCommentData).then(response => {
          if (response.code === 200) {
            this.msgSuccess("新增成功");
            // this.open = false;
            this.getCom(this.commentId);
          }
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateNotice(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addNotice(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const noticeIds = row.id || this.ids
        this.$confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNotice(noticeIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      }
    }
  };
</script>

<style lang="scss" scoped>
  .el-link.el-link--primary {
    color: #1890ff;
    left: 95%;
  }

 /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
   background: #F1FAFA;
   /*background: 	#F1FAFA;*/
   /*background: #A0EEE1;*/
 }

</style>
