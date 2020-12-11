<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="dialogFormVisible = true"
      >添加</el-button
    >
    <el-table :data="tableData" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template v-slot="scope">
          <!--
            作用域插槽
            scope是所有数据
            scope.row是每行数据
            scope.row.logo是每行数据对象中的logo属性
           -->
          <img :src="scope.row.logoUrl" alt="logo" class="trademark-logo" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="warning" icon="el-icon-edit" size="small">
            修改
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 绑定自定义事件时$event是指子组件中触发事件时传入的第一个参数 -->
    <el-pagination
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
      :page-sizes="[3, 6, 9]"
      :page-size="size"
      :current-page="current"
      @current-change="getPageList($event, size)"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <!-- rules表单验证规则 -->
      <el-form
        :model="trademarkForm"
        :rules="rules"
        ref="ruleForm"
        style="width: 80%"
      >
        <el-form-item prop="tmName" label="品牌名称" label-width="100px">
          <el-input
            v-model="trademarkForm.tmName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!--
            指定上传图片的服务器地址，需要考虑跨域问题
            1.若服务器允许跨域，可直接写服务器地址
            2.若服务器不允许跨域，需要借助proxy代理服务器
          -->
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过50kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      tableData: [], //品牌分页列表数据
      pages: 6, //总页数
      current: 1, //当前页码
      size: 3, //每页条数
      total: 17, //总条数
      dialogFormVisible: false, //控制对话框
      trademarkForm: {
        //添加修改表单数据
        logoUrl: "",
        tmName: "",
      },
      /* 表单校验规则 */
      rules: {
        tmName: [
          {
            required: true,
            message: "请输入品牌名称",
            trigger: "blur",
          },
        ],
        logoUrl: [
          {
            required: true,
            message: "请上传品牌LOGO",
          },
        ],
      },
    };
  },
  methods: {
    /* 获取品牌分页数据 */
    async getPageList(page, limit) {
      /* 发送请求 */
      const result = await this.$API.trademark.getPageList(page, limit);
      if (result.code === 200) {
        /* 将请求的数据保存在data中 */
        this.tableData = result.data.records;
        this.current = result.data.current;
        this.size = result.data.size;
        this.total = result.data.total;
        this.pages = result.data.pages;
        this.$message.success("获取品牌列表成功");
      } else {
        this.$message.error("获取品牌列表失败");
      }
    },
    /**
     * 当size发生变化时，发送请求如果引起当前页码的改变则会立即触发页码改变事件
     * 会立即重新发送请求，且size仍然为上一次的值
     * 解决，当size发生改变时，先将分页器的当前页码改为1，再发送请求
     */
    handleSizeChange(size) {
      this.current = 1;
      this.getPageList(this.current, size);
    },
    /* 图片上传之前，file是图片信息 */
    beforeAvatarUpload(file) {
      const imgType = ["image/jpeg", "image/jpg", "image/png"];
      const isJPGPNG = imgType.indexOf(file.type) > -1;
      const isLt50K = file.size / 1024 < 50;

      if (!isJPGPNG) {
        this.$message.error("上传品牌LOGO只能是 JPG或PNG 格式!");
      }
      if (!isLt50K) {
        this.$message.error("上传品牌LOGO大小不能超过 50KB!");
      }
      return isJPGPNG && isLt50K;
    },
    /* 图片上传成功，res是上传成功的结果数据，其中有图片的在线地址 */
    handleAvatarSuccess(res) {
      this.trademarkForm.logoUrl = res.data;
    },
    submitForm(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          /* 如果校验通过则发送请求 */
          const result = await this.$API.trademark.addTrademark(
            this.trademarkForm
          );
          if (result.code === 200) {
            /* 如果添加数据成功，则提示用户信息，隐藏对话框，重新加载数据 */
            this.$message.success("添加品牌数据成功");
            this.dialogFormVisible = false;
            this.getPageList(this.current, this.size);
          }
        } else {
          this.$message.error("添加品牌数据失败");
        }
      });
    },
  },
  mounted() {
    this.getPageList(this.current, this.size);
  },
};
</script>
<style lang="sass" scoped>
.trademark-logo
  width: 100px
  height: 60px

.el-pagination
  text-align: right

>>>.el-pagination__sizes
  margin-left: 240px

>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

>>>.avatar
  width: 178px
  height: 178px
  display: block
</style>
