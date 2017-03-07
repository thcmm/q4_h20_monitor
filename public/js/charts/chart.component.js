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

    controller.$inject = ['$http', '$interval','$scope'];

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
		vm.gauge1 = null;


		zingchart.THEME = "dark";
		vm.myJson = {
			"type": "area",
			"plot":{
				"aspect":"spline"
			},
			"series": [
				{"values":[]},
				{"values":[]},
				{"values":[]}
			]};



		/* START: TEST GAUGE */
		vm.myConfig = {
			type: "gauge",
			globals: {
				fontSize: 25
			},
			plotarea:{
				marginTop:80
			},
			plot:{
				size:'100%',
				valueBox: {
					placement: 'center',
					text:'%v', //default
					fontSize:35,
					rules:[
						{
							rule: '%v >= 700',
							text: '%v<br>EXCELLENT'
						},
						{
							rule: '%v < 700 && %v > 640',
							text: '%v<br>Good'
						},
						{
							rule: '%v < 640 && %v > 580',
							text: '%v<br>Fair'
						},
						{
							rule: '%v <  580',
							text: '%v<br>Bad'
						}
					]
				}
			},
			tooltip:{
				borderRadius:5
			},
			scaleR:{
				aperture:180,
				minValue:300,
				maxValue:850,
				step:50,
				center:{
					visible:false
				},
				tick:{
					visible:false
				},
				item:{
					offsetR:0,
					rules:[
						{
							rule:'%i == 9',
							offsetX:15
						}
					]
				},
				labels:['300','','','','','','580','640','700','750','','850'],
				ring:{
					size:50,
					rules:[
						{
							rule:'%v <= 580',
							backgroundColor:'#E53935'
						},
						{
							rule:'%v > 580 && %v < 640',
							backgroundColor:'#EF5350'
						},
						{
							rule:'%v >= 640 && %v < 700',
							backgroundColor:'#FFA726'
						},
						{
							rule:'%v >= 700',
							backgroundColor:'#29B6F6'
						}
					]
				}
			},
			refresh:{
				type:"feed",
				transport:"js",
				url:"feed()",
				interval:1500,
				resetTimeout:1000
			},
			series : [
				{
					values : [400], // starting value
					backgroundColor:'black',
					indicator:[10,10,10,10,0.75],
					animation:{
						effect:2,
						method:1,
						sequence:4,
						speed: 900
					},
				}
			]
		};
		/* END: TEST GAUGE */

        // Funktioner
        vm.drawChart = drawChart;
        vm.parseReadingResponse = parseReadingResponse;
        vm.updateUI = updateUI;
        vm.updateChart = updateChart;
        // vm.myInterval = null;

        // TODO Setup 2-way binding between readings and component
        function onInit() {
        	$scope.$on("$destroy", function(){console.log('Destroy');})
        	console.log('hello hello',JSON.stringify(vm.myJson.series));
			vm.myJson.series[0].values = [];
			vm.myJson.series[1].values = [];
			vm.myJson.series[2].values = [];
			console.log('Is Interval Running',vm.myInterval)
			if (vm.myInterval) {
				console.log('Clearing Interval');
				$interval.cancel(vm.myInterval);

			}
            console.log("c:dashboard f:onInit")
            // $http.get('/probedata')
            $http.get('http://10.9.13.51')
				.then(function successCallback(response) {
                    let dataItemRead = response.data.variables;
					parseReadingResponse(dataItemRead);
				}, function errorCallback(response) {
					console.log('Err: ', response.data);
				});
				// .catch(console.error);
                // .then(response => vm.probeDataListing = response.data)
                // .then(console.log('responseData: ', response.data))

			vm.myInterval = $interval(updateChart, 5000);

			console.log('Added Interval', vm.myInterval)
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
			vm.gauge1 = Math.floor(Math.random() * ((845-310)+1) + 310);
			console.log('$scope.myJson.series[0].values: ', JSON.stringify(vm.myJson.series[0].values));
			vm.myJson.series[0].values.push(vm.ph);
			vm.myJson.series[1].values.push(vm.ec);
			vm.myJson.series[2].values.push(vm.ec);
			// console.log('gauge1: ', vm.gauge1);
			// $scope.myConfig.series[0].values = vm.gauge1;
			vm.myConfig.series[0].values.pop();
			vm.myConfig.series[0].values.push(vm.gauge1);

			console.log('$scope.myConfig.series[0].values: ', vm.myConfig.series[0].values);
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
			vm.createdTime = timeStamp.toLocaleTimeString('en-GB');
			console.log('date: ', createdDate);
			console.log('time: ', timeStamp.toLocaleTimeString('en-GB'));
        }


        function drawChart() {
            console.log('vm.probeDataListing', vm.probeDataListing);
        }
    }
}());
