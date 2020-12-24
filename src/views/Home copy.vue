<template>
    <el-container class="home">
        <!-- 头部 -->
        <el-header class="display" style="height:auto">
            <el-col :span="20">
                <div class="display header-left">
                    <img @click="switchPage" class="logo_icon" src="../assets/images/logo.png" alt="">
                    <div class="logo_tilte">
                        <p class="logo_tilte_zn">城市消防安全用电数据可视化大屏</p>
                        <p>Visualized big screen of electric data for urban fire safety</p>
                    </div>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="header-right">
                    <span>{{$store.state.userInfo.areaName}}</span>
                    <img style="cursor: pointer;" @click="logout" src="../assets/images/top_img_04.png" alt="">
                </div>
            </el-col>
        </el-header>
        <!-- 主题内容 -->
        <el-main>
            <el-row :gutter="20">
                <!--  -->
                <el-col :span="10">
                    <div class="grid-content bg-purple-left">
                        <div class="bg-purple-left-top">
                            <div  v-for="(arr,index) in statusArr" :key="index">
                                <p>{{arr.text}}</p>
                                <p><span class="num">{{arr.num}}</span> <span class="unit">个</span></p>
                            </div>
                            <div>
                                <p>自动刷新时间间隔：60秒</p>
                                <p class="time">{{nowtime}}</p>
                            </div>
                        </div>
                        <div  class="bg-purple-left-map">
                            <el-select @change="selectarea" v-model="areavalue" placeholder="请选择">
                                <el-option
                                    v-for="item in areaoptions"
                                    :key="item.areaId"
                                    :label="item.areaName"
                                    :value="item.areaId">
                                </el-option>
                            </el-select>
                            <div id="mapBox"></div>
                        </div>
                    </div>
                </el-col>
                <!--  -->
                <el-col :span="7">
                    <div class="grid-content grid-content-center">
                        <div class="grid-content-center-top">
                            <div class="top-title">
                                <div>隐患及超限月度走势</div>
                            </div>
                            <div class="echarts_content" id="echarts_one">

                            </div>
                        </div>
                        <div class="grid-content-center-bottom">
                            <div class="top-title">
                                <div>警情类型月度走势</div>
                            </div>
                            <div class="echarts_content" id="echarts_two">

                            </div>
                        </div>
                    </div>
                </el-col>
                <!--  -->
                <el-col :span="7">
                    <div class="grid-content">
                        <div class="top-title">
                            <div>安全用电终端接入汇总</div>
                        </div>
                        <div class="echarts_content" id="echarts_safeElectric">

                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-main>
        <MapUnitReport ref="MapUnitReport"></MapUnitReport>
    </el-container>
</template>

<script>
let moment = require('moment')
import AMap from 'AMap'
import MapUnitReport from '../components/MapUnitReport.vue'
export default {
    components:{
        MapUnitReport
    },
    data(){
        return{
            statusArr:[
                {
                    text:'良好',
                    num:0
                },
                {
                    text:'故障',
                    num:0
                },
                {
                    text:'隐患',
                    num:0
                },
                {
                    text:'超限',
                    num:0
                },
                {
                    text:'离线',
                    num:0
                }
            ],
            nowtime:"",//当前时间
            mapObj:'',//地图对象
            areaoptions:'',
            areavalue:'融水',
            spotArray:[],
            echarts_oneDom:{},//隐患及超限echarts载体
            echarts_twoDom:{},//警情类型echarts载体
            echarts_safeElectricdom:{},//安全用电echarts载体
            infoWindow:{}
        }
    },
    created(){
        this.inittime();//获取当前时间
        setInterval(() => {//每60秒刷新一次
            setTimeout(()=>{
                this.inittime() //时间
                this.GetEngineerElectricDeviceState(this.$store.state.userInfo.areaId);
            }, 0)
        }, 60000);
        this.GetAreas();//
        this.GetEngineerElectricDeviceState(this.$store.state.userInfo.areaId);//初始化获取状态数量
    },
    mounted(){
        this.initmap();//初始化地图
        this.GetMonthElectricAlarmData(this.$store.state.userInfo.areaId,0)//初始化隐患及警情
        this.GetMonthElectricAlarmData(this.$store.state.userInfo.areaId,1)//初始化警情类型
        this.GetElectricHistogramData();
        //检测窗口变化
        window.onresize = () => {
           setTimeout(()=>{
               this.echarts_oneDom.resize();
               this.echarts_twoDom.resize();
               this.echarts_safeElectricdom.resize();
           })
        }
    },
    methods:{
        switchPage(){
            this.$router.push({
                name:'index'
            })
        },
        //初始化时间
        inittime(){
            this.nowtime =  moment().format("HH:mm")
        },
        //初始化地图
        initmap(){
            this.mapObj = new AMap.Map('mapBox', {
                resizeEnable: true, //自适应大小
                zoom: 10,//初始视窗
                center:[this.$store.state.userInfo.lng, this.$store.state.userInfo.lat],
                layers: [
                    // 卫星
                    new AMap.TileLayer.Satellite(),
                    // 路网
                    new AMap.TileLayer.RoadNet()
                ],
            });
            setTimeout(() => {
                this.setarea();
                this.makeMark(this.$store.state.userInfo.areaId);
            });
        },
        //行政区规划
        setarea() {
            let that = this;
            AMap.plugin('AMap.DistrictSearch', function () {
                var districtSearch = new AMap.DistrictSearch({
                    // 关键字对应的行政区级别
                    level: 'district',
                    //  显示下级行政区级数，1表示返回下一级行政区
                    subdistrict: 1,
                    // 返回行政区边界坐标等具体信息
                    extensions: "all",
                })
                // 搜索所有省/直辖市信息 
                districtSearch.search('融水', function(status, result) {
                    // 查询成功时，result即为对应的行政区信息
                    // console.log(result)
                    // 获取相关区域的边界信息
                    var bounds = result.districtList[0].boundaries
                    var polygons = []
                    if(bounds){
                        for (var i = 0, l = bounds.length; i < l; i++) {
                            //生成行政区划polygon
                            var polygon = new AMap.Polygon({
                                map: that.mapObj,
                                strokeWeight: 1,
                                path: bounds[i],
                                fillOpacity: 0.4,
                                fillColor: '#000000',
                                strokeColor: '#0000AA'
                            })
                            polygons.push(polygon)
                        }
                    }
                })
            })
        },
        //地图点标记
        makeMark(areaId){
            this.$axios.get(this.$api.GetFireUnitLatByArea,
                {params:{areaId}}
            ).then(res=>{
                console.log("获取的点位",res)
                this.spots =res.result;
                // this.spotArray =[];
                let icon = new AMap.Icon({
                    size: new AMap.Size(40, 50), // 图标尺寸
                    image:
                        "//datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/32a60b3e7d599f983aa1a604fb640d7e.gif" // Icon的图像
                });
                for (let item of  this.spots) {
                    let marker = new AMap.Marker({
                        position: new AMap.LngLat(item.lng, item.lat), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        title: item.fireunitId,
                        offset: new AMap.Pixel(-10, -10),
                        icon: icon
                    });
                    marker.item = item; // 自定义参数
                    marker.on('click',this.getMapMarkInfo)
                    this.spotArray.push(marker);
                }
                 console.log(this.spotArray)
                 this.mapObj.add(this.spotArray);
            })    
        },
        getMapMarkInfo(item){
            console.log("获取电文坐标",item)
            let Id = item ? item.target.item.fireunitId: "";
            this.$axios.get(this.$api.GetFireUnitInfo,
                {params:{UserId:this.$store.state.userInfo.userId,Id}}
            ).then(res=>{
                console.log("防火单位res",res);
                res.result.creationTime = this.dealTime(res.result.creationTime)
                var title = res.result.name,
                content=[];
                content.push(`【具体地址】${res.result.address}`);
                content.push(`【联网时间】${res.result.creationTime}`);
                this.infoWindow = new AMap.InfoWindow({  
                    isCustom: true,  //使用自定义窗体
                    content: this.createInfoWindow(title, content.join("<br/>"),res.result.id),
                    offset: new AMap.Pixel(16, -45)
                }); 
                this.infoWindow.open(this.mapObj, [item.target.item.lng,item.target.item.lat]);
            })
        },
        dealTime:(val)=>{
            var str = val.split('T');
            var str2 = str[1].split(".")
            var timestr = str[0] +" "+ str2[0]
            return timestr;
        },
        createInfoWindow(title, content,fID) {
            var info = document.createElement("div");
            info.className = "custom-info input-card content-window-card";

            //可以通过下面的方式修改自定义窗体的宽高
            //info.style.width = "400px";
            // 定义顶部标题
            var top = document.createElement("div");
            var titleD = document.createElement("div");
            var closeX = document.createElement("img");
            top.className = "info-top";
            titleD.innerHTML = title;
            closeX.src = "https://webapi.amap.com/images/close2.gif";
            closeX.onclick = this.closeInfoWindow;

            top.appendChild(titleD);
            top.appendChild(closeX);
            info.appendChild(top);

            // 定义中部内容
            var middle = document.createElement("div");
            middle.className = "info-middle";
            middle.style.backgroundColor = 'white';
            middle.innerHTML = content;

            let reportDiv = document.createElement('div')
            reportDiv.innerText = '智慧消防数据综合报告';
            reportDiv.style.textAlign="center"
            reportDiv.style.color="rgb(91, 183, 245)"
            reportDiv.style.cursor="pointer"
            reportDiv.style.textDecoration = 'line'
            reportDiv.style.borderBottom = '1px solid rgb(91, 183, 245)'
            reportDiv.onclick=()=>{
                this.openReportDialog(fID)
            }
            middle.appendChild(reportDiv)
            info.appendChild(middle);

            // 定义底部内容
            var bottom = document.createElement("div");
            bottom.className = "info-bottom";
            bottom.style.position = 'relative';
            bottom.style.top = '0px';
            bottom.style.margin = '0 auto';
            var sharp = document.createElement("img");
            sharp.src = "https://webapi.amap.com/images/sharp.png";
            bottom.appendChild(sharp);
            info.appendChild(bottom);
            return info;
        },
        //关闭
        closeInfoWindow() {
                // console.log("关闭")
                this.infoWindow.close();
        },
        openReportDialog(fID){
            console.log("fID",fID)
            this.$refs.MapUnitReport.perWeek(fID)
        },
        //获取安全用电各状态设备数量
        GetEngineerElectricDeviceState(areaId){
            this.$axios.get(this.$api.GetEngineerElectricDeviceState,
                {params:{areaId}}
            ).then(res=>{
                // console.log("获取安全用电各状态设备数量",res)
                this.statusArr[0].num = res.result.goodNum
                this.statusArr[1].num = res.result.faultNum
                this.statusArr[2].num = res.result.badNum
                this.statusArr[3].num = res.result.warnNum
                this.statusArr[4].num = res.result.offlineNum
            })
        },
        //获取子级区域
        GetAreas(){
            this.$axios.get(this.$api.GetAreas,
                {params:{ParentAreaId:this.$store.state.userInfo.areaId}}
            ).then(res=>{
                console.log("获取子级区域",res)
                
                let arr = {
                    areaId:30347,
                    areaName:'融水'
                }
                this.areaoptions = res.result;
                for(let arr of this.areaoptions){
                    if(arr.areaId == 30347){
                        return
                    }
                }
                this.areaoptions.unshift(arr)
            })
        },
        //清除点
        clearMarker(){
            this.mapObj.remove(this.spotArray)
            this.spotArray =[];
        },
        //选择区域
        selectarea(id){
            this.clearMarker();
            console.log("选择区域",id)
            this.makeMark(id)
            this.GetMonthElectricAlarmData(id,0)//初始化隐患及警情
            this.GetMonthElectricAlarmData(id,1)//初始化警情类型
            this.GetEngineerElectricDeviceState(id)
        },
        GetMonthElectricAlarmData(AreaId,DataType){//AreaId区域的id，DataType类型0 -隐患及警情 1-警情类型
            this.$axios.get(this.$api.GetMonthElectricAlarmData,
                {params:{AreaId,DataType}}
            ).then(res=>{
                if(DataType){
                    this.initEcharts_TWO(res.result)
                }else{
                    this.initEcharts(res.result)
                }
                
            })
        },
        initEcharts(result){
                this.echarts_oneDom  = this.$echarts.init(document.getElementById('echarts_one'));
                this.echarts_oneDom.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    color:['#4E95D4','#F57A27'],
                    legend: {
                        data: ['隐患', '超限'],
                        textStyle:{
                            color:'white'
                        },
                        top:'20px'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        data: result.month,
                        axisLabel:{
                            color:'white',
                            interval:0,//代表显示所有x轴标签显
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel:{
                            color:'white'
                        },
                        splitLine: {//设置坐标轴在 grid 区域中的分隔线。
                            lineStyle:{
                                color: ['#827E7E']
                            }
                        },
                    },
                    series: [
                        {
                            name: '隐患',
                            type: 'bar',
                            data: result.monthElectricAlarmDataList[0].typeNum
                        },
                        {
                            name: '超限',
                            type: 'bar',
                            data: result.monthElectricAlarmDataList[1].typeNum
                        }
                    ]
                })
        },
        initEcharts_TWO(result){
            this.echarts_twoDom  = this.$echarts.init(document.getElementById('echarts_two'));
            this.echarts_twoDom.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    color:['#4E95D4','#F57A27'],
                    legend: {
                        data: ['剩余电流', '电缆温度'],
                        textStyle:{
                            color:'white'
                        },
                        top:'20px',
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel:{
                            color:'white'
                        },
                        data: result.month
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel:{
                            color:'white'
                        },
                        splitLine: {//设置坐标轴在 grid 区域中的分隔线。
                            lineStyle:{
                                color: ['#827E7E']
                            }
                        },
                    },
                    series: [
                        {
                            name: '剩余电流',
                            type: 'line',
                            lineStyle:{
                                width:4
                            },
                            data: result.monthElectricAlarmDataList[0].typeNum
                        },
                        {
                            name: '电缆温度',
                            type: 'line',
                            lineStyle:{
                                width:4
                            },
                            data:result.monthElectricAlarmDataList[1].typeNum
                        }
                    ]
            })
        },
        //
        GetElectricHistogramData(){
            this.$axios.get(this.$api.GetElectricHistogramData,
                {params:{areaId:this.$store.state.userInfo.areaId}}
            ).then(res=>{
                this.echarts_safeElectric(res.result)
            })
        }, 
        //安全用电echarts图
        echarts_safeElectric(result){
            this.echarts_safeElectricdom = this.$echarts.init(document.getElementById('echarts_safeElectric'));
            this.echarts_safeElectricdom.setOption({
                color: ['#4E95D4'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'value',
                        axisLabel:{
                            color:'white'
                        },
                        splitLine: {
                            lineStyle:{
                                color: ['#827E7E']
                            }
                        }
                    }
                    
                ],
                yAxis: [
                    {
                        type: 'category',
                        data:result.typeNameList,
                        axisTick: {//坐标轴刻度相关设置。
                            alignWithLabel: true//可以保证刻度线和标签对齐
                        },
                        axisLabel:{
                            color:'white'
                        },
                    }
                    
                ],
                series: [
                    {
                        type: 'bar',
                        barWidth: '60%',
                        data: result.typeNumList
                    }
                ]
            })
        },
        //退出登录
        logout(){
            this.$confirm('你确定注销当前用户登录吗？', '注销登录', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'none'
            }).then(() => {
                this.$axios.post(this.$api.UserLogout).then(res=>{
                    console.log(res)
                    this.$message({
                        type: 'success',
                        message: '注销成功'
                    });
                    localStorage.clear();
                    this.$router.push({
                        name:'login'
                    })
                })
                
            }).catch(() => {
                         
            });
        }
    }
}
</script>

<style lang="less">
    @bgcolor:rgb(0, 0, 0);
    .home{
        height: 100vh;
        width: 100%;
        background: @bgcolor;
        color: white;
        .display{
            display: flex;
            align-items: center;
        }
        //-------------------------------
        .el-header{
            box-sizing: border-box;
            // border: 1px solid white;
            .header-left{
                .logo_icon{
                    width: 60px;
                    margin-right: 20px;
                }
                .logo_tilte{
                    font-size: 16px;
                    line-height: 1.5;
                    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
                    .logo_tilte_zn{
                        font-size: 26px;
                    }
                }
            }
            .header-right{
                text-align: right;
                line-height: 2;
                padding-right: 90px;
                cursor: pointer;
                img{
                    margin-left: 10px;
                }
                
            }
        }
        //------------------------------------------------------------
        .el-main{
            // box-sizing: border-box;
            // border: 1px solid white;
            padding: 10px 0px;
            .el-row{
                width: 100%;
                height: 100%;
                // box-sizing: border-box;
                margin: 0 !important;
                // background: wheat;
                .el-col{
                    height: 100%;
                    box-sizing: border-box;
                    .grid-content{
                        height: 100%;
                        box-sizing: border-box;
                        border-top-width: 4px;
                        border-top-style: solid;
                        .top-title{
                            padding: 6px 0px; 
                            height: 12%;
                            box-sizing: border-box;
                            border-radius: 2px;
                            text-align: center;
                            font-size: 20px;
                            div{
                                background: #242C38;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100%;
                            }
                        }
                    }
                    &:nth-of-type(1){
                        .grid-content{
                            border-top-color: #60A4E2;
                            &.bg-purple-left{
                                .bg-purple-left-top{
                                    width: 100%;
                                    height: 20%;
                                    // background: wheat;
                                    box-sizing: border-box;
                                    padding-top: 6px;
                                    display: flex;
                                    flex-wrap: wrap;
                                    justify-content: space-between;
                                    &>div{
                                        width: 33%;
                                        background: brown;
                                        height:47%;
                                        text-align: left;
                                        padding: 10px 0px 10px 30px;
                                        box-sizing: border-box;
                                        p{
                                            line-height: 1.5;
                                            .num{
                                                font-size: 30px;
                                                font-weight: bold;
                                                margin-right: 10px;
                                            }
                                            &.time{
                                                font-size: 30px;
                                            }
                                        }
                                        &:nth-of-type(1){
                                            background: #70AD47;
                                        }
                                        &:nth-of-type(2){
                                            background: #7F6000;
                                        }
                                        &:nth-of-type(3){
                                            background: #B38700;
                                        }
                                        &:nth-of-type(4){
                                            background: #A65822;
                                        }
                                        &:nth-of-type(5){
                                            background: #595959;
                                        }
                                        &:nth-of-type(6){
                                            background: #000;
                                        }
                                    }

                                }
                                .bg-purple-left-map{
                                    box-sizing: border-box;
                                    position: relative;
                                    width: 100%;
                                    height: 80%;
                                    border-image: url("../assets/images/mapBoeder.png") 32 37 repeat stretch;
                                    border-style: solid;
                                    border-width: 10px 10px;
                                    .el-select{
                                        position: absolute;
                                        z-index: 100;
                                        bottom: 26px;
                                        left: 10px;
                                        // width: 100px;
                                        .el-input{
                                            input{
                                                width: 100px;
                                                height: 50px;
                                                background: rgba(0, 0, 0, .8) !important;
                                                color: white !important; 
                                            }
                                        }
                                    }
                                    #mapBox{
                                        height: 100%;
                                    }
                                    .amap-info{
                                        .content-window-card {
                                            position: relative;
                                            box-shadow: none;
                                            bottom: -20px;
                                            left: 0;
                                            width: auto;
                                            padding: 0;
                                            p {
                                                height: 2rem;
                                            }
                                            div.info-top {
                                                position: relative;
                                                background: none repeat scroll 0 0 #F9F9F9;
                                                border-bottom: 1px solid #CCC;
                                                text-align: center;
                                                // border-radius: 5px 5px 0 0;
                                                div {
                                                    display: inline-block;
                                                    // color: #00c3ff;
                                                    color: #333;
                                                    font-size: 14px;
                                                    text-align: center;
                                                    font-weight: bold;
                                                    line-height: 31px;
                                                    padding: 0 24px;
                                                }
                                                img {
                                                    position: absolute;
                                                    top: 10px;
                                                    right: 4px;
                                                    transition-duration: 0.25s;
                                                    &:hover {
                                                        box-shadow: 0px 0px 5px rgb(128, 68, 68);
                                                    }
                                                }
                                            }
                                            div.info-middle {
                                                font-size: 14px;
                                                padding: 10px 6px;
                                                line-height: 20px;
                                                color: rgb(112, 112, 121);
                                            }
                                            div.info-bottom {
                                                height: 0px;
                                                width: 100%;
                                                clear: both;
                                                text-align: center;
                                                img {
                                                    position: relative;
                                                    z-index: 104;
                                                }
                                            }
                            
                                        }
                                        .custom-info {
                                                border: solid 1px rgb(179, 168, 168);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    &:nth-of-type(2){
                        .grid-content{
                            border-top-color: #EC7C30;
                            &>div{
                                width: 100%;
                                height: 50%;
                                .echarts_content{
                                    height: 88%;
                                    width: 100%;
                                    background: #535353;
                                }
                            }
                        }
                    }
                    &:nth-of-type(3){
                        .grid-content{
                             border-top-color: #73B349;
                            .top-title{
                                height: 6%;
                            }
                            .echarts_content{
                                height: 94%;
                                width: 100%;
                                background: #535353;
                            }
                        }
                    }
                }

            }
        }
       
    }
    .el-select-dropdown__wrap{
        max-height: none !important;
    }
</style>