// todo: replace with fetch and get data from api
// mock data
var data = [{
    id: 1,
    title: "New Internships Announcement",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    author: {
        id: 11,
        name: "Shubhi Jain",
    },
    topic: "Interships",
    commentCount: 24
},
{
    id: 2,
    title: "Academics Application For 2024-2025",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    author: {
        id: 11,
        name: "Shubhi Jain",
    },
    topic: "Academics",
    commentCount: 256
}, {
    id: 3,
    title: "Academics Application For 2024-2025",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    author: {
        id: 11,
        name: "Shubhi Jain",
    },
    topic: "Academics",
    commentCount: 188
}, {
    id: 4,
    title: "Academics Application For 2024-2025",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    author: {
        id: 11,
        name: "Shubhi Jain",
    },
    topic: "Academics",
    commentCount: 57
}];

let postContainer = document.getElementById("post-container");
postContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 30px;
    `


data.forEach((post) => {
    let container = document.createElement("div");

    let authorContainer = document.createElement("div");
    let authorContainer1 = document.createElement("div");
    authorContainer.style.cssText = `
        display: flex;
        flex-direction:row;
        gap: 8px; 
        align-items:center;
    `
    // avatar
    let avatarSVG = '<svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.0151 5.75C11.2955 5.75 10.592 5.96077 9.9937 6.35566C9.39538 6.75054 8.92904 7.31181 8.65366 7.96848C8.37829 8.62515 8.30623 9.34774 8.44662 10.0449C8.58701 10.742 8.93353 11.3823 9.44236 11.8849C9.95119 12.3875 10.5995 12.7298 11.3053 12.8684C12.011 13.0071 12.7426 12.9359 13.4074 12.6639C14.0722 12.3919 14.6404 11.9313 15.0402 11.3403C15.44 10.7493 15.6534 10.0545 15.6534 9.34375C15.6534 8.39063 15.2701 7.47654 14.5878 6.80258C13.9054 6.12863 12.98 5.75 12.0151 5.75Z" fill="white"/><path d="M12.015 1.4375C10.0001 1.4375 8.03052 2.02766 6.35521 3.13334C4.67991 4.23902 3.37417 5.81057 2.60311 7.64925C1.83205 9.48793 1.63031 11.5112 2.02339 13.4631C2.41647 15.415 3.38672 17.208 4.81145 18.6153C6.23618 20.0225 8.0514 20.9809 10.0276 21.3692C12.0037 21.7574 14.0521 21.5581 15.9135 20.7965C17.775 20.0349 19.3661 18.7452 20.4855 17.0904C21.6049 15.4357 22.2024 13.4902 22.2024 11.5C22.1993 8.83218 21.1251 6.27449 19.2152 4.38806C17.3054 2.50162 14.7159 1.44051 12.015 1.4375ZM17.8309 17.9154C17.8164 16.9726 17.4275 16.0731 16.748 15.4109C16.0684 14.7486 15.1526 14.3766 14.198 14.375H9.832C8.87737 14.3766 7.9616 14.7486 7.28205 15.4109C6.6025 16.0731 6.21358 16.9726 6.19911 17.9154C4.87953 16.7516 3.94896 15.2193 3.53063 13.5215C3.1123 11.8236 3.22593 10.0403 3.85648 8.40769C4.48704 6.77506 5.60477 5.37012 7.06167 4.37889C8.51858 3.38766 10.2459 2.85691 12.015 2.85691C13.7841 2.85691 15.5114 3.38766 16.9683 4.37889C18.4253 5.37012 19.543 6.77506 20.1735 8.40769C20.8041 10.0403 20.9177 11.8236 20.4994 13.5215C20.0811 15.2193 19.1505 16.7516 17.8309 17.9154Z" fill="white"/></svg>'
    let avatar = document.createElement("div");
    avatar.innerHTML = avatarSVG;

    // topic
    let topic = document.createElement("h4");
    topic.innerText = post.topic;
    // author
    let authorName = document.createElement("p");
    authorName.innerText = `Posted By ${post.author.name}`;
    authorName.style.cssText = `
        font-size:10px;
    `
    authorContainer1.appendChild(topic)
    authorContainer1.appendChild(authorName);
    authorContainer1.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 4px;
    `
    //title
    let title = document.createElement("h2");
    title.innerText = post.title;

    // author container
    authorContainer.appendChild(avatar);
    authorContainer.appendChild(authorContainer1);

    // discription
    let description = document.createElement("p");
    description.innerText = post.description;
    //comment_svg
    let commentSVG = '<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.75791 20.6926C6.88638 20.6712 7.01833 20.6896 7.13607 20.7453C8.48852 21.3849 9.97007 21.7211 11.5006 21.7211C17.1459 21.7211 21.7223 17.1447 21.7223 11.4994C21.7223 5.85412 17.1459 1.27771 11.5006 1.27771C5.8553 1.27771 1.27889 5.85412 1.27889 11.4994C1.27889 13.6803 1.96284 15.7566 3.21405 17.4854C3.34893 17.6718 3.37319 17.9163 3.27757 18.1255L1.72074 21.5322L6.75791 20.6926ZM0.745066 22.9901C0.240099 23.0743 -0.153802 22.56 0.0589826 22.0944L1.96366 17.9266C0.692978 16.045 0.00118209 13.8236 0.00118209 11.4994C0.00118209 5.14846 5.14964 0 11.5006 0C17.8515 0 23 5.14846 23 11.4994C23 17.8504 17.8515 22.9988 11.5006 22.9988C9.84918 22.9988 8.24608 22.6501 6.77374 21.9853L0.745066 22.9901Z" fill="white"/></svg>'
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
        gap: 8px;
`
    commentContainer.appendChild(comment);
    commentContainer.appendChild(commentCount);

    //share_svg
    let shareSVG = '<svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11.6666 4.58332L10.365 5.88499L8.90746 4.42749V14.6667H7.09246V4.42749L5.63496 5.88499L4.33329 4.58332L7.99996 0.916656L11.6666 4.58332ZM15.3333 9.16666V19.25C15.3333 20.2583 14.5083 21.0833 13.5 21.0833H2.49996C1.48246 21.0833 0.666626 20.2583 0.666626 19.25V9.16666C0.666626 8.14916 1.48246 7.33332 2.49996 7.33332H5.24996V9.16666H2.49996V19.25H13.5V9.16666H10.75V7.33332H13.5C14.5083 7.33332 15.3333 8.14916 15.3333 9.16666Z" fill="white"/></svg>'
    let share = document.createElement("div");
    share.innerHTML = shareSVG;


    //upload container
    let uc = document.createElement("div")



    if (pageName === "Home") {   
        uc.style.cssText = `
        display: flex;
        flex-direction:row;
        justify-content:space-between;
    `    
        uc.appendChild(commentContainer);
        uc.appendChild(share);
    }
    else {
        uc.appendChild(commentContainer);
        uc.style.cssText = `
        display: flex;
        flex-direction:row;
       justify-content:flex-end;
`
    }

    container.appendChild(authorContainer);
    container.appendChild(title);
    container.appendChild(description);
    container.appendChild(uc);

    container.style.cssText = `
        background-color: #282828;
        color: white;
        padding: 20px;
        border-radius:14px;
        gap:16px;
        flex-direction:column;
        display:flex;
        flex-wrap:wrap;
    
    `
    postContainer.appendChild(container)

})

