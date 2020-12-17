import * as API from "@/api";
import { Message } from "element-ui";

export default {
  state: {
    category1List: [], //一级列表
    category2List: [], //二级列表
    category3List: [], //三级列表
    category: {
      category1Id: "",
      category2Id: "",
      category3Id: ""
    }
  },
  actions: {
    /* 获取一级分裂列表 */
    async getCategory1({ commit }) {
      const result = await API.attr.getCategory1();
      commit("GETCATEGORY1", { result });
    },
    /* 获取二级分裂列表 */
    async getCategory2({ commit }, category1Id) {
      const result = await API.attr.getCategory2(category1Id);
      commit("GETCATEGORY2", { result, category1Id });
    },
    /* 获取三级分裂列表 */
    async getCategory3({ commit }, category2Id) {
      const result = await API.attr.getCategory3(category2Id);
      commit("GETCATEGORY3", { result, category2Id });
    }
  },
  mutations: {
    GETCATEGORY1(state, { result }) {
      if (result.code === 200) {
        state.category1List = result.data;
      } else {
        Message.error(result.message);
      }
    },
    GETCATEGORY2(state, { result, category1Id }) {
      /* 清空数据 */
      state.category2List = [];
      state.category.category2Id = "";
      state.category3List = [];
      state.category.category3Id = "";

      state.category.category1Id = category1Id;
      if (result.code === 200) {
        state.category2List = result.data;
      } else {
        Message.error(result.message);
      }
    },
    GETCATEGORY3(state, { result, category2Id }) {
      /* 清空数据 */
      state.category3List = [];
      state.category.category3Id = "";

      state.category.category2Id = category2Id;
      if (result.code === 200) {
        state.category3List = result.data;
      } else {
        Message.error(result.message);
      }
    },
    SET_CATEGORY3ID(state, category3Id) {
      state.category.category3Id = category3Id;
    }
  }
};
