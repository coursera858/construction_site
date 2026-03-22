import { useState, useRef, useEffect } from "react";
import { MdMoreVert, MdOutlineRemoveRedEye, MdOutlineEdit, MdDeleteOutline } from "react-icons/md";

const ActionMenu = ({ onView, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the menu if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="action-menu-container" ref={menuRef}>
      <button 
        className={`kebab-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MdMoreVert size={20} />
      </button>

      {isOpen && (
        <div className="action-dropdown">
          {onView && (
            <button onClick={() => { onView(); setIsOpen(false); }}>
              <MdOutlineRemoveRedEye size={16} /> View
            </button>
          )}
          <button onClick={() => { onEdit(); setIsOpen(false); }}>
            <MdOutlineEdit size={16} /> Edit
          </button>
          <button className="delete-btn" onClick={() => { onDelete(); setIsOpen(false); }}>
            <MdDeleteOutline size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;