/**
 * Created by Felix on 2/10/2016.
 */
(function() {
  "use strict";

  angular.module('fruitWorld').controller('boxCtrl', [
    '$scope',
    'uuid2',
    function($scope, uuid2) {
      var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      //var crudServiceBaseUrl = "http://localhost:64328/api/";

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
                defaultValue: uuid2.newuuid()
              },
              incGst: {
                defaultValue: true
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
        pageable: true,
        dataBound: function() {
          this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        toolbar: [
          {
            name: "create",
            text: "NEW Box"
          }
        ],
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
            template: "#= kendo.toString(weight,'0.00') + weightUnit#"
          }, {
            field: "size",
            title: "Size"
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
      // Box Content Grid Options
      $scope.boxContentGridOptions = function(dataItem) {
        return {
          dataSource: {
            save: function(e){
              $("#boxContentGrid").data("kendoGrid").dataSource.refresh();
            },
            pageSize: 10,
            transport: {
              read: {
                url: function(data) {
                  return crudServiceBaseUrl + "boxContent/read/?boxId=" + dataItem.boxId;
                },
                dataType: "json",
                type: 'get'
              },
              create: {
                url: function(data) {
                  console.log("Box Create:", dataItem);
                  return crudServiceBaseUrl + "boxContent/create/?boxId="+dataItem.boxId;
                },
                type: "post",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                processData: false
              },
              update: {
                url: function(data) {
                  console.log("Box Content ID", data.boxContentId);
                  console.log("Update:", data);
                  return crudServiceBaseUrl + "boxContent/update/?id=" + data.boxContentId;
                },
                type: "put",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                processData: false
              },
              destroy: {
                url: function(data) {
                  return crudServiceBaseUrl + "boxContent/delete/?id=" + data.boxContentId;
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
                id: "boxContentId",
                fields: {
                  boxContentId: {
                    editable: false,
                    nullable: false,
                    defaultValue: uuid2.newuuid()
                  },
                  weight: {
                    editable: false
                  },
                  quantity:{
                    type: "number"
                  }
                }
              }
            }
          },
          sortable: true,
          pageable: true,
          editable: "inline",
          toolbar: [
            {
              name: "create",
              text: "NEW Product"
            }
          ],
          columns: [
            {
              field: "productId",
              title: "Product Name",
              editor: productComboBoxEditor,
              template: "#=product.name#"
            }, {
              field: "quantity",
              "title": "Quantity"
            }, {
              field: "weight",
              title: "Weight",
              template: "#= kendo.toString(weight,'0.00')#KG"
            }, {
              command: [
                "edit", "destroy"
              ],
              title: "Action"
            }
          ]
        };
      };

      //Product ComboBox
      function productComboBoxEditor(container, options) {
        $('<input required name="' + options.field + '"/>').appendTo(container).kendoComboBox({
          autoBind: false,
          suggest: true,
          filter: "contains",
          dataTextField: "name",
          dataValueField: "productId",
          dataSource: {
            type: "json",
            transport: {
              read: crudServiceBaseUrl + "products/read/"
            }
          }
        });
      }
    }
  ]);
})();
