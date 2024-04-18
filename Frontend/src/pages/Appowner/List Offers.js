import React, { Component, Fragment, useEffect, useState } from "react";
import Header from "../../components/Header";
import Leftnav from "../../components/Leftnav";
import Rightchat from "../../components/Rightchat";
import Appfooter from "../../components/Appfooter";
import Popupchat from "../../components/Popupchat";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../shared/authContext";
// import Pagetitlegroup from "../../components/Admin/Pagetitlegroup";
import Search from "../../components/Search/Search";
import Filter from "../../components/Filter";

const ListOffers = () => {
  const [error, setError] = useState(false);
  const [offers, setOffers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const auth = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);
  const [address, setAddress] = useState();
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [categorys, setCategory] = useState([]);
  const [fcategory, setFcategory] = useState(null);
  const [rMinPrise, setRMinPrice] = useState(0);
  const [rMaxPrise, setRMaxPrice] = useState(100000);

  let { id } = useParams();

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        const response = await fetch(`http://localhost:5000/offer/priceRange`);
        const data = await response.json();
        setRMinPrice(data.min);
        setRMaxPrice(data.max);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPriceRange();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/category/all`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        });
        const result = await response.json();
        setCategory(result.categories);
      } catch (err) {
        setError(err);
      }
    };
    fetchCategory();
  }, [auth.token]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/offer/${id}?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const result = await response.json();

      setOffers(result);
      setHasMore(result.length > 0);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const searchOffer = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/offer/search/${search}/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        const result = await response.json();

        setOffers(result.offer);
        setHasMore(false);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (search) {
      searchOffer();
    } else {
      fetchOffers();
    }
  }, [search, auth.token, page, id]);

  const handleSearch = (e) => {
    setSearch(e.target.value.trim().toLowerCase());
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
    setOffers([]);
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/offer/count/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer ",
            },
          }
        );
        const result = await response.json();
        console.log(result);
        setCount(result.count);
      } catch (err) {
        setError(err);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const sendRequest = async () => {
      let filter = null;
      if (address && !fcategory && minPrice && maxPrice && id) {
        filter =
          `http://localhost:5000/offer/filter/priceandaddress/` +
          minPrice +
          "/" +
          maxPrice +
          "/" +
          address +
          "/" +
          id;
      } else if (!address && fcategory && minPrice && maxPrice && id) {
        filter =
          `http://localhost:5000/offer/filter/priceandcategory/` +
          minPrice +
          "/" +
          maxPrice +
          "/" +
          fcategory +
          "/" +
          id;
      } else if (!address && !fcategory && minPrice && maxPrice && id) {
        filter =
          `http://localhost:5000/offer/filter/price/` +
          minPrice +
          "/" +
          maxPrice +
          "/" +
          id;
      } else if (!address && fcategory && !minPrice && !maxPrice && id) {
        filter =
          `http://localhost:5000/offer/filter/category/` + fcategory + "/" + id;
      } else if (address && !fcategory && !minPrice && !maxPrice && id) {
        filter =
          `http://localhost:5000/offer/filter/address/` + address + "/" + id;
      } else if (address && fcategory && !minPrice && !maxPrice && id) {
        filter =
          `http://localhost:5000/offer/filter/addressandcategory/` +
          fcategory +
          "/" +
          address +
          "/" +
          id;
      } else if (address && fcategory && minPrice && maxPrice && id) {
        filter =
          `http://localhost:5000/offer/filter/all/` +
          minPrice +
          "/" +
          maxPrice +
          "/" +
          fcategory +
          "/" +
          address +
          "/" +
          id;
      } /* else {
        filter = `${process.env.REACT_APP_BACKEND_URL}book`;
      } */
      if (filter) {
        try {
          //fetch
          const response = await fetch(filter);
          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.message);
          }
          setOffers(responseData.offers);
        } catch (err) {
          console.log(err);
        }
      }
    };
    sendRequest();
  }, [minPrice, maxPrice, fcategory, address, id]);

  return (
    <Fragment>
      <Header />
      <div className="d-flex flex-row">
        <div className="flex-grow-1">
          <div className="main-content bg-white right-chat-active theme-dark-bg">
            <div className="middle-sidebar-bottom">
              <div className="middle-sidebar-left">
                <div className="row">
                  <div className="col-xl-12 col-xxl-12 col-lg-12" style={{marginLeft:"20px"}}>
                    <div className="row">
                      <div className="col-lg-12" style={{marginLeft:"4px"}}>
                        <div className="card p-md-5 p-4 bg-primary-gradiant rounded-3 shadow-xss bg-pattern border-0 overflow-hidden">
                          <div className="bg-pattern-div"></div>
                          <h2 className="display1-size display2-md-size fw-700 text-white mb-0 mt-0">
                            {count} Offers{" "}
                          </h2>
                        </div>
                      </div>

                      {offers &&
                        offers.map((offer) => (
                          <div key={offer._id} className="col-lg-4 col-md-6">
                            <div className="card w-100 border-0 mt-4">
                              <div
                                className="card-image w-100 p-0 text-center bg-greylight rounded-3 mb-2"
                                style={{ height: "200px", width: "300px" }}
                              >
                                <a href={`/detail/${offer._id}`}>
                                  <img
                                    src={
                                      offer.media
                                        ? "http://localhost:5000/" + offer.media
                                        : "https://via.placeholder.com/300x300.png"
                                    }
                                    alt="product"
                                    className="w-100 mt-0 mb-0 p-5"
                                  
                                  />
                                </a>
                              </div>
                              <div className="card-body w-100 p-0 text-center">
                                <h2 className="mt-2 mb-1">
                                  <a
                                    href="/singleproduct"
                                    className="text-black fw-700 font-xsss lh-26"
                                  >
                                    {offer.title}
                                  </a>
                                </h2>
                                <h6 className="font-xsss fw-600 text-grey-500 ls-2">
                                  {offer.address}
                                </h6>
                              </div>
                            </div>
                          </div>
                        ))}

                      <div className="col-lg-12 mt-3 mb-5 text-center">
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => handleLoadMore()}
                          className="fw-700 text-white font-xssss text-uppercase ls-3 lh-32 rounded-3 mt-3 text-center d-inline-block p-2 bg-current w150"
                        >
                          Load More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-3 col-lg-3 theme-dark-bg">
          <Filter
            address={address}
            minPrice={minPrice}
            maxPrice={maxPrice}
            setAddress={setAddress}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            setFcategory={setFcategory}
            categories={categorys}
            fcategory={fcategory}
            fetchOffers={fetchOffers}
            min={rMinPrise}
            max={rMaxPrise}
          />
        </div>
      </div>
      <Popupchat />
      <Appfooter />
    </Fragment>
  );
};

export default ListOffers;
