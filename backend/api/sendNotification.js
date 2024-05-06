import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { fcm } from "./firebase.js";
import docClient from "./dynamodb.js";

const TABLENAME = "FCMToken";

const sendNotification = async (title, body, pathname) => {
  const scanParam = {
    TableName: TABLENAME,
    ProjectionExpression: "#tkn",
    ExpressionAttributeNames: { "#tkn": "token" },
    Limit: 1,
  };

  const message = {
    notification: {},
    data: {
      title: title,
      body: body,
      click_action: `https://oncce.ca/${pathname}`,
    },
    webpush: {
      fcm_options: {
        link: `https://oncce.ca/${pathname}`,
      },
      notification: {},
    },
  };

  await sendMessages();

  async function sendMessages() {
    try {
      const command = new ScanCommand(scanParam);
      const result = await docClient.send(command);
      const tokens = result.Items.map((item) => item.token.S);

      if (tokens.length <= 0) {
        return;
      }

      message.tokens = tokens;

      await fcm.sendEachForMulticast(message);

      if (typeof result.LastEvaluatedKey !== "undefined") {
        scanParam.ExclusiveStartKey = result.LastEvaluatedKey;
        await sendMessages(); // Recursive call
      }
    } catch (err) {
      console.log(err);
    }
  }
};

export default sendNotification;
