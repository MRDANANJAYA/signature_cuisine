import "./css/App.css";
import CommonHeader from "./common/commonHeader";
import { useNavigate } from "react-router-dom";
import { initializeFirebase } from "../src/database/firebaseConfig";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "../node_modules/firebase/firestore";
import Loader from "./common/loader";
import SingleCard from "./common/singleCard";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
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


  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log("getAuth", uid);
      navigate('/dashboard')
      // ...
    } else {
      // User is signed out
      // ...
      console.log("User is signed out");
    }
  });



  return (
    <div className="App">
      <CommonHeader />
      <div className="px-5" style={{ flexDirection: "column" }}>
        <div class="position-relative overflow-hidden mb-5 text-center bg-light">
          <div class="col-md-5 p-lg-5 mx-auto my-2">
            <h1 class="display-4 font-weight-normal">Punny headline</h1>
            <p class="lead font-weight-normal">
              And an even wittier subheading to boot. Jumpstart your marketing
              efforts with this example based on Apple's marketing pages.
            </p>
            <a class="btn btn-outline-secondary" href="#">
              Coming soon
            </a>
          </div>
          <div class="product-device box-shadow d-none d-md-block"></div>
          <div class="product-device product-device-2 box-shadow d-none d-md-block"></div>
        </div>
        {isloding === true && <Loader />}
        <div className="row row-cols-1 row-cols-md-2 ">
          {servicesList &&
            servicesList.map((singleItem) => (
              <SingleCard
                item={singleItem}
                isloding={isloding}
                key={singleItem.id}
                onClick={() =>
                  navigate("dashboard/Service-item", {
                    state: { id: singleItem.id },
                  })
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
