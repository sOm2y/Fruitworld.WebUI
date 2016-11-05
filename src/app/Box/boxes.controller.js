/**
 * Created by Felix on 2/10/2016.
 */
(function() {
  "use strict";

  angular.module('fruitWorld').controller('boxCtrl', [
    '$rootScope',
    '$scope',
    'uuid2',
    '$resource',
    '$state',
    'fruitWorldAPIService',
    function($rootScope, $scope, uuid2, $resource, $state,fruitWorldAPIService) {
      var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      //var crudServiceBaseUrl = "http://localhost:64328/api/";

      $scope.boxWindow;
      // Box View Model
      $scope.newBox = {
        boxId: uuid2.newuuid(),
        barcode: null,
        unitPrice: 0.00,
        description: null,
        incGst: true,
        size: null,
        boxContents: []
      };

      // Product ForeignKey column
      $scope.products = [];
      $scope.defaultProduct = [];
      fruitWorldAPIService.query({
          section: 'products/read'
        })
        .$promise.then(function(res) {
          _.forEach(res, function(product) {
              $scope.products.push({
                "value": product.productId,
                "text": product.name
              });
          });
          $scope.defaultProduct.push(_.first($scope.products));
          console.log("Product:", $scope.products);
          console.log("Default Product:", $scope.defaultProduct);
        }, function(err) {
          console.log(err);
        });




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
        columns: [{
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
        }],
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
                  return crudServiceBaseUrl + "boxContent/update/?id=" + e.data.boxContentId;
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
                    nullable:true,
                    defaultValue: uuid2.newuuid()
                  }
                }
              }
            }
          },
          editable: "inline",
          toolbar: [{
            name: "create",
            text: "New Product"
          }],
          sortable: true,
          pageable: true,
          columns: [{
            field: "productId",
            title: "Product Name",
            values: $scope.products
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
          }]
        });
      }

      // Setting Window for  New Box

      $scope.createBoxClick = function() {
        $scope.DlgOptions = {
          modal: true,
          actions: [
            "Pin", "Minimize", "Maximize", "Close"
          ],
          title: "Create a New Box",
          visible: false,
          width: "800px"
        };
        $scope.boxSizeSource ={
          transport: {
            read: {
              url: function() {
                return crudServiceBaseUrl + "box/boxSize";
              },
              dataType: "json"
            }
          }
        };
        $("#boxUnitPrice").kendoNumericTextBox({
          min: 0.00,
          max: 9999999999.99,
          format: "c",
          decimals: 2
        });
        $scope.boxWindow.setOptions($scope.DlgOptions);
        $scope.boxWindow.center(); // open dailog in center of screen
        $scope.boxWindow.open();
      };



      // Using localStorage for newBoxContentGridOption
      var gridData = [];
      localStorage.setItem('boxContent_data',JSON.stringify(gridData));

      var localDataSource = new kendo.data.DataSource({
        transport: {
          create: function(options) {
            var localData = JSON.parse(localStorage.getItem('boxContent_data'));
            options.data.boxContentId = uuid2.newuuid();
            options.data.boxId = $scope.newBox.boxId;
            localData.push(options.data);
            localStorage.setItem('boxContent_data',JSON.stringify(localData));
            console.log(JSON.parse(localStorage.getItem('boxContent_data')));
            options.success(options.data);
          },
          read: function(options) {
            var localData = JSON.parse(localStorage.getItem('boxContent_data'));
            options.success(localData);
          },
          update: function(options) {
            var localData = JSON.parse(localStorage.getItem('boxContent_data'));
            _.each(localData,function(boxContent){
              if (boxContent.boxContentId == options.data.boxContentId) {
                boxContent = options.data;
              }
            })
            localStorage.setItem('boxContent_data',JSON.stringify(localData));
            options.success(options.data);
          },
          destroy: function(options) {
            var localData = JSON.parse(localStorage.getItem('boxContent_data'));
            _.remove(localData,function(boxContent){
                return boxContent.boxContentId !== options.data.boxContentId;
            });
            localStorage.setItem('boxContent_data',JSON.stringify(localData));
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
                  productId: uuid2.newuuid(),
                  name: null
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
        columns: [{
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
        }],
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
      $scope.submitBoxClick = function(newBoxObject) {
        if (localStorage.getItem('boxContent_data'))
           newBoxObject.boxContents = JSON.parse(localStorage.getItem('boxContent_data'));
        fruitWorldAPIService.save({
            section: 'box/create'
          }, newBoxObject)
          .$promise.then(function(res) {
            console.log(res);

            $scope.boxGridOptions.dataSource.read();
            $scope.boxWindow.close();
          }, function(err) {
            console.log(err);
          });

         var localData = JSON.stringify(localStorage["boxContent_data"]);
        // console.log("local data:", localData);
        // // boxViewModel.set("boxContents",localStorage["boxContent_data"]);

      };

    }
  ]);
})();
