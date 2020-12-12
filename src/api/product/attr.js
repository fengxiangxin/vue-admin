import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*  */
  getAttrInfoList({ category1Id, category2Id, category3Id }) {
    return request({
      url: `${api_name}/${category1Id}/${category2Id}/${category3Id}`,
      method: "GET"
    });
  },
  /* 获取一级列表 */
  getCategory1() {
    return request({
      url: `${api_name}/getCategory1`,
      method: "GET"
    });
  }
};
