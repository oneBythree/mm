$(document).ready(function() {

    //加载公用头部
    // $('#sideBar').load('sideBar.html');
    // $('#topBar').load('topBar.html');

    var level = sessionStorage.getItem('silderLevel');
    var thisEl = $("[data-level=" + level + "]");
    $('.sub1').hide();
    $('#list a').removeClass('active');
    thisEl.addClass('active');
    $("[data-level=" + level + "]").parents('.sub1,.sub2').slideDown();
    if (thisEl.next().hasClass('sub2') || thisEl.next().hasClass('sub1')) {
        thisEl.next().slideDown();
    }
    
    $('body').on('click', '.iframeLink', function() {
        var url = $(this).attr('data-url');
        window.parent.window.frames['iFrame1'].frameElement.src = url;
    })


    $('#sideBar').on('click', 'a.item', function(event) {
        $('#listshow a.item').removeClass('active');
        $(this).addClass('active');
        var curele = $(this).nextAll('ul');
        var thisList1 = $(this).parents('.sub1');
        $('.sub1').not(thisList1).slideUp();
        if (curele !== null) {
            if (curele.is(':hidden')) {
                curele.slideDown();
            } else {
                curele.slideUp();
            };
        };
        sessionStorage.removeItem("silderLevel");
        var level = $(this).attr('data-level');
        console.log(level);
        sessionStorage.setItem('silderLevel', level);
    });
    
    $('#sideBar .right-left').on('click',function(){
    	console.log(111)
    	if($('#sideBar').hasClass('right')){
    		$('#sideBar').removeClass('right');
    		$('.container-main').removeClass('all');
    	}else{
    		$('#sideBar').addClass('right');
    		$('.container-main').addClass('all');
    	}
    })
	
		//个人信息弹窗
    $('li.info').on('click',function(){
    	if($('.info-manager').is(':hidden')){
    		$('.info-manager').show();
    	}else{
    		$('.info-manager').hide();
    	}
    })
    
    $(document).on('click', function(event) {
        if (!$('.info-manager').is(':hidden') && !$(event.target).parents('li').hasClass('info')) {
              $('.info-manager').hide();
        }
    });

})


//获取哈希值
function localParam(search) {
    var search = search || window.location.search;
    var fn = function(str, reg) {
        if (str) {
            var data = {};
            str.replace(reg, function($0, $1, $2, $3) {
                data[$1] = $3;
            });
            return data;
        }
    }
    return (fn(search, new RegExp("([^?=&]+)(=([^&]*))?", "g")));
}



/**
 *  e追溯封装ajax
 * @type {Object}
 */
var myAjax = {
    'formAjax': function(el, successFuc) { //提交表单
        $(el).submit(function(event) {
            var form = $(this);
            $.ajax({
                url: form.attr('action'),
                type: form.attr('method'),
                data: form.serialize(),
                success: function(data) {
                    successFuc && successFuc(data)
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    sweetAlert("请求服务错误,错误码" + textStatus, "", "error");
                }
            });
        });
    },
    'tableAjax': function(url, successFuc, type) {
        var strType = type == "POST" ? "POST" : "GET";
        $.ajax({
            url: jsonUrl,
            type: strType,
            // async: false, //同步进行（否则ifram标签不能自适应）
            success: function(data) {
                if (data[0].result) {
                    slef.$set('tableList', data[0].data.data);
                    var nullLength = new Array(10 - data[0].data.data.length);
                    slef.$set('nullLength', nullLength);
                    var dataPageAll = Math.ceil(data[0].data.total / 10)
                    slef.$set('all', dataPageAll);
                } else {
                    swal("请求服务失败", data[0].message, "error");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                sweetAlert("请求服务错误,错误码" + textStatus, "", "error");
                //console.log(status)
            }
        })
    }
}