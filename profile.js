// Mock data
var data = [
    {
      id: 1,
      title: "New Internships Announcement",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      author: {
        id: 11,
        name: "Shubhi Jain",
      },
      date: "Mar 8",
      replying_to: {
        id: "shrutiijain1",
      },
      followed_you: {
        id: "shrutiijain1",
      },
      topic: "Interships",
      comment:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      commentCount: 24,
      viewCount: 25,
      bio: "Sophomore at CHRIST University, Bangalore Yeshwanthpur Campus",
    },
  ];
  
  // Get the profile container element
  let profilecontainerM = document.getElementById("profile_container");
  
  // Iterate through the data
  data.forEach((prof) => {
    // Create container for profile
    let container = document.createElement("div");
    container.style.cssText = `
      background-color: #282828;
      color: white;
      padding: 20px;
      border-radius: 14px;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      gap: 12px;
    `;
  
    // Create containers for profile details
    let profilecontainer1 = document.createElement("div");
    let profilecontainer2 = document.createElement("div");
  
    // Author details
    // Avatar
    let avatarSVG = `<svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><rect width="160" height="160" fill="url(#pattern0)"/><defs>
      <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlink:href="#image0_318_14" transform="scale(0.00195312)"/>
      </pattern>
    </svg>`;
  
    let avatar = document.createElement("div");
    avatar.innerHTML = avatarSVG;
  
    // Name
    let nameContainer = document.createElement("div");
    nameContainer.className = "name-and-button-container"; // Add class for styling
    nameContainer.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between; /* Adjusted for alignment */
    `;
  
    let name = document.createElement("h3");
    name.innerText = prof.author.name;
  
    // Create Edit Profile button
    const button = document.createElement("button");
    button.className = "edit-profile-button";
    button.innerText = "Edit Profile";
  
    // Append name and button to the name container
    nameContainer.appendChild(name);
    nameContainer.appendChild(button);
  
    // Bio
    let bio = document.createElement("p");
    bio.innerText = prof.bio;
    bio.style.cssText = `
      font-size: 14px;
      padding: 20px;
    `;
  
    // Append elements to profile containers
    profilecontainer1.appendChild(nameContainer); // Append name container instead of just name
    profilecontainer2.appendChild(avatar);
    profilecontainer2.appendChild(bio);
  
    // Append profile containers to main container
    container.appendChild(profilecontainer2);
    container.appendChild(profilecontainer1);
  
    // Append main container to profile container in HTML
    profilecontainerM.appendChild(container);
  });
  