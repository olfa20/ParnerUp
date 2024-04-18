import React, { Component, Fragment, useEffect, useState } from "react";
import Header from "../components/Header";
import Leftnav from "../components/Leftnav";
import Rightchat from "../components/Rightchat";
import Appfooter from "../components/Appfooter";
import Popupchat from "../components/Popupchat";

const Cart = () => {
    const [admins,setAdmins] = useState([])
   
    useEffect(() => {
        const sendRequest = async () => {
          try {
            //fetch
            const response = await fetch(
              `http://localhost:5000`
            );
            const responseData = await response.json();
            if (!response.ok) {
              throw new Error(responseData.message);
            }
            setAdmins(responseData.users);
          } catch (err) {
            console.log(err);
          }
        };
    
        sendRequest();
      }, []);







  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />

      <div className="main-content right-chat-active bg-white">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12 cart-wrapper mb-4">
                <div className="row">
                  <div className="col-lg-12 mb-3">
                    <div className="card p-md-5 p-4 bg-primary-gradiant rounded-3 shadow-xss bg-pattern border-0 overflow-hidden">
                      <div className="bg-pattern-div"></div>
                      <h2 className="display2-size display2-md-size fw-700 text-white mb-0 mt-0">
                        influencer{" "}
                        <span className="fw-700 ls-3 text-grey-200 font-xsssss mt-2 d-block">
                          4 PRODUCT FOUND
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-8 mb-3">
                    <div className="table-content table-responsive" style={{ width: "955px" }}>
                      <table className="table text-center">
                        <thead className="bg-greyblue rounded-3">
                          <tr>
                            <th className="border-0 p-4">&nbsp;</th>
                            <th className="border-0 p-4 text-left">Name</th>
                            <th className="border-0 p-4">Email</th>
                            <th className="border-0 p-4">Phone</th>
                            <th className="border-0 p-4">City</th>
                            <th className="border-0 p-4">Edit</th>
                            <th className="border-0 p-4">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                            
                            {admins.map((admin) => (
                              
                          <tr key={admin._id}>
                            <td className="product-thumbnail text-left ps-0">
                              <img
                                  src={
                                    admin.profileImage
                                      ? "http://localhost:5000/" +   admin.profileImage
                                      : "https://via.placeholder.com/75x100.png"
                                  }
                              

                                alt="Product Thumnail"
                                className="w75 rounded-3"
                              />
                            </td>
                            <td className="product-headline text-left wide-column">
                              <h3>
                                <a
                                  href="/cart"
                                  className="text-grey-900 fw-600 font-xsss"
                                >
                                  {admin.fname} {admin.lname}
                                </a>
                              </h3>
                            </td>
                            <td className="product-p">
                              <span className="product-price-wrapper">
                                <span className="money text-grey-500 fw-600 font-xsss">
                                  <span className="font-xsss">{admin.email}</span> 
                                </span>
                              </span>
                            </td>
                            <td className="product-quantity">
                            <h3>
                                <a
                                  href="/cart"
                                  className="text-grey-900 fw-600 font-xss"
                                >
                                  {admin.phone}
                                </a>
                              </h3>
                            </td>
                            <td className="product-total-price">
                              <span className="product-price-wrapper">
                                <span className="money fmont">
                                  <strong>
                                    <span className="font-xss">{admin.city}</span>
                                  </strong>
                                </span>
                              </span>
                            </td>
                            <td className="product-remove ">
                              <a href="/cart">
                                <i className="ti-pencil-alt font-xs text-grey-500"></i>
                              </a>
                              
                            </td>
                            <td className="product-remove">
                              <a href="/cart">
                                <i className="ti-trash font-xs text-grey-500"></i>
                              </a>
                              
                            </td>
                          </tr>
                            ))}
                          
                        </tbody>
                            
                            
                      </table>
                            
                    </div>
                            
                    {/* <div className="coupon float-left mb-2">
                                                <input type="text" className="input-code form-control h60 p-3" placeholder="Coupon Code.." />
                                                <a href="/cart" className="bg-dark text-white fw-600 text-uppercase font-xssss border-dark border rounded-3 border-size-md d-inline-block w175 p-3 text-center ls-3">Apply Coupon</a>
                                            </div>
                                            <a href="/cart" className="update-cart bg-dark float-right text-white fw-600 text-uppercase font-xssss border-dark border rounded-3 border-size-md d-inline-block w175 p-3 text-center ls-3">Update Cart</a> */}
                  </div>
                  {/* <div className="col-lg-4">
                                            <div className="checkout-payment card border-0 mb-3 bg-greyblue p-4">
                                                <div className="cart-totals">
                                                    <h4 className="mont-font fw-600 font-md mb-5">Cart totals</h4>
                                                    <div className="table-content table-responsive">
                                                        <table className="table order-table">
                                                            <tbody>
                                                                <tr>
                                                                    <td className="font-xsss pt-2 fw-600">Subtotal</td>
                                                                    <td className="font-xssss fw-700 text-grey-600 pt-2 text-right">$196.00</td>  
                                                                </tr>
                                                                <tr>
                                                                    <td className="font-xsss pt-2 fw-600">Shipping</td>
                                                                    <td className="font-xssss fw-700 text-grey-600 pt-2 text-right">
                                                                        <span>Flat rate: $20.00</span>
                                                                    </td>  
                                                                </tr>
                                                                <tr className="order-total">
                                                                    <td className="font-xsss pt-2 fw-600">Total</td>
                                                                    <td className="font-xssss fw-700 text-grey-600 pt-2 text-right">
                                                                        <span className="product-price-wrapper">
                                                                            <span className="money fmont">$226.00</span>
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            <a href="/cart" className="bg-dark float-right text-white fw-600 text-uppercase font-xsss border-dark border rounded-3 border-size-md d-inline-block w-100 p-3 text-center ls-3">Proceed To Checkout</a>
                                        </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Popupchat />
      <Appfooter />
    </Fragment>
  );
};

export default Cart;
