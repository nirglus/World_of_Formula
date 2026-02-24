import { useState, useCallback } from "react";
import "./ImageSlider.scss";

import placeholderImage from "../../../assets/no-image.png";

const ImageSlider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedUrls, setFailedUrls] = useState({});
  const [loadedIndex, setLoadedIndex] = useState(null);

  const getSlideUrl = (slide, index) => (failedUrls[index] ? placeholderImage : (slide?.url || placeholderImage));

  const handleError = useCallback((index) => {
    setFailedUrls((prev) => ({ ...prev, [index]: true }));
  }, []);

  const handleLoad = useCallback((index) => {
    setLoadedIndex(index);
  }, []);

  const goToSlide = (slideIndex) => setCurrentIndex(slideIndex);

  if (!slides || slides.length === 0) {
    return (
      <div className="imageSliderWrap">
        <img
          src={placeholderImage}
          alt="No image"
          className="slideImage slideImageLoaded"
          loading="lazy"
        />
      </div>
    );
  }

  const isSingleImage = slides.length === 1;
  const currentUrl = getSlideUrl(slides[currentIndex], currentIndex);

  if (isSingleImage) {
    return (
      <div className="imageSliderWrap">
        <img
          src={currentUrl}
          alt={slides[0].title || "Product"}
          className={`slideImage ${loadedIndex === 0 ? "slideImageLoaded" : ""}`}
          loading="lazy"
          onError={() => handleError(0)}
          onLoad={() => handleLoad(0)}
        />
      </div>
    );
  }

  return (
    <div className="imageSliderWrap">
      <div className="slideFrame">
        <img
          key={currentIndex}
          src={currentUrl}
          alt={slides[currentIndex]?.title || `Slide ${currentIndex + 1}`}
          className={`slideImage ${loadedIndex === currentIndex ? "slideImageLoaded" : ""}`}
          loading="lazy"
          onError={() => handleError(currentIndex)}
          onLoad={() => handleLoad(currentIndex)}
        />
      </div>
      <div className="dots">
        {slides.map((slide, slideIndex) => (
          <button
            type="button"
            className={`dot ${slideIndex === currentIndex ? "active" : ""}`}
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            aria-label={`Go to slide ${slideIndex + 1}`}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
