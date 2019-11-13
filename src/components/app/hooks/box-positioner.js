import { useContext, useMemo, useEffect } from "react";
import { Settings } from "../contexts";

// if a targetted article body has less than X blocks, don't use the "middle" position
export const MIN_BLOCKS_FOR_MIDDLE_POS_AND_BLUR = 4;

// creates wrapper elements for the boxes according to intrusiveness settings and inserts them at the predefined positions into targetted article bodies
export default function useBoxPositioner(intrusivenessProps, updateTrigger) {
  const settings = useContext(Settings);
  const targetElements = useSelector(settings.targetSelector, updateTrigger);
  const boxes = useBoxWrappers(targetElements, intrusivenessProps, settings);
  return boxes;
}

function useSelector(targetSelector, updateTrigger) {
  return useMemo(() => {
    return Array.from(document.querySelectorAll(targetSelector));
  }, [targetSelector, updateTrigger]);
}

function useBoxWrappers(targetElements, intrusivenessProps, settings) {
  const boxesWithWrappers = useMemo(() => {
    const { boxesEnabled, wrapperClass } = settings;
    const { boxSettings, itemSelectorSettings } = intrusivenessProps;
    if (!boxesEnabled) return [];
    return targetElements.reduce((acc, targetElement) => {
      const boxesWithinTargetEl = (boxSettings || [])
        .map(b => {
          const wrapperEl = newWrapper(wrapperClass);
          const boxProps = {
            ...itemSelectorSettings,
            ...b,
            parentEl: targetElement,
            wrapperEl
          };
          const posNum = insertBoxWrapper(boxProps, wrapperClass);
          if (!posNum) return null;
          return { ...boxProps, posNum };
        })
        .filter(b => b)
        .map((b, i) => {
          return { ...b, isFirst: i === 0 };
        });
      return [...acc, ...boxesWithinTargetEl];
    }, []);
  }, [targetElements, intrusivenessProps, settings]);
  useEffect(() => {
    return () => boxesWithWrappers.forEach(b => b.wrapperEl.remove());
  }, [targetElements, intrusivenessProps, settings]);
  return boxesWithWrappers;
}

function newWrapper(wrapperClass) {
  let result = document.createElement("div");
  result.classList.add(wrapperClass);
  return result;
}

function insertBoxWrapper(box, wrapperClass) {
  const siblings = getFilteredChildArray(box.parentEl, wrapperClass);
  const posNum = positionNumber(box.position, siblings.length);
  if (isNaN(posNum) || posNum > siblings.length) return;
  // if refrenceNode === null the element will be attached to the end
  const referenceNode = siblings[posNum];
  box.parentEl.insertBefore(box.wrapperEl, referenceNode);
  return posNum;
}

function positionNumber(positionString, siblingsCount) {
  switch (positionString) {
    case "bottom":
      return siblingsCount;
    case "top":
      return 0;
    case "middle":
      return siblingsCount >= MIN_BLOCKS_FOR_MIDDLE_POS_AND_BLUR
        ? Math.round(siblingsCount / 2)
        : siblingsCount + 1; // => won't be rendered
    default:
      return parseInt(positionString);
  }
}

export function getFilteredChildArray(parentEl, filterClass) {
  return Array.from(parentEl.children).filter(el =>
    filterClass ? !el.classList.contains(filterClass) : el
  );
}