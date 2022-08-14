function sayHi(name) {
  console.log("2.func:" + name);
  if (name === "ቅወ") {
    return "ሰላም" + name;
  } else if (name === "jack") {
    return "Ma man " + name;
  }
  return "Who u? " + name;
}

module.exports = { sayHi };
