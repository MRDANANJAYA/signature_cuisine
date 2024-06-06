import { useNavigate } from "react-router-dom";
import SingleCard from "./../common/singleCard";
import Loader from "./../common/loader";
import { initializeFirebase } from "./../database/firebaseConfig";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
const Dashboard = () => {
  const navigate = useNavigate();
  const app = initializeFirebase();
  const db = getFirestore(app);
  const [servicesList, setServicesList] = useState(null);
  const [isloding, setIsloding] = useState(false);

  useEffect(() => {
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
      return servicesList;
    }

    getServices(db);
  }, []);
  return (
    <div className="container-fluid px-5" style={{ flexDirection: "column" }}>
      {isloding === true && <Loader />}
      <div className="row row-cols-1 row-cols-md-3 g-4 g-2">
        {servicesList &&
          servicesList.map((singleItem) => (
            <SingleCard
              item={singleItem}
              isloding={isloding}
              key={singleItem.id}
              onClick={() => navigate("dashboard/Service-item",{ state: { id: singleItem.id} })}
            />
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
