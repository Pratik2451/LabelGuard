# import sys
# import json
# import os

# from paddleocr import PaddleOCR
# from extraction import extract_structured_data


# # Force UTF-8 output on Windows
# if hasattr(sys.stdout, "reconfigure"):
#     sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# if hasattr(sys.stderr, "reconfigure"):
#     sys.stderr.reconfigure(encoding="utf-8", errors="replace")


# # Load OCR model ONCE
# ocr = PaddleOCR(
#     lang="en",
#     text_detection_model_name="PP-OCRv6_tiny_det",
#     text_recognition_model_name="PP-OCRv6_tiny_rec",
#     use_doc_orientation_classify=False,
#     use_doc_unwarping=False,
#     use_textline_orientation=False
# )


# # Main OCR processing function
# def process_images(image_paths):

#     all_ocr_items = []
#     bounding_boxes = []
#     confidence_scores = []

#     for img_index, img_path in enumerate(image_paths):

#         if not os.path.exists(img_path):
#             continue

#         results = ocr.predict(img_path)

#         for res in results:

#             texts = res.get("rec_texts", [])
#             scores = res.get("rec_scores", [])
#             boxes = res.get("rec_boxes", [])

#             for text, score, box in zip(texts, scores, boxes):

#                 box_list = box.tolist() if hasattr(box, "tolist") else box
#                 score_float = float(score)

#                 item = {
#                     "text": text,
#                     "confidence": score_float,
#                     "bbox": box_list,
#                     "imageIndex": img_index,
#                     "imagePath": img_path
#                 }

#                 all_ocr_items.append(item)

#                 bounding_boxes.append({
#                     "imageIndex": img_index,
#                     "bbox": box_list
#                 })

#                 confidence_scores.append({
#                     "text": text,
#                     "confidence": score_float
#                 })


#     # Extract structured data from OCR results
#     structured_data = extract_structured_data(all_ocr_items)

#     return {
#         "success": True,
#         "rawOcrText": all_ocr_items,
#         "structuredData": structured_data,
#         "boundingBoxes": bounding_boxes,
#         "ocrConfidence": confidence_scores
#     }


# # Function to output JSON
# def output_json(data):

#     print("---JSON_START---")

#     print(json.dumps(data, ensure_ascii=True))

#     print("---JSON_END---")


# if __name__ == "__main__":

#     image_paths = sys.argv[1:]

#     if not image_paths:
#         image_paths = ["ocr/parle.jpeg"]

#     try:

#         result = process_images(image_paths)

#         output_json(result)

#     except Exception as e:

#         error_output = {
#             "success": False,
#             "error": str(e)
#         }

#         output_json(error_output)











import sys
import json
import os

from paddleocr import PaddleOCR
from extraction import extract_structured_data


# Force UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")


# Load OCR model ONCE
ocr = PaddleOCR(
    lang="en",
    device="gpu:0",
    engine="paddle",
    text_detection_model_name="PP-OCRv6_tiny_det",
    text_recognition_model_name="PP-OCRv6_tiny_rec",
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False,
    enable_mkldnn=False
)


# Main OCR processing function
# def process_images(image_paths):

#     all_ocr_items = []
#     bounding_boxes = []
#     confidence_scores = []

#     for img_index, img_path in enumerate(image_paths):

#         if not os.path.exists(img_path):
#             continue

#         results = ocr.predict(img_path)

#         for res in results:

#             texts = res.get("rec_texts", [])
#             scores = res.get("rec_scores", [])
#             boxes = res.get("rec_boxes", [])

#             for text, score, box in zip(texts, scores, boxes):

#                 box_list = box.tolist() if hasattr(box, "tolist") else box
#                 score_float = float(score)

#                 item = {
#                     "text": text,
#                     "confidence": score_float,
#                     "bbox": box_list,
#                     "imageIndex": img_index,
#                     "imagePath": img_path
#                 }

#                 all_ocr_items.append(item)

#                 bounding_boxes.append({
#                     "imageIndex": img_index,
#                     "bbox": box_list
#                 })

#                 confidence_scores.append({
#                     "text": text,
#                     "confidence": score_float
#                 })

#     structured_data = extract_structured_data(all_ocr_items)

#     return {
#         "success": True,
#         "rawOcrText": all_ocr_items,
#         "structuredData": structured_data,
#         "boundingBoxes": bounding_boxes,
#         "ocrConfidence": confidence_scores
#     }

def process_images(image_paths):

    import time

    total_start = time.perf_counter()

    all_ocr_items = []
    bounding_boxes = []
    confidence_scores = []

    ocr_start = time.perf_counter()

    for img_index, img_path in enumerate(image_paths):

        if not os.path.exists(img_path):
            continue

        results = ocr.predict(img_path)

        for res in results:

            texts = res.get("rec_texts", [])
            scores = res.get("rec_scores", [])
            boxes = res.get("rec_boxes", [])

            for text, score, box in zip(texts, scores, boxes):

                box_list = box.tolist() if hasattr(box, "tolist") else box
                score_float = float(score)

                item = {
                    "text": text,
                    "confidence": score_float,
                    "bbox": box_list,
                    "imageIndex": img_index,
                    "imagePath": img_path
                }

                all_ocr_items.append(item)

                bounding_boxes.append({
                    "imageIndex": img_index,
                    "bbox": box_list
                })

                confidence_scores.append({
                    "text": text,
                    "confidence": score_float
                })

    ocr_time = time.perf_counter() - ocr_start

    print(
        f"OCR INFERENCE TIME: {ocr_time:.2f} seconds",
        file=sys.stderr,
        flush=True
    )

    extraction_start = time.perf_counter()

    structured_data = extract_structured_data(all_ocr_items)

    extraction_time = time.perf_counter() - extraction_start

    print(
        f"EXTRACTION TIME: {extraction_time:.2f} seconds",
        file=sys.stderr,
        flush=True
    )

    total_time = time.perf_counter() - total_start

    print(
        f"TOTAL PYTHON TIME: {total_time:.2f} seconds",
        file=sys.stderr,
        flush=True
    )

    return {
        "success": True,
        "rawOcrText": all_ocr_items,
        "structuredData": structured_data,
        "boundingBoxes": bounding_boxes,
        "ocrConfidence": confidence_scores
    }

# Function to output JSON
def output_json(data):

    print("---JSON_START---")
    print(json.dumps(data, ensure_ascii=True))
    print("---JSON_END---")


if __name__ == "__main__":

    image_paths = sys.argv[1:]

    if not image_paths:
        image_paths = ["ocr/parle.jpeg"]

    try:

        result = process_images(image_paths)

        output_json(result)

    except Exception as e:

        error_output = {
            "success": False,
            "error": str(e)
        }

        output_json(error_output)