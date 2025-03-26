const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

// Serve the 'outputs' directory statically
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

// Configure storage for Multer to use original filenames
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Use the original filename
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Endpoint to handle image upload and processing
app.post("/detect", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePath = path.join(__dirname, "uploads", req.file.originalname);
    console.log("Image Path:", imagePath);

    // Run the Python script with the image path
    const pythonProcess = spawn("C:/Users/valla/AppData/Local/Programs/Python/Python311/python.exe", ["CarDentDetector.py", imagePath]);

    let responseData = "";

    pythonProcess.stdout.on("data", (data) => {
        console.log("Python Output:", data.toString());
        responseData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error("Python Error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
        if (code === 0) {
            try {
                // Extract the JSON part from the Python output
                const jsonStart = responseData.indexOf('{');
                const jsonEnd = responseData.lastIndexOf('}') + 1;
                const jsonString = responseData.slice(jsonStart, jsonEnd).trim();

                // Parse the cleaned JSON response
                const jsonResponse = JSON.parse(jsonString);

                // Construct the URL for the output image
                const outputImageUrl = `${req.protocol}://${req.get('host')}/outputs/${req.file.originalname.split('.')[0]}_output.jpg`;

                // Add the output image URL to the JSON response
                jsonResponse.output_image_url = outputImageUrl;

                res.json(jsonResponse);
            } catch (error) {
                console.error("JSON Parsing Error:", error);
                res.status(500).json({ error: "Failed to parse response from Python script" });
            }
        } else {
            console.error("Python process failed with code:", code);
            res.status(500).json({ error: "Error processing image" });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
