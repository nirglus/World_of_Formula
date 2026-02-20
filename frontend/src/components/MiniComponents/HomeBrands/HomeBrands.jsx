import { brandImages } from "../../../helpers/images";
import "./HomeBrands.scss";

function HomeBrands() {
  return (
    <div className="brands">
    <div className="brandsImgs">
      {brandImages.map((image, index) => (
        <img src={image} alt="brand" key={index} width={180}/>
      ))}
    </div>
</div>
  )
}

export default HomeBrands
