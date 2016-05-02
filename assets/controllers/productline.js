
(function () {
'use strict';
var app = angular.module('dayanghuo.admin.productline', ['blueimp.fileupload', 'ngResource']).config([
    '$httpProvider', 'fileUploadProvider', '$resourceProvider',
    function($httpProvider, fileUploadProvider, $resourceProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        fileUploadProvider.defaults.redirect = window.location.href.replace(
            /\/[^\/]*$/,
            '/cors/result.html?%s'
        );
        angular.extend(fileUploadProvider.defaults, {
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator.userAgent),
            maxFileSize: 999000,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
        });
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }
]).controller('ProductLineCtrl', [
'$scope', '$resource','$http', '$window',
function($scope, $resource, $http){
  var ProductLine = $resource('/ProductLine/:productLineId', {productLineId:'@id'});
  $scope.options = {url: ""};
  $scope.productLine = {};
  $scope.showUpdateForm = false;
  $scope.showForm = false;

  $scope.productLineSchema =
  [
  {
      title: '产品线名',
      schemaKey: 'name',
      type: 'text',
      inTable: true
  },{
      title: '产品线描述',
      schemaKey: 'description',
      type: 'textarea',
      inTable: true
  }, {
      title: '备注',
      schemaKey: 'remarks',
      type: 'textarea',
      inTable: true
  }, {
      title: '价钱',
      schemaKey: 'price',
      type: 'text',
      inTable: true
  }, {
      title: '打折',
      schemaKey: 'discount',
      type: 'text',
      inTable: true
  }, {
      title: '库存',
      schemaKey: 'stock',
      type: 'text',
      inTable: true
  }
  ];

  $scope.test = 'Hello world!';
  $scope.init = function()
  {
    ProductLine.query({}, function(productLines) {
      $scope.productLines = productLines;
    });
  };
  $scope.update = function(productLineId){
    $scope.productLine.$save(function(data, headers){
      alert("更新成功");
      $scope.edit(productLineId);
    });
  };
  $scope.edit = function(productLineId){
    $scope.showForm = false;
    ProductLine.get({productLineId: productLineId}, function(productLineOne){
      $scope.productLine = productLineOne;
      $scope.images = productLineOne.images;
      $scope.options.url = "/ProductLine/" + productLineId+"/image";
      $scope.$on('fileuploadsubmit', function(e, data) {
        data.url = $scope.options.url;
      });
      $scope.$on('fileuploadadd', function(e, data) {
        data.url = $scope.options.url;
      });
      $scope.showUpdateForm = true;
      window.location.href= "#";
    })
  };
  $scope.add = function(){
    var productLinePO = new Product({
        name: $scope.productLine.name,
        description: $scope.productLine.description,
        remarks: $scope.productLine.remarks,
        price: $scope.productLine.price,
        discount: $scope.productLine.discount,
        stock: $scope.productLine.stock
    });
    productLinePO.$save(function(data, headers) {
        $scope.productLine = data;
        $scope.options.url = "/ProductLine/" + data.id + "/image";
        $scope.$on('fileuploadsubmit', function(e, data) {
         data.url = $scope.options.url;
        });
        $scope.showUpdateForm = true;
        $scope.showForm = false;
        alert("创建成功");
        $scope.productLines.push($scope.productLine);
    }, function(data, headers) {
        $scope.userError = data.data;
    });
  };
  $scope.deleteImage = function(productLineId, imageId){
    $http.delete("/ProductLine/"+productLineId+"/image/"+imageId).success(function (data, status, headers) {
        $scope.ServerResponse = data;
        $scope.edit(productLineId);
        //alert("deleted");
    });
  };
  $scope.setAsFrontImage = function(productLineId, imageId){
    $http.post("/ProductLine/"+productLineId+"/image/"+imageId+"/setFront").success(function (data, status, headers) {
        $scope.ServerResponse = data;
    });

  };
  $scope.refresh = function(){
    window.location.href="/productline-mod";
  }



}])
.controller('FileDestroyController', [
            '$scope', '$http',
            function ($scope, $http) {
                var file = $scope.file,
                    state;
                if (file.url) {
                    file.$state = function () {
                        return state;
                    };
                    file.$destroy = function () {
                        state = 'pending';
                        return $http({
                            url: file.deleteUrl,
                            method: file.deleteType
                        }).then(
                            function () {
                                state = 'resolved';
                                $scope.clear(file);
                            },
                            function () {
                                state = 'rejected';
                            }
                        );
                    };
                } else if (!file.$cancel && !file._index) {
                    file.$cancel = function () {
                        $scope.clear(file);
                    };
                }
            }
        ]);;

}());
