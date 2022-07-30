import React, { useState } from "react";
import { generateNewColor, invertColor } from "../utils/helper";
import "./styles.css";

const DisplayFamilyTree = ({
  family,
  setCurrFamily,
  familyColors,
  color = null,
  setShowAddChildModal,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showAddBtnForLeaf, setShowAddBtnForLeaf] = useState(false);

  const showName = ({ childNo, name }) => {
    return childNo ? `${childNo}. ${name}` : name;
  };

  const familyColor =
    familyColors[`${family.name}${family.spouse}`] ||
    familyColors[`${family.spouse}${family.name}`] ||
    color ||
    generateNewColor();

  familyColors[`${family.name}${family.spouse}`] = familyColor;

  const nameColor = invertColor(familyColor, true);

  const renderAddBtn = () => {
    return (
      <>
        <div
          className="d-flex justify-content-center align-items-center familyTree__addBtn"
          style={{
            width: 20,
            height: 20,
            cursor: "pointer",
            border: `2px solid ${nameColor}`,
            borderRadius: "50%",
            position: "relative",
          }}
          onClick={() => {
            setCurrFamily(family);
            setShowAddChildModal(true);
          }}
        >
          <i className="fa fa-plus" aria-hidden="true"></i>
        </div>
        <div className="tooltipDiv">Add a child</div>
      </>
    );
  };

  if (isOpen && family.children?.length) {
    return (
      <div
        className="d-flex flex-column align-items-center m-auto p-2 rounded-3 text-nowrap overflow-auto"
        style={{
          width: "fit-content",
          border: `2px solid ${nameColor}`,
          backgroundColor: familyColor,
          color: nameColor,
          position: "relative",
        }}
      >
        <h4 className="p-0 m-0">
          {showName({ childNo: family.childNo, name: family.name })}
        </h4>
        {family?.spouse && <h5>{family?.spouse}</h5>}
        <div
          style={{
            height: 20,
            width: 2,
            background: nameColor,
          }}
        ></div>
        {renderAddBtn()}
        <div
          className="d-flex"
          style={{
            borderTop: `2px solid ${nameColor}`,
          }}
        >
          {family.children
            .sort((first, second) => first.childNo - second.childNo)
            .map((child, index, children) => (
              <div
                key={`${child.childNo}--${child.name}--${child.spouse}--${child.children?.length}`}
                className="d-flex flex-column align-items-center"
              >
                <div
                  style={{
                    height: 20,
                    width: 2,
                    background: nameColor,
                  }}
                ></div>
                <div
                  className="familyTree__triangleDown"
                  style={{
                    borderTop: `8px solid ${nameColor}`,
                  }}
                ></div>
                <div
                  key={`${child.name}_${child.spouse}`}
                  className={index === children.length - 1 ? "" : "me-3"}
                >
                  <DisplayFamilyTree
                    family={child}
                    setCurrFamily={setCurrFamily}
                    color={child.isMale ? familyColor : null}
                    familyColors={familyColors}
                    setShowAddChildModal={setShowAddChildModal}
                  />
                </div>
              </div>
            ))}
        </div>
        <button
          className="mt-3 cursor-pointer border-0 rounded-3"
          onClick={() => setIsOpen((isOpen) => !isOpen)}
        >
          Hide Family
        </button>
      </div>
    );
  }
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ position: "relative" }}
      onMouseEnter={() => {
        if (family.spouse && !family.children?.length) {
          setShowAddBtnForLeaf(true);
        }
      }}
      onMouseLeave={() => {
        if (showAddBtnForLeaf) setShowAddBtnForLeaf(false);
      }}
    >
      {family.spouse || family.children?.length ? (
        <h4 className="p-0 m-0">
          {showName({ childNo: family.childNo, name: family.name })}
        </h4>
      ) : (
        <div>{showName({ childNo: family.childNo, name: family.name })}</div>
      )}
      {family?.spouse && (!family.children || !family.children.length) && (
        <h5>{family?.spouse}</h5>
      )}
      {showAddBtnForLeaf && renderAddBtn()}
      {family.children?.length && (
        <button
          className="mt-1 p-1 px-2 cursor-pointer border-0 rounded-3"
          onClick={() => setIsOpen((isOpen) => !isOpen)}
        >
          Show Family
        </button>
      )}
    </div>
  );
};

export default DisplayFamilyTree;
