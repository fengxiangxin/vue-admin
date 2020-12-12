<template>
  <div>
    <el-card class="box-card" style="margin-bottom: 20px">
      <el-form :inline="true" :model="categoryList" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select  placeholder="请选择">
            <el-option
              v-for="category1 in categoryList.category1"
              :key="category1.id"
              :label="category1.name"
              :value="category1.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="categoryList.category2" placeholder="请选择">
            <el-option label="无数据" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="categoryList.category3" placeholder="请选择">
            <el-option label="无数据" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <el-button type="primary" icon="el-icon-plus" disabled
        >添加属性</el-button
      >
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="date" label="属性名称" width="150">
        </el-table-column>
        <el-table-column prop="name" label="属性值列表"> </el-table-column>
        <el-table-column prop="address" label="操作" width="150">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AttrList",
  data() {
    return {
      categoryList: {
        category1: [],
        category2: [],
        category3: [],
      },
      tableData: [],
    };
  },
  async mounted() {
    const result = await this.$API.attr.getCategory1();
    console.log(result);
    if (result.code === 200) {
      this.categoryList.category1 = result.data;
    }
  },
};
</script>
