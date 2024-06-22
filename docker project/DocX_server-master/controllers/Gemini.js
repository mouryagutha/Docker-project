import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBylb04CW-iJ-XJFfo3GM-8P9Qgz7dAuiM"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

async function getter(diffinput) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const cleanAndSendAsJson = (prompt) => {
    const lines = prompt.split("\n").filter((line) => line.trim() !== "");

    if (lines.length === 0) {
      return { error: "Prompt is empty or improperly formatted" };
    }
    const userInputLine = lines[0].split(":");
    const userInput = userInputLine.length > 1 ? userInputLine[1].trim() : "";

    const instructions = lines.slice(1, 7).map((line) => line.trim());
    const suggestion = lines.slice(7).join(" ").trim();

    const jsonResponse = {
      userInput,
      instructions,
      suggestion,
    };

    return jsonResponse;
  };

  const prompt = `
    user input: ${diffinput}
    now the input is a Dockerfile. Your task is to optimize and make the Dockerfile more efficient.
    Remove all unnecessary lines and make it more optimized. Eliminate any redundant lines and errors.
    Provide the client with the final Dockerfile and inform them that it has been optimized and efficient.
    Suggestively recommend using this optimized Dockerfile.
    give me the json as the result one is optimized docker file and the other is the suggestion.
    and remember to give me always in the json only.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    const jsonResponse = cleanAndSendAsJson(text);
    return jsonResponse;
  } catch (error) {
    console.error(`Error in getter function: ${error.message}`);
    return { error: "An error occurred while processing the request" };
  }
}

export const getCommitMessage = async (req, res) => {
  const { diffinput } = req.body;
  if (!diffinput) {
    return res.status(400).json({ error: "Missing 'diffinput' parameter" });
  }
  const cleanResponse = await getter(diffinput);
  res.json(cleanResponse);
};
