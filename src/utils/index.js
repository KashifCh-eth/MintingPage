export function multiply(a, b) {

    let isASingleDigit = 0, isBSingleDigit = 0;
    if (a < 9) { a *= 10; isASingleDigit = 1 }
    if (b < 9) { b *= 10; isBSingleDigit = 1 }
    //First step is to seperate a & b into arrays so that we are only dealing with 7 digits at a time 

    let lengthOfA = a.length,
        lengthOfB = b.length,
        aInArry = [],
        bInArry = [];

    console.log(a, b);

    while (a.length > 7) {
        aInArry.push(a.substring(a.length - 7, a.length));
        a = a.substring(0, a.length - 7)
    }
    aInArry.push(a)

    while (b.length > 7) {
        bInArry.push(b.substring(b.length - 7, b.length));
        b = b.substring(0, b.length - 7)
    }
    bInArry.push(b)


    aInArry = aInArry.reverse();
    bInArry = bInArry.reverse();
    console.log(aInArry, bInArry)

    //Second step is to multiply the 2 arrays with each other

    let answerLines = [];

    for (var i = aInArry.length - 1, j = 0; i >= 0; i--, j++) {
        answerLines[j] = bInArry.map((n) => n * aInArry[i] === NaN ? '0000000' : n * aInArry[i]);
        //this is to ensure the array takes into account that the second row of the matrix should be followed by 7 x "o's" and the third by 14, and so on.
        var k = 0;
        while (k < j) {
            answerLines[j].push(0);
            k += 1
        }
    }
    console.log(answerLines)


    //Third step is to add the columns of the answer lines into an new array
    var answerInArray = answerLines[answerLines.length - 1];

    for (var j = 1; j < answerInArray.length; j++) {
        for (var i = 0; i < answerLines.length - 1; i++) {
            if (answerLines[i].length >= j) {
                answerInArray[answerInArray.length - j] += answerLines[i][answerLines[i].length - j]
            }
        }
    }

    console.log(answerInArray)

    //Fourth step is to make sure each element is only 7 digits long and the additional digits are added to the prevoius element

    let answerIn7DigitBlocksArray = []

    for (var i = 0; i < answerInArray.length; i++) {
        answerIn7DigitBlocksArray.push('')
    }

    for (var i = 1; i <= answerInArray.length; i++)
        if (i !== answerInArray.length) {
            answerIn7DigitBlocksArray[answerIn7DigitBlocksArray.length - i] = answerInArray[answerInArray.length - i].toString().substring(answerInArray[answerInArray.length - i].toString().length - 7, answerInArray[answerInArray.length - i].toString().length);
            answerInArray[answerInArray.length - i - 1] += parseInt(answerInArray[answerInArray.length - i].toString().substring(0, answerInArray[answerInArray.length - i].toString().length - 7))
        } else
            answerIn7DigitBlocksArray[0] = answerInArray[0]



    console.log(answerIn7DigitBlocksArray)

    //Lastly join the array into a string
    console.log(a, b)
    if (isASingleDigit) { answerIn7DigitBlocksArray[answerIn7DigitBlocksArray.length - 1] /= 10 }
    if (isBSingleDigit) { answerIn7DigitBlocksArray[answerIn7DigitBlocksArray.length - 1] /= 10 }


    return answerIn7DigitBlocksArray.join('')
}