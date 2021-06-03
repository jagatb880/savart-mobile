// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // domain: `https://savart.in`,
  domain: `http://savart.eastus.cloudapp.azure.com:8000`,
  RAZORPAY_API_KEY: "rzp_test_tA5haXDJopDQY9",
  RAZORPAY_API_SECRET_KEY: "gWbEVNfF6y3FMnJLSpvHihiN",
  firebaseConfig: {
    apiKey: "AIzaSyCQ70KmRbu33bncD6Jaqo2WzZWMxz_rJuY",
    authDomain: "savart-mob.firebaseapp.com",
    databaseURL: "https://savart-mob.firebaseio.com",
    projectId: "savart-mob",
    storageBucket: "savart-mob.appspot.com",
    messagingSenderId: "266048666059",
    appId: "1:266048666059:web:b2293dc8847617e36b9e4e",
    measurementId: "G-8MQL7BR076",
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
