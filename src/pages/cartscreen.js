import { IconButton } from "@mui/material";
import CommonHeader from "../common/commonHeader";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { DeleteSweep } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import { useState } from "react";

const CartScreen = () => {
  const [cartList, setCartList] = useState([]);
  const [dineIn, setDineIn] = useState(false);
  const [options, setOptions] = useState([]);
  return (
    <div>
      <CommonHeader />
      <div className="d-flex justify-content-center ">
        <div
          className="card border-light"
          style={{
            minWidth: "60%",
            maxHeight: 400,
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.01), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="card-body overflow-auto rounded-3">
            <table class="table table-hover text-center">
              <thead>
                <tr style={{ position: "sticky", top: 0 }}>
                  <th scope="col"></th>
                  <th scope="col">Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Dine-in / Take-away</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colspan="5" className="border-0">
                    <h1 class="w-100 display-6 text-center py-5">
                      No Item added yet!
                    </h1>
                  </td>
                </tr>
                {cartList &&
                  cartList.map((item, index) => (
                    <tr>
                      <th scope="col">
                        <img
                          src="https://dinemoreonline.com/wp-content/uploads/2021/05/Submarine-Vegetable.jpg"
                          style={{ maxWidth: "70px" }}
                        />
                      </th>
                      <td scope="col">Mark</td>
                      <td scope="col">Otto</td>
                      <td scope="col">@mdo</td>
                      <td scope="col">
                        <IconButton
                          aria-label="cart"
                          onClick={(e) => {
                            const newTodos = cartList.filter((item, i) => i !== index);
                            setCartList(newTodos);
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
          <div className="row border-light justify-content-center align-items-center pb-3 px-1">
            <div className="col-auto">
              <div class="form-check-reverse">
                <input
                  class="form-check-input"
                  type="radio"
                  name="exampleRadios"
                  id="exampleRadios1"
                  value="option1"
                  onClick={(e) => {
                    setDineIn(false);
                  }}
                />
                <label class="form-check-label" for="exampleRadios1">
                  Take Away :
                </label>
              </div>
            </div>
            <div className="col-auto">
              <div class="form-check-reverse">
                <input
                  class="form-check-input"
                  type="radio"
                  name="exampleRadios"
                  id="exampleRadios2"
                  value="option2"
                  onClick={(e) => {
                    setDineIn(true);
                  }}
                />
                <label class="form-check-label" for="exampleRadios2">
                  Dine in :
                </label>
              </div>
            </div>
            {dineIn && (
              <div className="col-auto">
                <lable>Table No :</lable>
              </div>
            )}

            {dineIn && (
              <div className="col-4">
                <select class="form-select" aria-label="Default select example">
                  <option selected>Select Table Number</option>
                  {options &&
                    options.map((e, index) => (
                      <option value={index}>{e}</option>
                    ))}
                </select>
              </div>
            )}
          </div>
          <div className="card-footer border-0">
            <div className="row pe-5 d-flex align-items-center justify-content-end">
              <div className="col-auto pt-2">
                <h5>Total Price :</h5>
              </div>
              <div className="col-2 text-center">
                <div class="border-top my-2"></div>
                <span>LKR 20,500.00</span>
                <div class="border-top mt-1"></div>
                <div class="border-top mt-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
