import { GoogleGenerativeAI } from "@google/generative-ai";
import Docker from "dockerode";

// Initialize Docker client
const docker = new Docker();

// Initialize Google Generative AI client
const API_KEY = "AIzaSyBylb04CW-iJ-XJFfo3GM-8P9Qgz7dAuiM";
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to extract container name from user input
const extractContainerName = (input) => {
  return input.split("run the container")[1].trim();
};

// Function to extract container ID from user input
const extractContainerID = (input) => {
  return input.split("start the container with ID")[1].trim();
};

// Function to handle user prompts and interact with the AI model
export const handleUserPrompt = async (prompt) => {
  try {
    // Call Gemini API to process user prompt
    const response = await genAI
      .getGenerativeModel({ model: "gemini-pro" })
      .generateContent(prompt);

    // Extract container name or ID from Gemini response
    const userInput = response?.data?.contents?.trim();

    // Process user input and execute Docker command
    if (userInput) {
      if (userInput.includes("run the container")) {
        const containerName = extractContainerName(userInput);
        await docker.startContainer(containerName);
        return `Started the container '${containerName}'.`;
      } else if (userInput.includes("start the container with ID")) {
        const containerID = extractContainerID(userInput);
        await docker.startContainerByID(containerID);
        return `Started the container with ID '${containerID}'.`;
      } else {
        return "Could not understand the user's request.";
      }
    } else {
      return "Failed to retrieve text from AI response. Please try again.";
    }
  } catch (error) {
    console.error('Error handling user prompt:', error);
    return "An error occurred while processing the request";
  }
};