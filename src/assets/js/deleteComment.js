import axios from "axios";

// const commentList = document.querySelector(".comment__li");
const deleteComment = document.getElementById("commentDelete");

const sendDelete = async (id) => {
  const commentId = id;
  const response = await axios({
    url: `/api/${commentId}/commentDelete`,
    method: "POST",
  });
  if (response.status === 200) {
    window.location.reload();
  }
};
const handleDelete = (event) => {
  console.log(event);
  let elem = event.target;
  console.log("COMMENT ID", elem);
  while (!elem.classList.contains("comment__li")) {
    elem = elem.parentNode;
    let id;
    if (elem.classList.contains("comment__li")) {
      id = elem.dataset.id;
      elem.remove();
      sendDelete(id);
    }
  }
};

const init = () => {
  deleteComment.addEventListener("click", handleDelete);
};

init();
