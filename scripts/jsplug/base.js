//子页面引用js
function tableInit() {
    var vm = new Vue({
        el: "body",
        data: function() {
            return {
                'nullLength': 10
            }
        },
        ready: function() {
            this.init();
        },
        methods: {
            init: function() {
                var slef = this;
                $.ajax({
                    url: 'api/basicGoods.json',
                    type: 'GET',
                    async: false, //同步进行（否则ifram标签不能自适应）
                    success: function(data) {
                        slef.$set('goodsData', data);
                        var nullLength = new Array(10 - data.length);
                        slef.$set('nullLength', nullLength); //空数据
                    },
                    error: function(status) {
                        console.log(status)
                    }
                })
            },
            
        }
    })
}
