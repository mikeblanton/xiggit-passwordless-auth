// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// Modified from https://github.com/aws-samples/amazon-cognito-passwordless-email-auth/blob/master/cognito/lambda-triggers/pre-sign-up/pre-sign-up.ts

module.exports.handler = async (event, context) => {
  event.response.autoConfirmUser = true;
  if (event.request.userAttributes.hasOwnProperty('email')) {
    event.response.autoVerifyEmail = true;
  }
  if (event.request.userAttributes.hasOwnProperty('phone_number')) {
    event.response.autoVerifyPhone = true;
  }

  return event;
};
