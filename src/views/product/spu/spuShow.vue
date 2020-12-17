<template>
  <div>
    <el-card class="box-card" v-loading="loading">
      <!-- 触发事件，传入category3Id -->
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="$emit('updateSpu', { category3Id: category.category3Id })"
        >添加SPU</el-button
      >
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
              @click="$emit('addSku', row)"
            ></el-button>
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="$emit('updateSpu', row)"
            ></el-button>
            <el-button icon="el-icon-info" type="info" size="mini"></el-button>

            <el-popconfirm
              :title="`确定删除 ${row.spuName} 吗？`"
              @onConfirm="deleteSpu(row)"
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
      <el-pagination
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        :page-sizes="[5, 10, 15]"
        :page-size.sync="size"
        :current-pagecurrent.sync="current"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
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
      size: 5,
      total: 0,
    };
  },
  methods: {
    /* 请求spu列表数据 */
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
    /* 当更新category3Id时重新请求数据 */
    changeCategory3Id(category) {
      this.category = category;
      /* 加载spu列表 */
      if (category.category3Id) {
        this.getSpuList(this.current, this.size);
      }
    },
    /* 页码改变时 */
    handleCurrentChange(current) {
      this.getSpuList(current, this.size);
    },
    /* 改变每页条数时 */
    handleSizeChange(size) {
      // this.size = size;
      /* 提前将current传入子组件，防止current变化，减少了发送一次请求 */
      this.current = 1;
      /* 为什么会发出两次请求？可能是由于size改变时会导致current发生改变，current发生改变时就又会发送一次请求 */
      this.getSpuList(1, size);
    },
    /* 删除spu */
    async deleteSpu(row) {
      const result = await this.$API.spu.deleteSpu(row.id);
      /* 重新加载数据 */
      if (result.code === 200) {
        this.$message.success("删除SPU成功");
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
<style lang="sass">
.el-pagination
  text-align: center
</style>