import fs from "fs";
console.log('here')
// read the JSON file
const data = JSON.parse(fs.readFileSync("./src/data/time_series_metrics.json", "utf-8"));

// print structure
function printStructure(obj, indent = 0) {
  const prefix = " ".repeat(indent);

  if (Array.isArray(obj)) {
    console.log(`${prefix}[Array] (${obj.length} items)`);
    if (obj.length > 0) {
      // show structure of the first element
      printStructure(obj[0], indent + 2);
    }
  } else if (typeof obj === "object" && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        console.log(`${prefix}${key}: [Array] (${value.length} items)`);
        if (value.length > 0) printStructure(value[0], indent + 2);
      } else if (typeof value === "object" && value !== null) {
        console.log(`${prefix}${key}: {Object}`);
        printStructure(value, indent + 2);
      } else {
        console.log(`${prefix}${key}: ${value}`);
      }
    });
  } else {
    console.log(`${prefix}${obj}`);
  }
}

printStructure(data);
