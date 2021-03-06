//物品管理
app.controller('goodsCtrl', ['$scope', '$http', '$compile', '$q', '$filter',
    'companyFactory', 'tagsFactory',
    function($scope, $http, $compile, $q, $filter, companyFactory, tagsFactory) {
        $http.get('api/basicGoods.json').success(function(data) {
            $scope.goodsList = data;
        })

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
        var self = this;


        // $scope.$watch('companyValue', function(newValue) {
        //     console.log(newValue);
        // }, true)

        // 搜索
        $scope.search = function() {
            console.log($scope.tagValue);
            $scope.tagsFilter = function(e){
                return e.tags.node_name ==  $scope.tagValue || e.company.node_name ==  $scope.companyValue;
            }
            // $scope.copanyFilter = function(e){
            //     return e.company.node_name ==  $scope.companyValue;
            // }
        }

        //查看
        $scope.lookOver = function(goods) {
            var name = goods.name;
            var tableStr = table(goods);
            swal({
                title: "物品 " + name + " 信息",
                // text: "You will not be able to recover this imaginary file!",
                type: "table",
                size: 'lg',
                table: tableStr,
                showConfirmButton: false,
                html: true
            }, function() {
                swal("已删除!", "Your imaginary file has been deleted.", "success");
            })
        }

        //删除
        $scope.del = function(goods) {
            var name = goods.name;

            swal({
                title: "您是否确认删除物品 " + name + " ？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: "确认删除",
                cancelButtonText: "取消删除",
                closeOnConfirm: false,
            }, function() {
                $scope.$apply(function() {
                    $scope.goodsList.splice(goods.index - 1, 1);
                    swal("删除成功", "物品已 " + name + " 删除.", "success");
                })

            });
        }

        //修改
        $scope.edit = function(goods) {
            var name = goods.name;
            swalDialog(goods, $scope._companyList, $scope._tagsList, 'node_name');
            function swalDialog(goods, companyList, tagslist, forItem) {

                var tableStr = tableEdit(goods, companyList, tagslist, forItem);
                swal({
                    title: "修改物品 " + name + " 信息",
                    type: "table",
                    size: 'lg',
                    table: tableStr,
                    showCancelButton: true,
                    confirmButtonText: "保存修改",
                    cancelButtonText: "取消",
                    closeOnConfirm: false,
                    confirmButtonColor: '#1fb5ad',
                    html: true
                }, function() {
                    $scope.$apply(function() {
                        swal("修改物品" + name + "成功", "", "success");
                    })

                })


                var link = $compile($('#ngDialog'));
                var scope = $scope.$new(true);
                var node = link(scope);
            }


            //     console.info($scope.conpanyArray)
        }

    }
])


function table(goods) {
    var str = '<form class="form-horizontal look" role="form">' +
        '<div class="form-group"><label  class="col-sm-2 control-label">序号</label>' +
        '<div class="col-sm-10">' + goods.index + '</div></div>' +
        '<div class="form-group"><label for="firstname" class="col-sm-2 control-label">企业名称</label>' +
        '<div class="col-sm-10">' + goods.company.node_name + '</div></div>' +
        '<div class="form-group"><label for="lastname" class="col-sm-2 control-label">企业编码</label>' +
        '<div class="col-sm-10">' + goods.company.node_id + '</div></div>' +
        '<div class="form-group"><label for="lastname" class="col-sm-2 control-label">物品ID</label>' +
        '<div class="col-sm-10">' + goods._id + '</div></div>' +
        '<div class="form-group"><label for="lastname" class="col-sm-2 control-label">物品名称</label>' +
        '<div class="col-sm-10">' + goods.name + '</div></div>' +
        '<div class="form-group"><label for="lastname" class="col-sm-2 control-label">物品标签</label>' +
        '<div class="col-sm-10">' + goods.tags.node_name + '</div></div>' +
        '<div class="form-group"><label for="lastname" class="col-sm-2 control-label">备注</label>' +
        '<div class="col-sm-10">' + goods.note + '</div></div>' +
        '</form>';
    return str;
}

function tableEdit(goods, companyList, tags, forItem) {
    var str = '<form class="form-horizontal edit" role="form" name="goodsEdit" verify-scope>' +
        '<div class="form-group"><label  class="col-sm-2 control-label">序号</label>' +
        '<div class="col-sm-10"> <input class="form-control"  type="text" value=' + goods.index + ' readonly></div></div>' +
        '<div class="form-group"><label for="firstname" class="col-sm-2 control-label">企业名称</label>' +
        '<div class="col-sm-10"><div ng-verify ng-model="_companyValue" drop-search create-swtich=false drop-list=' + companyList + '  for-value="_companyValue"  select-value=' + goods.company.node_name + ' for-item=' + forItem + '></div></div></div>' +
        '<div class="form-group"><label for="lastname" class="col-sm-2 control-label">物品ID</label>' +
        '<div class="col-sm-10"><input class="form-control"  type="text" value=' + goods._id + ' readonly></div></div>' +
        '<div class="form-group"><label for="lastname" class="col-sm-2 control-label">物品名称</label>' +
        '<div class="col-sm-10"><input class="form-control"  type="text" value=' + goods.name + '></div></div>' +
        '<div class="form-group"><label for="lastname" class="col-sm-2 control-label">物品标签</label>' +
        '<div class="col-sm-10"><div drop-search create-swtich=true drop-list=' + tags + '  for-value="_tagsValue" for-item=' + forItem + ' select-value=' + goods.tags.node_name + '></div></div></div>' +
        '<div class="form-group"><label for="lastname" class="col-sm-2 control-label">备注</label>' +
        '<div class="col-sm-10"><textarea rows="3"  class="form-control">' + goods.note + '</textarea> </div></div>' +
        '</form>';
    return str;
}

// app.directive('myDialog', function($compile) {
//     // Runs during compile
//     return {
//         // name: '',
//         // priority: 1,
//         // terminal: true,
//         scope: {
//             myDialog: '=myDialog'
//         }, // {} = isolate, true = child, false/undefined = no change
//         // controller: function($scope, $element, $attrs, $transclude) {},
//         // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
//         restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
//         // template: '',
//         // templateUrl: '',
//         // replace: true,
//         // transclude: true,
//         // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
//         link: function($scope, iElm, iAttrs) {
//            // $scope.$watch('myDialog', function(value) {
//            //     console.log(value)
//            //   if (!value) {
//            //      return;
//            //     }
//            //     var newElem = $compile($.parseHTML(value))(scope.$parent);
//            //     console.log(newElem)
//            //     elem.contents().remove();
//            //     elem.append(newElem);
//            // },true);
//         }
//     };
// });
