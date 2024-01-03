import { sendMessage } from "./sendMessage";
import { execute } from "./execute";

const main = async () => {
  const executionMessage = {
    executionId: "453454",
    src: "console.log('Hello, World!');",
    lang: "javascript",
    timeout: "5",
    input: "input data",
    expectedOutput: "Hello, World!\n",
  };

  await sendMessage(executionMessage);

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

main().catch(console.error);
