var app;
(function (app) {
    var branches;
    (function (branches) {
        "use strict";
        var BranchCtrl = (function () {
            function BranchCtrl($scope) {
                this.$scope = $scope;
                var vm = this;
                vm.title = "Branch List";
                vm.crudServiceBaseUrl = "http://fruitworldwebapi.azurewebsites.net/api/";
                vm.dataSource = new kendo.data.DataSource({
                    pageSize: 20,
                    transport: {
                        read: {
                            url: vm.crudServiceBaseUrl + "branch/read",
                            type: "get",
                            dataType: "json"
                        },
                        create: {
                            url: function (data) {
                                return vm.crudServiceBaseUrl + "branch/create";
                            },
                            type: "post",
                            dataType: "json",
                        },
                        update: {
                            url: function (data) {
                                return vm.crudServiceBaseUrl + "branch/update" + data.branchId;
                            },
                            type: "put",
                            dataType: "json"
                        },
                        destroy: {
                            url: function (data) {
                                return vm.crudServiceBaseUrl + "branch/destory" + data.branchId;
                            }
                        },
                    },
                    schema: {
                        model: {
                            id: "branchId",
                            fields: {
                                branchId: {
                                    editable: false,
                                    nullable: false
                                },
                            }
                        }
                    }
                });
                this.$scope.branchGridOptions = {
                    dataSource: vm.dataSource
                };
            }
            return BranchCtrl;
        }());
    })(branches = app.branches || (app.branches = {}));
})(app || (app = {}));
