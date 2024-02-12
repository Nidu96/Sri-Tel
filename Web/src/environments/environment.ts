// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
// 	production: true,
// 	server_URL: 'http://localhost:49977', 
// 	router_prefix: '/api/' 
// };

export const environment = {
	production: false,
	authenticate_service_URL: 'http://localhost:2000/', 
	factors_URL: 'http://localhost:4000/', 
	router_prefix: '/api/' 
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
