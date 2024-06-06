import "../css/commonHeader.css";
import logo from "../img/scLogo.png";
const CommonHeader = ({ Children }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow mb-5">
      <div className="container mycustombtn">
        <img src={logo} className="img-logo"/>
        <a className="navbar-brand" href="/">
          Signature cuisine
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse "
          id="navbarResponsive"
          style={{ alignItems: "center" }}
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Services
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Contact
              </a>
            </li>
            <li className="nav-item align-content-sm-center">
              <button
                type="button"
                className="btn btn-primary position-relative btn-sm ms-3"
              >
                <i className="bi bi-cart"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  99+
                  <span className="visually-hidden">unread messages</span>
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      {Children}
    </nav>
  );
};

export default CommonHeader;
