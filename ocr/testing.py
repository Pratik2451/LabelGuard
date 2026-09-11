# import time
# from paddleocr import PaddleOCR

# print("1. Import done", flush=True)

# start = time.time()

# print("2. Creating OCR model...", flush=True)

# ocr = PaddleOCR(
#     lang="en",
#     use_doc_orientation_classify=False,
#     use_doc_unwarping=False,
#     use_textline_orientation=False
# )

# print(f"3. Model created in {time.time() - start:.2f}s", flush=True)

# print("4. Starting OCR...", flush=True)

# start = time.time()

# result = ocr.predict("ocr/parle.jpeg")

# print(f"5. OCR finished in {time.time() - start:.2f}s", flush=True)

# print("6. SUCCESS", flush=True)







# What I want to change first

# Before touching your actual LabelGuard backend, let's determine whether PP-OCRv6_medium is simply too heavy for your GTX 1650.

# Your log says it is loading:

# PP-OCRv6_medium_det
# PP-OCRv6_medium_rec

# That's the medium model.

# For a label-compliance project, you may not need the medium model if a smaller model gives sufficiently accurate text extraction.

# But let's benchmark rather than guess.

# Your current test is:

# PP-OCRv6_medium
#        ↓
# ~74 sec model loading
# ~25 sec OCR

# We'll test a lighter model next.

# Change only this line

# In testing.py, change:

# ocr = PaddleOCR(
#     lang="en",

# to:

# ocr = PaddleOCR(
#     lang="en",
#     text_detection_model_name="PP-OCRv6_mobile_det",
#     text_recognition_model_name="PP-OCRv6_mobile_rec",


# If the mobile model gives something like 5-10 seconds while maintaining acceptable recognition, that's a much better direction for your LabelGuard system. If accuracy tanks, we'll move back up the model family rather than sacrificing your actual project quality for a pretty benchmark number.

import time

from paddleocr import PaddleOCR

print("1. Import done", flush=True)

start = time.time()

print("2. Creating OCR model...", flush=True)

ocr = PaddleOCR(
    lang="en",
    text_detection_model_name="PP-OCRv6_tiny_det",
    text_recognition_model_name="PP-OCRv6_tiny_rec",
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False
)

print(f"3. Model created in {time.time() - start:.2f}s", flush=True)

print("4. Starting OCR...", flush=True)

start = time.time()

result = ocr.predict("ocr/parle.jpeg")

print(f"5. OCR finished in {time.time() - start:.2f}s", flush=True)

print("6. SUCCESS", flush=True)