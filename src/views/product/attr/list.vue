<template>
  <div>
    <Category @change="getAttrInfoList" :disabled="!isShow" />

    <el-card class="box-card" v-show="isShow">
      <el-button type="primary" icon="el-icon-plus" disabled
        >添加属性</el-button
      >
      <el-table :data="attrInfoList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              type="info"
              v-for="attr in row.attrValueList"
              :key="attr.id"
              >{{ attr.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="updateAttr(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-show="!isShow">
      <el-form :inline="true" :model="attr" class="demo-form-inline">
        <el-form-item label="属性名">
          <el-input
            v-model="attr.attrName"
            placeholder="请输入属性名"
          ></el-input>
        </el-form-item>
      </el-form>

      <el-button type="primary" icon="el-icon-plus">添加属性值</el-button>

      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{ row }">
            <!-- 点击时显示输入框并聚焦 -->
            <el-input
              size="mini"
              v-if="row.isEdit"
              v-model="row.valueName"
              ref="input"
              @change="row.isEdit = false"
              @blur="row.isEdit = false"
            ></el-input>
            <p v-else @click="edit(row)" style="margin: 0">
              {{ row.valueName }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-popconfirm
              :title="`确定删除 ${row.valueName} 吗？`"
              @onConfirm="delAttrValue(row)"
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

      <el-button type="primary" @click="saveAttrInfo">保存</el-button>
      <el-button @click="isShow = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import { category } from "@/api";
import Category from "./category";
export default {
  name: "AttrList",
  data() {
    return {
      attrInfoList: [],
      attr: {
        attrName: "",
        attrValueList: [],
      },
      isShow: true,
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    async getAttrInfoList(category) {
      this.category = category;
      const result = await this.$API.attr.getAttrInfoList(category);
      if (result.code === 200) {
        this.attrInfoList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    updateAttr(row) {
      this.isShow = false;
      /* 深度克隆 */
      this.attr = JSON.parse(JSON.stringify(row));
    },
    edit(row) {
      // row.isEdit = false;
      this.$set(row, "isEdit", true);
      /* 让输入框聚焦 */
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    // editComplete(row) {
    //   row.isEdit = false;
    // },
    delAttrValue(row) {
      /* 有一个id */
      this.attr.attrValueList = this.attr.attrValueList.filter(
        (item) => item.id !== row.id
      );
    },
    /* 保存属性 */
    async saveAttrInfo() {
      await this.$API.attr.saveAttrInfo(this.attr);
      this.isShow = true;
      this.getAttrInfoList(this.category);
    },
  },
  mounted() {},
  components: {
    Category,
  },
};
</script>
