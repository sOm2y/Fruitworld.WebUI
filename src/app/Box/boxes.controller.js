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
      //var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      var crudServiceBaseUrl = "http://localhost:64328/api/";

      // Product ForeignKey column
      var products = getProducts();

      function getProducts() {
        var result = [];
        $resource(crudServiceBaseUrl + "products/read/").query().$promise.then(function(products) {
          _.forEach(products, function(product) {
            result.push({"value": product.productId, "text": product.name});
          });
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
            field: "barcode",
            title: "Barcode"
          }, {
            field: "unitPrice",
            title: "Unit Price",
            format: "{0:c}"
          }, {
            field: "gst",
            title: "GST",
            format: "{0:c}"
          }, {
            field: "incGst",
            title: "Inc.Gst",
            template: "#=incGst? \"<span class='label label-primary'>Yes</span>\" :  \"<span class='label label-danger'>No</span>\"#"
          }, {
            field: "weight",
            title: "Weight",
            format: "{0:n2}KG"
          }, {
            field: "size",
            title: "Size"
          }, {
            field: "stock",
            title: "Stock"
          }, {
            field: "description",
            title: "Description"
          }, {
            command: [
              "edit", "destroy"
            ],
            title: "Action"
          }
        ],
        editable: {
          mode: "inline"
        }
      };

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
              "title": "Quantity"
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

      var newBox = $("#createBoxDialog");

      if (!newBox.data("kendoWindow")) {
        newBox.kendoWindow({
          modal: true,
          actions: [
            "Minimize", "Maximize", "Close"
          ],
          title: "Create a New Box",
          visible: false
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
    }
  ]);
})();
