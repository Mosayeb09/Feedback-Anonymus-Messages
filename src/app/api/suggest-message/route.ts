import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the request method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Extract the prompt from the request body
    // const { prompt } = req.body;
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are intended for an anonymous social messaging platform, similar to Qooh.me, and should cater to a diverse and inclusive audience. Avoid personal, sensitive, or potentially controversial topics, focusing instead on universal themes that encourage friendly and thoughtful interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could share a meal with any historical figure, who would it be?||What’s a simple thing that brings you joy?'. Ensure the questions are creative, spark curiosity, and contribute to a positive and welcoming conversational atmosphere.";

    // Validate the prompt
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid prompt" });
    }

    // Call the OpenAI API to generate a completion
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo",
      prompt,
      stream: true, // Note: If streaming isn't required, set this to false
      max_tokens: 100,
    });
    

    // Return the generated response
    res.status(200).json(response);
  } catch (error) {
    // Handle API-specific errors from OpenAI
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return res.status(status).json({
        error: `${name}: ${message}`,
        status,
        headers,
      });
    }

    // Log unexpected errors and return a generic error response
    console.error("An unexpected error occurred:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
}
