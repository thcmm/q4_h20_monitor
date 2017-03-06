(function() {
  'use strict'

  angular.module('app')
	.config(config)

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$qProvider']

  function config($stateProvider, $urlRouterProvider, $locationProvider, $qProvider){
	$locationProvider.html5Mode(true)
	$qProvider.errorOnUnhandledRejections(false);
	$stateProvider
	  .state({
		name: 'app',
		abstract: true,
		component: 'app',
	  })
	  .state({
		name: 'home',
		parent: 'app',
		url: '/',
		component: 'dashboard', // probereadingsList
	  })
	  .state({
	   name: 'probereadingsView', // dashboardView'
	   parent: 'app',
	   url: '/',
	   component: 'probereadingsList',
	 })
  }
}());
