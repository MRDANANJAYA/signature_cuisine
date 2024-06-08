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

  const getCardData = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userid = user.uid;
        console.log("Orders Auth", userid);
        getOrderData(userid);
      } else {
        // User is signed out
        console.log("User is signed out");
      }
    });
  };

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
    <div>
      <CommonHeader />
      {isloding === true && <Loader />}
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
                data.items.map((items) => (
                  <li className="list-group-item">{items.title}</li>
                ))}
            </ul>
            <div className="card-body">
              <a href="#" className="card-link">
                Card link
              </a>
              <a href="#" className="card-link">
                Another link
              </a>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Orders;
