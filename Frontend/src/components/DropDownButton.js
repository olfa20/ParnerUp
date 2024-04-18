import React, { useState } from "react";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { DropdownButton, Dropdown } from "react-bootstrap";

const DropdownIcon = () => {
  return (
    <>
    <DropdownButton id="dropdown-basic-button" title="Dropdown">
      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
    </DropdownButton>
    <FontAwesomeIcon icon={faChevronDown} />
    </>
  );
};


export default DropdownButton;
