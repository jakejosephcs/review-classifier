// API Call to the OpenAI API
async function postData() {
  const response = await fetch('https://api.openai.com/v1/classifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer REDACTED',
    },
    body: JSON.stringify(params),
  });
  return response.json();
}

// Examples (array of arrays containing a review and it's label)
const examples = [];

// Parameters to be sent in a POST request to the API (using the curie model)
const params = {
  query: 'Food quality was better than last time',
  examples: examples,
  model: 'curie',
};

// CODE PROVIDE EXAMPLE REVIEWS
const addExampleReviewBtn = document.getElementById('add-example-review');
const exampleReview = document.getElementById('example-review');
const labelChoices = document.getElementsByName('label');
const deleteExampleBtns = document.querySelectorAll('.example-trash');
const exampleReviewsDiv = document.getElementById('example-reviews');

// Gets the label that has been checked (either good, neutral or poor)
function getSelectedLabel(labelChoices) {
  for (const label of labelChoices) {
    if (label.checked) {
      return label;
    }
  }
}

// Renders a new review to the screen
function renderExampleReviews() {
  let id = 0;
  exampleReviewsDiv.innerHTML = `
    <h5>Examples: </h5>
  `;
  for (const review of examples) {
    exampleReviewsDiv.innerHTML += `
      <div class="review">
        <p>${review[0]}</p>
        <div class="review-options">
          <span class="review-options-label ${review[1].toLowerCase()}">${
      review[1]
    }</span>
          <i class="fas fa-trash example-trash" id="${id}-trash" onclick="delBtn(${id})"></i>
        </div>
      </div>
    `;
    id++;
  }
}

// Resets the textarea (review) and radio button (label)
function resetExampleReviewValues(review, label) {
  review.value = '';
  label.checked = false;
}

// Adds the review and its label to the examples array
addExampleReviewBtn.addEventListener('click', () => {
  const review = exampleReview;
  const label = getSelectedLabel(labelChoices);
  examples.push([review.value, label.value]);
  renderExampleReviews();
  resetExampleReviewValues(review, label);
});

//delBtn function attached to the onclick even of each delete icon to
//  remove the correct review
function delBtn(id) {
  examples.splice(id, 1);
  renderExampleReviews();
}

// CODE CLASSIFIED REVIEWS
let classifyReviewBtn = document.getElementById('classify-review-btn');
let reviewToClassify = document.getElementById('review-to-classify');
let classifiedReviewsDiv = document.getElementById('classified-reviews');

// Add classified review to params and make the post request to the API
classifyReviewBtn.addEventListener('click', () => {
  params.query = reviewToClassify.value;
  postData().then(result => {
    addClassifiedReviews(params.query, result.label);
  });
});

// Adds the review and its fetched label to the screen
function addClassifiedReviews(review, label) {
  classifiedReviewsDiv.innerHTML += `
    <div class="review">
      <p>${review}</p>
      <span class="review-options-label ${label.toLowerCase()}">${label}</span>
    </div>
  `;
  reviewToClassify.value = '';
}
