/************************************/
/**          chart.component.js    **/
/************************************/

(function() {
    'use strict';

    angular.module('app')
        .component('zingChartView', {
            require: {
                layout: '^app'
            },
            templateUrl: '/js/charts/chart.template.html',
            controller: controller
        });

    controller.$inject = ['$http', '$interval', '$scope'];

    function controller($http, $interval, $scope) {
        const vm = this;

        vm.$onInit = onInit;
        // Variabler
        vm.dataReadUpdate = null;
		vm.probeDataListing = null;
        vm.ph = 0.00;
		vm.ec = 0.00;
		vm.do = 0.00;
		vm.orp = 0.00;
		vm.tempuw = 0.00;
		vm.tempamb = 0.00;
		vm.humidity = 0.00;
		vm.createdDate = null;
		vm.createdTime = null;

		zingchart.THEME = "dark";
		$scope.myJson = {
			"type": "area",
			"plot":{
				"aspect":"spline"
			},
			"series": [
				{"values":[]},
				{"values":[]},
				{"values":[]}
			]
		}
		;



        // Funktioner
        vm.drawChart = drawChart;
        vm.parseReadingResponse = parseReadingResponse;
        vm.updateUI = updateUI;
        vm.updateChart = updateChart;

        // TODO Setup 2-way binding between readings and component
        function onInit() {
            console.log("c:dashboard f:onInit")
            // $http.get('/probedata')
            $http.get('http://10.9.13.51')
				.then(function successCallback(response) {
                    let dataItemRead = response.data.variables;
					parseReadingResponse(dataItemRead);
				}, function errorCallback(response) {
					console.log('Err: ', response.data)
				});
				// .catch(console.error);
                // .then(response => vm.probeDataListing = response.data)
                // .then(console.log('responseData: ', response.data))
			$interval(updateChart, 5000);
        }

        function updateUI(){
			console.log("c:dashboard f:updateUI");
			$http.get('http://10.9.13.51')
				.then(function successCallback(response) {
					let dataItemRead = response.data.variables;
					parseReadingResponse(dataItemRead);
				}, function errorCallback(response) {
					console.log('Err: ', response.data)
				}); // .catch(console.error);

        }


        function updateChart(){
			vm.ph = Math.floor((Math.random() * 120) + 1);
			vm.ec = Math.floor((Math.random() * 200) + 1);
			vm.do = Math.floor((Math.random() * 150) + 1);
			console.log('$scope: ', $scope.myJson.series[0].values);
			$scope.myJson.series[0].values.push(vm.ph);
			$scope.myJson.series[1].values.push(vm.ec);
			$scope.myJson.series[2].values.push(vm.ec);
		}

        function parseReadingResponse(dataItemRead) {
            let timeStamp = new Date(); // Skapa faktisk tid nu
			vm.ph = dataItemRead.ph;
			vm.ec = dataItemRead.ec;
			vm.do = dataItemRead.do;
			vm.orp = dataItemRead.orp;
			vm.tempuw = dataItemRead.tempuw;
			vm.tempamb = dataItemRead.tempamb;
			vm.humidity = dataItemRead.humidity;
			vm.createdDate = timeStamp.toLocaleDateString();
			vm.createdTime = timeStamp.toLocaleTimeString('en-GB')
			console.log('date: ', createdDate);
			console.log('time: ', timeStamp.toLocaleTimeString('en-GB'));
        }


        function drawChart() {
            console.log('vm.probeDataListing', vm.probeDataListing);
        }
    }
}());
