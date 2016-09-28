(function() {
  'use strict';

  angular.module('fruitWorld')
    .controller('orderCtrl', ['$scope', function($scope) {
      var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      $scope.mainGridOptions = {
        dataSource: new kendo.data.DataSource({
          transport: {
            read: {
              url: function(data) {
                return crudServiceBaseUrl + "orders/read/";
              },
              dataType: "json",
              type: "get",
              processData: false
            },
            create: {
              url: function(data) {
                return crudServiceBaseUrl + "/orders/create/";
              },
              dataType: "json",
              contentType: "application/json; charset=utf-8",
              type: "post",
              processData: false
            },
            update: {
              url: function(data) {
                return crudServiceBaseUrl + "orders/update/" + data.productId;
              },
              type: 'PUT',
              dataType: 'json',
              contentType: "application/json; charset=utf-8",
              processData: false
            },
            destroy: {
              url: function(data) {
                console.log(data);
                return crudServiceBaseUrl + "orders/delete/" + data.productId;
              },
              type: "delete",
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
            // data: "Data",
            // total: "Count",
            model: {
              id: "productId",
              fields: {
                productId: {
                  editable: false,
                  nullable: false
                },
                name: {
                  validation: {
                    required: true,
                    min: 1
                  }
                },
                category: {
                  validation: {
                    required: true,
                    min: 1
                  }
                },
                price: {
                  type: "number",
                  validation: {
                    required: true,
                    min: 1
                  }
                },
                listPrice: {
                  type: "number",
                  validation: {
                    required: true,
                    min: 1
                  }
                },
                gst: {
                  type: "number"
                },
                weight: {
                  type: "number",
                  validation: {
                    required: true,
                    min: 1
                  }
                },
                size: {
                  validation: {
                    required: true,
                    min: 1
                  }
                },
                gstInclude: {
                  type: "boolean",
                },
                safeStockLevel: {
                  type: "number",
                  validation: {
                    required: true,
                  }
                }
              }
            }
          }
        }),
        filterable: {
          mode: "menu"
        },
        navigatable: true,
        sortable: true,
        pageable: true,
        editable: "inline",
        toolbar: [{
          name: "create",
          text: "ADD PRODUCT"
        }],
        columns: [{
          field: "barcode",
          title: "Barcode",
          filterable: {
            cell: {
              showOperators: false
            }
          }
        }, {
          field: "name",
          title: "Name",
          // width: "120px",
          filterable: {
            cell: {
              showOperators: false
            }
          }
        }, {
          field: "category",
          title: "Category",
          // editor: categoryDropDownEditor,
          // template: "#=Category.CategoryName#"
        }, {
          field: "listPrice",
          title: "Price",
          format: "{0:c}"
            // width: "120px"
        }, {
          field: "gst",
          title: "GST",
          format: "{0:c}"
            // width: "120px"
        }, {
          field: "gstInclude",
          title: "Gst Include",
          // width: "120px"
        }, {
          field: "weight",
          title: "Weight",
          // width: "120px"
        }, {
          field: "size",
          title: "Size",
          // width: "180px",
        }, {
          field: "safeStockLevel",
          title: "Safe Stock Level"
        }, {
          command: [{
            name: "customEdit",
            text: "More",
            imageClass: "k-edit",
            className: "k-custom-edit",
            iconClass: "k-icon",
            click: showDetails
          }, "edit", "destroy"],
          title: "&nbsp;",
          // width: 250
        }]
      };

    }]);
})();
