import { doc, getDoc, getFirestore } from "firebase/firestore";
import CommonHeader from "../common/commonHeader";
import { initializeFirebase } from "../database/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import Loader from "../common/loader";

const Orders = () => {
  const app = initializeFirebase();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [orderData, setOrderData] = useState([]);
  const [isloding, setIsloding] = useState(false);
  const [userData, setUserData] = useState({img : '', name: ''});

  const getCardData = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userid = user.uid;
        console.log("Orders Auth", userid);
        getOrderData(userid);
        getUserDetails(userid)
      } else {
        // User is signed out
        console.log("User is signed out");
      }
    });
  };


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

  const getOrderData = async (userid) => {
    setIsloding(true);
    const cartDocRef = doc(db, "orders", `${userid}`);
    try {
      const documentSnapshot = await getDoc(cartDocRef);
      if (documentSnapshot.exists()) {
        const documentData = documentSnapshot.data();
        setOrderData(documentData.data);
        console.log("Order data:", documentData.data);
      } else {
        console.log("Document not found.");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
    setIsloding(false);
  };

  useEffect(() => {
    getCardData();
  }, []);

  return (
    <>
      <CommonHeader img={userData.img} name={userData.name}/>
      {isloding === true && <Loader />}
      <div className="px-5 d-flex justify-content-center g-5">
      {orderData &&
        orderData.map((data) => (
          <div className="card" style={{ width: "18rem" }} key={data.orderId}>
            <div className="card-header">
              <span className="me-2">Your Order is</span>
              {data.status === "preparing" ? (
                <Chip label={data.status} color="warning" />
              ) : (
                <Chip label={data.status} color="primary" />
              )}
            </div>
            <div className="card-body">
              <h5 className="card-title">Total Price</h5>
              <p className="card-text">
                {data.totalprice.toLocaleString("en-US", {
                  style: "currency",
                  currency: "LKR",
                })}
              </p>
            </div>
            <ul className="list-group list-group-flush">
              {data.items &&
                data.items.map((items,index) => (
                  <li className="list-group-item" key={index}>{items.title}</li>
                ))}
            </ul>
            <div className="card-body">
              <span>Table No : <b>{data.tableId}</b></span>
            </div>
          </div>
        ))}
      </div>
      
    </>
  );
};

export default Orders;
