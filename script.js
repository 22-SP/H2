document.addEventListener("DOMContentLoaded", () => {
    const legendButtons = document.querySelectorAll(".category-button");
    const questionsContainer = document.getElementById("questions");
    const modal = document.getElementById("modal");
    const modalText = document.getElementById("modal-text");
    const closeButton = document.querySelector(".close");

    legendButtons.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.getAttribute("data-category");
            const amount = 1;

            fetch(`https://opentdb.com/api.php?amount=${amount}&category=${category}&type=multiple`)
                .then(response => response.json())
                .then(data => {
                    displayQuestions(data.results);
                })
                .catch(error => {
                    console.error('Error fetching trivia questions:', error);
                });
        });
    });

    function displayQuestions(questions) {
        questionsContainer.innerHTML = '';
        questions.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            questionElement.innerHTML = `
                <h3>${question.category}</h3>
                <p>${question.question}</p>
                <form class="answers">
                    ${shuffle([...question.incorrect_answers, question.correct_answer]).map(answer => `
                        <label>
                            <input type="radio" name="answer" value="${answer}">
                            ${answer}
                        </label>
                    `).join('')}
                    <button type="submit">Submit Answer</button>
                </form>
            `;
            questionsContainer.appendChild(questionElement);

            const answerForm = questionElement.querySelector('.answers');
            answerForm.addEventListener('submit', event => {
                event.preventDefault();
                const selectedAnswer = answerForm.querySelector('input[name="answer"]:checked');
                if (selectedAnswer) {
                    const answerText = selectedAnswer.value;
                    const correctAnswer = question.correct_answer;
                    showFeedback(answerText === correctAnswer);
                }
            });
        });
    }

    function showFeedback(isCorrect) {
        modalText.textContent = isCorrect ? "Congratulations! What a smart arse!!" : "Noooooooo!! I think somebody needs to go back to school!";
        modal.style.display = "block";
    }

    closeButton.addEventListener('click', () => {
        modal.style.display = "none";
    });

    window.addEventListener('click', event => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
