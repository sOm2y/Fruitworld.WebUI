(function() {
  'use strict';
  angular.module('fruitWorld').controller('parcelCtrl', [
    '$scope',
    'uuid2',
    function($scope, uuid2) {
      //var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      var crudServiceBaseUrl = "http://localhost:64328/api/";

      var _dataSource = new kendo.data.DataSource({
        pageSize: 20,
        transport: {
          read: {
            url: function(data) {
              return crudServiceBaseUrl + "parcel/read";
            },
            type: "GET",
            dataType: "json"
          },
          create: {
            url: function(data) {
              console.log("Parcel Create:", data);
              return crudServiceBaseUrl + "parcel/create";
            },
            dataType: "json",
            type: "post",
            contentType: "application/json; charset=utf-8",
            processData: false
          },
          update: {
            url: function(data) {
              console.log("Parcel ID", data.parcelId);
              console.log("Update:", data);
              return crudServiceBaseUrl + "parcel/update/?id=" + data.parcelId;
            },
            dataType: "json",
            type: "put",
            contentType: "application/json;charset=utf-8",
            processData: false
          },
          destroy: {
            url: function(data) {
              return crudServiceBaseUrl + "parcel/delete/?id=" + data.parcelId;
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
            id: "parcelId",

            fields: {
              parcelId: {
                eitable: false,
                nullable: false,
                defaultValue: uuid2.newuuid(),
                validation: {
                  required: true
                }
              },
              trackingNum: {
                nullable: false,
                validation: {
                  required: true
                }
              },
              deliveryCompany: {
                nullable: false,
                validation: {
                  required: true
                }
              },
              deliveryDate: {
                type: "date"
              },
              eta: {
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

      // Parcel Grid Options
      $scope.parcelGridOptions = {
        dataSource: _dataSource,
        filterable: true,
        sortable: true,
        pageable: true,
        groupable: true,
        editable: "inline",
        toolbar: [
          {
            name: "create",
            text: "NEW Parcel"
          }
        ],
        columns: [
          {
            field: "trackingNum",
            title: "Track Number"
          }, {
            field: "order",
            title: "Order",
            editor: orderComboBoxEditor,
            template: "#= order.orderId #"
          }, {
            field: "deliveryCompany",
            title: "Delivery Company",
            editor: deliveryCompanyComboBoxEditor,
            template: "#=deliveryCompany#"
          }, {
            field: "deliveryDate",
            title: "Delivery Date",
            template: "#= kendo.toString(deliveryDate,'dd/MM/yyyy') #"
          }, {
            field: "eta",
            title: "ETA",
            template: "#= kendo.toString(eta, 'dd/MM/yyyy') #"
          }, {
            field: "weight",
            title: "Weight",
            template: "#=kendo.toString(weight, 'n2')#KG"
          }, {
            field: "rate",
            title: "Rate",
            editor: deliveryRateComboBoxEditor,
            template: "#=kendo.toString(rate, 'c2')#",
          }, {
            field: "freight",
            title: "Freight",
            template: "#= kendo.toString(weight*rate, 'c2') #"
          }, {
            command: [
              "edit", "destroy"
            ],
            title: "Action"
          }
        ]
      };

      // Order Track ID ComboBox Editor
      function orderComboBoxEditor(container, options) {
        $('<input required name="' + options.field + '"/>').appendTo(container).kendoComboBox({
          autoBind: false,
          suggest: true,
          dataTextField: "orderId",
          dataValueField: "orderId",
          dataSource: {
            type: "json",
            transport: {
              read: crudServiceBaseUrl + "/parcel/order"
            }
          }
        });
      }

      // Delivery Company ComboBox editor
      function deliveryCompanyComboBoxEditor(container, options) {
        $('<input id="deliverycompany" required name="' + options.field + '"/>').appendTo(container).kendoComboBox({
          autoBind: false,
          suggest: true,
          filter: "contains",
          dataTextField: "companyName",
          dataValueField: "companyName",
          dataSource: {
            type: "json",
            transport: {
              read: crudServiceBaseUrl + "/parcel/deliverycompany"
            }
          }
        });
      }

      // Delivery Company Rate ComboBox editor
      function deliveryRateComboBoxEditor(container, options) {
        $('<input required name="' + options.field + '"/>').appendTo(container).kendoComboBox({
          autoBind: false,
          suggest: true,
          filter: "contains",
          index: 0,
          cascadeFrom:"deliverycompany",
          dataTextField: "deliveryRate",
          dataValueField: "deliveryRate",
          dataSource: {
            type: "json",
            transport: {
              read: crudServiceBaseUrl + "/parcel/deliverycompany"
            }
          }
        });
      }
    }
  ]);
})();
