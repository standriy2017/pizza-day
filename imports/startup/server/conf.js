import { ServiceConfiguration } from 'meteor/service-configuration';

ServiceConfiguration.configurations.upsert(
  { service: "google" },
  { $set: {   
  clientId: "356414101883-cv839vi6hv26ltcmmu3luitsmg9lmje6.apps.googleusercontent.com",
  secret: "ITeMcro-87UCsVL6fxwhmHWj" }}
);
process.env.MAIL_URL = "smtp://postmaster%40sandbox0f2d7767eb1c4572b1d72b43c5e62070.mailgun.org:7686861692fd7a7378b5c95d1221371b@smtp.mailgun.org:587";
///  process.env.MAIL_URL = 'smtp://postmaster%40sandbox00027f4fdf1371744b4a4ceb9b381828c0a.mailgun.org:73eb0bb332cc016492afed8f4664d5e4@smtp.mailgun.org:587';
