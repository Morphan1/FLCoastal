"use strict";

var canvas = document.getElementById("species-image");

var wordBank = document.getElementById("word-bank");

var answerInput = document.getElementById("answer");
var submitButton = document.getElementById("submit-answer");

var goBackButton = document.getElementById("go-back");
var goNextButton = document.getElementById("go-next");

var giveUpButton = document.getElementById("give-up");

var goodModal = document.getElementById("good-modal");
var modalClose = document.getElementById("modal-close");
var modalShow = document.getElementById("modal-show");
var speciesDescription = document.getElementById("species-description");
var speciesNomen = document.getElementById("species-nomen");

(function(game, undefined) {
    function Result(success, nomen, description) {
        return {
            success: success,
            nomen: nomen,
            description: description
        };
    }

    function Stage(x, y, size) {
        return {
            x: x,
            y: y, 
            size: size
        };
    }

    function Species(_names, _description, _image, stages) {
        var names = atob(_names).split(","); 
        var name = names[0];
        var scrambledName = names[1];
        var nomen = names[2];
        var description = atob(_description);

        var ready = false;
        var image = new Image();
        image.onload = function() {
            ready = true;
        };
        image.src = atob(_image);

        var currentStage = 0;

        var wordBankId = -1;
        var incorrectCount = 0;

        var lastTarget = null;
        var target = null;
        var currentPosition = null;

        function showStage(index) {
            target = stages[index];
            window.requestAnimationFrame(render);
        }

        function setPosition(position) {
            var context = canvas.getContext('2d');
            context.canvas.width = position.size;
            context.canvas.height = position.size;
            context.imageSmoothingEnabled = false;
            context.drawImage(image, position.x, position.y, position.size, position.size, 0, 0, position.size, position.size);
            currentPosition = position;
        }

        function render() {
            if (!ready) {
                window.requestAnimationFrame(render);
                return;
            }
            if (target === null) {
                return;
            }
            if (currentPosition === target) {
                return;
            }
            if (lastTarget === null) {
                setPosition(target);
                lastTarget = target;
                target = null;
                return;
            }
            var diff = Stage((target.x - lastTarget.x) / 100, (target.y - lastTarget.y) / 100, (target.size - lastTarget.size) / 100);
            var newPosition = Stage(currentPosition.x + diff.x, currentPosition.y + diff.y, currentPosition.size + diff.size);
            if (Math.abs(newPosition.x - target.x) <= Math.abs(diff.x) && Math.abs(newPosition.y - target.y) <= Math.abs(diff.y) && Math.abs(newPosition.size - target.size) <= Math.abs(diff.size)) {
                setPosition(target);
                lastTarget = target;
                target = null;
                return;
            }
            setPosition(newPosition);
            window.requestAnimationFrame(render);
        }

        return {
            show: function() {
                showStage(currentStage);
            },

            hide: function() {
                target = null;
                lastTarget = null;
                currentPosition = null;
                document.getElementById("wb-" + wordBankId).classList.remove("bad-word");
            },

            nextStage: function() {
                if (currentStage === stages.length - 1) {
                    return;
                }
                showStage(++currentStage);
            },

            finalStage: function() {
                showStage(currentStage = stages.length - 1);
            },

            checkAnswer: function(input) {
                if (names.indexOf(input.toLowerCase()) > -1) {
                    this.finalStage();
                    document.getElementById("wb-" + wordBankId).classList.remove("bad-word");
                    document.getElementById("wb-" + wordBankId).classList.add("good-word");
                    return Result(true, nomen, description);
                }
                else {
                    ++incorrectCount;
                    if (incorrectCount === 3) {
                        this.nextStage();
                    }
                    if (this.canCheat()) {
                        giveUpButton.style.display = "block";
                    }
                    if (incorrectCount >= 12) {
                        document.getElementById("wb-" + wordBankId).classList.add("bad-word");
                    }
                    return Result(false);
                }
            },

            canCheat: function() {
                return incorrectCount >= 6;
            },

            cheat: function() {
                answerInput.value = name.toLowerCase();
            },

            addNameToBank: function(id) {
                wordBankId = id;
                wordBank.innerHTML += "<p id=\"wb-" + id + "\">" + scrambledName + "</p>";
            }
        };
    }

    var speciesList = [
        Species(
            "Qk9UVExFTk9TRSBET0xQSElOLEVORVNPT1RCTFQgTElESE5PUCxUdXJzaW9wcyB0cnVuY2F0dXMsZG9scGhpbix0dXJzaW9wcyB0cnVuY2F0dXMsYm90dGxlbm9zZSxib3R0bGVub3NlIGRvbHBoaW4sY29tbW9uIGJvdHRsZW5vc2UsY29tbW9uIGJvdHRsZW5vc2UgZG9scGhpbixib3R0bGVub3NlZCxib3R0bGVub3NlZCBkb2xwaGluLGNvbW1vbiBib3R0bGVub3NlZCxjb21tb24gYm90dGxlbm9zZWQgZG9scGhpbixib3R0bGUtbm9zZSxib3R0bGUtbm9zZSBkb2xwaGluLGNvbW1vbiBib3R0bGUtbm9zZSxjb21tb24gYm90dGxlLW5vc2UgZG9scGhpbixib3R0bGUtbm9zZWQsYm90dGxlLW5vc2VkIGRvbHBoaW4sY29tbW9uIGJvdHRsZS1ub3NlZCxjb21tb24gYm90dGxlLW5vc2VkIGRvbHBoaW4=",
            "UGVyaGFwcyB0aGUgbW9zdCB3ZWxsLWtub3duIG1hcmluZSBtYW1tYWwsIHRoZSBjb21tb24gYm90dGxlbm9zZSBkb2xwaGluIGNhbiBiZSBmb3VuZCBpbiB0ZW1wZXJhdGUgYW5kIHRyb3BpY2FsIHdhdGVycyB3b3JsZHdpZGUu",
            "aW1hZ2VzL1ltOTBkR3hsYm05elpTQmtiMnh3YUdsdS5qcGc=",
            [ Stage(1000, 450, 250), Stage(900, 350, 500), Stage(700, 100, 1000) ]
        ),
        Species(
            "T1NQUkVZLFNSWUVPUCxQYW5kaW9uIGhhbGlhZXR1cyxvc3ByZXkscGFuZGlvbiBoYWxpYWV0dXMsZmlzaCBoYXdrLHNlYSBoYXdrLHJpdmVyIGhhd2s=",
            "Rm91bmQgd29ybGR3aWRlLCB0aGUgb3NwcmV5IGlzIHRoZSBzb2xlIG1lbWJlciBvZiB0aGUgZmFtaWx5IFBhbmRpb25pZGFlLiBJdCBpcyBoaWdobHkgYWRhcHRlZCBmb3IgZWF0aW5nIGZpc2gsIHdoaWNoIG1ha2VzIHVwIG5lYXJseSBpdHMgZW50aXJlIGRpZXQu",
            "aW1hZ2VzL2IzTndjbVY1LmpwZw==",
            [ Stage(1100, 1036, 250), Stage(1020, 870, 500), Stage(0, 0, 2500) ]
        ),
        Species(
            "UklORy1CSUxMRUQgR1VMTCxHSU5SLUxCRURJTCBMVUxHLExhcnVzIGRlbGF3YXJlbnNpcyxndWxsLGxhcnVzIGRlbGF3YXJlbnNpcyxyaW5nLWJpbGxlZCBndWxsLHJpbmcgYmlsbGVkIGd1bGwscmluZ2JpbGxlZCBndWxsLHNlYSBndWxsLHNlYWd1bGwscGFya2luZyBsb3QgZ3VsbCxwYXJraW5nbG90IGd1bGwscGFya2luZ2xvdGd1bGwsc2VhZ3VsbCBicm8=",
            "VGhlIHJpbmctYmlsbGVkIGd1bGwgaXMgd2VsbC1hZGFwdGVkIHRvIGh1bWFuLWRpc3R1cmJlZCBhcmVhcy4gSXQgdGVuZHMgdG8gYmUgcHJldHR5IGNvbWZvcnRhYmxlIGFyb3VuZCBwZW9wbGU7IGJlIG1pbmRmdWwgd2l0aCBhbnkgZm9vZCB5b3UgaGF2ZSE=",
            "aW1hZ2VzL2NtbHVaeTFpYVd4c1pXUWdaM1ZzYkE9PS5qcGc=",
            [ Stage(1350, 570, 250), Stage(1200, 230, 500), Stage(410, 0, 1568) ]
        ),
        Species(
            "Uk9TRUFURSBTUE9PTkJJTEwsQVRTUkVPRSBOT0xJUFNMT0IsUGxhdGFsZWEgYWphamEsc3Bvb25iaWxsLHBsYXRhbGVhIGFqYWphLHJvc2VhdGUgc3Bvb25iaWxs",
            "U2ltaWxhciB0byBmbGFtaW5nb3MsIHRoZSByb3NlYXRlIHNwb29uYmlsbCB0dXJucyBwaW5rIHdpdGggaXRzIGRpZXQuIEhvd2V2ZXIsIGl0IGlzIGFjdHVhbGx5IGEgcGFydCBvZiB0aGUgaWJpcyBmYW1pbHku",
            "aW1hZ2VzL2NtOXpaV0YwWlNCemNHOXZibUpwYkd3PS5qcGc=",
            [ Stage(1924, 1070, 300), Stage(1720, 940, 1000), Stage(420, 0, 2800) ]
        ),
        Species(
            "QU1FUklDQU4gQ1JPQ09ESUxFLE1JUkNBRU5BIFJMSU9DREVDTyxDcm9jb2R5bHVzIGFjdXR1cyxjcm9jb2RpbGUsY3JvY29keWx1cyBhY3V0dXMsYW1lcmljYW4gY3JvY29kaWxlLGNyb2M=",
            "VGhhdCdzIHJpZ2h0LCBjcm9jb2RpbGVzIGNhbiBlbmQgdXAgb24gb3VyIGJlYWNoISBJbiBGbG9yaWRhLCB0aGUgQW1lcmljYW4gY3JvY29kaWxlIGhhcyBwb3B1bGF0aW9ucyBtb3N0bHkgYXJvdW5kIHRoZSBzb3V0aGVybiBjb2FzdCwgYnV0IGhhcyBiZWVuIHNwb3R0ZWQgYXMgZmFyIG5vcnRoIGFzIFRhbXBhIEJheSBpbiB0aGUgR3VsZiBhbmQgQnJldmFyZCBDb3VudHkgb24gdGhlIGVhc3QgY29hc3QsIGxpa2VseSBkdWUgdG8gY2hhbmdpbmcgY2xpbWF0ZS4=",
            "aW1hZ2VzL1lXMWxjbWxqWVc0Z1kzSnZZMjlrYVd4bC5qcGc=",
            [ Stage(695, 1335, 1300), Stage(850, 500, 2500), Stage(1932, 0, 4500) ]
        ),
        Species(
            "QlJPV04gUEVMSUNBTixXQk5STyBMQUVQSU5DLFBlbGVjYW51cyBvY2NpZGVudGFsaXMscGVsaWNhbixwZWxlY2FudXMgb2NjaWRlbnRhbGlzLGJyb3duIHBlbGljYW4=",
            "V2l0aCBhIDcgZm9vdCB3aW5nc3BhbiwgdGhlIGJyb3duIHBlbGljYW4gaXMgc3RpbGwgdGhlIHNtYWxsZXN0IHNwZWNpZXMgb2YgcGVsaWNhbi4=",
            "aW1hZ2VzL1luSnZkMjRnY0dWc2FXTmhiZz09LmpwZw==",
            [ Stage(1517, 1086, 450), Stage(1250, 800, 800), Stage(300, 200, 2000) ]
        ),
        Species(
            "R1JFRU4gU0VBIFRVUlRMRSxFUkVORyBFU0EgVUxUUkVULENoZWxvbmlhIG15ZGFzLHR1cnRsZSxjaGVsb25pYSBteWRhcyxncmVlbiB0dXJ0bGUsc2VhIHR1cnRsZSxncmVlbiBzZWEgdHVydGxlLHNlYXR1cnRsZSxncmVlbiBzZWF0dXJ0bGUsYmxhY2sgdHVydGxlLGJsYWNrIHNlYSB0dXJ0bGUsYmxhY2sgc2VhdHVydGxlLGF0bGFudGljIGdyZWVuIHR1cnRsZSxhdGxhbnRpYyBncmVlbiBzZWEgdHVydGxlLGF0bGFudGljIGdyZWVuIHNlYXR1cnRsZSxwYWNpZmljIGdyZWVuIHR1cnRsZSxwYWNpZmljIGdyZWVuIHNlYSB0dXJ0bGUscGFjaWZpYyBncmVlbiBzZWF0dXJ0bGU=",
            "VGhlIGdyZWVuIHNlYSB0dXJ0bGUgaXMgdGhlIGxhcmdlc3Qgc2hlbGxlZCB0dXJ0bGUgYW5kIHRoZSBvbmx5IHNvbGVseSBoZXJiaXZvcm91cyB0dXJ0bGUuIEl0cyBkaWV0IG9mIG1vc3RseSBzZWFncmFzcyBhbmQgYWxnYWUgbWFrZXMgaXRzIGZhdCB0aGUgZXBvbnltb3VzIGdyZWVuIGNvbG9yLg==",
            "aW1hZ2VzL1ozSmxaVzRnYzJWaElIUjFjblJzWlE9PS5qcGc=",
            [ Stage(2550, 1802, 350), Stage(2400, 1650, 800), Stage(330, 430, 3200) ]
        ),
        Species(
            "TEVBU1QgU0FORFBJUEVSLFRBU0xFIERJUkFQTlNFUCxDYWxpZHJpcyBtaW51dGlsbGEsc2FuZHBpcGVyLGNhbGlkcmlzIG1pbnV0aWxsYSxsZWFzdCBzYW5kcGlwZXIscGVlcCxwZWVwcw==",
            "VGhlIHdvcmxkJ3Mgc21hbGxlc3Qgc2hvcmViaXJkLCB3ZWlnaGluZyBpbiBhdCBvbmx5IG9uZSBvdW5jZSwgdGhlIGxlYXN0IHNhbmRwaXBlciEgKmFpcmhvcm4gbm9pc2VzKg==",
            "aW1hZ2VzL2JHVmhjM1FnYzJGdVpIQnBjR1Z5LmpwZw==",
            [ Stage(2079, 1006, 400), Stage(1751, 769, 800), Stage(1293, 285, 2000) ]
        ),
        Species(
            "U05PV1kgUExPVkVSLE5XT1NZIE9WTFJFUCxBbmFyaHluY2h1cyBuaXZvc3VzLHBsb3Zlcixzbm93eSBwbG92ZXIsYW5hcmh5bmNodXMgbml2b3N1cw==",
            "VGhlIHNub3d5IHBsb3ZlciBpcyBhIHZlcnkgc21hbGwgc2hvcmViaXJkIHRoYXQgbmVzdHMgb24gdGhlIGJlYWNoOyBjYXJlZnVsIHdoZXJlIHlvdSBzdGVwIQ==",
            "aW1hZ2VzL2MyNXZkM2tnY0d4dmRtVnkuanBn",
            [ Stage(1879, 659, 515), Stage(1485, 633, 1000), Stage(535, 25, 2150) ]
        )
    ];

    var successStatus = [];
    var wordBankIndex = [];
    
    for (var i = 0; i < speciesList.length; i++) {
        successStatus[i] = Result(false);
        wordBankIndex[i] = i;
    }

    for (var i = wordBankIndex.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = wordBankIndex[i];
        wordBankIndex[i] = wordBankIndex[j];
        wordBankIndex[j] = temp;
    }

    for (var i = 0; i < wordBankIndex.length; i++) {
        speciesList[wordBankIndex[i]].addNameToBank(i);
    }

    var currentSpecies = 0;

    game.show = function() {
        speciesList[currentSpecies].show();
    }

    game.currentStatus = function() {
        return successStatus[currentSpecies];
    }

    game.checkAnswer = function(input) {
        if (!successStatus[currentSpecies].success) {
            successStatus[currentSpecies] = speciesList[currentSpecies].checkAnswer(input);
        }
        return successStatus[currentSpecies];
    }

    game.nextSpecies = function () {
        speciesList[currentSpecies].hide();
        ++currentSpecies;
        this.show();
        if (currentSpecies === speciesList.length - 1) {
            return false;
        }
        return true;
    }

    game.prevSpecies = function () {
        speciesList[currentSpecies].hide();
        --currentSpecies;
        this.show();
        if (currentSpecies === 0) {
            return false;
        }
        return true;
    },

    game.fillAnswer = function() {
        speciesList[currentSpecies].cheat();
    }
}(window.game = window.game || {}));

answerInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        submitButton.click();
    }
});

function clearAnswer() {
    answerInput.value = "";
}

function showDescription(result) {
    modalShow.style.display = "none";
    giveUpButton.style.display = "none";
    if (result.success) {
        goodModal.style.display = "block";
        speciesNomen.textContent = result.nomen;
        speciesDescription.textContent = result.description;
    }
    else {
        goodModal.style.display = "none";
    }
}

submitButton.onclick = function(event) {
    clearAnswer();
    var result = game.checkAnswer(answerInput.value);
    if (result.success) {
        showDescription(result);
    }
    else {
        submitButton.classList.add("bad-answer");
        function animationEndHandler(animationEvent) {
            submitButton.classList.remove("bad-answer");
            submitButton.removeEventListener("animationend", animationEndHandler);
        }
        submitButton.addEventListener("animationend", animationEndHandler);
    }
};

giveUpButton.onclick = function(event) {
    game.fillAnswer();
}

goBackButton.onclick = function(event) {
    clearAnswer();
    if (!game.prevSpecies()) {
        goBackButton.style.visibility = "hidden";
    }
    goNextButton.style.visibility = "visible";
    showDescription(game.currentStatus());
}

goNextButton.onclick = function(event) {
    clearAnswer();
    if (!game.nextSpecies()) {
        goNextButton.style.visibility = "hidden";
    }
    goBackButton.style.visibility = "visible";
    showDescription(game.currentStatus());
}

modalClose.onclick = function(event) {
    goodModal.style.display = "none";
    modalShow.style.display = "block";
}

modalShow.onclick = function(event) {
    goodModal.style.display = "block";
    modalShow.style.display = "none";
}

game.show();
