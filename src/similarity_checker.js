const fs = require("fs");

function dotProduct(vecA, vecB) {
  let product = 0;
  for (let i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i];
  }
  return product;
}

function magnitude(vec) {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
}

function sim_checker(docWeightFilePath, queryWeightFilePath, corpusFilePath) {
  const rankedDocuments = {};

  // Read files
  try {
    const jsonStringDoc = fs.readFileSync(docWeightFilePath, "utf8");
    const jsonStringQuery = fs.readFileSync(queryWeightFilePath, "utf8");
    try {
      const documentDataset = JSON.parse(jsonStringDoc);
      const queryDataset = JSON.parse(jsonStringQuery);

      corpusFilePath.forEach((document) => {
        let queryVector = [];
        let docVector = [];

        Object.keys(queryDataset).forEach((word) => {
          queryVector.push(queryDataset[word] || 0);

          if (word in documentDataset) {
            for (let index = 0; index < documentDataset[word].length; index++) {
              const doc = documentDataset[word][index];
              if (document in doc) {
                docVector.push(Object.values(doc)[0]);
                break;
              }
            }

            if (docVector.length < queryVector.length) {
              docVector.push(0);
            }
          } else {
            docVector.push(0);
          }
        });

        let rank =
          dotProduct(queryVector, docVector) /
          (magnitude(queryVector) * magnitude(docVector));

        if (Number.isNaN(rank)) {
          rank = 0;
        }
        rankedDocuments[document] = Math.round(rank * 100);
        // rankedDocuments[document] = rank;
      });

      let sortable = [];
      for (var file in rankedDocuments) {
        if (rankedDocuments[file] > 0) {
          sortable.push([file, rankedDocuments[file]]);
        }
      }

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      if (sortable.length > 20) {
        return sortable.slice(0, 20);
      }
      return sortable;
    } catch (error) {
      console.log("Error parsing JSON string:", error);
    }
  } catch (error) {
    console.log(`Error reading Index files from disk:`, error);
  }
}

module.exports = { sim_checker };
