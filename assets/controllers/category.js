
(function () {
'use strict';
var app = angular.module('dayanghuo.admin.category', ['ngResource']).config([
    '$httpProvider', '$resourceProvider',
    function($httpProvider, $resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }
]).controller('CategoryCtrl', [
'$scope', '$resource','$http', '$window',
function($scope, $resource, $http){
  var Category = $resource('/category/:categoryId', {categoryId:'@id'});

  $scope.options = {url: ""};
  $scope.category = {};
  $scope.showUpdateForm = false;
  $scope.showForm = false;

  $scope.categorySchema =
  [
  {
      title: '类别名',
      schemaKey: 'name',
      type: 'text',
      inTable: true
  },
  {
      title: '推出',
      schemaKey: 'publish',
      type: 'select',
      inTable: true,
      options: ['推出', '退下']
  }
  ];

  $scope.test = 'Hello world!';
  $scope.init = function()
  {
    Category.query({}, function(categorys) {
      $scope.categorys = categorys;
    });
  };
  $scope.update = function(categoryId){
    $scope.category.$save(function(data, headers){
      alert("更新成功");
      $scope.edit(categoryId);
    });
  };
  $scope.edit = function(categoryId){
    $scope.showForm = false;
    Category.get({categoryId: categoryId}, function(categoryOne){
      $scope.category = categoryOne;
      $scope.showUpdateForm = true;
      window.location.href= "#";
    })
  };
  $scope.add = function(){
    var categoryPO = new Category({
        name: $scope.category.name
    });
    categoryPO.$save(function(data, headers) {
        $scope.category = data;
        $scope.showUpdateForm = true;
        $scope.showForm = false;
        alert("创建成功");
        $scope.categorys.push($scope.category);
    }, function(data, headers) {
        $scope.userError = data.data;
    });
  };
  $scope.refresh = function(){
    window.location.href="/category-mod";
  }
}])
}());
