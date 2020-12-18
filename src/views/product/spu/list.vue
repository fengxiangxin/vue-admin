<template>
  <div>
    <SkuAdd v-if="isShowSku" :spuRow="spuRow" @show="show" />
    <div v-else>
      <Category />
      <SpuShow v-if="isShow" @updateSpu="updateSpu" @addSku="addSku" />
      <SpuUpdate v-else :spuRow="spuRow" @show="show" />
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShow from "./spuShow";
import SpuUpdate from "./spuUpdate";
import SkuAdd from "./skuAdd";
export default {
  name: "SpuList",
  data() {
    return {
      isShow: true,
      spuRow: {},
      isShowSku: false,
    };
  },
  methods: {
    /* 重新回到这个页面 */
    show() {
      /* 修改显示 */
      this.isShow = true;
      this.isShowSku = false;
      /* 重新加载数据 */
      this.$nextTick(() => {
        this.$bus.$emit("change", this.$store.state.category.category);
      });
    },
    updateSpu(row) {
      /* 修改显示 */
      this.isShow = false;
      this.spuRow = row;
    },
    /* 进入添加sku页面 */
    addSku(row) {
      this.isShowSku = true;
      this.spuRow = row;
    },
  },
  components: {
    Category,
    SpuShow,
    SpuUpdate,
    SkuAdd,
  },
};
</script>
