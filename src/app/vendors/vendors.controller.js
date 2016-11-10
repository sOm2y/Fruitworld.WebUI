(function() {
  'use strict';
  angular.module('fruitWorld').controller('vendorCtrl', [
    '$scope',
    'uuid2',
    '$resource',
    '$state',
    'fruitWorldAPIService',
    function($scope, uuid2, $resource, $state, fruitWorldAPIService) {
      //var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      var crudServiceBaseUrl = "http://localhost:64328/api/";

      $scope.titleDataSource = [];
      fruitWorldAPIService.query({section: '/Vendor/ReadTitle'}).$promise.then(function(res) {
        _.forEach(res, function(value) {
          $scope.titleDataSource.push({title: value})
        });
        console.log("titles:", $scope.titleDataSource);
      }, function(err) {
        console.log(err);
      });

      $scope.contactDataSource = new kendo.data.DataSource({
        transport:{
          read:{
            url: function(data) {
              return crudServiceBaseUrl + "contact/read";
            },
            type: "GET",
            dataType: "json"
          }
        }
      });

      // DataSource
      var _dataSource = new kendo.data.DataSource({
        pageSize: 20,
        transport: {
          read: {
            url: function(data) {
              return crudServiceBaseUrl + "vendor/read";
            },
            type: "GET",
            dataType: "json"
          },
          create: {
            url: function(data) {
              console.log("Vendor Create:", data);
              return crudServiceBaseUrl + "vendor/create";
            },
            dataType: "json",
            type: "post",
            contentType: "application/json; charset=utf-8",
            processData: false
          },
          update: {
            url: function(data) {
              console.log("Vendor ID", data.vendorId);
              console.log("Update:", data);
              return crudServiceBaseUrl + "vendor/update/?id=" + data.vendorId;
            },
            dataType: "json",
            type: "put",
            contentType: "application/json;charset=utf-8",
            processData: false
          },
          destroy: {
            url: function(data) {
              return crudServiceBaseUrl + "vendor/delete/?id=" + data.vendorId;
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
            id: "vendorId",
            fields: {
              vendorId: {
                editable: false,
                nullable: false,
                defaultValue: uuid2.newuuid()
              },
              contactId: {
                type:"string",
                validation:{
                  required: true
                }
              },
              name: {
                type: "string"
              }
            }
          }
        }
      });
      // -- DataSource END

      // Branch Grid Option
      $scope.mainGridOptions = {
        dataSource: _dataSource,
        filterable: true,
        sortable: true,
        pageable: true,
        toolbar: [
          {
            name: "create",
            text: "NEW Vendor"
          }
        ],
        columns: [
          {
            field: "contactId",
            title: "Contact ID"
          }, {
            field: "name",
            title: "Vendor Name"
          }, {
            field: "title",
            title: "Title"
          }, {
            field: "fullName",
            title: "Contact Name"
          }, {
            field: "phone",
            title: "Phone Number"
          }, {
            command: [
              "edit", "destroy"
            ],
            title: "Action"
          }
        ],
        editable: {
          mode: "popup",
          template: kendo.template($("#vendorPopupTemplate").html())
        }
      };

    }
  ]);
}());
