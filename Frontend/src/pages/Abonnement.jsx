import React, { Component , Fragment, useEffect, useState } from "react";
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Pagetitle from '../components/Pagetitle';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import Pagetitlegroup from "../components/Admin/Pagetitlegroup"
import { useContext } from "react";
import { AuthContext } from "../shared/authContext";
import GoogleMapReact from 'google-map-react';
import { Link } from "react-router-dom";


const Abonnement = () =>{
    const auth = useContext(AuthContext);
    const [error, setError] = useState(false);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState("");
     const [subscriptions, setSubscription] = useState([]);
     const fetchAbonnement = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/abonnement/abonnement`,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + auth.token,
              },
            }
          );
          const result = await response.json();
    
          setSubscription(result.abonnements);
        } catch (err) {
          setError(err);
        }
      };
    
      const handleSearch = async (e) => {
        setSearch(e.target.value.trim().toLowerCase());
      };
    
      useEffect(() => {
        if (auth.userId) {
          fetchAbonnement();
        }
      }, [auth.userId]);
    
      useEffect(() => {
        const searchAbonnement = async () => {
          try {
            const response = await fetch(
              `http://localhost:5000/abonnement/getbytitle/${search}`,
              {
                method: "GET",
                headers: {
                  Authorization: "Bearer " + auth.token,
                },
              }
            );
            const result = await response.json();
    
            setSubscription(result.abonnement);
          } catch (err) {
            setError(err);
          }
        };
    
        if (search) {
          searchAbonnement();
        } else {
          fetchAbonnement();
        }
      }, [search, auth.token]);
      useEffect(() => {
        const fetchCounts = async () => {
          try {
            const response = await fetch(`http://localhost:5000/abonnement/count`, {
              method: "GET",
              headers: {
                Authorization: "Bearer ",
              },
            });
            const result = await response.json();
            console.log(result);
            setCount(result.count);
          } catch (err) {
            setError(err);
          }
        };
    
        fetchCounts();
      }, []);
        return (
            <Fragment> 
                <Header />
              

                <div className="main-content right-chat-active">
                    <div className="middle-sidebar-bottom">
                        <div className="middle-sidebar-left pe-0" >
                            <div className="row">
                                <div className="col-xl-12 chat-left scroll-bar">
                                <Pagetitlegroup
                                 type="text"
                                 placeholder="Search"
                                 className="form-control"
                                 value={search}
                                onChange={handleSearch}
                                 title={`${count} Subscriptions`
                                    }
                                  />
                                    <div className="row ps-2 pe-2">
                                        {subscriptions.map((subscription) => (

                                            <div key={subscription._id} className="col-lg-6 col-md-6 col-sm-6 mb-3 pe-2 ps-2">
                                                <div className="card w-100 p-0 hover-card shadow-xss border-0 rounded-3 overflow-hidden me-1">
                                                
                                                    <div className="card-body pt-0">
                                                        {/* <i className="feather-bookmark font-md text-grey-500 position-absolute right-0 me-3"></i> */}
                                                        <h4 className="fw-700 font-xss mt-0 lh-28 mb-0"><a href="default-hotel-details.html" className="text-dark text-grey-900">{subscription.title}</a></h4>
                                                        <h6 className="font-xsssss text-grey-500 fw-600 mt-0 mb-2"> {subscription.duration}</h6>
                                                        <div className="star d-block w-100 text-left mt-0">
                                                            <img src="assets/images/star.png" alt="star" className="w15 me-1 float-left" />
                                                            <img src="assets/images/star.png" alt="star" className="w15 me-1 float-left" />
                                                            <img src="assets/images/star.png" alt="star" className="w15 me-1 float-left" />
                                                            <img src="assets/images/star.png" alt="star" className="w15 me-1 float-left" />
                                                            <img src="assets/images/star-disable.png" alt="star" className="w15 me-1 float-left me-2" />
                                                        </div>
                                                        <div className="mt-4 w-100"></div>

                                                        <h5 className="mt-3 d-inline-block font-xssss fw-600 text-grey-500"><i className="btn-round-sm bg-greylight ti-credit-card text-grey-500 me-1"></i> {subscription.paymentMethod}</h5>
                                                        <div className="clearfix"></div>
                                                        <span className="font-lg fw-700 mt-0 pe-3 ls-2 lh-32 d-inline-block text-success float-left"><span className="font-xsssss">$</span> {subscription.price} <span className="font-xsssss text-grey-500">/{subscription.duration}</span> </span>
                                                        
                                                       <Link to={`/abonnement/${subscription._id}`}>
                                                        <a className="position-absolute bottom-15 mb-2 right-15"><i className="btn-round-sm bg-primary-gradiant text-white font-sm feather-chevron-right"></i></a>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>

                                        ))}
                                    </div>

                                    
                                </div>

                                {/* <div className="col-xl-6 ps-0 d-none d-xl-block">
                                    <div className="card w-100 border-0 shadow-none rounded-3 border-0 mb-4 overflow-hidden ">
                                        <div style={{ height: '86vh', width: '100%' }}>
                                            <GoogleMapReact
                                            defaultCenter={this.props.center}
                                            defaultZoom={this.props.zoom}
                                            >
                                            <AnyReactComponent
                                                lat={59.955413}
                                                lng={30.337844}
                                                text="My Marker"
                                            />
                                            </GoogleMapReact>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>

                <Popupchat />
                <Appfooter /> 
            </Fragment>
        );
    }


export default Abonnement;