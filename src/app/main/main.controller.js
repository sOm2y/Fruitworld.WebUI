'use strict';

angular.module('fruitWorld')
  .controller('MainController', ['$scope',function ($scope) {

    var vm = this;

    vm.userName = 'Fruit World';
    vm.helloText = 'Welcome in INSPINIA Gulp SeedProject';
    vm.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects.';
     $scope.mainGridOptions = {
                dataSource: {
                    type: "odata",
                    transport: {
                        read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Employees"
                    },
                    pageSize: 5,
                    serverPaging: true,
                    serverSorting: true
                },
                sortable: true,
                pageable: true,
                dataBound: function() {
                    this.expandRow(this.tbody.find("tr.k-master-row").first());
                },
                columns: [{
                    field: "FirstName",
                    title: "First Name",
                    width: "120px"
                    },{
                    field: "LastName",
                    title: "Last Name",
                    width: "120px"
                    },{
                    field: "Country",
                    width: "120px"
                    },{
                    field: "City",
                    width: "120px"
                    },{
                    field: "Title"
                }]
            };

            $scope.detailGridOptions = function(dataItem) {
                return {
                    dataSource: {
                        type: "odata",
                        transport: {
                            read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
                        },
                        serverPaging: true,
                        serverSorting: true,
                        serverFiltering: true,
                        pageSize: 5,
                        filter: { field: "EmployeeID", operator: "eq", value: dataItem.EmployeeID }
                    },
                    scrollable: false,
                    sortable: true,
                    pageable: true,
                    columns: [
                    { field: "OrderID", title:"ID", width: "56px" },
                    { field: "ShipCountry", title:"Ship Country", width: "110px" },
                    { field: "ShipAddress", title:"Ship Address" },
                    { field: "ShipName", title: "Ship Name", width: "190px" }
                    ]
                };
            };
  }]);
