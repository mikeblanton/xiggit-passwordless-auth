// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// Modified from https://github.com/aws-samples/amazon-cognito-passwordless-email-auth/blob/master/cognito/lambda-triggers/verify-auth-challenge-response/verify-auth-challenge-response.ts

module.exports.handler = async (event, context) => {
  const expectedAnswer = event.request.privateChallengeParameters.secretLoginCode;
  if (event.request.challengeAnswer === expectedAnswer) {
    event.response.answerCorrect = true;
  } else {
    event.response.answerCorrect = false;
  }

  return event;
};
