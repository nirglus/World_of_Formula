import './TrustBar.scss';

const TRUST_ITEMS = [
  { id: 'secure', label: 'Secure checkout', icon: 'bi-shield-check' },
  { id: 'shipping', label: 'Fast shipping', icon: 'bi-truck' },
  { id: 'returns', label: '30-day returns', icon: 'bi-arrow-return-left' },
  { id: 'quality', label: 'Collector quality', icon: 'bi-award' },
];

function TrustBar() {
  return (
    <div className="trustBar" role="region" aria-label="Trust signals">
      {TRUST_ITEMS.map((item, i) => (
        <span key={item.id} className="trustItem">
          <i className={`bi ${item.icon}`} aria-hidden />
          <span className="trustLabel">{item.label}</span>
          {i < TRUST_ITEMS.length - 1 && <span className="trustDot" aria-hidden />}
        </span>
      ))}
    </div>
  );
}

export default TrustBar;
