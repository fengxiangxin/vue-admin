import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /* 获取spu分页列表 */
  getSpuList({ page, limit, category3Id }) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET",
      params: {
        category3Id
      }
    });
  },
  /* 获取品牌数据 */
  //   /admin/product/baseTrademark/getTrademarkList
  getTrademarkList() {
    return request({
      url: `${api_name}/baseTrademark/getTrademarkList`,
      method: "GET"
    });
  },
  /* 获取图片数据 */
  //    /admin/product/spuImageList/{spuId}
  getSpuImageList(spuId) {
    return request({
      url: `${api_name}/spuImageList/${spuId}`,
      method: "GET"
    });
  },
  /* 获取所有销售属性列表数据 */
  //    /admin/product/spuSaleAttrList/{spuId}
  getSpuSaleAttrList(spuId) {
    return request({
      url: `${api_name}/spuSaleAttrList/${spuId}`,
      method: "GET"
    });
  },
  /* 获取spu销售属性列表数据 */
  //    /admin/product/baseSaleAttrList
  getBaseSaleAttrList() {
    return request({
      url: `${api_name}/baseSaleAttrList`,
      method: "GET"
    });
  },
  /* 获取spu销售属性列表数据 */
  //    POST /admin/product/updateSpuInfo
  updateSpuInfo(data) {
    return request({
      url: `${api_name}/updateSpuInfo`,
      method: "POST",
      data
    });
  }
};
