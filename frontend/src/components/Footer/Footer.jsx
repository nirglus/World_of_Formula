import { currentYear } from "../../helpers/formatDate";
import "./Footer.scss";

function Footer() {
  return (
    <footer>
      <div className="topFooter">
        <div className="company">
            <div className="logo">
              <h2>World of Formula</h2>
            </div>
          <p>From track to shelf, Capturing racing spirit</p>
        </div>
        <div className="projects">
          <h2>Other Products</h2>
          <a href="https://nirglus.github.io/Movies-Project/html/index.html">MovieNatic</a>
          <a href="https://resumematrix-50ace.web.app/">ResumeMatrix</a>
          <a href="https://nirglus.github.io/age-calculator-app-main/">Age Calculator</a>
        </div>
      </div>
      <div className="bottomFooter">
        <div className="copyright">
          <p>© {currentYear}  World of Formula: All rights reserved</p>
        </div>
        <div className="icons">
          <i className="bi bi-facebook"></i>
          <i className="bi bi-whatsapp"></i>
          <a href="https://github.com/nirglus"><i className="bi bi-github"></i></a>
          <i className="bi bi-envelope-at-fill"></i>
        </div>
      </div>
    </footer>
  )
}

export default Footer
