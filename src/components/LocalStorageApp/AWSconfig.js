export default {
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: "x",

    // REQUIRED - Amazon Cognito Region
    region: "x",

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "x",

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "x",

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: true,

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: "USER_PASSWORD_AUTH",

    // OPTIONAL - Hosted UI configuration
  },
  Storage: {
    AWSS3: {
      bucket: "", //Your bucket name;
      region: "", //Specify the region your bucket was created in;
    },
  },
}
