# import sys
# import json
# import os

# from paddleocr import PaddleOCR
# from extraction import extract_structured_data


# # Force UTF-8 output on Windows
# if hasattr(sys.stdout, "reconfigure"):
#     sys.stdout.reconfigure(
#         encoding="utf-8",
#         errors="replace",
#         line_buffering=True
#     )

# if hasattr(sys.stderr, "reconfigure"):
#     sys.stderr.reconfigure(
#         encoding="utf-8",
#         errors="replace"
#     )


# print("Loading PaddleOCR model...", file=sys.stderr, flush=True)

# # Load OCR model ONLY ONCE
# ocr = PaddleOCR(
#     lang="en",
#     device="gpu:0",
#     engine="paddle",
#     text_detection_model_name="PP-OCRv6_tiny_det",
#     text_recognition_model_name="PP-OCRv6_tiny_rec",
#     use_doc_orientation_classify=False,
#     use_doc_unwarping=False,
#     use_textline_orientation=False,
#     enable_mkldnn=False
# )

# print("PaddleOCR model loaded.", file=sys.stderr, flush=True)


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


# def send_response(data):

#     # Special marker so Node can identify our JSON
#     print(
#         "__OCR_RESPONSE__" +
#         json.dumps(data, ensure_ascii=True),
#         flush=True
#     )


# # Keep Python alive and wait for requests
# for line in sys.stdin:

#     line = line.strip()

#     if not line:
#         continue

#     try:

#         request = json.loads(line)

#         image_paths = request.get("imagePaths", [])

#         if not image_paths:
#             send_response({
#                 "success": False,
#                 "error": "No image paths provided"
#             })
#             continue

#         result = process_images(image_paths)

#         send_response(result)

#     except Exception as e:

#         print(
#             f"OCR error: {str(e)}",
#             file=sys.stderr,
#             flush=True
#         )

#         send_response({
#             "success": False,
#             "error": str(e)
#         })




import sys
import json
import time

from main import process_images


# Make stdout/stderr reliable for Node.js communication
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(
        encoding="utf-8",
        errors="replace",
        line_buffering=True
    )

if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(
        encoding="utf-8",
        errors="replace",
        line_buffering=True
    )


print(
    "Persistent OCR server starting...",
    file=sys.stderr,
    flush=True
)


# main.py loads PaddleOCR when imported.
# At this point the model is ready.
print(
    "OCR_READY",
    flush=True
)


def send_response(data):
    """
    Send exactly one JSON response to Node.js.
    """

    print(
        "__OCR_RESPONSE__" +
        json.dumps(data, ensure_ascii=True),
        flush=True
    )


for line in sys.stdin:

    line = line.strip()

    if not line:
        continue

    request = None

    try:

        request = json.loads(line)

        request_id = request.get("requestId")
        image_paths = request.get("imagePaths", [])

        if not image_paths:

            send_response({
                "success": False,
                "error": "No image paths provided",
                "requestId": request_id
            })

            continue


        # Run OCR
        start_time = time.perf_counter()

        result = process_images(image_paths)

        total_time = time.perf_counter() - start_time

        print(
            f"OCR SERVER REQUEST TIME: {total_time:.2f} seconds",
            file=sys.stderr,
            flush=True
        )


        # Attach request ID so Node knows
        # which request this response belongs to.
        result["requestId"] = request_id

        print(
            f"OCR RESPONSE SENDING: {request_id}",
            file=sys.stderr,
            flush=True
        )

        send_response(result)


    except Exception as e:

        print(
            f"OCR server error: {e}",
            file=sys.stderr,
            flush=True
        )

        send_response({
            "success": False,
            "error": str(e),
            "requestId": (
                request.get("requestId")
                if request
                else None
            )
        })