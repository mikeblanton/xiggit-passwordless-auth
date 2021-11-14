// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// Modified from https://github.com/aws-samples/amazon-cognito-passwordless-email-auth/blob/master/cognito/lambda-triggers/create-auth-challenge/create-auth-challenge.ts

const { randomDigits } = require('crypto-secure-random-digit');
const _ = require('lodash');
const twilio = require('twilio');

const ASID = ''; // ASID from Twilio
const AT = ''; // AT from Twilio
const FROM_PHONE = ''; // Phone number that is registered to send SMS through Twilio

module.exports.handler = async (event, context) => {
  try {
    let secretLoginCode;
    if (!event.request.session || !event.request.session.length) {
      // This is a new auth session
      // Generate a new secret login code and mail it to the user
      if (process.env.ENVIRONMENT !== 'production') {
        secretLoginCode = '123123';
      } else {
        secretLoginCode = randomDigits(6).join('');
        await sendCodeViaSMS(event.request.userAttributes.phone_number, secretLoginCode, appConfig, logger);
      }
      logger.debug('Code successfully sent');
    } else {
      // There's an existing session. Don't generate new digits but
      // re-use the code from the current session. This allows the user to
      // make a mistake when keying in the code and to then retry, rather
      // the needing to e-mail the user an all new code again.
      const previousChallenge = event.request.session.slice(-1)[0];
      secretLoginCode = previousChallenge.challengeMetadata.match(/CODE-(\d*)/)[1];
    }

    // This is sent back to the client app
    event.response.publicChallengeParameters = {
        phoneNumber: event.request.userAttributes.phone_number
    };

    // Add the secret login code to the private challenge parameters
    // so it can be verified by the "Verify Auth Challenge Response" trigger
    event.response.privateChallengeParameters = { secretLoginCode };

    // Add the secret login code to the session so it is available
    // in a next invocation of the "Create Auth Challenge" trigger
    event.response.challengeMetadata = `CODE-${secretLoginCode}`;

    return event;
  } catch (error) {
    return null;
  }
};

async function sendCodeViaSMS(phoneNumber, secretLoginCode, appConfig, logger) {
  const client = new twilio(ASID, AT);
  const request = {
    body: `Your verification code is ${secretLoginCode}`,
    to: phoneNumber,
    from: FROM_PHONE,
  };
  const response = await client.messages.create(request);
}
