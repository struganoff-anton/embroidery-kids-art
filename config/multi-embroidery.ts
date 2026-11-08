import { resolvePublicAssetPath } from "../lib/public-assets.ts";
import type { MultiGarmentView, MultiZoneId, ProductTypeId } from "../types/calculator.ts";

export interface MultiPlacementZone {
  id: MultiZoneId;
  label: string;
  view: MultiGarmentView;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface MultiPlacementProductConfig {
  images: Record<MultiGarmentView, string>;
  imageAspectRatios?: Partial<Record<MultiGarmentView, string>>;
  zones: readonly MultiPlacementZone[];
}

/** Percentage coordinates are intentionally isolated here for later visual tuning. */
export const multiPlacementConfigs: Partial<Record<ProductTypeId, MultiPlacementProductConfig>> = {
  hoodie: {
    images: {
      front: resolvePublicAssetPath("/images/multi/hoodie/front.png"),
      back: resolvePublicAssetPath("/images/multi/hoodie/back.png"),
    },
    zones: [
      { id: "front-body-1", label: "Спереди — грудь слева сверху", view: "front", left: 34.25, top: 26.37, width: 9.5, height: 9.26 },
      { id: "front-body-2", label: "Спереди — грудь справа сверху", view: "front", left: 56.25, top: 26.37, width: 9.5, height: 9.26 },
      { id: "front-body-3", label: "Спереди — грудь по центру", view: "front", left: 45.25, top: 37.37, width: 9.5, height: 9.26 },
      { id: "front-body-4", label: "Спереди — грудь слева снизу", view: "front", left: 34.25, top: 46.37, width: 9.5, height: 9.26 },
      { id: "front-body-5", label: "Спереди — грудь справа снизу", view: "front", left: 56.25, top: 46.37, width: 9.5, height: 9.26 },
      { id: "front-pocket-1", label: "Спереди — карман", view: "front", left: 45.5, top: 61.61, width: 9, height: 8.78 },
      { id: "front-left-sleeve-1", label: "Левый рукав — верх", view: "front", left: 11.63, top: 43.73, width: 8.75, height: 8.53 },
      { id: "front-left-sleeve-2", label: "Левый рукав — низ", view: "front", left: 9.63, top: 57.73, width: 8.75, height: 8.53 },
      { id: "front-right-sleeve-1", label: "Правый рукав — верх", view: "front", left: 79.63, top: 43.73, width: 8.75, height: 8.53 },
      { id: "front-right-sleeve-2", label: "Правый рукав — низ", view: "front", left: 81.63, top: 57.73, width: 8.75, height: 8.53 },
      { id: "back-body-1", label: "Сзади — слева сверху", view: "back", left: 36.25, top: 35.37, width: 9.5, height: 9.26 },
      { id: "back-body-2", label: "Сзади — справа сверху", view: "back", left: 54.25, top: 35.37, width: 9.5, height: 9.26 },
      { id: "back-body-3", label: "Сзади — по центру", view: "back", left: 45.25, top: 46.37, width: 9.5, height: 9.26 },
      { id: "back-body-4", label: "Сзади — слева снизу", view: "back", left: 36.25, top: 58.37, width: 9.5, height: 9.26 },
      { id: "back-body-5", label: "Сзади — справа снизу", view: "back", left: 54.25, top: 58.37, width: 9.5, height: 9.26 },
    ],
  },
  sweatshirt: {
    images: {
      front: resolvePublicAssetPath("/images/multi/sweatshirt/front.png"),
      back: resolvePublicAssetPath("/images/multi/sweatshirt/back.png"),
    },
    imageAspectRatios: {
      front: "1011 / 1555",
      back: "1012 / 1555",
    },
    zones: [
      { id: "front-body-1", label: "Спереди — грудь слева сверху", view: "front", left: 34.25, top: 26.99, width: 9.5, height: 8.03 },
      { id: "front-body-2", label: "Спереди — грудь справа сверху", view: "front", left: 56.25, top: 26.99, width: 9.5, height: 8.03 },
      { id: "front-body-3", label: "Спереди — грудь по центру", view: "front", left: 45.25, top: 38.99, width: 9.5, height: 8.03 },
      { id: "front-body-4", label: "Спереди — грудь слева снизу", view: "front", left: 34.25, top: 50.99, width: 9.5, height: 8.03 },
      { id: "front-body-5", label: "Спереди — грудь справа снизу", view: "front", left: 56.25, top: 50.99, width: 9.5, height: 8.03 },
      { id: "front-left-sleeve-1", label: "Левый рукав — верх", view: "front", left: 8.63, top: 44.31, width: 8.75, height: 7.39 },
      { id: "front-left-sleeve-2", label: "Левый рукав — низ", view: "front", left: 6.63, top: 58.31, width: 8.75, height: 7.39 },
      { id: "front-right-sleeve-1", label: "Правый рукав — верх", view: "front", left: 82.63, top: 44.31, width: 8.75, height: 7.39 },
      { id: "front-right-sleeve-2", label: "Правый рукав — низ", view: "front", left: 84.63, top: 58.31, width: 8.75, height: 7.39 },
      { id: "back-body-1", label: "Сзади — слева сверху", view: "back", left: 34.25, top: 27.99, width: 9.5, height: 8.03 },
      { id: "back-body-2", label: "Сзади — справа сверху", view: "back", left: 56.25, top: 27.99, width: 9.5, height: 8.03 },
      { id: "back-body-3", label: "Сзади — по центру", view: "back", left: 45.25, top: 39.99, width: 9.5, height: 8.03 },
      { id: "back-body-4", label: "Сзади — слева снизу", view: "back", left: 34.25, top: 51.99, width: 9.5, height: 8.03 },
      { id: "back-body-5", label: "Сзади — справа снизу", view: "back", left: 56.25, top: 51.99, width: 9.5, height: 8.03 },
    ],
  },
  "zip-hoodie": {
    images: {
      front: resolvePublicAssetPath("/images/multi/zip-hoodie/front.png"),
      back: resolvePublicAssetPath("/images/multi/zip-hoodie/back.png"),
    },
    imageAspectRatios: {
      front: "1023 / 1537",
      back: "1086 / 1448",
    },
    zones: [
      { id: "front-left-body-1", label: "Спереди слева от молнии — верх", view: "front", left: 34.25, top: 27.89, width: 9.5, height: 8.22 },
      { id: "front-left-body-2", label: "Спереди слева от молнии — центр", view: "front", left: 34.25, top: 39.89, width: 9.5, height: 8.22 },
      { id: "front-left-body-3", label: "Спереди слева от молнии — низ", view: "front", left: 34.25, top: 61.89, width: 9.5, height: 8.22 },
      { id: "front-right-body-1", label: "Спереди справа от молнии — верх", view: "front", left: 56.25, top: 27.89, width: 9.5, height: 8.22 },
      { id: "front-right-body-2", label: "Спереди справа от молнии — центр", view: "front", left: 56.25, top: 39.89, width: 9.5, height: 8.22 },
      { id: "front-right-body-3", label: "Спереди справа от молнии — низ", view: "front", left: 56.25, top: 61.89, width: 9.5, height: 8.22 },
      { id: "front-left-sleeve-1", label: "Левый рукав — верх", view: "front", left: 11.63, top: 44.22, width: 8.75, height: 7.57 },
      { id: "front-left-sleeve-2", label: "Левый рукав — низ", view: "front", left: 9.63, top: 58.22, width: 8.75, height: 7.57 },
      { id: "front-right-sleeve-1", label: "Правый рукав — верх", view: "front", left: 79.63, top: 44.22, width: 8.75, height: 7.57 },
      { id: "front-right-sleeve-2", label: "Правый рукав — низ", view: "front", left: 81.63, top: 58.22, width: 8.75, height: 7.57 },
      { id: "back-body-1", label: "Сзади — слева сверху", view: "back", left: 35.25, top: 34.37, width: 9.5, height: 9.26 },
      { id: "back-body-2", label: "Сзади — справа сверху", view: "back", left: 55.25, top: 34.37, width: 9.5, height: 9.26 },
      { id: "back-body-3", label: "Сзади — по центру", view: "back", left: 45.25, top: 45.37, width: 9.5, height: 9.26 },
      { id: "back-body-4", label: "Сзади — слева снизу", view: "back", left: 35.25, top: 56.37, width: 9.5, height: 9.26 },
      { id: "back-body-5", label: "Сзади — справа снизу", view: "back", left: 55.25, top: 56.37, width: 9.5, height: 9.26 },
    ],
  },
};
