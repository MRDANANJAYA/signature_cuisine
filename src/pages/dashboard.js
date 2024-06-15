import { useNavigate } from "react-router-dom";
import SingleCard from "./../common/singleCard";
import Loader from "./../common/loader";
import { initializeFirebase } from "./../database/firebaseConfig";
import { useContext, useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import CommonHeader from "../common/commonHeader";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CartContext } from "../context/CartContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const app = initializeFirebase();
  const db = getFirestore(app);
  const [servicesList, setServicesList] = useState(null);
  const [isloding, setIsloding] = useState(false);
  const { setItemsCount } = useContext(CartContext);

  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app);

  // Get current user
  async function getUser() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userid = user.uid;
        console.log("getAuth", userid);
        getUserRole(userid)
        getServices(db);
        getCartData(userid);
      } else {
        // User is signed out
        console.log("User is signed out");
        navigate("/");
      }
    });
    
  }

  // Get a list of cities from your database
  async function getServices(db) {
    setIsloding(true);

    const servicesCol = collection(db, "services");
    try {
      const servicesSnapshot = await getDocs(servicesCol);
      const servicesList = servicesSnapshot.docs.map((doc) => doc.data());
      setServicesList(servicesList);
      console.log("FIERBASE", servicesList);
    } catch (error) {
      console.error("Error fetching document:", error);
    }

    setIsloding(false);
  }

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

  useEffect(() => {
    getUser();
  }, []);


  async function getUserRole(id){
    const docRef = doc(db, "auth", `${id}`);
    try {
      const documentSnapshot = await getDoc(docRef);
      if (documentSnapshot.exists()) {
        const documentData = documentSnapshot.data();
        console.log("Auth role data:", documentData.role);
        if(documentData.role === 'staff'){
          
          navigate("/staff_dashboard");
        }else if(documentData.role === 'admin'){

        }else{
          
          navigate("/dashboard");
        }

      } else {
        console.log("Document not found.");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
    

    setIsloding(false);
  }

  return (
    <div>
      <CommonHeader />
      <div className="px-5" style={{ flexDirection: "column" }}>
        {isloding === true && <Loader />}
        <div className="row row-cols-1 row-cols-md-2 mt-3">
          {servicesList &&
            servicesList.map((singleItem) => (
              <SingleCard
                item={singleItem}
                isloding={isloding}
                key={singleItem.id}
                onClick={() =>
                  navigate("/dashboard/Service-item", {
                    state: { id: singleItem.id },
                  })
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
