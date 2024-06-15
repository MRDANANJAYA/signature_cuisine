import { useNavigate, useLocation } from "react-router-dom";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Modal } from "bootstrap";
import CommonStaffHeader from "../../common/commonStaffHeader";
import Loader from "../../common/loader";
import { initializeFirebase } from "../../database/firebaseConfig";
import { LoginContext } from "../../context/LoginContext";
// [START storage_upload_ref_modular]
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
const StaffSingleService = () => {
  const navigate = useNavigate();
  const app = initializeFirebase();
  const db = getFirestore(app);
  const [dataList, setDataList] = useState(null);

  const [modalData, setmodalData] = useState({
    name: "",
    img: "",
    price: 0,
    id: "",
    itemCheck: false,
    disc: "",
  });

  const [isloding, setIsloding] = useState(false);
  const [isImageupload, setImageupload] = useState(false);
  const [isFileupload, setFileupload] = useState(false);
  const { state } = useLocation();
  const { isLogin } = useContext(LoginContext);
  const [dineIn, setDineIn] = useState([]);
  //const [options, setOptions] = useState([]);
  const [APITtitle, setAPITtitle] = useState("");
  const [APItext, setAPItext] = useState("");
  const [image, setImage] = useState(null);
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app);
  const handleOrder = async (item, index) => {
    let authKey = await getUser();
  };

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
    } catch (error) {
      console.error(error.message);
      navigate("/loginScreen");
    }
    return userid;
  }

  useEffect(() => {
    // Get a list of serviceItems from database

    getServices(db);
  }, []);

  async function getServices(db) {
    setIsloding(true);
    const docRef = doc(db, "serviceItems", `${state.id}`);
    try {
      const documentSnapshot = await getDoc(docRef);
      if (documentSnapshot.exists()) {
        const documentData = documentSnapshot.data();
        setDataList(documentData.data);
        const element = [];
        for (let index = 0; index < documentData.data.length; index++) {
          element.push("false");
        }
        setDineIn(element);
        console.log("Document count:", element);
        console.log("Document data:", documentData.data);
      } else {
        console.log("Document not found.");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
    setIsloding(false);
  }

  const updateData = async (i) => {
    let list = [];

    if (
      modalData.disc === "" ||
      modalData.img === "" ||
      modalData.price === "" ||
      modalData.name === ""
    ) {
      alert("feilds canot be empty");
    } else {
      dataList.forEach((element, index) => {
        console.log("element", i === index, i, index, modalData.img);
        if (i === index.toString()) {
          list.push({
            availability: modalData.itemCheck,
            disc: modalData.disc,
            id: element.id,
            img: modalData.img,
            price: Number.parseFloat(modalData.price),
            title: modalData.name,
          });
        } else {
          list.push(element);
        }
      });

      console.log("handleFile", list);
      let x = Math.floor(Math.random() * 100000 + 1);
      if (i === "index") {
        list.push({
          availability: modalData.itemCheck,
          disc: modalData.disc,
          id: x.toString(),
          img: modalData.img,
          price: Number.parseFloat(modalData.price),
          title: modalData.name,
        });
        try {
          uploadOrder(list);
        } catch (e) {
          alert("internal error" + `${e}`);
        }
      } else {
        try {
          uploadOrder(list);
        } catch (e) {
          alert("internal error" + `${e}`);
        }
      }
    }
  };

  async function uploadOrder(list) {
    console.log("uploadin", list);
    setFileupload(true);
    setIsloding(true);
    await updateDoc(doc(db, "serviceItems", `${state.id}`), {
      // passing doc here
      data: list,
    })
      .then((value) => {
        setFileupload(false);
        setIsloding(false);
        console.log("Frank created", value);
        alert("successful");
        getServices(db);
        document.querySelector(".btn-close").click();
      })
      .catch((error) => {
        setFileupload(false);
        setIsloding(false);
        alert("Error occurred");
      });
  }

  const handleFile = (e) => {
    const file = e.target.files[0];
    console.log("image Path", `images/${state.id}/${file.name}`);
    if (file) {
      setImageupload(true);
      const storage = getStorage(app);
      const storageRef = ref(storage, `images/${state.id}/${file.name}`);

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
              name: modalData.name,
              img: downloadURL,
              id: "",
              price: modalData.price,
              itemCheck: modalData.itemCheck,
              disc: modalData.disc,
            };
            setmodalData(data);
            console.log("handleFile", data);
            setImageupload(false);
          });
        }
      );
    }
  };

  const addOrder = (e) => {
    setmodalData({
      name: "",
      img: "",
      price: 0,
      id: "",
      itemCheck: false,
      disc: "",
    });
    var myModal = new Modal(document.getElementById("staticBackdrop"));
    myModal.show();
    const form = document.getElementById("serviceForm"); // Replace with your form ID
    form.reset();
    const lable = document.getElementById("staticBackdropLabel");
    const int = document.getElementById("hideText");
    int.textContent = "index";

    lable.innerHTML = "Add order";
  };

  return (
    <div className="page" style={{ flexDirection: "column" }}>
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
                Edit order
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
                    Item Name:
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="recipient-name"
                    defaultValue={modalData.name}
                    onChange={(e) => {
                      const data = {
                        name: e.target.value,
                        img: modalData.img,
                        id: "",
                        price: modalData.price,
                        itemCheck: modalData.itemCheck,
                        disc: modalData.disc,
                      };
                      setmodalData(data);
                    }}
                  />
                </div>
                <div class="form-group">
                  <label for="recipient-name" class="col-form-label">
                    Price:
                  </label>

                  <input
                    type="number"
                    class="form-control"
                    id="recipient-price"
                    defaultValue={modalData.price}
                    onChange={(e) => {
                      const data = {
                        name: modalData.name,
                        img: modalData.img,
                        id: "",
                        price: e.target.value,
                        itemCheck: modalData.itemCheck,
                        disc: modalData.disc,
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
                    defaultValue={modalData.disc}
                    onChange={(e) => {
                      const data = {
                        name: modalData.name,
                        img: modalData.img,
                        id: "",
                        price: modalData.price,
                        itemCheck: modalData.itemCheck,
                        disc: e.target.value,
                      };
                      setmodalData(data);
                    }}
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="formFile" class="form-label">
                    Image
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
                    defaultChecked={modalData.itemCheck}
                    onClick={(e) => {
                      const data = {
                        name: modalData.name,
                        img: modalData.img,
                        id: "",
                        price: modalData.price,
                        itemCheck: !modalData.itemCheck,
                        disc: modalData.disc,
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
                    name: "",
                    img: "",
                    price: 0,
                    itemCheck: false,
                    id: "",
                    disc: "",
                  });
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <CommonStaffHeader />
      <center className="mb-3">
        <button
          type="button"
          className="btn btn-lg btn-block btn-success col-auto d-flex align-items-center"
          onClick={addOrder}
        >
          <AddCircleOutlineRoundedIcon className="me-2" />
          Add New Order
        </button>
      </center>
      {dataList &&
        dataList.map((item, index) => (
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
                    <h1 className="card-title pricing-card-title">
                      {item.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "LKR",
                      })}
                    </h1>
                    <p className="list-unstyled mt-3 mb-4">{item.disc}</p>
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
                      name: item.title,
                      price: item.price,
                      itemCheck: item.availability,
                      id: "",
                      disc: item.disc,
                      img: item.img,
                    };
                    setmodalData(data);
                  }}
                >
                  Edit This Order
                </button>
                <button
                  type="button"
                  className="btn btn-lg btn-block btn-danger col-auto ms-auto"
                  onClick={(e) => {
                    const newTodos = dataList.filter((item, i) => i !== index);
                    console.log("todo", newTodos);
                    uploadOrder(newTodos);
                  }}
                >
                  Delete This Order
                </button>
              </div>
            </div>
          </div>
        ))}
      {isloding === true && <Loader />}
    </div>
  );
};

export default StaffSingleService;
