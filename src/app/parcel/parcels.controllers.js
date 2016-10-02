(function(){
    'use strict';

    angular.module('fruitWorld')
    .controller('parcelCtrl',['$scope',function($scope){
      //var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      var crudServiceBaseUrl = "http://localhost:64328//api/";

      // Parcel DataSource
      var _dataSource = new kendo.data.DataSource({
        pageSize: 20,
        transport:{
          read:{
            url: function (data) {
              return crudServiceBaseUrl + 'parcel/read';
            },
            type: 'get',
            dataType: "json"
          },
          create: {
            url: function(data) {
              console.log("Parcel Create:",data);
              return crudServiceBaseUrl + "parcel/create";
            },
            dataType: "json",
            type: "post",
            contentType: "application/json; charset=utf-8",
            processData: false
          },
          update: {
            url: function(data) {
              console.log("Parcel ID",data.Id);
              console.log("Update:",data);
              return crudServiceBaseUrl + "parcel/update/?id=" + data.Id;
            },
            dataType: "json",
            type: "put",
            contentType: "application/json;charset=utf-8",
            processData: false
          },
          destroy: {
            url: function(data) {
              return crudServiceBaseUrl + "parcel/delete/?id=" + data.Id;
            },
            dataType: "json",
            type: "delete",
            contentType: "application/json; charset=utf-8",
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
            id: "Id",
            fields: {
              boxId: {
                editable: false,
                nullable: false,
                defaultValue: "D4780DE7-B134-4828-92E0-81CC9F7B8A20"
              },
              incGst:{
                defaultValue: true
              }
            }
          }
        }
      });
      // Parcel DataSource END

      // Parcel Grid Options
      $scope.parcelGridOptions = {
        dataSource: _dataSource,
        filterable: true,
        sortable: true,
        pageable: true,
        toolbar: [{
          name: "create",
          text: "NEW Box"
        }],
        columns: [{
          field: "trackingNum",
          title: "Track Number"
        },{
          field: "orderId",
          title: "Order"
        },,{
          field: "deliveryCompany",
          title: "Delivery Company"
        }, {
          field: "deliveryDate",
          title: "Delivery Date"
        }, {
          field: "eta",
          title: "ETA"
        }, {
          field: "weight",
          title: "Weight",
          format: "#.00"
        }, {
          field: "rate",
          title: "Rate",
          format:"{0:c}"
        }, {
          field: "freight",
          title: "Freight"
        },
        {
          command: ["edit", "destroy"],
          title: "Action"
        }],
        editable: {
          mode: "inline"
        }
      };
    }]);
})();
