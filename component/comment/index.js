Component({
    externalClasses: ['i-class'],

    properties: {
      comment: {
            type: Object
        }
    },
    lifetimes: {
        attached: function() {
          // 在组件实例进入页面节点树时执行
          console.log(this.properties.comment,45454)
        },
        detached: function() {
          // 在组件实例被从页面节点树移除时执行
        },
      },
      methods:{
        LikeComment(value){
          this.triggerEvent('callLikeCommentFun', value)
        },
        showPopup(value) {
          console.log(value,74546)
          this.triggerEvent('callSomeFun', value)
        },
        goPostdetails(e){
            // 如果是普通帖子
            let item = e.currentTarget.dataset.item;
            let preview = wx.getStorageSync('preview')||[];
            let previewFilter = preview.filter(function(newS,index){
              return newS.new_key == item.new_key
            })
            if(!previewFilter.length) {
              preview.unshift(item);
              wx.setStorageSync('preview', preview)
            }
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
