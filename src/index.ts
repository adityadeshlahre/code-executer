import _ from "lodash";
import { execute } from "./execute";
import { connect } from "./connect";

const executionResultsArray: any[] = [];

const consumeMessages = async () => {
  try {
    let connection = await connect();
    const channel = await connection.createChannel();
    const queue = process.env.RABBITMQ_QUEUE_NAME || "test_queue";
    await channel.assertQueue(queue, { durable: false });
    console.log("Waiting for messages...");
    channel.consume(queue, async (message) => {
      const messageContent = _.get(message, "content", null);
      if (message && messageContent) {
        const messageString = messageContent.toString();
        let receivedMessage = JSON.parse(messageString);
        console.log({ receivedMessage });
        const { executionId } = receivedMessage;
        const executionResult = {
          id: executionId,
          status: "Queued",
        };
        executionResultsArray.push(executionResult);

        try {
          const result = await execute(
            receivedMessage.src,
            receivedMessage.lang,
            receivedMessage.timeout || "5",
            receivedMessage.input || "",
            receivedMessage.expectedOutput || ""
          );
          let { message, info, time, memory, output, verdict } = result;
          console.log({ message, info, time, memory, output, verdict });

          const index = executionResultsArray.findIndex(
            (item) => item.id === executionId
          );
          if (index !== -1) {
            executionResultsArray[index] = {
              ...executionResultsArray[index],
              output,
              verdict: message,
              status: "Done",
            };
          }
        } catch (e) {
          console.log("Error in execution: ", e);
          const index = executionResultsArray.findIndex(
            (item) => item.id === executionId
          );
          if (index !== -1) {
            executionResultsArray[index] = {
              ...executionResultsArray[index],
              status: "Error",
            };
          }
        }
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error("Error: ", error);
  }
};

consumeMessages().catch(console.error);
