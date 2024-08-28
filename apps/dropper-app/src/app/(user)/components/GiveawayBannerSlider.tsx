"use client";

import { GiveawayBannerRow } from "@/lib/types/banner";
import { motion, useDragControls, PanInfo } from "framer-motion";
import { useState, useEffect } from "react";
import { useWindowSize } from "usehooks-ts";
import GiveawayBannerSliderRow from "./GiveawayBannerRowOptions";
import SliderNav from "@/components/SliderNav";

type BannerSliderProps = {
  banners: GiveawayBannerRow[];
} & React.HTMLAttributes<HTMLDivElement>;

const GiveawayBannerSlider = ({ banners }: BannerSliderProps) => {
  const { width } = useWindowSize();
  const [bannerRows, setBannerRows] = useState<GiveawayBannerRow[][]>([]);
  const [position, setPosition] = useState(0);
  const controls = useDragControls();
  const [maxDrag, setMaxDrag] = useState(0);

  useEffect(() => {
    const rows: GiveawayBannerRow[][] = [];
    let row: GiveawayBannerRow[] = [];

    banners.forEach((banner, index) => {
      row.push(banner);

      if (
        (width < 768 && index % 1 === 0) ||
        (width >= 768 && width < 1025 && index % 2 === 1) ||
        (width >= 1025 && width < 1336 && index % 3 === 2) ||
        (width >= 1336 && index % 4 === 3)
      ) {
        rows.push(row);
        row = [];
      }
    });

    if (row.length > 0) {
      rows.push(row); // Add the last row if it has elements
    }

    setBannerRows(rows);
    setPosition(0); // Reset position when rows change
    setMaxDrag(-(width * (rows.length - 1))); // Set the maximum drag distance
  }, [banners, width]);

  useEffect(() => {
    if (width <= 1025) return;

    const interval = setInterval(() => {
      setPosition((prevPosition) =>
        prevPosition === bannerRows.length - 1 ? 0 : prevPosition + 1
      );
    }, 1000 * 5); // Slide every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [bannerRows.length, width]);

  const startDrag = (e: any) => {
    if (width > 1025) return; // Disable drag on desktop
    controls.start(e);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const offsetX = info.offset.x; // Get the total distance dragged
    const newPosition = Math.round((position * width - offsetX) / width); // Calculate the new position
    setPosition(Math.min(Math.max(newPosition, 0), bannerRows.length - 1)); // Ensure it's within bounds
  };

  return (
    <div className="flex flex-col items-center w-full gap-8">
      <div
        className="flex flex-row items-center justify-center overflow-hidden w-full"
        onPointerDown={startDrag}
        style={{ touchAction: "none" }}
      >
        <motion.div
          drag={width < 1025 ? "x" : undefined}
          draggable={width < 1025}
          dragControls={width < 1025 ? controls : undefined}
          dragConstraints={{ left: maxDrag, right: 0 }} // Limit drag to banner edges
          onDragEnd={handleDragEnd} // Handle drag end
          initial={{
            x: -width * position,
            opacity: 0,
          }}
          animate={{
            x: -width * position,
            opacity: 1,
          }}
          transition={{ stiffness: 300, damping: 30 }}
          className="flex flex-row items-center w-full"
        >
          {bannerRows.map((banners, index) => (
            <GiveawayBannerSliderRow
              banners={banners}
              key={index}
              width={width}
            />
          ))}
        </motion.div>
      </div>
      <SliderNav
        position={position}
        setPosition={setPosition}
        pages={bannerRows.length}
      />
    </div>
  );
};

export default GiveawayBannerSlider;
