(function() {

  'use strict';

  angular.module('fruitWorld')
    .controller('productCtrl', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
      $scope.mainGridOptions = {
        dataSource: {
          transport: {
            read: {
              url: "http://webapi20160908115938.azurewebsites.net/api/products/read",
              dataType: "json",
              type: "get"
            },
            create: {
              url: "http://webapi20160908115938.azurewebsites.net/api/products/create/",
              type: "post"
            },
            update: {
              url: function(data) {
                console.log(data);
                return "http://webapi20160908115938.azurewebsites.net/api/products/update/" + data.models[0].productId;
              },
              dataType: "json",
              type: "put",
            },
            destroy: {
              url: function(data) {
                console.log(data);
                return "http://webapi20160908115938.azurewebsites.net/api/products/delete/" + data.models[0].productId;
              },
              dataType: "json",
              type: "delete"
            }
          },
          error: function(e) {
            alert("Status: " + e.status + "; Error message: " + e.errorThrown);
          },
          batch: true,
          pageSize: 10,
          serverPaging: true,
          serverSorting: true,
          schema: {
            // data: "Data",
            // total: "Count",
            model: {
              id: "productId",
              fields: {
                productId: {
                  editable: false,
                  nullable: true
                },
                listPrice: {
                  type: "number",
                  validation: {
                    required: true,
                    min: 1
                  }
                },
                gst: {
                  editable: false
                },
                weight: {
                  type: "number",
                  validation: {
                    required: true,
                    min: 1
                  }
                },
                gstInclude: {
                  type: "boolean"
                }
              }
            }
          }
        },
        filterable: {
          mode: "row"
        },
        navigatable: true,
        sortable: true,
        pageable: true,
        editable: true,
        toolbar: [{
          name: "create",
          text: "ADD PRODUCT"
        }, "save"],
        columns: [{
          field: "barcode",
          title: "Barcode",
          width: "120px",
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
            text: "Edit",
            imageClass: "k-edit",
            className: "k-custom-edit",
            iconClass: "k-icon",
            click: showDetails
          }, "destroy"],
          title: "&nbsp;",
          // width: 250
        }]
      };

      function showDetails(e) {
        e.preventDefault();
        $rootScope.productDataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $state.go('products.details', {
          product: JSON.stringify($rootScope.productDataItem)
        });
      }

      function categoryDropDownEditor(container, options) {
        $('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoDropDownList({
            autoBind: false,
            dataTextField: "CategoryName",
            dataValueField: "CategoryID",
            dataSource: {
              type: "odata",
              transport: {
                read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Categories"
              }
            }
          });
      }

      $scope.onSelect = function(e) {
        var message = $.map(e.files, function(file) {
          return file.name;
        }).join(", ");
        kendoConsole.log("event :: select (" + message + ")");
      };

    }]).controller('productDetailsCtrl', ['$rootScope', '$state', '$scope', '$stateParams', function($rootScope, $state, $scope, $stateParams) {
      console.log($rootScope.productDataItem);
    }]);

})();
