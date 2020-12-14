import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /* 获取属性值列表 */
  getAttrInfoList({ category1Id, category2Id, category3Id }) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: "GET"
    });
  },
  /* 获取一级列表 */
  getCategory1() {
    return request({
      url: `${api_name}/getCategory1`,
      method: "GET"
    });
  },
  /* 获取二级列表 */
  getCategory2(category1Id) {
    return request({
      url: `${api_name}/getCategory2/${category1Id}`,
      method: "GET"
    });
  },
  /* 获取三级列表 */
  getCategory3(category2Id) {
    return request({
      url: `${api_name}/getCategory3/${category2Id}`,
      method: "GET"
    });
  },
  /* 保存属性值 */
  saveAttrInfo(data) {
    return request({
      url: `${api_name}/saveAttrInfo`,
      method: "POST",
      data
    });
  },
  /* 删除属性 */
  deleteAttr(attrId) {
    return request({
      url: `${api_name}/deleteAttr/${attrId}`,
      method: "DELETE"
    });
  }
};
