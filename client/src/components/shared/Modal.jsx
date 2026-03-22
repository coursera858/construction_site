import { MdClose } from "react-icons/md";

const Modal = ({ isOpen, setIsOpen, children }) => {
    if (!isOpen) return null; 
    console.log("modal rendered")
    const handleOverlayClick = (e) => {
        if (e.target.className === "modal-holder") {
            setIsOpen(false);
        }
    };

    return (
        <div className="modal-holder" onClick={handleOverlayClick}>
            <div className="modal">
                <div className="close">
                    <MdClose onClick={() => setIsOpen(false)} />
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal