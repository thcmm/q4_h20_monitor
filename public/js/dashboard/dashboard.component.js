(function() {
    'use strict'

    angular.module('app')
        .component('dashboard', {
            require: {
                layout: '^app'
            },
            templateUrl: '/js/dashboard/dashboard.template.html',
            controller: controller
        })

    controller.$inject = ['$http']

    function controller($http) {
        const vm = this

        vm.$onInit = onInit
        vm.drawChart = drawChart;

        function onInit() {
            console.log("c:dashboard")
            $http.get('/probedata') // /messages
                //.then(response => vm.messages = response.data)
                .then(response => vm.probeDataListing = response.data)
        }

        function drawChart() {

        }
    }
}());
