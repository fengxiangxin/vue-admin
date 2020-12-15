<template>
  <div>
    <el-card class="box-card">
      <el-form ref="form" :rules="rules" label-width="80px" :model="spu">
        <el-form-item label="SPU名称" prop="spuName">
          <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
        </el-form-item>

        <el-form-item label="品牌" prop="tmId" v-model="spu.tmId">
          <el-select v-model="spu.tmId" placeholder="请选择">
            <el-option
              v-for="item in trademarkList"
              :key="item.id"
              :label="item.tmName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="SPU描述" placeholder="SPU描述" prop="description">
          <el-input
            type="textarea"
            placeholder="SPU描述"
            :rows="4"
            v-model="spu.description"
          ></el-input>
        </el-form-item>

        <el-form-item label="SPU图片" prop="spuImageList">
          <el-upload
            :action="`${$BASE_API}/admin/product/fileUpload`"
            list-type="picture-card"
            accept="image/*"
            :file-list="formatImageList"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="销售属性" prop="spuSaleAttrList">
          <el-select
            :placeholder="`剩余 ${remainsSaleAttrList.length} 个未选择`"
            v-model="spu.saleAttr"
          >
            <el-option
              v-for="item in remainsSaleAttrList"
              :key="item.id"
              :label="item.name"
              :value="`${item.id}+${item.name}`"
            >
            </el-option>
          </el-select>
          <el-button
            icon="el-icon-plus"
            type="primary"
            :disabled="!spu.saleAttr"
            @click="addSaleAttr"
            >添加销售属性</el-button
          >
          <el-table
            :data="spuSaleAttrList"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名称" width="150">
            </el-table-column>
            <el-table-column label="属性值列表">
              <template v-slot="{ row }">
                <!-- 新添加tag标签是没有id属性的 -->
                <!-- 删除tag标签的动画有个bug -->
                <el-tag
                  style="margin-right: 5px"
                  v-for="(item, index) in row.spuSaleAttrValueList"
                  :key="index"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(row, index)"
                >
                  {{ item.saleAttrValueName }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.edit"
                  v-model="inputTagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ 添加</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template v-slot="{ row, $index }">
                <el-popconfirm
                  :title="`确定删除 ${row.saleAttrName} 吗？`"
                  @onConfirm="delSpuSaleAttr($index)"
                >
                  <el-button
                    slot="reference"
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                  ></el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveSpuUpdate">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog :visible.sync="previewVisible">
      <img width="100%" :src="previewImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SpuUpdate",
  data() {
    return {
      spu: this.spuRow,
      trademarkList: [],
      spuImageList: [],
      spuSaleAttrList: [], //table中的销售属性
      baseSaleAttrList: [],
      previewImageUrl: "", //预览图片路径
      previewVisible: false, //是否显示预览图片
      inputTagValue: "", //临时保存标签输入的内容
      /* 表单验证规则 */
      rules: {
        spuName: [
          { required: true, message: "请输入spu名称", trigger: "blur" },
        ],
        tmId: [{ required: true, message: "请选择品牌", trigger: "change" }],
        spuImageList: [{ required: true, validator: this.imageValidator }],
        spuSaleAttrList: [{ required: true, validator: this.saleValidator }],
      },
    };
  },
  props: {
    spuRow: Object,
  },
  computed: {
    /* 计算剩余未选择的销售属性 */
    remainsSaleAttrList() {
      return this.baseSaleAttrList.filter(
        (baseSale) =>
          !this.spuSaleAttrList.find(
            (spuSale) => baseSale.id === spuSale.baseSaleAttrId
          )
      );
    },
    /* 格式化图片用于展示，必须添加uid属性 */
    formatImageList() {
      return this.spuImageList.map((item) => ({
        uid: item.uid || item.id,
        name: item.imgName,
        url: item.imgUrl,
      }));
    },
  },
  methods: {
    /* 获取品牌数据 */
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      this.trademarkList = result.data;
    },
    /* 获取图片数据 */
    async getSpuImageList() {
      const result = await this.$API.spu.getSpuImageList(this.spu.id);
      this.spuImageList = result.data;
    },
    /* 获取spu销售属性列表数据 */
    async getSpuSaleAttrList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spu.id);
      this.spuSaleAttrList = result.data;
    },
    /* 获取所有销售属性列表数据 */
    async getBaseSaleAttrList() {
      const result = await this.$API.spu.getBaseSaleAttrList(this.spu.id);
      this.baseSaleAttrList = result.data;
    },
    /* 图片上传成功时 */
    handleAvatarSuccess(res, file) {
      /* 将图片push到spuImageList */
      this.spuImageList.push({
        imgName: file.name,
        imgUrl: res.data,
        spuId: this.spu.id,
        uid: file.uid,
      });
    },
    /* 移除图片时 */
    handleRemove(file) {
      /* 移除spuImageList的图片 */
      /* 根据url */
      this.spuImageList = this.spuImageList.filter(
        (item) => item.imgUrl !== file.url
      );
    },
    /* 预览图片 */
    handlePictureCardPreview(file) {
      this.previewImageUrl = file.url;
      this.previewVisible = true;
    },
    /* 添加销售属性 */
    addSaleAttr() {
      /* spu中保存着要添加的销售属性 */
      const [baseSaleAttrId, saleAttrName] = this.spu.saleAttr.split("+");
      /* 将拿到的销售属性添加到spuSaleAttrList中 */
      this.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId,
        saleAttrName,
        spuId: this.spu.id,
        spuSaleAttrValueList: [],
      });
      /* 清空选择栏 */
      this.spu.saleAttr = "";
    },
    /* 删除标签 */
    handleClose(row, index) {
      /* 删除row中spu属性值列表中下标为index的元素 */
      row.spuSaleAttrValueList.splice(index, 1);
    },
    /* 标签编辑完成 */
    handleInputConfirm(row) {
      /* 只有当输入的值不为空时才生效 */
      if (this.inputTagValue) {
        /* 将属性值添加到spuSaleAttrValueList中 */
        row.spuSaleAttrValueList.push({
          /* 这里不能有id属性 */
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          spuId: row.spuId,
          saleAttrValueName: this.inputTagValue,
        });
      }
      /* 关闭输入框并清空临时数据 */
      row.edit = false;
      this.inputTagValue = "";
    },
    /* 点击编辑标签 */
    showInput(row) {
      /* 设置编辑属性 */
      this.$set(row, "edit", true);
      /* 聚焦 */
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    /* 删除一项销售属性 */
    delSpuSaleAttr(index) {
      /* 删除spuSaleAttrList中的一项属性 */
      this.spuSaleAttrList.splice(index, 1);
    },
    /* 上传图片校验规则 */
    imageValidator(rule, value, callback) {
      /* 校验通过 */
      if (this.spuImageList.length > 0) {
        callback();
        return;
      }
      callback(new Error("请至少上传一张图片"));
    },
    /* 销售属性验证规则 */
    saleValidator(rule, value, callback) {
      /* 销售属性值至少为一条 */
      /* value不是this.spuSaleAttrList */
      const isFail = this.spuSaleAttrList.some(
        (item) => item.spuSaleAttrValueList.length === 0
      );
      if (isFail) {
        /* 验证不通过 */
        callback(new Error("销售属性至少有一条属性值"));
        return;
      }
      callback();
    },
    /* 点击保存 */
    saveSpuUpdate() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          /* 收集数据，数据已在spu中 */
          const data = {
            ...this.spu,
            spuImageList: this.spuImageList,
            spuSaleAttrList: this.spuSaleAttrList,
          };
          /* 发送请求 */
          const result = await this.$API.spu.updateSpuInfo(data);
          /* 跳转页面 */
          if (result.code === 200) {
            this.$message.success("保存 SPU 成功");
            this.$emit("show", data.category3Id);
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
  },
  mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
    this.getSpuSaleAttrList();
    this.getBaseSaleAttrList();
  },
};
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>