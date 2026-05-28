import { genkit } from "genkit";
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";

// Initialize Firebase telemetry for Genkit
enableFirebaseTelemetry();

// Initialize the Genkit instance with clean configuration
export const ai = genkit({
  // Add plugins and model configurations here as the system evolves
});
