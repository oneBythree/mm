app.controller('chartCtrl', ['$scope', function($scope) {

    function initData() {
        var arr = [];
        var threeArr = [];
        for (var j = 0; j < 7; j++) {
            arr.push(parseInt(Math.random() * 40000));
        }
        return arr;
    }

    //一个月的随机数
    function mothData() {
        var arr = [];
        for (var i = 0; i < 30; i++) {
            arr.push(parseInt(Math.random() * 40000));
        }
        return arr;
    }

    //一个月的时间
    function MonthDateTimer(maxDay) {
        //日期处理json 方法2
        maxDay = maxDay == undefined ? 30 : maxDay;
        var date = new Date();
        var sYear = date.getFullYear();
        var sMonth = date.getMonth() + 1;
        var sDate = date.getDate();
        var tArray = [],
            sNext, val;
        for (var i = maxDay; i > 0; i--) {
            sNext = new Date(sYear, sMonth, sDate - i);
            val = sNext.getFullYear() + '/' + sNext.getMonth() + '/' + sNext.getDate();
            // var text = '';
            tArray.push(val);
        }
        return tArray;
    }
    setDateArray(initData)
    $scope.xAxisData = MonthDateTimer(7);

    //点击单选按钮
    $scope.radioChange = function(type) {
        var dateArray = ['2016/8/23', '2016/8/24', '2016/8/25', '2016/8/26', '2016/8/27', '2016/8/28', '2016/8/29', '2016/8/30'];
        var typeArray = ['水果', '蔬菜',
            '白菜', '猪肉', '酒', '烟', '茶'
        ];
        switch (type) {
            case 1:
                $scope.xAxisData = MonthDateTimer(7);
                setDateArray(initData);
                $scope.flag = true;
                break;
            case 2:
                $scope.xAxisData = typeArray;
                setDateArray(initData);
                $scope.flag = false;
                break;
            default:
                break;
        }
    }

    // 点击时间范围
    $scope.rangTimerChange = function(rangDays, event) {
        $(event.target).siblings().removeClass('active');
        $(event.target).addClass('active');
        switch (rangDays) {
            case 7:
                $scope.xAxisData = MonthDateTimer(7);
                setDateArray(initData);
                break;
            case 30:
                $scope.xAxisData = MonthDateTimer(30);
                setDateArray(mothData);
                break;
            default:
                break;

        }
    }

    // 给表格添加一周随机数
    function setDateArray(funcM) {
        $scope.data1 = funcM();
        $scope.data2 = funcM();
        $scope.data3 = funcM();
        $scope.data4 = funcM();
        $scope.data5 = funcM();
    }



}]);
