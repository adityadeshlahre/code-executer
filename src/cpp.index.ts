import { sendMessage } from "./sendMessage";
import { execute } from "./execute";

const main = async () => {
  const executionMessage = {
    executionId: "567890",
    src: "#include <iostream>\nusing namespace std;\nint main() { cout << 'Hello, World!' << endl; return 0; }",
    lang: "cpp",
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
    console.log("C++ Execution Result:", result);
  } catch (e) {
    console.error("Error in C++ execution:", e);
  }
};

main().catch(console.error);
