import React, { useState } from "react";
import { bejjipuramFamily } from "../constants/bejjipuramFamilyData";
import { babbadiFamily } from "../constants/babbadiFamilyData";
import "./familyTree.css";

function generateNewColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

function invertColor(hex, bw) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#ffffff";
  }
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

const DisplayFamilyTree = ({ family, familyColors, color = null }) => {
  const [isOpen, setIsOpen] = useState(false);

  const showName = ({ childNo, name }) => {
    return childNo ? `${childNo}. ${name}` : name;
  };

  const familyColor =
    familyColors[`${family.name}${family.spouse}`] ||
    familyColors[`${family.spouse}${family.name}`] ||
    color ||
    generateNewColor();

  familyColors[`${family.name}${family.spouse}`] = familyColor;

  if (isOpen && family.children?.length) {
    const nameColor = invertColor(familyColor, true);
    return (
      <div
        className="d-flex flex-column align-items-center m-auto p-2 rounded-3 text-nowrap overflow-auto"
        style={{
          width: "fit-content",
          border: `2px solid ${nameColor}`,
          backgroundColor: familyColor,
          color: nameColor,
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
        <div
          className="d-flex"
          style={{
            borderTop: `2px solid ${nameColor}`,
          }}
        >
          {family.children
            .sort((first, second) => first.childNo - second.childNo)
            .map((child, index, children) => (
              <div className="d-flex flex-column align-items-center">
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
                    color={child.isMale ? familyColor : null}
                    familyColors={familyColors}
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
    <div>
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

const FamilyTree = () => {
  const familyColors = {};
  const [showBejjipuramFamily, setShowBejjipuramFamily] = useState(false);
  const [showBabbadiFamily, setShowBabbadiFamily] = useState(false);

  return (
    <div className="mt-2">
      <button
        className="mt-2 me-3 p-1 px-2 cursor-pointer border-0 rounded-3"
        onClick={() =>
          setShowBejjipuramFamily((showBejjipuramFamily) => {
            if (!showBejjipuramFamily) {
              setShowBabbadiFamily(false);
            }
            return !showBejjipuramFamily;
          })
        }
      >
        {showBejjipuramFamily ? "Hide" : "Show"} Bejjipuram Family
      </button>
      <button
        className="p-1 px-2 cursor-pointer border-0 rounded-3"
        onClick={() =>
          setShowBabbadiFamily((showBabbadiFamily) => {
            if (!showBabbadiFamily) {
              setShowBejjipuramFamily(false);
            }
            return !showBabbadiFamily;
          })
        }
      >
        {showBabbadiFamily ? "Hide" : "Show"} Babbadi Family
      </button>

      {(showBabbadiFamily || showBejjipuramFamily) && (
        <div className="mt-3">
          <DisplayFamilyTree
            family={showBabbadiFamily ? babbadiFamily : bejjipuramFamily}
            familyColors={familyColors}
          />
        </div>
      )}
    </div>
  );
};

export default FamilyTree;
