// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  envName: 'prod',
  apiUrl: 'https://i7ipyw6g26.execute-api.us-west-1.amazonaws.com/prod',
  cognito: {
    region: 'us-west-1',
    tokenScopes: ['openid', 'email', 'profile'],
    redirectUriSignIn: 'https://d17qvu98sfvqdy.cloudfront.net/admin',
    redirectUriSignOut: 'https://d17qvu98sfvqdy.cloudfront.net/admin',
    // redirectUriSignIn: 'http://localhost:4200/admin',
    // redirectUriSignOut: 'http://localhost:4200/admin',
    userPoolId: 'us-west-1_2sHchLZDR',
    identityPoolId: 'us-west-1:c34e7756-34ad-4005-bb7a-24176ca2cb2f',
    identityLogin: 'cognito-idp.us-west-1.amazonaws.com/us-west-1_2sHchLZDR',
    clientId: '1to5504c05956ijk9g16jpkoio',
    appWebDomain: 'taoc.auth.us-west-1.amazoncognito.com',
    identityProvider: 'COGNITO',
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
