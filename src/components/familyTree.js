import React, { useState } from "react";
import { bejjipuramFamily } from "../constants/bejjipuramFamilyData";
import { babbadiFamily } from "../constants/babbadiFamilyData";

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
        style={{
          display: "flex",
          flexDirection: "column",
          width: "fit-content",
          margin: "auto",
          border: `1px solid ${nameColor}`,
          overflow: "auto",
          whiteSpace: "nowrap",
          backgroundColor: familyColor,
          color: nameColor,
          padding: 10,
          borderRadius: 15,
        }}
      >
        <h4 style={{ padding: 0, margin: 0 }}>
          {showName({ childNo: family.childNo, name: family.name })}
        </h4>
        {family?.spouse && <div>{family?.spouse}</div>}
        <div style={{ display: "flex", margin: 10 }}>
          {family.children
            .sort((first, second) => first.childNo - second.childNo)
            .map((child, index, children) => (
              <div
                key={`${child.name}_${child.spouse}`}
                style={{
                  marginRight: index !== children.length - 1 ? "20px" : 0,
                }}
              >
                <DisplayFamilyTree
                  family={child}
                  color={child.isMale ? familyColor : null}
                  familyColors={familyColors}
                />
              </div>
            ))}
        </div>
        <button
          style={{
            height: 30,
            marginTop: 5,
            cursor: "pointer",
            border: "none",
            borderRadius: 10,
          }}
          onClick={() => setIsOpen((isOpen) => !isOpen)}
        >
          Hide Family
        </button>
      </div>
    );
  }
  return (
    <div>
      {family.spouse ? (
        <h4 style={{ padding: 0, margin: 0 }}>
          {showName({ childNo: family.childNo, name: family.name })}
        </h4>
      ) : (
        <div>{showName({ childNo: family.childNo, name: family.name })}</div>
      )}
      {family?.spouse && (!family.children || !family.children.length) && (
        <div>{family?.spouse}</div>
      )}
      {family.children?.length && (
        <button
          style={{
            height: 30,
            marginTop: 5,
            cursor: "pointer",
            border: "none",
            borderRadius: 10,
          }}
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
    <div style={{ marginTop: 10 }}>
      <button
        style={{
          height: 30,
          marginRight: 10,
          cursor: "pointer",
          border: "none",
          borderRadius: 10,
        }}
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
        style={{
          height: 30,
          cursor: "pointer",
          border: "none",
          borderRadius: 10,
        }}
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
        <div style={{ marginTop: 15 }}>
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