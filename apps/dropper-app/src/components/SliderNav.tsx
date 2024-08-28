type SliderNaveProps = {
  position: number;
  setPosition: (position: number) => void;
  pages: number;
};

const SliderNav = ({ position, setPosition, pages }: SliderNaveProps) => {
  return (
    <div className="flex flex-row items-center justify-center overflow-hidden w-full px-2 lg:px-0">
      {Array.from({ length: pages }, (_, i) => i)
        .reverse()
        .map((_, index) => (
          <div
            key={index}
            className={`w-5 lg:w-20 h-0.5 mx-1 rounded-full cursor-pointer ${
              position === index ? "bg-white" : "bg-secondary"
            }`}
            onClick={() => setPosition(index)}
          ></div>
        ))}
    </div>
  );
};

export default SliderNav;
