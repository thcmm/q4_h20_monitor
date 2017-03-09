/************************************/
/**          chart.component.js    **/
/************************************/

(function () {
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

	function controller ($http, $interval, $scope) {
		// Börja Variabler
		const vm = this;
		vm.$onInit = onInit;
		vm.IP = '10.9.13.51';
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

		// Initialize zingChart JSON vars
		vm.phChart = initPh();
		vm.ecChart = initEc();
		vm.doChart = initDo();
		vm.orpChart = initOrp();
		vm.tempuwChart = initTempuw();
		vm.tempambChart = initTempamb();
		vm.humidityChart = initHumidity();

		// Funktioner
		vm.updateChart = updateChart;
		vm.initPh = initPh;
		vm.initDo = initDo;
		vm.initEc = initEc;
		vm.initOrp = initOrp;
		vm.initTempuw = initTempuw;
		vm.initTempamb = initTempamb;
		vm.initHumidity = initHumidity;
		vm.parseReadingResponse = parseReadingResponse;
		vm.getAPI = getAPI;

		//vm.myInterval = null;

		// TODO Setup 2-way binding between readings and component
		function onInit () {
			console.log("c:chart f:onInit");
			$scope.$on("$destroy", function () {
				console.log('Destroy');
			});

			console.log('Is Interval Running', vm.myInterval);
			if (vm.myInterval) {
				console.log('Clearing Interval');
				$interval.cancel(vm.myInterval);
			}

			vm.myInterval = $interval(getAPI, 5000);
			// console.log('Added Interval', vm.myInterval)

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

		function parseReadingResponse (dataItemRead) {
			console.log("c:chart f:parseReadingResponse");
			let timeStamp = new Date(); // Skapa faktisk tid nu
			//console.log('parseReadResponse: ', dataItemRead);
			vm.ph = dataItemRead.ph;
			vm.ec = dataItemRead.ec;
			vm.do = dataItemRead.do;
			vm.orp = dataItemRead.orp;
			vm.tempuw = dataItemRead.tempuw;
			vm.tempamb = dataItemRead.tempamb;
			vm.humidity = dataItemRead.humidity;
			vm.createdDate = timeStamp.toLocaleDateString();
			vm.createdTime = timeStamp.toLocaleTimeString('en-GB');
			//console.log('date: ', vm.createdDate);
			//console.log('time: ', timeStamp.toLocaleTimeString('en-GB'));
			updateChart();
		}

		function updateChart () {
			// dBug:
			// console.log('$scope.myJson.series[0].values: ', JSON.stringify(vm.myJson.series[0].values));
			// console.log('$scope.myConfig.series[0].values: ', vm.myConfig.series[0].values);

			// TESTA
			console.log('update chart ph: ', vm.ph);
			console.log('update chart ec: ', vm.ec);
			console.log('update chart do: ', vm.do);
			console.log('update chart orp: ', vm.orp);
			console.log('update chart tempuw: ', vm.tempuw);
			console.log('update chart tempamb: ', vm.tempamb);
			console.log('update chart humidity: ', vm.humidity);
			// Epoch tid
			var d = new Date(), n = d.getTime();
			// PH
			vm.phChart.scaleX.values.push(n); // tid vals
			vm.phChart.series[0].values.push(vm.ph); // ph vals
			// EC
			vm.ecChart.scaleX.values.push(n); // tid vals
			vm.ecChart.series[0].values.push(vm.ec); // ec vals
			// DO
			vm.doChart.scaleX.values.push(n); // tid vals
			vm.doChart.series[0].values.push(vm.do);
			// ORP
			vm.orpChart.scaleX.values.push(n); // tid vals
			vm.orpChart.series[0].values.push(vm.orp);
			// TEMPUW
			vm.tempuwChart.scaleX.values.push(n); // tid vals
			vm.tempuwChart.series[0].values.push(vm.tempuw);
			// TEMPAMB
			vm.tempambChart.scaleX.values.push(n); // tid vals
			vm.tempambChart.series[0].values.push(vm.tempamb);
			// HUMIDITY
			vm.humidityChart.scaleX.values.push(n); // tid vals
			vm.humidityChart.series[0].values.push(vm.humidity);
		}
		// ******************************************************* //
		// **				Börja init chart JSON				** //
		// ******************************************************* //

		// Börja initPh
		function initPh(){
			return {
				gui: {
					contextMenu: {
						button: {
							visible: 0
						}
					}
				},

				backgroundColor: "#434343",
				globals: {
					shadow: false,
					fontFamily: "Helvetica"
				},
				type: "area",
				utc:true,
				timezone:-7, // MNT time
				legend: {
					layout: "x1",
					backgroundColor: "transparent",
					borderColor: "transparent",
					marker: {
						borderRadius: "50px",
						borderColor: "transparent"
					},
					item: {
						align: "center",
						fontColor: "white",
						fontSize: 15
					}

				},
				scaleX: {
					maxItems: 8,
					step:"5second",
					transform: {
						type: 'date',
						all:'%g:%i'
					},
					zooming: true,
					values: [], // 1489006933142
					lineColor: "white",
					lineWidth: "1px",
					label: {text:"Time"},
					tick: {
						lineColor: "white",
						lineWidth: "1px"
					},
					item: {
						fontColor: "white",
						angle: -30
					},
					guide: {
						visible: false
					}
				},
				scaleY: {
					lineColor: "white",
					lineWidth: "1px",
					values:"0:14:1",
					format:"%v",
					label: {text:"PH", fontSize:12},
					tick: {
						lineColor: "white",
						lineWidth: "1px"
					},
					guide: {
						lineStyle: "solid",
						lineColor: "#626262"
					},
					item: {
						fontColor: "white"
					},
				},
				tooltip: {
					visible: false
				},
				crosshairX: {
					scaleLabel: {
						backgroundColor: "#fff",
						fontColor: "black"
					},
					plotLabel: {
						backgroundColor: "#434343",
						fontColor: "#FFF",
						_text: "Number of hits : %v"
					}
				},
				plot: {
					lineWidth: "2px",
					aspect: "spline",
					marker: {
						visible: false
					}
				},
				series: [{
					text: "PH",
					values: [0],
					backgroundColor1: "#77d9f8",
					backgroundColor2: "#272822",
					lineColor: "#40beeb"
				}]
			};
		} // SLUT: InitPh
		// **********************************************************************
		// Börja initEc
		function initEc(){
			return {
				gui: {
					contextMenu: {
						button: {
							visible: 0
						}
					}
				},
				backgroundColor: "#434343",
				globals: {
					shadow: false,
					fontFamily: "Helvetica"
				},
				type: "area",
				utc:true,
				timezone:-7, // MNT time
				legend: {
					layout: "x1",
					backgroundColor: "transparent",
					borderColor: "transparent",
					marker: {
						borderRadius: "50px",
						borderColor: "transparent"
					},
					item: {
						align: "center",
						fontColor: "white",
						fontSize: 15
					}

				},
				scaleX: {
					maxItems: 8,
					step:"5second",
					transform: {
						type: 'date',
						all:'%g:%i'
					},
					zooming: true,
					values: [], // 1489006933142
					lineColor: "white",
					lineWidth: "1px",
					label: {text:"Time"},
					tick: {
						lineColor: "white",
						lineWidth: "1px"
					},
					item: {
						fontColor: "white",
						angle: -30
					},
					guide: {
						visible: false
					}
				},
				scaleY: {
					lineColor: "white",
					lineWidth: "1px",
					short:true, //To display scale values as short units.
					values:"1000:60000:1000", // 2000:60000:1000
					format:"%v",
					label: {text:"EC", fontSize:12},
					tick: {
						lineColor: "white",
						lineWidth: "1px"
					},
					guide: {
						lineStyle: "solid",
						lineColor: "#626262"
					},
					item: {
						fontColor: "white"
					},
				},
				tooltip: {
					visible: false
				},
				crosshairX: {
					scaleLabel: {
						backgroundColor: "#fff",
						fontColor: "black"
					},
					plotLabel: {
						backgroundColor: "#434343",
						fontColor: "#FFF",
						_text: "Number of hits : %v"
					}
				},
				plot: {
					lineWidth: "2px",
					aspect: "spline",
					marker: {
						visible: false
					}
				},
				series: [{
					fontSize:20,
					text: "EC uS/cm",
					values: [0],
					backgroundColor1: "#ffff99",
					backgroundColor2: "#272822",
					lineColor: "#cccc00"
				}]
			};
		} // SLUT: InitEc
		// **********************************************************************
		// Börja initDo
		function initDo(){
			return {
				gui: {
					contextMenu: {
						button: {
							visible: 0
						}
					}
				},
				backgroundColor: "#434343",
				globals: {
					shadow: false,
					fontFamily: "Helvetica"
				},
				type: "area",
				utc:true,
				timezone:-7, // MNT time
				legend: {
					layout: "x1",
					backgroundColor: "transparent",
					borderColor: "transparent",
					marker: {
						borderRadius: "50px",
						borderColor: "transparent"
					},
					item: {
						align: "center",
						fontColor: "white",
						fontSize: 15
					}

				},
				scaleX: {
					maxItems: 8,
					step:"5second",
					transform: {
						type: 'date',
						all:'%g:%i'
					},
					zooming: true,
					values: [], // 1489006933142
					lineColor: "white",
					lineWidth: "1px",
					label: {text:"Time"},
					tick: {
						lineColor: "white",
						lineWidth: "1px"
					},
					item: {
						fontColor: "white",
						angle: -30
					},
					guide: {
						visible: false
					}
				},
				scaleY: {
					lineColor: "white",
					lineWidth: "1px",
					short:true, //To display scale values as short units.
					values:"0:16:2",
					format:"%v",
					label: {text:"DO", fontSize:12},
					tick: {
						lineColor: "white",
						lineWidth: "1px"
					},
					guide: {
						lineStyle: "solid",
						lineColor: "#626262"
					},
					item: {
						fontColor: "white"
					},
				},
				tooltip: {
					visible: false
				},
				crosshairX: {
					scaleLabel: {
						backgroundColor: "#fff",
						fontColor: "black"
					},
					plotLabel: {
						backgroundColor: "#434343",
						fontColor: "#FFF",
						_text: "Number of hits : %v"
					}
				},
				plot: {
					lineWidth: "2px",
					aspect: "spline",
					marker: {
						visible: false
					}
				},
				series: [{
					fontSize:20,
					text: "DO mg/L",
					values: [0],
					backgroundColor1: "#ff99ff",
					backgroundColor2: "#272822",
					lineColor: "#990099"
				}]
			};
		} // SLUT: InitDo
		// **********************************************************************
		// Börja initOrp
		function initOrp(){
			return {
				gui: {
					contextMenu: {
						button: {
							visible: 0
						}
					}
				},
				backgroundColor: "#434343",
				globals: {
					shadow: false,
					fontFamily: "Helvetica"
				},
				type: "area",
				utc:true,
				timezone:-7, // MNT time
				legend: {
					layout: "x1",
					backgroundColor: "transparent",
					borderColor: "transparent",
					marker: {
						borderRadius: "50px",
						borderColor: "transparent"
					},
					item: {
						align: "center",
						fontColor: "white",
						fontSize: 15
					}

				},
				scaleX: {
					maxItems: 8,
					step:"5second",
					transform: {
						type: 'date',
						all:'%g:%i'
					},
					zooming: true,
					values: [], // 1489006933142
					lineColor: "white",
					lineWidth: "1px",
					label: {text:"Time"},
					tick: {
						lineColor: "white",
						lineWidth: "1px"
					},
					item: {
						fontColor: "white",
						angle: -30
					},
					guide: {
						visible: false
					}
				},
				scaleY: {
					lineColor: "white",
					lineWidth: "1px",
					short:true, //To display scale values as short units.
					values:"200:500:25",
					format:"%v",
					label: {text:"ORP", fontSize:12},
					tick: {
						lineColor: "white",
						lineWidth: "1px"
					},
					guide: {
						lineStyle: "solid",
						lineColor: "#626262"
					},
					item: {
						fontColor: "white"
					},
				},
				tooltip: {
					visible: false
				},
				crosshairX: {
					scaleLabel: {
						backgroundColor: "#fff",
						fontColor: "black"
					},
					plotLabel: {
						backgroundColor: "#434343",
						fontColor: "#FFF",
						_text: "Number of hits : %v"
					}
				},
				plot: {
					lineWidth: "2px",
					aspect: "spline",
					marker: {
						visible: false
					}
				},
				series: [{
					fontSize:20,
					text: "ORP mV",
					values: [0],
					backgroundColor1: "#ffcc99",
					backgroundColor2: "#272822",
					lineColor: "#994c00"
				}]
			};
		} // SLUT: InitOrp
		// **********************************************************************
		// Börja initTempuw
		function initTempuw(){
			return {
				gui: {
					contextMenu: {
						button: {
							visible: 0
						}
					}
				},
				backgroundColor: "#434343",
				globals: {
					shadow: false,
					fontFamily: "Helvetica"
				},
				type: "area",
				utc:true,
				timezone:-7, // MNT time
				legend: {
					layout: "x1",
					backgroundColor: "transparent",
					borderColor: "transparent",
					marker: {
						borderRadius: "50px",
						borderColor: "transparent"
					},
					item: {
						align: "center",
						fontColor: "white",
						fontSize: 15
					}

				},
				scaleX: {
					maxItems: 8,
					step:"5second",
					transform: {
						type: 'date',
						all:'%g:%i'
					},
					zooming: true,
					values: [], // 1489006933142
					lineColor: "white",
					lineWidth: "1px",
					label: {text:"Time"},
					tick: {
						lineColor: "white",
						lineWidth: "1px"
					},
					item: {
						fontColor: "white",
						angle: -30
					},
					guide: {
						visible: false
					}
				},
				scaleY: {
					lineColor: "white",
					lineWidth: "1px",
					short:true, //To display scale values as short units.
					values:"-20:50:5",
					format:"%v",
					label: {text:"Celsius", fontSize:12},
					tick: {
						lineColor: "white",
						lineWidth: "1px"
					},
					guide: {
						lineStyle: "solid",
						lineColor: "#626262"
					},
					item: {
						fontColor: "white"
					},
				},
				tooltip: {
					visible: false
				},
				crosshairX: {
					scaleLabel: {
						backgroundColor: "#fff",
						fontColor: "black"
					},
					plotLabel: {
						backgroundColor: "#434343",
						fontColor: "#FFF",
						_text: "Number of hits : %v"
					}
				},
				plot: {
					lineWidth: "2px",
					aspect: "spline",
					marker: {
						visible: false
					}
				},
				series: [{
					fontSize:20,
					text: "Water Temp C",
					values: [0],
					backgroundColor1: "#9999ff",
					backgroundColor2: "#272822",
					lineColor: "#0000cc"
				}]
			};
		} // SLUT: InitTempuw
		// **********************************************************************
		// Börja initTempamb
		function initTempamb(){
			return {
				gui: {
					contextMenu: {
						button: {
							visible: 0
						}
					}
				},
				backgroundColor: "#434343",
				globals: {
					shadow: false,
					fontFamily: "Helvetica"
				},
				type: "area",
				utc:true,
				timezone:-7, // MNT time
				legend: {
					layout: "x1",
					backgroundColor: "transparent",
					borderColor: "transparent",
					marker: {
						borderRadius: "50px",
						borderColor: "transparent"
					},
					item: {
						align: "center",
						fontColor: "white",
						fontSize: 15
					}

				},
				scaleX: {
					maxItems: 8,
					step:"5second",
					transform: {
						type: 'date',
						all:'%g:%i'
					},
					zooming: true,
					values: [], // 1489006933142
					lineColor: "white",
					lineWidth: "1px",
					label: {text:"Time"},
					tick: {
						lineColor: "white",
						lineWidth: "1px"
					},
					item: {
						fontColor: "white",
						angle: -30
					},
					guide: {
						visible: false
					}
				},
				scaleY: {
					lineColor: "white",
					lineWidth: "1px",
					short:true, //To display scale values as short units.
					values:"-10:45:2",
					format:"%v",
					label: {text:"Celsius", fontSize:12},
					tick: {
						lineColor: "white",
						lineWidth: "1px"
					},
					guide: {
						lineStyle: "solid",
						lineColor: "#626262"
					},
					item: {
						fontColor: "white"
					},
				},
				tooltip: {
					visible: false
				},
				crosshairX: {
					scaleLabel: {
						backgroundColor: "#fff",
						fontColor: "black"
					},
					plotLabel: {
						backgroundColor: "#434343",
						fontColor: "#FFF",
						_text: "Temp : %v"
					}
				},
				plot: {
					lineWidth: "2px",
					aspect: "spline",
					marker: {
						visible: false
					}
				},
				series: [{
					fontSize:20,
					text: "Air Temp C",
					values: [0],
					backgroundColor1: "#ff99ff",
					backgroundColor2: "#272822",
					lineColor: "#990099"
				}]
			};
		} // SLUT: InitTempamb
		// **********************************************************************
		// Börja initHumidity
		function initHumidity(){
			return {
				gui: {
					contextMenu: {
						button: {
							visible: 0
						}
					}
				},
				backgroundColor: "#434343",
				globals: {
					shadow: false,
					fontFamily: "Helvetica"
				},
				type: "area",
				utc:true,
				timezone:-7, // MNT time
				legend: {
					layout: "x1",
					backgroundColor: "transparent",
					borderColor: "transparent",
					marker: {
						borderRadius: "50px",
						borderColor: "transparent"
					},
					item: {
						align: "center",
						fontColor: "white",
						fontSize: 15
					}

				},
				scaleX: {
					maxItems: 8,
					step:"5second",
					transform: {
						type: 'date',
						all:'%g:%i'
					},
					zooming: true,
					values: [],
					lineColor: "white",
					lineWidth: "1px",
					label: {text:"Time"},
					tick: {
						lineColor: "white",
						lineWidth: "1px"
					},
					item: {
						fontColor: "white",
						angle: -30
					},
					guide: {
						visible: false
					}
				},
				scaleY: {
					lineColor: "white",
					lineWidth: "1px",
					short:true, //To display scale values as short units.
					values:"0:5:1",
					format:"%v",
					label: {text:"Humidity", fontSize:12},
					tick: {
						lineColor: "white",
						lineWidth: "1px"
					},
					guide: {
						lineStyle: "solid",
						lineColor: "#626262"
					},
					item: {
						fontColor: "white"
					},
				},
				tooltip: {
					visible: false
				},
				crosshairX: {
					scaleLabel: {
						backgroundColor: "#fff",
						fontColor: "black"
					},
					plotLabel: {
						backgroundColor: "#434343",
						fontColor: "#FFF",
						_text: "Temp : %v"
					}
				},
				plot: {
					lineWidth: "2px",
					aspect: "spline",
					marker: {
						visible: false
					}
				},
				series: [{
					fontSize:20,
					text: "Inches / Hg",
					values: [0],
					backgroundColor1: "#99ff99",
					backgroundColor2: "#272822",
					lineColor: "#009900"
				}]
			};
		} // SLUT: InitHumidity

		// **********************************************************************
	} // Slut Controller

}());


/********************** SPARA dessa gamalt kod **********************

 // RND Gens
 // vm.ph = Math.floor((Math.random() * 120) + 1);
 // vm.ec = Math.floor((Math.random() * 200) + 1);
 // vm.do = Math.floor((Math.random() * 150) + 1);

 // KOD onInit()
 // $http.get('http://192.168.86.137') // 'http://10.9.13.51'
 // 	.then(function successCallback (response) {
			// 		let dataItemRead = response.data.variables;
			// 		parseReadingResponse(dataItemRead);
			// 	}, function errorCallback (response) {
			// 		console.log('c:chart f:onInit Err: ', response.data);
			// 	});
 // END KOD onInit()

 function initPh(){
 return {
 "type": "area",
 "plot": {
 "aspect": "spline"
 },
 "text": "PH",
 "series": [
 {"values": [0]}
 ]
 };
 }


 vm.ecChart = {
 "type": "area",
 	"plot": {
 		"aspect": "spline"
 	},
 	"series": [
 		{"values": []}
 	]
 };
 Slut EC
 Börja DO
 vm.doChart = {
			"type": "area",
			"plot": {
				"aspect": "spline"
			},
			"series": [
				{"values": []}
			]
		};
 Slut DO


 // Börja ORP
 vm.orpChart = {
			"type": "area",
			"plot": {
				"aspect": "spline"
			},
			"series": [
				{"values": []}
			]
		};
 // Slut ORP




 // Börja TEMPUW
 vm.tempuwChart = {
			"type": "area",
			"plot": {
				"aspect": "spline"
			},
			"series": [
				{"values": []}
			]
		};
 // Slut TEMPUW
 // Börja TEMPAMB
 vm.tempambChart = {
		"type": "area",
			"plot": {
				"aspect": "spline"
			},
			"series": [
				{"values": []}
			]
		};
 // Slut TEMPAMB
 // Börja HUMIDITY
 vm.humidityChart = {
			"type": "area",
			"plot": {
				"aspect": "spline"
			},
			"series": [
				{"values": []}
			]
		};
 // Slut HUMIDITY


// Nyt Chart Layout

 $scope.myJson = {
 gui: {
 contextMenu: {
 button: {
 visible: 0
 }
 }
 },
 backgroundColor: "#434343",
 globals: {
 shadow: false,
 fontFamily: "Helvetica"
 },
 type: "area",

 legend: {
 layout: "x4",
 backgroundColor: "transparent",
 borderColor: "transparent",
 marker: {
 borderRadius: "50px",
 borderColor: "transparent"
 },
 item: {
 fontColor: "white"
 }

 },
 scaleX: {
 maxItems: 8,
 transform: {
 type: 'date'
 },
 zooming: true,
 values: [
 1442905200000, 1442908800000,
 1442912400000, 1442916000000,
 1442919600000, 1442923200000,
 1442926800000, 1442930400000,
 1442934000000, 1442937600000,
 1442941200000, 1442944800000,
 1442948400000
 ],
 lineColor: "white",
 lineWidth: "1px",
 tick: {
 lineColor: "white",
 lineWidth: "1px"
 },
 item: {
 fontColor: "white"
 },
 guide: {
 visible: false
 }
 },
 scaleY: {
 lineColor: "white",
 lineWidth: "1px",
 tick: {
 lineColor: "white",
 lineWidth: "1px"
 },
 guide: {
 lineStyle: "solid",
 lineColor: "#626262"
 },
 item: {
 fontColor: "white"
 },
 },
 tooltip: {
 visible: false
 },
 crosshairX: {
 scaleLabel: {
 backgroundColor: "#fff",
 fontColor: "black"
 },
 plotLabel: {
 backgroundColor: "#434343",
 fontColor: "#FFF",
 _text: "Number of hits : %v"
 }
 },
 plot: {
 lineWidth: "2px",
 aspect: "spline",
 marker: {
 visible: false
 }
 },
 series: [{
 text: "All Sites",
 values: [2596, 2626, 4480,
 6394, 7488, 14510,
 7012, 10389, 20281,
 25597, 23309, 22385,
 25097, 20813, 20510],
 backgroundColor1: "#77d9f8",
 backgroundColor2: "#272822",
 lineColor: "#40beeb"
 }, {
 text: "Site 1",
 values: [479, 199, 583,
 1624, 2772, 7899,
 3467, 3227, 12885,
 17873, 14420, 12569,
 17721, 11569, 7362],
 backgroundColor1: "#4AD8CC",
 backgroundColor2: "#272822",
 lineColor: "#4AD8CC"
 }, {
 text: "Site 2",
 values: [989, 1364, 2161,
 2644, 1754, 2015,
 818, 77, 1260,
 3912, 1671, 1836,
 2589, 1706, 1161],
 backgroundColor1: "#1D8CD9",
 backgroundColor2: "#1D8CD9",
 lineColor: "#1D8CD9"
 }, {
 text: "Site 3",
 values: [408, 343, 410,
 840, 1614, 3274,
 2092, 914, 5709,
 6317, 6633, 6720,
 6504, 6821, 4565],
 backgroundColor1: "#D8CD98",
 backgroundColor2: "#272822",
 lineColor: "#D8CD98"
 }]
 };


 */