'use strict';

angular.module('fruitWorld')
  .controller('productCtrl', ['$scope',function ($scope) {
     $scope.mainGridOptions = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: "//localhost:64328/api/Products/read"
                    },
                    pageSize: 5,
                    serverPaging: true,
                    serverSorting: true
                },
                sortable: true,
                pageable: true,
                editable: true,
                toolbar: ["create"],
                dataBound: function() {
                    this.expandRow(this.tbody.find("tr.k-master-row").first());
                },
                columns: [{
                    field: "name",
                    title: "Name",
                    width: "120px"
                    },{
                    field: "category",
                    title: "Category",
                    width: "120px"
                    },{
                    field: "weight",
                    title: "Weight",
                    width: "120px"
                    },{
                    field: "gst",
                    title: "GST",
                    width: "120px"
                    },{
                    field: "size",
                    width: "120px"
                    },{
                    field: "expiration",
                    width: "180px",
                    type:"date",
                    format: "{0:dd MMMM yyyy}"
                    },{
                    field: "quantity"
                    },{
                    command: ["edit","destroy"],
                    title: "&nbsp;",
                    width: 250
                  }]
            };
            //
            // $scope.detailGridOptions = function(dataItem) {
            //     return {
            //         dataSource: {
            //             type: "json",
            //             transport: {
            //                 read: "//localhost:64328/api/Products/read"
            //             },
            //             serverPaging: true,
            //             serverSorting: true,
            //             serverFiltering: true,
            //             pageSize: 5,
            //             filter: { field: "EmployeeID", operator: "eq", value: dataItem.EmployeeID }
            //         },
            //         scrollable: false,
            //         sortable: true,
            //         pageable: true,
            //         columns: [
            //         { field: "OrderID", title:"ID", width: "56px" },
            //         { field: "ShipCountry", title:"Ship Country", width: "110px" },
            //         { field: "ShipAddress", title:"Ship Address" },
            //         { field: "ShipName", title: "Ship Name", width: "190px" }
            //         ]
            //     };
            // };
  }]);
