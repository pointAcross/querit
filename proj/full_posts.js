// Get the postID parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const postID = urlParams.get("postId");
console.log("Post ID:", postID);

function fetchPostByID(postID) {
  fetch("http://localhost:3000/getPostByID", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postID: postID }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((postData) => {
      const post = postData;
      console.log("Fetched post:", postData);

      post.forEach((post) => {
        let Container1 = document.getElementById("post-container");
        Container1.style.cssText = `
          display: flex;
          flex-direction: column;
         gap: 30px;  

        `;

        let container = document.createElement("div");
        let authorContainer = document.createElement("div");
        let authorContainer1 = document.createElement("div");
        authorContainer.style.cssText = `
                display: flex;
                flex-direction: row;
                gap: 8px;
                align-items: center;
            `;

        // avatar
        let avatarSVG =
          '<svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.0151 5.75C11.2955 5.75 10.592 5.96077 9.9937 6.35566C9.39538 6.75054 8.92904 7.31181 8.65366 7.96848C8.37829 8.62515 8.30623 9.34774 8.44662 10.0449C8.58701 10.742 8.93353 11.3823 9.44236 11.8849C9.95119 12.3875 10.5995 12.7298 11.3053 12.8684C12.011 13.0071 12.7426 12.9359 13.4074 12.6639C14.0722 12.3919 14.6404 11.9313 15.0402 11.3403C15.44 10.7493 15.6534 10.0545 15.6534 9.34375C15.6534 8.39063 15.2701 7.47654 14.5878 6.80258C13.9054 6.12863 12.98 5.75 12.0151 5.75Z" fill="white"/><path d="M12.015 1.4375C10.0001 1.4375 8.03052 2.02766 6.35521 3.13334C4.67991 4.23902 3.37417 5.81057 2.60311 7.64925C1.83205 9.48793 1.63031 11.5112 2.02339 13.4631C2.41647 15.415 3.38672 17.208 4.81145 18.6153C6.23618 20.0225 8.0514 20.9809 10.0276 21.3692C12.0037 21.7574 14.0521 21.5581 15.9135 20.7965C17.775 20.0349 19.3661 18.7452 20.4855 17.0904C21.6049 15.4357 22.2024 13.4902 22.2024 11.5C22.1993 8.83218 21.1251 6.27449 19.2152 4.38806C17.3054 2.50162 14.7159 1.44051 12.015 1.4375ZM17.8309 17.9154C17.8164 16.9726 17.4275 16.0731 16.748 15.4109C16.0684 14.7486 15.1526 14.3766 14.198 14.375H9.832C8.87737 14.3766 7.9616 14.7486 7.28205 15.4109C6.6025 16.0731 6.21358 16.9726 6.19911 17.9154C4.87953 16.7516 3.94896 15.2193 3.53063 13.5215C3.1123 11.8236 3.22593 10.0403 3.85648 8.40769C4.48704 6.77506 5.60477 5.37012 7.06167 4.37889C8.51858 3.38766 10.2459 2.85691 12.015 2.85691C13.7841 2.85691 15.5114 3.38766 16.9683 4.37889C18.4253 5.37012 19.543 6.77506 20.1735 8.40769C20.8041 10.0403 20.9177 11.8236 20.4994 13.5215C20.0811 15.2193 19.1505 16.7516 17.8309 17.9154Z" fill="white"/></svg>';
        let avatar = document.createElement("div");
        avatar.innerHTML = avatarSVG;

        // topic
        let topic = document.createElement("h4");
        topic.innerText = post.topic;

        // author
        let authorName = document.createElement("p");
        authorName.innerText = `Posted By ${post.userName}`;
        authorName.style.cssText = `
                font-size:10px;
            `;
        authorContainer1.appendChild(topic);
        authorContainer1.appendChild(authorName);
        authorContainer1.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 4px;
            `;
        //title
        let title = document.createElement("h2");
        title.innerText = post.title;

        authorContainer.appendChild(avatar);
        authorContainer.appendChild(authorContainer1);

        // discription
        let description = document.createElement("p");
        description.innerHTML = post.content;

        const isImagePresent =
          post.filePath !== undefined &&
          post.filePath !== null &&
          post.filePath.trim() !== "";
        // Create a container div
        let container_img = document.createElement("div");
        container_img.style.cssText = `
            padding: 20px;
            text-align: center;
            justify-content: center; /* Corrected typo */
            margin: 20px auto;
            max-width: 100%; /* Adjust the max-width to occupy more space */
        `;

        // Check if there's an image present
        if (isImagePresent) {
          // Create an image element
          container_img.classList.add("container");

          let image = new Image();

          // Set image source and style
          image.src = post.filePath.replace(/\\/g, "/");
          image.style.maxWidth = "100%";

          // Append image to the description container
          container_img.appendChild(image);
        }

        let commentSVG =
          '<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.75791 20.6926C6.88638 20.6712 7.01833 20.6896 7.13607 20.7453C8.48852 21.3849 9.97007 21.7211 11.5006 21.7211C17.1459 21.7211 21.7223 17.1447 21.7223 11.4994C21.7223 5.85412 17.1459 1.27771 11.5006 1.27771C5.8553 1.27771 1.27889 5.85412 1.27889 11.4994C1.27889 13.6803 1.96284 15.7566 3.21405 17.4854C3.34893 17.6718 3.37319 17.9163 3.27757 18.1255L1.72074 21.5322L6.75791 20.6926ZM0.745066 22.9901C0.240099 23.0743 -0.153802 22.56 0.0589826 22.0944L1.96366 17.9266C0.692978 16.045 0.00118209 13.8236 0.00118209 11.4994C0.00118209 5.14846 5.14964 0 11.5006 0C17.8515 0 23 5.14846 23 11.4994C23 17.8504 17.8515 22.9988 11.5006 22.9988C9.84918 22.9988 8.24608 22.6501 6.77374 21.9853L0.745066 22.9901Z" fill="white"/></svg>';
        let comment = document.createElement("div");
        comment.innerHTML = commentSVG;

        // comment count
        let commentCount = document.createElement("p");
        commentCount.innerText = post.commentCount;

        let commentContainer = document.createElement("div");
        commentContainer.style.cssText = `
                 display: flex;
                 flex-direction:row;
                 align-items: center;
                 gap:8px;
         `;

        commentContainer.appendChild(comment);
        commentContainer.appendChild(commentCount);

        //share_svg
        let shareSVG =
          '<svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11.6666 4.58332L10.365 5.88499L8.90746 4.42749V14.6667H7.09246V4.42749L5.63496 5.88499L4.33329 4.58332L7.99996 0.916656L11.6666 4.58332ZM15.3333 9.16666V19.25C15.3333 20.2583 14.5083 21.0833 13.5 21.0833H2.49996C1.48246 21.0833 0.666626 20.2583 0.666626 19.25V9.16666C0.666626 8.14916 1.48246 7.33332 2.49996 7.33332H5.24996V9.16666H2.49996V19.25H13.5V9.16666H10.75V7.33332H13.5C14.5083 7.33332 15.3333 8.14916 15.3333 9.16666Z" fill="white"/></svg>';
        let share = document.createElement("div");
        share.innerHTML = shareSVG;

        //view_svg
        let viewSVG =
          '<svg width="26" height="32" viewBox="0 0 50 34" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M24.7366 0C17.801 0 11.7288 4.15303 7.55635 7.9958C5.43662 9.94805 3.72697 11.8945 2.54737 13.3515C1.95642 14.0812 1.49552 14.692 1.17972 15.1242C1.02175 15.3405 0.899875 15.5122 0.816 15.6322C0.77405 15.6922 0.741575 15.7393 0.718825 15.7725L0.692 15.8118L0.6841 15.8235L0 16.908L0.68155 17.9227L0.6841 17.9265L0.692 17.9382L0.718825 17.9775C0.741575 18.0108 0.77405 18.0578 0.816 18.1178C0.899875 18.2378 1.02175 18.4095 1.17972 18.6258C1.49552 19.058 1.95642 19.6688 2.54737 20.3985C3.72697 21.8555 5.43662 23.802 7.55635 25.7542C11.7288 29.597 17.801 33.75 24.7366 33.75C31.6721 33.75 37.7441 29.597 41.9166 25.7542C44.0363 23.802 45.7461 21.8555 46.9256 20.3985C47.5166 19.6688 47.9773 19.058 48.2933 18.6258C48.4511 18.4095 48.5731 18.2378 48.6568 18.1178C48.6988 18.0578 48.7313 18.0108 48.7541 17.9775L48.7808 17.9382L48.7888 17.9265L48.7923 17.9215L49.4951 16.875L48.7913 15.8273L48.7888 15.8235L48.7808 15.8118L48.7541 15.7725C48.7313 15.7393 48.6988 15.6922 48.6568 15.6322C48.5731 15.5122 48.4511 15.3405 48.2933 15.1242C47.9773 14.692 47.5166 14.0812 46.9256 13.3515C45.7461 11.8945 44.0363 9.94805 41.9166 7.9958C37.7441 4.15303 31.6721 0 24.7366 0ZM5.46187 18.039C5.10342 17.5962 4.79828 17.2027 4.5507 16.875C4.79828 16.5473 5.10342 16.1538 5.46187 15.711C6.55942 14.3555 8.1448 12.552 10.0968 10.7542C14.0677 7.09697 19.2456 3.75 24.7366 3.75C30.2273 3.75 35.4053 7.09697 39.3761 10.7542C41.3281 12.552 42.9136 14.3555 44.0111 15.711C44.3696 16.1538 44.6746 16.5473 44.9223 16.875C44.6746 17.2027 44.3696 17.5962 44.0111 18.039C42.9136 19.3945 41.3281 21.198 39.3761 22.9958C35.4053 26.653 30.2273 30 24.7366 30C19.2456 30 14.0677 26.653 10.0968 22.9958C8.1448 21.198 6.55942 19.3945 5.46187 18.039ZM30.3613 16.875C30.3613 19.9815 27.8431 22.5 24.7363 22.5C21.6298 22.5 19.1115 19.9815 19.1115 16.875C19.1115 13.7685 21.6298 11.25 24.7363 11.25C27.8431 11.25 30.3613 13.7685 30.3613 16.875ZM34.1113 16.875C34.1113 22.0528 29.9141 26.25 24.7363 26.25C19.5588 26.25 15.3615 22.0528 15.3615 16.875C15.3615 11.6973 19.5588 7.5 24.7363 7.5C29.9141 7.5 34.1113 11.6973 34.1113 16.875Z" fill="white"/></svg>';
        let view = document.createElement("div");
        view.innerHTML = viewSVG;

        // view count
        let viewCount = document.createElement("p");
        viewCount.innerText = post.viewCount;

        //view container
        let viewContainer = document.createElement("div");
        viewContainer.style.cssText = `
                display: flex;
                flex-direction:row;
                align-items: center;
                gap: 8px;
        `;
        viewContainer.appendChild(view);
        viewContainer.appendChild(viewCount);

        //upload container i.e.view_container and comment_container
        let uc = document.createElement("div");
        uc.style.cssText = `
                 display: flex;
                 flex-direction:row;
                 align-items: center;
                 gap:20px;
            `;
        uc.appendChild(commentContainer);
        uc.appendChild(viewContainer);
        // uc.appendChild(share);

        //upload container2 i.e.upload_container and share
        let uc2 = document.createElement("div");
        uc2.style.cssText = `
            display: flex;
            flex-direction:row;
            justify-content:space-between;   
            `;

        uc2.appendChild(uc);
        uc2.appendChild(share);

        //comment head
        let comment_h = document.createElement("h1");
        comment_h.innerText = "Comments";
        comment_h.style.cssText = `
                    font-weight:bold;
                    color:white; 
                    margin:0px;
                    padding:0px;         
                `;
        container.appendChild(authorContainer);
        container.appendChild(title);
        container.appendChild(description);
        container.appendChild(container_img);
        container.appendChild(uc2);

        container.style.cssText = `
                background-color: #282828;
                color: white;
                padding: 20px;
                padding-bottom:0px;
                border-radius:14px;
                gap:0px;
                flex-direction:column;
                display:flex;
                flex-wrap:wrap;    
            `;
        Container1.appendChild(container);
        Container1.appendChild(comment_h);

        // Create textarea element
        let textarea = document.createElement("textarea");
        textarea.placeholder = "Write a comment...";
        textarea.style.cssText = `
          background-color: #282828;
          color: white;
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          resize: none;
          height: 100px;
        `;
        // Append textarea to Container1
        Container1.appendChild(textarea);

        // Create a button element
        const button = document.createElement("button");
        button.style.cssText = `
          font-size: 14px;
          background-color: #f62500;
          display: inline-flex;
          transition: background-color 0.3s;
          border: 2px solid black;
          padding: 10px 10px;
          cursor: pointer;
          border-radius: 14px;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          flex-direction: row;
          width: 100px; /* Set a fixed width for the button */
          font-weight: bold;
          color: #ffffff;
        `;
        // Set button text
        button.innerText = "Post";

        //Appendings in the main contaainer
        Container1.appendChild(textarea);
        Container1.appendChild(button);

        // Add comment containers
        post.comments.forEach((comment) => {
          // Create a div element
          // avatar
          let avatarSVG_c =
            '<svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.0151 5.75C11.2955 5.75 10.592 5.96077 9.9937 6.35566C9.39538 6.75054 8.92904 7.31181 8.65366 7.96848C8.37829 8.62515 8.30623 9.34774 8.44662 10.0449C8.58701 10.742 8.93353 11.3823 9.44236 11.8849C9.95119 12.3875 10.5995 12.7298 11.3053 12.8684C12.011 13.0071 12.7426 12.9359 13.4074 12.6639C14.0722 12.3919 14.6404 11.9313 15.0402 11.3403C15.44 10.7493 15.6534 10.0545 15.6534 9.34375C15.6534 8.39063 15.2701 7.47654 14.5878 6.80258C13.9054 6.12863 12.98 5.75 12.0151 5.75Z" fill="white"/><path d="M12.015 1.4375C10.0001 1.4375 8.03052 2.02766 6.35521 3.13334C4.67991 4.23902 3.37417 5.81057 2.60311 7.64925C1.83205 9.48793 1.63031 11.5112 2.02339 13.4631C2.41647 15.415 3.38672 17.208 4.81145 18.6153C6.23618 20.0225 8.0514 20.9809 10.0276 21.3692C12.0037 21.7574 14.0521 21.5581 15.9135 20.7965C17.775 20.0349 19.3661 18.7452 20.4855 17.0904C21.6049 15.4357 22.2024 13.4902 22.2024 11.5C22.1993 8.83218 21.1251 6.27449 19.2152 4.38806C17.3054 2.50162 14.7159 1.44051 12.015 1.4375ZM17.8309 17.9154C17.8164 16.9726 17.4275 16.0731 16.748 15.4109C16.0684 14.7486 15.1526 14.3766 14.198 14.375H9.832C8.87737 14.3766 7.9616 14.7486 7.28205 15.4109C6.6025 16.0731 6.21358 16.9726 6.19911 17.9154C4.87953 16.7516 3.94896 15.2193 3.53063 13.5215C3.1123 11.8236 3.22593 10.0403 3.85648 8.40769C4.48704 6.77506 5.60477 5.37012 7.06167 4.37889C8.51858 3.38766 10.2459 2.85691 12.015 2.85691C13.7841 2.85691 15.5114 3.38766 16.9683 4.37889C18.4253 5.37012 19.543 6.77506 20.1735 8.40769C20.8041 10.0403 20.9177 11.8236 20.4994 13.5215C20.0811 15.2193 19.1505 16.7516 17.8309 17.9154Z" fill="white"/></svg>';
          let avatar_c = document.createElement("div");
          avatar_c.innerHTML = avatarSVG_c;

          let commentContainer = document.createElement("div");
          commentContainer.style.cssText = `
            background-color: #282828;
            color: white;
            padding: 10px;
            border-radius: 5px;
          `;

          let topic_c = document.createElement("h4");
          topic_c.innerText = post.topic;

          // author_c
          let authorName_c = document.createElement("p");
          authorName_c.innerText = `Posted By ${comment.name}`;
          authorName_c.style.cssText = `
                font-size:10px;
            `;

          let authorContainer1_c = document.createElement("div");
          authorContainer1_c.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 4px;
            `;

          authorContainer1_c.appendChild(topic_c);
          authorContainer1_c.appendChild(authorName_c);

          let authorContainer_c = document.createElement("div");
          authorContainer_c.style.cssText = `
                display: flex;
                flex-direction: row;
                gap: 8px;
                align-items: center;
            `;
          authorContainer_c.appendChild(avatar_c);
          authorContainer_c.appendChild(authorContainer1_c);

          // Create a p element
          let commentText = document.createElement("p");
          commentText.innerText = comment.text;
          commentText.style.cssText = `
            margin-top: 10px;
            padding-left:10px;
          `;

          // Append commentText to commentContainer
          commentContainer.appendChild(authorContainer_c);
          commentContainer.appendChild(commentText);

          // Append commentContainer to Container1
          Container1.appendChild(commentContainer);
        });

        button.onclick = handleClick;
        function handleClick() {
          // Get the comment from the textarea
          const comment = textarea.value;

          // Check if the comment is empty
          if (comment.trim() === "") {
            alert("Please enter a comment");
            return;
          }

          // GET username of user
          fetch("http://localhost:3000/getUserName", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              const userName = data.name;
              const userEmail = data.email;

              // Send the comment to the server
              fetch("http://localhost:3000/addComment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  postID: postID,
                  comment: {
                    text: comment,
                    commEmail: userEmail,
                    userName: userName,
                    userEmail: userEmail,
                    topic: post.topic,
                  },
                }),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  return response.json();
                })
                .then((data) => {
                  // Clear the textarea
                  textarea.value = "";

                  // Reload to display the updated comment count
                  window.location.reload();
                })
                .catch((error) =>
                  console.error("Error adding comment:", error)
                );
            })
            .catch((error) =>
              console.error("Error fetching username or name:", error)
            );
        }

        // increment view count
        fetch("http://localhost:3000/incrementViewCount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postID: postID }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            // console.log("Incremented view count:", data);
          })
          .catch((error) =>
            console.error("Error incrementing view count:", error)
          );
      });
    })
    .catch((error) => console.error("Error fetching post:", error));
}
// Fetch the post by ID
fetchPostByID(postID);
