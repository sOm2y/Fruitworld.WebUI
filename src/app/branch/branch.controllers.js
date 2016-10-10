(function() {
  'use strict';
  angular.module('fruitWorld')
    .controller('branchCtrl', ['$scope', 'uuid2',function($scope,uuid2) {
      var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      // var crudServiceBaseUrl = "http://localhost:64328/api/";

      // DataSource
      var _dataSource = new kendo.data.DataSource({
        pageSize: 20,
        transport: {
          read: {
            url: function(data) {
              return crudServiceBaseUrl + "branch/read";
            },
            type: "GET",
            dataType: "json"
          },
          create: {
            url: function(data) {
              console.log("Branch Create:",data);
              return crudServiceBaseUrl + "branch/create";
            },
            dataType: "json",
            type: "post",
            contentType: "application/json; charset=utf-8",
            processData: false
          },
          update: {
            url: function(data) {
              console.log("Branch ID",data.branchId);
              console.log("Update:",data);
              return crudServiceBaseUrl + "branch/update/?id=" + data.branchId;
            },
            dataType: "json",
            type: "put",
            contentType: "application/json;charset=utf-8",
            processData: false
          },
          destroy: {
            url: function(data) {
              return crudServiceBaseUrl + "branch/delete/?id=" + data.branchId;
            },
            type: "DELETE",
            dataType: "json",
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
            id: "branchId",
            fields: {
              branchId: {
                editable: false,
                nullable: false,
                defaultValue: uuid2.newuuid()
              }
            }
          }
        }
      });
      // -- DataSource END

      // Branch Grid Option
      $scope.branchGridOptions = {
        dataSource: _dataSource,
        filterable: true,
        sortable: true,
        pageable: true,
        toolbar: [{
          name: "create",
          text: "NEW Branch"
        }],
        columns: [{
          field: "name",
          title: "Branch Name"
        }, {
          field: "contactName",
          title: "Contact"
        }, {
          field: "phone",
          title: "Phone"
        }, {
          field: "email",
          title: "Email"
        }, {
          field: "fax",
          title: "Fax"
        }/*,{
          field: "apt",
          title: "Apt (optional)"
        },{
          field: "street",
          title: "Street"
        },{
          field: "line1",
          title: "Street Line"
        },{
          field: "city",
          title: "City"
        },{
          field: "state",
          title: "State"
        },{
          field: "country",
          title: "Country"
        },{
          field: "postCode",
          title: "Post Code"
        },*/,{
          field: "fullAddress",
          title: "Full Address"
        }, {
          command: ["edit", "destroy"],
          title: "Action"
        }],
        editable: {
          mode: "popup",
          template: kendo.template($("#branchPopupTemplate").html())
        }
      };

    }]);
})();
