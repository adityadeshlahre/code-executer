// javaTest.js
import { sendMessage } from "./sendMessage";
import { execute } from "./execute";

const main = async () => {
  const executionMessage = {
    executionId: "789012",
    src: "public class Main { public static void main(String[] args) { System.out.println('Hello, World!'); } }",
    lang: "java",
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
    console.log("Java Execution Result:", result);
  } catch (e) {
    console.error("Error in Java execution:", e);
  }
};

main().catch(console.error);
