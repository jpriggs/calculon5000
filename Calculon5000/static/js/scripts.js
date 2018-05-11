$(document).ready(function() {

  var re = /([+,\-,/,*])/g;
  var operators = {
    '+': function (x, y) { return x + y },
    '-': function (x, y) { return x - y },
    '/': function (x, y) { return x / y },
    '*': function (x, y) { return x * y }
  };
  var inputString = "";
  var historyArray = [];
  var calcArray = [];
  var sumTotal = 0;
  var isDecimal = false;

  //Shows inital .sum-total value
  $(".sum-total").text("0");

  //***Button click event***
  $(".button").on("click", function() {
    var currVal = $(this).attr("value");

    //Makes sure that a number or decimal button was clicked
    if (!currVal.match(re) && currVal !== "ac" && currVal !== "ce" && currVal !== "=" && inputString.length < 12) {
      if (currVal === ".") {
        checkDecimal(currVal);
      }
      else {
        inputString += currVal;
        //Makes sure that zero is not the first number clicked
        if (inputString.charAt(0) === "0" && inputString.charAt(1) !== ".") {
          inputString = "";
          $(".sum-total").text("0");
        }
        else {
          $(".sum-total").text(inputString);
        }
      }
      //Prevents text overflow of element for too large numbers
      if (getHistory(historyArray) !== "error") {
        $(".history").text(getHistory(historyArray) + inputString);
      }
      else {
        $(".history").text(getHistory(historyArray));
      }

    }
    //Checks if a clear button has been clicked
    if (currVal === "ac" || currVal === "ce") {
      //All Clear clears all array entries and the current number entered
      if (currVal === "ac") {
        calcArray = [];
        historyArray = [];
        $(".sum-total").text("0");
        $(".history").text("");
      }
      //Clear Entry clears the last operator entered and the current number entered, retains sum total
      else if (currVal === "ce") {
        if (calcArray.length > 1) {
          calcArray.splice(-1, 1);
          historyArray.splice(-1, 1);
        }
        $(".sum-total").text(calcArray[0]);
        $(".history").text(getHistory(historyArray));
      }
      inputString = "";
      isDecimal = false;
    }

    //Checks if an operator button was clicked and not the equal button
    if (currVal.match(re) && currVal !== "=") {
      //Start/Reset state
      //Makes sure the array is empty before adding the initial number followed by an operator
      if (inputString !== "" && calcArray.length === 0) {
        calcArray.push(inputString, currVal);
        currVal = convertMultDivSymbol(currVal);
        historyArray.push(inputString, currVal);
        $(".history").text(getHistory(historyArray));
      }
      //Cleared Entry state
      //In the event of a cleared entry, only a number should exist in the array and an operator is added
      else if (calcArray.length === 1) {
        calcArray.push(currVal);
        currVal = convertMultDivSymbol(currVal);
        historyArray.push(currVal);
        $(".history").text(getHistory(historyArray));
      }
      //Complete formula state
      //Makes sure a number, operator, number exist in the array before executing the calculation
      else if (inputString !== "" && calcArray.length === 2) {
        calcArray.push(inputString);
        sumTotal = calculateFormula(calcArray);
        calcArray = [];
        calcArray.push(sumTotal, currVal);
        currVal = convertMultDivSymbol(currVal);
        historyArray.push(inputString, currVal);
        $(".sum-total").text(sumTotal);
        $(".history").text(getHistory(historyArray));
      }
      inputString = "";
      isDecimal = false;
    }
    //Final calculation state
    //Checks if the equal button is pressed
    if (currVal === "=") {
      //Makes sure that the final (rounded) value in the array is a number, not an operator
      if (inputString !== "" && calcArray.length === 2) {
        calcArray.push(inputString);
        historyArray.push(inputString);
        sumTotal = calculateFormula(calcArray);
        sumTotal = parseFloat(sumTotal);
        $(".sum-total").text(sumTotal);
        $(".history").text(getHistory(historyArray));
      }
      else {
        $(".sum-total").text(calcArray[0]);
      }
      inputString = "";
      calcArray = [];
      historyArray = [];
      $(".history").text("");
    }
  });

  //Sanitizes location and amount of decimals in the string
  function checkDecimal(val) {
    //Checks if a decimal already exist in the string
    if (!isDecimal) {
      isDecimal = true;
      //Adds a leading zero if a decimal is the first character in the string
      if (inputString === "") {
        inputString = "0" + val;
      }
      else {
        inputString += val;
      }
    }
    //Prevents more than one decimal to be added per string
    else if (isDecimal) {
      inputString += "";
    }
    return inputString;
  }

  //Checks the array and calculates the formula
  function calculateFormula(arr) {
    var subTotal = 0;
    subTotal = (operators[arr[1]](parseFloat(arr[0]), parseFloat(arr[2]))).toString();
    var decimalIndex = subTotal.indexOf(".");

    //Converts too large positive numbers to exponential format
    if (subTotal.length > 12) {
      subTotal = parseFloat(subTotal).toExponential(2);
    }
    //Checks if the calculated value is a float and should be truncated
    if (decimalIndex !== -1 && parseFloat(subTotal) >= 1) {
      subTotal = parseFloat((subTotal * 10000) / 10000);
    }
    return subTotal;
  }

  //Converts the multiply and divide operators to their math symbols for the .history element
  function convertMultDivSymbol(val) {
    if (val === "*") {
      val = "\u00d7";
    }
    if (val === "/") {
      val = "\u00f7";
    }
    return val;
  }

  //Converts the history array to a string
  function getHistory(arr) {
    //Removes the first number and operator if history becomes too long
    while (arr.join("").length > 17) {
      arr.splice(0, 2);
    }
    return arr.join("");
  }
});
