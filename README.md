# Car Damage Detection using YOLOv8

This project detects **car damages** like dents, cracks, and scratches using **YOLOv8**. It runs a deep learning model to analyze car images and highlight damage areas with bounding boxes.

## How It Works
1. **Upload an image** of a car to the server.
2. The **YOLOv8 model** analyzes the image to find damages.
3. The server **returns a JSON response** with detected damages and their confidence levels.
4. The processed image with damage markings is saved and accessible through a URL.

## Example Output
When you send a **POST request** to `http://localhost:3000/detect` with an image, you get a response like this:

```json
{
    "detections": [
        {
            "label": "damage",
            "confidence": 0.83,
            "bbox": [
                175,
                291,
                313,
                482
            ]
        },
        {
            "label": "damage",
            "confidence": 0.71,
            "bbox": [
                297,
                258,
                827,
                413
            ]
        }
    ],
    "output_image": "outputs/000042_output.jpg",
    "output_image_url": "http://localhost:3000/outputs/000042_output.jpg"
}
```

## Why Use This?
- **Car inspection**: Detects damages automatically for insurance and resale purposes.
- **Virtual assessments**: Helps in remote vehicle inspection.
- **Faster damage detection**: Saves time compared to manual checks.

## How to Set Up
### 1. Install Dependencies
Make sure you have **Python 3.11+** and **Node.js** installed. Then install the required Python packages:

```sh
pip install ultralytics opencv-python numpy flask
```

For Node.js, install dependencies using:

```sh
npm install express multer
```

### 2. Download the YOLOv8 Model (best.pt)
The **YOLOv8 model** used here is a pre-trained deep learning model. You can get the `best.pt` by setting up the colab environment and running this

```sh
!yolo task=detect mode=train model=yolov8l.pt data=../content/drive/MyDrive/Datasets/CarDent/data.yaml epochs=50 imgsz=640
```

After downloading, place `best.pt` in the `Weights/` folder.

### 3. Run the Server
Start the Node.js server:

```sh
node server.js
```

Now, the API is available at `http://localhost:3000/detect`

## API Usage
### Endpoint
```
POST http://localhost:3000/detect
```

### Request Body
Send an **image file** as `image` in form-data.

### Response
- **`detections`**: List of damages with confidence scores.
- **`output_image_url`**: URL of the processed image with damage boxes.

## About YOLOv8
**YOLO (You Only Look Once)** is a deep learning model that detects objects in real-time. In this project, it detects car damages like dents, scratches, and cracks. YOLO is **fast and accurate**, making it perfect for real-time car inspections.

---

This project can be improved with better training data and fine-tuning the model for higher accuracy.

