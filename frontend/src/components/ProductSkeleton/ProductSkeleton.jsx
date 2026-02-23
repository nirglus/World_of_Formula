import './ProductSkeleton.scss';

function ProductSkeleton() {
  return (
    <div className="productSkeleton">
      <div className="skeleton skeletonImage" />
      <div className="skeleton skeletonTitle" />
      <div className="skeleton skeletonLine" />
      <div className="skeleton skeletonPrice" />
      <div className="skeleton skeletonBtn" />
    </div>
  );
}

export default ProductSkeleton;
