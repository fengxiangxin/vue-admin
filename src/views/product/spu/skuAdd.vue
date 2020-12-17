<template>
  <el-card class="box-card">
    <el-form ref="form" :model="{}" label-width="100px">
      <el-form-item label="SPU 名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU 名称">
        <el-input v-model="spu.skuName" placeholder="SKU 名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          type="number"
          v-model="spu.name"
          placeholder="SKU 价格"
        ></el-input>
      </el-form-item>
      <el-form-item type="number" label="重量(千克)">
        <el-input v-model="spu.name" placeholder="SKU 重量"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          v-model="spu.name"
          type="textarea"
          :rows="4"
          placeholder="SKU 规格"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-select v-model="spu.value" placeholder="请选择">
          <el-option label="item.label" value="spu.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售属性">
        <strong>选择版本</strong>
        <el-select v-model="spu.value" placeholder="请选择">
          <el-option label="item.label" value="item.value"> </el-option>
        </el-select>
        <strong>选择版本</strong>
        <el-select v-model="spu.value" placeholder="请选择">
          <el-option label="item.label" value="item.value"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          ref="multipleTable"
          :data="[]"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片" width="120">
            <template slot-scope="scope">{{ scope.row }}</template>
          </el-table-column>
          <el-table-column prop="name" label="名称" width="120">
          </el-table-column>
          <el-table-column prop="address" label="操作" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { a } from "@/test/es-module/test1";
import { mapState } from "vuex";
export default {
  name: "SkuAdd",
  data() {
    return {
      spu: this.spuRow,
      sku: {},
      attrInfoList: [], //平台属性
      spuSaleAttrList: [], //销售属性
      spuImageList: [], //图片
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
  },
  mounted() {
    this.getAttrInfoList();
    this.getSpuSaleAttrList();
    this.getSpuImageList();
  },
};
</script>

<style lang="less" scoped>
</style>
