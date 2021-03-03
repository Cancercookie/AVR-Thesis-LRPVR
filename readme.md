# **Project setup**

## Prerequisites

- The following must have been installed:
  `node 10.x, serverless, Steam VR, Unity 2019.1.1f1`

- AWS account
- Alexa developer account
- Alexa device
- VR Headset connected (or else when starting the main scene it will throw an error)

## Usage
- To just start the application you will use the original CloudFormation stack. You don't  need to do anything else
- To use Alexa you will need to create a Skill with your custom wake word, as of today you cannot use others' Skills without invitation
- After creating the basic structure of the Skill, import `Alexa/Intent.json` into the "JSON Editor" to have all the intents
- Build the model
- Use `arn:aws:lambda:eu-west-1:418035995248:function:AVRService-production-AVRLambda` (or yours if you deploy your own version) as the default Endpoint value
- Put Alexa near to you and save
- Start the scene inside `/Scenes` with the headset on and call the Wake Word for the Skill

## Developing
- Create a new git branch 
- To develop the application under your AWS you must deploy the entire stack using `serverless deploy` in `/Alexa/AVRService`
- Setup the DynamoDB's Articles table as explained in the "DynamoDB" section of this document
- Change the endpoint (which is hardcoded) for the websockets in `Assets/Scripts/websockets.cs` and `Alexa/AVRService/utils.js` with yours

## DynamoDB

There are two main tables:

- Articles: this must be populated, `/Alexa/Articles.csv` there is an example csv with some values. This can be imported
  in dynamo.
- AVRTable: this is self populated and cleaned after every session. Beware that the `alexaUserId` is hardcoded in the
  file `/Alexa/AVRService/utils.js`. You must replace it with your personal ID (as for the current implementation, this
  could be improved).