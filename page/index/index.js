// page/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    notes:[],
    toplist:[],
    touch:{},
    time:[],
    add:false,
    temp: {
      title: '',
      length: 50,
      detail: '',
      time: [],
      tag: "",
      show: false,
      istop:false
    },
    width:0,
    detail : "temp.detail",
    value:"",
    addmodel:false,
    mask:false,
    control:false,
    panellist:[
      {
        name:'主题颜色',
        check:false,
        value:'8082F6'
      },
      {
        name: '辅助颜色',
        check: false,
        value: 'FFA3A3'
      },
      {
        name: '背景颜色',
        check: false,
        value: 'C0ECFF'
      },
      {
        name: '阴影颜色',
        check: false,
        value: '6D6FC6'
      },
      {
        name: '字体颜色',
        check: false,
        value: 'ffffff'
      }
    ],
    sort:true
  },

  changesort(e){

    var list = this.data.notes;

    if(this.data.sort){

      // console.log('紧急');
      list.sort(function (a, b) {
        return b.length - a.length;
      });
      
    }else{

      // console.log('时间');
      list.sort(function (a, b) {
        return a.time > b.time ? 1 : -1;
      })

    }

    // console.log(list);

    this.setData({
      notes: list,
      sort: !this.data.sort
    })
    
  },

  heihei(e){

    this.setData({
      touch:e.touches[0].pageX
    })

  },

  haha(e){

    // console.log(e);
    const id = e.currentTarget.dataset.idx;
    if(!e.currentTarget.dataset.istop){
      // console.log("notop");
      var idstr = "notes[" + id + "].tag";
      var ifshow = "notes[" + id + "].show";
      var time = "notes[" + id + "].time";
      var show = this.data.notes[id].show;
      var tag = this.data.notes[id].tag;
    }else{
      // console.log("top");
      var idstr = "toplist[" + id + "].tag";
      var ifshow = "toplist[" + id + "].show";
      var time = "toplist[" + id + "].time";
      var show = this.data.toplist[id].show;
      var tag = this.data.toplist[id].tag;
    }
    // console.log(idstr);

    const distance = e.changedTouches[0].pageX - this.data.touch;

    if (!show){

      if (tag == ""){

        if (distance < -20) {

          this.setData({
            [idstr]: "del"
          })

        } else if (distance > 20) {
          // console.log("Top!")
          this.setData({
            [idstr]: "totop"
          })
        }else{

          // console.log(timelist);
          this.setData({
            [ifshow]: true
          })

        }

      }else{

        if(distance < -20){
          this.setData({
            [idstr]: ""
          })
        }else if(distance > 20){
          this.setData({
            [idstr]: ""
          })
        }
      }

    } else {
      
        this.setData({
          [ifshow]: false
        })
      
    }
    
  },
  
  
  del(e){

    console.log(e);
    const time = e.currentTarget.dataset.time;

    if(!e.currentTarget.dataset.istop){

      var orglist = wx.getStorageSync('notes');

      for ( var i = 0 ; i < orglist.length ; i ++ ){

        if(orglist[i].time == time){
          orglist.splice(i,1);
          break;
        }

      }

      wx.setStorageSync('notes', orglist);
      this.setData({
        notes:orglist
      })

    }else{

      var toplist = wx.getStorageSync('top');

      for (var i = 0; i < toplist.length; i++) {

        if (toplist[i].time == time) {
          toplist.splice(i, 1);
          break;
        }

      }

      wx.setStorageSync('top', toplist);
      this.setData({
        toplist
      })
    }

  },

  totop(e) {

    // gain id 
    const intid = e.currentTarget.dataset.idx;
    var toplist = wx.getStorageSync('top') || [];
    var orglist = wx.getStorageSync('notes')||[];

    if(!e.currentTarget.dataset.istop){

      console.log("totop!");

      const item = this.data.notes[intid];  // 获得改动元素
      
      item.tag = "";  // 修改改动元素标签
      item.istop = true;  // 修改改动元素置顶

      orglist.splice(intid, 1); //从原数组剔除元素

      toplist.push(item); //在新数组增加元素

      // 设置缓存
      wx.setStorageSync('notes', orglist);
      wx.setStorageSync('top', toplist);
      
    }else{

      console.log("canceltop!");

      const item = toplist[intid];  // 获得改动元素
      item.tag = "";  // 修改改动元素标签
      item.istop = false;  // 修改改动元素置顶

      toplist.splice(intid,1);  //从原数组剔除元素

      orglist.push(item); //在新数组增加元素

      // 设置缓存
      wx.setStorageSync('notes', orglist);
      wx.setStorageSync('top', toplist);

    }
    
    this.setData({
      toplist,
      notes: orglist,
    })


  },

  change(e){

    const curwidth = 1 - ( 750/this.data.width * e.changedTouches[0].pageX - 75 - 30 ) / 540 ;

    const length = "temp.length";
    // console.log(curwidth);

    this.setData({
      [length]: curwidth * 100
    })
  
  },

  createTime(e){

    var date = new Date();

    var ss = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    return ss;

  },

  add(e){

    if(this.data.temp.title == ""){

      wx.showToast({
        title: '标题不能为空',
        icon: 'none'
      })

      return;
    }
    const temp = this.data.temp;
    const ss = this.createTime();
    const time = "temp.time";
    const length = "temp.length";

    this.setData({
      [time]:ss,
      [length]:temp.length,
      add:false,
      mask:false
    })

    const list = this.data.notes||[];
    list.push(temp);
    wx.setStorageSync('notes', list);
    const newlist = wx.getStorageSync('notes');
    //传输数据

    // console.log(this.data.temp);

    this.setData({
      value:"",
      [length]:50,
      notes:newlist
    })
  },

  cancel(e){

    this.setData({
      add: false,
      mask:false
    })

  },

  changetitle(e){

    const title = "temp.title";

    this.setData({
      [title]:e.detail.value
    })
  },

  changedetail(e){

    this.setData({
      [this.data.detail]: e.detail.value
    })

  },

  onLoad(){

    const list = wx.getStorageSync('notes')||[];
    const toplist = wx.getStorageSync('top')||[];

    this.setData({
      notes:list,
      toplist,
      width:wx.getSystemInfoSync().windowWidth
    })
  },

  showpanel(){
    
    this.setData({
      add:true,
      mask:true
    })

  },

  control(e){

    if (!this.data.control) {
      this.setData({
        control: true,
        mask: true
      })
    } else {
      this.setData({
        control: false,
        mask: false
      })
    }
   
  },

  changecolor(e){

    const id = e.currentTarget.dataset.idx;
    const check = "panellist[" + id + "].check";

    if(!this.data.panellist[id].check){

      this.setData({
        [check]: true
      })
      
    }else{

      this.setData({
        [check]: false
      })

    }
    
  },

  oninputtt(e){
    
    clearTimeout(this.TimeId);

    this.TimeId = setTimeout(()=>{

      const id = e.currentTarget.dataset.idx;
      const aim = 'panellist[' + id + '].value';

      // console.log(e);

      this.setData({
        [aim]:e.detail.value
      })
    },500)

  }
})