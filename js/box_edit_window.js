editBoxWindow = function(grid, box_id) {
  var wnd = this;

  var frm = new Ext.FormPanel({
    xtype : 'form',
    width : 180,
    defaultType : 'textfield',
    fileUpload : true,
    frame : true,
    url : 'box_manager_back.php?func=box_update',
    labelAlign : 'right',
    labelPad : 10,
    labelWidth : 80,
    items : [ {
      xtype : 'textfield',
      name : 'box_id',
      hidden : true,
      value : box_id
    }, {
      xtype : 'textfield',
      name : 'box_no',
      allowBlank : false,
      anchor : '90%',
      fieldLabel : '格子序号',
      labelStyle : 'font-weight:bold;',
      emptyText : '填写格式：1-1'
    }, {
      xtype : 'textfield',
      name : 'goods_name',
      allowBlank : false,
      anchor : '90%',
      fieldLabel : '商品名称',
      labelStyle : 'font-weight:bold;'
    }, {
      xtype : 'numberfield',
      name : 'goods_price',
      allowBlank : false,
      anchor : '55%',
      fieldLabel : '商品价格',
      labelStyle : 'font-weight:bold;'
    }, {
      xtype : 'textfield',
      name : 'goods_url',
      anchor : '90%',
      fieldLabel : '商品介绍链接',
      labelStyle : 'font-weight:bold;'
    }, {
      xtype : 'radiogroup',
      name : 'status',
      allowBlank : false,
      anchor : '55%',
      fieldLabel : '是否有货',
      labelStyle : 'font-weight:bold;',
      items : [ {
        boxLabel : '有货',
        name : 'status',
        inputValue : '1'
      }, {
        boxLabel : '无货',
        name : 'status',
        inputValue : '0'
      } ]
    }, {
      xtype : 'fileuploadfield',
      name : 'photo',
      emptyText : '选择商品图片',
      fieldLabel : 'Photo',
      buttonText : '',
      anchor : '90%',
      buttonCfg : {
        iconCls : 'upload-icon'
      }
    }, {
      fieldLabel : '商品图片',
      xtype : 'label',
      html : '<div id="photo_content"></div>',
      ref : 'photo_content'
    } ],
    buttons : [
        {
          text : '确定',
          handler : function() {
            var button = this;
            this.disable();
            frm.getForm().submit(
                {
                  timeout : 600,
                  waitTitle : 'Manager',
                  waitMsg : 'Doing...',
                  success : function(form, action) {
                    if (action.result.success == 'true') {
                      ShowMessage('Manager', '操作完成 ', 'INFO');
                      wnd.destroy();
                      grid.store.load();
                    } else if (action.result.success == 'false') {
                      ShowMessage('Manager', decodeURI(action.result.msg),
                          'ERROR');
                    }
                  },
                  failure : function(form, action) {
                    if (action != null && action.result != null
                        && action.result.msg != null) {
                      ShowMessage('Manager', decodeURI(action.result.msg),
                          'ERROR');
                    }
                  }
                });
          }
        }, {
          text : '取消',
          handler : function() {
            wnd.destroy();
          }
        } ]
  });

  editBoxWindow.superclass.constructor.call(this, {
    closeAction : 'destroy',
    items : [ frm ],
    height : 340,
    width : 540,
    layout : 'fit',
    border : false,
    frame : true,
    title : '修改商品信息',
    modal : true,
    plain : true,
  });
  this.on("beforeshow", function() {
    frm.getForm().load({
      url : 'box_manager_back.php?func=box_info',
      params : {
        box_id : box_id
      },
      success : function(form, action) {
        if (action.result.data.status == 1) {
          frm.getForm().findField('status').items.get(0).setValue(true);
        } else {
          frm.getForm().findField('status').items.get(1).setValue(true);
        }
        var goods_image = action.result.data.goods_image;
        if (goods_image != '' && goods_image != null) {
          frm.photo_content.setVisible(true);
          document.getElementById("photo_content").innerHTML = "<img src='"
              + PHOTO_URL_PREFIX
              + goods_image
              + "' widht='65px' height='65px' onclick='window.open(this.src)' />";
        }
      }
    });
  });
}

Ext.extend(editBoxWindow, Ext.Window, {});