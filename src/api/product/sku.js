import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /* 获取spu分页列表 /admin/product/saveSkuInfo  */
  saveSkuInfo(data) {
    return request({
      url: `${api_name}/saveSkuInfo`,
      method: "POST",
      data
    });
  }
};
