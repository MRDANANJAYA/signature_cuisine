import { getAuth, onAuthStateChanged } from "firebase/auth";
import CommonStaffHeader from "../../common/commonStaffHeader";
import { useNavigate } from "react-router-dom";
import { initializeFirebase } from "../../database/firebaseConfig";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Loader from "../../common/loader";
import SingleCard from "../../common/singleCard";

const StaffDashboad = () => {
  const navigate = useNavigate();
  const app = initializeFirebase();
  const db = getFirestore(app);
  const [servicesList, setServicesList] = useState(null);
  const [isloding, setIsloding] = useState(false);

  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app);
  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userid = user.uid;
        console.log("getAuth", userid);
        getServices(db);
      } else {
        // User is signed out
        console.log("User is signed out");
        navigate("/");
      }
    });
  }

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

  return (
    <>
      <CommonStaffHeader />
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
                  navigate("/dashboard/staff_Service-item", {
                    state: { id: singleItem.id },
                  })
                }
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default StaffDashboad;
