Vue.component('select-city', {
	template: '<div class="form-group">' +
		'<label for="lastname" class="col-sm-2 control-label">省份</label>' +
		'<div class="col-sm-10">' +
		'<select v-model="province" id="province"  data-placeholder="请选择" class="selectpicker form-control"  name="province" data-rule="required;" data-msg-required="省份必填">' +
		'<option color="999" value="">请选择</option>' +
		'</select>' +
		'<i class="red">*</i>' +
		'</div>' +
		'</div>' +
		'<div class="form-group">' +
		'<label for="lastname" class="col-sm-2 control-label">市</label>' +
		'<div class="col-sm-10">' +
		'<select v-model="city" id="city" class="selectpicker form-control"  data-width="100%"  name="city">' +
		'<option color="999" value="">请选择</option>' +
		'</select>' +
		'</div>' +
		'</div>' +
		'<div class="form-group">' +
		'<label for="lastname" class="col-sm-2 control-label">县</label>' +
		'<div class="col-sm-10">' +
		'<select v-model="county" id="county" name="countyname" class="selectpicker form-control">' +
		'<option color="999" value="">请选择</option>' +
		'</select>' +
		'</div>' +
		'</div>',
	props: {
		province: {
			type: String,
			require: true,
			default: '',
		},
		city: {
			type: String,
			require: true,
			default: '',
		},
		county: {
			type: String,
			require: true,
			default: '',
		},
		provinceData: {
			type: Object,
			requie: true,
			default: {}
		},
		cityData: {
			type: Object,
			requie: true,
			default: {}
		},
		countyData: {
			type: Object,
			requie: true,
			default: {}
		}
	},
	ready: function() {
		var that = this;
		this.changeSelect2();
		endSelectInit({
			el: '#province',
			url: that.provinceData.url,
			type: 'GET',
			default: this.provinceData.key,
			subNode: 'szm',
			subChildrenCode: 'id',
			subText: 'text',
			parentNode: 'items',
			succese: function() {
				that.province = $('#province').val();
			}
		})
		if(that.cityData.key != '') {
			endSelectInit({
				el: '#city',
				url: that.cityData.url,
				default: that.cityData.key,
				data: { 'pcode': that.cityData.pcode },
				type: 'GET',
				subNode: 'szm',
				subChildrenCode: 'id',
				subText: 'text',
				parentNode: 'items',
			})
		}
		if(that.countyData.key != '') {
			endSelectInit({
				el: '#county',
				url: that.countyData.url,
				default: that.countyData.key,
				data: { 'pcode': that.countyData.pcode },
				type: 'GET',
				subNode: 'szm',
				subChildrenCode: 'id',
				subText: 'text',
				parentNode: 'items',
			})
		}
		//			           endSelectInit({
		//			                el: '#county',
		//			                url: that.countyData.url,
		//			                default: that.countyData.key,
		//			                type: 'GET',
		//			                subNode: 'szm',
		//			                subChildrenCode: 'id',
		//			                subText: 'text',
		//			                parentNode: 'items',
		//			          })
	},
	methods: {
		changeSelect2: function() {
			var that = this;
			$('#province').on('change', function() {
				that.province = $(this).val();
			})
			$('#city').on('change', function() {
				that.city = $(this).val();
			})
			$('#county').on('change', function() {
				that.county = $(this).val();
			})
		}
	},
	watch: {
		province: function(cur, old) {
			var that = this;
			var _pcode = cur.split(',')[1] == undefined ? '' : cur.split(',')[1];
			var _data = {
				'pcode': _pcode
			};
			var _countyData = {
				'pcode': ''
			};
			endSelectInit({
				el: '#city',
				url: that.cityData.url,
				data: _data,
				default: that.cityData.key,
				type: 'GET',
				subNode: 'szm',
				subChildrenCode: 'id',
				subText: 'text',
				parentNode: 'items',
			})
			endSelectInit({
				el: '#county',
				url: that.countyData.url,
				data: _countyData,
				default: that.countyData.key,
				type: 'GET',
				subNode: 'szm',
				subChildrenCode: 'id',
				subText: 'text',
				parentNode: 'items',
			})
		},
		city: function(cur, old) {

			var _pcode = cur.split(',')[1] == undefined ? '' : cur.split(',')[1];
			var _data = {
				'pcode': _pcode
			};
			var that = this;
			console.log(that.countyData);
			endSelectInit({
				el: '#county',
				url: that.countyData.url,
				data: _data,
				default: that.countyData.key,
				type: 'GET',
				subNode: 'szm',
				subChildrenCode: 'id',
				subText: 'text',
				parentNode: 'items',
			})
		}
	}
})