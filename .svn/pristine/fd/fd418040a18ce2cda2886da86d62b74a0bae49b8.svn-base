//添加新标签
app.controller('goodsAddCtrl', ['$scope', 'companyFactory', 'tagsFactory', 'ngVerify',
    function($scope, companyFactory, tagsFactory, ngVerify) {
        //获取公司列表
        companyFactory.getCompanyList().then(function(data) {
            $scope.companyList = data;
            $scope._companyList = JSON.stringify(data);
        }, function(data) {
            console.log('CompanyList公司列表获取错误!');
        });


        //获取标签列表
        tagsFactory.getTagsList().then(function(data) {
            $scope.tagsList = data;
            $scope._tagsList = JSON.stringify(data);
        }, function(data) {
            console.log('TagsList标签列表获取错误!');
        })

    }
])
