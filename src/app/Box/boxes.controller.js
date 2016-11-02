/**
 * Created by Felix on 2/10/2016.
 */
(function() {
  "use strict";

  angular.module('fruitWorld').controller('boxCtrl', [
    '$scope',
    'uuid2',
    '$resource',
    function($scope, uuid2, $resource) {
      // var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      var crudServiceBaseUrl = "http://localhost:64328/api/";

      // Product ForeignKey column
      var products = getProducts();
      var defaultProduct = getDefaultProduct();

      function getProducts() {
        var result = [];
        $resource(crudServiceBaseUrl + "products/read/").query().$promise.then(function(products) {
          _.forEach(products, function(product) {
            result.push({"value": product.productId, "text": product.name});
          });
        });
        return result;
      }

      function getDefaultProduct() {
        var result = [];
        $resource(crudServiceBaseUrl + "products/read/").query().$promise.then(function(products) {
          result.push(_.first(products));
        });
        return result;
      }

      console.log("Product:", products);

      // Box DataSource
      var _dataSource = new kendo.data.DataSource({
        pageSize: 20,
        transport: {
          read: {
            url: function(data) {
              return crudServiceBaseUrl + 'box/read';
            },
            type: 'get',
            dataType: "json"
          },
          create: {
            url: function(data) {
              console.log("Box Create:", data);
              return crudServiceBaseUrl + "box/create";
            },
            dataType: "json",
            type: "post",
            contentType: "application/json; charset=utf-8",
            processData: false
          },
          update: {
            url: function(data) {
              console.log("Box ID", data.boxId);
              console.log("Update:", data);
              return crudServiceBaseUrl + "box/update/?id=" + data.boxId;
            },
            dataType: "json",
            type: "put",
            contentType: "application/json;charset=utf-8",
            processData: false
          },
          destroy: {
            url: function(data) {
              console.log("Box ID:", e.data.boxId);
              console.log("Delete Data:", e.data);
              return crudServiceBaseUrl + "box/delete/?id=" + data.boxId;
            },
            dataType: "json",
            type: "delete",
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
            id: "boxId",
            fields: {
              boxId: {
                editable: false,
                nullable: false,
                defaultValue: uuid2.newuuid(),
                validation: {
                  required: true
                }
              },
              incGst: {
                type: "boolean",
                defaultValue: true
              },
              gst: {
                editable: false,
                type: "number"
              },
              weight: {
                editable: false,
                type: "number"
              },
              stock: {
                editable: false,
                type: "number"
              }
            }
          }
        }
      });
      // Box DataSource END

      // Box Grid Options
      $scope.boxGridOptions = {
        dataSource: _dataSource,
        filterable: true,
        sortable: true,
        toolbar: kendo.template($("#createBoxTemplate").html()),
        pageable: true,
        detailInit: detailInit,
        dataBound: function() {
          this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [
          {
            template: "<a href='' class='btn btn-info' ng-click='showDetails(this)'><i class='fa fa-info-circle' aria-hidden='true'></i></a>",
            title: "&nbsp;",
            width: "3%"
          }, {
            field: "barcode",
            title: "Barcode",
            width: "10%"
          }, {
            field: "unitPrice",
            title: "Unit Price",
            format: "{0:c}",
            width: "10%"
          }, {
            field: "gst",
            title: "GST",
            format: "{0:c}",
            width: "5%"
          }, {
            field: "incGst",
            title: "Inc.Gst",
            template: "#=incGst? \"<span class='label label-primary'>Yes</span>\" :  \"<span class='label label-danger'>No</span>\"#",
            width: "5%"
          }, {
            field: "weight",
            title: "Weight",
            format: "{0:n2}KG",
            width: "5%"
          }, {
            field: "size",
            title: "Size",
            width: "10%"
          }, {
            field: "stock",
            title: "Stock",
            width: "5%"
          }, {
            field: "description",
            title: "Description"
          }, {
            command: [
              "edit", "destroy"
            ],
            title: "Action",
            width: "10%"
          }
        ],
        editable: {
          mode: "inline"
        }
      };

      $scope.showDetails = function(e) {
        // e.preventDefault();
        $rootScope.boxDataItem = e.dataItem;
        localStorage.setItem('boxData', JSON.stringify($rootScope.boxDataItem));
        $state.go('boxes.details', {
          product: JSON.stringify($rootScope.boxDataItem)
        });
      }

      function detailInit(e) {
        $("<div/>").appendTo(e.detailCell).kendoGrid({
          dataSource: {
            pageSize: 10,
            transport: {
              read: {
                url: function(data) {
                  return crudServiceBaseUrl + "boxContent/read/?boxId=" + e.data.boxId;
                },
                dataType: "json",
                type: 'GET'
              },
              create: {
                url: function(data) {
                  console.log("Box Create:", e.data);
                  return crudServiceBaseUrl + "boxContent/create/?boxId=" + e.data.boxId;
                },
                type: "post",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                processData: false
              },
              update: {
                url: function(data) {
                  console.log("Box Content ID", e.data.boxContentId);
                  console.log("Update:", e.data);
                  return crudServiceBaseUrl + "boxContent/update/?id=" + data.boxContentId;
                },
                type: "put",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                processData: false
              },
              destroy: {
                url: function(data) {
                  return crudServiceBaseUrl + "boxContent/delete/?id=" + e.data.boxContentId;
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
              if (e.errors) {
                var message = "Errors:\n";
                $.each(e.errors, function(key, value) {
                  if ('errors' in value) {
                    $.each(value.errors, function() {
                      message += this + "\n";
                    });
                  }
                });
                alert(message);
              }
            },
            schema: {
              model: {
                id: "boxContentId",
                fields: {
                  boxContentId: {
                    editable: false,
                    nullable: false,
                    defaultValue: uuid2.newuuid()
                  },
                  boxId: {
                    defaultValue: uuid2.newuuid()
                  },
                  weight: {
                    editable: false,
                    defaultValue: 1
                  },
                  quantity: {
                    type: "number"
                  },
                  productId: {
                    defaultValue: uuid2.newuuid()
                  }
                }
              }
            }
          },
          editable: "inline",
          toolbar: [
            {
              name: "create",
              text: "New Product"
            }
          ],
          sortable: true,
          pageable: true,
          columns: [
            {
              field: "productId",
              title: "Product Name",
              values: products
            }, {
              field: "quantity",
              title: "Quantity",
              format: "{0:n}"
            }, {
              field: "weight",
              title: "Weight",
              format: "{0:n2}KG"
            }, {
              command: [
                "edit", "destroy"
              ],
              title: "Action"
            }
          ]
        });
      }

      // Setting Window for  New Box
      var newBox = $("#createBoxDialog");

      if (!newBox.data("kendoWindow")) {
        newBox.kendoWindow({
          modal: true,
          actions: [
            "Pin", "Minimize", "Maximize", "Close"
          ],
          title: "Create a New Box",
          visible: false,
          width: "800px"
        });
      }

      $scope.createBoxClick = function() {
        newBox.data("kendoWindow").center().open();
      }

      $(".close-button").click(function() {
        // call 'close' method on nearest kendoWindow
        $(this).closest("[data-role=window]").data("kendoWindow").close();
        // the above is equivalent to:
        //$(this).closest(".k-window-content").data("kendoWindow").close();
      });

      $("#boxUnitPrice").kendoNumericTextBox({min: 0.00, max: 9999999999.99, format: "c", decimals: 2});

      $("#boxSize").kendoComboBox({filter: "contains"});

      // Box View Model
      var boxViewModel = kendo.observable({
        boxId: uuid2.newuuid(),
        barcode: null,
        unitPrice: 0.00,
        description: null,
        incGst: true,
        size: null,
        boxContents: [],
        boxSizeSource: new kendo.data.DataSource({
          transport: {
            read: {
              url: function() {
                return crudServiceBaseUrl + "Box/BoxSize";
              },
              dataType: "json"
            }
          }
        })
      });

      kendo.bind($("#createBoxDialog"), boxViewModel);

      // Using localStorage for newBoxContentGridOption
      var gridData = [];
      localStorage["boxContent_data"] = JSON.stringify(gridData);

      var localDataSource = new kendo.data.DataSource({
        transport: {
          create: function(options) {
            var localData = JSON.parse(localStorage["boxContent_data"]);
            options.data.boxContentId = uuid2.newuuid();
            options.data.boxId = boxViewModel.get("boxId");
            localData.push(options.data);
            localStorage["boxContent_data"] = JSON.stringify(localData);
            console.log(localStorage["boxContent_data"]);
            options.success(options.data);
          },
          read: function(options) {
            var localData = JSON.parse(localStorage["boxContent_data"]);
            options.success(localData);
          },
          update: function(options) {
            var localData = JSON.parse(localStorage["boxContent_data"]);

            for (var i = 0; i < localData.length; i++) {
              if (localData[i].boxContentId == options.data.boxContentId) {
                localData[i] = options.data;
              }
            }
            localStorage["boxContent_data"] = JSON.stringify(localData);
            options.success(options.data);
          },
          destroy: function(options) {
            var localData = JSON.parse(localStorage["boxContent_data"]);
            for (var i = 0; i < localData.length; i++) {
              if (localData[i].boxContentId === options.data.boxContentId) {
                localData.splice(i, 1);
                break;
              }
            }
            localStorage["boxContent_data"] = JSON.stringify(localData);
            options.success(localData);
          }
        },
        schema: {
          model: {
            id: "boxContentId",
            fields: {
              boxContentId: {
                editable: false,
                nullable: false,
                defaultValue: uuid2.newuuid()
              },
              boxId: {
                defaultValue: uuid2.newuuid()
              },
              quantity: {
                type: "number",
                defaultValue: 1
              },
              product: {
                defaultValue: {
                  productId: defaultProduct.productId,
                  name: defaultProduct.name
                }
              }
            }
          }
        },
        pageSize: 20
      });

      $("#localBoxContentGrid").kendoGrid({
        dataSource: localDataSource,
        pageable: true,
        toolbar: ["create"],
        columns: [
          {
            field: "product",
            title: "Product Name",
            editor: productDropDownEditor,
            template: "#=product.name#",
            width: "50%"
          }, {
            field: "quantity",
            "title": "Quantity",
            format: "{0:n}",
            width: "20%"
          }, {
            command: [
              "edit", "destroy"
            ],
            title: "Action",
            width: "30%"
          }
        ],
        editable: "inline"
      });

      // Dropdown editor for the local box content grid
      function productDropDownEditor(container, options) {
        $('<input required name="' + options.field + '"/>').appendTo(container).kendoDropDownList({
          autoBind: false,
          filter: "contains",
          dataTextField: "name",
          dataValueField: "productId",
          dataSource: {
            transport: {
              read: {
                url: function() {
                  return crudServiceBaseUrl + "products/read";
                },
                dataType: "json"
              }
            }
          }
        });
      }

      // Submit the new box
      $scope.submitBoxClick = function() {
        var localData = JSON.stringify(localStorage["boxContent_data"]);
        console.log("local data:", localData);
        boxViewModel.set("boxContents",localStorage["boxContent_data"]);
      }
    }
  ]);
})();
