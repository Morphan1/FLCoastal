"use strict";

var canvas = document.getElementById("species-image");

var answerInput = document.getElementById("answer");
var submitButton = document.getElementById("submit-answer");

var goBackButton = document.getElementById("go-back");
var goNextButton = document.getElementById("go-next");

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
        var nomen = names[1];
        var description = atob(_description);

        var ready = false;
        var image = new Image();
        image.onload = function() {
            ready = true;
        };
        image.src = atob(_image);

        var currentStage = 0;

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
            if (Math.abs(newPosition.x - target.x) < Math.abs(diff.x) && Math.abs(newPosition.y - target.y) < Math.abs(diff.y) && Math.abs(newPosition.size - target.size) < Math.abs(diff.size)) {
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

            cancelRender: function() {
                target = null;
                lastTarget = null;
                currentPosition = null;
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
                    return Result(true, nomen, description);
                }
                else {
                    return Result(false);
                }
            }
        };
    }

    var speciesList = [
        Species(
            "Qk9UVExFTk9TRSBET0xQSElOLFR1cnNpb3BzIHRydW5jYXR1cyxkb2xwaGluLHR1cnNpb3BzIHRydW5jYXR1cyxib3R0bGVub3NlLGJvdHRsZW5vc2UgZG9scGhpbixjb21tb24gYm90dGxlbm9zZSxjb21tb24gYm90dGxlbm9zZSBkb2xwaGluLGJvdHRsZW5vc2VkLGJvdHRsZW5vc2VkIGRvbHBoaW4sY29tbW9uIGJvdHRsZW5vc2VkLGNvbW1vbiBib3R0bGVub3NlZCBkb2xwaGluLGJvdHRsZS1ub3NlLGJvdHRsZS1ub3NlIGRvbHBoaW4sY29tbW9uIGJvdHRsZS1ub3NlLGNvbW1vbiBib3R0bGUtbm9zZSBkb2xwaGluLGJvdHRsZS1ub3NlZCxib3R0bGUtbm9zZWQgZG9scGhpbixjb21tb24gYm90dGxlLW5vc2VkLGNvbW1vbiBib3R0bGUtbm9zZWQgZG9scGhpbg==",
            "UGVyaGFwcyB0aGUgbW9zdCB3ZWxsLWtub3duIG1hcmluZSBtYW1tYWwsIHRoZSBjb21tb24gYm90dGxlbm9zZSBkb2xwaGluIGNhbiBiZSBmb3VuZCBpbiB0ZW1wZXJhdGUgYW5kIHRyb3BpY2FsIHdhdGVycyB3b3JsZHdpZGUu",
            "aW1hZ2VzL1ltOTBkR3hsYm05elpTQmtiMnh3YUdsdS5qcGc=",
            [ Stage(1000, 450, 250), Stage(900, 350, 500), Stage(700, 100, 1000) ]
        ),
        Species(
            "T1NQUkVZLFBhbmRpb24gaGFsaWFldHVzLG9zcHJleSxwYW5kaW9uIGhhbGlhZXR1cyxmaXNoIGhhd2ssc2VhIGhhd2sscml2ZXIgaGF3aw==",
            "Rm91bmQgd29ybGR3aWRlLCB0aGUgb3NwcmV5IGlzIHRoZSBzb2xlIG1lbWJlciBvZiBpdHMgZmFtaWx5IFBhbmRpb25pZGFlLiBJdCBpcyBoaWdobHkgYWRhcHRlZCBmb3IgZWF0aW5nIGZpc2gsIHdoaWNoIG1ha2VzIHVwIG5lYXJseSBpdHMgZW50aXJlIGRpZXQu",
            "aW1hZ2VzL2IzTndjbVY1LmpwZw==",
            [ Stage(1100, 1036, 250), Stage(0, 0, 2500) ]
        )
    ];

    var successStatus = [];
    var wordBankIndex = []; // TODO: actually use this
    
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
        speciesList[currentSpecies].cancelRender();
        ++currentSpecies;
        this.show();
        if (currentSpecies === speciesList.length - 1) {
            return false;
        }
        return true;
    }

    game.prevSpecies = function () {
        speciesList[currentSpecies].cancelRender();
        --currentSpecies;
        this.show();
        if (currentSpecies === 0) {
            return false;
        }
        return true;
    }
}(window.game = window.game || {}));

answerInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        submitButton.click();
    }
});

function showDescription(result) {
    modalShow.style.display = "none";
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

goBackButton.onclick = function(event) {
    if (!game.prevSpecies()) {
        goBackButton.style.visibility = "hidden";
    }
    goNextButton.style.visibility = "visible";
    showDescription(game.currentStatus());
}

goNextButton.onclick = function(event) {
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
