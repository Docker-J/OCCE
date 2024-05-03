import { fcm } from "./firebase.js";

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
      "fB6wQpJqzOOHbZHoNzFTSk:APA91bFnufSilf5cojprGfrcaIjFN4hXi_lEcAg0TSwGHNZt_hOPcQcKXzjY8Zi__n2-4RrRQr4f6Uq72uPtq_BR1TZ4BCMQbYs0Bu3diXh0EGClIA2D1M4nm5vIZlT-F2h9INbT8PQ6",
  };

  try {
    await fcm.send(message);
    console.log("Success");
  } catch (err) {
    console.log(err);
  }
};

export default sendNotification;
