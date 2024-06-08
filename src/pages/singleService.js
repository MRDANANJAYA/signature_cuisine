import { useNavigate, useLocation } from "react-router-dom";
import Loader from "./../common/loader";
import { initializeFirebase } from "./../database/firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import CommonHeader from "../common/commonHeader";
import { LoginContext } from "../context/LoginContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const SingleService = () => {
  const navigate = useNavigate();
  const app = initializeFirebase();
  const db = getFirestore(app);
  const [dataList, setDataList] = useState(null);
  const [isloding, setIsloding] = useState(false);
  const { state } = useLocation();
  const { isLogin } = useContext(LoginContext);

  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app);

  const handleOrder = () => {
    getUser();
  };

  async function getUser() {
    let userid;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userid = user.uid;
        console.log("getAuth", userid);
      } else {
        // User is signed out
        console.log("User is signed out");
        navigate("/loginScreen");
      }
    });
    return userid;
  }

  useEffect(() => {
    // Get a list of serviceItems from database
    async function getServices(db) {
      setIsloding(true);
      const docRef = doc(db, "serviceItems", `${state.id}`);
      try {
        const documentSnapshot = await getDoc(docRef);
        if (documentSnapshot.exists()) {
          const documentData = documentSnapshot.data();
          setDataList(documentData.data);
          console.log("Document data:", documentData.data);
        } else {
          console.log("Document not found.");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
      setIsloding(false);
     
    }

    getServices(db);
  }, []);

  return (
    <div className="page" style={{ flexDirection: "column" }}>
      <CommonHeader />
      {dataList &&
        dataList.map((item) => (
          <div className="px-5" key={item.id}>
            <div className="card mb-4 box-shadow text-center">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">{item.title}</h4>
              </div>

              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <img
                      className="card-img-fluid"
                      src={item.img}
                      style={{ backgroundSize: "cover", maxHeight: "250px" }}
                      alt="Card image cap"
                    ></img>
                  </div>
                  <div className="col-5 my-auto ">
                    <h1 className="card-title pricing-card-title">
                      {item.price}
                    </h1>
                    <p className="list-unstyled mt-3 mb-4">{item.disc}</p>
                    <button
                      type="button"
                      className="btn btn-lg btn-block btn-primary"
                      onClick={handleOrder}
                    >
                      Order Now <small>{"[add to cart]"}</small>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      {isloding === true && <Loader />}
    </div>
  );
};

export default SingleService;
