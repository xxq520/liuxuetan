Component({
    externalClasses: ['i-class'],

    properties: {
        indexData: {
            type: Object
        }
    },
    lifetimes: {
        attached: function() {
          // 在组件实例进入页面节点树时执行
          console.log(this.properties.indexData,45454)
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
        },
      },
      methods:{
        goPostdetails(e){
            // 如果是普通帖子
            if (e.currentTarget.dataset.type==1){
              wx.navigateTo({
                url: '/postList/postDetails/postDetails?id='+e.currentTarget.dataset.id+"&index="+e.currentTarget.dataset.index,
              })
            } else {
              wx.navigateTo({
                url: '/postList/problemDetails/problemDetails?id='+e.currentTarget.dataset.id+"&index="+e.currentTarget.dataset.index,
              })
            }
          },
      }
});
