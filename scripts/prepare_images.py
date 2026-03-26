from __future__ import annotations

from pathlib import Path

import numpy as np
import pydicom
from PIL import Image


WINDOW_WIDTH = 1500
WINDOW_LEVEL = -600
DATA_ROOT = Path("data")
OUTPUT_ROOT = Path("public/images")


def window_image(pixels: np.ndarray, window_width: float, window_level: float) -> np.ndarray:
    lower = window_level - (window_width / 2)
    upper = window_level + (window_width / 2)
    clipped = np.clip(pixels, lower, upper)
    scaled = (clipped - lower) / (upper - lower)
    return (scaled * 255).astype(np.uint8)


def load_pixels(dataset: pydicom.Dataset) -> np.ndarray:
    pixels = dataset.pixel_array.astype(np.float32)
    slope = float(getattr(dataset, "RescaleSlope", 1.0))
    intercept = float(getattr(dataset, "RescaleIntercept", 0.0))
    return (pixels * slope) + intercept


def collect_dicoms(root: Path) -> list[tuple[int, Path]]:
    dicom_paths: list[tuple[int, Path]] = []
    for path in root.rglob("*.dcm"):
        dataset = pydicom.dcmread(path, stop_before_pixels=True)
        instance_number = int(getattr(dataset, "InstanceNumber", 0))
        dicom_paths.append((instance_number, path))
    return sorted(dicom_paths, key=lambda item: (item[0], item[1].name))


def main() -> None:
    dicom_files = collect_dicoms(DATA_ROOT)
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)

    for index, (_, path) in enumerate(dicom_files):
        dataset = pydicom.dcmread(path)
        normalized = window_image(load_pixels(dataset), WINDOW_WIDTH, WINDOW_LEVEL)
        image = Image.fromarray(normalized)
        image.save(OUTPUT_ROOT / f"slice_{index:03d}.webp", format="WEBP", lossless=True)

    print(len(dicom_files))


if __name__ == "__main__":
    main()
