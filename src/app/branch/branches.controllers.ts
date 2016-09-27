/**
 * Created by felixshu on 26/09/16.
 */
namespace app.branches {
  "use strict";

  interface IBranchModel {
    title: string;
    crudServiceBaseUrl: string;
    dataSource: kendo.data.DataSource;
  }

  interface IBranchScope extends ng.IScope {
    branchGridOptions: kendo.ui.GridOptions;
  }

  class BranchCtrl implements IBranchModel {
    title: string;
    crudServiceBaseUrl: string;
    dataSource: kendo.data.DataSource;

    constructor(private $scope: IBranchScope) {
      let vm = this;
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
            url: (data: app.domain.IBranch) => {
              return vm.crudServiceBaseUrl + "branch/create";
            },
            type: "post",
            dataType: "json",
          },
          update: {
            url: (data: app.domain.IBranch) => {
              return vm.crudServiceBaseUrl + "branch/update" + data.branchId;
            },
            type: "put",
            dataType: "json"
          },
          destroy: {
            url: (data: app.domain.IBranch) => {
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
  }
}
