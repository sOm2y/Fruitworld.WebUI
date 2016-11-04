(function() {
  'use strict';

  angular.module('fruitWorld').controller('stockCtrl',['$scope','uuid2', function($scope, uuid2){
    // var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
    var crudServiceBaseUrl = "http://localhost:64328/api/";

    // Product Stock DataSource
    var _productStockDataSource = new kendo.data.DataSource({
      pageSize:20,
      transport:{
        read:{
          url: function(){
            return crudServiceBaseUrl + 'stock/readproduct';
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

    // Box Stock DataSource
    var _boxStockDataSource = new kendo.data.DataSource({
      pageSize:20,
      transport:{
        read:{
          url: function(){
            return crudServiceBaseUrl + 'stock/readbox';
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
    // Box Stock DataSource End

    // Product Stock Grid Option

    $scope.productStockGridOptions = {
      dataSource: _productStockDataSource,
      filterable: true,
      sortable: true,
      pageable: true,
      columns:[]
    }

    // Product Stock Grid End


    // Box Stock Grid
    $scope.boxStockGridOption = {
      dataSource: _boxStockDataSource,
      filterable: true,
      sortable: true,
      pageable: true,
      columns:[]
    }
    // Box Stock Grid End

  }]);
}());
