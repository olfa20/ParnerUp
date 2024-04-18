import { useState } from "react";
import { Modal } from "react-bootstrap";

const ImageProblem = ({ imageUrl }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <button
        className="mt-0 btn pt-2 pb-2 ps-3 pe-3 lh-24  ls-3  rounded-xl bg-success font-xssss fw-700 ls-lg text-white "
        onClick={handleShowModal}
        style={{marginLeft:"600px"}}
     
      >
        Show Image
      </button>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={
              imageUrl
                ? "http://localhost:5000/" + imageUrl
                : "https://via.placeholder.com/300x300.png"
            }
            alt="Image"
            className="w-100"
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ImageProblem;
