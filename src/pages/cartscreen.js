import { IconButton } from "@mui/material";
import CommonHeader from "../common/commonHeader";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { DeleteSweep } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import { useContext, useEffect, useState } from "react";
import { Modal } from "bootstrap";
import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeFirebase } from "../database/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Loader from "../common/loader";
import keyGenarate from "../util/keyGenarate";

const CartScreen = () => {
  const [cartList, setCartList] = useState(null);
  const [isloding, setIsloding] = useState(false);
  const [isChekoutloding, setchekoutloding] = useState(false);
  const { setItemsCount } = useContext(CartContext);
  const [total, settotal] = useState(0);
  const [userId, setUserId] = useState("");
  const [totalItems, settotalItems] = useState(0);
  const [sItemTprice, setsItemTprice] = useState([0]);
  const [APItitle, setAPItitle] = useState("");
  const [APItext, setAPItext] = useState("");
  const app = initializeFirebase();
  const db = getFirestore(app);

  const navigate = useNavigate();

  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app);
  useEffect(() => {
    getUser();
  }, []);

  // Get current user
  async function getUser() {
    setIsloding(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userid = user.uid;
        console.log("getAuth", userid);
        getCartData(userid);
        setUserId(userid);
      } else {
        // User is signed out
        console.log("User is signed out");
        navigate("/");
      }
    });
  }

  function getTotal(list) {
    let price = 0;
    let totalItems = 0;
    let sItemTprice = [];
    list.map((item) => {
      price += item.price * item.quantity;
      totalItems += item.quantity;
      sItemTprice.push(item.price * item.quantity);
    });
    settotal(price);
    settotalItems(totalItems);
    setsItemTprice(sItemTprice);
  }

  const getCartData = async (userid) => {
    console.log("CommonHeader Auth", userid);
    const cartDocRef = doc(db, "cart", `${userid}`);
    try {
      const documentSnapshot = await getDoc(cartDocRef);
      if (documentSnapshot.exists()) {
        const documentData = documentSnapshot.data();

        setCartList(documentData.data);
        getTotal(documentData.data);
        setItemsCount(documentData.data.length);

        console.log("Cart data:", documentData.data);
      } else {
        console.log("Document not found.");
      }
      setIsloding(false);
    } catch (error) {
      console.error("Error fetching document:", error);
      setIsloding(false);
    }
  };

  async function getAvailableTableList() {
    let availableTable = [];
    const q = query(
      collection(db, "dineIn"),
      where("availability", "==", true)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      availableTable.push(doc.data());
    });

    return availableTable;
  }

  async function removeItem(filteredList) {
    await updateDoc(doc(db, "cart", `${userId}`), {
      // passing doc here
      data: filteredList,
    })
      .then((value) => {
        console.log("removeed Items successfully", value);
      })
      .catch((error) => {
        console.log("Error cart", error);
      });
  }

  const Checkout = async (e) => {
    setchekoutloding(true);
    const avTable = await getAvailableTableList();
    let hasDineIn = false;
    let list = [];
    cartList.map((item, index) => {
      list.push(item);
    });
    const key = keyGenarate(5);
    const mapKey = `order-${key}`;
    setDoc(doc(db, "orders", `${userId}`), {
      // passing doc here
      data: [
        {
          orderId: mapKey,
          items: list,
          tableId: avTable[0].id,
          status: 'preparing',
          totalprice: sItemTprice,
        },
      ],
    })
      .then((value) => {
        console.log("Added Order Successfully", value);
        setCartClear();
        setchekoutloding(false);
        var myModal = new Modal(document.getElementById("staticBackdrop"));
        setAPItitle("Successful");
        setAPItext("Order Added Successfully");
        myModal.show();
      })
      .catch((error) => {
        console.log("Error cart", error);
        var myModal = new Modal(document.getElementById("staticBackdrop"));
        setAPItext(error);
        setAPItitle("Error");
        myModal.show();
        setchekoutloding(false);
      });
  };

  async function setCartClear() {
    const cartRef = doc(db, "cart", `${userId}`);
    // Remove the 'cart data list' from the document
    await updateDoc(cartRef, {
      data: [],
    })
      .then((value) => {
        console.log("All Completed", value);
        getUser();
      })
      .catch((error) => {
        console.log("Error cart", error);
      });
  }

  return (
    <div>
      <CommonHeader />

      {isloding === true && <Loader />}
      {cartList && (
        <>
          <div
            class="modal fade"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
            is
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">
                    {APItitle}
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">{APItext}</div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center ">
            <div
              className="card border-light"
              style={{
                minWidth: "80%",
                maxHeight: 600,
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.01), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="card-body overflow-auto rounded-3">
                <table class="table table-hover text-center">
                  <thead style={{ paddingTop: 0, marginTop: 0 }}>
                    <tr
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 3,
                        backgroundColor: "#323232",
                      }}
                    >
                      <th scope="col"></th>
                      <th scope="col">Name</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Dine-in / Take-away</th>
                      <th scope="col">Per Price</th>
                      <th scope="col">Total Price</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>

                  <tbody style={{ marginTop: "5px" }}>
                    {cartList && cartList.length === 0 && (
                      <tr>
                        <td colspan="8" className="border-0">
                          <h1 class="w-100 display-6 text-center py-5">
                            No products in the cart!
                          </h1>
                        </td>
                      </tr>
                    )}
                    {cartList &&
                      cartList.map((item, index) => (
                        <tr key={item.id}>
                          <th scope="col">
                            <img src={item.img} style={{ maxWidth: "70px" }} />
                          </th>
                          <td scope="col">{item.title}</td>
                          <td scope="col">{item.quantity}</td>
                          <td scope="col">
                            {item.dineIn ? "Dine In" : "Take Away"}
                          </td>
                          <td scope="col">
                            {item.price.toLocaleString("en-US", {
                              style: "currency",
                              currency: "LKR",
                            })}
                          </td>
                          <td scope="col">{sItemTprice[index]}</td>
                          <td scope="col">
                            <IconButton
                              aria-label="cart"
                              onClick={(e) => {
                                const newTodos = cartList.filter(
                                  (item, i) => i !== index
                                );
                                setCartList(newTodos);
                                getTotal(newTodos);
                                setItemsCount(newTodos.length);
                                removeItem(newTodos);
                              }}
                            >
                              <DeleteSweep sx={{ color: "red" }} />
                            </IconButton>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="card-footer border-0">
                <div className="row pe-5 d-flex align-items-center justify-content-end">
                  <div className="col-auto pt-2">
                    <h5>Total Items :</h5>
                  </div>
                  <div className="col-2 text-center">
                    <span>{totalItems} items</span>
                  </div>
                </div>
                <div className="row pe-5 d-flex align-items-center justify-content-end">
                  <div className="col-auto pt-2">
                    <h5>Total Price :</h5>
                  </div>
                  <div className="col-2 text-center">
                    <div class="border-top my-2"></div>
                    <span>
                      {total.toLocaleString("en-US", {
                        style: "currency",
                        currency: "LKR",
                      })}
                    </span>
                    <div class="border-top mt-1"></div>
                    <div class="border-top mt-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5 mx-5 justify-content-center ">
            <button
              type="button"
              class="btn btn-primary btn-lg w-50 mb-4"
              onClick={Checkout}
            >
              {isChekoutloding && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                />
              )}
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartScreen;
