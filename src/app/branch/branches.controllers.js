/**
 * Created by felixshu on 26/09/16.
 */
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
                // Datasource Configuration
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
                                name: {
                                    validation: {
                                        required: true,
                                        min: 1,
                                    }
                                },
                                phone: {
                                    type: "string",
                                    validation: {
                                        required: true,
                                        min: 1
                                    } },
                                email: {
                                    type: "string",
                                    validation: {
                                        email: true,
                                        required: false
                                    }
                                },
                                "fax": "string",
                                "apt": "string",
                                "street": "string",
                                "line1": "string",
                                "city": "string",
                                "state": "string",
                                "postCode": "string",
                                "country": "string",
                                "fullAddress": "string"
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
