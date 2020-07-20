// 请求域名
const url = "http://uksefws.liuxuetalk.com";
// 请求后台的url不包括请求参数 若需查询请求参数 到相应的页面查找
module.exports = {
    url: url,
    // 获取AccessKey
    getAccessKey: url + `/wsKeyTestTool.asmx/GenKey`,
    // 留学谈用户登录
    userLogin: url + `/wsGenericDatabind.asmx/ValUserLogin`,
    // 首页 获取新闻帖子数据
    indexNews: url + "/wsNewsDatabind.asmx/GetNewsItems",
    // 首页 获取用户关注的新闻类型
    userLickType: url + "/wsNewsDatabind.asmx/GetUserFavNewsItems",
    // 获取发现页的tabbar选项卡
    GetHotTagsGroup: url + "/wsNewsDatabind.asmx/GetHotTagsGroup",
    // 获取聊天组列表数据
    getMessageList: url + "/wsMessageDatabind.asmx/GetUserChatGroupList",
    // 获取新闻评论列表
    GetNewsItemCommentsItems: url + "/wsNewsDatabind.asmx/GetNewsItemCommentsItems",
    // 添加新闻评论
    SaveNewsCommentRecord :  url + "/wsNewsDatatrans.asmx/SaveNewsCommentRecord",
    // 收藏文章或点赞文章
    SaveUserNewOption : url + "/wsNewsOptionDatatrans.asmx/SaveUserNewOption",
    // 关注某个用户
    SaveUserFavForumAdmin : url + "/wsNewsOptionDatatrans.asmx/SaveUserFavForumAdmin",
    // 获取信息聊天历史
    GetChatGroupHistory : url + "/wsMessageDatabind.asmx/GetChatGroupHistory",
    // 保存用户发送的聊天信息
    SaveChatGroupMessage : url + "/wsMessageDatatrans.asmx/SaveChatGroupMessage",
    // 上传图片
    uploadImg: "http://www.liuxuetalk.com/components/uploads/uploadfile.ashx?type=PostHeadingImage",
    // 发布文章发布问答
    SaveNewsRecord : url + "/wsNewsDatatrans.asmx/SaveNewsRecord",
    // 注册接口
    SaveRegisterRecord : url + "/wsRegisterDatatrans.asmx/SaveRegisterRecord",
    // 发送验证码
    SendRegisterVerifyCode : url + "/wsRegisterDatatrans.asmx/SendRegisterVerifyCode",
    // 获取话题专栏简介信息
    GetUniIntroRow :url + "/wsNewsDatabind.asmx/GetUniIntroRow",
    // 给文章评论点赞（不是给文章点赞）
    LikeNewsCommentRecord : url + "/wsNewsDatatrans.asmx/LikeNewsCommentRecord",
    // 获取用户发表的文章或问题
    GetUserQuestionItems : url + "/wsNewsDatabind.asmx/GetUserQuestionItems",
    // 用户收藏的文章或问题
    GetUserFavNewsItems : url + "/wsNewsDatabind.asmx/GetUserFavNewsItems",
    // 获取发布文章或问题作者的信息
    GetNewUserProfilePopupDetails : url + "/wsForumDatabind.asmx/GetNewUserProfilePopupDetails",
    // 获取某个热门标签的关注数或浏览量
    GetTagStatistics : url + "/wsNewsDatabind.asmx/GetTagStatistics",
    // 判断是否是当前用户关注的标签
    CheckUserFavTopic : url + "/wsNewsDatabind.asmx/CheckUserFavTopic",
    // 关注某一个标签或取消关注，用于话题专栏
    SaveUserFavTags : url + "/wsNewsOptionDatatrans.asmx/SaveUserFavTags",
    // 更新用户中心的数据
    UpdateUserDetailsRecord : url + "/wsNewsOptionDatatrans.asmx/UpdateUserDetailsRecord",
    // 获取用户未读信息数m0..0.
   GetUserUnreadMessageCount : url + "/wsGenericDatabind.asmx/GetUserUnreadMessageCount",
    // 删除某一文章87
    DeleteNewsRecord : url + "/wsNewsDatatrans.asmx/DeleteNewsRecord",
    // 查询用户是否是顾问身份
    GetUserAgent : url + "/wsAgentDatabind.asmx/GetUserAgent",
    // 获取本月收益和本年收益
    GetAgentMonthlyTransaction : url +"/wsAgentDatabind.asmx/GetAgentMonthlyTransaction",
    // 获取当前顾问的概括信息(未完成订单/全部订单)
    GetAgentOverviewDetails : url +"/wsAgentDatabind.asmx/GetAgentOverviewDetails",
    // 获取当前可以申请的产品服务分类选择
    GetAgentProductTypeList : url + "/wsAgentDatabind.asmx/GetAgentProductTypeList",
    // 获取我的产品下的查询商品分类选择
    GetAgentProductType : url + "/wsAgentDatabind.asmx/GetAgentProductType",
    // 获取当前销售中的产品
    GetAgentProductItems : url + "/wsAgentDatabind.asmx/GetAgentProductItems",
    // 获取管理员的通知
    GetAdminToAgentNotification : url + "/wsAgentDatabind.asmx/GetAdminToAgentNotification",
    // 获取当前用户的提示事项
    GetAgentNotification : url + "/wsAgentDatabind.asmx/GetAgentNotification",
    // 获取订单列表数据
    GetAgentOrderItems : url + "/wsAgentDatabind.asmx/GetAgentOrderItems",
    // 获取当前顾问交易额和次数
    GetAgentOrderProductTypeTransaction : url + "/wsAgenttransDatabind.asmx/GetAgentOrderProductTypeTransaction",
    // 保存 管理员通知
    SaveAgentNotify : url + "/wsAgentDatatrans.asmx/SaveAgentNotify",
    // 顾问创建产品
    SaveAgentProductRecord : url + "/wsAgentDatatrans.asmx/SaveAgentProductRecord",
    // 保存可查询的产品类型选项
    SaveAgentProductTypeApplication : url + "/wsAgentDatatrans.asmx/SaveAgentProductTypeApplication",
    // 设置产品是否有效
    SetAgentProductValid : url + "/wsAgentDatatrans.asmx/SetAgentProductValid",
    // 新建订单记录
    SaveAgentOrderRecord : url + "/wsAgentDatatrans.asmx/SaveAgentOrderRecord",
    // 获取订单的状态
    GetAgentOrderStatus : url + "/wsAgentDatabind.asmx/GetAgentOrderStatus",
    // 获取顾问商家列表数据
    GetAgentDetailsList : url + "/wsAgentDatabind.asmx/GetAgentDetailsList",
    // 创建聊天组信息
    CreateChatDirectGroup : url +"/wsMessageDatatrans.asmx/CreateChatDirectGroup",
    // 获取客户端订单列表数据
    GetUserAgentOrderList : url +"/wsAgentDatabind.asmx/GetUserAgentOrderList",
    // 获取订单提醒记录
    GetAgentOrderNotification : url +"/wsAgentDatabind.asmx/GetAgentOrderNotification",
    // 获取订单任务状态  例如：未完成  处理中 已完成名称
    GetAgentOrderTaskStatus : url +"/wsAgentDatabind.asmx/GetAgentOrderTaskStatus",
    // 获取订单任务列表
    GetAgentOrderTaskList  : url +"/wsAgentDatabind.asmx/GetAgentOrderTaskList",
    // 保存任务订单列表数据
    SaveAgentOrderTasksArrayList : url+"/wsAgentDatabind.asmx/SaveAgentOrderTasksArrayList",
};