import { useNavigate,useLocation} from "react-router-dom";
import Loader from "./../common/loader";
import { initializeFirebase } from "./../database/firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const SingleService = () => {
  const navigate = useNavigate();
  const app = initializeFirebase();
  const db = getFirestore(app);
  const [dataList, setDataList] = useState(null);
  const [isloding, setIsloding] = useState(false);
  const {state} = useLocation();
  useEffect(() => {
    // Get a list of serviceItems from database
    async function getServices(db) {
      setIsloding(true);
      const docRef = doc(db, "serviceItems", `${state.id}`);
      try {
        const documentSnapshot = await getDoc(docRef);
        if (documentSnapshot.exists()) {
          const documentData = documentSnapshot.data();
          setDataList(documentData);
          console.log("Document data:", documentData);
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
    <div className="container-fluid px-5" style={{ flexDirection: "column" }}>
      {isloding === true && <Loader />}
      
    </div>
  );
};

export default SingleService;
