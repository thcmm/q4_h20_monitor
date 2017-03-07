(function() {
  'use strict'

  angular.module('app')
	.config(config)

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$qProvider']

  function config($stateProvider, $urlRouterProvider, $locationProvider, $qProvider){
	$locationProvider.html5Mode(true)
	$qProvider.errorOnUnhandledRejections(false); // Fix till unhandled exception err

	$stateProvider
	  .state({
		name: 'app',
		abstract: true,
		component: 'app',
	  })
	  .state({
		name: 'dashboard-view',
		parent: 'app',
		url: '/',
		component: 'dashboard', // probereadingsList
	  })
	  .state({
	   name: 'probereadings-view', // dashboardView'
	   parent: 'app',
	   url: '/',
	   component: 'probereadingsList',
	 })
		.state({
			name: 'zingchart-view', // dashboardView'
			parent: 'app',
			url: '/',
			component: 'zingChartView',
		})
  }
}());
