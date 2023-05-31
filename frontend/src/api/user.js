const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

const poolData = {
  UserPoolId: "us-west-2_v1MWWI1Vn",
  ClientId: "78vu8v6fh72mhjetdmsh2vvaad",
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

export const signIn = (email, password) => {
  console.log("requested!");
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password,
  });
  var userData = { Username: email, Pool: userPool };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      // console.log("access token + " + result.getAccessToken().getJwtToken());
      // console.log("id token + " + result.getIdToken().getJwtToken());
      // console.log("refresh token + " + result.getRefreshToken().getToken());
      console.log(result.getIdToken().payload["cognito:groups"]);
    },
    onFailure: function (err) {
      console.log(err);
    },
  });
};

export const signOut = () => {
  var user = userPool.getCurrentUser();
  if (user) {
    user.signOut();
    console.log("Success");
  }
};
