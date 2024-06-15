import { IconButton } from "@mui/material";
import CommonHeader from "../common/commonHeader";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { DeleteSweep } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeFirebase } from "../database/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Loader from "../common/loader";

const CartScreen = () => {
  const [cartList, setCartList] = useState(null);
  const [isloding, setIsloding] = useState(false);
  const [isOrderloding, setIsOrderloding] = useState(false);
  const { setItemsCount } = useContext(CartContext);
  const [total, settotal] = useState(0);
  const [totalItems, settotalItems] = useState(0);
  const [sItemTprice, setsItemTprice] = useState([0]);
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
  return (
    <div>
      <CommonHeader />
      
      {isloding === true && <Loader />}
      {cartList&&<><div className="d-flex justify-content-center ">
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
              <thead style={{paddingTop: 0, marginTop: 0,}}>
                <tr style={{ position: "sticky", top: 0 ,zIndex :3, backgroundColor:"#323232"}}>
                  <th scope="col"></th>
                  <th scope="col">Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Dine-in / Take-away</th>
                  <th scope="col">Per Price</th>
                  <th scope="col">Total Price</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody style={{marginTop:"5px"}}>
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
                    <tr>
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
        <button type="button" class="btn btn-primary btn-lg w-50 mb-4">
          {isOrderloding && (
            <span
              className="spinner-border spinner-border-sm me-2"
              aria-hidden="true"
            />
          )}
          Checkout
        </button>
      </div></>}
    </div>
  );
};

export default CartScreen;
