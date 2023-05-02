const express = require("express");
const router = express.Router();

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
// const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
// const AWS = require("aws-sdk");

// const auth = getAuth();

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
      res.sendStatus(200);
    },
    onFailure: function (err) {
      console.log(err);
      res.sendStatus(401);
    },
  });
});

router.post("/signUp", async (req, res) => {
  var attributeList = [];
  var dataName = {
    Name: "name",
    Value: req.body.name,
  };
  var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);
  attributeList.push(attributeName);

  userPool.signUp(
    req.body.email,
    req.body.password,
    attributeList,
    null,
    function (err, result) {
      if (err) {
        console.log(err.message || JSON.stringify(err));
        res.sendStatus(400);
      }
      var cognitoUser = result.user;
      console.log("user name is" + cognitoUser.getUsername());
      res.sendStatus(200);
    }
  );
});

router.post("/confirm", async (req, res) => {
  var userData = { Username: req.body.email, Pool: userPool };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.confirmRegistration(
    req.body.confirm_code,
    true,
    function (err, result) {
      if (err) {
        console.log(err.message || JSON.stringify(err));
        res.sendStatus(400);
        return;
      }
      console.log("call result: " + result);
      res.sendStatus(200);
    }
  );
});

router.get("/resendConfirm", async (req, res) => {
  var userData = { Username: req.query.email, Pool: userPool };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.resendConfirmationCode((err, result) => {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    console.log("call result: " + result);
    res.sendStatus(200);
  });
});

router.get("/signOut", async (req, res) => {});

module.exports = router;
