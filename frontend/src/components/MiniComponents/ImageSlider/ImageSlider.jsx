import { useState } from "react";
import "./ImageSlider.scss";

const slideStyles = {
  width: "100%",
  height: "100%",
  borderRadius: "10px",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const sliderStyles = {
  position: "relative",
  height: "100%",
};

const dotsContainerStyles = {
  display: "flex",
  justifyContent: "center",
  marginTop: "-33px"
};

const dotStyle = {
  margin: "0 3px",
  cursor: "pointer",
  fontSize: "20px",
  color: "#a2a2a2",
};

const activeDotStyle = {
    ...dotStyle,
    color: "black",
  };

const ImageSlider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  const slideStylesWidthBackground = {
    ...slideStyles,
    backgroundImage: `url(${slides[currentIndex].url})`,
  };

  return (
    <div style={sliderStyles}>
      <div style={slideStylesWidthBackground}></div>
      <div style={dotsContainerStyles} className="dots">
        {slides.map((slide, slideIndex) => (
          <div
          style={slideIndex === currentIndex ? activeDotStyle : dotStyle}
            className="dot"
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
          >
            ●
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;