/**
 * Created by Felix on 2/10/2016.
 */
(function () {
  "use strict";

  angular.module('fruitWorld')
  .controller('boxCtrl',['$scope','uuid2',function ($scope,uuid2) {
    var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
    // var crudServiceBaseUrl = "http://localhost:64328//api/";

    // Box DataSource
    var _dataSource = new kendo.data.DataSource({
      pageSize: 20,
      transport:{
        read:{
          url: function (data) {
            return crudServiceBaseUrl + 'box/read';
          },
          type: 'get',
          dataType: "json"
        },
        create: {
          url: function(data) {
            console.log("Box Create:",data);
            return crudServiceBaseUrl + "box/create";
          },
          dataType: "json",
          type: "post",
          contentType: "application/json; charset=utf-8",
          processData: false
        },
        update: {
          url: function(data) {
            console.log("Box ID",data.boxId);
            console.log("Update:",data);
            return crudServiceBaseUrl + "box/update/?id=" + data.boxId;
          },
          dataType: "json",
          type: "put",
          contentType: "application/json;charset=utf-8",
          processData: false
        },
        destroy: {
          url: function(data) {
            return crudServiceBaseUrl + "box/delete/?id=" + data.boxId;
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
          id: "boxId",
          fields: {
            boxId: {
              editable: false,
              nullable: false,
              defaultValue: uuid2.newuuid()
            },
            incGst:{
              defaultValue: true
            }
          }
        }
      }
    });
    // Box DataSource END

    // Box Grid Options
    $scope.boxGridOptions = {
      dataSource: _dataSource,
      filterable: true,
      sortable: true,
      pageable: true,
      dataBound: function(){
        this.expandRow(this.tbody.find("tr.k-master-row").first());
      },
      toolbar: [{
        name: "create",
        text: "NEW Box"
      }],
      columns: [{
        field: "barcode",
        title: "Barcode"
      },{
        field: "unitPrice",
        title: "Unit Price"
      }, {
        field: "gst",
        title: "GST"
      }, {
        field: "incGst",
        title: "Inc.Gst"
      }, {
        field: "weight",
        title: "Weight",
        format: "#.00 {dataItem.weightUnit}"
      }, {
        field: "size",
        title: "Size"
      }, {
        field: "description",
        title: "Description"
      },
      {
        command: ["edit", "destroy"],
        title: "Action"
      }],
      editable: {
        mode: "inline"
      }
    };

    // Box Content Grid Options
    $scope.boxContentGridOptions = function(dataItem){
      return {
        dataSource:{
          transport:{
            read:{
              url: function(data){
                return crudServiceBaseUrl + "boxContent/read/"+ dataItem.boxId;
              },
              dataType: "json",
              type: "get",
              processData: false
            },
            pageSize: 10
          }
        }
      }
    }
  }]);
})();
