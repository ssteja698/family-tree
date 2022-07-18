import React from "react";
import { family } from "../constants/familyData";

const FamilyTree = () => {
  const familyColors = {};

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

  const displayFamilyTree = ({ family, color = null }) => {
    const familyColor =
      familyColors[`${family.name}${family.spouse}`] ||
      familyColors[`${family.spouse}${family.name}`] ||
      color ||
      generateNewColor();

    familyColors[`${family.name}${family.spouse}`] = familyColor;

    if (family.children?.length) {
      const nameColor = invertColor(familyColor, true);
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            border: `1px solid ${nameColor}`,
            overflow: "auto",
            whiteSpace: "nowrap",
            backgroundColor: familyColor,
            color: nameColor,
          }}
        >
          <div>{family.name}</div>
          {family?.spouse && <div>{family?.spouse}</div>}
          <div style={{ display: "flex", margin: "10px 20px 5px" }}>
            {family.children.map((child, index, children) => (
              <div
                key={child.name}
                style={{
                  marginRight: index !== children.length - 1 ? "20px" : 0,
                }}
              >
                {displayFamilyTree({
                  family: child,
                  color: child.isMale ? familyColor : null,
                })}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div>
        <div>{family.name}</div>
        {family?.spouse && <div>{family?.spouse}</div>}
      </div>
    );
  };

  return <div>{displayFamilyTree({ family })}</div>;
};

export default FamilyTree;
