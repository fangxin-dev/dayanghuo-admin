
(function () {
'use strict';
var app = angular.module('dayanghuo.admin.product', ['blueimp.fileupload', 'ngResource']).config([
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
]).controller('ProductCtrl', [
'$scope', '$resource','$http', '$window',
function($scope, $resource, $http){
  var Product = $resource('/product/:productId', {productId:'@id'});

  $scope.options = {url: ""};
  $scope.product = {};
  $scope.showUpdateForm = false;
  $scope.showForm = false;

  $scope.productSchema =
  [
  {
      title: '产品名',
      schemaKey: 'name',
      type: 'text',
      inTable: true
  },{
      title: '产品描述',
      schemaKey: 'description',
      type: 'text',
      inTable: true
  }, {
      title: '备注',
      schemaKey: 'remarks',
      type: 'textarea',
      inTable: true
  }
  ];

  $scope.test = 'Hello world!';
  $scope.init = function()
  {
    Product.query({}, function(products) {
      $scope.products = products;
    });
  };
  $scope.update = function(productId){
    $scope.product.$save(function(data, headers){
      alert("更新成功");
      $scope.edit(productId);
    });
  };
  $scope.edit = function(productId){
    $scope.showForm = false;
    Product.get({productId: productId}, function(productOne){
      $scope.product = productOne;
      $scope.images = productOne.images;
      $scope.options.url = "/product/" + productId+"/image";
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
    var productPO = new Product({
        name: $scope.product.name,
        description: $scope.product.description,
        remarks: $scope.product.remarks,

    });
    productPO.$save(function(data, headers) {
        $scope.product = data;
        $scope.options.url = "/product/" + data.id + "/image";
        $scope.$on('fileuploadsubmit', function(e, data) {
         data.url = $scope.options.url;
        });
        $scope.showUpdateForm = true;
        $scope.showForm = false;
        alert("创建成功");
        $scope.products.push($scope.product);
    }, function(data, headers) {
        $scope.userError = data.data;
    });
  };
  $scope.deleteImage = function(productId, imageId){

    $http.delete("/product/"+productId+"/image/"+imageId).success(function (data, status, headers) {
        $scope.ServerResponse = data;
        $scope.edit(productId);
        //alert("deleted");
    });
  };
  $scope.setAsFrontImage = function(productId, imageId){
    $http.post("/product/"+productId+"/image/"+imageId+"/setFront").success(function (data, status, headers) {
        $scope.ServerResponse = data;
        alert("set");
    });

  };
  $scope.refresh = function(){
    window.location.href="/product-mod";
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
