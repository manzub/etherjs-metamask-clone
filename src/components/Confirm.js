import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function Confirm({ children, onClick, onHide }) {
  const [confirm, setShow] = React.useState(false);

  React.useEffect(() => {
    if(confirm) {
      setShow(false)
      onClick();
      onHide();
    }
  }, [confirm, setShow, onClick, onHide])

  return(<div>
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>No</Button>
        <Button variant="primary" onClick={() => setShow(true)}>Yes</Button>
      </Modal.Footer>
    </Modal>
  </div>)
}