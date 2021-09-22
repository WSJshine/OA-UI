<template>
  <div>
      <div class="w">
        <div class="box">
          <div class="card">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>待办事宜</span>
                <!--<el-button style="float: right; padding: 3px 0" type="text"></el-button>-->
                <el-button style="float: right; padding: 3px 0" type="text" @click="upComing">{{'待办 ('+taskListTotal+')' }}</el-button>

              </div>
              <div v-for="(item,i) in taskListData" :key="i" class="text item">
                <el-button type="text" v-if="i < 10" @click="showVerifyDialog(item)">{{'【 '+item.taskName+'】' + item.title }}</el-button>
              </div>
            </el-card>
          </div>
          <div class="card">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>已收公文</span>
                <!--<el-button style="float: right; padding: 3px 0" type="text"></el-button>-->
                <el-button style="float: right; padding: 3px 0" type="text" @click="doneComing" >{{'更多 ('+documentListTotal+')'}}</el-button>
              </div>
              <div v-for="(item,i) in documentList" :key="i" class="text item">
                <el-button type="text" v-if="i < 10" @click="doneComing">{{item.title}}</el-button>
                <el-button type="text" v-if="i < 10" @click="doneComing"  style="float:right">{{item.sendTime }}</el-button>
              </div>
            </el-card>
          </div>
          <div class="card">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>待收公文</span>
                <!--<el-button style="float: right; padding: 3px 0" type="text"></el-button>-->
                <el-button style="float: right; padding: 3px 0" type="text">{{'更多 ('+waitListTotal+')'}}</el-button><!--waitListData-->
              </div>
              <div v-for="(item,i) in waitListData" :key="i" class="text item">
                <el-button type="text" v-if="i < 10" @click="showVerifyDialog(item)">{{'【 '+item.taskName+'】' + item.title }}</el-button>
              </div>
            </el-card>
          </div>
          <div class="card">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>通知公告</span>
                <!--<el-button style="float: right; padding: 3px 0" type="text"></el-button>-->
                <el-button style="float: right; padding: 3px 0" type="text" @click="jumpToNotice">{{'更多 ('+postListTotal+')' }}</el-button>
              </div>
              <div v-for="(item,i) in postListData" :key="i" class="text item">
                <el-button type="text" v-if="i < 10" @click="detail(item)">{{item.docTitle }}</el-button>
              </div>
            </el-card>
          </div>
        </div>
      </div>


  <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body :before-close="handleClose">
    <!--请假-->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px"  v-if="form.processKey === 'leave'||form.processKey === 'leave_charge'||form.processKey === 'leave_dept'">
      <el-form-item label="申请人" prop="applyUserName" >
        <el-input v-model="form.applyUserName" placeholder="请输入标题" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title" >
        <el-input v-model="form.title" placeholder="请输入标题" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="原因" prop="reason" >
        <el-input v-model="form.reason" type="textarea" placeholder="请输入内容" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="请假类型" v-if="showVerify.ModifyApply">
        <el-radio-group v-model="form.vacationType">
          <el-radio :label="1">事假</el-radio>
          <el-radio :label="2">病假</el-radio>
          <el-radio :label="3">工休</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="请假类型" prop="vacationStr" v-if="!showVerify.ModifyApply">
        <el-input v-model="form.vacationStr" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="请假时间" prop="startAndEndTime" >
        <el-date-picker
          style="width: 380px;height: 36px"
          v-model="startAndEndTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期" :disabled=readonly>
        </el-date-picker>
      </el-form-item>
      <el-form-item label="请假时长" prop="totalTime" >
        <el-input v-model="formatDateSub" :disabled="true"/>
      </el-form-item>
      <el-form-item label="实际开始时间" prop="realityStartTime" v-if="showVerify.ReportBack ">
        <el-date-picker
          v-model="form.processParams.DT_realityStartTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="实际结束时间" prop="realityEndTime" v-if="showVerify.ReportBack ">
        <el-date-picker
          v-model="form.processParams.DT_realityEndTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="重新申请" prop="reApply" v-if="showVerify.ModifyApply">
        <el-radio v-model="form.processParams.B_reApply" label="true" @change="handleSelectChange">重新申请</el-radio>
        <el-radio v-model="form.processParams.B_reApply" label="false" @change="handleSelectChange">放弃申请</el-radio>
      </el-form-item>

      <el-form-item label="部门领导审批" prop="deptLeaderApproved" v-if="showVerify.DeptLeaderVerify">
        <el-radio v-model="form.processParams.B_deptLeaderApproved" label="true" @change="handleSelectChange">同意
        </el-radio>
        <el-radio v-model="form.processParams.B_deptLeaderApproved" label="false" @change="handleSelectChange">拒绝
        </el-radio>
      </el-form-item>

      <el-form-item label="分管领导审批" prop="chargeApproved" v-if="showVerify.ChargeVerify">
        <el-radio v-model="form.processParams.B_chargeApproved" label="true" @change="handleSelectChange">同意</el-radio>
        <el-radio v-model="form.processParams.B_chargeApproved" label="false" @change="handleSelectChange">拒绝</el-radio>
      </el-form-item>
      <el-form-item label="领导审批" prop="leaderApproved" v-if="showVerify.LeaderVerify">
        <el-radio v-model="form.processParams.B_leaderApproved" label="true" @change="handleSelectChange">同意</el-radio>
        <el-radio v-model="form.processParams.B_leaderApproved" label="false" @change="handleSelectChange">拒绝</el-radio>
      </el-form-item>
      <el-form-item label="监察室审批" prop="leaderApproved" v-if="showVerify.Supervision">

        <div v-if="showFinishFile">
          <el-button type="info" disabled >归档</el-button>
          <div slot="tip" class="el-upload__tip" >请点击确定，完成归档</div>
        </div>
        <div v-else>
          <el-button type="primary" @click="showFinishFile=true" >归档</el-button>
        </div>

      </el-form-item>

      <el-form-item label="批注" prop="comment" v-if="showButton&& !(showVerify.ModifyApply||showVerify.ReportBack)">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="form.processParams.COM_comment">
        </el-input>
      </el-form-item>
    </el-form>

    <!--党员活动-->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-if="form.processKey === 'partyMemberActivity'">
      <el-form-item label="标题" prop="title" >
        <el-input v-model="form.title" placeholder="请输入标题" :disabled='true'></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime" >
        <el-input v-model="form.startTime"  placeholder="请输入内容" :disabled='true'></el-input>
      </el-form-item>
      <el-form-item label="简述" prop="display" >
        <el-input v-model="form.display"  placeholder="请输入内容" :disabled='true'></el-input>
      </el-form-item>
      <el-form-item label="应接收党支部" prop="acceptName" >
        <el-input v-model="form.acceptName"  placeholder="请输入内容" :disabled='true'></el-input>
      </el-form-item>
    </el-form>

    <!--发文拟稿-->
    <el-form ref="form" :model="form"  :rules="rules" label-width="200px" v-if="form.processKey === 'document_send'">
      <el-form-item label="编号" prop="sendNum" >
        <el-input v-model="form.sendNum" placeholder="请输入编号" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="公文标题" prop="docTitle" >
        <el-input v-model="form.docTitle" placeholder="请输入标题" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="发送时间" prop="sendTime" >
        <el-input v-model="form.sendTime"  placeholder="请输入发送时间" :disabled='true'></el-input>
      </el-form-item>
      <el-form-item  prop="backups1" >
        <span slot="label">拟稿人【{{form.user}}】意见 </span>
        <el-input v-model="form.userComment" :disabled="true"/>
      </el-form-item>
      <el-form-item prop="chargeLeader" >
        <span slot="label" v-if="form.charge">主管领导【{{form.charge}}】意见 </span>
        <span slot="label" v-else>主管领导意见 </span>
        <el-input v-model="form.chargeComment" :disabled="true"/>
      </el-form-item>
      <el-form-item  prop="generalDirector" >
        <span slot="label" v-if="form.director">综合室主任【{{form.director}}】意见 </span>
        <span slot="label" v-else>综合室主任意见 </span>
        <el-input v-model="form.directorComment" :disabled="true"/>
      </el-form-item>
      <el-form-item  prop="leader" >
        <span slot="label" v-if="form.leaderr">领导【{{form.leaderr}}】意见 </span>
        <span slot="label" v-else>领导意见 </span>
        <el-input v-model="form.leaderComment" :disabled="true"/>
      </el-form-item>
      <el-form-item prop="docAttachment" label="附件" align="center" >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="downloadText(form.docAttachment)">{{annexName}}</el-button>
        </template>
      </el-form-item>
      <el-form-item v-if="showVerify.ReDraft" label="重新上传附件">

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
            :on-success="fileSuccess1"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传Excel、PDF、Word文件，且不超过10MB</div>
          </el-upload>
      </el-form-item>
      <el-form-item label="重新申请" prop="reApply" v-if="showVerify.ReDraft">
        <el-radio v-model="form.processParams.B_reApproved" label="true" @change="handleSelectChange">重新申请</el-radio>
        <el-radio v-model="form.processParams.B_reApproved" label="false" @change="handleSelectChange">放弃申请</el-radio>
      </el-form-item>

      <el-form-item label="审批意见" prop="deptLeaderApproved" v-if="showVerify.Charge"><!--主管领导-->
        <el-radio v-model="form.processParams.B_chargeApproved" label="true" @change="handleSelectChange">同意
        </el-radio>
        <el-radio v-model="form.processParams.B_chargeApproved" label="false" @change="handleSelectChange">拒绝
        </el-radio>
      </el-form-item>

      <el-form-item label="审批意见" prop="hrApproved" v-if="showVerify.GeneralAudit"><!--综合室主任-->
        <el-radio v-model="form.processParams.B_directorApproved" label="true" @change="handleSelectChange">同意</el-radio>
        <el-radio v-model="form.processParams.B_directorApproved" label="false" @change="handleSelectChange">拒绝</el-radio>
      </el-form-item>

      <el-form-item label="审批意见" prop="deptLeaderApproved" v-if="showVerify.LeaderIssued"><!--领导-->
        <el-radio v-model="form.processParams.B_leaderApproved" label="true" @change="handleSelectChange">同意
        </el-radio>
        <el-radio v-model="form.processParams.B_leaderApproved" label="false" @change="handleSelectChange">拒绝
        </el-radio>
      </el-form-item>

      <el-form-item label="下一步审核人" prop="deptLeaderApproved" v-if="showButton&& (showVerify.Charge||showVerify.GeneralAudit||showVerify.ReDraft)">
        <span slot="label">{{nextTask}}</span>
        <!--<el-cascader :options="deptUserList"  :props="{ value:'name',label:'type' }" v-model="form.chargeLeaderList" :show-all-levels="false"  clearable></el-cascader>-->
        <el-cascader :options="deptUserList" collapse-tags
                     :props="{ checkStrictly: true,value:'name',label:'type' }"
                     v-model="form.chargeLeaderList"
                     clearable  @change="handleChange" >
        </el-cascader>
      </el-form-item>

      <el-form-item label="批注" prop="comment" v-if="showButton&& (showVerify.Charge||showVerify.GeneralAudit||showVerify.LeaderIssued)">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="form.processParams.COM_comment">
        </el-input>
      </el-form-item>
    </el-form>

    <!--收文登记-->
    <el-form ref="form" :model="form" :rules="rules" label-width="180px" v-if="form.processKey === 'document_accept_order'">
      <el-form-item label="编号" prop="sendNum" >
        <el-input v-model="form.sendNum" placeholder="请输入编号" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="事由" prop="docTitle" >
        <el-input v-model="form.docTitle" placeholder="请输入标题" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="收文时间" prop="sendTime" >
        <el-input v-model="form.sendTime"  placeholder="请输入发送时间" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="来文机关" prop="sendCompany" >
        <el-input v-model="form.sendCompany" :disabled="true"/>
      </el-form-item>

      <el-form-item  prop="deal" >
        <span slot="label" v-if="form.deal">拟办人【{{form.deal}}】意见 </span>
        <span slot="label" v-else>拟办人意见 </span>
        <el-input v-model="form.dealComment" :disabled="true"/>
      </el-form-item>
      <el-form-item prop="leader" >
        <span slot="label" v-if="form.leader">领导【{{form.leader}}】批示 </span>
        <span slot="label" v-else>领导批示 </span>
        <el-input v-model="form.leaderComment" :disabled="true"/>
      </el-form-item>
      <el-form-item  prop="readers" v-for="(item,i) in form.readers" >
        <span slot="label" v-if="form.readers">阅者【{{item}}】意见 </span>
        <span slot="label" v-else>阅者意见 </span>
        <el-input v-model="form.opinions[i]" :disabled="true"  v-if="form.readers"/>
      </el-form-item>
      <el-form-item prop="docAttachment" label="附件" align="center" >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="downloadText(form.docAttachment)">{{annexName}}</el-button>
        </template>
      </el-form-item>
      <el-form-item v-if="showVerify.ReRegister" label="重新上传附件">

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
          :on-success="fileSuccess1"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传Excel、PDF、Word文件，且不超过10MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="领导批示" prop="leaderApproved" v-if="showVerify.LeaderInstruct">
        <el-radio v-model="form.processParams.B_leaderApproved" label="true" @change="handleSelectChange">同意
        </el-radio>
        <el-radio v-model="form.processParams.B_leaderApproved" label="false" @change="handleSelectChange">拒绝
        </el-radio>
      </el-form-item>
      <el-form-item label="重新申请" prop="reApply" v-if="showVerify.ReRegister">
        <el-radio v-model="form.processParams.B_reApply" label="true" @change="handleSelectChange">重新申请</el-radio>
        <el-radio v-model="form.processParams.B_reApply" label="false" @change="handleSelectChange">放弃申请</el-radio>
      </el-form-item>
      <el-form-item label="下一步审核人" prop="deptLeaderApproved" v-if="showButton&& (showVerify.Deal||showVerify.ReRegister)">
        <span slot="label">{{nextTask}}</span>
        <el-cascader :options="deptUserList" collapse-tags
                     :props="{ checkStrictly: true,value:'name',label:'type' }"
                     v-model="form.chargeLeaderList"
                     clearable >
        </el-cascader>
      </el-form-item>

      <el-form-item label="下一步审核人" prop="deptLeaderApproved" v-if="showButton&& showVerify.LeaderInstruct">
        <span slot="label">{{nextTask}}</span>
        <el-cascader :options="deptUserList" collapse-tags
                     :props="{multiple: true , checkStrictly: true,value:'name',label:'type' }"
                     v-model="form.chargeLeaderList"
                     clearable  @change="handleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="拟办意见" prop="deptLeaderApproved" v-if="showVerify.Deal">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="form.processParams.COM_comment">
        </el-input>
      </el-form-item>
      <el-form-item label="领导批示" prop="hrApproved" v-if="showVerify.LeaderInstruct">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="form.processParams.COM_comment">
        </el-input>
      </el-form-item>

      <el-form-item label="阅者意见" prop="comment" v-if="showVerify.Reader">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="form.processParams.COM_comment">
        </el-input>
      </el-form-item>
    </el-form>
    <!--通知公告-->
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" v-if="form.processKey === 'notice'||form.processKey === 'notice_internal'">
      <el-form-item label="通知" prop="docTitle" >
        <el-input v-model="form.docTitle" placeholder="请输入标题" :disabled=myReApply></el-input>
      </el-form-item>

      <el-form-item label="发布单位" prop="sendCompany" >
        <el-input v-model="form.sendCompany" :disabled="true"/>
      </el-form-item>
      <el-form-item prop="charge" >
        <span slot="label" v-if="form.charger">分管领导【{{form.charger}}】意见 </span>
        <span slot="label" v-else>领导批示 </span>
        <el-input v-model="form.chargeComment" :disabled="true"/>
      </el-form-item>
      <el-form-item prop="director" >
        <span slot="label" v-if="form.director">综合室【{{form.director}}】意见 </span>
        <span slot="label" v-else>综合室意见 </span>
        <el-input v-model="form.directorComment" :disabled="true"/>
      </el-form-item>
      <el-form-item label="查收通知人" prop="acceptCompany" >

        <el-cascader v-if="showVerify.Renotice" :options="deptUserList"
                     :props="{multiple: true , checkStrictly: true,value:'name',label:'type' }"
                     v-model="form.chargeLeaderList"
                     clearable  style="width: 100%" >
        </el-cascader>
        <el-input v-else v-model="form.acceptName" :disabled="true"/>
      </el-form-item><!--这里需要加一个三级回显以供修改  v-if="showVerify.Renotice"-->
      <el-form-item label="通知内容" prop="docRemark" >
        <!--<el-input type="textarea" v-model="form.docRemark" :disabled=myReApply />-->
        <div v-html="myFontDocRemark" v-if="readonly === true || readonly === 'true'"></div>
        <editor v-model="form.docRemark" :min-height="192" v-if="readonly === false|| readonly==='false'"/>
      </el-form-item>
      <el-form-item label="通知时间" prop="sendTime" >
        <el-input v-model="form.sendTime"  placeholder="请输入发送时间" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="docAttachment" label="附件" align="center" v-if="annexName !== ''">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="downloadText(form.docAttachment)" >{{annexName}}</el-button>
          <div class="itd" style="width:100%;margin-top: 12px;margin-bottom: 12px;margin-left: -200px" v-if="showVerify.Renotice">
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
              <el-button size="small" type="primary">重新上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传Excel、PDF、Word文件，且不超过10MB</div>
            </el-upload>
          </div>

        </template>
      </el-form-item>
      <el-form-item label="重新申请" prop="reApply" v-if="showVerify.Renotice">
        <el-radio v-model="form.processParams.B_reApproved" label="true" @change="handleSelectChange">重新申请</el-radio>
        <el-radio v-model="form.processParams.B_reApproved" label="false" @change="handleSelectChange">放弃申请</el-radio>
      </el-form-item>
      <el-form-item label="下一步审核人" prop="deptLeaderApproved" v-if="showButton&&showVerify.Charge&&form.processKey==='notice'">
        <span slot="label">{{nextTask}}</span>
        <el-cascader :options="deptUserList" collapse-tags
                     :props="{ checkStrictly: true,value:'name',label:'type' }"
                     v-model="form.chargeLeaderList"
                     clearable  @change="handleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="分管领导审批" prop="chargeApproved" v-if="showVerify.Charge">
        <el-radio v-model="form.processParams.B_chargeApproved" label="true" @change="handleSelectChange">同意
        </el-radio>
        <el-radio v-model="form.processParams.B_chargeApproved" label="false" @change="handleSelectChange">拒绝
        </el-radio>
      </el-form-item>

      <el-form-item label="综合室审批" prop="directorApproved" v-if="showVerify.GeneralAudit">
        <el-radio v-model="form.processParams.B_directorApproved" label="true" @change="handleSelectChange">同意</el-radio>
        <el-radio v-model="form.processParams.B_directorApproved" label="false" @change="handleSelectChange">拒绝</el-radio>
      </el-form-item>

      <el-form-item label="批注" prop="comment" v-if="showButton&& (showVerify.Renotice||showVerify.Charge||showVerify.GeneralAudit)">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="form.processParams.COM_comment">
        </el-input>
      </el-form-item>
    </el-form>

    <!--公文分发-->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-if="form.processKey === 'document_distribute'">
      <el-form-item label="公文分发编号" prop="sendNum" >
        <el-input v-model="form.sendNum" placeholder="请输入编号" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="公文标题" prop="docTitle" >
        <el-input v-model="form.docTitle" placeholder="请输入标题" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="签发人" prop="backups2" >
        <el-input v-model="form.backups2" :disabled="true"/>
      </el-form-item>
      <el-form-item label="发送时间" prop="sendTime" >
        <el-input v-model="form.sendTime"  placeholder="请输入发送时间" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="收文单位" prop="acceptName" >
        <el-input v-model="form.acceptName" :disabled="true"/>
      </el-form-item>

      <el-form-item prop="docAttachment" label="附件" align="center"  v-if="annexName !== ''">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="downloadText(form.docAttachment)">{{annexName}}</el-button>
        </template>
      </el-form-item>
    </el-form>

    <!--测试星星-->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-if="form.processKey === 'document'">
      <el-form-item label="公文分发编号" prop="sendNum" >
        <el-input v-model="form.sendNum" placeholder="请输入编号" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="公文标题" prop="docTitle" >
        <el-input v-model="form.docTitle" placeholder="请输入标题" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="签发人" prop="backups2" >
        <el-input v-model="form.backups2" :disabled="true"/>
      </el-form-item>
      <el-form-item label="发送时间" prop="sendTime" >
        <el-input v-model="form.sendTime"  placeholder="请输入发送时间" :disabled=readonly></el-input>
      </el-form-item>
      <el-form-item label="收文单位" prop="acceptName" >
        <el-input v-model="form.acceptName" :disabled="true"/>
      </el-form-item>
      <el-form-item prop="docAttachment" label="附件" align="center"  v-if="annexName !== ''">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="downloadText(form.docAttachment)">{{annexName}}</el-button>
        </template>
      </el-form-item>
      <el-form-item label="批注" prop="comment" v-if="showButton2&& (!showVerify.Draft)">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="form.processParams.COM_comment">
        </el-input>
      </el-form-item>
      <el-form-item  label="送下一步" v-if="showVerify.Draft">
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

      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="form.processKey=== 'document'">
      <!--星型打印-->
      <el-button type="primary" @click="submitShowVerifyDialog1" v-show="showButton2&&!showButton&&!showButton1">审批</el-button>
      <el-button type="primary" @click="submitShowVerifyDialog" v-show="showButton&&!showButton2&&!showButton1">确 定</el-button>
    </div>
    <div slot="footer" class="dialog-footer" v-if="form.processKey !== 'document'">
      <el-button type="primary" @click="submitShowVerifyDialog" v-show="showButton1&&!showButton&&!showButton2">查收通知</el-button>
      <el-button type="primary" @click="submitShowVerifyDialog1" v-show="showButton2&&!showButton&&!showButton1">公文签收</el-button>
      <el-button type="primary" @click="submitShowVerifyDialog" v-show="showButton&&!showButton2&&!showButton1">确 定</el-button>

      <!--<el-button type="primary" @click="submitForm" v-show=!readonly&&!showButton>确 定</el-button>-->
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
<!--星星下一步-->
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
        <el-form-item label="拟稿人意见" :label-width="formLabelWidth">

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

    <el-dialog :title="commentTitle" :visible.sync="openComment" width="80%" append-to-body>
      <el-form ref="enterForm" :model="enterForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="">
              <b v-html="enterForm.docTitle" style="padding-left: 90%;"></b>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="">
              <p v-html="enterForm.docRemark" style="white-space: pre-wrap;line-height:30px;padding-right: 30px"></p>
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
import CountTo from 'vue-count-to'
import { getTask, getWait,getPost,getDocument} from "@/api/firstPage";
import {
  getDeptUserTitele,
  getLeave,
  getLeave1,
  getDeptUser,
  updateLeave,
  updateNotice,
  updateAccept,
  updateSend,
  fileDownload,
  sendDocument1
} from '@/api/document/task';
import Editor from '@/components/Editor';
import {calcTotalSecond, formatTotalDateSub} from '@/utils/dateUtil'
import {cancelApply, suspendOrActiveApply, showVerifyDialog, complete,complete1} from '@/api/activiti/process';
export default {
  components: {
    CountTo,Editor
  },
  data() {
    return {
      myTitle:'',
      innerVisible: false,
      innerForm:{
        comment:'',//备注
        chargeLeader:'',//主管领导
      },
      formLabelWidth: '120px',
      fileList:[],
      title:'',
      open:false,
      annexName:'',//附件名
      annexUrl:'',
      deptUserList:[],//下一步审核人
      nextTask:'',//下一步审核人标题
      // 请假时长
      formatDateSub: '',
      startAndEndTime: ['', ''],
      readonly: false,
      myReApply:false,
      showButton: false,
      showButton1: false,
      showButton2: false,
      // 审批人控制表单
      showVerify: {
        MainDeal:false,
        Draft:false,
        SecretaryReview:false,
        Deal:false,
        LeaderInstruct:false,
        AcceptActivity:false,
        WaitAccept:false,
        Reader:false,
        ReDraft:false,
        ReRegister:false,
        ModifyApply: false,
        DeptLeaderVerify: false,
        ChargeVerify: false,
        Supervision:false,
        LeaderVerify:false,
        ReportBack: false,
        Charge:false,
        GeneralAudit:false,
        LeaderIssued:false,
        Sign:false,
        Renotice:false,
        Register:false,
      },


      taskListData:[],
      taskListTotal:'',
      waitListData:[],
      waitListTotal:'',
      postListData:[],
      postListTotal:'',
      documentList:[],
      documentListTotal:'',
      postContent:'',
      form:{
        sendNum:'',
        docTitle:'',
        processParams: {
          typeList:['notice'],
          F_flag:'',
          COM_comment:'',
        }
      },
      showFinishFile:false,//控制监察室审核归档按钮
      myFontData:'',
      myFontDocRemark:'',
      openComment: false,
      commentTitle:'',
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
      rules: {
        title: [
          {required: true, message: '用户名称不能为空', trigger: 'blur'}
        ], totalTime: [
          {required: true, message: '请假时间不能为空', trigger: 'blur'}
        ], reason: [
          {required: true, message: '原因不能为空', trigger: 'blur'}
        ],
        /* realityStartTime: [
           { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
         ], realityEndTime: [
           { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
         ]*/
      },
      //详情
      detailQuery : {
        businessKey :'',
        processKey : '',
      },
      form1:{
        processParams: {

        }
      },

    }
  },
  methods: {
    jumpToNotice(){
      // this.$router.push({path:'/system/notice'})
      this.$router.push({ path: "/administre/task/document/doneTask", query: { search: 'notice_internal'}})
    },
    upComing(){
      this.$router.push({path:'/administre/task/document/todoTask'})
    },
    doneComing(){
      // this.$router.push({path:'/administre/task/document/doneTask'});
      this.$router.push({ path: "/administre/task/document/doneTask", query: { search: 'document_distribute'}})
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    downloadText(data){
      fileDownload(data);
    },
    handleClose(){
      this.showFinishFile = false;
      this.open = false;
    },
// 取消按钮
    cancel() {
      this.open = false;
      this.showButton = false
      this.showButton1 = false
      this.showButton2 = false
      this.reset()
    },
    reset() {
      this.innerVisible = false;
      this.showButton = false
      this.showButton1 = false
      this.showButton2 = false
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
        processParams: {}
      }
      this.startAndEndTime = ['', '']
      this.formatDateSub = null
      this.resetForm('form')
      this.instanceId = ''
      this.showVerify = {
        MainDeal:false,
        Draft:false,
        SecretaryReview:false,
        Deal:false,
        LeaderInstruct:false,
        AcceptActivity:false,
        WaitAccept:false,
        Reader:false,
        ReDraft:false,
        ModifyApply: false,
        DeptLeaderVerify: false,
        ChargeVerify: false,
        Supervision:false,
        LeaderVerify:false,
        ReportBack: false,
        Charge:false,
        GeneralAudit:false,
        LeaderIssued:false,
        Sign:false,
        Renotice:false,
        Register:false,
      }
    },
    handleChange() {
      // console.log('我红辣椒可垃圾分类看到',this.form.chargeLeaderList)
    },
    submitShowVerifyDialog() {//提交

      // let that = this;//这个接口里的数据就对
      //  console.log('我来了',that.form)//这里的数据也不的   但是不知道为什么
      this.$refs['form'].validate(valid => {
        if (valid) {
          if(this.showVerify.Charge){//主管领导审核
            if (this.form.processKey === 'notice_internal') {
              this.form.processParams.LIST_signList = this.form.acceptCompany;
            }else{
              if(this.form.processParams.B_chargeApproved === true|| this.form.processParams.B_chargeApproved === 'true'){
                if (this.form.chargeLeaderList){
                  this.form.processParams.generalDirector = this.form.chargeLeaderList[this.form.chargeLeaderList.length-1];
                } else {
                  this.$message({
                    message: '请选择下一步办理人哦！',
                    type: 'warning'
                  });
                  return;
                }
              }

            }
          }else if(this.showVerify.GeneralAudit){//综合室主任审核
            if (this.form.processKey === 'notice') {
              this.form.processParams.LIST_signList = this.form.acceptCompany;
            }else{
              if(this.form.processParams.B_directorApproved === true|| this.form.processParams.B_directorApproved === 'true'){
                console.log('就好看了的记录',this.form.chargeLeaderList)
                if (this.form.chargeLeaderList){
                  this.form.processParams.leader = this.form.chargeLeaderList[this.form.chargeLeaderList.length-1];
                } else {
                  this.$message({
                    message: '请选择下一步办理人哦！',
                    type: 'warning'
                  });
                  return;
                }
              }
            }

          }else if(this.showVerify.Deal){
            this.form.processParams.leaderUserId = this.form.chargeLeaderList[this.form.chargeLeaderList.length-1];
          }else if(this.showVerify.LeaderInstruct){
            let listData = '';
            let ll = '';
            console.log('规划的股份',this.form.chargeLeaderList)
            if(this.form.processParams.B_leaderApproved === true|| this.form.processParams.B_leaderApproved === 'true'){
              for(let i = 0 ; i <this.form.chargeLeaderList.length;i++){
                if(this.form.chargeLeaderList[i].length!== 0){
                  ll = this.form.chargeLeaderList[i].length
                  listData = this.form.chargeLeaderList[i][ll-1] + ','+ listData;
                }
              }
              listData= listData.substring(0,listData.length - 1);
              this.form.processParams.LIST_readerList = listData;
            }
          }else if(this.showVerify.ReDraft){//重新申请
            console.log('还很厉害')
              if(this.form.processParams.B_reApproved === true|| this.form.processParams.B_reApproved === 'true'){
                if (this.form.chargeLeaderList){
                  this.form.processParams.chargeLeader = this.form.chargeLeaderList[this.form.chargeLeaderList.length-1];
                } else {
                  this.$message({
                    message: '请选择下一步办理人哦！',
                    type: 'warning'
                  });
                  return;
                }
              }
          }else if(this.showVerify.ReRegister){//重新申请
            console.log('还很厉害')
            if(this.form.processParams.B_reApply === true|| this.form.processParams.B_reApply === 'true'){
              if (this.form.chargeLeaderList){
                this.form.processParams.dealUserId = this.form.chargeLeaderList[this.form.chargeLeaderList.length-1];
              } else {
                this.$message({
                  message: '请选择下一步办理人哦！',
                  type: 'warning'
                });
                return;
              }
            }
          }else if(this.showVerify.Supervision){//监察室审批
            this.form.processParams.TIME_leaveTime = this.formatDateSub;
          }
          this.form.businessKey = this.form.id;
          if(this.annexUrl!==''){
            this.form.docAttachment = this.annexUrl;
          }
          complete(this.form).then(response => {
            console.log('好困好困333333333',this.form)
            if (response.code === 200) {
              if (this.showVerify.ModifyApply) {
                updateLeave(this.form).then(response => {
                  if (response.code === 200) {
                    this.msgSuccess('修改成功');
                    this.open = false;
                    this.getSend()
                  }
                })
              }else if(this.showVerify.Renotice && this.form.processParams.B_reApproved){
                updateNotice(this.form).then(response => {
                  if (response.code === 200) {
                    this.msgSuccess('修改成功');
                    this.open = false;
                    this.getSend()
                  }
                })
              }else if(this.showVerify.ReRegister && this.form.processParams.B_reApply){
                updateAccept(this.form).then(response => {
                  if (response.code === 200) {
                    this.msgSuccess('修改成功');
                    this.open = false;
                    this.getSend()
                  }
                })
              }else if(this.showVerify.ReDraft && this.form.processParams.B_reApproved){
                updateSend(this.form).then(response => {//第二个请求
                  if (response.code === 200) {
                    this.msgSuccess('修改成功');
                    this.open = false;
                    this.getSend()
                  }
                })
              } else {
                this.msgSuccess('操作成功')
                this.open = false;
                this.getSend()
              }
              setTimeout(() => {
                this.reset()
              }, 100)
            }
          })
        }
      })
    },
    submitShowVerifyDialog1() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.businessKey = this.form.id

          if(this.form.processKey === 'document'){
            console.log('还款计划')
            complete(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('操作成功11111')
                this.open = false;
                this.getSend()
                this.reset()
              }
            })
          }else{
            console.log('发GV发生地')
            complete1(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('操作成功')
                this.open = false;
                this.getSend()
                this.reset()
              }
            })
          }
        }
      })
    },
    // 审批菜单控制
    showVerifyDialog(row) {
      this.reset();
      this.showButton = true
      this.showButton1 = false
      this.showButton2 = false
      if(row.processKey === 'leave'){
        getLeave1(row.id).then(response => {
          this.form = response.data
          this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          showVerifyDialog(row.taskId).then(response => {
            console.log(response.msg)
            if ('ModifyApply' === response.msg) {
              this.readonly = false
              this.showVerify.ModifyApply = true;
              this.form.processParams.B_reApply = "true";
            } else {
              if ('ChargeVerify' === response.msg) {
                this.showVerify.ChargeVerify = true;
                this.form.processParams.B_chargeApproved = "true";
              } else if ('DeptLeaderVerify' === response.msg) {
                this.showVerify.DeptLeaderVerify = true;
                this.form.processParams.B_deptLeaderApproved = "true";
              } else if ('ReportBack' === response.msg) {
                this.showVerify.ReportBack = true;
              } else if ('LeaderVerify' === response.msg) {
                this.showVerify.LeaderVerify = true;
                this.form.processParams.B_leaderApproved = "true";
              } else if ('Supervision' === response.msg) {
                this.showVerify.Supervision = true;
                this.startAndEndTime = [this.form.realityStartTime, this.form.realityEndTime]
              }
              this.readonly = true
            }
            this.open = true;
            this.title = row.taskName
          })
        })
      }else{
        this.detailQuery.businessKey = row.id;
        this.detailQuery.processKey = row.processKey;
        getLeave(this.detailQuery).then(response => {
          this.form = response.data;

          let aaa = ''
          if(this.form.processKey ===  'notice' || this.form.processKey ===  'notice_internal'){
            aaa = response.data.backups4;
            this.myFontDocRemark = response.data.docRemark;
          }
          this.startAndEndTime = [this.form.leaveStartTime, this.form.leaveEndTime]
          showVerifyDialog(row.taskId).then(response => {
            console.log(response.msg)
            if ('ReDraft' === response.msg) {
              this.myReApply = false
              this.showVerify.ReDraft = true;
              this.readonly = false;
              this.form.processParams.B_reApproved = "true";
            }else if('Renotice' === response.msg){//Renotice
              this.myReApply = false
              this.showVerify.Renotice = true;
              this.form.chargeLeaderList = eval('(' + aaa + ')');
              this.readonly = false;
              this.form.processParams.B_reApproved = "true";
            }else if('ReRegister' === response.msg){//Renotice
              this.myReApply = false
              this.showVerify.ReRegister = true;
              this.readonly = false;
              this.form.processParams.B_reApply = "true";
            } else {
              if ('Charge' === response.msg) {
                this.showVerify.Charge = true;
                this.form.processParams.B_chargeApproved = "true";
              } else if ('GeneralAudit' === response.msg) {
                this.showVerify.GeneralAudit = true;
                this.form.processParams.B_directorApproved = "true";
              } else if ('LeaderIssued' === response.msg) {
                this.showVerify.LeaderIssued = true;
                this.form.processParams.B_leaderApproved = "true";
              } else if ('ReportBack' === response.msg) {
                this.showVerify.ReportBack = true;
              } else if ('Deal' === response.msg) {
                this.showVerify.Deal = true;
              } else if ('LeaderInstruct' === response.msg) {
                this.showVerify.LeaderInstruct = true;
              } else if ('Reader' === response.msg) {
                this.showVerify.Reader = true;
              }else if ('Sign' === response.msg) {
                this.showButton1 = true;
                this.showButton = false;
                this.showButton2 = false;
              }else if ('AcceptActivity' === response.msg) {
                this.showButton1 = true;
                this.showButton = false;
                this.showButton2 = false;
              }else if ('WaitAccept' === response.msg) {
                this.showButton2 = true;
                this.showButton = false;
                this.showButton1 = false;
              }else if ('MainDeal' === response.msg||'SecretaryReview' === response.msg||'Review' === response.msg||'SecretaryOpinion' === response.msg||'CounterSign' === response.msg||'SignSend' === response.msg||'File' === response.msg) {
                // this.showButton2 = false;
                // this.showButton = true;
                // this.showButton1 = false;
                this.showVerify.Draft = false;
                console.log('邵东气候危机的尽可能',this.showButton&&!this.showButton2&&!this.showButton1)
              }else if ('Draft' === response.msg) {
                this.showVerify.Draft = true;
                this.showButton2 = false;
                this.showButton = false;
                this.showButton1 = false;
              }
              this.myReApply = true;
              this.readonly = true
            }

            if(this.form.docAttachment)
              this.annexName = this.form.docAttachment.substring(this.form.docAttachment.lastIndexOf("/")+1);
            this.open = true;
            this.title = row.taskName;
            //获取下一步审核人标题
            if(this.form.processKey !== 'document'){
              getDeptUserTitele(row.processKey,response.msg).then(resp=>{
                this.nextTask = resp.data.nextTask;
              })
            }

          })
          getDeptUser().then(res=>{
            this.deptUserList = res;
          })
        })


      }

    },
    detail(row) {
      this.detailQuery.businessKey = row.id;
      this.detailQuery.processKey = row.processKey;
      getLeave(this.detailQuery).then(response => {
        this.openComment = true;
        this.enterForm = response.data;
        this.commentTitle = "查看通知";
      })
    },
    handleSelectChange(val) {
      console.log(this.form.processParams.B_deptLeaderApproved)
      this.$forceUpdate()
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
      this.form.docAttachment = response.fileUrl;
      if(response.code!==200){
        this.$message.error('上传失败!');
      }
    },
    fileSuccess1(response,file,fileList){
      this.annexUrl = response.fileUrl;
      this.annexName = file.name;
      console.log('和客户',response.fileUrl)
      if(response.code!==200){
        this.$message.error('上传失败!');
      }
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
    getSend(){
      //待办
      getTask(this.form1).then(response => {
        if (response.code === 200) {
          this.taskListData = response.rows
          this.taskListTotal = response.total
          // console.log('首页待办公文111',this.taskListData)
        }
      });
      //待收
      getWait(this.form1).then(response => {
        if (response.code === 200) {
          this.waitListData = response.rows
          this.waitListTotal = response.total
          // console.log('首页待收公文222',this.waitListData)
        }
      });
      getPost(this.form).then(response => {
        if (response.code === 200) {
          this.postListData = response.rows
          this.postContent = response.total
          this.postListTotal = response.total
          // console.log('首页待收公文333',this.waitListData)
        }
      });
      getDocument(this.form1).then(response => {
        if (response.code === 200) {
          this.documentList = response.rows;
          this.documentListTotal = response.total
          // console.log('已收公文444',this.documentList)
        }
      });
    },
    carryTime(date) {
      if (date.getMinutes() > 0 && date.getMinutes() < 15) {
        date.setMinutes(0);
      }
      if (date.getMinutes() >= 15 && date.getMinutes() < 30) {
        date.setMinutes(30);
      }
      if (date.getMinutes() > 30 && date.getMinutes() < 45) {
        date.setMinutes(30);
      }
      if (date.getMinutes() >= 45) {
        date.setHours(date.getHours() + 1);
        date.setMinutes(0);
      }
      return date;
    },
    DateDiffNoWeekDay(startTime, endTime) {
      if (startTime >= endTime) return 0;
      //1,分钟取整
      startTime = this.carryTime(startTime);
      endTime = this.carryTime(endTime);
      //2，计算总天数
      var totalTime = 0;//工时，天数
      if (startTime.getDay() == 6 || startTime.getDay() == 0) {
        totalTime = endTime.getDate() - startTime.getDate();
      } else {
        totalTime = Math.floor(((endTime - startTime) / (3600 * 1000)) / 24);
      }
      //3,拿初始值赋值给一个临时变量
      var tempStartTime = new Date();
      tempStartTime.setTime(startTime.getTime());
      //4,计算出总天数
      while (tempStartTime.getDate() < endTime.getDate()) {
        if (tempStartTime.getDay() == 6 || tempStartTime.getDay() == 0) {//周六或者周日减去
          totalTime--;
        }
        tempStartTime.setDate(tempStartTime.getDate() + 1);
      }

      //5,计算出总小时数
      var temp = 0;//工时，小时
      do {
        if (startTime.getDay() == 6 || startTime.getDay() == 0) {//周六周日
          startTime.setDate(startTime.getDate() + 1);
          //*********周六周日直接跳过，初始化为早晨8点
          startTime.setHours(8);
          startTime.setMinutes(0);
          continue;
        }

        let tempMinutes = startTime.getHours() * 60 + startTime.getMinutes();
        //上午8点到12点，算工时
        if (tempMinutes >= 8 * 60 && tempMinutes < 12 * 60) {
          temp += 0.05;
        }
        //上午14点半到17点半，算工时
        if (tempMinutes >= (14 * 60 + 30) && tempMinutes < (17 * 60 + 30)) {
          temp += 0.05;
        }
        startTime.setTime(startTime.getTime() + 0.5 * 3600 * 1000);//每次增加半个小时
      } while (startTime.getHours() * 60 + startTime.getMinutes() != endTime.getHours() * 60 + endTime.getMinutes())
      {

        totalTime += Math.floor(temp / 0.7);
        totalTime += temp % 0.7;
        totalTime = Math.round(totalTime * 100) / 100
      }
      var days = Math.floor(totalTime);
      var hours = Math.round((totalTime - days) * 100) / 10;
      var mm = days + '天'+ hours + '小时';
      return mm;
    },
    DateDiffNoWeekDay1(startTime, endTime) {
      if (startTime >= endTime) return 0;
      //1,分钟取整
      startTime = this.carryTime(startTime);
      endTime = this.carryTime(endTime);
      //2，计算总天数
      var totalTime = 0;//工时，天数
      if (startTime.getDay() == 6 || startTime.getDay() == 0) {
        totalTime = endTime.getDate() - startTime.getDate();
      } else {
        totalTime = Math.floor(((endTime - startTime) / (3600 * 1000)) / 24);
      }
      //3,拿初始值赋值给一个临时变量
      var tempStartTime = new Date();
      tempStartTime.setTime(startTime.getTime());
      //4,计算出总天数
      while (tempStartTime.getDate() < endTime.getDate()) {
        if (tempStartTime.getDay() == 6 || tempStartTime.getDay() == 0) {//周六或者周日减去
          totalTime--;
        }
        tempStartTime.setDate(tempStartTime.getDate() + 1);
      }

      //5,计算出总小时数
      var temp = 0;//工时，小时
      do {
        if (startTime.getDay() == 6 || startTime.getDay() == 0) {//周六周日
          startTime.setDate(startTime.getDate() + 1);
          //*********周六周日直接跳过，初始化为早晨8点
          startTime.setHours(8);
          startTime.setMinutes(0);
          continue;
        }

        let tempMinutes = startTime.getHours() * 60 + startTime.getMinutes();
        //上午8点到12点，算工时
        if (tempMinutes >= 8 * 60 && tempMinutes < 12 * 60) {
          temp += 0.05;
        }
        //下午15点到18点，算工时
        if (tempMinutes >= 15 * 60 && tempMinutes < 18 * 60) {
          temp += 0.05;
        }
        startTime.setTime(startTime.getTime() + 0.5 * 3600 * 1000);//每次增加半个小时
      } while (startTime.getHours() * 60 + startTime.getMinutes() != endTime.getHours() * 60 + endTime.getMinutes())
      {

        totalTime += Math.floor(temp / 0.7);
        totalTime += temp % 0.7;
        totalTime = Math.round(totalTime * 100) / 100
      }
      var days = Math.floor(totalTime);
      var hours = Math.round((totalTime - days) * 100) / 10;
      var mm = days + '天'+ hours + '小时';
      return mm;
    },
    submitForm1(){
      this.form.processParams.COM_comment = this.innerForm.comment;
      let data = this.form.processParams.F_flag;
      let data1= this.innerForm.chargeLeader[this.innerForm.chargeLeader.length-1];
      switch (data) {
        case '1':
          this.form.processParams.mainner=data1;
          break;
        case '2':
          this.form.processParams.secretaryer=data1;
          break;
        case '3':
          this.form.processParams.reviewer=data1;
          break;
        case '4':
          this.form.processParams.opinioner=data1;
          break;
        case '5':
          this.form.processParams.signer=data1;
          break;
        case '6':
          this.form.processParams.accepter=data1;
          break;
        case '111':
          this.form.processParams.file=data1;
          break;
      }
      this.form.businessKey = this.form.id
        console.log('还款计划')
        complete(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess('操作成功66666')
            this.open = false;
            this.getSend()
            this.reset()
          }
        })

    },
    beforeAdd(data){
      getDeptUser().then(res=>{
        this.deptUserList = res;
      });
      this.innerVisible = true;
      this.form.processParams.F_flag=data;
      switch (data) {
        case '1':
          this.form.processParams.mainner='';
          this.myTitle='主办科室审核';
          break;
        case '2':
          this.form.processParams.secretaryer='';
          this.myTitle='分管秘书长审核';
          break;
        case '3':
          this.form.processParams.reviewer='';
          this.myTitle='核稿';
          break;
        case '4':
          this.form.processParams.opinioner='';
          this.myTitle='秘书长意见';
          break;
        case '5':
          this.form.processParams.signer='';
          this.myTitle='会签';
          break;
        case '6':
          this.form.processParams.accepter='';
          this.myTitle='签发';
          break;
        case '111':
          this.form.processParams.file='';
          this.myTitle='归档';
          break;
      }
    },
  },
  created() {
    this.getSend();
  },
  watch: {
    startAndEndTime: {
      handler(newValue) {
        this.form.leaveStartTime = newValue[0]
        this.form.leaveEndTime = newValue[1]
        if (newValue[0] && newValue[1]) {
          this.form.totalTime = calcTotalSecond(newValue[0], newValue[1])
          let month = parseInt(newValue[0].substr(5,2));
          let returndata = '';
          if(month <10 && month>4){
            returndata = this.DateDiffNoWeekDay(new Date(newValue[0]), new Date(newValue[1]))
          }else{
            returndata = this.DateDiffNoWeekDay1(new Date(newValue[0]), new Date(newValue[1]))
          }

          this.formatDateSub = returndata
        }

      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .img1{
    padding-top: 70px;
    padding-left: 160px;
  }
  .w{
    width: 1600px;
    margin: 0 auto;
    /*border-left: 1px solid red;*/
    /*border-right: 1px solid red;*/
  }
  .header{
    background-image:url('~@/assets/image/firstPagebg.jpg');
    height: 200px;
    /*margin-top:;*/
  }
  /*.main{
    !*background-color: green;*!
    height: 650px;
  }*/
  .footer{
    /*background-color: yellow;*/
    height: 50px;
  }
  .box{
    /*padding-top: 30px;*/
    display: flex;
    flex-wrap: wrap;
  }
  .box .card{
    width: 620px;/*(1180-20)/2*/
    margin-right: 20px;
    margin-left: 20px;
    margin-bottom: 20px;
  }
  .box .card:nth-of-type(2){
    margin-right: 0;
  }
  .el-card {
    border-radius: 4px;
    border: 1px solid #e6ebf5;
    background-color: white !important;
    overflow: hidden;
    color: cornflowerblue !important;
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
  .el-form-item--medium .el-form-item__label {
    line-height: 50px;
  }
</style>
