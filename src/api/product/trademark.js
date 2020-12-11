import request from "@/utils/request";

const api_name = "/admin/product/baseTrademark";

export default {
  /*
    获取品牌分页列表
  */
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET"
    });
  },
  /*
    添加品牌数据
  */
  addTrademark(data) {
    return request({
      url: `${api_name}/save`,
      method: "POST",
      data
    });
  },
  /*
    删除品牌数据
  */
  delTrademark(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: "DELETE"
    });
  },
  /*
    修改品牌数据
  */
  updateTrademask(data) {
    return request({
      url: `${api_name}/update`,
      method: "PUT",
      data
    });
  }
};
