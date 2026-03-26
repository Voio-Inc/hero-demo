export type BBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Finding = {
  sliceRange: [number, number];
  label: string;
  detail: string;
  confidence: string;
  series: string;
  bboxes: BBox[];
};

export const study = {
  modalityLabel: "Chest CT",
  studyDescription: "CT Chest w IV Contrast",
  seriesLabel: "25mm Contrast Lung",
  imageBasePath: "/images",
  sliceCount: 134,
};

export const findings: Finding[] = [
  {
    sliceRange: [19, 49],
    label: "Mediastinal lymphadenopathy",
    detail: "Right paraesophageal, right paratracheal, and right hilar adenopathy is present.",
    confidence: "Ground truth",
    series: "03 / 25mm Contrast Standard",
    bboxes: [{ x: 0.3932, y: 0.432, w: 0.0922, h: 0.1294 }],
  },
  {
    sliceRange: [19, 22],
    label: "Enlarged superior mediastinal node",
    detail: "A superior mediastinal lymph node measures about 11 mm, previously about 9 mm.",
    confidence: "Ground truth",
    series: "03 / 25mm Contrast Standard",
    bboxes: [{ x: 0.4256, y: 0.4547, w: 0.068, h: 0.0518 }],
  },
  {
    sliceRange: [115, 123],
    label: "Splenic cyst",
    detail: "A 16 mm splenic cyst is visible in the upper abdomen.",
    confidence: "Ground truth",
    series: "03 / 25mm Contrast Standard",
    bboxes: [{ x: 0.7298, y: 0.5453, w: 0.1068, h: 0.0809 }],
  },
  {
    sliceRange: [34, 62],
    label: "Right pleural thickening",
    detail: "Posterior pleural thickening is present in the right hemithorax.",
    confidence: "Ground truth",
    series: "02 / 25mm Contrast Lung",
    bboxes: [{ x: 0.2152, y: 0.6489, w: 0.267, h: 0.1699 }],
  },
  {
    sliceRange: [41, 43],
    label: "Aortic arch calcification",
    detail: "Mild calcification is present at the aortic arch.",
    confidence: "Ground truth",
    series: "03 / 25mm Contrast Standard",
    bboxes: [{ x: 0.4935, y: 0.4175, w: 0.0858, h: 0.0793 }],
  },
  {
    sliceRange: [38, 45],
    label: "Thoracic compression deformities",
    detail: "Moderate T9 and mild T3 vertebral body compression deformities are present.",
    confidence: "Ground truth",
    series: "07 / CT Chest Sag 5 Avg",
    bboxes: [{ x: 0.6003, y: 0.5, w: 0.2055, h: 0.1084 }],
  },
  {
    sliceRange: [75, 86],
    label: "Endobronchial mucous plugging",
    detail: "Mucous plugging is visible in the right lower lobe airways.",
    confidence: "Ground truth",
    series: "02 / 25mm Contrast Lung",
    bboxes: [{ x: 0.2177, y: 0.6347, w: 0.1121, h: 0.0927 }],
  },
  {
    sliceRange: [79, 105],
    label: "Left lower lobe ground-glass opacity",
    detail: "Scattered ground-glass opacities are present in the left lower lobe.",
    confidence: "Ground truth",
    series: "02 / 25mm Contrast Lung",
    bboxes: [{ x: 0.5777, y: 0.3414, w: 0.2265, h: 0.3673 }],
  },
  {
    sliceRange: [26, 100],
    label: "Right lung scarring with volume loss",
    detail: "Extensive right lung scarring causes rightward mediastinal retraction and elevation of the right hemidiaphragm.",
    confidence: "Ground truth",
    series: "02 / 25mm Contrast Lung",
    bboxes: [{ x: 0.3447, y: 0.4935, w: 0.1359, h: 0.2508 }],
  },
  {
    sliceRange: [106, 125],
    label: "Right adrenal mass",
    detail: "A 3.2 cm right adrenal mass is present and is suggestive of adrenal metastasis.",
    confidence: "Ground truth",
    series: "03 / 25mm Contrast Standard",
    bboxes: [{ x: 0.3172, y: 0.5049, w: 0.1359, h: 0.1424 }],
  },
  {
    sliceRange: [31, 46],
    label: "Rightward mediastinal shift",
    detail: "There is a slight shift of the superior mediastinum to the right.",
    confidence: "Ground truth",
    series: "02 / 25mm Contrast Lung",
    bboxes: [{ x: 0.3786, y: 0.3916, w: 0.1392, h: 0.2152 }],
  },
  {
    sliceRange: [28, 43],
    label: "Right upper lobe mass",
    detail: "A roughly 3 cm medial right upper lobe mass is adherent to the right side of the mediastinum.",
    confidence: "Ground truth",
    series: "02 / 25mm Contrast Lung",
    bboxes: [{ x: 0.3754, y: 0.534, w: 0.1019, h: 0.0922 }],
  },
];
