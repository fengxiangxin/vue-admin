<template>
  <el-card class="box-card" style="margin-bottom: 20px">
    <el-form :inline="true" v-model="category" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="seleteCategory1Id"
        >
          <el-option
            v-for="category in category1List"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="category.category2Id"
          placeholder="请选择"
          @change="seleteCategory2Id"
        >
          <el-option
            v-for="category in category2List"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="category.category3Id"
          placeholder="请选择"
          @change="seleteCategory3Id"
        >
          <el-option
            v-for="category in category3List"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      category1List: [], //一级列表
      category2List: [], //二级列表
      category3List: [], //三级列表
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    /* 获取二级分类列表 */
    async seleteCategory1Id(category1Id) {
      /* 清空二三级列表 */
      this.category2List = [];
      this.category3List = [];
      this.category.category2Id = "";
      this.category.category3Id = "";

      const result = await this.$API.attr.getCategory2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
        
        this.$emit("change", this.category);
      } else {
        this.$message.error(result.message);
      }
    },
    /* 获取三级分类列表 */
    async seleteCategory2Id(category2Id) {
      /* 清空三级列表 */
      this.category3List = [];
      this.category.category3Id = "";

      const result = await this.$API.attr.getCategory3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;

        this.$emit("change", this.category);
      } else {
        this.$message.error(result.message);
      }
    },
    /* 三个id返回给父组件 */
    async seleteCategory3Id() {
      // const category = {
      //   ...this.category,
      // };
      this.$emit("change", this.category);
    },
  },
  async mounted() {
    const result = await this.$API.attr.getCategory1();
    if (result.code === 200) {
      this.category1List = result.data;
    } else {
      this.$message.error(result.message);
    }
  },
};
</script>