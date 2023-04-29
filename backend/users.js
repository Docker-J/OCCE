const express = require("express");
const router = express.Router();

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require("aws-sdk");

const auth = getAuth();

const poolData = {
  UserPoolId: "us-west-2_v1MWWI1Vn",
  ClientId: "78vu8v6fh72mhjetdmsh2vvaad",
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

router.post("/signIn", async (req, res) => {
  console.log("requested!");
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: req.body.email,
    Password: req.body.password,
  });
  var userData = { Username: req.body.email, Pool: userPool };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      console.log("access token + " + result.getAccessToken().getJwtToken());
      console.log("id token + " + result.getIdToken().getJwtToken());
      console.log("refresh token + " + result.getRefreshToken().getToken());
    },
    onFailure: function (err) {
      console.log(err);
    },
  });
});

router.get("/signOut", async (req, res) => {});

module.exports = router;
