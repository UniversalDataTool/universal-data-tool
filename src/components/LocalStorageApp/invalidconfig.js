export default {
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: "ca-central-1:9f5cffa2-bbc9-4ecc-97c5-a9eced7229a9",

    // REQUIRED - Amazon Cognito Region
    region: "ca-central-1",

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "ca-central-1_TaMMvWe7H",

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "39cd95g9nmd7vfneiden3qejio",

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: true,

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: "USER_PASSWORD_AUTH",

    // OPTIONAL - Hosted UI configuration
  },
  Storage: {
    AWSS3: {
      bucket: "annotation-tool-storage", //Your bucket name;
      region: "ca-central-1", //Specify the region your bucket was created in;
    },
  },
}