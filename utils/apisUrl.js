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
    DeleteNewsRecord : url + "/wsNewsDatatrans.asmx/DeleteNewsRecord"

};