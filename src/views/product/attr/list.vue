<template>
  <div>
    <Category @change="getAttrInfoList" :disabled="!isShow" />

    <el-card class="box-card" v-show="isShow">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="addAttr"
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
            <el-popconfirm
              :title="`确定删除 ${row.attrName} 吗？`"
              @onConfirm="delAttr(row)"
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

      <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
        >添加属性值</el-button
      >

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
              @change="editComplete(row)"
              @blur="editComplete(row)"
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
import Category from "@/components/Category";
import { mapState } from "vuex";
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
      // category: {
      //   category1Id: "",
      //   category2Id: "",
      //   category3Id: "",
      // },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    /* 获取属性值列表 */
    async getAttrInfoList() {
      // this.category = category;
      /* 只有当category3Id不为空才会发送请求 */
      if (this.category.category3Id) {
        const result = await this.$API.attr.getAttrInfoList(this.category);
        if (result.code === 200) {
          this.$message.success("获取平台属性列表成功");
          this.attrInfoList = result.data;
        } else {
          this.$message.error(result.message);
        }
      }
    },
    /* 点击修改属性 */
    updateAttr(row) {
      this.isShow = false;
      /* 深度克隆 */
      this.attr = JSON.parse(JSON.stringify(row));
    },
    /* 编辑属性值 */
    edit(row) {
      this.$set(row, "isEdit", true);
      /* 让输入框聚焦 */
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    /* 删除属性值 */
    delAttrValue(row) {
      /* 有一个id */
      this.attr.attrValueList = this.attr.attrValueList.filter(
        (item) => item.id !== row.id
      );
    },
    /* 保存属性 */
    async saveAttrInfo() {
      const data = this.attr;
      /* 如果attr中包含id属性则为修改操作，否则为增加操作 */
      if (!this.attr.id) {
        /* 如果是增加操作，则需要在data中添加属性 */
        data.categoryId = this.category.category3Id;
        data.categoryLevel = 3;
      }

      const result = await this.$API.attr.saveAttrInfo(data);
      if (result.code === 200) {
        this.$message.success("保存属性成功");
        this.isShow = true;
        this.getAttrInfoList();
      } else {
        this.$message.error(result.message);
      }
    },
    /* 添加属性值 */
    addAttrValue() {
      /* 给attrValueList增加一条值 */
      this.attr.attrValueList.push({ isEdit: true });
      /* 聚焦 */
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    /* 编辑属性值完成 */
    editComplete(row) {
      row.isEdit = false;
      /* 如果这个属性值为空，则删除这条属性 */
      if (!row.valueName) {
        this.attr.attrValueList = this.attr.attrValueList.filter(
          (item) => item.id !== row.id
        );
      }
    },
    /* 添加属性 */
    addAttr() {
      /* 清空attr临时数据 */
      this.attr = {
        attrName: "",
        attrValueList: [],
      };
    },
    /* 删除属性 */
    async delAttr(row) {
      const result = await this.$API.attr.deleteAttr(row.id);
      if (result.code === 200) {
        this.$message.success("删除属性成功");
        /* 重新加载 */
        this.getAttrInfoList();
      } else {
        this.$message.error(result.message);
      }
    },
  },
  watch: {
    "category.category3Id"() {
      this.getAttrInfoList();
    },
  },

  components: {
    Category,
  },
};
</script>