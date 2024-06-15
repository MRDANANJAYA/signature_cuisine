import { getAuth, onAuthStateChanged } from "firebase/auth";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import CommonStaffHeader from "../../common/commonStaffHeader";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { initializeFirebase } from "../../database/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../common/loader";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Modal } from "bootstrap";
import keyGenarate from "../../util/keyGenarate";

const StaffCatagory = () => {
  const navigate = useNavigate();
  const app = initializeFirebase();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [userData, setUserData] = useState({ img: "", name: "" });
  const [isloding, setIsloding] = useState(false);
  const [catList, setCatList] = useState(null);
  const [isImageupload, setImageupload] = useState(false);
  const [isFileupload, setFileupload] = useState(false);
  const [modalData, setmodalData] = useState({
    title: "",
    img: "",
    updated: "",
    id: "",
    availability: false,
    subtitle: "",
  });
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
      getCatagory();
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

  async function uploadCatagory(list, catId) {
    console.log("going to update Catagory", list);
    setIsloding(true);

    await setDoc(doc(db, "services", `${catId}`), list)
      .then((value) => {
        setIsloding(false);
        console.log("Frank created", value);
        alert("successful");
        getCatagory();
        document.querySelector(".btn-close").click();
      })
      .catch((error) => {
        setIsloding(false);
        alert("Error occurred" + error);
      });
  }

  async function getCatagory() {
    setIsloding(true);

    const catCol = collection(db, "services");
    try {
      const catSnapshot = await getDocs(catCol);
      const catList = catSnapshot.docs.map((doc) => doc.data());
      setCatList(catList);
      console.log("FIERBASE Catagory", catList);
    } catch (error) {
      console.error("Error fetching document:", error);
    }

    setIsloding(false);
  }

  useEffect(() => {
    getUser();
  }, []);

  const addCatagory = (e) => {
    let key = keyGenarate(25);
    console.log("random key", key);
    setmodalData({
      title: "",
      img: "",
      updated: "",
      id: key,
      availability: false,
      subtitle: "",
    });

    var myModal = new Modal(document.getElementById("staticBackdrop"));
    myModal.show();
    const form = document.getElementById("serviceForm"); // Replace with your form ID
    form.reset();
    const lable = document.getElementById("staticBackdropLabel");
    const int = document.getElementById("hideText");
    int.textContent = "index";

    lable.innerHTML = "Add Catagory";
  };

  const updateData = async (i) => {
    let list = [];

    var currentdate = new Date();
    var datetime =
      "Last Sync: " +
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

    if (
      modalData.subtitle === "" ||
      modalData.img === "" ||
      modalData.title === ""
    ) {
      alert("feilds canot be empty");
    } else {
      try {
        uploadCatagory(
          {
            title: modalData.title,
            img: modalData.img,
            updated: datetime,
            id: modalData.id,
            availability: modalData.availability,
            subtitle: modalData.subtitle,
          },
          modalData.id
        );
      } catch (e) {
        alert("internal error" + `${e}`);
      }
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageupload(true);
      const storage = getStorage(app);
      const storageRef = ref(
        storage,
        `images/catagory/${modalData.id}/${file.name}`
      );

      // Upload the file and metadata
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          alert("File uploads unsuccessful!");
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            const data = {
              title: modalData.title,
              img: downloadURL,
              updated: modalData.updated,
              id: modalData.id,
              availability: modalData.availability,
              subtitle: modalData.subtitle,
            };
            setmodalData(data);
            console.log("handleFile", data);
            setImageupload(false);
          });
        }
      );
    }
  };

  return (
    <>
      <CommonStaffHeader name={userData.name} img={userData.img} />
      <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">
                Edit Catagory
              </h5>
              <h5 class="visually-hidden" id="hideText">
                index
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form id="serviceForm">
                <div class="form-group">
                  <label for="recipient-name" class="col-form-label">
                    Catagory Name:
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="recipient-name"
                    defaultValue={modalData.title}
                    onChange={(e) => {
                      const data = {
                        title: e.target.value,
                        img: modalData.img,
                        updated: modalData.updated,
                        id: modalData.id,
                        availability: modalData.availability,
                        subtitle: modalData.subtitle,
                      };
                      setmodalData(data);
                    }}
                  />
                </div>
                <div class="form-group">
                  <label for="message-text" class="col-form-label">
                    Description:
                  </label>
                  <textarea
                    class="form-control"
                    id="message-text"
                    defaultValue={modalData.subtitle}
                    onChange={(e) => {
                      const data = {
                        title: modalData.title,
                        img: modalData.img,
                        updated: modalData.updated,
                        id: modalData.id,
                        availability: modalData.availability,
                        subtitle: e.target.value,
                      };
                      setmodalData(data);
                    }}
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="formFile" class="form-label">
                    Image:
                  </label>
                  <div class="input-group flex-nowrap">
                    <input
                      class="form-control"
                      type="file"
                      id="formFile"
                      onChange={handleFile}
                      accept="image/png, image/gif, image/jpeg"
                    />
                    {isImageupload && (
                      <span class="input-group-text" id="addon-wrapping">
                        <span
                          class="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </span>
                    )}
                  </div>
                </div>
                <div class="form-check  mt-3 ">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckChecked"
                    defaultChecked={modalData.availability}
                    onClick={(e) => {
                      const data = {
                        title: modalData.title,
                        img: modalData.img,
                        updated: modalData.updated,
                        id: modalData.id,
                        availability: !modalData.availability,
                        subtitle: modalData.subtitle,
                      };
                      setmodalData(data);
                    }}
                  />
                  <label class="form-check-label" for="flexCheckChecked">
                    Available
                  </label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-primary"
                type="submit"
                id="btn-submit"
                onClick={(e) => {
                  const idDoc = document.getElementById("hideText");
                  updateData(idDoc.textContent);
                }}
              >
                {isFileupload && (
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Submit form
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={(e) => {
                  const form = document.getElementById("serviceForm"); // Replace with your form ID
                  form.reset(); // Resets all form fields, including the file input
                  setmodalData({
                    title: "",
                    img: "",
                    updated: "",
                    id: "",
                    availability: false,
                    subtitle: "",
                  });
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <center className="mb-3">
        <button
          type="button"
          className="btn btn-lg btn-block btn-success col-auto d-flex align-items-center"
          onClick={addCatagory}
        >
          <AddCircleOutlineRoundedIcon className="me-2" />
          Add New Catagory
        </button>
      </center>
      {catList &&
        catList.map((item, index) => (
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
                    <p className="list-unstyled mt-3 mb-4">{item.subtitle}</p>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button
                  type="button"
                  className="btn btn-lg btn-block btn-primary col-auto ms-auto me-4"
                  onClick={(e) => {
                    var myModal = new Modal(
                      document.getElementById("staticBackdrop")
                    );
                    myModal.show();

                    const int = document.getElementById("hideText");
                    int.textContent = index;
                    const form = document.getElementById("serviceForm"); // Replace with your form ID
                    form.reset();
                    const data = {
                      title: item.title,
                      img: item.img,
                      updated: item.updated,
                      id: item.id,
                      availability: item.availability,
                      subtitle: item.subtitle,
                    };
                    setmodalData(data);
                  }}
                >
                  Edit This catogory
                </button>
                <button
                  type="button"
                  className="btn btn-lg btn-block btn-danger col-auto ms-auto"
                  onClick={async (e) => {
                    try {
                      await deleteDoc(doc(db, "services", item.id));
                      getCatagory();
                      console.log(
                        "Entire Document has been deleted successfully."
                      );
                    } catch (ex) {
                      console.log(ex);
                    }
                  }}
                >
                  Delete This catogory
                </button>
              </div>
            </div>
          </div>
        ))}
      {isloding === true && <Loader />}
    </>
  );
};

export default StaffCatagory;
