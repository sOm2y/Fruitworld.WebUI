(function() {

  'use strict';

  angular.module('fruitWorld')

    .controller('productCtrl', ['shoppingCartService','$rootScope', '$scope', '$state', 'uuid2', function(shoppingCartService,$rootScope, $scope, $state, uuid2) {
      var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      //var crudServiceBaseUrl = "http://localhost:64328/api/";

      $scope.mainGridOptions = {
        dataSource: new kendo.data.DataSource({
          transport: {
            read: {
              url: function(data) {
                return crudServiceBaseUrl + "products/read/";
              },
              dataType: "json",
              type: "get",
              processData: false
            },
            create: {
              url: function(data) {
                return crudServiceBaseUrl + "products/create/";
              },
              dataType: "json",
              type: "post",
              contentType: "application/json; charset=utf-8",
              processData: false
            },
            update: {
              url: function(data) {
                return crudServiceBaseUrl + "products/update/" + data.productId;
              },
              type: 'PUT',
              dataType: 'json',
              contentType: "application/json; charset=utf-8",
              processData: false
            },
            destroy: {
              url: function(data) {
                console.log(data);
                return crudServiceBaseUrl + "products/delete/" + data.productId;
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
                  type: "guid",
                  editable: false,
                  nullable: false,
                  defaultValue: uuid2.newuuid(),
                  validation: {
                    required: true
                  }
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
                  type: "number",
                  editable: false
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
                incGst: {
                  type: "boolean",
                  defaultValue: true
                },
                safeStockLevel: {
                  type: "number",
                  validation: {
                    required: true
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
          command: [{
            name: "customEdit",
            text: "Add",
            imageClass: "k-add",
            className: "k-custom-add",
            iconClass: "k-icon",
            click: addToCart
          }],
        },{
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
          // editor:Getvalue,
          template: "<a href='' class='productLink' ng-click='showDetails(this)'>#=name#</a>",
          filterable: {
            cell: {
              showOperators: false
            }
          }
        }, {
          field: "category",
          title: "Category",
          editor: categoryDropDownEditor,
          template: "#=category#"
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
          field: "incGst",
          title: "IncGST",
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
          command: [ "edit", "destroy"],
          title: "&nbsp;",
          // width: 250
        }]
      };

      $scope.showDetails = function(e) {
        // e.preventDefault();
        $rootScope.productDataItem = e.dataItem;
        localStorage.setItem('productData', JSON.stringify($rootScope.productDataItem));
        $state.go('products.details', {
          product: JSON.stringify($rootScope.productDataItem)
        });
      }

      function addToCart(e){
        e.preventDefault();
        shoppingCartService.addProduct(this.dataItem($(e.currentTarget).closest("tr")));
        //TODO: if add same id of a product twice should add a 'x2' text instead of displaying duplicate product
      }

      function categoryDropDownEditor(container, options) {
        $('<input required name="' + options.field + '"/>')
          .appendTo(container)
          .kendoDropDownList({
            autoBind: false,
            dataTextField: "name",
            dataValueField: "name",
            dataSource: {
              type: "json",
              transport: {
                read: crudServiceBaseUrl + "/products/Category"
              }
            }
          });
      }

      $scope.onSelect = function(e) {
        var message = $.map(e.files, function(file) {
          return file.name;
        }).join(", ");
        console.log("event :: select (" + message + ")");
      };

    }]).controller('productDetailsCtrl', ['$rootScope', '$state', '$scope', '$stateParams', 'fruitWorldAPIService', function($rootScope, $state, $scope, $stateParams, fruitWorldAPIService) {

      if (localStorage.getItem('productData')) {
        $rootScope.productDataItem = JSON.parse(localStorage.getItem('productData'));
      }
      var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      $scope.discountGridOption = {
        dataSource: {
          transport: {
            read: {
              url: function(data) {
                return crudServiceBaseUrl + "discount/read/" + $rootScope.productDataItem.productId;
              },
              dataType: "json",
              type: "get",
              processData: false
            },
            create: {
              url: function(data) {
                return crudServiceBaseUrl + "/discount/create/" + $rootScope.productDataItem.productId;
              },
              dataType: "json",
              contentType: "application/json; charset=utf-8",
              type: "post",
              processData: false
            },
            update: {
              url: function(data) {
                return crudServiceBaseUrl + "discount/update/" + data.discountId;
              },
              type: 'PUT',
              dataType: 'json',
              contentType: "application/json; charset=utf-8",
              processData: false
            },
            destroy: {
              url: function(data) {
                console.log(data);
                return crudServiceBaseUrl + "discount/delete/" + data.discountId;
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
            model: {
              id: "productId",
              // dataStart: {
              //   type: 'date'
              // },
              // dateEnd: {
              //   type: 'date'
              // }
            }
          }
        },
        filterable: {
          mode: "menu"
        },
        navigatable: true,
        sortable: true,
        pageable: true,
        toolbar: [{
          name: "create",
          text: "ADD DISCOUNT"
        }],
        editable: 'inline',
        columns: [{
          field: "discountValue",
          title: "GrodiscountValueup",
          filterable: {
            cell: {
              showOperators: false
            }
          }
        }, {
          field: "quantityFrom",
          title: "quantityFrom",
          // width: "120px",
          filterable: {
            cell: {
              showOperators: false
            }
          }
        }, {
          field: "quantityTo",
          title: "quantityTo",
          // width: "120px",
          filterable: {
            cell: {
              showOperators: false
            }
          }
        }, {
          field: "vipLevel",
          title: "vipLevel",
          // format: "{0:c}"
          // editor: categoryDropDownEditor,
          // template: "#=Category.CategoryName#"
        }, {
          field: "dataStart",
          title: "Date Start",
          format: "{0:yyyy-MM-dd HH:mm}",
          editor: dateTimeEditor
            // width: "120px"
        }, {
          field: "dateEnd",
          title: "Date End",
          format: "{0:yyyy-MM-dd HH:mm}",
          editor: dateTimeEditor
            // width: "120px"
        }, {
          command: ["edit", "destroy"],
          title: "&nbsp;",
          // width: 250
        }]
      };

      function dateTimeEditor(container, options) {
        $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" data-format="' + options.format + '"/>')
          .appendTo(container)
          .kendoDateTimePicker({});
      }
      $scope.$on("kendoRendered", function(e) {
        console.log("All Kendo UI Widgets are rendered.");
        $scope.keditor.refresh();
      });

      $scope.updateProduct = function(product) {
        fruitWorldAPIService.update({
            section: 'products/update/' + product.productId
          }, product)
          .$promise.then(function(res) {
            console.log(res);
          }, function(err) {
            console.log(err);
          });
      };
      $scope.backToProduct = function() {
        $state.go('products');
      }

    }])
    .controller('stockCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {

    }]);
})();
