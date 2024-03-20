// todo: replace with fetch and get data from api
// mock data
var data = [
    {
      id: 1,
      author: {
        id: "shubhijain1",
        name: "Shubhi Jain",
      },
      date: "Mar 8",
      replying_to: {
        id: "shrutiijain1",
      },
      followed_you: {
        id: "shrutiijain1",
      },
      comment:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      commentCount: 24,
    },
    {
      id: 2,
      author: {
        id: "shubhijain12",
        name: "Shubhi Jain",
      },
      date: "Mar 9",
      replying_to: {
        id: "shrutiijain12",
      },
      followed_you: {
        id: "shrutiijain12",
      },
      comment:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      commentCount: 244,
    },
    {
      id: 3,
      author: {
        id: "shubhijain123",
        name: "Shubhi Jain",
      },
      date: "Mar 11",
      replying_to: {
        id: "shrutiijain123",
      },
      followed_you: {
        id: "shrutiijain123",
      },
      comment:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      commentCount: 284,
    },
    {
      id: 4,
      author: {
        id: "shubhijain1234",
        name: "Shubhi Jain",
      },
      followed_you: {
        id: "shrutiijain1234",
      },
      date: "Mar 14",
      replying_to: {
        id: "shrutiijain1234",
      },
      comment:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      commentCount: 924,
    },
  ];
  let notiContainer = document.getElementById("noti-container");
  notiContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap:30px;
      `;
  data.forEach((noti) => {
    let container = document.createElement("div");
  
    let authorContainer = document.createElement("div");
    let authorContainer1 = document.createElement("div");
    let authorContainer3 = document.createElement("div");
    let authorContainer4 = document.createElement("div");
    let authorContainer2 = document.createElement("div");
    let authorContainer5 = document.createElement("div");
    authorContainer.style.cssText = `
          display: flex;
          flex-direction:row;
          align-items:center;
          background-color:#282828;
      `;
    //author details
    // avatar
    let avatarSVG =
      '<svg width="30" height="36" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M54 40.8541C51 36.5821 46.677 33.3452 41.58 31.4312C45.678 28.1312 48.459 23.3759 48.459 17.7059C48.459 13.0889 46.857 9 44.001 6H54V40.8541ZM7.26004 54C9.73804 42 19.257 36 30.612 36C41.967 36 51.483 42 53.961 54H7.26004ZM6 40.8541V6H17.223C14.364 9 12.612 13.0889 12.612 17.7059C12.612 23.3759 14.934 28.278 19.032 31.578C13.935 33.492 9 36.5821 6 40.8541ZM30.612 5.41187C37.227 5.41187 42.612 10.7939 42.612 17.4119C42.612 24.0269 37.227 29.4119 30.612 29.4119C23.994 29.4119 18.612 24.0269 18.612 17.4119C18.612 10.7939 23.994 5.41187 30.612 5.41187ZM0 60H60V0H0V60Z" fill="white" /></svg>';
    let avatar = document.createElement("div");
    avatar.innerHTML = avatarSVG;
    avatar.style.cssText = `
          display: flex;
          flex-direction:row;
          gap:4px;
  `;
  
    // author
    let authorName = document.createElement("p");
    authorName.innerText = `${noti.author.name.replace(".", " ")}`;
    authorName.style.cssText = `
          display:inline;
          font-size:14px;
          color:white;
          font-weight:bold;
      `;
    // authorid
    let authorId = document.createElement("p");
    authorId.innerText = ` @${noti.author.id} `;
    authorId.style.cssText = `
          display: inline;
          font-size:14px;
          color:grey;
      `;
    // date
    let date = document.createElement("p");
    date.innerText = ` ${noti.date}`;
    date.style.cssText = `
          display: inline;
          font-size:14px;
          color:grey;
          justify-content:flex-end;
        
      `;
    authorContainer1.appendChild(authorName);
    authorContainer1.appendChild(authorId);
    authorContainer1.appendChild(date);
    authorContainer1.style.cssText = `
          flex-direction:row;
          gap:8px;
         
      `;
    //replying any individual
    //reply
    let replying_to = document.createElement("p");
    replying_to.innerText = `Replying to @${noti.replying_to.id}`;
    replying_to.style.cssText = `
          gap:4px;
          font-size:14px;
          color:grey;
      `;
  
    authorContainer3.appendChild(replying_to);
    authorContainer3.style.cssText = `
          font-size:14px;
          color:grey;
      `;
    authorContainer2.appendChild(authorContainer1);
    authorContainer2.appendChild(replying_to);
  
    authorContainer4.appendChild(avatar);
    authorContainer4.appendChild(authorContainer2);
    authorContainer4.style.cssText = `
          display: flex;
          flex-direction:row;
          gap:12px;
          `;
    // comment description
    let comment = document.createElement("p");
    comment.innerText = noti.comment;
    authorContainer5.appendChild(comment);
    authorContainer5.appendChild(authorContainer3);
    authorContainer5.style.css = `
           display: flex;
           flex-direction:row;
           align-items: center;
                          `;
    container.appendChild(authorContainer4);
    container.appendChild(authorContainer5);
    container.style.cssText = `
          background-color: #282828;
          color: white;
          padding: 20px;
          border-radius:14px;
          flex-direction:column;
          display:flex;
          flex-wrap:wrap; 
          gap:12px;     
      
      `;
    notiContainer.appendChild(container);
  
    //FOLLOWED
    //author details
    // avatar
    let avatar2SVG =
      '<svg width="30" height="36" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M54 40.8541C51 36.5821 46.677 33.3452 41.58 31.4312C45.678 28.1312 48.459 23.3759 48.459 17.7059C48.459 13.0889 46.857 9 44.001 6H54V40.8541ZM7.26004 54C9.73804 42 19.257 36 30.612 36C41.967 36 51.483 42 53.961 54H7.26004ZM6 40.8541V6H17.223C14.364 9 12.612 13.0889 12.612 17.7059C12.612 23.3759 14.934 28.278 19.032 31.578C13.935 33.492 9 36.5821 6 40.8541ZM30.612 5.41187C37.227 5.41187 42.612 10.7939 42.612 17.4119C42.612 24.0269 37.227 29.4119 30.612 29.4119C23.994 29.4119 18.612 24.0269 18.612 17.4119C18.612 10.7939 23.994 5.41187 30.612 5.41187ZM0 60H60V0H0V60Z" fill="white" /></svg>';
    let avatar2 = document.createElement("div");
    avatar2.innerHTML = avatar2SVG;
    avatar2.style.cssText = `
          display: flex;
          flex-direction:row;
          gap:4px;
  `;
    // followed_by
    let authorContainer_F_1 = document.createElement("div");
    //  let authorContainer_F_2 = document.createElement("div");
    let followed_you = document.createElement("p");
    followed_you.innerText = ` @${noti.followed_you.id} Followed You`;
    followed_you.style.cssText = `
          gap:4px;
          font-size:14px;
          color:grey;
        
      `;
  
    authorContainer_F_1.appendChild(avatar2);
    authorContainer_F_1.appendChild(followed_you);
    authorContainer_F_1.style.cssText = `
          display: flex;
          flex-direction:row;
          gap:12px;
          `;
    let container2 = document.createElement("div");
    container2.appendChild(authorContainer_F_1);
    //container2.appendChild(authorContainer_F_2);
    container2.style.cssText = `
       background-color: #282828;
       color: white;
       padding: 20px;
       border-radius:14px;
       flex-direction:column;
       display:flex;
       flex-wrap:wrap; 
       gap:12px;     
      
      
      `;
    notiContainer.appendChild(container2);
  });