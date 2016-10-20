(function() {
  'use strict';

  angular.module('fruitWorld')
    .controller('orderCtrl', ['$scope', 'uuid2', 'fruitWorldAPIService', function($scope, uuid2, fruitWorldAPIService) {
      var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
      //var crudServiceBaseUrl = "http://localhost:64328/api/";


      // Get Order Count
      function orderCount() {
        var count = 0;
        fruitWorldAPIService.get({
            section: "order/read"
          })
          .$promise.then(function(orders) {
            count = _.size(orders);
          });
        return count;
      }

      // GET contact and address for ForeignKey
      var contacts = getContacts();
      var addresses = getAddresses();

      function getContacts() {
        var result = [];
        fruitWorldAPIService.get({
            section: "contact/read"
          })
          .$promise.then(function(cats) {
            _.forEach(cats, function(cat) {
              result.push({
                "contactId": cat.contactId,
                "fullName": cat.fullName
              });
            });
          });
        return result;
      }

      function getAddresses() {
        var result = [];
        fruitWorldAPIService.get({
            section: "address/read"
          })
          .$promise.then(function(addes) {
            _.forEach(addes, function(address) {
              result.push({
                "addressId": address.addressId,
                "fullAddress": address.fullAddress
              });
            });
          });
        return result;
      }

      // Order Data Source
      var _orderDataSource = new kendo.data.DataSource({
        pageSize: 20,
        transport: {
          read: {
            url: function(data) {
              return crudServiceBaseUrl + "order/read";
            },
            type: "GET",
            dataType: "json"
          },
          create: {
            url: function(data) {
              console.log("Order Create:", data);
              return crudServiceBaseUrl + "order/create";
            },
            dataType: "json",
            type: "post",
            contentType: "application/json; charset=utf-8",
            processData: false
          },
          update: {
            url: function(data) {
              console.log("Order ID", data.orderId);
              console.log("Update:", data);
              return crudServiceBaseUrl + "order/update/?id=" + data.orderId;
            },
            dataType: "json",
            type: "put",
            contentType: "application/json;charset=utf-8",
            processData: false
          },
          destroy: {
            url: function(data) {
              return crudServiceBaseUrl + "order/delete/?id=" + data.orderId;
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
            id: "orderId",
            fields: {
              orderId: {
                eitable: false,
                nullable: false,
                defaultValue: "OD" + kendo.toString(_.now(), 'ddMMyyyy') + orderCount() + 1,
                validation: {
                  required: true
                }
              },
              totalDue: {
                editable: false
              },
              shippingFee: {
                nullable: false,
                editable: false
              },
              payDue: {
                type: "date"
              },
              placeDate: {
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

      // Order Grid Options
      $scope.orderGridOptions = {
        dataSource: _orderDataSource,
        filterable: true,
        sortable: true,
        pageable: true,
        groupable: true,
        editable: "inline",
        toolbar: [{
          name: "create",
          text: "NEW Order"
        }],
        columns: [{
          field: "orderId",
          title: "Order ID"
        }, {
          field: "fromContactId",
          title: "From",
          values: contacts
        }, {
          field: "fromAddressId",
          title: "Delivery From",
          values: addresses
        }, {
          field: "toContactId",
          title: "To",
          values: contacts
        }, {
          field: "toAddressId",
          title: "From Address",
          values: addresses
        }, {
          field: "shippingFee",
          title: "Freight",
          format: "{0:c2}"
        }, {
          field: "totalWeight",
          title: "Total Weight",
          format: "{0: n2}KG"
        }, {
          field: "totalDue",
          title: "Total Due",
          format: "{0:c2}"
        }, {
          command: [
            "edit", {
              text: "Credit",
              click: showCredit
            }
          ],
          title: "Action"
        }]
      };
      //Order Grid Options

      // Credit Windows
      var wnd = $("#creditWindows").kendoWindows({
        title: "Credit",
        modal: true,
        visiable: true,
        resizable: false
      }).data("kendoWindow");

      detailsTemplate = kendo.template($("#creditTemplate").html());
    }]);

  function showCredit(e) {
    e.preventDefault();
    var dataItem = dataItem($(e.currentTarget).closest("tr"));
    wnd.content(creditTemplate(dataItem));
    wnd.center().open();
  }

  $scope.creditOrder = function(dataItem) {
    fruitWorldAPIService.update({
        section: "order/creditOrder/" + dataItem.orderId
      }, dataItem)
      .$promise.then(function(res) {
        console.log(res);
      }, function(err) {
        console.log(err);
      });
  };

  $scope.cancelCredit = function() {
    // call 'close' method on nearest kendoWindow
    $(this).closest("[data-role=window]").data("kendoWindow").close();
  };

})();
