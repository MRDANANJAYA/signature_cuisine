import { Navigate, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import '../css/singleCard.css'

const SingleCard = ({ item ,isloding,onClick}) => {
  const navigate = useNavigate();
  return (
    <div className="col" onClick={onClick}>
      <div
        className="card h-100 "
        style={{ maxWidth: "840px" }}
      >
        <div className="row g-0 h-100">
          <div className="col-md-4">
            <img
              src={item.img}
              className="img-fluid rounded mx-auto"
              style={{ height: "100%" }}
              alt="..."
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <p className="card-text">{item.subtitle}</p>
              <p className="card-text">
                <small className="text-muted">{item.updated}</small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
