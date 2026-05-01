let input = document.getElementById('search-input');
let form = document.getElementById('search-form');
let resultContainer = document.getElementById('result-container');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    let word = input.value.trim();

    if (word === "") {
        resultContainer.innerHTML = "<p>Please enter a word.</p>";
        return;
    }

    resultContainer.innerHTML = "<p>Searching...</p>";

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            let wordData = data[0];

            // 🔊 phonetic text
            let phonetic = wordData.phonetic || "No phonetic available";

            // 🔊 audio (find first valid one)
            let audio = "";
            if (wordData.phonetics.length > 0) {
                let audioObj = wordData.phonetics.find(p => p.audio !== "");
                if (audioObj) {
                    audio = audioObj.audio;
                }
            }

            // 📖 meanings + definitions
            let meaningsHTML = "";

            wordData.meanings.forEach(meaning => {
                meaningsHTML += `<h3>${meaning.partOfSpeech}</h3>`;

                meaning.definitions.forEach((def, index) => {
                    meaningsHTML += `
                        <p><strong>${index + 1}.</strong> ${def.definition}</p>
                        ${def.example ? `<p class="example">Example: ${def.example}</p>` : ""}
                    `;
                });
            });

            // 🎯 final render
            resultContainer.innerHTML = `
                <h2>${wordData.word}</h2>
                <p><em>${phonetic}</em></p>

                ${audio ? `<audio controls src="${audio}"></audio>` : "<p>No audio available</p>"}

                <div class="meanings">
                    ${meaningsHTML}
                </div>
            `;
        })
        .catch(error => {
            resultContainer.innerHTML = `<p>${error.message}</p>`;
        });
});