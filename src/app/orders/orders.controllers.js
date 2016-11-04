(function() {
  'use strict';

  angular.module('fruitWorld').controller('orderCtrl', [
    '$scope',
    'uuid2',
    'fruitWorldAPIService',
    function($scope, uuid2, fruitWorldAPIService) {
      var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      //var crudServiceBaseUrl = "http://localhost:64328/api/";

      // Get Order Count
      function orderCount() {
        var count = 0;
        fruitWorldAPIService.query({section: "order/read"}).$promise.then(function(orders) {
          count = _.size(orders);
        });
        return count;
      }

      // Order Data Source
      var _orderDataSource = new kendo.data.DataSource({
        pageSize: 20,
        transport: {
          read: {
            url: function(data) {
              return crudServiceBaseUrl + "order/read";
            },
            type: "GET",
            dataType: "json"
          },
          create: {
            url: function(data) {
              console.log("Order Create:", data);
              return crudServiceBaseUrl + "order/create";
            },
            dataType: "json",
            type: "post",
            contentType: "application/json; charset=utf-8",
            processData: false
          },
          update: {
            url: function(data) {
              console.log("Order ID", data.orderId);
              console.log("Update:", data);
              return crudServiceBaseUrl + "order/update/?id=" + data.orderId;
            },
            dataType: "json",
            type: "put",
            contentType: "application/json;charset=utf-8",
            processData: false
          },
          destroy: {
            url: function(data) {
              return crudServiceBaseUrl + "order/delete/?id=" + data.orderId;
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
            id: "orderId",
            fields: {
              orderId: {
                eitable: false,
                nullable: false,
                defaultValue: "OD" + kendo.toString(_.now(), 'ddMMyyyy') + orderCount() + 1,
                validation: {
                  required: true
                }
              },
              totalDue: {
                editable: false
              },
              shippingFee: {
                nullable: false,
                editable: false
              },
              payDue: {
                type: "date"
              },
              placeDate: {
                type: "date"
              },
              weight: {
                validation: {
                  min: 1
                }
              },
              freight: {
                editable: false
              }
            }
          }
        }
      });

      // Order Grid Options
      $scope.orderGridOptions = {
        dataSource: _orderDataSource,
        filterable: true,
        sortable: true,
        pageable: true,
        groupable: true,
        editable: "inline",
        toolbar: [
          {
            name: "create",
            text: "NEW Order"
          }
        ],
        detailInit: detailInit,
        dataBound: function() {
          this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
          {
            field: "orderId",
            title: "Order ID"
          }, {
            field: "contact",
            title: "Ship Name",
            editor: contactDropDownEditor,
            template: "contact"
          }, {
            field: "address",
            title: "Ship Address",
            editor: addressDropDownEditor,
            template: ""
          }, {
            field: "shippingFee",
            title: "Freight",
            format: "{0:c2}"
          }, {
            field: "totalWeight",
            title: "Total Weight",
            format: "{0: n2}KG"
          }, {
            field: "totalDue",
            title: "Total Due",
            format: "{0:c2}"
          }, {
            command: [
              "edit", {
                name: "voidButton",
                text: "Void",
                click: showCredit
              }
            ],
            title: "Action"
          }
        ]
      };
      //Order Grid Options


      function contactDropDownEditor(container, options) {
        $('<input required name="' + options.field + '"/>').appendTo(container).kendoComboBox({
          autoBind: false,
          suggest: true,
          filter: "contains",
          dataTextField: "fullName",
          dataValueField: "ContactId",
          dataSource: {
            type: "json",
            transport: {
              read: crudServiceBaseUrl + "/contact/read"
            }
          }
        });
      }

      function addressDropDownEditor(container, options) {
        $('<input required name="' + options.field + '"/>').appendTo(container).kendoComboBox({
          autoBind: false,
          suggest: true,
          filter: "contains",
          dataTextField: "name",
          dataValueField: "addressId",
          dataSource: {
            type: "json",
            transport: {
              read: crudServiceBaseUrl + "/address/read"
            }
          }
        });
      }

      // Show Credit function
      function showCredit() {}
      // Credit Windows

    }
  ]);

})();
