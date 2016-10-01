(function() {
  'use strict';
  angular.module('fruitWorld')
    .controller('branchCtrl', ['$scope', function($scope) {
      var crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";

      // DataSource
      var _dataSource = new kendo.data.DataSource({
        pageSize: 20,
        transport: {
          read: {
            url: function(data) {
              return crudServiceBaseUrl + "branch/read";
            },
            type: "GET",
            dataType: "json"
          },
          create: {
            url: function(data) {
              return crudServiceBaseUrl + "Branch/Create";
            },
            type: "POST",
            dataType: "json"
          },

          update: {
            url: function(data) {
              return crudServiceBaseUrl + "Branch/Update" + data.branchId;
            },
            type: "PUT",
            dataType: "json"
          },

          destroy: {
            url: function(data) {
              return crudServiceBaseUrl + "Branch/Delete" + data.branchId;
            },
            type: "DELETE",
            dataType: "json"
          },
          parameterMap: function(options, operation) {
            if (operation !== "read" && options.models) {
              return {
                models: kendo.stringify(options.models)
              };
            }
          }
        },
        schema: {
          model: {
            id: "branchId",
            fields: {
              branchId: {
                editable: false,
                nullable: false
              },
              name: {
                validation: {
                  required: true,
                  min: 1,
                  nameValidation: function(input) {
                    if (input.is("[name='Name']") && input.val().lenght > 120) {
                      input.attr("data-nameValidation-msg", "The length of the branch name should less than 120 characters");
                      return false;
                    }
                  }
                }
              },
              contactName: {
                type: "string"
              },
              phone: {
                type: "string",
                validation: {
                  phone: true,
                  required: true,
                  min: 1
                }
              },
              email: {
                type: "string",
                validation: {
                  email: true,
                  required: false
                }
              },
              fax: {
                type: "string",
                validation: {
                  phone: true,
                  required: false,
                  faxValidation: function(input) {
                    if (input.is(["[name='Fax']"]) && input.val().lenght > 100) {
                      input.attr("data-faxValidation-msg", "The length of the fax should less than 100 characters");
                      return false;
                    }
                  }
                }
              },
              apt: {
                type: "string",
                validation: {
                  required: false,
                  min: 1,
                  aptValidation: function(input) {
                    if (input.is(["[name='Apartment']"]) && input.val().lenght > 50) {
                      input.attr("data-aptValidation-msg", "The length of the apartment number should less than 50 characters");
                      return false;
                    }
                  }
                }
              },
              street: {
                type: "string",
                validation: {
                  required: true,
                  min: 2,
                  streetValidation: function(input) {
                    if (input.is(["[name='Street']"]) && input.val().lenght > 120) {
                      input.attr("data-streetValidation-msg", "The length of the street should less than 120 characters");
                      return false;
                    }
                  }
                }
              },
              line1: {
                type: "string"
              },
              city: {
                type: "string",
                validation: {
                  required: true,
                  cityValidation: function(input) {
                    if (input.is(["[name='City']"]) && input.val().lenght > 50) {
                      input.attr("data-faxValidation-msg", "The length of the city name should less than 50 characters");
                      return false;
                    }
                  }
                }
              },
              state: {
                type: "string",
                validation: {
                  required: true,
                  stateValidation: function(input) {
                    if (input.is(["[name='State']"]) && input.val().lenght > 50) {
                      input.attr("data-stateValidation-msg", "The length of the state should less than 50 characters");
                      return false;
                    }
                  }
                }
              },
              postCode: {
                type: "string",
                validation: {
                  required: true,
                  min: 1,
                  postCodeValidation: function(input) {
                    if (input.is(["[name='Post Code']"]) && input.val().lenght > 50) {
                      input.attr("data-postCodeValidation-msg", "The length of the state should less than 50 characters");
                      return false;
                    }
                  }
                }
              },
              country: {
                type: "string",
                validation: {
                  required: true,
                  min: 2,
                  countryValidation: function(input) {
                    if (input.is(["[name='Country']"]) && input.val().lenght > 50) {
                      input.attr("data-countryValidation-msg", "The length of the state should less than 50 characters");
                      return false;
                    }
                  }
                }
              },
              fullAddress: {
                type: "string",
                editable: false
              }
            }
          }
        }
      });
      // -- DataSource END

      // Branch Grid Option
      $scope.branchGridOptions = {
        dataSource: _dataSource,
        filterable: true,
        sortable: true,
        toolbar: [{
          name: "create",
          text: "NEW Branch"
        }],
        columns: [{
          field: "name",
          title: "Branch Name"
        }, {
          field: "contactName",
          title: "Contact"
        }, {
          field: "phone",
          title: "Phone"
        }, {
          field: "email",
          title: "Email"
        }, {
          field: "fullAddress",
          title: "Address"
        }, {
          command: ["edit", "destroy"],
          title: "Action"
        }],
        editable: {
          mode: "popup",
          template: getTemplate("template")
        }
      };

      function getTemplate(id) {
        return document.getElementById(id);
      }

    }]);
})();
