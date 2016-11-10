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
      fruitWorldAPIService.query({section: '/contant/readtitle'}).$promise.then(function(res) {
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
              return crudServiceBaseUrl + "contact/read";
            },
            type: "GET",
            dataType: "json"
          },
          create: {
            url: function(data) {
              console.log("Vendor Create:", data);
              return crudServiceBaseUrl + "contact/create";
            },
            dataType: "json",
            type: "post",
            contentType: "application/json; charset=utf-8",
            processData: false
          },
          update: {
            url: function(data) {
              console.log("Vendor ID", data.contactId);
              console.log("Update:", data);
              return crudServiceBaseUrl + "contact/update/?id=" + data.contactId;
            },
            dataType: "json",
            type: "put",
            contentType: "application/json;charset=utf-8",
            processData: false
          },
          destroy: {
            url: function(data) {
              return crudServiceBaseUrl + "contact/delete/?id=" + data.contactId;
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
            id: "contactId",
            fields: {
              contactId: {
                type:"string",
                validation:{
                  required:true
                }
              },
              vipLevel: {
                type: "number"
              },
              active:{
                type:"boolean"
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
            text: "NEW Contact"
          }
        ],
        columns: [
          {
            field: "contactId",
            title: "Contact ID"
          },{
            field: "title",
            title: "Title"
          }, {
            field: "fullName",
            title: "Name"
          },{
            field: "jobTitle",
            title: "Job Title"
          }, {
            field: "mobile",
            title: "Mobile"
          },
          {
            field: "phone",
            title: "Phone Number"
          }, ,
          {
            field: "company",
            title: "Company"
          },,
          {
            field: "active",
            title: "Active"
          },
          {
            field: "type",
            title: "Type"
          },{
            field: "vipLevel",
            title: "Level"
          },{
            command: [
              "edit", "destroy"
            ],
            title: "Action"
          }
        ],
        editable: {
          mode: "popup",
          template: kendo.template($("#contactPopupTemplate").html())
        }
      };

    }
  ]);
}());
