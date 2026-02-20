import "./BenefitsSection.scss";
import React from 'react'


function BenefitsSection() {
    return (
      <section className="benefitsSection">
        <h2 className="sectionTitle">Benefits of Shopping with Us</h2>
        <div className="benefitsContainer">
          <div className="benefitItem">
            <h3><i className="bi bi-shield-check"></i> Authentic Diecast Models</h3>
            <p>Own officially licensed diecast replicas that capture the essence of Formula 1 racing, featuring precise details and authentic designs.</p>
          </div>
          <div className="benefitItem">
            <h3><i className="bi bi-check-all"></i>  Wide Selection</h3>
            <p>Explore a vast collection of diecast replicas, spanning from classic legends to modern marvels.</p>
          </div>
          <div className="benefitItem">
            <h3><i className="bi bi-check-all"></i> Exclusive Memorabilia</h3>
            <p>Discover exclusive Formula 1 memorabilia that celebrates the rich history and innovation of the sport.</p>
          </div>
          <div className="benefitItem">
            <h3><i className="bi bi-currency-exchange"></i> Competitive Prices</h3>
            <p>Enjoy affordable pricing without compromising on the quality of your diecast models.</p>
          </div>
          <div className="benefitItem">
            <h3><i className="bi bi-fingerprint"></i> Secure Shopping Experience</h3>
            <p>Shop with confidence knowing that your transactions are safe and secure with our robust security measures.</p>
          </div>
          <div className="benefitItem">
            <h3><i className="bi bi-truck"></i> Fast Delivery</h3>
            <p>Get your orders delivered quickly and efficiently with our fast delivery service.</p>
          </div>
        </div>
      </section>
    );
  }
  
  export default BenefitsSection;