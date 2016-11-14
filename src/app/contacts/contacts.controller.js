(function() {
  'use strict';
  angular.module('fruitWorld').controller('ContactCtrl', [
    '$scope',
    'uuid2',
    '$resource',
    '$state',
    'fruitWorldAPIService',
    function($scope, uuid2, $resource, $state, fruitWorldAPIService) {
      //var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      var crudServiceBaseUrl = "http://localhost:64328/api/";

      console.log("Contact Ctrl Loading success...");
      $scope.titleDataSource = [];
      fruitWorldAPIService.query({section: '/contact/readtitle'}).$promise.then(function(res) {
        _.forEach(res, function(value) {
          $scope.titleDataSource.push({"title": value})
        });
        console.log("titles:", $scope.titleDataSource);
      }, function(err) {
        console.log(err);
      });

      var defaultAddress = [];
      fruitWorldAPIService.query({section: '/address/read'}).$promise.then(function(res) {
        defaultAddress.push(_.head(res));
      }, function(err) {
        console.log(err);
      });

      // Addresses DataSource
      var _addressDataSource = new kendo.data.DataSource({
        pageSize:10,
        transport:{
          read:{
            url: function(){
              return crudServiceBaseUrl + "address/read"
            },
            type:"get",
            "dataType":"json"
          }
        }
      });

      // Contacts DataSource
      var _dataSource = new kendo.data.DataSource({
        pageSize: 10,
        transport: {
          read: {
            url: function(data) {
              return crudServiceBaseUrl + "Contact/Read";
            },
            type: "GET",
            dataType: "json"
          },
          create: {
            url: function(data) {
              console.log("Contact Create:", data);
              return crudServiceBaseUrl + "Contact/Create";
            },
            dataType: "json",
            type: "post",
            contentType: "application/json; charset=utf-8",
            processData: false
          },
          update: {
            url: function(data) {
              console.log("Contact ID", data.contactId);
              console.log("Update:", data);
              return crudServiceBaseUrl + "Contact/update/?id=" + data.contactId;
            },
            dataType: "json",
            type: "put",
            contentType: "application/json;charset=utf-8",
            processData: false
          },
          destroy: {
            url: function(data) {
              return crudServiceBaseUrl + "Contact/delete/?id=" + data.contactId;
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
                editable: false,
                nullable: false,
                defaultValue: uuid2.newuuid()
              },
              active: {
                type: "boolean"
              }
            }
          }
        }
      });
      // -- DataSource END

      // Contact Grid Option
      $scope.contactGridOptions = {
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
            field: "mobile",
            title: "Contact ID"
          }, {
            field: "title",
            title: "Title"
          }, {
            field: "fullName",
            title: "Contact Name"
          }, {
            field: "phone",
            title: "Phone"
          }, {
            field: "jobTitle",
            title: "jobTitle"
          }, {
            field: "type",
            title: "Type"
          },{
            field: "company",
            title: "Company"
          }, {
            field: "fullAddress",
            title: "Address"
          }, {
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
    }]);
}());
