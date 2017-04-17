//子页面引用js

/**
 * 获取数据 循环列表和分页
 * @param   jsonUrl [请求的url]
 * @return {[type]}         [description]
 */
var vm;

function tableInit(jsonUrl, defaultJson) {
	defaultJson = defaultData(defaultJson);
	vm = new Vue({
		el: "#tableList",
		data: function() {
			return {
				'nullLength': 10,
				'tableList': [],
				all: null, //总页数
				cur: 1, //当前页码
				searchData: {},
				thisUrl: null,
				keyNum: '',
				isSearch:false
			}
		},
		ready: function() {
			//this.init();
			var slef = this;
			this.thisUrl = jsonUrl;
			TableAjax(slef, jsonUrl, defaultJson);
			tableHeight();
		},
		methods: {
			init: function() {
				var slef = this;
			},
			lookOver: function(item, params, title) {
				OnLookOver(item, params, title);
			},
			linkUrl: function(item, url) {
				window.location.href = url + item;
			},
			del: function(item, swalVal, delVal) {
				var slef = this;
				var name = swalVal.swalTitle;
				console.log(this.thisUrl)
				swal({
					title: "您是否确认删除" + swalVal.swalZh + " " + name + " ？",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: '#DD6B55',
					confirmButtonText: "确认删除",
					cancelButtonText: "取消删除",
					closeOnConfirm: false,
				}, function() {
					$.ajax({
						url: delVal.delUrl,
						data: {
							'id': delVal.delId
						},
						type: 'GET',
						success: function(data) {
							if(data.result) {
								slef.tableList.$remove(item);
								swal("删除成功", data.message, "success");
								TableAjax(slef, slef.thisUrl, slef.searchData);
							} else {
								swal("删除失败", data.message, "error");
							}

						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							sweetAlert("请求服务错误,错误码" + textStatus, "", "error");
						}
					});

				});
			},
			changeType: function(obj) { //状态改变
				var that = this;
				if(!obj.hasOwnProperty('url') || !obj.hasOwnProperty('data')) {
					return false;
				}
				var _url = obj.url + obj.data;
				var _type = !obj.hasOwnProperty('type') == 'GET' ? 'GET' : obj.type;
				var _data = {
					'el': that,
					'url': _url,
					'type': _type
				}
				OnChangeType(_data);
			},
			btnClick: function(data) { //页码点击事件
				if(data != this.cur) {
					this.cur = data;
				}
			},
			linkFirst: function() {
				this.cur = 1;
			},
			linkLast: function() {
				this.cur = this.all;
			},
			actionClean: function(obj) {
				if(!obj.hasOwnProperty('url') || !obj.hasOwnProperty('data') || !obj.hasOwnProperty('typeCode')) {
					swal("参数错误！", '', "error");
					return false;
				}
				if(obj.typeCode != '启用'){
					onActionClean(obj);
				}else{
				   swal("请先启用！", '', "warning");
				}
				
			},
			linkPage: function() {
				if(this.keyNum != '' && this.keyNum != this.cur) {
					this.cur = parseInt(this.keyNum);
				} else {
					this.keyNum = '';
				}
			}
		},
		computed: {
			showLast: function() {
				if(this.cur == this.all) {
					return false;
				}
				return true;
			},
			showFirst: function() {
				if(this.cur == 1) {
					return false;
				}
				return true;
			},

			indexs: function() {
				var left = 1;
				var right = this.all;
				var ar = [];
				if(this.all >= 5) {
					if(this.cur > 3 && this.cur < this.all - 2) { //大于6并且小于16
						left = this.cur - 2;
						right = this.cur + 2;
					} else {
						if(this.cur <= 5) {
							left = 1;
							right = 5;
						} else {
							right = this.all;
							left = this.all - 4;
						}
					}
				}
				while(left <= right) {
					ar.push(left);
					left++;
				}
				return ar;
			},
			changFlag: function() {
				return this.changValue == '运行中' ? true : false;
			}
		},
		watch: {
			cur: function(curValue, old) {
				var self = this;
				var newData = this.searchData;
				newData.page = curValue;
				this.searchData.page = curValue;
				TableAjax(self, jsonUrl, newData);
				this.$set('searchData.page',curValue);	
			},
			keyNum: function(curValue, old) {
				console.log(this.all)
				if(curValue > 0 && curValue <= this.all) {
					this.keyNum = curValue;
				} else {
					this.keyNum = '';
				}
			}
		}
	})

}

/**
 * 查看单个数据详情 swal弹窗框
 * @param {[type]} item [description]
 */
function OnLookOver(item, params, title) {
	var tableStr = toStrTable(params)
	swal({
		title: title.swalZh + " " + title.swalTitle + " 信息",
		type: "table",
		size: 'lg',
		table: tableStr,
		showConfirmButton: false,
		html: true
	})

}

/**
 * table列表渲染
 * @param {[type]} _self vue
 * @param {[type]} url   请求地址
 * @param {[type]} _data [description]
 */
function TableAjax(_self, url, _data) {
	myAjax.tableAjax(url, _data, function(data) {
		if(data.result) {
			_self.$set('tableList', data.data.pageList.data);
			var nullLength = new Array(10 - data.data.pageList.data.length);
			_self.$set('nullLength', nullLength);
			var dataPageAll = data.data.pageList.total;
			_self.$set('all', dataPageAll);
			_self.$set('thisUrl', url);
			_self.$set('isSearch', false);
			_data = _data.hasOwnProperty('page')?_data:defaultData(_data);
			_self.$set('searchData', _data);
		} else {
			swal("请求服务失败", data.message, "error");
		}
	})
}

/**
 * swal查看单个  拼接html
 * @param  {[type]} objArrays [数组]
 * @return {[type]}           [description]
 */
function toStrTable(objArrays) {
	var forRows = '';
	$.each(objArrays, function(index, val) {
		val.fieldData = val.fieldData == null||val.fieldData == ''?'---':val.fieldData;
		forRows += '<div class="form-group"><label  class="col-sm-2 control-label">' + val.fieldText + '</label><div class="col-sm-10">' + val.fieldData + '</div></div>';
	});
	var str = '<form class="form-horizontal look" role="form">' + forRows + '</form>';
	return str;
}

/**
 * 状态值改变
 * obj.el vm （this）
 * obj.url 请求地址
 * obj.type 请求方式
 * @param {[type]} obj [description] 改变状态值并且重新填充数据
 */
function OnChangeType(obj) {
	if(!obj.hasOwnProperty('url') || !obj.hasOwnProperty('el')) {
		return false;
	}
	var _self = obj.el;
	var _url = _self.thisUrl;
	var _data = _self.searchData;
	var _type = !obj.hasOwnProperty('type') == 'GET' ? 'GET' : obj.type;
	myAjax.tableAjax(obj.url, obj.data, function(data) {
		if(data.result) {
			swal({
				title: "修改状态成功",
				type: "success",
			}, function() {
				_self.$set('searchData.page',_data.page);
				TableAjax(_self, _url, _data);
			});
		}
	}, _type)
}

function onActionClean(obj) {
	console.log(obj.data);
	var _type = !obj.hasOwnProperty('type') == 'GET' ? 'GET' : obj.type;
	var _url = obj.url + obj.data;
	swal({
		title: "是否确认清洗",
		text: "",
		type: "warning",
		showCancelButton: true,
		closeOnConfirm: false,
		showLoaderOnConfirm: true,
	}, function() {
		$.ajax({
				url: _url,
				type: _type,
			})
			.done(function(data) {
				swal(data.message, "", "success")
			})
			.fail(function(data) {
				swal(data.message, "", "error")
			});

	});
}
/**
 * E追溯ajax封装
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
	'tableAjax': function(url, _data, successFuc, type) {
		var strType = type == "GET" ? "GET" : "POST";
		$.ajax({
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			url: url,
			type: strType,
			data: _data,
			async: false, //同步进行（否则ifram标签不能自适应）
			success: function(data) {
				successFuc && successFuc(data);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				sweetAlert("请求服务错误,错误码" + textStatus, "", "error");
				//console.log(status)
			}
		})
	}
}

var myDate = {
	'dateFuc': function() {
		return new Date();
	},
	'year': function() {
		return this.dateFuc().getFullYear();
	},
	'month': function() {
		return this.addTen(parseInt(this.dateFuc().getMonth()) + 1);
	},
	'day': function() {
		return this.addTen(this.dateFuc().getDate());
	},
	'hours': function() {
		return this.addTen(this.dateFuc().getHours());
	},
	'seconds': function() {
		return this.addTen(this.dateFuc().getSeconds());
	},
	'miliseconds': function() {
		return this.dateFuc().getMilliseconds()
	},
	'YYYYMMDD': function() {
		return this.year() + '-' + this.month() + '-' + this.day();
	},
	'YYYYUMDD': function() {
		return this.year() + '-' +  this.addTen(this.month() - 1) + '-' + this.day();
	},
	'YYYYMMDDHHSS': function() {
		return this.YYYYMMDD() + ' ' + this.hours() + ':' + this.seconds();
	},
	'addTen':function(val){
		return val>=0&&val<=9?'0'+val:val;
	}
}

/**
 * 查询表单
 * @param url 查询地址
 * @param jsonData 查询参数
 */
function tableSearch(url, jsonData, typeReq) {
	typeReq = typeReq == 'GET' ? 'GET' : 'POST';
	myAjax.tableAjax(url, defaultData(jsonData), function(data) {
		if(data.result) {
			vm.$set('tableList', data.data.pageList.data);
			var nullLength = new Array(10 - data.data.pageList.data.length);
			vm.$set('nullLength', nullLength);
			var dataPageAll = data.data.pageList.total;
			vm.$set('all', dataPageAll);
			vm.$set('cur', 1);
			vm.$set('isSearch',true)
			vm.$set('searchData', defaultData(jsonData))
		} else {
			swal("请求服务失败", data.message, "error");
		}
	}, typeReq);
}

/**
 * E追溯 下拉select查询初始化
 * type el 下拉元素
 *      url 请求地址
 *      josndata 请求数据
 *      subCode 循环节点
 */
function selectInit(el, url, josnDate, subCode) {
	var str = '';
	$.ajax({
		url: url,
		type: 'GET',
		data: josnDate,
		async: false, //同步进行（否则ifram标签不能自适应）
		success: function(data) {
			console.log(data);
			if(data.data.pageList.data > 0) {
				str = '<option>请选择</option>';
				$.each(data.data.pageList.data, function(key, item) {
					str += '<option value=' + item[subCode.vaule] + '>' + item[subCode.text] + '</option>';
				})
				el.append(str);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			sweetAlert("请求服务错误,错误码" + textStatus, "", "error");
		}
	})
}

/**
 * 判断是否是json对象 true是 false否
 * @param  {[type]}  obj [判断对象]
 * @return {Boolean}     [true是 false否]
 */
function isJson(obj) {
	var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
	return isjson;
}

function defaultData(obj) {
	if(!isJson(obj)) {
		return false;
	} else {
		obj['page'] = 1;
		obj['cols'] = 10;
		obj['total'] = -1;
	}
	return obj;
}

/**
 * [ E追溯 下拉 select查询初始化]
 * @param  {[type]} obj [下面是obj数据可选值]
 *      el 绑定元素 （必填）
 *      url 请求地址 （必填）
 *      data 请求参数  （选填）
 *      type 请求方式 'POST' 'GET' （选填）
 *      default 初始值  value值 （选填）
 *      subCode 循环节点字段vaule （必填）
 *      subChildrenCode 循环节点第二个字段vaule （选填)
 *      subNode 循环节点字段text （必填）
 *      subText 父节点      （选填）
 *      succese 查询成功回调 （选填）
 *      err  查询失败回调 （选填）
 * @return {[type]}     [description]
 */
function endSelectInit(obj) {
	if(!obj.hasOwnProperty('url') || !obj.hasOwnProperty('el') || !obj.hasOwnProperty('subNode') || !obj.hasOwnProperty('subText')) {
		return false;
	}
	var _type = !obj.hasOwnProperty('type') || obj.type == 'GET' ? 'GET' : 'POST';
	var _data = !obj.hasOwnProperty('data') ? {} : obj.data;
	var _resultData, str = '',
		_selected = '',
		subChildrenValue = '';
	var _default = !obj.hasOwnProperty('default') ? '' : obj.default;
	var _subChildrenCode = !obj.hasOwnProperty('subChildrenCode') ? '' : obj.subChildrenCode;
	$.ajax({
		url: obj.url,
		type: _type,
		data: _data,
		async: false, //同步进行（否则ifram标签不能自适应）
		success: function(data) {
			if(obj.hasOwnProperty('parentNode')) {
				if(obj.parentNode) {
					_resultData = data[obj.parentNode];
				} else {
					_resultData = data
				}
			} else {
				console.log(data)
				_resultData = data.data.pageList.data;
			}
			if(_resultData.length > 0) {
				$(obj.el).find('option').not(':first-of-type').remove();
				$.each(_resultData, function(key, item) {
					_selected = item[obj.subNode] == _default ? 'selected' : '';
					subChildrenValue = _subChildrenCode == '' ? '' : ',' + item[_subChildrenCode];
					str += '<option ' + _selected + ' value=' + item[obj.subNode] + subChildrenValue + '>' + item[obj.subText] + '</option>';
				})
				$(obj.el).append(str);
			} else { //空数组清空选项
				$(obj.el).find('option').not(':first-of-type').remove();
			}

			if(obj.hasOwnProperty('success')) {
				console.log((obj.el).html());
				obj.success && obj.success();
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			sweetAlert("请求服务错误,错误码" + textStatus, "", "error");
			if(obj.hasOwnProperty('err')) {
				obj.err && obj.err();
			}
		}
	})
}

/**
 * 表单vm 函数构造器
 * @return {[type]} [description]
 */
function vmFrom() {
	this.thisVm = 'fromVm'
}

/**
 * 初始化vmform 
 * @param  {[初始化传入的值]} obj [data 的数据]
 * @return {[type]}     [description]
 */
vmFrom.prototype.init = function(obj) {
	var initData = {};
	if(obj != undefined && obj.hasOwnProperty('type') && obj.type == 'select2City') {
		initData = obj.data;
	}
	this.thisVm = new Vue({
		el: '#vFrom',
		data: initData,
		ready: function() {},
		methods: {}
	})
}

/**
 * 初始化 三级城市联动
 * @param  {[type]} _provinceData [省] key:'省默认值',url:'请求地址'
 * @param  {[type]} _cityData     [市] key:'市默认值',url:'请求地址'
 * @param  {[type]} _countyData   [县] key:'市默认值',url:'请求地址'
 * @return {[type]}         
 */
vmFrom.prototype.select2City = function(_provinceData, _cityData, _countyData) {
	if(typeof(_provinceData) == Object && typeof(_cityData) == Object && typeof(countyData) == Object) {
		return false;
	}
	this.init({
		'type': 'select2City',
		data: {
			'provinceData': _provinceData,
			'cityData': _cityData,
			'countyData': _countyData
		}
	})
}

function autoHeight(add) {
	var n = add || 0;
	var doc = document.documentElement;
	var oIframe = window.parent.document.getElementById('iframePage');
	var HEIGHT = Math.max(doc.scrollHeight, doc.offsetHeight) + n + 'px';
	if(!!oIframe) {
		oIframe.setAttribute('height', HEIGHT);
	};
}

jQuery(document).ready(function() {
	autoHeight();

	$('form[name="loginForm"]').keypress(function(e){
		var key = e.which;
		console.log(key);
		 if (e.which == 13) {
			 return false;
		 }
	})
})

function tableHeight() {
	var oIframe = window.parent.document.getElementById('iframePage');
	var HEIGHT = $(document).height();
	if(!!oIframe) {
		oIframe.setAttribute('height', HEIGHT);
	};
}