<template>
  <el-card class="box-card">
    <el-form ref="form" :rules="rules" :model="sku" label-width="100px">
      <el-form-item label="SPU 名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU 名称" prop="skuName">
        <el-input v-model="sku.skuName" placeholder="SKU 名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input
          type="number"
          v-model="sku.price"
          placeholder="SKU 价格"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input
          type="number"
          v-model="sku.weight"
          placeholder="SKU 重量"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述" prop="skuDesc">
        <el-input
          v-model="sku.skuDesc"
          type="textarea"
          :rows="4"
          placeholder="SKU 规格"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性" prop="attrInfoList">
        <!-- attr是对象，其中有attrValueList -->
        <!-- 再添加一个表单 -->
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item
            v-for="attr in attrInfoList"
            :key="attr.id"
            :label="attr.attrName"
            class="spu-spuadd-select"
            label-width="100px"
          >
            <!-- 在attr中保存属性值id -->
            <el-select placeholder="请选择" v-model="attr.attrValueId">
              <el-option
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="attrValue.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性" prop="spuSaleAttrList">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item
            v-for="spuSaleAttr in spuSaleAttrList"
            :key="spuSaleAttr.id"
            :label="spuSaleAttr.saleAttrName"
            label-width="100px"
          >
            <el-select
              placeholder="请选择"
              v-model="spuSaleAttr.spuSaleAttrValueId"
            >
              <el-option
                v-for="value in spuSaleAttr.spuSaleAttrValueList"
                :key="value.id"
                :label="value.saleAttrValueName"
                :value="value.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表" prop="spuImageList">
        <el-table
          border
          ref="multipleTable"
          :data="spuImageList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="selectImg"
        >
          >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope">
              <img
                style="height: 150px"
                :src="scope.row.imgUrl"
                :alt="scope.row.imgName"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column prop="address" label="操作" show-overflow-tooltip>
            <template v-slot="{ row, $index }">
              <el-tag type="success" v-if="row.isDefault">默认</el-tag>
              <el-button
                v-else
                type="primary"
                size="mini"
                @click="setDefault($index, row)"
                >设为默认</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveSku">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SkuAdd",
  data() {
    return {
      spu: this.spuRow,
      sku: {
        skuAttrValueList: [],
        skuImageList: [],
        skuSaleAttrValueList: [],
      },
      attrInfoList: [], //平台属性
      spuSaleAttrList: [], //销售属性
      spuImageList: [], //图片
      rules: {
        skuName: [
          { required: true, message: "请输入sku名称", trigger: "change" },
        ],
        price: [
          { required: true, message: "请输入sku价格", trigger: "change" },
        ],
        weight: [
          { required: true, message: "请输入sku重量", trigger: "change" },
        ],
        skuDesc: [
          { required: true, message: "请输入sku描述", trigger: "change" },
        ],
        attrInfoList: [{ validator: this.attrInfoListValidator }],
        spuSaleAttrList: [{ validator: this.spuSaleAttrListValidator }],
        spuImageList: [{ validator: this.spuImageListValidator }],
      },
    };
  },
  props: {
    spuRow: Object,
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    /* 获取所有平台属性 */
    async getAttrInfoList() {
      const result = await this.$API.attr.getAttrInfoList(this.category);
      if (result.code === 200) {
        this.attrInfoList = result.data;
      }
    },
    /* 获取spu销售属性 */
    async getSpuSaleAttrList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spu.id);
      if (result.code === 200) {
        this.spuSaleAttrList = result.data;
      }
    },
    /* 获取图片数据 */
    async getSpuImageList() {
      const result = await this.$API.spu.getSpuImageList(this.spu.id);
      if (result.code === 200) {
        this.spuImageList = result.data;
      }
    },
    /* 勾选图片 */
    selectImg(val) {
      /* 参数是一个数组，包含被选中的项 */
      // console.log(val);
      this.sku.skuImageList = val;
    },
    /* 设置默认图片 */
    setDefault(index, row) {
      // /* 只有这张图片被选中才能设为默认 */
      // console.log(row);
      // const index = this.sku.skuImageList.indexOf((item) => item.id === row.id);
      // if (index < 0) return;
      // this.sku.skuImageList.forEach((item, index) => {
      //   item.isDefault = false;
      // });
      // this.sku.skuImageList[index].isDefault = true;
      this.spuImageList.forEach((item, index) => {
        this.$set(item, "isDefault", false);
      });
      this.spuImageList[index].isDefault = true;
    },
    /* 验证平台属性 */
    attrInfoListValidator(rule, value, callback) {
      /* 每个属性都要被选择 */
      /* 判断skuAttrValueList中每一个对象中是否有attrValueId属性 */
      if (
        !this.attrInfoList.every((attr) => {
          return attr.attrValueId;
        })
      ) {
        callback(new Error("每个属性都必须指定属性值"));
        return;
      }
      /* 将验证通过的数据存放到sku中 */
      this.sku.skuAttrValueList = this.attrInfoList.map((item) => {
        return {
          attrId: item.id,
          valueId: item.attrValueId,
        };
      });
      callback();
    },
    /* 验证销售属性 */
    spuSaleAttrListValidator(rule, value, callback) {
      if (
        !this.spuSaleAttrList.every((spuSale) => {
          return spuSale.spuSaleAttrValueId;
        })
      ) {
        callback(new Error("每个属性都必须指定属性值"));
        return;
      }
      /* 将验证通过的数据存放到sku中 */
      this.sku.skuSaleAttrValueList = this.spuSaleAttrList.map((item) => {
        return {
          spuId: item.spuId,
          saleAttrValueId: item.spuSaleAttrValueId,
        };
      });
      callback();
    },
    /* 验证图片列表 */
    spuImageListValidator(rule, value, callback) {
      /* 至少勾选一张图片，勾选的图片中至少有一张默认图片 */
      if (this.sku.skuImageList.length === 0) {
        callback(new Error("请至少选择一张图片"));
        return;
      }
      /* 遍历查找skuImageList中是否有默认图片 */
      if (!this.sku.skuImageList.some((item) => item.isDefault)) {
        callback(new Error("请设置默认图片"));
        return;
      }
      /* 验证通过 */
      callback();
    },
    /* 保存sku */
    saveSku() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.$message.success("验证成功");
          this.sku.category3Id = this.spu.category3Id;
          this.sku.spuId = this.spu.id;
          this.sku.tmId = this.spu.tmId;
          this.sku.skuDefaultImg = this.sku.skuImageList.find(
            (item) => item.isDefault
          ).imgUrl;
          /* 发送请求 */
          const result = await this.$API.sku.saveSkuInfo(this.sku);
          if (result.code === 200) {
            this.$message.success("保存SKU成功");
            /* 跳转页面 */
            this.$emit("show");
          }
        }
      });
    },
  },
  mounted() {
    this.getAttrInfoList();
    this.getSpuSaleAttrList();
    this.getSpuImageList();
  },
};
</script>

<style lang="sass" scoped>
.spu-spuadd-select
  margin-bottom: 10px
  text-align: right
</style>
