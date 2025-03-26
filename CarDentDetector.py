import os
import sys
import cv2
import json
import numpy as np
from ultralytics import YOLO

# Load YOLO model
yolo_model = YOLO("Weights/best.pt")

# Define class names
# class_labels = [
#     'Bodypanel-Dent', 'Front-Windscreen-Damage', 'Headlight-Damage',
#     'Rear-windscreen-Damage', 'RunningBoard-Dent', 'Sidemirror-Damage',
#     'Signlight-Damage', 'Taillight-Damage', 'bonnet-dent', 'boot-dent',
#     'doorouter-dent', 'fender-dent', 'front-bumper-dent', 'pillar-dent',
#     'quaterpanel-dent', 'rear-bumper-dent', 'roof-dent'
# ]

# Get image path from command line argument
image_path = sys.argv[1]

# Load the image
img = cv2.imread(image_path)

# Perform object detection
results = yolo_model(img)

detections = []
target_class='damage'
# Loop through detections and store results
for r in results:
    boxes = r.boxes
    for box in boxes:
        x1, y1, x2, y2 = box.xyxy[0]
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

        conf = round(float(box.conf[0]), 2)
        cls = int(box.cls[0])

        if conf > 0.3:
            # Draw bounding box and label on the image
            label = f"{target_class}: {conf}"
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            detections.append({
                "label": 'damage',
                "confidence": conf,
                "bbox": [x1, y1, x2, y2]
            })

# Ensure the 'outputs' directory exists
output_dir = "outputs"
os.makedirs(output_dir, exist_ok=True)

# Extract the original image name without extension
image_name = os.path.splitext(os.path.basename(image_path))[0]

# Define the output image path
output_image_path = os.path.join(output_dir, f"{image_name}_output.jpg")

# Save the image with detections
cv2.imwrite(output_image_path, img)

# Only print the JSON response, ensuring no extra data is printed
json_output = json.dumps({"detections": detections, "output_image": output_image_path})
print(json_output)
