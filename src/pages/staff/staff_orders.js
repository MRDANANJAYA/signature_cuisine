import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { initializeFirebase } from "../../database/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import CommonStaffHeader from "../../common/commonStaffHeader";
import { useNavigate } from "react-router-dom";

const StaffOrders = () => {
    const navigate = useNavigate();
  const app = initializeFirebase();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [orderData, setOrderData] = useState([]);
  const [isloding, setIsloding] = useState(false);
  const [userData, setUserData] = useState({ img: "", name: "" });

  const getUser = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userid = user.uid;
        console.log("Orders Auth", userid);
        getOrderData(userid);
        getUserDetails(userid);
      } else {
        // User is signed out
        console.log("User is signed out");
        navigate("/");
      }
    });
  };

  const getOrderData = async (userid) => {
    setIsloding(true);
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    } catch (error) {
      console.error("Error fetching document:", error);
    }
    setIsloding(false);
  };

  useEffect(() => {
    getUser();
  }, []);

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

  return (
    <>
      <CommonStaffHeader name={userData.name} img={userData.img}/>
    </>
  );
};

export default StaffOrders;
