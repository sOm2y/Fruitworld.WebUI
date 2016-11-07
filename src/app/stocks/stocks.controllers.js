(function() {
  'use strict';

  angular.module('fruitWorld')
  .controller('stocksCtrl', [
    '$scope',
    'uuid2',
    '$resource',
    '$state',
    function($scope, uuid2, $resource, $state) {
    var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
    //var crudServiceBaseUrl = "http://localhost:64328/api/";
    console.log('stocks controller loaded!');
    // Product ForeignKey column
    var products = getProducts();
    var defaultProduct = getDefaultProduct();

    function getProducts() {
      var result = [];
      $resource(crudServiceBaseUrl + "products/read/").query().$promise.then(function(products) {
        _.forEach(products, function(product) {
          result.push({"value": product.productId, "text": product.name});
        });
      });
      console.log("Products:", result);
      return result;
    }

    function getDefaultProduct() {
      var result = [];
      $resource(crudServiceBaseUrl + "products/read/").query().$promise.then(function(products) {
        result.push(_.first(products));
      });
      console.log("Default Product:", result);
      return result;
    }

    // Product Stock DataSource
    var _productStockDataSource = new kendo.data.DataSource({
      pageSize:20,
      transport:{
        read:{
          url: function(data){
            return crudServiceBaseUrl + 'Stock/ReadProducts';
          },
          type: 'get',
          dataType: "json"
        },
        update: {
          url: function(data) {
            console.log("Stock ID", data.stockId);
            console.log("Update:", data);
            return crudServiceBaseUrl + "stock/update/?id=" + data.stockId;
          },
          dataType: "json",
          type: "put",
          contentType: "application/json;charset=utf-8",
          processData: false
        },
        parameterMap: function(model, operation) {
          if (operation !== "read" && model) {
            return kendo.stringify(model);
          }
        }
      },
      error: function(e) {
        alert("Status: " + e.status + "; Error message: " + e.errorThrown);
      },
      schema: {
        model: {
          id: "stockId",
          fields: {
            stockId: {
              editable: false,
              nullable: false,
              defaultValue: uuid2.newuuid(),
              validation: {
                required: true
              }
            },
            productId:{
              nullable: true,
              editable: false,
              defaultValue: defaultProduct.productId
            },
            boxId:{
              nullable: true,
              editable: false
            },
            branchId:{
              nullable:false,
              editable:false,
            },
            sku:{
              type:"string"
            },
            quantity:{
              type:"number"
            },
            inComing:{
              type:"number"
            }
          }
        }
      }
    });
    // Product Stock DataSource End
    //
    // Product Stock Grid Option
    $scope.productStockGridOptions = {
      dataSource: _productStockDataSource,
      filterable: true,
      sortable: true,
      pageable: true,
      groupable: true,
      columns:[
        {field:"sku", title:"SKU"},
        {field:"productId", title:"Name", values:products},
        {field:"branchId", title:"Branch"},
        {field:"quantity", title:"Quantity"},
        {field:"inComing", title:"In Coming"}
      ],
      editable:"popup"
    }
    // Product Stock Grid End

    // Box ForeignKey column
    var boxes = getBoxes();
    var defaultBox = getDefaultBox();

    function getBoxes() {
      var result = [];
      $resource(crudServiceBaseUrl + "box/read/").query().$promise.then(function(boxes) {
        _.forEach(boxes, function(box) {
          result.push({"value": box.boxId, "text": box.boxName});
        });
      });
      return result;
    }

    function getDefaultBox() {
      var result = [];
      $resource(crudServiceBaseUrl + "box/read/").query().$promise.then(function(boxes) {
        result.push(_.first(boxes));
      });
      return result;
    }

    // Box Stock DataSource
    var _boxStockDataSource = new kendo.data.DataSource({
      pageSize:20,
      transport:{
        read:{
          url: function(){
            return crudServiceBaseUrl + 'stock/readboxes';
          },
          type: 'get',
          dataType: "json"
        },
        update: {
          url: function(data) {
            console.log("Stock ID", data.stockId);
            console.log("Update:", data);
            return crudServiceBaseUrl + "stock/update/?id=" + data.stockId;
          },
          dataType: "json",
          type: "put",
          contentType: "application/json;charset=utf-8",
          processData: false
        },
        parameterMap: function(model, operation) {
          if (operation !== "read" && model) {
            return kendo.stringify(model);
          }
        }
      },
      error: function(e) {
        alert("Status: " + e.status + "; Error message: " + e.errorThrown);
      },
      schema: {
        model: {
          id: "stockId",
          fields: {
            stockId: {
              editable: false,
              nullable: false,
              defaultValue: uuid2.newuuid(),
              validation: {
                required: true
              }
            },
            productId:{
              nullable: true,
              editable: false
            },
            boxId:{
              nullable: true,
              editable: false,
              defaultValue: defaultBox.boxId
            },
            branchId:{
              nullable:false,
              editable:false,
            },
            sku:{
              type:"string"
            },
            quantity:{
              type:"number"
            },
            inComing:{
              type:"number"
            }
          }
        }
      },
      group:{field:"sku"}
    });
    // Box Stock DataSource End


    // Box Stock Grid
    $scope.boxStockGridOption = {
      dataSource: _boxStockDataSource,
      filterable: true,
      sortable: true,
      pageable: true,
      groupable: true,
      columns:[{field:"sku",title:"SKU"},
      {field:"boxId", title:"Name", values:boxes},
      {field:"branchId", title:"Branch"},
      {field:"quantity", title:"Quantity"},
      {field:"inComing", title:"In Coming"}
    ],
    editable:"popup"
    }
    // Box Stock Grid End

  }]);
}());
