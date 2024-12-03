import React from "react";

function NameFolderTemp({ handleCancel, handleSaveTemplate, tempName, setTempName }) {
  return (
    <>
      <div className="form-container">
        <div className="folder-temp-container">
          <div className="folder-label">
            <label>Template Name</label>
            <input type="text" placeholder="Template Name" value={tempName} onChange={(e) => setTempName(e.target.value)} />
          </div>
          <div className="folder-table"></div>
        </div>

        <div className="temp_buttons">
          <button className="btn1" onClick={handleSaveTemplate}>
            Save
          </button>
          <button className="btn2" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default NameFolderTemp;
