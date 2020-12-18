<template>
  <el-card class="box-card" style="margin-bottom: 20px">
    <el-form :inline="true" v-model="category" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="seleteCategory1Id"
          :disabled="disabled"
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
          :disabled="disabled"
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
          :disabled="disabled"
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
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "Category",
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  props: ["disabled"],
  computed: {
    ...mapState({
      category1List: (state) => state.category.category1List,
      category2List: (state) => state.category.category2List,
      category3List: (state) => state.category.category3List,
    }),
  },
  methods: {
    ...mapActions(["getCategory1", "getCategory2", "getCategory3"]),
    ...mapMutations(["SET_CATEGORY3ID"]),
    /* 获取二级分类列表 */
    seleteCategory1Id(category1Id) {
      this.getCategory2(this.category.category1Id);
      this.category.category2Id = "";
      this.category.category3Id = "";
    },
    /* 获取三级分类列表 */
    seleteCategory2Id(category2Id) {
      this.getCategory3(this.category.category2Id);
      this.category.category3Id = "";
    },
    /* 三个id返回给父组件 */
    seleteCategory3Id() {
      this.SET_CATEGORY3ID(this.category.category3Id);
      this.$bus.$emit("change", this.category);
    },
  },
  mounted() {
    this.getCategory1();
  },
};
</script>