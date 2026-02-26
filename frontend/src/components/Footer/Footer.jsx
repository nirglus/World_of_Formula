import { currentYear } from "../../helpers/formatDate";
import "./Footer.scss";

function Footer() {
  return (
    <footer className="siteFooter">
      <div className="footerGrid">
        <div className="footerCol footerBrand">
          <h2 className="footerLogo">World of Formula</h2>
          <p className="footerTagline">Premium diecast models for collectors and racing fans.</p>
        </div>
        <div className="footerCol">
          <h3 className="footerHeading">Support</h3>
          <a href="#">Contact</a>
          <a href="#">Shipping</a>
          <a href="#">Returns</a>
        </div>
        <div className="footerCol">
          <h3 className="footerHeading">Legal</h3>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
      <div className="footerBottom">
        <p className="footerCopyright">© {currentYear} World of Formula. All rights reserved.</p>
        <div className="footerSocial">
          <a href="https://github.com/nirglus" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><i className="bi bi-github" /></a>
          <a href="#" aria-label="Instagram"><i className="bi bi-instagram" /></a>
          <a href="#" aria-label="Twitter"><i className="bi bi-twitter-x" /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
