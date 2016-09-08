'use strict';

angular.module('fruitWorld')
  .controller('productCtrl', ['$scope','$state',function ($scope,$state) {
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
                filterable: {
                    mode: "row"
                },
                sortable: true,
                pageable: true,
                // editable: true,
                editable: "popup",
                toolbar: [{ name: "create", text: "ADD PRODUCT" }],
                dataBound: function() {
                    this.expandRow(this.tbody.find("tr.k-master-row").first());
                },
                columns: [
                    {
                    field: "barcode",
                    title: "Barcode",
                    width: "120px",
                    filterable: {
                        cell: {
                            showOperators: false
                        }
                    }
                    },{
                    field: "name",
                    title: "Name",
                    // width: "120px",
                    filterable: {
                        cell: {
                            showOperators: false
                        }
                    }
                    },{
                    field: "category",
                    title: "Category",
            
                    },{
                    field: "listPrice",
                    title: "Price",
                    // width: "120px"
                    },{
                    field: "gst",
                    title: "GST",
                    // width: "120px"
                    },{
                    field: "gstInclude",
                    title: "Gst Include",
                    // width: "120px"
                    },{
                    field: "weight",
                    title: "Weight",
                    // width: "120px"
                    },{
                    field: "size",
                    title: "Size",
                    // width: "180px",
                    },{
                    field: "safeStockLevel",
                    title:"Safe Stock Level"
                    },{
                    command: [{ name: "customEdit", text: "Edit", imageClass: "k-edit", className: "k-custom-edit", iconClass: "k-icon", click: showDetails },"destroy"],
                    title: "&nbsp;",
                    // width: 250
                  }]
            };
            function showDetails(e){
                e.preventDefault();
                $state.go('products.details');
            }

            $scope.$on("kendoWidgetCreated", function(event, widget){
            if (widget === $scope.myGrid) {
              widget.element.find(".k-custom-edit").on("click", function(e){
                e.preventDefault();
                var selected = $scope.myGrid.select();
                if(selected.length == 0){
                    alert('No record selected');
                } else {
                  // $scope.myGrid.editRow(selected);
                    alert(' record selected');
                }

              });
            }
          });
             $scope.onSelect = function(e) {
                    var message = $.map(e.files, function(file) { return file.name; }).join(", ");
                    kendoConsole.log("event :: select (" + message + ")");
                }

  }]);
