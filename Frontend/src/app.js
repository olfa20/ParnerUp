import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./main.scss";

import Home from "./pages/Home";
import Recommondation from "./pages/RecommondationInfluencer";
import Group from "./pages/FilterInfluencers";
import Event from "./pages/Events";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import PosteInformationApp from "./pages/Poste/PosteInformation";
import Socialaccount from "./pages/Socialaccount";
import Password from "./pages/Password";
import Notification from "./pages/Appowner/Notification";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Notfound from "./pages/Notfound";
import ListOffers from "./pages/Appowner/List Offers";
import DetailOffer from "./pages/Appowner/DetailOffer";
import Cart from "./pages/Admin/Cart";
import Chat from "./pages/Chat";
import Problems from "./pages/Admin/Problems";
import Offer from "./pages/Offer";
import Abonnement from "./pages/Abonnement";
import Comingsoon from "./pages/Comingsoon";
import Reset from "./pages/Reset";
import ProfileInfluencer from "./pages/ProfileInfluencer";
import Authorpage from "./pages/Appowner/Authorpage";
import DetailAbonnement from "./pages/DetailAbonnement";
import Analytics from "./pages/Analytics";
import { AuthContext } from "../src/shared/authContext";
import ResultSearch from "./pages/ResultSearch";
import ProfileSearch from "./pages/ProfileSearch";
import { useAuth } from "./shared/authHook";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import EmailVerify from "./pages/EmailVerify";
import "./style.css";
import PosteInformation from "./pages/Poste/PosteInformation";
import Messagerie from "./pages/Messagerie";
import CreatePost from "./pages/CreatePost";
import UpdatePhotoCouverture from "./pages/UpdatePhotoCouverture";
import AccountApp from "./pages/Appowner/AccountApp";
import PasswordApp from "./pages/Appowner/PasswordApp";
import EditOffer from "./pages/Appowner/EditOffer";
import CreateOffer from "./pages/Appowner/CreateOffer";
import UpdateCouverture from "./pages/Appowner/UpdateCouverture";
import ProfileSearchapp from "./pages/Appowner/ProfileSearchApp.js";
import OfferSearch from "./pages/Appowner/OfferSearch";
import NotificationINF from "./pages/NotificationInf";
import CondidatAccepted from "./pages/Appowner/CondidatAccepted";
import Favorite from "./pages/Favorite";
import appownercart from "./pages/Admin/AppownerCart";
import AdminCart from "./pages/Admin/AdminCart";
import AddAdmin from "./pages/Admin/AddAdmin";
import AllAbonnement from "./pages/Admin/AllAbonnement";
import EditAbonnement from "./pages/Admin/EditAbonnement";
import AddAbonnement from "./pages/Admin/AddAbonnement";
import AccountAdmin from "./pages/Admin/AccountAdmin";
import PasswordAdmin from "./pages/Admin/passwordAdmin";
import SignaleProblem from "./pages/SignaleProblem";
import Category from "./pages/Admin/AllCategory";
import EditCategory from "./pages/Admin/EditCategory";
import AddCategory from "./pages/Admin/AddCategory";
import Content from "./pages/Admin/AllContent";
import AddContent from "./pages/Admin/AddContent";
import EditContent from "./pages/Admin/EditContent";
import Public from "./pages/Admin/AllPublic";
import EditPublic from "./pages/Admin/EditPublic";
import AddPublic from "./pages/Admin/AddPublic";
import AllAudience from "./pages/Admin/AllAudience";
import AddAudience from "./pages/Admin/AddAudience";
import EditAudience from "./pages/Admin/EditAudience";
import Note from "./pages/Note";
import EditNote from "./pages/EditNote";
import CreateNote from "./pages/CreateNote";
import Review from "./pages/Appowner/Review";
import AllCategoriesNote from "./pages/Admin/AllCategoriesNotes";
import EditCategoryNote from "./pages/Admin/EditCategoriesNote";
import AddCategoryNote from "./pages/Admin/AddcategorysNote";
import DetailOfferApp from "./pages/Appowner/DetailOfferApp";
import Advanced from "./pages/Advanced";
import AllAdvanced from "./pages/Admin/AllAdvanced";
import AddAdvanced from "./pages/Admin/AddAdvanced";
import EditAdvanced from "./pages/Admin/EditAdvanced";
import Collaboration from "./pages/Collaboration";

const App = () => {
  const { token, login, logout, userId, userType } = useAuth();

  let routes;
  if (token && userType == "influencer") {
    routes = (
      <Switch>
        <Route exact path="/" component={Home} />

        <Route exact path="/messages" component={Messagerie} />

        <Route exact path="/defaultsettings" component={Settings} />

        <Route exact path="/accountinformation" component={Account} />

        <Route exact path="/socialaccount" component={Socialaccount} />
        <Route exact path="/password" component={Password} />

        <Route exact path="/defaultnoti" component={NotificationINF} />
        <Route exact path="/notfound" component={Notfound} />
        <Route exact path="/comingsoon" component={Comingsoon} />
        <Route exact path="/offer/:id" component={ListOffers} />

        <Route exact path="/detail/:offerId" component={DetailOffer} />

        <Route exact path="/defaultmessage/:id" component={Chat} />

        <Route exact path="/abonnement" component={Abonnement} />

        <Route exact path="/userpage" component={ProfileInfluencer} />
        <Route exact path="/authorpage" component={Authorpage} />

        <Route exact path="/search/:name" component={ResultSearch} />
        <Route exact path="/profile/:id" component={ProfileSearch} />

        <Route
          exact
          path="/postinformation/:postId"
          component={PosteInformation}
        />
        <Route exact path="/createpost" component={CreatePost} />
        <Route
          exact
          path="/photocouverture"
          component={UpdatePhotoCouverture}
        />
        <Route exact path="/profileappowner/:id" component={ProfileSearchapp} />
        <Route exact path="/editoffer/:offerId" component={EditOffer} />
        <Route exact path="/favorite" component={Favorite} />
        <Route exact path="/problem" component={SignaleProblem} />
        <Route exact path="/events" component={Event} />
        <Route exact path="/note" component={Note} />
        <Route exact path="/editnote/:noteId" component={EditNote} />
        <Route exact path="/createnote" component={CreateNote} />
        <Route exact path="/review/:id" component={Review} />
        <Route exact path="/advanced" component={Advanced} />

        <Route exact path="/collaboration" component={Collaboration} />
        <Route exact path="*" component={Home} />
      </Switch>
    );
  } else if (token && userType == "appowner") {
    routes = (
      <Switch>
        <Route exact path="/comingsoon" component={Comingsoon} />
        <Route exact path="/" component={Home} />
        <Route exact path="/defaultgroup" component={Group} />
        <Route exact path="/profile/:id" component={ProfileSearch} />
        <Route exact path="/search/:name" component={ResultSearch} />
        <Route exact path="/userpage" component={Authorpage} />
        <Route exact path="/defaultsettings" component={Settings} />
        <Route exact path="/accountinformation" component={AccountApp} />
        <Route exact path="/password" component={PasswordApp} />
        <Route exact path="/editoffer/:offerId" component={EditOffer} />
        <Route exact path="/messages" component={Messagerie} />
        <Route exact path="/createoffer" component={CreateOffer} />
        <Route exact path="/defaultmessage/:id" component={Chat} />
        <Route exact path="/photocouverture" component={UpdateCouverture} />
        <Route exact path="/createpost" component={CreatePost} />
        <Route exact path="/profileappowner/:id" component={ProfileSearchapp} />
        <Route exact path="/defaultnoti" component={Notification} />
        <Route exact path="/notfound" component={Notfound} />
        <Route exact path="/socialaccount" component={Socialaccount} />
        <Route exact path="/condidat" component={CondidatAccepted} />
        <Route exact path="/abonnement" component={Abonnement} />
        <Route exact path="/abonnement/:id" component={DetailAbonnement} />
        <Route exact path="/detailoffer/:offerId" component={DetailOfferApp} />
        <Route exact path="/offer/:id" component={ListOffers} />
        <Route exact path="/defaultevent/:id" component={Offer} />
        <Route exact path="/review/:id" component={Review} />
        <Route exact path="/review/:id" component={Review} />
        <Route exact path="/advanced" component={Advanced} />
        Badge
        <Route exact path="/recommendation" component={Recommondation} />
        <Route
          exact
          path="/postinformation/:postId"
          component={PosteInformationApp}
        />
        <Route exact path="/problem" component={SignaleProblem} />
        <Route exact path="*" component={Home} />
      </Switch>
    );
  } else if (token && userType == "admin") {
    routes = (
      <Switch>
        <Route exact path="/comingsoon" component={Comingsoon} />

        <Route exact path="/profile/:id" component={ProfileSearch} />
        <Route exact path="/search/:name" component={ResultSearch} />
        <Route exact path="/defaultsettings" component={Settings} />
        <Route exact path="/profileappowner/:id" component={ProfileSearchapp} />
        <Route exact path="/notfound" component={Notfound} />

        <Route exact path="/" component={AccountAdmin} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/appowner" component={appownercart} />
        <Route exact path="/admin" component={AdminCart} />
        <Route exact path="/addadmin" component={AddAdmin} />
        <Route exact path="/abonnement" component={AllAbonnement} />
        <Route exact path="/editabonnement/:id" component={EditAbonnement} />
        <Route exact path="/addabonnement" component={AddAbonnement} />
        <Route exact path="/accountinformation" component={AccountAdmin} />
        <Route exact path="/password" component={PasswordAdmin} />
        <Route exact path="/defaultanalytics" component={Analytics} />
        <Route exact path="/problem" component={Problems} />
        <Route exact path="/category" component={Category} />
        <Route exact path="/add" component={AddCategory} />
        <Route exact path="/editcategory/:id" component={EditCategory} />
        <Route exact path="/content" component={Content} />
        <Route exact path="/addcontent" component={AddContent} />
        <Route exact path="/editcontent/:id" component={EditContent} />
        <Route exact path="/public" component={Public} />
        <Route exact path="/editpublic/:id" component={EditPublic} />
        <Route exact path="/addpublic" component={AddPublic} />
        <Route exact path="/audience" component={AllAudience} />
        <Route exact path="/addaudience" component={AddAudience} />
        <Route exact path="/editaudience/:id" component={EditAudience} />

        <Route
          exact
          path="/:userType/:id/verify/:token"
          component={EmailVerify}
        />

        <Route exact path="*" component={Cart} />
      </Switch>
    );
  } else if (token && userType == "superadmin") {
    routes = (
      <Switch>
        <Route exact path="/comingsoon" component={Comingsoon} />

        <Route exact path="/profile/:id" component={ProfileSearch} />
        <Route exact path="/search/:name" component={ResultSearch} />
        <Route exact path="/defaultsettings" component={Settings} />
        <Route exact path="/profileappowner/:id" component={ProfileSearchapp} />
        <Route exact path="/notfound" component={Notfound} />

        <Route exact path="/" component={Analytics} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/appowner" component={appownercart} />
        <Route exact path="/admin" component={AdminCart} />
        <Route exact path="/addadmin" component={AddAdmin} />
        <Route exact path="/abonnement" component={AllAbonnement} />
        <Route exact path="/editabonnement/:id" component={EditAbonnement} />
        <Route exact path="/addabonnement" component={AddAbonnement} />
        <Route exact path="/accountinformation" component={AccountAdmin} />
        <Route exact path="/password" component={PasswordAdmin} />
        <Route exact path="/defaultanalytics" component={Analytics} />
        <Route exact path="/problem" component={Problems} />
        <Route exact path="/category" component={Category} />
        <Route exact path="/add" component={AddCategory} />
        <Route exact path="/editcategory/:id" component={EditCategory} />
        <Route exact path="/content" component={Content} />
        <Route exact path="/addcontent" component={AddContent} />
        <Route exact path="/editcontent/:id" component={EditContent} />
        <Route exact path="/public" component={Public} />
        <Route exact path="/editpublic/:id" component={EditPublic} />
        <Route exact path="/addpublic" component={AddPublic} />
        <Route exact path="/audience" component={AllAudience} />
        <Route exact path="/addaudience" component={AddAudience} />
        <Route exact path="/editaudience/:id" component={EditAudience} />
        <Route exact path="/categoriesnote" component={AllCategoriesNote} />
        <Route
          exact
          path="/editcategorynote/:id"
          component={EditCategoryNote}
        />
        <Route exact path="/addcategory" component={AddCategoryNote} />
        <Route exact path="/alladvanced" component={AllAdvanced} />
        <Route exact path="/addadvanced" component={AddAdvanced} />
        <Route exact path="/editadvanced/:id" component={EditAdvanced} />

        <Route
          exact
          path="/:userType/:id/verify/:token"
          component={EmailVerify}
        />
        <Route exact path="*" component={Analytics} />
      </Switch>
    );
  } 
  else {
    routes = (
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/comingsoon" component={Comingsoon} />
        <Route exact path="/forgot" component={Forgot} />
        <Route exact path="/notfound" component={Notfound} />
        <Route exact path="/password-reset/:id/:token" component={Reset} />
        <Route
          exact
          path="/:userType/:id/verify/:token"
          component={EmailVerify}
        />

        <Route exact path="*" component={Login} />
      </Switch>
    );
  }
  return (
    <BrowserRouter basename={"/"}>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          userId: userId,
          token: token,
          login: login,
          logout: logout,
          userType: userType,
        }}
      >
        {routes}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default App;
