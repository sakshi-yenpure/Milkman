app.controller('StaffController', ['$scope', '$http', 'API_BASE_URL', function($scope, $http, API_BASE_URL) {
    $scope.items = [];
    $scope.newItem = {};

    $scope.loadItems = function() {
        $http.get(API_BASE_URL + '/staff/staff/').then(function(response) {
            $scope.items = response.data;
        });
    };

    $scope.addItem = function() {
        $http.post(API_BASE_URL + '/staff/staff/', $scope.newItem).then(function() {
            $scope.newItem = {};
            $scope.loadItems();
        });
    };

    $scope.deleteItem = function(id) {
        $http.delete(API_BASE_URL + '/staff/staff/' + id + '/').then(function() {
            $scope.loadItems();
        });
    };

    $scope.startEdit = function(item) {
        item._editBackup = { name: item.name };
        item.editing = true;
    };

    $scope.cancelEdit = function(item) {
        if (item._editBackup) {
            item.name = item._editBackup.name;
        }
        item.editing = false;
        item._editBackup = null;
    };

    $scope.saveEdit = function(item) {
        $http.put(API_BASE_URL + '/staff/staff/' + item.id + '/', { name: item.name }).then(function() {
            item.editing = false;
            item._editBackup = null;
            $scope.loadItems();
        });
    };

    $scope.loadItems();
}]);
