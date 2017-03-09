/*********************************************/
/**          dashboard.component.js         **/
/*********************************************/
(function() {
    'use strict'

    angular.module('app')
        .component('dashboard', {
            require: {
                layout: '^app'
            },
            templateUrl: '/js/dashboard/dashboard.template.html',
            controller: controller
        });

    controller.$inject = ['$http', '$interval', '$scope'];

    function controller($http, $interval, $scope) {
		// Börja Variabler
    	const vm = this;
		vm.IP = 'http://192.168.86.132';
        vm.$onInit = onInit;
        vm.dataReadUpdate = null;
		vm.probeDataListing = null;
        vm.ph = 0.00;
		vm.ec = 0.00;
		vm.do = 0.00;
		vm.orp = 0.00;
		vm.tempuw = 0.00;
		vm.tempamb = 0.00;
		vm.humidity = 0.00;
		vm.altitude = 0.00;
		vm.createdDate = null;
		vm.createdTime = null;
		vm.rndVolt = null;
		vm.rndAmpere = null;

		// Initialize zingChart JSON vars
		vm.voltChart = initVolt();
		vm.ampereChart = initAmpere();
		// SLUT Variabler

		// Börja Funktioner
        vm.parseReadingResponse = parseReadingResponse;
        vm.updateUI = updateUI;
		vm.initVolt = initVolt;
		vm.initAmpere = initAmpere;
		// SLUT Funktioner

        // TODO Setup 2-way binding between readings and component
        function onInit() {
            console.log("c:dashboard f:onInit")
            // $http.get('/probedata')
            // $http.get('http://192.168.86.137')
				// .then(function successCallback(response) {
            //         let dataItemRead = response.data.variables;
				// 	parseReadingResponse(dataItemRead);
				// }, function errorCallback(response) {
				// 	console.log('Err: ', response.data)
				// });
			// $interval(updateUI, 5000);
			$interval(getAPI, 5000);
			//updateUI();
        }

		function getAPI() {
			console.log("c:chart f:updateUI");
			$http.get('http://10.9.13.51')
				.then(function successCallback (response) {
					let dataItemRead = response.data.variables;
					//console.log('data: ', dataItemRead);
					parseReadingResponse(dataItemRead);
				}, function errorCallback (response) {
					console.log('c:chart f:onInit Err: ', response.data);
				});
		}

        function parseReadingResponse(dataItemRead) {
            let timeStamp = new Date(); // Skapa faktisk tid nu
			console.log(dataItemRead);
			vm.ph = dataItemRead.ph;
			vm.ec = dataItemRead.ec;
			vm.do = dataItemRead.do;
			// vm.orp = dataItemRead.orp;
			vm.orp = Math.floor(Math.random() * ((300-200)+1) + 200);
			vm.tempuw = dataItemRead.tempuw;
			vm.tempamb = dataItemRead.tempamb;
			vm.humidity = dataItemRead.humidity;
			vm.altm = dataItemRead.altitude;
			vm.createdDate = timeStamp.toLocaleDateString();
			vm.createdTime = timeStamp.toLocaleTimeString('en-GB');
			console.log('humidity: ', vm.humidity);
			//console.log('date: ', createdDate);
			//console.log('time: ', timeStamp.toLocaleTimeString('en-GB'));
			updateUI();
        }


		function updateUI(){
			console.log("c:dashboard f:updateUI");
			vm.rndVolt = Math.floor((Math.random() * 20) + 1);
			vm.rndAmpere = Math.floor((Math.random() * 10) + 1);
			vm.voltChart.series[0].values.pop();
			vm.ampereChart.series[0].values.pop();
			vm.voltChart.series[0].values.push(vm.rndVolt);
			vm.ampereChart.series[0].values.push(vm.rndAmpere);
			// $http.get('http://192.168.86.137') // 'http://10.9.13.51'
			// 	.then(function successCallback(response) {
			// 		let dataItemRead = response.data.variables;
			// 		parseReadingResponse(dataItemRead);
			// 	}, function errorCallback(response) {
			// 		console.log('Err: ', response.data)
			// 	});
		}

		/* Börja: VOLT GAUGE */
		function initVolt() {
			return {
				type: "gauge",
				backgroundColor: "#fff",
				borderRadius: "5px",
				shadow: true,
				title: {
					text: "Volts",
					color: "black"
				},
				globals: {
					fontSize: 25,
					color: "black"
				},
				plotarea: {
					marginTop: 80
				},
				plot: {
					size: '100%',
					valueBox: {
						placement: 'center',
						text: '%v', //default
						fontSize: 35,
						color: "black",
						rules: [
							{
								rule: '%v >= 15',
								text: '%v<br>Run Away!'
							},
							{
								rule: '%v < 15 && %v > 12',
								text: '%v<br>OPTIMAL'
							},
							{
								rule: '%v < 12 && %v > 2',
								text: '%v<br>Fair'
							},
							{
								rule: '%v <  2',
								text: '%v<br>Give it up!'
							}
						]
					}
				},
				tooltip: {
					borderRadius: 5
				},
				scaleR: {
					aperture: 180,
					minValue: 0,
					maxValue: 20,
					step: 2,
					center: {
						visible: false
					},
					tick: {
						visible: true
					},
					item: {
						offsetR: 0,
						rules: [
							{
								rule: '%i == 9',
								offsetX: 15
							}
						]
					},
					labels: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20'],
					ring: {
						size: 50,
						rules: [
							{
								rule: '%v <= 2',
								backgroundColor: '#FFFF00',
							},
							{
								rule: '%v > 2 && %v < 12',
								backgroundColor: '#FF8C00'
							},
							{
								rule: '%v >= 12 && %v < 15',
								backgroundColor: '#008000'
							},
							{
								rule: '%v >= 15',
								backgroundColor: '#E53935'
							}
						]
					}
				},
				refresh: {
					type: "feed",
					transport: "js",
					url: "feed()",
					interval: 1500,
					resetTimeout: 1000
				},
				series: [
					{
						values: [14], // starting value
						backgroundColor: 'black',
						indicator: [10, 10, 10, 10, 0.75],
						animation: {
							effect: 2,
							method: 1,
							sequence: 4,
							speed: 900
						},
					}
				]
			};
		} /* SLUT: VOLT GAUGE */

		/* Börja: AMP GAUGE */
		function initAmpere() {
			return {
				type: "gauge",
				backgroundColor: "#fff",
				borderRadius: "5px",
				shadow: true,
				title: {
					text: "Ampere",
					color: "black"
				},
				globals: {
					fontSize: 25,
					color: "black"
				},
				plotarea: {
					marginTop: 80
				},
				plot: {
					size: '100%',
					valueBox: {
						placement: 'center',
						text: '%v', //default
						fontSize: 35,
						color: "black",
						rules: [
							{
								rule: '%v >= 8',
								text: '%v<br>OMG!'
							},
							{
								rule: '%v <= 8 && %v >= 5',
								text: '%v<br>Lit!'
							},
							{
								rule: '%v <= 5 && %v >= 2',
								text: '%v<br>Bogus'
							},
							{
								rule: '%v <=  2',
								text: '%v<br>Zzzzzz'
							}
						]
					}
				},
				tooltip: {
					borderRadius: 5
				},
				scaleR: {
					aperture: 180,
					minValue: 0,
					maxValue: 10,
					step: 1,
					center: {
						visible: false
					},
					tick: {
						visible: true
					},
					item: {
						offsetR: 0,
						rules: [
							{
								rule: '%i == 9',
								offsetX: 15
							}
						]
					},
					labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
					ring: {
						size: 50,
						rules: [
							{
								rule: '%v <= 2',
								backgroundColor: '#FFFF00'
							},
							{
								rule: '%v >= 2 && %v <= 5',
								backgroundColor: '#FF8C00'
							},
							{
								rule: '%v >= 5 && %v <= 8',
								backgroundColor: '#008000'
							},
							{
								rule: '%v >= 8',
								backgroundColor: '#E53935'
							}
						]
					}
				},
				refresh: {
					type: "feed",
					transport: "js",
					url: "feed()",
					interval: 1500,
					resetTimeout: 1000
				},
				series: [
					{
						values: [6], // starting value
						backgroundColor: 'black',
						indicator: [10, 10, 10, 10, 0.75],
						animation: {
							effect: 2,
							method: 1,
							sequence: 4,
							speed: 900
						},
					}
				]
			};
		} /* SLUT: AMP GAUGE */


    } // Slut Controller
}());
