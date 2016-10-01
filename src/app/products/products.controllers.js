(function() {

  'use strict';

  angular.module('fruitWorld')
    .controller('productCtrl', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
      //var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      var crudServiceBaseUrl = "http://localhost:64328//api/";
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
                return crudServiceBaseUrl + "/products/create/";
              },
              dataType: "json",
              type: "post",
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
            },
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
                  nullable: false,
                  defaultValue: "",
                  validation:{
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
        },
          {
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
            dataTextField: "category",
            dataValueField: "category",
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
      console.log($rootScope.productDataItem);

      $scope.discountGridOption = {
        dataSource: {
          transport: {
            read: {
              url: "http://fruitworldwebapi.azurewebsites.net/api/products/read",
              dataType: "json",
              type: "get"
            },
            create: {
              url: "http://fruitworldwebapi.azurewebsites.net/api/products/create/",
              type: "post"
            },
            update: {
              url: function(data) {
                console.log(data);
                return "http://fruitworldwebapi.azurewebsites.net/api/products/update/" + data.models[0].productId;
              },
              // dataType: "json",
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
            model: {

            }
          }
        },
        filterable: {
          mode: "row"
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
          field: "group",
          title: "Group",
          filterable: {
            cell: {
              showOperators: false
            }
          }
        }, {
          field: "quantity",
          title: "Quantity",
          // width: "120px",
          filterable: {
            cell: {
              showOperators: false
            }
          }
        }, {
          field: "discount",
          title: "Discount",
          format: "{0:c}"
            // editor: categoryDropDownEditor,
            // template: "#=Category.CategoryName#"
        }, {
          field: "dateStart",
          title: "Date Start"
            // width: "120px"
        }, {
          field: "dateEnd",
          title: "Date End"
            // width: "120px"
        }, {
          command: ["edit", "destroy"],
          title: "&nbsp;",
          // width: 250
        }]
      };


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

    }]);
})();
