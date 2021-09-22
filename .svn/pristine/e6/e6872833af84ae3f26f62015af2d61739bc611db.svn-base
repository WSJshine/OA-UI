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
      <el-form-item label="企业名称" prop="enterpriseName">
        <el-input
          v-model="queryParams.enterpriseName"
          placeholder="请输入建设单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="建设性质" prop="nature">
        <el-select v-model="queryParams.nature" placeholder="请选择建设性质" clearable size="small">
          <el-option label="前期" value="前期"/>
          <el-option label="在建" value="在建"/>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime" >
        <el-date-picker
          v-model="queryParams.startTime"
          type="datetime"
          value-format="yyyy-MM-dd"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="queryParams.endTime"
          type="datetime"
          value-format="yyyy-MM-dd"
          placeholder="选择日期时间">

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
          v-hasPermi="['project:message:add']"
        >新增
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['project:message:import']">导入</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leaveList"  border stripe :header-cell-style="{background:'#336699',color:'#eef1f6'}" >
      <el-table-column
        prop="name"
        align="center"
        label="项目名称">
        <template slot-scope="scope">
          <!--<el-button type="text" size="small" @click="goLink(scope.row)">{{scope.row.name}}</el-button>-->
          <el-button type="text" size="small"  @click="handleUpdate(scope.row)">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>

      <el-table-column
        prop="name"
        align="center"
        label="企业名称">
        <template slot-scope="scope" >
          <el-button type="text" size="small" @click="companyDetail(scope.row)">{{scope.row.enterpriseName}}</el-button>
        </template>
      </el-table-column>

      <el-table-column label="建设性质" align="center" prop="nature"/>
      <el-table-column label="联系人" align="center" prop="contacts"/>
      <el-table-column label="联系电话" align="center" prop="phone"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  v-if="isAdmin">
        <template slot-scope="scope">
          <div v-if="scope.row.instanceId">
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
            <!--<el-button
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
            </el-button>-->
            <!-- <el-button
               size="mini"
               type="text"
               icon="el-icon-edit"
               @click="handleUpdate(scope.row)"
               v-hasPermi="['project:message:modify']"
             >修改
             </el-button>-->
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
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="enterForm" :rules="addRules"  label-width="100px" style="width: 95%;padding-left: 2%">
        <el-row >
          <el-col :span="8">
            <el-form-item label="项目名称" prop="name" >
              <el-input v-model="enterForm.name" placeholder="请输入项目名称" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="企业名称" prop="enterpriseName">
              <el-input v-model="enterForm.enterpriseName" placeholder="请输入企业名称" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="立项文号" prop="number" >
              <el-input v-model="enterForm.number" placeholder="请填写立项文号" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="建设性质" prop="nature" >
              <el-input v-model="enterForm.nature" placeholder="请填写建设性质" disabled style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="选址" prop="siteSelect" >
              <el-input v-model="enterForm.siteSelect" placeholder="请填写选址" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人" prop="contacts" >
              <el-input v-model="enterForm.contacts" placeholder="请填写联系人" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="phone" >
              <el-input v-model="enterForm.phone" placeholder="请填写联系电话" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="占地面积" prop="areaCovered" >
              <el-input v-model="enterForm.areaCovered" placeholder="请填写占地面积" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划总投资" prop="investment" >
              <el-input v-model="enterForm.investment" placeholder="请填写计划总投资" :disabled=readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目建设内容" prop="fillingBasis" >
              <el-input type="textarea" v-model="enterForm.fillingBasis" placeholder="请填写备案依据" :disabled=readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

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


    <!--需求变更-- 详情及修改抽屉-->
    <el-drawer
      title="我是标题"
      :visible.sync="DetailDrawer"
      :with-header="false" size='60%' :before-close="handleClose">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="margin-left: 40px;margin-top: 30px">
        <el-tab-pane label="项目信息" name="first">
          <el-form ref="form" :model="enterForm" :rules="addRules"   label-width="180px" >
            <el-row>
                <el-col :span="12">
                  <el-form-item label="项目名称：" prop="name" >
                    <el-input v-if="isDetailEdit"  v-model="enterForm.name" placeholder="请输入项目名称" :disabled=readonly style="width: 100%"></el-input>
                    <span v-else>{{enterForm.name}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="企业名称：" prop="enterpriseName">
                    <el-input v-if="isDetailEdit" v-model="enterForm.enterpriseName" placeholder="请输入企业名称" :disabled=readonly style="width: 100%"></el-input>
                    <span v-else>{{enterForm.enterpriseName}}</span>
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="立项文号：" prop="number" >
                  <el-input v-if="isDetailEdit" v-model="enterForm.number" placeholder="请填写立项文号" :disabled=readonly style="width: 100%"></el-input>
                  <span v-else>{{enterForm.number}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="建设性质：" prop="nature" >
                  <!--<el-input v-if="isDetailEdit" v-model="enterForm.nature" placeholder="请填写建设性质" :disabled=readonly style="width: 100%"></el-input>-->
                  <el-select v-if="isDetailEdit" v-model="enterForm.nature" placeholder="请选择">
                    <el-option
                      v-for="item in natureOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <span v-else>{{enterForm.nature}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="选址：" prop="siteSelect" >
                  <el-input v-if="isDetailEdit" v-model="enterForm.siteSelect" placeholder="请填写选址" :disabled=readonly style="width: 100%"></el-input>
                  <span v-else>{{enterForm.siteSelect}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人：" prop="contacts" >
                  <el-input v-if="isDetailEdit" v-model="enterForm.contacts" placeholder="请填写联系人" :disabled=readonly style="width: 100%"></el-input>
                  <span v-else>{{enterForm.contacts}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系电话：" prop="phone" >
                  <el-input v-if="isDetailEdit" v-model="enterForm.phone" placeholder="请填写联系电话" :disabled=readonly style="width: 100%"></el-input>
                  <span v-else>{{enterForm.phone}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="占地面积：" prop="areaCovered" >
                  <el-input v-if="isDetailEdit" v-model="enterForm.areaCovered" placeholder="请填写占地面积" :disabled=readonly style="width: 100%"></el-input>
                  <span v-else>{{enterForm.areaCovered}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="计划总投资：" prop="investment" >
                  <el-input v-if="isDetailEdit" v-model="enterForm.investment" placeholder="请填写计划总投资" :disabled=readonly style="width: 100%"></el-input>
                  <span v-else>{{enterForm.investment}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="项目建设内容：" prop="fillingBasis" >
                  <el-input type="textarea" v-if="isDetailEdit" v-model="enterForm.fillingBasis" placeholder="请填写项目建设内容" :disabled=readonly style="width: 100%"></el-input>
                  <span v-else>{{enterForm.fillingBasis}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div  class="dialog-footer">
            <!--<el-button type="primary" @click="submitShowVerifyDialog" v-show="showButton">确 定</el-button>-->
            <el-button type="primary" v-if="isDetailEdit" @click="submitForm" >确 定</el-button>
            <el-button type="primary" v-else @click="isDetailEdit = true" >修 改</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second" :disabled="twoTab">
          <el-scrollbar :style="{height: scrollHeight}" ref="myScrollbar">
          <el-timeline style="overflow:auto" class="myTimeLine" >
            <el-timeline-item timestamp="立项" placement="top">
              <el-card >
                <el-form ref="form" :model="projectForm" label-width="80px" size="mini">
                  <el-form-item label="是否立项">
                    <el-radio-group v-model="projectForm.isApproval" size="medium">
                      <el-radio  label="是" value="是">是</el-radio>
                      <el-radio  label="否" value="否">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="立项说明">
                    <el-input type="textarea" v-model="projectForm.approvalExplain"></el-input>
                  </el-form-item>
                  <el-form-item label="立项时间">
                      <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="projectForm.approvalTime" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="原附件" v-if="projectForm.approvalEnclosureName">
                      <el-button type="text" @click="downloadText(projectForm.approvalEnclosure)" >{{projectForm.approvalEnclosureName}}</el-button>
                  </el-form-item>
                  <el-form-item label="立项附件">
                    <el-upload style="width: 100%" ref="projectUpload" :limit="1"
                               :headers="projectUpload.headers"
                               :action="projectUpload.url + '?updateSupport=' + projectUpload.updateSupport"
                               :disabled="projectUpload.isUploading" :on-progress="annexFileUploadProgress1"
                               :on-success="annexFileSuccess" :auto-upload="false" >
                      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="projectFileSubmit1">上传到服务器</el-button>
                      <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="环评" placement="top">
              <el-card @click.native="myOneCilck">
                <el-form ref="form" :model="projectForm" label-width="80px" size="mini">
                  <el-form-item label="是否环评">
                    <el-radio-group v-model="projectForm.isEia " size="medium">
                      <el-radio  label="是" value="是" :disabled="isProject">是</el-radio>
                      <el-radio  label="否" value="否" :disabled="isProject">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="环评说明">
                    <el-input type="textarea" v-model="projectForm.eiaExplain" :disabled="isProject"></el-input>
                  </el-form-item>
                  <el-form-item label="环评时间">
                    <el-date-picker type="date" value-format="yyyy-MM-dd" :disabled="isProject" placeholder="选择日期" v-model="projectForm.eiaTime" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="原附件" v-if="projectForm.eiaEnclosureName">
                    <el-button type="text" @click="downloadText(projectForm.eiaEnclosure)">{{projectForm.eiaEnclosureName}}</el-button>
                  </el-form-item>
                  <el-form-item label="环评附件">
                    <el-upload style="width: 100%" ref="annexUpload" :limit="1"
                               :headers="annexUpload.headers"
                               :action="annexUpload.url + '?updateSupport=' + annexUpload.updateSupport"
                               :disabled="annexUpload.isUploading" :on-progress="annexFileUploadProgress"
                               :on-success="environmentFileSucess" :auto-upload="false" >
                      <el-button slot="trigger" size="small" type="primary" :disabled="isProject">选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="projectFileSubmit" :disabled="isProject">上传到服务器</el-button>
                      <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-timeline-item>
           <el-timeline-item timestamp="控规" placement="top">
              <el-card @click.native="myOneCilck">
                <el-form ref="form" :model="projectForm" label-width="80px" size="mini">
                  <el-form-item label="是否控规">
                    <el-radio-group v-model="projectForm.isPlan" size="medium">
                      <el-radio  label="是" value="是" :disabled="isProject">是</el-radio>
                      <el-radio  label="否" value="否" :disabled="isProject">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="控规说明">
                    <el-input type="textarea" :disabled="isProject" v-model="projectForm.planExplain"></el-input>
                  </el-form-item>
                  <el-form-item label="控规时间">
                    <el-date-picker type="date" value-format="yyyy-MM-dd" :disabled="isProject" placeholder="选择日期" v-model="projectForm.planTime" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="原附件" v-if="projectForm.planEnclosureName">
                    <el-button type="text" @click="downloadText(projectForm.planEnclosure)">{{projectForm.planEnclosureName}}</el-button>
                  </el-form-item>
                  <el-form-item label="控规附件">
                    <el-upload style="width: 100%" ref="explainUpload" :limit="1"
                               :headers="explainUpload.headers"
                               :action="explainUpload.url + '?updateSupport=' + explainUpload.updateSupport"
                               :disabled="explainUpload.isUploading" :on-progress="explainUploadProgress"
                               :on-success="controlFileSucess" :auto-upload="false" >
                      <el-button slot="trigger" size="small" type="primary" :disabled="isProject" >选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="explainFilrSubmit" :disabled="isProject" >上传到服务器</el-button>
                      <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-timeline-item>
           <el-timeline-item timestamp="修规" placement="top">
              <el-card @click.native="myOneCilck">
                <el-form ref="form" :model="projectForm" label-width="80px" size="mini">
                  <el-form-item label="是否修规">
                    <el-radio-group v-model="projectForm.isRevision " size="medium">
                      <el-radio  label="是" value="是"  :disabled="isProject">是</el-radio>
                      <el-radio  label="否" value="否"  :disabled="isProject">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="修规说明">
                    <el-input type="textarea" :disabled="isProject" v-model="projectForm.revisionExplain "></el-input>
                  </el-form-item>
                  <el-form-item label="修规时间">
                    <el-date-picker type="date" value-format="yyyy-MM-dd" :disabled="isProject" placeholder="选择日期" v-model="projectForm.revisionTime " style="width: 100%;"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="原附件" v-if="projectForm.revisionEnclosureName">
                    <el-button type="text" @click="downloadText(projectForm.revisionEnclosure)">{{projectForm.revisionEnclosureName}}</el-button>
                  </el-form-item>
                  <el-form-item label="修规附件">
                    <el-upload style="width: 100%" ref="revisionUpload" :limit="1"
                               :headers="revisionUpload.headers"
                               :action="revisionUpload.url + '?updateSupport=' + revisionUpload.updateSupport"
                               :disabled="revisionUpload.isUploading" :on-progress="revisionUploadProgress"
                               :on-success="changeControlFileSucess" :auto-upload="false" >
                      <el-button slot="trigger" size="small" type="primary" :disabled="isProject" >选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="revisionFileSubmit" :disabled="isProject" >上传到服务器</el-button>
                      <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-timeline-item>
             <el-timeline-item timestamp="土地组卷" placement="top">
              <el-card @click.native="myTwoClick">
                <el-form ref="form" :model="projectForm" label-width="80px" size="mini">
                  <el-form-item label="是否完成">
                    <el-radio-group v-model="projectForm.isVolume" size="medium">
                      <el-radio  label="是" value="是" :disabled="isLand">是</el-radio>
                      <el-radio  label="否" value="否" :disabled="isLand">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="土地组卷说明">
                    <el-input type="textarea" :disabled="isLand" v-model="projectForm.volumeExplain  "></el-input>
                  </el-form-item>
                  <el-form-item label="土地组卷完成时间">
                    <el-date-picker type="date" value-format="yyyy-MM-dd" :disabled="isLand" placeholder="选择日期" v-model="projectForm.vloumeTime  " style="width: 100%;"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="原附件" v-if="projectForm.volumeEnclosureName">
                    <el-button type="text" @click="downloadText(projectForm.volumeEnclosure)">{{projectForm.volumeEnclosureName}}</el-button>
                  </el-form-item>
                  <el-form-item label="土地组卷附件">
                    <el-upload style="width: 100%" ref="landUpload" :limit="1"
                               :headers="landUpload.headers"
                               :action="landUpload.url + '?updateSupport=' + landUpload.updateSupport"
                               :disabled="landUpload.isUploading" :on-progress="landUploadProgress"
                               :on-success="landGroupFileSucess" :auto-upload="false" >
                      <el-button slot="trigger" size="small" type="primary"  :disabled="isLand">选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="landFileSubmit"  :disabled="isLand">上传到服务器</el-button>
                      <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="土地出让" placement="top">
              <el-card @click.native="myTwoClick">
                <el-form ref="form" :model="projectForm" label-width="80px" size="mini">
                  <el-form-item label="是否完成">
                    <el-radio-group v-model="projectForm.isTransfer " size="medium">
                      <el-radio  label="是" value="是" :disabled="isLand">是</el-radio>
                      <el-radio  label="否" value="否" :disabled="isLand">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="土地出让说明">
                    <el-input type="textarea" :disabled="isLand" v-model="projectForm.transferExplain "></el-input>
                  </el-form-item>
                  <el-form-item label="土地出让完成时间">
                    <el-date-picker type="date" value-format="yyyy-MM-dd" :disabled="isLand" placeholder="选择日期" v-model="projectForm.transferTime " style="width: 100%;"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="原附件" v-if="projectForm.transferEnclosureName">
                    <el-button type="text" @click="downloadText(projectForm.transferEnclosure)">{{projectForm.transferEnclosureName}}</el-button>
                  </el-form-item>
                  <el-form-item label="土地出让附件">
                    <el-upload style="width: 100%" ref="transferUpload" :limit="1"
                               :headers="transferUpload.headers"
                               :action="transferUpload.url + '?updateSupport=' + transferUpload.updateSupport"
                               :disabled="transferUpload.isUploading" :on-progress="transferUploadProgress"
                               :on-success="landChangeFileSucess" :auto-upload="false" >
                      <el-button slot="trigger" size="small" type="primary"  :disabled="isLand">选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="transferFileSubmit"  :disabled="isLand">上传到服务器</el-button>
                      <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-timeline-item>
             <el-timeline-item timestamp="用地规划许可" placement="top">
              <el-card @click.native="myThreeClick">
                <el-form ref="form" :model="projectForm" label-width="80px" size="mini">
                  <el-form-item label="是否完成">
                    <el-radio-group v-model="projectForm.isUse  " size="medium">
                      <el-radio  label="是" value="是" :disabled="isuseLand">是</el-radio>
                      <el-radio  label="否" value="否" :disabled="isuseLand">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="用地规划说明">
                    <el-input type="textarea" :disabled="isuseLand" v-model="projectForm.useExplain "></el-input>
                  </el-form-item>
                  <el-form-item label="用地规划完成时间">
                    <el-date-picker type="date" value-format="yyyy-MM-dd" :disabled="isuseLand" placeholder="选择日期" v-model="projectForm.useTime  " style="width: 100%;"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="原附件" v-if="projectForm.useEnclosureName">
                    <el-button type="text" @click="downloadText(projectForm.useEnclosure)">{{projectForm.useEnclosureName}}</el-button>
                  </el-form-item>
                  <el-form-item label="用地规划附件">
                    <el-upload style="width: 100%" ref="useLandUpload" :limit="1"
                               :headers="useLandUpload.headers"
                               :action="useLandUpload.url + '?updateSupport=' + useLandUpload.updateSupport"
                               :disabled="useLandUpload.isUploading" :on-progress="useLandUploadProgress"
                               :on-success="userLandFileSucess" :auto-upload="false" >
                      <el-button slot="trigger" size="small" type="primary" :disabled="isuseLand">选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="useLandFileSubmit" :disabled="isuseLand">上传到服务器</el-button>
                      <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-timeline-item>
           <el-timeline-item timestamp="工程许可" placement="top">
              <el-card @click.native="myThreeClick">
                <el-form ref="form" :model="projectForm" label-width="80px" size="mini">
                  <el-form-item label="是否完成">
                    <el-radio-group v-model="projectForm.isPermit " size="medium">
                      <el-radio  value="1" :disabled="isuseLand">是</el-radio>
                      <el-radio  value="0" :disabled="isuseLand">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="工程许可说明">
                    <el-input type="textarea" :disabled="isuseLand" v-model="projectForm.permitExplain "></el-input>
                  </el-form-item>
                  <el-form-item label="工程许可完成时间">
                    <el-date-picker type="date" value-format="yyyy-MM-dd" :disabled="isuseLand" placeholder="选择日期" v-model="projectForm.permitTime " style="width: 100%;"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="原附件" v-if="projectForm.permitEnclosureName">
                    <el-button type="text" @click="downloadText(projectForm.permitEnclosure)">{{projectForm.permitEnclosureName}}</el-button>
                  </el-form-item>
                  <el-form-item label="工程许可附件">
                    <el-upload style="width: 100%" ref="permitUpload" :limit="1"
                               :headers="permitUpload.headers"
                               :action="permitUpload.url + '?updateSupport=' + permitUpload.updateSupport"
                               :disabled="permitUpload.isUploading" :on-progress="permitUploadProgress"
                               :on-success="enginePermitFileSucess" :auto-upload="false" >
                      <el-button slot="trigger" size="small" type="primary" :disabled="isuseLand">选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="permitSubmit" :disabled="isuseLand">上传到服务器</el-button>
                      <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="施工许可" placement="top">
              <el-card @click.native="myThreeClick">
                <el-form ref="form" :model="projectForm" label-width="80px" size="mini">
                  <el-form-item label="是否完成">
                    <el-radio-group v-model="projectForm.isConstruction  " size="medium">
                      <el-radio  value="1" :disabled="isuseLand">是</el-radio>
                      <el-radio  value="0" :disabled="isuseLand">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="施工许可说明">
                    <el-input type="textarea" :disabled="isuseLand" v-model="projectForm.constructionExplain "></el-input>
                  </el-form-item>
                  <el-form-item label="施工许可完成时间">
                    <el-date-picker type="date" value-format="yyyy-MM-dd" :disabled="isuseLand" placeholder="选择日期" v-model="projectForm.constructionTime  " style="width: 100%;"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="原附件" v-if="projectForm.constructionEnclosureName">
                    <el-button type="text" @click="downloadText(projectForm.constructionEnclosure)">{{projectForm.constructionEnclosureName}}</el-button>
                  </el-form-item>
                  <el-form-item label="施工许可附件">
                    <el-upload style="width: 100%" ref="constUpload" :limit="1"
                               :headers="constUpload.headers"
                               :action="constUpload.url + '?updateSupport=' + constUpload.updateSupport"
                               :disabled="constUpload.isUploading" :on-progress="constUploadProgress"
                               :on-success="constructionFileSucess" :auto-upload="false" >
                      <el-button slot="trigger" size="small" type="primary" :disabled="isuseLand">选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="constSubmit" :disabled="isuseLand">上传到服务器</el-button>
                      <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-timeline-item>
             <el-timeline-item timestamp="开工" placement="top">
              <el-card @click.native="myFourClick">
                <el-form ref="form" :model="projectForm" label-width="80px" size="mini">
                  <el-form-item label="是否完成">
                    <el-radio-group v-model="projectForm.isStart " size="medium">
                      <el-radio  value="1" :disabled="isStart">是</el-radio>
                      <el-radio  value="0" :disabled="isStart">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="开工说明">
                    <el-input type="textarea" :disabled="isStart" v-model="projectForm.startExplain "></el-input>
                  </el-form-item>
                  <el-form-item label="开工时间">
                    <el-date-picker type="date" value-format="yyyy-MM-dd" :disabled="isStart" placeholder="选择日期" v-model="projectForm.startTime   " style="width: 100%;"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="原附件" v-if="projectForm.startEnclosureName">
                    <el-button type="text" @click="downloadText(projectForm.startEnclosure)">{{projectForm.startEnclosureName}}</el-button>
                  </el-form-item>
                  <el-form-item label="开工附件">
                    <el-upload style="width: 100%" ref="startUpload" :limit="1"
                               :headers="startUpload.headers"
                               :action="startUpload.url + '?updateSupport=' + startUpload.updateSupport"
                               :disabled="startUpload.isUploading" :on-progress="startUploadProgress"
                               :on-success="startFileSucess" :auto-upload="false" >
                      <el-button slot="trigger" size="small" type="primary" :disabled="isStart">选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="startSubmit" :disabled="isStart">上传到服务器</el-button>
                      <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="完工" placement="top">
              <el-card @click.native="myFiveClick">
                <el-form ref="form" :model="projectForm" label-width="80px" size="mini">
                  <el-form-item label="是否完成">
                    <el-radio-group v-model="projectForm.isFinish  " size="medium">
                      <el-radio  value="1" :disabled="isFinish">是</el-radio>
                      <el-radio  value="0" :disabled="isFinish">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="完工说明">
                    <el-input type="textarea" :disabled="isFinish" v-model="projectForm.finishExplain    "></el-input>
                  </el-form-item>
                  <el-form-item label="完工时间">
                    <el-date-picker type="date" value-format="yyyy-MM-dd" :disabled="isFinish" placeholder="选择日期" v-model="projectForm.finishTime    " style="width: 100%;"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="原附件" v-if="projectForm.finishEnclosureName">
                    <el-button type="text" @click="downloadText(projectForm.finishEnclosure)">{{projectForm.finishEnclosureName}}</el-button>
                  </el-form-item>
                  <el-form-item label="完工附件">
                    <el-upload style="width: 100%" ref="finishUpload" :limit="1"
                               :headers="finishUpload.headers"
                               :action="finishUpload.url + '?updateSupport=' + finishUpload.updateSupport"
                               :disabled="finishUpload.isUploading" :on-progress="finishUploadProgress"
                               :on-success="finishFileSucess" :auto-upload="false" >
                      <el-button slot="trigger" size="small" type="primary"  :disabled="isFinish">选取文件</el-button>
                      <el-button style="margin-left: 10px;" size="small" type="success" @click="finishSubmit"  :disabled="isFinish">上传到服务器</el-button>
                      <div slot="tip" class="el-upload__tip">文件大小不超过50M</div>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-timeline-item>
          </el-timeline>
            <el-button type="primary" @click="submit">修改</el-button>
            <!--<el-button>取消</el-button>-->
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>

    <!--需求更改-->
    <el-dialog :title="title" :visible.sync="companyOpen" width="800px" append-to-body>
      <el-form ref="form" :model="enterForm" :rules="addRules" :inline="true" class="demo-form-inline"  label-width="150px" >
        <el-form-item label="企业名称" prop="name" >
          <el-input v-model="enterForm.name" placeholder="请输入企业名称" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="code">
          <el-input v-model="enterForm.code" placeholder="请输入统一社会信用代码" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="企业性质" prop="enterpriseNature" >
          <el-input v-model="enterForm.enterpriseNature" placeholder="请填写企业性质" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="企业人数" prop="num" >
          <el-input v-model="enterForm.num" placeholder="请填写企业人数" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="占地面积" prop="areaCovered" >
          <el-input v-model="enterForm.areaCovered" placeholder="请填写占地面积" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="土地性质" prop="nature" >
          <el-input v-model="enterForm.nature" placeholder="请填写土地性质" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="法定负责人" prop="legalPerson" >
          <el-input v-model="enterForm.legalPerson" placeholder="请填写法定负责人" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="法定负责人联系方式" prop="legalPho" >
          <el-input v-model="enterForm.legalPho" placeholder="请填写法定负责人联系方式" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="财务负责人" prop="financePerson" >
          <el-input v-model="enterForm.financePerson" placeholder="请填写财务负责人" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="财务负责人联系方式" prop="financePho" >
          <el-input v-model="enterForm.financePho" placeholder="请填写财务负责人联系方式" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="所属片区" prop="area" >
          <el-input v-model="enterForm.area" placeholder="请填写所属片区" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="所属网络" prop="grid" >
          <el-input v-model="enterForm.grid" placeholder="请填写所属网络" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="分包人员" prop="subcontract" >
          <el-input v-model="enterForm.subcontract" placeholder="请填写分包人员" :disabled=readonly style="width: 100%"></el-input>
         <!-- <el-cascader :options="deptUserList"  v-else  :show-all-levels="false"
                       :props="{ checkStrictly: true,value:'name',label:'type' }"
                       v-model="enterForm.ups2"
                       clearable  @change="subcontractChange" ref="myCascader">
          </el-cascader>-->
        </el-form-item>
        <el-form-item label="税收所属分局及街道" prop="branchStreet" >
          <el-input v-model="enterForm.branchStreet" placeholder="请填写税收所属分局及街道" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="主要产能" prop="capacity" >
          <el-input v-model="enterForm.capacity" placeholder="请填写主要产能" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="主要销售地" prop="placeSale" >
          <el-input v-model="enterForm.placeSale" placeholder="请填写主要销售地" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="税收总额" prop="total" >
          <el-input v-model="enterForm.total" placeholder="请填写税收总额" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="地方财政收入" prop="revenue" >
          <el-input v-model="enterForm.revenue" placeholder="请填写地方财政收入" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="产值" prop="output" >
          <el-input v-model="enterForm.output" placeholder="请填写产值" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="营业收入" prop="business" >
          <el-input v-model="enterForm.business" placeholder="请填写营业收入" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="利润" prop="profit" >
          <el-input v-model="enterForm.profit" placeholder="请填写利润" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="从业人员" prop="employees" >
          <el-input v-model="enterForm.employees" placeholder="请填写从业人员" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>
        <el-form-item label="变压器容量" prop="transformer" >
          <el-input v-model="enterForm.transformer" placeholder="请填写变压器容量" :disabled=readonly style="width: 100%"></el-input>
        </el-form-item>



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
  </div>
</template>

<script>
  import {
    tableDownload,record,fileDownload,projectList,addProject,submitApply,taskList,getProjectDetail,updateProject,delProject,exportProject,importModel,exportOutModel,importAnnexUrl,
    importEngineer,getDetailEngineer,afterUpload,getEnterDetail
  } from '@/api/project/messageInfo';
  import {listUser} from '@/api/system/user';
  import {cancelApply, suspendOrActiveApply, showVerifyDialog, complete} from '@/api/activiti/process';
  import {calcTotalSecond, formatTotalDateSub} from '@/utils/dateUtil';
  import ApprovalHistory from '@/components/activiti/approvalHistory';
  import ProcessImg from '@/components/activiti/processImg';
  import { getToken } from "@/utils/auth";

  export default {
    components: {ApprovalHistory, ProcessImg},
    name: 'MessageInfo',
    data() {
      return {
        isAdmin:false,
        companyOpen:false,
        engineerId:'',
        isProject:true,
        isLand:true,
        isuseLand:true,
        isStart:true,
        isFinish:true,
        projectForm:{
          isApproval :'',
          isEia:'',
          isPlan:'',
          isRevision:'',
          isVolume:'',
          isTransfer:'',
          isUse:'',
          isPermit:'',
          isConstruction:'',
          isStart:'',
          isFinish:''
        },
        scrollHeight:'',
        radio:'',
        DetailDrawer: false,
        twoTab:true,
        isDetailEdit:false,
        activeName: 'first',
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
          url: process.env.VUE_APP_BASE_API + "/engineer/file",
        },
        projectUpload: {
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
        explainUpload: {
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
        revisionUpload: {
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
        landUpload: {
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
        transferUpload: {
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
        useLandUpload: {
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
        permitUpload: {
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
        constUpload:{
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
        startUpload:{
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
        finishUpload:{
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
        //参会人
        options:[],
        natureOption:[{
          value: '前期',
          label: '前期'
        }, {
          value: '在建',
          label: '在建'
        },],
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
          realityEndTime: null,
          startTime:null,
          endTime:null
        },
        detailId:'',
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
      if(localStorage.getItem("userName") === 'admin'){
        this.isAdmin = true;
      }
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
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'one-row';
        } else if (rowIndex === 2) {
          return 'two-row';
        } else if (rowIndex === 3) {
          return 'three-row';
        } else if (rowIndex === 4) {
          return 'four-row';
        } else if (rowIndex === 5) {
          return 'five-row';
        } else if (rowIndex === 6) {
          return 'six-row';
        } else if (rowIndex === 7) {
          return 'seven-row';
        } else if (rowIndex === 8) {
          return 'eight-row';
        } else if (rowIndex === 9) {
          return 'nine-row';
        } else if (rowIndex === 10) {
          return 'ten-row';
        }
        return '';
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
        this.enterForm.nature = '前期';
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
        this.detailId = row.id;
        getProjectDetail(this.detailId).then(response => {
          this.enterForm = response.data
          // this.open = true
          this.readonly = false
          // this.title = '修改'
          this.DetailDrawer = true;
          if(response.data.nature === '在建'){
            this.twoTab = false;
          }else{
            this.twoTab = true;
          }
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
      handleClick(tab, event) {
        console.log('会尽快哈',tab.index);
        if(tab.index === '1'){
          if(this.twoTab === true){
            this.$message({
              message: '请先将本项目改为在建！',
              type: 'warning'
            });
            return;
          }else{
            this.scrollHeight = window.innerHeight*0.9 + 'px';
            getDetailEngineer(this.detailId).then(res=>{
              this.engineerId = res.data.id;
              this.projectForm = res.data;
              if(res.data.approvalEnclosure !== ''  && res.data.approvalEnclosure !== null){
                 this.projectForm.approvalEnclosureName = res.data.approvalEnclosure.substring(res.data.approvalEnclosure.lastIndexOf("/")+1);
              }
              if(res.data.eiaEnclosure  !== '' && res.data.eiaEnclosure !== null){
                this.projectForm.eiaEnclosureName = res.data.eiaEnclosure.substring(res.data.eiaEnclosure.lastIndexOf("/")+1);
              }
              if(res.data.planEnclosure  !== '' && res.data.planEnclosure !== null){
                this.projectForm.planEnclosureName = res.data.planEnclosure.substring(res.data.planEnclosure.lastIndexOf("/")+1);
              }
              if(res.data.revisionEnclosure !== '' && res.data.revisionEnclosure !== null){
                this.projectForm.revisionEnclosureName = res.data.revisionEnclosure.substring(res.data.revisionEnclosure.lastIndexOf("/")+1);
              }
              if(res.data.volumeEnclosure !== '' && res.data.volumeEnclosure !== null){
                this.projectForm.volumeEnclosureName = res.data.volumeEnclosure.substring(res.data.volumeEnclosure.lastIndexOf("/")+1);
              }
              if(res.data.transferEnclosure !== '' && res.data.transferEnclosure !== null){
                this.projectForm.transferEnclosureName = res.data.transferEnclosure.substring(res.data.transferEnclosure.lastIndexOf("/")+1);
              }
              if(res.data.useEnclosure !== ''  && res.data.useEnclosure !== null){
                this.projectForm.useEnclosureName = res.data.useEnclosure.substring(res.data.useEnclosure.lastIndexOf("/")+1);
              }
              if(res.data.permitEnclosure !== '' && res.data.permitEnclosure !== null){
                this.projectForm.permitEnclosureName = res.data.permitEnclosure.substring(res.data.permitEnclosure.lastIndexOf("/")+1);
              }
              if(res.data.constructionEnclosure !== '' && res.data.constructionEnclosure !== null){
                this.projectForm.constructionEnclosureName = res.data.constructionEnclosure.substring(res.data.constructionEnclosure.lastIndexOf("/")+1);
              }
              if(res.data.startEnclosure !== '' && res.data.startEnclosure !== null){
                this.projectForm.startEnclosureName = res.data.startEnclosure.substring(res.data.startEnclosure.lastIndexOf("/")+1);
              }
              if(res.data.finishEnclosure !== '' && res.data.finishEnclosure !== null){
                this.projectForm.finishEnclosureName = res.data.finishEnclosure.substring(res.data.finishEnclosure.lastIndexOf("/")+1);
              }
            }).catch(function () {
            })
          }

        }
      },
      myOneCilck(){
        if(this.projectForm.isApproval === '否'){
          this.$message({
            message: '请先立项哦！',
            type: 'warning'
          });
          this.isProject = true;
        }else{
         this.isProject = false;
        }
      },
      myTwoClick(){
        if(this.projectForm.isEia  === '否'|| this.projectForm.isPlan === '否'||this.projectForm.isRevision === '否'){
          this.$message({
            message: '请先填写以上内容！',
            type: 'warning'
          });
          this.isLand = true;
        }else{
          this.isLand = false;
        }
      },
      myThreeClick(){
        // if(this.projectForm.isApproval === ''||this.environmentForm.isEia  === ''|| this.environmentForm.isPlan === ''||this.environmentForm.isRevision === ''||this.landForm.isVolume === ''||this.landForm.isTransfer === ''){
          if(this.projectForm.isVolume === '否'||this.projectForm.isTransfer === '否'){
          this.$message({
            message: '请先填写以上内容！',
            type: 'warning'
          });
            this.isuseLand = true;
        }else{
          this.isuseLand = false;
        }
      },
      myFourClick(){
        if(this.projectForm.isUse  === '否'|| this.projectForm.isPermit === '否'||this.projectForm.isConstruction === '否'){
          this.$message({
            message: '请先填写以上内容！',
            type: 'warning'
          });
          this.isStart = true;
        }else{
          this.isStart = false;
        }
      },
      myFiveClick(){
        if(this.projectForm.isStart  === '否'){
          this.$message({
            message: '请先填写以上内容！',
            type: 'warning'
          });
        }else{
          this.isFinish = false;
        }
      },
      submit(){
        importEngineer(this.projectForm).then(response => {
          if(response.code === 200){
            this.$message({
              message: '操作成功！',
              type: 'success'
            });
          }else{
            this.$message.error('操作失败');
          }

        })
      },
      handleClose(){
        this.DetailDrawer = false;
        this.isDetailEdit = false;
        this.activeName='first';
      },
      submitApply(row) {
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
      companyDetail(row){
        this.reset()
        getEnterDetail(row.enterpriseName).then(response => {
          if(response.permission === false){
            this.$message({
              message: '暂无权限查看！',
              type: 'warning'
            });
            return;
          }
          if(response.result === false){
            this.$message({
              message: '该企业不存在！',
              type: 'warning'
            });
            return;
          }
          this.enterForm = response.information;
          // this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          this.companyOpen = true;
          this.readonly = true;
          this.title = '详情'
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
                  this.msgSuccess('修改成功111');
                  getProjectDetail(this.detailId).then(response => {
                    this.enterForm = response.data
                    // this.open = true
                    this.readonly = false
                    // this.title = '修改'
                    this.DetailDrawer = true;
                    if(response.data.nature === '在建'){
                      this.twoTab = false;
                    }
                  })
                  this.isDetailEdit = false;
                  // this.open = false
                  // this.getList()
                }
              })
            } else {
              getEnterDetail(this.enterForm.enterpriseName).then(res=>{
                  if(res.result === false){
                    this.$confirm('该企业信息不存在, 是否继续添加?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      addProject(this.enterForm).then(response => {
                        if (response.code === 200) {
                          this.msgSuccess('新增成功')
                          this.open = false
                          this.getList()
                        }
                      })
                      /*this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });*/
                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '已取消'
                      });
                    });
                  }else{
                    addProject(this.enterForm).then(response => {
                      if (response.code === 200) {
                        this.msgSuccess('新增成功')
                        this.open = false
                        this.getList()
                      }
                    })
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
      //项目信息 附件上传中处理
      annexFileUploadProgress1(event, file, fileList) {
          console.log('很厉害')
        this.projectUpload.isUploading = true;
      },
      annexFileUploadProgress(event, file, fileList) {
        this.annexUpload.isUploading = true;
      },
      explainUploadProgress(event, file, fileList) {
        this.explainUpload.isUploading = true;
      },
      revisionUploadProgress(event, file, fileList) {
        this.revisionUpload.isUploading = true;
      },
      //landUpload
      landUploadProgress(event, file, fileList) {
        this.landUpload.isUploading = true;
      },
      transferUploadProgress(event, file, fileList) {
        this.transferUpload.isUploading = true;
      },
      useLandUploadProgress(event, file, fileList) {
        this.useLandUpload.isUploading = true;
      },
      permitUploadProgress(event, file, fileList) {
        this.permitUpload.isUploading = true;
      },
      constUploadProgress(event, file, fileList) {
        this.constUpload.isUploading = true;
      },
      startUploadProgress(event, file, fileList) {
        this.startUpload.isUploading = true;
      },
      finishUploadProgress(event, file, fileList) {
        this.finishUpload.isUploading = true;
      },
      // 附件上传成功处理
      annexFileSuccess(response, file, fileList) {
        // console.log('很快就好看',response.fileUrl)
        let query={
          id:this.engineerId,
          approvalEnclosure:response.fileUrl
        }
        afterUpload(query).then(response => {});
        this.projectForm.approvalEnclosureName = file.name;
        this.projectForm.approvalEnclosure = response.fileUrl;
        this.projectUpload.open = false;
        this.projectUpload.isUploading = false;
        this.$refs.projectUpload.clearFiles();
        this.$alert(response.msg, "上传结果", { dangerouslyUseHTMLString: true });
      },
      environmentFileSucess(response, file, fileList) {
        let query={
          id:this.engineerId,
          eiaEnclosure:response.fileUrl
        }
        afterUpload(query).then(response => {});
        this.projectForm.eiaEnclosureName = file.name;
        this.projectForm.eiaEnclosure  = response.fileUrl;
        this.annexUpload.open = false;
        this.annexUpload.isUploading = false;
        this.$refs.annexUpload.clearFiles();
        this.$alert(response.msg, "上传结果", { dangerouslyUseHTMLString: true });
      },
      controlFileSucess(response, file, fileList) {
        let query={
          id:this.engineerId,
          planEnclosure:response.fileUrl
        }
        afterUpload(query).then(response => {});
        this.projectForm.planEnclosureName = file.name;
        this.projectForm.planEnclosure   = response.fileUrl;
        this.explainUpload.open = false;
        this.explainUpload.isUploading = false;
        this.$refs.explainUpload.clearFiles();
        this.$alert(response.msg, "上传结果", { dangerouslyUseHTMLString: true });
      },
      changeControlFileSucess(response, file, fileList) {
        let query={
          id:this.engineerId,
          revisionEnclosure:response.fileUrl
        }
        afterUpload(query).then(response => {});
        this.projectForm.revisionEnclosureName = file.name;
        this.projectForm.revisionEnclosure  = response.fileUrl;
        this.revisionUpload.open = false;
        this.revisionUpload.isUploading = false;
        this.$refs.revisionUpload.clearFiles();
        this.$alert(response.msg, "上传结果", { dangerouslyUseHTMLString: true });
      },
      landGroupFileSucess(response, file, fileList) {
        let query={
          id:this.engineerId,
          volumeEnclosure:response.fileUrl
        }
        afterUpload(query).then(response => {});
        this.projectForm.volumeEnclosureName = file.name;
        this.projectForm.volumeEnclosure   = response.fileUrl;
        this.landUpload.open = false;
        this.landUpload.isUploading = false;
        this.$refs.landUpload.clearFiles();
        this.$alert(response.msg, "上传结果", { dangerouslyUseHTMLString: true });
      },
      landChangeFileSucess(response, file, fileList) {
        let query={
          id:this.engineerId,
          transferEnclosure:response.fileUrl
        }
        afterUpload(query).then(response => {});
        this.projectForm.transferEnclosureName = file.name;
        this.projectForm.transferEnclosure  = response.fileUrl;
        this.transferUpload.open = false;
        this.transferUpload.isUploading = false;
        this.$refs.transferUpload.clearFiles();
        this.$alert(response.msg, "上传结果", { dangerouslyUseHTMLString: true });
      },
      userLandFileSucess(response, file, fileList){
        let query={
          id:this.engineerId,
          useEnclosure:response.fileUrl
        }
        afterUpload(query).then(response => {});
        this.projectForm.useEnclosureName = file.name;
        this.projectForm.useEnclosure   = response.fileUrl;
        this.useLandUpload.open = false;
        this.useLandUpload.isUploading = false;
        this.$refs.useLandUpload.clearFiles();
        this.$alert(response.msg, "上传结果", { dangerouslyUseHTMLString: true });
      },
      enginePermitFileSucess(response, file, fileList){
        let query={
          id:this.engineerId,
          permitEnclosure:response.fileUrl
        }
        afterUpload(query).then(response => {});
        this.projectForm.permitEnclosureName = file.name;
        this.projectForm.permitEnclosure  = response.fileUrl;
        this.permitUpload.open = false;
        this.permitUpload.isUploading = false;
        this.$refs.permitUpload.clearFiles();
        this.$alert(response.msg, "上传结果", { dangerouslyUseHTMLString: true });
      },
      constructionFileSucess(response, file, fileList){
        let query={
          id:this.engineerId,
          constructionEnclosure:response.fileUrl
        }
        afterUpload(query).then(response => {});
        this.projectForm.constructionEnclosureName = file.name;
        this.projectForm.constructionEnclosure   = response.fileUrl;
        this.constUpload.open = false;
        this.constUpload.isUploading = false;
        this.$refs.constUpload.clearFiles();
        this.$alert(response.msg, "上传结果", { dangerouslyUseHTMLString: true });
      },
      startFileSucess(response, file, fileList){
        let query={
          id:this.engineerId,
          startEnclosure:response.fileUrl
        }
        afterUpload(query).then(response => {});
        this.projectForm.startEnclosureName = file.name;
        this.projectForm.startEnclosure  = response.fileUrl;
        this.startUpload.open = false;
        this.startUpload.isUploading = false;
        this.$refs.startUpload.clearFiles();
        this.$alert(response.msg, "上传结果", { dangerouslyUseHTMLString: true });
      },
      finishFileSucess(response, file, fileList){
        let query={
          id:this.engineerId,
          finishEnclosure:response.fileUrl
        }
        afterUpload(query).then(response => {});
        this.projectForm.finishEnclosureName = file.name;
        this.projectForm.finishEnclosure  = response.fileUrl;
        this.finishUpload.open = false;
        this.finishUpload.isUploading = false;
        this.$refs.finishUpload.clearFiles();
        this.$alert(response.msg, "上传结果", { dangerouslyUseHTMLString: true });
      },

      projectFileSubmit(){
        this.$refs.annexUpload.submit();
        this.annexUpload.isUploading = false;
      },
      projectFileSubmit1(){
        this.$refs.projectUpload.submit();
        this.projectUpload.isUploading = false;
      },
      explainFilrSubmit(){
        this.$refs.explainUpload.submit();
      },
      revisionFileSubmit(){
        this.$refs.revisionUpload.submit();
      },
      landFileSubmit(){
        this.$refs.landUpload.submit();
      },
      transferFileSubmit(){
        this.$refs.transferUpload.submit();
      },
      useLandFileSubmit(){
        this.$refs.useLandUpload.submit();
      },
      permitSubmit(){
        this.$refs.permitUpload.submit();
      },
      constSubmit(){
        this.$refs.constUpload.submit();
      },
      startSubmit(){
        this.$refs.startUpload.submit();
      },
      finishSubmit(){
        this.$refs.finishUpload.submit();
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
<style lang="scss" scoped>
  /*去掉打开抽屉时自动选中标题时的边框*/
  /deep/ :focus {
    outline: 0;
  }
  .el-divider__text {
    position: absolute;
    background-color: #FFFFFF;
    padding: 0 20px;
    font-weight: 500;
    color: #303133;
    font-size: 17px;
  }
  /* /deep/ .el-timeline-item__tail {
     position: absolute;
     left: auto;
     height: 100%;
     right: 4px;
     border-left: 2px solid #e4e7ed;
   }*/
  /deep/ .myTimeLine {
    overflow: scroll
  }
  /deep/.el-scrollbar__wrap {
    /*margin-left: 1%;*/
    /*margin-right: 1%;*/
    overflow-x: hidden;
  }
  /deep/.el-scrollbar__wrap .el-scrollbar__view ul{

    padding-inline-start: 40px!important;
  }
  /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
    /*background: #e3f9fd;*/
    background: #F1FAFA;
    /*background: #A0EEE1;*/
  }
  /deep/.el-table .one-row {
    background: #E8E8FF;
  }
  /deep/.el-table .two-row {
    background: #E8FFE8;
  }
  /deep/.el-table .three-row {
     background: #F1FAFA;
   }
  /deep/.el-table .four-row {
    background: #8080C0;
  }
  /deep/.el-table .five-row {
     background: #E8D098;
   }
  /deep/.el-table .six-row {
    background: #EFEFDA;
  }
  /deep/.el-table .seven-row {
     background: #F2F1D7;
   }
  /deep/.el-table .eight-row {
    background: #336699;
  }
  /deep/.el-table .nine-row {
     background: oldlace;
   }
  /deep/.el-table .ten-row {
    background: #f0f9eb;
  }
</style>
