import { generatePoem } from "./services/claude";

require('dotenv').config();

generatePoem("Write a poem about the beauty of nature")
    .then(response => {
        console.log("Generated Poem:", response);
    })
    .catch(error => {
        console.error("Error generating poem:", error);
    })
    .finally(() => {
        console.log("Poem generation process completed.");
    }
    );