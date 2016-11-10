(function() {
  'use strict';
  angular.module('fruitWorld')
    .controller('shoppingCartCtrl', [
      '$rootScope',
      '$scope',
      'shoppingCartService',
      'uuid2',
      '$resource',
      '$state',
      'fruitWorldAPIService',
      function($rootScope, $scope, shoppingCartService,uuid2, $resource, $state,fruitWorldAPIService) {
      var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";

      $scope.shoppingCartOrderWindow;
      $scope.shoppingCartBoxrWindow;
      $scope.newBox = {
        boxId: uuid2.newuuid(),
        barcode: "",
        boxName: "",
        unitPrice: $rootScope.totalPrice,
        description: "",
        incGst: true,
        size: "",
        boxContents: []
      };


      $scope.hasShoppingCartChanged = false;
      $scope.countedShoppingCart = shoppingCartService.getShoppingCart();
      $scope.sum = shoppingCartService.getTotalPrice($scope.countedShoppingCart);

      $scope.notf1Options = {
        templates: [{
          type: "ngTemplate",
          template: $("#notificationTemplate").html()
        }]
      };
      $scope.updateProductCount = function(index, updatedProduct) {
        $scope.countedShoppingCart[index].quantity = updatedProduct.quantity;
        shoppingCartService.getTotalPrice($scope.countedShoppingCart);
        $scope.hasShoppingCartChanged = true;
      };
      $scope.updateShoppingCart = function() {
        localStorage.setItem('countedShoppingCart', JSON.stringify($scope.countedShoppingCart));
        $scope.notf1.show({
          kValue: "Shopping Cart has been updated !"
        }, "ngTemplate");
      $scope.localDataSource.read();

      };
      $scope.deleteCartProduct = function(deleteProduct) {
        $scope.countedShoppingCart = shoppingCartService.removeProduct(deleteProduct, $scope.countedShoppingCart);
        shoppingCartService.getTotalPrice($scope.countedShoppingCart);
      };


      // Using localStorage for newBoxContentGridOption
      // var gridData = [];
      // localStorage.setItem('boxContent_data',JSON.stringify(gridData));

      $scope.localDataSource = new kendo.data.DataSource({
        transport: {
          create: function(options) {
            var localData = JSON.parse(localStorage.getItem('countedShoppingCart'));
            options.data.productId = options.data.product.productId;

            localData.push(options.data);
            localStorage.setItem('countedShoppingCart',JSON.stringify(localData));
            console.log(JSON.parse(localStorage.getItem('countedShoppingCart')));
            options.success(options.data);
          },
          read: function(options) {
            var localData = JSON.parse(localStorage.getItem('countedShoppingCart'));
            console.log(localData);
            options.success(localData);
          },
          update: function(options) {
            var localData = JSON.parse(localStorage.getItem('countedShoppingCart'));
            _.each(localData,function(boxContent){
              if (boxContent.boxContentId == options.data.boxContentId) {
                boxContent = options.data;
              }
            })
            localStorage.setItem('countedShoppingCart',JSON.stringify(localData));
            options.success(options.data);
          },
          destroy: function(options) {
            var localData = JSON.parse(localStorage.getItem('countedShoppingCart'));
            _.remove(localData,function(boxContent){
                return boxContent.boxContentId !== options.data.boxContentId;
            });
            localStorage.setItem('countedShoppingCart',JSON.stringify(localData));
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
              productId: {
                defaultValue: uuid2.newuuid()
              }
            }
          }
        },
        pageSize: 20
      });

      $("#localBoxContentGrid").kendoGrid({
        dataSource: $scope.localDataSource,
        pageable: true,
        // toolbar: ["create"],
        columns: [{
          field: "product.name",
          title: "Product Name",
          editor: productDropDownEditor,
          template: "#=product.name#",
          // width: "50%"
        }, {
          field: "quantity",
          title: "Quantity",
          format: "{0:n}",

        },
        {
          field: "product.listPrice",
          title: "Single Price",
          format: "${0:n}",

        }
        // {
        //   command: [
        //     "edit", "destroy"
        //   ],
        //   title: "Action",
        // }
      ],
        editable: "inline"
      });
      // Dropdown editor for the local box content grid
      function productDropDownEditor(container, options) {
        $('<input required name="' + options.field + '"/>').appendTo(container).kendoDropDownList({
          autoBind: false,
          filter: "contains",
          dataTextField: "name",
          dataValueField: "name",
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


      $scope.createBoxClick = function() {
        $scope.boxOptions = {
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
        $scope.shoppingCartBoxWindow.setOptions($scope.boxOptions);
        $scope.shoppingCartBoxWindow.center(); // open dailog in center of screen
        $scope.shoppingCartBoxWindow.open();
      };

      $scope.createOrderClick = function() {
        $scope.orderOptions = {
          modal: true,
          actions: [
            "Pin", "Minimize", "Maximize", "Close"
          ],
          title: "Create a New Order",
          visible: false,
          width: "800px"
        };
        $scope.orderSizeSource ={
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
        $scope.shoppingCartOrderWindow.setOptions($scope.orderOptions);
        $scope.shoppingCartOrderWindow.center(); // open dailog in center of screen
        $scope.shoppingCartOrderWindow.open();
      };

      // Submit the new box
      $scope.convertToBox = function(newBoxObject) {
        if (localStorage.getItem('countedShoppingCart'))
          newBoxObject.boxContents = JSON.parse(localStorage.getItem('countedShoppingCart'));

        fruitWorldAPIService.save({
            section: 'box/create'
          }, newBoxObject)
          .$promise.then(function(res) {
            console.log(res);
            $scope.shoppingCartBoxWindow.close();
            localStorage.clear();
          }, function(err) {
            console.log(err);
          });
      };

      $scope.closeBoxWindow = function() {
        $scope.boxWindow.close();
      };


    }]);
})();
