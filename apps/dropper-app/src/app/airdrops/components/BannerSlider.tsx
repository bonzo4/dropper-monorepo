"use client";
import Banner from "./Banner";
import { useBanners } from "@/lib/hooks/useBanners";
import { createSupabaseClient } from "@/lib/supabase/client";
import { BannerRow } from "@/lib/types/banner";
import { motion, useAnimate } from "framer-motion";
import { useState } from "react";
import { useWindowSize } from "usehooks-ts";

type BannerSliderProps = {
  banners: BannerRow[];
} & React.HTMLAttributes<HTMLDivElement>;

const BannerSlider = ({ banners }: BannerSliderProps) => {
  const { width } = useWindowSize();
  // const { banners, loading } = useBanners({ supabase });
  const [position, setPosition] = useState(
    banners.length % 2 === 1 ? (banners.length - 1) / 2 : banners.length / 2
  );

  const handlePrev = () => {
    setPosition(position + 1);
  };

  const handleNext = () => {
    setPosition(position - 1);
  };

  return (
    <div className="flex flex-row items-center justify-center overflow-hidden w-full">
      {banners.length > 0 && (
        <motion.div
          initial={{
            x:
              banners.length % 2 === 1
                ? width * position
                : width * position - width / 2,
            opacity: 0,
          }}
          animate={{
            x:
              banners.length % 2 === 1
                ? width * position
                : width * position - width / 2,
            opacity: 1,
          }}
          transition={{ stiffness: 300, damping: 30 }}
          className="flex flex-row items-center justify-center w-full"
        >
          {banners.map((banner, index) => (
            <Banner
              key={banner.id}
              banner={banner}
              handleNext={index !== banners.length - 1 ? handleNext : undefined}
              handlePrev={index !== 0 ? handlePrev : undefined}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default BannerSlider;
