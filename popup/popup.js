/**
 * Monitor clicks on the popup,
 * and send it to another script so it can save the sentence in a local database
 */

function listenForClicks() {
  document.addEventListener("click", (event) => {
    // just verify if the send button was clicked
    function verifyIfIsButton(target) {
      return target.id === "send";
    }

    //return an element value
    function getTextFromElement(id) {
      let element = document.querySelector(id);
      let text = element.value;
      return text;
    }
    // Send correct information to content script file
    function saveSentence(tabs) {
      let sentence = getTextFromElement("#sentence");
      let word = getTextFromElement("#word");
      //   window.alert(`Sentence: ${sentence}\nWord: ${word}`);
      browser.tabs.sendMessage(tabs[0].id, {
        command: "save",
        sentence: sentence,
        word: word,
      });
    }

    function reportError(error) {
      console.error(`Could not execute ${error}`);
    }

    if (verifyIfIsButton(event.target)) {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(saveSentence)
        .catch(reportError);
    }
  });
}

function reportExecuteScriptError(error) {
  window.alert("An Error occurred!");
  console.error(
    `Failed to execute sentence scraper content script: ${error.message}`
  );
}

browser.tabs
  .executeScript({ file: "/content_scripts/index.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
