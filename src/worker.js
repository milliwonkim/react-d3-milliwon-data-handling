import * as d3 from "d3";
import { expose } from "comlink";

// Define the message handler for processing data
const handleMainMessage = (event) => {
  return event;
  // Send the processed data back to the main thread
};

const worker = {
  handleMainMessage,
};

expose(worker);
