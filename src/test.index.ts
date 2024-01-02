import { sendMessage } from "./sendMessage"; // Replace with the correct path to your amqp module
import { execute } from "./execute"; // Assuming execute is in the same directory, adjust the path if needed

const main = async () => {
  const executionMessage = {
    executionId: "123456", // Replace with a unique identifier for the execution
    src: "console.log('Hello, World!');", // Replace with the code you want to execute
    lang: "javascript",
    timeout: "5",
    input: "input data", // Replace with the input data for execution
    expectedOutput: "Hello, World!\n", // Replace with the expected output for verification
  };

  // Sending the execution message to the "test_queue"
  await sendMessage(executionMessage);

  // For demonstration purposes, you can also directly execute the code here
  try {
    const result = await execute(
      executionMessage.src,
      executionMessage.lang,
      executionMessage.timeout,
      executionMessage.input,
      executionMessage.expectedOutput
    );
    console.log("Execution Result:", result);
  } catch (e) {
    console.error("Error in execution:", e);
  }
};

// Run the main function
main().catch(console.error);
