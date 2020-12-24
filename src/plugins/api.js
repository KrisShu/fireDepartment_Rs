const API = {
    UserLogin:'/api/services/app/FireDeptUser/UserLogin',// 用户登录
    GetVerifyCode:'/api/services/app/FireDeptUser/GetVerifyCode',//获取验证码
    UserLogout:'/api/services/app/FireDeptUser/UserLogout',//注销用户


    GetAreas:'/api/services/app/Area/GetAreas',// 根据区域Id获取下级区域
    GetEngineerElectricDeviceState:'/api/services/app/FireDevice/GetEngineerElectricDeviceState',// 根据区域Id获取安全用电各状态设备数量
    GetFireUnitLatByArea:'/api/services/app/FDBigScreen/GetFireUnitLatByArea',// 获取区域内防火单位列表（经纬度）
    GetFireUnitLngLatByArea:'/api/services/app/FDBigScreen/GetFireUnitLngLatByArea',//


    
    GetMonthElectricAlarmData:'/api/services/app/Alarm/GetMonthElectricAlarmData',// 获取安全用电警情月度走势数据
    GetElectricHistogramData:'/api/services/app/FireDevice/GetElectricHistogramData',//获取各区域安全用电终端数量统计
    GetFireUnitInfo: "/api/services/app/FireUnit/GetFireUnitInfo", //防火单位信息
    GetFireUnitReport:'/api/services/app/FireUnit/GetFireUnitReport',//获取防火单位的综合数据报告
    //隐患及警情
    GetDeptFireAlarmList:'/api/services/app/Alarm/GetDeptFireAlarmList',// 监管平台：获取火警联网数据列表
    GetDeptFireAlarmListExcel:'/api/services/app/Alarm/GetDeptFireAlarmListExcel',//监管平台：导出火警联网数据
    GetDetectorBitMap:'/api/services/app/FireDevice/GetDetectorBitMap',//获取某条火警对应的部件的点位图数据

    //-独立火警
    GetDeptIndependentAlarmList:'/api/services/app/Alarm/GetDeptIndependentAlarmList' ,//监管平台：获取独立火警数据列表
    GetDeptIndependentAlarmListExcel:'/api/services/app/Alarm/GetDeptIndependentAlarmListExcel', //监管平台：导出独立火警数据


    //-安全用电
    GetDeptElectricAlarmList:'/api/services/app/Alarm/GetDeptElectricAlarmList',// 监管平台：获取安全用电数据列表
    GetDeptElectricAlarmListExcel:'/api/services/app/Alarm/GetDeptElectricAlarmListExcel' ,//监管平台：导出安全用电数据

    //-消防管网
    GetDeptWaterAlarmList:'/api/services/app/Alarm/GetDeptWaterAlarmList',//监管平台：获取消防管网警情数据列表
    GetDeptWaterAlarmListExcel:'/api/services/app/Alarm/GetDeptWaterAlarmListExcel',//监管平台：导出消防管网警情数据

    //--------消防设施---------
    GetDeptFireAlarmDeviceStateNum:'/api/services/app/FireDevice/GetDeptFireAlarmDeviceStateNum',// 监管平台：获取火警联网设施状态数量
    GetDeptFireAlarmDeviceList:'/api/services/app/FireDevice/GetDeptFireAlarmDeviceList',// 监管平台：获取火警联网设施列表
    GetFireAlarmFaultDetectorList:'/api/services/app/FireDevice/GetFireAlarmFaultDetectorList',//获取指定设备ID的故障部件列表
    GetFireAlarm30DayList:'/api/services/app/FireDevice/GetFireAlarm30DayList',//获取火警联网设施最近30天的火警列表数据
    GetFireAlarmHighList:'/api/services/app/FireDevice/GetFireAlarmHighList',//获取指定火警联网设施ID的高频报警部件列表



    //-独立火警
    GetDeptIndependentDeviceStateNum:'/api/services/app/IndependentDetector/GetDeptIndependentDeviceStateNum', //监管平台：获取独立火警设施状态数量
    GetDeptIndependentDetectorList:'/api/services/app/IndependentDetector/GetDeptIndependentDetectorList', //监管平台：获取独立火警设备数据列表
    //-安全用电
    GetDeptElectricDeviceStateNum:'/api/services/app/FireDevice/GetDeptElectricDeviceStateNum',// 监管平台：获取安全用电设施状态数量
    GetDeptElectricDeviceList:'/api/services/app/FireDevice/GetDeptElectricDeviceList',//监管平台：获取安全用电设施列表
    GetSingleElectricDeviceData:'/api/services/app/FireDevice/GetSingleElectricDeviceData',//刷新某一电气火灾设备的当前数值
    BreakoffPower:'/api/services/app/FireDevice/BreakoffPower',//发送断电信号
    DeleteFireElectricDevice:'/api/services/app/FireDevice/DeleteFireElectricDevice',//删除电气火灾设备
    GetRecordElectric:'/api/services/app/FireDevice/GetRecordElectric',//获取电气火灾监测单个项目的模拟量趋势

    GetFireElectricDevicePara:'/api/services/app/FireDevice/GetFireElectricDevicePara',//根据Id获取电气火灾设施参数详情
    UpdateFireElectricDevicePara:'/api/services/app/FireDevice/UpdateFireElectricDevicePara',//修改电气火灾设施参数


    //-消防管网
    GetDeptWaterDeviceStateNum:'/api/services/app/FireDevice/GetDeptWaterDeviceStateNum' ,//监管平台：获取消防管网设施状态数量
    GetDeptWaterDeviceList:'/api/services/app/FireDevice/GetDeptWaterDeviceList', //监管平台：获取消防管网设施列表
    //------------防火单位----------
    GetDeptFireUnitList:'/api/services/app/FireUnit/GetDeptFireUnitList',// 监管平台：获取防火单位列表

    //-------------市政消火栓--------------
    GetDeptHydrantList:'/api/services/app/Hydrant/GetDeptHydrantList', //监管平台：获取市政消火栓列表
    GetDeptPressureList:'/api/services/app/Hydrant/GetDeptPressureList', //监管平台：获取市政消防管网列表
    GetDeptHydrantAlarmList:'/api/services/app/Hydrant/GetDeptHydrantAlarmList', //监管平台：获取市政消火栓警情列表
}

export default API;