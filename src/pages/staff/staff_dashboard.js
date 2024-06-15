import { getAuth, onAuthStateChanged } from "firebase/auth";
import CommonStaffHeader from "../../common/commonStaffHeader";
import { useNavigate } from "react-router-dom";
import { initializeFirebase } from "../../database/firebaseConfig";
import { getFirestore, collection, getDocs, getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Loader from "../../common/loader";
import SingleCard from "../../common/singleCard";

const StaffDashboad = () => {
  const navigate = useNavigate();
  const app = initializeFirebase();
  const db = getFirestore(app);
  const [servicesList, setServicesList] = useState(null);
  const [isloding, setIsloding] = useState(false);
  const [userData, setUserData] = useState({img : '', name: ''});
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
        getUserDetails(userid);
      } else {
        // User is signed out
        console.log("User is signed out");
        navigate("/");
      }
    });
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
      <CommonStaffHeader name={userData.name} img={userData.img}/>
      <div className="px-5" style={{ flexDirection: "column" }}>
        {isloding === true && <Loader />}
        <div className="row row-cols-1 row-cols-md-2 mt-3 g-4">
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
