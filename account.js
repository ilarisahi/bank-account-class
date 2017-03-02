/**
 * Created by Ilari Sahi on 22.2.2017.
 */

// Object of possible banks
var banks = {1: "Nordea", 2: "Nordea", 31: "Handelsbanken", 33: "Skandinaviska Enskilda Banken", 34: "Danske Bank", 36: "Tapiola",
                37: "DnB NOR Bank ASA", 38: "Swedbank", 39: "S-Pankki", 4: "Aktia", 5: "OP", 6: "Ålandsbanken", 8: "Sampo"};

// Tests if account belongs to a bank
var testBank = function(x) {
    var bankNumber = x.substring(0,2);
    if (bankNumber[0] == 3) {
        return banks[bankNumber];
    } else {
        return banks[bankNumber[0]];
    }
}

// Formats the account number to electronic format according to the bank it belongs to
var longFormat = function(x, y) {
    var zeros = 14 - (x.length + y.length);
    if (zeros) {
        // Insert correct amount of 0s at correct position
        if (x[0] == 4 || x[0] == 5) {
            return x + y[0] + "0".repeat(zeros) + y.substring(1, y.length);
        } else {
            return x + "0".repeat(zeros) + y;
        }
    } else {
        return x + "" + y;
    }
}

// Check if given check digit matches the one calculated from electronic format
var checkNumber = function (x) {
    var test = x.substring(0,13);
    var check = 0;
    var result = 0;

    // Calculate check value
    for (let i = 0; i < x.length - 1; i++) {
        if (i%2 === 0) {
            j = 2;
        } else {
            j = 1;
        }
        result = test[i]*j;
        if (result > 9) {
            result = result.toString();
            check += parseInt(result[0]) + parseInt(result[1]);
        } else {
            check += result;
        }
        // debugging
        // console.log("checking calculation: " + check);
    }

    check = check.toString();

    // Create checker value (next multiple of 10)
    var checker = ((parseInt(check[0]) + 1 + "0") - check).toString();

    // debugging
    // console.log("check: " + check);
    // console.log("checker: " + checker);

    // Check if check digit matches
    if (checker[checker.length - 1] === x[13]) {
        return true;
    } else {
        return false;
    }
}

// Bank account class
class FinnishBankAccountNumber {
    // Construct object from text format account number
    constructor(short) {
        var parts = short.split('-');
        if (!Number.isNaN(parts[0]) && parts[0].length == 6 && !Number.isNaN(parts[1]) && parts[1].length < 9 && parts[1].length > 1) {
            this.bankName = testBank(parts[0]);
            this.longNumber = longFormat(parts[0], parts[1]);

            if (checkNumber(this.longNumber) && this.bankName) {
                this.validBankAccount = true;
            } else {
                this.validBankAccount = false;
            }
        }
    }
}

// Create content and test if the class works as expected
var accountArray = ["423456-781", "023456-781", "123456-785", "393130-51", "789528-123654", "234333-33", "198432-3434", "323232-323"];
var accountTableBody = document.getElementById("accountTableBody");
var badAccountList = document.getElementById("badAccountList");
var i = 1;

for (let acc of accountArray) {
    console.log("Creating account: " + acc + " ...");
    var fban = new FinnishBankAccountNumber(acc);
    if (fban.validBankAccount) {
        var htmlNode = document.createElement("tr");
        htmlNode.innerHTML = "<th scope='row'>" + i + "</th><td>" + fban.bankName + "</td><td>" + acc + "</td><td>" + fban.longNumber + "</td>";
        accountTableBody.appendChild(htmlNode);
        i++;
    } else {
        var htmlNode = document.createElement("li");
        htmlNode.appendChild(document.createTextNode(acc));
        badAccountList.appendChild(htmlNode);
    }
}