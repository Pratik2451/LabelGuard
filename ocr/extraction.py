# import re


# def make_field(value, item):
#     if value is None or item is None:
#         return None

#     return {
#         "value": value,
#         "confidence": item["confidence"],
#         "bbox": item["bbox"]
#     }


# def find_following_items(ocr_items, keywords, max_items=4):
#     """
#     Find a declaration keyword and return the OCR items
#     immediately following it.
#     """

#     for i, item in enumerate(ocr_items):

#         text = item["text"].lower()

#         for keyword in keywords:

#             if keyword.lower() in text:
#                 return ocr_items[i + 1:i + 1 + max_items]

#     return []


# # --------------------------------------------------
# # PRODUCT NAME
# # --------------------------------------------------

# def extract_product_name(ocr_items):

#     for item in ocr_items:

#         if "parle-g" in item["text"].lower():

#             return make_field(
#                 "Parle-G",
#                 item
#             )

#     return None


# # --------------------------------------------------
# # MRP
# # --------------------------------------------------

# def extract_mrp(ocr_items):

#     for item in ocr_items:

#         match = re.search(
#             r"MRP\s*[:.]?\s*₹?\s*(\d+(?:\.\d+)?)",
#             item["text"],
#             re.IGNORECASE
#         )

#         if match:

#             return make_field(
#                 float(match.group(1)),
#                 item
#             )

#     return None


# # --------------------------------------------------
# # NET QUANTITY
# # --------------------------------------------------

# def extract_net_quantity(ocr_items):

#     for i, item in enumerate(ocr_items):

#         if re.search(
#             r"NET\s*(WEIGHT|QUANTITY)",
#             item["text"],
#             re.IGNORECASE
#         ):

#             nearby_items = ocr_items[i:i + 5]

#             for nearby in nearby_items:

#                 matches = re.findall(
#                     r"(\d+(?:\.\d+)?)\s*(kg|g|mg|l|ml)",
#                     nearby["text"],
#                     re.IGNORECASE
#                 )

#                 if matches:

#                     value, unit = matches[-1]

#                     return {
#                         "value": float(value),
#                         "unit": unit.lower(),
#                         "confidence": nearby["confidence"],
#                         "bbox": nearby["bbox"]
#                     }

#     return None


# # --------------------------------------------------
# # MANUFACTURER
# # --------------------------------------------------

# def extract_manufacturer(ocr_items):

#     keywords = [
#         "MANUFACTURED BY",
#         "MANUFACTURED FOR",
#         "MFD. BY",
#         "MFD BY"
#     ]

#     for i, item in enumerate(ocr_items):

#         text = item["text"].upper()

#         if any(keyword in text for keyword in keywords):

#             label_y = item["bbox"][1]

#             manufacturer_items = []

#             for next_item in ocr_items[i + 1:]:

#                 next_y = next_item["bbox"][1]

#                 # Stop if we move too far down
#                 if next_y - label_y > 150:
#                     break

#                 next_text = next_item["text"].strip()

#                 if not next_text:
#                     continue

#                 # Stop at unrelated declarations
#                 if re.search(
#                     r"CONSUMER CARE|PHONE|EMAIL|STORAGE CONDITIONS",
#                     next_text,
#                     re.IGNORECASE
#                 ):
#                     break

#                 manufacturer_items.append(
#                     make_field(
#                         next_text,
#                         next_item
#                     )
#                 )

#             if manufacturer_items:
#                 return manufacturer_items

#     return None

# # --------------------------------------------------
# # PACKER
# # --------------------------------------------------

# def extract_packer(ocr_items):

#     following = find_following_items(
#         ocr_items,
#         [
#             "PACKED BY",
#             "PACKER"
#         ],
#         max_items=3
#     )

#     if not following:
#         return None

#     values = []

#     for item in following:

#         text = item["text"].strip()

#         if not text:
#             continue

#         values.append(
#             make_field(text, item)
#         )

#     return values if values else None


# # --------------------------------------------------
# # IMPORTER
# # --------------------------------------------------

# def extract_importer(ocr_items):

#     following = find_following_items(
#         ocr_items,
#         [
#             "IMPORTED BY",
#             "IMPORTER"
#         ],
#         max_items=3
#     )

#     if not following:
#         return None

#     values = []

#     for item in following:

#         text = item["text"].strip()

#         if not text:
#             continue

#         values.append(
#             make_field(text, item)
#         )

#     return values if values else None


# # --------------------------------------------------
# # COUNTRY OF ORIGIN
# # --------------------------------------------------

# def extract_country_of_origin(ocr_items):

#     following = find_following_items(
#         ocr_items,
#         [
#             "COUNTRY OF ORIGIN",
#             "COUNTRY OF ORIGIN:"
#         ],
#         max_items=2
#     )

#     if not following:
#         return None

#     for item in following:

#         text = item["text"].strip()

#         if text:

#             return make_field(
#                 text,
#                 item
#             )

#     return None


# # --------------------------------------------------
# # MANUFACTURING / PACKING DATE
# # --------------------------------------------------

# def extract_manufacturing_date(ocr_items):

#     date_patterns = [
#         r"\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b",
#         r"\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2}\b",
#         r"\b\d{1,2}[\/\-]\d{4}\b"
#     ]

#     date_keywords = [
#         "MFD",
#         "MFG",
#         "MANUFACTURED",
#         "MANUFACTURING",
#         "PKD",
#         "PACKED"
#     ]

#     # First try dates near date-related labels
#     for i, item in enumerate(ocr_items):

#         if any(
#             keyword in item["text"].upper()
#             for keyword in date_keywords
#         ):

#             for nearby in ocr_items[i:i + 8]:

#                 for pattern in date_patterns:

#                     match = re.search(
#                         pattern,
#                         nearby["text"]
#                     )

#                     if match:
#                         return make_field(
#                             match.group(0),
#                             nearby
#                         )

#     # If label is not detected, find standalone dates
#     for item in ocr_items:

#         for pattern in date_patterns:

#             match = re.search(
#                 pattern,
#                 item["text"]
#             )

#             if match:

#                 return make_field(
#                     match.group(0),
#                     item
#                 )

#     return None

# # --------------------------------------------------
# # BEST BEFORE
# # --------------------------------------------------

# def extract_best_before(ocr_items):

#     for i, item in enumerate(ocr_items):

#         if re.search(
#             r"BEST\s*BEFORE",
#             item["text"],
#             re.IGNORECASE
#         ):

#             nearby_items = ocr_items[i:i + 4]

#             for nearby in nearby_items:

#                 match = re.search(
#                     r"(\d+)\s*(DAYS?|MONTHS?|YEARS?)",
#                     nearby["text"],
#                     re.IGNORECASE
#                 )

#                 if match:

#                     return make_field(
#                         match.group(0),
#                         nearby
#                     )

#                 # Sometimes date itself follows
#                 match = re.search(
#                     r"\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}",
#                     nearby["text"]
#                 )

#                 if match:

#                     return make_field(
#                         match.group(0),
#                         nearby
#                     )

#     return None


# # --------------------------------------------------
# # USE BY
# # --------------------------------------------------

# def extract_use_by(ocr_items):

#     for i, item in enumerate(ocr_items):

#         if re.search(
#             r"USE\s*BY",
#             item["text"],
#             re.IGNORECASE
#         ):

#             nearby_items = ocr_items[i:i + 4]

#             for nearby in nearby_items:

#                 match = re.search(
#                     r"\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}",
#                     nearby["text"]
#                 )

#                 if match:

#                     return make_field(
#                         match.group(0),
#                         nearby
#                     )

#     return None


# # --------------------------------------------------
# # CONSUMER CARE
# # --------------------------------------------------

# def extract_consumer_care(ocr_items):

#     phone = None
#     email = None

#     for item in ocr_items:

#         text = item["text"]

#         phone_match = re.search(
#             r"(?:PHONE\s*NO\.?|PHONE)\s*:?\s*([\d\s\-]+)",
#             text,
#             re.IGNORECASE
#         )

#         email_match = re.search(
#             r"[\w\.-]+@[\w\.-]+\.\w+",
#             text
#         )

#         if phone_match:

#             phone = make_field(
#                 phone_match.group(1).strip(),
#                 item
#             )

#         if email_match:

#             email = make_field(
#                 email_match.group(0),
#                 item
#             )

#     if phone or email:

#         return {
#             "phone": phone,
#             "email": email
#         }

#     return None


# # --------------------------------------------------
# # MAIN EXTRACTION FUNCTION
# # --------------------------------------------------

# def extract_structured_data(ocr_items):

#     return {

#         "productName":
#             extract_product_name(ocr_items),

#         "manufacturer":
#             extract_manufacturer(ocr_items),

#         "packer":
#             extract_packer(ocr_items),

#         "importer":
#             extract_importer(ocr_items),

#         "countryOfOrigin":
#             extract_country_of_origin(ocr_items),

#         "netQuantity":
#             extract_net_quantity(ocr_items),

#         "mrp":
#             extract_mrp(ocr_items),

#         "manufacturingDate":
#             extract_manufacturing_date(ocr_items),

#         "bestBefore":
#             extract_best_before(ocr_items),

#         "useBy":
#             extract_use_by(ocr_items),

#         "consumerCare":
#             extract_consumer_care(ocr_items)
#     }





import re
import math


# ============================================================
# BASIC HELPERS
# ============================================================

def make_field(value, item=None, confidence=None, bbox=None):
    """
    Create a standard extracted field.

    Example:
    {
        "value": "200 ml",
        "confidence": 92.5,
        "bbox": [...]
    }
    """

    if value is None:
        return None

    value = str(value).strip()

    if not value:
        return None

    if item is not None:
        confidence = item.get("confidence")
        bbox = item.get("bbox")

    return {
        "value": value,
        "confidence": float(confidence or 0),
        "bbox": bbox
    }


def clean_text(text):
    """Basic OCR cleanup."""

    if not text:
        return ""

    text = str(text)

    replacements = {
        "\n": " ",
        "\r": " ",
        "  ": " ",
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    return text.strip()


def normalize_text(text):
    """
    Normalize common OCR mistakes without assuming a particular brand.
    """

    text = clean_text(text)

    replacements = {
        "N0.": "No.",
        "N0": "No",
        "Na.": "No.",
        "LIC. N0": "LIC. NO",
        "LIC N0": "LIC NO",
        "MFG DT": "MFG. DT.",
        "MFG. DT": "MFG. DT.",
        "EXP DT": "EXP. DT.",
        "EXP. DT": "EXP. DT.",
        "PKD DT": "PKD. DT.",
        "MRP₹": "MRP ₹",
        "MRP:₹": "MRP ₹",
    }

    upper = text.upper()

    # OCR commonly recognizes FSSAI incorrectly.
    if re.search(r"\bFSS[AI1]\b", upper):
        text = re.sub(
            r"\bFSS[AI1]\b",
            "FSSAI",
            text,
            flags=re.IGNORECASE
        )

    return text.strip()


def normalized_upper(text):
    return normalize_text(text).upper()


def safe_bbox(item):
    bbox = item.get("bbox")

    if not bbox:
        return None

    try:
        if len(bbox) >= 4:
            return bbox
    except Exception:
        pass

    return None


def bbox_height(item):
    bbox = safe_bbox(item)

    if not bbox:
        return 0

    try:
        ys = [float(point[1]) for point in bbox]
        return max(ys) - min(ys)
    except Exception:
        return 0


def bbox_width(item):
    bbox = safe_bbox(item)

    if not bbox:
        return 0

    try:
        xs = [float(point[0]) for point in bbox]
        return max(xs) - min(xs)
    except Exception:
        return 0


def bbox_center(item):
    bbox = safe_bbox(item)

    if not bbox:
        return (0, 0)

    try:
        xs = [float(point[0]) for point in bbox]
        ys = [float(point[1]) for point in bbox]

        return (
            sum(xs) / len(xs),
            sum(ys) / len(ys)
        )

    except Exception:
        return (0, 0)


def distance_between(item1, item2):
    x1, y1 = bbox_center(item1)
    x2, y2 = bbox_center(item2)

    return math.sqrt(
        ((x1 - x2) ** 2) +
        ((y1 - y2) ** 2)
    )


# ============================================================
# OCR NORMALIZATION
# ============================================================

def prepare_ocr_items(ocr_items):
    """
    Add normalized text while preserving original OCR information.

    OCR items coming from your PaddleOCR pipeline contain:
        text
        confidence
        bbox
        imageIndex
        imagePath
    """

    prepared = []

    for index, item in enumerate(ocr_items):

        if not item:
            continue

        text = clean_text(item.get("text", ""))

        if not text:
            continue

        new_item = dict(item)

        new_item["originalText"] = text
        new_item["normalizedText"] = normalize_text(text)
        new_item["_index"] = index

        prepared.append(new_item)

    return prepared


# ============================================================
# GENERIC KEYWORD SEARCH
# ============================================================

def contains_keyword(text, keywords):
    upper = normalized_upper(text)

    return any(
        keyword.upper() in upper
        for keyword in keywords
    )


def find_items_with_keywords(ocr_items, keywords):

    matches = []

    for item in ocr_items:

        text = item.get("normalizedText", item.get("text", ""))

        if contains_keyword(text, keywords):
            matches.append(item)

    return matches


def find_following_items(
    ocr_items,
    keywords,
    max_items=5,
    same_image=True
):
    """
    Find a declaration and return nearby OCR items.

    Unlike the old implementation, this can avoid crossing
    into another uploaded image.
    """

    for i, item in enumerate(ocr_items):

        text = item.get(
            "normalizedText",
            item.get("text", "")
        )

        if not contains_keyword(text, keywords):
            continue

        result = []

        image_index = item.get("imageIndex")

        for next_item in ocr_items[i + 1:]:

            if (
                same_image
                and next_item.get("imageIndex") != image_index
            ):
                break

            next_text = clean_text(next_item.get("text", ""))

            if not next_text:
                continue

            result.append(next_item)

            if len(result) >= max_items:
                break

        return result

    return []


# ============================================================
# PRODUCT NAME
# ============================================================

def is_bad_product_candidate(text):
    """
    Words that are normally NOT product names.
    """

    upper = normalized_upper(text)

    bad_words = [
        "NO PRESERVATIVES",
        "ASEPTIC PACKAGING",
        "ENERGY",
        "ELECTROLYTE",
        "ELECTROLYTES",
        "DRINK",
        "FOOD",
        "BEVERAGE",
        "INGREDIENTS",
        "NUTRITION",
        "NUTRITIONAL",
        "INFORMATION",
        "NET QUANTITY",
        "NET WEIGHT",
        "MRP",
        "MFG",
        "EXP",
        "MANUFACTURED",
        "PACKED",
        "MARKETED",
        "DISTRIBUTED",
        "IMPORTER",
        "PACKER",
        "FSSAI",
        "LICENSE",
        "LIC",
        "BEST BEFORE",
        "USE BY",
        "CONSUMER",
        "STORAGE",
        "SHAKE WELL",
        "KEEP YOUR",
        "INGREDIENT",
        "CALORIES",
        "KCAL",
        "CARBOHYDRATE",
        "SODIUM",
        "PROTEIN",
        "FAT",
        "SUGAR",
        "CAUTION",
        "WARNING",
    ]

    return any(word in upper for word in bad_words)


def product_candidate_score(item):
    """
    Score a possible product/brand name.

    This is deliberately generic. It uses:
    - OCR confidence
    - text size
    - text length
    - position
    - visual prominence

    It does NOT know any specific brand.
    """

    text = clean_text(item.get("text", ""))

    if not text:
        return -999

    if is_bad_product_candidate(text):
        return -999

    confidence = float(item.get("confidence", 0))

    height = bbox_height(item)

    score = confidence * 0.5

    # Large text is often the product/brand name.
    score += min(height * 2.0, 50)

    # Product names usually have useful alphabetic content.
    alpha_count = sum(c.isalpha() for c in text)

    if alpha_count >= 3:
        score += 10

    if alpha_count >= 5:
        score += 5

    # Avoid pure numbers.
    if re.fullmatch(r"[\d\s.,₹/%-]+", text):
        score -= 50

    # Very long sentences are probably descriptions.
    if len(text) > 60:
        score -= 30

    if len(text) > 100:
        score -= 50

    return score


def extract_product_name(ocr_items):

    candidates = []

    for item in ocr_items:

        text = clean_text(item.get("text", ""))

        if not text:
            continue

        score = product_candidate_score(item)

        if score <= 0:
            continue

        candidates.append(
            (score, item)
        )

    if not candidates:
        return None

    candidates.sort(
        key=lambda x: x[0],
        reverse=True
    )

    best_score, best_item = candidates[0]

    text = clean_text(best_item.get("text", ""))

    return make_field(
        text,
        best_item
    )


# ============================================================
# MRP
# ============================================================

MRP_PATTERNS = [
    r"MRP\s*[:.]?\s*(?:₹|RS\.?|INR)?\s*(\d+(?:\.\d+)?)",
    r"(?:₹|RS\.?|INR)\s*(\d+(?:\.\d+)?)",
]


def extract_mrp(ocr_items):

    # --------------------------------------------------------
    # CASE 1:
    # "MRP ₹ 20"
    # --------------------------------------------------------

    for item in ocr_items:

        text = normalized_upper(item.get("text", ""))

        for pattern in MRP_PATTERNS:

            match = re.search(
                pattern,
                text,
                re.IGNORECASE
            )

            if match:

                try:
                    value = float(match.group(1))
                except ValueError:
                    continue

                return make_field(
                    value,
                    item
                )

    # --------------------------------------------------------
    # CASE 2:
    # MRP is one OCR item and value is nearby
    # --------------------------------------------------------

    for i, item in enumerate(ocr_items):

        text = normalized_upper(
            item.get("text", "")
        )

        if "MRP" not in text:
            continue

        image_index = item.get("imageIndex")

        for nearby in ocr_items[i + 1:i + 6]:

            if nearby.get("imageIndex") != image_index:
                break

            nearby_text = clean_text(
                nearby.get("text", "")
            )

            match = re.search(
                r"(?:₹|RS\.?|INR)?\s*(\d+(?:\.\d+)?)",
                nearby_text,
                re.IGNORECASE
            )

            if match:

                try:
                    value = float(match.group(1))
                except ValueError:
                    continue

                return make_field(
                    value,
                    nearby
                )

    return None


# ============================================================
# NET QUANTITY
# ============================================================

QUANTITY_PATTERN = re.compile(
    r"(\d+(?:\.\d+)?)\s*"
    r"(kg|kgs|g|gm|gms|mg|l|ltr|litre|litres|ml|"
    r"millilitre|millilitres)",
    re.IGNORECASE
)


def extract_net_quantity(ocr_items):

    quantity_keywords = [
        "NET QUANTITY",
        "NET WEIGHT",
        "NET CONTENT",
        "NET VOL",
        "NET VOLUME",
    ]

    # First search near explicit declaration.
    for i, item in enumerate(ocr_items):

        text = normalized_upper(
            item.get("text", "")
        )

        if not any(
            keyword in text
            for keyword in quantity_keywords
        ):
            continue

        image_index = item.get("imageIndex")

        for nearby in ocr_items[i:i + 7]:

            if nearby.get("imageIndex") != image_index:
                break

            matches = QUANTITY_PATTERN.findall(
                nearby.get("text", "")
            )

            if matches:

                value, unit = matches[-1]

                return {
                    "value": float(value),
                    "unit": unit.lower(),
                    "confidence": float(
                        nearby.get("confidence", 0)
                    ),
                    "bbox": nearby.get("bbox")
                }

    # Fallback: search all OCR text.
    for item in ocr_items:

        matches = QUANTITY_PATTERN.findall(
            item.get("text", "")
        )

        if matches:

            value, unit = matches[-1]

            return {
                "value": float(value),
                "unit": unit.lower(),
                "confidence": float(
                    item.get("confidence", 0)
                ),
                "bbox": item.get("bbox")
            }

    return None


# ============================================================
# MANUFACTURER
# ============================================================

MANUFACTURER_KEYWORDS = [
    "MANUFACTURED BY",
    "MANUFACTURED FOR",
    "MANUFACTURED AND PACKED BY",
    "MANUFACTURED & PACKED BY",
    "MANUFACTURED & PACKED FOR",
    "MANUFACTURED AND PACKED FOR",
    "MANUFACTURER",
    "MANUFACTURING UNIT",
    "MANUFACTURING ADDRESS",
    "BRAND OWNED & MARKETED BY",
    "BRAND OWNED AND MARKETED BY",
    "MARKETED BY",
    "MARKETED AND MANUFACTURED BY",
]


def looks_like_address(text):
    upper = normalized_upper(text)

    address_words = [
        "ROAD",
        "RD.",
        "STREET",
        "LANE",
        "NAGAR",
        "TALUK",
        "DISTRICT",
        "DIST.",
        "VILLAGE",
        "VILL.",
        "POST",
        "P.O.",
        "CITY",
        "STATE",
        "PIN",
        "MAHARASHTRA",
        "KARNATAKA",
        "TAMIL NADU",
        "DELHI",
        "GUJARAT",
        "KERALA",
        "INDIA",
        "MUMBAI",
        "CHENNAI",
        "BANGALORE",
        "HYDERABAD",
        "KOLKATA",
        "PUNE",
    ]

    return any(
        word in upper
        for word in address_words
    )


def is_stop_declaration(text):

    upper = normalized_upper(text)

    stop_words = [
        "CONSUMER CARE",
        "CUSTOMER CARE",
        "PHONE",
        "EMAIL",
        "INGREDIENTS",
        "NUTRITION",
        "NUTRITIONAL INFORMATION",
        "STORAGE CONDITIONS",
        "BEST BEFORE",
        "USE BY",
        "ALLERGEN",
        "WARNING",
        "CAUTION",
    ]

    return any(
        word in upper
        for word in stop_words
    )


def extract_manufacturer(ocr_items):

    matches = find_items_with_keywords(
        ocr_items,
        MANUFACTURER_KEYWORDS
    )

    if not matches:
        return None

    label = matches[0]

    manufacturer_items = []

    label_index = label.get("_index", -1)
    label_image = label.get("imageIndex")

    # Search following OCR lines.
    for item in ocr_items:

        if item.get("_index", -1) <= label_index:
            continue

        if item.get("imageIndex") != label_image:
            break

        text = clean_text(
            item.get("text", "")
        )

        if not text:
            continue

        if is_stop_declaration(text):
            break

        # Avoid treating another declaration as manufacturer.
        if contains_keyword(
            text,
            [
                "MRP",
                "NET QUANTITY",
                "EXP",
                "MFG",
                "BATCH",
                "INGREDIENTS",
            ]
        ):
            break

        manufacturer_items.append(
            make_field(
                text,
                item
            )
        )

        # Addresses normally occupy several lines.
        if len(manufacturer_items) >= 7:
            break

    return (
        manufacturer_items
        if manufacturer_items
        else None
    )


# ============================================================
# PACKER
# ============================================================

def extract_packer(ocr_items):

    keywords = [
        "PACKED BY",
        "PACKER",
        "PACKED FOR",
        "MANUFACTURED & PACKED",
        "MANUFACTURED AND PACKED",
    ]

    matches = find_items_with_keywords(
        ocr_items,
        keywords
    )

    if not matches:
        return None

    label = matches[0]

    label_index = label.get("_index", -1)
    image_index = label.get("imageIndex")

    values = []

    for item in ocr_items:

        if item.get("_index", -1) <= label_index:
            continue

        if item.get("imageIndex") != image_index:
            break

        text = clean_text(
            item.get("text", "")
        )

        if not text:
            continue

        if is_stop_declaration(text):
            break

        values.append(
            make_field(
                text,
                item
            )
        )

        if len(values) >= 6:
            break

    return values if values else None


# ============================================================
# IMPORTER
# ============================================================

def extract_importer(ocr_items):

    keywords = [
        "IMPORTED BY",
        "IMPORTER",
        "IMPORTED AND MARKETED BY",
        "IMPORTED & MARKETED BY",
    ]

    matches = find_items_with_keywords(
        ocr_items,
        keywords
    )

    if not matches:
        return None

    label = matches[0]

    label_index = label.get("_index", -1)
    image_index = label.get("imageIndex")

    values = []

    for item in ocr_items:

        if item.get("_index", -1) <= label_index:
            continue

        if item.get("imageIndex") != image_index:
            break

        text = clean_text(
            item.get("text", "")
        )

        if not text:
            continue

        if is_stop_declaration(text):
            break

        values.append(
            make_field(
                text,
                item
            )
        )

        if len(values) >= 5:
            break

    return values if values else None


# ============================================================
# COUNTRY OF ORIGIN
# ============================================================

def extract_country_of_origin(ocr_items):

    keywords = [
        "COUNTRY OF ORIGIN",
        "MADE IN",
        "PRODUCT OF",
        "COUNTRY ORIGIN",
    ]

    matches = find_items_with_keywords(
        ocr_items,
        keywords
    )

    if not matches:
        return None

    item = matches[0]

    text = clean_text(
        item.get("text", "")
    )

    # "MADE IN INDIA"
    match = re.search(
        r"(?:MADE IN|PRODUCT OF|COUNTRY OF ORIGIN)\s*:?\s*(.+)",
        text,
        re.IGNORECASE
    )

    if match:

        value = match.group(1).strip()

        if value:
            return make_field(
                value,
                item
            )

    # Otherwise check next OCR item.
    following = find_following_items(
        ocr_items,
        keywords,
        max_items=2
    )

    for next_item in following:

        text = clean_text(
            next_item.get("text", "")
        )

        if text:
            return make_field(
                text,
                next_item
            )

    return None


# ============================================================
# DATE HELPERS
# ============================================================

DATE_PATTERNS = [

    # 10/05/2026
    r"\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b",

    # 10-05-26
    r"\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2}\b",

    # 05/2026
    r"\b\d{1,2}[\/\-]\d{4}\b",

    # MAY-2026
    r"\b(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)"
    r"[A-Z]*[\s\-\/\.]+\d{4}\b",

    # MAY 2026
    r"\b(?:JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|"
    r"AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)"
    r"\s+\d{4}\b",

    # 2026-05
    r"\b\d{4}[\-\/]\d{1,2}\b",
]


def find_date(text):

    for pattern in DATE_PATTERNS:

        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if match:
            return match.group(0)

    return None


# ============================================================
# MANUFACTURING DATE
# ============================================================

def extract_manufacturing_date(ocr_items):

    date_keywords = [
        "MFD",
        "MFG",
        "MFG.",
        "MANUFACTURED",
        "MANUFACTURING DATE",
        "DATE OF MANUFACTURE",
        "DATE OF MFG",
        "PKD",
        "PACKED ON",
        "PACKING DATE",
        "DATE OF PACKING",
    ]

    # --------------------------------------------------------
    # First: date close to an MFG/MFD/PKD declaration
    # --------------------------------------------------------

    for i, item in enumerate(ocr_items):

        text = normalized_upper(
            item.get("text", "")
        )

        if not any(
            keyword in text
            for keyword in date_keywords
        ):
            continue

        image_index = item.get("imageIndex")

        # Date can be on same line or following lines.
        for nearby in ocr_items[i:i + 10]:

            if nearby.get("imageIndex") != image_index:
                break

            date = find_date(
                nearby.get("text", "")
            )

            if date:

                return make_field(
                    date,
                    nearby
                )

    # --------------------------------------------------------
    # Second: standalone date
    # --------------------------------------------------------

    for item in ocr_items:

        date = find_date(
            item.get("text", "")
        )

        if date:

            return make_field(
                date,
                item
            )

    return None


# ============================================================
# EXPIRY DATE
# ============================================================

def extract_expiry_date(ocr_items):

    keywords = [
        "EXP",
        "EXP.",
        "EXPIRY",
        "EXPIRATION",
        "EXPIRY DATE",
        "USE BEFORE",
        "VALID UNTIL",
    ]

    for i, item in enumerate(ocr_items):

        text = normalized_upper(
            item.get("text", "")
        )

        if not any(
            keyword in text
            for keyword in keywords
        ):
            continue

        image_index = item.get("imageIndex")

        for nearby in ocr_items[i:i + 10]:

            if nearby.get("imageIndex") != image_index:
                break

            date = find_date(
                nearby.get("text", "")
            )

            if date:

                return make_field(
                    date,
                    nearby
                )

    return None


# ============================================================
# BEST BEFORE
# ============================================================

def extract_best_before(ocr_items):

    for i, item in enumerate(ocr_items):

        text = normalized_upper(
            item.get("text", "")
        )

        if not re.search(
            r"BEST\s*BEFORE",
            text
        ):
            continue

        image_index = item.get("imageIndex")

        for nearby in ocr_items[i:i + 8]:

            if nearby.get("imageIndex") != image_index:
                break

            nearby_text = clean_text(
                nearby.get("text", "")
            )

            # "12 MONTHS"
            match = re.search(
                r"\b(\d+)\s*"
                r"(DAYS?|MONTHS?|YEARS?)\b",
                nearby_text,
                re.IGNORECASE
            )

            if match:

                return make_field(
                    match.group(0),
                    nearby
                )

            # Date
            date = find_date(
                nearby_text
            )

            if date:

                return make_field(
                    date,
                    nearby
                )

    return None


# ============================================================
# USE BY
# ============================================================

def extract_use_by(ocr_items):

    for i, item in enumerate(ocr_items):

        text = normalized_upper(
            item.get("text", "")
        )

        if not re.search(
            r"USE\s*BY|USE\s*BEFORE",
            text
        ):
            continue

        image_index = item.get("imageIndex")

        for nearby in ocr_items[i:i + 8]:

            if nearby.get("imageIndex") != image_index:
                break

            date = find_date(
                nearby.get("text", "")
            )

            if date:

                return make_field(
                    date,
                    nearby
                )

    return None


# ============================================================
# BATCH / LOT NUMBER
# ============================================================

BATCH_PATTERNS = [
    r"(?:BATCH|BATCH\s*NO\.?|BATCH\s*NUMBER)"
    r"\s*[:.\-]?\s*([A-Z0-9][A-Z0-9\-\/]{2,30})",

    r"(?:LOT|LOT\s*NO\.?|LOT\s*NUMBER)"
    r"\s*[:.\-]?\s*([A-Z0-9][A-Z0-9\-\/]{2,30})",

    r"(?:LOT\s*CODE|BATCH\s*CODE)"
    r"\s*[:.\-]?\s*([A-Z0-9][A-Z0-9\-\/]{2,30})",
]


def extract_batch_number(ocr_items):

    for item in ocr_items:

        text = normalized_upper(
            item.get("text", "")
        )

        for pattern in BATCH_PATTERNS:

            match = re.search(
                pattern,
                text,
                re.IGNORECASE
            )

            if match:

                value = match.group(1).strip()

                # Avoid returning obvious junk.
                if len(value) >= 3:
                    return make_field(
                        value,
                        item
                    )

    # If "Batch No." is detected separately,
    # inspect nearby OCR lines.
    for i, item in enumerate(ocr_items):

        text = normalized_upper(
            item.get("text", "")
        )

        if not re.search(
            r"\bBATCH\b|\bLOT\b",
            text
        ):
            continue

        image_index = item.get("imageIndex")

        for nearby in ocr_items[i + 1:i + 5]:

            if nearby.get("imageIndex") != image_index:
                break

            candidate = clean_text(
                nearby.get("text", "")
            )

            if re.fullmatch(
                r"[A-Z0-9][A-Z0-9\-\/]{2,30}",
                candidate,
                re.IGNORECASE
            ):

                return make_field(
                    candidate,
                    nearby
                )

    return None


# ============================================================
# FSSAI LICENSE
# ============================================================

def extract_fssai_license(ocr_items):

    for item in ocr_items:

        text = normalized_upper(
            item.get("text", "")
        )

        # Standard FSSAI license numbers are commonly 14 digits.
        matches = re.findall(
            r"\b\d{14}\b",
            text
        )

        for value in matches:

            return make_field(
                value,
                item
            )

    return None


# ============================================================
# CONSUMER CARE
# ============================================================

def extract_consumer_care(ocr_items):

    phone = None
    email = None
    website = None

    for item in ocr_items:

        text = clean_text(
            item.get("text", "")
        )

        # ----------------------------------------------------
        # Phone
        # ----------------------------------------------------

        phone_patterns = [
            r"(?:PHONE|TEL|CONTACT|CUSTOMER CARE)"
            r"\s*(?:NO\.?|NUMBER)?\s*[:\-]?\s*"
            r"(\+?\d[\d\s\-]{7,15}\d)",

            r"\b[6-9]\d{9}\b",
        ]

        for pattern in phone_patterns:

            match = re.search(
                pattern,
                text,
                re.IGNORECASE
            )

            if match:

                phone = make_field(
                    match.group(1)
                    if match.lastindex
                    else match.group(0),
                    item
                )

                break

        # ----------------------------------------------------
        # Email
        # ----------------------------------------------------

        email_match = re.search(
            r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}",
            text
        )

        if email_match:

            email = make_field(
                email_match.group(0),
                item
            )

        # ----------------------------------------------------
        # Website
        # ----------------------------------------------------

        website_match = re.search(
            r"(?:https?://)?"
            r"(?:www\.)?"
            r"[A-Za-z0-9.-]+\."
            r"(?:com|in|org|net|co\.in)"
            r"(?:/[^\s]*)?",
            text,
            re.IGNORECASE
        )

        if website_match:

            website = make_field(
                website_match.group(0),
                item
            )

    if phone or email or website:

        return {
            "phone": phone,
            "email": email,
            "website": website
        }

    return None


# ============================================================
# INGREDIENTS
# ============================================================

def extract_ingredients(ocr_items):

    keywords = [
        "INGREDIENTS",
        "INGREDIENT",
        "COMPOSITION",
        "CONTENTS",
    ]

    for i, item in enumerate(ocr_items):

        text = clean_text(
            item.get("text", "")
        )

        if not contains_keyword(
            text,
            keywords
        ):
            continue

        values = []

        image_index = item.get("imageIndex")

        # If the ingredients are on the same line.
        match = re.search(
            r"(?:INGREDIENTS?|COMPOSITION|CONTENTS)"
            r"\s*[:\-]\s*(.+)",
            text,
            re.IGNORECASE
        )

        if match:

            return make_field(
                match.group(1).strip(),
                item
            )

        # Otherwise collect following lines.
        for nearby in ocr_items[i + 1:i + 10]:

            if nearby.get("imageIndex") != image_index:
                break

            nearby_text = clean_text(
                nearby.get("text", "")
            )

            if not nearby_text:
                continue

            if is_stop_declaration(
                nearby_text
            ):
                break

            values.append(
                nearby_text
            )

        if values:

            combined = " ".join(values)

            return {
                "value": combined,
                "confidence": min(
                    float(
                        x.get("confidence", 0)
                    )
                    for x in ocr_items[i + 1:i + 1 + len(values)]
                ),
                "bbox": item.get("bbox")
            }

    return None


# ============================================================
# STORAGE CONDITIONS
# ============================================================

def extract_storage_conditions(ocr_items):

    keywords = [
        "STORE",
        "STORAGE",
        "STORE IN",
        "KEEP IN",
        "REFRIGERATE",
        "REFRIGERATION",
    ]

    for i, item in enumerate(ocr_items):

        text = clean_text(
            item.get("text", "")
        )

        if not contains_keyword(
            text,
            keywords
        ):
            continue

        image_index = item.get("imageIndex")

        values = [text]

        for nearby in ocr_items[i + 1:i + 5]:

            if nearby.get("imageIndex") != image_index:
                break

            nearby_text = clean_text(
                nearby.get("text", "")
            )

            if nearby_text:
                values.append(
                    nearby_text
                )

        combined = " ".join(values)

        return make_field(
            combined,
            item
        )

    return None


# ============================================================
# MAIN EXTRACTION
# ============================================================

def extract_structured_data(ocr_items):

    prepared_items = prepare_ocr_items(
        ocr_items
    )

    return {

        # Existing fields
        "productName":
            extract_product_name(
                prepared_items
            ),

        "manufacturer":
            extract_manufacturer(
                prepared_items
            ),

        "packer":
            extract_packer(
                prepared_items
            ),

        "importer":
            extract_importer(
                prepared_items
            ),

        "countryOfOrigin":
            extract_country_of_origin(
                prepared_items
            ),

        "netQuantity":
            extract_net_quantity(
                prepared_items
            ),

        "mrp":
            extract_mrp(
                prepared_items
            ),

        "manufacturingDate":
            extract_manufacturing_date(
                prepared_items
            ),

        "bestBefore":
            extract_best_before(
                prepared_items
            ),

        "useBy":
            extract_use_by(
                prepared_items
            ),

        "consumerCare":
            extract_consumer_care(
                prepared_items
            ),

        # Additional useful fields
        "expiryDate":
            extract_expiry_date(
                prepared_items
            ),

        "batchNumber":
            extract_batch_number(
                prepared_items
            ),

        "fssaiLicense":
            extract_fssai_license(
                prepared_items
            ),

        "ingredients":
            extract_ingredients(
                prepared_items
            ),

        "storageConditions":
            extract_storage_conditions(
                prepared_items
            )
    }