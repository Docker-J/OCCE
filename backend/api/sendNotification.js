import { fcm } from "./firebase";

const sendNotification = async (title, body, url) => {
  const message = {
    notification: {},
    data: {
      title: title,
      body: body,
      click_action: url,
    },
    webpush: {
      fcm_options: {
        link: "https://oncce.ca",
      },
      notification: {},
    },
    token:
      "fB6wQpJqzOOHbZHoNzFTSk:APA91bH9WKvUpZblMlVE5YXuVfK1KIYYoO5Yqp_H4l6fABSvo5ClhHWdiDqQkBPo2GfeCjmctyY4X3OySVkGj3SHleDxkqQon6WXCkNT7m2k3OE9eENredCiGnInuRbuJG4F-N2_8SPb",
  };

  try {
    await fcm.send([message]);
    console.log("Success");
  } catch (err) {
    console.log(err);
  }
};

export default sendNotification;
