const { exec } = require("child_process");
const fs = require("fs");

const prepareFiles = async (
  src: string,
  lang: string,
  input: string,
  expectedOutput: string
) => {
  let fileName = "";
  let filePath = "";
  let fileExtension = "";
  switch (lang) {
    case "javascript":
      fileExtension = "js";
      break;
    case "java":
      fileExtension = "java";
      break;
    case "cpp":
      fileExtension = "cpp";
      break;
    default:
      throw new Error(`Unsupported language: ${lang}`);
  }
  fileName = `src.${fileExtension}`;
  filePath = `sandbox/${fileName}`;
  fs.writeFileSync(filePath, src, (err: Error) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log(`Data written to file ${fileName} successfully!`);
    }
  });
  fileName = "input.txt";
  filePath = `sandbox/${fileName}`;
  fs.writeFileSync(filePath, input, (err: Error) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log(`Data written to file ${fileName} successfully!`);
    }
  });

  fileName = "expected_output.txt";
  filePath = `sandbox/${fileName}`;
  fs.writeFileSync(filePath, expectedOutput, (err: Error) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log(`Data written to file ${fileName} successfully!`);
    }
  });

  fileName = "output.txt";
  filePath = `sandbox/${fileName}`;
  fs.writeFileSync(filePath, "", (err: Error) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log(`Data written to file ${fileName} successfully!`);
    }
  });

  fileName = "result.txt";
  filePath = `sandbox/${fileName}`;
  fs.writeFileSync(filePath, "", (err: Error) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log(`Data written to file ${fileName} successfully!`);
    }
  });
};

const getCommand = (
  srcFile: string,
  language: string,
  inputFile: string,
  outputFile: string,
  resultFile: string,
  timeLimit: string,
  memoryLimit: string
) => {
  return `docker run --rm \
    -v "$(pwd)/sandbox/${srcFile}:/code-exec/${srcFile}" \
    -v "$(pwd)/sandbox/${inputFile}:/code-exec/input.txt" \
    -v "$(pwd)/sandbox/${outputFile}:/code-exec/output.txt" \
    -v "$(pwd)/sandbox/${resultFile}:/code-exec/result.txt" \
    judge ${srcFile} input.txt output.txt result.txt ${language} ${timeLimit} ${memoryLimit}`;
};

const getExecutionResult = async (): Promise<execute> => {
  let fileName = "output.txt";
  let filePath = `sandbox/${fileName}`;
  const output: string = await fs.readFileSync(filePath, "utf-8");

  fileName = "result.txt";
  filePath = `sandbox/${fileName}`;
  const result = await fs.readFileSync(filePath, "utf-8");

  fileName = "expected_output.txt";
  filePath = `sandbox/${fileName}`;
  const expectedOutput = await fs.readFileSync(filePath, "utf-8");

  let message = "",
    info = "",
    time = "",
    memory = "";
  result.split("\n").forEach((row: string) => {
    if (row.includes("Message: ")) {
      message = row.split("Message: ")[1];
    }
    if (row.includes("Info: ")) {
      info = row.split("Info: ")[1];
    }
    if (row.includes("Time: ")) {
      time = row.split("Time: ")[1];
    }
    if (row.includes("Memory: ")) {
      memory = row.split("Memory: ")[1];
    }
  });

  return {
    message,
    info,
    time,
    memory,
    output,
    verdict: expectedOutput.trim() === output.trim() ? "AC" : "WA",
  };
};

interface execute {
  message: string;
  info: string;
  time: string;
  memory: string;
  output: string;
  verdict: string;
}

export const execute = async (
  src: string,
  lang: string,
  timeout: string,
  input: string,
  expectedOutput: string
): Promise<execute> => {
  await prepareFiles(src, lang, input, expectedOutput);
  const command: string = getCommand(
    src,
    lang,
    "input.txt",
    "output.txt",
    "result.txt",
    "2",
    "1024"
  );
  return new Promise(async (resolve, reject) => {
    try {
      exec(command, async (error: Error, stdout: Error, stderr: Error) => {
        if (error) {
          console.log("error", error);
        }
        return resolve(await getExecutionResult());
      });
    } catch (e) {
      console.log("Error executing command");
      return resolve({
        message: "",
        info: "",
        time: "",
        memory: "",
        output: "Server Error Occurred",
        verdict: "",
      });
    }
  });
};
