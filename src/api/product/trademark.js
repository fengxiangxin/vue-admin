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
  }
};
