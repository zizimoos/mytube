import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = () => {
  const li = document.createElement("li");
  // const span = document.createElement("span");

  // span.innerHTML = comment;
  // li.appendChild(span);
  commentList.prepend(li);
  increaseNumber();
};

const sendComment = async (comment) => {
  //   console.log("comment =====>", comment);
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: { comment },
  });
  //   console.log(response);
  if (response.status === 200) {
    window.location.reload();
    // location.href = window.location.href;
    addComment(comment);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  // console.log("window.location.href", window.location.href);
  if (comment === "") {
    // location.href = window.location.href;
    window.location.reload();
  }
  sendComment(comment);
  commentInput.value = " ";
  commentInput.placeholder = "Add a comment ";
};

const init = () => {
  addCommentForm.addEventListener("submit", handleSubmit);
};

if (addCommentForm) {
  init();
}
