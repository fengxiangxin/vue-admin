<template>
  <el-card class="box-card">
    <el-form ref="form" :model="{}" label-width="100px">
      <el-form-item label="SPU 名称">
        {{ 11 }}
      </el-form-item>
      <el-form-item label="SKU 名称">
        <el-input v-model="spu.name" placeholder="SKU 名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="spu.name" placeholder="SKU 价格"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
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
        <el-table :data="[]" border style="width: 100%">
          <el-table-column prop="date" label="日期" width="180">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "SkuAdd",
  data() {
    return {
      spu: this.spuRow,
    };
  },
  props: {
    spuRow: Object,
  },
};
</script>

<style lang="less" scoped>
</style>
