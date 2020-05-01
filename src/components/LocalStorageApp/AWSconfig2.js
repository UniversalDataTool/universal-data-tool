export default {
    Auth: {
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: "ca-central-1:62c09493-b5b8-4180-bc17-2847514bca3a",
      // REQUIRED - Amazon Cognito Region
      region: "ca-central-1",
      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: "ca-central-1_4AAulRtSS",
  
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: "7lnbcs9mstta4mqr8o8oooe01k",
  
      // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: true,
  
      // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
      authenticationFlowType: "USER_PASSWORD_AUTH",
  
      // OPTIONAL - Hosted UI configuration
    },
    Storage: {
      AWSS3: {
        bucket: "cedric-annotations", //Your bucket name;
        region: "ca-central-1", //Specify the region your bucket was created in;
      },
    },
  }