import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Home.scss";
import HomeBrands from "../../components/MiniComponents/HomeBrands/HomeBrands";
import BenefitsSection from "../../components/MiniComponents/BenefitsSection/BenefitsSection";

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);
  
  return (
    <div className="home">
      <div className="homeContainer">
        <div className="contentOverlay">
          <h1 className="welcomeHeading">Start your engines</h1>
          <div className="welcomeDescription">
            <p>Explore and collect your favorite Formula 1 cars and teams to adorn your collection!</p>
          </div>
          <Link className="viewProducts" to="/products">View Products</Link>
        </div>
      </div>
      <HomeBrands />
      <BenefitsSection />
    </div>
    );
  }

export default Home
