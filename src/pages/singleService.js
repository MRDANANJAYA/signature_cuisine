import { useNavigate, useLocation } from "react-router-dom";
import Loader from "./../common/loader";
import { initializeFirebase } from "./../database/firebaseConfig";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import CommonHeader from "../common/commonHeader";
import { LoginContext } from "../context/LoginContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Modal } from "bootstrap";
import { CartContext } from "../context/CartContext";

const SingleService = () => {
  const navigate = useNavigate();
  const app = initializeFirebase();
  const db = getFirestore(app);
  const [dataList, setDataList] = useState(null);
  const [isloding, setIsloding] = useState(false);
  const [isOrderloding, setOrderloding] = useState(false);
  const { state } = useLocation();
  const { isLogin } = useContext(LoginContext);
  const [dineIn, setDineIn] = useState([]);
  const { setItemsCount } = useContext(CartContext);
  //const [options, setOptions] = useState([]);
  const [APITtitle, setAPITtitle] = useState("");
  const [APItext, setAPItext] = useState("");
  const [userData, setUserData] = useState({ img: "", name: "" });

  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app);

  async function getUserDetails(userid) {
    const docRef = doc(db, "auth", `${userid}`);
    try {
      const documentSnapshot = await getDoc(docRef);
      if (documentSnapshot.exists()) {
        const documentData = documentSnapshot.data();
        setUserData({
          img: documentData.img,
          name: `${documentData.fname} ${documentData.lname}`,
        });
        console.log(
          "Document data:",
          documentData.fname + " " + documentData.lname
        );
      } else {
        console.log("Document not found.");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  }

  const handleOrder = async (item, index) => {
    setOrderloding(true);
    let authKey = await getUser();
    const cartDocRef = doc(db, "cart", `${authKey}`);
    const documentSnapshot = await getDoc(cartDocRef);

    let r = (Math.random() + 1).toString(36).substring(7);
    if (documentSnapshot.exists()) {
      const documentData = documentSnapshot.data();
      var list = [];
      if (documentData.data) {
        list = documentData.data;
      }
      list.push({
        id: item.id,
        img: item.img,
        price: item.price,
        title: item.title,
        quantity: 1,
        dineIn: dineIn[index] ? true : false,
      });
      await updateDoc(doc(db, "cart", `${authKey}`), {
        // passing doc here
        data: list,
      })
        .then((value) => {
          setOrderloding(false);
          console.log("Frank created", value);
          getCartData(authKey);
          var myModal = new Modal(document.getElementById("staticBackdrop"));
          setAPItext("Item add to cart sucessfully");
          setAPITtitle("Sucessfull");
          myModal.show();
        })
        .catch((error) => {
          setOrderloding(false);
          var myModal = new Modal(document.getElementById("staticBackdrop"));
          setAPItext(error);
          setAPITtitle("Error");
          myModal.show();
        });
    }
    setOrderloding(false);
  };

  // Get cart items count
  const getCartData = async (userid) => {
    console.log("CommonHeader Auth", userid);
    const cartDocRef = doc(db, "cart", `${userid}`);
    try {
      const documentSnapshot = await getDoc(cartDocRef);
      if (documentSnapshot.exists()) {
        const documentData = documentSnapshot.data();

        setItemsCount(documentData.data.length);

        console.log("Cart data:", documentData.data);
      } else {
        console.log("Document not found.");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  async function getUser() {
    let userid;
    try {
      const user = await new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            resolve(user);
          } else {
            reject(new Error("User is signed out"));
          }
        });
      });

      userid = user.uid;
      console.log("getAuth", userid);
      getUserDetails(userid);
    } catch (error) {
      console.error(error.message);
      navigate("/loginScreen");
    }
    return userid;
  }

  async function getUserDetails(userid) {
    const docRef = doc(db, "auth", `${userid}`);
    try {
      const documentSnapshot = await getDoc(docRef);
      if (documentSnapshot.exists()) {
        const documentData = documentSnapshot.data();
        setUserData({
          img: documentData.img,
          name: `${documentData.fname} ${documentData.lname}`,
        });
        console.log(
          "Document data:",
          documentData.fname + " " + documentData.lname
        );
      } else {
        console.log("Document not found.");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
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
          const element = [];
          for (let index = 0; index < documentData.data.length; index++) {
            element.push("false");
          }
          setDineIn(element);
          console.log("Document count:", element);
          console.log("Document data:", documentData.data);
        } else {
          console.log("Document not found.");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
      setIsloding(false);
    }
    getUser()
    getServices(db);
  }, []);

  return (
    <div className="page" style={{ flexDirection: "column" }}>
      <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        is
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">
                {APITtitle}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">{APItext}</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <CommonHeader img={userData.img} name={userData.name} />
      {dataList &&
        dataList.map((item, index) => (
          <div className="px-5 d-flex justify-content-center" key={item.id}>
            <div
              className="card mb-4 box-shadow text-center"
              style={{ width: "70%" }}
            >
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">{item.title}</h4>
              </div>

              <div className="card-body">
                <div className="row">
                  <div className="col-auto">
                    <img
                      className="card-img-fluid"
                      src={item.img}
                      style={{ backgroundSize: "cover", maxHeight: "250px" }}
                      alt="Card image cap"
                    ></img>
                  </div>
                  <div className="col my-auto ">
                    <h1 className="card-title pricing-card-title">
                      {item.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "LKR",
                      })}
                    </h1>
                    <p className="list-unstyled mt-3 mb-4">{item.disc}</p>
                    <div className="row d-flex align-items-center px-5">
                      <div class="form-check col-auto">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value={dineIn[index]}
                          id={item.id}
                          onChange={(event) => {
                            let newArr = [...dineIn];
                            newArr[index] = event.currentTarget.checked;
                            setDineIn(newArr);
                            console.log(
                              "checkbox",
                              event.currentTarget.checked
                            );
                          }}
                        />
                        <label class="form-check-label" for={item.id}>
                          Dine in
                        </label>
                      </div>
                      <button
                        type="button"
                        className="btn btn-lg btn-block btn-primary col-auto ms-auto"
                        onClick={(e) => handleOrder(dataList[index], index)}
                      >
                        {isOrderloding && (
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            aria-hidden="true"
                          />
                        )}
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <small className="text-muted col-12">
                  Tables allocate automaticlly acoding to availability
                </small>
              </div>
            </div>
          </div>
        ))}
      {isloding === true && <Loader />}
    </div>
  );
};

export default SingleService;
