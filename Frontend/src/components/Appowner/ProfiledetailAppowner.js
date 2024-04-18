import React,{Component} from 'react';
import { SlCallEnd } from "react-icons/sl";

const ProfiledetailAppowner =({description,phone,location}) =>  {
    

        return (
  
            
            <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
                <div className="card-body d-block p-4">
                    <h4 className="fw-700 mb-3 font-xsss text-grey-900">About</h4>
                    <p className="fw-500 text-grey-500 lh-24 font-xssss mb-0">{description}</p>
                </div>
                <div className="card-body border-top-xs d-flex">
                <i className="feather-phone text-grey-500 me-3 font-lg"></i>
                    <h4 className="fw-700 text-grey-900 font-xssss mt-0">{phone} <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500"></span></h4>
                </div>

                <div className="card-body d-flex pt-0">
                <i className="feather-map-pin text-grey-500 me-3 font-lg"></i>
                    <h4 className="fw-700 text-grey-900 font-xssss mt-0">{location} <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500"></span></h4>
                </div>
               
            </div>
        );
    }

export default ProfiledetailAppowner;