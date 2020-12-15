<template>
  <div>
    <el-card class="box-card" v-loading="loading">
      <el-button type="primary" icon="el-icon-plus" disabled>添加SPU</el-button>
      <el-table :data="spuList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              icon="el-icon-plus"
              type="primary"
              size="mini"
            ></el-button>
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="$emit('updateSpu', row)"
            ></el-button>
            <el-button icon="el-icon-info" type="info" size="mini"></el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :total="0"
        :page-sizes="[5, 10, 15]"
        :page-size="5"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { category } from "@/api";
export default {
  name: "SpuShow",
  data() {
    return {
      loading: false,
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      spuList: [],
      current: 1,
      pages: 0,
      size: 2,
      total: 0,
    };
  },
  methods: {
    async getSpuList(page, limit) {
      this.loading = true;
      /* 发送请求获取分页列表 */
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id: this.category.category3Id,
      });
      if (result.code === 200) {
        this.$message.success("获取SPU列表成功");
        /* 保存数据 */
        this.spuList = result.data.records;
        this.current = result.data.current;
        this.pages = result.data.pages;
        this.size = result.data.size;
        this.total = result.data.total;
      } else {
        this.$message.error(resule.message);
      }
      this.loading = false;
    },
    changeCategory3Id(category) {
      this.category = category;
      /* 加载spu列表 */
      if (category.category3Id) {
        this.getSpuList(this.current, this.size);
      }
    },
  },
  mounted() {
    /* 绑定事件，获取category3Id */
    /* 这个事件被触发时就会重新加载spu列表 */
    this.$bus.$on("change", this.changeCategory3Id);
  },
  beforeUpdate() {
    if (this.category.category3Id === "") {
      this.spuList = [];
    }
  },
  beforeDestroy() {
    this.$bus.$off("change", this.changeCategory3Id);
  },
};
</script>
