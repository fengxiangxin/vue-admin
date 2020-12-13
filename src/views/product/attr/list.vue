<template>
  <div>
    <Category @change="getAttrInfoList" />

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
            <p>
              {{ row.valueName }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary">保存</el-button>
      <el-button>取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "./category";
export default {
  name: "AttrList",
  data() {
    return {
      attrInfoList: [],
      attr: {
        attrName: "",
        attrValueList: "",
      },
      isShow: true,
    };
  },
  methods: {
    getAttrInfoList(attrInfoList) {
      this.attrInfoList = attrInfoList;
    },
    updateAttr(row) {
      this.isShow = false;
      /* 深度克隆 */
      this.attr = JSON.parse(JSON.stringify(row));
    },
  },
  mounted() {},
  components: {
    Category,
  },
};
</script>
