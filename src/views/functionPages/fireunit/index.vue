<template>
  <div class="fireUnit">
        <div class="headerBox">
            <base-search @getSearchName="onsearch"></base-search>
        </div>
        <baseTable
          :columnList="columnList"
          :tableData="tableData"
          tableName="fireUnit"
        ></baseTable>
      <base-page :propPage='page' @currentChange="GetDeptFireUnitList"></base-page>
  </div>
</template>

<script>
export default {
  data(){
    return{
      columnList:[
          {
            prop: "fireUnitName",
            label: "防火单位"
          },
          {
            prop: "areaName",
            label: "所属区域"
          },
          {
            prop: "contractUserName",
            label: "联系人"
          },
          {
            prop: "contractPhone",
            label: "联系电话"
          },
          {
            prop: "netTime",
            label: "联网时间"
          }
      ],
      tableData:[],
      page:{
          DeptId:this.$store.state.userInfo.deptId,
          FireUnitName:'',
          DeviceState:'',
          MaxResultCount:10,
          SkipCount:0,
          total:0,
          current:1
      }
    }
   
  },
  created(){
    this.GetDeptFireUnitList();
  },
  methods:{
    onsearch(name){
      this.page.FireUnitName = name;
      this.page.SkipCount = 0;
      this.page.current = 1;
      this.GetDeptFireUnitList();
    },
    GetDeptFireUnitList(){
            this.$axios.get(this.$api.GetDeptFireUnitList,
                {params:this.page}
            ).then(res=>{
                // console.log("火警联网list",res);
                ({items: this.tableData,totalCount: this.page.total} = res.result);
            })
    }
  }
}
</script>

<style lang="less">
  .fireUnit{
      display: flex;
      flex-direction: column;
      height: 100%;
      .headerBox{
         text-align: left;
      }
      &>:nth-child(2){
          flex: 2 0 auto;
      }
  }
</style>